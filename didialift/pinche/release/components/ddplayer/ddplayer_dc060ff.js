define("ddplayer",function(e,n,t){!function(){window.ddvp=window.ddvp||{},window.ddvp.debug={};var e=Date.now();ddvp.debug.playerLoadStartTime=e||0,ddvp.debug.playerLoadScriptTime=e||0,ddvp.debug.playerPlayStartTime=0,ddvp.debug.playerLoadDomStartTime=0,ddvp.debug.playerLoadAdDataStartTime=0,ddvp.debug.playerLoadMediaDataStartTime=0,ddvp.debug.isShowPlayerPlayStartTime=!1}(),window.ddvp="undefined"==typeof window.ddvp?{}:window.ddvp,!function(e,r){function i(e){return e.replace(S,"").replace(T,",").replace(_,"").replace(j,"").replace(E,"").split(k)}function o(e){return"'"+e.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function a(e,n){function t(e){return p+=e.split(/\n/).length-1,d&&(e=e.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),e&&(e=g[1]+o(e)+g[2]+"\n"),e}function r(e){var t=p;if(s?e=s(e,n):a&&(e=e.replace(/\n/g,function(){return p++,"$line="+p+";"})),0===e.indexOf("=")){var r=l&&!/^=[=#]/.test(e);if(e=e.replace(/^=[=#]?|[\s;]*$/g,""),r){var o=e.replace(/\s*\([^\)]+\)/,"");v[o]||/^(include|print)$/.test(o)||(e="$escape("+e+")")}else e="$string("+e+")";e=g[1]+e+g[2]}return a&&(e="$line="+t+";"+e),$(i(e),function(e){if(e&&!f[e]){var n;n="print"===e?y:"include"===e?b:v[e]?"$utils."+e:w[e]?"$helpers."+e:"$data."+e,x+=e+"="+n+",",f[e]=!0}}),e+"\n"}var a=n.debug,c=n.openTag,u=n.closeTag,s=n.parser,d=n.compress,l=n.escape,p=1,f={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},h="".trim,g=h?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],m=h?"$out+=text;return $out;":"$out.push(text);",y="function(){var text=''.concat.apply('',arguments);"+m+"}",b="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+m+"}",x="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(a?"$line=0,":""),S=g[0],T="return new String("+g[3]+");";$(e.split(c),function(e){e=e.split(u);var n=e[0],i=e[1];1===e.length?S+=t(n):(S+=r(n),i&&(S+=t(i)))});var _=x+S+T;a&&(_="try{"+_+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+o(e)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var j=new Function("$data","$filename",_);return j.prototype=v,j}catch(E){throw E.temp="function anonymous($data,$filename) {"+_+"}",E}}var c=function(e,n){return"string"==typeof n?b(n,{filename:e}):d(e,n)};c.version="3.0.0",c.config=function(e,n){u[e]=n};var u=c.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},s=c.cache={};c.render=function(e,n){return b(e,n)};var d=c.renderFile=function(e,n){var t=c.get(e)||y({filename:e,name:"Render Error",message:"Template not found"});return n?t(n):t};c.get=function(e){var n;if(s[e])n=s[e];else if("object"==typeof document){var t=document.getElementById(e);if(t){var r=(t.value||t.innerHTML).replace(/^\s*|\s*$/g,"");n=b(r,{filename:e})}}return n};var l=function(e,n){return"string"!=typeof e&&(n=typeof e,"number"===n?e+="":e="function"===n?l(e.call(e)):""),e},p={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},f=function(e){return p[e]},h=function(e){return l(e).replace(/&(?![\w#]+;)|[<>"']/g,f)},g=Array.isArray||function(e){return"[object Array]"==={}.toString.call(e)},m=function(e,n){var t,r;if(g(e))for(t=0,r=e.length;r>t;t++)n.call(e,e[t],t,e);else for(t in e)n.call(e,e[t],t)},v=c.utils={$helpers:{},$include:d,$string:l,$escape:h,$each:m};c.helper=function(e,n){w[e]=n};var w=c.helpers=v.$helpers;c.onerror=function(e){var n="Template Error\n\n";for(var t in e)n+="<"+t+">\n"+e[t]+"\n\n";console.log(n)};var y=function(e){return c.onerror(e),function(){return"{Template Error}"}},b=c.compile=function(e,n){function t(t){try{return new c(t,o)+""}catch(r){return n.debug?y(r)():(n.debug=!0,b(e,n)(t))}}n=n||{};for(var i in u)n[i]===r&&(n[i]=u[i]);var o=n.filename;try{var c=a(e,n)}catch(d){return d.filename=o||"anonymous",d.name="Syntax Error",y(d)}return t.prototype=c.prototype,t.toString=function(){return c.toString()},o&&n.cache&&(s[o]=t),t},$=v.$each,x="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",S=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,T=/[^\w$]+/g,_=new RegExp(["\\b"+x.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),j=/^\d[^,]*|,\d[^,]*/g,E=/^,+|,+$/g,k=/^$|,+/;c.parseTpl=function(e,n){var t="var __p=[];with(obj||{}){__p.push('"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/<%=([\s\S]+?)%>/g,function(e,n){return"',"+n.replace(/\\'/,"'")+",'"}).replace(/<%([\s\S]+?)%>/g,function(e,n){return"');"+n.replace(/\\'/,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+'\');}return __p.join("");',r=new Function("obj",t);return n?r(n):r};var O;"function"==typeof e.template?O=e.template:e.template=c,"function"==typeof define?define(function(){return c}):"function"==typeof define?define(function(){return c}):"undefined"!=typeof n&&(t.exports=c)}(ddvp),!function(e){function n(e){var n=this.os={},t=this.browser={},r=e.match(/WebKit\/([\d.]+)/),i=e.match(/(Android)\s+([\d.]+)/),o=e.match(/(iPad).*OS\s([\d_]+)/),a=!o&&e.match(/(iPhone\sOS)\s([\d_]+)/),c=e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),u=c&&e.match(/TouchPad/),s=e.match(/Kindle\/([\d.]+)/),d=e.match(/Silk\/([\d._]+)/),l=e.match(/(BlackBerry).*Version\/([\d.]+)/);(t.webkit=!!r)&&(t.version=r[1]),i&&(n.android=!0,n.version=i[2]),a&&(n.ios=n.iphone=!0,n.version=a[2].replace(/_/g,".")),o&&(n.ios=n.ipad=!0,n.version=o[2].replace(/_/g,".")),c&&(n.webos=!0,n.version=c[2]),u&&(n.touchpad=!0),l&&(n.blackberry=!0,n.version=l[2]),s&&(n.kindle=!0,n.version=s[1]),d&&(t.silk=!0,t.version=d[1]),!d&&n.android&&e.match(/Kindle Fire/)&&(t.silk=!0)}n.call(e,navigator.userAgent),e.__detect=n}(Zepto),!function(e,n){function t(e){return e.toLowerCase()}function r(e){return i?i+e:t(e)}var i,o="",a={Webkit:"webkit",Moz:"",O:"o",ms:"MS"},c=window.document,u=c.createElement("div"),s=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,d={};e.each(a,function(e,r){return u.style[e+"TransitionProperty"]!==n?(o="-"+t(e)+"-",i=r,!1):void 0}),d[o+"transition-property"]=d[o+"transition-duration"]=d[o+"transition-timing-function"]=d[o+"animation-name"]=d[o+"animation-duration"]="",e.fx={off:i===n&&u.style.transitionProperty===n,cssPrefix:o,transitionEnd:r("TransitionEnd"),animationEnd:r("AnimationEnd")},e.fn.animate=function(n,t,r,i){return e.isObject(t)&&(r=t.easing,i=t.complete,t=t.duration),t&&(t/=1e3),this.anim(n,t,r,i)},e.fn.anim=function(t,r,i,a){var c,u,l,p={},f=this,h=e.fx.transitionEnd;if(r===n&&(r=.4),e.fx.off&&(r=0),"string"==typeof t)p[o+"animation-name"]=t,p[o+"animation-duration"]=r+"s",h=e.fx.animationEnd;else{for(u in t)s.test(u)?(c||(c=[]),c.push(u+"("+t[u]+")")):p[u]=t[u];c&&(p[o+"transform"]=c.join(" ")),e.fx.off||"object"!=typeof t||(p[o+"transition-property"]=Object.keys(t).join(", "),p[o+"transition-duration"]=r+"s",p[o+"transition-timing-function"]=i||"linear")}return l=function(n){if("undefined"!=typeof n){if(n.target!==n.currentTarget)return;e(n.target).unbind(h,arguments.callee)}e(this).css(d),a&&a.call(this)},r>0&&this.bind(h,l),setTimeout(function(){f.css(p),0>=r&&setTimeout(function(){f.each(function(){l.call(this)})},0)},0),this},u=null}(Zepto),!function(e,n){var t,r=n.userAgent,i=e.browser,o={wx:/WeixinJSBridge|MicroMessenger\/([\d.]+)/i,qq:/MQQBrowser\/([\d.]+)/i,uc:/UCBrowser\/([\d.]+)/i,miui:/MiuiBrowser\/([\d.]+)/i,baidu:/baidubrowser\/.*?([\d.]+)/i};e.each(o,function(e,n){return(t=r.match(n))?(i[e]=!0,i.version=t[1],!1):void 0}),!i.uc&&/Uc/i.test(n.appVersion)&&(i.uc=!0)}(Zepto,window.navigator),function(e,n){function t(){var e=o.attr("hl-cls");clearTimeout(a),o.removeClass(e).removeAttr("hl-cls"),o=null,c.off("touchend touchmove touchcancel",t)}var r=(window.document,document.documentElement,window),i={fix:function(t){var r=this;if(r.attr("isFixed"))return r;r.css(t).css("position","fixed").attr("isFixed",!0);var i=e('<div style="position:fixed;top:10px;"></div>').appendTo("body"),o=i[0].getBoundingClientRect().top,a=function(){window.pageYOffset>0&&(i[0].getBoundingClientRect().top!==o&&(r.css("position","absolute"),c(),e(window).on("scrollStop",c),e(window).on("ortchange",c)),e(window).off("scrollStop",a),i.remove())},c=function(){r.css({top:window.pageYOffset+(t.bottom!==n?window.innerHeight-r.height()-t.bottom:t.top||0),left:t.right!==n?document.body.offsetWidth-r.width()-t.right:t.left||0}),"100%"==t.width&&r.css("width",document.body.offsetWidth)};return e(window).on("scrollStop",a),r}};e.extend(e.fn,i),e.extend(e,i),e.matchMedia=function(){var n=0,t="media-detect",r=e.fx.transitionEnd,i=e.fx.cssPrefix,o=e("<style></style>").append("."+t+"{"+i+"transition: width 0.001ms; width: 0; position: absolute; clip: rect(1px, 1px, 1px, 1px);}\n").appendTo("head");return function(i){var a,c,u=t+n++,s=[];return o.append("@media "+i+" { #"+u+" { width: 1px; } }\n"),a=e('<div class="'+t+'" id="'+u+'"></div>').appendTo("body").on(r,function(){c.matches=1===a.width(),e.each(s,function(n,t){e.isFunction(t)&&t.call(c,c)})}),c={matches:1===a.width(),media:i,addListener:function(e){return s.push(e),this},removeListener:function(e){var n=s.indexOf(e);return~n&&s.splice(n,1),this}}}}(),e.mediaQuery={ortchange:"screen and (width: "+window.innerWidth+"px)"},e.matchMedia(e.mediaQuery.ortchange).addListener(function(){e(window).trigger("ortchange")});var o,a,c=e(document);e.fn.highlight=function(n,r){return this.each(function(){var i=e(this);i.css("-webkit-tap-highlight-color","rgba(255,255,255,0)").off("touchstart.hl"),n&&i.on("touchstart.hl",function(u){var s;o=r?(s=e(u.target).closest(r,this))&&s.length&&s:i,o&&(o.attr("hl-cls",n),a=setTimeout(function(){o.addClass(n)},100),c.on("touchend touchmove touchcancel",t))})})},e.fn.throttle=function(t,r,i){function o(){function e(){c=Date.now(),r.apply(u,d)}function o(){a=n}var u=this,s=Date.now()-c,d=arguments;i&&!a&&e(),a&&clearTimeout(a),i===n&&s>t?e():a=setTimeout(i?o:e,i===n?t-s:t)}var a,c=0;return"function"!=typeof r&&(i=r,r=t,t=250),o._zid=r._zid=r._zid||e.proxy(r)._zid,o},e.fn.debounce=function(t,r,i){return r===n?e.fn.throttle(250,t,!1):e.fn.throttle(t,r,i===n?!1:i!==!1)},e(r).on("pageshow",function(n){n.persisted&&e(r).off("touchstart",backEventOffHandler).one("touchstart",backEventOffHandler)}),e.fn.parseTpl=function(e,n){var t="var __p=[];with(obj||{}){__p.push('"+e.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/<%=([\s\S]+?)%>/g,function(e,n){return"',"+n.replace(/\\'/,"'")+",'"}).replace(/<%([\s\S]+?)%>/g,function(e,n){return"');"+n.replace(/\\'/,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+'\');}return __p.join("");',r=new Function("obj",t);return n?r(n):r};var u={highlight:e.fn.highlight,throttle:e.fn.throttle,debounce:e.fn.debounce,parseTpl:e.fn.parseTpl,oriShow:function(){return this.css({display:"block"}),this},oriHide:function(){return this.css({display:"none"}),this},htmlLog:function(n,t){0===e("#js_htmlLog").length&&e("body").append(e('<div id="js_htmlLog" style="height: 200px;overflow: scroll;"></div>'));var r=[];e.isUndefined(n)||r.push("<span>"+n+"</span>"),e.isUndefined(t)||r.push("<span>"+t+"</span>"),e("#js_htmlLog").prepend(r.join(" ")+"<br>")},noop:function(){},blankFun:function(){},isString:function(n){return"string"===e.type(n)},isUndefined:function(e){return"undefined"==typeof e},isNumber:function(n){return"number"===e.type(n)},isEmpty:function(e){if(null==e)return!0;if(e.length>0)return!1;if(0===e.length)return!0;for(var n in e)if(hasOwnProperty.call(e,n)||null!==e[n])return!1;return!0},isArray:function(n){return!e.isUndefined(n)&&n instanceof Array},merge:function(n,t){for(var r in n)e.isUndefined(t[r])||(n[r]=t[r]);return n},isScript:function(e){return e=e||"",!!/\.js(?=[\?#]|$)/i.exec(e)},isCss:function(e){return e=e||"",!!/\.css(?=[\?#]|$)/i.exec(e)},isRegExp:function(e){return e&&"[object RegExp]"===Object.prototype.toString.call(e)},now:function(){return(new Date).getTime()},nowDataString:function(){var e=new Date,n=String(e.getMonth()+1>=12?12:e.getMonth()+1);n.length<2&&(n="0"+n);var t=String(e.getDate());t.length<2&&(t="0"+t);var r=String(e.getHours());r.length<2&&(r="0"+r);var i=String(e.getMinutes());i.length<2&&(i="0"+i);var o=String(e.getSeconds());o.length<2&&(o="0"+o);var a=" "+e.getFullYear()+n+t+" "+r+":"+i+":"+o;return a},getISOTimeFormat:function(){var e=new Date,n=e.getFullYear(),t=e.getMonth()+1,r=e.getDate(),i=e.getHours(),o=e.getMinutes(),a=e.getSeconds();return[[n,10>t?"0"+t:t,10>r?"0"+r:r].join("-"),[10>i?"0"+i:i,10>o?"0"+o:o,10>a?"0"+a:a].join(":")].join(" ")},formatSeconds:function(e){e=parseInt(e);var n=parseInt(e/60),t=n>=60?parseInt(n/60):0,r=e%60,i="";return n>=60&&(n%=60),t>0&&(i+=10>t?"0"+t:t,i+=":"),i+=10>n?"0"+n:n,i+=":",i+=10>r?"0"+r:r},getHost:function(){var e=window.location.hostname||window.location.host,n=location.host.split(".");return n.length>1&&(e=n.slice(n.length-2).join(".")),e},getUrlParam:function(e,n){n=n||document.location.toString();var t=new RegExp("(^|&|\\\\?)"+e+"=([^&]*)(&|$|#)"),r=null;return(r=n.match(t))?r[2]:""},filterXSS:function(n){return e.isString(n)?(n=n.replace(/</g,"&lt;"),n=n.replace(/>/g,"&gt;"),n=n.replace(/\"/g,"&quot;"),n=n.replace(/\'/g,"&apos;")):n},createGUID:function(e){e=e||32;for(var n="",t=1;e>=t;t++){var r=Math.floor(16*Math.random()).toString(16);n+=r}return n},formatSize:function(e){var n=""+e;return n.indexOf("%")>0?n:n.indexOf("px")>0?n:/^\d+$/.test(n)?n+"px":n}};e.extend(e,u),e.extend(e.fn,u)}(Zepto),window.ddvp=window.ddvp||{};var r=e("ddplayer/base/console.js"),i=e("ddplayer/player/didiPlayer.js");ddvp.didiPlayer={maxId:1},ddvp.didiPlayer.ready=function(e){r.log("发送行为统计点:(ddPlayer_display)"),$(document).ready(function(){$.isFunction(e)&&e(i)})},t.exports=ddvp.didiPlayer,t.exports.vars=e("ddplayer/base/vars.js")});