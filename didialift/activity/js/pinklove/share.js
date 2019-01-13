function shareFn(sharePic, shareTitle, shareTxt, shareUrl) {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

        WeixinJSBridge.call("showOptionMenu");
        WeixinJSBridge.call('hideToolbar');

        var share_config = {
            general_config: {
                img_url: sharePic, //小图的链接
                sharetitle: shareTitle,
                sharedesc: shareTxt,
                link: shareUrl //分享出去的链接地址
            }
        };

        var obj = share_config.general_config;
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', {
                "appid": "wx69b6673576ec5a65",
                "img_url": obj.img_url,
                "img_width": "",
                "img_height": "",
                "link": obj.link,
                "title": obj.sharetitle,
                "desc": obj.sharedesc
            }, function(res) {});
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
            }, function(res) {});
        });
    });
}

/*截取用户名*/
function nicknameFn(nickname) {
    var nicknameNew = null;
    if (nickname.length > 5) {
        nicknameNew = nickname.substring(0, 4) + "...";
    } else {
        nicknameNew = nickname;
    }
    return nicknameNew;
}
