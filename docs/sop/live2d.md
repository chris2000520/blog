---
title: 关于Hexo博客上添加基于Live2D的看板娘
toc: true
tags:
  - Hexo
abbrlink: 8ec080e9
date: 2020-04-03 11:56:23
categories: 笔记
---

最近在美化自己的博客，突然发现看板娘好像挺有意思的，于是准备自己配一个，发现没那么简单，途中踩了不少坑，不过好在最后成功了，在此记录配置过程。
<!-- more -->
## 检查package.json文件
``` bash
"hexo-helper-live2d": "^3.1.1"
```
（这个文件在博客根目录下就会有）如果没有这一项的话不要紧，后面会安装的，只是如果有旧版本的话，要先卸载，我也是听大佬说的。卸载代码：
``` bash
$ npm uninstall hexo-helper-live2d
```
## 检查自己的core-js

就在你的博客的根目录下，因为如果你的core-js版本低于3的话，是不支持```hexo-helper-live2d```的。会出现如下错误：
``` bash
npm WARN deprecated core-js@2.6.11: 
core-js@<3 is no longer maintained and not recommended for usage due to the number of issues.
Please, upgrade your dependencies to the actual version of core-js@3.
```
这里我看的是这位[大佬的博客](https://blog.csdn.net/weixin_43675566/article/details/104344744)，大概就是强制安装一个高版本的。特别强调了全局安装，安装代码：
``` bash
$ npm install --save  -g core-js@^3
```

## 正式安装hexo-helper-live2d
代码如下：
``` bash
$ npm install hexo-helper-live2d
or
$ npm install --save hexo-helper-live2d
```
这个插件就好像一个应用市场，在在次基础上下载自己喜欢的板娘，官网也有预览图，貌似打不开了，可以在[这里看](https://blog.csdn.net/wang_123_zy/article/details/87181892?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-3&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-3)。顺便把[官网](https://github.com/EYHN/hexo-helper-live2d)的也贴出来吧，免得迷路。这里面也有详细的介绍，只不过我看不懂罢了。
下载后检查自己的package.json文件里有没有多出来这一项```"hexo-helper-live2d": "^3.1.1" ```。

## 选好自己的板娘后下载
下载代码：
``` bash
$ npm install live2d-widget-model-shizuku
```
这个我不知道怎么翻译，十足库还蛮好看的。下载完成后，检查自己的node_modules里有没有多出来```live2d-widget-model-shizuku```和```live2d-widget```。

## 配置自己的站点_config.yml
记住不是主题里的那个就行，代码如下：
``` bash
live2d:
  enable: true #启用板娘
  scriptFrom: local #默认
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false #默认不启用
  debug: false #默认不启用
  model:
    use: live2d-widget-model-shizuku #这个是你要修改的！！！
  display:
    position: right #在屏幕上的显示位置
    width: 100 #显示宽度
    height: 200 #显示高度
  mobile:
    show: true #手机端是否显示
  react:
    opacity: 0.8 #透明度
```
## 开始测试效果
``` bash
$ hexo clean
$ hexo g
$ hexo s
$ hexo d
```
先在本地打开看看效果，确认无误后再推远端。

## 问题来了
我刚开始也是按照流程一步一步来的，本地都能显示，可就是域名访问不了，刚开始我以为是这个文件太大了，可能要等几个小时。直到我看到[这篇博客](https://www.e-learn.cn/topic/924109)，我人都傻了，这么坑的吗？
``` bash
如果你和我一样是纯新手，而且完全按照上述教程进行，那么恭喜你，看板娘一定不会出现！
```
本插件需要jQuery和font-awesome支持，请确保它们已在页面中加载，否则无法正常显示。而前面的教程中并没有指出这一点，因此缺少依赖的博客，一定不会加载出看板娘。
其次是autoload.js的路径设置问题。怎么解决就去传送门吧，反正我搞了半天没搞好，还是太菜了啊。

## 最后成功了

最后的我不知道怎么了，装了又卸载换一个板娘，执行npm install出现如下提醒：
``` bash
added 253 packages from 162 contributors and audited 1117 packages in 42.157s
found 5 vulnerabilities (1 low, 4 high)
run `npm audit fix` to fix them, or `npm audit` for details html
```
按照它的命令，输入之后好像是修复了某些东西，弹出：
``` bash
package update for 5 vulns involved breaking changes
use `npm audit fix --force` to install breaking changes; or do it by hand
```
就顺了这孩子吧，最后好像修复了什么什么npm就突然加载出来了。百思不得其解，也不去深究了，这里还有[一篇博客](https://blog.csdn.net/weixin_40817115/article/details/81007774)写```npm audit fix```的可以参考一下。

Tips:在blog\themes\pure\layout\layout.ejs文件的body标签中加入
``` HTML
<script src="https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js"></script>
```
可以直接获取一只哦，只不过我不知道怎么设置参数罢了。

🌙溜了溜了睡觉去了🌙