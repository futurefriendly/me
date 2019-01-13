window.addEventListener("DOMContentLoaded",function(){
	var style=getQueryString("type"),
		headBg=document.getElementById('header'),
		headS=document.getElementById('triangle'),
		headImg=document.getElementById('head_img'),
		headWord=document.getElementById('head_word'),
		headH2=headWord.getElementsByTagName('h2')[0],
		headP=headWord.getElementsByTagName('p')[0],
		/*expalain=document.getElementsByClassName('expalain'),*/
		onlyFailure=document.getElementsByClassName('only_failure')[0],
		onlyFailureImg=onlyFailure.getElementsByTagName('img')[0],
		onlyFailureSpan=onlyFailure.getElementsByTagName('span')[0],
		onlySuccse=document.getElementsByClassName('only_succse');

	//判断错误页类型
	var _headp="",
		_olnyFailure="";
	switch(style){
		case "1":
			_headp="您已绑定四张，不能再次绑定";
			_olnyFailure="您可以联系滴滴工作人员，帮助解决";
			failureCommon();
			break;
		case "2":
			_headp="抱歉，此二维码已经失效";
			_olnyFailure="请您找滴滴工作人员，重新获取一张";
			failureCommon();
			break;	
		case "3":
			_headp="抱歉，此二维码已被人绑定";
			_olnyFailure="请您找滴滴工作人员，重新获取一张";
			failureCommon();
			break;	
		default:

	}
	//3种绑定失败情况的共同页面样式
	function failureCommon(){
		headBg.style.backgroundColor="#f76b63";
		headS.style.borderColor="#f76b63 transparent transparent transparent";
		headImg.src="/static/activity/img-driver-recommend/ico_explain_failure.png";
		headH2.innerHTML="绑定失败";
		headP.innerHTML=_headp;
		onlyFailureImg.src="/static/activity/img-driver-recommend/ico_reminder.png";
		onlyFailureSpan.innerHTML=_olnyFailure;
		for(var i=0; i<onlySuccse.length; i++){
			onlySuccse[i].style.display="none";
		};
	};

})