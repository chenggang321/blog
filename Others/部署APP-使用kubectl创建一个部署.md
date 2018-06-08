原文地址：https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-intro/

目标
- 学习应用部署
- 使用kubectl在kubernetes上部署第一个应用

Kubernetes部署

一旦有了一个运行中Kubernetes集群，你可以在上面部署你的容器化后的应用。为此，你需要创建一个k8s **Deployment**配置项。Deployment指明Kubernetes如何去创建和升级应用的实例。一旦创建了一个Deployment，kuberneters主线程调度涉及到的应用实例到集群中的独立Nodes。

一旦应用实例创建了，一个Kubernetes Deployment Controller会持续管理这些实例。如果Node托管的实例挂掉了或者被被删除了，Deployment controller会取代它。**这是k8s的一个自我修复机制来解决机器故障或者维护问题。**

在一个前-编排(orchestration)世界，安装脚本经常用来启动应用，但是他们不允许从故障的机器中恢复回来，也就是没有自我恢复机制。通过既创建应用实例又让它们跨节点运行，Kubernetes部署提供了一个完全不同的应用部署的方式。

总结：
- Deployments
- Kubectl

> 一个Deployment负责创建和升级应用实例。

在Kubernetes上部署你的第一个app
![image](http://upload-images.jianshu.io/upload_images/2976869-1895337b5f6d361e..png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

你可以通过使用命令行接口**Kubectl**创建和管理一个Deployment.Kubectl使用Kubernetes API与集群进行交互。在这个单元里，你将学习最常用的Kubectl用来创建Deployments从而在Kubernetes集群上运行你的应用的命令行。

当你创建了一个Deployment，你需要为应用程序指定容器图像和你想运行的副本的个数。通过升级Deployment你能够改变那个信息；集训的单元5和6将讨论如何scale和升级你的Deployments.

> 为了部署应用到Kubernetes上，应用需要被打包成一种被支持的容器格式。

对于我们的第一次部署，我们将部署Node.js应用到Docker容器上。源代码和Dockerfile在Kubernetes集训的[Github respository](https://github.com/kubernetes/kubernetes-bootcamp)上。

现在你知道Deployments是什么了，让我们进入在线教程并且部署你的第一个app吧！

### kubectl basics基础

kubectl命名的格式是：kubectl + 动作 + 资源
动作包括create,describe等，资源则包括node,container。可以在命令后加上--help查看额外的信息。例如，kubectl get nodes --help。

检查kubectl版本：kubectl version
```
Client Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.0", GitCommit:"925c127ec6b946659ad0fd596fa959be43f0cc05", GitTreeState:"clean", BuildDate:"2017-12-15T21:07:38Z", GoVersion:"go1.9.2", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"", Minor:"", GitVersion:"v1.9.0", GitCommit:"925c127ec6b946659ad0fd596fa959be43f0cc05", GitTreeState:"clean", BuildDate:"2018-01-26T19:04:38Z", GoVersion:"go1.9.1", Compiler:"gc", Platform:"linux/amd64"}
```
查看集群中的节点数：kubectl get nodes
```
NAME      STATUS    ROLES     AGE       VERSION
host01    Ready     <none>    5m        v1.9.0
```
k8s将基于可用的节点资源来选择应用的部署位置。

### 部署我们的app

让我们使用`kubectl run`命令来运行我们第一个应用。`run`命令创建了一个新的部署。我们需要提供：部署名字和应用的图像位置（包括在Docker hub外的完整的的repository网址）。我们想在某个特定端口运行应用的话，需要加上`--port`参数。
```
kubectl run kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1 --port=8080
```
deployment "kubernetes-bootcamp" created
太棒了，你通过创建了一个部署成功部署了我们的第一个应用程序。

上面的命令包含了以下的事情：
- 搜索一个可用节点，这个节点可以运行应用实例
- 调度应用到那个节点
- 配置集群在必要时重新调度实例到新的节点

列举Deployments：`kubectl get deployments`
```
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1         1         1            1           5m
```
应用实例运行在你的节点Docker容器中。

### 查看我们的应用
在Kubernetes内部运行的Pods运行在一个私有的，独立的网络。默认情况下，同一个k8s集群下的其他pod和service之间是可见的，但是在网络外是不可见的。当我们使用kubectl，我们通过API端点与我们的应用程序进行通信。
我们将在第四单元涵盖在k8s集群外如何暴露应用的其他选项。
kubectl命名能创建一个代理，这个代理可以在我们的集群范围内的，私有的网络空间内转发通信。代理可以通过CTRL+C的方式终止，而且在运行时不会有任何输出。
我们将开启第二个终端窗口去运行代理。
`kubectl proxy`
我们现在有了一个主机与k8s集群之间的连接。代理可以直接从这些终端获取到API的权限。

通过代理端口，你能看到所有的主机API，从http://localhost:8001可以看到所有。例如，我们能直接通过curl命令通过API查询版本。
`curl http://localhost:8001/version`
stdout：
```
{
  "major": "",
  "minor": "",
  "gitVersion": "v1.9.0",
  "gitCommit": "925c127ec6b946659ad0fd596fa959be43f0cc05",
  "gitTreeState": "clean",
  "buildDate": "2018-01-26T19:04:38Z",
  "goVersion": "go1.9.1",
  "compiler": "gc",
  "platform": "linux/amd64"
}
```

API服务器可以自动为每个pod创建一个尾端点，基于pod名字，这通过代理同样是可行的。
首先我们需要获取到Pod的名字，然后将其存储到环境变量POD_NAME中。
```
export  POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```
stdout:
`Name of the Pod: kubernetes-bootcamp-5dbf48f7d4-s5xwx`

现在我们可以通过运行在那个POD的应用程序创建一个HTTP请求了。
`curl http://localhost:8001/api/v1/proxy/namespace/default/pods/$POD_NAME`
stdout：
`Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-s5xwx | v=1`
这个url是Pod的API的路由。

注意：检查终端的顶部。代理运行在一个新的tab上，而且最近的命令还在源tab上执行。代理仍然运行在第二个tab，而且这也允许我们的curl命令能够运行在localhost:8001.