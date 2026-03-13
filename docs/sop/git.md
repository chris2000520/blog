---
title: Git入门
tags:
  - Git
date: 2021-07-08 09:49:04
categories: 笔记
---

# 初始化本地仓库

- 创建一个文件目录

  ```
  mkdir 7.8study
  ```

- 进入这个文件目录

  ```
  cd 7.8study
  ```

- 初始化Git本地仓库

  ```
  git init
  ```

- 在本地仓库里新建一个myfile.txt文件，右键新建就行

- 在文件中写入一段文字，也就是对文件进行修改

  ```
  连猴子都懂的Git命令
  ```

# 提交修改

- 先将文件添加到Git控制系统中来

  ```
  git add myfile.txt
  ```

- 提交到Git系统中，并添加信息，方便以后查看每一步干了些什么

  ```
  git commit -m "第一次提交"
  ```

- 结果

  ```
  [master (root-commit) 268c96e] 第一次提交
   1 file changed, 1 insertion(+)
   create mode 100644 myfile.txt
  ```

- 目前历史是这样的


# 创建分支

由于我们有时候需要多人协同开发，每个组都有自己的分支，这样可以提升开发效律。

- 创建名为dev1的分支

  ```
  git branch dev1
  ```

- 查看所有分支

  ```
  git branch
  ```

- 结果

  ```
    dev1
  * master
  ```

- 目前历史是这样的


# 切换分支

如果想要在新创建的分支上提交，我们需要切换到那个分支上去。在切换到dev1分支的状态下提交，历史记录会被记录到dev1分支。

- 切换到dev1分支上去

  ```
  git checkout dev1
  ```

- 在checkout命令指定 -b选项执行，可以创建分支dev2并进行切换

  ```
  git checkout -b dev2
  ```

- 目前的历史记录是这样的

- 在dev1上给myfile.txt文件添加add的使用说明

  ```
  连猴子都懂的Git命令
  add 把变更录入到索引中
  ```

- 然后添加和提交

  ```
  git add myfile.txt
  git commit -m "添加add的说明"
  ```

- 目前的历史记录是这样的


# 合并分支

向master分支合并dev1分支，这里我们切换到dev1分支，打开myfile.txt文件，可以看到add的说明。但是我们现在切回到master分支，会发现并没有add说明，现在假设我们已近完成了开发，就要把dev1合并到master上，这样我们切到master时，文件的进度就和dev1上的一样了，也就是我们也能看见add说明了。

- 先回到master上

  ```
  git checkout master
  ```

- 在主分支上合并dev1分支

  ```
  git merge dev1
  ```

- 结果

  ```
  Updating 268c96e..eaec4a7
  Fast-forward
   myfile.txt | 3 ++-
   1 file changed, 2 insertions(+), 1 deletion(-)
  ```

- master分支指向的提交移动到和issue1同样的位置，这个是fast-forward（快进）合并



- 取消合并

  ```
  git reset --hard HEAD~
  ```

# 删除分支

既然dev1分支的内容已经顺利地合并到master分支了，现在可以将其删除了。

- 删除dev1分支

  ```
  git branch -d dev1
  ```

- 确认一下，查看分支列表

  ```
  git branch
  ```

  

# 多个分支

有时候我们需要多个分支来加快进度，不过最后合并的时候比较容量冲突。先新创建dev2，dev3分支，并切换到dev2分支。

- 命令行如下

  ```
  git branch dev2
  git branch dev3
  git checkout dev2
  Switched to branch 'dev2'
  git branch
  * dev2
    dev3
    master
  ```

- 在dev2分支的myfile.txt添加commit命令的说明后提交

  ```
  连猴子都懂的Git命令
  add 把变更录入到索引中
  commit 记录索引的状态
  ```

  ```
  git add myfile.txt
  git commit -m "添加commit的说明"
  ```

- 切换到dev3分支，给myfile.txt添加pull命令的说明后提交

  ```
  git checkout dev3
  
  连猴子都懂的Git命令
  add 把变更录入到索引中
  pull 取得远端数据库的内容
  
  git add myfile.txt
  git commit -m "添加pull的说明"
  ```

这样，添加commit的说明的操作，和添加pull的说明的操作就并行进行了。

 # 解决冲突

把dev2分支和dev3分支的修改合并到master。先切换到master分支后，与dev2分支合并。

```
git checkout master
Switched to branch 'master'
git merge dev2
Updating b2b23c4..8f7aa27
Fast-forward
 myfile.txt |    2 ++
 1 files changed, 2 insertions(+), 0 deletions(-)
```

执行fast-forward（快进）合并。



接着合并dev3分支。

```
git merge dev3
Auto-merging myfile.txt
CONFLICT (content): Merge conflict in myfile.txt
Automatic merge failed; fix conflicts and then commit the result.
```

自动合并失败。由于在同一行进行了修改，所以产生了冲突。这时myfile.txt的内容如下：

```
连猴子都懂的Git命令
add 把变更录入到索引中
<<<<<<< HEAD
commit 记录索引的状态
=======
pull 取得远端数据库的内容
>>>>>>> dev3
```

在发生冲突的地方，Git生成了内容的差异。请做以下修改：

```
连猴子都懂的Git命令
add 把变更录入到索引中
commit 记录索引的状态
pull 取得远端数据库的内容
```

修改冲突的部分，重新提交。

```
git add myfile.txt
git commit -m "合并dev3分支"
# On branch master
nothing to commit (working directory clean)
```

历史记录如下图所示。因为在这次合并中修改了冲突部分，所以会重新创建合并修改的提交记录。这样，master的HEAD就移动到这里了。这种合并不是fast-forward合并，而是non fast-forward合并。

# 个人常用命令

查看远端仓库地址

```shell
git remote -v
```

撤回add操作

```shell
git reset .
```

拉取远端仓库后默认只有main分支，在本地新建分支并关联，第二种默认分支名为远端分支

```shell
git checkout -b zwy origin/zwy
git checkout -t origin/feature
```

使用第一种方法时，如果本地分支名和远端不一样，会出现`The upstream branch of your current branch does not match the name of your current branch`，分支尽量名称保持一致

查看本地分支和远程分支关联情况

```shell
git branch -vv 
```

关联到远端分支

强制删除分支(在桥上时不要炸桥)

```shell
git branch -D zwy
```

在远端删除分支后，本地使用`git branch -a`未能及时更新

```shell
git fetch --prune
```

恢复工作区中的文件到最近的提交状态（即丢弃对文件的所有未提交更改）

```shell
git restore zwy.md
git status
nothing to commit, working tree clean
```

显示分支提交树

```shell
git log --oneline --graph --decorate --all

--oneline 	日志单行显示
--graph		分支图显示
--decorate 	可显示分支名称
--all		显示所有分支
```

