一直在学vue，react和koa，然后最近接受的项目居然是angular和express，刚开始压力山大，做项目的过程中才发现：用vue和react做过项目后，用angular写项目有很多相通的东西；用koa踩过node层的坑以后，用express也是大同小异。

其实最为核心的部分是：前端基本功，后端基本功。具体是什么这里就不赘述了。下面将开始记录自己这段时间，踩过的angular1.6.5的坑。

1.model层数据更新，而view层视图不更新
```
setTimeout(function(){
    $scope.$apply(function(){
        $scope.foo = "foo";
        $scope.bar = JSON.parse(JSON.stringify({"key":"value"}))//deepCopy
        $scope.baz = Object.assign({},{"key",value})//shallowCopy
    })
},500)
```
2.标签过滤功能如何实现
数据已经缓存到本地，数据搜索仅仅是对前端数据层的过滤，不涉及与后端的异步通信。
```
ng-repeat="item in list | filter:{name:currentUser}"
```
3.angular通过什么分发内容
directive机制。
```
    .directive('dirList',[function(){
        return {
            retrict: 'E',
            replace: 'true',
            templateUrl: 'views/appDirList.html'
        }
    }])
```
其中的retrict:'E'可以使得驼峰式的dirList转换为横线式的<dir-list></dir-list>，这个算法在vue源码中也有相应实现。

4.如何查看当前$scope
`angular.element($0).scope()`
更加高效的方式，使用chrome扩展：
[ng-inspector for AngularJS](https://chrome.google.com/webstore/detail/ng-inspect-for-angularjs/cidepfmbgngpdapgncfhpecbdhmnnemf)
[ng-inspector for Angular](https://chrome.google.com/webstore/detail/ng-inspect-for-angular/onfmmmemcmipkohkkgofiojpiahbpogh)