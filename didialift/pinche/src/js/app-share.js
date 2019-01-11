// 微信app内分享 rely on dd.base.js
dd.ready(function weChatShare() {
    // alert(is_weixn());
    //  if (!is_weixn()) return;
    var base = dd.base || {};
    base.ajax({
        method: "POST",
        data: {
            url: encodeURIComponent(location.href)
        },
        url: "/pinche/wxApi/getJsSdkConfig",
        succFunc: function(j) {
            var da = base.txtToJson(j);
            if (da.errno == "0") {
                var data = {
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wxab524d83299d6c83', // 必填，公众号的唯一标识
                    timestamp: da.timestamp, // 必填，生成签名的时间戳
                    nonceStr: da.nonceStr, // 必填，生成签名的随机串
                    signature: da.signature, // 必填，签名，见附录1
                    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                };
                wx.config(data);
                wx.ready(function() {
                    share_config();
                });
            }
        },
        failFunc: function() {}
    });
    // function is_weixn() {
    //         var ua = navigator.userAgent.toLowerCase();
    //         if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    //分享配置
    function share_config(share_obj) {
        var share_obj = {
            title: '顺风出行，期待每一次的不期而遇。',
            desc: '滴滴顺风车车主有奖招募中，有车即可参与',
            link: location.href,
            imgUrl: "http://static.xiaojukeji.com/pinche/images/share.jpg"
        };
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
            title: share_obj.title,
            desc: share_obj.desc,
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

//滴滴打车客户端分享包括（ios and Android）
window.addEventListener('DOMContentLoaded', function(e) {
    var btnShare = document.getElementById('btnNativeShare');
    var hdShareUrl = document.getElementById('nativeShareUrl');
    var _share_url = hdShareUrl ? hdShareUrl.value : "";
    var btnDownload = document.getElementById("btnDownload");
    var shareConfig = {
        img_url: "http://static.xiaojukeji.com/pinche/images/share.jpg", //小图的链接
        title: "顺风出行，期待每一次的不期而遇。",
        desc: "滴滴顺风车车主有奖招募中，有车即可参与",
        link: _share_url //分享出去的链接地址
    };

    var map = function(array, callback) {
        for (var i = 0, l = array.length; i < l; i++) {
            callback(array[i]);
        }
    };

    var entranceMap = [{
        button: btnShare,
        method: 'invoke_entrance'
    }];

    // 绑定入口操作
    var bindEntrance = function(bridge) {
        map(entranceMap, function(item) {
            (function(it) {
                it.button.addEventListener('touchend', function(e) {
                    if (typeof bridge === 'undefined') {
                        return;
                    }
                    bridge.callHandler(it.method);
                });
            })(item);
        });

    };

    // 初始化入口
    var entranceCfg = {
        entrance: {
            icon: 'http://static.diditaxi.com.cn/webapp/images/driver.png'
        },
        buttons: [{
            type: 'share_weixin_timeline',
            name: '分享到微信朋友圈',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }, {
            type: 'share_weixin_appmsg',
            name: '分享给微信好友',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }, {
            type: 'share_qq_appmsg',
            name: '分享给QQ好友',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }, {
            type: 'share_qzone',
            name: '分享到QQ空间',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }]
    };
    //初始化sharebutton
    var initShareButton = function() {
        btnShare.style.display = "block";
        shareText.style.display = "none";
        if (btnDownload) {
            btnDownload.style.display = "none";
        }
        var domTitle = document.getElementById("domTitle");
        if (domTitle) {
            domTitle.innerHTML = "顺风车车主招募";
        }
    };
    // 连接DidiJSBridge
    var connectDidiJSBridge = function(callback) {
        if (window.DidiJSBridge) {
            callback(DidiJSBridge);
        } else {
            document.addEventListener('DidiJSBridgeReady', function() {
                callback(DidiJSBridge);
            }, false);
        }
    };

    // 执行连接DidiJSBridge`
    connectDidiJSBridge(function(bridge) {
        if (typeof bridge === 'undefined') {
            return;
        }
        bridge.callHandler('init_entrance', JSON.stringify(entranceCfg));
        bindEntrance(bridge);
        initShareButton();
    });

}, false);
