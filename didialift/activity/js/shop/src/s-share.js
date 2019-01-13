function shareFn() {
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
}
