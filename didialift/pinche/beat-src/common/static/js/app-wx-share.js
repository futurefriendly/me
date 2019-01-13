/**
 * 微信分享代码
 */
$(function() {
    // alert(is_weixn());
    //  if (!is_weixn()) return;

    var beInitialized = false;
    
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
    window.initWxShare = function(shareConfig) {

        if(beInitialized) {
            share_config(shareConfig);
            return;
        }

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
                                beInitialized = true;
                                share_config(shareConfig);
                            });
                        }
                    },
                    error: function() {}
                });

            }

        });

    }






    // function is_weixn() {
    //         var ua = navigator.userAgent.toLowerCase();
    //         if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    //
    //
    //
    //
    //分享配置
    function share_config(shareConfig) {

        var share_obj = shareConfig 
                || {
                    title: '顺风出行，期待每一次的不期而遇。',
                    desc: '滴滴顺风车车主有奖招募中，有车即可参与',
                    link: location.href,
                    imgUrl: "http://static.xiaojukeji.com/pinche/images/share.jpg"
                };

        if( share_obj.img_url ) {
            share_obj.imgUrl = share_obj.img_url;
        }

        // 微信消息
        wx.onMenuShareAppMessage({
            title: share_obj.title,
            desc: share_obj.desc,
            link: share_obj.link,
            imgUrl: share_obj.imgUrl,
            trigger: function(res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                //alert('用户点击发送给朋友');
            },
            success: function(res) {
                //alert('已分享');
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
            title: share_obj.tltitle || share_obj.title,
            desc: share_obj.tldesc || share_obj.desc,
            link: share_obj.link,
            imgUrl: share_obj.imgUrl,
            trigger: function(res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                // alert('用户点击分享到朋友圈');
            },
            success: function(res) {
                // alert('已分享');
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
            title: share_obj.title,
            desc: share_obj.desc,
            link: share_obj.link,
            imgUrl: share_obj.imgUrl,
            trigger: function(res) {
                //alert('用户点击分享到QQ');
            },
            complete: function(res) {
                //alert(JSON.stringify(res));
            },
            success: function(res) {
                // alert('已分享');
            },
            cancel: function(res) {
                //alert('已取消');
            },
            fail: function(res) {
                // alert(JSON.stringify(res));
            }
        });
    }



});




// 滴滴打车客户端分享包括（ios and Android）
$(function(e) {

    


    // Debug Mode
    if (/debug=1/.test(location.href)) {
        window.DidiJSBridge = {
            callHandler: function (action, param) {
                console.log('call action ' + action);
                console.log(param);
            }
        };
    }


    /**
     * 初始化滴滴客户端分享功能
     * @param {JSON} config 分享配置
     * @example
     * 1. 支持按钮点击调起分享
     * {
     *     btn: $('.btn-share')
     *     , shareConfig: {
     *          link: '...'
     *          , title: '...'
     *          , desc: '...'
     *          , img_url: '...'
     *     }
     * }
     *
     * 2. 支持右上角更多按钮
     * {
     *     showMoreBtn: true
     *     , shareConfig: {
     *          link: '...'
     *          , title: '...'
     *          , desc: '...'
     *          , img_url: '...'
     *     }
     * }
     */
    function initDidiShare(config) {
        if(!config) return;

        var btnShare = config.btn,
            showMoreBtn = config.showMoreBtn,
            shareConfig = config.shareConfig;

        var entranceMap = [{
                button: btnShare,
                method: 'invoke_entrance'
            }];

        var shareData = {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            };

        var entranceConfig = {

                entrance: {
                    icon: 'http://static.xiaojukeji.com/api/img/i-webview-entrance.png'
                },

                buttons: [
                    {
                        type: 'share_weixin_timeline',
                        name: '分享到微信朋友圈',
                        data: shareData,
                        callback: function(){}
                    }
                    , {
                        type: 'share_weixin_appmsg',
                        name: '分享给微信好友',
                        data: shareData,
                        callback: function(){}
                    }
                    , {
                        type: 'share_sina_weibo',
                        name: '分享到新浪微博',
                        data: $.extend({}, shareData, {
                            share_content: shareConfig.weibo_desc || shareConfig.desc 
                        }),
                        callback: function(){}
                    }
                    , {
                        type: 'share_qq_appmsg',
                        name: '分享给QQ好友',
                        data: shareData,
                        callback: function(){}
                    }
                    , {
                        type: 'share_qzone',
                        name: '分享到QQ空间',
                        data: shareData,
                        callback: function(){}
                    }
                    , {
                        type: 'page_refresh',
                        name: '刷新'
                    }
                ]
            };


        var isIOS = $.os.ios;

        connectDidiJSBridge(function(bridge){
            isIOS && bridge.init && bridge.init();
        });


        // 执行连接DidiJSBridge
        connectDidiJSBridge(function(bridge) {
            if (typeof bridge === 'undefined') {
                return;
            }
            bridge.callHandler('init_entrance', JSON.stringify(entranceConfig));
            if( showMoreBtn ) {
                setTimeout(function(){
                    bridge.callHandler('show_entrance');
                }, 300);
            }
            bindEntrance(bridge, entranceMap);
        });

    }





    // 绑定入口操作
    function bindEntrance(bridge, entranceMap) {
        $.map(entranceMap, function(item) {
            (function(it) {
                $(it.button).on('touchend', function(e) {
                    if (typeof bridge === 'undefined') {
                        return;
                    }
                    bridge.callHandler(it.method);
                });
            })(item);
        });

    };

    // 连接DidiJSBridge
    function connectDidiJSBridge (callback) {
        if (window.DidiJSBridge) {
            callback(DidiJSBridge);
        } else {
            document.addEventListener('DidiJSBridgeReady', function() {
                callback(DidiJSBridge);
            }, false);
        }
    };


    window.initDidiShare = initDidiShare;


});
