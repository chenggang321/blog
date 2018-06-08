内容包括：
- Git常用命令
- 优雅使用Git的一些实践

### Git常用命令
- git克隆远程分支仓库：
`git clone -b 分支名称 远程地址`
git克隆远程仓库项目时如果不指定分支，只会克隆默认分支的内容。

- commit 回退
`git reset --hard HEAD^`

- 修改git用户名和密码
`git config --global user.name "John Doe"`
`git config --global user.email johndoe@example.com`

- 查看git用户名和密码
`git config user.name`
`git config user.email`

- 分支相关
`git branch（查看当前分支）`
`git branch -a（查看所有分支）`
`git checkout 分支名（切换到对应分支）` 会自动将代码更新为分支代码
`git branch 分支名`（创建一个分支）
`git branch -d 分支名`（删除一个分支）

- 接入Gerrit code review后的操作流程
```
git clone ...
git checkout 分支名
gitdir=$(git rev-parse --git-dir); scp -p -P 29418 kaigao@10.10.101.193:hooks/commit-msg ${gitdir}/hooks/
git add .
git commit -m "logs"
git pull --rebase origin 分支名
```
若有冲突：
```
执行【git status】会看到both modified的文件列表，然后解决将这些文件内的冲突。
执行【git add .】
执行【git rebase --continue】
执行【git commit --amend】
```
若没有冲突：
`git push origin HEAD:refs/for/分支名`

- 查看git历史
`history`

- 按照关键词搜索git历史
`history | grep push`

- 查看commit历史
`git log`
`git log --summary`

- 设置全局git账号
`git config --global user.name "Frankkai"`
`git config --global user.email "gaokai20100801@gmail.com"`

- 设置本地git账号
`git config user.name "Frankkai"`
`git config user.email "gaokai20100801@gmail.com"`

- 查看全局git账号
`git config --global --list`

- 查看本地git账户
`git config --local --list`

- 回滚本次修改
`git reset HEAD static/lib/js/constantsUrl.js`
`git checkout -- static/lib/js/constantsUrl.js`

- 查看本次修改的代码
`git diff`
`git diff HEAD`
`git diff --staged`

- 提交后发现丢了几个文件没有提交
发现丢了修改记录，重新添加
`git add "*.html"`
重新提交，最终只有一个提交
`git commit --amend`

-  缓存某种后缀的文件
`git add "*.js"`
- 清除缓存区中的文件
`git reset octofamily/octodog.txt`
- 彻底删除某种后缀的文件
`git rm "*.txt"`
- 合并分支到master
`git merge 分支名`
- add .之前取消提交某些文件
`git checkout -- <filename>`


### 优雅使用Git的一些实践
- windows下gitbash支持中文输入：
1）鼠标左键点击左上角git的logo
2）找到options并且切换到text目录，将Character set设置为UTF-8

- 生成ssh-key
`ssh-keygen -t rsa -C "gaokai20100801@qq.com"`

- windows查看ssh-key
`/c/Users/frank/.ssh/id_rsa.pub`

- mac/linux查看ssh-key
`cd ~/.ssh`
`ls`
`cat id_rsa.pub`

- git flow
https://danielkummer.github.io/git-flow-cheatsheet/index.zh_CN.html