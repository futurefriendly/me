document.addEventListener("DOMContentLoaded",function(){function t(){var t=l.getElementsByTagName("section").length,e=l.getElementsByTagName("section")[t-1];load_img(e)}function e(){s++,ajax({method:"GET",url:"/imall/change_log/index?token="+d+"&page="+s+"&lng="+r+"&lat="+m,succFunc:function(t){var e=txtToJson(t);i(e)},failFunc:function(){}})}function i(t){0==t.errno?v=isLastPage(s,t,o):(a.style.display="none",sys())}function o(e){function i(t,e){var i={};return 1==t?i.codeTxt="已发放，到“我的打车券”查看":(i.codeTxt="券码：",i.codeNum=e),i}function o(t){g.cTitle=t.cTitle,g.cCount=t.cCount,g.cCode=t.cCode,g.cNum=t.cNum,g.cValidity=t.cValidity,g.title=t.title,g.comCount=t.comCount,g.comCode=t.comCode,g.comNum=t.comNum,g.validity=t.validity,g.link=t.link,g.imgUrl=t.imgUrl}for(var a=e.data,d=a.convertList,m=[],r={},u=0;u<d.length;u++){var g={},s=d[u].status,C=d[u].activity_type,h=d[u].isEnd,f=d[u].goods_type,N=d[u].comCode;if(0==s&&1==C){var T={cTitle:"",cCount:"content_count",cCode:"orange",cValidity:"hide",title:d[u].title,comCount:d[u].comCount,comCode:"参与抽奖，未中奖 ~~",validity:d[u].validity,link:d[u].link,imgUrl:d[u].imgUrl};o(T)}else if(1==s&&0==C&&0==h){var T={cTitle:"",cCount:"content_count",cCode:"gray999",cNum:"orange",cValidity:"gray999",title:d[u].title,comCount:d[u].comCount,comCode:i(f,N).codeTxt,comNum:i(f,N).codeNum,validity:d[u].validity+" 后过期",link:d[u].link,imgUrl:d[u].imgUrl};o(T)}else if(1==s&&0==C&&1==h){var T={cTitle:"lightgray",cCount:"content_count",cCode:"lightgray",cNum:"lightgray",cValidity:"lightgray",title:d[u].title,comCount:d[u].comCount,comCode:i(f,N).codeTxt,comNum:i(f,N).codeNum,validity:d[u].validity+" 后过期（已过期）",link:d[u].link,imgUrl:d[u].imgUrl};o(T)}else if(1==s&&1==C&&0==h){var T={cTitle:"win",cCount:"content_count",cCode:"gray999",cNum:"orange",cValidity:"gray999",title:d[u].title,comCount:d[u].comCount,comCode:i(f,N).codeTxt,comNum:i(f,N).codeNum,validity:d[u].validity+" 后过期",link:d[u].link,imgUrl:d[u].imgUrl};o(T)}else if(1==s&&1==C&&1==h){var T={cTitle:"lightgray",cCount:"content_count",cCode:"lightgray",cNum:"lightgray",cValidity:"lightgray",title:d[u].title,comCount:d[u].comCount,comCode:i(f,N).codeTxt,comNum:i(f,N).codeNum,validity:d[u].validity+" 后过期（已过期）",link:d[u].link,imgUrl:d[u].imgUrl};o(T)}else{var T={cTitle:"hide",cCount:"hide",cCode:"hide",cNum:"orange",cValidity:"hide",title:d[u].title,comCount:d[u].comCount,comCode:d[u].comCode,comNum:"",validity:d[u].validity,link:d[u].link,imgUrl:d[u].imgUrl};o(T)}m.push(g)}r.recData=m,0==v&&(c.style.display="block");var E=n.createElement("section");E.innerHTML=template("list_item",r),l.insertBefore(E,null),e.data.convertList.length>0&&y==e.data.convertList[0].product_id&&addClass(l.getElementsByClassName("list")[0],"new"),t()}var n=document,l=n.getElementById("record"),c=n.getElementById("noRecord"),a=n.getElementById("foo_loading"),d=(n.getElementById("iphone"),n.getElementById("token").value),m=n.getElementById("lat").value,r=n.getElementById("lng").value,u=n.getElementById("recordData").value,g=txtToJson(u),y=n.getElementById("product_id").value,s=1,v=null,C=new dd.dialog.Fn('<div class="loading-logo"></div>');C.hide(),shareFn(),window.addEventListener("popstate",function(){C.hide()},!1),i(g),l.addEventListener("click",function(t){var e=function(t){var e=new RegExp("\\blist\\b");return e.test(t.className)?t:arguments.callee(t.parentNode)},i=e(t.target);return i.getAttribute("href")?(C.show(),location.href=i.getAttribute("href"),void 0):void 0},!1),window.onscroll=window.onresize=function(){v>=s&&(t(),pulldown(e,a))}},!1);