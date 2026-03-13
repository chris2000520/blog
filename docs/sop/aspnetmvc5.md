---
title: 基于ASP.NET MVC5的留言板系统
tags:
  - C#
  - ASP.NET
  - MVC
date: 2020-11-23 19:51:22
categories: 技术
---


# MVC

模型有 GuestBook 留言类，和 User 类。

视图有控制器相应的视图，就不一一列出了。

控制器有 Home 主页控制器，Account 账户控制器，User 用户操作控制器，Admin 管理员操作控制器。

# Code First

-   DB First 模式：以数据库为基础，并根据数据库自动生成实体数据模型
-   Code First 模式：先写好实体模型类代码，然后生成数据库和表

主要步骤

1. 创建数据模型类
2. 创建数据库上下文类
3. 添加 EntityFramework 依赖
4. 添加数据库连接字符串
5. 数据库迁移

# 项目实例

## GuestBook 类

```C++
public class Guestbook
{
    public int GuestbookId { get; set; }

    [Required(ErrorMessage = "留言标题不能为空")]
    [MaxLength(20, ErrorMessage = "留言标题不超过20个字符")]
    public string Title { get; set; } //留言标题



    [Required(ErrorMessage = "留言内容不能为空")]
    [MinLength(10, ErrorMessage = "留言内容不少于10个字符")]
    public string Content { get; set; } //留言内容



    [Required(ErrorMessage = "留言人的邮箱不能为空")]
    [EmailAddress(ErrorMessage = "email格式不对")]
    public string AuthorEmail { get; set; } //留言邮箱



    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime CreatedOn { get; set; } //创建日期时间

    public Boolean IsPass { get; set; }//审核功能

    public int UserId { get; set; }
    public virtual User User { get; set; }
}

```

这里面做了一些限制，相当于数据库建表时候的那些限制，之后在页面上如果格式不对，就弹出这个错误信息。


## User 类

```C++
public class User
{
    public int UserId { get; set; }
    [Display(Name = "留言人邮箱", Order = 15000)]
    public string Email { get; set; }
    public string Name { get; set; }
    [DataType(DataType.Password)]
    public string Password { get; set; }
    public SystemRole SRole { get; set; }
    public virtual ICollection<Guestbook> Guestbooks { get; set; }
}

public enum SystemRole { 普通用户, 管理员 }
```

这里面我加了角色`Role`，方便以后判断登陆跳转。

## GBSDBContext 类

```c++
public class GBSDBContext : DbContext
{
    public DbSet<Guestbook> Guestbooks { get; set; }

    public DbSet<User> Users { get; set; }

}
```

数据库上下文类，数据库上下文类是继承 DbContext 类的，此时应该安装 EntityFramework 包，打开 NuGet 包管理器，输入

```
Install-Package EntityFramework -Version 6.4.4
```

安装成功后，GBSDBContext.cs 就可顺利编译。

## 配置文件 

```xml
<connectionStrings>
    <add name="GBSDBContext"
    connectionString="Data Source=(LocalDb)\MSSQLLocalDB;
    AttachDbFilename=|DataDirectory|\GBSDB.mdf;
    Initial Catalog=GBS;
    Integrated Security=True"
    providerName="System.Data.SqlClient" />
</connectionStrings>

```

把这些放在Web.config中```<configuration></configuration>```标签里

-   GBSDBContext 是数据库上下文。
-   GBSDB.mdf 是数据库文件名(存放在 app_data 中)，需要手动添加现有项到解决方案资源管- 理器中，才看得见。
-   GBS 是数据库名(服务器中)。
-   Integrated Security=True"代表用当前 Windows 帐户凭据进行身份验证。(不用输入数据库服务器用户名和密码即可登录)

## 数据库迁移

三行搞定，出金不要慌，出红就重来吧 🤨

```
Enable-Migrations
Add-Migration InitialCreate
Update-Database
```

然后数据库就生成了，要搞清楚这两个表之间的关系，UserId 是 GuestBook 的外键，要保证实体完整性。开始需要手动添加管理员信息，毕竟管理员也不能注册对吧！

## 登录登出

头是 Controller，下面是 Action。（下面的结构也一样）

Account

-   Login
-   Logout

```c++
[HttpPost]
public ActionResult Login(User user)
{
    if (ModelState.IsValid)
        {
            var dbUser = db.Users.Where(a => a.Name == user.Name && a.Password == user.Password).FirstOrDefault();
            if (dbUser != null)
            {
                FormsAuthenticationTicket authTicket = new FormsAuthenticationTicket(
                    1, dbUser.UserId.ToString(), DateTime.Now, DateTime.Now.AddMinutes(20), false, dbUser.SRole.ToString());

                string encryptedTicket = FormsAuthentication.Encrypt(authTicket);

                HttpCookie authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);

                authCookie.HttpOnly = true;

                System.Web.HttpContext.Current.Response.Cookies.Add(authCookie);

                if (dbUser.SRole.ToString() == "管理员")
                {
                    return RedirectToAction("Index", "Admin");
                }
                else if (dbUser.SRole.ToString() == "普通用户")
                {
                    Session["UserId"] = dbUser.UserId;
                    return RedirectToAction("AllWords", "User");
                }
            }
        }
    }
    ModelState.AddModelError("", "用户名或密码错误");
    return View(user);
}
```

这里要获取 UserId，不然之后无法通过 UserId 选择当前用户自己的留言，也无法发布留言，因为外键为空，不符合实体完整性。具体方法就是通过 Seesion 将 UserId 保存起来，后面有用嘿嘿嘿。还有获取 Cookies 和将其加密。

如果要身份验证，加了`[Authorize]`要在解决方案资源管理器的最后一项文件的Web.config 里加表单验证，放在```<system.web></system.web>```标签里面不然会报错 401。loginUrl 是非法访问时跳转的登录界面。

```xml
    <authentication mode="Forms"><!--有4种-->
      <forms loginUrl="~/Account/Login" defaultUrl="/" timeout="2880" />
    </authentication>
```

```C++
public ActionResult Logout()
{
    FormsAuthentication.SignOut();
    return RedirectToAction("Login", "Account");
}
```

还要避免普通用户正常登录后，通过浏览器地址栏进去后台管理，Admin 控制器也要加身份验证`[Authorize (Roles ="管理员")]`，加上后在 Global.asax 文件中加这一个方法，具体原理还在研究中。

```c++
protected void Application_AuthorizeRequest(object sender, System.EventArgs e)
{
    HttpApplication App = (HttpApplication)sender;
    HttpContext Ctx = App.Context; //获取本次Http请求相关的HttpContext对象
    if (Ctx.Request.IsAuthenticated == true) //验证过的用户才进行role的处理
    {
        FormsIdentity Id = (FormsIdentity)Ctx.User.Identity;
        FormsAuthenticationTicket Ticket = Id.Ticket; //取得身份验证票
        string[] Roles = Ticket.UserData.Split(','); //将身份验证票中的role数据转成字符串数组
        Ctx.User = new GenericPrincipal(Id, Roles); //将原有的Identity加上角色信息新建一个GenericPrincipal表示当前用户,这样当前用户就拥有了role信息
    }
}
```

用户必须点击登出按钮登出，会清除 Cookies，之后不能通过浏览器地址访问用户个人主页。

## 用户注册

Account

-   RegisterIndex
-   Register

```c++
[AllowAnonymous]
public ActionResult RegisterIndex()
{
    return View();
}
[AllowAnonymous]
public ActionResult Register()
{
    return View();
}
[AllowAnonymous]
[HttpPost]
public ActionResult Register(User user)
{
    if (ModelState.IsValid)
    {
        db.Users.Add(user);
        db.SaveChanges();
        return RedirectToAction("Login", "Account");
    }
    return View();
}
```

通过表单提交 post 请求，插入一行记录，完成后跳到登录界面

## 删除留言

### 用户删除自己留言

User

-   MyWords
-   Delete
-   DeleteConfired

先通过 UserId 选择出只有自己留言的页面

```c++
public ActionResult MyWords()
{
    int UserId = (int)Session["UserId"];
    var gb = from u in db.Guestbooks
            where u.IsPass == true && u.UserId == UserId
            orderby u.CreatedOn descending
            select u;

    return View("MyWords", gb.ToList());
}

public ActionResult Delete(int id)
{
    var gb = db.Guestbooks.Find(id);
    return View(gb);
}

[HttpPost, ActionName("Delete")]
public ActionResult DeleteConfired(int id)
{
    var gb = db.Guestbooks.Find(id);
    db.Guestbooks.Remove(gb);
    db.SaveChanges();
    return RedirectToAction("MyWords", "User");
}
```

选择删除，确认删除。

### 管理员删除留言

Admin

-   DeleteIndex
-   Delete
-   DeleteConfired

```c++
public ActionResult DeleteIndex()
{
    var gb = from u in db.Guestbooks
                where u.IsPass == true
                orderby u.CreatedOn descending
                select u;
    return View(gb.ToList());
}
public ActionResult Delete(int id)
{
    var gb = db.Guestbooks.Find(id);
    return View(gb);
}

[HttpPost, ActionName("Delete")]
public ActionResult DeleteConfired(int id)
{
    var gb = db.Guestbooks.Find(id);
    db.Guestbooks.Remove(gb);
    db.SaveChanges();
    return RedirectToAction("DeleteIndex","Admin");

}
```

原理和上面一样

## 增加留言

User

-   Create

```c++
public ActionResult Create()
{
    return View();
}

[HttpPost]
public ActionResult Create(Guestbook gb)
{
    if (ModelState.IsValid)
    {
        //gb.CreatedOn = System.DateTime.Now;
        gb.UserId = (int)Session["UserId"];
        gb.IsPass = false;
        db.Guestbooks.Add(gb);
        db.SaveChanges();
        return RedirectToAction("AllWords");
    }
    return View();
}
```

原理同用户注册，注意要把刚刚登录时获取到的 UserId 传进去，外键不能为空，否则会报错。
```
SqlException: The INSERT statement conflicted with the FOREIGN KEY 
```
另外，用户发布的留言需要管理员审核通过才可以展示到主页上，IsPass 设置默认值为 false。

## 审核留言

Admin

-   CheckIndex
-   CheckMessage
-   CheckMessage1

```c++
public ActionResult CheckIndex()
{
    var gb = from u in db.Guestbooks
            where u.IsPass == false
            orderby u.CreatedOn descending
            select u;

    return View("CheckIndex", gb.ToList());
}

public ActionResult CheckMessage(int id)
{
    var gb = db.Guestbooks.Find(id);
    return View(gb);
}
[HttpPost, ActionName("CheckMessage")]
public ActionResult CheckMessage1(int id)//通过审核方法
{
    var gb = db.Guestbooks.Find(id);
    gb.IsPass = true;
    db.SaveChanges();
    return RedirectToAction("CheckIndex", new { target = "fc" });
}
```

管理员点击审核通过后，执行方法，将 IsPass 设置为 True，主页就可以正常显示该留言了。

## 用户管理

Admin

-   UserManger
-   DeleteUser

```c++
public ActionResult UserManage()
{
    var user = from u in db.Users
                select u;
    return View("UserManage", user.ToList());
}


public ActionResult DeleteUser(int id)
{
    User user = db.Users.Find(id);
    if (user != null)
    {
        db.Users.Remove(user);
        db.SaveChanges();
    }
    return RedirectToAction("UserManage");
}
```

选择所有用户，遍历每一行，显示在页面上，删除同删除留言，通过主键删除。

## 留言统计

Admin

-   CommentSummary

```c++
public ActionResult CommentSummary()
{
    var gb = from u in db.Guestbooks
                where u.IsPass == true
                orderby u.CreatedOn descending
                select u;
    int count = gb.Count();

    var gb2 = from u in db.Guestbooks
                where u.IsPass == false
                orderby u.CreatedOn descending
                select u;
    int count2 = gb2.Count();

    ViewBag.count = count;
    ViewBag.count2 = count2;
    return View();

}
```
通过数据库筛选，分别得出审核通过和待审核的留言，前端显示。

# 项目总结

项目地址：[留言板系统](https://github.com/chris2000520/GuestBookSystem)

理解 ASP .NET MVC 开发，软件工程模式，尝试用 Git 进行分布式管理。

学海无涯苦作舟。加油 😶
