---
date: 2021-03-04 14:30
title: JS树结构操作
categories:
  - javascript
tags:
  - 前端
  - JavaScript
---

经常有同学问树结构的相关操作，也写了很多次，在这里总结一下JS树形结构一些操作的实现思路，并给出了简洁易懂的代码实现。  
本文内容结构大概如下：

![JS树结构相关操作](http://file.wintc.top/46ce25b9a36a45d0b920a49bf013abf0)

一、遍历树结构
-------

#### 1. 树结构介绍

JS中树结构一般是类似于这样的结构：

```js
let tree = [
  {
    id: '1',
    title: '节点1',
    children: [
      {
        id: '1-1',
        title: '节点1-1'
      },
      {
        id: '1-2',
        title: '节点1-2'
      }
    ]
  },
  {
    id: '2',
    title: '节点2',
    children: [
      {
        id: '2-1',
        title: '节点2-1'
      }
    ]
  }
]
```

为了更通用，可以用存储了树根节点的列表表示一个树形结构，每个节点的children属性（如果有）是一颗子树，如果没有children属性或者children长度为0，则表示该节点为叶子节点。

#### 2. 树结构遍历方法介绍

树结构的常用场景之一就是遍历，而遍历又分为广度优先遍历、深度优先遍历。其中深度优先遍历是可递归的，而广度优先遍历是非递归的，通常用循环来实现。深度优先遍历又分为先序遍历、后序遍历，二叉树还有中序遍历，实现方法可以是递归，也可以是循环。

![JS遍历树结构](http://file.wintc.top/6030327db6d84c6cb88fd96b462bd9f6)

广度优先和深度优先的概念很简单，区别如下：

* 深度优先，访问完一颗子树再去访问后面的子树，而访问子树的时候，先访问根再访问根的子树，称为先序遍历；先访问子树再访问根，称为后序遍历。
* 广度优先，即访问树结构的第n+1层前必须先访问完第n层

#### 3. 广度优先遍历的实现

广度优先的思路是，维护一个队列，队列的初始值为树结构根节点组成的列表，重复执行以下步骤直到队列为空：

* 取出队列中的第一个元素，进行访问相关操作，然后将其后代元素（如果有）全部追加到队列最后。

下面是代码实现，类似于数组的forEach遍历，我们将数组的访问操作交给调用者自定义，即一个回调函数：

```js
// 广度优先
function treeForeach (tree, func) {
  let node, list = [...tree]
  while (node = list.shift()) {
    func(node)
    node.children && list.push(...node.children)
  }
}
```

很简单吧，<sub>,</sub>  
用上述数据测试一下看看：

```js
treeForeach(tree, node => { console.log(node.title) })
```

输出，可以看到第一层所有元素都在第二层元素前输出：

```
> 节点1
> 节点2
> 节点1-1
> 节点1-2
> 节点2-1
```

#### 4. 深度优先遍历的递归实现

先序遍历，三五行代码，太简单，不过多描述了：

```js
function treeForeach (tree, func) {
  tree.forEach(data => {
    func(data)
    data.children && treeForeach(data.children, func) // 遍历子树
  })
}
```

后序遍历，与先序遍历思想一致，代码也及其相似，只不过调换一下节点遍历和子树遍历的顺序：

```js
function treeForeach (tree, func) {
  tree.forEach(data => {
    data.children && treeForeach(data.children, func) // 遍历子树
    func(data)
  })
}
```

测试：

```js
treeForeach(tree, node => { console.log(node.title) })
```

输出：

```
// 先序遍历
> 节点1
> 节点1-1
> 节点1-2
> 节点2
> 节点2-1

// 后序遍历
> 节点1-1
> 节点1-2
> 节点1
> 节点2-1
> 节点2
```

1.  深度优先循环实现  

    先序遍历与广度优先循环实现类似，要维护一个队列，不同的是子节点不追加到队列最后，而是加到队列最前面：

```js
function treeForeach (tree, func) {
  let node, list = [...tree]
  while (node = list.shift()) {
    func(node)
    node.children && list.unshift(...node.children)
  }
}
```

后序遍历就略微复杂一点，我们需要不断将子树扩展到根节点前面去，（艰难地）执行列表遍历，遍历到某个节点如果它没有子节点或者它的子节点已经扩展到它前面了，则执行访问操作，否则扩展子节点到当前节点前面：

```js
function treeForeach (tree, func) {
  let node, list = [...tree], i =  0, expanded = new Map()
  while (node = list[i]) {
    let childCount = node.children ? node.children.length : 0
    if (!childCount || node.children[childCount - 1] === list[i - 1]) {
      func(node)
      i++
    } else {
      list.splice(i, 0, ...node.children)
    }
  }
}
```

二、列表和树结构相互转换
------------

#### １．列表转为树

列表结构通常是在节点信息中给定了父级元素的id，然后通过这个依赖关系将列表转换为树形结构，列表结构是类似于：

```js
let list = [
  {
    id: '1',
    title: '节点1',
    parentId: '',
  },
  {
    id: '1-1',
    title: '节点1-1',
    parentId: '1'
  },
  {
    id: '1-2',
    title: '节点1-2',
	  parentId: '1'
  },
  {
    id: '2',
    title: '节点2',
    parentId: ''
  },
  {
    id: '2-1',
    title: '节点2-1',
  	parentId: '2'
  }
]
```

列表结构转为树结构，就是把所有非根节点放到对应父节点的chilren数组中，然后把根节点提取出来：

```js
function listToTree (list) {
  let info = list.reduce((map, node) => (map[node.id] = node, node.children = [], map), {})
  return list.filter(node => {
    info[node.parentId] && info[node.parentId].children.push(node)
    return !node.parentId
  })
}
```

这里首先通过info建立了id=>node的映射，因为对象取值的时间复杂度是O(1)，这样在接下来的找寻父元素就不需要再去遍历一次list了，因为遍历寻找父元素时间复杂度是O(n)，并且是在循环中遍历，则总体时间复杂度会变成O(n^2)，而上述实现的总体复杂度是O(n)。

#### 2. 树结构转列表结构

有了遍历树结构的经验，树结构转为列表结构就很简单了。不过有时候，我们希望转出来的列表按照目录展示一样的顺序放到一个列表里的，并且包含层级信息。使用先序遍历将树结构转为列表结构是合适的，直接上代码:

```js
//递归实现
function treeToList (tree, result = [], level = 1) {
    tree.forEach(node => {
      result.push(node)
      node.level = level++
      node.children && treeToList(node.children, result, level)
    })
    return result
}

// 循环实现
function treeToList (tree) {
  let node, result = tree.map(node => (node.level = 1, node))
  for (let i = 0; i < result.length; i++) {
    if (!result[i].children) continue
    let list = result[i].children.map(node => (node.level = result[i].level + 1, node))
    result.splice(i+1, 0, ...list)
  }
  return result
}
```

三、树结构查找
-------

1.  查找节点  

    查找节点其实就是一个遍历的过程，遍历到满足条件的节点则返回，遍历完成未找到则返回null。类似数组的find方法，传入一个函数用于判断节点是否符合条件，代码如下：

```js
function treeFind (tree, func) {
  for (const data of tree) {
    if (func(data)) return data
    if (data.children) {
      const res = treeFind(data.children, func)
      if (res) return res
    }
  }
  return null
}
```

1.  查找节点路径  

    略微复杂一点，因为不知道符合条件的节点在哪个子树，要用到回溯法的思想。查找路径要使用先序遍历，维护一个队列存储路径上每个节点的id，假设节点就在当前分支，如果当前分支查不到，则回溯。

```js
function treeFindPath (tree, func, path = []) {
  if (!tree) return []
  for (const data of tree) {
    path.push(data.id)
    if (func(data)) return path
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}
```

用上面的树结构测试：

```js
let result = treeFindPath(tree, node => node.id === '2-1')
console.log(result)
```

输出：

```
["2","2-1"]
```

四、结语
----

对于树结构的操作，其实递归是最基础，也是最容易理解的。递归本身就是循环的思想，所以可以用循环来改写递归。熟练掌握了树结构的查找、遍历，应对日常需求应该是绰绰有余啦。
