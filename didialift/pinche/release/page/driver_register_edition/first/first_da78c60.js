define("page/driver_register_edition/first/first.js",function(e,n){function t(e){return"string"!=typeof e&&(e=e.getAttribute("name")),1==pageParams.filed_list[e].changeable}function a(e){return"string"!=typeof e&&(e=e.getAttribute("name")),3==pageParams.filed_list[e].verify}function r(e,n){n=n||e.attr("name"),e.val(pageParams.filed_list[n]&&pageParams.filed_list[n].value||u.get(n)).attr("disabled",t(n)?null:"")}function i(){var e=d.find("#txt_licence"),i=d.find("#txt_realname");r(i),r(e),i.on("blur",function(){var e=d.find("#txt_realname").val();f.regular.is_Chinese_name(e)===!1?(f.warning("请填写正确的中文姓名"),f.warning_text(i)):u.save_cache(this.getAttribute("name"),e),l()}),e.on("blur",function(){var n=d.find("#txt_licence").val();f.regular.is_ID_card(n)===!1?(f.warning("请填写正确的身份证号码"),f.warning_text(e)):u.save_cache(this.getAttribute("name"),n),l()});var c=i.attr("name");a(c)&&t(c)&&d.addClass("verify_failed"),d.find(".next_btn").on("click",function(){var e=n.check_filed();if(0!=e){var t=dd.dialog,a=dd.base,r=$.extend({step:1,token:pageParams.upload_data.token},e);f.showLoading(),$.post(pageParams.reg_url,r,function(e){var n=a.txtToJson(e);if("102"==n.errno)location.replace(pageParams.gologinurl);else if("0"==n.errno)u.clean(),o();else{if("3002"!=n.errno)return"6010"==n.errno?void t.confirm({title:"",text:"车辆已被注册。如果不是你本人或熟人操作，你可以通过申诉来进行车主认证。",confirm:{val:"我要申诉",handler:function(){location.replace(pageParams.faq_url)}}}):t.alert(n.errmsg||"");u.clean(),o()}f.closeLoading()})}})}function l(){for(var e=0;e<g.length;e++)if(f.regular[v[e]](g[e].value)===!1)return d.trigger("is_full_fill",!1),!1;d.trigger("is_full_fill",!0)}var c,o,f=e("page/driver_register_edition/tool.js"),s=dd.dialog,u=f.localCache.instance("driver_register_first"),_=!1,d=n.$container=$(".form_first");n.wakeup=function(e,n,t){o=function(){f.warning.close(),n()},c=function(){f.warning.close(),t()},_===!1&&(_=!0,i(),l())},n.check_filed=function(){var e=d.find("#txt_realname").val(),n=d.find("#txt_licence").val();if(f.regular.is_Chinese_name(e)===!1)return s.alert({title:"",tip:"请填写正确的中文姓名",btn:{handler:function(){}}}),!1;if(f.regular.is_ID_card(n)===!1)return s.alert({title:"",tip:"请填写正确的身份证号码",btn:{handler:function(){}}}),!1;var t={drivelicensename:txt_realname.value,drivelicensenumber:txt_licence.value.toLocaleUpperCase()};return t};var g=[txt_realname,txt_licence],v=["is_Chinese_name","is_ID_card"]});