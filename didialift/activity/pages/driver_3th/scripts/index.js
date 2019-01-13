window.addEventListener("DOMContentLoaded",function(ev){

    var DWIDTH = document.body.offsetWidth;
    var DHEIGHT = document.body.offsetHeight;
    var WD = DWIDTH/DHEIGHT;
    var appFlag = 0;
    var appVersion = 0;
    var drem = Math.round(DWIDTH/375 *16) +'px';
    document.getElementsByTagName("html")[0].style.fontSize = drem;
    var base = dd.base || {};
    var  dialog = dd.dialog || {};
    var pauseMusic = document.querySelector("#playmusic");
    var btnWeixinTimeline = document.getElementsByClassName('eight-slide-2')[0]; //分享按钮
    var navig = window.navigator.userAgent;
    var mh_value = document.getElementsByClassName("mh_memory")[0].value;

    var url = document.getElementById('share_url').value;
    if (url==''){
        url='http://anvs.diditaxi.com.cn/api/getdata';
    }
//DOM操作
    document.getElementsByClassName("minghao").src = 'http://static.diditaxi.com.cn/activity/pages/driver_3th/images/'+mh_value+'.png';
    var mh_memory1 = function(){
        if(document.getElementsByClassName("mh_memory")[0]==undefined){
            return '独孤求败';
        }else{
            return document.getElementsByClassName("mh_memory")[0].value;
        }
    }

    var mh_memory = mh_memory1();
//获取url参数信息
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    };

    var addClass = function (ele,strClass){
        var reg = new RegExp("(?:^| )" + strClass + "(?: |$)");
        if(reg.test(ele.className)){
            //如果此类样式已经存在，则什么也不需要做
        }else{//不存在
            ele.className = ele.className.trim() + " " + strClass;
        }
    };

    var removeClass=function (ele,strClass){
        if(!(ele&&ele.nodeType == 1)){
            alert('第一参数ele需要是一个DOM元素对象');
            throw new Error('第一参数ele需要是一个DOM元素对象');
        }
        if(typeof strClass != 'string'){
            alert('第二参数必须为string类型');
            throw new Error('第二参数必须为string类型');

        }

        var reg=new RegExp("(?:^| )" + strClass + "(?: |$)","g");
        ele.className = ele.className.replace(reg,'').trim();
    };

    //将小数转化为两位的
    changeTwoDecimal_f= function (floatvar)
    {
        var f_x = parseFloat(floatvar);
        if (isNaN(f_x))
        {
            alert('function:changeTwoDecimal->parameter error');
            return false;
        }
        var f_x = Math.round(f_x*100);

        return f_x;
    };



    var isApp = function() {
        if(getQueryString("appflag")!=1){
            return false;
        }
        return true;
    }
//若是微信浏览器环境，则不能有指示分享的图标设计
    if(isApp()){
        btnWeixinTimeline.style.display = 'block';
    }else {
        btnWeixinTimeline.style.display = 'none';
    }

    document.getElementById("alert-del").onclick = function(){
        document.getElementById("alert-del").style.display='none';
        document.getElementById("alert").style.display='none';
        document.getElementById("alert-bg").style.display='none';
    }
//音乐开关设计
    base.touch(pauseMusic,function(ev){
        if(pauseMusic.className === "stopmusic"){
            removeClass(pauseMusic,"stopmusic");
            addClass(pauseMusic,"startmusic");
            document.querySelector("audio").pause();
            pauseMusic.querySelector("img").setAttribute("src", "http://static.diditaxi.com.cn/activity/pages/driver_3th/images/stopmusic.png");
        }else{
            removeClass(pauseMusic,"startmusic");
            addClass(pauseMusic,"stopmusic");
            document.querySelector("audio").play();
            pauseMusic.querySelector("img").setAttribute("src", "http://static.diditaxi.com.cn/activity/pages/driver_3th/images/startmusic.png");
        }
    });
    document.querySelector("audio").pause();

    setTimeout(function(){
        document.querySelector("audio").play();
    },1000);



//司机端内分享
    var connectDidiJSBridge = function(callback) {
            if (window.DidiJSBridge) {
                callback(DidiJSBridge)
            } else {
                appFlag=1;
                document.addEventListener("DidiJSBridgeReady", function() {
                        callback(DidiJSBridge)
                    }, false)
            }
        };

    var shareData = {
        share_url: url, // 分享出去后用户点开所指向的链接地址，比如填写http://www.baidu.com 那分享出去别的用户点击进来会显示百度的页面，一定要加http://或https://前缀
        share_icon_url: 'http://static.diditaxi.com.cn/activity/pages/driver_3th/images/share.jpg', // 分享的出去后所显示的图标的链接   ，如下图所示的2
        share_img_url: '', //分享的大图  （不必理会）
        share_title: '我的的士生活之滴滴三年那些事', // 分享出去时所显示的标题             如下图所示的1
        share_content: '我在滴滴出租车以达到［'+ mh_memory + '］的境界，快来围观吧！', // 分享出去时所显示的描述           如下图所示的3   （分享到朋友圈时描述是不会显示的）
        share_from: '滴滴打车' // 分享来源，非必填,默认为滴滴打车
    };

    var didi = {
        initShare: function(shareData, callback) {
            if (!shareData) {
                shareData = default_data
            }
            if (typeof callback !== "function") {
                callback = function() {}
            }
            var entranceCfg = {
                entrance: {
                    icon: "http://static.xiaojukeji.com/api/img/i-webview-entrance.png"
                },
                buttons: [{
                    type: "share_weixin_timeline",
                    name: "微信朋友圈",
                    data: shareData,
                    callback: callback
                }, {
                    type: "share_weixin_appmsg",
                    name: "微信好友",
                    data: shareData,
                    callback: callback
                }, {
                    type: "page_refresh",
                    name: "刷新"
                }]
            };
            connectDidiJSBridge(function(bridge) {
                    if (typeof bridge === "undefined") {
                        return;
                    }
                    bridge.callHandler("init_entrance", JSON.stringify(entranceCfg));
                    //判断是否jsbridge对象是否存在，不存在则代表旧版本appVer＝1，存在代表新版本appVer＝0
                    (!window.DidiJSBridge)?appVersion=1:appVersion=0;

                }
            )
        }
    };

    didi.initShare(shareData);

    didi.invoke_entrance=function(){
        connectDidiJSBridge(function(bridge) {
                if (typeof bridge === "undefined") {
                    return;
                }
                bridge.callHandler("invoke_entrance");
            }
        );
    }


    btnWeixinTimeline.onclick = function() {
        if (appVersion==1){
            document.getElementById("alert").style.display = "block";
            document.getElementById("alert-del").style.display ="block";
            document.getElementById("alert-bg").style.display='block';
            document.getElementById("alert-bg").style.opacity='0.7';
        }else {
            didi.invoke_entrance();
        }
    }

    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        var share_config = {
            general_config: {
                img_url: 'http://static.diditaxi.com.cn/activity/pages/driver_3th/images/share.jpg',
                sharetitle: "我的的士生活之滴滴三年那些事",
                sharedesc: '我在滴滴出租车以达到［'+ mh_memory + '］的境界，快来围观吧！',
                link: url
            }
        };

        var obj = share_config.general_config;
        // 分享给朋友
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {

            WeixinJSBridge.invoke('sendAppMessage', {
                "appid": "wx69b6673576ec5a65",
                "img_url": obj.img_url,
                "img_width": "",
                "img_height": "",
                "link": obj.link,
                "title": obj.sharetitle,
                "desc": obj.sharedesc
            }, function(res) {

            });
        });

        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function(argv) {

            WeixinJSBridge.invoke('shareTimeline', {
                "img_url": obj.img_url,
                "img_width": "",
                "img_height": "",
                "link": obj.link,
                "title": obj.sharetitle,
                "desc": obj.sharedesc
            }, function(res) {

            });
        });
    });


    ;(function(){

        document.getElementsByClassName("swiper-container")[0].style.display="none";
        var globalCount = document.getElementsByTagName("img").length;
        var count = 0;

        for (var i=0 ; i< globalCount ; i++){
            var img = new Image();
            img.src=document.getElementsByTagName("img")[i].src;
            img.onload=function(){
                count++;
                var percentage = count/globalCount;
                percentage=changeTwoDecimal_f(percentage);
                document.getElementsByClassName("jindu")[0].innerHTML=(percentage + "%");
                if (percentage >99){
                    document.getElementsByClassName("loadpage")[0].style.display="none";
                    document.getElementsByClassName("swiper-container")[0].style.display="block";

                    var mySwiper = new Swiper('.swiper-container',{
                        paginationClickable: true,
                        mode: 'vertical',
                    });
                }
            }
        }

    })();



});