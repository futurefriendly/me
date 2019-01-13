define('page/driver_register_edition/third/third.js', function(require, exports, module){

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