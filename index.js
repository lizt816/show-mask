export function showMask(urlList, index = 0, callback) {
 let maxZIndex = geyAllDomMaxZindex();
 // 防止页面滚动
 window.addEventListener('wheel', preventScroll, {
   passive: false
 })
 // 因为移动端 在遮罩上添加了 手指滑动 所以需要生成多个遮罩 才能对应上 图片
 for (let i = 0; i < urlList.length; i++) {
   createMyshowMaskDiv(urlList, i, index, callback, maxZIndex)
 }
}
// 创建遮罩
function createMyshowMaskDiv(list, index, showIndex, callback, maxZIndex) {
 // 初始信息 单个的对象信息 不会公开
 let urlList = deepClone(list);   // 图片列表
 let imgStateMessage = "";  // 存储每个 下标的 成功信息 错误信息
 let initImgCss = {};  // 当前 图片的样式
 // 初始大小
 let MyshowMaskAmplify = 10;
 let MyshowMaskRotate = 0;
 let MyshowMaskDiv, MyshowMaskImg;
 let MyshowMaskSetCursorTimer = null;
 let myThrottle = throttle(doubleFingerAmplification, 80);  // 节流 只能被调用一次
 let iconMyThrottle = throttle(doubleFingerAmplification, 300);  // 图标放大 节流 只能被调用一次
 // 创建遮罩元素
 MyshowMaskDiv = document.createElement('div');
 MyshowMaskDiv.style.position = 'fixed';
 MyshowMaskDiv.style.pointerEvents = 'auto';   // 点击事件的影响
 MyshowMaskDiv.style.opacity = showIndex === index ? '1' : '0';
 MyshowMaskDiv.style.zIndex = showIndex === index ? maxZIndex + 1 : maxZIndex;
 MyshowMaskDiv.style.left = '0';
 MyshowMaskDiv.style.right = '0';
 MyshowMaskDiv.style.bottom = '0';
 MyshowMaskDiv.style.top = '0';
 MyshowMaskDiv.style.display = 'flex';
 MyshowMaskDiv.style.alignItems = 'center';
 MyshowMaskDiv.style.justifyContent = 'center';
 MyshowMaskDiv.style.backgroundColor = '#00000080';
 MyshowMaskDiv.style.touchAction = 'none';
 MyshowMaskDiv.id = "MyshowMaskDiv-key-" + index;
 initImg(urlList[index], index)
 MyshowMaskDiv.innerHTML = setIco()  // 渲染图标
 let nodeList = Array.from(MyshowMaskDiv.children) // 获取到当前遮罩的图标的信息
 nodeList.forEach(e => {
   let cssArr = Array.from(e.classList)
   // 关闭图标，关闭遮罩功能
   if (cssArr.indexOf('my-show-mask-close') > -1) {
     e.addEventListener('click', function (event) {
       divRemove()
       event.stopPropagation();
     })
   }
   // 下方的缩放旋转功能
   if (cssArr.indexOf('my-show-mask-box') > -1) {
     e.addEventListener('click', function (myShowMaskBox) {
       myShowMaskBox.stopPropagation()  // 阻止事件冒泡
     })
     let domList = Array.from(e.children)
     domList.forEach(domListE => {
       let domListECssArr = Array.from(domListE.classList)
       // 放大图标
       if (domListECssArr.indexOf('my-show-mask-box-amplify') > -1) {
         domListE.addEventListener('click', function () {
           iconMyThrottle(true, 0.3)
         })
       }
       // 缩小图标
       if (domListECssArr.indexOf('my-show-mask-box-reduce') > -1) {
         domListE.addEventListener('click', function () {
           if (MyshowMaskAmplify < 100) return;
           iconMyThrottle(false, 0.3)
         })
       }
       // 还原1:1图标
       if (domListECssArr.indexOf('my-show-mask-box-reduction') > -1) {
         domListE.addEventListener('click', function () {
           MyshowMaskAmplify = initImgCss.MyshowMaskAmplify;          // 累计的宽度 重置
           MyshowMaskImg.style.width = initImgCss.MyshowMaskAmplify + 'px';  // 当前的宽度 重置
           MyshowMaskImg.style.left = initImgCss.left;
           MyshowMaskImg.style.top = initImgCss.top;
           MyshowMaskRotate = 0;   // 累计的旋转 重置
           MyshowMaskImg.style.transform = `rotate(0deg)`;   // 当前的旋转 重置
         })
       }
       // left旋转图标
       if (domListECssArr.indexOf('my-show-mask-box-rotate-left') > -1) {
         domListE.addEventListener('click', function () {
           MyshowMaskRotate = MyshowMaskRotate === 0 ? 270 : MyshowMaskRotate - 90;
           MyshowMaskImg.style.transform = `rotate(${MyshowMaskRotate}deg)`;
         })
       }
       // right旋转图标
       if (domListECssArr.indexOf('my-show-mask-box-rotate-right') > -1) {
         domListE.addEventListener('click', function () {
           MyshowMaskRotate = MyshowMaskRotate === 360 ? 90 : MyshowMaskRotate + 90;
           MyshowMaskImg.style.transform = `rotate(${MyshowMaskRotate}deg)`;
         })
       }
     })
   }
   // 点击切换图片
   if (cssArr.indexOf('my-show-mask-switch-right') > -1) {
     e.addEventListener('click', function (myShowMaskBox) {
       myShowMaskBox.stopPropagation()  // 阻止事件冒泡
       // 向右切换
       let changeImgIndex = index === (urlList.length - 1) ? 0 : index + 1;
       changeImg(changeImgIndex)
     })
   }
   // 点击切换图片
   if (cssArr.indexOf('my-show-mask-switch-left') > -1) {
     e.addEventListener('click', function (myShowMaskBox) {
       myShowMaskBox.stopPropagation()  // 阻止事件冒泡
       let changeImgIndex = index === 0 ? (urlList.length - 1) : index - 1;
       changeImg(changeImgIndex)
     })
   }
 })
 // 滚轮缩放图片
 function setImg(rect1, addType, e, type) {
   if (MyshowMaskRotate === 0 || MyshowMaskRotate === 180 || MyshowMaskRotate === 360) {
     MyshowMaskAmplify = addType === 'add' ? MyshowMaskAmplify + (MyshowMaskAmplify * 0.2) : MyshowMaskAmplify - (MyshowMaskAmplify * 0.2);
     MyshowMaskImg.style.width = MyshowMaskAmplify + 'px';
     // 放大后在获取一次图片信息
     let rect2 = MyshowMaskImg.getBoundingClientRect();
     // 不旋转公式一，不旋转: 位置的偏移 - ((放大后的图片宽度 - 放大前的宽度) * (当前鼠标位置 / 图片的总宽度))
     MyshowMaskImg.style.left = (rect2.left - ((rect2.width - rect1.width) * (e.clientX - rect1.left) / rect1.width)) + 'px';
     MyshowMaskImg.style.top = (rect2.top - ((rect2.height - rect1.height) * (e.clientY - rect1.top) / rect1.height)) + 'px';
   } else {
     if (type === 'large') {
       // 放大
       MyshowMaskAmplify *= 1.2;
       let w1 = Number(MyshowMaskImg.offsetWidth);
       let h1 = Number(MyshowMaskImg.offsetHeight);
       // 计算出产生的宽度
       let w2 = w1 * 1.2;
       let h2 = h1 * 1.2;
       verticalScaling(w2, w1, h2, h1, e, type)
     } else {
       // 缩小
       if (MyshowMaskAmplify < 100) return;
       MyshowMaskAmplify /= 1.2
       let w1 = Number(MyshowMaskImg.offsetWidth);
       let h1 = Number(MyshowMaskImg.offsetHeight);
       let w2 = w1 / 1.2;
       let h2 = h1 / 1.2;
       verticalScaling(w2, w1, h2, h1, e)
     }
   }
 }
 // 图标缩放图片
 let timerAmplify = null;
 function iocSetImg(w2, w1, h2, h1, delay, top = 0.5, left = 0.5) {
   MyshowMaskImg.style.transition = `all ${delay}s linear`;
   MyshowMaskImg.style.width = `${(MyshowMaskAmplify)}px`;
   MyshowMaskImg.style.left = Number(MyshowMaskImg.style.left.replaceAll('px', '')) - ((w2 - w1) * left) + 'px';
   MyshowMaskImg.style.top = Number(MyshowMaskImg.style.top.replaceAll('px', '')) - ((h2 - h1) * top) + 'px';
   clearTimeout(timerAmplify)
   timerAmplify = setTimeout(() => {
     MyshowMaskImg.style.transition = 'none';
   }, 300);
 }
 // 竖向缩放
 function verticalScaling(w2, w1, h2, h1, e, t) {
   let h = Number(e.target.offsetHeight); // 放大缩小前的高度
   let w = Number(e.target.offsetWidth); // 放大缩小前的高度
   MyshowMaskImg.style.width = `${(MyshowMaskAmplify)}px`;
   let boxHeight = e.target.offsetHeight;  // 放大缩小后的高度
   let boxWidth = e.target.offsetWidth;    // 放大缩小后的宽度
   let left = Number(MyshowMaskImg.style.left.replaceAll('px', '')); //  当前的box的left值
   let top = Number(MyshowMaskImg.style.top.replaceAll('px', ''));   // 当前的box的top值


   // x轴 percentageLeft
   // 需要先计算出正确的鼠标位置，鼠标位置需要先根据 正放的形状来计算
   // 正确的鼠标位置 ： 计算
   // 对于横向计算： 需要知道多余的部分是剩余隐藏起来的部分，无法计算到，但是需要吧横向的宽度算出来：
   // 隐藏的部分多余 等于高的一般进去宽的一半，需要模拟出鼠标位置
   // 先算横着的位置：  当前鼠标位置等于 隐藏的部分 加上 当前鼠标位置距离右边的位置
   let percentageLeft, percentageTop;
   // y轴 percentageTop

   // 计算公式
   //  x 轴的的公式 ： 
   // 竖向的鼠标位置 + (放大后的宽度 / 2 - 放大后的高度 / 2) = 先算出隐藏的位置宽度在加上鼠标位置等于= 原形状的鼠标位置 / 放大前的宽度
   // (放大后的宽度 / 2 - 放大后的高度 / 2) = 阴影宽度

   // y 轴的的公式 ： 
   // ((放大后的宽度 - 横向的鼠标位置) + (放大后的高度 /2 - 放大后的宽度/2)) / h
   // =  放大后宽度 - 鼠标位置 = 剩余的宽度 = 原形状的top 值
   // =  放大后的高度 / 2 - 放大后的宽度 / 2  =  阴影高度
   // = 原形状的top 值 + 阴影高度 / 旧的高度 等于当前鼠标的位置位置

   if (MyshowMaskRotate != 90) {
     percentageLeft = (e.offsetY + (boxWidth / 2 - boxHeight / 2)) / w;
     percentageTop = ((boxWidth - e.offsetX) + (boxHeight / 2 - boxWidth / 2)) / h;
   } else {
     // 需要把基本位置重置  计算位置在左下角 为 x：0 y：0
     let y = boxHeight - e.offsetY
     let x = boxWidth - e.offsetX
     percentageLeft = (y + (boxWidth / 2 - boxHeight / 2)) / w;
     percentageTop = ((boxWidth - x) + (boxHeight / 2 - boxWidth / 2)) / h;
   }


   MyshowMaskImg.style.left = left - ((w2 - w1) * (percentageLeft)) + 'px';
   MyshowMaskImg.style.top = top - ((h2 - h1) * (percentageTop)) + 'px';
 }
 // 关闭图片  清除防止滚动
 function divRemove(e) {
   window.removeEventListener('wheel', preventScroll)
   for (let i = 0; i < urlList.length; i++) {
     let MyshowMaskDivKey = document.getElementById("MyshowMaskDiv-key-" + i);
     let MyshowMaskImgKey = document.getElementById("MyshowMaskImg-key-" + i);
     MyshowMaskImgKey.onload = null; // 把当前的 图片加载事件清除
     MyshowMaskImgKey.onerror = null;// 把当前的图片 错误事件清除
     MyshowMaskDivKey.remove();       // 清除遮罩
   }
 }
 // 生成图片 
 function initImg(url, index) {
   // 先把遮罩往body元素上追加
   document.body.appendChild(MyshowMaskDiv);
   // MyshowMaskDiv.appendChild 需要异步添加
   setTimeout(() => {
     MyshowMaskAmplify = 10;
     MyshowMaskRotate = 0;
     MyshowMaskSetCursorTimer = null;
     MyshowMaskImg = document.createElement('img');
     MyshowMaskImg.src = url;
     MyshowMaskImg.id = "MyshowMaskImg-key-" + index;
     MyshowMaskImg.style.opacity = "0";

     let imgLoadingDiv = imgLoading();
     MyshowMaskDiv.appendChild(imgLoadingDiv);  // 给 遮罩添加 一个loading 动画
     MyshowMaskDiv.appendChild(MyshowMaskImg);

     MyshowMaskImg.onload = function () {
       imgStateMessage = 200;
       MyshowMaskImg.style.opacity = "1";
       loadImg(index, imgLoadingDiv);  // 图片加载成功调用一次
     }

     MyshowMaskImg.onerror = function () {
       imgStateMessage = "该图片加载有误";
       loadImg(index, imgLoadingDiv);
       MyshowMaskDiv.appendChild(imgError());
     }
   }, 0);
 }
 // 加载图片 成功失败都加载
 function loadImg(i, imgLoadingDiv) {
   imgLoadingDiv.remove();  // 清除 loading 动画
   callback(imgStateMessage, i)
   MyshowMaskAmplify = MyshowMaskImg.width > window.innerWidth ? window.innerWidth : MyshowMaskImg.width;
   MyshowMaskImg.style.width = MyshowMaskAmplify + 'px';
   MyshowMaskImg.style.position = 'absolute';
   MyshowMaskImg.draggable = 'true';
   MyshowMaskImg.style.cursor = 'grab';
   // 关闭遮罩
   MyshowMaskDiv.addEventListener('click', function (e) {
     divRemove()
     e.stopPropagation()
   })
   // 防止事件冒泡
   MyshowMaskImg.addEventListener('click', function (e) {
     e.stopPropagation()
   })
   // 阻止默认拖拽行为
   MyshowMaskImg.addEventListener('dragstart', function (event) {
     event.preventDefault();
   });
   // 设置默认值 以便放大的时候根据放大的宽度计算位置
   MyshowMaskImg.style.top = MyshowMaskImg.offsetTop + 'px';
   MyshowMaskImg.style.left = MyshowMaskImg.offsetLeft + 'px';
   // 保存初始设置 以便 1:1 还原的时候 初始化

   initImgCss = {
     MyshowMaskAmplify,
     left: MyshowMaskImg.offsetLeft + 'px',
     top: MyshowMaskImg.offsetTop + 'px',
   }
   // PC端拖拽
   MyshowMaskImg.addEventListener('mousedown', function (e) {
     if (MyshowMaskSetCursorTimer) {
       clearTimeout(MyshowMaskSetCursorTimer)
     }
     MyshowMaskImg.style.cursor = 'grabbing';
     let x = e.pageX - MyshowMaskImg.offsetLeft;
     let y = e.pageY - MyshowMaskImg.offsetTop;
     window.onmousemove = function (e) {
       let cx = e.pageX - x;
       let cy = e.pageY - y;
       MyshowMaskImg.style.top = cy + 'px';
       MyshowMaskImg.style.left = cx + 'px';
     }
     window.onmouseup = function (e) {
       MyshowMaskImg.style.cursor = 'grab';
       window.onmousemove = null;
       window.onmouseup = null;
     }
   })
   // 移动端 拖拽
   let start = false;   // 控制缩放
   let isDragging = false;
   let offsetX, offsetY;
   // 触摸 接触开始
   let initialDistance = 0;  // 双指的距离位置
   // 开始触摸
   MyshowMaskDiv.addEventListener('touchstart', function (e) {
     let touches = e.touches;
     if (touches.length === 2) {
       // 双指的情况
       start = true;
       initialDistance = Math.hypot(
         touches[0].pageX - touches[1].pageX,
         touches[0].pageY - touches[1].pageY
       );
       return;
     }

     let touch = touches[0];
     offsetX = touch.clientX - MyshowMaskImg.getBoundingClientRect().left;
     offsetY = touch.clientY - MyshowMaskImg.getBoundingClientRect().top;
     isDragging = true;
   });
   // 触摸移动
   MyshowMaskDiv.addEventListener('touchmove', function (e) {
     let touches = e.touches;

     // 双指 放大缩小
     if (touches.length === 2 && start) {
       let currentDistance = Math.hypot(
         touches[0].pageX - touches[1].pageX,
         touches[0].pageY - touches[1].pageY
       );
       // 判断是放大还是缩小
       if (currentDistance > initialDistance) {
         myThrottle(true, 0.08)  // 动画时间和节流事件相等
       } else {
         myThrottle(false, 0.08)  // 动画时间和节流事件相等
       }
       initialDistance = currentDistance;
       return
     }

     // 拖拽
     if (isDragging && !start) {
       let touch = touches[0];
       let newX = touch.clientX - offsetX;
       let newY = touch.clientY - offsetY;
       // 更新元素位置
       MyshowMaskImg.style.left = `${newX}px`;
       MyshowMaskImg.style.top = `${newY}px`;
     }
   });
   // 监听触摸结束事件
   MyshowMaskDiv.addEventListener('touchend', function () {
     start = false;
     initialDistance = 0;
     isDragging = false;
   });
   // 添加滚轮放大缩小
   MyshowMaskImg.addEventListener('wheel', function (e) {
     // 获取图片信息
     let rect1 = MyshowMaskImg.getBoundingClientRect();
     if (e.deltaY < 0) {
       // 放大宽度，并且定位指定的位置
       setImg(rect1, 'add', e, 'large')
       clearTimeout(MyshowMaskSetCursorTimer)
       MyshowMaskImg.style.cursor = 'zoom-in'
       MyshowMaskSetCursorTimer = setTimeout(() => {
         MyshowMaskImg.style.cursor = 'grab'
       }, 500)
     }
     if (e.deltaY > 0) {
       if (MyshowMaskAmplify < 100) return;
       // 缩小
       setImg(rect1, 'reduce', e, 'small')
       MyshowMaskImg.style.cursor = 'zoom-out'
       clearTimeout(MyshowMaskSetCursorTimer)
       MyshowMaskSetCursorTimer = setTimeout(() => {
         MyshowMaskImg.style.cursor = 'grab'
       }, 500)
     }
     // 清除浏览器默认行为，---可能会造成滚动页面 
     e.preventDefault();
   })
 }
 // 手指放大
 function doubleFingerAmplification(is, delay) {
   let w1, h1, w2, h2;
   if (is) {
     // 放大
     MyshowMaskAmplify *= 1.2;
     w1 = Number(MyshowMaskImg.offsetWidth);
     h1 = Number(MyshowMaskImg.offsetHeight);
     // 计算出产生的宽度
     w2 = w1 * 1.2;
     h2 = h1 * 1.2;
   } else {
     // 缩小
     if (MyshowMaskAmplify < 100) return;
     MyshowMaskAmplify /= 1.2
     w1 = Number(MyshowMaskImg.offsetWidth);
     h1 = Number(MyshowMaskImg.offsetHeight);
     w2 = w1 / 1.2;
     h2 = h1 / 1.2;
   }
   MyshowMaskImg.style.transition = `all ${delay}s linear`;
   MyshowMaskImg.style.width = `${(MyshowMaskAmplify)}px`;

   let offsetTop = 0.5;  // 位置的偏移量
   let offsetLeft = 0.5;  // 位置的偏移量
   // 获取到屏幕的位置 
   let winW = window.innerWidth / 2;
   let winH = window.innerHeight / 2;
   let domLeft = MyshowMaskImg.offsetLeft;
   let domTop = MyshowMaskImg.offsetTop;
   let domW = MyshowMaskImg.offsetWidth;
   let domH = MyshowMaskImg.offsetHeight;

   // left 在视口居中的位置时
   if (domLeft < winW) {
     // 如果 right 没超出 了居中位置
     if ((domW + domLeft) < winW) {
       offsetLeft = 1;  // 放大 right 那边
     } else {
       // 表示内容在 居中位置
       offsetLeft = (winW - domLeft) / domW
     }
   } else {
     // 放大left位置
     offsetLeft = 0.1;
   }

   // top 在视口居中的位置时
   if (domTop < winH) {
     // 如果 top 没超出 了居中位置
     if ((domH + domTop) < winH) {
       offsetTop = 1;  // 放大 bottom 那边
     } else {
       // 表示内容在 居中位置
       offsetTop = (winH - domTop) / domH
     }
   } else {
     // 放大top位置
     offsetTop = 0.1;
   }
   iocSetImg(w2, w1, h2, h1, delay, offsetTop, offsetLeft)
 }
 // 切换图片
 function changeImg(index) {
   callback("change", index)
   for (let i = 0; i < urlList.length; i++) {
     if (index != i) {
       document.getElementById("MyshowMaskDiv-key-" + i).style.opacity = "0";
       document.getElementById("MyshowMaskDiv-key-" + i).style.zIndex = maxZIndex;
     } else {
       document.getElementById("MyshowMaskDiv-key-" + i).style.opacity = "1";
       document.getElementById("MyshowMaskDiv-key-" + i).style.zIndex = maxZIndex + 1;
     }
   }
 }
}
// 加载失败
function imgError() {
 // 创建 SVG 元素
 const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
 svg.title = "Load Fail";
 svg.setAttribute("t", "1702544511441");
 svg.setAttribute("class", "icon");
 svg.setAttribute("viewBox", "0 0 1024 1024");
 svg.setAttribute("version", "1.1");
 svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
 svg.setAttribute("p-id", "4279");
 svg.setAttribute("width", "120");
 svg.setAttribute("height", "120");

 // 创建第一个 path 元素
 const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
 path1.setAttribute("d", "M776 328m-72 0a72 72 0 1 0 144 0 72 72 0 1 0-144 0Z");
 path1.setAttribute("p-id", "4280");
 path1.setAttribute("fill", "#f7f7f7");

 // 创建第二个 path 元素
 const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
 path2.setAttribute("d", "M999.904 116.608a32 32 0 0 0-21.952-10.912l-456.192-31.904a31.552 31.552 0 0 0-27.2 11.904l-92.192 114.848a32 32 0 0 0 0.672 40.896l146.144 169.952-147.456 194.656 36.48-173.376a32 32 0 0 0-11.136-31.424L235.616 245.504l79.616-125.696a32 32 0 0 0-29.28-49.024l-240.192 16.768a32 32 0 0 0-29.696 34.176l55.808 798.016a32.064 32.064 0 0 0 34.304 29.696l176.512-13.184c17.632-1.312 30.848-16.672 29.504-34.272s-16.576-31.04-34.304-29.536l-144.448 10.784-6.432-92.512 125.312-12.576a32 32 0 0 0 28.672-35.04 32.16 32.16 0 0 0-35.04-28.672l-123.392 12.416L82.144 149.184l145.152-10.144-60.96 96.224a32 32 0 0 0 6.848 41.952l198.4 161.344-58.752 279.296a30.912 30.912 0 0 0 0.736 14.752 31.68 31.68 0 0 0 1.408 11.04l51.52 154.56a31.968 31.968 0 0 0 27.456 21.76l523.104 47.552a32.064 32.064 0 0 0 34.848-29.632L1007.68 139.84a32.064 32.064 0 0 0-7.776-23.232z m-98.912 630.848l-412.576-39.648a31.52 31.52 0 0 0-34.912 28.768 32 32 0 0 0 28.8 34.912l414.24 39.808-6.272 89.536-469.728-42.72-39.584-118.72 234.816-310.016a31.936 31.936 0 0 0-1.248-40.192L468.896 219.84l65.088-81.056 407.584 28.48-40.576 580.192z");
 path2.setAttribute("p-id", "4281");
 path2.setAttribute("fill", "#f7f7f7");

 // 将 path 元素添加到 svg 元素中
 svg.appendChild(path1);
 svg.appendChild(path2);

 // 将 svg 元素添加到 body 中
 return svg;
}
// 加载动画
function imgLoading() {
 const animationList = [
   '--translateX: 20px; --translateY: 20px;',
   '--translateX: -20px; --translateY: 20px;',
   '--translateX: 20px; --translateY: -20px;',
   '--translateX: -20px; --translateY: -20px;',
 ]
 const childContainer = document.createElement('div');
 childContainer.className = 'my-show-mask-loading-center';
 childContainer.title = "Loading...";
 for (let item of animationList) {
   const childEl = document.createElement('div');
   childEl.className = 'my-show-mask-circle';
   childEl.style = item;
   childEl.id = 'my-show-mask-circle_animation';
   childContainer.appendChild(childEl)
 }
 return childContainer;
}
// 生成旋转，放大缩小图标
function setIco() {
 return (
   `
<style>
   .my-show-mask-loading-center {
     position: absolute;
     left: 50%;
     top: 50%;
     height: 60px;
     width: 60px;
     margin-top: -30px;
     margin-left: -30px;
     -webkit-animation: my-show-mask-loading-center 1s infinite;
     animation: my-show-mask-loading-center 1s infinite;

   }
   .my-show-mask-circle {
     width: 20px;
     height: 20px;
     background-color: #FFF;
     float: left;
     -moz-border-radius: 50% 50% 50% 50%;
     -webkit-border-radius: 50% 50% 50% 50%;
     border-radius: 50% 50% 50% 50%;
     margin-right: 20px;
     margin-bottom: 20px;
   }
   .my-show-mask-circle:nth-child(2n+0) {
     margin-right: 0px;

   }
   #my-show-mask-circle_animation {
     -webkit-animation: my-show-mask-circle_animation 1s infinite;
     animation: my-show-mask-circle_animation 1s infinite;
   }
   @-webkit-keyframes my-show-mask-loading-center {
     100% {
           -ms-transform: rotate(360deg);
           -webkit-transform: rotate(360deg);
           transform: rotate(360deg);
     }
   }
   @keyframes my-show-mask-loading-center {
     100% {
           -ms-transform: rotate(360deg);
           -webkit-transform: rotate(360deg);
           transform: rotate(360deg);
     }
   }
   @-webkit-keyframes my-show-mask-circle_animation {
     50% {
           -ms-transform: translate(var(--translateX), var(--translateY));
           -webkit-transform: translate(var(--translateX), var(--translateY));
           transform: translate(var(--translateX), var(--translateY));
     }
   }
   @keyframes my-show-mask-circle_animation {
     50% {
           -ms-transform: translate(var(--translateX), var(--translateY));
           -webkit-transform: translate(var(--translateX), var(--translateY));
           transform: translate(var(--translateX), var(--translateY));
     }
   }
  .my-show-mask-close{
    position: absolute;
    z-index: 9;
    top: 5%;
    right: 5%;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #606266;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;
  }
  .my-show-mask-box{
    position: absolute;
    z-index: 9;
    display: flex;
    bottom: 8%;
    border-radius: 20px;
    background-color: #606266;
    height: 44px;
    width: 282px;
    justify-content: space-evenly;
    align-items: center;
  }
  .my-show-mask-box>div{
    color:#fff;
    font-style: normal;
    font-weight: 400;
    font-size: 23px;
    align-items: center;
    cursor:pointer;
    display: flex;
  }
  .my-show-mask-box>.my-show-mask-box-reduce{
   padding-top: 3px;
  }
  .my-show-mask-box>.my-show-mask-box-amplify{
   padding-top: 3px;
  }
  .my-show-mask-box>.my-show-mask-box-reduction{
   padding-top: 2px;
  }
  .my-show-mask-box>.my-show-mask-box-rotate-left{
   position: relative;
   padding-top: 1px;
   width: 23px;
   height: 23px;
  }

  .my-show-mask-box>.my-show-mask-box-rotate-right{
   position: relative;
   padding-top: 1px;
   transform: rotateY(180deg);
   width: 23px;
   height: 23px;
  }
  .my-show-mask-switch{
   position: absolute;
   z-index: 10;
   font-size: 31px;
   color: #fff;
   font-family: cursive, sans-serif;
   font-weight: 400;
   border-radius: 50%;
   width: 50px;
   height: 50px;
   background-color: #606266;
   text-align: center;
   line-height: 50px;
   top: 50%;
   transform: translateY(-50%);
   cursor: pointer;
   -webkit-user-select:none;
   -moz-user-select:none;
   -ms-user-select:none;
   user-select:none;
  }
  .my-show-mask-switch-left{
   left: 40px;
  }
  .my-show-mask-switch-left::after{
   content:'';
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-30%, -50%) rotate(135deg);
   border-right: 2px solid #fff;
   border-bottom: 2px solid #fff;
   width: 33%;
   height: 33%;
  }
  .my-show-mask-switch-right{
   right: 40px;
  }
  .my-show-mask-switch-right::after{
   content:'';
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-70%, -50%) rotate(135deg);
   border-left: 2px solid #fff;
   border-top: 2px solid #fff;
   width: 33%;
   height: 33%;
  }
</style>
<div class='my-show-mask-close'>
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="0" x2="18" y2="18" stroke="white" stroke-width="2.3" />
    <line x1="0" y1="18" x2="18" y2="0" stroke="white" stroke-width="2.3" />
  </svg>
</div>
<div class='my-show-mask-switch my-show-mask-switch-right'>
</div>  
<div class='my-show-mask-switch my-show-mask-switch-left'>
</div> 

<div class='my-show-mask-box'>
 <div class="my-show-mask-box-amplify">
  <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="9" stroke="white" fill="none" stroke-width="2" />
    <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="2" />
    <!-- 垂直线 -->
    <line x1="10" y1="6" x2="10" y2="14" stroke="white" stroke-width="2" />
    <line x1="16" y1="17" x2="20" y2="20" stroke="white" stroke-width="2" />
  </svg>
 </div>

 ${iswap() === 'pc' ? `<div class="my-show-mask-box-reduce">
 <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg">
   <circle cx="10" cy="10" r="9" stroke="white" fill="none" stroke-width="2" />
   <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="2" />
   <line x1="16" y1="17" x2="20" y2="20" stroke="white" stroke-width="2" />
 </svg>
</div>`: ``}

<div class="my-show-mask-box-reduction">
 <svg t="1700634179030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11099" width="25" height="25"><path d="M316 672h60c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8zM512 622c22.1 0 40-17.9 40-39 0-23.1-17.9-41-40-41s-40 17.9-40 41c0 21.1 17.9 39 40 39zM512 482c22.1 0 40-17.9 40-39 0-23.1-17.9-41-40-41s-40 17.9-40 41c0 21.1 17.9 39 40 39z" p-id="11100" fill="#ffffff"></path><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 728H184V184h656v656z" p-id="11101" fill="#ffffff"></path><path d="M648 672h60c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8z" p-id="11102" fill="#ffffff"></path></svg>
 </div>


 ${iswap() === 'pc' ? `
 <div class='my-show-mask-box-rotate-left'>
 <svg t="1700632794728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5964" width="23" height="23"><path d="M930.909091 344.436364c-41.890909-111.709091-130.327273-209.454545-242.036364-256-102.4-51.2-232.727273-51.2-349.090909-9.309091-74.472727 27.927273-134.981818 69.818182-186.181818 121.018182l-9.309091 13.963636V93.090909c0-23.272727-13.963636-41.890909-41.890909-41.890909-27.927273 0-41.890909 18.618182-41.890909 41.890909v251.345455c0 23.272727 13.963636 41.890909 41.890909 41.890909h251.345455c23.272727 0 41.890909-13.963636 41.890909-41.890909 0-23.272727-13.963636-41.890909-41.890909-41.890909H186.181818l9.309091-9.309091c41.890909-60.509091 97.745455-107.054545 167.563636-134.981819 88.436364-37.236364 195.490909-32.581818 288.581819 9.309091 88.436364 41.890909 158.254545 111.709091 195.490909 204.8 37.236364 93.090909 37.236364 200.145455-4.654546 293.236364-41.890909 88.436364-111.709091 158.254545-204.8 195.490909-88.436364 37.236364-195.490909 32.581818-288.581818-9.309091-88.436364-41.890909-158.254545-111.709091-195.490909-204.8-4.654545-13.963636-23.272727-27.927273-37.236364-27.927273-4.654545 0-9.309091 0-18.618181 4.654546s-18.618182 13.963636-23.272728 23.272727c-4.654545 9.309091-4.654545 23.272727 0 32.581818 41.890909 111.709091 130.327273 209.454545 242.036364 256 60.509091 27.927273 125.672727 41.890909 190.836364 41.890909 55.854545 0 116.363636-9.309091 162.90909-27.927272 111.709091-41.890909 209.454545-130.327273 256-242.036364 41.890909-125.672727 46.545455-251.345455 4.654546-363.054545z" fill="#ffffff" p-id="5965"></path></svg>
 </div>
 
 <div class='my-show-mask-box-rotate-right'>
 <svg t="1700632794728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5964" width="23" height="23"><path d="M930.909091 344.436364c-41.890909-111.709091-130.327273-209.454545-242.036364-256-102.4-51.2-232.727273-51.2-349.090909-9.309091-74.472727 27.927273-134.981818 69.818182-186.181818 121.018182l-9.309091 13.963636V93.090909c0-23.272727-13.963636-41.890909-41.890909-41.890909-27.927273 0-41.890909 18.618182-41.890909 41.890909v251.345455c0 23.272727 13.963636 41.890909 41.890909 41.890909h251.345455c23.272727 0 41.890909-13.963636 41.890909-41.890909 0-23.272727-13.963636-41.890909-41.890909-41.890909H186.181818l9.309091-9.309091c41.890909-60.509091 97.745455-107.054545 167.563636-134.981819 88.436364-37.236364 195.490909-32.581818 288.581819 9.309091 88.436364 41.890909 158.254545 111.709091 195.490909 204.8 37.236364 93.090909 37.236364 200.145455-4.654546 293.236364-41.890909 88.436364-111.709091 158.254545-204.8 195.490909-88.436364 37.236364-195.490909 32.581818-288.581818-9.309091-88.436364-41.890909-158.254545-111.709091-195.490909-204.8-4.654545-13.963636-23.272727-27.927273-37.236364-27.927273-4.654545 0-9.309091 0-18.618181 4.654546s-18.618182 13.963636-23.272728 23.272727c-4.654545 9.309091-4.654545 23.272727 0 32.581818 41.890909 111.709091 130.327273 209.454545 242.036364 256 60.509091 27.927273 125.672727 41.890909 190.836364 41.890909 55.854545 0 116.363636-9.309091 162.90909-27.927272 111.709091-41.890909 209.454545-130.327273 256-242.036364 41.890909-125.672727 46.545455-251.345455 4.654546-363.054545z" fill="#ffffff" p-id="5965"></path></svg>
 </div>
 `: `
 <div class="my-show-mask-box-reduce">
 <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg">
   <circle cx="10" cy="10" r="9" stroke="white" fill="none" stroke-width="2" />
   <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="2" />
   <line x1="16" y1="17" x2="20" y2="20" stroke="white" stroke-width="2" />
 </svg>
</div>
`}
 
</div>
`
 )
}
// 防止滚动
function preventScroll(e) {
 e.preventDefault()
}
// 获取页面的 层级
function geyAllDomMaxZindex() {
 // 获取页面上所有元素
 let allElements = document.querySelectorAll('*');
 // 初始化最高z-index值为一个较小的负数
 let highestZIndex = -1;
 // 遍历所有元素
 allElements.forEach(function (element) {
   // 获取当前元素的z-index属性
   let zIndex = window.getComputedStyle(element).getPropertyValue('z-index');
   // 将z-index属性的值转换为整数
   zIndex = parseInt(zIndex, 10);
   // 检查z-index是否有效且比当前最高值高
   if (!isNaN(zIndex) && zIndex > highestZIndex) {
     highestZIndex = Number(zIndex) + 1;
   }
 });
 return highestZIndex
}
// 克隆目标
function deepClone(obj) {
 if (typeof obj !== 'object' || obj === null) {
   return obj;
 }
 const clone = Array.isArray(obj) ? [] : {};
 for (const key in obj) {
   if (Object.prototype.hasOwnProperty.call(obj, key)) {
     clone[key] = deepClone(obj[key]);
   }
 }
 return clone;
}
// 节流
function throttle(func, delay) {
 let lastTime = 0;
 return function (...args) {
   const now = Date.now();

   if (now - lastTime >= delay) {
     func.apply(this, args);
     lastTime = now;
   }
 };
}
// 判断是移动端还是pc端
function iswap() {
 let uA = navigator.userAgent.toLowerCase();
 let ipad = uA.match(/ipad/i) == "ipad";
 let iphone = uA.match(/iphone os/i) == "iphone os";
 let midp = uA.match(/midp/i) == "midp";
 let uc7 = uA.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
 let uc = uA.match(/ucweb/i) == "ucweb";
 let android = uA.match(/android/i) == "android";
 let windowsce = uA.match(/windows ce/i) == "windows ce";
 let windowsmd = uA.match(/windows mobile/i) == "windows mobile";
 if (!(ipad || iphone || midp || uc7 || uc || android || windowsce || windowsmd)) {
   return "pc"
 } else {
   return "phone"
 }
}