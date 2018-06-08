目标：
- 学习Kubernetes的Pods。
- 学习Kubernetes的Nodes。
- 部署应用问题的解决办法。

### Kubernetes Pods
当你在Module2创建了一个Deployment之后，Kuebernetes创建会创建一个**Pod**去托管你的应用实例。一个Pod是一种Kubernetes的抽象，这种抽象代表一组一个或者多个应用的容器（例如Docker或者rkt）,和一些这些容器间的共享资源。
这些资源包括：
- 共享存储，例如Volumes
- 网络，例如一个唯一的集群IP地址
- 关于运行中的每个容器的详细信息，例如容器image版本，容器运行端口

一个Pod包括一个指定的应用的“逻辑主机”，能够包含不同的彼此紧密耦合的应用容器。例如，一个Pod也许既包括运行了Nodejs应用的容器，又包括用于提供由Node.js Web服务器发布的数据的不同容器。Pod中的容器共享IP地址和端口空间，他们经常被协同定位和协同调度，而且可以运行在相同Node的共享上下文。

Pods是kubernetes平台的最小单元。当我们在Kubernetes创建了一个部署的时候，Deployment创建内部带有容器的Pods(而不是直接创建容器)。每个Pod与调度它的Node都是强关联的，只有终止或者删除Pod才会销毁。一旦Node发生异常，会从集群上对的其他可用Nodes调取相同的Pod。

总结：
- Pods
- Nodes
- Kubectl主要命令

>Pod是一个包含应用容器（Docker或者rkt）,内部共享存储（volumes），IP地址和它们的运行信息的集合。

Pods 概观
![image](http://upload-images.jianshu.io/upload_images/2976869-0827f7b364dae8b3..png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Nodes
一个Pod通常运行在一个Node上。一个Node是一个在Kubernetes上的工作机器，既可以是虚拟机也可以是物理实体机，依赖于整个集群。每个Node都被Master管理着。一个Node可以有多个pod，而且Kubernetes主站可以做集群内部的跨Nodes的自动调度。主站的自动化调度考虑了每个节点的可用资源。

每个Kubernetes节点至少运行：
- Kubelet ，一个负责k8s的Master与Node之间通信的进程；它管理着Pods和运行在机器上的容器。
- 一个运行时容器，例如Docker，rkt，负责从源端拉取容器的image，解压容器，运行程序。

>如果容器之间是紧耦合并且需要分享类似硬盘之类的资源的话，则只能将容器安排在一个Pod的。

Node概观
![image](http://upload-images.jianshu.io/upload_images/2976869-d8350aeace5e5296..png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

kubectl问题的解决办法
在单元二中，你使用了Kubectl命令行接口。第三单元中你将继续使用它取获取部署的应用的信息和他们的环境的信息。kubectl最常用的操作如下：
- kubectl get -列举资源
- kubectl describe -展示资源的细节信息
- kubectl logs -在pod中打印一个容器的日志
- kubectl exec -在pod中执行一个命令

当应用被部署的时候，你能够使用这些命令去找问题，去看他们当前的状态是什么，他们运行在哪里，以及他们的详细配置是什么。
现在我们知道了更多集群组件和命令行的信息，让我们一起来探索的应用吧。

>一个node指的是一台k8s上的工作机，可以是VM，也可以是物理机，这取决于开发k8s集群是VM集群还是物理机集群。多个Pod可以运行在同一个Node。

学习kubuctl get，describe，logs和exec命令的使用

检查应用配置

查看当前存在的Pod
`kubectl get pods`
kubernetes-bootcamp-5dbf48f7d4-dwvzd   1/1       Running   0          1m

查看Pod内部的容器和这些容器正在使用的images
`kubectl describe pods`
```
Name:           kubernetes-bootcamp-5dbf48f7d4-dwvzd
Namespace:      default
Node:           host01/172.17.0.102
Start Time:     Wed, 28 Feb 2018 07:55:02 +0000
Labels:         pod-template-hash=1869049380
                run=kubernetes-bootcamp
Annotations:    <none>
Status:         Running
IP:             172.18.0.4
Controlled By:  ReplicaSet/kubernetes-bootcamp-5dbf48f7d4
Containers:
  kubernetes-bootcamp:
    Container ID:   docker://05fef680ba6317a4d81f53e82b3201e6f0ba192f31813a95cfa4a7efe39f61f0
    Image:          gcr.io/google-samples/kubernetes-bootcamp:v1
    Image ID:       docker-pullable://jocatalin/kubernetes-bootcamp@sha256:0d6b8ee63bb57c5f5b6156f446b3bc3b3c143d233037f3a2f00e279c8fcc64af
    Port:           8080/TCP
    State:          Running
      Started:      Wed, 28 Feb 2018 07:55:04 +0000
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-mfx4v (ro)
Conditions:
  Type           Status
  Initialized    True
  Ready          True
  PodScheduled   True
Volumes:
  default-token-mfx4v:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-mfx4v
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     <none>
Events:
  Type     Reason                 Age              From               Message
  ----     ------                 ----             ----               -------
  Warning  FailedScheduling       4m (x4 over 4m)  default-scheduler  0/1 nodes are available: 1 NodeNotReady.
  Normal   Scheduled              4m               default-scheduler  Successfully assigned kubernetes-bootcamp-5dbf48f7d4-dwvzd to host01
  Normal   SuccessfulMountVolume  4m               kubelet, host01    MountVolume.SetUp succeeded for volume "default-token-mfx4v"
  Normal   Pulled                 4m               kubelet, host01    Container image "gcr.io/google-samples/kubernetes-bootcamp:v1" already present on machine
  Normal   Created                4m               kubelet, host01    Created container
  Normal   Started                4m               kubelet, host01    Started container
```
从上面可以看到这个Pod的容器的细节：IP地址，被占用的端口，以及与Pod生命周期有关的事件。
describe 命令可以获取到node，pods，deployments这些kubernetes的基本单元。describe输出被设计成易于阅读的。

查看容器日志
应用程序通常发送到STDOUT的任何内容都将作为Pod中容器的日志记录下来，我们可以使用kubectl logs。
`kubectl logs $POD_NAME`
```
Kubernetes Bootcamp App Started At: 2018-02-28T07:55:04.410Z | RunningOn:  kubernetes-bootcamp-5dbf48f7d4-dwvzd
Running On: kubernetes-bootcamp-5dbf48f7d4-dwvzd | Total Requests: 1 |App Uptime: 2011.001 seconds | Log Time: 2018-02-28T08:28:35.411Z
```
注意：我们不用指定容器名字，因为pod中只有一个容器。

容器上的执行命令
Pod运行时，我们可以直接在容器上执行命令。如果这么做的话，我们使用exec命令，再将pod名字作为参数。

让我们来列举一下环境变量：
`kubectl exec $POD_NAME env`
```
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=kubernetes-bootcamp-5dbf48f7d4-dwvzd
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBERNETES_PORT_443_TCP_PORT=443
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
NPM_CONFIG_LOGLEVEL=info
NODE_VERSION=6.3.1
HOME=/root
```

在Pod容器上开启一个bash会话
`kubectl exec -ti @POD_NAME bash`
```
root@kubernetes-bootcamp-5dbf48f7d4-dwvzd:/#
```

查看app代码
`cat server.js`
```
var http = require('http');
var requests=0;
var podname= process.env.HOSTNAME;
var startTime;
var host;
var handleRequest = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(200);
  response.write("Hello Kubernetes bootcamp! | Running on: ");
  response.write(host);
  response.end(" | v=1\n");
  console.log("Running On:" ,host, "| Total Requests:", ++requests,"| App Uptime:", (new Date() - startTime)/1000 , "seconds", "| Log Time:",new Date());
}
var www = http.createServer(handleRequest);
www.listen(8080,function () {
    startTime = new Date();;
    host = process.env.HOSTNAME;
    console.log ("Kubernetes Bootcamp App Started At:",startTime, "| Running On: " ,host, "\n" );
});
```

使用localhost是因为在NodeJS容器里执行命令。
`curl localhost:8080`
关闭容器连接
`exit`