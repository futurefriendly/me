var wxObj = (function(undefined) {
    // 微信jssdk rely on dd.base.js

    // 判断客户端是否是微信端
    var is_weixn = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        }
        return false;
    };

    var base = dd.base || {},
        is_weixn_navigator = is_weixn(), //是否是微信环境
        wx_funcs = [],
        wx_failed_funcs = [];

    // 执行函数队列
    var funcs_invok = function(funcs) {
        for (var i = 0, len = funcs.length; i < len; i++) {
            typeof funcs[i] === "function" && funcs[i](wx);
        }
    };

    //ajax请求后端接口 验证微信JS-SDK
    var jssdk_init = function(sdk_funcs) {
        // jssdk操作先获取js文件再获取签名
        base.loadJS('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function() {

            // 获得微信jssdk
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

                        wx.ready(sdk_funcs.success); //成功执行

                        wx.error(sdk_funcs.failed); //失败执行
                    }
                },
                failFunc: function() {
                    sdk_funcs.failed()
                }
            });

        });
    };

    // 对外接口，执行微信环境相关函数，if(微信环境&&微信配置ok){ func(); } else{ failed_func(); } 
    var wx_connect = function(func, faild_func) {
        // 不是微信来源
        if (!is_weixn_navigator) {
            typeof faild_func === "function" && faild_func();
            return;
        }

        if (typeof wx === "undefined") { //可能环境未初始化 加入等待队列
            wx_funcs.push(func);
            wx_failed_funcs.push(faild_func);
        } else {
            typeof func === "function" && func(wx);
        }

    };

    //配置微信分享信息
    var wx_share_config = function() {
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
    };

    // 获得jssdk，成功函数，失败函数
    jssdk_init({
        success: function() {
            funcs_invok(wx_funcs);
        },
        failed: function(res) {
            funcs_invok(wx_failed_funcs);
        }
    }); //init jssdk

    //配置页面分享对象
    wx_connect(wx_share_config);

    return {
        wx_connect: wx_connect
    }
})();
