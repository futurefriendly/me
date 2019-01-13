window.addEventListener("DOMContentLoaded",function(){function e(){"pc"==browserRedirect()&&(q.style.width="375px",q.style.height="504px",S.body.style.height="504px",q.style.margin="0 auto",S.querySelector("#page-grap .dv-result").style.marginTop="0px",S.querySelector(".p-tips").style.marginTop="0px",html.style.fontSize="14.0625px",currentFontSize="14.0625px",ne.style.top="31.6rem")}function t(){le.addEventListener("click",function(e){le.style.display="none",le.style.height="100%"},!1)}function n(){function e(){p=0,window.requestNextAnimationFrame(t)}function t(e){i.drawImage(spritesheet,0,0),u.paint(i),e-p>g&&(u.painter.advance(),p=e),window.requestNextAnimationFrame(t)}if(1==W.first_layer_box)if(q.style.display="none",2==W.layerType){var n=document.getElementById("torch");n.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,n.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,n.style.display="block";for(var i=n.getContext("2d"),o=n.width,a=n.height,l=659,r=410,s=[],c=0;2>c;c++)for(var d=0;14>d;d++)s.push({left:d*r,top:c*l,width:o,height:a});var u=new Sprite("torch",new SpriteSheetPainter(s)),p=0,g=70;spritesheet.src=W.layer_source_img_url||"",u.left=0,u.top=0,e()}else{var y='<img class="torchLayer" src="'+W.layer_source1_img_url+'" alt="" width="100%" height="100%">',m=S.getElementById("torchLayer");m.innerHTML=y;var h=setTimeout(function(){m.style.display="none",q.style.display="block",clearTimeout(h)},3e3)}else q.style.display="block"}function i(){1==G.source?pe.style.display="none":W.extra_media&&"0"!=W.extra_media?"video_local"==W.extra_media?l():"video_qq"==W.extra_media?r():"audio_local"==W.extra_media&&(W.chk_audio_cover?(window.maudio,a()):(window.maudio,o())):pe.style.display="none"}function o(){if(W.audio_img_url){var e,t=function(){if(W.audio_play_color){var t=document.createElement("style");t.type="text/css",t.innerHTML=".play-audiobg-button{border-color:"+W.audio_play_color+"}.play-audiobg-button .play-icon svg{fill:"+W.audio_play_color+"}.play-audiobg-button.mute .play-icon:after{background-color:"+W.audio_play_color+"}",S.getElementsByTagName("head")[0].appendChild(t)}var n=document.createElement("div");n.id="play-audiobg-button",n.className="play-audiobg-button",n.innerHTML='<div class="play-icon"><svg version="1.1" id="图形" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve"><path class="svgpath" data-index="path_0" d="M875.52 433.152q-7.168-1.024-12.8-10.24t-8.704-33.792q-5.12-39.936-26.112-58.88t-65.024-27.136q-46.08-9.216-81.408-37.376t-58.88-52.736q-22.528-21.504-34.816-15.36t-12.288 22.528l0 44.032 0 96.256q0 57.344-0.512 123.904t-0.512 125.952l0 104.448 0 58.368q1.024 24.576-7.68 54.784t-32.768 56.832-64 45.568-99.328 22.016q-60.416 3.072-109.056-21.504t-75.264-61.952-26.112-81.92 38.4-83.456 81.92-54.272 84.992-16.896 73.216 5.632 47.616 13.312l0-289.792q0-120.832 1.024-272.384 0-29.696 15.36-48.64t40.96-22.016q21.504-3.072 35.328 8.704t28.16 32.768 35.328 47.616 56.832 52.224q30.72 23.552 53.76 33.792t43.008 18.944 39.424 20.992 43.008 39.936q23.552 26.624 28.672 55.296t0.512 52.224-14.848 38.4-17.408 13.824z" /></svg></div>',S.body.appendChild(n),e=document.getElementById("play-audiobg-button"),e.addEventListener("click",function(){maudio.paused?(i(),e.className="play-audiobg-button play"):(o(),e.className="play-audiobg-button mute")},!1),W.audio_play_bgc&&(e.style.backgroundColor=W.audio_play_bgc)},n=function(){window.maudio=document.createElement("audio"),maudio.id="h5audio_media",maudio.loop="loop",maudio.autoplay="",maudio.height="0",maudio.width="0",maudio.src=W.audio_img_url,window.maudio&&t()},i=function(t){window.maudio&&(window.maudio.play(),e&&(e.className="play-audiobg-button play"),u({videoplay:"1"}),setTimeout(function(){window.maudio.paused&&o(t)},200))},o=function(t){window.maudio&&(t&&window.fixPLay&&document.removeEventListener("touchstart",fixPLay,!1),window.maudio.pause(),e&&(e.className="play-audiobg-button mute"))};n();var a=function(){var e=W.autoplay_type;"all"==e?i(!1):getNetworkType_Weixin(function(t){t!=e&&("4g"!=e||"wifi"!=t&&"3g+"!=t)||i(!1)})};if(W.chk_autoplay)if(isWeixin())W.autoplay_type&&("undefined"==typeof WeixinJSBridge?document.addEventListener("WeixinJSBridgeReady",a,!1):a());else if(isMobile()){var l=getNetworkType_Common();if(W.autoplay_type&&(window.fixPLay=function(){i(!0)},"all"==W.autoplay_type||"wifi"==W.autoplay_type&&"wifi"==l||"4g"==W.autoplay_type&&("wifi"==l||"4g"==l))){document.addEventListener("touchstart",fixPLay,!1);try{i(!1)}catch(r){}}}else i(!1)}}function a(){if(W.audio_img_url){if(W.audio_cover_img_url){var e=ge.getElementsByTagName("img")[0];e.style.display="block",e.src=W.audio_cover_img_url,ge.style.display="block"}var t=docuW?docuW:window.innerWidth;if(t=Math.round(360*(t>750?750:t)/640),pe.style.height=t+"px",pe.style.position="absolute",ye.style.height=t+"px",ye.style.display="block",pe.style.display="block",W.audio_play_color){var n=document.createElement("style");n.type="text/css",n.innerHTML=".play-audio-button.play .play-icon:before{border-left-color:"+W.audio_play_color+";}.play-audio-button.pause .play-icon:before{border-color:"+W.audio_play_color+"}",S.getElementsByTagName("head")[0].appendChild(n)}var i,o=function(){var e=document.createElement("div");e.id="play-audio-button",e.className="play-audio-button play",e.innerHTML='<div class="play-icon"></div>',ye.innerHTML="",ye.style.zIndex=103,ye.appendChild(e),i=document.getElementById("play-audio-button"),i.addEventListener("click",function(){maudio.paused?l():r()},!1),W.audio_play_bgc&&(i.style.backgroundColor=W.audio_play_bgc)},a=function(){window.maudio=document.createElement("audio"),maudio.id="h5audio_media",maudio.autoplay="",maudio.height="0",maudio.width="0",maudio.src=W.audio_img_url,window.maudio&&o(),W.chk_full_url&&s("audio")},l=function(e){window.maudio&&(window.maudio.play(),i&&(i.className="play-audio-button pause"),u({videoplay:"1"}),setTimeout(function(){window.maudio.paused&&r(e)},200))},r=function(e){window.maudio&&(e&&window.fixPLay&&document.removeEventListener("touchstart",fixPLay,!1),window.maudio.pause(),i&&(i.className="play-audio-button play"))};a();var c=function(){var e=W.autoplay_type;"all"==e?l(!1):getNetworkType_Weixin(function(t){t!=e&&("4g"!=e||"wifi"!=t&&"3g+"!=t)||l(!1)})};if(W.chk_autoplay)if(isWeixin())W.autoplay_type&&("undefined"==typeof WeixinJSBridge?document.addEventListener("WeixinJSBridgeReady",c,!1):c());else if(isMobile()){var d=getNetworkType_Common();if(W.autoplay_type&&(window.fixPLay=function(){l(!0)},"all"==W.autoplay_type||"wifi"==W.autoplay_type&&"wifi"==d||"4g"==W.autoplay_type&&("wifi"==d||"4g"==d))){document.addEventListener("touchstart",fixPLay,!1);try{l(!1)}catch(p){}}}else l(!1)}}function l(){var e=W.video_img_url,t=W.video_cover_img_url,n=docuW?docuW:window.innerWidth;if(n=Math.round(360*(n>750?750:n)/640),ge&&ue){ue.src=e;var i=ge.getElementsByTagName("img")[0];i.style.display="block",i.src=t,ge.addEventListener("click",function(){ge.style.display="none",ye.style.display="block",ue.play(),u({videoplay:"1"})},!1),W.chk_full_url&&s("video"),ue.addEventListener("ended",function(){ge.style.display="block",ye.style.display="none"},!1),pe.style.height=n+"px",pe.style.position="absolute",ye.style.height=n+"px",ue.style.height=n+"px",pe.style.zIndex=100,pe.style.display="block"}}function r(){if(W.video_vid){var e=docuW?docuW:window.innerWidth;e=Math.round(360*(e>750?750:e)/640);var t=W.video_cover_img_url,n=ge.getElementsByTagName("img")[0];n.style.display="block",n.src=t,pe.style.height=e+"px",pe.style.position="absolute",ye.style.height=e+"px",ue.style.display="none",pe.style.zIndex=100,loadScript("http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js",function(){var t=new tvp.VideoInfo;t.setVid(W.video_vid);var n=new tvp.Player;n.create({width:"100%",height:e,video:t,modId:"video-play",autoplay:!1,isHTML5UseUI:!0,isHtml5ShowLoadingAdOnStart:!1,isHtml5ShowLoadingAdOnChange:!1,plugins:{AppBanner:!1},ongetnext:function(){},onplay:function(){},onplaying:function(e){},onchange:function(){}}),ge.addEventListener("click",function(){ge.style.display="none",ye.style.display="block",n.play(t),u({videoplay:"1"})},!1)}),W.chk_full_url&&s("video"),pe.style.display="block"}}function s(e){if(e){var t="video"==e?"查看完整版":"试听完整版",n=W.media_full_url_btn?W.media_full_url_btn:t,i=W.media_full_url_color?W.media_full_url_color:"rgba(255,255,255,1)",o=W.media_full_url_bgc?W.media_full_url_bgc:"rgba(255,255,255,1)",a=W.media_full_url;if(a){var l=document.createElement("div");l.id="full-link",l.className="full-link "+(e?"full-link-"+e:""),l.style.backgroundColor=o,l.style.borderColor=i,l.innerHTML='<div class="full-link-txt" style="color:'+i+';">'+n+"</div>",pe.appendChild(l),S.getElementById("full-link").addEventListener("click",function(){u({fulllink:"1"}),location.href=a},!1)}}}function c(){return isIos()?"ios":isAndroid()?"android":"webapp"}function d(){function e(){return 1==G.source}return isWeixin()?"weixin":isQQBrowser()?"mqq":e()?"weibo":isWeixin()||isQQBrowser()||e()||"phone"!==browserRedirect()?"pc"===browserRedirect()?"other_pc":void 0:"other_mb"}function u(e,t){var n="0";e.videoplay&&(n="1");var i=config.globalUri+"datastatistics?0=pay_hb_page&product_line="+fe.prd+"&platform="+c()+"&channel="+d()+"&phone="+we+"&type="+(e.type||"")+"&theme="+(e.theme||"")+"&position="+(e.position||"")+"&num_item="+fe.rob_cnt+"&listid="+fe.instance_id+"&videoplay="+n;L.ajax({method:"GET",url:i,succFunc:function(){"function"==typeof t&&t()},failFunc:function(){}})}function p(e,t){function n(e){L.ajax({url:Ee,method:"POST",data:{card_list:JSON.stringify(e),phone:t},succFunc:function(){},failFunc:function(){}})}if(e&&0!=e.length){var i=function(){wx.addCard({cardList:e,success:function(e){n(e.cardList)},fail:function(e){n(e.cardList)}})};"undefined"==typeof WeixinJSBridge?document.addEventListener("WeixinJSBridgeReady",i,!1):i()}}function g(e){e&&1===e.coupon_list.length&&(de.style.marginBottom="5rem","1"===W.chk_activity&&(de.style.marginBottom="2rem"))}function y(){if(P&&"1"==P.value&&""!=we&&null==S.getElementById("right-bar")){var e=document.createElement("div");e.id="right-bar",e.className=expandedClass,e.innerHTML='<div class="right-bar-inner"></div>',O.appendChild(e),S.getElementById("right-bar").addEventListener("click",function(){this.className==expandedClass?location.href="http://pay.xiaojukeji.com/growth/index_outside.html?activityID=1&recommendMobile="+we:(this.className=expandedClass,m())},!1),m()}}function m(){timeRightBar&&clearTimeout(timeRightBar),timeRightBar=setTimeout(function(){S.getElementById("right-bar").className=contractedClass},5e3)}function h(){if(S.body.style.backgroundColor=W.record_bg,q.style.backgroundColor=W.record_bg,"page-grap"===T||"page-changephone"===T||"page-exception"===T)ae.style.display="none",$.style.display="none","page-changephone"!==T&&"page-exception"!==T||!pe||(pe.style.display="none",ue.pause());else{var e=S.querySelectorAll(".dache-coupon");"1"==W.chk_activity&&($.style.display="inline-block"),isWeixin()||(de.style.display="none");var t=Y.childNodes;e.length>1&&(ie.setAttribute("id","result-dv-wrap"),Y.style.width="auto",addClass(Y,"container-center"),X.className="btns",S.querySelector("#page-result .dv-result").style.top="10.8rem",Y.parentNode.style.background=W.btn_bub_bg,1===t.length,0===t.length&&(X.style.display="none"),Te?S.body.style.height=Te+"px":S.body.style.height=parseInt(S.body.scrollHeight)+X.offsetHeight+"px"),1===e.length&&(X.style.background="rgba(0,0,0,0)",Y.style.background="rgba(0,0,0,0)",t.length>1&&($.style.marginTop="-0.3rem"),1===t.length&&"1"!=W.chk_activity&&(ae.style.marginTop="-5rem"),1===t.length,S.querySelector(".dache-coupon").style.marginTop="0.1rem"),y()}"pc"===browserRedirect()&&e&&e.length>1&&(X.style.width="375px",X.style.left=(docuW-375)/2+"px")}function b(e,t,n){n=n||"",e.addEventListener("input",function(e){var i=e.target;i.value=i.value.replace(/[^\d]/g,"").slice(0,11),/^1[3|4|5|8|7][0-9]\d{8}$/.test(i.value)?(t.className=n+"btn-orange",i.blur()):t.className=n+"btn-gray"},!1)}function f(e){function t(){var t=(window.screen.width,window.innerHeight);(isQQBrowser()||1==G.source)&&(t=window.innerHeight+54),isQQBrowser()&&isAndroid()&&(t+=40),[].forEach.call([U,O],function(e){e.style.width="100%",e.style.backgroundRepeat="no-repeat",e.style.backgroundColor=W.record_bg}),e.tel_bg_img_url&&(U.style.backgroundImage="url("+e.tel_bg_img_url+")"),e.res_bg_img_url&&(O.style.backgroundImage="url("+e.res_bg_img_url+")")}188==fe.prd?L.ajax({url:config.themeUri+encodeURIComponent(fe.instance_id),method:"GET",succFunc:function(n){var i=JSON.parse(n);i.result&&0==i.code&&(e.res_bg_img_url=i.result),t()},failFunc:function(){t()}}):t()}function _(e){for(var t=Y.querySelectorAll("a"),n=0,i=t.length;i>n;n++){var o=t[n].getAttribute("data-url");if(o){var a=replaceTemplate(o,ke,e);t[n].setAttribute("data-url",a)}}}function v(){setTimeout(function(){location.replace("http://d.xiaojukeji.com/c/70255"),location.href="http://d.xiaojukeji.com/c/70255"},1e3)}function x(e){var t={doing:"正在打开...",reset:"打开红包"};if(Le(e.target,t.doing)!==!1){var i=({10302:{tip:W.finish_txt},0:{tip:W.success_txt}},"getHongbaoAjax");we=C.value.trim(),_(we);var o=config.globalUri+i,a={phone:encodeURIComponent(C.value.trim()),user_info:JSON.stringify(V),source:S.getElementById("hid-source").value},l=["strategy_gid","prd","rob_cnt","instance_id","sign"];for(var r in fe)-1!=l.indexOf(r)&&(a[r]=fe[r]);"1"==fe.access_type&&isWeixin()?F.style.display="block":F.style.display="none",L.ajax({method:"POST",url:o,data:a,succFunc:function(i){i=L.txtToJson(i),Ce(e.target,t.reset);var o={};ve=i.errno;var a=L.txtToJson(i.card_list);if(a||(a=[]),a.length>0&&200!=fe.prd&&210!=fe.prd&&(de.style.display="block",g(i.coupon_list)),"401"==i.errno){var l={};l.tip=config.resPageStMap[i.errno],o=l}else o=config.resPageStMap[i.errno.toString()],"0"==i.errno&&(o.tip=W.res_succ),"10302"==i.errno&&(o.tip=W.res_finish);if("3"!=i.pageno)if(n(),je(o),1!=fe.access_type||0!=i.errno&&10301!=i.errno&&10302!=i.errno&&10305!=i.errno||"1"!==W.get_record||qe(i,W,i.coupon_list),0==i.errno)Ae(i.coupon_list,i),Se("page-result"),"1"==i.card_auto&&setTimeout(function(){p(a,we)},500),isWeixin()&&a.length>0&&200!=fe.prd&&210!=fe.prd&&de.addEventListener("click",function(){p(a,we)},!1),u({theme:"suc"});else{if(10301!=i.errno)Me(i.errno,i),!i.jump||"1"!=i.jump||"11006"!=i.errno&&"401"!=i.errno&&"10305"!=i.errno&&"10302"!=i.errno||v();else{isWeixin()&&200!=fe.prd&&210!=fe.prd&&de.addEventListener("click",function(){p(L.txtToJson(i.card_list),we)},!1),Ae(i.coupon_list,i);var o={};o=i.coupon_list&&"[object Array]"===Object.prototype.toString.call(i.coupon_list)&&i.coupon_list.length>0?config.resPageStMap[10301]:config.resPageStMap[10305],je(o),u({theme:"repeat"})}Se("page-result")}else location.href="http://static.diditaxi.com.cn/activity/pages/serverbusy/serverbusy.html?datatype=driver&errmsg="+i.errmsg+"&errno="+i.errno+"&phone="+we},failFunc:function(){alert("对不起服务器错误,请稍后再试."),Ne(e.target,t.reset)}})}}var w=!1;if(w);var k,E,T,B,S=document,I=[],L=dd.base||{},N=dd.dialog||{},C=S.getElementById("txt-tel"),q=S.getElementById("master"),A=S.getElementById("hid-page-no"),j=S.getElementById("hid-errno"),M=S.getElementById("btn-open"),W=S.getElementById("hid-theme-config"),H=S.getElementById("hid-hb-info"),J=S.getElementById("hid-all-hb-info"),R=S.getElementById("hid-more-ticket"),P=S.getElementById("display_jump_c2c"),U=S.getElementById("page-grap"),O=S.getElementById("page-result"),z=S.getElementById("page-changephone"),F=S.getElementById("btn-modify-phone"),Q=S.getElementById("sp-origin-phone"),D=S.getElementById("tips"),K=S.getElementById("coupon-list"),G=S.getElementById("hid-source"),V=S.getElementById("hid-userInfo"),X=S.getElementById("btns"),Y=S.getElementById("btns-container"),$=S.getElementById("activity"),Z=activity.querySelector(".activity-title"),ee=activity.querySelector(".activity-content"),te=S.querySelector(".result-header-wrap"),ne=S.querySelector(".dv-wrap-posi"),ie=S.querySelector(".dv-wrap-posi2"),oe=S.getElementById("ul-list"),ae=S.getElementById("dv-list"),le=S.getElementById("dv-cover"),re=S.getElementById("hid-cardlist"),se=S.getElementById("hid-configlist"),ce=S.getElementById("hid-autocard").value,de=S.getElementById("btn-addCard"),ue=S.querySelector("video"),pe=S.getElementById("div-video"),ge=S.getElementById("video-show"),ye=S.getElementById("video-play");e();var me=function(e){var t=function(){WeixinJSBridge&&(k=WeixinJSBridge,k.call("showOptionMenu"),k.call("hideToolbar"),"function"==typeof e&&e())};"undefined"==typeof WeixinJSBridge?S.addEventListener("WeixinJSBridgeReady",t):t()},he=function(e){var t=function(){AlipayJSBridge&&(E=AlipayJSBridge,E.call("showOptionMenu"),"function"==typeof e&&e())};"undefined"==typeof AlipayJSBridge?S.addEventListener("AlipayJSBridgeReady",t,!1):t()};t();var be=["page-grap","page-result","page-exception","page-changephone"],fe=L.txtToJson(H.value);W=L.txtToJson(W.value),W=L.txtToJson(W.ti_info);var _e=L.txtToJson(J.value),ve=L.txtToJson(_e.create)||{};R=L.txtToJson(R.value)||{},G=L.txtToJson(G.value),V=L.txtToJson(V.value),re=L.txtToJson(re.value),se=L.txtToJson(se.value);var xe=j.value,we=V.phone,ke="{phone}",Ee=config.globalUri+"bindCardCallBack",Te=0;spritesheet=new Image,2==A.value?n():q.style.display="block",i(),isWeixin()&&se&&wx.config({debug:!1,appId:se.appId,timestamp:se.timestamp,nonceStr:se.nonceStr,signature:se.signature,jsApiList:["addCard"]});var Be=function(e,t){if(t&&"0"!==t){if("1"===e&&"2"===t&&(T="page-exception"),"3"===e){var n=["1","3","4","6","7"];n.contain(t)&&(T="page-result")}"2"===e&&Se("page-result")}else{var i=sessionStorage.SEARCH_NEW_CURRENT_PAGE;T=e.length||!i?config.pageMap[e]:i}T=T||"page-exception"},Se=function(e){if(I.length){for(var t,n,i=I.length-1;i>=0;i--)t=I[i],n=t&&t.dom,n&&(n.style.display=e===t.id||e===n?"inline-block":"none");T=e,sessionStorage.SEARCH_NEW_CURRENT_PAGE=e,h(),"page-grap"==T&&u({theme:"input"})}};window.timeRightBar=0,window.expandedClass="right-bar-expanded",window.contractedClass="right-bar-contracted";var Ie=function(e){var t=S.getElementById("d-wall"),n=S.getElementById("d-wrap");t&&(t.style.display="none"),n&&(n.style.display="none"),"function"==typeof e&&e()},Le=function(e,t){return"btn-orange"!==e.className?!1:(N.loading("正在加载",3e3),e.className="btn-gray",innerText(e,t),void C.blur())},Ne=function(e,t){Ie(function(){e.className="btn-orange",t=t||"确认",innerText(e,t)})},Ce=function(e,t){Ie(function(){e.className="btn-gray",t=t||"确认",innerText(e,t),C.value=""})},qe=function(e,t,n){if(e&&e.list_info&&"1"===t.get_record){var i=e.list_info;if(L.isArray(i)){if(i.length<1)return void(ae.style.display="none");var o=[],a=t.record_col,l=parseInt(t.record_count);i.length>l&&(i=i.slice(0,l)),hbUtils.map(i,function(e){e=L.txtToJson(e);var n=0,i=e.nickname,l=e.bottom_text;null!=e.amount&&"undefined"!=typeof e.amount||(e.amount=1),n=isNaN(e.amount)?"1":"number"==typeof e.amount?e.amount.toFixed(2):parseFloat(e.amount).toFixed(2),i=getStringLength(i)>10?subString(i,10):i,1==t.head_icon?o.push('<li class="grap-list-li" style="border-bottom:1px solid rgba('+a+',0.05);"><div class="d-wx-photo" style="position:relative;margin-right:5px; width:31px; height: 32px; background: url('+e.head_url+') no-repeat top left; background-size: 31px 32px;"><img class="xiaohuoju" src="'+t.head_icon_img_url+'"></div><div class="d-hb-detail"><p><span style="color:rgba('+a+',1.0);font-size:1rem;padding-left:1px">'+html2Escape(i)+'</span><span class="hbfont" style="font-size:1rem;color:rgba('+a+',0.2)">'+e.create_time+'</span><b class="hb_amount">'+n+'元</b></p><p class="comment_tx" style="color:rgba('+a+',0.8);font-size:1rem;">'+l+"</p></div></li>"):o.push('<li class="grap-list-li" style="border-bottom:1px solid rgba('+a+',0.05);"><div class="d-wx-photo" style="position:relative;margin-right:5px; width:31px; height: 32px; background: url('+e.head_url+') no-repeat top left; background-size: 31px 32px;"></div><div class="d-hb-detail"><p><span style="color:rgba('+a+',1.0);font-size:1rem;padding-left:1px">'+html2Escape(i)+'</span><span class="hbfont" style="font-size:1rem;color:rgba('+a+',0.2)">'+e.create_time+'</span><b class="hb_amount">'+n+'元</b></p><p class="comment_tx" style="color:rgba('+a+',0.8);font-size:1rem;">'+l+"</p></div></li>")}),ae.querySelector(".hr-tip").style.backgroundColor="rgba("+a+",0.05)",ae.querySelector(".hr-tip span").style.color="rgba("+a+",0.8)",ae.querySelector(".hr-tip span").style.backgroundColor=t.record_bg,oe.innerHTML=o.join(""),ae.style.display="block",ae.style.backgroundColor=t.record_bg;var r=S.getElementById("friends-tips");r.style.background=t.record_bg,r.style.color="rgba("+a+",0.6)",r.innerHTML=t.bottom_title}}},Ae=function(e,t){if(!e||"[]"==e||!e.coupon_list)return e&&e.coupon_list||console.log("Error! coupon_list is null."),void(S.getElementById("tips").style.display="none");var n=[],i={200:{title:"专车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/zhuanche-new.png')",couponType:"coupon_type_zhuanche"},100:{title:"出租车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/chuzuche-new.png')",couponType:"coupon_type_chuzuche"},210:{title:"快车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/kuaiche-new.png')",couponType:"coupon_type_kuaiche"},150:{title:"顺风车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/shunfengche-new.png')",couponType:"coupon_type_shunfengche"},188:{title:"试驾券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/shichengshijia-new.png')",couponType:"coupon_type_shichengshijia"},184:{title:"巴士券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/bashi-new.png')",couponType:"coupon_type_bashi"},186:{title:"巴士包车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/bashi-new.png')",couponType:"coupon_type_bashibaoche"},120:{title:"代驾券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/daijia-new.png')",couponType:"coupon_type_daijia"},300:{title:"饿了么满减券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/shangjia.png')",couponType:"coupon-type-third"}},o="",a="";(t.click_coupon_jump&&"1"==t.click_coupon_jump||e.click_coupon_jump&&"1"==e.click_coupon_jump)&&(o='<a style="display:block;height:100%;margin-top:0;" href="http://d.xiaojukeji.com/c/70263">',a="</a>");var l='<h3 class="coupon-group-title"><b>{num}</b>张{name}，价值{amount}元</h3>',r="",s="";r=l.replace("{num}",e.number),r=r.replace("{amount}",e.amount),r=r.replace("{name}","出行券"),e.third_number&&(s=l.replace("{num}",e.third_number),s=s.replace("{amount}",e.third_amount),s=s.replace("{name}","商家券"));var c={},d=!1;[].map.call(e.coupon_list,function(e,t){var n="",l=e.useType||"normal",r="",s=[];r=i[e.productid].title,"business"==l&&(n="coupon-business",r=e.title,d=!0),w?s.push('<div class="dache-coupon olympic" id="'+i[e.productid].couponType+'" style="background-image:url(http://static.diditaxi.com.cn/activity/img-hb/v3/quanhuoju.jpg)">'+o+'<span class="couponTitle">'+i[e.productid].title+"</span>"):s.push('<div class="dache-coupon '+n+'" id="'+i[e.productid].couponType+'" style="background-image:'+i[e.productid].bg+'">'+o+'<span class="couponTitle">'+r+"</span>");var u="";if(e.remark&&(u='<div class="counpon-remark">'+e.remark+"</div>"),"100"===e.couponType){var p=e.discount.toString()[0],g=e.discount.toString()[1];s.push('<label id="lbl-amount" class="lbl-amount">'+p+'<span class="yuan">.'+g+"折</span></label>"+u)}else if("103"==e.couponType){var y=(e.vMount/100).toString(),m=y.length>=3?"2rem":"4.5rem",h=y.length>=3?"500":"300";s.push('<label id="lbl-amount" class="lbl-amount" style="font-size:'+m+";font-weight:"+h+'"><span class="yuan only-pay">仅需支付 </span>'+y+"</label>"+u)}else s.push('<label id="lbl-amount" class="lbl-amount"><span class="yuan">￥ </span>'+e.amount+"</label>"+u);"business"==l&&s.push('<span class="coupon-logo" style="background-image: url('+e.logo+')"></span'),s.push(a+"</div>"),c[l]||(c[l]=""),c[l]+=s.join("")}),n="";for(var p in c){var g=c[p];n+="business"==p?s:r,n+=d?'<div class="coupon-group" data-category="'+p+'">'+g+"</div>":g}d&&(O.className=(O.className||"")+" with-third-coupon"),K.innerHTML=n;var y=S.getElementById("sp-change-phone"),m=t.phone||"";innerText(y,m),1!=fe.access_type||!isWeixin()&&1!=G.source||(F.style.display="inline-block");var h=document.querySelectorAll(".coupon-group");h.length&&[].forEach.call(h,function(e,t){var n={x:0,y:0},i=0,o=0,a="";e.addEventListener("touchstart",function(e){var t=e,i=t.changedTouches[0];return n.x=i.pageX,n.y=i.pageY,!1},!1),e.addEventListener("touchmove",function(e){var t=e;t.changedTouches[0]},!1),e.addEventListener("touchend",function(e){var t=e,l=t.changedTouches[0],r="";i=l.pageX-n.x,o=l.pageY-n.y,a=i>0?"right":"left",Math.abs(i)>=40&&(r=this.getAttribute("data-category"),"left"!=a||this._leftStatistics?"right"!=a||this._rightStatistics||(this._rightStatistics=!0,u({type:"coupon-scroll-right",position:r})):(this._leftStatistics=!0,u({type:"coupon-scroll-left",position:r})))},!1)})};b(C,M);var je=function(e){if(e&&e.tip){var t=S.getElementById("result-bubble-2");t.innerHTML=e.tip}},Me=function(e,t){if(10301!=e&&0!=e){var n=S.querySelector(".dv-result-tips");if(n.style.display="block",X&&(X.style.display="block"),X){var i=S.querySelector("#page-result .dv-result");i.style.minHeight="10rem",i.style.marginTop="10rem"}D&&(D.style.display="none"),de.style.display="none",f(W);var o=L.getElesByKls(U,"dv-result");L.getElesByKls(O,"dv-result");hbUtils.map([o[0]],function(e){e.style.display="none"}),W.tel_bg_img_url&&(O.style.backgroundImage="url("+W.tel_bg_img_url+")"),te.setAttribute("id","result-header-wrap"),ie.setAttribute("id","expection-result-wrap"),te.style.position="absolute",te.style.left="0",te.style.width="100%",te.querySelector(".tip-bubble").style.background="rgba(0,0,0,0)",Y.parentNode.style.background="rgba(0,0,0,0)",S.getElementById("result-bubble-2").style.textAlign="center",10302!=e&&je(config.resPageStMap[e]),10302==e&&je({tip:W.res_finish}),S.querySelector("#result-bubble-1").style.display="none",10302!=e&&10305!=e&&(oe.style.display="none"),X.className="",$.style.display="none",de.style.display="none";var a={10302:"finish",11006:"expire",10305:"unlucky"},l=["10302","11006","10305"];return-1!=l.indexOf(e)?void u({theme:a[e]}):void u({theme:"other"})}};M.addEventListener("click",function(e){x(e)},!1);var We=function(e){if(e){var t=L.getElesByKls(S.body,"owner-logo");hbUtils.map(t,function(t){t.style.backgroundImage="url("+e+")",w&&(t.innerHTML='<img class="dahuoju" src="http://static.diditaxi.com.cn/activity/img-hb/v3/dahuoju.jpg">')}),t[0].style.opacity=W.tel_head_opacity}},He=function(e){if(e){var t=L.getElesByKls(S.body,"owner-logo"),n="";hbUtils.map(t,function(t){t.innerHTML='<i style="background-image:url('+e+')"></i>',n&&t.addEventListener("click",function(){location.href=n},!1)})}},Je=function(e){e||(e="滴滴"),e=e=getStringLength(e)>12?subString(e,12):e;var t=S.querySelectorAll(".nickname");hbUtils.map(t,function(t){innerText(t,"我是"+e+",")})},Re=function(e,t){if(e&&L.isObject(e)){var n=function(e){var n="我是滴滴",i=S.getElementById("grap-bubble-1"),o=S.getElementById("grap-bubble-2"),a=S.getElementById("result-bubble-1"),l=S.getElementById("result-bubble-2"),r=S.querySelector("#page-result .tip-bubble"),s=S.createElement("i");i.style.color=e.tel_bub_col,o.style.color=e.tel_bub_col,a.style.color=e.res_bub_txt_col,l.style.color=e.res_bub_txt_col,S.querySelector(".p-tips").style.color=e.res_bub_txt_col,r.style.backgroundColor=e.res_bub_bg_col,s.className="tip-bubble-arrow",s.style.borderRightColor=e.res_bub_bg_col,r.appendChild(s),"1"===e.chk_sendman?e.send_name=e.send_name||n:e.send_name=n,e.send_name=getStringLength(e.send_name)>12?subString(e.send_name,12):e.send_name,1!=fe.access_type&&innerText(i,e.send_name+","),innerText(i,e.send_name),innerText(o,e.tel_bub_txt||""),1==fe.access_type?a.innerHTML='<span class="nickname">'+e.send_name+"</span>":a.innerHTML=(html2Escape(e.send_name)+","||"")+'<span class="nickname"></span>',innerText(l,e.res_succ||""),t&&"object"==typeof t&&"page-result"===T&&(0==t.errno?(innerText(o,e.res_succ||""),innerText(l,e.res_succ||"")):10302==t.errno&&(innerText(o,e.res_finish||""),innerText(l,e.res_finish||"")))},i=function(e){var t=S.getElementById("ul-list"),n=S.getElementById("dv-list"),i=t.getElementsByTagName("li");n.style.backgroundColor=e.record_bg,hbUtils.map(i,function(t){t.style.borderBottomColor=e.get_line_color,t.getElementsByTagName("b")[0].style.color=e.get_hig_color})},o=function(e,t){function n(e,t){var n=S.createElement("a");return n.setAttribute("class","btn-orange"),n.setAttribute("id",e),n.setAttribute("data-url",t?t:""),Y.appendChild(n),innerText(n,e),n.addEventListener("touchstart",function(e){"btn-orange"===e.target.className&&(e.target.style.backgroundColor="#ee7f00")},!1),n.addEventListener("touchend",function(e){"btn-orange"===e.target.className&&(e.target.style.backgroundColor="#ff8a01")},!1),n}function i(){return 0==xe?"suc":10302==xe?"finish":10301==xe?"repeat":11006==xe?"expire":10305==xe?"unlucky":"other"}var o=0,a=L.getElesByKls(O,"btn-orange");if("1"===e.chk_btn_01){o++;var l=replaceTemplate(e.btn_link_01,ke,we),r=n(e.btn_name_01,l);r.addEventListener("click",function(){u({type:"button_1",position:"1",theme:i()}),location.href=r.getAttribute("data-url")},!1)}if("1"===e.chk_btn_02){o++;var l=replaceTemplate(e.btn_link_02,ke,we),s=n(e.btn_name_02,l);s.addEventListener("click",function(){u({type:"button_2",position:"2",theme:i()}),location.href=s.getAttribute("data-url")},!1)}if("1"===e.chk_btn_03&&!isWeixin()&&"phone"==browserRedirect()){o++;var c=n(e.btn_name_03,e.btn_link_03);c.setAttribute("href","javascript:void(0)"),isQQBrowser()?L.touch(c,function(e){u({type:"button_3",position:"3",theme:i()}),e.preventDefault(),mqq.ui.showShareMenu()}):c.addEventListener("click",function(e){u({type:"button_3",position:"3",theme:i()}),e.preventDefault(),le.style.display="block",le.style.height=document.body.clientHeight+"px",document.body.scrollTop=0,"undefined"!=typeof App&&App.trigger("scrollTo",0)},!1)}if("1"===e.chk_btn_04&&2>=o,!1){o++;var l=replaceTemplate(e.btn_link_04,ke,we),d=n(e.btn_name_04,l);d.addEventListener("click",function(){u({type:"button_3",position:"3",theme:i()}),location.href=d.getAttribute("data-url")},!1)}1==o?addClass(Y,"btns-num-one"):2==o?addClass(Y,"btns-num-two"):3===o&&(addClass(Y,"btns-num-three"),addClass(a[0],"btn-light"),addClass(a[1],"btn-light"))},a=function(e){"1"===e.chk_activity&&($.style.display="inline-block",innerText(Z,e.act_title),ee.innerHTML=e.act_cont?e.act_cont:"",$.style.color=e.act_col)};innerText(M,e.tel_btn_txt||"领取打车券"),We(e.send_img_url),n(e),i(e),o(e,t),a(e),q.style.background=e.record_bg}};!function(){function e(){if(getQueryString("flag")&&1!=getQueryString("flag")){var e=S.getElementById("phoneTxt");innerText(e,""),C.readOnly=!0,C.value=getQueryString("mobile"),M.className="btn-orange"}}function t(){if("2"===a&&1==fe.access_type&&_e){if(0!=l&&10301!=l||Ae(R,V),10301==l){var e={};e=R.coupon_list&&"[object Array]"===Object.prototype.toString.call(R.coupon_list)&&R.coupon_list.length>0?config.resPageStMap[10301]:config.resPageStMap[10305],je(e)}ve.nickname&&ve.head_url&&(We(ve.head_url),Je(ve.nickname),He(ve.level_icon_url)),1!=W.get_record||0!=l&&10301!=l&&10302!=l&&10305!=l||qe(_e,W,R.coupon_list||[])}}function n(){"undefined"!=typeof App&&App.trigger("setBrowserTitle","滴滴出行"),"undefined"!=typeof App&&"1"===W.chk_weibo&&App.trigger("setShareDefaultText",W.weibo_cont)}function i(){"1"===W.chk_share?(B=hbUtils.genShareInfo(W),me(function(){dd.share.shareAll(k,B)}),"undefined"!=typeof mqq&&mqq.data.setShareInfo({title:B.appmsg.title,
desc:B.appmsg.desc,image_url:B.appmsg.img_url},function(e){}),he(function(){var e=document.createElement("meta");e.name="Alipay:title",e.content=S.title=B.appmsg.title,S.getElementsByTagName("head")[0].appendChild(e),e.name="Alipay:desc",e.content=B.appmsg.desc,S.getElementsByTagName("head")[0].appendChild(e),e.name="Alipay:imgUrl";var t=new Image;t.src=B.appmsg.img_url,t.onload=function(){e.content=B.appmsg.img_url,S.getElementsByTagName("head")[0].appendChild(e),delete e}})):(me(function(){k.call("hideOptionMenu")}),he(function(){E.call("hideOptionMenu")}))}function o(){h&&(L.touch(h,function(){}),h.addEventListener("click",function(){}))}var a=A.value,l=j.value,r=function(e){hbUtils.map(e,function(e){var t=S.getElementById(e);I.push({id:e,dom:t})})};r(be),hbUtils.compatibilityPlaceHolder([C]),Be(a,l),Re(W,{errno:l}),f(W),e();var s=S.getElementById("checked-box"),c=S.querySelector(".didi-activity");c.addEventListener("click",function(e){"linkbox"!==e.target.id&&("checked"===s.className?s.className="unchecked":s.className="checked")},!1),2==a&&(0==l&&u({theme:"suc"}),10301==l&&u({theme:"repeat"}),0===re.length&&(de.style.display="none"),"1"==ce&&0==l&&setTimeout(function(){p(re,V.phone)},500),isWeixin()&&(0==l||10301==l)&&re.length>0&&200!=fe.prd&&210!=fe.prd&&(de.style.display="block",g(R),de.addEventListener("click",function(){p(re,V.phone)},!1))),t(),Se(T),Me(l),n(),i();var d=S.getElementById("hid-new-sign");d.value=fe.sign;var y=S.querySelector(".div-btn-confirm"),m=S.getElementById("sp-change-phone"),h=S.querySelector("#sp-change-phone a"),_=S.getElementById("hid-newphone"),v=S.querySelector("#div-new-phone input");o(),L.touch(F,function(){window.scrollTo(0,0),Se("page-changephone"),Te=S.body.style.height,1==fe.access_type&&(ae.style.display="none"),Q.innerText=_.value?_.value:m.innerText,v.value="",y.className="div-btn-confirm btn-gray",b(v,y,"div-btn-confirm ")}),z.addEventListener("touchmove",function(e){e.preventDefault()},!1),L.touch(y,function(){if("div-btn-confirm btn-gray"!=y.className){N.loading("正在加载",1500);var e=config.globalUri+"changeBindPhone";L.ajax({url:e,method:"POST",data:{phone:encodeURIComponent(Q.innerText),user_info:JSON.stringify(V),source:S.getElementById("hid-source").value,new_phone:encodeURIComponent(v.value),sign:encodeURIComponent(fe.sign),instance_id:fe.instance_id},succFunc:function(e){if(e=L.txtToJson(e),0==e.errno){if(alert("手机号修改成功"),_.value=v.value,Se("page-result"),1==fe.access_type&&1==W.get_record){var t=S.getElementById("dv-list");t.style.display="block"}}else alert(e.errmsg)},failFunc:function(e){Se("page-exception")}})}})}()},!1);