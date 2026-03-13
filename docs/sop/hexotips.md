---
title: Fluid小技巧
tags:
  - Hexo
  - Fluid
date: 2021-05-12 09:45:52
categories: 笔记
---

# Fluid Tag插件

最近在写文章的时候，长篇大论，颜色单一，很难有读下去的欲望。于是准备去Fluid的配置指南找点灵感。咦！还真找到了Tag插件，有7种颜色可以选择，彩虹🌈面板不再是梦想。

## 便签

在 markdown 中加入如下的代码来使用便签：

```markdown
{% note success %}
文字 或者 markdown 均可
{% endnote %}
```

```html
<p class="note note-primary">标签</p>
```

第一种是我最近经常用到的，感觉比HTML来的快。

可选便签：

{% note primary %}
primary
{% endnote %}

{% note secondary %}
secondary
{% endnote %}

{% note success %}
success
{% endnote %}

{% note danger %}
danger
{% endnote %}

{% note warning %}
warning
{% endnote %}

{% note info %}
info
{% endnote %}

{% note light %}
light
{% endnote %}

使用时 `{% note primary %}  {% endnote %}` 这两块代码需要单独一行，否则会出现问题。源码例如：

```markdown
{% note info %}
info
{% endnote %}
```

## 行内标签

在 markdown 中加入如下的代码来使用 Label：

```markdown
{% label primary @text %}
```

或者使用 HTML 形式：

```html
<span class="label label-primary">Label</span>
```

可选Label有`primary`，`default`，`info`，`success`，`warning`，`danger`。

{% label primary @primary %}

{% label default @default %}

{% label info @info %}

{% label success @success %}

{% label warning @warning %}

{% label danger @danger %}

## 按钮

你可以在markdown中加入如下的代码来使用Button：

```markdown
{% btn url, text, title %}{% btn url, text, title %}
```

或者使用HTML形式：

```html
<a class="btn" href="url" title="title">text</a>
```

| 属性  | 含义                         |
| ----- | ---------------------------- |
| url   | 跳转链接                     |
| text  | 显示的文字                   |
| title | 鼠标悬停时显示的文字（可选） |

<a class="btn" href="https://www.bilibili.com/video/BV1UA411376M" title="元气小姐姐哦">点击前往B站</a>