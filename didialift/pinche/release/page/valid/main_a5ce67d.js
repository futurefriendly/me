define("page/valid/main.js",function(e){var n=e("tool/tool.js"),a=function(){var e=n.getQueryParams();return"token"in e?!0:(n.getToken(function(n){e.token=n;var a="?";for(var t in e)"?"!=a&&(a+="&"),a+=t+"="+e[t];location.search=a}),!1)};dd.ready(function(){a();var e=document,n=dd.base,t=dd.dialog,r=e.getElementById("openid").value,l=e.getElementById("p_getsmscode_url").value,o=e.getElementById("p_login_url").value,u=e.getElementById("type").value,c=e.getElementById("channel").value,s=e.getElementById("phone"),i=e.getElementById("code"),d=e.getElementById("btnSubmit"),f=e.getElementById("btnCheck"),g=60,m=function(e){return/^1[3|4|5|8|7][0-9]\d{8}$/.test(e)?!0:!1};s.addEventListener("input",function(e){var n=s;n.value=n.value.replace(/[^\d]/g,"").slice(0,11),f.className=m(n.value)?"btn-orange fr":"btn-gray fr",v(e)},!1),i.addEventListener("input",function(e){v(e)},!1);var v=function(){var e=i;e.value=e.value.replace(/[^\d]/g,"").slice(0,4),d.className=4==e.value.length&&m(s.value)?"btn-orange":"btn-gray"};n.touch(f,function(){function e(){return 0==g?(f.className="btn-orange fr",f.innerHTML="验证","btn-orange"==d.className,"change"!==u&&(s.disabled=""),void(g=60)):("btn-gray"==d.className,f.className="btn-gray fr",f.innerHTML=g+"s",g--,void setTimeout(function(){e()},1e3))}"btn-gray fr"!=f.className&&(s.disabled="true",f.className="btn-gray fr",e(),n.ajax({method:"GET",url:l+s.value,succFunc:function(e){var a=n.txtToJson(e);0==a.errno?i.focus():1008==a.errno?(t.alert("您将来接到电话通知您验证码，请注意查收"),i.focus()):(f.className="btn-orange fr",s.disabled="false",t.alert(a.errmsg))},failFunc:function(){f.className="btn-orange fr",t.alert("网络请求失败，请稍后重试"),s.disabled="false"}}))}),n.touch(d,function(){if("btn-gray"!=d.className){d.className="btn-gray",i.readOnly="readOnly",i.blur(),setTimeout(function(){i.readOnly="",i.blur()},100);var e=""==c?"":"&channel="+c;e+='<?php echo isset($regfrom) ? "&regfrom=$regfrom" : "" ?>',n.ajax({method:"POST",url:o+"&phone="+s.value+e,data:{lat:"116.30786072065",lng:"40.045781758746",channel:c,regfrom:"<?php echo isset($regfrom) ? $regfrom : '';?>",phone:s.value,code:i.value,openid:r},succFunc:function(e){var a=n.txtToJson(e);0==a.errno?location.replace(a.next_url):9999==a.errno?location.replace(a.url):t.alert(a.errmsg)},failFunc:function(){t.alert("网络请求失败，请稍后重试")}})}}),function(){11==s.value.length&&(f.className="btn-orange fr"),setTimeout(function(){s.focus()},100)}()})});