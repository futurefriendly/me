define("carchoose/main.js",function(){!function(n){function t(){w(),y(),T()}function i(){m()}function e(){window.dd&&window.dd.dialog&&window.dd.dialog.loading("正在加载",2e3)}function a(){window.dd&&window.dd.dialog&&window.dd.dialog.loading("正在加载",100)}function o(){S&&S.height(n(window).height())}function r(){S=n('<div class="choose-cartype-layer" />').prependTo("body").css("visibility","hidden"),o(),S.append('<section class="choose-brand-layer"><div></div></section>'),S.append('<section class="choose-type-layer"><div></div></section>'),S.append('<section class="choose-color-layer"><div></div></section>'),z=n(".choose-brand-layer").append('<div class="choose-cartype-shortcut"></div>'),F=n(".choose-type-layer"),I=n(".choose-color-layer"),$shortcut=z.find(".choose-cartype-shortcut"),c()}function c(){e(),n.ajax({url:L,dataType:"json",success:function(n){a(),"0"==n.errno&&(d(n.data),S.css("visibility","visible"),m(),s(n.data),u(),f(),h(),l())},error:function(){a()}})}function s(n){var t=[];for(var i in n)t.push(['<div><a href="javascript:void(0);" data-anchor="car-brand-',i,'">',i,"</a></div>"].join(""));$shortcut.html(t.join(""))}function d(n){var t=[];for(var i in n){t.push(['<h3 id="car-brand-'+i+'">',"<div><span>"+i+"</span></div>","</h3>","<ul>"].join(""));for(var e=n[i],a=0;a<e.length;a++)t.push(['<li data-brand-id="'+e[a].brand_id+'">',e[a].name,"</li>"].join(""));t.push("</ul>")}z.find("div").html(t.join("")),k?k.refresh():k=new IScroll(z[0],{click:!0,deceleration:E})}function l(){$shortcut.on("click",function(t){var i,e=n(t.target).closest("a");e.length&&(e.addClass("selected"),setTimeout(function(){e.removeClass("selected")},200),i=e.data("anchor"),k.scrollToElement("#"+i,0))})}function u(){z.on("click",function(t){var i,o,r=n(t.target).closest("li");r.length&&r!=O&&(O&&O.removeClass("selected"),O=r,r.addClass("selected"),i=r.data("brand-id"),o=r.text(),_.brand={id:i,name:o},U[i]?(p(U[i]),g(),T()):(y(),T(),e(),n.ajax({url:M+"?carbrand="+i,dataType:"json",success:function(n){a(),0==n.errno&&(U[i]=n.data,p(n.data),g())},error:function(){a()}})))})}function f(){F.on("click",function(t){var i,o,r,c=n(t.target).closest("li");c.length&&c!=Z&&(Z&&Z.removeClass("selected"),Z=c,c.addClass("selected"),i=c.data("brand-type-id"),o=c.text(),r=new RegExp(_.brand.name.replace(/[\\\|*+?^$]/g,"\\$&"),"g"),_.type={id:i,shortName:o.replace(r,""),name:o},$?b():(T(),e(),n.ajax({url:N,dataType:"json",success:function(n){a(),0==n.errno&&($=n.data,v(n.data),b())},error:function(){a()}})))})}function h(){I.on("click",function(i){var e,a,o,r=n(i.target).closest("li");r.length&&(e=r.data("color-id"),a=r.text(),_.color={id:e,name:a},o=X.subStrg(_.brand.name,6)+" "+X.subStrg(_.type.shortName,4)+" "+_.color.name,R&&R({value:_,carInfo:o}),t())})}function p(n){for(var t=["<ul>"],i=n,e=0;e<i.length;e++)t.push(['<li data-brand-type-id="'+i[e].brand_type_id+'">',i[e].brand_type_name,"</li>"].join(""));t.push("</ul>"),F.find("div").html(t.join("")),C?C.refresh():C=new IScroll(F[0],{click:!0,deceleration:E})}function v(n){var t=["<ul>"],i=n;for(var e in i)t.push(['<li data-color-id="'+e+'">',i[e].name,"</li>"].join(""));t.push("</ul>"),I.find("div").html(t.join("")),D?D.refresh():D=new IScroll(I[0],{click:!0,deceleration:E})}function m(){x(S[0],n(window).width(),0),x(S[0],0,150)}function w(){O&&O.removeClass("selected"),O=null,x(S[0],0,0),x(S[0],n(window).width(),150)}function g(){x(F[0],-.66*n(window).width(),150)}function y(){Z&&Z.removeClass("selected"),Z=null,x(F[0],-.66*n(window).width(),0),x(F[0],0,150)}function b(){x(I[0],-.33*n(window).width(),150)}function T(){x(I[0],-.33*n(window).width(),0),x(I[0],0,150)}function x(n,t,i,e,a){var o=n&&n.style,r="",c="";if(e||(e="linear"),a||(a=0),o){if("[object Array]"===Object.prototype.toString.call(t))switch(t.length){case 3:r=c="translate3d("+t[0]+"px,"+t[1]+"px,"+t[2]+"px)";break;case 2:r=c="translate("+t[0]+"px,"+t[1]+"px)translateZ(0)";break;case 1:r="translate("+t[0]+"px,0)translateZ(0)",c="translateX("+t[0]+"px)";break;default:r="translate("+t[0]+"px,0)translateZ(0)",c="translateX("+t[0]+"px)"}else{if(isNaN(parseInt(t)))return;r="translate("+t+"px,0)translateZ(0)",c="translateX("+t+"px)"}o.webkitTransitionDuration=o.MozTransitionDuration=o.msTransitionDuration=o.OTransitionDuration=o.transitionDuration=i+"ms",o.webkitTransitionTimingFunction=o.MozTransitionTimingFunction=o.msTransitionTimingFunction=o.OTransitionTimingFunction=o.transitionTimingFunction=e,o.webkitTransitionDelay=o.MozTransitionDelay=o.msTransitionDelay=o.OTransitionDelay=o.transitionDelay=a+"ms",o.webkitTransform=r,o.msTransform=o.MozTransform=o.OTransform=c}}function j(n){return document.activeElement&&document.activeElement.blur(),S?void setTimeout(function(){i()},300):(n=n||{},L=n.brandsURL||"/pinche/cartype/getcarbrand",M=n.typesURL||"/pinche/cartype/getcartype",N=n.colorsURL||"/pinche/cartype/getcolor",R=n.onselect||function(){},void r())}var k,C,D,S,z,F,I,O,Z,$,_,E,L,M,N,R,U={};E=.002,_={brand:{},type:{},color:{}},n(window).on("resize",function(){o()});var X=function(){var n=function(n){return n.replace(/[^\x00-\xff]/g,"**").length},t=function(t,i){if(null==t)return"";if(n(t)>i){for(var e,a=0,o="",r=0;r<t.length;r++)if(e=t.charAt(r),a+=n(e),a>=i){o=t.substring(0,r+1);break}return o+="..."}return t};return{LenB:n,subStrg:t}}();n.didiCarChoose=function(n){j(n)}}(Zepto)});