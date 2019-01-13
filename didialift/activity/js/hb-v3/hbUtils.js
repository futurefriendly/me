(function(base,dialog) {

    var hbUtils = {};
    window.hbUtils = hbUtils;

    // didi app config
    var didiAppCfg = {
        ios: {
            "packageName": "com.xiaojukeji.didi",
            "packageUrl": "diditaxi:passenger",
            "downloadUrl": "https://itunes.apple.com/cn/app/di-di-da-che-zhi-jian-shang/id554499054?ls=1&mt=8"
        },
        android: {
            "packageName": "com.sdu.didi.psnger",
            "packageUrl": "didipasnger://didi_apk_intalled_scheme",
            "downloadUrl": "http://dldir1.qq.com/diditaxi/apk/didi_psngr.apk"
        }
    };

    // 兼容type为tel的placeholder特性
    hbUtils.compatibilityPlaceHolder = function(array) {
        if (!array || !array.length) return;

        // 是否支持placeholder
        var hasPlaceHolder = function() {
            return ('placeholder' in document.createElement('input'));
        };

        var phcfg = {
            placeholder: '#888',
            fill: '#666',
            tip: '请输入您的手机号'
        };

        // 获得焦点
        var focus = function(e) {
            e.target.value = '';
            e.target.style.color = phcfg.fill;
        };

        // 失去焦点
        var blur = function(e) {
            e.target.value = '';
            e.target.color = phcfg.placeholder;
        };

        // 处理兼容
        var doCompact = function(txtBox) {
            if (!hasPlaceHolder()) {
                txtBox.value = phcfg.tip;
                txtBox.style.color = phcfg.placeholder;
                txtBox.addEventListener('focus', focus, false);
                txtBox.addEventListener('blur', blur, false);
            } else {
                txtBox.style.color = phcfg.fill;
            }
        };

        for (var i = array.length - 1; i >= 0; i--) {
            doCompact(array[i]);
        }
    };

    // 点击下载滴滴客户端时候的按钮 
    hbUtils.didiAppHandler = function(e,callback) {
        dialog.loading('正在加载', 3000);
        var params;
        base.diffPlatform({
            ios: function() {
                params = didiAppCfg.ios;
            },
            android: function() {
                params = didiAppCfg.android;
            }
        });

        if(typeof callback === "function"){
            callback();
        }

        setTimeout(function() {
            if(typeof WeixinJSBridge!="undefined"){
                WeixinJSBridge.invoke('getInstallState', params, function(e) {
                    var msg = e.err_msg;
                    window.parent.location.href = (msg.indexOf("get_install_state:yes") > -1) ? params.packageUrl : params.downloadUrl;
                });
            }else{
                window.parent.location.href='http://pay.xiaojukeji.com/share/tmp_download.html';
            }
        }, 200);
    };

    // 分享按钮的handler
    hbUtils.showShadeLayerHandler = function(e,callback) {
        if (e.target.className !== 'btn-orange') return;
        
        //如果是在手Q上则点击分享按钮直接调起手Q分享面板
        var navig = window.navigator.userAgent;
        var navTag="QQ";
        //base.diffPlatform({
        //    ios:function(){
        //        navTag="QQ";
        //    },
        //    android:function(){
        //        navTag="MQQBrowser";
        //    }
        //});
        if(navig.indexOf(navTag)!=-1 && navig.indexOf('MicroMessenger')==-1){
            if(typeof callback==="function") {
                callback();
            }
            return;
        }

        var dvCover = document.getElementById('dv-cover');
        if (dvCover) {
            dvCover.style.height = document.documentElement.scrollHeight + 'px';
            dvCover.style.display = 'block';
        }
        //callback&&callback();
    };

    // 隐藏分享的蒙层
    hbUtils.hideShadeLayerHandler = function(e) {
        var ddCover = document.getElementById('dv-cover');
        if (ddCover) {
            ddCover.style.display = 'none';
        }
    };

    // 初始化微信对象
    hbUtils.initWeixin = function(callback) {
        var onBridgeReady = function() {
            if (!WeixinJSBridge) return;
            weixinObj = WeixinJSBridge;
            weixinObj.call("hideOptionMenu");
            weixinObj.call('hideToolbar');

            if (typeof callback === 'function') {
                callback();
            }
        };
        if (typeof WeixinJSBridge === 'undefined') {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady);
        } else {
            onBridgeReady();
        }
    };

    // 定义分享信息
    // 刘蕾说过，分享功能两个页面（抢红包，抢红包结果页面）都是一样的分享
    // 并且他说抢红包页面
    hbUtils.genShareInfo = function(obj) {
        if (obj.chk_share !== '1') return;

        var data = {
            link: obj.share_url || location.href,
            img_url: obj.share_img_url,
            title: obj.share_title,
            desc: obj.share_cont
        };

        return {
            appmsg: data,
            timeline: data
        };
    };

    hbUtils.map = function(array, callback) {
        var item = null;
        for (var i = array.length - 1; i >= 0; i--) {
            item = array[i];
            if (item) callback(item);
        }
    };

    hbUtils.iphoneType = function(){
        var device_height=parseInt(window.screen.height);
        if(device_height==480)return "ip4";
        if(device_height==568)return "ip5";
        if(device_height==667)return "ip6";
        if(device_height==736)return "ip6p";
    }


})(dd.base,dd.dialog);
