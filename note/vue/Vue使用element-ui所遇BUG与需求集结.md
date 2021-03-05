---
date: 2021-03-04 14:30
title: Vue使用element-ui所遇BUG与需求集结
categories:
  - javascript
  - vue
tags:
  - 前端
  - JavaScript
  - vue
---

第二版啦(＾Ｕ＾)ノ~ＹＯ  
由于项目的功能越来越多，开始注重细节的优化和可延展性，  
主要方向是将复用的代码集成一个组件。

> 以下数据都是在vue(^2.5)+vuex(^2.3)+element-ui(^2.3)+webpack(^3.7)+axios(v0.16)环境下测试。

混入（Mixins）
----------

由于有很多table都是要请求列表总数，包括请求列表也是千篇一律。一开始用的是`Eventbus`注册了共用组件，后来感觉对非列表的组件来说是累赘，才改用mixins，既做到了通用，还能复写。  
虽然这个方法个人还是不太满意。。。求更好idea

in `@/componens/mixins/TableList.js`

```js
export default{
    data(){
        return {
            isLoading: false
        }
    },
    methods: {
        getTotal(response){
            // 加个loading状态
            this.isLoading = !this.isLoading
            // 开始请求列表
            this.getTableList()
        },
        getList(response){
             // 结束loading状态
            this.isLoading = !this.isLoading
        },
        getTableListCount(total){
            this.$http.get(total.api[0],{}).then((response) => {
                if(response.data && typeof response.data === 'object'){
                    // 成功获取数量回调
                    this.getTotal(response)
                }
            }).catch(() => {})
        },
        getTableList(){
            this.$http.get(total.api[1],{}).then((response) => {
                if(response.data && typeof response.data === 'object'){
                    // 成功获取列表回调
                    this.getList(response)
                }
            }).catch(() => {})
        }
    }
};
```

在组件内引用：

```js
import TableListMX from '@/components/mixins/TableList';
export default{
    mixins: [TableListMX],
    methods: {
        getStart(){
            this.getTableListCount({
                api: ['list_count', 'list']
            })
        }
    }
}
```

---

自定义指令
-----

项目后台当然少不了表单，联系到数据输入，这时候限制输入内容显得尤为必要。如果每个输入框都在输入时做提示就显得累赘，所以用了指令去限制输入。  
这里举例一个限制小数点位数的自定义指令（[参考大佬地址](https://juejin.im/post/5b6b9308f265da0f4e62fecc)）

in `@directives/InputNumDigit`

```js
/*
 @directive 输入框限制范围：小数点个数 or 整数
        @param {data-index} 如果是数组要加入index
        @param {data-dotrange}
*/

// 寻找当前dom
let FindElement = (parent, selector) => {
    return parent.tagName.toLowerCase() === selector ? parent : parent.querySelector(selector);
};

// 设置组件中的指定属性的值
let setValue = function(exp, value, context) {
    value = isNaN(value) ? '' : value
    new Function('context', 'value', `context.${exp} = value`)(context, value)
};

export default{
    bind: function(el, { expression }, { context }){
        let $input = FindElement(el, 'input');
        el.$input = $input;

        // 初始化lastValue
        $input.lastValue = $input.value

        // 通过dataset 判断是否允许小数点
        let allowDot = !!$input.dataset.dotrange,
            keys = $input.dataset.keys || -1,// 如果是数组则加入索引
            dotRange = $input.dataset.dotrange || `{0,2}`, // 默认
            pattern = `^[0-9]+${allowDot ? `(.[0-9]${dotRange})?` : ''}$`,
            new_expression = expression;
        if (!expression) {
            throw new TypeError('请绑定expression')
        }
        // 循环
        if(keys !== -1){
            new_expression = expression.replace(/\[.*?\]/, `[${keys}]`)
        }
        console.log(new_expression)
        $input.handleInputEvent = function(e) {
            setTimeout(() => {
                if (e.target.value === '') {
                    setValue(new_expression, '', context)
                    // 遇到非法数值，则重置
                    e.target.value = ''
                } else if (e.target.value !== '' && !new RegExp(pattern).test(e.target.value)) {
                    setValue(new_expression, parseFloat(e.target.lastValue), context)
                    // 遇到非法数值，则重置为lastValue
                    e.target.value = e.target.lastValue
                    if (allowDot) {
                        $input.title = `小数点后最多${dotRange.replace(/[}{]/g, '').split(',')[1]}位`
                    }
                }
                e.target.lastValue = e.target.value
            }, 0)
        }
        $input.addEventListener('input', $input.handleInputEvent, false)
    },
    unbind(el) {
        el && el.$input.removeEventListener('input', el.$input.handleInputEvent, false)
    }
};
```

全局注册：

```js
import InputNumDigit from '@/directives/InputNumDigit'
Vue.directive('num-digit', InputNumDigit)
```

引用：

```html
<!-- 最多只能输入三位小数 -->
<el-input v-model.number.trim="rate" v-num-digit="setForm.rate" data-dotrange="{0,3}" type="number"></el-input>
```

> 有个瑕疵，这个指令只兼容了第一层for循环时的情况，没有考虑到更复杂的情况

---

自定义过滤器
------

比如，将数字转换成千分位

```js
let ToThousands = (val) => {// 数字转换成千分位
    if(!val || val === 0 || isNaN(val)){
        return val
    }else{
        let num = 0;
        if(val.toString().indexOf ('.') !== -1){// 带小数点
            num = val.toLocaleString()
        }else{
            num = val.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
        return num;
    }
};
Vue.filter('ToThousands', ToThousands);

// or 全局通用
Vue.prototype.$toThousands = ToThousands;
```

---

常用表单验证
------

表单验证少不了，列几个在后台常用的，放在store可以随时调用

```js
let validator = {// 验证信息
    mobile: (rule, value, callback) => {// 手机号码
        let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if(!reg.test(value)){
            callback(new Error("请输入正确手机号码"))
        }else{
            callback()
        }
    },
    idcard: (rule, value, callback) => {// 身份证号码
        let dalu_reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,// 大陆
            xianggang_reg = /[A-Z]{1,2}[0-9]{6}([0-9A])/,// 香港
            aomen_reg = /^[1|5|7][0-9]{6}\([0-9Aa]\)/,// 澳门
            taiwan_reg = /[A-Z][0-9]{9}/;// 台湾
        if(!dalu_reg.test(value) && !xianggang_reg.test(value) && !aomen_reg.test(value) && !taiwan_reg.test(value)){
            callback(new Error("请输入正确身份证号码"))
        }else{
            callback()
        }
    },
    noChinese: (rule, value, callback) => {// 英文和数字
        let reg = /^[A-Za-z0-9]+$/g;
        if(!reg.test(value)){
            callback(new Error("不能输入中文！"))
        }else{
            callback()
        }
    },
    limitNumber: (rule, value, callback) => {// 限制数字大小
        if(value < 0 || value >= 10000000){
            callback(new Error("最多输入7位有效数字"))
        }else if(isNaN(value)){
            callback(new Error("请输入数字"))
        }else{
            callback()
        }
    },
    limitPercent: (rule, value, callback) => {// 限制百分比
        if(value < 0 || value > 100){
            callback(new Error("请输入0~100之间的数字"))
        }else{
            callback()
        }
    }
};
```

---

### 常用日期限制范围

```js
let dateLimit = {
    beforeToday: {// 今天之前：不包含今天
        disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7;
        }
    },
    beforeTomorrow: {// 明天之前：包含今天
        disabledDate(time) {
            return time.getTime() > Date.now();
        }
    },
    afterToday: {// 今天之后：包含今天
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
        }
    },
    afterTomorrow: {// 明天之后：不包含今天
        disabledDate(time) {
            return time.getTime() < Date.now();
        }
    }
};
```

---

分页自定义页数
-------

```html
<!-- 通过`page-size`与输入框同一个参数控制 -->
<el-pagination class="sl-page"
layout="prev, pager, next, jumper, total, slot"
@current-change="handleCurrentChange"
:current-page.sync="params.pager"
:page-size="params.count"
:total="TOTAL">
    <span class="resize">
        <span>每页记录数：</span>
        <el-input type="number" size="small" 
        v-model.number="params.count" 
        @change="handleSearch"></el-input>
    </span>
</el-pagination>
```

```js
export defalt{
    data(){
        return {
            TOTAL: 100,
            params: {
                pager: 1,
                count: 10
            }
        }
    },
    methods: {
        handleSearch(){//页数改变
            if(this.parmas.count <= 0 || !this.parmas.count || String(this.parmas.count).indexOf(".") !== -1){
                //小于等于零or为空or小数点时不刷新数据
                return false;
            }
            this.parmas.pager = 1;
            this.getList()
        },
        handleCurrentChange(){//页码改变
            this.getList()
        }
    }
};
```

```css
.sl-page {
  text-align: center;
  padding-top: 20px;
}

.sl-page .resize {
  width: 60px;
}

.sl-page .resize .el-input__inner {
  height: 28px;
  padding: 0 5px;
}
```

---

伪Radio · 真 · CheckBox
---------------------

> 单个radio可以不勾选效果

复合：
" title="" data-original-title="复制">

```html
<div class="fake-checkbox">
    <el-radio v-model="isCheck" :label="1">是否勾选</el-radio>
    <el-checkbox v-model="isCheck" :false-label="0" :true-label="1" @change="handleSearch">是否勾选</el-checkbox>
</div>
```

```css
.fake-checkbox{
  position: relative;
  display: inline-block;
}
.fake-checkbox .el-checkbox,
.fake-checkbox .el-radio{
  width: 55px;
}
.fake-checkbox .el-radio__label{
  padding-left: 5px;
}
.fake-checkbox .el-checkbox{
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0;
}
```

---

样式修改
----

### 1. 下拉箭头位置偏差

```css
.el-select-dropdown .popper__arrow {
    transform: none !important;
}
```

### 2. 表单伪必填

```css
.sl-required .el-form-item__label:before {
  content: '*';
  color: #fa5555;
  margin-right: 4px;
}
```

```html
<el-form-item class="sl-required">...</el-form-item>
```

### 3. 去除输入框number类型的箭头

```css
.non-arrow input[type="number"]::-webkit-outer-spin-button,
.non-arrow input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
```

```html
<el-input class="non-arrow" type="number"></el-input>
```
