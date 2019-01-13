document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    WeixinJSBridge.call("showOptionMenu");
    WeixinJSBridge.call('hideToolbar');
    var share_config = {
        img_url: "http://diditaxi.com.cn/share/images/webapp_share/diditaxi-logo.png", //小图的链接
        title: "最近用滴滴打车，每次都很快打到车，推荐给你试试！",
        desc: "用滴滴打车，室内叫好车再出发，再也不用路边日晒雨淋跟人抢车了~",
        link: 'http://diditaxi.com.cn/api/v1/share' //分享出去的链接地址

    };
    var _obj = theme_config.friend_circle_share || {};
    var obj = {
        img_url: _obj.share_img_url || share_config.img_url, //小图的链接
        title: _obj.title || share_config.title,
        desc: _obj.content || share_config.desc,
        link: location.href //分享出去的链接地址

    };

    // 分享给朋友
    WeixinJSBridge.on('menu:share:appmessage', function(argv) {

        WeixinJSBridge.invoke('sendAppMessage', {
            "appid": "wxab524d83299d6c83",
            "img_url": obj.img_url,
            "img_width": "",
            "img_height": "",
            "link": obj.link,
            "title": obj.title,
            "desc": obj.desc
        }, function(res) {

        });
    });

    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function(argv) {

        WeixinJSBridge.invoke('shareTimeline', {
            "appid": "wxab524d83299d6c83",
            "img_url": obj.img_url,
            "img_width": "",
            "img_height": "",
            "link": obj.link,
            "title": obj.title,
            "desc": obj.desc
        }, function(res) {

        });
    });

});
