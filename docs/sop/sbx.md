---
title: 模拟二进制交叉算子
tags:
  - 算法
date: 2023-02-27 11:16:44
categories: 笔记
math: true
---

# Simulated Binary Crossover

## 什么是SBX

SBX 是一种实值交叉算法，它模拟具有单点交叉的二进制编码 GA 的行为。

## 为什么不直接使用二进制

许多复杂的现实世界问题都是约束优化问题，特别是对于工业工程领域的问题，标准的遗传算法很难像二进制字符串那样直接应用。

难以实现任意精度。固定的字符串长度限制了解决方案的精度，例如：我们需要找到最优解，自变量的范围是[1.6,2.9]，如果使用二进制，很容易想到用五位来表示从`10000`到`11101`，但是，如果我们的最优解恰好就在2.1到2.2中间呢？固定的字符串长度是无法精确到任意小数的。字符串的适当长度是先验不知道的。

海明悬崖问题。在十进制中15和16相邻，但是如果使用二进制，`01111`和`10000`却大相径庭，移动到相邻位置（也许就是最优解），二进制需要改变所有位上的数字，这对于单点交叉算子具有很大难度。

## 如何设计一个实值交叉算法

通过生物仿生学，我们也可以借鉴二进制的交叉算法来模拟实值交叉算法。

### 二进制交叉特点

解码参数值的平均值是相等的。很容易理解，单点交叉只是把相同位置上的数字位置进行是互换，但是他们所代表的权重并没有改变。所以有:
$$
\frac{p_1+p_2}{2}=\frac{c_1+c_2}{2}
$$
大多数交叉事件对应的`扩散因子`$\beta$约等于1。(即孩子倾向于与父母亲近)。
$$
\beta=\left| \frac{c_1-c_2}{p_1-p_2} \right| \approx 1
$$
有三种情况，子代在父代两外侧`expanding crossover`，$\beta>1$，两内侧`contracting crossover`，$\beta<1$，或者是子代与父代相等`stationary crossover `，$\beta=1$。

### 扩散因子$\beta$的分布

## 伪代码

**Input:** The parent solutions $P_1,P_2 \in R$

The distribution index $n \in R$

/*Normally prefer to set $n$ to the range from $2$ to $5$ */

**Output**: The children solution $C_1,C_2 \in R$

if $P_1>P_2$ then

​	Swap $P_1$ and $P_2$

end;

Choose a random number $u\in (0,1)$;

if $u \leq0.5$ then

​	$\beta = (2u)^ \frac{1}{n+1}$

else

​	$\beta = (\frac{1}{2-2u})^ \frac{1}{n+1}$

end;

$C_1=0.5(P_1+P_2)-0.5\beta(P_2-P_1)$

$C_2=0.5(P_1+P_2)+0.5\beta(P_2-P_1)$

Return $C_1,C_2$;
