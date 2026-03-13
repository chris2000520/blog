---
title: Linux初体验
tags:
  - Linux
  - Shell
date: 2021-05-06 21:50:08
categories: 笔记
---

# Linux与Shell编程

## Linux介绍

### 历史

1991年，芬兰赫尔辛基大学的学生🧑Linus Torvalds在Intel 386个人计算机上开发了Linux核心，并利用Internet发布了源码，从而创建了Linux操作系统。之后，有许多大佬给它不断完善，改进和提高。近年来，Linux得到了许多硬件公司的支持，他们开发Linux应用软件，将Linux系统的应用推向各个领域。Linux成功的意义不仅在于Linux操作系统本身，还在于Linus多建立的全新的软件开发方法和GNU精神。自由软件从此变得流行起来。

### 特点

1. 与UNIX系统兼容。现在的Linux已经具有了全部UNIX的特征，遵循IEEE POSIX标准的操作系统。Linux系统上使用的命令多数与UNIX命令在名称，格式，功能上相同。

2. 自由软件和源码公开。这也是我们经常说的，不像Windows操作系统是封闭的，Linux是开放的。从一开始它就与GNU项目紧密结合起来，许多重要组成部分直接来自于GNU项目。任何人都可以自由使用Linux源程序来开发，激发了全世界人们的创造力。而且通过Internet，这一软件得到迅速传播和广泛使用。

3. 性能高和安全性强。在相同硬件环境下，Linux也可以提供各种高性能的服务。Linux还提供了先进的网络支持。因为源码是公开的，所以可以消除系统中是否有“后门”的疑惑。

4. 互操作性高。Linux能够以不同的方式实现与非Linux系统的不同层次的互操作。比如客户-服务器，工作站，仿真等。
5. 全面多任务和真正的32位操作系统。Linux允许多个用户同时在一个系统上运行多道程序，支持多种硬件平台。

### 版本

Linux有两种版本：核心（Kernel）版本和发行（Distribution）版本。

核心版本主要是Linux内核，创始人在不断开发和推出新的内核，内核版本由Linus Torvalds本人维护着。版本号由三部分数字构成，其形式为：

```bash
major.minor.patchlevel
```

其中，major为主版本号，minor为次版本号，patchlevel表示对当前版本的修订次数。

发行版本是由各个公司推出的版本，通常将安装界面，系统设定，管理工具集成在一起，构成一个套件，从而方便用户使用，尽管这样，普通用户使用Linux发行版本的人数还是很少，软件支持的也少。目前，有Red Hat，Debian，Ubuntu，红旗Linux，Deepin等发行版。

## Linux命令

### 简单命令

#### 1.who

`who`列出所有正在使用系统的用户，所用终端名和注册到系统的时间。而`whoami`将列出当前用户信息。

   ```bash
   $ who
   chris    :0           2021-05-07 17:43 (:0)
   $ whoami 
   chris
   ```

#### 2.echo

将命令行中参数标准输出，相当于`cout`，`printf`。要注意空格折叠的问题，例如：

   ```bash
   $ echo Hello world
   Hello world
   $ echo 'bye    bye'
   bye    bye
   $ echo bye    bye
   bye bye
   ```

#### 3.date

用来显示当前日期和时间，例如：

```bash
$ date
Fri May  7 17:14:49 CST 2021
```

#### 4.cal

用来显示公元1~9999年中任意一年或者一个月的日历，第一个参数为月份（也可以用英文缩写表示），第二参数为年份，若不写参数，则显示当前月份的日历，例如：

```bash
$ cal 2 2021
   February 2021
Su Mo Tu We Th Fr Sa
    1  2  3  4  5  6
 7  8  9 10 11 12 13
14 15 16 17 18 19 20
21 22 23 24 25 26 27
28
```

#### 5.clear

用来清除屏幕上的信息。清屏后，提示符移到屏幕左上角。例如：

```bash
$ clear
$ _
```

#### 6.passwd

用来修改口令，也就是密码。Linux的安全特性允许用户控制自己的口令，输入后，按照提示来就可修改密码，出于安全考虑，输入的密码都不会在屏幕上显示，所以不要以为自己的键盘⌨坏了哟。例如：

```bash
$ passwd
Change password for user chris
(current) UNIX password:
New UNIX password:
Retype new UNIX password:
passwd:all authentication tokens updated successfully.
```

#### 7.pwd

用来显示当前工作目录，全称为`Print Working Directory`。例如：

```bash
$ pwd
/home/chris/Downloads
```

#### 8.cd

用来进入某个文件夹，全称为`Change Directory`，也就是改变工作目录。例如：

```bash
~$ cd Downloads
Downloads$ _
```

#### 9.rm

用来删除文件或者目录下的文件，不加任何参数的话，只能删除文件，不能删除文件夹，全称为`Remove`。注意， 该命令是一个危险的命令，使用的时候要特别当心，尤其对于新手，否则整个系统就会毁在这个命令（比如在根目录下执行`rm -rf /*`）。所以，我们在执行rm之前最好先确认一下在哪个目录，到底要删除什么东西，操作时保持高度清醒的头脑。

| 参数 | 作用                               |
| ---- | ---------------------------------- |
| -f   | 忽略不存在的文件，不会出现警告信息 |
| -r   | 递归删除，后可接上文件夹           |
| -v   | 显示指令的详细执行过程             |
| -i   | 删除前会询问用户是否操作           |

```bash
$ rm -r Study
$ rm hello.c
```

#### 10.cp

用来对文件进行复制，全称为`Copy`。后面的文件可以不存在，系统会帮你创建。例如：

```bash
$ cp hello.c h.c
```

#### 11.mv

用来对文件或文件夹进行移动，全称为`Move`如果文件或文件夹存在于当前工作目录，还可以对文件或文件夹进行重命名。例如：

```bash
$ mv hello.c /home/chris/Downloads
```

#### 12.cat

用来在标准输出（监控器或屏幕）上查看文件内容，全称为`Concatenate and Print Files`。例如：

```c
$ cat hello.c
#include<stdio.h>
int main()
{
        printf("Hello World!");
        return 0;
}
```

### 快乐命令

#### 1.sl

你会看到火车🚄从屏幕右边开往左边。相关的参数可以去搜一下。

安装：

```bash
$ sudo apt-get install sl
```

运行：

```bash
$ sl
```

可以来个恶作剧，把`ls`和`sl`绑定在一起哈哈哈哈。

#### 2.fortune

输出一句话，有笑话🤗，名人名言🙍‍♂️，唐诗宋词📔等等。

安装：

```bash
$ sudo apt-get install fortune
```

运行：

```bash
$ fortune
```

#### 3.cowsay

用ASCII字符打印牛🐂，羊🐏等动物，哈哈哈，快来试试吧！

安装：

```bash
$ sudo apt-get install cowsay
```

运行：

```bash
$ cowsay "I am a cool boy"
$ cowsay -f tux "wuwuwu"
```

## 重定向

标准输入重定向（STDIN，文件描述符为0）：默认从键盘输入，也可从其他文件或命令中输入。

标准输出重定向（STDOUT，文件描述符为1）：默认输出到屏幕。

错误输出重定向（STDERR，文件描述符为2）：默认输出到屏幕。

常用小技巧😄，将命令执行的标准输出重定向到一个文件中（清空原有文件的数据），例如：

```bash
$ pwd > file.txt
$ cat file.txt
/home/chris
```

将错误输出重定向到一个文件中（清空原有文件的数据），例如：

```bash
$ pwd 2> file.txt
```

将标准输出重定向到一个文件中，注意和第一个不同，这个`>>`是追加到原有内容的后面，不会清空原有数据，同理，也能将错误输出重定向到文件中（追加），继续上面的操作来，例如：

```bash
$ pwd >> file.txt
$ cat file.txt
/home/chris
/home/chris
$ pwd 2>> file.txt
```

最后是将标准输出与错误输出共同写入到文件中（追加到原有内容的后面用`>>`，覆盖原有用`>`），有两种方法，例如：

```bash
$ pwd >> file.txt 2>&1
$ pwd &>> file.txt
```

## 管道符

`|`在键盘上👆按下<kbd>Shift</kbd>+<kbd>\\</kbd>就可以看到管道符啦。其执行格式为`oder A | oder B`。管道符的作用，用我们老师的话来说就是把前一个命令的输出当作后一个命令的输入，是不是好懂些了？例如：

```bash
$ ls -l | wc -l 
```

这个命令的解释就是列出当前目录的文件，然后统计其行数，当然，文件list是不会在屏幕上显示的，因为它又被当作输入了。因此，最后的结果仅仅为一个数。

```bash
7
```

这个管道符就像一个法宝，可以将它套用到其他不同的命令上。

## 通配符

大家可能都有提笔忘字的时候，程序员也不例外，当然，我们是敲盘忘字。比如说我们想找一个文件名以a开头的文件，又隐隐约约记不得后面的单词了，这个时候，通配符就可以大展身手了🤝。

| 通配符    | 匹配含义       |
| --------- | -------------- |
| *         | 任意字符       |
| ？        | 单个任意字符   |
| [a-z]     | 单个小写字母   |
| [A-Z]     | 单个大写字母   |
| [0-9]     | 单个数字       |
| [:alpha:] | 任意字母       |
| [:upper:] | 任意大写字母   |
| [:lower:] | 任意小写字母   |
| [:digit:] | 所有数字       |
| [:alnum:] | 任意字母加数字 |
| [:punct:] | 标点符号       |

通配符还可以和大括号`{}`结合起来用，字段之间用逗号`,`间隔，例如：

```bash
$ echo file{1,2,3,4}
file1 file2 file3 file4
```

## 转义符

为了能够更好地理解用户的表达，Shell解释器还提供了特别丰富的转义字符来处理输入的特殊数据。在网上找到了4个最常用的转义字符🙋‍♂️！

- 反斜杠（\）：使反斜杠后面的一个变量变为**单纯的字符**。

- 单引号（''）：转义其中所有的变量为**单纯的字符串**。

- 双引号（""）：**保留**其中的变量属性，不进行转义处理。

- 反引号（``）：把其中的命令**执行后返回结果**，其中放的是像ls，pwd，date类似的命令。

下面看几个例子：
```bash
$ price=2
$ echo "Price is $price"
Price is 5
```

可以看到我们想要输出的美元符号不见了，不标明货币单位，那有时候可能会出大问题的哦👊。那我们想要输出美元符号，应该怎么做呢？聪明的你应该猜到了。

```bash
echo "Price is $$price"
Price is 3577price
```

很不幸的是，$$刚好是显示当前程序的进程ID号码，所以结果还是不对。正确的应该是这样的：

```bash
echo "Price is \$$price"
Price is $5
```

反引号的例子如下：

```bash
$ echo `pwd`
/home/chris/bin
```

就是先执行反引号里的命令，然后再标准输出到屏幕上。

单引号是最简单的啦，最单纯的，不管里面有啥东西，照搬着输出就可以了。例如：

```bash
$ echo '$price is \$price'
$price is \$price
```

以上的转义字符都不容易出错，而什么时候该用双引号却是一个问题。因为好像大多数情况下加不加效果都一样：

```bash
$ echo "aaa bbb ccc"
aaa bbb ccc
$ echo aaa bbb ccc
aaa bbb ccc
```

区别在于用户无法得知第一种执行方式中到底有几个参数，是的，不能确定！因为有可能把“aaa bbb ccc”当作了一个参数整体直接输出到了屏幕，也有可能是分别将aaa、bbb和ccc输出到了屏幕。

```markdown
{% note success %}

给大家总结一个简单小技巧，就是参数中如果出现了空格，那么就加双引号，如果参数中没有空格，那就不用加。（来自刘遄老师的小提示）

{% endnote %}
```

## 环境变量

变量是计算机系统里用于保存可变值的数据类型。在Linux系统中，变量名称一般都是大写的，而命令都是小写的，也算一种规范了。下面我们来看看最基本的变量。如下表所示：

| 变量名称 | 作用                             |
| -------- | -------------------------------- |
| HOME     | 用户的主目录（家目录）           |
| SHELL    | 用户在使用的Shell解释器名称      |
| HISTSIZE | 输出的历史命令记录条数           |
| MAIL     | 邮件保存路径                     |
| LANG     | 系统语言                         |
| RANDOM   | 随机数字                         |
| PATH     | 定义解释器搜索用户执行命令的路径 |
| PS1      | Bash解释器的提示符               |
| EDITOR   | 用户默认文本编辑器               |

{% note warning %}

Linux作为一个多用户多任务的操作系统，能够为每个用户提供独立的、合适的工作运行环境，因此，一个相同的变量会因为用户身份的不同而具有不同的值。

{% endnote %}

我们可以使用下述命令来查看变量的值：

```bash
$ echo $HOME
/home/chris
```

其实变量是由固定的变量名与用户或者系统设置的变量两部分组成的，完全可以自行创建变量。例如设置名叫`WORKDIR`的变量：

```bash
$ mkdir /home/workdir
$ WORKDIR=/home/workdir
$ cd $WORKDIR
$ pwd
/home/workdir
```

但是此时的变量不具有全局性，格局小了呀🤨，不能被其他用户使用，但是我们可以使用`export`命令将其提升为全局变量。

```bash
$ export WORKDIR
$ su ordinary
$ cd $WORKDIR
$ pwd
/home/workdir
```

后面要是不用这个变量了，也可以取消它：

```bash
$ unset WORKDIR
```

{% note warning %}

直接在终端设置的变量能够立即生效，但重启服务器后就会消失掉，因此我们需要将变量和变量值写入到.bashrc或者.bash_profile文件中以确保永久能使用它们。

{% endnote %}

## Vim技巧

在Linux中，命令行中也能编辑文本，这时就能用到vim了。基本上vim共分为三种模式，分别是**命令模式（Command mode）**，**输入模式（Insert mode）**和**底线命令模式（Last line mode）**。

### 命令模式

当我们打开vim编辑文件的时候，我们首先进入的就是命令模式，此时你按键盘输入，文本上是不会显示的，而是被当作一个命令。常用的有：

- `i` 切换到输入模式，以输入字符。
- `x` 删除当前光标所在处的字符，最后还是停留在命令模式。
- `:` 切换到底线命令模式，以在最底一行输入命令。

### 输入模式

基本就是正常输入，有几个要注意的：

- 按下<kbd>Insert</kbd>，切换光标为输入/替换模式。
- 按下<kbd>Esc</kbd>，退出输入模式，切换到命令模式。

### 底线命令模式

在命令模式下按下`:`就进入了底线命令模式。底线命令模式可以输入单个或多个字符的命令，可用的命令非常多。

在底线命令模式中，基本的命令有（已经省略了冒号）：

- `w`将编辑的数据写入硬件中，也就是保存。
- `q`离开退出vim。
- `q!`强制退出vim，没有保存修改。
- `wq`保存退出。
- `ZZ`大写的Z，如果修改过，保存当前文件，然后退出。
- `dd`删除光标所在的一整行。
- `set nu`为vim设置行号。
- `set nonu`取消vim中的行号。

## Shell编程

### Shell简介

shell可以理解为一种脚本语言，像javascript等其它脚本语言一样，只需要一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以shell脚本的本质是：以某种语法格式将shell命令组织起来的由shell程序解析执行的脚本文本文件。主要包括三个部分：

1. **shell命令**：即`ls/cd`等linux命令，详细可参考[shell命令](http://codetoolchains.readthedocs.io/en/latest/4-Linux/2-shellcmd/index.html)。
2. **shell解释器**：即`sh/bash/zsh`等shell应用程序，详细可参考[shell应用程序。](http://codetoolchains.readthedocs.io/en/latest/4-Linux/1-shellenv/1-shellsoft/index.html)
3. **shell语法**：即`数据类型/变量/控制流语句/函数`等编程语法。

### 脚本结构

像学习我们的第一门编程语言，C语言时，我们现在也来模仿着写一个Hello World的程序，虽然可能现在搞不明白它的结构和过程，但是没关系，大家都是这么过来的。先创建一个demo.sh文件，然后进去编辑它：

```bash
$ vim demo.sh
```

```bash
#!/bin/bash
# 这行是注释信息
str="Hello World"

test(){
        echo $str
}

test echo_str
```

写完后输入`:wq`保存退出，然后运行脚本。脚本都以`#!/bin/bash`开头，`#`称为`sharp`，`!`在unix行话里称为`bang`，合起来简称就是常见的`shabang`。是不是很搞笑，同时也突然觉得自己变成高手了🐶。而运行脚本文件的方法有两种：

1. 将脚本作为bash解释器的参数执行：此时首行的`#!/bin/bash`shabang可以不用写。
2. `chmod +x demo.sh`：给脚本添加执行权限,`./demo.sh`：执行脚本文件。

最后Hello World就会出现在终端上：

```bash
Hello World
```

### Shell变量

| 变量 | 含义                                         |
| ---- | -------------------------------------------- |
| $$   | Shell本身的PID                               |
| $!   | Shell最后运行的后台Process的PID              |
| $?   | 最后运行代码的返回值                         |
| $*   | 所有参数列表                                 |
| $@   | 所有参数列表(好像并没有什么不同，我也不知道) |
| $#   | 参数的个数                                   |
| $0   | Shell脚本的文件名                            |
| $1~n | 各个参数的值                                 |

例如：

```bash
#!/bin/bash
echo "$$"
echo "$!"
echo "$?"
echo "$*"
echo "$@"
echo "$#"
echo "$0"
echo "$1"
echo "$2"
```

```bash
$ bash demo.sh zwy 2
91

0
zwy 2
zwy 2
2
demo.sh
zwy
2
```