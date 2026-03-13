---
title: Spring Security笔记
tags:
  - Java
  - Spring
  - JavaWeb
date: 2022-04-16 10:53:06
categories: 笔记
---

# 简介

`Spring`是非常流行和成功的Java应用开发框架，Spring Security正是Spring家族中的成员。Spring Security基于Spring框架，提供了一套Web应用安全性的完整解决方案。

`Spring Security`是Spring家族中的一个安全管理框架，实际上，在`Spring Boot`出现之前，Spring Security就已经发展了多年了，但是使用的并不多，安全管理这个领域，一直是`Shiro`的天下。相对于Shiro，在SSM中整合Spring Security都是比较麻烦的操作，所以，Spring Security虽然功能比 Shiro 强大，但是使用反而没有Shiro多（Shiro虽然功能没有Spring Security多，但是对于大部分项目而言，Shiro也够用了）。自从有了Spring Boot之后，Spring Boot对于Spring Security提供了自动化配置方案，可以使用更少的配置来使用Spring Security。

因此，一般来说，常见的安全管理技术栈的组合是这样的：

- SSM + Shiro

- Spring Boot/Spring Cloud + Spring Security

**以上只是一个推荐的组合而已，如果单纯从技术上来说，无论怎么组合，都是可行的。**

# 快速开始

1. 使用IDEA初始化一个最简单的Spring Boot项目。

2. 引入依赖：

   ```xml
   <dependency>
   	<groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-security</artifactId>
   </dependency>
   ```

   

   > 注意：Spring Boot和Spring Security之间版本有依赖关系，各个版本不一样，详细请参考[官方文档](https://www.docs4dev.com/docs/zh/spring-security/5.1.2.RELEASE/reference/get-spring-security.html#release-numbering)，作者Spring Boot版本是2.6，对应的Spring Security版本是5.6，由于Spring Boot提供了一个Maven BOM来Management依赖版本，因此无需指定版本。如果您想覆盖Spring Security版本，可以通过提供Maven属性来实现。
   > 

3. 编写Controller类。

   ```java
   @RestController
   @RequestMapping("/test")
   public class TestController {
   
       @GetMapping("/hello")
       public String hello(){
           return "hello security";
       }
   }
   ```

4. 为了防止端口冲突，最好在`resources`包下的配置文件`application.properties`里将端口号设置为其他端口号，我这里设置为8111。

   ```properties
   server.port=8111
   ```

5. 启动Spring Boot，在浏览器输入 `localhost:8111/test/hello` 发现会有一个登录界面，需要输入用户名和密码。这时打开控制台发现里面有一个密码:

   ```shel
   Using generated security password: b1caa423-4f6c-4522-912e-79718ce46a7e
   
   This generated password is for development use only. Your security configuration must be updated before running your application in production.
   ```

   默认的用户名是`user`，密码就是控制台里生成的密码，然后就能访问资源了😁！浏览器页面上会输出`hello security`。

# 基本原理

Spring Security本质是是一个**过滤器链**。

| 过滤器                                          | 过滤器作用                                               | 默认是否加载 |
| ----------------------------------------------- | -------------------------------------------------------- | ------------ |
| ChannelProcessingFilter                         | 过滤请求协议 HTTP 、HTTPS                                | NO           |
| `WebAsyncManagerIntegrationFilter`              | 将 WebAsyncManger 与 SpringSecurity 上下文进行集成       | YES          |
| `SecurityContextPersistenceFilter`              | 在处理请求之前,将安全信息加载到 SecurityContextHolder 中 | YES          |
| `HeaderWriterFilter`                            | 处理头信息加入响应中                                     | YES          |
| CorsFilter                                      | 处理跨域问题                                             | NO           |
| `CsrfFilter`                                    | 处理 CSRF 攻击                                           | YES          |
| `LogoutFilter`                                  | 处理注销登录                                             | YES          |
| OAuth2AuthorizationRequestRedirectFilter        | 处理 OAuth2 认证重定向                                   | NO           |
| Saml2WebSsoAuthenticationRequestFilter          | 处理 SAML 认证                                           | NO           |
| X509AuthenticationFilter                        | 处理 X509 认证                                           | NO           |
| AbstractPreAuthenticatedProcessingFilter        | 处理预认证问题                                           | NO           |
| CasAuthenticationFilter                         | 处理 CAS 单点登录                                        | NO           |
| OAuth2LoginAuthenticationFilter                 | 处理 OAuth2 认证                                         | NO           |
| Saml2WebSsoAuthenticationFilter                 | 处理 SAML 认证                                           | NO           |
| `UsernamePasswordAuthenticationFilter`          | 处理表单登录                                             | YES          |
| OpenIDAuthenticationFilter                      | 处理 OpenID 认证                                         | NO           |
| `DefaultLoginPageGeneratingFilter`              | 配置默认登录页面                                         | YES          |
| `DefaultLogoutPageGeneratingFilter`             | 配置默认注销页面                                         | YES          |
| ConcurrentSessionFilter                         | 处理 Session 有效期                                      | NO           |
| DigestAuthenticationFilter                      | 处理 HTTP 摘要认证                                       | NO           |
| BearerTokenAuthenticationFilter                 | 处理 OAuth2 认证的 Access Token                          | NO           |
| `BasicAuthenticationFilter`                     | 处理 HttpBasic 登录                                      | YES          |
| `RequestCacheAwareFilter`                       | 处理请求缓存                                             | YES          |
| `SecurityContextHolder<br />AwareRequestFilter` | 包装原始请求                                             | YES          |
| JaasApiIntegrationFilter                        | 处理 JAAS 认证                                           | NO           |
| `RememberMeAuthenticationFilter`                | 处理 RememberMe 登录                                     | NO           |
| `AnonymousAuthenticationFilter`                 | 配置匿名认证                                             | YES          |
| OAuth2AuthorizationCodeGrantFilter              | 处理OAuth2认证中授权码                                   | NO           |
| `SessionManagementFilter`                       | 处理 session 并发问题                                    | YES          |
| `ExceptionTranslationFilter`                    | 处理认证/授权中的异常                                    | YES          |
| `FilterSecurityInterceptor`                     | 处理授权相关                                             | YES          |
| SwitchUserFilter                                | 处理账户切换                                             | NO           |

# Web权限方案

## 设置登录用户名和密码

### 通过配置文件

在`application.properties`里面加上用户名和密码。

```properties
spring.security.user.name=zwy
spring.security.user.password=123
```

### 通过配置类

创建一个`config`包，在包里创建一个配置类`SecurityConfig`，并实现配置。

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String password = passwordEncoder.encode("123");
        auth.inMemoryAuthentication().withUser("lucy").password(password).roles("admin");
    }
    
     @Bean
    PasswordEncoder password(){
        return new BCryptPasswordEncoder();
    }
}
```

### 自定义编写实现类

实现`UserDetailsService`接口，**这一步是非常重要的！！** 重写接口`loadUserByUsername`这个方法，在其中完成数据库的查询工作，并将得到的user返回就可以了。

#### 引入依赖

```xml
<!--mybatis-plus-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.1</version>
</dependency>
<!--mysql-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<!--lombok 用来简化实体类-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

#### 编写实体类

```java
@Data
public class Users {
    private Integer id;
    private String username;
    private String password;
}
```

#### 配置数据源

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost/springsecurity?useUnicode=true&characterEncoding=UTF8&serverTimezone=Asia/Shanghai
spring.datasource.username=root
spring.datasource.password=mysql1970s
```

#### 使用MP定义映射

```java
@Repository
public interface UsersMapper extends BaseMapper<Users> {

}
```

#### 实现UserDetailsService

```java

@Service("userDetailService")
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UsersMapper usersMapper;


    //调用usersMapper方法
    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        QueryWrapper<Users> wrapper = new QueryWrapper();
        wrapper.eq("username", s);
        Users users = usersMapper.selectOne(wrapper);
        if (users == null) {
            throw new UsernameNotFoundException("用户名不存在！");
        }
        System.out.println(users);
        List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList("role");
        return new User(users.getUsername(), users.getPassword(), auths);
    }
}
```

#### 写入数据

建立一个表，添加一条记录：

```sql
INSERT INTO `users` VALUES (1, 'zwy', '{noop}123');
```



> 这里为了测试方便，并没有给数据库里的密码加密，但是在正常开发里，是必须加密的。
> 

为什么要加密？2011年12月21日，有人在网络上公开了一个包含600万个CSDN用户资料的数据库，数据全部为明文储存，包含用户名、密码以及注册邮箱。事件发生后CSDN在微博、官方网站等渠道发出了声明，解释说此数据库系2009年备份所用，因不明原因泄露，已经向警方报案，后又在官网发出了公开道歉信。在接下来的十多天里，金山、网易、京东、当当、新浪等多家公司被卷入到这次事件中。整个事件中最触目惊心的莫过于CSDN把用户密码明文存储，由于很多用户是多个网站共用一个密码，因此一个网站密码泄露就会造成很大的安全隐患。由于有了这么多前车之鉴，我们现在做系统时，密码都要加密处理。

这次泄密，也留下了一些有趣的事情，特别是对于广大程序员设置密码这一项。人们从CSDN泄密的文件中，发现了一些好玩的密码，例如如下这些：

- `ppnn13%dkstFeb.1st` 这段密码的中文解析是：娉娉袅袅十三余，豆蔻梢头二月初。
- `csbt34.ydhl12s` 这段密码的中文解析是：池上碧苔三四点，叶底黄鹂一两声。

等等不一而足，你会发现很多程序员的人文素养还是非常高的，让人啧啧称奇🙌。

小坑：在一开始的时候，我直接存入数据库的密码是123，但是这里会报错`There is no PasswordEncoder mapped for the id “null”`，后来查资料后发现，在Spring Security中密码的存储格式是“{id}…………”。前面的id是加密方式，id可以是bcrypt、sha256等，不加密就是noop，后面跟着的是加密后的密码。也就是说，程序拿到传过来的密码的时候，会首先查找被“{”和“}”包括起来的id，来确定后面的密码是被怎么样加密的，如果找不到就认为id是null。

#### 测试

在登录界面输入`zwy`和`123`就可以正常访问资源了👍！

## 自定义登录界面和规则

使用`Thymeleaf`模板引擎简化开发：

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

自定义登录控制器：

```java
@Controller
public class LoginController {

    @RequestMapping("/login.html")
    public String login() {
        return "login";
    }
}
```

前端页面：

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="https://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>登录</title>
</head>
<body>
<h1>用户登录</h1>
<form method="post" th:action="@{/doLogin}">
    用户名:<input name="uname" type="text"/><br>
    密码:<input name="passwd" type="password"/><br>
    <input type="submit" value="登录"/>
</form>
</body>
</html>
```

**需要注意的是**

- 登录表单 method 必须为 `post`，action 的请求路径为 `/doLogin`
- 用户名的 name 属性为 `uname`
- 密码的 name 属性为 `passwd` ，后面会用到属性

配置配置类：

```java
@Configuration
public class WebSecurityConfigurer extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests()
                .mvcMatchers("/index").permitAll()//放行
                .mvcMatchers("/login.html").permitAll()//放行
                .anyRequest().authenticated()//其他都要认证
                .and()
                .formLogin()
                .loginPage("/login.html")//指定登录界面
                .loginProcessingUrl("/doLogin")//执行登录控制器，不用自己写👍
                .usernameParameter("uname")//用户名参数
                .passwordParameter("passwd")//密码变量
                .successForwardUrl("/index")//跳转到指定页面 8080/doLogin
			// .defaultSuccessUrl("/index")//重定向，优先跳转到之前请求的路径，如果不存在了，就到指定页面
                .failureUrl("/login.html")//认证失败还是登录界面
                .and()
                .csrf().disable();

    }
}
```

successForwardUrl 、defaultSuccessUrl 这两个方法都可以实现成功之后跳转

- successForwardUrl  默认使用 `forward `跳转     **注意:不会跳转到之前请求路径**
- defaultSuccessUrl   默认使用 `redirect` 跳转      **注意:如果之前请求路径,会有优先跳转之前请求路径,可以传入第二个参数进行修改**

## 自定义登录成功处理

有时候页面跳转并不能满足我们，特别是在前后端分离开发中就不需要成功之后跳转页面。只需要给前端返回一个 JSON 通知登录成功还是失败与否。这个时候可以通过自定义 `AuthenticationSucccessHandler` 实现。

自定义 AuthenticationSuccessHandler 实现：

```java
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("msg", "登录成功");
        result.put("status", 200);
        response.setContentType("application/json;charset=UTF-8");
        String s = new ObjectMapper().writeValueAsString(result);
        response.getWriter().println(s);
    }
}
```

配置 AuthenticationSuccessHandler：

```java
@Configuration
public class WebSecurityConfigurer extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests()
                //...
                .and()
                .formLogin()
                //...
                .successHandler(new MyAuthenticationSuccessHandler())
                .failureUrl("/login.html")
                .and()
                .csrf().disable();//这里先关闭 CSRF
    }
}
```

这时我们登录成功后，就会返回一个JSON数组：

```json
// http://localhost:8080/doLogin
{
    "msg": "登录成功"
    "status": 200
}
```

## 自定义登录失败处理



## 无状态登录

#### 什么是有状态

有状态服务，即服务端需要记录每次会话的客户端信息，从而识别客户端身份，根据用户身份进行请求的处理，典型的设计如 Tomcat 中的 Session。例如登录：用户登录后，我们把用户的信息保存在服务端 session 中，并且给用户一个 cookie 值，记录对应的 session，然后下次请求，用户携带 cookie 值来（这一步有浏览器自动完成），我们就能识别到对应 session，从而找到用户的信息。这种方式目前来看最方便，但是也有一些缺陷，如下：

- 服务端保存大量数据，增加服务端压力
- 服务端保存用户状态，不支持集群化部署

#### 什么是无状态

微服务集群中的每个服务，对外提供的都使用 RESTful 风格的接口。而 RESTful 风格的一个最重要的规范就是：服务的无状态性，即：

- 服务端不保存任何客户端请求者信息
- 客户端的每次请求必须具备自描述信息，通过这些信息识别客户端身份

那么这种无状态性有哪些好处呢？

- 客户端请求不依赖服务端的信息，多次请求不需要必须访问到同一台服务器
- 服务端的集群和状态对客户端透明
- 服务端可以任意的迁移和伸缩（可以方便的进行集群化部署）
- 减小服务端存储压力

#### 如何实现无状态

无状态登录的流程：

- 首先客户端发送账户名/密码到服务端进行认证
- 认证通过后，服务端将用户信息加密并且编码成一个 token，返回给客户端
- 以后客户端每次发送请求，都需要携带认证的 token
- 服务端对客户端发送来的 token 进行解密，判断是否有效，并且获取用户登录信息
