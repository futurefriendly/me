/**
 * @fileOverview  刮奖(微信红包)m.leju.com\trunk\weixin\templates\v1.0\goldrush\index.html
 * @author zoulingling
 * @email lingling6@leju.com
 * @date 2014-05-06
 * @remarks
 * @demo  http://js.bch.eju.com/demo/h5guajiang/ggk.html
 */
/*******************************************/
/**
 * @fileOverview  刮奖重构
 * @author xiejiabin
 * @email jiabin1@leju.com
 * @date 2014-11-10
 * @remarks
 * @demo  http://m.bch.leju.com/resources/js/demo/paint/demo.html
 *
 * var Mask = require('paint/ScratchCard');
 * var mask = new Mask(options);
 * 参数options覆盖defaults值
 */
define(function(require, exports, module) {
    module.exports = ScratchCard;
    var $ = require('zepto');

    function ScratchCard(options) {
        var defaults = {
            container: null, //画布容器元素
            realResult: null, //中奖结果层
            drawPercentCallback: null, //回调函数
            isCallback: false,
            isFans: true, //是否关注(1：已关注；0：未关注；默认为已关注)

            //以下参数可使用默认值
            width: 0, //默认100%
            height: 0, //同上
            cover: "images/glass.jpg",
            coverType: 'image', //image || color
            coverText: '刮开送神秘大礼',

            //以下参数自动生成
            hrefList: [], //结果中A标签href属性
            mask: null, //蒙版（自动生成）
            maskCtx: null, //蒙版context
            background: null //兼容（自动生成）
        };
        $.extend(this, defaults, options);
        (function() {
            this.width = this.width || this.container.width();
            this.height = this.height || this.container.height();
            // 生成蒙板DOM
            this.mask = this.mask || $('<canvas/>').attr({
                'width': this.width,
                'height': this.height
            });
            this.container.append(this.mask);
            this.maskCtx = this.maskCtx || this.mask.get(0).getContext('2d');
            this.background = this.background || $('<div>');
            if (this.isFans == 1) {
                this.bindEvent();
            }
            this.drawMask();
        }).call(this);
    }

    ScratchCard.prototype = {
        // 获取当前canvas透明像素的百分比
        getTransparentPercent: function(ctx, width, height) {
            // 获取画布的像素点
            var imgData = ctx.getImageData(0, 0, width, height),
                pixles = imgData.data,
                transPixs = [];

            // 计算画布中，透明程度（第四个值为透明度0-255）
            for (var i = 0, j = pixles.length; i < j; i += 4) {
                var a = pixles[i + 3];
                if (a < 128) {
                    transPixs.push(i);
                }
            }
            return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
        },
        //显示中奖结果
        showResult: function() {
            var _this = this;
            var $aOfResult = $("a[href]", _this.realResult); //结果层中所有A标签
            // 处理结果DIV中A标签，末完全刮开A链接点击无效
            $aOfResult.each(function(index) {
                _this.hrefList.push($aOfResult.eq(index).attr("href"));
                $aOfResult.eq(index).removeAttr("href");
            });
            _this.realResult.show();
        },
        //隐藏图层
        hideContainer: function() {
            var _this = this;
            //还原A标签href属性
            var $aOfResult = $("a", _this.realResult);
            $aOfResult.each(function(index) {
                $aOfResult.eq(index).attr("href", _this.hrefList[index]);
            });
            //隐藏涂层
            $(_this.container).hide();
            document.getElementById("audio").play();
        },
        // 事件处理
        bindEvent: function() {
            var _this = this;
            // 判断是否为移动端
            var ISMOBILE = window.navigator.userAgent.toLowerCase().indexOf('mobile') != -1;
            // var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
            var clickEvtName = ISMOBILE ? 'touchstart' : 'mousedown';
            var moveEvtName = ISMOBILE ? 'touchmove' : 'mousemove';
            var upEvtName = ISMOBILE ? 'touchend' : "mouseup";
            var isMouseDown = false;
            // start
            this.container.on(clickEvtName, function(e) {
                e.preventDefault();
                // 记录开始move
                isMouseDown = true;
                _this.showResult();
                var x = (ISMOBILE ? e.touches[0].pageX : e.pageX || e.x) - _this.mask.offset().left;
                var y = (ISMOBILE ? e.touches[0].pageY : e.pageY || e.y) - _this.mask.offset().top;
                // 画点
                _this.drawPoint(x, y, true);
            });
            //move
            this.container.on(moveEvtName, function(e) {
                e.preventDefault();
                // 记录是否开始move
                if (!isMouseDown)
                    return false;
                var x = (ISMOBILE ? e.touches[0].pageX : e.pageX || e.x) - _this.mask.offset().left;
                var y = (ISMOBILE ? e.touches[0].pageY : e.pageY || e.y) - _this.mask.offset().top;
                // 画点
                _this.drawPoint(x, y, false);
            });
            //end
            _this.container.on(upEvtName, function(e) {
                e.preventDefault();
                isMouseDown = false;
                var per = _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);
                if (per >= 1 && !_this.isCallback) {
                    // 执行回调函数
                    typeof(_this.drawPercentCallback) == 'function' && _this.drawPercentCallback();
                    _this.isCallback = true;
                }
                if (per >= 30) {
                    _this.hideContainer();
                }
            });
        },
        // 画布上画点
        drawPoint: function(x, y, begin) {
            if (begin) {
                this.maskCtx.beginPath();
                this.maskCtx.arc(x, y, 15, 0, Math.PI * 2);
                this.maskCtx.fill();
                this.maskCtx.beginPath();
                this.maskCtx.moveTo(x, y);
            } else {
                // 画笔大小
                this.maskCtx.lineWidth = 30;
                // 前者是线的末端样式，后者是线连接处的样式---圆
                this.maskCtx.lineCap = this.maskCtx.lineJoin = 'round';
                this.maskCtx.lineTo(x, y);
                this.maskCtx.stroke();
            }

            /*这个费解的代码是为了兼容*/
            this.container.append(this.background).append(this.mask);
        },
        // 画蒙板
        drawMask: function() {
            if (this.coverType == 'image') {
                var image = new Image(),
                    _this = this;
                image.onload = function() {
                    _this.maskCtx.drawImage(this, 0, 0, this.width, this.height, 0, 0, _this.width, _this.height);
                    drawTxt.apply(_this);
                }
                image.src = this.cover;
            } else if (this.coverType == 'color') {
                this.maskCtx.fillStyle = this.cover;
                this.maskCtx.fillRect(0, 0, this.width, this.height);
                drawTxt.apply(this);
            }

            function drawTxt() {
                var fontSize = 30;
                var txt = this.coverText; //涂层文字
                if (this.isFans == 0) {
                    txt = "关注即可刮奖";
                }
                this.maskCtx.fillStyle = "#FFF";
                this.maskCtx.font = 'Bold ' + fontSize + 'px 微软雅黑';
                this.maskCtx.textAlign = 'left';
                this.maskCtx.textBaseline = "middle";
                this.maskCtx.textAlign = "center";
                this.maskCtx.fillText(txt, this.width / 2, this.height / 2);
                this.maskCtx.globalCompositeOperation = 'destination-out';
            }
        }
    }
});