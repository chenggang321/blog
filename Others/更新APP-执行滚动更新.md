目标：
- 使用kubectl做一次滚动更新

### 更新一个应用
用户期望应用一直是可用的，而开发者期望一天部署多次新版本。
在k8s里，这是通过滚动更新来实现的。
**Rolling updates**允许增量更新新的Pods实例，部署的更新以零宕机时间进行。新的Pod将在具有可用资源的节点上进行调度。、
在之前的单元里，我们伸缩app以达到运行多个实例的目的。这是一种不影响应用可用的执行更新的需求。默认情况下，Pod实例的最大个数在更新期间是不可用的，而且可以新创建的新Pod也只能是一个。无论Pod的个数和百分比都是可以配置的。在k8s中，更新都是由版本的，而且无论什么时候的部署更新都能被回退到之前的（稳定）版本。

总结：
- 更新应用

>滚动更新允许部署的更新以零宕机时间的增量更新Pod实例来完成。

### 滚动更新概览
![image](https://user-images.githubusercontent.com/19262750/36879246-d4fea19e-1dfd-11e8-95fc-a0bc5a29f20f.png)
![image](https://user-images.githubusercontent.com/19262750/36879275-ee8df308-1dfd-11e8-93c1-c9f52e3df75e.png)
![image](https://user-images.githubusercontent.com/19262750/36879289-f91f13ec-1dfd-11e8-96ce-4bd3a86df3fa.png)
![image](https://user-images.githubusercontent.com/19262750/36879337-2fb0813e-1dfe-11e8-8397-c3083eb2c2a4.png)
与伸缩应用类似，如果部署被公开暴露了，服务将对流量做负载均衡到可用的Pod。一个可用的Pod是一个用户可用的应用实例。
滚动更新包括以下几个步骤：
- 通过image更新，将应用从一个环境推广到另外一个环境
- 回滚到之前的版本
- 零宕机时间的持续集成和持续应用分发

>如果一个部署被公开暴露了出来，更新期间服务将会把流量负载均衡到可用的Pod。

- 通过kubectl set image更新一个已部署的应用
- 使用kubectl rollout undo回滚到之前的版本

### 更新app的版本
主要看image字段
`kubectl describe pods`
都是Image:          gcr.io/google-samples/kubernetes-bootcamp:v1

**升级应用image到version 2**
命令：set image + 部署名 + 新的image版本

```
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2
```
deployment "kubernetes-bootcamp" image updated

### 验证更新
检查正在运行的App。我们可以用describe service找出外露IP和端口。
`kubectl describe services/kubernetes-bootcamp`

设置NODE_PORT变量
```
export NODE_PORT=$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')
echo NODE_PORT=$NODE_PORT
```
NODE_PORT=32427

验证更新
`curl $(minikube ip):$NODE_PORT`
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-7689dc585d-7b2gk | v=2

确认更新
`kubectl rollout status deployments/kubernetes-bootcamp`
deployment "kubernetes-bootcamp" successfully rolled out

查看image版本
`kubectl describe pods`
Image:          jocatalin/kubernetes-bootcamp:v2

### 回滚更新
升级deployments/kubernetes-bootcamp到v10
`kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10`

`kubectl get deployments`
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   4         5         2            3           17m

`kubectl get pods`
NAME                                   READY     STATUS             RESTARTS   AGE
kubernetes-bootcamp-5569c6b8d6-86248   0/1       ImagePullBackOff   0          4m
kubernetes-bootcamp-5569c6b8d6-8cn6l   0/1       ImagePullBackOff   0          4m
kubernetes-bootcamp-7689dc585d-847df   1/1       Running            0          13m
kubernetes-bootcamp-7689dc585d-vk68v   1/1       Running            0          13m
kubernetes-bootcamp-7689dc585d-x7q9j   1/1       Running            0          13m

回滚到上一个版本（更新错误时使用，比如我们的repo中没有v10但却set了image）
`kubectl rollout undo deployments/kubernetes-bootcamp`
deployment "kubernetes-bootcamp"

此时再查看部署
`kubectl get deployments`
NAME                  DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   4         4         4            4           4m