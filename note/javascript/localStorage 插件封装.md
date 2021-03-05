---
date: 2021-03-04 14:30
title: localStorage 插件封装
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---


##localStorage 插件封装

```js
/*
*  locationStorage 操作方法
* */
;(function (factory) {
    // 不同引入方式
    var registeredModuleLoader;
    if (typeof define === 'function' && define.amd) {
        define(factory);
        registeredModuleLoader = true;
    }
    if (typeof exports === 'object') {
        module.exports = factory();
        registeredModuleLoader = true;
    }
    if (!registeredModuleLoader) {
        var OldLocalStorage = window.$localStorage;
        var api = window.$localStorage = factory();
        api.noConflict = function () {
            window.$localStorage = OldLocalStorage;
            return api;
        }
    }
})(function () {
    function init(converter) {
        function api() {
        }

        api.set = function set(key, value) {
            window.localStorage[key] = value
        }
        api.get = function get(key, defaultValue) {
            return window.localStorage[key] || defaultValue
        }
        api.setObject = function setObject(key, value) {
            window.localStorage[key] = JSON.stringify(value)
        }
        api.remove = function remove(key) {
            window.localStorage.removeItem(key)
        }
        api.getObject = function getObject(key) {
            return JSON.parse(window.localStorage[key] || '{}')
        }
        api.removeAll = function removeAll() {
            window.localStorage.clear()
        }
        api.default = {};
        api.withConverter = init;
        return api;
    }

    return init(function () {
    })
});
```

使用方法
----

引入方法

```html
<script src="js.localStorage.js"></script>
```

或

```
npm install js-localStorage --save
```

使用方法

```
$localStorage.set('test','this is a test!')
```
