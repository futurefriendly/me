define('wxsharedidi', function(require, exports, module){ (function(root, factory) {

    // AMD
    if(typeof define == 'function' && define.amd) {
        define(['jquery', 'exports'], function($, exports){
            factory($, exports);
        });
    }
    // CMD: for didi-component
    else if(typeof exports !== 'undefined') {
        // Make sure window.$ exist
        factory(window.$, exports);
    }
    else {
        var $ = root.jQuery || root.Zepto || root.$;
        if(!$) {
            throw Error('WxSharedidi: jQuery or Zepto is needed!');
        }
        root.WxSharedidi = factory($, {});
    }

})(this, function($, WxSharedidi){
    var beInitialized = false;
    var isWXRead = false;
    /**
     * 初始化微信分享功能
     * @param {JSON} shareConfig 微信分享配置
     * @example
     * {
     *      link: '...'
     *      , title: '...'
     *      , desc: '...'
     *      , img_url: '...'
     * }
     */
    var callBackList = [];

    function _initWx(fn) {
        
        if(isWXRead) {
            fn();
            return;
        }
        callBackList.push(fn);
        if(beInitialized){
            return;
        }
        beInitialized = true;
        $.ajax({
            url: 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
            dataType: 'jsonp',
            error: function(){
                
                $.ajax({
                    url: "http://wap.didialift.com/pinche/wxApi/getJsSdkConfig?url="
                        + encodeURIComponent(location.href),
                    dataType: 'jsonp',
                    success: function(json) {
                        var da = json;

                        if (da && da.errno == "0") {
                            var data = {
                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: 'wxab524d83299d6c83', // 必填，公众号的唯一标识
                                timestamp: da.timestamp, // 必填，生成签名的时间戳
                                nonceStr: da.nonceStr, // 必填，生成签名的随机串
                                signature: da.signature, // 必填，签名，见附录1
                                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            };

                            // Debug Mode
                            if (/debug=1/.test(location.href)) {
                                console.log('initWxShare');
                                console.log(data);
                                console.log(shareConfig);
                            }

                            wx.config(data);
                            wx.ready(function() {
                                isWXRead = true;
                                var currentFn;
                                while(currentFn = callBackList.shift()){
                                    currentFn();
                                }
                            });
                        }
                    },
                    error: function() {}
                });

            }

        });

    }

    function _initWxShare(shareConfig){
        _initWx(function(){
            share_config(shareConfig);
        })
    }
    //分享配置
    function share_config(shareConfig) {

        var share_obj = shareConfig 
                || {
                    share_title: '顺风出行，期待每一次的不期而遇。',
                    share_content: '滴滴顺风车车主有奖招募中，有车即可参与',
                    share_url: location.href,
                    share_icon_url: "http://static.xiaojukeji.com/pinche/images/share.jpg"
                };
       
        share_obj.callback = shareConfig.callback || function(){}
        

        // 微信消息
        wx.onMenuShareAppMessage({
            title: share_obj.share_title,
            desc: share_obj.share_content,
            link: share_obj.share_url,
            imgUrl: share_obj.share_icon_url,
            trigger: function(res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击发送给朋友');
            },
            success: function(res) {
                //alert('已分享');
                share_obj.callback();
            },
            cancel: function(res) {
                //alert('已取消');
            },
            fail: function(res) {
                //alert(JSON.stringify(res));
            }
        });

        //朋友圈分享
        wx.onMenuShareTimeline({
            title: share_obj.share_title,
            desc: share_obj.share_content,
            link: share_obj.share_url,
            imgUrl: share_obj.share_icon_url,
            trigger: function(res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                // alert('用户点击分享到朋友圈');
            },
            success: function(res) {
                // alert('已分享');
                share_obj.callback();
            },
            cancel: function(res) {
                //alert('已取消');
            },
            fail: function(res) {
                //alert(JSON.stringify(res));
            }
        });
        //QQ分享
        wx.onMenuShareQQ({
            title: share_obj.share_title,
            desc: share_obj.share_content,
            link: share_obj.share_url,
            imgUrl: share_obj.share_icon_url,
            trigger: function(res) {
                //alert('用户点击分享到QQ');
            },
            complete: function(res) {
                //alert(JSON.stringify(res));
            },
            success: function(res) {
                // alert('已分享');
                share_obj.callback();
            },
            cancel: function(res) {
                //alert('已取消');
            },
            fail: function(res) {
                // alert(JSON.stringify(res));
            }
        });
        //分享到qq空间
        wx.onMenuShareQZone({
            title: share_obj.share_title, // 分享标题
            desc: share_obj.share_content, // 分享描述
            link: share_obj.share_url, // 分享链接
            imgUrl: share_obj.share_icon_url, // 分享图标
            success: function () { 
               // 用户确认分享后执行的回调函数
               share_obj.callback();
            },
            cancel: function () { 
                // 用户取消分享后执行的回调函数
            }
        });
    }
    //隐藏右上角菜单接口
    function _hideOptionMenu(){
        _initWx(function(){
            wx.hideOptionMenu();
        })
    }
    function _showOptionMenu(){
        _initWx(function(){
            wx.showOptionMenu();
        })
    }
    $.extend(WxSharedidi, {
        initWxShare:_initWxShare,
        hideOptionMenu:_hideOptionMenu,
        showOptionMenu:_showOptionMenu
    });

    return WxSharedidi;
}) 
});