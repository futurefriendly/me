define('page/driver_register_edition/recertification.js', function(require, exports, module){

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