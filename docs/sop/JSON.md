---
title: 关于前后端传值中的JSON转化
tags:
  - JSON
  - Spring Boot
  - 前后端
date: 2023-06-01 22:33:22
categories: 笔记
---



# 前因

在做Spring Boot整合Mybatis的一个小DEMO的时候，所有的分层，数据库配置都做好了，结果用Postman测试的新增的时候，传给后端一个JSON对象，后端拿不到值，离谱的是只能拿的到`guid`的值，其他两个却为`null`。请求体是这样写的：

```json
{
    "guid": "13",
    "dName": "小明",
    "dAge": 17
}
```

接受的对象是这样定义的：

```java
@Data
public class Dog {

    private String guid;

    private String dName;

    private Integer dAge;

}
```

在控制层我特意打印出接受的对象供Debug用，结果是这样的：

```java
Dog(guid=13, dName=null, dAge=null)
```

我在此处调试了许久，一直到饭点，我才恋恋不舍地离开，路上也百思不得其解。直到晚上我看到一篇博客后恍然大悟，找到了根本原因。

# 后果

> 在传输过程中dName的N，也从大写变为了小写，在进行测试时，发现所有格式为aBc的，经过JSON传值，都变为了abc，但是aaBc,经过传值后，依然是aaBc，可见，只有形如aBc这样，大写字母前只有一个小写字母的，才会出现JSON强行将大写转为小写的情况。

前人总结的经验教训对于程序员来说参考价值极大，若后人哀之而不鉴之，亦使后人而复哀后人也。

所以，**不要**这样定义类的属性尽量使用驼峰时前面至少有2个小写字母，比如：`dogName`，`dogAge`，或者在实体类的get方法上加上`@JsonProperty("dName")`。

---

全世界的程序员，联合起来！
