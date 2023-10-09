// 初始大小
let MyshowMaskAmplify = 10;
let MyshowMaskRotate = 0;
let MyshowMaskDiv,MyshowMaskImg;
let MyshowMaskMyurlLis = []
let MyshowMaskMyindex = 0;
let MyshowMaskSetCursorTimer = null;
export function showMask(urlList,index=0) {
 // 创建元素
 MyshowMaskDiv = document.createElement('div');
 MyshowMaskDiv.style.position = 'fixed';
 MyshowMaskDiv.style.pointerEvents = 'auto';   // 点击事件的影响
 MyshowMaskDiv.style.zIndex = geyAllDomMaxZindex()+'10';
 MyshowMaskDiv.style.left = '0';
 MyshowMaskDiv.style.right = '0';
 MyshowMaskDiv.style.bottom = '0';
 MyshowMaskDiv.style.top = '0';
 MyshowMaskDiv.style.display = 'flex';
 MyshowMaskDiv.style.display = 'flex';
 MyshowMaskDiv.style.alignItems = 'center';
 MyshowMaskDiv.style.justifyContent = 'center';
 MyshowMaskDiv.style.backgroundColor = '#00000080';
 window.addEventListener('wheel', preventScroll, {
  passive: false
 })
 // 初始化
 MyshowMaskAmplify = 10;
 MyshowMaskRotate = 0;
 MyshowMaskMyindex = 0;
 MyshowMaskMyurlLis = urlList
 MyshowMaskMyindex = index
 initImg(urlList[index])
 MyshowMaskDiv.innerHTML=setIco()  // 渲染图标
 let nodeList = Array.from(MyshowMaskDiv.children) // 获取到图标的信息
 nodeList.forEach(e=>{
  let cssArr = Array.from(e.classList)
  // 关闭图标，关闭遮罩功能
  if(cssArr.indexOf('my-show-mask-close') > -1){
    e.addEventListener('click',function(){
     divRemove()
    })
  }
  // 下方的缩放旋转功能
  if(cssArr.indexOf('my-show-mask-box') > -1){
    e.addEventListener('click',function(myShowMaskBox){
     myShowMaskBox.stopPropagation()  // 阻止事件冒泡
   })
   let domList = Array.from(e.children)
   domList.forEach(domListE=>{
    let domListECssArr = Array.from(domListE.classList)
    // 放大图标
    if(domListECssArr.indexOf('my-show-mask-box-amplify') > -1){
     domListE.addEventListener('click',function(){
      MyshowMaskAmplify *= 1.2;
       let w1 = Number(MyshowMaskImg.offsetWidth);
       let h1 = Number(MyshowMaskImg.offsetHeight);
       // 计算出产生的宽度
       let w2 = w1*1.2;
       let h2 = h1*1.2;
       iocSetImg(w2,w1,h2,h1)
     })
    }
    // 缩小图标
    if(domListECssArr.indexOf('my-show-mask-box-reduce') > -1){
     domListE.addEventListener('click',function(){
      if (MyshowMaskAmplify < 100) return;
      MyshowMaskAmplify /= 1.2
       let w1 = Number(MyshowMaskImg.offsetWidth);
       let h1 = Number(MyshowMaskImg.offsetHeight);
       let w2 = w1/1.2;
       let h2 = h1/1.2;
       iocSetImg(w2,w1,h2,h1)
     })
    }
    // left旋转图标
    if(domListECssArr.indexOf('my-show-mask-box-rotate-left') > -1){
     domListE.addEventListener('click',function(){
       MyshowMaskRotate = MyshowMaskRotate === 0? 270 : MyshowMaskRotate - 90 ;
       MyshowMaskImg.style.transform = `rotate(${MyshowMaskRotate}deg)`;
     })
    }
    // right旋转图标
    if(domListECssArr.indexOf('my-show-mask-box-rotate-right') > -1){
     domListE.addEventListener('click',function(){
       MyshowMaskRotate = MyshowMaskRotate === 360 ? 90 : MyshowMaskRotate + 90;
       MyshowMaskImg.style.transform = `rotate(${MyshowMaskRotate}deg)`;
     })
    }
   })
  }

  if(cssArr.indexOf('my-show-mask-switch-right') > -1){
   e.addEventListener('click',function(myShowMaskBox){
     myShowMaskBox.stopPropagation()  // 阻止事件冒泡
     MyshowMaskMyindex = MyshowMaskMyindex===(MyshowMaskMyurlLis.length-1)?0:MyshowMaskMyindex+1;
     initImg(MyshowMaskMyurlLis[MyshowMaskMyindex])
   })
  }
  if(cssArr.indexOf('my-show-mask-switch-left') > -1){
   e.addEventListener('click',function(myShowMaskBox){
     myShowMaskBox.stopPropagation()  // 阻止事件冒泡
     MyshowMaskMyindex = MyshowMaskMyindex===0?(MyshowMaskMyurlLis.length-1):MyshowMaskMyindex-1;
     initImg(MyshowMaskMyurlLis[MyshowMaskMyindex])
   })
  }
 })
}

// 滚轮缩放图片
function setImg(rect1,addType,e,type) {
  if(MyshowMaskRotate === 0 || MyshowMaskRotate === 180 || MyshowMaskRotate === 360){
   MyshowMaskAmplify = addType==='add'?MyshowMaskAmplify + (MyshowMaskAmplify * 0.2):MyshowMaskAmplify - (MyshowMaskAmplify * 0.2);
   MyshowMaskImg.style.width = MyshowMaskAmplify + 'px';
   // 放大后在获取一次图片信息
   let rect2 = MyshowMaskImg.getBoundingClientRect();
   // 不旋转公式一，不旋转: 位置的偏移 - ((放大后的图片宽度 - 放大前的宽度) * (当前鼠标位置 / 图片的总宽度))
   MyshowMaskImg.style.left = (rect2.left - ((rect2.width - rect1.width) * (e.clientX - rect1.left) / rect1.width)) + 'px';
   MyshowMaskImg.style.top = (rect2.top - ((rect2.height - rect1.height) * (e.clientY - rect1.top) / rect1.height)) + 'px';
  } else{
  if( type === 'large' ){
   // 放大
    MyshowMaskAmplify *= 1.2;
    let w1 = Number(MyshowMaskImg.offsetWidth);
    let h1 = Number(MyshowMaskImg.offsetHeight);
    // 计算出产生的宽度
    let w2 = w1*1.2;
    let h2 = h1*1.2;
    verticalScaling(w2,w1,h2,h1,e,type)
  } else{
   // 缩小
   if (MyshowMaskAmplify < 100) return;
    MyshowMaskAmplify /= 1.2
    let w1 = Number(MyshowMaskImg.offsetWidth);
    let h1 = Number(MyshowMaskImg.offsetHeight);
    let w2 = w1/1.2;
    let h2 = h1/1.2;
    verticalScaling(w2,w1,h2,h1,e)
  }
 }
}

// 图标缩放图片
let timerAmplify = null;
function iocSetImg(w2,w1,h2,h1) {
 MyshowMaskImg.style.transition = 'all .3s';
 MyshowMaskImg.style.width = `${(MyshowMaskAmplify)}px`;
 MyshowMaskImg.style.left = Number(MyshowMaskImg.style.left.replaceAll('px',''))-((w2-w1)*0.5) + 'px';
 MyshowMaskImg.style.top = Number(MyshowMaskImg.style.top.replaceAll('px',''))-((h2-h1)*0.5) + 'px';
 clearTimeout(timerAmplify)
 timerAmplify = setTimeout(() => {
  MyshowMaskImg.style.transition = 'none';
 }, 300);
}
// 竖向缩放
function verticalScaling(w2,w1,h2,h1,e,t) {
 let h = Number(e.target.offsetHeight); // 放大缩小前的高度
 let w = Number(e.target.offsetWidth); // 放大缩小前的高度
 MyshowMaskImg.style.width = `${(MyshowMaskAmplify)}px`;
 let boxHeight = e.target.offsetHeight;  // 放大缩小后的高度
 let boxWidth = e.target.offsetWidth;    // 放大缩小后的宽度
 let left = Number(MyshowMaskImg.style.left.replaceAll('px','')); //  当前的box的left值
 let top = Number(MyshowMaskImg.style.top.replaceAll('px',''));   // 当前的box的top值


  // x轴 percentageLeft
  // 需要先计算出正确的鼠标位置，鼠标位置需要先根据 正放的形状来计算
  // 正确的鼠标位置 ： 计算
  // 对于横向计算： 需要知道多余的部分是剩余隐藏起来的部分，无法计算到，但是需要吧横向的宽度算出来：
  // 隐藏的部分多余 等于高的一般进去宽的一半，需要模拟出鼠标位置
  // 先算横着的位置：  当前鼠标位置等于 隐藏的部分 加上 当前鼠标位置距离右边的位置
  let  percentageLeft,percentageTop;
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
  
  if(MyshowMaskRotate != 90 ){
   percentageLeft = (e.offsetY + (boxWidth / 2 - boxHeight/2)) / w;
   percentageTop = ((boxWidth - e.offsetX) + (boxHeight/2 - boxWidth/2)) / h;
  } else{
   // 需要把基本位置重置  计算位置在左下角 为 x：0 y：0
   let y = boxHeight-e.offsetY
   let x = boxWidth-e.offsetX
   percentageLeft = (y + (boxWidth/2 - boxHeight/2)) / w;
   percentageTop = ((boxWidth - x) + (boxHeight/2 - boxWidth/2)) / h;
  }


  MyshowMaskImg.style.left = left - ((w2-w1) * (percentageLeft)) + 'px';
  MyshowMaskImg.style.top = top - ((h2-h1) * (percentageTop)) + 'px';
}


function divRemove(){
 // 清除防止滚动
 window.removeEventListener('wheel', preventScroll)
 MyshowMaskDiv.remove()
}

// 生成图片
function initImg(url){
 MyshowMaskAmplify = 10;
 MyshowMaskRotate = 0;
 MyshowMaskSetCursorTimer = null;
 let myShowMaskImg = document.getElementById('my-show-mask-img')
 if(myShowMaskImg){
  myShowMaskImg.remove()
 }
 MyshowMaskImg = document.createElement('img');
 MyshowMaskImg.src = url
 MyshowMaskImg.id = 'my-show-mask-img'
 MyshowMaskImg.addEventListener('load', function (params) {
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
  // 图片拖拽
  MyshowMaskImg.addEventListener('mousedown', function (e) {
   if(MyshowMaskSetCursorTimer){
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
  // 添加滚轮放大缩小
  MyshowMaskImg.addEventListener('wheel', function (e) {
   // 获取图片信息
   let rect1 = MyshowMaskImg.getBoundingClientRect();
   if (e.deltaY < 0) {
    // 放大宽度，并且定位指定的位置
    setImg(rect1,'add',e,'large')
    clearTimeout(MyshowMaskSetCursorTimer)
    MyshowMaskImg.style.cursor = 'zoom-in'
    MyshowMaskSetCursorTimer = setTimeout(()=>{
     MyshowMaskImg.style.cursor = 'grab'
    },500)
   }
   if (e.deltaY > 0) {
    if (MyshowMaskAmplify < 100) return;
    // 缩小
    setImg(rect1,'reduce',e,'small')
    MyshowMaskImg.style.cursor = 'zoom-out'
    clearTimeout(MyshowMaskSetCursorTimer)
    MyshowMaskSetCursorTimer = setTimeout(()=>{
     MyshowMaskImg.style.cursor = 'grab'
    },500)
   }
   // 清除浏览器默认行为，---可能会造成滚动页面 
   e.preventDefault();
  })
 })
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
     padding-top: 5px;
    }
    .my-show-mask-box>.my-show-mask-box-amplify{
     padding-top: 5px;
    }
    .my-show-mask-box>.my-show-mask-box-rotate-left{
     border-radius: 50%;
     position: relative;
     width: 20px;
     height: 20px;
     border: 2px solid #fff;
    }
    .my-show-mask-box>.my-show-mask-box-rotate-left::after{
     content: '';
     position: absolute;
     z-index: 2;
     transform: rotate(65deg);
     left: -3px;
     top: -1px;
     border-right: 2px solid #fff;
     width: 5px;
     height: 5px;
     border-bottom: 2px solid #fff;
    }
    .my-show-mask-box>.my-show-mask-box-rotate-left::before{
     content: '';
     position: absolute;
     width: 12px;
     height: 7px;
     top: 5px;
     left: -6px;
     background-color: #606266;
    }

    .my-show-mask-box>.my-show-mask-box-rotate-right{
     border-radius: 50%;
     position: relative;
     width: 20px;
     height: 20px;
     border: 2px solid #fff;
    }
    .my-show-mask-box>.my-show-mask-box-rotate-right::after{
     content: '';
     position: absolute;
     z-index: 2;
     transform: rotate(19deg);
     right: -3px;
     top: 0px;
     border-right: 2px solid #fff;
     width: 5px;
     height: 5px;
     border-bottom: 2px solid #fff;
    }
    .my-show-mask-box>.my-show-mask-box-rotate-right::before{
     content: '';
     position: absolute;
     width: 12px;
     height: 7px;
     top: 5px;
     right: -6px;
     background-color: #606266;
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

   <div class="my-show-mask-box-reduce">
    <svg width="23" height="23" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" stroke="white" fill="none" stroke-width="2" />
      <line x1="6" y1="10" x2="14" y2="10" stroke="white" stroke-width="2" />
      <line x1="16" y1="17" x2="20" y2="20" stroke="white" stroke-width="2" />
    </svg>
   </div>
   <div class='my-show-mask-box-rotate-left'>
   </div>
   <div class='my-show-mask-box-rotate-right'>
   </div>
  </div>
 `
 )
}

// 防止滚动
function preventScroll(e) {
  e.preventDefault()
}
function geyAllDomMaxZindex(){
 // 获取页面上所有元素
var allElements = document.querySelectorAll('*');
// 初始化最高z-index值为一个较小的负数
var highestZIndex = -1;
// 遍历所有元素
allElements.forEach(function(element) {
  // 获取当前元素的z-index属性
  var zIndex = window.getComputedStyle(element).getPropertyValue('z-index');
  // 将z-index属性的值转换为整数
  zIndex = parseInt(zIndex, 10);
  // 检查z-index是否有效且比当前最高值高
  if (!isNaN(zIndex) && zIndex > highestZIndex) {
    highestZIndex = zIndex;
  }
});
return highestZIndex
}