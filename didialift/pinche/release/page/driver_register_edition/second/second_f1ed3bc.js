define('page/driver_register_edition/second/second.js', function(require, exports, module){

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