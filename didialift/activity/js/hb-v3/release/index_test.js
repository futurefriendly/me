window.addEventListener("DOMContentLoaded",function(){function W(){"pc"==browserRedirect()&&(l.style.width="375px",l.style.height="504px",c.body.style.height="504px",l.style.margin="0 auto",c.querySelector("#page-grap .dv-result").style.marginTop="0px",c.querySelector(".p-tips").style.marginTop="0px",hb.style.fontSize="14.0625px",currentFontSize="14.0625px",J.style.top="31.6rem")}function Z(){N.addEventListener("click",function(){N.style.display="none",N.style.height="100%"},!1)}function lb(){1==B.source?T.style.display="none":p.extra_media&&"0"!=p.extra_media?"video_local"==p.extra_media?ob():"video_qq"==p.extra_media?pb():"audio_local"==p.extra_media&&(p.chk_audio_cover?(window.maudio,nb()):(window.maudio,mb())):T.style.display="none"}function mb(){var a,b,d,e,f,g,h;if(p.audio_img_url&&(b=function(){var b,d;p.audio_play_color&&(b=document.createElement("style"),b.type="text/css",b.innerHTML=".play-audiobg-button{border-color:"+p.audio_play_color+"}.play-audiobg-button .play-icon svg{fill:"+p.audio_play_color+"}.play-audiobg-button.mute .play-icon:after{background-color:"+p.audio_play_color+"}",c.getElementsByTagName("head")[0].appendChild(b)),d=document.createElement("div"),d.id="play-audiobg-button",d.className="play-audiobg-button",d.innerHTML='<div class="play-icon"><svg version="1.1" id="图形" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1024px" height="1024px" viewBox="0 0 1024 1024" enable-background="new 0 0 1024 1024" xml:space="preserve"><path class="svgpath" data-index="path_0" d="M875.52 433.152q-7.168-1.024-12.8-10.24t-8.704-33.792q-5.12-39.936-26.112-58.88t-65.024-27.136q-46.08-9.216-81.408-37.376t-58.88-52.736q-22.528-21.504-34.816-15.36t-12.288 22.528l0 44.032 0 96.256q0 57.344-0.512 123.904t-0.512 125.952l0 104.448 0 58.368q1.024 24.576-7.68 54.784t-32.768 56.832-64 45.568-99.328 22.016q-60.416 3.072-109.056-21.504t-75.264-61.952-26.112-81.92 38.4-83.456 81.92-54.272 84.992-16.896 73.216 5.632 47.616 13.312l0-289.792q0-120.832 1.024-272.384 0-29.696 15.36-48.64t40.96-22.016q21.504-3.072 35.328 8.704t28.16 32.768 35.328 47.616 56.832 52.224q30.72 23.552 53.76 33.792t43.008 18.944 39.424 20.992 43.008 39.936q23.552 26.624 28.672 55.296t0.512 52.224-14.848 38.4-17.408 13.824z" /></svg></div>',c.body.appendChild(d),a=document.getElementById("play-audiobg-button"),a.addEventListener("click",function(){maudio.paused?(e(),a.className="play-audiobg-button play"):(f(),a.className="play-audiobg-button mute")},!1),p.audio_play_bgc&&(a.style.backgroundColor=p.audio_play_bgc)},d=function(){window.maudio=document.createElement("audio"),maudio.id="h5audio_media",maudio.loop="loop",maudio.autoplay="",maudio.height="0",maudio.width="0",maudio.src=p.audio_img_url,window.maudio&&b()},e=function(b){window.maudio&&(window.maudio.play(),a&&(a.className="play-audiobg-button play"),tb({videoplay:"1"}),setTimeout(function(){window.maudio.paused&&f(b)},200))},f=function(b){window.maudio&&(b&&window.fixPLay&&document.removeEventListener("touchstart",fixPLay,!1),window.maudio.pause(),a&&(a.className="play-audiobg-button mute"))},d(),g=function(){var a=p.autoplay_type;"all"==a?e(!1):getNetworkType_Weixin(function(b){(b==a||"4g"==a&&("wifi"==b||"3g+"==b))&&e(!1)})},p.chk_autoplay))if(isWeixin())p.autoplay_type&&("undefined"==typeof WeixinJSBridge?document.addEventListener("WeixinJSBridgeReady",g,!1):g());else if(isMobile()){if(h=getNetworkType_Common(),p.autoplay_type&&(window.fixPLay=function(){e(!0)},"all"==p.autoplay_type||"wifi"==p.autoplay_type&&"wifi"==h||"4g"==p.autoplay_type&&("wifi"==h||"4g"==h))){document.addEventListener("touchstart",fixPLay,!1);try{e(!1)}catch(i){}}}else e(!1)}function nb(){var a,b,d,e,f,g,h,i,j,k;if(p.audio_img_url&&(p.audio_cover_img_url&&(a=U.getElementsByTagName("img")[0],a.style.display="block",a.src=p.audio_cover_img_url,U.style.display="block"),b=docuW?docuW:window.innerWidth,b=Math.round(360*(b>750?750:b)/640),T.style.height=b+"px",T.style.position="absolute",V.style.height=b+"px",V.style.display="block",T.style.display="block",p.audio_play_color&&(d=document.createElement("style"),d.type="text/css",d.innerHTML=".play-audio-button.play .play-icon:before{border-left-color:"+p.audio_play_color+";}.play-audio-button.pause .play-icon:before{border-color:"+p.audio_play_color+"}",c.getElementsByTagName("head")[0].appendChild(d)),f=function(){var a=document.createElement("div");a.id="play-audio-button",a.className="play-audio-button play",a.innerHTML='<div class="play-icon"></div>',V.innerHTML="",V.style.zIndex=103,V.appendChild(a),e=document.getElementById("play-audio-button"),e.addEventListener("click",function(){maudio.paused?h():i()},!1),p.audio_play_bgc&&(e.style.backgroundColor=p.audio_play_bgc)},g=function(){window.maudio=document.createElement("audio"),maudio.id="h5audio_media",maudio.autoplay="",maudio.height="0",maudio.width="0",maudio.src=p.audio_img_url,window.maudio&&f(),p.chk_full_url&&qb("audio")},h=function(a){window.maudio&&(window.maudio.play(),e&&(e.className="play-audio-button pause"),tb({videoplay:"1"}),setTimeout(function(){window.maudio.paused&&i(a)},200))},i=function(a){window.maudio&&(a&&window.fixPLay&&document.removeEventListener("touchstart",fixPLay,!1),window.maudio.pause(),e&&(e.className="play-audio-button play"))},g(),j=function(){var a=p.autoplay_type;"all"==a?h(!1):getNetworkType_Weixin(function(b){(b==a||"4g"==a&&("wifi"==b||"3g+"==b))&&h(!1)})},p.chk_autoplay))if(isWeixin())p.autoplay_type&&("undefined"==typeof WeixinJSBridge?document.addEventListener("WeixinJSBridgeReady",j,!1):j());else if(isMobile()){if(k=getNetworkType_Common(),p.autoplay_type&&(window.fixPLay=function(){h(!0)},"all"==p.autoplay_type||"wifi"==p.autoplay_type&&"wifi"==k||"4g"==p.autoplay_type&&("wifi"==k||"4g"==k))){document.addEventListener("touchstart",fixPLay,!1);try{h(!1)}catch(l){}}}else h(!1)}function ob(){var d,a=p.video_img_url,b=p.video_cover_img_url,c=docuW?docuW:window.innerWidth;c=Math.round(360*(c>750?750:c)/640),U&&S&&(S.src=a,d=U.getElementsByTagName("img")[0],d.style.display="block",d.src=b,U.addEventListener("click",function(){U.style.display="none",V.style.display="block",S.play(),tb({videoplay:"1"})},!1),p.chk_full_url&&qb("video"),S.addEventListener("ended",function(){U.style.display="block",V.style.display="none"},!1),T.style.height=c+"px",T.style.position="absolute",V.style.height=c+"px",S.style.height=c+"px",T.style.zIndex=100,T.style.display="block")}function pb(){var a,b,c;p.video_vid&&(a=docuW?docuW:window.innerWidth,a=Math.round(360*(a>750?750:a)/640),b=p.video_cover_img_url,c=U.getElementsByTagName("img")[0],c.style.display="block",c.src=b,T.style.height=a+"px",T.style.position="absolute",V.style.height=a+"px",S.style.display="none",T.style.zIndex=100,loadScript("http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2.js",function(){var c,b=new tvp.VideoInfo;b.setVid(p.video_vid),c=new tvp.Player,c.create({width:"100%",height:a,video:b,modId:"video-play",autoplay:!1,isHTML5UseUI:!0,isHtml5ShowLoadingAdOnStart:!1,isHtml5ShowLoadingAdOnChange:!1,plugins:{AppBanner:!1},ongetnext:function(){},onplay:function(){},onplaying:function(){},onchange:function(){}}),U.addEventListener("click",function(){U.style.display="none",V.style.display="block",c.play(b),tb({videoplay:"1"})},!1)}),p.chk_full_url&&qb("video"),T.style.display="block")}function qb(a){var b,d,e,f,g,h;a&&(b="video"==a?"查看完整版":"试听完整版",d=p.media_full_url_btn?p.media_full_url_btn:b,e=p.media_full_url_color?p.media_full_url_color:"rgba(255,255,255,1)",f=p.media_full_url_bgc?p.media_full_url_bgc:"rgba(255,255,255,1)",g=p.media_full_url,g&&(h=document.createElement("div"),h.id="full-link",h.className="full-link "+(a?"full-link-"+a:""),h.style.backgroundColor=f,h.style.borderColor=e,h.innerHTML='<div class="full-link-txt" style="color:'+e+';">'+d+"</div>",T.appendChild(h),c.getElementById("full-link").addEventListener("click",function(){tb({fulllink:"1"}),location.href=g},!1)))}function rb(){return isIos()?"ios":isAndroid()?"android":"webapp"}function sb(){function a(){return 1==B.source?!0:!1}return isWeixin()?"weixin":isQQBrowser()?"mqq":a()?"weibo":isWeixin()||isQQBrowser()||a()||"phone"!==browserRedirect()?"pc"===browserRedirect()?"other_pc":void 0:"other_mb"}function tb(a,b){var d,c="0";a.videoplay&&(c="1"),d=config.globalUri+"datastatistics?0=pay_hb_page&product_line="+_.prd+"&platform="+rb()+"&channel="+sb()+"&phone="+db+"&type="+(a.type||"")+"&theme="+(a.theme||"")+"&position="+(a.position||"")+"&num_item="+_.rob_cnt+"&listid="+_.instance_id+"&videoplay="+c,i.ajax({method:"GET",url:d,succFunc:function(){"function"==typeof b&&b()},failFunc:function(){}})}function ub(a,b){function c(a){i.ajax({url:fb,method:"POST",data:{card_list:JSON.stringify(a),phone:b},succFunc:function(){},failFunc:function(){}})}if(a&&0!=a.length){var d=function(){wx.addCard({cardList:a,success:function(a){c(a.cardList)},fail:function(a){c(a.cardList)}})};"undefined"==typeof WeixinJSBridge?document.addEventListener("WeixinJSBridgeReady",d,!1):d()}}function vb(a){a&&1===a.coupon_list.length&&(R.style.marginBottom="5rem","1"===p.chk_activity&&(R.style.marginBottom="2rem"))}function yb(){if(t&&"1"==t.value&&""!=db&&null==c.getElementById("right-bar")){var a=document.createElement("div");a.id="right-bar",a.className=expandedClass,a.innerHTML='<div class="right-bar-inner"></div>',v.appendChild(a),c.getElementById("right-bar").addEventListener("click",function(){this.className==expandedClass?location.href="http://pay.xiaojukeji.com/growth/index_outside.html?activityID=1&recommendMobile="+db:(this.className=expandedClass,zb())},!1),zb()}}function zb(){timeRightBar&&clearTimeout(timeRightBar),timeRightBar=setTimeout(function(){c.getElementById("right-bar").className=contractedClass},5e3)}function Ab(){var a,b;"1"==p.first_layer_box&&"2"==p.layerType?(c.body.style.backgroundColor="#400f0b",l.style.backgroundColor="#400f0b"):(c.body.style.backgroundColor=p.record_bg,hb.style.backgroundColor=p.record_bg,l.style.backgroundColor=p.record_bg),"page-grap"===g||"page-changephone"===g||"page-exception"===g?(M.style.display="none",F.style.display="none","page-changephone"!==g&&"page-exception"!==g||!T||(T.style.display="none",S.pause())):(a=c.querySelectorAll(".dache-coupon"),"1"==p.chk_activity&&(F.style.display="inline-block"),isWeixin()||(R.style.display="none"),b=E.childNodes,a.length>1&&(K.setAttribute("id","result-dv-wrap"),E.style.width="89%",E.style.marginLeft="1.3rem",D.className="btns",c.querySelector("#page-result .dv-result").style.top="10.8rem",E.parentNode.style.background=p.btn_bub_bg,E.style.marginTop="0.3rem",1===b.length&&(D.style.height="6rem",b[0].style.marginTop="1rem"),0===b.length&&(D.style.display="none"),c.body.style.height=gb?gb+"px":parseInt(c.body.scrollHeight)+D.offsetHeight+"px"),1===a.length&&(D.style.background="rgba(0,0,0,0)",E.style.background="rgba(0,0,0,0)",b.length>1&&(F.style.marginTop="-0.3rem"),1===b.length&&"1"!=p.chk_activity&&(M.style.marginTop="-5rem"),1===b.length&&(D.style.height="6rem",b[0].style.marginTop="1rem"),c.querySelector(".dache-coupon").style.marginTop="0.1rem"),yb()),"pc"===browserRedirect()&&a&&a.length>1&&(D.style.width="375px",D.style.left=(docuW-375)/2+"px")}function Hb(a,b,c){c=c||"",a.addEventListener("input",function(a){var d=a.target;d.value=d.value.replace(/[^\d]/g,"").slice(0,11),/^1[3|4|5|8|7][0-9]\d{8}$/.test(d.value)?(b.className=c+"btn-orange",d.blur()):b.className=c+"btn-gray"},!1)}function Jb(a){function b(){var c=(window.screen.width,window.innerHeight);(isQQBrowser()||1==B.source)&&(c=window.innerHeight+54),isQQBrowser()&&isAndroid()&&(c+=40),[].forEach.call([u,v],function(a){a.style.width="100%",a.style.backgroundRepeat="no-repeat",a.style.backgroundColor=p.record_bg}),a.tel_bg_img_url&&(u.style.backgroundImage="url("+a.tel_bg_img_url+")"),a.res_bg_img_url&&(v.style.backgroundImage="url("+a.res_bg_img_url+")")}188==_.prd?i.ajax({url:config.themeUri+encodeURIComponent(_.instance_id),method:"GET",succFunc:function(c){var d=JSON.parse(c);d.result&&0==d.code&&(a.res_bg_img_url=d.result),b()},failFunc:function(){b()}}):b()}function Lb(a){var c,d,e,f,b=E.querySelectorAll("a");for(c=0,d=b.length;d>c;c++)e=b[c].getAttribute("data-url"),e&&(f=replaceTemplate(e,eb,a),b[c].setAttribute("data-url",f))}function Mb(){setTimeout(function(){location.replace("http://d.xiaojukeji.com/c/70255"),location.href="http://d.xiaojukeji.com/c/70255"},1e3)}function Nb(a){var e,f,g,h,j,b={doing:"正在打开...",reset:"打开红包"};if(Cb(a.target,b.doing)!==!1){({10302:{tip:p.finish_txt},0:{tip:p.success_txt}}),e="getHongbaoAjax",db=k.value.trim(),Lb(db),f=config.globalUri+e,g={phone:encodeURIComponent(k.value.trim()),user_info:JSON.stringify(C),source:c.getElementById("hid-source").value},h=["strategy_gid","prd","rob_cnt","instance_id","sign"];for(j in _)-1!=h.indexOf(j)&&(g[j]=_[j]);x.style.display="1"==_.access_type&&isWeixin()?"block":"none",i.ajax({method:"POST",url:f,data:g,succFunc:function(c){var d,e,f;c=i.txtToJson(c),Eb(a.target,b.reset),d={},bb=c.errno,e=i.txtToJson(c.card_list),e||(e=[]),e.length>0&&200!=_.prd&&210!=_.prd&&(R.style.display="block",vb(c.coupon_list)),"401"==c.errno?(f={},f.tip=config.resPageStMap[c.errno],d=f):(d=config.resPageStMap[c.errno.toString()],"0"==c.errno&&(d.tip=p.res_succ),"10302"==c.errno&&(d.tip=p.res_finish)),"3"!=c.pageno?(Ib(d),1!=_.access_type||0!=c.errno&&10301!=c.errno&&10302!=c.errno&&10305!=c.errno||"1"!==p.get_record||Fb(c,p,c.coupon_list),0==c.errno?(Gb(c.coupon_list,c),xb("page-result"),"1"==c.card_auto&&setTimeout(function(){ub(e,db)},500),isWeixin()&&e.length>0&&200!=_.prd&&210!=_.prd&&R.addEventListener("click",function(){ub(e,db)},!1),tb({theme:"suc"})):(10301!=c.errno?(Kb(c.errno,c),!c.jump||"1"!=c.jump||"11006"!=c.errno&&"401"!=c.errno&&"10305"!=c.errno&&"10302"!=c.errno||Mb()):(isWeixin()&&200!=_.prd&&210!=_.prd&&R.addEventListener("click",function(){ub(i.txtToJson(c.card_list),db)},!1),Gb(c.coupon_list,c),d={},d=c.coupon_list&&"[object Array]"===Object.prototype.toString.call(c.coupon_list)&&c.coupon_list.length>0?config.resPageStMap["10301"]:config.resPageStMap["10305"],Ib(d),tb({theme:"repeat"})),xb("page-result"))):location.href="http://static.diditaxi.com.cn/activity/pages/serverbusy/serverbusy.html?datatype=driver&errmsg="+c.errmsg+"&errno="+c.errno+"&phone="+db},failFunc:function(){alert("对不起服务器错误,请稍后再试."),Db(a.target,b.reset)}})}}var e,f,g,h,c,d,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,X,Y,$,_,ab,bb,cb,db,eb,fb,gb,hb,ib,kb,wb,xb,Bb,Cb,Db,Eb,Fb,Gb,Ib,Kb,Ob,Pb,Qb,Rb,a=!0;c=document,d=[],i=dd.base||{},j=dd.dialog||{},k=c.getElementById("txt-tel"),l=c.getElementById("master"),m=c.getElementById("hid-page-no"),n=c.getElementById("hid-errno"),o=c.getElementById("btn-open"),p=c.getElementById("hid-theme-config"),q=c.getElementById("hid-hb-info"),r=c.getElementById("hid-all-hb-info"),s=c.getElementById("hid-more-ticket"),t=c.getElementById("display_jump_c2c"),u=c.getElementById("page-grap"),v=c.getElementById("page-result"),w=c.getElementById("page-changephone"),x=c.getElementById("btn-modify-phone"),y=c.getElementById("sp-origin-phone"),z=c.getElementById("tips"),A=c.getElementById("coupon-list"),B=c.getElementById("hid-source"),C=c.getElementById("hid-userInfo"),D=c.getElementById("btns"),E=c.getElementById("btns-container"),F=c.getElementById("activity"),G=activity.querySelector(".activity-title"),H=activity.querySelector(".activity-content"),I=c.querySelector(".result-header-wrap"),J=c.querySelector(".dv-wrap-posi"),K=c.querySelector(".dv-wrap-posi2"),L=c.getElementById("ul-list"),M=c.getElementById("dv-list"),N=c.getElementById("dv-cover"),O=c.getElementById("hid-cardlist"),P=c.getElementById("hid-configlist"),Q=c.getElementById("hid-autocard").value,R=c.getElementById("btn-addCard"),S=c.querySelector("video"),T=c.getElementById("div-video"),U=c.getElementById("video-show"),V=c.getElementById("video-play"),W(),X=function(a){var b=function(){WeixinJSBridge&&(e=WeixinJSBridge,e.call("showOptionMenu"),e.call("hideToolbar"),"function"==typeof a&&a())};"undefined"==typeof WeixinJSBridge?c.addEventListener("WeixinJSBridgeReady",b):b()},Y=function(a){var b=function(){AlipayJSBridge&&(f=AlipayJSBridge,f.call("showOptionMenu"),"function"==typeof a&&a())};"undefined"==typeof AlipayJSBridge?c.addEventListener("AlipayJSBridgeReady",b,!1):b()},Z(),$=["page-grap","page-result","page-exception","page-changephone"],_=i.txtToJson(q.value),p=i.txtToJson(p.value),p=i.txtToJson(p.ti_info),ab=i.txtToJson(r.value),bb=i.txtToJson(ab.create)||{},s=i.txtToJson(s.value)||{},B=i.txtToJson(B.value),C=i.txtToJson(C.value),O=i.txtToJson(O.value),P=i.txtToJson(P.value),cb=n.value,db=C.phone,eb="{phone}",fb=config.globalUri+"bindCardCallBack",gb=0,1==p.first_layer_box?(hb=2==p.layerType?'<video class="torchLayer" src="'+p.layer_video_img_url+'" autoplay="true" preload="true" width="100%" height="100%">        <img src="'+p.layer_source_img_url+'" alt="" width="100%" height="100%">    </video>':'<img class="torchLayer" src="'+p.layer_source1_img_url+'" alt="" width="100%" height="100%">',ib=c.getElementById("torchLayer"),c.getElementById("torchLayer"),ib.innerHTML=hb,kb=setTimeout(function(){ib.style.display="none",l.style.display="block",clearTimeout(kb)},3e3)):l.style.display="block",lb(),isWeixin()&&P&&wx.config({debug:!1,appId:P.appId,timestamp:P.timestamp,nonceStr:P.nonceStr,signature:P.signature,jsApiList:["addCard"]}),wb=function(a,b){var c,d;b&&"0"!==b?("1"===a&&"2"===b&&(g="page-exception"),"3"===a&&(d=["1","3","4","6","7"],d.contain(b)&&(g="page-result")),"2"===a&&xb("page-result")):(c=sessionStorage.SEARCH_NEW_CURRENT_PAGE,g=a.length||!c?config.pageMap[a]:c),g=g||"page-exception"},xb=function(a){var b,c,e;if(d.length){for(e=d.length-1;e>=0;e--)b=d[e],c=b&&b.dom,c&&(c.style.display=a===b.id||a===c?"inline-block":"none");g=a,sessionStorage.SEARCH_NEW_CURRENT_PAGE=a,Ab(),"page-grap"==g&&tb({theme:"input"})}},window.timeRightBar=0,window.expandedClass="right-bar-expanded",window.contractedClass="right-bar-contracted",Bb=function(a){var b=c.getElementById("d-wall"),d=c.getElementById("d-wrap");b&&(b.style.display="none"),d&&(d.style.display="none"),"function"==typeof a&&a()},Cb=function(a,b){return"btn-orange"!==a.className?!1:(j.loading("正在加载",3e3),a.className="btn-gray",innerText(a,b),k.blur(),void 0)},Db=function(a,b){Bb(function(){a.className="btn-orange",b=b||"确认",innerText(a,b)})},Eb=function(a,b){Bb(function(){a.className="btn-gray",b=b||"确认",innerText(a,b),k.value=""})},Fb=function(a,b){var e,f,g,h,j;if(a&&a.list_info&&"1"===b.get_record&&(e=a.list_info,i.isArray(e))){if(e.length<1)return M.style.display="none",void 0;f=[],g=b.record_col,h=parseInt(b.record_count),e.length>h&&(e=e.slice(0,h)),hbUtils.map(e,function(a){a=i.txtToJson(a);var c=0,d=a.nickname,e=a.bottom_text;(null==a.amount||"undefined"==typeof a.amount)&&(a.amount=1),c=isNaN(a.amount)?"1":"number"==typeof a.amount?a.amount.toFixed(2):parseFloat(a.amount).toFixed(2),d=getStringLength(d)>10?subString(d,10):d,1==b.head_icon?f.push('<li class="grap-list-li" style="border-bottom:1px solid rgba('+g+',0.05);"><div class="d-wx-photo" style="position:relative;margin-right:5px; width:31px; height: 32px; background: url('+a.head_url+') no-repeat top left; background-size: 31px 32px;"><img class="xiaohuoju" src="'+b.head_icon_img_url+'"></div><div class="d-hb-detail"><p><span style="color:rgba('+g+',1.0);font-size:1rem;padding-left:1px">'+html2Escape(d)+'</span><span class="hbfont" style="font-size:1rem;color:rgba('+g+',0.2)">'+a.create_time+'</span><b class="hb_amount">'+c+'元</b></p><p class="comment_tx" style="color:rgba('+g+',0.8);font-size:1rem;">'+e+"</p></div></li>"):f.push('<li class="grap-list-li" style="border-bottom:1px solid rgba('+g+',0.05);"><div class="d-wx-photo" style="position:relative;margin-right:5px; width:31px; height: 32px; background: url('+a.head_url+') no-repeat top left; background-size: 31px 32px;"></div><div class="d-hb-detail"><p><span style="color:rgba('+g+',1.0);font-size:1rem;padding-left:1px">'+html2Escape(d)+'</span><span class="hbfont" style="font-size:1rem;color:rgba('+g+',0.2)">'+a.create_time+'</span><b class="hb_amount">'+c+'元</b></p><p class="comment_tx" style="color:rgba('+g+',0.8);font-size:1rem;">'+e+"</p></div></li>")}),M.querySelector(".hr-tip").style.backgroundColor="rgba("+g+",0.05)",M.querySelector(".hr-tip span").style.color="rgba("+g+",0.8)",M.querySelector(".hr-tip span").style.backgroundColor=b.record_bg,L.innerHTML=f.join(""),M.style.display="block",M.style.backgroundColor=b.record_bg,j=c.getElementById("friends-tips"),j.style.background=b.record_bg,j.style.color="rgba("+g+",0.6)",j.innerHTML=b.bottom_title}},Gb=function(b,d){var e,f,g,h,i,j;return b&&"[]"!=b&&b.coupon_list?(e=[],f={200:{title:"专车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/zhuanche-new.png')",couponType:"coupon_type_zhuanche"},100:{title:"出租车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/chuzuche-new.png')",couponType:"coupon_type_chuzuche"},210:{title:"快车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/kuaiche-new.png')",couponType:"coupon_type_kuaiche"},150:{title:"顺风车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/shunfengche-new.png')",couponType:"coupon_type_shunfengche"},188:{title:"试驾券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/shichengshijia-new.png')",couponType:"coupon_type_shichengshijia"},184:{title:"巴士券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/bashi-new.png')",couponType:"coupon_type_bashi"},186:{title:"巴士包车券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/bashi-new.png')",couponType:"coupon_type_bashibaoche"},120:{title:"代驾券",bg:"url('http://static.diditaxi.com.cn/activity/img-hb/v3/daijia-new.png')",couponType:"coupon_type_daijia"}},g="",h="",(d.click_coupon_jump&&"1"==d.click_coupon_jump||b.click_coupon_jump&&"1"==b.click_coupon_jump)&&(g='<a style="display:block;height:100%;margin-top:0;" href="http://d.xiaojukeji.com/c/70263">',h="</a>"),[].forEach.call(b.coupon_list,function(b){var d,i,j,k,l,m;a?e.push('<div class="dache-coupon olympic" id="'+f[b.productid].couponType+'" style="background-image:url(http://10.94.100.66:8000/static/activity/img-hb/v3/quanhuoju.jpg)">'+g+'<span class="couponTitle">'+f[b.productid].title+"</span>"):e.push('<div class="dache-coupon" id="'+f[b.productid].couponType+'" style="background-image:'+f[b.productid].bg+'">'+g+'<span class="couponTitle">'+f[b.productid].title+"</span>"),d="",b.remark&&(d='<div class="counpon-remark">'+b.remark+"</div>"),"100"===b.couponType?(i=b.discount.toString()[0],j=b.discount.toString()[1],e.push('<label id="lbl-amount" class="lbl-amount">'+i+'<span class="yuan">.'+j+"折</span></label>"+d)):"103"==b.couponType?(k=(b.vMount/100).toString(),l=k.length>=3?"2rem":"4.5rem",m=k.length>=3?"500":"300",e.push('<label id="lbl-amount" class="lbl-amount" style="font-size:'+l+";font-weight:"+m+'"><span class="yuan only-pay">仅需支付 </span>'+k+"</label>"+d)):e.push('<label id="lbl-amount" class="lbl-amount"><span class="yuan">￥ </span>'+b.amount+"</label>"+d),e.push(h+"</div>")}),A.innerHTML=e.join(""),i=c.getElementById("sp-change-phone"),j=d.phone||"",innerText(i,j),1!=_.access_type||!isWeixin()&&1!=B.source||(x.style.display="inline-block"),void 0):(b&&b.coupon_list||console.log("Error! coupon_list is null."),c.getElementById("tips").style.display="none",void 0)},Hb(k,o),Ib=function(a){if(a&&a.tip){var b=c.getElementById("result-bubble-2");b.innerHTML=a.tip}},Kb=function(a){var d,e,f,h,j;if(10301!=a&&0!=a)return d=c.querySelector(".dv-result-tips"),d.style.display="block",D&&(D.style.display="block"),D&&(e=c.querySelector("#page-result .dv-result"),e.style.minHeight="10rem",e.style.marginTop="10rem"),z&&(z.style.display="none"),R.style.display="none",Jb(p),f=i.getElesByKls(u,"dv-result"),i.getElesByKls(v,"dv-result"),hbUtils.map([f[0]],function(a){a.style.display="none"}),p.tel_bg_img_url&&(v.style.backgroundImage="url("+p.tel_bg_img_url+")"),I.setAttribute("id","result-header-wrap"),K.setAttribute("id","expection-result-wrap"),I.style.position="absolute",I.style.left="0",I.style.width="100%",I.querySelector(".tip-bubble").style.background="rgba(0,0,0,0)",E.parentNode.style.background="rgba(0,0,0,0)",c.getElementById("result-bubble-2").style.textAlign="center",10302!=a&&Ib(config.resPageStMap[a]),10302==a&&Ib({tip:p.res_finish}),c.querySelector("#result-bubble-1").style.display="none",10302!=a&&10305!=a&&(L.style.display="none"),D.className="",F.style.display="none",R.style.display="none",h={10302:"finish",11006:"expire",10305:"unlucky"},j=["10302","11006","10305"],-1!=j.indexOf(a)?(tb({theme:h[a]}),void 0):(tb({theme:"other"}),void 0)},o.addEventListener("click",function(a){Nb(a)},!1),Ob=function(b){if(b){var d=i.getElesByKls(c.body,"owner-logo");hbUtils.map(d,function(c){c.style.backgroundImage="url("+b+")",a&&(c.innerHTML='<img class="dahuoju" src="http://10.94.100.66:8000/static/activity/img-hb/v3/dahuoju.jpg">')}),d[0].style.opacity=p.tel_head_opacity}},Pb=function(a){var b,d;a&&(b=i.getElesByKls(c.body,"owner-logo"),d="",hbUtils.map(b,function(b){b.innerHTML='<i style="background-image:url('+a+')"></i>',d&&b.addEventListener("click",function(){location.href=d},!1)}))},Qb=function(a){a||(a="滴滴"),a=a=getStringLength(a)>12?subString(a,12):a;var b=c.querySelectorAll(".nickname");hbUtils.map(b,function(b){innerText(b,"我是"+a+",")})},Rb=function(a,b){var d,e,f,h;a&&i.isObject(a)&&(d=function(a){var d="我是滴滴",e=c.getElementById("grap-bubble-1"),f=c.getElementById("grap-bubble-2"),h=c.getElementById("result-bubble-1"),i=c.getElementById("result-bubble-2");e.style.color=a.tel_bub_col,f.style.color=a.tel_bub_col,h.style.color=a.res_bub_txt_col,i.style.color=a.res_bub_txt_col,c.querySelector(".p-tips").style.color=a.res_bub_txt_col,c.querySelector("#page-result .tip-bubble").style.backgroundColor=a.res_bub_bg_col,a.send_name="1"===a.chk_sendman?a.send_name||d:d,a.send_name=getStringLength(a.send_name)>12?subString(a.send_name,12):a.send_name,1!=_.access_type&&innerText(e,a.send_name+","),innerText(e,a.send_name),innerText(f,a.tel_bub_txt||""),h.innerHTML=1==_.access_type?'<span class="nickname">'+a.send_name+"</span>":(html2Escape(a.send_name)+","||"")+'<span class="nickname"></span>',innerText(i,a.res_succ||""),b&&"object"==typeof b&&"page-result"===g&&(0==b.errno?(innerText(f,a.res_succ||""),innerText(i,a.res_succ||"")):10302==b.errno&&(innerText(f,a.res_finish||""),innerText(i,a.res_finish||"")))},e=function(a){var b=c.getElementById("ul-list"),d=c.getElementById("dv-list"),e=b.getElementsByTagName("li");d.style.backgroundColor=a.record_bg,hbUtils.map(e,function(b){b.style.borderBottomColor=a.get_line_color,b.getElementsByTagName("b")[0].style.color=a.get_hig_color})},f=function(a){function f(a,b){var d=c.createElement("a");d.setAttribute("class","btn-orange"),d.setAttribute("id",a),d.setAttribute("data-url",b?b:""),E.appendChild(d),innerText(d,a),d.addEventListener("touchstart",function(a){"btn-orange"===a.target.className&&(a.target.style.backgroundColor="#ee7f00")},!1),d.addEventListener("touchend",function(a){"btn-orange"===a.target.className&&(a.target.style.backgroundColor="#ff8a01")},!1)}function g(){return 0==cb?"suc":10302==cb?"finish":10301==cb?"repeat":11006==cb?"expire":10305==cb?"unlucky":"other"}var h,j,k,l,m,d=0,e=i.getElesByKls(v,"btn-orange");"1"===a.chk_btn_01&&(d++,h=replaceTemplate(a.btn_link_01,eb,db),f(a.btn_name_01,h),j=c.getElementById(a.btn_name_01),j.addEventListener("click",function(){tb({type:"button_1",position:"1",theme:g()}),location.href=j.getAttribute("data-url")},!1)),"1"===a.chk_btn_02&&(d++,h=replaceTemplate(a.btn_link_02,eb,db),f(a.btn_name_02,h),k=c.getElementById(a.btn_name_02),k.addEventListener("click",function(){tb({type:"button_2",position:"2",theme:g()}),location.href=k.getAttribute("data-url")},!1)),"1"!==a.chk_btn_03||isWeixin()||"phone"!=browserRedirect()||(d++,f(a.btn_name_03,a.btn_link_03),l=c.getElementById(a.btn_name_03),l.setAttribute("href","javascript:void(0)"),isQQBrowser()?i.touch(l,function(a){tb({type:"button_3",position:"3",theme:g()}),a.preventDefault(),mqq.ui.showShareMenu()}):l.addEventListener("click",function(a){tb({type:"button_3",position:"3",theme:g()}),a.preventDefault(),N.style.display="block",N.style.height=document.body.clientHeight+"px",document.body.scrollTop=0,"undefined"!=typeof App&&App.trigger("scrollTo",0)},!1)),"1"===a.chk_btn_04&&2>=d&&(d++,h=replaceTemplate(a.btn_link_04,eb,db),f(a.btn_name_04,h),m=c.getElementById(a.btn_name_04),m.addEventListener("click",function(){tb({type:"button_3",position:"3",theme:g()}),location.href=m.getAttribute("data-url")},!1)),3===d&&(e[0].style.width="47%",e[0].style.float="left",addClass(e[0],"btn-light"),e[1].style.width="47%",e[1].style.float="right",addClass(e[1],"btn-light"),hbUtils.map(e,function(a){a.style.display="inline-block"}))},h=function(a){"1"===a.chk_activity&&(F.style.display="inline-block",innerText(G,a.act_title),H.innerHTML=a.act_cont?a.act_cont:"",F.style.color=a.act_col)},innerText(o,a.tel_btn_txt||"领取打车券"),Ob(a.send_img_url),d(a),e(a),f(a,b),h(a),l.style.background=a.record_bg)},function(){function q(){if(getQueryString("flag")&&1!=getQueryString("flag")){var a=c.getElementById("phoneTxt");innerText(a,""),k.readOnly=!0,k.value=getQueryString("mobile"),o.className="btn-orange"}}function u(){if("2"===a&&1==_.access_type&&ab){if((0==b||10301==b)&&Gb(s,C),10301==b){var c={};c=s.coupon_list&&"[object Array]"===Object.prototype.toString.call(s.coupon_list)&&s.coupon_list.length>0?config.resPageStMap["10301"]:config.resPageStMap["10305"],Ib(c)}bb.nickname&&bb.head_url&&(Ob(bb.head_url),Qb(bb.nickname),Pb(bb.level_icon_url)),1!=p.get_record||0!=b&&10301!=b&&10302!=b&&10305!=b||Fb(ab,p,s.coupon_list||[])}}function v(){"undefined"!=typeof App&&App.trigger("setBrowserTitle","滴滴出行"),"undefined"!=typeof App&&"1"===p.chk_weibo&&App.trigger("setShareDefaultText",p.weibo_cont)}function z(){"1"===p.chk_share?(h=hbUtils.genShareInfo(p),X(function(){dd.share.shareAll(e,h)}),"undefined"!=typeof mqq&&mqq.data.setShareInfo({title:h.appmsg.title,desc:h.appmsg.desc,image_url:h.appmsg.img_url},function(){}),Y(function(){var b,a=document.createElement("meta");a.name="Alipay:title",a.content=c.title=h.appmsg.title,c.getElementsByTagName("head")[0].appendChild(a),a.name="Alipay:desc",a.content=h.appmsg.desc,c.getElementsByTagName("head")[0].appendChild(a),a.name="Alipay:imgUrl",b=new Image,b.src=h.appmsg.img_url,b.onload=function(){a.content=h.appmsg.img_url,c.getElementsByTagName("head")[0].appendChild(a),delete a}})):(X(function(){e.call("hideOptionMenu")}),Y(function(){f.call("hideOptionMenu")}))}function H(){E&&(i.touch(E,function(){}),E.addEventListener("click",function(){}))}var r,t,A,B,D,E,F,G,a=m.value,b=n.value,l=function(a){hbUtils.map(a,function(a){var b=c.getElementById(a);d.push({id:a,dom:b})})};l($),hbUtils.compatibilityPlaceHolder([k]),wb(a,b),Rb(p,{errno:b}),Jb(p),q(),r=c.getElementById("checked-box"),t=c.querySelector(".didi-activity"),t.addEventListener("click",function(a){"linkbox"!==a.target.id&&(r.className="checked"===r.className?"unchecked":"checked")},!1),2==a&&(0==b&&tb({theme:"suc"}),10301==b&&tb({theme:"repeat"}),0===O.length&&(R.style.display="none"),"1"==Q&&0==b&&setTimeout(function(){ub(O,C.phone)},500),isWeixin()&&(0==b||10301==b)&&O.length>0&&200!=_.prd&&210!=_.prd&&(R.style.display="block",vb(s),R.addEventListener("click",function(){ub(O,C.phone)},!1))),u(),xb(g),Kb(b),v(),z(),A=c.getElementById("hid-new-sign"),A.value=_.sign,B=c.querySelector(".div-btn-confirm"),D=c.getElementById("sp-change-phone"),E=c.querySelector("#sp-change-phone a"),F=c.getElementById("hid-newphone"),G=c.querySelector("#div-new-phone input"),H(),i.touch(x,function(){window.scrollTo(0,0),xb("page-changephone"),gb=c.body.style.height,1==_.access_type&&(M.style.display="none"),y.innerText=F.value?F.value:D.innerText,G.value="",B.className="div-btn-confirm btn-gray",Hb(G,B,"div-btn-confirm ")
}),w.addEventListener("touchmove",function(a){a.preventDefault()},!1),i.touch(B,function(){if("div-btn-confirm btn-gray"!=B.className){j.loading("正在加载",1500);var a=config.globalUri+"changeBindPhone";i.ajax({url:a,method:"POST",data:{phone:encodeURIComponent(y.innerText),user_info:JSON.stringify(C),source:c.getElementById("hid-source").value,new_phone:encodeURIComponent(G.value),sign:encodeURIComponent(_.sign),instance_id:_.instance_id},succFunc:function(a){if(a=i.txtToJson(a),0==a.errno){if(alert("手机号修改成功"),F.value=G.value,xb("page-result"),1==_.access_type&&1==p.get_record){var b=c.getElementById("dv-list");b.style.display="block"}}else alert(a.errmsg)},failFunc:function(){xb("page-exception")}})}})}()},!1);