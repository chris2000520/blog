---
title: ABP框架初体验
date: 2021-01-10 21:43:56
tags: 
  - ASP.NET
categories: 笔记
---

# ABP

简介：

ABP(ASP.NET Boilerplate Project (ASP.NET样板项目)
ASP.NET Boilerplate是一个用最佳实践和流行技术开发现代WEB应用程序的新起点，它旨在成为一个通用的WEB应用程序框架和项目模板。
**框架**
ABP是基于最新的ASP.NET CORE，ASP.NET MVC和Web API技术的应用程序框架。并使用流行的框架和库，它提供了便于使用的授权，依赖注入，验证，异常处理，本地化，日志记录，缓存等常用功能。
**架构**
ABP实现了多层架构（领域层，应用层，基础设施层和表示层），以及领域驱动设计（实体，存储库，领域服务，应用程序服务，DTO等）。还实现和提供了良好的基础设施来实现最佳实践，如依赖注入。
**模板**
ABP轻松地为您的项目创建启动模板。它默认包括最常用的框架和库。还允许您选择单页（Angularjs）或多页架构，EntityFramework或NHibernate作为ORM。
访问[官网](https://aspnetboilerplate.com/)，了解更多。

## Application 应用层

在这里写接口。

新建两个文件，文件里面实现一个接口和一个实例，` IUserAppService.cs`和`UserAppService.cs`。

### Dto

数据传输对象DTO(Data Transfer Object)，是一种设计模式之间传输数据的软件应用系统。

- Dto命名格式：ABP建议命名输入/输出参数为：MethodName**Input**和MethodName**Output**

- 并为每个应用服务方法定义单独的输入和输出DTO（如果为每个方法的输入输出都定义一个dto，那将有一个庞大的dto类需要定义维护。一般通过定义一个公用的dto进行共用）

- 即使你的方法只接受/返回一个参数，也最好是创建一个DTO类

- 一般会在对应实体的应用服务文件夹下新建Dtos文件夹来管理Dto类。

| 传值方式 | 命名格式（一般情况）                |
| -------- | ----------------------------------- |
| POST     | Create，Insert，Change，Reset开头的 |
| DELETE   | Delete，Remove开头的                |
| GET      | Get开头的                           |
| PUT      | Put，Update开头的                   |

“`=>`”是**C# 3.0**新增的，告诉编译器我们正在使用`Lambda`表达式。”`=>`”可以读作”`goes to`”。

B站视频后端部分[ABP全栈开发](https://www.bilibili.com/video/BV155411W7yL?p=2&t=2762) `80:22`，`62:45`。

### 映射

#### 自动映射

映射时，可以在视图模型里告诉数据来自哪个模型。`给`和`来自`于不一样。

```c#
[AutoMapFrom(typeof(Task))]
[AutoMapTo(typeof(Task))]
```



#### 自定义映射

简单地映射可能不适用于一些场景，如，两个类的属性名称有些不同或你可能想要在映射过程中忽略一些属性，这些情况下可以直接使用AutoMapper的Api来自定义映射关系，不过Abp.AutoMapper包定义了更模块化的API。

### 接口

生成动态API接口时，我们的自己写的接口需要继承的一个更往后的接口`AppService`。只有继承这个接口，我们在创建时，才能够找到API，把它给创建出来。

例如：

```c#
public interface IUserAppService:IAppService {}
```

### 实例

继承于`项目名+AppServiceBase`和`IUserAppService`,只有继承了这两个接口，在创建时，被发现才能映射到前面去。Test是我自己的项目名。

```c#
 public class TaskAppService : TestAppServiceBase, ITaskAppService {}
```

然后依赖注入

打开Swagger UI 找到自己的接口，try一下。如果数据库有数据，会按照json格式显示出来。

### 仓储

仓储（Repository） 用来操作数据库进行数据存取。仓储接口在领域层定义，而仓储的实现类应该写在基础设施层。

在ABP中，仓储类要实现`IRepository`接口，接口定义了常用的增删改查以及聚合方法，其中包括同步及异步方法。如果业务简单，那ABP自带的泛型仓储就足够用了。`IRepository`定义了从**数据库**中检索实体的常用方法。下面列举一些常用的方法。
#### 查询
```csharp
TEntity Get(TPrimaryKey id);
```

Get方法被用于根据主键值(Id)取得对应的**单一实体**。当数据库中根据主键值找不到相符合的实体时,它会抛出异常。

```csharp
List<TEntity> GetAllList();
```

GetAllList方法被用于从数据库中检索**所有实体**。重载并且提供过滤实体的功能（相当于条件查询）。例如：

```c#
var allPeople = _personRepository.GetAllList();
var somePeople = _personRepository.GetAllList(person => person.IsActive && person.Age > 42);
```

```csharp
IQueryable<TEntity> GetAll();
```

GetAll方法返回IQueryable\<T>类型的**对象**。因此我们可以在调用完这个方法之后进行Linq操作。例如：

```c#
var query = from p in _personRepository.GetAll()
			where p.Age == 20
			orderby p.Name
			select p;
```
说明：关于IQueryable\<T> 当你调用GetAll这个方法在Repository对象以外的地方,必定会开启数据库连接。这是因为IQueryable\<T>允许延迟执行。它会**直到**你调用ToList方法或在forEach循环上(或是一些存取已查询的对象方法)使用IQueryable\<T>时,才会实际**执行数据库的查询**。因此,当你调用ToList方法时,数据库连接必需是启用状态。总结，GetAll方法不会查询数据库，而是知道之行到ToList方法时才会与查询数据库。

#### 新增

```csharp
TEntity Insert(TEntity entity);
TPrimaryKey InsertAndGetId(TEntity entity);
TEntity InsertOrUpdate(TEntity entity);
TPrimaryKey InsertOrUpdateAndGetId(TEntity entity);
```
新增方法会新增实体到数据库并且返回相同的已新增实体。InsertAndGetId方法返回新增实体的标识符(Id)。当我们采用自动递增标识符值且需要取得实体的新产生标识符值时非常好用。InsertOfUpdate会新增或更新实体,选择那一种是根据Id是否有值来决定。最后,InsertOrUpdatedAndGetId会在实体被新增或更新后返回Id值。总结，注意参数和返回值，基本上和查询系列方法类似。

#### 更新

```csharp
TEntity Update(TEntity entity);
```

IRepository定义一个方法来实现更新一个**已存在**于数据库中的实体。它更新实体并返回相同的实体对象。

#### 删除

```csharp
void Delete(TEntity entity);
void Delete(TPrimaryKey id);
void Delete(Expression<Func<TEntity, bool>> predicate);
```

上面两个方法一个是删除实体，一个是通过Id删除，第三个方法接受一个条件来删除符合条件的实体。要注意,所有符合predicate表达式的实体会**先被检索而后删除**。

#### 其它方法

```csharp
int Count();
int Count(Expression<Func<TEntity, bool>> predicate);
Long LongCount();
Long LongCount(Expression<Func<TEntity, bool>> predicate);
```

IRepository也提供一些方法来取得数据表中实体的数量。要注意的同删除系列的predicate表达式。

## Core 领域层

在这里写实体类，写各种限制。

### 实体类

我们定义一个实体类Person，并且为它定义两个属性。父类Entity具有主键属性Id。所有继承Entity类的子类都将具有主键为Id的属性。

Id数据类型可以被更改。默认是 int类型。如果你想给 Id 定义其它类型，你应该像下面示例一样来指定 Id 的类型。

```csharp
public class Person : Entity<long> 
```

C#语法中一个个问号(?)的运算符是指：可以为 null 的类型。 

```c#
public DateTime? CreateTime {get;set;} 
```

### 领域模型和视图模型

| 领域模型                                                     | 视图模型                                                     |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 在Core层定义了领域模型，在基础设施层的上下文写入，用DbSet方式把领域模型注入进数据库，在应用层使用时，用仓储来获取对当前的数据库的CRUD，总的来说，领域模型是和数据库进行交互的。 | 跟视图进行交互，跟前端进行数据交互。要和领域模型产生一个明显的切割，其次，前端拿数据表时字段不是完全按照领域模型来的。前端传回数据也需要视图模型。 |



## EntityFramework 基础设施层

写数据库上下文类DbSet。

## Web Host Web Core 展现层

写网页配置，前端开发。

