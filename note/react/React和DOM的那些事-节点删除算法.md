---
date: 2021-03-04 14:30
title: React和DOM的那些事-节点删除算法
categories:
  - react
tags:
  - 前端
  - JavaScript
  - react
---

[点击](https://github.com/neroneroffy/react-source-code-debug)进入React源码调试仓库。

_本篇是详细解读React DOM操作的第一篇文章，文章所讲的内容发生在commit阶段。_

Fiber架构使得React需要维护两类树结构，一类是Fiber树，另一类是DOM树。当删除DOM节点时，Fiber树也要同步变化。但请注意删除操作执行的时机：**在完成DOM节点的其他变化（增、改）前，要先删除fiber节点，避免其他操作被干扰。** 这是因为进行其他DOM操作时需要循环fiber树，此时如果有需要删除的fiber节点却还没删除的话，就会发生混乱。

```javascript
function commitMutationEffects(
  firstChild: Fiber,
  root: FiberRoot,
  renderPriorityLevel,
) {
  let fiber = firstChild;
  while (fiber !== null) {

    // 首先进行删除
    const deletions = fiber.deletions;
    if (deletions !== null) {
      commitMutationEffectsDeletions(deletions, root, renderPriorityLevel);
    }
    // 如果删除之后的fiber还有子节点，
    // 递归调用commitMutationEffects来处理
    if (fiber.child !== null) {
      const primarySubtreeTag = fiber.subtreeTag & MutationSubtreeTag;
      if (primarySubtreeTag !== NoSubtreeTag) {
        commitMutationEffects(fiber.child, root, renderPriorityLevel);
      }
    }

    if (__DEV__) {/*...*/} else {
      // 执行其他DOM操作
      try {
        commitMutationEffectsImpl(fiber, root, renderPriorityLevel);
      } catch (error) {
        captureCommitPhaseError(fiber, error);
      }
    }
    fiber = fiber.sibling;
  }
}
```

_fiber.deletions是render阶段的diff过程检测到fiber的子节点如果有需要被删除的，就会被加到这里来。_

`commitDeletion`函数是删除节点的入口，它通过调用`unmountHostComponents`实现删除。搞懂删除操作之前，先看看场景。

有如下的Fiber树，Node（Node是一个代号，并不指的某个具体节点）节点即将被删除。

```
Fiber树

                   div#root
                      |
                    <App/>
                      |
                     div
                      |
                   <Parent/>
                      |
 Delation   -->      Node
                      |     ↖
                      |       ↖
                      P ——————> <Child>
                                  |
                                  a
```

通过这种场景可以推测出当删除该节点时，它下面子树中的所有节点都要被删除。现在直接以这个场景为例，走一下删除过程。这个过程实际上也就是`unmountHostComponents`函数的运行机制。

删除过程
====

删除Node节点需要父DOM节点的参与：

```javascript
parentInstance.removeChild(child)
```

所以首先要定位到父级节点。过程是在Fiber树中，以Node的父节点为起点往上找，找到的第一个原生DOM节点即为父节点。在例子中，父节点就是div。此后以Node为起点，遍历子树，子树也是fiber树，因此遍历是深度优先遍历，将每个子节点都删除。

**需要特别注意的一点是，对循环节点进行删除，每个节点都会被删除操作去处理，这里的每个节点是fiber节点而不是DOM节点。DOM节点的删除时机是从Node开始遍历进行删除的时候，遇到了第一个原生DOM节点（HostComponent或HostText）这个时刻，在删除了它子树的所有fiber节点后，才会被删除。**

以上是完整过程的简述，对于详细过程要明确几个关键函数的职责和调用关系才行。删除fiber节点的是`unmountHostComponents`函数，被删除的节点称为目标节点，它的职责为：

1.  找到目标节点的DOM层面的父节点
2.  判断目标节点如果是原生DOM类型的节点，那么执行3、4，否则先卸载自己之后再往下找到原生DOM类型的节点之后再执行3、4
3.  遍历子树执行fiber节点的卸载
4.  删除目标节点的DOM节点

其中第3步的操作，是通过`commitNestedUnmounts`完成的，它的职责很单一也很明确，就是遍历子树卸载节点。

然后具体到每个节点的卸载过程，由`commitUnmount`完成。它的职责是

1.  Ref的卸载
2.  类组件生命周期的调用
3.  HostPortal类型的fiber节点递归调用`unmountHostComponents`重复删除过程

下面来看一下不同类型的组件它们的具体删除过程是怎样的。

区分被删除组件的类别
==========

Node节点的类型有多种可能性，我们以最典型的三种类型（`HostComponent、ClassComponent、HostPortal`）为例分别说明一下删除过程。

首先执行`unmountHostComponents`，会向上找到DOM层面的父节点，然后根据下面的三种组件类型分别处理，我们挨个来看。

HostComponent
-------------

Node 是HostComponent，调用`commitNestedUnmounts`，以Node为起点，遍历子树，开始对所有子Fiber进行卸载操作，遍历的过程是深度优先遍历。

```
Delation   -->      Node(span)
                      |    ↖
                      |       ↖
                      P ——————> <Child>
                                  |
                                  a
```

对节点逐个执行`commitUnmount`进行卸载，这个遍历过程其实对于三种类型的节点，都是类似的，为了节省篇幅，这里只表述一次。

Node的fiber被卸载，然后向下，p的fiber被卸载，p没有child，找到它的sibling`<Child>`，`<Child>`的fiber被卸载，向下找到a，a的fiber被卸载。此时到了整个子树的叶子节点，开始向上return。由a 到 `<Child>`，再回到Node，遍历卸载的过程结束。

在子树的所有fiber节点都被卸载之后，才可以安全地将Node的DOM节点从父节点中移除。

ClassComponent
--------------

```
Delation   -->      Node(ClassComponent)
                      |
                      |
                     span
                      |    ↖
                      |       ↖
                      P ——————> <Child>
                                  |
                                  a
```

Node是ClassComponent，它没有对应的DOM节点，要先调用`commitUnmount`卸载它自己，之后会先往下找，找到第一个原生DOM类型的节点span，以它为起点遍历子树，确保每一个fiber节点都被卸载，之后再将span从父节点中删除。

HostPortal
----------

```
div2(Container Of Node)
                                ↗
                     div   containerInfo
                      |    ↗
                      |  ↗
 Delation   -->      Node(HostPortal)
                      |
                      |
                     span
                      |    ↖
                      |       ↖
                      P ——————> <Child>
                                  |
                                  a
```

Node是HostPortal，它没有对应的DOM节点，因此删除过程和ClassComponent基本一致，不同的是删除它下面第一个子fiber的DOM节点时不是从这个被删除的HostPortal类型节点的DOM层面的父节点中删除，而是从HostPortal的containerInfo中移除，图示上为div2，因为HostPortal会将子节点渲染到父组件以外的DOM节点。

以上是三种类型节点的删除过程，这里值得注意的是，`unmountHostComponents`函数执行到遍历子树卸载每个节点的时候，一旦遇到HostPortal类型的子节点，会再次调用`unmountHostComponents`，以它为目标节点再进行它以及它子树的卸载删除操作，相当于一个递归过程。

commitUnmount
=============

HostComponent 和 ClassComponent的删除都调用了commitUnmount，除此之外还有FunctionComponent也会调用它。它的作用对三种组件是不同的：

* FunctionComponent 函数组件中一旦调用了useEffect，那么它卸载的时候要去调用useEffect的销毁函数。（useLayoutEffect的销毁函数是调用commitHookEffectListUnmount执行的）
* ClassComponent 类组件要调用componentWillUnmount
* HostComponent 要卸载ref

```javascript
function commitUnmount(
  finishedRoot: FiberRoot,
  current: Fiber,
  renderPriorityLevel: ReactPriorityLevel,
): void {
  onCommitUnmount(current);

  switch (current.tag) {
    case FunctionComponent:
    case ForwardRef:
    case MemoComponent:
    case SimpleMemoComponent:
    case Block: {
      const updateQueue: FunctionComponentUpdateQueue | null = (current.updateQueue: any);
      if (updateQueue !== null) {
        const lastEffect = updateQueue.lastEffect;
        if (lastEffect !== null) {
          const firstEffect = lastEffect.next;

          let effect = firstEffect;
          do {
            const {destroy, tag} = effect;
            if (destroy !== undefined) {
              if ((tag & HookPassive) !== NoHookEffect) {
                // 向useEffect的销毁函数队列里push effect
                enqueuePendingPassiveHookEffectUnmount(current, effect);
              } else {
                // 尝试使用try...catch调用destroy
                safelyCallDestroy(current, destroy);
                ...
              }
            }
            effect = effect.next;
          } while (effect !== firstEffect);
        }
      }
      return;
    }
    case ClassComponent: {
      safelyDetachRef(current);
      const instance = current.stateNode;
      // 调用componentWillUnmount
      if (typeof instance.componentWillUnmount === 'function') {
        safelyCallComponentWillUnmount(current, instance);
      }
      return;
    }
    case HostComponent: {
      // 卸载ref
      safelyDetachRef(current);
      return;
    }
    ...
  }
}
```

总结
==

我们来复盘一下删除过程中的重点：

* 删除操作执行的时机
* 删除的目标是谁
* 从哪里删除

mutation在基于Fiber节点对DOM做其他操作之前，需要先删除节点，保证留给后续操作的fiber节点都是有效的。删除的目标是Fiber节点及其子树和Fiber节点对应的DOM节点，整个轨迹循着fiber树，对目标节点和所有子节点都进行卸载，对目标节点对应的（或之下的第一个）DOM节点进行删除。对于原生DOM类型的节点，直接从其父DOM节点删除，对于HostPortal节点，它会把子节点渲染到外部的DOM节点，所以会从这个DOM节点中删除。明确以上三个点再结合上述梳理的过程，就可以逐渐理清删除操作的脉络。
