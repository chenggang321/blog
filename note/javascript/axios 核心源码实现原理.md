---
date: 2021-03-04 14:30
title: axios 核心源码实现原理
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---


axios 核心源码实现原理
--------------

#### 1. Interceptors 拦截器

axios 官网中对 `Interceptors` 的使用方法如下：
用户可以通过 `then` 方法为请求添加回调，而拦截器中的回调将在 then 中的回调之前执行：

```js
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});
```

之后你可能需要能移除 `Interceptors` ：

```js
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

也可以为`axios`实例添加一个`Interceptors`：

```js
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```

从其中的使用方法，我们可以知道 request 拦截器需要在请求之前执行，response 拦截器需要再请求之后执行。我们看一下`axios`的实现方式：
首先`axios`为拦截器定义了一个管理中心`InterceptorManager`：

```js
function InterceptorManager() {
  this.handlers = [];
}

InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};
```

其次，当实例化`Axios`时，分别创建一个`request` 和一个`response`拦截器：

```js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}
```

然后我们需要通过`use`来分别添加拦截器时，便将我们定义的`resolve`和`reject`收入对应的`request`和`response`中。在此之前，我们需要对`Promise`有一个简单的了解：

> Promise then 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用链式写法，即 then 方法后面再调用另一个 then 方法。

```js
getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
});
```

> 上面的代码使用then方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。采用链式的then，可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个Promise对象（即有异步操作），这时后一个回调函数，就会等待该Promise对象的状态发生变化，才会被调用。

```js
getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function funcA(comments) {
  console.log("resolved: ", comments);
}, function funcB(err){
  console.log("rejected: ", err);
});
```

> 上面代码中，第一个then方法指定的回调函数，返回的是另一个Promise对象。这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化。如果变为resolved，就调用funcA，如果状态变为rejected，就调用funcB。

接下来，看看`request`方法是如何实现拦截器功能的：

```js
Axios.prototype.request = function request(config) {
  ...
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};
```

首先定义了一个数组调用链`chain`，然后通过`unshift`将 `request interceptors`推入数组头部，将`response interceptors`推入数组尾部。最后通过`while`这样一个循环执行`promise.then`来达到链式调用。
来看一张图：

![](https://pic1.zhimg.com/80/v2-3445b621a1e8214b0b3816ddcabfab86_hd.jpg)

通过巧妙的利用`unshift、push、shift`等数组队列、栈方法，实现了请求拦截、执行请求、响应拦截的流程设定，注意无论是请求拦截还是响应拦截，越先添加的拦截器总是越“贴近”执行请求本身。

#### 2. 适配 nodejs 和 浏览器环境

我们知道 axios 可以用来发送浏览器请求，也可以用于 nodejs 发送服务端请求，主要是因为 axios 内部实现了一个请求适配器`adapter`:

```js
// 发送请求方法
function dispatchRequest (config) {
  ...
  var adapter = config.adapter || defaults.adapter;
  return adapter(config).then(function onAdapterResolution(response) { ... }, function onAdapterRejection(reason) {...})
}
```

看一下 `adapter` 具体实现：

```js
function getDefaultAdapter() {
  var adapter;
  // 如果存在 process 且 process 变量是一个对象，则判断为 nodejs 环境，封装 http 来请求
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('./adapters/http');
    // 如果存在 XMLHttpRequest 对象，则调用 XMLHttpRequest 来请求
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('./adapters/xhr');
  }
  return adapter;
}
```

有了这些，我们可以大胆猜想一下，我们是不是可以实现不同的`adapter`来达到跨平台支持的目的，只需要修改底层请求方法便可。

#### 3. 自动转换JSON数据

在默认情况下，axios将会自动的将传入的data对象序列化为JSON字符串，将响应数据中的JSON字符串转换为JavaScript对象。这是一个非常实用的功能，但实现起来非常简单：

```js
var defaults = {
  ...
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    // 这里对 object 做了转换
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    // 尝试转换 string -> json
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }]
  ...
}
```

#### 4. 支持客户端 XSRF 攻击防护

XSRF 攻击，即“跨站请求伪造”(Cross Site Request Forgery)攻击。通过窃取用户cookie，让用户在本机（即拥有身份 cookie 的浏览器端）发起用户所不知道的请求。防护XSRF攻击的一种方法是设置特殊的 `xsrf token`，axios实现了对这种方法的支持：

```js
// 设置 xsrf 的 cookie 字段名和 header 字段名
{
  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
}
```

```js
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
     ...
    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = require('./../helpers/cookies');

      // Add xsrf header
      // 如果允许cookie跨域或者同源，首先会从cookie中读取定义的token
      // 如果存在 xsrfValue 会将读取到的 xsrfValue 携带进入 requestHeaders 中

      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }
  });
};
```

#### 总结

我们可以看到，axios在实现封装网络请求所需的各项扩展功能时，都是使用的最朴素JavaScript源生方法，并且总是通过简单的链式then方法将这些功能与核心的promise对象关联。此外各种优化性能的方法，也都是采用的很基本的原理。

这对于现在前端离了工具库就写不了代码的现状，很有启发意义。

**参考：**

[阮一峰ES6 Promise](http://es6.ruanyifeng.com/#docs/promise)
[【源码拾遗】axios —— 极简封装的艺术](https://zhuanlan.zhihu.com/p/28396592)
