# ESlider 1.0.0
https://github.com/egame/ESlider 

## 简介
* 基于jquery的图片轮播组件
* 不做大而全，只做网站最最常用的几组效果
* 自定义性强，对html结构要求不高
* 提供回调函数方便扩充特殊需求
* 高度可配置

## 使用
还用我教么？代码注释够多了，下载下来就用吧，so easy！

附上初始化代码：
```js 
$('#sliderBanner1').eslider({
    //按钮包裹元素
    tabBox: ".fn_tab_nav",
    //按钮元素
    tabItem: ".fn_tab_item",
    //上一页
    btnPre: ".fn_pre",
    //下一页
    btnNext: ".fn_next",
    //内容包裹元素
    conBox: ".fn_con",
    //内容元素
    conItem: ".fn_con_item",
    //tab选中样式名
    tabOnClass: "on",
    //切换类型v(纵向)\h(横向)\a(透明度)\n(无效果)
    type: "h",
    //触发事件
    ev: "mouseover",
    //是否自动切换 true\false
    auto: true,
    //动画速度
    speed: 500,
    //切换时间
    time: 4000,
    //切换动画效果
    easing : 'easeOutQuad',//swing,linear,easeOutQuad
    //跳转到对应图片后回调，返回当前索引值及顶级包裹元素对象
    callback: function(index, obj){
        //console.log(index);
    }
});   
```
## 一句话
好用好用真好用。。。。

