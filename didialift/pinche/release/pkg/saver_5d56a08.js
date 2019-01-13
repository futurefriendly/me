define("SingleSelector",function(e,t,l){{var n=dd.base,a=function(){for(var e=document.getElementsByClassName("select-wall"),t=0,l=e.length;l>t;t++)document.body.removeChild(e[t])},o=function(){var e=document.createElement("div");e.id="d-wall",e.className="select-wall",e.style.width=document.clientWidth+"px",e.style.height=document.body.scrollHeight+"px",document.body.appendChild(e)};l.exports=function(e,t,l,s){function i(e){var t=0,l=0;e.addEventListener("touchstart",function(e){if(e.preventDefault(),!e.touches.length)return!1;var l=e.touches[0];t=l.pageY-this.offsetTop},!1),e.addEventListener("touchmove",function(e){if(e.preventDefault(),!e.touches.length)return!1;var n=e.touches[0],a=n.pageY-this.offsetTop;l=t-a,t=a,this.scrollTop+=l},!1),e.addEventListener("touchend",function(e){if(e.preventDefault(),!e.changedTouches.length)return!1;t=0,l=0;var n=this.scrollTop,a=n%44;22>a?this.scrollTop-=a:this.scrollTop+=44-a},!1)}var r=l||[],c=[],u=t.getElementsByClassName("cancel")[0],d=t.getElementsByClassName("confirm")[0],h=t.getElementsByClassName("options");n.touch(e,function(){for(var e=document.getElementsByClassName("select"),n=0,a=e.length;a>n;n++)e[n].style.display="none";t.style.display="block",o();for(var s=null,i="",r=null,c=0,u=h.length;u>c;c++){s=h[c],i=l[c],r=s.getElementsByTagName("li");for(var d=0,v=r.length;v>d;d++)r[d].getAttribute("data-id")==i&&(s.scrollTop=44*d)}},!1),u.addEventListener("click",function(){t.style.display="none",a()},!1);d.addEventListener("click",function(){for(var l=null,n=null,o=0,i=h.length;i>o;o++){l=h[o];var u=l.scrollTop/44,n=l.getElementsByTagName("li")[u];r[o]=n.getAttribute("data-id"),c[o]=n.getAttribute("data-show")}var d=e.value;e.value=c.join(""),e.setAttribute("data-id",r.join("")),d!=e.value&&s({value:e.getAttribute("data-id"),text:e.value}),t.style.display="none",a()},!1);for(var v=0,f=h.length;f>v;v++)i(h[v],v)}}});
;define("login",function(n,t){function e(){var n=d.regular.is_phone_number(u.val()),t=/^\d{4}$/,e=t.test(m.val());l.hasClass("ontime")||(n?l.removeClass("btnGray"):l.addClass("btnGray")),n&&e?c.removeClass("btnGray"):c.addClass("btnGray")}var i,o,a=n("dd"),d=n("tool"),r=n("driver_register_tool"),s=$(".login_container"),l=s.find("#btn_sendmsm"),c=s.find("#btn_login"),u=s.find("#phoneno"),m=s.find("#msmcode"),v=function(){var n=60;return function(){return 0==n?(l.removeClass("btnGray").removeClass("ontime"),l.val("验证"),void(n=60)):(l.addClass("btnGray").addClass("ontime"),l.val(n+"s"),n--,void setTimeout(function(){v()},1e3))}}();l.bind("click",function(){if(!l.hasClass("btnGray")){{$(this)}if(!d.regular.is_phone_number(u.val()))return a.dialog.alert("手机号填写有误"),void u.addClass("err_inp");var n=u.val();i(n,m),v()}}),c.bind("click",function(){if(!c.hasClass("btnGray")){{$(this)}if(!d.regular.is_phone_number(u.val()))return a.dialog.alert("手机号填写有误"),void u.addClass("err_inp");var n=u.val(),t=m.val();o(n,t)}}),s.find("#login_close").click(function(){b()}),u.get(0).addEventListener("input",function(){e()}),m.get(0).addEventListener("input",function(){e()});var f=function(){var n=document.documentElement.clientHeight,t=(document.documentElement.clientWidth,s.height()),e=(n-t)/2;s.css({top:e+document.body.scrollTop})},h=function(){function n(){e=$("<div></div>").appendTo("body")}function t(){var n=Math.max(document.documentElement.clientHeight,document.body.clientHeight)+50,t=Math.max(document.documentElement.clientWidth,document.body.clientWidth);e.css({background:"rgba(0,0,0,0.5)",width:t,height:n,position:"absolute",top:0,left:0,"z-index":100})}var e;return function(){return e||n(),t(),e}}(),b=(t.show=function(){h().show(),r.showLoading(),setTimeout(function(){h().show(),r.closeLoading(),s.show(),f()},1e3);var n={sendmsm:function(t){return i=t,n},commit:function(t){return o=t,n}};return n},t.hide=function(){h().hide(),s.hide()})});
;define("page/driver_register_saver_index/main.js",function(a){function e(){var a=pageParams.form_data;for(var e in a){var r=a[e];r.zhvalue=r.zhvalue||v.get(e).zhvalue||"",r.value=r.value||v.get(e).value||""}var c=[a.carbrandid.zhvalue,a.cartypeid.zhvalue,a.carcolorid.zhvalue],l=$("#carbrand");l.val($.trim(c.join(" "))||v.get("brand_type_color_zhvalue")).data("carbrandid",a.carbrandid.value).data("cartypeid",a.cartypeid.value).data("carcolorid",a.carcolorid.value),1!=a.carbrandid.changeable?l.attr("readonly","").parent().parent().addClass("disabled"):n(),1!=a.carprovinceid.changeable?$("#carprovince").attr("disabled","").parent().parent().addClass("disabled"):i(),$("#carno").val(a.carcardnumber.value),1!=a.carcardnumber.changeable&&$("#carno").attr("disabled","").parent().parent().addClass("disabled"),$("#drivelicensename").val(a.drivelicensename.value),1!=a.drivelicensename.changeable&&$("#drivelicensename").attr("disabled","").parent().parent().addClass("disabled"),$("#drivelicensenumber").val(a.drivelicensenumber.value),1!=a.drivelicensenumber.changeable&&$("#drivelicensenumber").attr("disabled","").parent().parent().addClass("disabled")}function r(a,e,r){var n=m();n&&(r&&(n.token=r),o.showLoading(),$.ajax({url:a,data:n,success:function(a){if(o.closeLoading(),a=JSON.parse(a),0==a.errno)location.assign(e);else if(101==a.errno)u();else{if("6010"==a.errno)return void c.dialog.confirm({title:"",text:"该身份证已被注册，如果仍需注册，请进行申诉。",confirm:{val:"我要申诉",handler:function(){location.href="http://static.xiaojukeji.com/didialift/hybrid/pages/help/help-accountDatumOQ06.html"}}});if("6009"==a.errno)return void c.dialog.confirm({title:"",text:"车辆已被注册。如果不是你本人或熟人操作，你可以通过申诉来进行车主认证。",confirm:{val:"我要申诉",handler:function(){location.href="http://static.xiaojukeji.com/didialift/hybrid/pages/help/help-accountDatumOQ07.html"}}});c.dialog.alert(a.errmsg)}}}))}function n(){$("#carbrand").click(function(){s.log("cartype"),$.didiCarChoose({brandsURL:pageParams.getcarbrand,typesURL:pageParams.getcartype,colorsURL:pageParams.getcolor,onselect:function(a){$("#carbrand").val(a.carInfo).data("carbrandid",a.value.brand.id).data("cartypeid",a.value.type.id).data("carcolorid",a.value.color.id),v.save_cache("carbrandid",{value:a.value.brand.id}),v.save_cache("cartypeid",{value:a.value.type.id}),v.save_cache("carcolorid",{value:a.value.color.id}),v.save_cache("brand_type_color_zhvalue",a.carInfo)}})})}function i(){function a(a){var n=r.txtToJson(a),i=0==pageParams.form_data.carprovinceid.value?1:pageParams.form_data.carprovinceid.value;if($("#carprovince").val(n.data[i]),"0"==n.errno){for(var c=n.data,l=n.sort,o="",d=0,s=l.length;s>d;d++)o+='<li data-id="'+l[d]+'" data-show="'+c[l[d]]+'">'+c[l[d]]+"</li>";ulEl.innerHTML+=o}t(carprovince,e,[],function(a){$("#carprovince").data("id",a.value),$("#carprovince").val(a.text),v.save_cache("carprovinceid",{value:a.value,zhvalue:a.text})})}var e=document.getElementById("carnoSelect"),r=c.base;ulEl=e.getElementsByClassName("options")[0];var n=function(){r.ajax({method:"POST",url:"/pinche/cartype/getlicensehead",succFunc:a,failFunc:function(){}})};n()}a("carchoose");var c=a("dd"),l=a("log"),t=a("SingleSelector"),o=(a("tool"),a("driver_register_tool")),d=a("login");l.saverindex_page_sw();var s=function(){var a=[];return{log:function(e){for(var r=0;r<a.length;r++)if(a[r]==e)return;a.push(e),l["saverform_inputbox_focus_"+e]()}}}(),u=function(){d.show().sendmsm(function(a,e){o.showLoading(),$.ajax({url:pageParams.p_getsmscode_url+a,timeout:"5000",success:function(a){o.closeLoading();var a=JSON.parse(a);0==a.errno?e.focus():1008==a.errno?(c.dialog.alert("您将来接到电话通知您验证码，请注意查收"),e.focus()):(btnCheck.removeClass("btnGray"),phone.disabled="false",c.dialog.alert(a.errmsg))},error:function(){o.closeLoading(),c.dialog.alert("网络请求失败，请稍后重试"),phone.disabled="false",_this.removeClass("btnGray")}})}).commit(function(a,e){o.showLoading(),$.ajax({type:"POST",url:pageParams.p_login_url,data:{phone:a,code:e},timeout:"5000",success:function(a){o.closeLoading();var a=JSON.parse(a);if(0==a.errno)window.location.href=pageParams.success_url;else if(101==a.errno){d.hide();var e=a.commit_url,n=a.next_url,i=a.token;r(e,n,i),pageParams.commit_url=e,pageParams.token=i}else{if(102!=a.errno)return dialog.alert(da.errmsg||"");location.href=a.next_url}},error:function(){_this.removeClass("btnGray")}})})},v=o.localCache.instance("driver_register_saver_form");e();var m=function(){var a={carbrandid:$("#carbrand").data("carbrandid"),cartypeid:$("#carbrand").data("cartypeid"),carcolorid:$("#carbrand").data("carcolorid"),carprovinceid:$("#carprovince").data("id"),carcardnumber:$("#carno").val(),drivelicensename:$("#drivelicensename").val(),drivelicensenumber:$("#drivelicensenumber").val()};return""==a.carbrandid?(c.dialog.alert("请选择品牌和车型"),!1):o.regular.is_carNo(a.carcardnumber)?o.regular.is_Chinese_name(a.drivelicensename)?o.regular.is_ID_card(a.drivelicensenumber)?a:(c.dialog.alert("请输入正确的驾驶证号"),!1):(c.dialog.alert("请输入正确的驾驶人姓名"),!1):(c.dialog.alert("请输入正确的车牌号"),!1)};$("#submit").click(function(){var a=pageParams.commit_url,e=pageParams.success_url,n=pageParams.token,i=""!=pageParams.token;if(i)r(a,e,n);else{var c=m();if(!c)return;u()}}),$("#carno").on("blur",function(){$("#carno").val($("#carno").val().toUpperCase())},!1),$("#carno").blur(function(){var a=$(this).attr("name"),e=$(this).val();v.save_cache(a,{value:e})}),$("#drivelicensename").blur(function(){var a=$(this).attr("name"),e=$(this).val();v.save_cache(a,{value:e})}),$("#drivelicensenumber").blur(function(){var a=$(this).attr("name"),e=$(this).val();v.save_cache(a,{value:e})})});