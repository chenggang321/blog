主要记录在react学习过程中的一些知识点
- 在context找不到"store"怎么办？
- react的组件状态是什么？
- 什么是functional component?

### **在context找不到"store"怎么办？**

1.确保你没有引入多个 React 实例 到页面上。
2.确保你没有忘记将根组件包装进 <Provider>。
3.确保你运行的 React 和 React Redux 是最新版本

Dan Abramov 确保引入多个React到实例页面上的文章：https://medium.com/@dan_abramov/two-weird-tricks-that-fix-react-7cf9bbdef375

两个React提示

React以坑相对较少和轻量级的API而闻名。这使得少数问题更令人沮丧，特别是对于初学者来说。

我希望这些问题在下一个版本的react中有很多的描述性的warings，我这里也给大家支出一些，作为一个react初学者，应该知道这些，这样可以使得你避免好几个小时的挫折。

如果有2个React，他们并不是朋友关系
2015年这一年我很高兴大家似乎都被汇聚到了NPM，而且NPM也希望大家使用它来管理前端依赖，但是它实际上有一些粗糙的东西。最大的问题就是使用NPM管理前端依赖时，如果2个package指定一个类似React的库作为依赖项，他们也许会获取2个分离的独立的React。如果再糟糕一点，他们的版本还可能不同。这样的情况在Node中并不大碍，但是对于浏览器库并不好，这些库一般需要操作全局DOM！NPM尝试使用peerDependencies解决这个问题，但是效果并不是很好。

简而言之，我们至今都不知道更好的解决办法，但是如果你遇到React的不同内部部分的奇怪问题的时候，可以考虑检查是否在同一页面有2个分离的React实例。

这里有一些错误引用2个React实例的场景

* 你安装了一个将React作为依赖的包，然后又安装了React
* 你安装了React，然后又安装了一个不同版本的React当做依赖
* 你从CDN获取了全局React，然后又在NPM安装了一个React依赖
* 你在一些NPM依赖文件夹中运行npm install，因此安装了它的依赖，这些依赖中就可能包含React
* Magic
所以你怎么去验证到底是不是这个问题呢？很简单。确保你有source maps工具(或者使得Webpack的devtool开启为'eval')，在Chome Dev Tools中打开Sources.按下Cmd+o（windows上是ctrl+o）然后输入“React.js”

如果你在屏幕上看到2个入口，删除那个你你不需要的React副本，在我的例子中，要删除 node_modules/react-router/node_modules/react。现在你可以让你的团队去做同样的检查，以后用的时候小心点，或者你也可以去学习用npm shrinkwrap去锁定整个package树，这样在你团队中的成员具有完全相同的数，安装包顺序不再影响。这需要更严格的去执行这件事，但是我非常喜欢shrinkwrapping，因为它防止了很多这样的错误。

不要渲染到Body上

那么我将告诉你的第二个问题是什么呢？这个问题更简单：不要渲染到document.body上。很多React例子这么做了，因为这样输入的例子较少而且看起来更清晰。但是Don't.Do.This.

React想完全自己去管理DOM树。如果你在React管理的DOM树中追加外部内容，很可能会出错，除非你这样小心翼翼地去做。（例如：在一个shouldComponentUpdate子组件内部返回false.）

直接在<body>标签渲染有什么问题呢？每个人都会去更新它！
有的人会使使用非react 代码去为它添加额外的东西。Google字体加载器喜欢附加<span>元素到body，而且如果你的app尝试更新顶层的东西，那么你的应用程序将会崩溃，并且崩溃的很令人费解。你真的知道所以第三方脚本如何工作的吗？或者是广告以及那些社交网站的SDK?

最后，考虑下你没有控制权限的那些：浏览器插件。是的，他们可以被注入<body>。当然他们也能把剩余的DOM搞的一团糟，但是至少你可以修复大多数情况的问题。

所以你想做什么呢？通常是把传一个根<div>到<body>，然后给它一个ID并且渲染它。另一个这么做的优势是，你可以把代码放到<body>的底部，这样你就在渲染前就不用等待DOMcontentLoaded了。

Happy hacking !

并不是这个问题。

去看table的column
```
<Table
    style={{width: '100%'}}
    columns={this.state.columns}
    data={this.state.data}
>
```
单击更新时，store获取当前行数据，update container显示，填充获取到的数据，发送或者关闭update。

1.看下Provider和connect成功了没有。
```
bindActionCreators({ creator },dispatch）
```
creator.js
```
const creator = (state = {},action) => {
    switch (action.type) {
    case 'CREATE':
        state.createResult = action.state;
        return {
            ...state,
            createResult:state.createResult
        };
        break;
    default:
        return state;
    }
};
export default creator;

import { creator } from '../actions';
function mapDispatchToProps(dispatch){
  return bindActionCreators({ creator },dispatch);
}
```
https://redux.js.org/docs/api/bindActionCreators.html

把bindActionCreators接口逻辑理清楚。
```
bindActionCreators(actionCreators, dispatch)
```
关键点：
重大突破点！！！！

通过Provider和connect后的，store放在了context中。

原生方式：直接在App标签中渲染，context是正确store.

第三方库方式：但是在Table组件中的contextd的store却是TableStore.


怎么办？去把react的context搞清楚。

### **react的组件状态是什么？**

惊呆了，怎么组件还有状态？
vue中的组件有状态吗？有，但是是独立的一个vuex来做状态管理，是一个全局的状态树。

那redux又是干嘛的？redux中的状态和组件的状态有什么区别？

答案是：不知道...

先研究完组件状态再说。

组件状态
**setState能做什么？**
setState() 为组件的state对象安排一次更新。当状态发生变化时，组件做出重绘响应。

**为什么setState给我一个错误的值？**
调用setState是异步的，调用完setState之后，不要用this.state去立刻调用新值。如果你需要基于当前状态来计算值，不要传对象，去传一个更新函数。

下面的例子不会像预期一样更新count为3，而是2：
```
incrementCount = () => {
  this.setState({count: this.state.count + 1})}
```
```
handleSomething() {
  // this.state.count is 1, then we do this:
  this.incrementCount()
  this.incrementCount() // state wasn't updated yet, so this sets 2 not 3}
```
请看下面的例子来看如何解决这个问题。

**如何基于当前状态来更新state的values?**

给setState传递函数，不要传递对象给他，以确保调用能用到最新版本的state。

**给setState传递函数和传递对象有什么区别？**

传递一个更新函数以后，你可以获取内部在更新前器内部的当前的state的值。
由于setState的调用时批处理的，这允许你链式地更新，确保他们彼此重叠，而不是彼此冲突。

下面的示例就是正确的用函数替代对象的例子：
```
incrementCount = () => {
    this.setState((prevState) => {
        return {count: prevState.count + 1}
    })
}
handleSomething() {
// this.state.count is 1, then we do this:
this.incrementCount()
this.incrementCount() // count is now 3}
```
思考：个人认为，此处函数比对象强大的地方在于，能够输入处理并且输出，而对象仅仅停留在输入和处理层面，需要后续的动作才能进行输出。上面也说了，setState是异步的，而异步，往往与回调函数，也就是callback成双成对，没听说过异步与对象成双成对的。

**我应该使用Redux或者MobX之类的状态管理库吗？**

对于一个初学者来说，在想为react添加一些额外的库之前，应该先把react学好。用React你也能构建出比较复杂的应用。

### **什么是functional component?**
https://reactjs.org/blog/2015/10/07/react-v0.14.html#stateless-functional-components

* 无状态函数式组件

在惯用的React代码中，大多数你写的组件将成为 无状态的，与其他组件好组合的组件。针对这样的组件，我们将介绍一种新的，更加简单的语法，你可以将props作为参数然后返回你想要渲染的元素。
```
//一个使用ES6箭头函数的函数式组件
var Aquarium = (props) => {
    var fish = getFish(props.species);
    return <Tank>{fish}</Tank>;
};
```
```
//或者是结构和隐式返回
var Aquarium = ({species}) => (
    <Tank>
        {getFish(species)}
    </Tank>
)
```
//然后这样用：<Aquarium species="rainbowfish" />

这些组件更像是一个React类，因为它们只定义了渲染方法。
由于函数式组件没有组件实例，任何添加的ref，都会被计算成null。
函数式组件没有生命周期方法，但是你可以设置.propTypes 和.defaultProps作为函数的属性。
这个模式是为了将app中的大组件切分为小的组件。
在未来，通过避免没必要的检查和进行内存分配，我们能为组件做很多性能优化。