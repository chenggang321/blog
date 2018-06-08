原文：https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
![](http://upload-images.jianshu.io/upload_images/2976869-267c0e963104c650.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在写React App的过程中，我发现一个很巨有用的简单的设计模式。如果你写过一段时间的React，你也许已经发现它了。这篇文章很好的解释过一些：[Container Components](https://medium.com/@learnreact/container-components-c0e67432e005)，但是我想新增更多需要注意的点进来。

如果你把组件分成2个目录的话，你将会发现你的组件更容易重用和推理。我称它们为Container和Presentainal组件，但是我也曾经听过Fat and Skinny ,Smart and Dumb , Staful and Pure ,Screens and Components等等。这些完全不一样的东西，其实核心思想是一样的。

**我的presentations组件**：
- 关注事情看起来是怎样的
- 内部也许会包含presentational 和 container组件，而且通常有一些DOM标签和他们自己的样式
- 经常允许通过this.props.children去遏制
- 不依赖app的其它部分，例如Flux actions和stores
- 不指定数据如何加载和变化
- 只能通过props接收数据和回调函数
- 只有他们自己的状态（当他们这样做的时候，是UI状态，而不是数据）
- 写成[functional components](https://reactjs.org/blog/2015/10/07/react-v0.14.html#stateless-functional-components)的形式，除非他们需要状态，生命周期钩子，或者性能优化。
- 例如：Page ,Sidebar ,Story ,UserInfo ,List

**我的container组件**：
- 关注事情工作起来是怎样的
- 内部也许包含presentational 和 container组件，除了一些必须的包裹div外，通常没有任何自己的DOM标签，从来都没有样式。
- 提供数据和行为给presentional或者其他组件
- 调用Flux actions然后将actions作为回调传给presentional组件
- 通常是有状态的，因为他们倾向于做数据源
- 通常使用[高阶组件](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)，例如Redux的connect()，Relay的createContainer，或者Flux Utils的Container.create()，而不是直接手写
- 例如：UserPage,FollowsSidebar,StoryContainer,FollowedUserList

我把他们放在不同的文件夹下，来确保这种设计模式的实现。

**这个方法的好处**
- **更好地解耦**。通过这样写，能够更好地理解你的app和你的UI。
- **更好地可重用**。对于完全不同的状态源，你能够使用相同的presentational组件，然后将他们传递到分离的可重用的容器组件中。
- **Presentational组件实质上是你的app的调色板**。你能够在一个单页面中出传递他们，而且可以让设计师直接调整所有的变化，而不去触碰app的逻辑层面。你能够在该页面上运行屏幕截图回归测试。
- **这强制你抽离出"layout组件"**例如Sidebar，Page，ContextMenu以及使用this.props.children来替代在多个容器组件中复制相同的标签和layout。

记住这一点，**components don't have to emit DOM.**他们仅仅需要提供在UI关注点处提供构图边界。

**什么时候需要引入Containers?**
我建议大家在开始构建APP的时候，只用presentational组件。事实上你将意识到你在**传递太多的props到中间组件**。当你意识到一些组件不用使用props去接受数据的时候，但是只是把他们转发出去，而且当孩子们需要更多的数据的时候，你都必须重新连接所有这些中间组件，这个时候就是你需要引入container组件的时候。这样的话你就能够获得数据属性和行为属性，把他们传递给后代组件，传递过程不需要给树中间的相关组件造成负担。

这是一个不断进行的重构过程，所以不要试图在第一时间就把所有事情都做对。当你用这个方法去实践的时候，你将形成一个直觉，这个直觉会告诉你什么时候需要抽取出container，就像你知道什么时候需要抽象一个函数出来一样。我的[免费Redux视频教程](https://egghead.io/series/getting-started-with-redux)也许可以帮到你！

其他的二分法
想理解清楚presentational组件和containers组件区别不仅仅依赖一个技术就可以完成。相反，这只是一种目的。

相比之下，这里有一些相关的（但不同的）技术区别：
- **有状态和无状态**。一些组件使用React 的setState()方法而有的却不使用。当容器组件试图成为有状态时，展示组件成为无状态组件，这并不是硬性要求。展示组件也能成为有状态的，同样容器组件也可以没状态。
- **类和函数**。从React0.14开始，组件就能既能用类声明也能用函数声明。函数式组件定义起来更加简单一些，但是他们缺少确定的只能用于组件的某些功能。这些限制可能在未来消失，但是目前还是普遍存在的。因为函数式组件更统一理解，我建议你去使用它们，除非你要用state，生命周期钩子，或者性能优化，这些事情只能在class中去做。
- **纯和不纯**。人们认为一个组件是纯的，如果组件在相同的props和state下返回的结果相同。纯函数可以定义为函数，也可以定义为class，而且既可以是有状态也可以是无状态的。另一个重要的纯组件方面，是他们不依赖props或者state的深度mutation，所以在shouldComponentUpdate()钩子做一个简单比较，这样能够使得渲染性能能够被优化。现在，class能够定义shouldComponentUpdate()，但在未来这还不确定。

不要把表象和容器组件分离作为教条。有时候没有关系，或者很难划清界限。如果您不确定具体组件是表示性还是容器，则可能为时尚早。不要流汗！

例子：
[一个完美演绎展示组件和容器组件的例子](https://gist.github.com/chantastic/fc9e3853464dffdb1e3c) 

拓展阅读：
*   [Getting Started with Redux](https://egghead.io/series/getting-started-with-redux)
*   [Mixins are Dead, Long Live Composition](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)
*   [Container Components](https://medium.com/@learnreact/container-components-c0e67432e005)
*   [Atomic Web Design](http://bradfrost.com/blog/post/atomic-web-design/)
*   [Building the Facebook News Feed with Relay](http://facebook.github.io/react/blog/2015/03/19/building-the-facebook-news-feed-with-relay.html)

脚注：
在早些版本的文章中，我把他们称作"smart"和"dump"组件，但是这么称呼对于展示组件来说有些不公平，命名的意义在于真正的去解释组件的意义。希望你也是这样！

早些版本的文章中，我说展示组件中只能包含展示组件。现在我不再认为是这样。
一个组件到底是展示组件还是容器组件，取决于它的内部细节。你可以用一个容器组件直接替换表示型组件，而不用修改任何的调用站点。因此，展示型组件和容器型组件能够很好地包含其他的展示型组件或者容器型组件。

