define('page/driver_register_edition/main.js', function(require, exports, module){

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