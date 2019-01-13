document.addEventListener("DOMContentLoaded", function(ev) {
    var dialog = null,
        dialogDetail = null;

    dialog = new dd.dialog.Fn('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>');
    dialog.show();
    shareFn();

    var doc = document,
        btn = doc.getElementById("btn"),
        main = doc.getElementById("main"),
        fix_main = doc.getElementById("fix_main"),
        title = doc.getElementById("title"),
        goodsCount = doc.getElementById("goods_count"),
        imgUrl = doc.getElementById("imgUrl"),
        draw = doc.getElementById("draw");

    var token = doc.getElementById("token").value,
        info = doc.getElementById("info").value,
        productId = doc.getElementById("id").value, //商品id
        lng = doc.getElementById("lng").value,
        lat = doc.getElementById("lat").value,
        infor_data = txtToJson(info),
        actType = infor_data.detail.activity_type;

    localStorage.state = "true";

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

    window.addEventListener('popstate', function(ev) {
        dialogDetail.hide();
        dialog.hide();
    }, false);

    //loading
    imgUrl.onload = function() {
        dialog.hide();
    }



    //初始化页面
    if (infor_data.errno == 0) {
        var desCont = infor_data.detail.description;
        var desLength = infor_data.detail.description.length;
        var myHtml = '';
        for (var i = 0; i < desLength; i++) {
            var str = "<div class='content'><p>" + desCont[i].title + "：</p><p>" + desCont[i].cont + "</p></div>";
            myHtml += str;
        }
        diff_platform({
            android: function() {},
            ios: function() {
                fix_main.innerHTML += "<div class='content'><p>活动说明：</p><p>活动由滴滴打车提供，与设备生产商Apple Inc.公司无关</p></div>";
            }
        });

        main.innerHTML = myHtml;

        var detail = infor_data.detail;
        title.innerHTML = detail.name;
        imgUrl.src = detail.detail_picture_url;
        goodsCount.innerHTML = detail.score;
        btn.innerHTML = infor_data.btnText;
    } else {
        alertBox(btnState.error);
    }

    //按钮颜色
    if (infor_data.btnStatus == 0) {
        btn.className = "btn-org";
        availableBtn();
    } else {
        btn.className = "btn-gray";
    }

    //可用按钮点击
    function availableBtn() {
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
                            dialogDetail = new dd.dialog.Fn('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>');
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
            url: "/imall/exchange/index?token=" + token + "&product_id=" + productId + "&lng=" + lng + "&lat=" + lat,
            succFunc: function(data) {
                var data = txtToJson(data);
                var errno = data.errno;
                var errmsg = data.errmsg;

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
