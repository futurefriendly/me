define("page/driver_register_edition/recertification.js",function(e,r){function t(){for(var e=!0,r=0;r<u.length;r++)u[r]||(e=!1);e?g.attr("class","btn-orange recertification_btn"):g.attr("class","btn-gray recertification_btn")}var a=(e("page/driver_register_edition/notice/notice.js"),e("page/driver_register_edition/first/first.js")),i=e("page/driver_register_edition/third/third.js"),n=e("page/driver_register_edition/tool.js");if(pageParams.usesendurltophone){e("page/driver_register_edition/foot/foot.js")}var o=dd.base,c=dd.dialog,l=[];if(l[l.length]=a,"0"!==pageParams.filed_list.driveauthpicurl.display){var s=e("page/driver_register_edition/second/second.js");l[l.length]=s}l[l.length]=i;var d,f=function(){},u=[0,0,0];l.forEach(function(e,r){e.$container.on("is_full_fill",function(e){clearTimeout(d),u[r]=e._args,d=setTimeout(t,100)}),e.wakeup({},f,f)});var g=$(".recertification_btn");r.check_filed=function(){for(var e,r=0,t=[],a={};e=l[r++];){if(!(t=e.check_filed()))return!1;$.extend(a,t)}return a},$(".recertification_btn").on("click",function(){var e=r.check_filed();if(0!=e){var t="车牌：{carbrand} 已注册，请确认车牌是否正确。如仍需注册该车牌，请申诉。";t=t.replace(/\{carbrand\}/,$("#txt_carone").val()+e.carcardnumber);var a={6010:{title:"",text:"该身份证已被注册，如果仍需注册，请进行申诉。",confirm_val:"我要申诉",confirm_url:"http://static.xiaojukeji.com/didialift/hybrid/pages/help/help-accountDatumOQ06.html"},6009:{title:"",text:t,confirm_val:"我要申诉",confirm_url:"http://static.xiaojukeji.com/didialift/hybrid/pages/help/help-accountDatumOQ07.html"}};$.ajax({method:"GET",url:pageParams.reg_url,data:$.extend({step:pageParams.reg_step,token:pageParams.upload_data.token,commit:1},e),success:function(e){var r=o.txtToJson(e);if("102"==r.errno)location.replace(pageParams.gologinurl);else if("0"==r.errno)location.replace(pageParams.successurl);else{if("3002"!=r.errno)return r.errno in a?void c.confirm({title:a[r.errno].title,text:a[r.errno].text,confirm:{val:a[r.errno].confirm_val,handler:function(){location.href=a[r.errno].confirm_url}}}):c.alert(r.errmsg);location.replace(pageParams.successurl)}n.closeLoading()},error:function(){c.alert("网络有点不给力，请稍后再试哦~")}}),n.showLoading(),$.ajax({method:"GET",url:pageParams.inviteurl,dataType:"jsonp",data:{plate:txt_carone.value+e.carcardnumber}})}});var p=e("page/driver_register_edition/hard_update.js");p.lessThanVersion("3.9.4")&&p.alertUpdate()});