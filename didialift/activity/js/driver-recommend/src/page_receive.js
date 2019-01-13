window.addEventListener('DOMContentLoaded',function() {
	var base=dd.base || {};
	var pageUp=document.getElementById('page_up'),
		html=document.getElementsByTagName('html')[0],
		cliW = document.body.clientWidth;
		//hei = 1334/750*cliW;		
	//pageUp.style.backgroundSize=cliW+'px '+ hei +"px";//设置背景图的宽度为屏幕宽，高度撑开自适应
	//根据不同的屏幕宽度设置元素的放大倍率
	var num = cliW/320;
	html.style.fontSize=12*num+"px";
	//点击显示隐藏
	var clickOne=document.getElementById('click_one'),
		clickTwo=document.getElementById('click_two'),
		clickThree=document.getElementById('click_three');
	if (!clickOne&&!clickTwo&&!clickThree) {
		window.location.href="http://static.diditaxi.com.cn/activity/pages/serverbusy/serverbusy.html?datatype=driver&errmsg=发生异常，请稍后再试";//没有券进入异常页
	};
	if (clickOne) {
		base.touch(clickOne,function(){//第一张券
			common(clickOne);
		});
	};
	if (clickTwo) {
		base.touch(clickTwo,function(){//第二张券
			common(clickTwo);
		});
	};
	if (clickThree) {
		base.touch(clickThree,function(){//第三张券
			common(clickThree);
		});
	};
	//点击显示隐藏函数
	function common(that){
		var hideDiv=getNextElement(that).getElementsByClassName('show_hide')[0],
			changeImg=that.getElementsByTagName('img')[0];
		if (hasClass(hideDiv,'show')) {//通过给元素添加和删除类来控制显示隐藏并执行动画
			removeClass(hideDiv,'show');
			addClass(hideDiv,'hide');
			changeImg.src="/static/activity/img-driver-recommend/receive_down.png";
		}else{
			removeClass(hideDiv,'hide');
			addClass(hideDiv,'show');
			changeImg.src="/static/activity/img-driver-recommend/receive_up.png";
		}
	};
	
	//全局变量和参数
	var btn=document.getElementById('btn'),
		goDeduction=document.getElementById('go_deduction'),
		goSeeChu=document.getElementById('go_see_chu'),
		goSeeZhuan=document.getElementById('go_see_zhuan'),
		token=document.getElementById('p_token').value,
		openid=document.getElementById('open_id').value,
		d_token=document.getElementById('d_token').value,
		pphone=document.getElementById('pphone').value,
		objAgu=base.getQueryStr(),//获取链接上的参数键值对
		pid=objAgu.pid,
		driverId=objAgu.driverId,
		driverSign=objAgu.driverSign,
		driverName=objAgu.drivername,
		carNum=objAgu.carnum,
		dphone=objAgu.dphone,
		darea=objAgu.darea,
		payPath = "/api/v2/";
	//去试用滴滴的点击
	base.touch(btn,function(){
		//window.location.href=payPath+"weixinapi?token="+token+"&phone="+pphone;
		window.location.href=payPath+"taxiscancode?driverId="+driverId+"&driverSign="+driverSign+"&openid="+openid+"&passengertoken="+encodeURIComponent(token)+"&d_token="+encodeURIComponent(d_token)+"&drivername="+driverName+"&carnum="+carNum+"&dphone="+dphone+"&darea="+darea+"&pphone="+pphone+"&source=deduct";
	});
	//点击券的跳转		
	if (goDeduction) {
		base.touch(goDeduction,function(){//点击抵扣券
			window.location.href=payPath+"taxiscancode?driverId="+driverId+"&driverSign="+driverSign+"&openid="+openid+"&passengertoken="+encodeURIComponent(token)+"&d_token="+encodeURIComponent(d_token)+"&drivername="+driverName+"&carnum="+carNum+"&dphone="+dphone+"&darea="+darea+"&pphone="+pphone+"&source=deduct";
		});
	};
	if (goSeeChu) {
		base.touch(goSeeChu,function(){//点击出租车券
			window.location.href=payPath+"p_coupon/couponinfo?pid="+encodeURIComponent(token);
		});
	};
	if (goSeeZhuan) {
		base.touch(goSeeZhuan,function(){//点击专车券
			window.location.href=payPath+"p_coupon/couponinfo?pid="+encodeURIComponent(token);
		});
	};
});