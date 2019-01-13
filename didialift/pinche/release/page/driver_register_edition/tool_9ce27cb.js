define('page/driver_register_edition/tool.js', function(require, exports, module){

/**
* 提供各种表单信息检查方法
*
*
*/
var regular = exports.regular = {
	is_Chinese_name: function(str) {
		var reg = /^[\u4E00-\u9FA5]{2,}$/;
		if (!reg.test(str)) {
			return false;
		}
		return true;
	},
	// 身份证校验
	is_ID_card: function(code) {
		// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
		var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if (reg.test(code) === false) {
			return false;
		}
		return true;
	},
	// 车牌号校验
	is_carNo: function(str) {
		var reg = /^[A-Za-z]{1}[A-Za-z0-9]{5}$/;
		if (!reg.test(str)) {
			return false;
		}
		return true;
	}
};
var $message_container;
var timer;
exports.warning = function(msg, t){
	clearTimeout(timer);
	init_message_container();
	exports.warning.pos()
	$message_container.html(msg).show();
	timer = setTimeout(function(){
		$message_container.hide();
	}, t || 2000);
}
exports.warning.close = function(){
	$message_container.hide();
}
var init_message_container = exports.warning.init = function(x, y){
		if($message_container) {
			return false;
		}
		$message_container = $('<div>')
		.attr('id', 'waring'+ ~~(Math.random() * 1E6))
		.attr(
			'style', 
			[
				'height: 28px',
				'line-height: 28px',
				'line-height: 28px',
				'background-color: #ff5050',
				'text-align: center',
				'font-size: 1.4rem',
				'color: #fff',
				'position: fixed',
				'width: 100%',
				'display: none'
			].join(';') );
		
		exports.warning.pos(x, y);
		$(document.body).append($message_container)
		.on('scroll', function(){
			exports.warning.pos();
		});
		return true;
}
exports.warning.pos = function(x, y){
	y = y || pageYOffset;
	x = x || 0;
	$message_container.css({
		left: x,
		top: y
	});
}
exports.warning.close = function(){
	$message_container && $message_container.hide();
}




var localCache = exports.localCache = {
	set: function(key,val){
		try{
			localStorage.setItem(key,val);
			return true;
		}catch(e){
			return false;
		}
	},
	get: function(key){
		try{
			return localStorage.getItem(key);
		}catch(e){
			return false;
		}
	},
	remove: function(key){
		try{
			localStorage.removeItem(key);
			return true;
		}catch(e){
			return false;
		}

	},
	instance: function(key){
		return new Cache_form(key);
	}

}
var Cache_form = function(key){
	this._key = key;
	this._saveObject = JSON.parse( localCache.get(key) || '{}');
};
Cache_form.prototype.save_cache = function(key,val){
	this._saveObject[key] = val;
	localCache.set( this._key , JSON.stringify(this._saveObject) );
}
Cache_form.prototype.remove_cache = function(){
	delete this._saveObject[key];
	localCache.set( this._key , JSON.stringify(this._saveObject) );
}
Cache_form.prototype.get = function(key){
	var val = $.extend({}, this._saveObject);
	if(key){
		return val[key] || '';
	}
	return val;
}
Cache_form.prototype.clean = function(){
	localCache.remove( this._key );
}



exports.showLoading= function(){
    window.dd && window.dd.dialog 
    && window.dd.dialog.loading('正在加载', 100000);
};
exports.closeLoading= function(){
    window.dd && window.dd.dialog 
    && window.dd.dialog.loading('正在加载', 0);
}
exports.warning_text = function($input){
	var i = 6 * 3;
	var delay = 100;
	while(i--){
		!function(i){
			setTimeout(function(){
				$input[(i % 2 == 1 ? 'remove' : 'add') + 'Class']('waring_input');
			}, i *  delay);
		}(i);
	}
}


});