define("page/pop/app-wx-share-sfx.js",function(){function n(n){if(""==n||void 0==n)return void alert("url不正确");if(-1==n.indexOf("#")||-1==n.indexOf("?"))return n;var e=n.substring(n.indexOf("#"),n.indexOf("?")),i=n.replace(e,"")+e;return i}!function(){function e(e){var i=e||{title:"单双号限行，召唤顺风侠为出行而战，快来加入吧！",desc:"今天你顺我，明天我搭你，领取顺风侠任务，为出行而战，获惊喜大奖！",link:location.href,imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/yzbb.jpg"};wx.onMenuShareAppMessage({title:i.title,desc:i.desc,link:n(_mz_wx_shareUrl(i.link)),imgUrl:i.imgUrl,trigger:function(){},success:function(){_mz_wx_friend()},cancel:function(){},fail:function(){}}),wx.onMenuShareTimeline({title:i.tltitle||i.title,desc:i.tldesc||i.desc,link:n(_mz_wx_shareUrl(i.link)),imgUrl:i.imgUrl,trigger:function(){},success:function(){_mz_wx_timeline()},cancel:function(){},fail:function(){}}),wx.onMenuShareQQ({title:i.title,desc:i.desc,link:n(_mz_wx_shareUrl(i.link)),imgUrl:i.imgUrl,trigger:function(){},complete:function(){},success:function(){_mz_wx_qq()},cancel:function(){},fail:function(){}})}var i=!1;window.initWxShare=function(n){return i?void e(n):void $.ajax({url:"http://res.wx.qq.com/open/js/jweixin-1.0.0.js",dataType:"jsonp",error:function(){$.ajax({url:"http://wap.didialift.com/pinche/wxApi/getJsSdkConfig?url="+encodeURIComponent(location.href),dataType:"jsonp",success:function(t){var o=t;if(o&&"0"==o.errno){var a={debug:!1,appId:"wxab524d83299d6c83",timestamp:o.timestamp,nonceStr:o.nonceStr,signature:o.signature,jsApiList:["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"]};/debug=1/.test(location.href)&&(console.log("initWxShare"),console.log(a),console.log(n)),wx.config(a),wx.ready(function(){i=!0,e(n)})}},error:function(){}})}})}}(),$(function(){function n(n){if(n){var t=n.btn,o=n.shareConfig,a=[{button:t,method:"invoke_entrance"}],c={share_url:o.link,share_icon_url:o.img_url,share_img_url:o.img_url,share_title:o.title,share_content:o.desc,share_from:"native"},r={entrance:{icon:"http://static.diditaxi.com.cn/webapp/images/driver.png"},buttons:[{type:"share_weixin_timeline",name:"分享到微信朋友圈",data:c,callback:function(){}},{type:"share_weixin_appmsg",name:"分享给微信好友",data:c,callback:function(){}},{type:"share_qq_appmsg",name:"分享给QQ好友",data:c,callback:function(){}},{type:"share_qzone",name:"分享到QQ空间",data:c,callback:function(){}}]};i(function(n){"undefined"!=typeof n&&(n.callHandler("init_entrance",JSON.stringify(r)),e(n,a))})}}function e(n,e){$.map(e,function(e){!function(e){$(e.button).on("touchend",function(){"undefined"!=typeof n&&n.callHandler(e.method)})}(e)})}function i(n){window.DidiJSBridge?n(DidiJSBridge):document.addEventListener("DidiJSBridgeReady",function(){n(DidiJSBridge)},!1)}/debug=1/.test(location.href)&&(window.DidiJSBridge={callHandler:function(n,e){console.log("call action "+n),console.log(e)}}),window.initDidiShare=n})});
;define("page/pop/first/first.js",function(e,i){function a(){c.on("click",".next,.prev",function(e){switch($(e.currentTarget).attr("class")){case"prev":s();break;case"next":n()}})}function t(){$("#identifyLayer").addClass("showlayer")}function r(){$("#identifyLayer").css("display","block"),setTimeout(t,1e3)}var n,s,c=i.$container=$(".form_first"),o=!1;i.wakeup=function(e,i,t){n=function(){i()},s=function(){t()},o===!1&&(o=!0,a())},c.find(".next").click(function(){n()}),c.find(".prev").click(function(){s()});var l=Math.floor(3*Math.random()+1);$("body").removeClass().addClass("role"+l),c.find(".settimenext").on("touchstart",function(e){e.preventDefault();var i="",a=window.randomNum;switch(a){case 0:i="火箭";break;case 1:i="滑板";break;case 2:i="挖掘机";break;case 3:i="风火轮";break;case 4:i="大黄鸭"}$("body").hasClass("role1")?wxShare={title:"单双号限行，我竟然变身为开"+i+"的顺风侠！来测测你会变成谁！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，获惊喜大奖",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/yzbb.jpg"}:$("body").hasClass("role2")?wxShare={title:"单双号限行，我竟然变身为开"+i+"的顺风侠！来测测你会变成谁！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，获惊喜大奖",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/yqrx.jpg"}:$("body").hasClass("role3")&&(wxShare={title:"单双号限行，我竟然变身为开"+i+"的顺风侠！来测测你会变成谁！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，获惊喜大奖",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/cgbd.jpg"}),initWxShare(wxShare),wxShare.img_url=wxShare.imgUrl,initDidiShare({btn:$("#btnShare"),shareConfig:wxShare}),setTimeout(r,1e3),_mz_wx_custom(1)}),c.find(".sendnext").click(function(){n(),_mz_wx_custom(2),_mz_wx_view(2)})});
;define("page/pop/second/second.js",function(e,t){$(function(){var e={param:{is_step_initialized:!1,exports:t,$btnDraw:null,$layer:null,$btnTastDetail:null,heroType:"",$heroImg:null,$heroRectText:null,$heroTip:null,$btnGuide:null,$btnShare:null,isDiDiApp:!1},model:{},view:{},ctrl:{}},i=e.param,o=e.model,a=(e.view,e.ctrl);i.init=function(){return i.$container=t.$container=$(".form_second"),i.$container.length>0?(i.$btnDraw=$("#btnDraw"),i.$layer=$("#taskLayer"),i.$btnTastDetail=$("#btnTaskDetail"),i.heroType=$("body").attr("class")||"role1",i.$heroImg=$(".js_hero_img"),i.$heroRectText=$(".js_rocket_text"),i.$heroTip=$(".js_hero_tip"),i.$btnShare=$("#btnShare"),i.$btnGuide=$("#btnGuide"),i.isDiDiApp=/didi.passenger/.test(window.navigator.userAgent),!0):!1},o.getUrlParamByUrl=function(e,t){var i=new RegExp("(\\?|#|&)"+e+"=([^&#]*)(&|#|$)"),t=t||location.href,o=t.match(i);return o?o[2]:""},a.init=function(){i.init()&&(a.wakeup(),a.hideButton(),a.eventInit())},a.hideButton=function(){i.isDiDiApp?i.$btnGuide.hide():i.$btnShare.hide()},a.eventInit=function(){a.chooseHero(),i.$btnDraw.click(function(){i.$layer.show(),_mz_wx_custom(3),$(this).addClass("hover")})},a.step_initialize=function(){document.documentElement.clientWidth<document.documentElement.clientHeight&&(document.getElementsByTagName("html")[0].style.fontSize=(document.documentElement.clientHeight/420*10).toFixed(4)+"px"),i.$container.addClass("on"),i.$container.on("click",".next,.prev",function(e){switch($(e.currentTarget).attr("class")){case"prev":back();break;case"next":forward()}})},a.wakeup=function(){i.exports.wakeup=function(e,t,o){a.forward=function(){t()},a.back=function(){o()},i.is_step_initialized===!1&&(i.is_step_initialized=!0,a.step_initialize())}},a.chooseHero=function(){window.randomNum=i.randomNum=Math.floor(5*Math.random());var e=o.getUrlParamByUrl("carType");i.randomNum=e?e:i.randomNum;var t=["http://static.xiaojukeji.com/pinche/release/page/pop/second/img/img_role1_4991c9e.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/img_role2_be13331.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/img_role3_1820611.png"],a=["http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role0_50a2a35.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role1_757c6c1.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role2_d30808d.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role3_fa85d7e.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role4_25154d2.png"],n=["http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role0_6df74de.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role1_88541da.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role2_6c401f3.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role3_494c59e.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role4_908970d.png"];console.log("randomNum:"+i.randomNum),i.$heroImg[0].src=t[i.randomNum],i.$heroRectText.css("background-image","url("+a[i.randomNum]+")"),i.$heroTip.css("background-image","url("+n[i.randomNum]+")"),i.$container.find(".js_role"+i.randomNum).show()},a.init()})});
;define("page/pop/third/third.js",function(n,t){function c(){r.on("click",".next,.prev",function(n){switch($(n.currentTarget).attr("class")){case"prev":i();break;case"next":e()}})}var e,i,r=t.$container=$(".form_third"),a=!1;t.wakeup=function(n,t,r){e=function(){t()},i=function(){r()},a===!1&&(a=!0,c())}});
;define("page/pop/main.js",function(e){function n(e,n,t){return e[0]==n[0]?(n.show(),void t()):(e.addClass("from_page"),n.addClass("to_page"),$(".main").attr("class","main animate begin_animate"),setTimeout(function(){$(".main").attr("class","main animate end_animate")},0),void setTimeout(function(){e.removeClass("from_page").hide(),n.removeClass("to_page").show(),t()},350))}function t(){document.getElementById("music_audio").play(),$("body").off("touchstart")}function i(){$("#goJoin").attr("href",_).on("click",function(e){var n=this;e.preventDefault(),e.stopPropagation(),h("sfx150818_index-btn-join_ck",{channel:g},!0),_mz_wx_custom(5),setTimeout(function(){location.href=$(n).attr("href")},300)})}var o,a,s,r=e("page/pop/first/first.js"),c=e("page/pop/second/second.js"),d=e("page/pop/third/third.js"),l=[r,c,d],u=$(".form"),f=0,p=function(e,t){a=function(n){e<l.length-1?p(e+1,n):e===l.length-1&&alert("已经是最后一页")},s=function(n){e>0&&p(e-1,n)},n(u.eq(f),u.eq(e),function(){l[e].wakeup(t||{},a,s),o=location.hash,location.href="#h"+~~(1e6*Math.random())}),f=e};u.hide(),p(f),addEventListener("hashchange",function(){location.hash===o&&s()}),$("#music_tool").on("touchend",function(){var e=document.getElementById("music_tool_switch"),n=(document.getElementById("music_tool"),document.getElementById("music_audio"));null!==n&&(1==e.checked&&n.paused?(e.checked=!1,n.play()):(e.checked=!0,n.pause()))}),t(),$("body").on("touchstart",t),window.addEventListener("DOMContentLoaded",function(){new QueryLoader2(document.querySelector("body"),{barColor:"#ff8903",backgroundColor:"#fff",percentage:!0,barHeight:3,minimumTime:300,maxTime:1e6,fadeOutTime:900})});var m=/didi.passenger/.test(window.navigator.userAgent),h=DidiMonitor.sendBeatles,g=DidiMonitor.getQuery("channel"),_="http://wap.diditaxi.com.cn/pinche/publicreg/program/login?regfrom="+g+"&regsource="+(m?"1":"4"),v="http://static.diditaxi.com.cn/pinche/staticpage/actdesc.html?channel="+g,y="";navigator.userAgent.match(/(Android)/i)?y="android":navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)&&(y="ios");var w="",k="";!function(){var e=function(e){window.DidiJSBridge?e(DidiJSBridge):document.addEventListener("DidiJSBridgeReady",function(){e(DidiJSBridge)},!1)};e(function(e){if("undefined"!=typeof e){if("android"==y){var n=JSON.parse(e.callHandler("getUserInfo")),t=JSON.parse(e.callHandler("getSystemInfo"));w=n.token,k=t.appversion,/token/.test(_)||(_+="&token="+w),/appversion/.test(_)||(_+="&appversion="+k),i()}"ios"==y&&(e.init&&e.init(),e.callHandler("getUserInfo",JSON.stringify(""),function(e){var n=JSON.parse(e);w=n.token,/token/.test(_)||(_+="&token="+w)}),e.callHandler("getSystemInfo",JSON.stringify(""),function(e){var n=JSON.parse(e);k=n.appversion,/appversion/.test(_)||(_+="&appversion="+k,i())}))}})}(),$("#btnTaskDetail").attr("href",v).on("click",function(e){var n=this;e.preventDefault(),e.stopPropagation(),h("sfx150818_index-btn-actdesc_ck",{channel:g},!0),_mz_wx_custom(4),setTimeout(function(){location.href=$(n).attr("href")},300)}),h("sfx150818_index_sw",{channel:g});var x={title:"单双号限行，召唤顺风侠为出行而战，快来加入吧！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，为出行而战，获惊喜大奖！",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/yzbb.jpg",img_url:"http://static.xiaojukeji.com/pinche/images/sfx1508/yzbb.jpg"};window.onhashchange=function(){$("#identifyLayer").removeClass("showlayer"),$(".D_layer").css("display","none"),"block"==$(".form_second").css("display")?$("#music_tool").css("top","36px"):$("#music_tool").css("top","5px")},$(".d_close").on("touchend",function(){$("#identifyLayer").removeClass("showlayer"),$(".D_layer").css("display","none"),$("#btnDraw").removeClass("hover")}),$(function(){initWxShare(x)})});