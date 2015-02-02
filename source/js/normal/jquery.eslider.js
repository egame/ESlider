/*
 * jQuery EgameSlider v1.0.0
 * Contributing Author: cowboy13
 */
;
(function($){
    //jquery缓动动画扩展
    jQuery.extend( jQuery.easing, { def: 'easeOutQuad', easeOutQuad: function (x, t, b, c, d) { return -c *(t/=d)*(t-2) + b; } });
    $.eslider = function(el, options) {
        var slider = $(el);
        slider.opts = $.extend({}, $.eslider.defaults, options);    
        //图片显示框
        slider.conBox = slider.find(slider.opts.conBox);
        //图片滚动框
        slider.conInner = $('<div style="position:absolute;"></div>');
        //图片列表
        slider.cons = slider.conBox.find(slider.opts.conItem);
        //len:图片个数
        //curI当前索引值
        //unitW、unitH显示框宽高,unitPx滚动的单位像素
        //delayTime 延迟触发时间
        //isMoving  是否在动画中
        slider.len = slider.cons.length;
        slider.curI = 0;
        slider.unitW = slider.conBox.width();
        slider.unitH = slider.conBox.height();
        slider.unitPx = slider.unitW;
        slider.isMoving = false;
        slider.titleArr = [];
        var scrollString = 0;

        slider.recircle = function(px) {
            if (slider.opts.type == "h") {
                slider.conInner.css({left: px});
            }else if (slider.opts.type == "v") {
                slider.conInner.css({top: px});
            }
        };
        slider.go2next = function() {
            var i = slider.curI + 1;
            if (i >= slider.len) {
                i = 0;
                slider.opts.animationLoop && slider.recircle(0);
            }
            slider.go2con(i);
        };
        slider.go2pre = function () {
            var i = slider.curI - 1;
            if (i < 0) {
                i = slider.len - 1;
                slider.opts.animationLoop && slider.recircle(-(slider.len+1)*slider.unitPx);
            }
            slider.go2con(i);
        };
        slider.go2con = function(index){
            if (!!slider.opts.before) {
                slider.opts.before(slider.curI, slider);
            }
            if (slider.opts.type == 'h' || slider.opts.type == 'v') {
                slider.isMoving = true;
               scrollString = !slider.opts.animationLoop ?  -(index * slider.unitPx) : -(index * slider.unitPx) - slider.unitPx;
            }
            switch(slider.opts.type) {
                case 'h':
                    slider.conInner.stop().animate({left: scrollString + "px"}, slider.opts.speed, slider.opts.easing, function() {
                        slider.isMoving = false;
                    });
                break;
                case 'v':
                    slider.conInner.stop().animate({top: scrollString + "px"}, slider.opts.speed, slider.opts.easing, function() {
                        slider.isMoving = false;
                    });
                break;
                case 'a':
                    if (slider.curI == index) return;
                    slider.cons.stop().hide().eq(index).fadeIn(slider.opts.speed);
                    slider.cons.eq(slider.curI).show().fadeOut(slider.opts.speed);
                break;
                case 'n':
                    slider.cons.hide().eq(index).show();
                break;
                default:
            }
            slider.tabs.removeClass(slider.opts.tabOnClass).eq(index).addClass(slider.opts.tabOnClass);
            if (!slider.opts.hideTitleBar) {
                slider.title.html(slider.titleArr[index]);
            }
            slider.curI = index;
            if (!!slider.opts.after) {
                slider.opts.after(slider.curI, slider);
            }
        };
        slider.pause = function () {
            clearInterval(slider.autoTimer);
            slider.autoTimer = null;
        };
        slider.play = function() {
            !!slider.autoTimer && clearInterval(slider.autoTimer);
            slider.autoTimer = slider.autoTimer || setInterval(function(){
                slider.go2next();
            }, slider.opts.time);
        };
        slider.init = function() {
            //初始化dom操作
            if (!slider.opts.hideTitleBar) {
                slider.cons.each(function() {
                    slider.titleArr.push($(this).find('img').attr('title'));
                });
                slider.tips = $('<div class="'+slider.opts.namespace+'_tips_con"><div class="'+slider.opts.namespace+'_tips_bg"></div></div>').appendTo(slider);
                slider.title = $('<div class="'+slider.opts.namespace+'_tips_tt">'+slider.titleArr[slider.curI]+'</div>').appendTo(slider.tips);
            }
            slider.tab = $('<div class="'+slider.opts.namespace+'_tab_nav"></div>').appendTo(slider);
            for (var i = 0; i < slider.len; i++) {
                (function(_i) {
                    var JtabItem =  $('<span class="'+slider.opts.namespace+'_tab_item"></span>');
                    if (slider.opts.ev == 'mouseover') {
                        //延迟触发
                        JtabItem.hover(function() {
                            slider.delayTime = setTimeout(function() {
                                slider.go2con(_i);
                            },slider.opts.hoverDelay);
                        },function() {
                            clearTimeout(slider.delayTime);
                            slider.delayTime = null;
                        }).appendTo(slider.tab);
                    }else{
                        JtabItem.bind(slider.opts.ev, function() {
                            slider.go2con(_i);
                        }).appendTo(slider.tab);
                    }
                })(i);
            }
            slider.tabs = slider.tab.find('.'+slider.opts.namespace+'_tab_item');
            slider.tabs.eq(slider.curI).addClass(slider.opts.tabOnClass);
            slider.preBtn = $('<a href="javascript:;" class="'+slider.opts.namespace+'_btn_pre">上一张</a>').click(function(){
                !slider.isMoving && slider.go2pre();
            }).hide().appendTo(slider);
            slider.nextBtn = $('<a href="javascript:;" class="'+slider.opts.namespace+'_btn_next">下一张</a>').click(function(){
                !slider.isMoving && slider.go2next();
            }).hide().appendTo(slider);
            if(slider.opts.showBtn == 1){
                slider.hover(function() {
                    slider.preBtn.show();
                    slider.nextBtn.show();
                },function() {
                    slider.preBtn.hide();
                    slider.nextBtn.hide();
                });
            }else if(slider.opts.showBtn == 2){
                slider.preBtn.show();
                slider.nextBtn.show();
            }
            slider.opts.type == 'v' && (slider.unitPx = slider.unitH);
            if (slider.opts.type == "h" || slider.opts.type == "v") {
                slider.conInner.append(slider.cons);
                if (slider.opts.animationLoop) {
                    slider.conInner.append(slider.cons).append(slider.cons.eq(0).clone()).prepend(slider.cons.eq(slider.len-1).clone());
                }
                slider.conBox.append(slider.conInner);
                slider.cons = slider.conInner.find(slider.opts.conItem);
                slider.cons.css({width: slider.unitW + "px", height: slider.unitH + "px", overflow: "hidden"});
            }
            if (slider.opts.type == "h") {
                if (!slider.opts.animationLoop) {
                    slider.conInner.css({left:0 + "px", width: slider.len * slider.unitW + "px", height: slider.unitH + "px"});
                }else{
                    slider.conInner.css({left:-slider.unitW + "px", width: (slider.len+2) * slider.unitW + "px", height: slider.unitH + "px"});
                }
            }else if (slider.opts.type == "v") {
                if (!slider.opts.animationLoop) {
                    slider.conInner.css({top:0 + "px"});
                }else{
                    slider.conInner.css({top:-slider.unitH + "px"});
                }
                
            }else if(slider.opts.type == "a"){
                slider.cons.css({position: "absolute"}).hide().eq(slider.curI).show();
            }

            //自动轮播处理
            if (slider.opts.auto) {
                slider.hover(function(){
                    slider.pause();
                }, function(){
                    slider.play();
                });
                slider.play();
            }
        };
        slider.init();
        //对外提供接口
        return {
            go2con: slider.go2con,
            go2next: slider.go2next,
            go2pre: slider.go2pre
        }
    };
    // 默认参数
    $.eslider.defaults = {    
        //命名空间
        namespace: 'es',
        //内容包裹元素选择器
        conBox: '.fn_con',
        //内容元素选择器 [内容元素不能与其它元素混合处于同一父元素内]
        conItem: '.fn_con_item',
        //tab选中样式名
        tabOnClass: 'es_tab_item_on',
        //切换类型v(纵向)\h(横向)\a(透明度)\n(无效果)
        type: 'h',
        //boolean：是否循环展示，仅横向、纵向滚动有用
        animationLoop: true,
        //触发事件
        ev: 'mouseover',
        //boolean：隐藏标题栏
        hideTitleBar: false,
        //前进\后退按钮显示方式  1[自动隐藏]，2[始终显示]，3[始终隐藏]
        showBtn: 1,
        //延迟触发时长，事件为mouseover时启用，防止切换按钮误触
        hoverDelay: 50,
        //boolean：是否自动切换 true\false
        auto: true,
        //动画速度
        speed: 500,
        //切换时间
        time: 4000,
        //切换缓动效果 swing,linear,easeOutQuad
        easing : 'easeOutQuad',
        //跳转到对应图片前调用，返回当前索引值及顶级包裹元素对象
        before: null,
        //跳转到对应图片后回调，返回当前索引值及顶级包裹元素对象
        after: null
    };     
    $.fn.eslider = function(options) {
        var selector = options && options.conItem ? options.conItem : $.eslider.defaults.conItem;
        var Jcons = this.find(selector);
        if (Jcons.length > 1 ) {
           return new $.eslider(this, options);
        }
    };
})(jQuery)

