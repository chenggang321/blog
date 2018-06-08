创建一个axios实例。baseURL timeout headers.
```
const service = axios.create({
    baseURL: '/moon',
    timeout: 5000
});
```
拦截器：在request和response被then和catch处理前，进行拦截。
官方demo：
//增加一个request拦截器
```
axios.interceptors.request.use(function(config){
	//在请求发送前做一些事情
    return config;
   },function (error){
    //在请求报错前做一些事
    return Promise.reject(error)
   });
```
```
//增加一个响应拦截器
axios.interceptors.response.use(function(response){
	//在获得响应数据前做一些事
    return response;
    },function (error){
    //在响应报错前做一些事
    return Promise.reject(error)
});
```

同事代码：
```
service.interceptors.request.use(config => {
    config.method = config.method || 'GET';
    config.data = config.data || {};
    errorfn = typeof config.onerror === 'function' ? config.onerror : _onerror;
    // 判断是否有token存在，若存在则携带token发送请求
    if (Cookies.get('token')) {
        config.headers.common['Authorization'] = Cookies.get('token');
    }
    if (config.upload) {
        config.headers.common['Content-Type'] = 'multipart/form-data';
        config.transformRequest = (data, headers) => {
            let param = new FormData();
            for (name in data) {
                let value = data[name];
                if (value instanceof Object) {
                    if(value.length){
                        for (let i = 0; i < value.length; i++) {
                            param.append(name, value[i], value[i].name);
                        }
                    }else{
                        param.append(name, value, value.name);
                    }
                    
                } else {
                    param.append(name, value);
                }
            }
            return param;
        };
    }

    // 若formlize==true ,则将数据转化为form-data的形式
    if (config.formlize) {
        config.transformRequest = (data, headers) => {
            return _formlize(data);
        }
    }

    return config;
}, error => {
    errorfn.apply(this, arguments);
    return Promise.reject(error);
});
```

config.headers中是头信息，其中common是通用头部，Authorization是安全请求首部，这个首部是客户端发送的，用来向服务器回应自己的身体验证信息。**客户端在收到来自服务器的401 Authentication Required响应后，要在其请求中包含这个首部。**首部值取决于认证方案。《HTTP权威指南》第十四章有详细讲解。
Content-Type定义了内容的MIME类型。为multipart/form-data，multipart是包含其他对象的组合对象，multipart/form-data表示根据用户填表的结果将一组值封装起来。

这里其实就是做了一个模拟表单数据的事情。

主要是FormData 这个数据类型，可以模拟“用户表单数据”，XMR进行提交。

>XMLHttpRequest Level 2添加了一个新的接口FormData.利用FormData对象,我们可以通过JavaScript用一些键值对来模拟一系列表单控件,我们还可以使用XMLHttpRequest的send()方法来异步的提交这个"表单".
>这样你就可以在发送请求之前自由地附加不一定是用户编辑的字段到表单数据里.

config.transfromRequest是什么？
1⃣️`transformRequest`允许请求数据发送到服务器前进行改变。
2⃣️这个方法仅仅仅适用于 "PUT" "POST"和"PATCH"这几种方法。
3⃣️数组中的最后一个函数，必须返回一个字符串，或Buffer实例，ArrayBuffer实例，FormData实例，或者是Stream。
4⃣️你也许需要修改头对象
```
transformRequest:[function (data,headers)]{
	//Do whatever you want to transform the data
    return data;
}
```
```
其实同理，从服务器拿到的响应可以在被发送到then和catch之前，同样进行一次转换。
transfromResponse:[function (data)]{
	//Do whatever you want to transform the data
    
    return data;
}
```