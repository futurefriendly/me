define("page/pop/second/second.js",function(e,t){{var i=(/didi.passenger/.test(window.navigator.userAgent),e("didimonitor")),o=i.sendBeatles;i.getQuery("channel")}$(function(){var e={param:{is_step_initialized:!1,exports:t,$btnDraw:null,$layer:null,$btnTastDetail:null,heroType:"",$heroImg:null,$heroRectText:null,$heroTip:null,$btnGuide:null,$btnShare:null,isDiDiApp:!1,test:!1},model:{},view:{},ctrl:{}},i=e.param,n=e.model,a=(e.view,e.ctrl);i.init=function(){return i.$container=t.$container=$(".form_second"),i.$container.length>0?(i.$btnDraw=$("#btnDraw"),i.$layer=$("#taskLayer"),i.$btnTastDetail=$("#btnTaskDetail"),i.heroType=$("body").attr("class")||"role1",i.$heroImg=$(".js_hero_img"),i.$heroRectText=$(".js_rocket_text"),i.$heroTip=$(".js_hero_tip"),i.$btnShare=$("#btnShare"),i.$btnGuide=$("#btnGuide"),i.isDiDiApp=/didi.passenger/.test(window.navigator.userAgent),!0):!1},n.getUrlParamByUrl=function(e,t){var i=new RegExp("(\\?|#|&)"+e+"=([^&#]*)(&|#|$)"),t=t||location.href,o=t.match(i);return o?o[2]:""},a.init=function(){i.init()&&(a.wakeup(),a.hideButton(),a.eventInit())},a.hideButton=function(){i.isDiDiApp?i.$btnGuide.hide():i.$btnShare.hide()},a.eventInit=function(){a.chooseHero(),i.$btnDraw.click(function(){i.$layer.show(),o("sfx150818_task_ck"),_mz_wx_custom(3)}),i.$btnShare.on("click",function(){o("sfx150818_more_ck"),_mz_wx_custom(6)})},a.step_initialize=function(){document.documentElement.clientWidth<document.documentElement.clientHeight&&(document.getElementsByTagName("html")[0].style.fontSize=(document.documentElement.clientHeight/420*10).toFixed(4)+"px"),i.$container.addClass("on"),i.$container.on("click",".next,.prev",function(e){switch($(e.currentTarget).attr("class")){case"prev":back();break;case"next":forward()}})},a.wakeup=function(){i.exports.wakeup=function(e,t,o){a.forward=function(){t()},a.back=function(){o()},i.is_step_initialized===!1&&(i.is_step_initialized=!0,a.step_initialize())}},a.chooseHero=function(){window.randomNum=i.randomNum=Math.floor(5*Math.random());var e=n.getUrlParamByUrl("carType");i.randomNum=e?e:i.randomNum;var t=["http://static.xiaojukeji.com/pinche/release/page/pop/second/img/img_role1_4991c9e.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/img_role2_be13331.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/img_role3_1820611.png"],o=["http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role0_50a2a35.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role1_757c6c1.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role2_d30808d.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role3_fa85d7e.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/text_role4_25154d2.png"],a=["http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role0_6df74de.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role1_88541da.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role2_6c401f3.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role3_494c59e.png","http://static.xiaojukeji.com/pinche/release/page/pop/second/img/text/tip_role4_908970d.png"];console.log("randomNum:"+i.randomNum),i.$heroImg[0].src=t[(/\d+/.test(i.heroType)&&RegExp["$&"]||0)-1],i.$heroRectText.css("background-image","url("+o[i.randomNum]+")"),i.$heroTip.css("background-image","url("+a[i.randomNum]+")"),i.$container.find(".js_role"+i.randomNum).show()},a.init()})});