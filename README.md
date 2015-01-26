# ESlider 1.0.0
https://github.com/egame/ESlider 

## 简介
* 基于jquery的图片轮播组件
* 不做大而全，只做网站最最常用的几组效果
* 提供回调函数方便扩充特殊需求
* 高度可配置

## 使用
还用我教么？代码注释够多了，下载下来就用吧，so easy！

附上初始化代码：
```js 
$('#sliderBanner1').eslider({
    //内容包裹元素选择器
    conBox: ".fn_con",
    //内容元素选择器
    conItem: ".fn_con_item",
    //tab选中样式名
    tabOnClass: "on",
    //切换类型v(纵向)\h(横向)\a(透明度)\n(无效果)
    type: "h",
    //触发事件
    ev: "mouseover",
    //隐藏标题栏
    hideTitleBar: false,
    //隐藏前进\后退按钮
    hideBtn: false,
    //延迟触发时长，事件为mouseover时启用，防止切换按钮误触
    hoverDelay: 50,
    //是否自动切换 true\false
    auto: true,
    //动画速度
    speed: 500,
    //切换时间
    time: 4000,
    //切换动画效果 swing,linear,easeOutQuad
    easing : 'easeOutQuad',
    //跳转到对应图片后回调，返回当前索引值及顶级包裹元素对象
    callback: function(index, obj){
        //console.log(index);
    }
});   
```
## 一句话
好用好用真好用。。。。。。





