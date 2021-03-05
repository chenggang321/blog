---
date: 2021-03-04 14:30
title: js模块加载
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---

```js
(function () {
    //存储加载好的模块
    var Module = function () {
        //根目录
        this.rootUrl = getRootUrl;
    };
    //初始化
    var __init__ = {
        baseUrl: document.baseURI,
        head: document.getElementsByTagName('head')[0],
        requireLoading: {},
        modules: {}
    };

    var require = function (modules, callback) {
        //批量生成script
        modules.forEach(function (item) {
            //只加载一次文件
            if (!__init__.requireLoading[item]) {
                creatScript(item,callback);
            }
        });
        //creatScript
        function creatScript(moduleName,callback) {
            //记载加载模块
            __init__.requireLoading[moduleName]=true;
            var url = getRootUrl() + '/' + moduleName + '.js';
            var script = document.createElement('script');
            script.src = url;
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    if(!__init__.modules[getModuleName(moduleName)].loading){
                        __init__.modules[getModuleName(moduleName)].callback();
                    }
                    __init__.modules[getModuleName(moduleName)].loading = true;
                }
            };
            __init__.head.insertBefore(script, __init__.head.childNodes[0]);
            //执行回调
            //callback&&callback();
            //__init__.modules[moduleName] && __init__.modules[moduleName].callback();
        }

        //移除script
    };
    var define = function (moduleName, deps, callback) {
        //先加载依赖
        require(deps);
        //注册模块
        var module = {
            define: true,
            loading: false,
            callback: callback
        };
        moduleName=getModuleName(moduleName);
        if (!__init__.modules[moduleName]) {
            __init__.modules[moduleName] = module;
        }
    };

    // 获取当前正在执行的js代码段，这个在onload事件之前执行
    var getRootUrl = function () {
        return __init__.baseUrl.substring(0, __init__.baseUrl.lastIndexOf('/'));
    };
    //获取模块名称
    var getModuleName=function(str){
        return str.substring(str.lastIndexOf('/')+1,str.length);
    };
    window.require = require;
    window.define = define;
})();
require(['modules/Array'], function () {
    console.log('this is callback');
});
```
