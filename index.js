import Vue from 'vue'
// 初始大小
let MyshowMaskAmplify = 10;
let MyshowMaskRotate = 0;
let MyshowMaskDiv, MyshowMaskImg;
let MyshowMaskMyurlLis = []
let MyshowMaskMyindex = 0;
let MyshowMaskSetCursorTimer = null;
let myThrottle = throttle(doubleFingerAmplification,80);  // 节流 只能被调用一次
let iconMyThrottle = throttle(doubleFingerAmplification,300);  // 图标放大 节流 只能被调用一次

let imageError = null;   // 图片错误的回调函数

export function showMask(urlList, index = 0,callback) {
 imageError = callback
 // 创建遮罩元素
 MyshowMaskDiv = document.createElement('div');
 MyshowMaskDiv.style.position = 'fixed';
 MyshowMaskDiv.style.pointerEvents = 'auto';   // 点击事件的影响
 MyshowMaskDiv.style.zIndex = geyAllDomMaxZindex() + '10';
 MyshowMaskDiv.style.left = '0';
 MyshowMaskDiv.style.right = '0';
 MyshowMaskDiv.style.bottom = '0';
 MyshowMaskDiv.style.top = '0';
 MyshowMaskDiv.style.display = 'flex';
 MyshowMaskDiv.style.display = 'flex';
 MyshowMaskDiv.style.alignItems = 'center';
 MyshowMaskDiv.style.justifyContent = 'center';
 MyshowMaskDiv.style.backgroundColor = '#00000080';
 MyshowMaskDiv.style.touchAction = 'none';
 
 window.addEventListener('wheel', preventScroll, {
  passive: false
 })
 // 初始化
 MyshowMaskAmplify = 10;
 MyshowMaskRotate = 0;
 MyshowMaskMyurlLis = urlList
 MyshowMaskMyindex = index
 initImg(urlList[index])
 MyshowMaskDiv.innerHTML = setIco()  // 渲染图标
 let nodeList = Array.from(MyshowMaskDiv.children) // 获取到图标的信息
 nodeList.forEach(e => {
  let cssArr = Array.from(e.classList)
  // 关闭图标，关闭遮罩功能
  if (cssArr.indexOf('my-show-mask-close') > -1) {
   e.addEventListener('click', function () {
    divRemove()
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
      iconMyThrottle(true,0.3)
     })
    }
    // 缩小图标
    if (domListECssArr.indexOf('my-show-mask-box-reduce') > -1) {
     domListE.addEventListener('click', function () {
      if (MyshowMaskAmplify < 100) return;
      iconMyThrottle(false,0.3)
     })
    }
    // 还原1:1图标
    if (domListECssArr.indexOf('my-show-mask-box-reduction') > -1) {
     domListE.addEventListener('click', function () {
      initImg(MyshowMaskMyurlLis[MyshowMaskMyindex])
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
    MyshowMaskMyindex = MyshowMaskMyindex === (MyshowMaskMyurlLis.length - 1) ? 0 : MyshowMaskMyindex + 1;
    initImg(MyshowMaskMyurlLis[MyshowMaskMyindex])
   })
  }
  // 点击切换图片
  if (cssArr.indexOf('my-show-mask-switch-left') > -1) {
   e.addEventListener('click', function (myShowMaskBox) {
    myShowMaskBox.stopPropagation()  // 阻止事件冒泡
    MyshowMaskMyindex = MyshowMaskMyindex === 0 ? (MyshowMaskMyurlLis.length - 1) : MyshowMaskMyindex - 1;
    initImg(MyshowMaskMyurlLis[MyshowMaskMyindex])
   })
  }
 })
}
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
function iocSetImg(w2, w1, h2, h1, delay,top=0.5,left=0.5) {
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
// 清除防止滚动
function divRemove() {
 window.removeEventListener('wheel', preventScroll)
 MyshowMaskDiv.remove()
}
// 生成图片
function initImg(url) {
 MyshowMaskAmplify = 10;
 MyshowMaskRotate = 0;
 MyshowMaskSetCursorTimer = null;
 let myShowMaskImg = document.getElementById('my-show-mask-img')
 if (myShowMaskImg) {
  myShowMaskImg.remove()
 }
 MyshowMaskImg = document.createElement('img');
 MyshowMaskImg.src = url
 MyshowMaskImg.id = 'my-show-mask-img'
 MyshowMaskImg.addEventListener('load', function (params){
  loadImg()
  imageError(200)
 })

 MyshowMaskImg.addEventListener('error',function(){
  loadImg();
  imageError("该图片加载有误")
 })
}

function loadImg(){
    MyshowMaskAmplify = MyshowMaskImg.width > window.innerWidth ? window.innerWidth : MyshowMaskImg.width;
    MyshowMaskImg.style.width = MyshowMaskAmplify + 'px';
    MyshowMaskImg.style.position = 'absolute';
    MyshowMaskImg.draggable = 'true';
    MyshowMaskImg.style.cursor = 'grab';
    MyshowMaskDiv.appendChild(MyshowMaskImg)
    // 往body元素上追加
    document.body.appendChild(MyshowMaskDiv);
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
    
    // PC端拖拽
    if(iswap() === 'pc'){
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
    }
    // 移动端 拖拽
    let start = false;   // 控制缩放
    if(iswap() === 'phone'){
      let isDragging = false;
      let offsetX, offsetY;
      // 触摸开始
      MyshowMaskImg.addEventListener('touchstart', function (e) {
        const touch = e.touches[0];
        offsetX = touch.clientX - MyshowMaskImg.getBoundingClientRect().left;
        offsetY = touch.clientY - MyshowMaskImg.getBoundingClientRect().top;
        isDragging = true;
      });
      // 触摸移动
      MyshowMaskImg.addEventListener('touchmove', function (e) {
        if (isDragging && !start) {
          const touch = e.touches[0];
          const newX = touch.clientX - offsetX;
          const newY = touch.clientY - offsetY;
          // 更新元素位置
          MyshowMaskImg.style.left = `${newX}px`;
          MyshowMaskImg.style.top = `${newY}px`;
        }
      });
      // 触摸结束
      MyshowMaskImg.addEventListener('touchend', function () {
        isDragging = false;
      });
    }
    // 双指放大缩小
    if(iswap() === 'phone'){
      // 监听触摸开始事件
      let initialDistance = 0;  // 双指的距离位置
      MyshowMaskDiv.addEventListener('touchstart', function (e) {
        const touches = e.touches;
        if (touches.length === 2) {
          start = true;
          initialDistance = Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY
          );
        }
      });
  
      // 监听触摸移动事件
      MyshowMaskDiv.addEventListener('touchmove', function (e) {
        const touches = e.touches;
        if (touches.length === 2 && start) {
          const currentDistance = Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY
          );
          // 判断是放大还是缩小
          if (currentDistance > initialDistance) {
            myThrottle(true,0.08)  // 动画时间和节流事件相等
          } else {
            myThrottle(false,0.08)  // 动画时间和节流事件相等
          }
          initialDistance = currentDistance;
        }
      });
  
      // 监听触摸结束事件
      MyshowMaskDiv.addEventListener('touchend', function () {
        start = false;
        initialDistance=0;
      });
    }
    // 添加滚轮放大缩小
    if(iswap() === 'pc'){
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
}
// 手指放大
function doubleFingerAmplification(is,delay){
  let w1,h1,w2,h2;
  if(is){
    // 放大
    MyshowMaskAmplify *= 1.2;
    w1 = Number(MyshowMaskImg.offsetWidth);
    h1 = Number(MyshowMaskImg.offsetHeight);
    // 计算出产生的宽度
    w2 = w1 * 1.2;
    h2 = h1 * 1.2;
  } else{
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
  let winW = window.innerWidth/2;
  let winH = window.innerHeight/2;
  let domLeft = MyshowMaskImg.offsetLeft;
  let domTop = MyshowMaskImg.offsetTop;
  let domW = MyshowMaskImg.offsetWidth;
  let domH = MyshowMaskImg.offsetHeight;

  // left 在视口居中的位置时
  if(domLeft < winW){
    // 如果 right 没超出 了居中位置
    if((domW + domLeft) < winW ){
      offsetLeft = 1;  // 放大 right 那边
    } else{
      // 表示内容在 居中位置
      offsetLeft = (winW - domLeft) / domW
    }
  }else{
    // 放大left位置
    offsetLeft = 0.1;
  }

  // top 在视口居中的位置时
  if(domTop < winH){
    // 如果 top 没超出 了居中位置
    if((domH + domTop) < winH ){
      offsetTop = 1;  // 放大 bottom 那边
    } else{
      // 表示内容在 居中位置
      offsetTop = (winH - domTop) / domH
    }
  }else{
    // 放大top位置
    offsetTop = 0.1;
  }
  iocSetImg(w2, w1, h2, h1,delay,offsetTop,offsetLeft)
}
// 生成旋转，放大缩小图标
function setIco() {
 return (
  `
  <style>
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

   ${iswap() === 'pc'?`<div class="my-show-mask-box-reduce">
   <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg">
     <circle cx="10" cy="10" r="9" stroke="white" fill="none" stroke-width="2" />
     <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="2" />
     <line x1="16" y1="17" x2="20" y2="20" stroke="white" stroke-width="2" />
   </svg>
  </div>`:``}

  <div class="my-show-mask-box-reduction">
   <svg t="1700634179030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11099" width="25" height="25"><path d="M316 672h60c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8zM512 622c22.1 0 40-17.9 40-39 0-23.1-17.9-41-40-41s-40 17.9-40 41c0 21.1 17.9 39 40 39zM512 482c22.1 0 40-17.9 40-39 0-23.1-17.9-41-40-41s-40 17.9-40 41c0 21.1 17.9 39 40 39z" p-id="11100" fill="#ffffff"></path><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 728H184V184h656v656z" p-id="11101" fill="#ffffff"></path><path d="M648 672h60c4.4 0 8-3.6 8-8V360c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v304c0 4.4 3.6 8 8 8z" p-id="11102" fill="#ffffff"></path></svg>
   </div>


   ${iswap() === 'pc'?`
   <div class='my-show-mask-box-rotate-left'>
   <svg t="1700632794728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5964" width="23" height="23"><path d="M930.909091 344.436364c-41.890909-111.709091-130.327273-209.454545-242.036364-256-102.4-51.2-232.727273-51.2-349.090909-9.309091-74.472727 27.927273-134.981818 69.818182-186.181818 121.018182l-9.309091 13.963636V93.090909c0-23.272727-13.963636-41.890909-41.890909-41.890909-27.927273 0-41.890909 18.618182-41.890909 41.890909v251.345455c0 23.272727 13.963636 41.890909 41.890909 41.890909h251.345455c23.272727 0 41.890909-13.963636 41.890909-41.890909 0-23.272727-13.963636-41.890909-41.890909-41.890909H186.181818l9.309091-9.309091c41.890909-60.509091 97.745455-107.054545 167.563636-134.981819 88.436364-37.236364 195.490909-32.581818 288.581819 9.309091 88.436364 41.890909 158.254545 111.709091 195.490909 204.8 37.236364 93.090909 37.236364 200.145455-4.654546 293.236364-41.890909 88.436364-111.709091 158.254545-204.8 195.490909-88.436364 37.236364-195.490909 32.581818-288.581818-9.309091-88.436364-41.890909-158.254545-111.709091-195.490909-204.8-4.654545-13.963636-23.272727-27.927273-37.236364-27.927273-4.654545 0-9.309091 0-18.618181 4.654546s-18.618182 13.963636-23.272728 23.272727c-4.654545 9.309091-4.654545 23.272727 0 32.581818 41.890909 111.709091 130.327273 209.454545 242.036364 256 60.509091 27.927273 125.672727 41.890909 190.836364 41.890909 55.854545 0 116.363636-9.309091 162.90909-27.927272 111.709091-41.890909 209.454545-130.327273 256-242.036364 41.890909-125.672727 46.545455-251.345455 4.654546-363.054545z" fill="#ffffff" p-id="5965"></path></svg>
   </div>
   
   <div class='my-show-mask-box-rotate-right'>
   <svg t="1700632794728" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5964" width="23" height="23"><path d="M930.909091 344.436364c-41.890909-111.709091-130.327273-209.454545-242.036364-256-102.4-51.2-232.727273-51.2-349.090909-9.309091-74.472727 27.927273-134.981818 69.818182-186.181818 121.018182l-9.309091 13.963636V93.090909c0-23.272727-13.963636-41.890909-41.890909-41.890909-27.927273 0-41.890909 18.618182-41.890909 41.890909v251.345455c0 23.272727 13.963636 41.890909 41.890909 41.890909h251.345455c23.272727 0 41.890909-13.963636 41.890909-41.890909 0-23.272727-13.963636-41.890909-41.890909-41.890909H186.181818l9.309091-9.309091c41.890909-60.509091 97.745455-107.054545 167.563636-134.981819 88.436364-37.236364 195.490909-32.581818 288.581819 9.309091 88.436364 41.890909 158.254545 111.709091 195.490909 204.8 37.236364 93.090909 37.236364 200.145455-4.654546 293.236364-41.890909 88.436364-111.709091 158.254545-204.8 195.490909-88.436364 37.236364-195.490909 32.581818-288.581818-9.309091-88.436364-41.890909-158.254545-111.709091-195.490909-204.8-4.654545-13.963636-23.272727-27.927273-37.236364-27.927273-4.654545 0-9.309091 0-18.618181 4.654546s-18.618182 13.963636-23.272728 23.272727c-4.654545 9.309091-4.654545 23.272727 0 32.581818 41.890909 111.709091 130.327273 209.454545 242.036364 256 60.509091 27.927273 125.672727 41.890909 190.836364 41.890909 55.854545 0 116.363636-9.309091 162.90909-27.927272 111.709091-41.890909 209.454545-130.327273 256-242.036364 41.890909-125.672727 46.545455-251.345455 4.654546-363.054545z" fill="#ffffff" p-id="5965"></path></svg>
   </div>
   `:`
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
   highestZIndex = zIndex;
  }
 });
 return highestZIndex
}
// 放大或者缩小
function touchmoveSetImg(is,delay=0.3){
  if(is){
    // 放大
    MyshowMaskAmplify *= 1.2;
    let w1 = Number(MyshowMaskImg.offsetWidth);
    let h1 = Number(MyshowMaskImg.offsetHeight);
    // 计算出产生的宽度
    let w2 = w1 * 1.2;
    let h2 = h1 * 1.2;
    iocSetImg(w2, w1, h2, h1,delay)
  } else{
    // 缩小
    if (MyshowMaskAmplify < 100) return;
    MyshowMaskAmplify /= 1.2
    let w1 = Number(MyshowMaskImg.offsetWidth);
    let h1 = Number(MyshowMaskImg.offsetHeight);
    let w2 = w1 / 1.2;
    let h2 = h1 / 1.2;
    iocSetImg(w2, w1, h2, h1,delay)
  }
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