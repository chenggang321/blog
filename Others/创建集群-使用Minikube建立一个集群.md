原文地址：https://kubernetes.io/docs/tutorials/kubernetes-basics/cluster-intro/

目标：
- 学习Kubernetes集群是什么
- 学习Minikube是什么
- 使用在线终端创建一个Kubernetes集群

Kubernetes集群
**Kubernetes协调一个高可用的计算机集群，并且将它们连接起来作为一个单元工作。** Kubernetes抽象允许你不用捆绑到单独的机器，就可以部署容器化的应用到一个集群上。为了使用这种新的部署模式，应用需要这样的方式打包：将它们从个别主机中分离出来，然后进行容器化。容器化的应用要比过去的部署模式更加灵活和更加可用，如果按照过去的方式去部署，应用是直接作为一个与主机深度整合起来的包捆绑到机器上的。**而Kubernetes可以通过一种很有效的方式跨集群自动分离和调度应用程序容器。** Kubernetes是一个可用于生产环境的开源平台。

一个Kubernetes集群主要包含两种类型的资源：
- Master协调集群
- Node(s)是负责运行应用(们)的工人(们)

总结：
- Kubernetes集群
- Minikube

Kubernetes是一个生产级的，开源的，在集群内部或跨计算机集群，编排（调度）和执行应用容器的一个平台。

集群图解
![image](http://upload-images.jianshu.io/upload_images/2976869-1cc186e9ae81bf09..png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
 **Master负责管理集群。** master协调你的集群的所有活动，例如调度应用，维护应用的期望状态，缩放应用，推出新的更新。
**一个node是一台虚拟机或者是一台物理机，总之都是作为Kubernetes集群的工作机。** 每台机器都有Kubelet，它是负责管理node以及与Kubernetes  master的之间通信。node应该同样包含处理容器操作的工具，例如Docker或者rkt.一个真正能用于生产环境的Kubernetes集群至少应该有3个node。

> Master用来管理集群和nodes用来托管正在运行的应用程序。

当你在Kubernetes上部署应用的时候，你会告诉master去启动应用的容器。master调度各个容器在集群的node上运行。**node与master之前的通信通过Kubernetes API**,这个API是从master暴露出来的。终端用户同样可以使用Kubernetes API直接与集群进行交互。

一个Kubernetes集群可以部署于物理机器，也可以部署在虚拟机器。如果想开始使用Kubernetes进行开发，可以尝试用Minikube。Minikube是一个轻量级的Kubernetes，它可以在你的本机创建一个VM，然后部署一个单节点简单集群。Minikube适用于Linux，macOS和windows系统。Minikube CLI提供了基本的响应式的操作集群的方法，包括start,stop,status和delete.但是在这个教程里，你将使用预安装好的Minikube在线终端。

现在你知道了Kubernetes是什么了，让我们一起走进在线教程并且启动我们的第一个集群吧！

minikube版本：
查看minikube版本：**minikube version**
`minikube version: v0.25.0`
minikube启动k8s集群：**minikube start**
```
Starting local Kubernetes v1.9.0 cluster...
Starting VM...
Getting VM IP address...
Moving files into cluster...
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
Loading cached images from config file.
```

k8s集群版本：
查看k8s集群版本：**kubectl version**
```
Client(kubectl) Version: version.Info{Major:"1", Minor:"9", GitVersion:"v1.9.0", GitCommit:"925c127ec6b946659ad0fd596fa959be43f0cc05", GitTreeState:"clean", BuildDate:"2017-12-15T21:07:38Z", GoVersion:"go1.9.2", Compiler:"gc", Platform:"linux/amd64"}
Server(k8s) Version: version.Info{Major:"", Minor:"", GitVersion:"v1.9.0", GitCommit:"925c127ec6b946659ad0fd596fa959be43f0cc05", GitTreeState:"clean", BuildDate:"2018-01-26T19:04:38Z", GoVersion:"go1.9.1", Compiler:"gc", Platform:"linux/amd64"}
```

k8s集群细节：
查看master进程：**kubectl cluster-info**
```
Kubernetes master is running at https://172.17.0.127:8443

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.

```
dashboard UI位于master进程。

查看nodesj进程集：**kubectl get nodes**
```
kubectl get nodes
NAME      STATUS    ROLES     AGE       VERSION
host01    Ready     <none>    5m        v1.9.0
```
可以获取到可用于托管应用的全部node，并且显示其托管状态，状态为Ready表明当前node可以用来部署应用。