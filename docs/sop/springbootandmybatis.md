---
title: Spring Boot整合Mybatis中易错点
tags:
  - Mybatis
  - Spring Boot
date: 2023-06-02 09:55:53
categories: 笔记
---



## 时间格式

前端，后端，数据库中的数据格式有太多，排列组合起来就更多了，目前使用较多的时间格式是这样的。

- 前端使用yyyy-MM-dd HH:mm:ss格式传入。

- 后端接收的时候用实体类接收，其中有一个属性为LocalDateTime，必须设置如下注解才能解析：

```java
 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
 private LocalDateTime personBirth;
```

- 不然会报如下错误：

```java
Failed to deserialize java.time.LocalDateTime: (java.time.format.DateTimeParseException) Text '1900-08-12 21:12:21' could not be parsed at index 10
```

- MySQL数据库中date只能保留年月日，datetime和timestamp可以展示到时分秒。
- `2023-07-05`
- `2023-07-05 00:00:00`



## SQL

`${}`本质是字符串拼接，相当于单引号，会有SQL注入问题
`#{}`占位符赋值

如果需要传参有数据时，按数据查找，传参为空时查找所有数据，只需添加`<where>`以及`<if>`标签，where标签在if标签判断为空时会自动消失退去。例子如下：

```xml
 <select id="findDog" parameterType="String" resultType="com.example.demo.pojo.Dog">
        select * from t_dog
        <where>
            <if test = " name != null ">
            <bind name="dogName" value="'%' + name + '%'"/>
                 and d_name like #{dogName}
            </if>
     	</where>   
    </select>
```

如果只是使用原本的关键字`where`而不使用标签，在if标签为空时，SQL语句中还会出现where字段，此时会报SQL语法错误。

```java
### The error occurred while setting parameters
### SQL: select * from t_dog         where
### Cause: java.sql.SQLSyntaxErrorException: You have an error in your SQL syntax;
```

```xml
<bind name="dogName" value="'%' + name + '%'"/>
```

bind标签可以用于模糊查询。

新增时可以在Mapper接口层起别名，例如`info`，以便更好地引用。增删改的返回值都是受影响的行数。在修改实体类中字段后，记得修改xml文件中的映射字段，例如`info.guid`，通常这个文件不会报错，但是等到运行后再改就迟了。

```java
    Integer addDog(@Param("info") Dog dog);
```

```xml
 <insert id="addDog" parameterType="com.example.demo.pojo.Dog">
        insert into
            t_dog
        values(
               #{info.guid},
               #{info.dogName},
               #{info.dogAge}
               )
    </insert>
```



## 配置文件

Mapper.xml中select标签的id属性必须和Mapper接口中字段一致，可以通过安装插件点击若能跳转则无问题。

文件开头：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
```

定义命名空间，就是找到你的对应的Mapper层下面的指定的Mapper接口：

```xml
<mapper namespace="com.example.demo.mapper.DogMapper">
</mapper>
```



## 注解

@RequestMapping和@GetMapping的区别，@GetMapping用于将HTTP的GET请求映射到特定处理程序的方法注解。具体来说，@GetMapping是一个组合注解，是@RequestMapping(method = RequestMethod.GET)的缩写。

通过@RequstBody接JSON对象，字段名必须严格一致（有坑看我上一篇文章），一般是POST请求。

通过RequestParam(value = "dogName" , required = false ,defaultValue = "")接受散个字段，设置value后，使用GET请求可不带参数。

@Autowired 在控制器中记得写。

Column 'd_name' cannot be null 参数名写了就要对上，不然接受不到。在Postman中POST请求中，可以不写全接受类中的所有参数，匹配成功后默认为空。例如：

```json
{
    "dogName": "月亮",
    "dogAge": 13
}
```

接受类为：

```java
@Data
public class Dog {

    private String guid;

    private String dogName;

    private Integer dogAge;

}
```

接收后的对象属性是这样的：

```java
Dog(guid=null, dogName=月亮, dogAge=13)
Dog(guid=36a341f97fe441498b4d8712fdea28cb, dogName=月亮, dogAge=13)
Creating a new SqlSession
==>  Preparing: insert into t_dog values( ?, ?, ? )
==> Parameters: 36a341f97fe441498b4d8712fdea28cb(String), 月亮(String), 13(Integer)
<==    Updates: 1
```



之后我们可以通过设置guid，最后把整个对象新增到数据库中。



实体类类名和数据库中字段名要对上，一般是数据库中字段名用下划线分割，JavaBean中用驼峰，最后在Mybatis配置文件中开启驼峰转换。记得打开日志哦🤭！

```yam
server:
  port: 8081

spring:
  # 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: "jdbc:mysql://localhost:3306/mybatis?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai"
    username: root
    password: mysql1970s

mybatis:
  # 指定 mapper.xml 的位置
  mapper-locations: classpath:mapper/*.xml
  #扫描实体类的位置,在此处指明扫描实体类的包，在 mapper.xml 中就可以不写实体类的全路径名# type-aliases-package: net.biancheng.www.bean
  configuration:
    #默认关闭驼峰命名法，设置该属性！！！！！！！！！！！！
    map-underscore-to-camel-case: true
    #SQL级别日志
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

## POM文件

整合Spring Boot的Mybatis包和单独的不一样，记得区别。以下是我的DEMO的POM文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.1.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- SpringBootText注解依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <!-- Junit依赖 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <scope>test</scope>
        </dependency>

        <!--引入 mybatis-spring-boot-starter 的依赖-->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.2.0</version>
        </dependency>


        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.16.8</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.20</version>
        </dependency>


    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>


    </build>

</project>

```



