document.addEventListener("DOMContentLoaded", function(ev) {
    var dialog = null,
        dialogDetail = null;

    dialog = new dd.dialog.Fn('<div class="loading-logo"></div>');
    dialog.show();

    var doc = document,
        main = doc.getElementById("main"),
        head = doc.getElementById("head"),
        declare = doc.getElementById("declare"),
        draw = doc.getElementById("draw");
       
    var token = doc.getElementById("token").value,
        info = doc.getElementById("info").value,
        productId = doc.getElementById("id").value, //商品id
        lng = doc.getElementById("lng").value,
        lat = doc.getElementById("lat").value,
        statistics = doc.getElementById("statistics").value,
        detail = doc.getElementById("detail").innerHTML,//新数据
        infor_data = txtToJson(info),
        actType = infor_data.detail.activity_type,
        describe2 = null,
        goodsCount2 = null,
        btn2 = null;//ios假象的按钮
       
    localStorage.state = "true";
    window.scrollTo(0,1);//防止立即兑换按钮一进来在顶部

    //按钮状态
    var btnState = {
        "noFull": {
            msg: "您的积分不够,打车赚取更多积分",
            icon: "s-exchange.png",
            width: "28px",
            height: "23px",
            val: "确定"
        },
        "win": {
            msg: "恭喜您,中奖啦~",
            icon: "yes_win.png",
            width: "30px",
            height: "26px",
            val: "查看详情",
            url: "/imall/change_log/index?token=" + token + "&product_id=" + productId + "&lat=" + lat + "&lng" + lng
        },
        "noWin": {
            msg: "很遗憾呢,没有中奖~",
            icon: "no_win.png",
            width: "30px",
            height: "26px",
            val: "我知道了"
        },
        "timeout": {
            msg: "请求超时",
            icon: "error.png",
            width: "7px",
            height: "42px",
            val: "我知道了"
        }
    };

    function iosFn(cbFn){
        diff_platform({
            android: function() {
                
            },
            ios: function() {
                cbFn();
            }
        });
    }

    window.addEventListener('popstate', function(ev) {
        dialogDetail.hide();
        dialog.hide();
    }, false);

    //初始化页面
    if (infor_data.errno == 0) {
        dataInit();
        posFixed();
    } else {
        alertBox(btnState.error);
    }

    window.onscroll=window.onresize=function()
    {
        posFixed();
    };

    //数据初始化
    function dataInit(){
        var detailObj = infor_data.detail,
            desCont = detailObj.description,//老数据
            shareObj = {
                "shareId":getQuerySting().id,
                "shareImg":detailObj.list_picture_url,
                "shareTitle":detailObj.name
            };

        var html = template('btn_list', infor_data);//中间按钮的一行
        head.innerHTML = html;

        var imgUrl = doc.getElementById("imgUrl"),
            name = doc.getElementById("name"),
            merchant_name = doc.getElementById("merchant_name"),
            describe = doc.getElementById("describe"),
            goodsCount = doc.getElementById("goods_count"),
            btn = doc.getElementById("btn");

        //分享详情页
        wx_app_shareFn(shareObj);

        //loading
        imgUrl.onload = function() {
            dialog.hide();
        }

        iosFn(function(){
            describe2 = doc.getElementById("describe2");
            goodsCount2 = doc.getElementById("goods_count2");
            btn2 = doc.getElementById("btn2");
            addClass(describe,"des1");
            removeClass(describe2,"hide");
        });

        /*为了兼容老数据*/
        if(detail == "" && desCont.length != 0){
            var desLength = desCont?infor_data.detail.description.length:0,
                myHtml = '';

            //这个不做temple的原因，是a标签的不起跳转作用
            for (var i = 0; i < desLength; i++) {
                if(desCont[i].title && desCont[i].cont){
                    var str = "<div class='content'><p>" + desCont[i].title + "：</p><p>" + desCont[i].cont + "</p></div>";
                    myHtml += str;
                }
            }
            main.innerHTML = myHtml;
           
        }else{
            main.innerHTML = detail;
        }

        diff_platform({
            android: function() {},
            ios: function() {
                declare.innerHTML += "<div>活动由滴滴打车提供，与设备生产商Apple Inc.公司无关</div>";
            }
        });

        availableBtn(btn);
    }

    //分享
    function wx_app_shareFn(shareObj){
        /*分享相关*/
        var shareData = {
            share_url: "http://pay.xiaojukeji.com/api/v2/weixinapi?page=middlepage&productid="+shareObj.shareId, // 分享出去后用户点开所指向的链接地址
            share_icon_url: shareObj.shareImg, // 分享的出去后所显示的图标的链接   ，如下图所示的2
            share_img_url: shareObj.shareImg, //分享的大图  （不必理会）    
            share_title: '我在滴滴积分商城发现了【' + shareObj.shareTitle + '】速去抢兑', // 分享出去时所显示的标题             如下图所示的1
            share_content: '滴滴积分商城好礼换不停。', // 分享出去时所显示的描述           如下图所示的3   （分享到朋友圈时描述是不会显示的）
            share_from: '滴滴打车' // 分享来源，非必填,默认为滴滴打车
        };

        if (window.didi) {
            didi.initShare(shareData, function() {});
        }

        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

            WeixinJSBridge.call("showOptionMenu");
            WeixinJSBridge.call('hideToolbar');
            var share_config = {
                general_config: {
                    img_url: shareObj.shareImg, //小图的链接
                    sharetitle: '我在滴滴积分商城发现了【' + shareObj.shareTitle + '】速去抢兑',
                    sharedesc: '滴滴积分商城好礼换不停。',
                    link: "http://pay.xiaojukeji.com/api/v2/weixinapi?page=middlepage&productid="+shareObj.shareId //分享出去的链接地址
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
    }

    /*吸顶效果*/
    function posFixed(){
        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop,
            clientW = document.documentElement.clientWidth,
            imgW = 750,
            imgH = 422, //图片宽高
            showH = parseInt(imgH*clientW/imgW);
        if(scrollTop >= showH){
            addClass(describe,"pos_fixed");   
        }else{
            removeClass(describe,"pos_fixed"); 
        }
    }

    //可用按钮点击
    function availableBtn(btn) {
        if(btn && btn.className == "btn-gray") return;
        if (actType == 0) { //兑换,二次确认
            touch(btn, function(ev) {
                dd.dialog.confirm({
                    text: "确认兑换",
                    icon: {
                        url: "/static/activity/img-mall/s-exchange.png",
                        width: "28px",
                        height: "23px"
                    },
                    confirm: {
                        handler: function(ev) {
                            dialogDetail = new dd.dialog.Fn('<div class="loading-logo"></div>');
                            dialogDetail.show();
                            ajaxBtn();
                        }
                    }
                });
            }, false);

        } else if (actType == 1) { //抽奖
            touch(btn, function(ev) {
                winMove();
                ajaxBtn();
            }, false);
           
        } else {
            touch(btn, function(ev) {
                alertBox(btnState.error);
            }, false);
            
        }
    }

    //点击请求
    function ajaxBtn() {
        ajax({
            method: "GET",
            timeout: {
                millisecond: 10000,
                callback: function() {
                    btn.className = "btn-org";
                    alertBox(btnState.timeout);
                }
            },
            url: "/imall/exchange/index?token=" + token + "&product_id=" + productId + "&lng=" + lng + "&lat=" + lat + "&" +statistics,
            succFunc: function(data) {
                var data = txtToJson(data),
                    errno = data.errno,
                    errmsg = data.errmsg;

                //swith  case
                if (errno == 100) {
                    location.href = "/imall/change_log/index?token=" + token + "&product_id=" + productId + "&lng=" + lng + "&lat=" + lat;
                } else if (errno == 101 || errno == 201) {
                    alertBox(btnState.noFull);
                } else if (errno == 200) {
                    setTimeout(function() {
                        draw.style.display = "none";
                        alertBox(btnState.win);
                    }, 3000);
                } else if (errno == 202) {
                    setTimeout(function() {
                        draw.style.display = "none";
                        alertBox(btnState.noWin);
                    }, 3000);
                } else if (errno == 2005 || errno == 3002 || errno == 3003 || errno == 3004 || errno == 3005) {
                    alertBox(errmsg);
                } else {
                    alertBox("出了点问题稍后再试");
                }
            },
            failFunc: function() {
                draw.style.display = "none";
                alertBox(btnState.error);
                btn.className = "btn-org";
            }
        });
    }

    //抽奖动画
    function winMove() {
        var dialogWin = dd.dialog.Fn(draw);
        dialogWin.show();
    };

    //弹窗
    function alertBox(alertAttr) {
        var iconBg = alertAttr.icon || "error.png";
        dd.dialog.alert({
            icon: {
                url: "/static/activity/img-mall/" + iconBg,
                width: alertAttr.width || "7px",
                height: alertAttr.height || "42px"
            },
            tip: alertAttr.msg || alertAttr,
            title: "",
            btn: {
                val: alertAttr.val,
                handler: function(ev) {
                    alertAttr.url && (location.href = alertAttr.url);
                }
            }
        });
    }

}, false);
