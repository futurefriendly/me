define("page/driver_register_edition/second/layer/layer.js",function(require,exports,module){var Layer=module.exports=function(t){this.opt=$.extend({},t)},tpl_gesture=function(obj){{var __t,__p="";Array.prototype.join}with(obj||{})__p+='<div class="layer_box" style="display:none">\n	<div class="layer_bd">\n	<div class="topbar"><span class="close">&times;</span></div>\n	<!-- 左手.e_avatar_1;右手.e_avatar_2 -->\n	<div class="avatar_box '+(null==(__t=custom_class)?"":__t)+'">\n		<img src="'+(null==(__t=img_src)?"":__t)+'" alt="" />\n	</div>\n	<div class="card_box">\n		<div class="arr"></div>\n		<img src="'+(null==(__t=img_card)?"":__t)+'" />\n	</div>\n	<div class="btn_ghost1">知道了,我要上传照片</div>\n	</div>\n</div>\n';return __p},tpl_card=function(obj){{var __t,__p="";Array.prototype.join}with(obj||{})__p+='<div style="display:none" class="layer_box_card">\n	<img src="'+(null==(__t=img_src)?"":__t)+'"/>\n</div>';return __p};Layer.GESTURE=0,Layer.CARD=1;var TPL_ARY=[];TPL_ARY[Layer.GESTURE]=tpl_gesture,TPL_ARY[Layer.CARD]=tpl_card,Layer.prototype={setup:function(){if(this._issetuped===!0)return!1;this._issetuped=!0;var t=TPL_ARY[this.opt.layerType]({custom_class:this.opt.custom_class,img_src:this.opt.img_src,img_card:"http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/layer/images/card_dc25277.png"});this.$container=$(t).attr("id","layer"+~~(1e6*Math.random())),$(document.body).append(this.$container),this.bindEvent(this.$container)},show:function(t){var e=this;t&&this.setPic(t),this.update(),this.$container.css({opacity:"0",display:"block"}),setTimeout(function(){e.$container.css({opacity:"1"})},0)},setOpt:function(t){this.opt=$.extend(this.opt,{},t)},close:function(){var t=this;t.$container.css({opacity:"0"}),setTimeout(function(){t.$container.hide()},250)},bindEvent:function(t){function e(t){var e={w:100,h:100},n=t.touches[0];e.x=pageXOffset+innerWidth-e.w,e.y=pageYOffset,n.pageX<e.x+e.w&&n.pageX>e.x&&n.pageY<e.y+e.h&&n.pageY>e.y&&(i.close(),i.cancelEvent(t))}var i=this,n=function(t){i.cancelEvent(t)},s=i.update=function(){i.$container.css({top:pageYOffset,left:pageXOffset,height:innerHeight,width:innerWidth})};t.on("touchmove",n),t.on("touchstart",e),$(window).on("resize",s),$(window).on("scroll",s)},cancelEvent:function(t){t.preventDefault(),t.stopPropagation()}}});