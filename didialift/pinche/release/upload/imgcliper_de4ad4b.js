define('upload/imgcliper.js', function(require, exports, module){

/**
*
* 图片裁剪类
* zhangnan03
*/

var ClipPinchZoom = require('upload/clippinchzoom.js');
var ImgCliper = module.exports = function(opt) {
    var rawData = opt.rawData,
        onSave = opt.onSave;
    this.rawData = rawData;
    this.onSave = onSave;
    this.onCancel = opt.onCancel || function(){};
    this.opt = $.extend({},imgCliperDefaultOpt, opt);
    var $photo = this.setup(rawData);
    var use2d = !checkTransform3dSupport();
    this.pinchZoom = new ClipPinchZoom($photo, {
        imgWidth: opt.originWidth,
        imgHeight: opt.originHeight,
        imgCliper: this,
        use2d: use2d
    });
};

var imgCliperDefaultOpt = {
    //按钮区高度
    barHeight: 70,
    //取消按钮文案
    cancel: '取消',
    //确定按钮文案
    confirm: '确定',
    // 1左取消右确定，-1则左确定右取消
    btnOrder: 1,
    //裁剪区宽度
    clipWidth: 500,
    //裁剪区高度
    clipHeight: 500
};
function checkTransform3dSupport() {
    function getAndroidVersion(ua) {
        ua = (ua || navigator.userAgent).toLowerCase(); 
        var match = ua.match(/android\s([0-9\.]*)/);
        return match ? match[1] : false;
    };
    var intAndroidVersion = getAndroidVersion();
    intAndroidVersion = intAndroidVersion && intAndroidVersion.slice(0,3);
    // 大于等于ios7的都使用3d
    var iOS = navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/)
        || navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/);
    var intIOSVersion = iOS && iOS[2].split('_')[0];
    // iOS大于等于7 Android大于等于4.0
    var userSupport = intIOSVersion >= 7 || intAndroidVersion > 4;
    var ua = navigator.userAgent;
    if( ua.indexOf('MQQBrowser/3.4') === 0 
        || ua.indexOf( 'Android 2.3.6' ) > -1
        ){
        userSupport = false;
    }
    var div =  document.createElement('DIV');
    div.style['-webkit-transform'] = '';
    div.style['-webkit-transform'] = 'rotateY(90deg)';
    return div.style['-webkit-transform'] !== '' && userSupport;
}
//创建元素并给予初始化样式
var createEL = function(style, tagNmae) {
    var $el = document.createElement(tagNmae || 'DIV');
    $el.style.cssText = style.join(';');
    return $el;
}
ImgCliper.prototype = {


    getViewportRect: function(){
        var me = this;
        // 确定屏幕方向， 竖屏 dirct < 1
        var direct = innerWidth / innerHeight;
        // 剪裁区宽高比(width : height)
        var viewportAspectRatio = me.opt.clipWidth / me.opt.clipHeight;
        // 剪裁区宽度
        var viewportWidth;
        if(direct < 1){
            viewportWidth = direct < viewportAspectRatio 
            ? innerWidth 
            : innerHeight * viewportAspectRatio;
        }else{
            viewportWidth = direct > viewportAspectRatio 
            ? innerHeight * viewportAspectRatio
            : innerWidth;
        }
        // 剪裁区高度
        var viewportHeight = viewportWidth / viewportAspectRatio;

         
        return {
            w: viewportWidth,
            h : viewportHeight,
            x: (innerWidth -  viewportWidth) / 2,
            y: (innerHeight -  viewportHeight) / 2
        }
    },

    //初始化裁剪页面
    setup: function(data) {
        var me = this;
        //clip-container
        var $container = createEL(
            [
                'position: absolute',
                'background-color: rgba(0,0,0,1)',
                'left:0',
                'top:0',
                'z-index: 9998',
                'overflow: hidden'
            ]
        );
        $container.id = 'container' + ~~(Math.random() * 1E6)
        // maskTop
        var $maskTop = createEL(
            [
                'position: absolute',
                'z-index: 1',
                'background-color: rgba(0,0,0,.5)',
                'pointer-events: none',
            ]
        );
        $maskTop.id = 'maskTop' + ~~(Math.random() * 1E6)
        // maskbottom
        var $maskbottom = createEL(
            [
                'position: absolute',
                'z-index: 1',
                'background-color: rgba(0,0,0,.5)',
                'pointer-events: none'
            ]
        );

        $maskbottom.id = 'maskbottom' + ~~(Math.random() * 1E6)

        // Square Viewport
        var $viewport = createEL(
            [
                'position: absolute',
                'z-index: 1',
                'box-sizing: border-box',
                '-webkit-box-sizing: border-box',
                'width: ' + Math.min(innerWidth, innerHeight) + 'px',
                'height: ' + Math.min(innerWidth, innerHeight) + 'px',
                'border: 1px solid #fff',
                'background-color: transparent',
                'pointer-events: none'
            ]
        );
        $viewport.id = 'viewport' + ~~(Math.random() * 1E6)
        // Photo Image
        var $photo = createEL(
            [
                '-webkit-user-drag: none',
                'z-index: 0',
                '-webkit-tap-highlight-color: rgba(0,0,0,0)',
                'position: absolute'
            ],
            'IMG'
        );
        $photo.id = 'photo' + ~~(Math.random() * 1E6)
        var $photoFrame = createEL(
            [
                '-webkit-user-drag: none',
                'position: absolute',
                'text-align: center',
                'z-index: 0;',
                // 'background-color: red;',
            ]
        );
        // Photo Frame
        $photoFrame.id = 'photoFrame' + ~~(Math.random() * 1E6)
        $photo.src = data;
        // Cancel Buttom
        var $rightBtn = createEL(
            [
                'text-align: center',
                'color: white',
                'display: inline-block',
                'font-weight: bold',
                'line-height : ' + me.opt.barHeight + 'px',
                'font-size: 1.8rem'
            ]
        );
        // Confirm Buttom
        var $leftBtn = createEL(
            [
                'text-align: center',
                'color: white',
                'display: inline-block',
                'font-weight: bold',
                'font-size: 1.8rem',
                'line-height :' + me.opt.barHeight + 'px'
            ]
        );
        // Bottom Bar
        var $bar = createEL(
            [
                'background-color: rgba(0,0,0,0.6)',
                'position: absolute',
                'right: 0',
                'bottom: 0',
                'z-index: 1'
            ]
        );
        var onResize = function() {
            // 确定屏幕方向， 竖屏 dirct < 1
            var direct = innerWidth / innerHeight;
            var viewportRect = me.getViewportRect();
            var viewportWidth = viewportRect.w;
            var viewportHeight = viewportRect.h;


            // 最外层框体位置
            $container.style.top = pageYOffset + 'px';
            $container.style.left = pageXOffset + 'px';
            $photoFrame.style.width = $container.style.width = innerWidth + 'px';
            $photoFrame.style.lineHeight = $photoFrame.style.height = $container.style.height = innerHeight + 'px';

            // 剪裁区位置
            $viewport.style.left = viewportRect.x + 'px';
            $viewport.style.top = viewportRect.y + 'px';
            $viewport.style.height = viewportHeight + 'px';
            $viewport.style.width = viewportWidth + 'px';

            //遮罩位置
            $maskTop.style.height =
            $maskbottom.style.height = (viewportWidth === innerWidth ? (innerHeight - viewportHeight) / 2  : viewportHeight) + 'px' 
            $maskTop.style.width = 
            $maskbottom.style.width = (viewportWidth === innerWidth ? viewportWidth : (innerWidth - viewportWidth) / 2 )+ 'px' 
            $maskTop.style.left = 0;
            $maskTop.style.top = 0;
            $maskbottom.style.bottom = 0;
            $maskbottom.style.right = 0;


       
            $photo.style[direct < 1 ? 'width' : 'height'] = '100%';
            $photo.style[direct < 1 ? 'height' : 'width'] = 'auto';
            $photo.style.left = direct < 1 ? '0' : (innerWidth - me.opt.originWidth / me.opt.originHeight * innerHeight) / 2 + 'px';
            $photo.style.top = direct < 1 ? (innerHeight - me.opt.originHeight / me.opt.originWidth * innerWidth) / 2 + 'px' : '0';


            $bar.style[direct < 1 ? 'height' : 'width'] = me.opt.barHeight + 'px';
            $bar.style[direct < 1 ? 'width' : 'height'] = (direct < 1 ? innerWidth : innerHeight) + 'px';
            $rightBtn.style[direct < 1 ? 'height' : 'width'] = $leftBtn.style[direct < 1 ? 'height' : 'width'] = me.opt.barHeight + 'px';
            $rightBtn.style[direct < 1 ? 'width' : 'height'] = $leftBtn.style[direct < 1 ? 'width' : 'height'] = (direct < 1 ? innerWidth : innerHeight) / 2 + 'px';
        }
        var onClickBar = function(e) {
            var $target = e.target.tagName ? e.target : e.target.parentNode;
            //confirm
            if ($target.id.indexOf('confirm') === 0) {
                me.clipSource();
                //cancel
            } else if ($target.id.indexOf('cancel') === 0) {
                me.onCancel();
                me.close();
            }
        }

        var cancelEvent = function(e) {
            e.preventDefault();
            e.stopPropagation();
        };
        onResize();
        var timer;
        function throttleResize(e){
            clearTimeout(timer);
            timer = setTimeout(onResize, 200);
        }






        //Insert To DOM Tree

        $photoFrame.appendChild($photo);
        $leftBtn.innerHTML = me.opt.btnOrder == 1 
            ? me.opt.cancel 
            : me.opt.confirm;
        $rightBtn.innerHTML = me.opt.btnOrder == 1 
            ? me.opt.confirm 
            : me.opt.cancel;
        $leftBtn.id = (me.opt.btnOrder === 1 ? 'cancel' : 'confirm') 
                        + ~~(Math.random() * 1E6);
        $rightBtn.id = (me.opt.btnOrder === 1 ? 'confirm' : 'cancel') 
                        + ~~(Math.random() * 1E6);
        $bar.appendChild($leftBtn);
        $bar.appendChild($rightBtn);
        $container.appendChild($maskTop);
        $container.appendChild($maskbottom);
        $container.appendChild($viewport);
        $container.appendChild($photoFrame);
        $container.appendChild($bar);
        document.body.appendChild($container);


        // Register Events
        $bar.addEventListener('click', onClickBar, false);
        window.addEventListener('resize', throttleResize, false);
        window.addEventListener('scroll', throttleResize, false);
        $container.addEventListener('touchmove', cancelEvent, false);


        // Hand Up To Me
        me.$photo = $photo;
        me.$viewport = $viewport;
        me.$container = $container;
        me.removeOut = function(){
            $container.parentNode.removeChild($container);
            $bar.removeEventListener('click', onClickBar ,false);
            window.removeEventListener('resize', throttleResize, false);
            window.removeEventListener('scroll', throttleResize, false);
        }
        return $photoFrame;
    },
    //裁剪资源
    clipSource: function() {
        var me = this;
        var scale = me.pinchZoom.zoomFactor;
        var photoOffset = $(me.$photo).offset();
        var viewportOffset = $(me.$viewport).offset();
        var offset = {
            x: (viewportOffset.left - photoOffset.left),
            y: (viewportOffset.top - photoOffset.top)
        }
        var clip = {
            w: me.opt.clipWidth, 
            h: me.opt.clipHeight,
        }
        var clipScale = me.opt.clipWidth / me.getViewportRect().w;
        offset.x *= clipScale;
        offset.y *= clipScale;
        var canvasEl = document.createElement('CANVAS');
        var cxt = canvasEl.getContext('2d');
        canvasEl.width = clip.w;
        canvasEl.height = clip.h;
        cxt.drawImage(me.$photo, -offset.x, -offset.y, me.$photo.width * scale * clipScale, me.$photo.height * scale * clipScale);
        if (me.opt.fileType === "image/png") {
            var srcData = canvasEl.toDataURL('image/png');
        } else {
            var srcData = canvasEl.toDataURL('image/jpeg');
        }
        me.onSave(srcData);
        // me.openImage(srcData); 

    },
    //打开裁剪好的图片
    openImage: function(src) {
        var newWin = window.open("about:blank", "runWindow");
        newWin.opener = null;
        newWin.document.open();
        newWin.document.write('<img src="' + src + '" />');
        newWin.document.close();
    },
    /*
    *
    * 废弃了
    *
    */
    show: function(opt) {
        if (opt) {
            var rawData = opt.rawData;
            if(rawData){
                this.rawData = rawData;
                this.$photo.src = opt.rawData;
            }
            if(opt.onSave){
                this.onSave = opt.onSave;
            }
            this.opt = $.extend({},imgCliperDefaultOpt, opt);
            this.pinchZoom.offset = {x:0,y:0};
            this.pinchZoom.zoomFactor = 1;
        }
        this.$container.style.display = 'block';
    },
    close: function() {
        this.$container.style.display = 'none';
        this.destroy();
    },
    destroy: function() {
        this.removeOut();
        // this.pinchZoom.destroy();
        for (var p in this) {
            if (this.hasOwnProperty(p)) {
                delete this[p];
            }
        }
        this.destroy = function() {};
    }
}

});