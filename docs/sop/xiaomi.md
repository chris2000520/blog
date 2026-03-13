---
title: 小米实习一面
tags:
  - Java
  - MySQL
date: 2024-06-16 14:19:15
hide: true
categories: 笔记
---

# HashMap

## Hash特点

1. 从哈希值不可以反向推导
2. 输入数据变化，哈希后会得到不同的值
3. 哈希算法高效
4. 冲突概率要小
5. 输入空间值映射到哈希空间内，根据抽屉原理一定会存在冲突

## HashMap

扰动函数，目的是使分布更均匀。`HashMap`可以存储null的key和value，但null作为键只能有一个，null作为值可以有多个。

默认长度：16

当有冲突时，采用链表结构，当链表长度达到8时，链表结构将升级为红黑树。

### PUT原理

1. 获取哈希值
2. 扰动函数，更散列
3. 构造出node对象
4. 路由算法，`table.length-1 & node.hash`，00001111，01000010，2

### 哈希碰撞

Next链表指向新的node，如果链表过长，查找效率低。

### 扩容原理

## 构造方法

### 常量

|           属性           | 解释                                                         |
| :----------------------: | ------------------------------------------------------------ |
| DEFAULT_INITIAL_CAPACITY | 默认缺省数组大小，2的4次方，aka16                            |
|     MAXINUM_CAPACITY     | 最大长度，2的30次方                                          |
|   DEFAULT_LOAD_FACTOR    | 负载因子，0.75                                               |
|    TREEIFY_THRESHOLD     | 树化阈值参数，链表元素超过8后将链表可能升级成树，避免链化严重 |
|   UNTREEIFY_THRESHOLD    | 链化阈值6                                                    |
|   MIN_TREEIFY_CAPACITY   | 树化另一个参数，此时的容量必须不小于64                       |

### Node

### size

### modCount

### threshold

$$
\large threshold = capacity \times loadFactor
$$

### loadFactor

### tableSizeFor

返回一个2的次方大小容量，对于给定的容量，向上取结果，例如输入17，输出32。

## Put方法

hash函数：将高16位与低16位做异或运算

## Resize方法

为什么需要扩容？

如果元素很多的话，链化非常严重，每次查找时间接近$O(n)$。

**有两种情况会调用 resize 方法：**

1. 第一次调用 HashMap 的 put 方法时，会调用 resize 方法对 table 数组进行初始化，如果不传入指定值，默认大小为 16，`newCap = DEFAULT_INITAL_CAPACITY;//16`。
2. 扩容时会调用 resize，即 size > threshold 时，table 数组大小翻倍，`newCap = oldCap << 1`。

每次扩容之后容量都是**翻倍**。扩容后要将原数组中的所有元素找到在新数组中合适的位置。计算`newCap`table

表大小，计算`newThr`需要扩容的阈值。

### 数组赋值

旧数据移动到新HashMap中的位置，`newTab[e.hash & (newCap-1)]`。低位链表，高位链表：存放在扩容之后的数组的下标位置 + 扩容之前的数组的长度，让分布更加均匀。

##  Get方法

```java
e = getNode(hash(key), key)) == null ? null : e.value;
```



### getNode方法

- tab：引用当前HashMap的散列表
- first：桶位中的头元素
- n：table数组长度

第一种情况：定位出来的桶位元素就是要找的key，直接返回first

第二种情况：桶位后面升级为红黑树

第三种情况：桶位后面升级为链表

## Remove方法

先查找，后删除，有三种情况。

### removeNode方法

`matchValue`:

`movable`:

第一种情况：树节点，调用树节点移出操作。

第二种情况：node等于p，直接将node下一个元素放入桶位中。

第二种情况：链表，三个元素去除中间那一个，将当前元素p的下一个元素设置成node（要删除元素）的下一个元素。



# ArrayList

## 数组

连续内存，顺序存储，同一类型数据。

`ArrayList`的底层是数组队列，相当于动态数组。与Java中的数组相比，它的容量能动态增长。在添加大量元素前，应用程序可以使用`ensureCapacity`操作来增加 `ArrayList` 实例的容量。这可以减少递增式再分配的数量。

```java
// 默认容量是10
private static final int DEFAULT_CAPACITY = 10;
// 如果容量为0的时候，就返回这个数组
private static final Object[] EMPTY_ELEMENTDATA = {};
// 使用默认容量10时，返回这个数组
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
// 元素存放的数组
transient Object[] elementData;
// 元素的个数
private int size;
// 记录被修改的次数
protected transient int modCount = 0;
// 数组的最大值
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8

```

## LinkedList区别

# 秒杀系统

从整体上来说，秒杀主要解决两个问题，**一个是并发读，一个是并发写**，同时还有兜底防范。**稳，准，快**。

## 高可用

- 上线之前，做好压力测试
- 服务降级，遇到紧急情况可以快速处理

## 一致性

防止超卖，要在秒杀活动建立之前就把库存同步到redis中。

1. 判断库存名额是否充足
2. 减少库存名额，扣减成功就是抢到

我们要保证两种操作的原子性。

防止少买，我们扣减库存后，发送消息队列，要有重试策略，如果发送消息失败，重试，超过次数后，则持久化磁盘，由补偿服务来进行扫描，后续业务。类似于MySQL日志持久化。

## 高性能

- 请求限流，用户ID限流和用户IP限流。

- Redis+热数据+消息队列

- 页面静态化
- CDN加速，就近获取资源
- 集群负载均衡
- 秒杀按钮置灰，限流，防抖

# SpringBoot自动装配

1. 什么是SpringBoot自动装配？
2. SpringBoot是如何实现自动装配的？如何实现按需加载？
3. 如何实现一个 Starter？

使用Spring  MVC的时候，一定有被 XML 配置统治的恐惧。即使Spring后面引入了基于注解的配置，我们在开启某些Spring特性或者引入第三方依赖的时候，还是需要用XML或Java进行显式配置。

1. **通过注解或者一些简单的配置就能在 Spring Boot 的帮助下实现某块功能。**
2. 

# 数据库日志

MySQL中InnoDB引擎自带日志，undo redo。

1. 数据定义语言DDL 

 数据定义语言DDL用来创建数据库中的各种对象-----表、视图、索引、同义词、聚簇等如： 

 CREATE TABLE/VIEW/INDEX/SYN/CLUSTER 

 DDL操作是隐性提交的！不能rollback 

 2 .数据操纵语言DML 

 数据操纵语言DML主要有三种形式： 

  1) 插入：INSERT 

  2) 更新：UPDATE 

  3) 删除：DELETE 


  3. 数据查询语言DQL 

 数据查询语言DQL基本结构是由SELECT子句，FROM子句，WHERE子句组成的查询块： 

 SELECT <字段名表> 

 FROM <表或视图名> 

 WHERE <查询条件> 


  4. 数据控制语言DCL 

 数据控制语言DCL用来授予或回收访问数据库的某种特权，并控制数据库操纵事务发生的时间及效果，对数据库实行监视等。如： 

  1) GRANT：授权。 


  2) ROLLBACK [WORK] TO [SAVEPOINT]：回退到某一点。 

 回滚---ROLLBACK 

 回滚命令使数据库状态回到上次最后提交的状态。其格式为： 

 SQL>ROLLBACK 


## Undo Log

## Redo Log

## Bin Log

# MySQL调优

## 索引

- 二叉树 不平衡
- 红黑树 高度太高
- 哈希表 有哈希冲突，仅能满足`=`，`IN`，不支持`范围查询`
- B树 存储同样元素，高度小，效率高


`存储引擎是myisam, 在data目录下会看到3类文件`：**.frm、.myi、.myd**，索引和数据是分开存储的，是`非聚集索引`。
（1）*.frm–表定义，是描述表结构的文件。

（2）*.MYD–"D"数据信息文件，是表的数据文件。

（3）*.MYI–"I"索引信息文件，是表数据文件中任何索引的数据树

`存储引擎是InnoDB`, `在data目录下会看到2类文件`：**.frm、.ibd**，索引和数据是存储在一个文件，是`聚集索引`。
（1）*.frm–表结构的文件。

（2）*.ibd–表数据和索引的文件。该表的索引(B+树)的每个非叶子节点存储索引，叶子节点存储索引和索引对应的数据

InnoDB支持==事务和锁==，在工作中经常用到。

为什么建议InnoDB表必须建主键，并且推荐使用`整形`的`自增`主键？比较速度快，存储空间小。

## 联合索引

最左匹配原则，效率高，后面索引在索引树中没有任何顺序。

## 禁止超过三张表多表关联

分库分表，每张表上数据非常多。数据库扩容相对于Java扩容要难很多。

## 内部组件结构

### 查询缓存

系统配置表，字典表这些几乎不怎么变化的数据表适用于查询缓存，现在基本上在redis中使用，在8.0中已被弃用。

### 执行原理

#### 连接器

#### 词法分析器

#### 优化器

#### 执行器

#### InnoDB存储引擎

####  Buffer Pool缓冲池

检查磁盘中有无数据，加载到池中来。

# Redis分布式锁



# 数据库锁

# 幻读

# JVM

# 操作系统内存屏障

# 链表重排
