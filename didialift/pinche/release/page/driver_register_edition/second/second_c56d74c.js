define("page/driver_register_edition/second/second.js",function(e,a){function t(e,a){var t=document.createElement("IMG");t.onload=function(){a(t),t.onerror=t=t.onload=null},t.onerror=function(){a(null),t.onerror=t=t.onload=null},t.src=e}function r(e){return"string"!=typeof e&&(e=e.getAttribute("name")),1==pageParams.filed_list[e].changeable}function n(e){return"string"!=typeof e&&(e=e.getAttribute("name")),1==pageParams.filed_list[e].display}function i(e){return"string"!=typeof e&&(e=e.getAttribute("name")),3==pageParams.filed_list[e].verify}function o(){function a(e){function a(){document.body.onfocus=null,P[e].close()}var t={data:$.extend({},pageParams.upload_data),url:pageParams.api_upload_url,outputWidth:x[e][0],outputHeight:x[e][1],filekey:"file",onSuccessUpload:function(t){try{if(t=JSON.parse(t),"0"==t.errno)A(y[e],t.data);else{if("101"!=t.errno)return void _.alert(t.errmsg);location.replace(pageParams.gologinurl)}}catch(r){return _.alert("服务器故障，上传失败，请重试！"),void O(y[e],r)}a()},onCancelUpload:function(){a()},onFileSelect:function(e,t){a(),t()},onFailedUpload:function(){a(),_.alert("上传超时，请重试！"),a()}},r=P[e].$container;r.show(),new n(r[0],t),r.hide()}function t(a){function t(){document.body.onfocus=null,P[a].close()}var r=P[a].$container;r.on("click",function(){var r=e("ddbridge/ddbridge.js"),n=$.extend({},pageParams.upload_data,{web_token:pageParams.upload_data.token});delete n.token,r.uploadImage(n,function(e){try{e=JSON.parse(e),A(y[a],e.data.data)}catch(r){O(y[a],r)}t()},null,pageParams.api_upload_url)})}var n=e("upload/upload.js");$.each(h.find(".file_select"),function(e,n){function o(){document.body.onfocus=null,P[e].close()}var l=$(n);if(r(n)===!1)return void l.addClass("disabled");i(y[e])&&r(y[e])&&l.addClass("verify_failed"),"string"==typeof k[e]?(P[e].setOpt({img_src:k[e]}),P[e].setup()):k[e](function(a){var t=["e_avatar_1","e_avatar_2"];P[e].setOpt({img_src:a,custom_class:t[pageParams.gesturesample-1]}),P[e].setup()});var c=!1;l.on("click",function(){if(P[e].show(),document.body.onfocus=o,c!==!0){c=!0,$(this).removeClass("verify_failed");var r=window.DidiJSBridge;r&&/android/i.test(navigator.userAgent)?t(e):a(e),P[e].show()}},!1)})}function l(){o(),y.forEach(function(e){var a=pageParams.filed_list[e].value||v.get(e);a&&A(e,a)}),h.find(".form_second .previous_btn").on("click",function(){s()}),h.find(".next_btn").on("click",function(){function e(e){var a=r.txtToJson(e);if("102"==a.errno)location.replace(pageParams.gologinurl);else if("0"==a.errno)v.clean(),d({travelauthpicurl:C.travelauthpicurl});else{if("3002"!=a.errno)return n.alert(a.errmsg);v.clean(),d({travelauthpicurl:C.travelauthpicurl})}f.closeLoading()}var t=a.check_filed();if(t!==!1){f.showLoading(),$.ajax({type:"GET",url:pageParams.reg_url,data:$.extend({step:2,token:pageParams.upload_data.token},t),success:e,error:function(){n.alert("网络有点不给力，请稍后再试哦~")}});var r=dd.base,n=dd.dialog}})}function c(){for(var e=0;e<y.length;e++)if(r(h.find(b[e])[0])!==!1&&!C[y[e]])return h.trigger("is_full_fill",!1),!1;h.trigger("is_full_fill",!0)}var d,s,u=e("page/driver_register_edition/second/layer/layer.js"),f=e("page/driver_register_edition/tool.js"),p="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/driver_card_050b750.png",g="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/car_license_e5ed36a.png",_=(pageParams.gesturesample,dd.dialog),v=f.localCache.instance("driver_register_second"),m=!1,h=a.$container=$(".form_second");a.wakeup=function(e,a,t){if(d=a,s=t,m===!1){m=!0;var r=!0;if($.each(y,function(e,a){return n(a)?(r=!1,!1):void 0}),r)return c(),void d();l()}};var y=["driveauthpicurl","travelauthpicurl","gestureauthpicurl"],b=[".driving_licence_front",".driving_licence_backend",".car_photo"],k=[p,g,"http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/layer/images/avatar_right2_d781194.jpg"],P=[new u({layerType:u.CARD}),new u({layerType:u.CARD}),new u({layerType:u.GESTURE,custom_class:""})],j=213/145,w=500,x=[[w,w/j],[w,w/j],[w,w]],C={},A=function(e,a){var r=y.indexOf(e);if(-1!==r){var n=$(b[r]);C[e]=a,n.addClass("photo_uploaded"),t(a,function(a){return null===a?(dd.dialog.alert({title:"",tip:"图片加载失败，请重新上传。",btn:{handler:function(){}}}),void O(e)):(a.className="pic",void n.find(".shadow").html(a))}),v.save_cache(e,a),c()}},O=function(e){var a=y.indexOf(e);-1!==a&&($pick_node=$(b[a]),$pick_node.removeClass("photo_uploaded"),delete C[e],v.remove_cache(e),c())};a.check_filed=function(){var e,a=!0,t={};if($.each(y,function(n,i){return r(i)!==!1?(t[i]=C[i],void 0==t[i]?(e=n,a=!1):void 0):void 0}),a===!1){var n=$(b[e]).find(".select_tips").text()||"完整资料";return _.alert({title:"",tip:"请"+n,btn:{handler:function(){}}}),!1}return t}});