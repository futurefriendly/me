define("page/fellow/main.js",function(e){"use strict";var n=e("ddplayer"),a=e("didibridge"),i=n.vars,t=e("didimonitor"),o=t.sendBeatles,r=e("wxsharedidi"),s=(/MI 2S/i.test(navigator.userAgent),function(){n.ready(function(e){var n=location.href.replace(/[?#].*/g,""),t={param:{playerConId:"playerWrap",playerConfig:{data:window.videoData||{},autoplay:!1},clsBodyBg:"js_body_bg",clsBodyBgPlayed:"js_body_bg_played",clsBtnGet:"js_power_get",idBtnShare:"btnShare",isPlayed:!1,idWrongLayer:"wrongLayer",shareConfig:{share_url:n,share_img_url:"http://static.xiaojukeji.com/pinche/release/page/fellow/images/share_a5c4cec.png",share_icon_url:"http://static.xiaojukeji.com/pinche/release/page/fellow/images/share_a5c4cec.png",share_title:"2016第一支暖心视频，送给过年回家的你",share_content:"没有一种感情比亲情更浓烈，没有一种温暖比得上回家过年。2016第一支暖心视频，送给过年回家的你！",weibo_desc:"没有一种感情比亲情更浓烈，没有一种温暖比得上回家过年。2016第一支暖心视频，送给过年回家的你！快戳→（http://t.cn/Rb1OCOl）"}},model:{player:null},view:{},ctrl:{}},s=t.param,c=t.model,l=(t.view,t.ctrl);s.init=function(){return $.isFunction(e)?0===$("#"+s.playerConId).length?!1:!0:!1},c.initEntranceConfig=function(){s.entranceConfig={entrance:{icon:"http://static.xiaojukeji.com/api/img/i-webview-entrance.png"},buttons:[{type:"share_weixin_timeline",name:"分享到微信朋友圈",data:s.shareConfig,callback:function(){}},{type:"share_weixin_appmsg",name:"分享给微信好友",data:s.shareConfig,callback:function(){}},{type:"share_sina_weibo",name:"分享到新浪微博",data:$.extend({},s.shareConfig,{share_content:s.shareConfig.weibo_desc||s.shareConfig.desc}),callback:function(){}},{type:"share_qq_appmsg",name:"分享给QQ好友",data:s.shareConfig,callback:function(){}},{type:"share_qzone",name:"分享到QQ空间",data:s.shareConfig,callback:function(){}},{type:"page_refresh",name:"刷新"}]}},l.init=function(){s.init()&&(window.ddplayer=c.player=new e(s.playerConfig),s.$btnGet=$("."+s.clsBtnGet),s.$btnShare=$("#"+s.idBtnShare),s.$wrongLayer=$("#"+s.idWrongLayer),l.eventInit(),c.player.htmlTo($("#"+s.playerConId)),i.IsDiDiBrowser&&(c.initEntranceConfig(),a.initEntrance(s.entranceConfig),a.showEntrance(),s.$btnShare.show()),$("body").css("height",$(window).height()),$(window).bind("load",function(){o("sfc-video-160129_index_sw",null,!0)}))},l.eventInit=function(){var e=l.process;c.player.on("play",function(){s.isPlayed||($("body").addClass("played"),s.$btnGet.hide(),s.isPlayed=!0,o("sfc-video-160129_index_ck",null,!0))}),c.player.on("pause",function(){}),s.$btnGet.on(i.END_EVENT,function(){c.player&&c.player.$midPlay.trigger(i.END_EVENT)}),c.player.on("ended",function(){return e.ended(),!1}),e.share(),e.orient()},l.process={},l.process.ended=function(){s.isPlayed=!1},l.process.share=function(){s.$btnShare.on(i.END_EVENT,function(){a&&a.invokeEntrance()}),r.initWxShare(s.shareConfig)},l.process.orient=function(){$(window).bind("orientationchange",function(){0==window.orientation||180==window.orientation?(s.$wrongLayer.hide(),$("html").removeClass("orientation")):90!=window.orientation&&-90!=window.orientation||s.isPlayed?(c.player.$ctrlFullScreen.trigger(i.END_EVENT),$("html").addClass("orientation")):s.$wrongLayer.show()})},l.init()})});s()});