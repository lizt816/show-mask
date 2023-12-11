## 安装
```
npm install show-mask --save

```


## 放大图片功能轮播
```js
// 调用 showMask
import { showMask } from "show-mask";

showMask(urlList,index,callback)

/**
 * urlList:图片路径的数组
 * index : 数组的下标 默认0
 * callback：回调函数 加载成功和失败都会返回 成功返回状态200
*/