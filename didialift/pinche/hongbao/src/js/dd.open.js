(function() {
var Data = {
	os: null,
    downloadApp: {
       ios:{
          "packageName": "com.xiaojukeji.didi",
          "packageUrl": "diditaxi:passenger",
          "downloadUrl": "https://itunes.apple.com/cn/app/di-di-da-che-zhi-jian-shang/id554499054?ls=1&mt=8"
       },
       android:{
         "packageName": "com.sdu.didi.psnger",
         "packageUrl": "didipasnger://didi_apk_intalled_scheme",
         "downloadUrl": "http://dldir1.qq.com/diditaxi/apk/didi_psngr.apk"
       }
    },
        init: function() {
            Render.init();
            Event.init();
        }
}
var Render = {
	init: function() {
            Render.downloadApp();
        },
    //设置微信显示，隐藏，分享
        weixin: function(fn) {
            //微信相关
            var onBridgeReady = function() {
                if (!WeixinJSBridge) {
                    return; // 保证WeixinJSBridge存在
                } 
               
                if(fn){
                   fn();
                }else{
     
                define_wx_share(WeixinJSBridge);
                }
            };

            //微信控制
            if (typeof WeixinJSBridge === "undefined") {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady);
                return;
            } else {
                onBridgeReady();
            }
            // WeixinJSBridge.call('hideToolbar'); //隐藏底部工具栏
            // WeixinJSBridge.call('hideOptionMenu'); //隐藏右上角分享按钮

        },
	//初始化下载按钮对应的链接
    downloadApp: function() {
       var os='';
       if ((navigator.userAgent.match(/(Android)/i)) ) {
           os = 'android';
         } else if ( (navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)) ) {
           os = 'ios';
         }
      Data.os = Data.downloadApp[os];
    }
}
var Event = {
	init: function() {
          Event.downloadApp();
      },
	//下载客户端
      downloadApp: function() {
          os=Data.os;
			var goto=function(type){
				if(type=="download"){
					url = os.downloadUrl;
					document.querySelector('#download-app').innerHTML = '下载滴滴';
				}else{
					url = os.packageUrl; 
					// location.href=url;
					document.querySelector('#download-app').innerHTML = '打开滴滴';
				}
				document.querySelector('#download-app').addEventListener('click',function(e){
					location.href = url;
				},false);
			}
         
		
			 // console.log(os); 
         	if(navigator.userAgent.match(/(micromessenger)/i)) {
            	Render.weixin(function(){
					setTimeout(function() {
						WeixinJSBridge.invoke('getInstallState', os, function(e) {

							 var msg = e.err_msg;
							if(msg.indexOf("get_install_state:yes") > -1){
								goto("app");
							}else{
								goto("download");
							}
						});
					}, 200);
				});
            }else if(os){
				      goto("download");
            }else{
                document.querySelector('#download-app').style.display='none';
			}
             

      }
}
	function define_wx_share(WeixinJSBridge) {
          WeixinJSBridge.on('menu:share:appmessage', function() {
              WeixinJSBridge.invoke('sendAppMessage', {
                  "appid": "wx69b6673576ec5a65"
              },
              function(res) {});
          });

          
      }

	document.addEventListener("DOMContentLoaded", function(ev) {

          Data.init();
      },
      false);
})();