---
title: Filter过滤器和Listener监听器
tags:
  - Java
  - JavaWeb
date: 2022-04-15 19:45:18
categories: 笔记
---

# Filter

## 简介

Filter也称之为过滤器，它是Servlet技术中最实用的技术，web开发人员通过Filter技术，对web服务器管理的所有web资源：例如Jsp, Servlet, 静态图片文件或静态 html 文件等进行拦截，从而实现一些特殊的功能。例如实现URL级别的权限访问控制、过滤敏感词汇、压缩响应信息等一些高级功能。

它主要用于对用户请求进行预处理，也可以对HttpServletResponse 进行后处理。使用Filter 的完整流程：Filter 对用户请求进行预处理，接着将请求交给Servlet 进行处理并生成响应，最后Filter 再对服务器响应进行后处理。

## 细节

### 注解配置

设置`dispatcherTypes`属性：

- REQUEST：默认值，浏览器直接请求资源
- FORWARD：转发访问资源
- INCLUDE：包含访问资源
- ERROR：错误跳转资源
- ASYNC：异步访问资源

### web.xml配置

```xml
<filter>
	<filter-name>demo1</filter-name>
    <filter-class>cn.filter.FilterDemo1</filter-class>
</filter>
<filter-mapping>
	<filter-name>demo1</filter-name>
    <!-- 拦截路径 -->
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 过滤器执行流程

### 过滤器生命周期方法

`init`方法，在服务器启动后，会创建Filter对象，然后调用init方法，只会执行一次，用于加载资源。

`doFilter`方法，每一次请求被拦截时，会执行，执行多次。

`destroy`方法，在服务器关闭后，Filter对象被销毁。如果服务器是正常关闭，则会执行destroy方法，只执行一次。

### 拦截方式

- 具体资源路径：/index.jsp 只有访问index.jsp资源时，过滤器才会被执行
- 拦截目录：/user/* 访问/user下的所有资源时，过滤器都会被执行
- 后缀名拦截：*.jsp 访问所有后缀名为jsp资源时，过滤器都会被执行

### 过滤器链

- 执行顺序
  1. 过滤器1
  2. 过滤器2
  3. 资源执行
  4. 过滤器2
  5. 过滤器1

- 过滤器的顺序
  1. 注解方式：根据过滤器的名称字符串大小确定，小的先执行。
  2. web.xml：`<filter-mapping>`谁定义在上面，谁先执行。

# Listener

## 简介

监听器用于监听web应用中某些对象、信息的创建、销毁、增加，修改，删除等动作的发生，然后作出相应的响应处理。当范围对象的状态发生变化的时候，服务器自动调用监听器对象中的方法。常用于统计在线人数和在线用户，系统加载时进行信息初始化，统计网站的访问量等等。

事件监听机制：

- 事件：一个事件
- 事件源：事件发生的地方
- 监听器：一个对象
- 注册监听：将事件，事件源，监听器绑定在一起，当事件源上发生某个事件后，执行监听器代码

## 实现

ServletContextListener：监听ServletContext对象的创建和销毁

- 方法：

  ```java
  void contextDestroyed(ServletContextEvent sce)
  //ServletContext对象被销毁之前会调用该方法
  ```

  ```java
  void contextInitialized(ServletContextEvent sce)
  //ServletContext对象创建后会调用该方法
  ```

- 步骤：
  1. 定义一个类，实现ServletContextListener接口
  2. 重写方法
  3. 配置web.xml`<listener>`或使用注解`@WebListener`
