define("carchoose",function(){!function(n){function t(){m(),g(),T()}function e(){w()}function i(){window.dd&&window.dd.dialog&&window.dd.dialog.loading("正在加载",2e3)}function a(){window.dd&&window.dd.dialog&&window.dd.dialog.loading("正在加载",100)}function o(){S&&S.height(n(window).height())}function r(){var t=navigator.userAgent;S=n('<div class="choose-cartype-layer" />').prependTo("body"),(/MicroMessenger/.test(t)||!/Android/.test(t))&&S.css("visibility","hidden"),o(),S.append('<section class="choose-brand-layer"><div></div></section>'),S.append('<section class="choose-type-layer"><div></div></section>'),S.append('<section class="choose-color-layer"><div></div></section>'),$=n(".choose-brand-layer").append('<div class="choose-cartype-shortcut"></div>'),M=n(".choose-type-layer"),z=n(".choose-color-layer"),$shortcut=$.find(".choose-cartype-shortcut"),s()}function s(){i(),n.ajax({url:A,dataType:"json",success:function(n){a(),"0"==n.errno&&(d(n.data),S.css("visibility","visible"),w(),c(n.data),u(),f(),h(),l())},error:function(){a()}})}function c(n){var t=[];for(var e in n)t.push(['<div><a href="javascript:void(0);" data-anchor="car-brand-',e,'">',e,"</a></div>"].join(""));$shortcut.html(t.join(""))}function d(n){var t=[];for(var e in n){t.push(['<h3 id="car-brand-'+e+'">',"<div><span>"+e+"</span></div>","</h3>","<ul>"].join(""));for(var i=n[e],a=0;a<i.length;a++)t.push(['<li data-brand-id="'+i[a].brand_id+'">',i[a].name,"</li>"].join(""));t.push("</ul>")}$.find("div").html(t.join("")),k?k.refresh():k=new IScroll($[0],{click:!0,deceleration:_})}function l(){$shortcut.on("click",function(t){var e,i=n(t.target).closest("a");i.length&&(i.addClass("selected"),setTimeout(function(){i.removeClass("selected")},200),e=i.data("anchor"),k.scrollToElement("#"+e,0))})}function u(){$.on("click",function(t){var e,o,r=n(t.target).closest("li");r.length&&r!=F&&(F&&F.removeClass("selected"),F=r,r.addClass("selected"),e=r.data("brand-id"),o=r.text(),Z.brand={id:e,name:o},R[e]?(p(R[e]),y(),T()):(g(),T(),i(),n.ajax({url:E+"?carbrand="+e,dataType:"json",success:function(n){a(),0==n.errno&&(R[e]=n.data,p(n.data),y())},error:function(){a()}})))})}function f(){M.on("click",function(t){var e,o,r,s=n(t.target).closest("li");s.length&&s!=I&&(I&&I.removeClass("selected"),I=s,s.addClass("selected"),e=s.data("brand-type-id"),o=s.text(),r=new RegExp(Z.brand.name.replace(/[\\\|*+?^$]/g,"\\$&"),"g"),Z.type={id:e,shortName:o.replace(r,""),name:o},O?b():(T(),i(),n.ajax({url:L,dataType:"json",success:function(n){a(),0==n.errno&&(O=n.data,v(n.data),b())},error:function(){a()}})))})}function h(){z.on("click",function(e){var i,a,o,r=n(e.target).closest("li");r.length&&(i=r.data("color-id"),a=r.text(),Z.color={id:i,name:a},o=U.subStrg(Z.brand.name,6)+" "+U.subStrg(Z.type.shortName,4)+" "+Z.color.name,N&&N({value:Z,carInfo:o}),t())})}function p(n){for(var t=["<ul>"],e=n,i=0;i<e.length;i++)t.push(['<li data-brand-type-id="'+e[i].brand_type_id+'">',e[i].brand_type_name,"</li>"].join(""));t.push("</ul>"),M.find("div").html(t.join("")),C?C.refresh():C=new IScroll(M[0],{click:!0,deceleration:_})}function v(n){var t=["<ul>"],e=n;for(var i in e)t.push(['<li data-color-id="'+i+'">',e[i].name,"</li>"].join(""));t.push("</ul>"),z.find("div").html(t.join("")),D?D.refresh():D=new IScroll(z[0],{click:!0,deceleration:_})}function w(){$shortcut[0].style.display="block",x(S[0],n(window).width(),0),x(S[0],0,150)}function m(){F&&F.removeClass("selected"),F=null,x(S[0],0,0),x(S[0],n(window).width(),150),$shortcut[0].style.display="none"}function y(){x(M[0],-.66*n(window).width(),150)}function g(){I&&I.removeClass("selected"),I=null,x(M[0],-.66*n(window).width(),0),x(M[0],0,150)}function b(){x(z[0],-.33*n(window).width(),150)}function T(){x(z[0],-.33*n(window).width(),0),x(z[0],0,150)}function x(n,t,e,i,a){var o=n&&n.style,r="",s="";if(i||(i="linear"),a||(a=0),o){if("[object Array]"===Object.prototype.toString.call(t))switch(t.length){case 3:r=s="translate3d("+t[0]+"px,"+t[1]+"px,"+t[2]+"px)";break;case 2:r=s="translate("+t[0]+"px,"+t[1]+"px)translateZ(0)";break;case 1:r="translate("+t[0]+"px,0)translateZ(0)",s="translateX("+t[0]+"px)";break;default:r="translate("+t[0]+"px,0)translateZ(0)",s="translateX("+t[0]+"px)"}else{if(isNaN(parseInt(t)))return;r="translate("+t+"px,0)translateZ(0)",s="translateX("+t+"px)"}o.webkitTransitionDuration=o.MozTransitionDuration=o.msTransitionDuration=o.OTransitionDuration=o.transitionDuration=e+"ms",o.webkitTransitionTimingFunction=o.MozTransitionTimingFunction=o.msTransitionTimingFunction=o.OTransitionTimingFunction=o.transitionTimingFunction=i,o.webkitTransitionDelay=o.MozTransitionDelay=o.msTransitionDelay=o.OTransitionDelay=o.transitionDelay=a+"ms",o.webkitTransform=r,o.msTransform=o.MozTransform=o.OTransform=s}}function j(n){return document.activeElement&&document.activeElement.blur(),S?void setTimeout(function(){e()},300):(n=n||{},A=n.brandsURL||"/pinche/cartype/getcarbrand",E=n.typesURL||"/pinche/cartype/getcartype",L=n.colorsURL||"/pinche/cartype/getcolor",N=n.onselect||function(){},void r())}var k,C,D,S,$,M,z,F,I,O,Z,_,A,E,L,N,R={};_=.002,Z={brand:{},type:{},color:{}},n(window).on("resize",function(){o()});var U=function(){var n=function(n){return n.replace(/[^\x00-\xff]/g,"**").length},t=function(t,e){if(null==t)return"";if(n(t)>e){for(var i,a=0,o="",r=0;r<t.length;r++)if(i=t.charAt(r),a+=n(i),a>=e){o=t.substring(0,r+1);break}return o+="..."}return t};return{LenB:n,subStrg:t}}();n.didiCarChoose=function(n){j(n)}}(Zepto)});