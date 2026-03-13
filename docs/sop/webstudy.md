---
title: 前端与.Net笔记
toc: true
tags:
    - Web
    - HTML
    - CSS
    - JS
    - .Net
abbrlink: "838e9149"
date: 2020-11-24 16:19:07
updated: 2020-12-03 23:44:00
categories: 笔记
---

<!-- .NET 复习文档，仅供参考。努力学习 JavaScript，才能成为大佬。

more -->

# 复习大纲

## HTML

### 常见的块级元素和行内元素

#### 块级元素

div、p、h1~h6、ul、ol、dl（描述列表）、li、dd（描述）、table、hr（分隔）、blockquote（块引用）、address、table、menu、pre（预格式化的文本，保留空格），HTML5 新增的 header、section、aside（侧边栏）、footer。

#### 行内元素

span、img、a、lable、input、abbr（缩写）、em（强调）、big、cite（引用）、i（斜体）、q（短引用）、textarea、select、small、sub、sup，strong、u（下划线）、button（默认 display：inline-block）

### ul 和 ol 区别

ul 是项目列表，li 做列表项，每一项的符号默认是小黑圆点；ol 是编号列表，li 做列表项，每一项的符号默认是数字；li 是 list item 即列表项，但列表有很两种，所以外面得有 ul 或者 ol 用来区别无序列表（小点点）和有序列表（1，2，3）。

### video 标签支持的视频格式

| 格式 | 描述                                                   |
| ---- | ------------------------------------------------------ |
| MP4  | MPEG4 文件使用 H264 视频编解码器和 AAC 音频编解码器    |
| WebM | WebM 文件使用 VP8 视频编解码器和 Vorbis 音频编解码器   |
| Ogg  | Ogg 文件使用 Theora 视频编解码器和 Vorbis 音频编解码器 |

通过上面的信息我们会发现只有 h264 编码的 MP4 视频（MPEG-LA 公司）、VP8 编码的 webm 格式的视频（Google 公司）和 Theora 编码的 ogg 格式的视频（iTouch 开发）可以支持 HTML5 的 video 标签。

### input 标签

| 类型     | 描述                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| text     | 单行的输入文本字段，用户可在其中输入文本。默认宽度为 20 个字符。单行文本字段。换行符将自动从输入值中删除。             |
| checkbox | 复选框。 允许选择/取消选择单个值的复选框。                                                                       |
| password | 定义密码字段。该字段中的字符被掩码。值被隐藏的单行文本字段。使用 maxlength 和 minlength 属性指定 可输入值的最大长度。 |
| hidden   | 隐藏的输入值: 定义隐藏的输入字段。不显示但其值提交给服务器的控件。                                                 |
| file     | 选择文件. 定义输入字段和 "浏览"按钮，供文件上传。允许用户选择文件的控件。 使用 accept 属性定义控件可以选择的文件类型。 |
| button   | 可点击的按钮。一个没有默认行为的按钮。                                                                           |
| radio    | 单选按钮。一个单选按钮，允许从多个选项中选择一个值。                                                              |
| reset    | 重置按钮。重置按钮会 清除表单中的所有数据。将表单内容重置为默认值的按钮。                                           |
| submit   | 提交按钮。提交按钮会把表单数据发送到服务器。提交表单的按钮。                                                       |
| image    | 图像形式的提交按钮。一个图形化的提交按钮。必须使用 src 属性定义图像的源，使用 alt 属性定义替代文本。可以使用 height 高度和 width 宽度属性，以像素为单位，定义图像的大小。 |

### form 标签

| 标签     | 描述                                        |
| -------- | ------------------------------------------- |
| select   | 定义了下拉选项列表                          |
| input    | 创建一个最简单的文本输入框                  |
| textarea | 输入多行、多字数文本                        |
| label    | label 是 input 的描述，它本身不会有特殊效果 |

### 锚点

跳转到当前页面的一个锚点，一般用`id`值。

```html
<a href="#post">第三段</a> 点击跳到第三段部分
<div id="post">文章第三段</div>
<a href="#"> TOP</a> 点击跳到顶部
```

### HTML DOM

在 HTML DOM 中，所有事物都是节点。DOM 是被视为节点树的 HTML。

{% note info %}
HTML 文档中的所有内容都是节点：整个文档是一个文档节点，每个 HTML 元素是元素节点，HTML 元素内的文本是文本节点，每个 HTML 属性是属性节点，注释是注释节点。
{% endnote %}

#### 例子

element 的`innerHTML`属性设置或获取 HTML 语法表示的元素的后代。用 innerHTML 插入文本到网页中并不罕见。但这有可能成为网站攻击的媒介，从而产生潜在的安全风险问题。

tr 的`rowIndex`属性，返回某一行(rows)在表格的行集合中的位置（row index），索引从零开始。

table 的`deleteRow()`方法，用于从表格删除指定位置的行。

HTMLSelectElement的`selectedIndex`属性是一个长整型数，它反映了被选中的第一个option元素的下标值。值为-1时表明没有元素被选中。

## CSS

### 作用

CSS 是 Cascading Style Sheets（层叠样式表单）的简称，CSS 就是一种叫做样式表（stylesheet）的技术，也有的人称之为“层叠样式表”（Cascading Stylesheet）。

在主页制作时采用 CSS 技术，可以有效地对页面的布局、字体、颜色、背景和其它效果实现更加精确的控制。

只要对相应的代码做一些简单的修改，就可以改变同一页面的不同部分，或者页数不同的网页的外观和格式。

CSS 大部分代码对大小写不敏感。

### 常用选择器

| 选择器         | 描述                                           |
| -------------- | ---------------------------------------------- |
| 类选择器       | 通过类名进行选择.test                          |
| id 选择器      | 通过 id 进行选择#test                          |
| 标签选择器     | 通过 id 进行选择 span                          |
| 分组选择器     | 可一次选择多个标签以设置相同样式 p,a,li        |
| 后代选择器     | 选择某个标签的所有后代以设置相同样式 div ul li |
| 通用选择器     | 选择所有标签以设置相同样式\*                   |
| 兄弟选择器     | 选择兄弟关系的标签设置样式 p+a                 |
| 直接父子选择器 | 选择父子关系的标签中子标签设置样式 div->p      |

### 常用属性

#### text-align 
属性定义行内内容如何相对它的块父元素对齐。text-align并不控制块元素自己的对齐，只控制它的行内内容的对齐。center为居中对齐，right为右对齐，justify为两端对齐文本效果。

#### text-decoration 
设置文本的修饰线外观，none就是没有下划线，underline为下划线，overline为上划线，line-through为删除线，默认值为underline。

#### line-height 
行高，通常用来设置垂直居中。

#### text-shadow 
速写属性依次为：阴影，水平方向偏移量，垂直方向偏移量，模糊度，阴影颜色。

#### background-repeat 
表示设置该元素平铺的方式，默认值为repeat。no-repeat，图片不会重复，space，图片会尽可能重复，但不会裁剪，repeat-x或-y，在水平方向或者垂直方向上重复。

#### list-style-type
设置列表元素的marker，比如圆点、符号、或者自定义计数器样式。disc为实心圆点 (默认值)，circle为空心圆点，square为实心方块，decimal为十进制阿拉伯数字。

### 盒模型

box：盒子，每一个元素在页面中都会生成一个矩形区域（盒子）。

盒子类型：

1. 行盒，display 等于 inline 元素

2. 块盒，display 等于 block 元素

{% note success %}

行盒在页面中不换行，块盒独占一行。

display 默认值是 inline。

浏览器默认样式表设置的块盒：容器元素，h1~h2，p。

常见的行盒：span,a,img,video,audio。

{% endnote %}

#### 盒子的组成部分

无论是行盒，还是块盒，都由下面几个部分组成，从内到外分别是：

1. 内容 content  
   width，height，设置的是盒子的内容的宽高。
2. 填充 padding  
   padding 的简写属性，写四个，代表上，右，下，左。写两个，代表上下，左右，写一个，代表上下左右等宽，三个代表，上，左右，下。
   padding-top，padding-right，padding-bottom，padding-left。
   填充区+内容区= **填充盒 padding-box**。
3. 边框 border  
   没有设置颜色，默认字体颜色
   有箭头，表示这个属性为速写属性，同上 padding。
   border:宽度 样式 颜色。
4. 外边距 margin  
   盒子与盒子之间的距离。

### 定位

CSS 中 position 属性用于指定一个元素在文档中的定位方式。top，right，bottom 和 left 属性则决定了该元素的最终位置。

#### 常见语法

```
static | relative | absolute | sticky | fixed
```

##### 相对定位

相对定位的元素是在文档中的正常位置偏移给定的值，但是不影响其他元素的偏移。

##### 绝对定位

相对定位的元素并未脱离文档流，而绝对定位的元素则脱离了文档流。在布置文档流中其它元素时，绝对定位元素不占据空间。绝对定位元素相对于最近的非 static 祖先元素定位。当这样的祖先元素不存在时，则相对于 ICB（inital container block, 初始包含块）。

### 浮动

CSS 中的 float 属性指定一个元素应沿其容器的左侧或右侧放置，允许文本和内联元素环绕它。该元素从网页的正常流动(文档流)中移除，尽管仍然保持部分的流动性。

#### 常见语法

```
right | left | none | inline-start | inline-end
```

#### 清除浮动

元素浮动之后，周围的元素会重新排列，为了避免这种情况，使用 clear 属性。
clear 属性指定元素两侧不能出现浮动元素。

### 更新

关键帧`@keyframes`规则通过在动画序列中定义关键帧（或 waypoints）的样式来控制 CSS 动画序列中的中间步骤。和转换 transition 相比，关键帧可以控制动画序列的中间步骤。具体[请看这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes)。

动画`animation`JavaScript 动画是通过对元素样式的逐渐变化进行编程来完成的。更改由计时器调用。当计时器间隔小时，动画看起来是连续的。具体[请看这里](https://developer.mozilla.org/zh-CN/docs/Web/API/Animation)。

变换`transform`属性允许你旋转，缩放，倾斜或平移给定元素。这是通过修改 CSS 视觉格式化模型的坐标空间来实现的。具体[请看这里](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)。

实现一个圆形转动的动态加载效果。

```css
<style>
    .loader{
        border: 16px solid #008c8c;
        border-radius: 50%;
        border-top: 16px solid #ed4b82;
        width: 90px;
        height: 90px;
        animation: spin 2s linear infinite;
    }
    @keyframes spin {
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }
</style>
```

```html
<body>
    <div class="loader"></div>
</body>
```

## JS

### 入门

JavaScript（缩写：JS）是一门完备的 动态编程语言。当应用于 HTML 文档时，可为网站提供动态交互特性。

#### 变量

变量是存储值的容器。要声明一个变量，先输入关键字 let 或 var，然后输入合适的名称。

```js
let myVariable;
```

| 变量    | 解释                                                                    | 示例                                                                     |
| ------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| String  | 字符串（一串文本）：字符串的值必须用引号（单双均可，必须成对）扩起来。  | let myVariable = '赵吴涯';                                               |
| Number  | 数字：无需引号。                                                        | let myVariable = 10;                                                     |
| Boolean | 布尔值（真 / 假）： true/false 是 JS 里的特殊关键字，无需引号。         | let myVariable = true;                                                   |
| Array   | 数组：用于在单一引用中存储多个值的结构。                                | let myVariable = [1, '赵吴涯', '徐付瑞', 10];                            |
| Object  | 对象：JavaScript 里一切皆对象，一切皆可储存在变量里。这一点要牢记于心。 | let myVariable = document.querySelector('h1');以及上面所有示例都是对象。 |

#### 函数

和 C，Java 一样，JS 也可以自定义函数。

```js
function multiply(num1, num2) {
    let result = num1 * num2;
    return result;
}
```

##### 常用函数
WindowOrWorkerGlobalScope的`setInterval()`方法重复调用一个函数或执行一个代码段，在每次调用之间具有固定的时间延迟。
```js
var intervalID = scope.setInterval(func, delay, [arg1, arg2, ...]);
var intervalID = scope.setInterval(code, delay);
```
- func：执行时触发的函数。
- code：可选，传递一个字符串来代替一个函数对象。
- delay：延迟的秒数，单位时毫秒。
- arg：当定时器过期的时候，将被传递给func指定函数的附加参数。

{% note warning %}
setInterval()方法会不停地调用函数，直到clearInterval()被调用或窗口被关闭。由 setInterval()返回的 ID 值可用作 clearInterval()方法的参数。

如果你只想执行一次可以使用setTimeout()方法。
{% endnote %}

#### Web API接口
window.location只读属性，返回一个 Location  对象，其中包含有关文档当前位置的信息。

简单例子，显示当前网站的URL。
```js
alert(location); 
```
一般用法，导航到一个新的界面。
```js
window.location = "http://www.example.com"
```
强制从服务器重新加载当前页面
```js
window.location.reload(true);
```
更多用法[请看这里](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location)。

Node.parentElement返回当前节点的父元素节点，如果该元素没有父节点，或者父节点不是一个 DOM 元素，则返回 null。

Node.insertBefore()方法在参考节点之前插入一个拥有指定父节点的子节点。如果给定的子节点是对文档中现有节点的引用，insertBefore()会将其从当前位置移动到新位置，用来冒泡排序中的交换最好不过了。
#### 事件

事件能为网页添加真实的交互能力。它可以捕捉浏览器操作并运行一些代码做为响应。最简单的事件是点击事件，鼠标的点击操作会触发该事件。



```js
document.querySelector("html").onclick = function () {
    alert("Hello World");
};
```

将事件与元素绑定有许多方法。在这里选用了html元素，把一个匿名函数（就是没有命名的函数，这里的匿名函数包含单击鼠标时要运行的代码）赋值给了 html 的 onclick 属性。

| 事件    | 解释 |
| ------ | ----- |
| onkeyup | 当用户释放键盘按钮时执行 |
| onkeydown | 当用户按下所有键盘按钮时执行 |
| onkeypress | 当键盘按键被按下并释放一个键时执行 |
| onchange | 当用户改变 input 输入框内容时执行 |

{% note warning %}
onkeyup，onkeypress 仅对文本按键有效，
当按下不属于文本显示的按键（比如 Tab 键，Del 键，Shift 键）时，onkeydown 执行，而 onkeypress，onkeyup 不执行，Enter 键除外。
{% endnote %}

### JSON
#### JSON语法
JSON语法是JS对象表示语法的子集,有如下特点:
- 数据在键值对中(键名即属性名必须加双引号)
- 数据由逗号分隔
- 花括号保存对象
- 方括号保存数组

JSON可通过JavaScript进行解析，JSON值可以是：数字、字符串、逻辑值、数组(在中括号中)、对象(在大括号中)、null。

{% note warning%}
注意JSON不能存储Date对象，如果需要则用字符串表示。
{% endnote%}


`JSON.stringify()`方法将一个 JavaScript 对象或值转换为 JSON 字符串，如果指定了一个 replacer 函数，则可以选择性地替换值，或者指定的 replacer 是数组，则可选择性地仅包含数组指定的属性。

#### 案例

### 正则表达式

#### 开始

使用一个正则表达式字面量，其由包含在斜杠之间的模式组成，如下所示：

```js
var re = /ab+c/;
```

脚本加载后，正则表达式字面量就会被编译。当正则表达式保持不变时，使用此方法可获得更好的性能。

或者调用 RegExp 对象的构造函数，如下所示：

```js
var re = new RegExp("ab+c");
```

在脚本运行过程中，用构造函数创建的正则表达式会被编译。如果正则表达式将会改变，或者它将会从用户输入等来源中动态地产生，就需要使用构造函数来创建正则表达式。

#### 转义字符

```js
\d：数字 0-9
\D：非数字
\s：空格
\S：非空格
\w: 字符( 字母a-z 数字0-9 下划线_ )
\W: 非字符
\b: 端点 ( 起始、结束、空格 )
\B: 非端点
```

#### 修饰符

```js
i：执行对大小写不敏感的匹配。
g：执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。
m：执行多行匹配。
```

## Ajax

Asynchronous JavaScript + XML（异步 JavaScript 和 XML）， 其本身不是一种新技术，而是一个在 2005 年被 Jesse James Garrett 提出的新术语，用来描述一种使用现有技术集合的新方法，包括：HTML 或 XHTML，CSS，JavaScript，DOM，XML，XSLT,，以及最重要的 XMLHttpRequest。当使用结合了这些技术的 AJAX 模型以后，网页应用能够快速地将增量更新呈现在用户界面上，而不需要重载（刷新）整个页面。这使得程序能够更快地回应用户的操作。

## LINQ

LINQ 是 .NET Framework 3.5 的新特性，其全称是 Language Integrated Query，即语言集成查询，是指将查询功能和语言结合起来。从而为我们提供一种统一的方式，让我们能在 C#或 VB.NET 语言中直接查询和操作各种数据。

### 开始

LINQ 中最基本的数据单元是 sequences 和 elements。一个 sequence 是实现了 IEnumerable\<T>的对象，而一个 element 是 sequence 中的每一个元素。如下，names 就是一个 sequence，“Tom”，“Dick”和“Harry”则是 elements。

```c#
 string[] names = { "Tom", "David", "Jack" };
```

### 查询

查询表达式是一种使用查询语法表示的表达式，它用于查询和转换来自任意支持 LINQ 的数据源中的数据。查询表达式使用许多常见的 C#语言构造，易读简洁，容易掌握。它由一组类似于 SQL 或 XQuery 的声明性语法编写的子句组成。每一个子句可以包含一个或多个 C#表达式。这些 C#表达式本身也可能是查询表达式或包含查询表达式。

{% note warning %}
查询表达式必须以 from 子句开头，以 select 或 group 子句结束。第一个 from 子句和最后一个 select 子句或 group 子句之间，可以包含一个活多个 where 子句、let 子句、join 子句、orderby 子句和 group 子句，甚至还可以是 from 子句。
{% endnote%}

-   from 子句：指定查询操作的数据源和范围变量。
-   select 子句：指定查询结果的类型和表现形式。
-   where 子句：指定筛选元素的逻辑条件。
-   let 子句：引入用来临时保存查询表达式中的字表达式结果的范围变量。
-   orderby 子句：对查询结果进行排序操作，包括升序和降序。
-   group 子句：对查询结果进行分组。
-   into 子句：提供一个临时标识符。join 子句、group 子句或 select 子句可以通过该标识符引用查询操作中的中间结果。
-   join 子句：连接多个用于查询操作的数据源。

{% note warning %}
注意：orderby 子句默认排序方式为升序。
{% endnote %}

```c#
var gb = from u in db.Guestbooks
         where u.IsPass == true && u.UserId == UserId
         orderby u.CreatedOn descending
         select u;
```

常用的语句：u.Name.Contains("zhao")名字包含 zhao 的。

## EF

Entity Framework 是一个被微软支持的为 .NET 程序服务的开源的 ORM 框架。它使开发者能够用特定域的类对象来工作，而不是把精力集中在底层的数据表和数据存储的列上面。有了 Entity Framework ，开发者在处理数据时能够工作在一个更高的抽象层面上，并且能够用比传统程序更少的代码来创建和维护面向数据的程序。
