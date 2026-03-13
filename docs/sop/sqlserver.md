---
title: 关于去除SQLServer中的红色下划线
toc: true
tags:
  - SQL
abbrlink: 6046acbd
date: 2020-04-04 22:57:23
categories: 笔记
---
这几天正在入门SQL，跟老师学的，老师用的是Microsoft的SQLServer，我也就跟着下了，很简单，直接去微软下载，然后接着下载[SSMS](https://baike.baidu.com/item/SSMS)，按照官方文档操作，一个最基本的人物表就出来了。
<!-- more -->
但是按照老师的方法来，明明已经添加过了```sno```，```sname```，```sdept```，但是查表的时候还是会出现红色下划线，强迫症表示很不爽。
``` bash
English:Invalid object name "xxx",Invalid column name "xxx"
中文:对象名"xxx"无效，列名"xxx"无效,列名"xxx"无效（有多少列名就有多少无效的）
```
最关键的是我根本没有写错！不过最后看[大佬的博客](https://zhdaa.github.io/2018/10/24/SQLServer%E5%88%97%E5%90%8D%E6%97%A0%E6%95%88/)，茅塞顿开！原来是因为SQLServer的[intellisense](https://baike.baidu.com/item/IntelliSense)（智能感知功能）没有感知到更改，需要重新整理一下。因为我不需要这个东西，直接在工具（TOOLS）里的选项（Options）给关了。当然也有另一个方法，用快捷键即可：
``` bash
"Ctrl+Shift+R"
```


参考博客（大同小异）：

[SQL Server列名显示无效](https://blog.csdn.net/qq_39019865/article/details/78476604?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-3&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-3)

[SQL Server2008 列名显示无效](https://blog.csdn.net/bigheadsheep/article/details/7872299)

