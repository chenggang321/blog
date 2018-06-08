api地址：https://github.com/reactjs/react-redux/blob/master/docs/api.md#api

`<Provider store>`
为了让Redux store能够被下层组件的connect()调用。通常来说，在<Provider>中没有包裹一个父组件或者祖先组件的话，你不能使用connect()。

如果你真的需要，你可以手动将store作为一个prop传递到每一个被connect()的组件上，但是我们只推荐在单元测试或者非完全是React代码库的情况下这样做。通常来说，你只需要使用<Provider>就可以。

Props
- `store `(Redux Store): 你的应用中的单Redux Store。
- `children` (ReactElement) 组件层次结构的根。

例子：

原生React
```
ReactDOM.render(
    <Provider store={store}>
        <MyRootComponent />
    </Provider>,
    rootEl
)
```

React Router
```
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <Route path="foo" component={Foo}/>
                <Route path="bar" component={Bar}/>
            </Route>
        </Router>
    </Provider>，
    document.getElementById('root')
)
````

`connect([mapStateToProps],[mapDispatchToProps],[mergeProps],[options])`
连接一个React组件到一个Redux store上。connect是一个connectAdvanced的一个facade，提供一个适用于大多数场景下的方便的API。
它不会修改传递到它自己里面的组件；取而代之的是，它会返回一个新的组件，这个组件连接到你正在用的组件类。

参数
- [ mapStateToProps(state, [ownProps]): stateProps] (Function)
如果这个参数数组有特殊值了，新的组件将订阅到Redux store然后去更新。这也就意味着，只要Redux store发生更新，mapStateToProps就会被调用一遍。mapStateToProps的结果必须是一个纯对象，这个纯对象将会被merged到组件的props中去。如果你不想去订阅组件的更新，传一个null或者是undefined替换mapStateToProps。

如果你的mapStateToProps函数声明的时候传进来2个参数，那么第一个参数是store state，第二个参数是props，而且当被连接的组件接受新的props参数然后做浅相等比较（==）后，它会被重新调用。（第二个参数通常被称为ownProps）。
- [mapDispatchToProps(dispatch, [ownProps]): dispatchProps ](Object or Function)
如果一个对象被传递进来，每个内部的函数都会被假设成一个Redux action 创造者。这个对象和函数们的名字相同，但是每个action创造者都被包裹进一个dispatch调用中，这样他们才能直接被调用，将来会被merge到组件的props中去。
如果传进来的是一个函数，dispatch将作为第一个参数。用你自己的方式用dispatch去绑定一个action creator然后返回一个对象取决于你。（提示：你也许会用Redux中的bindActionCreators()）

如果你的mapDispatch函数需要2个参数的话，dispatch将作为第一个参数，然后那些被传到connected组件的props将作为第二个参数，只要connected组件接受新的props，都会被重新调用。（第二个参数通常被称为ownProps）

如果你不传入对象或者函数，mapDispatchToProps将会特地为你注入一个dispatch到你的组件的props。

- [mergeProps (stateProps, dispatchProps, ownProps): props ] (Function)
如果有值传入，它会传入masStateToProps(), mapDispatchToProps()和父props。从这里返回的纯对象将被传入到wrapped component的props中。你也许想传一个函数去选择一些基于props的state，或者是绑定action 创造者给props的特殊变量。如果不传入mergeProps的话，默认使用Object.assign({}, ownProps, stateProps, dispatchProps)。

- [options] (Object)
如果传入值的话，进一步定制连接器的行为。除了options在connectAdvanced()可传递外，connect()也可以接收下面这些额外的可选参数：
  - [pure] (Boolean):如果是true，connect()将避免重新渲染。然后调用，mapStateToProps，mapDispatchToProps和mergeProps。如果在各自的平等检查基础上，state/props 保持相等。假设被包裹组件是纯组件，只依赖自己的props和选定的Redux store的state，不依赖于任何输入或者状态。默认值是：true。
  - [areStateEqual] (Function):当它是纯的时，将store state和先前的值做比较。默认值：严格相等 (===)
  - [areOwnPropsEqual] (Function):当它是纯的时，将props和先前的值做比较。默认值：松散相等(==)
  - [areStatePropsEqual] (Function):当它是纯的时，将mapStateToProps的返回结果和先前的值做比较。默认值为：松散相等(==)
  - [areMergedPropsEqual] (Function):当它是纯的时，将mergeProps的返回结果和先前的值作比较。默认值为：松散相等(==)
  - [storeKey] (String):读store的上下文的key值。如果你有多个store，你也许只需要这个。默认值为：'store'。

  mapStateToProps和mapDispatchToProps的元数决定它们是否接收ownProps

> 注意：ownProps 没有被传递到mapStateToProps和mapDispatchToProps中，如果函数形式上的定义包含一个强制性的参数（函数参数长度为1）。例如，下面形式的函数定义就不会在第二个参数接收ownProps。

```
function mapStateToProps(state){
    console.log(state); //state
    console.log(arguments[1]);// undefined
}
```
```
const mapStateToProps = (state, ownProps = {}) => {
    console.log(state);// state
    console.log(ownProps);// undefined
}
```
函数没有强制参数值或者有2个参数值时会接收到ownProps
```
const mapStateToProps = (state, ownProps) => {
    console.log(state); //state
    console.log(ownProps); //ownProps
}
```

```
function mapStateToProps() {
    console.log(argument[0]);// state
    console.log(arguments[1]);// ownProps
}
```
```
const mapStateToProps = (...args) => {
    console.log(args[0]); //state
    console.log(args[1]); //ownProps
}
```

将options.pure设置为true，以优化组件
当options.pure为true时，connect执行几个相等性判断，这些判断用来避免没必要的调用，例如mapStateToProps，mapDispatchToProps，mergeProps以及最终的render函数。这些包括areStateEqual,areOwnPropsEqual，areStatePropsEqual和areMergedPropsEqual。虽然默认值可能适合99%的情况，但是有的时候为了提升性能或者出于其他原因，你也许想重写他们。下面是几个简单的例子。
- 你也许想重写areStateEqual如果你的mapStateToProps函数计算昂贵而且只关心你的状态的一小部分。例如：areStateEqual:(next, prev) => prev.entitles.todos === next.entities.todos;这将有效忽略状态变化而不是这个状态片段。
- 你也许希望重写areStateEqual去返回false，(areStatesEqual: () => false )如果你不纯的会导致你的store状态发生变化的reducer。
- 你也许希望去重写areOwnPropsEqual作为一种将传入的props白名单化的一种方式。同时你也要实现mapStateToProps，mapDispatchToProps和mergeProps为白名单props。（或许用其他方式更简单，例如[recompose's mapProps](https://github.com/acdlite/recompose/blob/master/docs/API.md#mapprops)）
- 你也许希望重写areStatePropsEqual去实现严格相等，如果你的mapStateToProps使用memoized选择器，只会在相关的prop改变的情况下返回一个新的对象。微小的性能提升，因为这样可以避免每次mapStateToProps被调用时的独立的props的相等性判断。
- 你也许希望重写areMergedPropsEqual去实现深度相等。如果你的选择器产生复杂的道具，例如嵌套对象，新数组等等，深度平等检查应该比重新渲染更快。

返回结果
一个高阶React组件类，通过arguments传递state和action到组件内部。这由connectAdvanced创建，此高阶组件的详细信息覆盖在那里。

例子
**注入dispatch而且不监听store**
`export default connect()(TodoApp)`
注入所有action creator( addTodo, completeTodo, ...)，在不订阅store的情况下
```
import * as actionCreators from './actionCreators'
export default connect(null, actionCreators)(TodoApp)
```
**注入全局状态上的dispatch和所有字段**
> 不要这么做！这样会杀死所有性能优化，因为TodoApp在每次状态更新后都将重新绘制。更好的做法是视图层的多个组件拥有更多的粒度的connect()，每个只监听一个相关的state片段。
```
export default connect (state => state)(TodoApp)
```
**注入dispatch和todos**
```
function mapStateToProps(state){
    return { todos: state.todos }
}
export default connect(mapStateToProps)(TodoApp)
```
**注入todos和所有的action creators**
```
import * as actionCreators from './actionCreators'
function mapStateToProps(state){
    return { todos: state.todos }
}
export default connect(mapStateToProps, actionCreators)(TodoApp)
```
**注入todos和所有action creators（addTodo, completeTodo,...）作为actions**
```
import * as actionCreators from './actionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state){
    return { todos: state.todos }
}
function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators(actionCreators, diapatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```
**注入todos和指定的action creator(addTodo)**
```
import { addTodo } from './actionCreators'
import { bindActionCreators } frpm 'redux'
function mapStateToProps(state){
    return { todos: state.todos }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ addTodo },dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```
**注入todos和特殊的action(addTodo和deleteTodo),使用缩写语法**
```
import { addTodo, deleteTodo } from './actionCreators'
function mapStateToProps(state){
    return { todos: state.todos }
}
const mapDispatchToProps = {
    addTodo,
    deleteTodo
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```
**注入todos，todoActionCreators作为todoActions，counterActionCreators作为counterActions**
```
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
    return { todos: state.todos}
}

function mapDiaptchToProps(dispatch) {
    return {
        todoActions: bindActionCreators(todoActionCreators, dispatch),
        counterActions: bindActionCreators(counterActionCreators, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```
**注入todos，todoActionCreators和counterActionCreator作为actions**
```
import * as todoActionCreators from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state) {
     return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, todoActionCreators, counterActionCreators), dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```
**注入todos，todoActionCreators和counterActionCreators直接作为props**
```
import * as todoActionCreator from './todoActionCreators'
import * as counterActionCreators from './counterActionCreators'
import { bindActionCreators } from 'redux'

function mapStateToProps(state){
    return { todos: statet.todos }
}

function mapDispatchToProps(dispatch){
    return bindActionCreator(Object.assign({},todoActionCreators, counterActionCreators), dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps )(TodoApp)
```
**注入一个依赖props的指定用户的todos**
```
import * as actionCreators from './actionCreators'

function mapStateToProps(state, ownProps) {
    return { todos: state.todos[ownProps.userId] }
}
export default connect(mapStateToProps)(TodoApp)
```
**注入一个依赖props的todos，然后把props.userId注入到action**
```
import * as actionCreators from './actionCreators'

function mapStateToProps(state) {
    return { todos: state.todos }
}

function mergeProps(stateProps, dispatchProps, ownProps ) {
    return Object.assign({}, ownProps, {
        todos: stateProps.todos[ownProps.userId],
        addTodo: (text) => dispatchProps.addTodo(ownProps.userId, text)
    })
}
export default connect(mapStateToProps, actionCreators, mergeProps)(TodoApp)
```
工厂函数
**工程函数可以被用在性能优化上**
```
 import { addTodo } from './actionCreators'

function mapStateToPropsFactory(initialState, initialProps) {
    const getSomeProperty= createSelector(...);
    const anotherProperty = 200 + initialState[initialProps.another];
    return function(state){
        return {
            anotherProperty,
            someProperty: getSomeProperty(state),
            todos: state.todos
       }
    }
}

function mapDispatchToPropsFactory(initialState, initialProps) {
    function goToSomeLink(){
        initialProps.history.push('some/link');
    }
    return function(dispatch){
        return {
            addTodo
        }
    }
}

export default connect(mapStateToPropsFactory, mapDispatchToPropsFactory)(TodoApp)
```
  
connectAdvanced(selectorFactory, [connectOptions])
灵活组合state，props和dispatch到最终的props。
概念较为复杂，暂不翻译。

createProvider([storeKey])
通过设置Redux Store上下文的store key，可以创建一个新的<Provider >。你可能需要这个，在你必须多个store的时候。你将需要传递相同的storekey到connect的options上。
参数：
- [storeKey] (String): 传递到store的上下文的key。默认值为：'store'

例子：
在创建多个store之前，可以去看下这个问题：[Can or should I create multiple stores?](https://redux.js.org/docs/faq/StoreSetup.html#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself)
```
import {connect, createProvider} from 'react-redux'
const STORE_KEY = ‘componentStore’
export const Provider = createProvider(STORE_KEY)
function connectExtended(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options = {}
) {
    options.storeKey = STORE_KEY
    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps,
        options
    )
}
export { connectExtended as connect}
```