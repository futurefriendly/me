define("page/driver_register_edition/second/second.js",function(e,t){function a(e,t){var a=document.createElement("IMG");a.onload=function(){t(a),a.onerror=a=a.onload=null},a.onerror=function(){t(null),a.onerror=a=a.onload=null},a.src=e}function r(e){return"string"!=typeof e&&(e=e.getAttribute("name")),1==pageParams.filed_list[e].changeable}function n(e){return"string"!=typeof e&&(e=e.getAttribute("name")),3==pageParams.filed_list[e].verify}function i(){function t(e){var t={data:$.extend({},pageParams.upload_data),url:pageParams.api_upload_url,outputWidth:O[e][0],outputHeight:O[e][1],filekey:"file",onSuccessUpload:function(t){try{if(t=JSON.parse(t),"0"!=t.errno)return void h.alert("上传失败，请重试！");J(x[e],t.data)}catch(a){return h.alert("上传失败，请重试！"),void T(x[e],a)}n()},onCancelUpload:function(){n()},onFailedUpload:function(){n(),h.alert("上传失败，请重试！"),n()}},a=y[e].$container;return a.show(),new i(a[0],t)}function a(t){var a=y[t].$container;a.on("click",function(){var a=e("ddbridge/ddbridge.js"),r=$.extend({},pageParams.upload_data,{web_token:pageParams.upload_data.token});a.uploadImage(r,function(e){try{e=JSON.parse(e),J(x[t],e.data.data)}catch(a){T(x[t],a)}},null,pageParams.api_upload_url)})}function n(){document.body.onfocus=null,y[index].close()}var i=e("upload/upload.js");$.each(b.find(".file_select"),function(e,i){if(r(i)){"string"==typeof P[e]?y[e].setPic(P[e]):d(function(t){y[e].setPic(t)});var o=!0;o?t(e):a(e),$(i).on("click",function(){y[e].show(),document.body.onfocus=n},!1)}})}function o(){i(),x.forEach(function(e){var t=pageParams.filed_list[e].value||m.get(e);t&&J(e,t)}),n(x[0])&&r(x[0])&&b.addClass("verify_failed"),b.find(".form_second .previous_btn").on("click",function(){u()}),b.find(".next_btn").on("click",function(){var e=t.check_filed();if(e!==!1){var a=dd.base,r=dd.dialog;f.showLoading(),$.ajax({method:"GET",url:pageParams.reg_url,data:$.extend({step:2,token:pageParams.upload_data.token},e),success:function(e){var t=a.txtToJson(e);if("102"==t.errno)location.replace(pageParams.gologinurl);else if("0"==t.errno)m.clean(),l({travelauthpicurl:E.travelauthpicurl});else{if("3002"!=t.errno)return r.alert(t.errmsg);m.clean(),l({travelauthpicurl:E.travelauthpicurl})}f.closeLoading()},error:function(){r.alert("网络有点不给力，请稍后再试哦~")}})}})}function c(){for(var e=0;e<x.length;e++)if(!E[x[e]])return b.trigger("is_full_fill",!1),!1;b.trigger("is_full_fill",!0)}function d(e){if(G)return void e(G);if(N[N.length]=e,!(N.length.length>1)){var t=pageParams.gesture_url;$.ajax({method:"GET",url:t,data:{},success:function(e){var t=dd.base.txtToJson(e);if("0"!=t.errno)return h.alert(t.errmsg);G=t.gesturesample,G=G&&-1===G.indexOf("test.didi")?t.gesturesample:Math.random()>.5?_:v;for(var a;a=N.shift();)a(G)},error:function(){h.alert("获取手势图失败，因为网络有点不给力，请稍后再试哦~")}})}}var l,u,s=e("page/driver_register_edition/second/layer.js"),f=e("page/driver_register_edition/tool.js"),p="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/driver_card_050b750.png",g="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/car_license_e5ed36a.png",_="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/gestures_left_1c905cd.png",v="http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/gestures_right_a51b567.png",h=(pageParams.gesturesample,dd.dialog),m=f.localCache.instance("driver_register_second"),k=!1,b=t.$container=$(".form_second");t.wakeup=function(e,t,a){l=t,u=a,k===!1&&(k=!0,o())};var x=["driveauthpicurl","travelauthpicurl","gestureauthpicurl"],j=[".driving_licence_front",".driving_licence_backend",".car_photo"],P=[p,g,d],y=[new s,new s,new s],w=213/145,C=500,O=[[C,C/w],[C,C/w],[C,C]],E={},J=function(e,t){var r=x.indexOf(e);if(-1!==r){var n=$(j[r]);E[e]=t,n.addClass("photo_uploaded"),a(t,function(t){return null===t?(dd.dialog.alert({title:"",tip:"图片上传失败，请重新上传。",btn:{handler:function(){}}}),void T(e)):(t.className="pic",void n.find(".shadow").html(t))}),m.save_cache(e,t),c()}},T=function(e){var t=x.indexOf(e);-1!==t&&($pick_node=$(j[t]),$pick_node.removeClass("photo_uploaded"),delete E[e],m.remove_cache(e,val),c())};t.check_filed=function(){var e,t=!0;if($.each(x,function(a,r){return void 0==E[r]?(e=a,t=!1):void 0}),t===!1){var a=$(j[e]).find(".select_tips").text()||"完整资料";return h.alert({title:"",tip:"请上传"+a,btn:{handler:function(){}}}),!1}return E};var G=!1,N=[]});