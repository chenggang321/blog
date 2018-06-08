最近在做一个vue的devops的项目，同事基于axios写了一段request／response拦截器的代码，其中有一个第一次遇到的FormData的类。

```
let param = new FormData();
```
这个类的MDN文档下面有一行很不起眼的笔记。
>Note :This features is available in Web Workers.

那么到底什么是Web Workers呢？
我会竭尽毕生所学把下面这篇Web Workers的MDN文档翻译出来，并为demo绘制流程图，尝试理解。
原文地址：[Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

Web Workers技术，使得在后台的线程（与Web应用的主执行线程分离）中执行脚本成为可能。
这样做的好处在于，一些很费力的处理，可以使用一个单独的线程去执行，从而使得主线程（通常是UI线程）运行得更加流程，不至于被阻塞或者拖慢速度。

Web Workers概念和用法

一个worker是一个使用类似Worker()这样的构造器创建的，它可以运行一个已命名的js文件。这个文件包含了经运行在worker线程中的代码；并且workers运行在另一个与当前window不同的全局上下文中。这个上下文由一个DedicateWorkerGlobalScope对象表示（标准workers由单个脚本使用；共享workers使用ShareWorkerGlobalScope）。

有一些例外，你可以在worker线程中运行任意的你喜欢的代码。例如，你不能直接在worker内部操作dom,或者使用一些默认的window对象上的方法。但是你可以使用大多数的在window更下一层的可用条目，包括WebSockets，和数据存储机制类似IndexedDB和火狐的OS数据存储api.查看workers可用的Functions和classes查看更多的详情。

通过操作系统的消息机制，数据在worker和主线程间发送，二者都用postMessage()方法发送消息，然后通过onmessage事件处理器作出响应（这个消息包含在消息事件的data属性中）。数据被复制而不是被共享。

Workers也许会产生新的worker，只要这些workers托管在相同的被当作父页面的源。另外，workers也许会为网络IO使用XMLHttpRequest ，除了XMLHttpRequest上的responseXML和channel属性总是返回null外。

除了标准worker外，还有以下几种worker

- 共享worker可以通过多个脚本运行在不同的窗口，例如Iframes等。只要他们属于同域。他们比标准worker要稍微复杂一些-脚本必须通过一个活动端口进行交流。查看共享worker获取更多的信息。
- ServiceWorkers实质上是一种在web应用，浏览器和网络之间的一种代理服务器。它们旨在（除其他外）创建有效的脱机体验，拦截网络请求并根据网络是否可用以及更新的资产驻留在服务器上采取适当的措施。他们还将允许访问推送通知和后台同步API。
- Chrome worker是仅限Firefox的worker的一种类型，如果您正在开发附加组件并希望在扩展中使用worker并可以访问worker中的js-ctypes，则可以使用该worker。有关更多详细信息，请参阅ChromeWorker。
- 音频worker可以在网络工作者环境中完成直接脚本音频处理。

标准worker demo

index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">

    <title>Web Workers basic example</title>

    <link rel="stylesheet" href="style.css">
    <!--[if lt IE 9]>
      <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
  </head>

  <body>
    <h1>Web<br>Workers<br>basic<br>example</h1>

    <div class="controls" tabindex="0">

    <form>
      <div>
        <label for="number1">Multiply number 1: </label>    
        <input type="text" id="number1" value="0">
      </div>
      <div>
        <label for="number2">Multiply number 2: </label>   
        <input type="text" id="number2" value="0">
      </div>
    </form>

    <p class="result">Result: 0</p>

    </div>
  </body>
  <script src="main.js"></script>
</html>
```
main.js
```
var first = document.querySelector('#number1');
var second = document.querySelector('#number2');

var result = document.querySelector('.result');

if (window.Worker) { // Check if Browser supports the Worker api.
	// Requires script name as input
	var myWorker = new Worker("worker.js");

// onkeyup could be used instead of onchange if you wanted to update the answer every time
// an entered value is changed, and you don't want to have to unfocus the field to update its .value

	first.onchange = function() {
	  myWorker.postMessage([first.value,second.value]); // Sending message as an array to the worker
	  console.log('Message posted to worker');
	};

	second.onchange = function() {
	  myWorker.postMessage([first.value,second.value]);
	  console.log('Message posted to worker');
	};

	myWorker.onmessage = function(e) {
		result.textContent = e.data;
		console.log('Message received from worker');
	};
}
```

worker.js
```
onmessage = function(e) {
  console.log('Message received from main script');
  var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  console.log('Posting message back to main script');
  postMessage(workerResult);
}
```

## 标准worker工作流程

![question](https://user-images.githubusercontent.com/19262750/37601908-2b430cea-2bc6-11e8-8f62-98342d78222b.png)

![answer](https://user-images.githubusercontent.com/19262750/37603978-e26cf102-2bca-11e8-8896-cf2544c7ef40.png)


## 共享worker demo和工作流程

地址：http://mdn.github.io/simple-shared-worker/
worker-1
![image](https://user-images.githubusercontent.com/19262750/37602459-5cd9912e-2bc7-11e8-8b18-df7508745d9d.png)
worker-2
![image](https://user-images.githubusercontent.com/19262750/37602730-f6afeb4a-2bc7-11e8-893f-1a6f6a55ebea.png)

共享了什么，共享了一个乘法worker，worker1和worker2都可以用，在这里是乘法运算。
![image](https://user-images.githubusercontent.com/19262750/37603804-68385a0c-2bca-11e8-8de3-33525d5908ad.png)
