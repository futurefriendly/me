define("page/driver_register_edition/second/second.js",function(e,a){function t(e,a){var t=document.createElement("IMG");t.onload=function(){a(t),t.onerror=t=t.onload=null},t.onerror=function(){a(null),t.onerror=t=t.onload=null},t.src=e}function r(e){return"string"!=typeof e&&(e=e.getAttribute("name")),1==pageParams.filed_list[e].changeable}function n(e){return"string"!=typeof e&&(e=e.getAttribute("name")),1==pageParams.filed_list[e].display}function i(e){return"string"!=typeof e&&(e=e.getAttribute("name")),3==pageParams.filed_list[e].verify}function o(){function a(e){function a(){document.body.onfocus=null,x[e].close()}var t={data:$.extend({},pageParams.upload_data),url:pageParams.api_upload_url,outputWidth:T[e][0],outputHeight:T[e][1],filekey:"file",onSuccessUpload:function(t){try{if(t=JSON.parse(t),"0"==t.errno)E(k[e],t.data);else{if("101"!=t.errno)return void m.alert(t.errmsg);location.replace(pageParams.gologinurl)}}catch(r){return m.alert("服务器故障，上传失败，请重试！"),void O(k[e],r)}a()},onCancelUpload:function(){a()},onFileSelect:function(e,t){a(),t()},onFailedUpload:function(){a(),m.alert("上传超时，请重试！"),a()}},r=x[e].$container;r.show(),new n(r[0],t),r.hide()}function t(a){function t(){document.body.onfocus=null,x[a].close()}var r=x[a].$container;r.on("click",function(){var r=e("ddbridge/ddbridge.js"),n=$.extend({},pageParams.upload_data,{web_token:pageParams.upload_data.token});delete n.token,r.uploadImage(n,function(e){try{e=JSON.parse(e),E(k[a],e.data.data)}catch(r){O(k[a],r)}t()},null,pageParams.api_upload_url)})}var n=e("upload/upload.js");$.each(b.find(".file_select"),function(e,n){function o(){document.body.onfocus=null,x[e].close()}var l=$(n);if(r(n)===!1)return void l.addClass("disabled");i(k[e])&&r(k[e])&&l.addClass("verify_failed"),"string"==typeof j[e]?(x[e].setOpt({img_src:j[e]}),x[e].setup()):j[e](function(a){var t=["e_avatar_1","e_avatar_2"];x[e].setOpt({img_src:a,custom_class:t[pageParams.gesturesample-1]}),x[e].setup()});var s=!1;l.on("click",function(){if(x[e].show(),document.body.onfocus=o,s!==!0){s=!0,$(this).removeClass("verify_failed");var r=window.DidiJSBridge;r&&/android/i.test(navigator.userAgent)?t(e):a(e),x[e].show()}},!1)})}function l(){o(),k.forEach(function(e){var a=pageParams.filed_list[e].value||h.get(e);a&&E(e,a)}),b.find(".form_second .previous_btn").on("click",function(){f()}),b.find(".next_btn").on("click",function(){function e(e){var a=r.txtToJson(e);if("102"==a.errno)location.replace(pageParams.gologinurl);else if("0"==a.errno)h.clean(),u({travelauthpicurl:A.travelauthpicurl});else{if("3002"!=a.errno)return n.alert(a.errmsg);h.clean(),u({travelauthpicurl:A.travelauthpicurl})}g.closeLoading()}var t=a.check_filed();if(t!==!1){g.showLoading(),$.ajax({type:"GET",url:pageParams.reg_url,data:$.extend({step:2,token:pageParams.upload_data.token},t),success:e,error:function(){n.alert("网络有点不给力，请稍后再试哦~")}});var r=dd.base,n=dd.dialog}})}function s(){for(var e=0;e<k.length;e++)if(r(b.find(P[e])[0])!==!1&&!A[k[e]])return b.trigger("is_full_fill",!1),!1;b.trigger("is_full_fill",!0)}function c(e){return e in G?G[e]:(dd.dialog.alert("服务器错误，没有成功获取示例手势，请稍候再试"),"")}function d(e){function a(e){var a=dd.base.txtToJson(e);"0"==a.errno||(a.gesturesample=-1),pageParams.gesturesample=a.gesturesample,S=c(a.gesturesample);for(var t;t=J.shift();)t(S)}if(pageParams.gesturesample)return e(c(pageParams.gesturesample));if(S)return void e(S);if(J[J.length]=e,!(J.length.length>1)){var t=pageParams.gesture_url;$.ajax({method:"GET",url:t,data:{},success:a,error:function(){m.alert("获取手势图失败，因为网络有点不给力，请稍后再试哦~")}})}}var u,f,p=e("page/driver_register_edition/second/layer/layer.js"),g=e("page/driver_register_edition/tool.js"),_="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/driver_card_050b750.png",v="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/car_license_e5ed36a.png",m=(pageParams.gesturesample,dd.dialog),h=g.localCache.instance("driver_register_second"),y=!1,b=a.$container=$(".form_second");a.wakeup=function(e,a,t){if(u=a,f=t,y===!1){y=!0;var r=!0;if($.each(k,function(e,a){return n(a)?(r=!1,!1):void 0}),r)return s(),void u();l()}};var k=["driveauthpicurl","travelauthpicurl","gestureauthpicurl"],P=[".driving_licence_front",".driving_licence_backend",".car_photo"],j=[_,v,d],x=[new p({layerType:p.CARD}),new p({layerType:p.CARD}),new p({layerType:p.GESTURE,custom_class:""})],w=213/145,C=500,T=[[C,C/w],[C,C/w],[C,C]],A={},E=function(e,a){var r=k.indexOf(e);if(-1!==r){var n=$(P[r]);A[e]=a,n.addClass("photo_uploaded"),t(a,function(a){return null===a?(dd.dialog.alert({title:"",tip:"图片加载失败，请重新上传。",btn:{handler:function(){}}}),void O(e)):(a.className="pic",void n.find(".shadow").html(a))}),h.save_cache(e,a),s()}},O=function(e){var a=k.indexOf(e);-1!==a&&($pick_node=$(P[a]),$pick_node.removeClass("photo_uploaded"),delete A[e],h.remove_cache(e),s())};a.check_filed=function(){var e,a=!0,t={};if($.each(k,function(n,i){return r(i)!==!1?(t[i]=A[i],void 0==t[i]?(e=n,a=!1):void 0):void 0}),a===!1){var n=$(P[e]).find(".select_tips").text()||"完整资料";return m.alert({title:"",tip:"请"+n,btn:{handler:function(){}}}),!1}return t};var S=!1,J=[],G={1:"http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/layer/images/avatar_left_1b52add.jpg",2:"http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/layer/images/avatar_right_de4cc67.jpg"}});