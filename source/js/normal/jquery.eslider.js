/*
 * jQuery EgameSlider v1.0.0
 * Contributing Author: cowboy13
 */
;
(function($){
    //jquery缓动动画扩展
    jQuery.extend( jQuery.easing, {
        def: 'easeOutQuad',
        easeOutQuad: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        }
    });
    $.fn.eslider = function(options) {    
        this.each(function() {
            var opts = $.extend({}, $.fn.eslider.defaults, options);    
            var Jcon = $(this),
            //图片索引状态按钮
            Jtabs = Jcon.find(opts.tabBox).find(opts.tabItem),
            //图片显示框
            JconBox = Jcon.find(opts.conBox),
            //图片滚动框
            JconInner = $('<div style="position:absolute;"></div>'),
            //图片列表
            Jcons = JconBox.find(opts.conItem),
            //上一页
            JpreBtn = Jcon.find(opts.btnPre),
            //下一页
            JnextBtn = Jcon.find(opts.btnNext),
            //len:图片个数
            //nlen:克隆首尾图片后个数，用于循环展示
            //curI当前索引值
            //unitW、unitH显示框宽高
            //delayTime 延迟触发时间
            //isMoving  是否在动画中
            len = Jcons.length, nlen = len + 2, curI = 0, unitW = JconBox.width(), unitH = JconBox.height();
            var go2con = null, timer = null, delayTime = null, isMoving = false;

            //初始化dom操作
            JconInner.append(Jcons);
            if (opts.type == "h" || opts.type == "v") {
                JconInner.append(Jcons.eq(0).clone());
                JconInner.prepend(Jcons.eq(len-1).clone());
            }
            JconBox.append(JconInner);
            Jcons = JconInner.find(opts.conItem);

            Jcons.css({width: unitW + "px", height: unitH + "px", overflow: "hidden"});
            if (opts.type == "h") {
                JconInner.css({left:-unitW + "px", width: nlen * unitW + "px", height: unitH + "px"});
            }else if (opts.type == "v") {
                JconInner.css({top:-unitH + "px"});
            }else if(opts.type == "a"){
                Jcons.css({position: "absolute"}).hide().eq(curI).show();
            }

            function go2next () {
                var i = curI + 1;
                if (i >= len) {
                    i = 0;
                    if (opts.type == "h") {
                        JconInner.css({left: 0});
                    }else if (opts.type == "v") {
                        JconInner.css({top: 0});
                    }
                }
                go2con(i);
            }
            function go2pre () {
                var i = curI - 1;
                if (i < 0) {
                    i = len - 1;
                    if (opts.type == "h") {
                        JconInner.css({left: -(len+1)*unitW});
                    }else if (opts.type == "v") {
                        JconInner.css({top: -(len+1)*unitH});
                    }
                }
                go2con(i);
            }

            go2con = function(index){
                switch(opts.type) {
                    case 'h':
                        isMoving = true;
                        var l = - (index * unitW) - unitW;
                        JconInner.stop().animate({left: l + "px"}, opts.speed, opts.easing, function() {
                            isMoving = false;
                        });
                    break;
                    case 'v':
                        isMoving = true;
                        var l = - (index * unitH) - unitH;
                        JconInner.stop().animate({top: l + "px"}, opts.speed, opts.easing, function() {
                            isMoving = false;
                        });
                    break;
                    case 'a':
                        if (curI == index) {
                            return;
                        }
                        Jcons.stop().hide().eq(index).fadeIn(opts.speed);
                        Jcons.eq(curI).show().fadeOut(opts.speed);
                    break;
                    case 'n':
                        Jcons.hide().eq(index).show();
                    break;
                    default:
                        isMoving = true;
                        var l = - (index * unitW) - unitW;
                        JconInner.stop().animate({left: l + "px"}, opts.speed, opts.easing, function() {
                            isMoving = false;
                        });
                }
                Jtabs.removeClass(opts.tabOnClass).eq(index).addClass(opts.tabOnClass);
                curI = index;

                if (!!opts.callback) {
                    opts.callback(index, Jcon);
                }
            };

            if (opts.ev == 'mouseover') {
                //延迟触发
                Jtabs.hover(function(){
                    var i = $(this).index();
                    clearTimeout(delayTime);
                    delayTime = null;
                    delayTime = setTimeout(function() {
                        go2con(i);
                    },opts.hoverDelay);
                },function() {
                    clearTimeout(delayTime);
                    delayTime = null;
                });
            }else{
                Jtabs.bind(opts.ev, function(){
                    var Jme = $(this), i = Jme.index();
                    go2con(i);
                });
            }

            JpreBtn.click(function(){
                if (!isMoving) {
                    go2pre();
                }
            });
            JnextBtn.click(function(){
                if (!isMoving) {
                    go2next();
                }
            });

            if (opts.auto) {
                Jcon.bind("mouseover", function(){
                    clearInterval(timer);
                    timer = null;
                }).bind("mouseout", function(){
                    clearInterval(timer);
                    timer = null;
                    timer = setInterval(function(){
                        go2next();
                    }, opts.time);
                }).trigger("mouseout");
            }
        });

    };    
    // 默认参数
    $.fn.eslider.defaults = {    
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
        callback: null
    };     
    //这个只需要调用一次，且不一定要在ready块中调用  
    $.fn.eslider.defaults.foreground = 'blue';    

})(jQuery)

