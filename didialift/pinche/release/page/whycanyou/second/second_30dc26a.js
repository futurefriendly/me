define("page/whycanyou/second/second.js",function(n,i){var e,t,o=i.$container=$(".second");i.wakeup=function(n,i,o){e=i,t=o;{var a=$(".user_sum");a.offset()}a.css({}),$(function(){var i=n.shareinfo||pageParams.shareinfo;if(window.initWxShare(i),window.DidiJSBridge){var e=$.extend({},i,{img_url:i.imgUrl});window.initDidiShare({btn:$(".btn-share").addClass("color-origin-btn").html("分享我的倡议"),shareConfig:e})}})},i.wakeup_before=function(n){n.username,i.sync_view(n)},i.sync_view=function(n){var i="data-bindkey";$("["+i+"]").each(function(e,t){var o=t.getAttribute(i).trim();o in n&&(t.firstElementChild&&"IMG"===t.firstElementChild.tagName?t.firstElementChild.src=n[o]:t.innerHTML=n[o])}),2==n.step?($(".btn_box_third").hide(),$(".btn_box_second").show()):($(".btn_box_third").show(),$(".btn_box_second").hide())},o.find(".btn-join").on("click",function(){3==pageParams.step&&(location.href=pageParams.homeurl)}),o.find(".btn-upload").on("click",function(){t()})});