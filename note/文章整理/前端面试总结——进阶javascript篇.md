---
date: 2021-03-04 14:30
title: 前端面试总结——进阶javascript篇
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---

 前端面试总结——进阶javascript篇
 =====================

 ### 1.自己实现一个bind函数

 **_原理：通过apply或者call方法来实现。_**

 #### (1)初始版本


 ```
 Function.prototype.bind=function(obj,arg){
   var arg=Array.prototype.slice.call(arguments,1);
   var context=this;
   return function(newArg){
     arg=arg.concat(Array.prototype.slice.call(newArg));
     return context.apply(obj,arg);
   }
 }
 ```


 #### (2) 考虑到原型链

 **_为什么要考虑？因为在new 一个bind过生成的新函数的时候，必须的条件是要继承原函数的原型_**


 ```
 Function.prototype.bind=function(obj,arg){
   var arg=Array.prototype.slice.call(arguments,1);
   var context=this;
   var bound=function(newArg){
     arg=arg.concat(Array.prototype.slice.call(newArg));
     return context.apply(obj,arg);
   }
   var F=function(){}
   //这里需要一个寄生组合继承
   F.prototype=context.prototype;
   bound.prototype=new F();
   return bound;
 }
 ```


 ### 2.用setTimeout来实现setInterval

 #### (1)用setTimeout()方法来模拟setInterval()与setInterval()之间的什么区别？

 首先来看setInterval的缺陷，使用setInterval()创建的定时器确保了定时器代码规则地插入队列中。这个问题在于：如果定时器代码在代码再次添加到队列之前还没完成执行，结果就会导致定时器代码连续运行好几次。而之间没有间隔。不过幸运的是：javascript引擎足够聪明，能够避免这个问题。当且仅当没有该定时器的如何代码实例时，才会将定时器代码添加到队列中。这确保了定时器代码加入队列中最小的时间间隔为指定时间。

 这种重复定时器的规则有两个问题：**_1.某些间隔会被跳过 2.多个定时器的代码执行时间可能会比预期小。_**

 下面举例子说明：

 假设，某个onclick事件处理程序使用啦setInterval()来设置了一个200ms的重复定时器。如果事件处理程序花了300ms多一点的时间完成。![2018-07-10 11 36 43](https://user-images.githubusercontent.com/17233651/42487876-92656f2c-8435-11e8-8a5f-0a97918039da.png)


 这个例子中的第一个定时器是在205ms处添加到队列中，但是要过300ms才能执行。在405ms又添加了一个副本。在一个间隔，605ms处，第一个定时器代码还在执行中，而且队列中已经有了一个定时器实例，结果是605ms的定时器代码不会添加到队列中。结果是在5ms处添加的定时器代码执行结束后，405处的代码立即执行。


 ```
 function say(){
   //something
   setTimeout(say,200);
 }
 setTimeout(say,200)
 ```


 或者


 ```
 setTimeout(function(){
    //do something
    setTimeout(arguments.callee,200);
 },200);
 ```


 ### 3.js怎么控制一次加载一张图片，加载完后再加载下一张

 #### (1)方法1


 ```
 <script type="text/javascript">
 var obj=new Image();
 obj.src="http://www.phpernote.com/uploadfiles/editor/201107240502201179.jpg";
 obj.onload=function(){
 alert('图片的宽度为：'+obj.width+'；图片的高度为：'+obj.height);
 document.getElementById("mypic").innnerHTML="<img src='"+this.src+"' />";
 }
 </script>
 <div id="mypic">onloading……</div>
 ```


 #### (2)方法2


 ```
 <script type="text/javascript">
 var obj=new Image();
 obj.src="http://www.phpernote.com/uploadfiles/editor/201107240502201179.jpg";
 obj.onreadystatechange=function(){
 if(this.readyState=="complete"){
 alert('图片的宽度为：'+obj.width+'；图片的高度为：'+obj.height);
 document.getElementById("mypic").innnerHTML="<img src='"+this.src+"' />";
 }
 }
 </script>
 <div id="mypic">onloading……</div>
 ```


 ### 3.代码的执行顺序


 ```
 setTimeout(function(){console.log(1)},0);
 new Promise(function(resolve,reject){
    console.log(2);
    resolve();
 }).then(function(){console.log(3)
 }).then(function(){console.log(4)});

 process.nextTick(function(){console.log(5)});

 console.log(6);
 //输出2,6,5,3,4,1
 ```


 为什么呢？具体请参考我的文章：[ 从promise、process.nextTick、setTimeout出发，谈谈Event Loop中的Job queue](https://github.com/forthealllight/blog/issues/5)

 ### 4.如何实现sleep的效果（es5或者es6）

 #### (1)while循环的方式


 ```
 function sleep(ms){
    var start=Date.now(),expire=start+ms;
    while(Date.now()<expire);
    console.log('1111');
    return;
 }
 ```


 执行sleep(1000)之后，休眠了1000ms之后输出了1111。上述循环的方式缺点很明显，容易造成死循环。

 ### (2)通过promise来实现


 ```
 function sleep(ms){
   var temple=new Promise(
   (resolve)=>{
   console.log(111);setTimeout(resolve,ms)
   });
   return temple
 }
 sleep(500).then(function(){
    //console.log(222)
 })
 //先输出了111，延迟500ms后输出222
 ```


 ### (3)通过async封装


 ```
 function sleep(ms){
   return new Promise((resolve)=>setTimeout(resolve,ms));
 }
 async function test(){
   var temple=await sleep(1000);
   console.log(1111)
   return temple
 }
 test();
 //延迟1000ms输出了1111
 ```


 \####(4).通过generate来实现


 ```
 function* sleep(ms){
    yield new Promise(function(resolve,reject){
              console.log(111);
              setTimeout(resolve,ms);
         })  
 }
 sleep(500).next().value.then(function(){console.log(2222)})
 ```


 ### 5.简单的实现一个promise

 首先明确什么是promiseA+规范，参考规范的地址：

 [primiseA+规范](https://promisesaplus.com/)

 如何实现一个promise，参考我的文章：

 [实现一个完美符合Promise/A+规范的Promise](https://github.com/forthealllight/blog/issues/4)

 一般不会问的很详细，只要能写出上述文章中的v1.0版本的简单promise即可。

 ### 6.Function.**proto**(getPrototypeOf)是什么？

 获取一个对象的原型，在chrome中可以通过__proto__的形式，或者在ES6中可以通过Object.getPrototypeOf的形式。

 那么Function.proto是什么么？也就是说Function由什么对象继承而来，我们来做如下判别。


 ```
 Function.__proto__==Object.prototype //false
 Function.__proto__==Function.prototype//true
 ```


 我们发现Function的原型也是Function。

 我们用图可以来明确这个关系：![2018-07-10 2 38 27](https://user-images.githubusercontent.com/17233651/42493275-f55d0860-844e-11e8-983f-e04189a4f3d8.png)


 ### 7.实现js中所有对象的深度克隆（包装对象，Date对象，正则对象）

 通过递归可以简单实现对象的深度克隆，但是这种方法不管是ES6还是ES5实现，都有同样的缺陷，就是只能实现特定的object的深度复制（比如数组和函数），不能实现包装对象Number，String ， Boolean，以及Date对象，RegExp对象的复制。

 #### (1)前文的方法


 ```
 function deepClone(obj){
     var newObj= obj instanceof Array?[]:{};
     for(var i in obj){
        newObj[i]=typeof obj[i]=='object'?  
        deepClone(obj[i]):obj[i];    
     }
     return newObj;
 }
 ```


 这种方法可以实现一般对象和数组对象的克隆，比如：


 ```
 var arr=[1,2,3];
 var newArr=deepClone(arr);
 // newArr->[1,2,3]

 var obj={
    x:1,
    y:2
 }
 var newObj=deepClone(obj);
 // newObj={x:1,y:2}
 ```


 但是不能实现例如包装对象Number,String,Boolean,以及正则对象RegExp和Date对象的克隆，比如：


 ```
 //Number包装对象
 var num=new Number(1);
 typeof num // "object"

 var newNum=deepClone(num);
 //newNum ->  {} 空对象

 //String包装对象
 var str=new String("hello");
 typeof str //"object"

 var newStr=deepClone(str);
 //newStr->  {0:'h',1:'e',2:'l',3:'l',4:'o'};

 //Boolean包装对象
 var bol=new Boolean(true);
 typeof bol //"object"

 var newBol=deepClone(bol);
 // newBol ->{} 空对象

 ....
 ```


 #### (2)valueof()函数

 所有对象都有valueOf方法，valueOf方法对于：如果存在任意原始值，它就默认将对象转换为表示它的原始值。对象是复合值，而且大多数对象无法真正表示为一个原始值，因此默认的valueOf()方法简单地返回对象本身，而不是返回一个原始值。数组、函数和正则表达式简单地继承了这个默认方法，调用这些类型的实例的valueOf()方法只是简单返回这个对象本身。

 对于原始值或者包装类：


 ```
 function baseClone(base){
  return base.valueOf();
 }

 //Number
 var num=new Number(1);
 var newNum=baseClone(num);
 //newNum->1

 //String
 var str=new String('hello');
 var newStr=baseClone(str);
 // newStr->"hello"

 //Boolean
 var bol=new Boolean(true);
 var newBol=baseClone(bol);
 //newBol-> true
 ```


 其实对于包装类，完全可以用=号来进行克隆，其实没有深度克隆一说，

 这里用valueOf实现，语法上比较符合规范。

 对于Date类型：

 因为valueOf方法，日期类定义的valueOf()方法会返回它的一个内部表示：1970年1月1日以来的毫秒数.因此我们可以在Date的原型上定义克隆的方法：


 ```
 Date.prototype.clone=function(){
   return new Date(this.valueOf());
 }

 var date=new Date('2010');
 var newDate=date.clone();
 // newDate->  Fri Jan 01 2010 08:00:00 GMT+0800
 ```


 对于正则对象RegExp：


 ```
 RegExp.prototype.clone = function() {
 var pattern = this.valueOf();
 var flags = '';
 flags += pattern.global ? 'g' : '';
 flags += pattern.ignoreCase ? 'i' : '';
 flags += pattern.multiline ? 'm' : '';
 return new RegExp(pattern.source, flags);
 };

 var reg=new RegExp('/111/');
 var newReg=reg.clone();
 //newReg->  /\/111\//
 ```


 ### 8.简单实现Node的Events模块

 简介：观察者模式或者说订阅模式，它定义了对象间的一种一对多的关系，让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖于它的对象都将得到通知。

 node中的Events模块就是通过观察者模式来实现的：


 ```
 var events=require('events');
 var eventEmitter=new events.EventEmitter();
 eventEmitter.on('say',function(name){
     console.log('Hello',name);
 })
 eventEmitter.emit('say','Jony yu');
 ```


 这样，eventEmitter发出say事件，通过On接收，并且输出结果，这就是一个订阅模式的实现，下面我们来简单的实现一个Events模块的EventEmitter。

 #### (1)实现简单的Event模块的emit和on方法


 ```
 function Events(){
 this.on=function(eventName,callBack){
   if(!this.handles){
     this.handles={};
   }
   if(!this.handles[eventName]){
     this.handles[eventName]=[];
   }
   this.handles[eventName].push(callBack);
 }
 this.emit=function(eventName,obj){
    if(this.handles[eventName]){
      for(var i=0;o<this.handles[eventName].length;i++){
        this.handles[eventName][i](obj);
      }
    }
 }
 return this;
 }
 ```


 这样我们就定义了Events，现在我们可以开始来调用：


 ```
 var events=new Events();
  events.on('say',function(name){
     console.log('Hello',nama)
  });
  events.emit('say','Jony yu');
  //结果就是通过emit调用之后，输出了Jony yu
 ```


 #### (2)每个对象是独立的

 因为是通过new的方式，每次生成的对象都是不相同的，因此：


 ```
 var event1=new Events();
 var event2=new Events();
 event1.on('say',function(){
     console.log('Jony event1');
 });
 event2.on('say',function(){
     console.log('Jony event2');
 })
 event1.emit('say');
 event2.emit('say');
 //event1、event2之间的事件监听互相不影响
 //输出结果为'Jony event1' 'Jony event2'
 ```


 ### 9.箭头函数中this指向举例


 ```
 var a=11;
 function test2(){
   this.a=22;
   let b=()=>{console.log(this.a)}
   b();
 }
 var x=new test2();
 //输出22
 ```


 定义时绑定。
