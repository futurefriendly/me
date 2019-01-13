define('page/driver_register_edition/first/first.js', function(require, exports, module){

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