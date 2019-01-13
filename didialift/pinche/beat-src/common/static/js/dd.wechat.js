// 微信jssdk rely on dd.base.js
var wx_funcs = [];
function wx_connect(func) {

    if (typeof wx === "undefined") {
        wx_funcs.push(func);
    } else {
        func(wx);
    }
}
(function() {
    // 判断是否是微信来源
    if (!is_weixn()) return;

    var base = dd.base || {};

    // jssdk操作先获取js文件再获取签名
    base.loadJS('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function() {
        //调用完成sdk执行一个init方法
        getJsSdk(wx_funcs);
        // 获得微信jssdk
        function getJsSdk(wx_funcs) {
            base.ajax({
                method: "POST",
                data: {
                    url: encodeURIComponent(location.href)
                },
                url: "/pinche/wxApi/getJsSdkConfig",
                succFunc: function(j) {
                    var da = base.txtToJson(j);
                    if (da.errno == "0") {
                        var data = {
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: 'wxab524d83299d6c83', // 必填，公众号的唯一标识
                            timestamp: da.timestamp, // 必填，生成签名的时间戳
                            nonceStr: da.nonceStr, // 必填，生成签名的随机串
                            signature: da.signature, // 必填，签名，见附录1
                            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        };
                        wx.config(data);

                        wx.ready(function() {
                            for (var i = 0, len = wx_funcs.length; i < len; i++) {
                                wx_funcs[i](wx);
                            }
                        });
                    }
                },
                failFunc: function() {}
            });
        }
    });

    // 判断是否是微信
    function is_weixn() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        }
        return false;
    }

    // 是否是数组
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

})();
wx_connect(wx_share);

//开始调用jssdk的方法
function wx_share(wx) {
    var share_obj = {
        title: wxShare.title || '顺风出行，期待每一次的不期而遇。',
        desc: wxShare.desc || '滴滴顺风车车主有奖招募中，有车即可参与',
        link: wxShare.link || location.href,
        imgUrl: wxShare.imgUrl || "http://static.xiaojukeji.com/pinche/images/share.jpg"
    };
    // 微信消息
    wx.onMenuShareAppMessage({
        title: share_obj.title,
        desc: share_obj.desc,
        link: share_obj.link,
        imgUrl: share_obj.imgUrl,
        trigger: function(res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            //alert('用户点击发送给朋友');
        },
        success: function(res) {
            //alert('已分享');
        },
        cancel: function(res) {
            //alert('已取消');
        },
        fail: function(res) {
            //alert(JSON.stringify(res));
        }
    });
    //朋友圈分享
    wx.onMenuShareTimeline({
        title: share_obj.title,
        desc: share_obj.desc,
        link: share_obj.link,
        imgUrl: share_obj.imgUrl,
        trigger: function(res) {
            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
            // alert('用户点击分享到朋友圈');
        },
        success: function(res) {
            // alert('已分享');
        },
        cancel: function(res) {
            //alert('已取消');
        },
        fail: function(res) {
            //alert(JSON.stringify(res));
        }
    });
    //QQ分享
    wx.onMenuShareQQ({
        title: share_obj.title,
        desc: share_obj.desc,
        link: share_obj.link,
        imgUrl: share_obj.imgUrl,
        trigger: function(res) {
            //alert('用户点击分享到QQ');
        },
        complete: function(res) {
            //alert(JSON.stringify(res));
        },
        success: function(res) {
            // alert('已分享');
        },
        cancel: function(res) {
            //alert('已取消');
        },
        fail: function(res) {
            // alert(JSON.stringify(res));
        }
    });
}
