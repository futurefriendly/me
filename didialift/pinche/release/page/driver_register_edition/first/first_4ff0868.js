define("page/driver_register_edition/first/first.js",function(e,r){function a(e){return"string"!=typeof e&&(e=e.getAttribute("name")),1==pageParams.filed_list[e].changeable}function n(e){return"string"!=typeof e&&(e=e.getAttribute("name")),3==pageParams.filed_list[e].verify}function t(e,r){r=r||e.attr("name"),e.val(pageParams.filed_list[r]&&pageParams.filed_list[r].value||u.get(r)).attr("disabled",a(r)?null:"")}function i(){var e=g.find("#txt_licence"),i=g.find("#txt_realname");t(i),t(e),i.on("blur",function(){var e=g.find("#txt_realname").val();f.regular.is_Chinese_name(e)===!1?(f.warning("请填写正确的中文姓名"),f.warning_text(i)):u.save_cache(this.getAttribute("name"),e),l()}),e.on("blur",function(){var r=g.find("#txt_licence").val();f.regular.is_ID_card(r)===!1?(f.warning("请填写正确的身份证号码"),f.warning_text(e)):u.save_cache(this.getAttribute("name"),r),l()});var o=i.attr("name");n(o)&&a(o)&&g.addClass("verify_failed"),g.find(".next_btn").on("click",function(){var e=r.check_filed();if(0!=e){var a=dd.dialog,n=dd.base,t=$.extend({step:1,token:pageParams.upload_data.token,regfrom:pageParams.regfrom,source:pageParams.source},e);f.showLoading(),$.ajax({type:"GET",url:pageParams.reg_url,data:t,success:function(e){var r=n.txtToJson(e);if("102"==r.errno)location.replace(pageParams.gologinurl);else if("0"==r.errno)u.clean(),c();else{if("3002"!=r.errno)return"6010"==r.errno?void a.confirm({title:"",text:"驾驶证已被注册。如果不是你本人或熟人操作，你可以通过申诉来进行车主认证。",confirm:{val:"我要申诉",handler:function(){location.href=pageParams.faq_url}}}):"6009"==r.errno?void a.confirm({title:"",text:"车辆已被注册。如果不是你本人或熟人操作，你可以通过申诉来进行车主认证。",confirm:{val:"我要申诉",handler:function(){location.href=pageParams.faq_url}}}):a.alert(r.errmsg||"");u.clean(),c()}f.closeLoading()},error:function(){a.alert("网络有点不给力，请稍后再试哦~")}})}}),g.one("touchstart",function(){g.removeClass("verify_failed")})}function l(){for(var e=0;e<_.length;e++)if(f.regular[m[e]](_[e].value)===!1)return g.trigger("is_full_fill",!1),!1;g.trigger("is_full_fill",!0)}var o,c,f=e("page/driver_register_edition/tool.js"),s=dd.dialog,u=f.localCache.instance("driver_register_first"),d=!1,g=r.$container=$(".form_first");r.wakeup=function(e,r,a){c=function(){f.warning.close(),r()},o=function(){f.warning.close(),a()},d===!1&&(d=!0,i(),l())},r.check_filed=function(){var e=g.find("#txt_realname").val(),r=g.find("#txt_licence").val();if(f.regular.is_Chinese_name(e)===!1)return s.alert({title:"",tip:"请填写正确的中文姓名",btn:{handler:function(){}}}),!1;if(f.regular.is_ID_card(r)===!1)return s.alert({title:"",tip:"请填写正确的身份证号码",btn:{handler:function(){}}}),!1;var a={drivelicensename:txt_realname.value,drivelicensenumber:txt_licence.value.toLocaleUpperCase()};return a};var _=[txt_realname,txt_licence],m=["is_Chinese_name","is_ID_card"]});