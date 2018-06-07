入职新公司后，前端老大非常提倡使用新技术，终于在8102年遇到了项目中全覆盖es6这种2015年就发布了的前端技术了，当然其中包括一些es6+的内容，比如async，await，但是应用最广泛的还是es6，let，const，Symbol，arrow function，class。

之前也自学过一段时间es6，仅仅在vue层使用了一些，而且也没有使用es6写过非常底层的工具，对于es6的理解其实比较差。

下面我将记录自己在新项目中遇到的es6+的语法。

### Symbol
带着问题去学习：
>什么时候需要用到Symbol？

知识点：
- Symbol是一个不完整的constructor，new Symbol()不支持
- 通过Symbol()返回的符号(symbol)是唯一的。
    - Symbol可以用作对象的key
    - 这是上述Symbol这种数据类型的唯一目的
- typeof Symbol('foo') 输出"symbol"
- Symbol('foo') === Symbol('foo') 输出false

问题答案已清晰：
- Symbol数据类型是为了作为对象属性的识别器而产生的，也就是对象的key

思考：
- 为什么es6要引入Symbol这种数据类型？
使用传统的String类型不也是可以作为对象的key吗？
当然是可以的，但是Symbol更好的原因在于
>Symbol可读性更高，更加直观，单纯的定义字符串变量并不是知道它是作为数据，还是作为对象key

### Template String
Q：
>为什么es6引入Template String？

A：
**使javascript的字符串拼接更加优雅。**

举个例子：
Before Template String
```
const url = "/api?" + "name=" + name + "&"+ "age=" + age  ;
```
After Template String
```
const url = `/api?name=${name}&age=${age}`
```

这还仅仅是为url添加几个query parameter，假设需要DOM拼接，或者是很长的字符串拼接呢，使用Template String将会事半功倍。

优点：
- 写法简单，避免了频繁键入引号
- 代码可读性高

其它：
- require中也可以使用模板字符串

### async
>es6 class方法为什么可以添加async关键字？

因为本质上class的方法是一个function，为function添加async关键字之后，使之成为AsyncFunction。

这里主要是异步思想的部分，可以参考 https://blog.risingstack.com/node-js-async-best-practices-avoiding-callback-hell-node-js-at-scale/ 文章去理解异步。

async本质上是对callback hell的一种解决方案，除了async/await，还有第三方库async，bluebird和Promise的解决方案。深入下去是对异步的理解。

理解异步，需要理解event loop，它又包括以下内容
- call stack
- (macro)task queue
- microTask queue
- background thread

其中前三部分属于main thread，可以阅读node源码一探究竟。最后的background thread属于libuv的部分，可以去深入libuv源码(这是一个专门处理异步的c语言库)理解其实现机制。

但是阅读源码需要非常好的基础。这里推荐一篇囊括了以上知识点的非常走心的文章：https://blog.risingstack.com/node-js-at-scale-understanding-node-js-event-loop/

现在推荐的异步写法async/await，而使用这种写法还需要借助Promise和Timer。

推荐的异步方案
- async/await
- Promise
- setTimeout

await 后面紧跟一个返回Promise对象的函数。
Promise对象中传入一个包含setTimeout的函数。

举个例子：
async/await
```
const makeTea = async function (){
    const boiledWater = await boilWater(); 
}
```

Promise && setTimeout
```
const boilWater = function () {
    return new Promise(function(resolve){
       setTimeout(function(){
           resolve('boiledWater');
        }, 10*60*1000); //10分钟 
    })；
}；
```

### class
>es6 class方法除了可以添加async，还可以添加get？

是的，大佬的代码就是这样写的。

由此我们提出疑问：
>除了可以添加async，get，class方法前还能添加什么关键字？意义是什么？

这其实并不是class特有的，而是所有的Object共有的特性，是es2015对类和对象方法定义的一种升级。

完整形式如下：
```
var obj = {
 // 普通属性
  property( parameters… ) {},
  *generator( parameters… ) {},
  async property( parameters… ) {},
  async* generator( parameters… ) {},

  // 计算属性
  [property]( parameters… ) {},
  *[generator]( parameters… ) {},
  async [property]( parameters… ) {},

  // getter/setter语法
  get property() {},
  set property(value) {}
};
```

其中property( parameters… ) {}的形式在vue和react中是很常见的，比如mounted(){}，componentDidMount(){}。

async多用于异步的场景，与await结合使用，可以很好地解决各种异步请求的顺序问题。而generator的方式不是很推荐，原因是每次都要执行next()显得很麻烦。

set，get可能在编写一些基础类的时候会比较重要。

其中async较为不好理解：
通常的写法：
```
const obj = {
    f: async function () {
        await some_promise;
    }
};
```
缩写的写法：
```
const obj = {
    async f(){
        await some_promise;
    }
};
```