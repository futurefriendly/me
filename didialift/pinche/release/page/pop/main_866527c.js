define("page/pop/main.js",function(e){function n(e,n,t){return e[0]==n[0]?(n.show(),void t()):(e.addClass("from_page"),n.addClass("to_page"),$(".main").attr("class","main animate begin_animate"),setTimeout(function(){$(".main").attr("class","main animate end_animate")},0),void setTimeout(function(){e.removeClass("from_page").hide(),n.removeClass("to_page").show(),t()},350))}function t(){document.getElementById("music_audio").play(),$("body").off("touchstart")}function i(){$("#goJoin").attr("href",g).on("click",function(e){var n=this;e.preventDefault(),e.stopPropagation(),p("sfx150818_index-btn-join_ck",{channel:h},!0),_mz_wx_custom(5),setTimeout(function(){location.href=$(n).attr("href")},300)})}var o,a,s,c=e("page/pop/first/first.js"),r=e("page/pop/second/second.js"),d=e("page/pop/third/third.js"),l=[c,r,d],u=$(".form"),f=0,m=function(e,t){a=function(n){e<l.length-1?m(e+1,n):e===l.length-1&&alert("已经是最后一页")},s=function(n){e>0&&m(e-1,n)},n(u.eq(f),u.eq(e),function(){l[e].wakeup(t||{},a,s),o=location.hash,location.href="#h"+~~(1e6*Math.random())}),f=e};u.hide(),m(f),addEventListener("hashchange",function(){location.hash===o&&s()}),$("#music_tool").on("touchend",function(){var e=document.getElementById("music_tool_switch"),n=(document.getElementById("music_tool"),document.getElementById("music_audio"));null!==n&&(1==e.checked&&n.paused?(e.checked=!1,n.play()):(e.checked=!0,n.pause()))}),t(),$("body").on("touchstart",t),window.addEventListener("DOMContentLoaded",function(){new QueryLoader2(document.querySelector("body"),{barColor:"#ff8903",backgroundColor:"#fff",percentage:!0,barHeight:3,minimumTime:300,maxTime:1e6,fadeOutTime:900})});var p=DidiMonitor.sendBeatles,h=DidiMonitor.getQuery("channel"),g="http://wap.diditaxi.com.cn/pinche/publicreg/program/login?regfrom="+h,_="http://static.diditaxi.com.cn/pinche/staticpage/actdesc.html?channel="+h,v="";navigator.userAgent.match(/(Android)/i)?v="android":navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)&&(v="ios");var y="",k="";!function(){var e=function(e){window.DidiJSBridge?e(DidiJSBridge):document.addEventListener("DidiJSBridgeReady",function(){e(DidiJSBridge)},!1)};e(function(e){if("undefined"!=typeof e){if("android"==v){var n=JSON.parse(e.callHandler("getUserInfo")),t=JSON.parse(e.callHandler("getSystemInfo"));y=n.token,k=t.appversion,/token/.test(g)||(g+="&token="+y),/appversion/.test(g)||(g+="&appversion="+k),i()}"ios"==v&&(e.init&&e.init(),e.callHandler("getUserInfo",JSON.stringify(""),function(e){var n=JSON.parse(e);y=n.token,/token/.test(g)||(g+="&token="+y)}),e.callHandler("getSystemInfo",JSON.stringify(""),function(e){var n=JSON.parse(e);k=n.appversion,/appversion/.test(g)||(g+="&appversion="+k,i())}))}})}(),$("#btnTaskDetail").attr("href",_).on("click",function(e){var n=this;e.preventDefault(),e.stopPropagation(),p("sfx150818_index-btn-actdesc_ck",{channel:h},!0),_mz_wx_custom(4),setTimeout(function(){location.href=$(n).attr("href")},300)}),p("sfx150818_index_sw",{channel:h});var w={title:"单双号限行，召唤顺风侠为出行而战，快来加入吧！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，为出行而战，获惊喜大奖！",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/yzbb.jpg",img_url:"http://static.xiaojukeji.com/pinche/images/sfx1508/yzbb.jpg"};window.onhashchange=function(){$("#identifyLayer").removeClass("showlayer"),$(".D_layer").css("display","none"),"block"==$(".form_second").css("display")?$("#music_tool").css("top","36px"):$("#music_tool").css("top","5px")},$(".d_close").on("touchend",function(){$("#identifyLayer").removeClass("showlayer"),$(".D_layer").css("display","none"),$("#btnDraw").removeClass("hover")}),$(function(){initWxShare(w)})});