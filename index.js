export function openMask(url) {
 // 创建元素
 var div = document.createElement('div');
 div.style.position = 'fixed';
 div.style.pointerEvents = 'auto';   // 点击事件的影响
 div.style.zIndex = geyAllDomMaxZindex()+'10';
 div.style.left = '0';
 div.style.right = '0';
 div.style.bottom = '0';
 div.style.top = '0';
 div.style.display = 'flex';
 div.style.display = 'flex';
 div.style.alignItems = 'center';
 div.style.justifyContent = 'center';
 div.style.backgroundColor = '#0000004a';
 window.addEventListener('wheel', preventScroll, {
  passive: false
 })
 var img = document.createElement('img');
 let amplify = 10;
 let imgw = 10;
 img.src = url
 img.addEventListener('load', function (params) {
  amplify = img.width;
  imgw = img.width;
  img.style.width = img.width + 'px';
  img.style.position = 'absolute';
  img.draggable = 'true';
  img.style.cursor = 'grab';
  div.appendChild(img)
  // 往body元素上追加
  document.body.appendChild(div);
  // 关闭遮罩
  div.addEventListener('click', function (e) {
   // 清除防止滚动
   window.removeEventListener('wheel', preventScroll)
   div.remove()
   e.stopPropagation()
  })
  // 防止事件冒泡
  img.addEventListener('click', function (e) {
   e.stopPropagation()
  })
  // 阻止默认拖拽行为
  img.addEventListener('dragstart', function (event) {
   event.preventDefault();
  });
  // 设置默认值 以便放大的时候根据放大的宽度计算位置
  img.style.top = img.offsetTop + 'px';
  img.style.left = img.offsetLeft + 'px';
  // 图片拖拽和放大
  img.addEventListener('mousedown', function (e) {
   img.style.cursor = 'grabbing';
   let x = e.pageX - img.offsetLeft;
   let y = e.pageY - img.offsetTop;
   window.onmousemove = function (e) {
    let cx = e.pageX - x;
    let cy = e.pageY - y;
    img.style.top = cy + 'px';
    img.style.left = cx + 'px';
   }
   window.onmouseup = function (e) {
    img.style.cursor = 'grab';
    window.onmousemove = null;
    window.onmouseup = null;
   }
  })
  // 添加滚轮放大缩小
  img.addEventListener('wheel', function (e) {
   // 获取图片信息
   let rect1 = img.getBoundingClientRect();
   if (e.deltaY < 0) {
    // 放大宽度，并且定位指定的位置
    amplify += (amplify * 0.2)
    img.style.width = amplify + 'px';
    // 放大后在获取一次图片信息
    let rect2 = img.getBoundingClientRect();
    // 公式: 位置的偏移 - ((放大后的图片宽度 - 放大前的宽度) * (当前鼠标位置 / 图片的总宽度))
    img.style.left = (rect2.left - ((rect2.width - rect1.width) * (e.clientX - rect1.left) / rect1.width)) + 'px';
    img.style.top = (rect2.top - ((rect2.height - rect1.height) * (e.clientY - rect1.top) / rect1.height)) + 'px';
   }
   if (e.deltaY > 0) {
    if (amplify < (imgw*0.8)) return;
    // 缩小
    amplify -= (amplify * 0.2)
    img.style.width = amplify + 'px';
    let rect2 = img.getBoundingClientRect();
    img.style.left = (rect2.left - ((rect2.width - rect1.width) * (e.clientX - rect1.left) / rect1.width)) + 'px';
    img.style.top = (rect2.top - ((rect2.height - rect1.height) * (e.clientY - rect1.top) / rect1.height)) + 'px';
   }
   // 清除浏览器默认行为，---可能会造成滚动页面 
   e.preventDefault();
  })
 })
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