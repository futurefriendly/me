define("page/meetyy/main.js",function(e){"use strict";var n=e("ddplayer"),a=e("didibridge"),i=n.vars,t=e("didimonitor"),o=t.sendBeatles,r=e("wxsharedidi"),s=(/MI 2S/i.test(navigator.userAgent),function(){n.ready(function(e){var n=location.href.replace(/[?#].*/g,""),t={param:{playerConId:"playerWrap",playerConfig:{data:window.videoData||{},autoplay:!1},clsBodyBg:"js_body_bg",clsBodyBgPlayed:"js_body_bg_played",clsBtnGet:"js_power_get",idBtnShare:"btnShare",isPlayed:!1,idWrongLayer:"wrongLayer",shareConfig:{share_url:n,share_img_url:"http://static.xiaojukeji.com/pinche/release/page/meetyy/images/share_4cd2fa0.jpg",share_icon_url:"http://static.xiaojukeji.com/pinche/release/page/meetyy/images/share_4cd2fa0.jpg",share_title:"她们竟然在滴滴顺风车上遇到飘柔代言人杨洋！",share_content:"她们竟然偶遇杨洋！戳进来，你也可能做到",weibo_desc:"她们竟然偶遇了杨洋？！想知道怎么做到的？快戳→（http://t.cn/RbH0dKP）@飘柔Rejoice @滴滴顺风车 @天猫超市"}},model:{player:null},view:{},ctrl:{}},s=t.param,c=t.model,d=(t.view,t.ctrl);s.init=function(){return $.isFunction(e)?0===$("#"+s.playerConId).length?!1:!0:!1},c.initEntranceConfig=function(){s.entranceConfig={entrance:{icon:"http://static.xiaojukeji.com/api/img/i-webview-entrance.png"},buttons:[{type:"share_weixin_timeline",name:"分享到微信朋友圈",data:s.shareConfig,callback:function(){}},{type:"share_weixin_appmsg",name:"分享给微信好友",data:s.shareConfig,callback:function(){}},{type:"share_sina_weibo",name:"分享到新浪微博",data:$.extend({},s.shareConfig,{share_content:s.shareConfig.weibo_desc||s.shareConfig.desc}),callback:function(){}},{type:"share_qq_appmsg",name:"分享给QQ好友",data:s.shareConfig,callback:function(){}},{type:"share_qzone",name:"分享到QQ空间",data:s.shareConfig,callback:function(){}},{type:"page_refresh",name:"刷新"}]}},d.init=function(){s.init()&&(window.ddplayer=c.player=new e(s.playerConfig),s.$btnGet=$("."+s.clsBtnGet),s.$btnShare=$("#"+s.idBtnShare),s.$wrongLayer=$("#"+s.idWrongLayer),d.eventInit(),c.player.htmlTo($("#"+s.playerConId)),i.IsDiDiBrowser&&(c.initEntranceConfig(),a.initEntrance(s.entranceConfig),a.showEntrance(),s.$btnShare.show()),$("body").css("height",$(window).height()),$(window).bind("load",function(){o("sfc-video-160121_index_sw",null,!0)}))},d.eventInit=function(){var e=d.process;c.player.on("play",function(){s.isPlayed||($("body").addClass("played"),s.$btnGet.hide(),s.isPlayed=!0,o("sfc-video-160121_index_ck",null,!0))}),c.player.on("pause",function(){}),s.$btnGet.on(i.END_EVENT,function(){c.player&&c.player.$midPlay.trigger(i.END_EVENT)}),c.player.on("ended",function(){return e.ended(),!1}),e.share(),e.orient()},d.process={},d.process.ended=function(){s.isPlayed=!1},d.process.share=function(){s.$btnShare.on(i.END_EVENT,function(){a&&a.invokeEntrance()}),r.initWxShare(s.shareConfig)},d.process.orient=function(){$(window).bind("orientationchange",function(){0==window.orientation||180==window.orientation?(s.$wrongLayer.hide(),$("html").removeClass("orientation")):90!=window.orientation&&-90!=window.orientation||s.isPlayed?(c.player.$ctrlFullScreen.trigger(i.END_EVENT),$("html").addClass("orientation")):s.$wrongLayer.show()})},d.init()})});s()});