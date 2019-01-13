window.addEventListener('DOMContentLoaded',function(){

	//返回的时候也要刷新页面，获取乘客token
	if(window.name != "portal"){ 
	//如果页面的 name 属性不是指定的名称就刷新它 	
		window.name = "portal"; 
	} else{ 
	//如果页面的 name 属性是指定的名称就什么都不做，避免不断的刷新
		//alert(window.name);
		window.name = ""; 
		location.reload();	
	} 
	
	var pageCon=document.getElementById('page_con'),
		html=document.getElementsByTagName('html')[0],
		body=document.getElementsByTagName('body')[0],
		cliW = document.body.clientWidth,
		thisW=cliW*0.85,
		hei = 154/634*thisW;
	pageCon.style.backgroundSize=thisW+'px '+ hei +"px";//设置背景图的宽度为屏幕宽，高度按比例
	//根据不同的屏幕宽度设置元素的放大倍率
	var num = cliW/320;//已iphone6为基底
	html.style.fontSize=12*num+"px";
	var base=dd.base||{},
		dialog=dd.dialog||{};
	//定义全局变量
	var driverId=document.getElementById('driver_id').value,
		driverSign=document.getElementById('driver_sign').value,
		driverName=document.getElementById('dri_name').innerHTML,
		carNum=document.getElementById('car_id_span').innerHTML,
		openId=document.getElementById('open_id').value,
		passengertoken=document.getElementById('passengertoken').value,
		dToken=document.getElementById('d_token').value,
		dphone=document.getElementById('d_phone').value,
		darea=document.getElementById('d_area').value,
		goQuan=document.getElementById('go_quan'),
		//goDidi=document.getElementById('go_didi'),
		payNum=document.getElementById('pay_num'),
		btn=document.getElementById('btn');
		//objAgu=base.getQueryStr();//获取链接上的参数键值对
	
	//点击领券的操作
	var clickCount = 0;
	var getUrl="/qcode/ticket/rob?driverId="+driverId+"&driverSign="+driverSign+"&drivername="+driverName+"&carnum="+carNum+"&dphone="+dphone+"&darea="+darea;
	/*goQuan.addEventListener("click",function(){
		if(clickCount === 0){
			clickCount++;//防止重复点击
			window.location.href=getUrl;
		}
	},false);*/
	
	//点击调起滴滴的操作
	// base.touch(goDidi,function(){
	// 	window.location.href="http://pay.xiaojukeji.com/api/v2/weixinapi";
	// });	

	//限制输入框只能输入数字
	/*if (payNum.value!=="") {
		removeClass(btn,'gay');
	};	*/
	payNum.addEventListener('input',function(){	
		this.value=this.value.replace(/[^0-9\.]/g,'');
		if (this.value.substring(0,1)=="0") {//输入金额第一个数字不能为0
			this.value="";
		};
		/*if (this.value!="") {//输入框没有值则支付按钮为灰
			removeClass(btn,'gay');
		}else{
			addClass(btn,'gay');
		}*/
	});
	//点击支付
	var payUrl="/api/v2/taxiscancode";//跳转支付页面接口
	btn.addEventListener('touchstart',function(){});//解决ios点击没有二态
	btn.addEventListener('click',function(){
		if (payNum.value==="") {//按钮为灰不能点击
			dialog.alert('请输入支付金额');
		}else{
			var cost=payNum.value;//获取金额	
			window.location.href=payUrl+"?driverId="+driverId+"&openid="+openId+"&d_token="+encodeURIComponent(dToken)+"&passengertoken="+encodeURIComponent(passengertoken)+"&driverSign="+driverSign+"&drivername="+driverName+"&carnum="+carNum+"&dphone="+dphone+"&darea="+darea+"&cost="+cost+"&source=pay";
		}	
	})
	
	/*base.touch(btn,function(){//touch 事件调起弹窗不稳定
		if (payNum.value=="") {//按钮为灰不能点击
			dialog.alert('请输入支付金额');
		}else{
			var cost=payNum.value;//获取金额	
			window.location.href=payUrl+"?driverId="+driverId+"&openid="+openId+"&d_token="+dToken+"&passengertoken="+passengertoken+"&driverSign="+driverSign+"&drivername="+driverName+"&carnum="+carNum+"&dphone="+dphone+"&darea="+darea+"&cost="+cost+"&source=pay";
		}	
	});*/
	

});