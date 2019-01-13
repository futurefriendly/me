define('page/driver_register_edition/status/status.js', function(require, exports, module){

exports.to = function(index){
	$('.status_item')
		.removeClass('active')
		.eq(index)
		.addClass('active')
}


});