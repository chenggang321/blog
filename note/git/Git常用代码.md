---
date: 2021-03-04 14:30
title: Git常用代码
categories:
  - git
tags:
  - 前端
  - git
---

Git常用代码
=======

#### 创建版本库

```
$git init
```

#### 添加到暂存区

```
$git add <file>
```

#### 提交到仓库

```
$git commit -m "your description"
```

> -m 后面是解释说明

#### 查看仓库当前状态

```
$git status
```

#### 查看距离上次提交做了哪些修改

```
$git diff <file>
```

#### 查看提交记录

```
$git log
```

精简格式

```
$git log --pretty=online
```

查看每一次提交记录，包括版本回退记录

```
$git reflog
```

#### 版本回退

> 通过HEAD回退版本

```
$git reset --hard HEAD^
```

HEAD 表示当前版本  
HEAD^ 表示上1个版本  
HEAD^ 表示上2个版本  
HEAD~n 表示上n个版本

> 通过commit id回退版本

```
$git reset --hard 3628164
```

#### 删除文件

```
$git rm <file>
```

#### 恢复误删文件

```
$git checkout -- <file>
```

#### 添加远程库

```
$ git remote add origin git@github.com:luosijie/Front-end-Blog.git
```

或

```
$git remote add origin https://github.com/luosijie/Front-endBlog.git
```

添加后，远程库的名字就是origin，这是Git默认的叫法，也可以改成别的，但是origin这个名字一看就知道是远程库。

Git支持多种协议，默认的git://使用ssh，但也可以使用https等其他协议。  
使用https除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令，但是在某些只开放http端口的公司内部就无法使用ssh协议而只能用https

#### 查看远程库

```
$git remote
```

#### 删除远程库

```
git remote remove <name>
```

#### 推送内容到远程库

```
//origin 为远程库名称
$ git push -u origin master
```

第一次推送master分支时，由于远程库是空的，加上了-u参数，Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。

第二次开始就可以用

```
$ git push origin master
```

来源[廖雪峰Git教程](http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/0013752340242354807e192f02a44359908df8a5643103a000)
