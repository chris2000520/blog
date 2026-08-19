---
title: 一次并发报错引起的惨案：@Async 的那些坑
tags:
  - Java
  - Spring
  - 并发
  - 企业微信
date: 2026-08-20 00:00:00
categories: 笔记
---

# 一次并发报错引起的惨案：@Async 的那些坑

> 自己看的，随便写写。起因是企微"接口并发调用超过限制"的报错，最后定位到 @Async 头上。

## 一、报错长啥样

上周五的晚上，本来准备开开心心回家过周末，结果产品一句，企微用户标签同步失败了！需要紧急修复！我无奈着打开了电脑，凭借二十多年的手速打开了日志平台，日志里蹦出来一行：

```
调用C端接口操作企业微信员工信息时失败，响应参数：[response = {"errcode":45033,"errmsg":"api concurrent out of limit, hint: [1787140448197392287467726], from ip: 118.31.58.105, more info at https://open.work.weixin.qq.com/devtool/query?e=45033"}]
```

查看企微文档一看，才知道是并发问题。企微文档说的很明白：**同一个企业调用同一个接口**，它有并发数限制，部分接口就是 5。超了直接给你报错，同步失败。但是我记得我是做了分批处理的啊？为什么还是会并发？

## 二、咋排查的

### 先顺着调用链走

```
RefreshRegionUserTagsJob（定时任务）
  └→ refreshRegionUserTags()
       └→ for 循环，一个一个岗位同步，每批 1000 人
            └→ addUser(tagId, batch)   ← 坑在这
                 └→ 真正调企微 HTTP
```

乍一看 `refreshRegionUserTags` 就是个 for 循环，一个一个来，**串行的啊**，怎么会并发？

### 坑就在 @Async

`addUser` 是 **`@Async`**：

```java
@Async
public void addUser(Long tagId, List<Long> userIds) {
    qiYeWeChatServiceInner.addUser(model);
}
```

for 循环每调一次 `addUser`，**立刻返回**，活全丢线程池里了。1w+ 人、每批 1000，就是 10+ 次异步提交，线程池 core=8 一并发下去，**同时 8 个请求在打企微**，直接超限。如果是多个实例负载均衡，那并发数就更高了（目前只是在单个实例上运行，毕竟这个后门就我自己知道，后续还是要处理掉）。

**教训第一条：看到 for 循环别急着说"串行"，先确认里头的调用是不是异步的。** 这坑我踩了两次才爬出来。

### 集群有没有放大？—— 没有

开始还担心集群多实例会把并发乘以实例数，后来想明白了：

- 定时任务同一时刻只在一个实例上跑
- 打到的 app-account 也是某一个实例
- @Async 任务的线程池就在这个实例里

所以并发全挤在一个实例里，**跟集群有几台没关系**，单实例限流就够。差点为了个不存在的场景去上 Redis 分布式，虚惊一场。

## 三、怎么解决的：Semaphore

在真正调企微的地方，`addUser` 内部，加个信号量：

```java
private static final Semaphore QY_WECHAT_ADD_USER_SEMAPHORE = new Semaphore(5);

while (retryCount > 0) {
    try {
        QY_WECHAT_ADD_USER_SEMAPHORE.acquire();
        try {
            baseResult = restTemplate.postForObject(addTagUserUrl, model, ...);
        } finally {
            QY_WECHAT_ADD_USER_SEMAPHORE.release();
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        log.error("获取企微标签成员接口调用许可被中断", e);
        throw new BusinessException("...");
    }
    // 后面错误码处理、重试逻辑一概不动
}
```

理解方式很简单：**5 个车位的停车场**。

- `acquire()` = 找个车位，满了就排队等
- `release()` = 车开走了，放一辆进来
- **排队的车不会被赶走**，所以数据不会丢

当时差点用 `tryAcquire()`（非阻塞），那玩意是"没车位直接走人"——多出来的请求直接失败，对批量同步这种不能丢数据的场景是灾难。**阻塞式 acquire + finally release，排队也不丢，才是正解。**

## 三.5 如果哪天真上了多实例呢？（分布式限流）

单实例 Semaphore 好用，但前提是"并发都挤在一个 JVM 里"。万一哪天多个实例被负载均衡同时请求——比如定时任务改成多执行器、或者别的服务也在调企微——单实例 Semaphore 就露馅了：

```
实例 A：Semaphore(5) → 同时 5 个企微请求
实例 B：Semaphore(5) → 同时 5 个企微请求
实例 C：Semaphore(5) → 同时 5 个企微请求
        ↓
企微那边看到：15 个并发请求   ← 又超了
```

Semaphore 是 JVM 进程内的，每个实例各持一份许可、互不知情。企微按"同企业同接口"全局统计，**N 个实例就是 N×5**——限了个寂寞。

怎么办？把"几张许可证"从内存挪到所有实例都够得着的地方：**Redis**。

Redis 分布式信号量：一个 key 记当前占用数，acquire 用 Lua 脚本**原子**判断+自增，release 原子自减。所有实例抢同一个 key，全局并发就严格 ≤5 了，与实例数无关。

```lua
-- acquire：占用数 < 上限就 +1，返回 1；否则返回 0（并发已满）
local used = tonumber(redis.call('get', KEYS[1]) or '0')
if used < tonumber(ARGV[1]) then
    redis.call('incr', KEYS[1])
    redis.call('expire', KEYS[1], tonumber(ARGV[2]))
    return 1
end
return 0
```

```lua
-- release：占用数 -1
local used = tonumber(redis.call('get', KEYS[1]) or '0')
if used > 0 then
    redis.call('decr', KEYS[1])
end
return 1
```

Java 侧就是 `StringRedisTemplate` 执行这个脚本（或者给 `RedisUtil` 加个 execute 方法），调用前 acquire、调用后 finally release，用法跟单实例 Semaphore 一模一样。我司系统中有用[lock4j](https://github.com/baomidou/lock4j)分布式锁组件,支持编程式和注解式。

## 四、顺手对比：@Async vs CompletableFuture

这次的事绕不开 @Async，正好把这个也缕缕。

### @Async —— "发完就跑，结果？不重要"

```java
@Async
public void sendEmail(...) { ... }   // void，谁也不关心它回没回来
```

- Spring AOP 拦截，塞进线程池
- **同类内部 this.xxx() 调它不生效**（自调用绕过了代理，等于白标）
- 异常默认被吞，得配 AsyncUncaughtExceptionHandler 才知道挂了
- 适合：通知、日志、批量写——"扔出去就完事"

### CompletableFuture —— "异步算完还要结果，还能编排"

```java
CompletableFuture<String> f = CompletableFuture.supplyAsync(() -> {
    return qiYeWeChatServiceInner.addUser(model);
}, taskExecutor);

f.thenAccept(r -> log.info("结果：{}", r));     // 干完再干点别的
String r = f.get(5, TimeUnit.SECONDS);          // 或者阻塞等结果
CompletableFuture.allOf(a, b, c).join();        // 多个并行完再汇总
```

- 编程式，不用 AOP，**同类内部怎么调都行**
- 能拿结果、能回调、能并行编排
- 异常得自己管（exceptionally / handle / get 抛 ExecutionException）

### 总结

> **@Async 是"异步跑，结果无所谓"；CompletableFuture 是"异步算，结果我还要，还要串起来"。**

这次 `addUser` 是个不需要结果的外部写调用，用 @Async 本身没毛病——**毛病在用的人没意识到它背后线程池的并发能力**。异步是把双刃剑，爽的同时也把并发藏起来了。

顺带一提：如果当初想用 CompletableFuture 重写，可以在 for 循环里把 future 收集起来，一批搞完 `allOf().join()` 再下一批，也能压住并发。但那样要处理每个 future 的异常，还引入阻塞等待，**改动比重一个 Semaphore 大多了**。所以最后还是选了最小侵入方案。

## 五、教训

1. **@Async 是隐式并发源**：for 循环串行是假象，看一眼方法有没有 @Async、线程池多大。
2. **限流要打在真实调用点**：放在发 HTTP 那一层，别放入口，不然漏路径。
3. **单实例够用就别上分布式**：先确认并发跨不跨实例，别为本不存在的场景加复杂度。
4. **不能丢数据的批量任务，用阻塞 acquire**：排队好过 tryAcquire 直接扔。
5. **finally release 是铁律**：许可泄漏了，后面全变成"实际串行"，严重的直接卡死。

## 六、附录

- [企微错误码查询工具官方文档](https://developer.work.weixin.qq.com/devtool/query)
