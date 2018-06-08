在体验Jenkins之前，首先明确一个概念：Jenkins是一款CICD工具。
![](https://upload-images.jianshu.io/upload_images/2976869-e5fe17fd260cbb6f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

CI-continuous intergation-持续集成
>在软件工程领域，持续集成（CI）是一在一天之内多次合并所有开发者的副本到一个共享的主线上。在1991年，Grady Booch第一次命名并提出CI的概念，尽管他不主张一天集成多次。极限编程（XP）主义者推崇CI的概念，甚至主张每天集成不止一次-也许有时会集成几十次。
思考：类似git的merge branch，mainline是master，而working copies是branch，可以很快速地publish一个release。

CD-continuous delivery-持续发布
>持续发布（CD）是一种团队短生命周期开发软件的软件工程方法，确保软件在任何时候都能可靠地发布。致力于构建，测试，和发布软件更加快速和频繁。通过在生产环境中进行增量更新的方式，可以缩减成本，时间，和发布更改的风险。对于持续发布来说，一个直接并且重复部署的进程至关重要。
思考：类似手机游戏包的热更新，也类似于BI分析平台的增量更新，目的是加速开发效率。

二者都有敏捷开发的味道，需要结合Jenkins来深入理解CI和CD。
### 第一步：下载并安装Jenkins
https://jenkins.io/doc/book/installing/
### 第二步：解锁jenkins
密码保存在服务器的位置 `C:\Program Files (x86)\Jenkins\secrets\initialAdminPassword`
复制密码到管理员认证处。
### 第三步：自定义jenkins
插件通过附加特性来扩展jenkins以满足不同的需求。
1. 安装推荐的插件
2. 选择特定的插件
![](https://upload-images.jianshu.io/upload_images/2976869-b517eae5937a1033.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 第四步：创建第一个管理员用户
用户名：frank
密码：123456
### 第五步：选择任务类型
共有6种任务类型
1. 构建一个自由风格的软件项目
这是Jenkins的主要功能。Jenkins将会结合任何SCM和任何构建系统来构建你的项目，甚至可以构建软件意外的系统。
2. 流水线
精心地组织一个可以长期运行在多个节点的任务。适用于构建流水线（更加正式的叫法为工作流），增加或者组织难以采用自由风格的任务类型。
3.构建一个多配置项目
适用于多配置项目，例如多测试环境，平台指定构建等。
4.Github组织
扫描一个Github组织（或者是账户）下的所有repo的所有用户。
5.多分支Pipeline
在一个SCM仓库里，根据检测到的分支创建一个Pipeline集。
6.文件夹
创建一个可以嵌套存储的容器。利用它可以进行分组。视图仅仅是一个过滤器，而文件夹则是一个独立的命名空间，因此你可以有多个相同名称的内容，只要它们在不同的文件夹里即可。
### 第六步：安装Blue Ocean
切换到MANAGE_DOMAINS用户→系统管理→管理插件
可选插件→过滤出Blue Ocean→点击下载待重启后安装→勾选安装完成后重启Jenkins(空闲时)
### 第七步：Jenkins without Blue Ocean vs Jenkins with Blue Ocean
![Jenkins without Blue Ocean](https://upload-images.jianshu.io/upload_images/2976869-bd85fc491e054c85.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![Jenkins with Blue Ocean](https://upload-images.jianshu.io/upload_images/2976869-c51ab699b0bbbf0f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
### 第八步：创建新的Pipeline
有5种现代的代码仓库，其中最常见的是Git(gitlab)和github。
![](https://upload-images.jianshu.io/upload_images/2976869-dc2c2abd0fb4c88e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
备注：此处我的个人github Access token一开始没有成功，后来打开shadowsocks的全局模式才验证成功。
### 第九步：体验Blue Ocean的开发，测试，部署
①按照步骤一步一步选择
②添加一个Jenkinsfile.txt文件
Jenkinsfile (Declarative Pipeline)
```
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
```
③使用pipeline editor架构开发→测试→部署
![](https://upload-images.jianshu.io/upload_images/2976869-e876fd3c9e8d52b5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>总结：
①Jenkins中最重要的两个部分：[Pipeline](https://jenkins.io/doc/book/pipeline/)和[Blue Ocean](https://jenkins.io/doc/book/blueocean/)
②Jenkins是什么？Jenkins本身是一个CICD工具，但是只有在为其安装了Blue Ocean插件后，其强大之处才能更好地被展现出来。
③Jenkins的作用是什么？Build Test Deploy一体化。

参考链接：
https://en.wikipedia.org/wiki/Continuous_integration
https://en.wikipedia.org/wiki/Continuous_delivery
https://jenkins.io/doc/book/blueocean/getting-started/
https://jenkins.io/doc/book/blueocean/creating-pipelines/
https://jenkins.io/doc/book/pipeline/jenkinsfile/