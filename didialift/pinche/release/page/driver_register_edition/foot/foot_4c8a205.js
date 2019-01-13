define('page/driver_register_edition/foot/foot.js', function(require, exports, module){

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