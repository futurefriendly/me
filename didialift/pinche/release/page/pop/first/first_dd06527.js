define("page/pop/first/first.js",function(e,i){function t(){c.on("click",".next,.prev",function(e){switch($(e.currentTarget).attr("class")){case"prev":s();break;case"next":r()}})}function a(){$("#identifyLayer").addClass("showlayer")}function n(){$("#identifyLayer").css("display","block"),setTimeout(a,300)}var r,s,o=(/didi.passenger/.test(window.navigator.userAgent),DidiMonitor.sendBeatles),c=(DidiMonitor.getQuery("channel"),i.$container=$(".form_first")),l=!1;i.wakeup=function(e,i,a){r=function(){i()},s=function(){a()},l===!1&&(l=!0,t())},c.find(".next").click(function(){r()}),c.find(".prev").click(function(){s()});var f=Math.floor(3*Math.random()+1),h="ontouchstart"in window,d=h?"touchstart":"mousedown";$("body").removeClass().addClass("role"+f),c.find(".settimenext").on(d,function(e){e.preventDefault();var i="",t=window.randomNum;switch(t){case 0:i="火箭";break;case 1:i="滑板";break;case 2:i="挖掘机";break;case 3:i="风火轮";break;case 4:i="大黄鸭"}$("body").hasClass("role1")?wxShare={title:"单双号限行，我竟然变身为开"+i+"的顺风侠！来测测你会变成谁！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，获惊喜大奖",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/yzbb.jpg"}:$("body").hasClass("role2")?wxShare={title:"单双号限行，我竟然变身为开"+i+"的顺风侠！来测测你会变成谁！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，获惊喜大奖",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/yqrx.jpg"}:$("body").hasClass("role3")&&(wxShare={title:"单双号限行，我竟然变身为开"+i+"的顺风侠！来测测你会变成谁！",link:_mz_wx_shareUrl(location.href.replace(/[?#].*$/g,"")),desc:"今天你顺我，明天我搭你，领取顺风侠任务，获惊喜大奖",imgUrl:"http://static.xiaojukeji.com/pinche/images/sfx1508/cgbd.jpg"}),initWxShare(wxShare),wxShare.img_url=wxShare.imgUrl,initDidiShare({btn:$("#btnShare"),shareConfig:wxShare}),setTimeout(n,1e3),o("sfx150818_finger_ck"),_mz_wx_custom(1)}),c.find(".sendnext").click(function(){r(),o("sfx150818_role_ck"),_mz_wx_custom(2),_mz_wx_view(2)})});