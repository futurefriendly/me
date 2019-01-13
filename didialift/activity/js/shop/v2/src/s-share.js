(function (window) {
    var default_data = {
        share_url: "http://static.diditaxi.com.cn/activity/img-mall/share.jpg",
        share_icon_url: "http://static.xiaojukeji.com/webapp/images/taxi.png",
        share_img_url: "http://diditaxi.com.cn/share/images/na_landing_kuhang/02.png",
        share_title: "有积分享福利，任性兑换不花钱",
        share_content: "滴滴积分商城天天上新品：水果零食、休闲购物、生活娱乐、鲜花礼品，好礼兑不停",
        share_from: ""
    };
    var connectDidiJSBridge = function (callback) {
        if (window.DidiJSBridge) {
            callback(DidiJSBridge)
        } else {
            document.addEventListener("DidiJSBridgeReady", function () {
                callback(DidiJSBridge)
            }, false)
        }
    };

    var didi = {
        initShare: function (shareData, callback) {
            if (!shareData) {
                shareData = default_data
            }
            if (typeof callback !== "function") {
                callback = function () {}
            }
            var entranceCfg = {
                entrance: {
                    icon: "http://static.xiaojukeji.com/api/img/i-webview-entrance.png"
                },
                buttons: [{
                    type: "share_weixin_timeline",
                    name: "微信朋友圈",
                    data: shareData,
                    callback: callback
                },
                {
                    type: "share_weixin_appmsg",
                    name: "微信好友",
                    data: shareData,
                    callback: callback
                },
                {
                    type: "page_refresh",
                    name: "刷新"
                }]
            };
            connectDidiJSBridge(function (bridge) {
                if (typeof bridge === "undefined") {
                    return
                }
                bridge.callHandler("init_entrance", JSON.stringify(entranceCfg));
                bridge.callHandler("show_entrance");
            })
        },
        closeShare:function(){
            connectDidiJSBridge(function (bridge) {
                if (typeof bridge === "undefined") {
                    return
                }
                bridge.callHandler('hide_entrance', null);
            })
        }
    };
    window.didi = didi;
})(window);

function shareFn() {
    //微信分享
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

        WeixinJSBridge.call("showOptionMenu");
        WeixinJSBridge.call('hideToolbar');
        var share_config = {
            general_config: {
                img_url: "http://static.diditaxi.com.cn/activity/img-mall/share.jpg", //小图的链接
                sharetitle: "有积分享福利，任性兑换不花钱",
                sharedesc: "滴滴积分商城天天上新品：水果零食、休闲购物、生活娱乐、鲜花礼品，好礼兑不停",
                link: "http://pay.xiaojukeji.com/api/v2/weixinapi?page=middlepage" //分享出去的链接地址
            }
        };

        var obj = share_config.general_config;

        // 分享给朋友
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {

            WeixinJSBridge.invoke('sendAppMessage', {
                "appid": "wx69b6673576ec5a65",
                "img_url": obj.img_url,
                "img_width": "",
                "img_height": "",
                "link": obj.link,
                "title": obj.sharetitle,
                "desc": obj.sharedesc               
            }, function(res) {

            });
        });

        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function(argv) {

            WeixinJSBridge.invoke('shareTimeline', {
                    "img_url": obj.img_url,
                    "img_width": "",
                    "img_height": "",
                    "link": obj.link,
                    "title": obj.sharetitle,
                    "desc": obj.sharedesc
                }, function(res) {

            });
        });

    });
    
    //app分享关闭
    if (window.didi) {
        didi.closeShare();
    }
}