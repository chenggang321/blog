主要记录在使用Angular，React，Vue三大框架过程中的微小发现，其中可能会包括一些框架之间的对比。

#### 1.vue和vuex中的ES6 Shorthand method names

![666.png](http://upload-images.jianshu.io/upload_images/2976869-d65dec78e09215ce.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

最近在用vue和vuex开发。
在.vue单文件的生命周期和vuex的actions定义中，有两段代码让人费解：
pag.vue
```
export default {
    //...
    created(){
        this.$store.dispatch('getUsersSize')
    }
    //...
}
```
action.js中
```
const actions = {
    getAllUsers({commit},url){
        dataapi.getData(url,(users)=>{
            commit(types.RECEIVE_USERS,{users})
        })
    }
}
```
抽离出来就是`{created(){}}`和`{getAllUsers({commit},url){}}`
正常情况下，如果将函数赋值到对象的属性值，简称为方法，应该这样写才对：
`{created:function(){}}`以及`{getAllUsers:function({commit},url){}}`

所以我很纳闷这是什么鬼东西？

印象中ES6有个概念叫computed property，于是去查MDN。
最后查到其实并不是计算属性，而是shorthand methods names
```
// Shorthand method names (ES2015)
var o = {
  property([parameters]) {}
};
```
而计算属性其实是这样的：
```
// Computed property names (ES2015)
var prop = 'foo';
var o = {
  [prop]: 'hey',
  ['b' + 'ar']: 'there'
};
```
仔细对比`{created(){}}`和`{created:function(){}}`。
所以这个ES6 Shorthand method names语法糖其实就是，省略了':function'，省略了冒号和'function'。
虽然这个sugar不是很甜，但好歹是个糖，糖多了自己写的bug别人就看不懂了。
而人们往往对于不懂的东西，都会说：666
(逃

#### 2.ng-bind与v-bind的区别是什么？
首先看个问题：angular中，什么时候用ng-bind，什么时候用{{}}模板写法？

{{foo.bar}}更加直观，但是对于index.html，也就是首页展示，应该使用ng-bind="foo.bar"。
因为如果浏览器可能angular对花括号中的语法完成编译之前，就将{{foo.bar}}中的内容展示给用户，从而导致用户看到我们的代码后，再看到自己的数据。
这与浏览器运行机制有关，浏览器先下载好html的dom层，之后才会使用js对dom层中的内容进行处理，本例中是对标签节点的文本节点{{foo.bar}}进行编译，本质上是替换文本节点。
而ng-bind则是以修改标签的属性内容的形式，为标签增加文本节点，而不是替换文本节点。

与vue的v-bind指令不同，v-bind指令是对标签节点的属性节点绑定model中的数据，例如v-bind:src="imgSrc",而angular中则支持属性中编译花括号，直接使用src="{{imgSrc}}"，即可实现与controller中的数据绑定。

有几点很重要：
1.ng-bind是对文本节点做更新
2.angular可以直接编译属性节点中的花括号值
3.首页数据，应使用ng-bind；其他页为提高代码可读性，应使用{{}}式写法

#### 3.:model与v-model的区别是什么？
>:model 的完整形式是v-bind:model，主要是v-bind，也是双向数据绑定吗，但是针对DOM元素的属性或者特性做绑定，例如src,title原生属性，或者自定义属性等等，我们此处的:model属于iview的Form组件自定义的一个属性。


>v-model 则是为了在<input>或者 <textarea>表单元素上做双向数据绑定，直接做到了与value的绑定。

吐槽：iview用起来有点反人类，Radio用label做区分，Form的表单数据又用model这样的属性做数据绑定（好吧，elememt-ui也是这样做数据绑定）。

关于src，title类似的HTML原生属性，有一点需要特别注意，那就是v-bind的使用。

Mustache 语法不能作用在 HTML 特性上，遇到这种情况应该使用 v-bind 指令：
`<div v-bind:id="dynamicId"></div> ①`

`<div id=“dynamicId”> ②`

①中的dynamicId是一个变量
②中的dynamicId仅仅是一个字符串

大多数情况下，我们会使用:id这样的为了让Mustache语法作用于HTML特性上的写法。

### 4.vue 知识点查漏补缺
- vue中props和computed的区别是什么？
子组件显式地用props选项声明（从父组件获取的）预期的数据。
Computed 计算属性被混入到vue实例中。所有的getter和setter的this上下文自动地绑定为vue实例。


- slot是什么？
往具名插槽中插入子组件内容。

- 具名插槽是什么？
```
<slot name=“header”></slot>
<h1 slot=“header”> 这里的内容会被分发到header插槽中</h1>
```
- getter 和 setter
```
vm.aPlus   // => 2
vm.aPlus = 3
```
- 为什么this.$refs["sendData"].resetFields();可以重置表单？

vm.$refs是一个对象，持有已注册过ref的所有子组件，是一种直接访问到子组件的方式，需要注意是非响应式的。
```
<Form ref=“sendData”></Form>
```
this.$refs[“sendData”]或者this.$refs.sendData获取到已注册的子组件，然后调用子组件的resetField()方法.

iview的Form组件源码：
form.vue:
```
resetFields() {
    this.fields.forEach(field => {
        field.resetField();
    });
}
```
fields数组中的每一项都调用resetField()
Form-item.vue:
```
resetField () {
    this.validateState = '';
    this.validateMessage = '';

    let model = this.form.model;
    let value = this.fieldValue;
    let path = this.prop;
    if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
    }

    let prop = getPropByPath(model, path);

    if (Array.isArray(value)) {
        this.validateDisabled = true;
        prop.o[prop.k] = [].concat(this.initialValue);
    } else {
        this.validateDisabled = true;
        prop.o[prop.k] = this.initialValue;
    }
},
```
- $parent是什么？
父实例。

- vm.$parent.$options是什么？
自定义属性。
```
new Vue({
    customOption:’foo’,
    created:function(){
      console.log(this.options.customOption)//=>’foo'  
    }
})
```
- props
props用于接收来自父组件的数据，props为对象时，可以配置高级选项，如类型检测，自定义校验，设置默认值。

- mixins是什么？
混入hook。

- 混入是什么？
目的：分发vue组件的复用功能，可以混入一个对象到组件。
浅合并，组件优先，慎用全局混入。
```
import Emitter from '../../mixins/emitter';
mixins: [ Emitter ]
```
iview的emitter混入的是什么？
混入的是methods，一个vuex的diapatch，一个组件自身的broadcast方法。

- render函数是什么？
比template更接近编译器的render函数。

- 实例属性API?vue实例都会做代理访问。
vm.$data  观察的数据对象。
vm.$props 当前组件接收到的props。
vm.$el 根DOM元素
vm.$options 自定义属性
vm.$parent 父实例
vm.$root 组件树根vue实例，如果没有父实例，此实例将会是自己。
vm.$children 当前实例的子组件。
vm.$slots <h1 slot=“header”></h1> this.$slots.header
vm.$scopedSlots 访问作用域插槽，slot-scope。作用域插槽是一种特殊类型的插槽，用作一个（能被传递数据的）可重用模板，来代替已经渲染好的元素。
vm.$refs 一个对象，持有已注册过ref的所有子组件。
vm.$isServer 判断当前vue实例是否运行于服务器。
vm.$attrs 属性集，正常的html属性集。
vm.$listeners 包含了父作用域中的v-on事件监听器。

- 插槽是什么？
插槽就是像扩展内存一样，热插拔式扩展。

- 组件的属性，html的特性，dom的属性有何异同？
组件是vm.$props,html的特性是vm.$attrs，dom属性是domProps。

- directives是什么？
包含vue实例可用指令的哈希表。

- filters是什么？
`<!-- 在双花括号中 -->`
{{ message | capitalize }}

`<!-- 在 `v-bind` 中 -->`
`<div v-bind:id="rawId | formatId"></div>`