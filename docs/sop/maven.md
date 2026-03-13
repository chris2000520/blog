---
title: Maven笔记
tags:
  - JavaWeb
  - Java
  - Maven
date: 2021-05-14 23:11:37
categories: 笔记
---

# Maven简介

{% note primary %}

如果拿一个普通的JavaWeb项目和一个由maven工程搭建的项目相比较，你会发现maven项目要小的多！原因主要是因为前面WEB程序要运行，我们必须将项目运行所需的Jar包复制到工程目录中，从而导致了工程很大。而maven项目通过在`pom.xml`文件中添加所需jar包的坐标，这样就很好的避免了jar直接引入进来，在需要用到jar包的时候，只要查找`pom.xml`文件，再通过`pom.xml`文件中的坐标，到一个专门用于存放jar包的仓库(maven仓库)中根据坐标从而找到这些jar包，再把这jar包拿去运行，当然就很小了。

{%  endnote %}

maven在美国是一个口语化的词语，代表专家、内行的意思。一个对maven比较正式的定义是这么说的：maven是一个项目管理工具，它包含了一个**项目对象模型** (POM：Project Object Model)，一组**标准集合**，一个**项目生命周期**(Project Lifecycle)，一个**依赖管理系统**(Dependency Management System)，和用来运行定义在**生命周期阶段**(phase)中**插件**(plugin)**目标**(goal)的逻辑。

maven的一个核心特性就是依赖管理。当我们涉及到多模块的项目（包含成百个模块或者子项目），管理依赖就变成一项困难的任务。maven展示出了它对处理这种情形的高度控制。

#  Maven的使用

我们一般从官网([Maven – Welcome to Apache Maven](https://maven.apache.org/))下载最新版的maven解压到一个没有空隔没有中文的路径下就好了，一定要记住这个路径，以后会经常用到的。

然后我们需要配置好环境变量，和配置JDK环境变量一样，为了让电脑能识别到它，配好之后打开命令行，输入`mvn -v`，如果弹出一些版本信息，说明你已经配置好了。我的是这样的：

```bash
C:\Users\Chris>mvn -v
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
Maven home: D:\Development\Maven\apache-maven-3.6.3\bin\..
Java version: 1.8.0_251, vendor: Oracle Corporation, runtime: D:\Development\Java\JDK8\jre
Default locale: zh_CN, platform encoding: GBK
OS name: "windows 10", version: "10.0", arch: "amd64", family: "windows"
```

最开始的时候，我们是不用IDEA运行的，直接在命令行输入指令。

#  Maven的目录结构

打开maven目录，或者在该目录下打开命令行输入`tree`，我们可以看到：

```bash
D:\Development\Maven\apache-maven-3.6.3>tree
├─bin
├─boot
├─conf
│  └─logging
└─lib
    ├─ext
    └─jansi-native
        ├─freebsd32
        ├─freebsd64
        ├─linux32
        ├─linux64
        ├─osx
        ├─windows32
        └─windows64

```

分别来解释一下各个目录的大概作用。

| 目录 | 作用                                        |
| ---- | ------------------------------------------- |
| bin  | 存放了maven命令，比如mvn tomcat:run         |
| boot | 存放了一些maven本身的引导程序，如类加载器等 |
| conf | 存放了maven的一些配置文件，如setting.xml    |
| lib  | 存放了maven本身运行所需要的一些jar包        |

# Maven仓库

maven仓库一般分为三种：

## 1.本地仓库

用来存储从{% label primary @远程仓库 %}或{% label info @中央仓库 %}下载的插件和jar包，项目使用一些插件或jar包，优先从本地仓库查找
默认本地仓库位置在 `${user.dir}/.m2/repository`，${user.dir}表示 Windows 用户目录。比如我的就是`C:\Users\Chris`。

## 2.远程仓库

如果本地需要插件或者jar包，本地仓库没有，默认去远程仓库下载。远程仓库可以在互联网内也可以在局域网内。公司里面一般为了在没网的时候也能写项目，用得就是这个。

## 3.中央仓库

在maven软件中内置一个远程仓库地址 https://repo1.maven.org/maven2 ，它是中央仓库，服务于整个互联网，它是由maven团队自己维护，里面存储了非常全的jar包，加起来有几个G了，它包含了世界上大部分流行的开源项目构件。当然我们平时写代码肯定只用了其中的一小部分。

# Maven常用命令

我们可以在命令行中通过一系列的maven命令来对我们的maven-helloworld工程进行编译、测试、运行、打包、安装、部署。

## mvn compile

compile是maven工程的编译命令，执行`mvn compile`后，将src/main/java下的文件编译为class文件输出到target目录下。

## mvn test

test是maven工程的测试命令，`mvn test`会执行src/test/java下的单元测试类。作用除了编译src/main/java下的文件，同时也编译了src/main/test下的文件，输出到target目录下。

## mvn package

package是maven工程的打包命令，对于Java工程执行 `mvn package`打成jar包，对于WEB工程打成war包。

## mvn install

install是maven工程的安装命令，执行 `mvn install` 将maven打成jar包或war包发布到本地仓库。

> 从运行结果中，不难看出，当后面的命令执行时，前面的操作过程也都会自动执行。

## mvn clean

clean是maven工程的清理命令，执行`mvn clean`会删除target目录及内容。

# Maven生命周期

我第一次听到`生命周期`这个词时就觉得很生动，把项目构建的过程比作一个人的生命历程，从出生到童年，到少年，到中年，到老年，最后死亡🏃‍♂️。

maven对项目构建过程分为三套相互独立的生命周期，请注意这里说的是“三套”，而且“相互独立”，这三套生命周期分别是：

- Clean Lifecycle 在进行真正的构建之前进行一些清理工作。

- Default Lifecycle 构建的核心部分，编译，测试，打包，部署等等。

- Site Lifecycle 生成项目报告，站点，发布站点。

## 1.Clean Lifecycle

clean生命周期的目的是**清理项目**，它包含三个阶段：

- `pre-clean`执行一些清理前需要完成的工作。
- `clean`清理上一次构建生成的文件。
- `post-clean`执行一些清理后需要完成的工作。

## 2.Default Lifecycle

default 生命周期定义了**真正构建时所需要执行的所有步骤**，它是所有生命周期中最核心的部分，其包含的阶段如下，这里只对重要的阶段进行解释：

- `validate`
- `initialize`
- `generate-sources`
- `process-sources`处理项目主资源文件。一般来说，是对`src/main/resources`目录的内容进行变量替换等工作后，复制到项目输出的主`classpath`目录中。
- `generate-resources`
- `process-resources`
- `compile`编译项目的主源码。一般来说，是编译`src/main/java`目录下的`Java`文件至项目输出的主`classpath`目录中。
- `process-classes`
- `generate-test-sources`
- `process-test-sources`处理项目测试资源文件。一般来说，是对`src/test/resources`目录的内容进行变量替换等工作后，复制到项目输出的测试`classpath`目录中。
- `generate-test-resources`
- `process-test-resources`
- `test-compile`编译项目的测试代码。一般来说，是编译src/test/java目录下的Java文件至项目输出的测试classpath目录中。
- `process-test-classes`
- `test`使用单元测试框架运行测试，测试代码不会被打包或部署。
- `prepare-package`
- `package`接受编译好的代码，打包成可发布的格式，如JAR。
- `pre-integration-test`
- `integration-test`
- `post-integration-test`
- `verify`
- `install`将包安装到Maven本地仓库，供本地其他Maven项目使用。
- `deploy`将最终的包复制到远程仓库，供其他开发人员和Maven项目使用。

## 3.Site Lifecycle

site生命周期的目的是**建立和发布项目站点**。该生命周期包含如下阶段：

- `pre-site`执行一些在生成项目站点之前需要完成的工作。
- `site`生成项目站点文档。
- `post-site`执行一些在生成项目站点之后需要完成的工作。
- `site-deploy`将生成的项目站点发布到服务器上。

参考博客：[Maven生命周期_栋先生-CSDN博客](https://blog.csdn.net/wangdong5678999/article/details/72848044)