dd.ready(function() {
	var base = dd.base,
		dialog = dd.dialog;

	var driver_form = base.txtToJson(localStorage.driver_form || {});

	var regular = {
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
	(function init() {
		//车牌首字初始化
		carno_init(page_driver.car_province_id);

		// 恢复数据
		if (pageParams.type == "join") { //
			// 恢复数据
			register_recover();
		}

		//表达校验初始化
		validata_init();
		// 点击提交
		$(btnSubmit).on('click', function(e) {

			if (btnSubmit.className == "btn-gray") return;
			// hide keyborad
			var list_input = document.getElementsByTagName("input");
			for (var i = 0, len = list_input.length; i < len; i++) {
				var _input = list_input[i];
				_input.setAttribute("readOnly", "true");
				_input.blur();
			}
			scrollTo(0, 0);
			setTimeout(function() {
				for (i = 0, len = list_input.length; i < len; i++) {
					var _input = list_input[i];
					_input.removeAttribute("readOnly");
				}
			}, 100);
			//end hide keyborad

			var data_form = {
				drive_license_name: txt_realname.value, //驾驶证姓名
				drive_license_number: txt_licence.value.toLocaleUpperCase(), //驾驶证号

				travel_license_name: txt_carower.value, //行驶证姓名
				car_province_id: txt_carOne.getAttribute("data-id"), //车省号
				car_license_number: txt_carOne2.value.toLocaleUpperCase(), //车牌号：A234567

				phone_number: pageParams.phone || "", //电话号
				token: pageParams.token || "",
				sign: pageParams.sign || ""
			};
			var form_ok = form_validate(data_form);



			if (form_ok) {
				next(function(){
					upload_card(data_form);
				});
				// form_commit(data_form);
			}
		});


	})();


	//车牌首字
	function carno_init(value) {
		var carnoSelect = document.getElementById("carnoSelect");

		ulEl = carnoSelect.getElementsByClassName("options")[0];
		var get_no = function() {
			base.ajax({
				method: "POST",
				url: "/pinche/cartype/getlicensehead",
				succFunc: function(j) {
					var da = base.txtToJson(j);
					if (da.errno == "0") {
						var data = da.data;
						var sort = da.sort;
						var html = "";
						for (var i = 0, len = sort.length; i < len; i++) {
							html += '<li data-id="' + sort[i] + '" data-show="' + data[sort[i]] + '">' + data[sort[i]] + '</li>';

						}
						ulEl.innerHTML += html;
						slideSelect_carno(txt_carOne, carnoSelect, []); //carno
					}

				},
				failFunc: function() {}
			});
		};
		get_no();

	}
	/*对文本框的输入进行一个保存恢复操作*/
	function register_recover() {
		//保存表单数据
		var _store = function(key, value) {
			driver_form[key] = value;
			localStorage.driver_form = JSON.stringify(driver_form);
		};
		txt_realname.addEventListener("change", function() {
			_store("txt_realname", this.value);
		}, false);

		txt_licence.addEventListener("change", function() {
			_store("txt_licence", this.value);
		}, false);

		txt_carower.addEventListener("change", function() {
			_store("txt_carower", this.value);
		}, false);

		txt_carOne.addEventListener("click", function() {
		    _store("txt_carOne", txt_carOne.value);
		}, false);

		txt_carOne2.addEventListener("change", function() {
			_store("txt_carOne2", this.value);
		}, false);

		if (driver_form) {
			txt_realname.value = driver_form.txt_realname || "";
			txt_licence.value = driver_form.txt_licence || "";
			txt_carower.value = driver_form.txt_carower || "";
			txt_carOne.value = driver_form.txt_carOne || "";
			txt_carOne2.value = driver_form.txt_carOne2 || "";
		}
	}

	function validata_init() {
		// 真实姓名
		txt_realname.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_realname.addEventListener("blur", function() {
			if (!regular.is_Chinese_name(this.value)) {
				this.className = "error";
			}
		}, false);

		// 驾驶证号
		txt_licence.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_licence.addEventListener("blur", function() {
			if (!regular.is_ID_card(this.value)) {
				this.className = "error";
			}
		}, false);

		// 行驶本姓名
		txt_carower.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_carower.addEventListener("blur", function() {
			if (!regular.is_Chinese_name(this.value)) {
				this.className = "error";
			}
		}, false);

		// 车牌号验证
		txt_carOne2.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_carOne2.addEventListener("blur", function() {
			if (!regular.is_carNo(this.value)) {
				this.className = "error";
			}
		}, false);
	}
	//表单校验
	function form_validate(data) {
		// 文本输入错误
		var input_error = function(ele, title) {
			dialog.alert({
				title: "",
				tip: title,
				btn: {
					handler: function() {
						ele.focus();
					}
				}
			});
		};
		//如果这些可以修改
		if(pageParams.drive_license_changeable === '1'){
			//驾驶人
			if (!regular.is_Chinese_name(data.drive_license_name)) {
				input_error(txt_realname, "请填写真实姓名");
				return false;
			}
			if (!regular.is_ID_card(data.drive_license_number)) {
				input_error(txt_licence, "身份证号填写错误");
				return false;
			}
		}
		//如果这些可以修改
		if(pageParams.travel_license_changeable === '1' ){
			//车辆
			if (!regular.is_Chinese_name(data.travel_license_name)) {
				input_error(txt_carower, "行驶证姓名填写错误");
				return false;
			}
			if (txt_carOne.value == "") {
				dialog.alert('请选择车牌归属地');
				return false;
			}
			if (!regular.is_carNo(data.car_license_number)) {
				input_error(txt_carOne2, "车牌号填写错误");
				return false;
			}
		}
		return true;
	}
	//提交新增表单
	function form_commit(data) {
		dialog.loading("正在请求，请稍后~");
		base.ajax({
			method: "POST",
			url: pageParams.submit_url,
			data: data,
			succFunc: function(j) {
				var da = base.txtToJson(j);
				if (da.errno == "0") { //注册成功   
					localStorage.removeItem("driver_form");
					location.replace(da.url);
				} else if (da.errno == "3002") {
					localStorage.removeItem("driver_form");
					location.replace(da.url);
				} else {
					pre(function(){
						dialog.alert(da.errmsg);
					});
				}
			},
			failFunc: function() {
				dialog.alert("网络有点不给力，请稍后再试哦~");
			}
		});
	}
	function next(callback){
		$('.main').attr('class','main animate begin_animate');
		setTimeout(function(){
			$('.main').attr('class','main animate end_animate');
		}, 0 );
		setTimeout(function(){
			$('.main').attr('class','main ended_animate');
			callback();
		}, 350);
	}
	function pre(callback){
		$('.main').attr('class','main animate end_animate');
		setTimeout(function(){
			$('.main').attr('class','main animate begin_animate');
		}, 0 );
		setTimeout(function(){
			$('.main').attr('class','main');
			callback();
		}, 450);
	}
	// next(function(){
	//   	upload_card();
	// });
	var upload_card_init = false;
	function upload_card(data_form) {
		if(upload_card_init === true) return;
		upload_card_init = true;
		 var val_ary = [
			 'travelauthpicurl',  //行驶证照片
	         'driveauthpicurl',   //驾照照片
	         'carauthpicurl'
	         ];
		var $pick_ary = [
			'.driving_licence_front',
			'.driving_licence_backend', 
			'.car_photo'
		];
		var photo_data = {};

		var addPhoto = function(key, val){
			var index = val_ary.indexOf(key);
			if(index === -1) return;
		 	var $pick_node = $($pick_ary[index]);
		 	photo_data[ key ] = val;
			$pick_node.addClass('photo_uploaded');
		 	$pick_node.find('.shadow').html(val);
		 	$pick_node.find('.shadow').css('background-image', 'url('+ val +')');
		 	local.set(key,val);
		};
		var setThumb = function($node, src, retry){
			retry = retry || 0;
			var $img = $('<img>');
			$img.on('load error', function(e){
				$img.off();
				if( e.type === 'error' && retry){
					setThumb();
				}else{
					$node.css('background-image', 'url('+ src +')');
				}
			});
			$img.attr('src');
		}

		var removePhoto = function(key, e){
			var index = val_ary.indexOf(key);
			if(index === -1) return;
		 	$pick_node = $($pick_ary[index]);
		 	$pick_node.find('.shadow').html('error | ' + e.message);
			$pick_node.removeClass('photo_uploaded');
		 	delete photo_data[ key ];
		}
		// jsUpload({
		// 	pick_node: $pick_node_first,
		// 	file_key: key_ary[0]
		// }, function(src){
		// 	$pick_node_first.find('.shadow').css({
		// 		'background': 'url('+ src  +')'
		// 	});
		// 	console.log(src);
		// },function(resObj){
		// 	console.log(resObj);
		// });	
		addEventListener('error', function(e){
		 	$('.driving_licence_backend').find('.shadow').html( e.message );
		}, false);
		val_ary.forEach(function(val){
			var localPhoto = local.get(val);
			if(localPhoto){
				addPhoto(val, localPhoto);
			}
		});


		$('.upload_card').on('click', '.file_select', function(e){

			var $pick_node  = $(e.currentTarget);
			var className = $pick_node.attr('class').trim();
			className = className.split(/\s+/)[1];
			if(className == false) return;
			var index = $pick_ary.indexOf('.'+className);	
			if(index === -1) return;
    		var Didibridge = require('ddbridge/ddbridge.js');
    		 Didibridge.uploadImage(
	    		 {},
	    		function(resObj){
	    		 	try{
	    		 		resObj = JSON.parse(resObj);
	    		 		addPhoto(val_ary[index], resObj.data.data );
	    		 	}catch(e){
	    		 		removePhoto(val_ary[index], e);
	    		 	}
	    		}
    		);
		});
		// val_ary.forEach(function(val){
		// 	photo_data[ val ] = 'http://img.baidu.com/video/img/video_logo_new.gif'
		// });
		base.touch($('.register_submit')[0], function(){
		// $('.register_submit').on('click', function(){
			var check_pass = true;
			var check_fail_index;
			$.each(val_ary, function(key, val){
				if( photo_data[val] === undefined ){
					check_fail_index = key;
					return check_pass = false;
				}
			})
			if(check_pass === false){
				var title = $($pick_ary[check_fail_index]).find('.select_tips').text() || '完整资料';
				dialog.alert({
					title: "",
					tip: '请填写' + title,
					btn: {
						handler: function() {
						}
					}
				});
				return;
			}
			data_form = $.extend(data_form, photo_data);
			form_commit(data_form);
		});

	}

	var local = {
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

		}
	}

	function jsUpload(opt, thumbCallback, uploadSuccess){
		var $pick_node = opt.pick_node;
		var file_key = opt.file_key;
		var uploader = WebUploader.create({
			// 选完文件后，是否自动上传。
			auto: true,
			fileVal: file_key,
			formData: {
				// 1 随机文件名称 、 0原文件
				// type: '0',
				// url: 'http://list.video.baidu.com/yingbang/vce/',
			},
			// paste: me.$inputContent,
			// 文件接收服务端。
			server: pageParams.upload_url,

			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: $pick_node,

			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/*'
			}
		});



		// 当有文件添加进来的时候
		uploader.on('fileQueued', function(file) {
			// 创建缩略图
			// 如果为非图片文件，可以不用调用此方法。
			// thumbnailWidth x thumbnailHeight 为 100 x 100
			uploader.makeThumb(file, function(error, src) {
				if (error) {
					console.log('<span>不能预览</span>');
					return;
				}
				thumbCallback(src);
			
			}, 200, 200);
		});

		uploader.on('uploadComplete', function(file) {

		});
		uploader.on('uploadSuccess', function(file, response) {
			var resObj = JSON.parse(response._raw);
			uploadSuccess(resObj);
			if (resObj.success) {
				me.set('newData', resObj.result.file_domain + resObj.result.file_name);
			} else {
				message('上传失败');
			}
		});
		uploader.on('uploadProgress', function(file, percentage) {
			if (percentage < 1){
				message('上传中：' + percentage * 100 + '%');
			}
			else{
				message('上传完毕', percentage);
			}
		});

	}
	function message(msg){
		console.log(msg);
	}


});