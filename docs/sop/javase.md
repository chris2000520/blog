---
title: Java基础
tags:
  - Java
  - JVM
  - 并发编程
date: 2024-10-28 19:29:57
categories: 笔记

---

# 浅尝JVM

## JVM内存结构

![JVM](https://zhaowuya.s3.bitiful.net/JVM.jpg)

## 类加载

装载，链接（验证，准备，解析），初始化。分别有什么作用？

## 垃圾收集

### 分配对象

Java中对象地址操作主要使用Unsafe调用了C的allocate和free两个方法，分配方法有两种：

- 空闲链表（free list）：通过额外的存储，记录
- 碰撞指针（bump pointer）：

### 收集对象

上图中蓝色区域为GC的主要工作区域。

ParNew : 年轻代[垃圾收集器](https://so.csdn.net/so/search?q=垃圾收集器&spm=1001.2101.3001.7020)，多线程，采用标记—复制算法。

CMS：老年代的收集器，全称（Concurrent Mark and Sweep），是一种以获取最短回收停顿时间为目标的收集器。

### CMS与G1

| 区别         | CMS  | G1   |
| ------------ | ---- | ---- |
| 回收位置     | JDK5 | JDK7 |
| 垃圾回收算法 | M-S  | M-C  |

# 并发编程

>单核并发，多核并行，volatile关键字保证变量内存可见性（当一个线程修改了被volatile修饰的变量，其他线程能立即看到这次修改）还有防止指令重排，但是不能保证**原子性。**

## 1.进程与线程的区别

**进程** : 一个运行中的程序的集合; 一个进程往往可以包含多个线程，至少包含一个线程，java默认有几个线程? 两个 main线程 gc线程。

**线程** : 线程（thread）是操作系统能够进行运算调度的最小单位。

## 2.用过哪些接口和类

### Lock接口

ReentrantLock

```java
public class Lock {
    private final ReentrantLock lock = new ReentrantLock();
    public void m(){
        lock.lock();
        try{
            System.out.println("上锁");
        } finally {
            lock.unlock();
        }
    }
}
```

#### 线程安全集合

## 3.创建线程的方法有哪些？

#### **3.1继承Thread类**

```java
class Cat extends Thread{
    @override
    public void run(){
        System.out.println("喵喵喵~我是一只🐱")
    }
}
```

源码：

```java
// （1）同步
public synchronized void start(){
    start0();
}
// （2）本地方法，由c++实现，真正实现的多线程方法
private native void start0();
```

**start方法调用start0后，该线程并不一定会立马执行，只是将线程变成了可运行状态，具体什么时候执行，取决于CPU，由CPU统一调度。**

### **3.2实现Runnable中的run方法（推荐）**

**由于Java是单继承的，当我们要将a当作线程使用，而a已经继承了b，我们就不能通过继承Thread类来实现线程**

```java
class Dog implements Runnable{}
/**
*/
Dog dog = new Dog();
Thread thread = new Thread(dog);
thread.start();
```

使用到了**静态代理**模式。



### **3.3实现Callable接口**

```java
FutureTask<Intger> future = new FutureTask<>(() -> {return 1024});
```

**有返回值 ，能抛出异常，实现call方法**

`FutureTask`包装一个`Callable`或`Runnable`任务，并且可以查询任务是否完成，等待任务完成，并获取结果。

### **3.4通过JUC中的线程池**

使用ThreadPoolExecutor线程池。

## 4.Java线程状态有哪些，是如何转换的

| **英文**                   | **中文**                                                     |
| -------------------------- | ------------------------------------------------------------ |
| NEW                        | 新建                                                         |
| RUNNABLE（Ready，Running） | 这个状态包括了操作系统线程的就绪（ready）和运行（running）两种状态。 |
| BLOCKED                    | 阻塞                                                         |
| WAITING                    | 等待                                                         |
| TIMED_WAITING              | 超时等待                                                     |
| TERMINATED                 | 终结                                                         |

## 5.sleep和wait区别



## 6.Java有哪些锁

![琐事](https://zhaowuya.s3.bitiful.net/lock.png)

## 7.什么是AQS

多线程中队列同步器，是一种锁机制，基础框架，例如ReentrantLock，Semaphore，CountDownLatch

state 0无锁 1有锁

线程1 -2 -3 -4 -5

队列：head，tail

- 怎么保证原子性？**CAS**
- AQS是公平锁吗？都可以，等待/抢

## 8.ReentrantLock实现原理

主要通过CAS+AQS队列来实现，它支持非/公平，公平锁的效率通常没有非公平高。

## 9.ConcurrentHashMap

JDK1.8 采用的数据结构跟HashMap的结构一样

### 加锁的方式

- JDK1.7采用分段锁，底层使用的是ReentrantLock
- JDK1.8采用**CAS**添加新的节点，采用**syn**锁定链表或哦红黑数的首节点，锁的粒度更细，效率高。

## 10.线程池的核心参数有哪些

1. corePoolSize：**核心**线程数，线程池正常情况下保持的线程数，大户人家“长工”的数量。
2. maximumPoolSize：**最大**线程数，当线程池繁忙时最多可以拥有的线程数，大户人家“长工”+“短工”的总数量。
3. keepAliveTime：空闲线程存活**时间**，没有活之后“短工”可以生存的最大时间。
4. TimeUnit：3时间**单位**。
5. BlockingQueue：线程池的任务**队列**，用于保存线程池待执行任务的容器。
6. ThreadFactory：线程工厂，用于创建线程池中线程的工厂**方法**，通过它可以设置线程的命名规则、优先级和线程类型。
7. RejectedExecutionHandler：拒绝**策略**，当任务量超过线程池可以保存的最大任务数时，执行的策略。

## 11.谈谈你对ThreadLocal的理解

## 12.谈谈CompletableFuture

原因：使用futureTask的get方法会阻塞线程，isDone方法会轮询CPU消耗资源。

观察者模式：可以让任务完成后通知主线程。异步任务结束后，会自动回调某个对象的方法，出错时，会自动回调某个对象方法。

# 语言基础

## 自动类型转换

可以支持将表数范围从小转向大的，而不能反过来，就好像大杯的水不能倒入小杯中，因为会溢出！

```
short s1 = 1; s1 = s1 + 1；``short s1 = 1; s1 += 1;
```

对于 short s1 = 1; s1 = s1 + 1;编译出错，由于 1 是 int 类型，因此 s1+1 运算结果也是 int 型，需要强制转换类型才能赋值给 short 型。

## 自动拆装箱

那什么是拆箱呢？顾名思义，跟装箱对应，就是自动将包装器类型转换为基本数据类型。

```
Integer i= 1; // 装箱
int n = i;  //拆箱
```

## 日期

## 集合

## 枚举

枚举是一种特殊的类，它不能被继承，是一组**命名常量**的集合。这些命名常量被称为枚举常量。例如春夏秋冬、网络状态码、订单状态码、用户标识符等，能够避免**魔法数字**的使用，**提高代码可读性和可维护性**。

## IO流

- 字节流（二进制文件图片,视频，音频，无损操作），字符流（按字符）(文本文件效率高)
- 按流的角色不同为：节点流，包装流

**按行读取**取bufferReader.readLine节点流和处理流

### 节点流

可以从一个特定的数据源读写数据，如FileReader，FileWriter

### 包装流

也叫**处理流**，是连接在已存在的流之上，为程序提供更为强大的功能，如BufferedReader，BufferedWriter。

装饰器（Decorator）模式的使用

### 对象流

能够将基本数据类型或者对象进行**序/反序列**化的操作。

注意事项：

1. 读写顺序要一致
2. 实现Serializable接口
3. 建议添加SerialVersionUID，提高兼容性
4. 序列化时除了static和transient
5. 序列化自动继承

序列化就是保存数据的时候，同时保存数据的值和数据类型，反序列化就是恢复过程。可以实现Serializable和Externalizable

## Stream流

JDK8新特性

### 特点

1. **声明式编程**：使用 Stream 流可以采用声明式的方式来表达对数据的处理逻辑，而不是像传统的命令式编程那样通过循环和条件语句来实现。这使得代码更加简洁、易读，并且更接近问题的本质描述。
2. **懒加载**：许多 Stream 操作是懒加载的，这意味着它们只有在真正需要结果的时候才会执行。例如，当使用一系列中间操作（如过滤、映射等）后，只有在调用终端操作（如`forEach`、`collect`等）时，才会实际执行整个流的处理过程。
3. **函数式编程风格**

### 操作

中间操作filter，map，sort

终端操作foreach，collect

### 使用场景

1. **数据处理和转换**：当需要对大量数据进行复杂的处理和转换时，简洁而高效的方式。
2. **集合操作**：可以方便地对集合进行各种操作，如过滤、排序、分组等，可以大大简化代码。
3. **并行处理**：效率高。

## 面向对象

### 重载与重写区别

在同一个类中，可能会存在同名的方法，但是他们函数签名（名字，**参数列表**，返回值）不同，主要是参数列表不同。

在子类中，对于父类中同一个方法（方法签名一样），会根据需求扩展或修改，以更加具体地实现父类中的方法。子类的返回值类型要**小**于父类，抛出比父类更**小**的异常，访问权限比父类**大**。

### 抽象类和接口的区别

1. 继承与实现

- 抽象类通过 extends 关键字被继承。一个类只能继承一个抽象类。
- 接口通过 implements 关键字被实现，一个类可以实现多个接口。
- 成员变量修饰符

- 抽象类可以有各种类型的成员变量，包括实例变量。
- 接口中的成员变量默认是 public static final 的**常量**。
- 方法的修饰符

- 抽象类中的方法可以有不同的访问修饰符，并且可以有方法体（非抽象方法）。
- 接口中的方法默认是 *public* *abstract* （在Java 8之前，Java 8开始可以有default修饰的方法------可以有实现）。

## 反射

1. 使用`Class.forName()`方法获取Class对象。
2. 获取所有**公共构造函数**，获取**特定参数的构造函数**`getConstructor()`，也可以获取其他公共方法`getMethod()`。如果有重载情况，可以通过参数不一样`(int.class,String.class)`来明确要获得的具体方法。

```java
Class<?> clazz = MyClass.class;
Constructor<?> constructor = clazz.getConstructor(int.class, String.class);
// 使用构造函数创建对象
MyClass obj = (MyClass) constructor.newInstance(10, "example");
```

1. 获取所有字段或者特定字段并访问其值`getField()`

```java
   try {
       Class<?> clazz = MyClass.class;
       Field field = clazz.getField("myField");
       MyClass obj = new MyClass();
       Object value = field.get(obj);
       System.out.println("Field value: " + value);
   } catch (NoSuchFieldException | IllegalAccessException e) {
       e.printStackTrace();
   }
```

### 使用场景

**一、框架开发**

1. 依赖注入框架，如 Spring，可利用反射自动注入依赖对象。例如，根据配置查找服务类的构造函数，自动创建依赖对象并传入构造函数完成注入。
2. ORM 框架通过反射将数据库数据映射到 Java 对象，如 MyBatis 在查询后用反射填充对象属性。

二**、测试框架**

1. 单元测试中可通过反射访问类的私有方法和字段进行更全面测试，如在 JUnit 中调用被测试类的私有方法验证功能。

## 注解

**一、定义注解**

使用`@interface`关键字来定义一个注解。例如：

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyCustomAnnotation {
    String value() default "";
}
```

## 动态代理

> JDK原生动态代理是Java原生支持的，不需要任何外部依赖，但是它只能基于接口进行代理；CGLIB通过继承的方式进行代理，无论目标对象有没有实现接口都可以代理，但是无法处理final的情况。

### JDK

1. 定义一个要代理的接口
2. 实现`InvocationHandler`接口中的`invoke`方法，表示调用接口后转发到此实现
3. 通过`Proxy.newProxyInstance` 方法创建了一个代理实例 `hello`

### CGLIB

