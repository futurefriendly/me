document.addEventListener('DOMContentLoaded', function() {
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		var share_config = {
			general_config: {
				img_url: 'http://static.diditaxi.com.cn/site/pages/didi_solicit/images/share.jpg',
				sharetitle: "滴滴拉客",
				sharedesc: "“滴滴拉客”，真的不是谣言！已经“拉客”上千万！",
				link: location.href
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
});