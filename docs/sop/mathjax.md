---
title: 在文章中使用数学公式：MathJax
tags:
  - Math
date: 2022-12-06 23:19:20
categories: 笔记
math: true
---

# 起因

最近在写一些算法方面的博客时，经常会出现比较复杂的数学公式，用键盘敲不出来，即使打出来了，效果也不是太好。最后在网上找到了`Mathjax`插件，能够比较好的在网页上渲染数学公式，就写一篇博客记录一下使用方法。

# 基本语法

- 在正文中同一行插入LaTeX公式用，使用两个`$`包含公式可以独立一行

  - 例如语句为`/$ f(x) = ax+b /$`（这里别看/，不加/它就给我渲染了😕）,显示为$ f(x) = ax+b $

- 另起一行用两个`/$$`（这里也别看/）包含公式

  - 例如语句为`$$ \int_0^tf(x)dx $$ `,显示为
  
    $$
    \int_0^tf(x)dx
    $$
    
    如果想写大一点可以在行首加上`\huge`标签

## 希腊字母

可以使用`\`+希腊字母的单词表示数学公式中的希腊字母

具体参考文档请看这里[数学公式语法——Mathjax教程 | 冲弱's Blog](https://oysz2016.github.io/post/8611e6fb.html#Mathjax简介)

# 演示

$$
\Huge f^{'}(x)=ax+b+\pi+\alpha+\beta+\gamma \tag {1.1}
$$

```
\huge f^{'}(x)=ax+b+\pi+\alpha+\beta+\gamma \tag {1.1}
```



$$
\huge 0 \neq 1 \quad x \equiv x \quad 1 = 9 \bmod 2
$$

```
\huge 0 \neq 1 \quad x \equiv x \quad 1 = 9 \bmod 2
```


$$
\huge     \int_0^xf(x)dx
$$

```
\huge     \int_0^xf(x)dx
```


$$
\huge\begin{bmatrix}
1&0&0\\
0&1&0\\
0&0&1\\
\end{bmatrix}
$$

```
\huge\begin{bmatrix}
1&0&0\\
0&1&0\\
0&0&1\\
\end{bmatrix}
```


$$
\huge\begin{cases}
a_1x+b_1y+c_1z=d_1\\
a_2x+b_2y+c_2z=d_2\\
a_3x+b_3y+c_3z=d_3\\
\end{cases}
$$

```
\huge\begin{cases}
a_1x+b_1y+c_1z=d_1\\
a_2x+b_2y+c_2z=d_2\\
a_3x+b_3y+c_3z=d_3\\
\end{cases}
```


$$
\huge\overbrace{1+2+\cdots+n}^{n个}
$$

```
\huge\overbrace{1+2+\cdots+n}^{n个}
```


$$
\huge x_{1},x_{2},\ldots,x_{5}   \quad  x_{1} + x_{2} + \cdots + x_{n}
$$

```
\huge x_{1},x_{2},\ldots,x_{5}   \quad  x_{1} + x_{2} + \cdots + x_{n}
```


$$
\huge \lim_{x \to \infty} x^2_{1} - \int_{x+y}^{5}x\mathrm{d}x + \sum_{n=1}^{20} n^{4} = \prod_{j=1}^{3} y_{j}  + \lim_{x \to -2} \frac{x-2}{x}
$$

```
\huge \lim_{x \to \infty} x^2_{1} - \int_{x+y}^{5}x\mathrm{d}x + \sum_{n=1}^{20} n^{4} = \prod_{j=1}^{3} y_{j}  + \lim_{x \to -2} \frac{x-2}{x}
```


$$
\huge \vec{a} + \overrightarrow{AB} + \overleftarrow{DE}
$$

```
\huge \vec{a} + \overrightarrow{AB} + \overleftarrow{DE}
```


$$
\huge \overline{x+y} \qquad \underline{a+b}
$$

```
\huge \overline{x+y} \qquad \underline{a+b}
```


$$
\huge 0 \neq 1  \quad  x \equiv x  \quad   1 = 9 \bmod 2
$$

```
\huge 0 \neq 1  \quad  x \equiv x  \quad   1 = 9 \bmod 2
```

`\quad`代表一个空格，`\qquad`代表两个空格
