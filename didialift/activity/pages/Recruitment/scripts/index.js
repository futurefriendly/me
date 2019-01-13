window.addEventListener("DOMContentLoaded",function(ev){

	var base = dd.base || {},
    	dialog = dd && dd.dialog;
    
    dialog.loading("加载中,越急越慢...",6000);

    var pauseMusic = document.querySelector("#playmusic");

    var addClass = function (ele,strClass){
		var reg = new RegExp("(?:^| )" + strClass + "(?: |$)");
		if(reg.test(ele.className)){
			//如果此类样式已经存在，则什么也不需要做
		}else{//不存在
			ele.className = ele.className.trim() + " " + strClass;
		}
	};
	
	var removeClass=function (ele,strClass){
		if(!(ele&&ele.nodeType == 1)){	
			alert('第一参数ele需要是一个DOM元素对象');
			throw new Error('第一参数ele需要是一个DOM元素对象');
		}
		if(typeof strClass != 'string'){
			alert('第二参数必须为string类型');
			throw new Error('第二参数必须为string类型');
			
		}
		
		var reg=new RegExp("(?:^| )" + strClass + "(?: |$)","g");
		ele.className = ele.className.replace(reg,'').trim();	
	};

    base.touch(pauseMusic,function(ev){
    	if(pauseMusic.className === "stopmusic"){
    		removeClass(pauseMusic,"stopmusic");
    		addClass(pauseMusic,"startmusic");
    		document.querySelector("audio").pause();
    		pauseMusic.querySelector("img").setAttribute("src", "images/startmusic.png");
    	}else{
    		removeClass(pauseMusic,"startmusic");
    		addClass(pauseMusic,"stopmusic");
    		document.querySelector("audio").play();
    		pauseMusic.querySelector("img").setAttribute("src", "images/stopmusic.png");
    	}
    });

    document.querySelector("audio").pause();
    
    setTimeout(function(){
    	document.querySelector("audio").play();	
    },5000);

	(function(){
		var docuH = document.documentElement.clientHeight,
			allMoveBox = document.getElementsByClassName('swiper-slide'),
			icount = 0,
			timer = null,
			timer2 = null;
		document.getElementsByClassName('swiper-container').item(0).style.height = docuH + 'px';
		
		var getIndex=function (ele){
			var nIndex=0;
			var p=ele.previousSibling
			while(p){
				if(p.nodeType==1){
					nIndex++;//让累加一次
				}			
				p=p.previousSibling;//继续判断它的下一个哥哥		
			}
			return nIndex;	
		};
		
		var mySwiper = new Swiper('.swiper-container',{
			paginationClickable: true,
			mode: 'vertical',
			onSlideChangeStart: function(){//当滑块将要滑到下一块时
				var thisDiv = mySwiper.activeSlide(),
					thisIndex = getIndex(thisDiv);
			},
			onSlideChangeEnd: function(){//当滑块滑到下一块时
				var thisDiv = mySwiper.activeSlide(),
					thisIndex = getIndex(thisDiv);
				for(var i = 0; i < allMoveBox.length; i++){
					removeClass(allMoveBox[i],'slide-move');	
				}
				addClass(thisDiv,'slide-move');
			}
		});

		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	   		var share_config = {
				general_config:{
					img_url: 'http://static.diditaxi.com.cn/activity/pages/Recruitment/images/80-80.png',
	                sharetitle:"来实现你多年前吹过的牛逼",
	                sharedesc:"创意、方案、活动执行，快到滴滴碗里来！",
					link:"http://static.diditaxi.com.cn/activity/pages/Recruitment/index.html?v="+Math.random()
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
	})();
},false);