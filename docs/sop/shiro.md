---
title: Shiro权限管理
tags:
  - Java
date: 2022-01-15 12:16:45
categories: 笔记
---

# Shiro

## 权限管理概念

基本上涉及到用户参与的系统都要进行权限管理，权限管理属于系统安全的范畴，权限管理实现`对用户访问系统的控制`，按照安全规则或者[安全策略](http://baike.baidu.com/view/160028.htm)控制用户可以访问而且只能访问自己被授权的资源。权限管理包括用户`身份认证`和`授权`两部分，简称`认证授权`。对于需要访问控制的资源用户首先经过身份认证，认证通过后用户具有该资源的访问权限方可访问。

## Shiro Core

###  Subject

`Subject即主体`，外部应用与subject进行交互，subject记录了当前操作用户，将用户的概念理解为当前操作的主体，可能是一个通过浏览器请求的用户，也可能是一个运行的程序。	Subject在shiro中是一个接口，接口中定义了很多认证授相关的方法，外部程序通过subject进行认证授，而subject是通过SecurityManager安全管理器进行认证授权

###  SecurityManager

`SecurityManager即安全管理器`，对全部的subject进行安全管理，它是shiro的核心，负责对所有的subject进行安全管理。通过SecurityManager可以完成subject的认证、授权等，实质上SecurityManager是通过Authenticator进行认证，通过Authorizer进行授权，通过SessionManager进行会话管理等。

`SecurityManager是一个接口，继承了Authenticator, Authorizer, SessionManager这三个接口。`

###  Authenticator

`Authenticator即认证器`，对用户身份进行认证，Authenticator是一个接口，shiro提供ModularRealmAuthenticator实现类，通过ModularRealmAuthenticator基本上可以满足大多数需求，也可以自定义认证器。

###  Authorizer

`Authorizer即授权器`，用户通过认证器认证通过，在访问功能时需要通过授权器判断用户是否有此功能的操作权限。

###   Realm

`Realm即领域`，相当于datasource数据源，securityManager进行安全认证需要通过Realm获取用户权限数据，比如：如果用户身份数据在数据库那么realm就需要从数据库获取用户身份信息。

> 注意：不要把realm理解成只是从数据源取数据，在realm中还有认证授权校验的相关的代码。

### SessionManager

`sessionManager即会话管理`，shiro框架定义了一套会话管理，它不依赖web容器的session，所以shiro可以使用在非web应用上，也可以将分布式应用的会话集中在一点管理，此特性可使它实现单点登录。

### SessionDAO

`SessionDAO即会话dao`，是对session会话操作的一套接口，比如要将session存储到数据库，可以通过jdbc将会话存储到数据库。

### CacheManager

`CacheManager即缓存管理`，将用户权限数据存储在缓存，这样可以提高性能。

### Cryptography

​	`Cryptography即密码管理`，shiro提供了一套加密/解密的组件，方便开发。比如提供常用的散列、加/解密等功能。

## 认证

### 快速开始

#### 1. 创建项目并引入依赖

```xml
<dependency>
  <groupId>org.apache.shiro</groupId>
  <artifactId>shiro-core</artifactId>
  <version>1.5.3</version>
</dependency>
```

#### 2.引入shiro配置文件并配置

```ini
[users]
zwy=123
fhy=456
```

#### 3.认证代码

```java
public class TestAuthenticator {
    public static void main(String[] args) {
        //创建securityManager
        DefaultSecurityManager defaultSecurityManager = new DefaultSecurityManager();
        defaultSecurityManager.setRealm(new IniRealm("classpath:shiro.ini"));
        //将安装工具类中设置默认安全管理器
        SecurityUtils.setSecurityManager(defaultSecurityManager);
        //获取主体对象
        Subject subject = SecurityUtils.getSubject();
        //创建token令牌
        UsernamePasswordToken token = new UsernamePasswordToken("zwy", "123");
        try {
            subject.login(token);//用户登录
            System.out.println("登录成功！");
        } catch (UnknownAccountException e) {
            e.printStackTrace();
            System.out.println("用户名错误!!");
        }catch (IncorrectCredentialsException e){
            e.printStackTrace();
            System.out.println("密码错误!!!");
        }
    }
}
```

分析源码可知：

1. 最终执行用户名比较`SimpleAccountRealm`，`doGetAuthenticationinfo`在这个方法中完成用户名校验。
2. 最终密码校验是在`AuthenticatingRealm`中`assertCredentialIsMatch`。

总结，`AuthenticatingRealm`认证realm，`doGetAuthenticationInfo`，`AuthorizingRealm`授权realm，`doGetAuthorizzationInfo`。

### MD5和Salt

`MD5`算法，一般用于加密或者签名（校验和），特点是：MD5算法不可逆，内容相同无论执行多少次MD5生成的结果始终是一致的。可以用来校验文件是否完整（验证游戏完整性）。网站上有的解密算法，都是通过穷举法来的，比如一些简单的密码，“123”，“123456”等等。所以密码最好加上自己的一些信息。**生成的结果： 不管源文件有多大多小，始终是一个16进制32位长度字符串。**

`Salt`盐，给用户密码加点盐，就是在原先的明文密码后加一串随机字符串，更咸了，密码也就更复杂了一些。所以在数据库里要加盐，并在数据库中保存下来。虽然不能确保系统的百分之百安全，但是能更加相对安全，因为不知道盐加在那个位置，生成了几次。

1. 用户注册时，通过服务层加盐，确定业务规则，并将盐保存在数据库中。
2. 用户登录时，首先根据用户名查询是否存在，然后比较密码，此时也需要加保存在数据库中的盐，注意业务规则要一致，比如注册时加在后面，登陆认证时也要加在后面。

所以要在注入realm之后根据需要是否使用MD5加密，是否加盐，散列多少次都需要明确指出。

```java
 		//创建安全管理器
        DefaultSecurityManager defaultSecurityManager = new DefaultSecurityManager();

        //注入realm
        CustomerMd5Realm realm = new CustomerMd5Realm();

        //设置realm使用hash凭证匹配器
        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
        //使用算法
        credentialsMatcher.setHashAlgorithmName("md5");
        //散列次数
        credentialsMatcher.setHashIterations(1024);
        realm.setCredentialsMatcher(credentialsMatcher);
        defaultSecurityManager.setRealm(realm);

        //将安全管理器注入安全工具
        SecurityUtils.setSecurityManager(defaultSecurityManager);

        //通过安全管理器获取subject
        Subject subject = SecurityUtils.getSubject();
```

指出加盐。

```java
protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        String principal = (String) token.getPrincipal();
        if("zwy".equals(principal)){
            String password = "e4f9bf3e0c58f045e62c23c533fcf633";
            String salt = "X0*7ps";
            return new SimpleAuthenticationInfo(principal,password, ByteSource.Util.bytes(salt),this.getName());
        }
        return null;
    }
```

## 授权

授权，即访问控制，控制谁能访问哪些资源。主体进行身份认证后需要分配权限方可访问系统的资源，对于某些资源没有权限是无法访问的。

###  关键对象

**授权可简单理解为Who对What进行How操作：**

`Who，即主体（Subject）`，主体需要访问系统中的资源。

`What，即资源（Resource)`，如系统菜单、页面、按钮、类方法、系统商品信息等。资源包括`资源类型`和`资源实例`，比如`商品信息为资源类型`，类型为t01的商品为`资源实例`，编号为001的商品信息也属于资源实例。

`How，权限/许可（Permission)`，规定了主体对资源的操作许可，权限离开资源没有意义，如用户查询权限、用户添加权限、某个类方法的调用权限、编号为001用户的修改权限等，通过权限可知主体对哪些资源都有哪些操作许可。

###  授权流程

![授权流程](/img/pic030.jpg)

###  授权方式

- **基于角色的访问控制**

  - RBAC基于角色的访问控制（Role-Based Access Control）是以角色为中心进行访问控制

    ```java
    if(subject.hasRole("admin")){
       //操作什么资源
    }
    ```

- **基于资源的访问控制**

  - RBAC基于资源的访问控制（Resource-Based Access Control）是以资源为中心进行访问控制

    ```java
    if(subject.isPermission("user:update:01")){ //资源实例
      //对01用户进行修改
    }
    if(subject.isPermission("user:update:*")){  //资源类型
      //对01用户进行修改
    }
    ```

    

###  权限字符串

​		权限字符串的规则是：**资源标识符：操作：资源实例标识符**，意思是对哪个资源的哪个实例具有什么操作，“:”是资源/操作/实例的分割符，权限字符串也可以使用*通配符。

例子：

- 用户创建权限：user:create，或user:create:*
- 用户修改实例001的权限：user:update:001
- 用户实例001的所有权限：user:*：001

### 编程实现方式

- 编程式

  ```java
  Subject subject = SecurityUtils.getSubject();
  if (subject.hasRole("admin")){
      //有权限
  } else {
      //无权限
  }
  ```

- 注解式

  ```java
  @RequiresRoles("admin")
  public void hello(){
      //有权限
  }
  ```

- 标签式

  ```jsp
  JSP标签：在JSP页面通过相应的标签完成
  <shiro:hasRole name="admin">
      <!- 有权限->
  </shiro:hasRole>
  注意！Thymeleaf中使用shiro需要额外集成
  ```

### 开发授权

