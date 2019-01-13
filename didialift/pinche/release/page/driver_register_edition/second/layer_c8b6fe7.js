define('page/driver_register_edition/second/layer.js', function(require, exports, module){

var Layer = module.exports = function(opt){
	this.opt = $.extend({
	},opt);
	this.setup();
}
Layer.prototype = {
	setup: function(){
		this.$container = $('<div style="display:none"><img/></div>')
			.attr('id', 'layer'+ ~~(Math.random() * 1E6))
			.attr('class', 'layer_box');
		$(document.body).append(this.$container);
		this.bindEvent(this.$container);
	},
	show: function(src){
		var me = this;
		if(src){
			this.setPic(src);
		}
		this.update();
		this.$container.css({
			'opacity': '0',
			'display': 'block',
		});
		setTimeout(function(){
			me.$container.css({
				'opacity': '1',
			});
		},0);
	},
	setPic: function(src){
		this.$container.find('img').attr('src', src);
	},
	close: function(){
		var me = this;
		me.$container.css({
			'opacity': '0',
		});
		setTimeout(function(){
			me.$container.hide();
		} , 250);
	},
	bindEvent: function($container){
		var me = this;
		var onTouch = function(e){
			me.cancelEvent(e);
		}
		var onResize = me.update = function(){
			me.$container.css({
				'top': pageYOffset,
				'left': pageXOffset,
				'height': innerHeight,
				'line-height': innerHeight - 120 +'px',
				'width': innerWidth
			});
		};
		function onTouchStartClose(e){
			var closeRect = {
				w: 100,
				h: 100
			};
			finger = e.touches[0];
			closeRect.x = pageXOffset + innerWidth - closeRect.w;
			closeRect.y = pageYOffset;

			if(finger.pageX < closeRect.x + closeRect.w 
				&& finger.pageX > closeRect.x
				&& finger.pageY < closeRect.y + closeRect.h
				&& finger.pageY > closeRect.y
			){
				me.close();
				me.cancelEvent(e);
			}

		}	
		$container.on('touchmove', onTouch);
		$container.on('touchstart', onTouchStartClose);
		$(window).on('resize', onResize);
		$(window).on('scroll', onResize);
	},
	cancelEvent: function(e){
		e.preventDefault();
		e.stopPropagation();
	}
} 

});