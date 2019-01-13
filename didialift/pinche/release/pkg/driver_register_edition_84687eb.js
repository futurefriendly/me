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
;define('page/driver_register_edition/first/first.js', function(require, exports, module){

var tool = require('page/driver_register_edition/tool.js');
var back, forward;
var dialog = dd.dialog;
var form_cacher = tool.localCache.instance('driver_register_first');
var is_step_initialized = false;
var $container = exports.$container = $('.form_first');
/***
* 唤醒当前页面
*
*/
exports.wakeup = function(params, next, previous){
	forward = function(){
		tool.warning.close();
		next();
	}
	back = function(){
		tool.warning.close();
		previous();
	}
	if(is_step_initialized === false){
		is_step_initialized = true;
		//页面初始化
		step_initialize();
		check_full_fill();
	}
}


/**
* 对外暴露接口
* return 所有checked pass的表单值
* checked failed 的返回flase
*/
exports.check_filed = function(){
	var real_name = $container.find('#txt_realname').val();
	var licence_card = $container.find('#txt_licence').val();
	if( tool.regular.is_Chinese_name(real_name) === false ){
		dialog.alert({
			title: "",
			tip: '请填写正确的中文姓名',
			btn: {
				handler: function() {
				}
			}
		});
		return false;
	}
	if( tool.regular.is_ID_card(licence_card) === false ){
		dialog.alert({
			title: "",
			tip: '请填写正确的身份证号码',
			btn: {
				handler: function() {
				}
			}
		});
		return false;
	}
	var data_form = {
		drivelicensename: txt_realname.value, //驾驶证姓名
		drivelicensenumber: txt_licence.value.toLocaleUpperCase(), //身份证号
	}
	return data_form;
}

/**
*
* 是否可以修改
*
*/
function is_changeable(key){
	if(typeof key !== 'string'){
		key = key.getAttribute('name');
	}
	return pageParams.filed_list[key].changeable == 1;
}
/**
* 是否审核失败
*
*/
function is_verify_failed(key){
	if(typeof key !== 'string'){
		key = key.getAttribute('name');
	}
	return pageParams.filed_list[key].verify == 3;
}
function init_every_filed($input, name){
	name =  name || $input.attr('name');
	$input.val( 
		pageParams.filed_list[name] 
		&& pageParams.filed_list[name].value 
		|| form_cacher.get(name)
	)
	.attr('disabled',
		is_changeable(name)
		? null 
		: ''
	);	
}



/**
* 步骤初始化函数
*
*
*/
function step_initialize(){

	var $txt_licence = $container.find('#txt_licence');
	var $txt_realname = $container.find('#txt_realname')

	init_every_filed($txt_realname);
	init_every_filed( $txt_licence );

	$txt_realname.on('blur', function(){
		var value  = $container.find('#txt_realname').val();
		if( tool.regular.is_Chinese_name(value) === false ){
			tool.warning('请填写正确的中文姓名');
			tool.warning_text($txt_realname);
		}else{
			form_cacher.save_cache(this.getAttribute('name'), value);
		}
		check_full_fill();
	});
	$txt_licence.on('blur', function(){
		var value = $container.find('#txt_licence').val();
		if( tool.regular.is_ID_card(value) === false ){
			tool.warning('请填写正确的身份证号码');
			tool.warning_text($txt_licence);
		}else{
			form_cacher.save_cache(this.getAttribute('name'), value);
		}
		check_full_fill();
	});

	//只需要判断其中一个即可
	var filed_name = $txt_realname.attr('name');
	//验证失败 && 可修改，则加上红色框和原因
	if( is_verify_failed(filed_name)
		&& is_changeable(filed_name) 
	){
		$container.addClass('verify_failed');
	}
	// $container.addClass('verify_failed');


	//完成提交	
	$container.find('.next_btn')
		.on('click', function(){
			var data_form = exports.check_filed();
			if(data_form == false){
				return;
			}
			var dialog = dd.dialog;
			var base = dd.base;
			var data = $.extend({
				step: 1,
				token: pageParams.upload_data.token
			},data_form);
			tool.showLoading();
			$.ajax({
				method: "GET",
				url: pageParams.reg_url 
				,
				data: data,
				success: function(j) {
					var da = base.txtToJson(j);
					if(da.errno == "102"){
						 location.replace(pageParams.gologinurl);
					}
					else if (da.errno == "0") { //注册成功   
						form_cacher.clean();
						forward();
					} else if (da.errno == "3002") {
						form_cacher.clean();
						forward();
					} else if(da.errno == '6010'){
						dialog.confirm({
							title: "",
							text: '车辆已被注册。如果不是你本人或熟人操作，你可以通过申诉来进行车主认证。',
							confirm:{
								val: '我要申诉',
								handler: function() {
									//pageParams
									location.replace(pageParams.faq_url);
								}
							}
						})
						return;
					} else {
						return dialog.alert(da.errmsg || '');
					}
					tool.closeLoading();
				},
				error: function() {
					dialog.alert("网络有点不给力，请稍后再试哦~");
				}
			});
		});




	//审核失败的状态取消[红框小时，失败理由文案消失]
	$container.one('touchstart', function(){
		$container.removeClass('verify_failed');
	});

}



var input_total_el = [txt_realname, txt_licence];
var check_total_fn = ['is_Chinese_name', 'is_ID_card'];
function check_full_fill(){
	for(var i = 0; i < input_total_el.length; i++){
		if( tool.regular[ check_total_fn[i] ] (input_total_el[i].value) === false){
			$container.trigger('is_full_fill', false);
			return false;
		}
	}
	$container.trigger('is_full_fill', true);
}



});
;define('page/driver_register_edition/foot/foot.js', function(require, exports, module){

var sended = false;
var errmsg = '';
//发送页面到手机
$('.bt_foot').on('click', function(){
	var dialog = dd.dialog;
	var base = dd.base;
	if(sended === true){
		if( errmsg ){
			dialog.alert(errmsg);
		}
		return;
	}
	sended = true;
	var data_form = {
		token: pageParams.upload_data.token,
		url: encodeURIComponent(location.href.replace(/#.+$/g , ''))
	};
	base.ajax({
		method: "POST",
		url: pageParams.sendurltophone,
		data: data_form,
		succFunc: function(j) {
			var da = base.txtToJson(j);
			if(da.errno == 0){
				errmsg = da.errmsg;
				dialog.alert(da.errmsg);
			}else{
				dialog.alert("请重试");
			}
		},
		failFunc: function() {
			sended = false;
			dialog.alert("网络有点不给力，请稍后再试哦~");
		}
	});	
});

});
;define('page/driver_register_edition/status/status.js', function(require, exports, module){

exports.to = function(index){
	$('.status_item')
		.removeClass('active')
		.eq(index)
		.addClass('active')
}


});
;define('page/driver_register_edition/second/layer.js', function(require, exports, module){

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
;define('page/driver_register_edition/second/second.js', function(require, exports, module){

var Layer = require('page/driver_register_edition/second/layer.js');
var tool = require('page/driver_register_edition/tool.js');
var driver_card_uri =  'http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/driver_card_16adbd4.png';
var car_licence_uri = 'http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/car_license_23d92af.png';
var left_car_human_uri = 'http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/gestures_left_81534c9.png';
var right_car_human_uri = 'http://static.xiaojukeji.com/pinche/release/page/driver_register_edition/second/gestures_right_fb6c9e3.png';
var car_human_uri = pageParams.gesturesample ;
var forward, back;
var dialog = dd.dialog;
var form_cacher = tool.localCache.instance('driver_register_second');
var is_step_initialized = false
var $container = exports.$container = $('.form_second');
/***
* 唤醒当前页面
*
*/
exports.wakeup = function(params, next, previous) {
	forward = next;
	back = previous;
	// uploadExample.show(car_licence_uri);
	if(is_step_initialized === false){
		is_step_initialized = true;
		//页面初始化
		step_initialize();
	}
}
/*
* 需上传的照片 键名
*
*
*/
var val_ary = [
	//驾照照片
	'driveauthpicurl', 
	//行驶证照片
	'travelauthpicurl', 
	//手势照片
	'gestureauthpicurl'
];
/*
* 需上传的照片对应的class名称
*
*/
var $pick_ary = [
	'.driving_licence_front',
	'.driving_licence_backend',
	'.car_photo'
];
/*
* 三张实示例图地址
*
*
*/
var car_sample_uri = [
	driver_card_uri,
	car_licence_uri,
	pageParams.gesturesample && pageParams.gesturesample.indexOf('http') == 0 ?
	pageParams.gesturesample : 
	 get_gesturesample
];
/*
*
* 三张上传图片的层实例
*
*/
var car_sample_layer = [
	new Layer,
	new Layer,
	new Layer
];
/**
*
*
*
*
*/
var driver_licence_aspectRatio = 213 / 145;
var photo_width = 500;
var car_photo_size = [
	//[宽,高]
	//驾驶证
	[photo_width, photo_width / driver_licence_aspectRatio],
	//行驶证
	[photo_width, photo_width / driver_licence_aspectRatio],
	//手势
	[photo_width,photo_width],
]
//提前加载
/*
car_sample_uri.forEach(function(src){
	var img = document.createElement('IMG');
	img.onload = function(){
		img = img.onload = null;
	}
	img.src = src;
});
*/
/**
* 用来保存已上传的值
*
*
*/
var photo_data = {};
/**
* 添加图片
*
*
*/
var addPhoto = function(key, val) {
	var index = val_ary.indexOf(key);
	if (index === -1) return;
	var $pick_node = $($pick_ary[index]);
	photo_data[key] = val;
	$pick_node.addClass('photo_uploaded');

	pre_load_image(val, function(img){
		if(img === null){
			dd.dialog.alert(
				{
					title: "",
					tip: '图片加载失败，请重新上传。',
					btn: {
						handler: function() {}
					}
				}
			);
			removePhoto(key);
			return;
		}
		img.className = 'pic'
		$pick_node.find('.shadow').html(img);
	});
	form_cacher.save_cache(key, val);
	check_full_fill();
};
/**
* 删除图片
*
*
*/
var removePhoto = function(key, e) {
	var index = val_ary.indexOf(key);
	if (index === -1) return;
	$pick_node = $($pick_ary[index]);
	$pick_node.removeClass('photo_uploaded');
	delete photo_data[key];
	form_cacher.remove_cache(key, val);
	check_full_fill();
}
/**
* 预加载图片
*
*/
function pre_load_image(src, cb){
	var img = document.createElement('IMG');
	img.onload = function(){
		cb(img);
		img.onerror = img = img.onload = null;
	}
	img.onerror = function(){
		cb(null);
		img.onerror = img = img.onload = null;
	}
	img.src = src;
}
/**
*
* 是否可以修改
*
*/
function is_changeable(key){
	if(typeof key !== 'string'){
		key = key.getAttribute('name');
	}
	return pageParams.filed_list[key].changeable == 1;
}
/**
* 是否审核失败
*
*/
function is_verify_failed(key){
	if(typeof key !== 'string'){
		key = key.getAttribute('name');
	}
	return pageParams.filed_list[key].verify == 3;
}

/**
* js上传功能初始化
*
*
*/
function pic_upload_init() {

	var ImgUpload = require('upload/upload.js');
	$.each($container.find('.file_select'), function(index, $node) {
		//不可修改
		if( !is_changeable($node) ){
			return;
		}
		$file_select = $($node);		

		//验证失败 且 可修改
		if( is_verify_failed(val_ary[index]) 
			&& is_changeable(val_ary[index]) 
		){
			$file_select.addClass('verify_failed');
		}



		// car_sample_uri[i]的最终值 可能是通过函数获取
		if(typeof car_sample_uri[index] == 'string'){
			car_sample_layer[index].setPic(car_sample_uri[index]);	
		}else{
			get_gesturesample( function(src){
				car_sample_layer[index].setPic(src);
			} );
		}
		

		/*
		* 绑定点击事件
		*
		*/
		var isInited = false;
		$file_select.on('click', function(e){

			car_sample_layer[index].show();
			document.body.onfocus = hideExample;

			//以下流程只需要执行一次
			if(isInited === true){
				return;
			}
			isInited = true;
			//在`/pinche/newreg/program/change`页面，存在审核失败的情况，会有红框和红色失败理由文本，点击之后就去掉。
			$(this).removeClass('verify_failed');


			// 在点击时才去初始化，因为判断是否端内的方式比较挫逼，DidiJSBridge加载需要时间。	
			var isApp = window.DidiJSBridge;
			if(isApp){
				native_upload_initialize(index);
			}else{
				js_upload_initialize(index);
			}

		}, false);




		/**
		* 隐藏示例图函数
		*
		*
		*/
		function hideExample(e){
			document.body.onfocus = null;
			car_sample_layer[index].close();
		}
	});
	/*
	* 上传功能初始化：JS版
	*
	*
	*/
	function js_upload_initialize(index){
		var opts = {
			data: $.extend({}, pageParams.upload_data),
			url: pageParams.api_upload_url,
			outputWidth: car_photo_size[index][0],
			outputHeight: car_photo_size[index][1],
			filekey: 'file',
			onSuccessUpload: function(resObj) {
				try {
					resObj = JSON.parse(resObj);
					
					if(resObj.errno == '0'){
						addPhoto(val_ary[index], resObj.data);
					}else if(resObj.errno == "101"){
						location.replace(pageParams.gologinurl);
					}else{
						dialog.alert(resObj.errmsg);
						return;
					}
				} catch (e) {
					dialog.alert('上传失败，请重试！');
					removePhoto(val_ary[index], e);
					return;
				}
				hideExample();
			},
			onCancelUpload: function(){
				hideExample();
			},
			onFailedUpload: function(){
				hideExample();
				dialog.alert('上传失败，请重试！');
				hideExample();
			}
		};
		/**
		* 隐藏示例图函数
		*
		*
		*/
		function hideExample(e){
			document.body.onfocus = null;
			car_sample_layer[index].close();
		}
		/*
		* 显示示例图
		* 让 ImgUpload 获取正确的宽高
		*
		*/
		var $container = car_sample_layer[index].$container;
		$container.show();	
		new ImgUpload(
			$container[0], 
			opts
		);
		//获取完成正确的宽高之后隐藏掉
		$container.hide();

	}
	/*
	* 上传功能初始化：端内版
	*
	*
	*/
	function native_upload_initialize(index){
		var $container = car_sample_layer[index].$container;

		$container.on('click', function(){
			var Didibridge = require('ddbridge/ddbridge.js');
			var uploda_data = $.extend(
				{},
				pageParams.upload_data,
				{
			    	web_token: pageParams.upload_data.token
	    		}
    		 );
			delete uploda_data.token;
    		 Didibridge.uploadImage(
	    		 uploda_data,
	    		function(resObj){
	    		 	try{
	    		 		resObj = JSON.parse(resObj);
	    		 		addPhoto(val_ary[index], resObj.data.data );
	    		 	}catch(e){
	    		 		removePhoto(val_ary[index], e);
	    		 	}
	    		 	hideExample();
	    		},
	    		null,
	    		pageParams.api_upload_url
    		);
		});
		/**
		* 隐藏示例图函数
		*
		*
		*/
		function hideExample(e){
			document.body.onfocus = null;
			car_sample_layer[index].close();
		}
	}

};


/**
* 对外暴露接口
* return 所有checked pass的表单值
* checked failed 的返回flase
*/
exports.check_filed = function(){
	var check_pass = true;
	var check_fail_index;
	$.each(val_ary, function(key, val){
		if( photo_data[val] == undefined ){
			check_fail_index = key;
			return check_pass = false;
		}
	});
	if(check_pass === false){
		var title = $($pick_ary[check_fail_index]).find('.select_tips').text() || '完整资料';
		dialog.alert({
			title: "",
			tip: '请上传' + title,
			btn: {
				handler: function() {
				}
			}
		});
		return false;
	}
	return photo_data;
}



/**
* 步骤初始化函数
*
*
*/
function step_initialize(){
	//上传功能初始化

	pic_upload_init();
	//恢复表单已填写值
	val_ary.forEach(function(val){
		var filed_value = pageParams.filed_list[val].value 
					|| form_cacher.get(val);
		if(filed_value){
			addPhoto(
				val,
				filed_value	
			);
		}
	});

	// //验证失败 且 可修改
	// if( is_verify_failed(val_ary[0]) 
	// 	&& is_changeable(val_ary[0]) 
	// ){
	// 	$container.addClass('verify_failed');
	// }
		 // $container.addClass('verify_failed');

	/**
	* 事件绑定
	*
	*/
	$container.find('.form_second .previous_btn').on('click', function(){
		back();
	});
	$container.find('.next_btn').on('click', function(){
		var form_data = exports.check_filed();
		if( form_data === false) {
			return;
		}
		var base = dd.base;
		var dialog = dd.dialog;
		tool.showLoading();
		$.ajax({
			method: "GET",
			url: pageParams.reg_url,
			data: $.extend({
				step: 2,
				token: pageParams.upload_data.token
			},form_data),
			success: function(j) {
				var da = base.txtToJson(j);
				if(da.errno == "102"){
					 location.replace(pageParams.gologinurl);
				}
				else 
				if (da.errno == "0") { //注册成功   
					form_cacher.clean();
					forward({
						travelauthpicurl: photo_data.travelauthpicurl
					});
				} else if (da.errno == "3002") {
					form_cacher.clean();
					forward({
						travelauthpicurl: photo_data.travelauthpicurl
					});
				} else {
					//closeLoading会把 dialog取消掉
					return dialog.alert(da.errmsg);
				}
				tool.closeLoading();
			},
			error: function() {
				dialog.alert("网络有点不给力，请稍后再试哦~");
			}
		});


	});

}

/*
* 检查所有输入框是否填写正确
*
*
*/

function check_full_fill(){
	for(var i = 0; i < val_ary.length; i++){
		if( !photo_data[ val_ary[i] ]  ){
			$container.trigger('is_full_fill', false);
			return false;
		}
	}
	$container.trigger('is_full_fill', true);
}
/**
* 获取手势图
*
*
*/
var ajax_gestursample = false;
var cb_list = [];
function get_gesturesample(cb){
	if(ajax_gestursample){
		cb(ajax_gestursample);
		return;
	}
	cb_list[cb_list.length] = cb;
	if(cb_list.length.length > 1){
		return;
	}
	var url = pageParams.gesture_url
	$.ajax({
		method: "GET",
		url: url,
		data: {},
		success: function(j) {
			var da = dd.base.txtToJson(j);
			if (da.errno == "0") { //注册成功   

				ajax_gestursample = da.gesturesample;
				
				// ajax_gestursample = ajax_gestursample && ajax_gestursample.indexOf('test.didi') === -1 ? da.gesturesample
				// :  Math.random() > .5 
				// ? left_car_human_uri : right_car_human_uri ;
				//测试使用，上线必须删除

				var current_callbac;
				while(current_callbac = cb_list.shift()){
					current_callbac(ajax_gestursample);			
				}
			} else {
				//dialog和loading是互斥关系
				return dialog.alert(da.errmsg);
			}
		},
		error: function() {
			dialog.alert("获取手势图失败，因为网络有点不给力，请稍后再试哦~");
		}
	});
}


});
;define('page/driver_register_edition/third/select.js', function(require, exports, module){

var base = dd.base;
var rm_wall = function() {
    var dvWalls = document.getElementsByClassName("select-wall");
    for (var i = 0, len = dvWalls.length; i < len; i++) {
        document.body.removeChild(dvWalls[i]);
    }
};
var add_wall = function() {
    var dvWall = document.createElement('div');
    dvWall.id = "d-wall";
    dvWall.className = "select-wall";
    dvWall.style.width = document.clientWidth + "px";
    dvWall.style.height = document.body.scrollHeight + "px";
    document.body.appendChild(dvWall);
};

// 滑动下拉框包括支持一级及以上
var slideSelect_carno = module.exports = function(input, selectDiv, valueArr) {
    var valueList = valueArr || [],
        nameList = [];
    var linkCancel = selectDiv.getElementsByClassName("cancel")[0],
        linkConfirm = selectDiv.getElementsByClassName("confirm")[0],
        optionsList = selectDiv.getElementsByClassName("options");

    var init = function() {
        for (var i = 0, len = valueArr.length; i < len; i++) {
            var onLi = optionsList[i].querySelector("[data-id='" + valueArr[i] + "']");
            nameList[i] = onLi.getAttribute("data-show");
        }
        input.setAttribute("data-id", valueList.join(""));
        input.value = nameList.join("");
        if (input.getAttribute("disabled") == "disabled") return; //禁用下拉框 
    }


    // 事件触发
    base.touch(input, function(ev) {
        var seList = document.getElementsByClassName("select");
        for (var i = 0, length = seList.length; i < length; i++) {
            seList[i].style.display = "none";
        }
        selectDiv.style.display = 'block';
        add_wall();
        var options = null,
            value = "",
            listLi = null;

        for (var j = 0, len = optionsList.length; j < len; j++) {
            options = optionsList[j];
            value = valueArr[j];
            listLi = options.getElementsByTagName("li");
            for (var k = 0, l = listLi.length; k < l; k++) {
                if (listLi[k].getAttribute("data-id") == value) {
                    options.scrollTop = k * 44;
                }
            }
        }
    }, false);

    // 取消按钮
    // base.touch(linkCancel, function(ev) {
    linkCancel.addEventListener('click', function(ev) {
        selectDiv.style.display = 'none';
        rm_wall();
    }, false);
    var Event = function(type){
        var ev = document.createEvent('Events');
        ev.initEvent(type, true, true);
        return ev;
    }
    // 确定按钮
    linkConfirm.addEventListener('click', function(ev) {
        var options = null,
            //index = 0,
            selectedLi = null;
        for (var i = 0, length = optionsList.length; i < length; i++) {
            options = optionsList[i];

            var liIndex = options.scrollTop / 44;
            var selectedLi = options.getElementsByTagName("li")[liIndex];

            valueList[i] = selectedLi.getAttribute("data-id");
            nameList[i] = selectedLi.getAttribute("data-show");

        };
        var oldValue = input.value;
        input.value = nameList.join("");
        input.setAttribute("data-id", valueList.join(""));
        if(oldValue != input.value){
            input.dispatchEvent && input.dispatchEvent( Event('change') );
        }
        selectDiv.style.display = 'none';
        rm_wall();
    }, false);

    ///----------------------------bind-----------
    for (var i = 0, length = optionsList.length; i < length; i++) {
        ul_bind(optionsList[i], i);
    };

    function ul_bind(options) {
        var starty = 0,
            dy = 0;

        options.addEventListener("touchstart", function(ev) {
            ev.preventDefault();
            if (!ev.touches.length) {
                return false;
            }
            var touch = ev.touches[0];

            starty = (touch.pageY - this.offsetTop);
            return;

        }, false);
        options.addEventListener("touchmove", function(ev) {
            ev.preventDefault();
            if (!ev.touches.length) {
                return false;
            }
            var touch = ev.touches[0];

            var touchy = (touch.pageY - this.offsetTop);
            dy = starty - touchy;
            starty = touchy;

            this.scrollTop += dy;
            return;

        }, false);
        options.addEventListener("touchend", function(ev) {
            ev.preventDefault();
            if (!ev.changedTouches.length) {
                return false;
            }

            starty = 0;
            dy = 0;

            var nowTop = this.scrollTop;
            var gap = nowTop % 44; //44

            if (gap < 22) {
                this.scrollTop -= gap;
            } else {
                this.scrollTop += 44 - gap;
            }

        }, false);
    }
};


});
;define('page/driver_register_edition/third/third.js', function(require, exports, module){

var slideSelect_carno = require('page/driver_register_edition/third/select.js');
var forward, back;
var isInited = false;
var tool = require('page/driver_register_edition/tool.js');
var dialog = dd.dialog;
var form_cacher = tool.localCache.instance('driver_register_third');
var $container = exports.$container = $('.form_third');
/***
* 唤醒当前页面
*
*/
exports.wakeup = function(params, next, previous){
	forward = function(){
		tool.warning.close();
		next();
	}
	back = function(){
		tool.warning.close();
		previous();
	}
	if(params.travelauthpicurl){
		addPhone(params.travelauthpicurl);
	}
	if(isInited === false){
		isInited = true;
		//页面初始化
		step_initialize();
		check_full_fill();
	}
}

function addPhone (travelauthpicurl){
	$container.find('.poster img').attr('src', travelauthpicurl);
	form_cacher.save_cache(
		$container.find('.poster').attr('name'),
		travelauthpicurl
	);
}
/**
*车牌首字功能初始化
*
*
*/
function carno_init(value) {
	var carnoSelect = document.getElementById("carnoSelect");
	var base = dd.base;
	ulEl = carnoSelect.getElementsByClassName("options")[0];

	var get_no = function() {
		base.ajax({
			method: "POST",
			url: "/pinche/cartype/getlicensehead",
			succFunc: function(j) {
				var da = base.txtToJson(j);
				var carprovinceid_key = txt_carone.getAttribute('name');
				var carprovinceid = pageParams.filed_list[carprovinceid_key].value 
		|| form_cacher.get(carprovinceid_key) || '1';
				// var carprovinceidIndex = da.sort.indexOf(carprovinceid);
				var carprovince_zh = da.data[carprovinceid];
				txt_carone.value = carprovince_zh || form_cacher.get(carprovinceid_key + '_zh');
				//不可修改
				if( !is_changeable(txt_carone) ){
					txt_carone.setAttribute('disabled', '');
					return;
				}
				if (da.errno == "0") {
					var data = da.data;
					var sort = da.sort;
					var html = "";
					for (var i = 0, len = sort.length; i < len; i++) {
						html += '<li data-id="' + sort[i] + '" data-show="' + data[sort[i]] + '">' + data[sort[i]] + '</li>';

					}
					ulEl.innerHTML += html;
					slideSelect_carno(txt_carone, carnoSelect, []); //carno
				}

			},
			failFunc: function() {}
		});
	};
	get_no();

}


/**
* 对外暴露接口
* return 所有checked pass的表单值
* checked failed 的返回flase
*/
var rzh_value = {
		//车省号
		'carprovinceid': '车省号',
		//车牌号
		'carcardnumber': '车牌号',
		//品牌号
		'carbrandid': '品牌号',
		//车型号
		'cartypeid': '车型号',
		// 车颜色
		'carcolorid': '车颜色'
	};
var car_type_list = ['carbrandid','cartypeid', 'carcolorid'];
exports.check_filed = function(){
	var $cartype = $container.find('#car_type');
	var form_data = {
		//车省号
		'carprovinceid': $container.find('#txt_carone').attr('data-id'),
		//车牌号
		'carcardnumber': $container.find('#txt_carnumber').val(),
		//品牌号
		'carbrandid': $cartype.attr('data-carbrandid'),
		//车型号
		'cartypeid': $cartype.attr('data-cartypeid'),
		// 车颜色
		'carcolorid': $cartype.attr('data-carcolorid')
	};
	for(var i in form_data){
		if(i == 'carcardnumber'){
			if( tool.regular.is_carNo(form_data[i]) === false){
				dialog.alert( '请填写正确' + rzh_value[i] || '');
				return false;
			}
		}else if( form_data[i] == false ){
			dialog.alert( '请填写正确' + rzh_value[i] || '');
			return false;
		}
	}
	return form_data;
}


function is_changeable(key){
	if(typeof key !== 'string'){
		key = key.getAttribute('name');
	}
	return pageParams.filed_list[key].changeable == 1;
}
/**
* 是否审核失败
*
*/
function is_verify_failed(key){
	if(typeof key !== 'string'){
		key = key.getAttribute('name');
	}
	return pageParams.filed_list[key].verify == 3;
}
/**
* 步骤初始化函数
*
*
*/
function step_initialize(){

	//验证失败 且 可修改
	if( is_verify_failed('carcardnumber')
		&& is_changeable('carcardnumber') 
	){
		$container.addClass('verify_failed');
	}
	 // $container.addClass('verify_failed');
	//恢复照片
	var photo_key = $container.find('.poster').attr('name');
	var photo_src = pageParams.filed_list[photo_key].value 
	|| form_cacher.get(photo_key);

	addPhone(photo_src);

	//恢复 车类型 id
	var $cartype = $container.find('#car_type');
	car_type_list.forEach(function(val){
		$cartype.attr('data-' + val , pageParams.filed_list[val].value || form_cacher.get(val) );
	});

	//恢复 车输入框的值
	$cartype.val(  
		pageParams.filed_list[car_type_list[0]].zhvalue 
		+ pageParams.filed_list[car_type_list[1]].zhvalue
		+ pageParams.filed_list[car_type_list[2]].zhvalue
		|| form_cacher.get( car_type_list[0] + '_zh' )
	);

	//恢复 6位车牌
	var $carnumber = $container.find('#txt_carnumber');
	var name = 	$carnumber.attr('name');
	$carnumber.val(
		pageParams.filed_list[name].value 
		|| form_cacher.get(name)
	).attr(
	 	'disabled',
	 	is_changeable(name)
	 	? null 
	 	: ''
	 );

	//恢复 车省 号
	var $carone = $container.find('#txt_carone');
	name = $carone.attr('name');
	$carone.attr(
		'data-id', 
		pageParams.filed_list[name].value 
		|| form_cacher.get(name) || '1'
	);


	//车省号功能初始化	
	carno_init();



	var first_key = car_type.getAttribute('name').split(',')[0];
	// 不可修改
	if( !is_changeable(first_key) ){
		car_type.setAttribute('disabled', '');
	}else{
		var $car_type = $container.find('#car_type').on('click', function(e){
			var me = this;
			e.preventDefault();	
			e.stopPropagation();
			require('carchoose/main.js');	
			$.didiCarChoose({
			    brandsURL: pageParams.getcarbrand 
			    , typesURL: pageParams.getcartype 
			    , colorsURL:pageParams.getcolor 
			    , onselect: function (data) {
			    	me.value = data.carInfo;
			    	var value_list = {};
			    	$.each(data.value, function(key, val){
			    		var name;
			    		switch(key){
			    			case 'color':
				    			name = car_type_list[2];
			    			break;
			    			case 'brand':
				    			name = car_type_list[0];
			    			break;
			    			case 'type':
				    			name = car_type_list[1];
			    			break;
			    		}
			    		me.setAttribute('data-' + name, val.id);
				    	form_cacher.save_cache(name, val.id);
				    	form_cacher.save_cache(name + '_zh', data.carInfo);
			    	});

			    }
			});

		});
		$car_type.on('focus', function(){
			$car_type.blur();
		})

	}
	/**
	* 完成按钮事件绑定
	*
	*
	*/
	$container.find('.next_btn').on('click', function(){
		var form_data = exports.check_filed();
		if(form_data == false){
			return;
		}
		var dialog = dd.dialog;
		var base = dd.base;

		tool.showLoading();
		$.ajax({
			method: "GET",
			url: pageParams.reg_url,
			data: $.extend({
				step: 3,
				token: pageParams.upload_data.token
			},form_data),
			success: function(j) {
				var da = base.txtToJson(j);
				if(da.errno == "102"){
					 location.replace(pageParams.gologinurl);
				}
				else 
				if (da.errno == "0") { //注册成功   
					form_cacher.clean();
					forward();
				} else if (da.errno == "3002") {
					form_cacher.clean();
					forward();
				} else {
					//closeLoading会把 dialog取消掉
					return dialog.alert(da.errmsg);
				}
				tool.closeLoading();
			},
			error: function() {
				dialog.alert("网络有点不给力，请稍后再试哦~");
			}
		});

		
		$.ajax({
			method: "GET",
			dataType: 'jsonp',
			url: pageParams.inviteurl,
			data: {
				plate: txt_carone.value + form_data.carcardnumber
			}
		});
	});
	/**
	* 上一步按钮事件绑定
	*
	*/
	$container.find('.previous_btn').on('click', function(){
		back();
	});
	/**
	* 绑定输入框修改时保存
	*
	*/
	$container.find('#txt_carone').on('change', function(){
		form_cacher.save_cache(
			this.getAttribute('name'),
			this.getAttribute('data-id')
		);	
		form_cacher.save_cache(
			this.getAttribute('name')+'_zh',
			this.value
		);	
	});

	$container.find('#txt_carnumber').on('blur', function(){

		if( tool.regular.is_carNo(this.value) === false ){
			tool.warning('请填写正确的' + this.getAttribute('placeholder') );
			tool.warning_text($container.find('#txt_carnumber'));
		}else{
			form_cacher.save_cache(this.name, this.value);
		}
		check_full_fill();
	},false);





	//审核失败的状态取消[红框小时，失败理由文案消失]
	$container.one('touchstart', function(){
		$container.removeClass('verify_failed');
	});
}




var input_total_el = [txt_carone, txt_carnumber, car_type];
var check_total_property = [
'data-id', 
function(){
	return tool.regular.is_carNo(txt_carnumber.value);
}, 
'data-carbrandid'
];
function check_full_fill(){
	for(var i = 0; i< input_total_el.length; i++){
		if( (typeof check_total_property[i] === 'string' 
			? input_total_el[i].getAttribute(check_total_property[i])
			: check_total_property[i]() )== false ){
			$container.trigger('is_full_fill', false);
			return 
		}
	}
	$container.trigger('is_full_fill', true);
}


});
;define('page/driver_register_edition/main.js', function(require, exports, module){

var status = require('page/driver_register_edition/status/status.js');
var first = require('page/driver_register_edition/first/first.js');
var second = require('page/driver_register_edition/second/second.js');
var third = require('page/driver_register_edition/third/third.js');
var foot = require('page/driver_register_edition/foot/foot.js');
var pageControl = [first, second, third];
var $page = $('.form');
//用于返回
var lastHash;
var next, previous;
var lastIndex = Math.min( Math.max(pageParams.reg_step - 1, 0),2 );
var switcher = function(index, req){
	next = function(req){

		if(index < pageControl.length - 1){
			switcher(index + 1, req);
		//注册完成
		}else if(index ===  pageControl.length -1){
			location.replace(pageParams.successurl);
		}
	}
	previous = function(req){
		if(index > 0){
			switcher(index - 1, req);
		}
	}
	// status switch
	status.to(index, {});

	// page switch
	// $page.hide().eq(index).show();
	animate(
		$page.eq(lastIndex),
		$page.eq(index),
		function(){
			pageControl[index].wakeup(req || {}, next,previous);
			//留下任意历史纪录方便返回
			lastHash = location.hash;
			location.href= '#h' + ~~(Math.random() * 1E6)
			// scrollTo(0,0);
		}
	 );
	
	lastIndex = index;

}
//初始化页面
$page.hide();
switcher(lastIndex);
//绑定回退处理
addEventListener('hashchange', function(){
	if(location.hash === lastHash){
		previous();
	}
});

$(function(){
	 // window.initWxShare(pageParams.wxShare);
});


function animate($from, $to, callback, dir){
	if( $from[0] == $to[0] ){
		$to.show();
		callback();	
		return;
	}
	$from.addClass('from_page');
	$to.addClass('to_page');
	$('.main').attr('class','main animate begin_animate');
	setTimeout(function(){
		$('.main').attr('class','main animate end_animate');
	}, 0 );
	setTimeout(function(){
		$from.removeClass('from_page').hide();
		$to.removeClass('to_page').show();
		callback();
	}, 350);
};



});
;define('page/driver_register_edition/notice/notice.js', function(require, exports, module){



});
;define('page/driver_register_edition/recertification.js', function(require, exports, module){

var notice = require('page/driver_register_edition/notice/notice.js');
var first = require('page/driver_register_edition/first/first.js');
var second = require('page/driver_register_edition/second/second.js');
var third = require('page/driver_register_edition/third/third.js');
var foot = require('page/driver_register_edition/foot/foot.js');
var base = dd.base;
var dialog = dd.dialog;
var filed_list = [first, third, second];
var empty_func = function(){};
var is_full_fill_total = [0,0,0];
var timer;
//初始化
filed_list.forEach(function(val,key){
	val.$container.on('is_full_fill', function(e){
		clearTimeout(timer);
		is_full_fill_total[key] = e._args;
		timer = setTimeout(toggle_submit_button, 100);

	});
	val.wakeup({}, empty_func, empty_func);
	// //审核失败的状态取消
	// val.$container.one('touchstart', function(){
	// 	val.$container.removeClass('verify_failed');
	// })
});
var $recertification_btn = $('.recertification_btn');
function toggle_submit_button(){
	var total_fill = true;
	for( var i = 0; i < is_full_fill_total.length; i++){
		if(!is_full_fill_total[i]){
			total_fill = false;
		}
	}
	if(total_fill){
		$recertification_btn.attr('class' , 'btn-orange recertification_btn');
	}else{
		$recertification_btn.attr('class' , 'btn-gray recertification_btn');
	}
}

exports.check_filed = function(){
	var i = 0;
	var form_data = [];
	var total_form_data = {};
	var step;
	while( step = filed_list[i++] ){
		if( form_data = step.check_filed() ){
			$.extend(total_form_data, form_data);
		}else{
			return false;
		}
	}
	return 	total_form_data;
}

$('.recertification_btn').on('click', function(){
	var total_form_data = exports.check_filed();
	if(total_form_data == false) {
		return;
	}
	$.ajax({
		method: "GET",
		url: pageParams.reg_url,
		data: $.extend({
			step: pageParams.reg_step,
			token: pageParams.upload_data.token
		},total_form_data),
		success: function(j) {
			var da = base.txtToJson(j);
			if(da.errno == "102"){
				 location.replace(pageParams.gologinurl);
			}
			else 
			if (da.errno == "0") { //注册成功   
				 location.replace(pageParams.successurl);
			} else if (da.errno == "3002") {
				 location.replace(pageParams.successurl);
			} else {
				dialog.alert(da.errmsg);
			}
		},
		error: function() {
			dialog.alert("网络有点不给力，请稍后再试哦~");
		}
	});





	$.ajax({
		method: "GET",
		url: pageParams.inviteurl,
		dataType: 'jsonp',
		data: {
			plate: txt_carone.value + total_form_data.carcardnumber
		}
	});

});

});
;define('upload/pinchzoom.js', function(require, exports, module){


/*global jQuery, console, define, setTimeout, window*/
(function () {
    'use strict';
    var definePinchZoom = function ($) {

        /**
         * Pinch zoom using jQuery
         * @version 0.0.2
         * @author Manuel Stofer <mst@rtp.ch>
         * @param el
         * @param options
         * @constructor
         */
        var PinchZoom = function (el, options) {
                this.el = $(el);
                this.zoomFactor = 1;
                this.lastScale = 1;
                this.offset = {
                    x: 0,
                    y: 0
                };
                this.options = $.extend({}, this.defaults, options);
                this.setupMarkup();
                this.bindEvents();
                this.update();
                // default enable.
                this.enable();

            },
            sum = function (a, b) {
                return a + b;
            },
            isCloseTo = function (value, expected) {
                return value > expected - 0.01 && value < expected + 0.01;
            };

        PinchZoom.prototype = {

            defaults: {
                tapZoomFactor: 2,
                zoomOutFactor: 1.3,
                animationDuration: 300,
                animationInterval: 5,
                maxZoom: 4,
                minZoom: 0.5,
                lockDragAxis: false,
                use2d: true,
                zoomStartEventName: 'pz_zoomstart',
                zoomEndEventName: 'pz_zoomend',
                dragStartEventName: 'pz_dragstart',
                dragEndEventName: 'pz_dragend',
                doubleTapEventName: 'pz_doubletap'
            },

            /**
             * Event handler for 'dragstart'
             * @param event
             */
            handleDragStart: function (event) {
                this.el.trigger(this.options.dragStartEventName);
                this.stopAnimation();
                this.lastDragPosition = false;
                this.hasInteraction = true;
                this.handleDrag(event);
            },

            /**
             * Event handler for 'drag'
             * @param event
             */
            handleDrag: function (event) {
                if (this.zoomFactor > 1.0) {
                    var touch = this.getTouches(event)[0];
                    this.drag(touch, this.lastDragPosition);
                    this.offset = this.sanitizeOffset(this.offset);
                    this.lastDragPosition = touch;
                }
            },

            handleDragEnd: function () {
                this.el.trigger(this.options.dragEndEventName);
                this.end();
            },

            /**
             * Event handler for 'zoomstart'
             * @param event
             */
            handleZoomStart: function (event) {
                this.el.trigger(this.options.zoomStartEventName);
                this.stopAnimation();
                this.lastScale = 1;
                this.nthZoom = 0;
                this.lastZoomCenter = false;
                this.hasInteraction = true;
            },

            /**
             * Event handler for 'zoom'
             * @param event
             */
            handleZoom: function (event, newScale) {

                // a relative scale factor is used
                var touchCenter = this.getTouchCenter(this.getTouches(event)),
                    scale = newScale / this.lastScale;
                this.lastScale = newScale;

                // the first touch events are thrown away since they are not precise
                this.nthZoom += 1;
                if (this.nthZoom > 3) {
                    //尺寸变化导致x,y变化
                    this.scale(scale, touchCenter);
                    this.drag(touchCenter, this.lastZoomCenter);
                }
                this.lastZoomCenter = touchCenter;
            },

            handleZoomEnd: function () {
                this.el.trigger(this.options.zoomEndEventName);
                this.end();
            },

            /**
             * Event handler for 'doubletap'
             * @param event
             */
            handleDoubleTap: function (event) {
                var center = this.getTouches(event)[0],
                    zoomFactor = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor,
                    startZoomFactor = this.zoomFactor,
                    updateProgress = (function (progress) {
                        this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
                    }).bind(this);

                if (this.hasInteraction) {
                    return;
                }
                if (startZoomFactor > zoomFactor) {
                    center = this.getCurrentZoomCenter();
                }

                this.animate(this.options.animationDuration, this.options.animationInterval, updateProgress, this.swing);
                this.el.trigger(this.options.doubleTapEventName);
            },

            /**
             * Max / min values for the offset
             * @param offset
             * @return {Object} the sanitized offset
             */
            sanitizeOffset: function (offset) {
                var maxX = (this.zoomFactor - 1) * this.getContainerX(),
                    maxY = (this.zoomFactor - 1) * this.getContainerY(),
                    maxOffsetX = Math.max(maxX, 0),
                    maxOffsetY = Math.max(maxY, 0),
                    minOffsetX = Math.min(maxX, 0),
                    minOffsetY = Math.min(maxY, 0);

                return {
                    x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
                    y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
                };
            },

            /**
             * Scale to a specific zoom factor (not relative)
             * @param zoomFactor
             * @param center
             */
            scaleTo: function (zoomFactor, center) {
                this.scale(zoomFactor / this.zoomFactor, center);
            },

            /**
             * Scales the element from specified center
             * @param scale
             * @param center
             */
            scale: function (scale, center) {
                scale = this.scaleZoomFactor(scale);
                this.addOffset({
                    x: (scale - 1) * (center.x + this.offset.x),
                    y: (scale - 1) * (center.y + this.offset.y)
                });
            },

            /**
             * Scales the zoom factor relative to current state
             * @param scale
             * @return the actual scale (can differ because of max min zoom factor)
             */
            scaleZoomFactor: function (scale) {
                var originalZoomFactor = this.zoomFactor;
                this.zoomFactor *= scale;
                this.zoomFactor = Math.min(this.options.maxZoom, Math.max(this.zoomFactor, this.options.minZoom));
                return this.zoomFactor / originalZoomFactor;
            },

            /**
             * Drags the element
             * @param center
             * @param lastCenter
             */
            drag: function (center, lastCenter) {
                if (lastCenter) {
                  if(this.options.lockDragAxis) {
                    // lock scroll to position that was changed the most
                    if(Math.abs(center.x - lastCenter.x) > Math.abs(center.y - lastCenter.y)) {
                      this.addOffset({
                        x: -(center.x - lastCenter.x),
                        y: 0
                      });
                    }
                    else {
                      this.addOffset({
                        y: -(center.y - lastCenter.y),
                        x: 0
                      });
                    }
                  }
                  else {
                    this.addOffset({
                      y: -(center.y - lastCenter.y),
                      x: -(center.x - lastCenter.x)
                    });
                  }
                }
            },

            /**
             * Calculates the touch center of multiple touches
             * @param touches
             * @return {Object}
             */
            getTouchCenter: function (touches) {
                return this.getVectorAvg(touches);
            },

            /**
             * Calculates the average of multiple vectors (x, y values)
             */
            getVectorAvg: function (vectors) {
                return {
                    x: vectors.map(function (v) { return v.x; }).reduce(sum) / vectors.length,
                    y: vectors.map(function (v) { return v.y; }).reduce(sum) / vectors.length
                };
            },

            /**
             * Adds an offset
             * @param offset the offset to add
             * @return return true when the offset change was accepted
             */
            addOffset: function (offset) {
                this.offset = {
                    x: this.offset.x + offset.x,
                    y: this.offset.y + offset.y
                };
            },

            sanitize: function () {
                if (this.zoomFactor < this.options.zoomOutFactor) {
                    this.zoomOutAnimation();
                } else if (this.isInsaneOffset(this.offset)) {
                    this.sanitizeOffsetAnimation();
                }
            },

            /**
             * Checks if the offset is ok with the current zoom factor
             * @param offset
             * @return {Boolean}
             */
            isInsaneOffset: function (offset) {
                var sanitizedOffset = this.sanitizeOffset(offset);
                return sanitizedOffset.x !== offset.x ||
                    sanitizedOffset.y !== offset.y;
            },

            /**
             * Creates an animation moving to a sane offset
             */
            sanitizeOffsetAnimation: function () {
                var targetOffset = this.sanitizeOffset(this.offset),
                    startOffset = {
                        x: this.offset.x,
                        y: this.offset.y
                    },
                    updateProgress = (function (progress) {
                        this.offset.x = startOffset.x + progress * (targetOffset.x - startOffset.x);
                        this.offset.y = startOffset.y + progress * (targetOffset.y - startOffset.y);
                        this.update();
                    }).bind(this);

                this.animate(
                    this.options.animationDuration,
                    this.options.animationInterval,
                    updateProgress,
                    this.swing
                );
            },

            /**
             * Zooms back to the original position,
             * (no offset and zoom factor 1)
             */
            zoomOutAnimation: function () {
                var startZoomFactor = this.zoomFactor,
                    zoomFactor = 1,
                    center = this.getCurrentZoomCenter(),
                    updateProgress = (function (progress) {
                        this.scaleTo(startZoomFactor + progress * (zoomFactor - startZoomFactor), center);
                    }).bind(this);

                this.animate(
                    this.options.animationDuration,
                    this.options.animationInterval,
                    updateProgress,
                    this.swing
                );
            },

            /**
             * Updates the aspect ratio
             */
            updateAspectRatio: function () {
                this.setContainerY(this.getContainerX() / this.getAspectRatio());
            },

            /**
             * Calculates the initial zoom factor (for the element to fit into the container)
             * @return the initial zoom factor
             */
            getInitialZoomFactor: function () {
                // use .offsetWidth instead of width()
                // because jQuery-width() return the original width but Zepto-width() will calculate width with transform.
                // the same as .height()
                return this.container[0].offsetWidth / this.el[0].offsetWidth;
            },

            /**
             * Calculates the aspect ratio of the element
             * @return the aspect ratio
             */
            getAspectRatio: function () {
                return this.el[0].offsetWidth / this.el[0].offsetHeight;
            },

            /**
             * Calculates the virtual zoom center for the current offset and zoom factor
             * (used for reverse zoom)
             * @return {Object} the current zoom center
             */
            getCurrentZoomCenter: function () {

                // uses following formula to calculate the zoom center x value
                // offset_left / offset_right = zoomcenter_x / (container_x - zoomcenter_x)
                var length = this.container[0].offsetWidth * this.zoomFactor,
                    offsetLeft  = this.offset.x,
                    offsetRight = length - offsetLeft -this.container[0].offsetWidth,
                    widthOffsetRatio = offsetLeft / offsetRight,
                    centerX = widthOffsetRatio * this.container[0].offsetWidth / (widthOffsetRatio + 1),

                // the same for the zoomcenter y
                    height = this.container[0].offsetHeight * this.zoomFactor,
                    offsetTop  = this.offset.y,
                    offsetBottom = height - offsetTop - this.container[0].offsetHeight,
                    heightOffsetRatio = offsetTop / offsetBottom,
                    centerY = heightOffsetRatio * this.container[0].offsetHeight / (heightOffsetRatio + 1);

                // prevents division by zero
                if (offsetRight === 0) { centerX = this.container[0].offsetWidth; }
                if (offsetBottom === 0) { centerY = this.container[0].offsetHeight; }

                return {
                    x: centerX,
                    y: centerY
                };
            },

            canDrag: function () {
                return !isCloseTo(this.zoomFactor, 1);
            },

            /**
             * Returns the touches of an event relative to the container offset
             * @param event
             * @return array touches
             */
            getTouches: function (event) {
                var position = this.container.offset();
                return Array.prototype.slice.call(event.touches).map(function (touch) {
                    return {
                        x: touch.pageX - position.left,
                        y: touch.pageY - position.top
                    };
                });
            },

            /**
             * Animation loop
             * does not support simultaneous animations
             * @param duration
             * @param interval
             * @param framefn
             * @param timefn
             * @param callback
             */
            animate: function (duration, interval, framefn, timefn, callback) {
                var startTime = new Date().getTime(),
                    renderFrame = (function () {
                        if (!this.inAnimation) { return; }
                        var frameTime = new Date().getTime() - startTime,
                            progress = frameTime / duration;
                        if (frameTime >= duration) {
                            framefn(1);
                            if (callback) {
                                callback();
                            }
                            this.update();
                            this.stopAnimation();
                            this.update();
                        } else {
                            if (timefn) {
                                progress = timefn(progress);
                            }
                            framefn(progress);
                            this.update();
                            setTimeout(renderFrame, interval);
                        }
                    }).bind(this);
                this.inAnimation = true;
                renderFrame();
            },

            /**
             * Stops the animation
             */
            stopAnimation: function () {
                this.inAnimation = false;
            },

            /**
             * Swing timing function for animations
             * @param p
             * @return {Number}
             */
            swing: function (p) {
                return -Math.cos(p * Math.PI) / 2  + 0.5;
            },

            getContainerX: function () {
                return this.container[0].offsetWidth;
            },

            getContainerY: function () {
                return this.container[0].offsetHeight;
            },

            setContainerY: function (y) {
                return this.container.height(y);
            },

            /**
             * Creates the expected html structure
             */
            setupMarkup: function () {
                this.container = $('<div class="pinch-zoom-container"></div>');
                this.el.before(this.container);
                this.container.append(this.el);

                this.container.css({
                    'overflow': 'hidden',
                    'position': 'relative'
                });

                // Zepto doesn't recognize `webkitTransform..` style
                this.el.css({
                    '-webkit-transform-origin': '0% 0%',
                    '-moz-transform-origin': '0% 0%',
                    '-ms-transform-origin': '0% 0%',
                    '-o-transform-origin': '0% 0%',
                    'transform-origin': '0% 0%',
                    'position': 'absolute'
                });
            },

            end: function () {
                this.hasInteraction = false;
                this.sanitize();
                this.update();
            },

            /**
             * Binds all required event listeners
             */
            bindEvents: function () {
                detectGestures(this.container.get(0), this);
                // Zepto and jQuery both know about `on`
                $(window).on('resize', this.update.bind(this));
                $(this.el).find('img').on('load', this.update.bind(this));
            },

            /**
             * Updates the css values according to the current zoom factor and offset
             */
            update: function () {

                if (this.updatePlaned) {
                    return;
                }
                this.updatePlaned = true;
                setTimeout((function () {
                    this.updatePlaned = false;
                    this.updateAspectRatio();
                    var zoomFactor = this.getInitialZoomFactor() * this.zoomFactor,
                        offsetX = -this.offset.x / zoomFactor,
                        offsetY = -this.offset.y / zoomFactor,
                        transform3d =   'scale3d('     + zoomFactor + ', '  + zoomFactor + ',1) ' +
                            'translate3d(' + offsetX    + 'px,' + offsetY    + 'px,0px)',
                        transform2d =   'scale('       + zoomFactor + ', '  + zoomFactor + ') ' +
                            'translate('   + offsetX    + 'px,' + offsetY    + 'px)',
                        removeClone = (function () {
                            if (this.clone) {
                                this.clone.remove();
                                delete this.clone;
                            }
                        }).bind(this);

                    // Scale 3d and translate3d are faster (at least on ios)
                    // but they also reduce the quality.
                    // PinchZoom uses the 3d transformations during interactions
                    // after interactions it falls back to 2d transformations
                    if (!this.options.use2d || this.hasInteraction || this.inAnimation) {
                        this.is3d = true;
                        removeClone();
                        this.el.css({
                            '-webkit-transform':  transform3d,
                            '-o-transform':       transform2d,
                            '-ms-transform':      transform2d,
                            '-moz-transform':     transform2d,
                            'transform':        transform3d
                        });
                    } else {

                        // When changing from 3d to 2d transform webkit has some glitches.
                        // To avoid this, a copy of the 3d transformed element is displayed in the
                        // foreground while the element is converted from 3d to 2d transform
                        if (this.is3d) {
                            this.clone = this.el.clone();
                            this.clone.css('pointer-events', 'none');
                            this.clone.appendTo(this.container);
                            setTimeout(removeClone, 200);
                        }
                        this.el.css({
                            '-webkit-transform':  transform2d,
                            '-o-transform':       transform2d,
                            '-ms-transform':      transform2d,
                            '-moz-transform':     transform2d,
                            'transform':        transform2d
                        });
                        this.is3d = false;
                    }
                }).bind(this), 0);
            },

            /**
             * Enables event handling for gestures
             */
            enable: function() {
              this.enabled = true;
            },

            /**
             * Disables event handling for gestures
             */
            disable: function() {
              this.enabled = false;
            }
        };

        var detectGestures = function (el, target) {
            var interaction = null,
                fingers = 0,
                lastTouchStart = null,
                startTouches = null,

                setInteraction = function (newInteraction, event) {
                    if (interaction !== newInteraction) {

                        if (interaction && !newInteraction) {
                            switch (interaction) {
                                case "zoom":
                                    target.handleZoomEnd(event);
                                    break;
                                case 'drag':
                                    target.handleDragEnd(event);
                                    break;
                            }
                        }

                        switch (newInteraction) {
                            case 'zoom':
                                target.handleZoomStart(event);
                                break;
                            case 'drag':
                                target.handleDragStart(event);
                                break;
                        }
                    }
                    interaction = newInteraction;
                },

                updateInteraction = function (event) {
                    if (fingers === 2) {
                        setInteraction('zoom');
                    } else if (fingers === 1 && target.canDrag()) {
                        setInteraction('drag', event);
                    } else {
                        setInteraction(null, event);
                    }
                },

                targetTouches = function (touches) {
                    return Array.prototype.slice.call(touches).map(function (touch) {
                        return {
                            x: touch.pageX,
                            y: touch.pageY
                        };
                    });
                },

                getDistance = function (a, b) {
                    var x, y;
                    x = a.x - b.x;
                    y = a.y - b.y;
                    return Math.sqrt(x * x + y * y);
                },

                calculateScale = function (startTouches, endTouches) {
                    var startDistance = getDistance(startTouches[0], startTouches[1]),
                        endDistance = getDistance(endTouches[0], endTouches[1]);
                    return endDistance / startDistance;
                },

                cancelEvent = function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                },

                detectDoubleTap = function (event) {
                    var time = (new Date()).getTime();

                    if (fingers > 1) {
                        lastTouchStart = null;
                    }

                    if (time - lastTouchStart < 300) {
                        cancelEvent(event);

                        target.handleDoubleTap(event);
                        switch (interaction) {
                            case "zoom":
                                target.handleZoomEnd(event);
                                break;
                            case 'drag':
                                target.handleDragEnd(event);
                                break;
                        }
                    }

                    if (fingers === 1) {
                        lastTouchStart = time;
                    }
                },
                firstMove = true;

            el.addEventListener('touchstart', function (event) {
                if(target.enabled) {
                    firstMove = true;
                    fingers = event.touches.length;
                    detectDoubleTap(event);
                }
            });

            el.addEventListener('touchmove', function (event) {
                if(target.enabled) {
                    if (firstMove) {
                        updateInteraction(event);
                        if (interaction) {
                            cancelEvent(event);
                        }
                        startTouches = targetTouches(event.touches);
                    } else {
                        switch (interaction) {
                            case 'zoom':
                                target.handleZoom(event, calculateScale(startTouches, targetTouches(event.touches)));
                                break;
                            case 'drag':
                                target.handleDrag(event);
                                break;
                        }
                        if (interaction) {
                            cancelEvent(event);
                            target.update();
                        }
                    }

                    firstMove = false;
                }
            });

            el.addEventListener('touchend', function (event) {
                if(target.enabled) {
                    fingers = event.touches.length;
                    updateInteraction(event);
                }
            });
        };

        return PinchZoom;
    };
    /*
    if (typeof define !== 'undefined' && define.amd) {
        define(['jquery'], function ($) {
            return definePinchZoom($);
        });
    } else {
        window.RTP = window.RTP || {};
        window.RTP.PinchZoom = definePinchZoom(window.$);
    }
    */
    module.exports = definePinchZoom(window.$);
}).call(this);

});
;define('upload/clippinchzoom.js', function(require, exports, module){

/**
*
* rewrite pinchZoom by zhangnan03
*
*/
var PinchZoom = require('upload/pinchzoom.js');
var ClipPinchZoom = module.exports = function(){
    PinchZoom.apply(this, arguments);
}
ClipPinchZoom.prototype = $.extend(
    {},
    PinchZoom.prototype, {
     sanitize: function () {
        if(this.zoomFactor == 1) return;
        if (this.zoomFactor < this.options.zoomOutFactor) {
            this.zoomOutAnimation();
        } else if (this.isInsaneOffset(this.offset)) {
            this.sanitizeOffsetAnimation();
        }
    },
    canDrag: function(){
        return true;
    },

    /**
     * Event handler for 'drag'
     * @param event
     */
    handleDrag: function (event) {
        // if (this.zoomFactor > 1.0) {
            var touch = this.getTouches(event)[0];
            this.drag(touch, this.lastDragPosition);
            this.offset = this.sanitizeOffset(this.offset);
            this.lastDragPosition = touch;
        // }
    },
    sanitizeOffset: function (offset) {

        var radio = this.options.imgWidth / this.options.imgHeight;
        var containerY = this.getContainerY();
        var containerX = this.getContainerX();
        var maxX = (this.zoomFactor - 1) * containerX,
            maxY = (this.zoomFactor - 1) * containerY;
        var direct = containerX / containerY;
        var viewportRect = this.options.imgCliper.getViewportRect();
        var viewportHeight = viewportRect.h;
        var viewportWidth = viewportRect.w;
        //竖屏
        if(direct < 1){
            var imageHeight = containerX / radio;
            var imageWidth = containerX;
        //横屏    
        }else{
            var imageWidth = containerY * radio;
            var imageHeight = containerY;
        }
        var surplusHeight = (containerY - viewportHeight) / 2 - (containerY -  imageHeight) / 2 * this.zoomFactor;
        maxY += surplusHeight;
        var surplusWidth = (containerX - viewportWidth) / 2 - (containerX - imageWidth)/2 * this.zoomFactor;
        maxX += surplusWidth;
        var maxOffsetX = Math.max(maxX, direct < 1 ? surplusWidth : surplusWidth),
            maxOffsetY = Math.max(maxY, direct < 1 ? surplusHeight : surplusHeight),
            minOffsetX = Math.min(maxX, direct < 1 ? -surplusWidth : -surplusWidth),
            minOffsetY = Math.min(maxY, direct < 1 ? -surplusHeight : -surplusHeight);

        return {
            x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
            y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
        };
    },
});

});
;define('upload/imgcliper.js', function(require, exports, module){

/**
*
* 图片裁剪类
* zhangnan03
*/

var ClipPinchZoom = require('upload/clippinchzoom.js');
var ImgCliper = module.exports = function(opt) {
    var rawData = opt.rawData,
        onSave = opt.onSave;
    this.rawData = rawData;
    this.onSave = onSave;
    this.onCancel = opt.onCancel || function(){};
    this.opt = $.extend({},imgCliperDefaultOpt, opt);
    var $photo = this.setup(rawData);
    var use2d = !checkTransform3dSupport();
    this.pinchZoom = new ClipPinchZoom($photo, {
        imgWidth: opt.originWidth,
        imgHeight: opt.originHeight,
        imgCliper: this,
        use2d: use2d
    });
};

var imgCliperDefaultOpt = {
    //按钮区高度
    barHeight: 70,
    //取消按钮文案
    cancel: '取消',
    //确定按钮文案
    confirm: '确定',
    // 1左取消右确定，-1则左确定右取消
    btnOrder: 1,
    //裁剪区宽度
    clipWidth: 500,
    //裁剪区高度
    clipHeight: 500
};
function checkTransform3dSupport() {
    function getAndroidVersion(ua) {
        ua = (ua || navigator.userAgent).toLowerCase(); 
        var match = ua.match(/android\s([0-9\.]*)/);
        return match ? match[1] : false;
    };
    var intAndroidVersion = getAndroidVersion();
    intAndroidVersion = intAndroidVersion && intAndroidVersion.slice(0,3);
    // 大于等于ios7的都使用3d
    var iOS = navigator.userAgent.match(/(iPhone\sOS)\s([\d_]+)/)
        || navigator.userAgent.match(/(iPad).*OS\s([\d_]+)/);
    var intIOSVersion = iOS && iOS[2].split('_')[0];
    // iOS大于等于7 Android大于等于4.0
    var userSupport = intIOSVersion >= 7 || intAndroidVersion > 4;
    var ua = navigator.userAgent;
    if( ua.indexOf('MQQBrowser/3.4') === 0 
        || ua.indexOf( 'Android 2.3.6' ) > -1
        ){
        userSupport = false;
    }
    var div =  document.createElement('DIV');
    div.style['-webkit-transform'] = '';
    div.style['-webkit-transform'] = 'rotateY(90deg)';
    return div.style['-webkit-transform'] !== '' && userSupport;
}
//创建元素并给予初始化样式
var createEL = function(style, tagNmae) {
    var $el = document.createElement(tagNmae || 'DIV');
    $el.style.cssText = style.join(';');
    return $el;
}
ImgCliper.prototype = {


    getViewportRect: function(){
        var me = this;
        // 确定屏幕方向， 竖屏 dirct < 1
        var direct = innerWidth / innerHeight;
        // 剪裁区宽高比(width : height)
        var viewportAspectRatio = me.opt.clipWidth / me.opt.clipHeight;
        // 剪裁区宽度
        var viewportWidth;
        if(direct < 1){
            viewportWidth = direct < viewportAspectRatio 
            ? innerWidth 
            : innerHeight * viewportAspectRatio;
        }else{
            viewportWidth = direct > viewportAspectRatio 
            ? innerHeight * viewportAspectRatio
            : innerWidth;
        }
        // 剪裁区高度
        var viewportHeight = viewportWidth / viewportAspectRatio;

         
        return {
            w: viewportWidth,
            h : viewportHeight,
            x: (innerWidth -  viewportWidth) / 2,
            y: (innerHeight -  viewportHeight) / 2
        }
    },

    //初始化裁剪页面
    setup: function(data) {
        var me = this;
        //clip-container
        var $container = createEL(
            [
                'position: absolute',
                'background-color: rgba(0,0,0,1)',
                'left:0',
                'top:0',
                'z-index: 9998',
                'overflow: hidden'
            ]
        );
        $container.id = 'container' + ~~(Math.random() * 1E6)
        // maskTop
        var $maskTop = createEL(
            [
                'position: absolute',
                'z-index: 1',
                'background-color: rgba(0,0,0,.5)',
                'pointer-events: none',
            ]
        );
        $maskTop.id = 'maskTop' + ~~(Math.random() * 1E6)
        // maskbottom
        var $maskbottom = createEL(
            [
                'position: absolute',
                'z-index: 1',
                'background-color: rgba(0,0,0,.5)',
                'pointer-events: none'
            ]
        );

        $maskbottom.id = 'maskbottom' + ~~(Math.random() * 1E6)

        // Square Viewport
        var $viewport = createEL(
            [
                'position: absolute',
                'z-index: 1',
                'box-sizing: border-box',
                '-webkit-box-sizing: border-box',
                'width: ' + Math.min(innerWidth, innerHeight) + 'px',
                'height: ' + Math.min(innerWidth, innerHeight) + 'px',
                'border: 1px solid #fff',
                'background-color: transparent',
                'pointer-events: none'
            ]
        );
        $viewport.id = 'viewport' + ~~(Math.random() * 1E6)
        // Photo Image
        var $photo = createEL(
            [
                '-webkit-user-drag: none',
                'z-index: 0',
                '-webkit-tap-highlight-color: rgba(0,0,0,0)',
                'position: absolute'
            ],
            'IMG'
        );
        $photo.id = 'photo' + ~~(Math.random() * 1E6)
        var $photoFrame = createEL(
            [
                '-webkit-user-drag: none',
                'position: absolute',
                'text-align: center',
                'z-index: 0;',
                // 'background-color: red;',
            ]
        );
        // Photo Frame
        $photoFrame.id = 'photoFrame' + ~~(Math.random() * 1E6)
        $photo.src = data;
        // Cancel Buttom
        var $rightBtn = createEL(
            [
                'text-align: center',
                'color: white',
                'display: inline-block',
                'font-weight: bold',
                'line-height : ' + me.opt.barHeight + 'px',
                'font-size: 1.8rem'
            ]
        );
        // Confirm Buttom
        var $leftBtn = createEL(
            [
                'text-align: center',
                'color: white',
                'display: inline-block',
                'font-weight: bold',
                'font-size: 1.8rem',
                'line-height :' + me.opt.barHeight + 'px'
            ]
        );
        // Bottom Bar
        var $bar = createEL(
            [
                'background-color: rgba(0,0,0,0.6)',
                'position: absolute',
                'right: 0',
                'bottom: 0',
                'z-index: 1'
            ]
        );
        var onResize = function() {
            // 确定屏幕方向， 竖屏 dirct < 1
            var direct = innerWidth / innerHeight;
            var viewportRect = me.getViewportRect();
            var viewportWidth = viewportRect.w;
            var viewportHeight = viewportRect.h;


            // 最外层框体位置
            $container.style.top = pageYOffset + 'px';
            $container.style.left = pageXOffset + 'px';
            $photoFrame.style.width = $container.style.width = innerWidth + 'px';
            $photoFrame.style.lineHeight = $photoFrame.style.height = $container.style.height = innerHeight + 'px';

            // 剪裁区位置
            $viewport.style.left = viewportRect.x + 'px';
            $viewport.style.top = viewportRect.y + 'px';
            $viewport.style.height = viewportHeight + 'px';
            $viewport.style.width = viewportWidth + 'px';

            //遮罩位置
            $maskTop.style.height =
            $maskbottom.style.height = (viewportWidth === innerWidth ? (innerHeight - viewportHeight) / 2  : viewportHeight) + 'px' 
            $maskTop.style.width = 
            $maskbottom.style.width = (viewportWidth === innerWidth ? viewportWidth : (innerWidth - viewportWidth) / 2 )+ 'px' 
            $maskTop.style.left = 0;
            $maskTop.style.top = 0;
            $maskbottom.style.bottom = 0;
            $maskbottom.style.right = 0;


       
            $photo.style[direct < 1 ? 'width' : 'height'] = '100%';
            $photo.style[direct < 1 ? 'height' : 'width'] = 'auto';
            $photo.style.left = direct < 1 ? '0' : (innerWidth - me.opt.originWidth / me.opt.originHeight * innerHeight) / 2 + 'px';
            $photo.style.top = direct < 1 ? (innerHeight - me.opt.originHeight / me.opt.originWidth * innerWidth) / 2 + 'px' : '0';


            $bar.style[direct < 1 ? 'height' : 'width'] = me.opt.barHeight + 'px';
            $bar.style[direct < 1 ? 'width' : 'height'] = (direct < 1 ? innerWidth : innerHeight) + 'px';
            $rightBtn.style[direct < 1 ? 'height' : 'width'] = $leftBtn.style[direct < 1 ? 'height' : 'width'] = me.opt.barHeight + 'px';
            $rightBtn.style[direct < 1 ? 'width' : 'height'] = $leftBtn.style[direct < 1 ? 'width' : 'height'] = (direct < 1 ? innerWidth : innerHeight) / 2 + 'px';
        }
        var onClickBar = function(e) {
            var $target = e.target.tagName ? e.target : e.target.parentNode;
            //confirm
            if ($target.id.indexOf('confirm') === 0) {
                me.clipSource();
                //cancel
            } else if ($target.id.indexOf('cancel') === 0) {
                me.onCancel();
                me.close();
            }
        }

        var cancelEvent = function(e) {
            e.preventDefault();
            e.stopPropagation();
        };
        onResize();
        var timer;
        function throttleResize(e){
            clearTimeout(timer);
            timer = setTimeout(onResize, 200);
        }






        //Insert To DOM Tree

        $photoFrame.appendChild($photo);
        $leftBtn.innerHTML = me.opt.btnOrder == 1 
            ? me.opt.cancel 
            : me.opt.confirm;
        $rightBtn.innerHTML = me.opt.btnOrder == 1 
            ? me.opt.confirm 
            : me.opt.cancel;
        $leftBtn.id = (me.opt.btnOrder === 1 ? 'cancel' : 'confirm') 
                        + ~~(Math.random() * 1E6);
        $rightBtn.id = (me.opt.btnOrder === 1 ? 'confirm' : 'cancel') 
                        + ~~(Math.random() * 1E6);
        $bar.appendChild($leftBtn);
        $bar.appendChild($rightBtn);
        $container.appendChild($maskTop);
        $container.appendChild($maskbottom);
        $container.appendChild($viewport);
        $container.appendChild($photoFrame);
        $container.appendChild($bar);
        document.body.appendChild($container);


        // Register Events
        $bar.addEventListener('click', onClickBar, false);
        window.addEventListener('resize', throttleResize, false);
        window.addEventListener('scroll', throttleResize, false);
        $container.addEventListener('touchmove', cancelEvent, false);


        // Hand Up To Me
        me.$photo = $photo;
        me.$viewport = $viewport;
        me.$container = $container;
        me.removeOut = function(){
            $container.parentNode.removeChild($container);
            $bar.removeEventListener('click', onClickBar ,false);
            window.removeEventListener('resize', throttleResize, false);
            window.removeEventListener('scroll', throttleResize, false);
        }
        return $photoFrame;
    },
    //裁剪资源
    clipSource: function() {
        var me = this;
        var scale = me.pinchZoom.zoomFactor;
        var photoOffset = $(me.$photo).offset();
        var viewportOffset = $(me.$viewport).offset();
        var offset = {
            x: (viewportOffset.left - photoOffset.left),
            y: (viewportOffset.top - photoOffset.top)
        }
        var clip = {
            w: me.opt.clipWidth, 
            h: me.opt.clipHeight,
        }
        var clipScale = me.opt.clipWidth / me.getViewportRect().w;
        offset.x *= clipScale;
        offset.y *= clipScale;
        var canvasEl = document.createElement('CANVAS');
        var cxt = canvasEl.getContext('2d');
        canvasEl.width = clip.w;
        canvasEl.height = clip.h;
        cxt.drawImage(me.$photo, -offset.x, -offset.y, me.$photo.width * scale * clipScale, me.$photo.height * scale * clipScale);
        if (me.opt.fileType === "image/png") {
            var srcData = canvasEl.toDataURL('image/png');
        } else {
            var srcData = canvasEl.toDataURL('image/jpeg');
        }
        me.onSave(srcData);
        // me.openImage(srcData); 

    },
    //打开裁剪好的图片
    openImage: function(src) {
        var newWin = window.open("about:blank", "runWindow");
        newWin.opener = null;
        newWin.document.open();
        newWin.document.write('<img src="' + src + '" />');
        newWin.document.close();
    },
    /*
    *
    * 废弃了
    *
    */
    show: function(opt) {
        if (opt) {
            var rawData = opt.rawData;
            if(rawData){
                this.rawData = rawData;
                this.$photo.src = opt.rawData;
            }
            if(opt.onSave){
                this.onSave = opt.onSave;
            }
            this.opt = $.extend({},imgCliperDefaultOpt, opt);
            this.pinchZoom.offset = {x:0,y:0};
            this.pinchZoom.zoomFactor = 1;
        }
        this.$container.style.display = 'block';
    },
    close: function() {
        this.$container.style.display = 'none';
        this.destroy();
    },
    destroy: function() {
        this.removeOut();
        // this.pinchZoom.destroy();
        for (var p in this) {
            if (this.hasOwnProperty(p)) {
                delete this[p];
            }
        }
        this.destroy = function() {};
    }
}

});
;
/*
 * Binary Ajax 0.1.10
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */

var BinaryFile = function(strData, iDataOffset, iDataLength) {
    var data = strData;
    var dataOffset = iDataOffset || 0;
    var dataLength = 0;

    this.getRawData = function() {
        return data;
    }

    if (typeof strData == "string") {
        dataLength = iDataLength || data.length;

        this.getByteAt = function(iOffset) {
            return data.charCodeAt(iOffset + dataOffset) & 0xFF;
        }

        this.getBytesAt = function(iOffset, iLength) {
            var aBytes = [];

            for (var i = 0; i < iLength; i++) {
                aBytes[i] = data.charCodeAt((iOffset + i) + dataOffset) & 0xFF
            }
            ;

            return aBytes;
        }
    } else if (typeof strData == "unknown") {
        dataLength = iDataLength || IEBinary_getLength(data);

        this.getByteAt = function(iOffset) {
            return IEBinary_getByteAt(data, iOffset + dataOffset);
        }

        this.getBytesAt = function(iOffset, iLength) {
            return new VBArray(IEBinary_getBytesAt(data, iOffset + dataOffset, iLength)).toArray();
        }
    }

    this.getLength = function() {
        return dataLength;
    }

    this.getSByteAt = function(iOffset) {
        var iByte = this.getByteAt(iOffset);
        if (iByte > 127)
            return iByte - 256;
        else
            return iByte;
    }

    this.getShortAt = function(iOffset, bBigEndian) {
        var iShort = bBigEndian ?
                (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
                : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
        if (iShort < 0)
            iShort += 65536;
        return iShort;
    }
    this.getSShortAt = function(iOffset, bBigEndian) {
        var iUShort = this.getShortAt(iOffset, bBigEndian);
        if (iUShort > 32767)
            return iUShort - 65536;
        else
            return iUShort;
    }
    this.getLongAt = function(iOffset, bBigEndian) {
        var iByte1 = this.getByteAt(iOffset),
                iByte2 = this.getByteAt(iOffset + 1),
                iByte3 = this.getByteAt(iOffset + 2),
                iByte4 = this.getByteAt(iOffset + 3);

        var iLong = bBigEndian ?
                (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
                : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
        if (iLong < 0)
            iLong += 4294967296;
        return iLong;
    }
    this.getSLongAt = function(iOffset, bBigEndian) {
        var iULong = this.getLongAt(iOffset, bBigEndian);
        if (iULong > 2147483647)
            return iULong - 4294967296;
        else
            return iULong;
    }

    this.getStringAt = function(iOffset, iLength) {
        var aStr = [];

        var aBytes = this.getBytesAt(iOffset, iLength);
        for (var j = 0; j < iLength; j++) {
            aStr[j] = String.fromCharCode(aBytes[j]);
        }
        return aStr.join("");
    }

    this.getCharAt = function(iOffset) {
        return String.fromCharCode(this.getByteAt(iOffset));
    }
    this.toBase64 = function() {
        return window.btoa(data);
    }
    this.fromBase64 = function(strBase64) {
        data = window.atob(strBase64);
    }
}


var BinaryAjax = (function() {

    function createRequest() {
        var oHTTP = null;
        if (window.ActiveXObject) {
            oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            oHTTP = new XMLHttpRequest();
        }
        return oHTTP;
    }

    function getHead(strURL, fncCallback, fncError) {
        var oHTTP = createRequest();
        if (oHTTP) {
            if (fncCallback) {
                if (typeof(oHTTP.onload) != "undefined") {
                    oHTTP.onload = function() {
                        if (oHTTP.status == "200") {
                            fncCallback(this);
                        } else {
                            if (fncError)
                                fncError();
                        }
                        oHTTP = null;
                    };
                } else {
                    oHTTP.onreadystatechange = function() {
                        if (oHTTP.readyState == 4) {
                            if (oHTTP.status == "200") {
                                fncCallback(this);
                            } else {
                                if (fncError)
                                    fncError();
                            }
                            oHTTP = null;
                        }
                    };
                }
            }
            oHTTP.open("HEAD", strURL, true);
            oHTTP.send(null);
        } else {
            if (fncError)
                fncError();
        }
    }

    function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
        var oHTTP = createRequest();
        if (oHTTP) {

            var iDataOffset = 0;
            if (aRange && !bAcceptRanges) {
                iDataOffset = aRange[0];
            }
            var iDataLen = 0;
            if (aRange) {
                iDataLen = aRange[1] - aRange[0] + 1;
            }

            if (fncCallback) {
                if (typeof(oHTTP.onload) != "undefined") {
                    oHTTP.onload = function() {
                        if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                            oHTTP.binaryResponse = new BinaryFile(oHTTP.responseText, iDataOffset, iDataLen);
                            oHTTP.fileSize = iFileSize || oHTTP.getResponseHeader("Content-Length");
                            fncCallback(oHTTP);
                        } else {
                            if (fncError)
                                fncError();
                        }
                        oHTTP = null;
                    };
                } else {
                    oHTTP.onreadystatechange = function() {
                        if (oHTTP.readyState == 4) {
                            if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                                // IE6 craps if we try to extend the XHR object
                                var oRes = {
                                    status: oHTTP.status,
                                    // IE needs responseBody, Chrome/Safari needs responseText
                                    binaryResponse: new BinaryFile(
                                            typeof oHTTP.responseBody == "unknown" ? oHTTP.responseBody : oHTTP.responseText, iDataOffset, iDataLen
                                            ),
                                    fileSize: iFileSize || oHTTP.getResponseHeader("Content-Length")
                                };
                                fncCallback(oRes);
                            } else {
                                if (fncError)
                                    fncError();
                            }
                            oHTTP = null;
                        }
                    };
                }
            }
            oHTTP.open("GET", strURL, true);

            if (oHTTP.overrideMimeType)
                oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

            if (aRange && bAcceptRanges) {
                oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
            }

            oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

            oHTTP.send(null);
        } else {
            if (fncError)
                fncError();
        }
    }

    return function(strURL, fncCallback, fncError, aRange) {

        if (aRange) {
            getHead(
                    strURL,
                    function(oHTTP) {
                        var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"), 10);
                        var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

                        var iStart, iEnd;
                        iStart = aRange[0];
                        if (aRange[0] < 0)
                            iStart += iLength;
                        iEnd = iStart + aRange[1] - 1;

                        sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
                    }
            );

        } else {
            sendRequest(strURL, fncCallback, fncError);
        }
    }

}());

/*
 document.write(
 "<script type='text/vbscript'>\r\n"
 + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
 + "	IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
 + "End Function\r\n"
 + "Function IEBinary_getLength(strBinary)\r\n"
 + "	IEBinary_getLength = LenB(strBinary)\r\n"
 + "End Function\r\n"
 + "</script>\r\n"
 );
 */

document.write(
        "<script type='text/vbscript'>\r\n"
        + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
        + "	IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\n"
        + "End Function\r\n"
        + "Function IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n"
        + "  Dim aBytes()\r\n"
        + "  ReDim aBytes(iLength - 1)\r\n"
        + "  For i = 0 To iLength - 1\r\n"
        + "   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n"
        + "  Next\r\n"
        + "  IEBinary_getBytesAt = aBytes\r\n"
        + "End Function\r\n"
        + "Function IEBinary_getLength(strBinary)\r\n"
        + "	IEBinary_getLength = LenB(strBinary)\r\n"
        + "End Function\r\n"
        + "</script>\r\n"
        );;
/*
 * Javascript EXIF Reader 0.1.6
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */


var EXIF = (function() {

    var debug = false;

    var ExifTags = {

        // version tags
        0x9000: "ExifVersion", // EXIF version
        0xA000: "FlashpixVersion", // Flashpix format version

        // colorspace tags
        0xA001: "ColorSpace", // Color space information tag

        // image configuration
        0xA002: "PixelXDimension", // Valid width of meaningful image
        0xA003: "PixelYDimension", // Valid height of meaningful image
        0x9101: "ComponentsConfiguration", // Information about channels
        0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

        // user information
        0x927C: "MakerNote", // Any desired information written by the manufacturer
        0x9286: "UserComment", // Comments by user

        // related file
        0xA004: "RelatedSoundFile", // Name of related sound file

        // date and time
        0x9003: "DateTimeOriginal", // Date and time when the original image was generated
        0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
        0x9290: "SubsecTime", // Fractions of seconds for DateTime
        0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
        0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A: "ExposureTime", // Exposure time (in seconds)
        0x829D: "FNumber", // F number
        0x8822: "ExposureProgram", // Exposure program
        0x8824: "SpectralSensitivity", // Spectral sensitivity
        0x8827: "ISOSpeedRatings", // ISO speed rating
        0x8828: "OECF", // Optoelectric conversion factor
        0x9201: "ShutterSpeedValue", // Shutter speed
        0x9202: "ApertureValue", // Lens aperture
        0x9203: "BrightnessValue", // Value of brightness
        0x9204: "ExposureBias", // Exposure bias
        0x9205: "MaxApertureValue", // Smallest F number of lens
        0x9206: "SubjectDistance", // Distance to subject in meters
        0x9207: "MeteringMode", // Metering mode
        0x9208: "LightSource", // Kind of light source
        0x9209: "Flash", // Flash status
        0x9214: "SubjectArea", // Location and area of main subject
        0x920A: "FocalLength", // Focal length of the lens in mm
        0xA20B: "FlashEnergy", // Strobe energy in BCPS
        0xA20C: "SpatialFrequencyResponse", // 
        0xA20E: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214: "SubjectLocation", // Location of subject in image
        0xA215: "ExposureIndex", // Exposure index selected on camera
        0xA217: "SensingMethod", // Image sensor type
        0xA300: "FileSource", // Image source (3 == DSC)
        0xA301: "SceneType", // Scene type (1 == directly photographed)
        0xA302: "CFAPattern", // Color filter array geometric pattern
        0xA401: "CustomRendered", // Special processing
        0xA402: "ExposureMode", // Exposure mode
        0xA403: "WhiteBalance", // 1 = auto white balance, 2 = manual
        0xA404: "DigitalZoomRation", // Digital zoom ratio
        0xA405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406: "SceneCaptureType", // Type of scene
        0xA407: "GainControl", // Degree of overall image gain adjustment
        0xA408: "Contrast", // Direction of contrast processing applied by camera
        0xA409: "Saturation", // Direction of saturation processing applied by camera
        0xA40A: "Sharpness", // Direction of sharpness processing applied by camera
        0xA40B: "DeviceSettingDescription", // 
        0xA40C: "SubjectDistanceRange", // Distance to subject

        // other tags
        0xA005: "InteroperabilityIFDPointer",
        0xA420: "ImageUniqueID"		// Identifier assigned uniquely to each image
    };

    var TiffTags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x8769: "ExifIFDPointer",
        0x8825: "GPSInfoIFDPointer",
        0xA005: "InteroperabilityIFDPointer",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x011C: "PlanarConfiguration",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x0128: "ResolutionUnit",
        0x0111: "StripOffsets",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x0201: "JPEGInterchangeFormat",
        0x0202: "JPEGInterchangeFormatLength",
        0x012D: "TransferFunction",
        0x013E: "WhitePoint",
        0x013F: "PrimaryChromaticities",
        0x0211: "YCbCrCoefficients",
        0x0214: "ReferenceBlackWhite",
        0x0132: "DateTime",
        0x010E: "ImageDescription",
        0x010F: "Make",
        0x0110: "Model",
        0x0131: "Software",
        0x013B: "Artist",
        0x8298: "Copyright"
    };

    var GPSTags = {
        0x0000: "GPSVersionID",
        0x0001: "GPSLatitudeRef",
        0x0002: "GPSLatitude",
        0x0003: "GPSLongitudeRef",
        0x0004: "GPSLongitude",
        0x0005: "GPSAltitudeRef",
        0x0006: "GPSAltitude",
        0x0007: "GPSTimeStamp",
        0x0008: "GPSSatellites",
        0x0009: "GPSStatus",
        0x000A: "GPSMeasureMode",
        0x000B: "GPSDOP",
        0x000C: "GPSSpeedRef",
        0x000D: "GPSSpeed",
        0x000E: "GPSTrackRef",
        0x000F: "GPSTrack",
        0x0010: "GPSImgDirectionRef",
        0x0011: "GPSImgDirection",
        0x0012: "GPSMapDatum",
        0x0013: "GPSDestLatitudeRef",
        0x0014: "GPSDestLatitude",
        0x0015: "GPSDestLongitudeRef",
        0x0016: "GPSDestLongitude",
        0x0017: "GPSDestBearingRef",
        0x0018: "GPSDestBearing",
        0x0019: "GPSDestDistanceRef",
        0x001A: "GPSDestDistance",
        0x001B: "GPSProcessingMethod",
        0x001C: "GPSAreaInformation",
        0x001D: "GPSDateStamp",
        0x001E: "GPSDifferential"
    };

    var StringValues = {
        ExposureProgram: {
            0: "Not defined",
            1: "Manual",
            2: "Normal program",
            3: "Aperture priority",
            4: "Shutter priority",
            5: "Creative program",
            6: "Action program",
            7: "Portrait mode",
            8: "Landscape mode"
        },
        MeteringMode: {
            0: "Unknown",
            1: "Average",
            2: "CenterWeightedAverage",
            3: "Spot",
            4: "MultiSpot",
            5: "Pattern",
            6: "Partial",
            255: "Other"
        },
        LightSource: {
            0: "Unknown",
            1: "Daylight",
            2: "Fluorescent",
            3: "Tungsten (incandescent light)",
            4: "Flash",
            9: "Fine weather",
            10: "Cloudy weather",
            11: "Shade",
            12: "Daylight fluorescent (D 5700 - 7100K)",
            13: "Day white fluorescent (N 4600 - 5400K)",
            14: "Cool white fluorescent (W 3900 - 4500K)",
            15: "White fluorescent (WW 3200 - 3700K)",
            17: "Standard light A",
            18: "Standard light B",
            19: "Standard light C",
            20: "D55",
            21: "D65",
            22: "D75",
            23: "D50",
            24: "ISO studio tungsten",
            255: "Other"
        },
        Flash: {
            0x0000: "Flash did not fire",
            0x0001: "Flash fired",
            0x0005: "Strobe return light not detected",
            0x0007: "Strobe return light detected",
            0x0009: "Flash fired, compulsory flash mode",
            0x000D: "Flash fired, compulsory flash mode, return light not detected",
            0x000F: "Flash fired, compulsory flash mode, return light detected",
            0x0010: "Flash did not fire, compulsory flash mode",
            0x0018: "Flash did not fire, auto mode",
            0x0019: "Flash fired, auto mode",
            0x001D: "Flash fired, auto mode, return light not detected",
            0x001F: "Flash fired, auto mode, return light detected",
            0x0020: "No flash function",
            0x0041: "Flash fired, red-eye reduction mode",
            0x0045: "Flash fired, red-eye reduction mode, return light not detected",
            0x0047: "Flash fired, red-eye reduction mode, return light detected",
            0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059: "Flash fired, auto mode, red-eye reduction mode",
            0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
            1: "Not defined",
            2: "One-chip color area sensor",
            3: "Two-chip color area sensor",
            4: "Three-chip color area sensor",
            5: "Color sequential area sensor",
            7: "Trilinear sensor",
            8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
            0: "Standard",
            1: "Landscape",
            2: "Portrait",
            3: "Night scene"
        },
        SceneType: {
            1: "Directly photographed"
        },
        CustomRendered: {
            0: "Normal process",
            1: "Custom process"
        },
        WhiteBalance: {
            0: "Auto white balance",
            1: "Manual white balance"
        },
        GainControl: {
            0: "None",
            1: "Low gain up",
            2: "High gain up",
            3: "Low gain down",
            4: "High gain down"
        },
        Contrast: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        Saturation: {
            0: "Normal",
            1: "Low saturation",
            2: "High saturation"
        },
        Sharpness: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        SubjectDistanceRange: {
            0: "Unknown",
            1: "Macro",
            2: "Close view",
            3: "Distant view"
        },
        FileSource: {
            3: "DSC"
        },
        Components: {
            0: "",
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }

    function getImageData(img, callback) {
        BinaryAjax(img.src, function(http) {
            var data = findEXIFinJPEG(http.binaryResponse);
            img.exifdata = data || {};
            if (callback) {
                callback.call(img)
            }
        });
    }

    function findEXIFinJPEG(file) {
        if (file.getByteAt(0) != 0xFF || file.getByteAt(1) != 0xD8) {
            return false; // not a valid jpeg
        }

        var offset = 2,
                length = file.getLength(),
                marker;

        while (offset < length) {
            if (file.getByteAt(offset) != 0xFF) {
                if (debug)
                    console.log("Not a valid marker at offset " + offset + ", found: " + file.getByteAt(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = file.getByteAt(offset + 1);

            // we could implement handling for other markers here, 
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 22400) {
                if (debug)
                    console.log("Found 0xFFE1 marker");

                return readEXIFData(file, offset + 4, file.getShortAt(offset + 2, true) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else if (marker == 225) {
                // 0xE1 = Application-specific 1 (for EXIF)
                if (debug)
                    console.log("Found 0xFFE1 marker");

                return readEXIFData(file, offset + 4, file.getShortAt(offset + 2, true) - 2);

            } else {
                offset += 2 + file.getShortAt(offset + 2, true);
            }

        }

    }


    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getShortAt(dirStart, bigEnd),
                tags = {},
                entryOffset, tag,
                i;

        for (i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getShortAt(entryOffset, bigEnd)];
            if (!tag && debug)
                console.log("Unknown tag: " + file.getShortAt(entryOffset, bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getShortAt(entryOffset + 2, bigEnd),
                numValues = file.getLongAt(entryOffset + 4, bigEnd),
                valueOffset = file.getLongAt(entryOffset + 8, bigEnd) + tiffStart,
                offset,
                vals, val, n,
                numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getByteAt(entryOffset + 8, bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getByteAt(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return file.getStringAt(offset, numValues - 1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getShortAt(entryOffset + 8, bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getShortAt(offset + 2 * n, bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getLongAt(entryOffset + 8, bigEnd);
                } else {
                    vals = [];
                    for (var n = 0; n < numValues; n++) {
                        vals[n] = file.getLongAt(valueOffset + 4 * n, bigEnd);
                    }
                    return vals;
                }

            case 5:	// rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getLongAt(valueOffset, bigEnd);
                    denominator = file.getLongAt(valueOffset + 4, bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        numerator = file.getLongAt(valueOffset + 8 * n, bigEnd);
                        denominator = file.getLongAt(valueOffset + 4 + 8 * n, bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getSLongAt(entryOffset + 8, bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getSLongAt(valueOffset + 4 * n, bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getSLongAt(valueOffset, bigEnd) / file.getSLongAt(valueOffset + 4, bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getSLongAt(valueOffset + 8 * n, bigEnd) / file.getSLongAt(valueOffset + 4 + 8 * n, bigEnd);
                    }
                    return vals;
                }
        }
    }


    function readEXIFData(file, start) {
        if (file.getStringAt(start, 4) != "Exif") {
            if (debug)
                console.log("Not valid EXIF data! " + file.getStringAt(start, 4));
            return false;
        }

        var bigEnd,
                tags, tag,
                exifData, gpsData,
                tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getShortAt(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getShortAt(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug)
                console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getShortAt(tiffOffset + 2, bigEnd) != 0x002A) {
            if (debug)
                console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        if (file.getLongAt(tiffOffset + 4, bigEnd) != 0x00000008) {
            if (debug)
                console.log("Not valid TIFF data! (First offset not 8)", file.getShortAt(tiffOffset + 4, bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + 8, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                                StringValues.Components[exifData[tag][0]]
                                + StringValues.Components[exifData[tag][1]]
                                + StringValues.Components[exifData[tag][2]]
                                + StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0]
                                + "." + gpsData[tag][1]
                                + "." + gpsData[tag][2]
                                + "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }


    function getData(img, callback) {
        if (!img.complete)
            return false;
        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    function getTag(img, tag) {
        if (!imageHasData(img))
            return;
        return img.exifdata[tag];
    }

    function getAllTags(img) {
        if (!imageHasData(img))
            return {};
        var a,
                data = img.exifdata,
                tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    function pretty(img) {
        if (!imageHasData(img))
            return "";
        var a,
                data = img.exifdata,
                strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    function readFromBinaryFile(file) {
        return findEXIFinJPEG(file);
    }


    return {
        readFromBinaryFile: readFromBinaryFile,
        pretty: pretty,
        getTag: getTag,
        getAllTags: getAllTags,
        getData: getData,
        Tags: ExifTags,
        TiffTags: TiffTags,
        GPSTags: GPSTags,
        StringValues: StringValues
    };

})();;
/*
 * 
 * canvasResize
 * 
 * Version: 1.2.0 
 * Date (d/m/y): 02/10/12
 * Update (d/m/y): 14/05/13
 * Original author: @gokercebeci 
 * Licensed under the MIT license
 * - This plugin working with binaryajax.js and exif.js 
 *   (It's under the MPL License http://www.nihilogic.dk/licenses/mpl-license.txt)
 * Demo: http://canvasResize.gokercebeci.com/
 * 
 * - I fixed iOS6 Safari's image file rendering issue for large size image (over mega-pixel)
 *   using few functions from https://github.com/stomita/ios-imagefile-megapixel
 *   (detectSubsampling, )
 *   And fixed orientation issue by using https://github.com/jseidelin/exif-js
 *   Thanks, Shinichi Tomita and Jacob Seidelin
 */

(function($) {
    var pluginName = 'canvasResize',
            methods = {
        newsize: function(w, h, W, H, C) {
            var c = C ? 'h' : '';
            if ((W && w > W) || (H && h > H)) {
                var r = w / h;
                if ((r >= 1 || H === 0) && W && !C) {
                    w = W;
                    h = (W / r) >> 0;
                } else if (C && r <= (W / H)) {
                    w = W;
                    h = (W / r) >> 0;
                    c = 'w';
                } else {
                    w = (H * r) >> 0;
                    h = H;
                }
            }
            return {
                'width': w,
                'height': h,
                'cropped': c
            };
        },
        dataURLtoBlob: function(data) {
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0];
            var byteString = atob(data.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder);
            if (bb) {
                //    console.log('BlobBuilder');        
                bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                bb.append(ab);
                return bb.getBlob(mimeString);
            } else {
                //    console.log('Blob');  
                bb = new Blob([ab], {
                    'type': (mimeString)
                });
                return bb;
            }
        },
        /**
         * Detect subsampling in loaded image.
         * In iOS, larger images than 2M pixels may be subsampled in rendering.
         */
        detectSubsampling: function(img) {
            var iw = img.width, ih = img.height;
            if (iw * ih > 1048576) { // subsampling may happen over megapixel image
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = 1;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, -iw + 1, 0);
                // subsampled image becomes half smaller in rendering size.
                // check alpha channel value to confirm image is covering edge pixel or not.
                // if alpha value is 0 image is not covering, hence subsampled.
                return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
            } else {
                return false;
            }
        },
        /**
         * Update the orientation according to the specified rotation angle
         */
        rotate: function(orientation, angle) {
            var o = {
                // nothing
                1: {90: 6, 180: 3, 270: 8},
                // horizontal flip
                2: {90: 7, 180: 4, 270: 5},
                // 180 rotate left
                3: {90: 8, 180: 1, 270: 6},
                // vertical flip
                4: {90: 5, 180: 2, 270: 7},
                // vertical flip + 90 rotate right
                5: {90: 2, 180: 7, 270: 4},
                // 90 rotate right
                6: {90: 3, 180: 8, 270: 1},
                // horizontal flip + 90 rotate right
                7: {90: 4, 180: 5, 270: 2},
                // 90 rotate left
                8: {90: 1, 180: 6, 270: 3}
            };
            return o[orientation][angle] ? o[orientation][angle] : orientation;
        },
        /**
         * Transform canvas coordination according to specified frame size and orientation
         * Orientation value is from EXIF tag
         */
        transformCoordinate: function(canvas, width, height, orientation) {
            switch (orientation) {
                case 5:
                case 6:
                case 7:
                case 8:
                    canvas.width = height;
                    canvas.height = width;
                    break;
                default:
                    canvas.width = width;
                    canvas.height = height;
            }
            var ctx = canvas.getContext('2d');
            switch (orientation) {
                case 1:
                    // nothing
                    break;
                case 2:
                    // horizontal flip
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    // 180 rotate left
                    ctx.translate(width, height);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    // vertical flip
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    // vertical flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    // 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -height);
                    break;
                case 7:
                    // horizontal flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(width, -height);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    // 90 rotate left
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-width, 0);
                    break;
                default:
                    break;
            }
        },
        /**
         * Detecting vertical squash in loaded image.
         * Fixes a bug which squash image vertically while drawing into canvas for some images.
         */
        detectVerticalSquash: function(img, iw, ih) {
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = ih;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, 1, ih).data;
            // search image edge pixel position in case it is squashed vertically.
            var sy = 0;
            var ey = ih;
            var py = ih;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = (ey + sy) >> 1;
            }
            var ratio = py / ih;
            return ratio === 0 ? 1 : ratio;
        },
        callback: function(d) {
            return d;
        },
        extend: function() {
            var target = arguments[0] || {}, a = 1, al = arguments.length, deep = false;
            if (target.constructor === Boolean) {
                deep = target;
                target = arguments[1] || {};
            }
            if (al === 1) {
                target = this;
                a = 0;
            }
            var prop;
            for (; a < al; a++)
                if ((prop = arguments[a]) !== null)
                    for (var i in prop) {
                        if (target === prop[i])
                            continue;
                        if (deep && typeof prop[i] === 'object' && target[i])
                            methods.extend(target[i], prop[i]);
                        else if (prop[i] !== undefined)
                            target[i] = prop[i];
                    }
            return target;
        }
    },
    defaults = {
        width: 300,
        height: 0,
        crop: false,
        quality: 80,
        rotate: 0,
        'callback': methods.callback
    };
    function Plugin(file, options) {
        this.file = file;
        // EXTEND
        this.options = methods.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            //this.options.init(this);
            var $this = this;
            var file = this.file;
            if(file instanceof File){
                var reader = new FileReader();
                reader.onloadend = function(e) {

                    var dataURL = e.target.result;
                    processing(dataURL);

                };
                reader.readAsDataURL(file);
            }else{
                //data uri
                processing(file.dataURL);
            }

            function processing(dataURL){
                var byteString = atob(dataURL.split(',')[1]);
                var binary = new BinaryFile(byteString, 0, byteString.length);
                var exif = EXIF.readFromBinaryFile(binary);

                var img = new Image();
                img.onload = function(e) {

                    var orientation = exif['Orientation'] || 1;
                    orientation = methods.rotate(orientation, $this.options.rotate);

                    // CW or CCW ? replace width and height
                    var size = (orientation >= 5 && orientation <= 8)
                            ? methods.newsize(img.height, img.width, $this.options.width, $this.options.height, $this.options.crop)
                            : methods.newsize(img.width, img.height, $this.options.width, $this.options.height, $this.options.crop);

                    var iw = img.width, ih = img.height;
                    var width = size.width, height = size.height;

                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    ctx.save();
                    methods.transformCoordinate(canvas, width, height, orientation);

                    // over image size
                    if (methods.detectSubsampling(img)) {
                        iw /= 2;
                        ih /= 2;
                    }
                    var d = 1024; // size of tiling canvas
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = tmpCanvas.height = d;
                    var tmpCtx = tmpCanvas.getContext('2d');
                    var vertSquashRatio = methods.detectVerticalSquash(img, iw, ih);
                    var sy = 0;
                    while (sy < ih) {
                        var sh = sy + d > ih ? ih - sy : d;
                        var sx = 0;
                        while (sx < iw) {
                            var sw = sx + d > iw ? iw - sx : d;
                            tmpCtx.clearRect(0, 0, d, d);
                            tmpCtx.drawImage(img, -sx, -sy);
                            var dx = Math.floor(sx * width / iw);
                            var dw = Math.ceil(sw * width / iw);
                            var dy = Math.floor(sy * height / ih / vertSquashRatio);
                            var dh = Math.ceil(sh * height / ih / vertSquashRatio);
                            ctx.drawImage(tmpCanvas, 0, 0, sw, sh, dx, dy, dw, dh);
                            sx += d;
                        }
                        sy += d;
                    }
                    ctx.restore();
                    tmpCanvas = tmpCtx = null;

                    // if rotated width and height data replacing issue 
                    var newcanvas = document.createElement('canvas');
                    newcanvas.width = size.cropped === 'h' ? height : width;
                    newcanvas.height = size.cropped === 'w' ? width : height;
                    var x = size.cropped === 'h' ? (height - width) * .5 : 0;
                    var y = size.cropped === 'w' ? (width - height) * .5 : 0;
                    newctx = newcanvas.getContext('2d');
                    newctx.drawImage(canvas, x, y, width, height);

                    // console.log(file, file.type);
                    var fileType = file.type || $this.options.fileType;
                    if (file.type === "image/png") {
                        var data = newcanvas.toDataURL(file.type);
                    } else {
                        var data = newcanvas.toDataURL("image/jpeg", ($this.options.quality * .01));
                    }

                    // CALLBACK
                    $this.options.callback(data, newcanvas.width, newcanvas.height);

                    // });
                };
                img.src = dataURL;

            }
            //reader.readAsBinaryString(file);

        }
    };
    $[pluginName] = function(file, options) {
        if (typeof file === 'string')
            return methods[file](options);
        else
            new Plugin(file, options);
    };

})(window);;


;define('upload/upload.js', function(require, exports, module){

var ImgCliper = require('upload/imgcliper.js');
/**
* 
* 图片上传+裁剪功能类
* fis语法依赖 _canvasresize/main.js
* @require upload/_canvasresize/main.js
*
**/

var ImgUpload = module.exports = function(el, opt) {
    var iframeID = 'iframepost' + Math.floor(Math.random() * 1000);
    var filekey = opt.filekey || 'file';
    this.opt = $.extend({
        outputWidth: 500,
        outputHeight: 500,
        data: {}
    }, opt);
    this.$el = el;
    this.fileInput = document.createElement("INPUT");
    this.form = document.createElement("FORM");
    this.iframe = document.createElement("IFRAME");


    this.fileInput.name = filekey;
    this.fileInput.type = 'file';
    this.fileInput.setAttribute('accept',"image/*");
    this.fileInput.style.cssText = "position: absolute;left:0;top:0;height:100%;width:100%; opacity: 0";

    this.form.target = iframeID;
    this.form.method = 'POST';
    this.form.encoding = "multipart/form-data";
    this.form.action = opt.url;

    if (typeof FileReader === 'undefined') {
        alert('非常抱歉，您的手机不支持文件上传，请更换手机注册，谢谢');
        this.iframe.style.display = 'none';
        this.iframe.name = iframeID;
        document.body.appendChild(this.iframe);

    }
    this.form.appendChild(this.fileInput);
    el.appendChild(this.form);
    this.register();
}

ImgUpload.prototype = {
    //事件注册
    register: function() {
        var me = this;
        this.fileInput.addEventListener('change', function(e) {
            me.onFileChange(e);
        }, false);
        this.iframe && this.iframe.addEventListener('load', function() {
            me.onsuccess(this.contentWindow.document.body.innerHTML);
        }, false);
    },
    //文件选择事件
    onFileChange: function(e) {
        var me = this;
        var file = e.target.files[0];
        if (file === undefined) {
            return;
        }
        var ext = e.target.value.match(/\.(png|jpg|jpeg|gif)$/i)[1];
        this.fileInfo = {
                ext: ext,
                type: file.type,
                name: file.name,
                size: file.size
            }
        //在iOS下，来自拍摄的图片，是宽高反向的，canvasResize有做处理。
        //这一步android消耗2000ms左右、iOS消耗500ms左右
        me.showLoading()
        var max = Math.max( Math.max(me.opt.outputWidth, me.opt.outputHeight), 1000 );
        canvasResize(file, {
            width: max,
            height: max,
            crop: false,
            quality: 80,
            rotate: 0,
            callback: function(dataURL, width, height) {
                me.closeLoading();
                me.clip(dataURL, width, height);
            }
        });

        return;


        // CANVAS RESIZING
        /*
        var reader = new FileReader();
        reader.onloadend = function(e) {
            var dataURL = e.target.result;
            var img = document.createElement('IMG')
            img.onload = function() {
                img.style.opacity = '0';
                img.style.position = 'absolute';
                document.body.appendChild(img);                
                me.clip(dataURL, img.offsetWidth, img.offsetHeight);
                img.parentNode.removeChild(img);
                img.onload = function() {};
                img = undefined;
                dataURL = undefined;
            }
            img.src = dataURL;
        };
        reader.readAsDataURL(file);
        */
    },
    //开始裁剪
    clip: function(data, originWidth, originHeight) {
        var me = this;
        var opt = {
            clipWidth: me.opt.outputWidth,
            clipHeight: me.opt.outputHeight,
            // clipZoneWidth: me.opt.clipZoneWidth,
            // clipZoneHeight: me.opt.clipZoneHeight,
            originHeight: originHeight,
            originWidth: originWidth,
            fileType: me.fileInfo.type,
            rawData: data,
            onSave: function(data) {
                me.showLoading();
                me.compress({
                    dataURL: data
                }, function(minData) {
                    me.upload(minData);
                });
                me.fileInput.value = '';
            },
            onCancel: function(){
                me.fileInput.value = '';
                me.opt.onCancelUpload
                && me.opt.onCancelUpload();
            }
        };
        if (this.imgCliper) {
            this.imgCliper.destroy();
        }

        this.imgCliper = new ImgCliper(opt);

    },
    //压缩图片
    compress: function(data, cb) {
        var me = this;
        canvasResize(data, {
            fileType: me.fileInfo.type,
            width: me.opt.outputWidth,
            height: me.opt.outputHeight,
            crop: false,
            quality: 80,
            rotate: 0,
            callback: function(data, width, height) {
                cb(data);
            }
        });
    },
    //上传图片
    upload: function(data) {
        var me = this;
        var fd = new FormData();




        // Add file data
        // var f = canvasResize('dataURLtoBlob', data);
        //第三个参数是filename
        // fd.append(me.opt.filekey, f, me.fileInfo.name);

         fd.append('file', data);
         fd.append('type', me.fileInfo.type);
         fd.append('size', me.fileInfo.size);
         fd.append('filename', me.fileInfo.name);
         fd.append('ext', me.fileInfo.ext);
        $.each(me.opt.data, function(key, val){
            fd.append(key,val);
        });
        fd.append('filename', me.fileInfo.name + ~~(Math.random() * 1E6));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', me.opt.url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("pragma", "no-cache");
        //Upload progress
        xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
            }
            var loaded = Math.ceil((e.loaded / e.total) * 100);
            // console.log(loaded);
        }, false);
        // File uploaded
         xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                clearTimeout(timer);
                xhr.status === 200 
                ? me.onUploadSuccess(xhr.responseText) 
                : me.uploadFailed(xhr.responseText);
            } 
        };
        var timer = setTimeout(function(){
            xhr.abort();
            me.uploadFailed('timeout');
        }, me.opt.timeout || 20000);
        // Send data
        xhr.send(fd);
    },
    //上传成功
    onUploadSuccess: function(response) {
        this.imgCliper.close();
        this.closeLoading();
        this.opt.onSuccessUpload && this.opt.onSuccessUpload(response);
    },
    uploadFailed: function(){
        this.opt.onFailedUpload && this.opt.onFailedUpload();
    },
    showLoading: function(){
        window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 3000);
    },
    closeLoading: function(){
        window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 0);
    }
};


});
;
/*
 * Binary Ajax 0.1.10
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */

var BinaryFile = function(strData, iDataOffset, iDataLength) {
    var data = strData;
    var dataOffset = iDataOffset || 0;
    var dataLength = 0;

    this.getRawData = function() {
        return data;
    }

    if (typeof strData == "string") {
        dataLength = iDataLength || data.length;

        this.getByteAt = function(iOffset) {
            return data.charCodeAt(iOffset + dataOffset) & 0xFF;
        }

        this.getBytesAt = function(iOffset, iLength) {
            var aBytes = [];

            for (var i = 0; i < iLength; i++) {
                aBytes[i] = data.charCodeAt((iOffset + i) + dataOffset) & 0xFF
            }
            ;

            return aBytes;
        }
    } else if (typeof strData == "unknown") {
        dataLength = iDataLength || IEBinary_getLength(data);

        this.getByteAt = function(iOffset) {
            return IEBinary_getByteAt(data, iOffset + dataOffset);
        }

        this.getBytesAt = function(iOffset, iLength) {
            return new VBArray(IEBinary_getBytesAt(data, iOffset + dataOffset, iLength)).toArray();
        }
    }

    this.getLength = function() {
        return dataLength;
    }

    this.getSByteAt = function(iOffset) {
        var iByte = this.getByteAt(iOffset);
        if (iByte > 127)
            return iByte - 256;
        else
            return iByte;
    }

    this.getShortAt = function(iOffset, bBigEndian) {
        var iShort = bBigEndian ?
                (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
                : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset)
        if (iShort < 0)
            iShort += 65536;
        return iShort;
    }
    this.getSShortAt = function(iOffset, bBigEndian) {
        var iUShort = this.getShortAt(iOffset, bBigEndian);
        if (iUShort > 32767)
            return iUShort - 65536;
        else
            return iUShort;
    }
    this.getLongAt = function(iOffset, bBigEndian) {
        var iByte1 = this.getByteAt(iOffset),
                iByte2 = this.getByteAt(iOffset + 1),
                iByte3 = this.getByteAt(iOffset + 2),
                iByte4 = this.getByteAt(iOffset + 3);

        var iLong = bBigEndian ?
                (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
                : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
        if (iLong < 0)
            iLong += 4294967296;
        return iLong;
    }
    this.getSLongAt = function(iOffset, bBigEndian) {
        var iULong = this.getLongAt(iOffset, bBigEndian);
        if (iULong > 2147483647)
            return iULong - 4294967296;
        else
            return iULong;
    }

    this.getStringAt = function(iOffset, iLength) {
        var aStr = [];

        var aBytes = this.getBytesAt(iOffset, iLength);
        for (var j = 0; j < iLength; j++) {
            aStr[j] = String.fromCharCode(aBytes[j]);
        }
        return aStr.join("");
    }

    this.getCharAt = function(iOffset) {
        return String.fromCharCode(this.getByteAt(iOffset));
    }
    this.toBase64 = function() {
        return window.btoa(data);
    }
    this.fromBase64 = function(strBase64) {
        data = window.atob(strBase64);
    }
}


var BinaryAjax = (function() {

    function createRequest() {
        var oHTTP = null;
        if (window.ActiveXObject) {
            oHTTP = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            oHTTP = new XMLHttpRequest();
        }
        return oHTTP;
    }

    function getHead(strURL, fncCallback, fncError) {
        var oHTTP = createRequest();
        if (oHTTP) {
            if (fncCallback) {
                if (typeof(oHTTP.onload) != "undefined") {
                    oHTTP.onload = function() {
                        if (oHTTP.status == "200") {
                            fncCallback(this);
                        } else {
                            if (fncError)
                                fncError();
                        }
                        oHTTP = null;
                    };
                } else {
                    oHTTP.onreadystatechange = function() {
                        if (oHTTP.readyState == 4) {
                            if (oHTTP.status == "200") {
                                fncCallback(this);
                            } else {
                                if (fncError)
                                    fncError();
                            }
                            oHTTP = null;
                        }
                    };
                }
            }
            oHTTP.open("HEAD", strURL, true);
            oHTTP.send(null);
        } else {
            if (fncError)
                fncError();
        }
    }

    function sendRequest(strURL, fncCallback, fncError, aRange, bAcceptRanges, iFileSize) {
        var oHTTP = createRequest();
        if (oHTTP) {

            var iDataOffset = 0;
            if (aRange && !bAcceptRanges) {
                iDataOffset = aRange[0];
            }
            var iDataLen = 0;
            if (aRange) {
                iDataLen = aRange[1] - aRange[0] + 1;
            }

            if (fncCallback) {
                if (typeof(oHTTP.onload) != "undefined") {
                    oHTTP.onload = function() {
                        if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                            oHTTP.binaryResponse = new BinaryFile(oHTTP.responseText, iDataOffset, iDataLen);
                            oHTTP.fileSize = iFileSize || oHTTP.getResponseHeader("Content-Length");
                            fncCallback(oHTTP);
                        } else {
                            if (fncError)
                                fncError();
                        }
                        oHTTP = null;
                    };
                } else {
                    oHTTP.onreadystatechange = function() {
                        if (oHTTP.readyState == 4) {
                            if (oHTTP.status == "200" || oHTTP.status == "206" || oHTTP.status == "0") {
                                // IE6 craps if we try to extend the XHR object
                                var oRes = {
                                    status: oHTTP.status,
                                    // IE needs responseBody, Chrome/Safari needs responseText
                                    binaryResponse: new BinaryFile(
                                            typeof oHTTP.responseBody == "unknown" ? oHTTP.responseBody : oHTTP.responseText, iDataOffset, iDataLen
                                            ),
                                    fileSize: iFileSize || oHTTP.getResponseHeader("Content-Length")
                                };
                                fncCallback(oRes);
                            } else {
                                if (fncError)
                                    fncError();
                            }
                            oHTTP = null;
                        }
                    };
                }
            }
            oHTTP.open("GET", strURL, true);

            if (oHTTP.overrideMimeType)
                oHTTP.overrideMimeType('text/plain; charset=x-user-defined');

            if (aRange && bAcceptRanges) {
                oHTTP.setRequestHeader("Range", "bytes=" + aRange[0] + "-" + aRange[1]);
            }

            oHTTP.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");

            oHTTP.send(null);
        } else {
            if (fncError)
                fncError();
        }
    }

    return function(strURL, fncCallback, fncError, aRange) {

        if (aRange) {
            getHead(
                    strURL,
                    function(oHTTP) {
                        var iLength = parseInt(oHTTP.getResponseHeader("Content-Length"), 10);
                        var strAcceptRanges = oHTTP.getResponseHeader("Accept-Ranges");

                        var iStart, iEnd;
                        iStart = aRange[0];
                        if (aRange[0] < 0)
                            iStart += iLength;
                        iEnd = iStart + aRange[1] - 1;

                        sendRequest(strURL, fncCallback, fncError, [iStart, iEnd], (strAcceptRanges == "bytes"), iLength);
                    }
            );

        } else {
            sendRequest(strURL, fncCallback, fncError);
        }
    }

}());

/*
 document.write(
 "<script type='text/vbscript'>\r\n"
 + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
 + "	IEBinary_getByteAt = AscB(MidB(strBinary,iOffset+1,1))\r\n"
 + "End Function\r\n"
 + "Function IEBinary_getLength(strBinary)\r\n"
 + "	IEBinary_getLength = LenB(strBinary)\r\n"
 + "End Function\r\n"
 + "</script>\r\n"
 );
 */

document.write(
        "<script type='text/vbscript'>\r\n"
        + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
        + "	IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\n"
        + "End Function\r\n"
        + "Function IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n"
        + "  Dim aBytes()\r\n"
        + "  ReDim aBytes(iLength - 1)\r\n"
        + "  For i = 0 To iLength - 1\r\n"
        + "   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n"
        + "  Next\r\n"
        + "  IEBinary_getBytesAt = aBytes\r\n"
        + "End Function\r\n"
        + "Function IEBinary_getLength(strBinary)\r\n"
        + "	IEBinary_getLength = LenB(strBinary)\r\n"
        + "End Function\r\n"
        + "</script>\r\n"
        );
;/*
 * 
 * canvasResize
 * 
 * Version: 1.2.0 
 * Date (d/m/y): 02/10/12
 * Update (d/m/y): 14/05/13
 * Original author: @gokercebeci 
 * Licensed under the MIT license
 * - This plugin working with binaryajax.js and exif.js 
 *   (It's under the MPL License http://www.nihilogic.dk/licenses/mpl-license.txt)
 * Demo: http://canvasResize.gokercebeci.com/
 * 
 * - I fixed iOS6 Safari's image file rendering issue for large size image (over mega-pixel)
 *   using few functions from https://github.com/stomita/ios-imagefile-megapixel
 *   (detectSubsampling, )
 *   And fixed orientation issue by using https://github.com/jseidelin/exif-js
 *   Thanks, Shinichi Tomita and Jacob Seidelin
 */

(function($) {
    var pluginName = 'canvasResize',
            methods = {
        newsize: function(w, h, W, H, C) {
            var c = C ? 'h' : '';
            if ((W && w > W) || (H && h > H)) {
                var r = w / h;
                if ((r >= 1 || H === 0) && W && !C) {
                    w = W;
                    h = (W / r) >> 0;
                } else if (C && r <= (W / H)) {
                    w = W;
                    h = (W / r) >> 0;
                    c = 'w';
                } else {
                    w = (H * r) >> 0;
                    h = H;
                }
            }
            return {
                'width': w,
                'height': h,
                'cropped': c
            };
        },
        dataURLtoBlob: function(data) {
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0];
            var byteString = atob(data.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder);
            if (bb) {
                //    console.log('BlobBuilder');        
                bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                bb.append(ab);
                return bb.getBlob(mimeString);
            } else {
                //    console.log('Blob');  
                bb = new Blob([ab], {
                    'type': (mimeString)
                });
                return bb;
            }
        },
        /**
         * Detect subsampling in loaded image.
         * In iOS, larger images than 2M pixels may be subsampled in rendering.
         */
        detectSubsampling: function(img) {
            var iw = img.width, ih = img.height;
            if (iw * ih > 1048576) { // subsampling may happen over megapixel image
                var canvas = document.createElement('canvas');
                canvas.width = canvas.height = 1;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, -iw + 1, 0);
                // subsampled image becomes half smaller in rendering size.
                // check alpha channel value to confirm image is covering edge pixel or not.
                // if alpha value is 0 image is not covering, hence subsampled.
                return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
            } else {
                return false;
            }
        },
        /**
         * Update the orientation according to the specified rotation angle
         */
        rotate: function(orientation, angle) {
            var o = {
                // nothing
                1: {90: 6, 180: 3, 270: 8},
                // horizontal flip
                2: {90: 7, 180: 4, 270: 5},
                // 180 rotate left
                3: {90: 8, 180: 1, 270: 6},
                // vertical flip
                4: {90: 5, 180: 2, 270: 7},
                // vertical flip + 90 rotate right
                5: {90: 2, 180: 7, 270: 4},
                // 90 rotate right
                6: {90: 3, 180: 8, 270: 1},
                // horizontal flip + 90 rotate right
                7: {90: 4, 180: 5, 270: 2},
                // 90 rotate left
                8: {90: 1, 180: 6, 270: 3}
            };
            return o[orientation][angle] ? o[orientation][angle] : orientation;
        },
        /**
         * Transform canvas coordination according to specified frame size and orientation
         * Orientation value is from EXIF tag
         */
        transformCoordinate: function(canvas, width, height, orientation) {
            switch (orientation) {
                case 5:
                case 6:
                case 7:
                case 8:
                    canvas.width = height;
                    canvas.height = width;
                    break;
                default:
                    canvas.width = width;
                    canvas.height = height;
            }
            var ctx = canvas.getContext('2d');
            switch (orientation) {
                case 1:
                    // nothing
                    break;
                case 2:
                    // horizontal flip
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    // 180 rotate left
                    ctx.translate(width, height);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    // vertical flip
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    // vertical flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    // 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -height);
                    break;
                case 7:
                    // horizontal flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(width, -height);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    // 90 rotate left
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-width, 0);
                    break;
                default:
                    break;
            }
        },
        /**
         * Detecting vertical squash in loaded image.
         * Fixes a bug which squash image vertically while drawing into canvas for some images.
         */
        detectVerticalSquash: function(img, iw, ih) {
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = ih;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, 1, ih).data;
            // search image edge pixel position in case it is squashed vertically.
            var sy = 0;
            var ey = ih;
            var py = ih;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = (ey + sy) >> 1;
            }
            var ratio = py / ih;
            return ratio === 0 ? 1 : ratio;
        },
        callback: function(d) {
            return d;
        },
        extend: function() {
            var target = arguments[0] || {}, a = 1, al = arguments.length, deep = false;
            if (target.constructor === Boolean) {
                deep = target;
                target = arguments[1] || {};
            }
            if (al === 1) {
                target = this;
                a = 0;
            }
            var prop;
            for (; a < al; a++)
                if ((prop = arguments[a]) !== null)
                    for (var i in prop) {
                        if (target === prop[i])
                            continue;
                        if (deep && typeof prop[i] === 'object' && target[i])
                            methods.extend(target[i], prop[i]);
                        else if (prop[i] !== undefined)
                            target[i] = prop[i];
                    }
            return target;
        }
    },
    defaults = {
        width: 300,
        height: 0,
        crop: false,
        quality: 80,
        rotate: 0,
        'callback': methods.callback
    };
    function Plugin(file, options) {
        this.file = file;
        // EXTEND
        this.options = methods.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            //this.options.init(this);
            var $this = this;
            var file = this.file;
            if(file instanceof File){
                var reader = new FileReader();
                reader.onloadend = function(e) {

                    var dataURL = e.target.result;
                    processing(dataURL);

                };
                reader.readAsDataURL(file);
            }else{
                //data uri
                processing(file.dataURL);
            }

            function processing(dataURL){
                var byteString = atob(dataURL.split(',')[1]);
                var binary = new BinaryFile(byteString, 0, byteString.length);
                var exif = EXIF.readFromBinaryFile(binary);

                var img = new Image();
                img.onload = function(e) {

                    var orientation = exif['Orientation'] || 1;
                    orientation = methods.rotate(orientation, $this.options.rotate);

                    // CW or CCW ? replace width and height
                    var size = (orientation >= 5 && orientation <= 8)
                            ? methods.newsize(img.height, img.width, $this.options.width, $this.options.height, $this.options.crop)
                            : methods.newsize(img.width, img.height, $this.options.width, $this.options.height, $this.options.crop);

                    var iw = img.width, ih = img.height;
                    var width = size.width, height = size.height;

                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    ctx.save();
                    methods.transformCoordinate(canvas, width, height, orientation);

                    // over image size
                    if (methods.detectSubsampling(img)) {
                        iw /= 2;
                        ih /= 2;
                    }
                    var d = 1024; // size of tiling canvas
                    var tmpCanvas = document.createElement('canvas');
                    tmpCanvas.width = tmpCanvas.height = d;
                    var tmpCtx = tmpCanvas.getContext('2d');
                    var vertSquashRatio = methods.detectVerticalSquash(img, iw, ih);
                    var sy = 0;
                    while (sy < ih) {
                        var sh = sy + d > ih ? ih - sy : d;
                        var sx = 0;
                        while (sx < iw) {
                            var sw = sx + d > iw ? iw - sx : d;
                            tmpCtx.clearRect(0, 0, d, d);
                            tmpCtx.drawImage(img, -sx, -sy);
                            var dx = Math.floor(sx * width / iw);
                            var dw = Math.ceil(sw * width / iw);
                            var dy = Math.floor(sy * height / ih / vertSquashRatio);
                            var dh = Math.ceil(sh * height / ih / vertSquashRatio);
                            ctx.drawImage(tmpCanvas, 0, 0, sw, sh, dx, dy, dw, dh);
                            sx += d;
                        }
                        sy += d;
                    }
                    ctx.restore();
                    tmpCanvas = tmpCtx = null;

                    // if rotated width and height data replacing issue 
                    var newcanvas = document.createElement('canvas');
                    newcanvas.width = size.cropped === 'h' ? height : width;
                    newcanvas.height = size.cropped === 'w' ? width : height;
                    var x = size.cropped === 'h' ? (height - width) * .5 : 0;
                    var y = size.cropped === 'w' ? (width - height) * .5 : 0;
                    newctx = newcanvas.getContext('2d');
                    newctx.drawImage(canvas, x, y, width, height);

                    // console.log(file, file.type);
                    var fileType = file.type || $this.options.fileType;
                    if (file.type === "image/png") {
                        var data = newcanvas.toDataURL(file.type);
                    } else {
                        var data = newcanvas.toDataURL("image/jpeg", ($this.options.quality * .01));
                    }

                    // CALLBACK
                    $this.options.callback(data, newcanvas.width, newcanvas.height);

                    // });
                };
                img.src = dataURL;

            }
            //reader.readAsBinaryString(file);

        }
    };
    $[pluginName] = function(file, options) {
        if (typeof file === 'string')
            return methods[file](options);
        else
            new Plugin(file, options);
    };

})(window);
;/*
 * Javascript EXIF Reader 0.1.6
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * Licensed under the MPL License [http://www.nihilogic.dk/licenses/mpl-license.txt]
 */


var EXIF = (function() {

    var debug = false;

    var ExifTags = {

        // version tags
        0x9000: "ExifVersion", // EXIF version
        0xA000: "FlashpixVersion", // Flashpix format version

        // colorspace tags
        0xA001: "ColorSpace", // Color space information tag

        // image configuration
        0xA002: "PixelXDimension", // Valid width of meaningful image
        0xA003: "PixelYDimension", // Valid height of meaningful image
        0x9101: "ComponentsConfiguration", // Information about channels
        0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

        // user information
        0x927C: "MakerNote", // Any desired information written by the manufacturer
        0x9286: "UserComment", // Comments by user

        // related file
        0xA004: "RelatedSoundFile", // Name of related sound file

        // date and time
        0x9003: "DateTimeOriginal", // Date and time when the original image was generated
        0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
        0x9290: "SubsecTime", // Fractions of seconds for DateTime
        0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
        0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A: "ExposureTime", // Exposure time (in seconds)
        0x829D: "FNumber", // F number
        0x8822: "ExposureProgram", // Exposure program
        0x8824: "SpectralSensitivity", // Spectral sensitivity
        0x8827: "ISOSpeedRatings", // ISO speed rating
        0x8828: "OECF", // Optoelectric conversion factor
        0x9201: "ShutterSpeedValue", // Shutter speed
        0x9202: "ApertureValue", // Lens aperture
        0x9203: "BrightnessValue", // Value of brightness
        0x9204: "ExposureBias", // Exposure bias
        0x9205: "MaxApertureValue", // Smallest F number of lens
        0x9206: "SubjectDistance", // Distance to subject in meters
        0x9207: "MeteringMode", // Metering mode
        0x9208: "LightSource", // Kind of light source
        0x9209: "Flash", // Flash status
        0x9214: "SubjectArea", // Location and area of main subject
        0x920A: "FocalLength", // Focal length of the lens in mm
        0xA20B: "FlashEnergy", // Strobe energy in BCPS
        0xA20C: "SpatialFrequencyResponse", // 
        0xA20E: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214: "SubjectLocation", // Location of subject in image
        0xA215: "ExposureIndex", // Exposure index selected on camera
        0xA217: "SensingMethod", // Image sensor type
        0xA300: "FileSource", // Image source (3 == DSC)
        0xA301: "SceneType", // Scene type (1 == directly photographed)
        0xA302: "CFAPattern", // Color filter array geometric pattern
        0xA401: "CustomRendered", // Special processing
        0xA402: "ExposureMode", // Exposure mode
        0xA403: "WhiteBalance", // 1 = auto white balance, 2 = manual
        0xA404: "DigitalZoomRation", // Digital zoom ratio
        0xA405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406: "SceneCaptureType", // Type of scene
        0xA407: "GainControl", // Degree of overall image gain adjustment
        0xA408: "Contrast", // Direction of contrast processing applied by camera
        0xA409: "Saturation", // Direction of saturation processing applied by camera
        0xA40A: "Sharpness", // Direction of sharpness processing applied by camera
        0xA40B: "DeviceSettingDescription", // 
        0xA40C: "SubjectDistanceRange", // Distance to subject

        // other tags
        0xA005: "InteroperabilityIFDPointer",
        0xA420: "ImageUniqueID"		// Identifier assigned uniquely to each image
    };

    var TiffTags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x8769: "ExifIFDPointer",
        0x8825: "GPSInfoIFDPointer",
        0xA005: "InteroperabilityIFDPointer",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x011C: "PlanarConfiguration",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x0128: "ResolutionUnit",
        0x0111: "StripOffsets",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x0201: "JPEGInterchangeFormat",
        0x0202: "JPEGInterchangeFormatLength",
        0x012D: "TransferFunction",
        0x013E: "WhitePoint",
        0x013F: "PrimaryChromaticities",
        0x0211: "YCbCrCoefficients",
        0x0214: "ReferenceBlackWhite",
        0x0132: "DateTime",
        0x010E: "ImageDescription",
        0x010F: "Make",
        0x0110: "Model",
        0x0131: "Software",
        0x013B: "Artist",
        0x8298: "Copyright"
    };

    var GPSTags = {
        0x0000: "GPSVersionID",
        0x0001: "GPSLatitudeRef",
        0x0002: "GPSLatitude",
        0x0003: "GPSLongitudeRef",
        0x0004: "GPSLongitude",
        0x0005: "GPSAltitudeRef",
        0x0006: "GPSAltitude",
        0x0007: "GPSTimeStamp",
        0x0008: "GPSSatellites",
        0x0009: "GPSStatus",
        0x000A: "GPSMeasureMode",
        0x000B: "GPSDOP",
        0x000C: "GPSSpeedRef",
        0x000D: "GPSSpeed",
        0x000E: "GPSTrackRef",
        0x000F: "GPSTrack",
        0x0010: "GPSImgDirectionRef",
        0x0011: "GPSImgDirection",
        0x0012: "GPSMapDatum",
        0x0013: "GPSDestLatitudeRef",
        0x0014: "GPSDestLatitude",
        0x0015: "GPSDestLongitudeRef",
        0x0016: "GPSDestLongitude",
        0x0017: "GPSDestBearingRef",
        0x0018: "GPSDestBearing",
        0x0019: "GPSDestDistanceRef",
        0x001A: "GPSDestDistance",
        0x001B: "GPSProcessingMethod",
        0x001C: "GPSAreaInformation",
        0x001D: "GPSDateStamp",
        0x001E: "GPSDifferential"
    };

    var StringValues = {
        ExposureProgram: {
            0: "Not defined",
            1: "Manual",
            2: "Normal program",
            3: "Aperture priority",
            4: "Shutter priority",
            5: "Creative program",
            6: "Action program",
            7: "Portrait mode",
            8: "Landscape mode"
        },
        MeteringMode: {
            0: "Unknown",
            1: "Average",
            2: "CenterWeightedAverage",
            3: "Spot",
            4: "MultiSpot",
            5: "Pattern",
            6: "Partial",
            255: "Other"
        },
        LightSource: {
            0: "Unknown",
            1: "Daylight",
            2: "Fluorescent",
            3: "Tungsten (incandescent light)",
            4: "Flash",
            9: "Fine weather",
            10: "Cloudy weather",
            11: "Shade",
            12: "Daylight fluorescent (D 5700 - 7100K)",
            13: "Day white fluorescent (N 4600 - 5400K)",
            14: "Cool white fluorescent (W 3900 - 4500K)",
            15: "White fluorescent (WW 3200 - 3700K)",
            17: "Standard light A",
            18: "Standard light B",
            19: "Standard light C",
            20: "D55",
            21: "D65",
            22: "D75",
            23: "D50",
            24: "ISO studio tungsten",
            255: "Other"
        },
        Flash: {
            0x0000: "Flash did not fire",
            0x0001: "Flash fired",
            0x0005: "Strobe return light not detected",
            0x0007: "Strobe return light detected",
            0x0009: "Flash fired, compulsory flash mode",
            0x000D: "Flash fired, compulsory flash mode, return light not detected",
            0x000F: "Flash fired, compulsory flash mode, return light detected",
            0x0010: "Flash did not fire, compulsory flash mode",
            0x0018: "Flash did not fire, auto mode",
            0x0019: "Flash fired, auto mode",
            0x001D: "Flash fired, auto mode, return light not detected",
            0x001F: "Flash fired, auto mode, return light detected",
            0x0020: "No flash function",
            0x0041: "Flash fired, red-eye reduction mode",
            0x0045: "Flash fired, red-eye reduction mode, return light not detected",
            0x0047: "Flash fired, red-eye reduction mode, return light detected",
            0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059: "Flash fired, auto mode, red-eye reduction mode",
            0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
            1: "Not defined",
            2: "One-chip color area sensor",
            3: "Two-chip color area sensor",
            4: "Three-chip color area sensor",
            5: "Color sequential area sensor",
            7: "Trilinear sensor",
            8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
            0: "Standard",
            1: "Landscape",
            2: "Portrait",
            3: "Night scene"
        },
        SceneType: {
            1: "Directly photographed"
        },
        CustomRendered: {
            0: "Normal process",
            1: "Custom process"
        },
        WhiteBalance: {
            0: "Auto white balance",
            1: "Manual white balance"
        },
        GainControl: {
            0: "None",
            1: "Low gain up",
            2: "High gain up",
            3: "Low gain down",
            4: "High gain down"
        },
        Contrast: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        Saturation: {
            0: "Normal",
            1: "Low saturation",
            2: "High saturation"
        },
        Sharpness: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        SubjectDistanceRange: {
            0: "Unknown",
            1: "Macro",
            2: "Close view",
            3: "Distant view"
        },
        FileSource: {
            3: "DSC"
        },
        Components: {
            0: "",
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }

    function getImageData(img, callback) {
        BinaryAjax(img.src, function(http) {
            var data = findEXIFinJPEG(http.binaryResponse);
            img.exifdata = data || {};
            if (callback) {
                callback.call(img)
            }
        });
    }

    function findEXIFinJPEG(file) {
        if (file.getByteAt(0) != 0xFF || file.getByteAt(1) != 0xD8) {
            return false; // not a valid jpeg
        }

        var offset = 2,
                length = file.getLength(),
                marker;

        while (offset < length) {
            if (file.getByteAt(offset) != 0xFF) {
                if (debug)
                    console.log("Not a valid marker at offset " + offset + ", found: " + file.getByteAt(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = file.getByteAt(offset + 1);

            // we could implement handling for other markers here, 
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 22400) {
                if (debug)
                    console.log("Found 0xFFE1 marker");

                return readEXIFData(file, offset + 4, file.getShortAt(offset + 2, true) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else if (marker == 225) {
                // 0xE1 = Application-specific 1 (for EXIF)
                if (debug)
                    console.log("Found 0xFFE1 marker");

                return readEXIFData(file, offset + 4, file.getShortAt(offset + 2, true) - 2);

            } else {
                offset += 2 + file.getShortAt(offset + 2, true);
            }

        }

    }


    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getShortAt(dirStart, bigEnd),
                tags = {},
                entryOffset, tag,
                i;

        for (i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getShortAt(entryOffset, bigEnd)];
            if (!tag && debug)
                console.log("Unknown tag: " + file.getShortAt(entryOffset, bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getShortAt(entryOffset + 2, bigEnd),
                numValues = file.getLongAt(entryOffset + 4, bigEnd),
                valueOffset = file.getLongAt(entryOffset + 8, bigEnd) + tiffStart,
                offset,
                vals, val, n,
                numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getByteAt(entryOffset + 8, bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getByteAt(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return file.getStringAt(offset, numValues - 1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getShortAt(entryOffset + 8, bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getShortAt(offset + 2 * n, bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getLongAt(entryOffset + 8, bigEnd);
                } else {
                    vals = [];
                    for (var n = 0; n < numValues; n++) {
                        vals[n] = file.getLongAt(valueOffset + 4 * n, bigEnd);
                    }
                    return vals;
                }

            case 5:	// rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getLongAt(valueOffset, bigEnd);
                    denominator = file.getLongAt(valueOffset + 4, bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        numerator = file.getLongAt(valueOffset + 8 * n, bigEnd);
                        denominator = file.getLongAt(valueOffset + 4 + 8 * n, bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getSLongAt(entryOffset + 8, bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getSLongAt(valueOffset + 4 * n, bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getSLongAt(valueOffset, bigEnd) / file.getSLongAt(valueOffset + 4, bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getSLongAt(valueOffset + 8 * n, bigEnd) / file.getSLongAt(valueOffset + 4 + 8 * n, bigEnd);
                    }
                    return vals;
                }
        }
    }


    function readEXIFData(file, start) {
        if (file.getStringAt(start, 4) != "Exif") {
            if (debug)
                console.log("Not valid EXIF data! " + file.getStringAt(start, 4));
            return false;
        }

        var bigEnd,
                tags, tag,
                exifData, gpsData,
                tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getShortAt(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getShortAt(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug)
                console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getShortAt(tiffOffset + 2, bigEnd) != 0x002A) {
            if (debug)
                console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        if (file.getLongAt(tiffOffset + 4, bigEnd) != 0x00000008) {
            if (debug)
                console.log("Not valid TIFF data! (First offset not 8)", file.getShortAt(tiffOffset + 4, bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + 8, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                                StringValues.Components[exifData[tag][0]]
                                + StringValues.Components[exifData[tag][1]]
                                + StringValues.Components[exifData[tag][2]]
                                + StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0]
                                + "." + gpsData[tag][1]
                                + "." + gpsData[tag][2]
                                + "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }


    function getData(img, callback) {
        if (!img.complete)
            return false;
        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    function getTag(img, tag) {
        if (!imageHasData(img))
            return;
        return img.exifdata[tag];
    }

    function getAllTags(img) {
        if (!imageHasData(img))
            return {};
        var a,
                data = img.exifdata,
                tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    function pretty(img) {
        if (!imageHasData(img))
            return "";
        var a,
                data = img.exifdata,
                strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    function readFromBinaryFile(file) {
        return findEXIFinJPEG(file);
    }


    return {
        readFromBinaryFile: readFromBinaryFile,
        pretty: pretty,
        getTag: getTag,
        getAllTags: getAllTags,
        getData: getData,
        Tags: ExifTags,
        TiffTags: TiffTags,
        GPSTags: GPSTags,
        StringValues: StringValues
    };

})();
;define('upload/main.js', function(require, exports, module){

var ImgUpload = require('upload/upload.js');
new ImgUpload(second, {
	// url: 'http://test.diditaxi.com.cn/pinche/native/picUpload',
	url: '/output/upload.php',
	filekey:'file',
	
	outputHeight: 500,
	outputWidth: 800,
	onSuccessUpload: function(response){
		response = JSON.parse(response);
		second.style.backgroundImage = 'url('+ response.img +')';
	},
	onCancelUpload: function(){
	},
	onFailedUpload: function(){
		
	}
});

});
;/*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };

var utils = (function () {
	var me = {};

	var _elementStyle = document.createElement('div').style;
	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}

		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	me.getTime = Date.now || function getTime () { return new Date().getTime(); };

	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};

	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);
	};

	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};

	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ? 
			'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
			pointerEvent;
	};

	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin')
	});

	me.hasClass = function (e, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
		return re.test(e.className);
	};

	me.addClass = function (e, c) {
		if ( me.hasClass(e, c) ) {
			return;
		}

		var newclass = e.className.split(' ');
		newclass.push(c);
		e.className = newclass.join(' ');
	};

	me.removeClass = function (e, c) {
		if ( !me.hasClass(e, c) ) {
			return;
		}

		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
		e.className = e.className.replace(re, ' ');
	};

	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		// jshint -W084
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		// jshint +W084

		return {
			left: left,
			top: top
		};
	};

	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}

		return false;
	};

	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});

	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;

		if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();

function IScroll (el, options) {
	this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.scrollerStyle = this.scroller.style;		// cache style for better performance

	this.options = {

// INSERT POINT: OPTIONS 

		startX: 0,
		startY: 0,
		scrollY: true,
		directionLockThreshold: 5,
		momentum: true,

		bounce: true,
		bounceTime: 600,
		bounceEasing: '',

		preventDefault: true,
		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

		HWCompositing: true,
		useTransition: true,
		useTransform: true
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	// Normalize options
	this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;

	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if ( this.options.tap === true ) {
		this.options.tap = 'tap';
	}

// INSERT POINT: NORMALIZATION

	// Some defaults	
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

// INSERT POINT: DEFAULTS

	this._init();
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();
}

IScroll.prototype = {
	version: '5.1.3',

	_init: function () {
		this._initEvents();

// INSERT POINT: _init

	},

	destroy: function () {
		this._initEvents(true);

		this._execEvent('destroy');
	},

	_transitionEnd: function (e) {
		if ( e.target != this.scroller || !this.isInTransition ) {
			return;
		}

		this._transitionTime();
		if ( !this.resetPosition(this.options.bounceTime) ) {
			this.isInTransition = false;
			this._execEvent('scrollEnd');
		}
	},

	_start: function (e) {
		// React to left mouse button only
		if ( utils.eventType[e.type] != 1 ) {
			if ( e.button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}

		if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,
			pos;

		this.initiated	= utils.eventType[e.type];
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this._transitionTime();

		this.startTime = utils.getTime();

		if ( this.options.useTransition && this.isInTransition ) {
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
			this._execEvent('scrollEnd');
		} else if ( !this.options.useTransition && this.isAnimating ) {
			this.isAnimating = false;
			this._execEvent('scrollEnd');
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		this._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault ) {	// increases performance on Android? TODO: check!
			e.preventDefault();
		}

		var point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.pointX,
			deltaY		= point.pageY - this.pointY,
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// If you are scrolling in one direction lock the other
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}

		if ( this.directionLocked == 'h' ) {
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}

			deltaY = 0;
		} else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}

			deltaX = 0;
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if ( !this.moved ) {
			this._execEvent('scrollStart');
		}

		this.moved = true;

		this._translate(newX, newY);

/* REPLACE START: _move */

		if ( timestamp - this.startTime > 300 ) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}

/* REPLACE END: _move */

	},

	_end: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.changedTouches ? e.changedTouches[0] : e,
			momentumX,
			momentumY,
			duration = utils.getTime() - this.startTime,
			newX = Math.round(this.x),
			newY = Math.round(this.y),
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();

		// reset if we are outside of the boundaries
		if ( this.resetPosition(this.options.bounceTime) ) {
			return;
		}

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		// we scrolled less than 10 pixels
		if ( !this.moved ) {
			if ( this.options.tap ) {
				utils.tap(e, this.options.tap);
			}

			if ( this.options.click ) {
				utils.click(e);
			}

			this._execEvent('scrollCancel');
			return;
		}

		if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
			this._execEvent('flick');
			return;
		}

		// start momentum animation if needed
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}

// INSERT POINT: _end

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}

			this.scrollTo(newX, newY, time, easing);
			return;
		}

		this._execEvent('scrollEnd');
	},

	_resize: function () {
		var that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},

	resetPosition: function (time) {
		var x = this.x,
			y = this.y;

		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || this.y > 0 ) {
			y = 0;
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}

		this.scrollTo(x, y, time, this.options.bounceEasing);

		return true;
	},

	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},

	refresh: function () {
		var rf = this.wrapper.offsetHeight;		// Force reflow

		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;

/* REPLACE START: refresh */

		this.scrollerWidth	= this.scroller.offsetWidth;
		this.scrollerHeight	= this.scroller.offsetHeight;

		this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
		this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

/* REPLACE END: refresh */

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);

		this._execEvent('refresh');

		this.resetPosition();

// INSERT POINT: _refresh

	},

	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}

		this._events[type].push(fn);
	},

	off: function (type, fn) {
		if ( !this._events[type] ) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if ( index > -1 ) {
			this._events[type].splice(index, 1);
		}
	},

	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}

		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}

		for ( ; i < l; i++ ) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},

	scrollBy: function (x, y, time, easing) {
		x = this.x + x;
		y = this.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	},

	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;

		if ( !time || (this.options.useTransition && easing.style) ) {
			this._transitionTimingFunction(easing.style);
			this._transitionTime(time);
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},

	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}

		var pos = utils.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}

		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},

	_transitionTime: function (time) {
		time = time || 0;

		this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
		}

// INSERT POINT: _transitionTime

	},

	_transitionTimingFunction: function (easing) {
		this.scrollerStyle[utils.style.transitionTimingFunction] = easing;

// INSERT POINT: _transitionTimingFunction

	},

	_translate: function (x, y) {
		if ( this.options.useTransform ) {

/* REPLACE START: _translate */

			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

/* REPLACE END: _translate */

		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}

		this.x = x;
		this.y = y;

// INSERT POINT: _translate

	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.options.click ) {
			eventType(this.wrapper, 'click', this, true);
		}

		if ( !this.options.disableMouse ) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( utils.hasPointer && !this.options.disablePointer ) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if ( utils.hasTouch && !this.options.disableTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);
	},

	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},

	_animate: function (destX, destY, duration, easingFn) {
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd');
				}

				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}

		this.isAnimating = true;
		step();
	},
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
			case 'click':
				if ( !e._constructed ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	}
};
IScroll.utils = utils;

if ( typeof module != 'undefined' && module.exports ) {
	module.exports = IScroll;
} else {
	window.IScroll = IScroll;
}

})(window, document, Math);
;define('carchoose/main.js', function(require, exports, module){

/**
* 图片上传+裁剪功能类
* fis语法依赖 iscroll
* @require carchoose/_iscroll/iscroll-lite.js
*
**/

(function($){


var brandScroll,
    typeScroll,
    colorScroll,

    $wrapper,
    $brandLayer,
    $typeLayer, 
    $colorLayer,

    $lastBrandItem,
    $lastTypeItem,
    $lastColorItem,

    carTypesCache = {},
    colorsCache,

    currentValue,

    // iScroll scroll deceleration
    scrollDeceleration,

    // urls
    brandsURL,
    typesURL,
    colorsURL,

    // callbacks
    onselect;


scrollDeceleration = 0.002;


// Init current value
currentValue = {
    brand: {}
    , type: {}
    , color: {}
};


function closeLayers () {
    slideRightOutBrands();
    slideRightOutBrandTypes();
    slideRightOutColors();
}

function openLayers () {
    slideRightInBrands();
}

function showLoading(){
    window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 2000);
}

function hideLoading(){
    window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 100);
}


function resize(){
    $wrapper && $wrapper.height($(window).height()); 
}

$(window).on('resize', function(){
    resize(); 
});



function render () {
    $wrapper = $('<div class="choose-cartype-layer" />').prependTo('body')
        .css('visibility', 'hidden'); 

    resize();

    $wrapper.append('<section class="choose-brand-layer"><div></div></section>');
    $wrapper.append('<section class="choose-type-layer"><div></div></section>');
    $wrapper.append('<section class="choose-color-layer"><div></div></section>');

    $brandLayer = $('.choose-brand-layer')
        .append('<div class="choose-cartype-shortcut"></div>');
    $typeLayer = $('.choose-type-layer');
    $colorLayer = $('.choose-color-layer');
    $shortcut = $brandLayer.find('.choose-cartype-shortcut');
    
    loadCarBrands();
}

function loadCarBrands() {

    showLoading();

    $.ajax({
        url: brandsURL
        , dataType: 'json'
        , success: function (json) {

            hideLoading();

            if(json.errno != '0') return;

            renderCarBrands(json.data);
            $wrapper.css('visibility', 'visible');
            slideRightInBrands();
            renderShortCut(json.data);

            bindCarBrandEvents();
            bindCarTypeEvents();
            bindColorsEvents();
            bindShortCut();
        } 
        , error: function (json) {
            hideLoading();
        }
    });
}

function renderShortCut (data) {
    var arr = [];

    for(var key in data){
        arr.push([
            '<div><a href="javascript:void(0);" data-anchor="car-brand-'
            ,     key
            , '">'
            ,     key
            , '</a></div>'
        ].join(''));
    }

    $shortcut.html(arr.join(''));
}

function renderCarBrands (data) {
    var arr = [];

    for(var key in data){
        arr.push([
            '<h3 id="car-brand-' + key + '">'
            , '<div><span>' + key + '</span></div>'
            , '</h3>'
            , '<ul>'
        ].join('')); 

        var brands = data[key];
        for(var i=0; i<brands.length; i++) {
            arr.push([
                '<li data-brand-id="' + brands[i]['brand_id'] + '">'
                , brands[i].name
                , '</li>'
            ].join(''));
        } 
        arr.push('</ul>');
    } 

    $brandLayer.find('div').html(arr.join(''));
    if(!brandScroll) {
        brandScroll = new IScroll($brandLayer[0], { click: true, deceleration: scrollDeceleration });
    }
    else {
        brandScroll.refresh();
    }
}





function bindShortCut () {
    $shortcut.on('click', function (e) {
        var $link = $(e.target).closest('a'),
            anchor;

        if(!$link.length) return;

        $link.addClass('selected');
        setTimeout(function () {
            $link.removeClass('selected');
        }, 200);

        anchor = $link.data('anchor');

        brandScroll.scrollToElement('#' + anchor, 0);

    });
}


function bindCarBrandEvents () {
    $brandLayer.on('click', function(e){
        var $li = $(e.target).closest('li'),
            brandID,
            brandName;

        if(!$li.length || $li == $lastBrandItem) return;

        $lastBrandItem && $lastBrandItem.removeClass('selected');
        $lastBrandItem = $li;
        $li.addClass('selected');

        brandID = $li.data('brand-id'); 
        brandName = $li.text(); 

        currentValue.brand = {
            id: brandID
            , name: brandName
        };

        if(carTypesCache[brandID]) {
            renderCarTypes(carTypesCache[brandID]);
            slideRightInBrandTypes();
            slideRightOutColors();
        }
        else {
            slideRightOutBrandTypes();
            slideRightOutColors();
            showLoading();
            $.ajax({
                // @todo: add query &token=...
                url: typesURL
                    + '?carbrand=' + brandID
                , dataType: 'json'
                , success: function (json) {
                    hideLoading();
                    if(json.errno != 0) return;
                    carTypesCache[brandID] = json.data;
                    renderCarTypes(json.data);
                    slideRightInBrandTypes();
                } 
                , error: function (json) {
                    hideLoading();
                }
            });
        }
        
    });
}

function bindCarTypeEvents () {

    $typeLayer.on('click', function(e){
        var $li = $(e.target).closest('li'),
            brandTypeID, brandTypeName,
            regexBrand;

        if(!$li.length || $li == $lastTypeItem) return;

        $lastTypeItem && $lastTypeItem.removeClass('selected');
        $lastTypeItem = $li;
        $li.addClass('selected');

        brandTypeID = $li.data('brand-type-id'); 
        brandTypeName = $li.text(); 

        regexBrand = new RegExp(
            currentValue.brand.name.replace(
                /[\\\|*+?^$]/g
                , '\\$&'
            )
            , 'g'
        ); 

        currentValue.type = {
            id: brandTypeID
            // Remove brand name from type name
            , shortName: brandTypeName.replace(
                regexBrand, ''
            )
            , name: brandTypeName
        };

        if(colorsCache) {
            slideRightInColors(); 
        }
        else {
            slideRightOutColors(); 
            showLoading();
            $.ajax({
                // @todo: add query &token=...
                url: colorsURL
                , dataType: 'json'
                , success: function (json) {
                    hideLoading();
                    if(json.errno != 0) return;
                    colorsCache = json.data;
                    renderColors(json.data);
                    slideRightInColors(); 
                } 
                , error: function (json) {
                    hideLoading();
                }
            });
        }
        
    });
}

function bindColorsEvents () {
    $colorLayer.on('click', function(e){
        var $li = $(e.target).closest('li'),
            colorID, colorName,
            carInfo;

        if(!$li.length) return;

        colorID = $li.data('color-id'); 
        colorName = $li.text(); 

        currentValue.color = {
            id: colorID
            , name: colorName
        };

        carInfo = 
            StringUtil.subStrg(currentValue.brand.name, 6)
            + ' ' 
            + StringUtil.subStrg(currentValue.type.shortName, 4)
            + ' ' 
            + currentValue.color.name
            ;

        onselect && onselect({
            value: currentValue
            , carInfo: carInfo
        });

        closeLayers(); 

    });
}






function renderCarTypes (data) {
    var arr = ['<ul>'];

    var brandTypes = data;
    for(var i=0; i<brandTypes.length; i++) {
        arr.push([
            '<li data-brand-type-id="' + brandTypes[i]['brand_type_id'] + '">'
            , brandTypes[i]['brand_type_name']
            , '</li>'
        ].join(''));
    } 
    arr.push('</ul>');

    $typeLayer.find('div').html(arr.join(''));
    if(!typeScroll) {
        typeScroll = new IScroll($typeLayer[0], { click: true, deceleration: scrollDeceleration });
    }
    else {
        typeScroll.refresh();
    }
}


function renderColors (data) {
    var arr = ['<ul>'];

    var colors = data;
    for(var key in colors) {
        arr.push([
            '<li data-color-id="' + key + '">'
            , colors[key]['name']
            , '</li>'
        ].join(''));
    } 
    arr.push('</ul>');

    $colorLayer.find('div').html(arr.join(''));
    if(!colorScroll) {
        colorScroll = new IScroll($colorLayer[0], { click: true, deceleration: scrollDeceleration });
    }
    else {
        colorScroll.refresh();
    }
}

function slideRightInBrands(){

    translate(
        $wrapper[0]
        , $(window).width()
        , 0
    ); 

    translate(
        $wrapper[0]
        , 0
        , 150
    ); 

}

function slideRightOutBrands(){

    // Remove selected state
    $lastBrandItem && $lastBrandItem.removeClass('selected');
    $lastBrandItem = null;

    translate(
        $wrapper[0]
        , 0
        , 0
    ); 
    translate(
        $wrapper[0]
        , $(window).width()
        , 150
    ); 
}

function slideRightInBrandTypes(){
    translate(
        $typeLayer[0]
        , -0.66 * $(window).width()
        , 150
    ); 
}

function slideRightOutBrandTypes(){

    // Remove selected state
    $lastTypeItem && $lastTypeItem.removeClass('selected');
    $lastTypeItem = null;

    translate(
        $typeLayer[0]
        , -0.66 * $(window).width()
        , 0
    ); 
    translate(
        $typeLayer[0]
        , 0
        , 150
    ); 
}

function slideRightInColors(){
    translate(
        $colorLayer[0]
        , -0.33 * $(window).width()
        , 150
    ); 
}

function slideRightOutColors(){

    translate(
        $colorLayer[0]
        , -0.33 * $(window).width()
        , 0
    ); 
    translate(
        $colorLayer[0]
        , 0
        , 150
    ); 
}



// 特效移动，来自已有实现
function translate(elem, dist, speed, timefunc, delay) {

    var style = elem && elem.style;
    var t1 = "", t2 = "";

    if(!timefunc) timefunc = "linear";

    if(!delay) delay = 0;

    if (!style) return;

    if(Object.prototype.toString.call(dist) === '[object Array]'){
        switch(dist.length) {
            case 3:
                t1 = t2 = 'translate3d(' + dist[0] + 'px,'+ dist[1] + 'px,' + dist[2] + 'px)';
                break;
            case 2:
                t1 = t2 = 'translate(' + dist[0] + 'px,' + dist[1] + 'px)' + 'translateZ(0)';
                break;
            case 1:
                t1 = 'translate(' + dist[0] + 'px,0)' + 'translateZ(0)';
                t2 = 'translateX(' + dist[0] + 'px)';
                break;
            default:
                t1 = 'translate(' + dist[0] + 'px,0)' + 'translateZ(0)';
                t2 = 'translateX(' + dist[0] + 'px)';
        }
    }
    else if( !isNaN(parseInt(dist)) ){
        t1 = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        t2 = 'translateX(' + dist + 'px)';
    }
    else{
        return;
    }

    style.webkitTransitionDuration =
    style.MozTransitionDuration =
    style.msTransitionDuration =
    style.OTransitionDuration =
    style.transitionDuration = speed + 'ms';

    style.webkitTransitionTimingFunction =
    style.MozTransitionTimingFunction =
    style.msTransitionTimingFunction =
    style.OTransitionTimingFunction =
    style.transitionTimingFunction = timefunc;

    style.webkitTransitionDelay =
    style.MozTransitionDelay =
    style.msTransitionDelay =
    style.OTransitionDelay =
    style.transitionDelay = delay + 'ms';

    style.webkitTransform = t1;
    style.msTransform =
    style.MozTransform =
    style.OTransform = t2;
}

// 字节数截取，来自已有实现
function subString(str, len, hasDot) {
    if(str=="") return "";
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = '';
    var strLength = str.replace(chineseRegex, '**').length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += '...';
    }
    return newStr;
}

// 字符阶段，来自已有实现
var StringUtil = function() {
    var LenB = function(str) {
        return str.replace(/[^\x00-\xff]/g, "**").length;
    }
    var subStrg = function(str, size) {
        if (str == null) {
            return "";
        }
        if (LenB(str) > size) {
            var l = 0;
            var lStr = "";
            var c;
            for (var i = 0; i < str.length; i++) {
                c = str.charAt(i);
                l += LenB(c);
                if (l >= size) {
                    lStr = str.substring(0, i + 1);
                    break;
                }
            }
            lStr += "...";
            return lStr;
        } else {
            return str;
        }
    }
    return {
        LenB: LenB
        , subStrg: subStrg
    };
}();




function init(options){

    // Blur if anything focused
    document.activeElement
        && document.activeElement.blur();

    // Reentry
    if( $wrapper ) {

        // Delay to make slide-in-from-right smoothly
        setTimeout(function(){
            openLayers();
        }, 300);

        return;
    }

    options = options || {};

    brandsURL = options.brandsURL 
        || '/pinche/cartype/getcarbrand';
    typesURL = options.typesURL
        || '/pinche/cartype/getcartype';
    colorsURL = options.colorsURL
        || '/pinche/cartype/getcolor';

    onselect = options.onselect || function(){};
    render();
}

$.didiCarChoose = function(options){
    init(options);
};



})(Zepto);



});