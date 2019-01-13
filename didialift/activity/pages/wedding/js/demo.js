/**
 * @fileOverview 刮奖demo
 * @author xie
 * @email jiabin1@leju.com
 * @date 2014-11-06
 * @template
 */
define(function(require, exports) {
	var $ = require("zepto");
	var Mask = require('scratchCard');

	$(document).ready(function() {
		// var times = 3,
		// 	isShowError = false;

		// function sendData() {
		// 	$('#realResult').append('<br/>callback执行了');
		// }
		var $node = $('#box'),
			$realResult = $("#realResult");
		var mask = new Mask({
			container: $node,
			realResult: $realResult,
			// drawPercentCallback: sendData,
			// isFans: 1,
			// cover: '#ff0',
			// coverType: 'color'
		});
	});
});