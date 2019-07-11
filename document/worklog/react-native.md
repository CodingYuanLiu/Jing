# React-native

## ES6

### for-of 对象遍历

`for-of`　是`ES6`中对`for-of`的扩展，与`for-in`不同的是，　`for-of`支持`break`, `continue`, `return`.

同时，`for-of`还支持遍历除了`Array`以外的类数组对象，比如`Map`, `Set`

```javascript
let uniqueWords = new Set();
for (let word of uniqueWords) {
  console.log(word);
}
```

注意，这里的 word 其实是一个`(key, value)`的键值对，如果需要直接解析成`key, value`，可以使用`ES6`的析构方法

```javascript
for (let [key, value] of uniqueWords) {
  console.log(value);
}
```

## React Navigation

`React Navigation`是`React Native`的一个路由管理库，当然，它并不是官方支持的，似乎官方并没有提供`javascript`的路由管理库，而现在还存在很多其他的路由管理工具，`React Navigation`并不是唯一的工具

### 创建路由

创建路由我感觉类似`Vue`中的`Vue Router`，可以直接在`router.js`创建，然后导入到`App.js`

```js
import { createStackNavigator, createAppContainer } from "react-navigation";

class Home extends React.Component {}
```
