window.addEventListener("DOMContentLoaded", function(ev) {

	var base = dd.base || {},
		dialog = dd.dialog || {};


	/*
	 *description:小课堂上滑
	 */
	var dv_botton = document.getElementById('botton'),
		dv_content = document.getElementById("content"),
		dv_page_up = document.getElementById("page-up");

	dv_content.addEventListener("touchmove", function(ev) {
		ev.preventDefault();
	}, false);

	dv_page_up.addEventListener("touchmove", function(ev) {
		ev.preventDefault();
	}, false);

	base.touch(botton, function(ev) {
		addClass(dv_content, 'content-hide');
		addClass(dv_page_up, 'page-show');
	});


	/*
	 **页面dom元素
	 */
	var doc = document,
		ipt_phone = doc.getElementById("ipt-phone"),
		btn_valid = doc.getElementById("btn-valid"),
		ipt_validcode = doc.getElementById("ipt-validcode"),
		btn_nextstep = doc.getElementById("nextstep");

	/*
	 *全局常量
	 */
	var GLOBAL_CONSTANT = {
		"BTN_ORANGE": "btn-orange",
		"BTN_GRAY": "btn-gray",
		"RE_GET": "重新获取"
	};

	/*
	 *description:激活按钮
	 *params: [domObject]
	 *return: undefined
	 */
	function activateBtn(btn) {
		removeClass(btn, GLOBAL_CONSTANT.BTN_GRAY);
		addClass(btn, GLOBAL_CONSTANT.BTN_ORANGE);
	}

	/*
	 *description:禁用按钮
	 *params: [domObject]
	 *return: undefined
	 */
	function disabledBtn(btn) {
		removeClass(btn, GLOBAL_CONSTANT.BTN_ORANGE);
		addClass(btn, GLOBAL_CONSTANT.BTN_GRAY);
	}

	(function() {
		/*
		 *description:验证手机号
		 *params:[event]
		 *return: undefined
		 */
		var isPhonePass = false;
		ipt_phone.addEventListener("input", function(ev) {
			ipt_phone.value = ipt_phone.value.replace(/[^\d]/g, '').slice(0, 11);
			var phone = ipt_phone.value;
			var reg = /^(13|14|15|17|18)[0-9]{9}$/
			if (phone && reg.test(phone) && phone.length === 11) {
				activateBtn(btn_valid);
				isPhonePass = true;
				if (ipt_validcode.value && ipt_validcode.value.length === 4) {
					activateBtn(btn_nextstep);
				}
			} else {
				disabledBtn(btn_valid);
				disabledBtn(btn_nextstep);
			}
		}, false);

		/*
		 *description:点击获取验证码
		 *params: [event]
		 *return: undefined
		 */
		base.touch(btn_valid, function(ev) {
			if (hasClass(btn_valid, GLOBAL_CONSTANT.BTN_ORANGE)) {
				//step1:按钮倒计时
				//dialog.loading('正在获取验证码', 3500);
				//ipt_validcode.focus();
				var seconds = 30;
				var timer = setInterval(function() {
					removeClass(btn_valid, GLOBAL_CONSTANT.BTN_ORANGE);
					addClass(btn_valid, GLOBAL_CONSTANT.BTN_GRAY);
					btn_valid.innerText = seconds + "秒";
					if (seconds <= 0) {
						clearInterval(timer);
						btn_valid.innerText = GLOBAL_CONSTANT.RE_GET;
						removeClass(btn_valid, GLOBAL_CONSTANT.BTN_GRAY);
						addClass(btn_valid, GLOBAL_CONSTANT.BTN_ORANGE);
					}
					seconds--;
				}, 1000);
				//step2:发送请求，获取验证码
				var code_sn = doc.getElementById("code_sn"),
					old_sign = doc.getElementById("oldsign"),
					sign = doc.getElementById("sign");

				var url = "/qcode/driverportal/sendmessage";
				base.ajax({
					url: url,
					method: "post",
					data: {
						phone: ipt_phone.value.trim(),
						code_sn: code_sn.value,
						sign: old_sign.value
					},
					succFunc: function(d) {
						d = JSON.parse(d);
						if (d.errno === 0) {
							code_sn.value = d.info.code_sn;
							sign.value = d.info.sign;
							localStorage.sign = d.info.sign;
						} else {
							dialog.alert(d.errmsg);
						}
					},
					failFunc: function() {
						dialog.alert("您的网络不给力哟，稍后再试~");
					}
				});
			}
		});

		/*
		 *description:输入验证码
		 *params:[event]
		 *return: undefined
		 */
		ipt_validcode.addEventListener("input", function(ev) {
			ipt_validcode.value = ipt_validcode.value.replace(/[^\d]/g, '').slice(0, 4);
			var code = ipt_validcode.value;
			if (code && code.length === 4 && isPhonePass) {
				removeClass(btn_nextstep, GLOBAL_CONSTANT.BTN_GRAY);
				addClass(btn_nextstep, GLOBAL_CONSTANT.BTN_ORANGE);
			} else {
				removeClass(btn_nextstep, GLOBAL_CONSTANT.BTN_ORANGE);
				addClass(btn_nextstep, GLOBAL_CONSTANT.BTN_GRAY);
			}
		}, false);

		/*
		 *description:点击下一步按钮，进行验证
		 *params: [event]
		 *return: undefined
		 */
		base.touch(btn_nextstep, function(ev) {
			if (hasClass(btn_nextstep, GLOBAL_CONSTANT.BTN_GRAY)) return;
			ipt_validcode.blur();
			ipt_phone.blur();

			var phone = ipt_phone.value,
				valideCode = ipt_validcode.value;
			var url = "/qcode/driverportal/bindqcode";
			var code_sn = doc.getElementById("code_sn"),
				sign = doc.getElementById("sign");

			if(!sign){
				sign = localStorage.sign;
			}

			base.ajax({
				url: url,
				method: "post",
				data: {
					phone: ipt_phone.value.trim(),
					code_sn: code_sn.value,
					sign: sign.value,
					messageCode: ipt_validcode.value.trim()
				},
				succFunc: function(d) {
					d = JSON.parse(d);
					var targetUrl = "/qcode/entrance/loadBindSuccessPage?type=";
					if (d.errno == 0) {
						location.href = targetUrl + "0";
					} else if (d.errno == 1005) {
						location.href = targetUrl + "1";
					} else if (d.errno == 1004) {
						location.href = targetUrl + "3";
					} else {
						dialog.alert(d.errmsg);
					}
				},
				failFunc: function() {
					dialog.alert("您的网络不给力哟，稍生再试~");
				}
			});
		});

	})();

}, false);
