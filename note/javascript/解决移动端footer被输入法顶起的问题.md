---
date: 2021-03-04 14:30
title: 解决移动端footer被输入法顶起的问题
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---

这里我解决的方法是监听document 的高度的变化来控制footer的显示和隐藏，具体代码如下：（采用的是原生代码）

```js
var height=document.documentElement.clientHeight;
    var cHeight;
    window.onresize = function(){
        cHeight=document.documentElement.clientHeight;
        if(cHeight<height){
            document.getElementsByClassName("footer")[0].style.display="none";
        }
        if(height==cHeight){
            document.getElementsByClassName("footer")[0].style.display="block";
        }
    }
```
