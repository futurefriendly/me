document.addEventListener("DOMContentLoaded",function(){function e(){ajax({method:"GET",url:"/imall/get_integral/index?token="+v+"&lat="+y+"&lng="+E,succFunc:function(e){var t=txtToJson(e);0==t.errno&&(h.innerHTML=t.score.score_available)},failFunc:function(){}})}function t(){function e(){n(k),localStorage.removeItem("agoData"),localStorage.removeItem("scrollTop")}if("true"===localStorage.state){r.hide();var t={};if(!localStorage.agoData)return e(),void 0;var o=JSON.parse(localStorage.agoData);t.goods_list=o;var a=c.createElement("span");a.innerHTML=template("goods_list",t),u.innerHTML="",u.insertBefore(a,null),load_img(a.getElementsByTagName("img")),k=Math.ceil(a.getElementsByTagName("img").length/B),c.body.scrollTop=localStorage.scrollTop,c.documentElement.scrollTop=localStorage.scrollTop;var l=u.getElementsByTagName("a");switch(i(l),localStorage.fooState){case"0":m.style.display="none",f.style.display="block";break;case"1":fooState("none","inline-block","none");break;case"2":m.style.display="none";break;case"3":fooState("none","none","block");break;default:fooState("none","none","block")}localStorage.removeItem("state")}else e()}function o(e,t){var o=function(e){return e.getAttribute("href")?e:arguments.callee(e.parentNode)},n=o(e);return n.getAttribute("href")?(t(),location.href=n.getAttribute("href"),void 0):void 0}function n(e){ajax({method:"GET",url:"/imall/home/goods_list?pg="+e+"&page_size="+B+"&token="+v+"&lat="+y+"&lng="+E+"&datatype="+getQuerySting().datatype+"&version="+getQuerySting().version,succFunc:function(t){var o=txtToJson(t);if(0==o.errno){var n={},r=c.createElement("span"),g=o.data.goods_list,s=[319,389,390,354,352,377,345,346,361,387,388,367,380,383,379,384,394];a(s,g),n.goods_list=g,r.innerHTML=template("goods_list",n),u.insertBefore(r,null),l(g);var d=u.children[u.children.length-1].getElementsByTagName("img");load_img(d);var h=u.children[u.children.length-1].getElementsByTagName("a");i(h),o.data.page_count===e?(m.style.display="none",f.style.display="block",localStorage.fooState="0"):(fooState("none","inline-block","none"),localStorage.fooState="1")}else m.style.display="none",localStorage.fooState="2"},failFunc:function(){fooState("none","none","block"),localStorage.fooState="3"}})}function a(e,t){if(!e)return!1;for(var o=0;o<t.length;o++)for(var n=0;n<e.length;n++)if(t[o].id==e[n]){t.splice(o,1),o--;break}return t}function l(e){var t=null;t=localStorage.agoData?JSON.parse(localStorage.agoData):[];for(var o=0;o<e.length;o++)t.push(e[o]);localStorage.agoData=JSON.stringify(t)}function i(e){for(var t=0;t<e.length;t++)e[t].addEventListener("click",function(){r.show()})}var r=null;r=new dd.dialog.Fn('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>'),r.show(),r.hide(),shareFn();var c=document,g=c.getElementById("wheel"),s=c.getElementById("count"),d=c.getElementById("record"),u=c.getElementById("goods"),m=c.getElementById("footer"),f=(c.getElementById("foo_more"),c.getElementById("foo_loading"),c.getElementById("foo_noth"),c.getElementById("foo_no")),h=c.getElementById("myCount"),v=c.getElementById("token").value,p=c.getElementById("wheel_info").value,y=c.getElementById("lat").value,E=c.getElementById("lng").value,S=c.getElementById("errno").value,T=c.getElementById("errmsg").value,b=txtToJson(p),B=16,k=1;if(window.addEventListener("popstate",function(){r.hide(),e()},!1),touch(u,function(){var e=c.body.scrollTop||c.documentElement.scrollTop;localStorage.scrollTop=e},!1),0==S){r.show();var _=template("wheel_list",b);g.innerHTML=_;var I,w,L,N;g.addEventListener("touchstart",function(e){e.preventDefault(),I=e.changedTouches[0].pageX,w=e.changedTouches[0].pageY},!1),g.addEventListener("touchmove",function(e){e.preventDefault(),L=e.changedTouches[0].pageX,N=e.changedTouches[0].pageY,X=L-I,Y=N-w,(Math.abs(X)>=20||Math.abs(Y)>=20)&&e.target.setAttribute("moved","true")},!1),g.addEventListener("touchend",function(e){return e.preventDefault(),"true"==e.target.getAttribute("moved")?(e.target.setAttribute("moved","false"),void 0):(o(e.target,function(){r.show()}),e.target.setAttribute("moved","false"),void 0)},!1),g.getElementsByTagName("img").length>0?g.getElementsByTagName("img")[0].onload=function(){r.hide()}:r.hide();var x=c.getElementById("indicator"),D=b.wheel_item;if(D&&D.length>0){for(var M=D.length,j=0;M>j;j++){var A=c.createElement("span");x.appendChild(A)}x.children[0].className="on"}asyncLoadJS("http://static.xiaojukeji.com/activity/js/shop/s-wheel.js",function(){"function"==typeof g&&g()})}else 3008==S||dd.dialog.alert({icon:{url:"http://static.xiaojukeji.com/activity/img-mall/error.png",width:"7px",height:"42px"},tip:T,title:"",btn:{val:"我知道啦",handler:function(){}}});t(),touch(s,function(){r.show(),location.href="/imall/integral_flow?token="+v+"&lat="+y+"&lng="+E},!1),touch(d,function(){r.show(),setTimeout(function(){location.href="/imall/change_log/index?token="+v+"&lng="+E+"&lat="+y},300)},!1),m.addEventListener("click",function(){fooState("inline-block","none","none"),k++,n(k)},!1)},!1);