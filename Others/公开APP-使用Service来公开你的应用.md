目标：
- 了解Kubernetes中的Service
- 理解与Service有关的label和LabelSelector对象
- 使用Service向Kubernetes集群外公开应用

### Kubernetes Services概览
Kubernetes的Pod是会死掉的，也就是说可以被中止或者销毁的。但事实上Pods有一个生命周期。当一个工作node挂掉了以后，工作在Node上的Pods也会丢失。通过创建新的Pod来保证应用的运行态，也就是说通过一个ReplicationController可以动态地驱动集群返回到理想的状态。举个例子的话，考虑具有3个副本的图像处理的后端服务。这些副本是可替代的；即使Pod丢失或者重建，前端系统都不用考虑后端的副本。也就是说，每个k8s集群中的Pod有一个独立的IP地址，甚至是同一Node的Pod，所以需要一种方法自动协调Pod之间的更改，以便你的应用程序可以继续运行。

Kubernetes中的Service是一种定义Pod集合和为他们赋权的策略的一种抽象。Services可以使两个独立的Pod之间松散耦合。**一个Service可以由YMAL（更好），JSON或者Kubernettes对象定义。** 由服务定位的Pod集合通常由LabelSelector决定（请看下文，从而了解为什么我们需要的是Service而不是在规范中包含**selector**）。

尽管每个Pod都有独立的IP地址，这些IP没有Service的话，不能暴露到集权之外。Service允许您的应用程序接收流量。通过在ServiceSpec设置type的值，就可以使得Services以不同方式暴露：
- 集群IP(默认) - 将服务公开在集群的内部Ip上。这种类型设置使得Service仅仅在集群内部可以获得。
- 节点端口 - 使用NAT将服务暴露集群中选中的节点的同意端口上。
- 负载均衡器 -当前的云上创建一个额外的负载均衡器，并为服务分配一个固定的外部的IP。是节点端口的超集。
- 外部名字 - 使用一个随意的名字去暴露一个服务（由externalName字段指定），通过返回一个带有名字的CNAME记录。不需要使用代理。这种类型需要使用kubernetes1.7版本以上或者更高版本的**kube-dns**。

更多关于Services类型的信息可以参照[Using Source IP](https://kubernetes.io/docs/tutorials/services/source-ip/)和[Connecting Applications with Services](https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/)

此外，请注意，有些服务使用情况涉及到未在规范中定义**selector**。没有**selecto**r创建的服务也不会创建相应的端点对象。这允许用户手动将服务映射到特定的端点。为什么没有选择器的另一个可能性是你严格使用**type：ExternalName**。

总结
- 暴露Pod给外部流量
- 跨多Pod的流量负载均衡
- 使用Label

>一个Kubernetes Service是一个定义了Pod的逻辑集，并且支持流量暴露，负均衡和这些Pod的服务发现的抽象层。

Services 和 Labels
![image](https://user-images.githubusercontent.com/19262750/36830643-7a790730-1d5f-11e8-9cd6-d6315dd9e72a.png)


一个服务路由节点之间的流量。服务允许在集群中让Pod销毁和复制而不影响自己的应用。在相关Pod中发现和路由（例如应用程序中的前端后端组件）由Kubernetes Services处理。

Services使用labels和selectors匹配一组Pod，二者可以对k8s中的对象进行逻辑运算。Label是以key-value对的形式连接，可以有多种方式使用：
- 指定开发，测试和用于生产环境的对象
- 嵌入版本tag
- 使用标签分类对象


![image](https://user-images.githubusercontent.com/19262750/36830655-8394be54-1d5f-11e8-99fb-213a9e098ea2.png)

Label与对象的连接可以发生在创建时，也可以之后再连接。任何时候都可以修改。让我们使用一个Service去暴露我们的应用吧，再为应用一些label。

### 创建一个服务
获取集群的当前Services：
`kubectl get services`
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   56s

使用kubectl的expose命令去创建一个新的服务并且暴露到外部流量中
`kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080`
service "kubernetes-bootcamp" exposed

`kubectl get services`
NAME                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes            ClusterIP   10.96.0.1      <none>        443/TCP          3m
kubernetes-bootcamp   NodePort    10.99.60.120   <none>        8080:31140/TCP   35s

查看外部开放了哪些端口
`kubectl describe services/kubernetes-bootcamp`
Name:                     kubernetes-bootcamp
Namespace:                default
Labels:                   run=kubernetes-bootcamp
Annotations:              <none>
Selector:                 run=kubernetes-bootcamp
Type:                     NodePort
IP:                       10.99.60.120
Port:                     <unset>  8080/TCP
TargetPort:               8080/TCP
NodePort:                 <unset>  31140/TCP
Endpoints:                172.18.0.2:8080
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>

创建一个名为NODE_PORT的环境变量，该环境变量具有分配的节点端口的值
```
export NODE_PORT=$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')
echo NODE_PORT=$NODE_PORT
```

使用curl，节点IP和外部端口测试应用程序是否暴露在了集群外部
`curl $(minikube ip):$NODE_PORT`
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-5dbf48f7d4-zr75m | v=1

### 使用labels

查看label的名字：
`kubectl describe deployment`

使用label查询Pods:
`kubectl get pods -l run=kubernetes-bootcamp`

通过label也可以查询services
`kubectl get services -l run=kubernetes-bootcamp`

获取pod名字存储到POD_NAME环境变量中
```
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```

**如何应用一个新的label**
kubectl label + 对象类型 +对象名字+新的label
例如：`kubectl label pod $POD_NAME app=v1`
pod "kubernetes-bootcamp-5dbf48f7d4-zr75m" labeled

检查新label有没有加上去
`kubectl describe pods $POD_NAME`
Name:           kubernetes-bootcamp-5dbf48f7d4-zr75m
Namespace:      default
Node:           host01/172.17.0.37
Start Time:     Thu, 01 Mar 2018 06:19:40 +0000
Labels:         **app=v1**
                pod-template-hash=1869049380
                run=kubernetes-bootcamp
Annotations:    <none>
Status:         Running
IP:             172.18.0.2
Controlled By:  ReplicaSet/kubernetes-bootcamp-5dbf48f7d4
Containers:
  kubernetes-bootcamp:
    Container ID:   docker://856f9ae61b81dd7f3d97a6b48ca04482bfe626846b02e203a1bb7f5679d57da5
    Image:          gcr.io/google-samples/kubernetes-bootcamp:v1
    Image ID:       docker-pullable://jocatalin/kubernetes-bootcamp@sha256:0d6b8ee63bb57c5f5b6156f446b3bc3b3c143d233037f3a2f00e279c8fcc64af
    Port:           8080/TCP
    State:          Running
      Started:      Thu, 01 Mar 2018 06:19:43 +0000
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-4pxpp (ro)
Conditions:
  Type           Status
  Initialized    True
  Ready          True
  PodScheduled   True
Volumes:
  default-token-4pxpp:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-4pxpp
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     <none>
Events:
  Type     Reason                 Age                From               Message
  ----     ------                 ----               ----               -------
  Warning  FailedScheduling       17m (x2 over 17m)  default-scheduler  0/1 nodes are available: 1 NodeNotReady.
  Normal   Scheduled              17m                default-scheduler  Successfully assigned kubernetes-bootcamp-5dbf48f7d4-zr75m to host01
  Normal   SuccessfulMountVolume  17m                kubelet, host01    MountVolume.SetUp succeeded for volume "default-token-4pxpp"
  Normal   Pulled                 17m                kubelet, host01    Container image "gcr.io/google-samples/kubernetes-bootcamp:v1" already present on machine
  Normal   Created                17m                kubelet, host01    Created container
  Normal   Started                17m                kubelet, host01    Started container

通过label查询Pod
`kubectl get pods -l app=v1`

**Deployment会自动为Pod创建一个label**
`$ kubectl expose deployment/**kubernetes-bootcamp** --type="NodePort" --port 8080`
service "kubernetes-bootcamp" exposed
`$ kubectl describe deployment`
Name:                   kubernetes-bootcamp
Namespace:              default
CreationTimestamp:      Thu, 01 Mar 2018 06:50:55 +0000
Labels:                 run=kubernetes-bootcamp
Annotations:            deployment.kubernetes.io/revision=1
Selector:               run=kubernetes-bootcamp
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  1 max unavailable, 1 max surge
Pod Template:
  Labels:  **run=kubernetes-bootcamp**
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
NewReplicaSet:   kubernetes-bootcamp-5dbf48f7d4 (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  7s    deployment-controller  Scaled up replica set kubernetes-bootcamp-5dbf48f7d4 to 1

**删除一个service**
通过label和delete去删除一个service
`kubectl delete service -l run=kubernetes-bootcamp`

确定服务被删除
`kubectl get services`

查询之前暴露出的IP和端口
`curl $(minikube ip):$NODE_PORT`
curl: (7) Failed to connect to 172.17.0.37 port 31140: Connection refused（证明集群外部再也访问不到应用）

确保app依然还在pod内部运行
`kubectl exec -ti $POD_NAME curl localhost:8080`