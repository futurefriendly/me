document.addEventListener('DOMContentLoaded', function(ev) {
    var doc = document,
        commit = doc.getElementById("commit"),
        getBtn = doc.getElementById("getBtn"),
        shopCode = doc.getElementById("shopCode"),
        cardCode = doc.getElementById("cardCode"),
        product_id = doc.getElementById("product_id").value;

    //按钮状态
    var btnState = {
        "isNull": {
            msg: "您所填写的信息不完整，请补充",
            icon: "error.png",
            width: "7px",
            height: "42px",
            val: "确定"
        },
        "timeout": {
            msg: "请求超时",
            icon: "error.png",
            width: "7px",
            height: "42px",
            val: "我知道了"
        },
        "fail":{
            msg: "服务器繁忙，稍后再试",
            icon: "error.png",
            width: "7px",
            height: "42px",
            val: "我知道了"
        },
        "succeed":{
            msg: "您已提交成功，兑换的里程将于24小时内到账",
            icon: "succeed.png",
            width: "31px",
            height: "31px",
            val: "我知道了"
        }
    };

    //领取兑换码
    touch(getBtn,function(){
        location.href = 'http://diditaxi.com.cn/imall/detail?id=' + product_id + '&token=' + getQuerySting().token + '&lat=' + getQuerySting().lat + '&lng=' + getQuerySting().lng;
    },false);

    //提交,防止穿透
    commit.addEventListener("click",function(ev){
        if(shopCode.value == "" || cardCode.value == ""){
            alertBox(btnState.isNull);
        }else{

            var dialog = null;
            dialog = new dd.dialog.Fn('<div class="loading-logo"></div>');
            dialog.show();

            ajax({
                method: "GET",
                url: "/imall/redeem/submit?memberNumber="+cardCode.value+"&code="+shopCode.value + '&token=' + getQuerySting().token + '&lat=' + getQuerySting().lat + '&lng=' + getQuerySting().lng,
                succFunc: function(data) {
                    dialog.hide();
                    var da = txtToJson(data);
                    if (da.errno == 0) {
                        alertBox(btnState.succeed);
                    } else {
                        btnState.other = {};
                        btnState.other["msg"]=da.errmsg;
                        btnState.other["width"]="7px";
                        btnState.other["height"]="42px";

                        alertBox(btnState.other);
                    }
                },
                failFunc: function() {
                    alertBox(btnState.fail);
                }
            });
        }
    },false);
    

    //弹窗
    function alertBox(alertAttr) {
        dd.dialog.alert({
            icon: {
                url: "/static/activity/img-mall/" + (alertAttr.icon||"error.png"),
                width: alertAttr.width,
                height: alertAttr.height
            },
            tip: alertAttr.msg,
            btn: {
                val: alertAttr.val,
                handler: function(ev) {
                    //alertAttr.url && (location.href = alertAttr.url);
                }
            }
        });
    }
    
}, false);