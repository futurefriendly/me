var base=dd.base,rm_wall=function(){for(var e=document.getElementsByClassName("select-wall"),t=0,l=e.length;l>t;t++)document.body.removeChild(e[t])},add_wall=function(){var e=document.createElement("div");e.id="d-wall",e.className="select-wall",e.style.width=document.clientWidth+"px",e.style.height=document.body.scrollHeight+"px",document.body.appendChild(e)},slideSelect_carno=function(e,t,l){function n(e){var t=0,l=0;e.addEventListener("touchstart",function(e){if(e.preventDefault(),!e.touches.length)return!1;var l=e.touches[0];t=l.pageY-this.offsetTop},!1),e.addEventListener("touchmove",function(e){if(e.preventDefault(),!e.touches.length)return!1;var n=e.touches[0],a=n.pageY-this.offsetTop;l=t-a,t=a,this.scrollTop+=l},!1),e.addEventListener("touchend",function(e){if(e.preventDefault(),!e.changedTouches.length)return!1;t=0,l=0;var n=this.scrollTop,a=n%44;22>a?this.scrollTop-=a:this.scrollTop+=44-a},!1)}var a=l||[],o=[],s=t.getElementsByClassName("cancel")[0],r=t.getElementsByClassName("confirm")[0],i=t.getElementsByClassName("options");base.touch(e,function(){for(var e=document.getElementsByClassName("select"),n=0,a=e.length;a>n;n++)e[n].style.display="none";t.style.display="block",add_wall();for(var o=null,s="",r=null,c=0,d=i.length;d>c;c++){o=i[c],s=l[c],r=o.getElementsByTagName("li");for(var u=0,h=r.length;h>u;u++)r[u].getAttribute("data-id")==s&&(o.scrollTop=44*u)}},!1),base.touch(s,function(){t.style.display="none",rm_wall()},!1),base.touch(r,function(){for(var l=null,n=null,s=0,r=i.length;r>s;s++){l=i[s];var c=l.scrollTop/44,n=l.getElementsByTagName("li")[c];a[s]=n.getAttribute("data-id"),o[s]=n.getAttribute("data-show")}e.value=o.join(""),e.setAttribute("data-id",a.join("")),t.style.display="none",rm_wall()},!1);for(var c=0,d=i.length;d>c;c++)n(i[c],c)};