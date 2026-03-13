---
title: MySQL中MD5加密
tags:
  - MySQL
date: 2021-05-13 13:15:15
categories: 笔记
---

# MD5

MySQL的SQL语句中，除了标准的SQL语句之外，另外增加了很多功能的内容，比如一些全局变量、函数等。在JAVA EE的学习中，需要创建用户表并进行加密，这里简答介绍一个在MySQL中用来进行md5加密的函数，函数名为`md5`。

# 使用

一般来说有两种方法，第一个就是用户表中已经存在了一个用户的用户名和密码，我们现在想把密码加密，第二种就是我们需要插入一个用户信息并且想在插入时就加密密码。来看例子：

## 1.更新

```mysql
update admin set password=md5('123456') where username='zhaowuya';
```

这样就把admin表中的用户名为zhoawuya，原密码为123456的用户的密码成功加密了。

结果为：

| username | password                         |
| -------- | -------------------------------- |
| zhaowuya | e10adc3949ba59abbe56e057f20f883e |



## 2.插入

```mysql
insert into admin(username,password) values('tutu',md5('12'));
```

这样我们就成功插入了用户名为tutu的，原密码为12的用户，并且加密了密码，在数据库里变成了一大串的数字字母组合。

结果为：

| username | password                         |
| -------- | -------------------------------- |
| tutu     | c20ad4d76fe97759aa27a0c99bff6710 |

{% note info %}

这样存放在数据中的密码信息是保密存放的，但是通过md5加密后的数据是不能逆向使用的，也就是说如果想查询用户的密码信息，则需要通过数据查询匹配来实现。

{% endnote %}

# 检查

如需要进行用户身份认证，则需要执行下面查询语句：

```mysql
select * from admin where username='zhaowuya' and passwd=md5('123456');
```

结果为：

| username | password                         |
| -------- | -------------------------------- |
| admin    | e10adc3949ba59abbe56e057f20f883e |

<a class="btn" href="https://www.bilibili.com/video/BV1uJ411k7wy" title="JavaWeb视频">点击前往B站</a>