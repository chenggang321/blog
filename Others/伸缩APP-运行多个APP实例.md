原文地址：https://kubernetes.io/docs/tutorials/kubernetes-basics/scale-intro/
目标：
- 使用kubectl扩展应用

在之前的单元里我们创建了一个Deployment,然后紧接着通过Service公开曝光了出去。Deployment仅仅创建了一个Pod来运行应用。当流量增加以后，我们需要扩充我们的应用规模以满足用户的需求。

Scaling通过改变一个Deployment里的副本的个数来实现。

总结：
- 扩展一个Deployment

在启动一个Deployment的时候，你可以为命令kubuctl run添加--replicas参数，从而达到启动多个实例的效果。

**Scaling预览**
扩展前：
![扩展前](http://upload-images.jianshu.io/upload_images/2976869-ac7dd2cee17d9b08..png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
扩展后：
![扩展后](http://upload-images.jianshu.io/upload_images/2976869-e6d978a9352a7cfe..png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

scaling out:扩展部署将确保创建新Pod并将其排定到具有可用资源的节点。
scaling in:缩放将减少Pod到新的期望状态的数量。
autocaling:kubernetes支持Pods的自动扩展。
scaling to zero:缩放到零也是可能的，它将终止指定部署的所有Pod。

运行一个应用的多个实例需要一种分发流量的方式。Services有一个集成的负载均衡器，以确保将网络流量分发到外露的Deployment的所有Pod。Services将持续监控使用断点的Pod，以确保流量可以被发送到可用的Pod.

Scaling通过改变Deployment中的副本个数做到扩展或缩放。

一旦你有了一个运行了多个实例的应用以后，无需停机就可以进行滚动更新。我们将在下一个单元学习这个。现在，让我们到在线终端去scale我们的应用吧。

**使用kubectl scale命令scale一个Deployment并且查看一个运行中的负载均衡**
`kubectl get deployments`
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1         1         1            1           4m
状态说明
DESIRED：显示已经配置的副本数
CURRENT：显示正在运行多少副本
UP-TO-DATE：已更新以匹配所需（已配置）状态的副本
AVAILABLE ：显示用户有多少可用的副本

接下来，我们把Deployment扩展到4个副本。使用命令如下：
`kubectl scale +deployment type+名字+已配置的实例副本数`
`kubect scale deployments/kubernetes-bootcamp --replicas=4`

`kubectl get deployments`
```
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   4         4         4            4           17m
```

检查当前pod数
`kubectl get pods -o wide`
NAME                                   READY     STATUS    RESTARTS   AGE       IP         NODE
kubernetes-bootcamp-5dbf48f7d4-4sdxt   1/1       Running   0          19m       172.18.0.4   host01
kubernetes-bootcamp-5dbf48f7d4-hnx4g   1/1       Running   0          1m        172.18.0.5   host01
kubernetes-bootcamp-5dbf48f7d4-r6ntq   1/1       Running   0          1m        172.18.0.7   host01
kubernetes-bootcamp-5dbf48f7d4-v5f9q   1/1       Running   0          1m        172.18.0.6   host01

查看部署日志
`kubectl describe deployments/kubernetes-bootcamp`
Name:                   kubernetes-bootcamp
Namespace:              default
CreationTimestamp:      Thu, 01 Mar 2018 08:31:39 +0000
Labels:                 run=kubernetes-bootcamp
Annotations:            deployment.kubernetes.io/revision=1
Selector:               run=kubernetes-bootcamp
Replicas:               4 desired | 4 updated | 4 total | 4 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
Pod Template:
  Labels:  run=kubernetes-bootcamp
  Containers:
   kubernetes-bootcamp:
    Image:        gcr.io/google-samples/kubernetes-bootcamp:v1
    Port:         8080/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
OldReplicaSets:  <none>
NewReplicaSet:   kubernetes-bootcamp-5dbf48f7d4 (4/4 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  20m   deployment-controller  Scaled up replica set kubernetes-bootcamp-5dbf48f7d4 to 1
  **Normal  ScalingReplicaSet  3m    deployment-controller  Scaled up replica set kubernetes-bootcamp-5dbf48f7d4 to 4**

### 负载均衡
设置名称为NODE_PORT的环境变量
```
export NODE_PORT=$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')
echo NODE_PORT=$NODE_PORT
```
NODE_PORT=30257

每次请求我们都会碰到不同的Pod。这表明负载平衡正在工作
`curl $(minikube ip):$NODE_PORT`
$ curl $(minikube ip):$NODE_PORT
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-4sdxt | v=1
$ curl $(minikube ip):$NODE_PORT
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-4sdxt | v=1
$ curl $(minikube ip):$NODE_PORT
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-4sdxt | v=1
$ curl $(minikube ip):$NODE_PORT
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-hnx4g | v=1
$ curl $(minikube ip):$NODE_PORT
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-hnx4g | v=1
$ curl $(minikube ip):$NODE_PORT
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-r6ntq | v=1

`kubectl get pods`
NAME                                   READY     STATUS    RESTARTS   AGE
kubernetes-bootcamp-5dbf48f7d4-4sdxt   1/1       Running   0          26m
kubernetes-bootcamp-5dbf48f7d4-hnx4g   1/1       Running   0          8m
kubernetes-bootcamp-5dbf48f7d4-r6ntq   1/1       Running   0          8m
kubernetes-bootcamp-5dbf48f7d4-v5f9q   1/1       Running   0          8m

### 缩小Deployment
将服务缩小到2个副本，再次运行scale命令
`kubectl scale deployments/kubernetes-bootcamp --replicas=2`

查看Deployment个数
`kubectl get deployments`

查看Pod个数
`kubectl get pods -o wide`
NAME                                   READY     STATUS    RESTARTS   AGE       IP         NODE
kubernetes-bootcamp-5dbf48f7d4-flnt6   1/1       Running   0          16s       172.18.0.2   host01
kubernetes-bootcamp-5dbf48f7d4-vwxbh   1/1       Running   0          4s        172.18.0.5   host01

如果不带 -o wide参数的话，将隐藏IP和NODE这两个重要属性。
`kubectl get pods`
NAME                                   READY     STATUS    RESTARTS   AGE
kubernetes-bootcamp-5dbf48f7d4-flnt6   1/1       Running   0          24s
kubernetes-bootcamp-5dbf48f7d4-vwxbh   1/1       Running   0          12s
