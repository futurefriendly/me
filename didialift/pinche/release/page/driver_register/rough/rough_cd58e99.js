define("page/driver_register/rough/dd.slideSelect.js",function(){dd.base}),define("page/driver_register/rough/p-register.js",function(e){dd.ready(function(){function t(){var e=document.getElementById("carnoSelect");ulEl=e.getElementsByClassName("options")[0];var t=function(){l.ajax({method:"POST",url:"/pinche/cartype/getlicensehead",succFunc:function(t){var a=l.txtToJson(t);if("0"==a.errno){for(var n=a.data,r=a.sort,i="",c=0,o=r.length;o>c;c++)i+='<li data-id="'+r[c]+'" data-show="'+n[r[c]]+'">'+n[r[c]]+"</li>";ulEl.innerHTML+=i,slideSelect_carno(txt_carOne,e,[])}},failFunc:function(){}})};t()}function a(){var e=function(e,t){d[e]=t,localStorage.driver_form=JSON.stringify(d)};txt_realname.addEventListener("change",function(){e("txt_realname",this.value)},!1),txt_licence.addEventListener("change",function(){e("txt_licence",this.value)},!1),txt_carower.addEventListener("change",function(){e("txt_carower",this.value)},!1),txt_carOne.addEventListener("change",function(){e("txt_carOne",txt_carOne.value),e("txt_carOne_id",txt_carOne.getAttribute("data-id"))},!1),txt_carOne2.addEventListener("change",function(){e("txt_carOne2",this.value)},!1),d&&(txt_realname.value=d.txt_realname||"",txt_licence.value=d.txt_licence||"",txt_carower.value=d.txt_carower||"",txt_carOne.value=d.txt_carOne||"",txt_carOne.setAttribute("data-id",d.txt_carOne_id||""),txt_carOne2.value=d.txt_carOne2||"")}function n(){txt_realname.addEventListener("focus",function(){this.className=""},!1),txt_realname.addEventListener("blur",function(){_.is_Chinese_name(this.value)||(this.className="error")},!1),txt_licence.addEventListener("focus",function(){this.className=""},!1),txt_licence.addEventListener("blur",function(){_.is_ID_card(this.value)||(this.className="error")},!1),txt_carower.addEventListener("focus",function(){this.className=""},!1),txt_carower.addEventListener("blur",function(){_.is_Chinese_name(this.value)||(this.className="error")},!1),txt_carOne2.addEventListener("focus",function(){this.className=""},!1),txt_carOne2.addEventListener("blur",function(){_.is_carNo(this.value)||(this.className="error")},!1)}function r(e){var t=function(e,t){u.alert({title:"",tip:t,btn:{handler:function(){e.focus()}}})};if("1"===pageParams.drive_license_changeable){if(!_.is_Chinese_name(e.drive_license_name))return t(txt_realname,"请填写真实姓名"),!1;if(!_.is_ID_card(e.drive_license_number))return t(txt_licence,"身份证号填写错误"),!1}if("1"===pageParams.travel_license_changeable){if(!_.is_Chinese_name(e.travel_license_name))return t(txt_carower,"行驶证姓名填写错误"),!1;if(""==txt_carOne.value)return u.alert("请选择车牌归属地"),!1;if(!_.is_carNo(e.car_license_number))return t(txt_carOne2,"车牌号填写错误"),!1}return!0}function i(e){u.loading("正在请求，请稍后~"),l.ajax({method:"POST",url:pageParams.submit_url,data:e,succFunc:function(e){var t=l.txtToJson(e);"0"==t.errno?(localStorage.removeItem("driver_form"),location.replace(t.url)):"3002"==t.errno?(localStorage.removeItem("driver_form"),location.replace(t.url)):o(function(){u.alert(t.errmsg)})},failFunc:function(){u.alert("网络有点不给力，请稍后再试哦~")}})}function c(e){$(".main").attr("class","main animate begin_animate"),setTimeout(function(){$(".main").attr("class","main animate end_animate")},0),setTimeout(function(){$(".main").attr("class","main ended_animate"),e()},350)}function o(e){$(".main").attr("class","main animate end_animate"),setTimeout(function(){$(".main").attr("class","main animate begin_animate")},0),setTimeout(function(){$(".main").attr("class","main"),e()},450)}function s(t){if(s.data_form=t,m!==!0){m=!0;var a=["driveauthpicurl","travelauthpicurl"],n=[".driving_licence_front",".driving_licence_backend"],r={},c=function(e,t){var i=a.indexOf(e);if(-1!==i){var c=$(n[i]);r[e]=t,c.addClass("photo_uploaded"),c.find(".shadow").css("background-image","url("+t+")"),f.set(e,t)}},o=function(e,t){var i=a.indexOf(e);-1!==i&&($pick_node=$(n[i]),$pick_node.find(".shadow").html("error | "+t.message),$pick_node.removeClass("photo_uploaded"),delete r[e])};addEventListener("error",function(e){$(".driving_licence_backend").find(".shadow").html(e.message)},!1),a.forEach(function(e){var t=f.get(e);t&&c(e,t)}),$(".upload_card").on("click",".file_select",function(t){var r=$(t.currentTarget),i=r.attr("class").trim();if(i=i.split(/\s+/)[1],0!=i){var s=n.indexOf("."+i);if(-1!==s){var l=e("ddbridge/ddbridge.js");l.uploadImage({web_token:pageParams.upload_token},function(e){try{e=JSON.parse(e),c(a[s],e.data.data)}catch(t){o(a[s],t)}},null,pageParams.api_upload_url)}}}),l.touch($(".register_submit")[0],function(){var e,c=!0;if($.each(a,function(t,a){return void 0===r[a]?(e=t,c=!1):void 0}),c===!1){var o=$(n[e]).find(".select_tips").text()||"完整资料";return void u.alert({title:"",tip:"请填写"+o,btn:{handler:function(){}}})}t=$.extend(s.data_form,r),i(t)})}}var l=dd.base,u=dd.dialog,d=l.txtToJson(localStorage.driver_form||{}),_={is_Chinese_name:function(e){var t=/^[\u4E00-\u9FA5]{2,}$/;return t.test(e)?!0:!1},is_ID_card:function(e){var t=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;return t.test(e)===!1?!1:!0},is_carNo:function(e){var t=/^[A-Za-z]{1}[A-Za-z0-9]{5}$/;return t.test(e)?!0:!1}};!function(){t(page_driver.car_province_id),"join"==pageParams.type&&a(),n(),$(btnSubmit).on("click",function(){if("btn-gray"!=btnSubmit.className){for(var e=document.getElementsByTagName("input"),t=0,a=e.length;a>t;t++){var n=e[t];n.setAttribute("readOnly","true"),n.blur()}scrollTo(0,0),setTimeout(function(){for(t=0,a=e.length;a>t;t++){var n=e[t];n.removeAttribute("readOnly")}},100);var i={drive_license_name:txt_realname.value,drive_license_number:txt_licence.value.toLocaleUpperCase(),travel_license_name:txt_carower.value,car_province_id:txt_carOne.getAttribute("data-id"),car_license_number:txt_carOne2.value.toLocaleUpperCase(),phone_number:pageParams.phone||"",token:pageParams.token||"",sign:pageParams.sign||""},o=r(i);o&&c(function(){s(i)})}})}();var m=!1,f={set:function(e,t){try{return localStorage.setItem(e,t),!0}catch(a){return!1}},get:function(e){try{return localStorage.getItem(e)}catch(t){return!1}},remove:function(e){try{return localStorage.removeItem(e),!0}catch(t){return!1}}}})});