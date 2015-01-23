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
            $.fn.eslider.init($(this), options);
        });
    };    
    // 默认参数
    $.fn.eslider.defaults = {    
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
        callback: null
    };     
    $.fn.eslider.init = function(Jobj, options) {
        var opts = $.extend({}, $.fn.eslider.defaults, options);    
        var Jcon = Jobj,
        //图片显示框
        JconBox = Jcon.find(opts.conBox),
        //图片滚动框
        JconInner = $('<div style="position:absolute;"></div>'),
        //图片列表
        Jcons = JconBox.find(opts.conItem),
        JpreBtn = null,
        JnextBtn = null,
        //len:图片个数
        //nlen:克隆首尾图片后个数，用于循环展示
        //curI当前索引值
        //unitW、unitH显示框宽高
        //delayTime 延迟触发时间
        //isMoving  是否在动画中
        len = Jcons.length, nlen = len + 2, curI = 0, unitW = JconBox.width(), unitH = JconBox.height();
        var timer = null, delayTime = null, isMoving = false, titleArr = [];

        Jcons.each(function() {
            titleArr.push($(this).find('img').attr('title'));
        });

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
        function go2con(index){
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

            Jtab.find('.tab_item').removeClass(opts.tabOnClass).eq(index).addClass(opts.tabOnClass);
            if (!opts.hideTitleBar) {
                Jtitle.html(titleArr[index]);
            }

            curI = index;

            if (!!opts.callback) {
                opts.callback(index, Jcon);
            }
        };

        //初始化dom操作
        if (!opts.hideTitleBar) {
            var Jtips = $('<div class="tips_con"><div class="tips_bg"></div></div>').appendTo(Jcon);
            var Jtitle = $('<div class="tips_tt">'+titleArr[curI]+'</div>').appendTo(Jtips);
        }
        var Jtab = $('<ul class="tab_nav"></ul>').appendTo(Jcon);
        for (var i = 0; i < len; i++) {
            (function(_i) {
                if (opts.ev == 'mouseover') {
                    //延迟触发
                    $('<li class="tab_item"></li>').hover(function() {
                        clearTimeout(delayTime);
                        delayTime = null;
                        delayTime = setTimeout(function() {
                            go2con(_i);
                        },opts.hoverDelay);
                    },function() {
                        clearTimeout(delayTime);
                        delayTime = null;
                    }).appendTo(Jtab);
                }else{
                    $('<li class="tab_item"></li>').bind(opts.ev, function() {
                        go2con(_i);
                    }).appendTo(Jtab);
                }
            })(i);
        }
        Jtab.find('.tab_item').eq(curI).addClass(opts.tabOnClass);
        if(!opts.hideBtn){
            JpreBtn = $('<a href="javascript:;" class="btn_pre">上一张</a>').click(function(){
                if (!isMoving) {
                    go2pre();
                }
            }).hide().appendTo(Jcon);
            JnextBtn = $('<a href="javascript:;" class="btn_next">下一张</a>').click(function(){
                if (!isMoving) {
                    go2next();
                }
            }).hide().appendTo(Jcon);
            Jcon.hover(function() {
                JpreBtn.show();
                JnextBtn.show();
            },function() {
                JpreBtn.hide();
                JnextBtn.hide();
            });
        }
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

        //自动轮播处理
        if (opts.auto) {
            Jcon.hover(function(){
                clearInterval(timer);
                timer = null;
            }, function(){
                clearInterval(timer);
                timer = null;
                timer = setInterval(function(){
                    go2next();
                }, opts.time);
            }).trigger("mouseout");
        }
    };
})(jQuery)

