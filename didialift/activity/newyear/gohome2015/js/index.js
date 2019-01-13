(function() {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        var share_config = {
            general_config: {
                img_url: 'http://static.xiaojukeji.com/activity/newyear/gohome2015/img/globle-logo.png?1502091805',
                sharetitle: location.search.indexOf("shareflag=1") === -1 ? "你若回家， 就是过年！" : "你妈逼你回家了么？",
                sharedesc: "春节，等你回家，把家点亮",
                //link: gloBlink
                link: location.href
            }
        };
        var obj = share_config.general_config;
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
            }, function(res) {});
        });
    });
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
    var docuH = document.documentElement.clientHeight,
        docuW = document.documentElement.clientWidth,
        firLoadImg = document.getElementsByClassName('firLoad');
    secLoadImg = document.getElementsByClassName('secLoad');
    allMoveBox = document.getElementsByClassName('swiper-slide');
    oShare = document.getElementsByClassName('share')[0];
    oDownload = document.getElementsByClassName("eight-slide-5")[0];
    document.getElementsByClassName('swiper-container')[0].style.height = docuH + 'px';
    //控制第三页领子，头图片大小
    document.getElementsByClassName('two-slide-3')[0].style.height = 56 * docuH / 1136 + 'px';
    document.getElementsByClassName('two-slide-3')[0].style.width = 53 * docuW / 640 + 'px';
    document.getElementsByClassName('two-slide-4')[0].style.height = 80 * docuH / 1136 + 'px';
    document.getElementsByClassName('two-slide-4')[0].style.width = 67 * docuW / 640 + 'px';
    document.getElementsByClassName('two-slide-5')[0].style.height = 83 * docuH / 1136 + 'px';
    document.getElementsByClassName('two-slide-5')[0].style.width = 66 * docuW / 640 + 'px';
    var audio = document.getElementById('audio');
    var oVoice = document.getElementById("voice");
    //添加类
    var addClass = function(ele, strClass) {
        var reg = new RegExp("(^| )" + strClass + "( |$)");
        if (reg.test(ele.className)) {
            //如果此类样式已经存在，则什么也不需要做
        } else { //不存在
            ele.className = ele.className.trim() + " " + strClass;
        }
    };
    //删除类
    var removeClass = function(ele, strClass) {
        if (!(ele && ele.nodeType == 1)) {
            alert('第一参数ele需要是一个DOM元素对象');
            throw new Error('第一参数ele需要是一个DOM元素对象');
        }
        if (typeof strClass != 'string') {
            alert('第二参数必须为string类型');
            throw new Error('第二参数必须为string类型');
        }
        var reg = new RegExp("(^| )" + strClass + "( |$)", "g");
        ele.className = ele.className.replace(reg, '').trim();
    };
    //iPhone自动播放音乐
    var music = document.getElementById("audio");

    function playAudio() {
        // Check for audio element support.
        if (!window.HTMLAudioElement) return;
        try {
            audio.currentTime = 0;
            if (audio.paused) {
                audio.play();
                removeClass(oVoice, 'pause');
                addClass(oVoice, 'play');
            } else {
                audio.pause();
                removeClass(oVoice, 'play');
                addClass(oVoice, 'pause');
            }
        } catch (e) {}
    };
    //播放暂停音乐   
    oVoice.onclick = function() {
        if (music.paused) {
            music.play();
            removeClass(oVoice, 'pause');
            addClass(oVoice, 'play');
        } else {
            music.pause();
            removeClass(oVoice, 'play');
            addClass(oVoice, 'pause');
        };
    };
    //加载前几屏背景
    for (var i = 0; i < firLoadImg.length; i++) {
        firLoadImg[i].style.backgroundImage = firLoadImg[i].dataset.url;
    }
    //加载页
    var imgObj = new Image();
    imgObj.src = "../newyear/gohome2015/img/page-1.jpg";
    imgObj.onload = function() {
        for (var i = 0; i < secLoadImg.length; i++) {
            secLoadImg[i].style.backgroundImage = secLoadImg[i].dataset.url;
        }
        setTimeout(function() {
            document.getElementsByClassName('loading')[0].style.display = 'none';
            addClass(allMoveBox[0], 'slide-move');
        }, 1000);

    }
    var diffPlatform = function(opt) {
        var ua = navigator.userAgent
        var callFn = function(fn) {
            if (typeof fn === "function") fn();
        };
        if ((ua.match(/(Android)/i))) {
            callFn(opt.android);
        } else if ((ua.match(/(iPhone|iPod|ios|iPad)/i))) {
            callFn(opt.ios);
        } else if ((ua.match(/(Windows phone)/i))) {
            callFn(opt.wp);
        } else {
            callFn(opt.others);
        }
    };
    //didiAppHandler;
    oDownload.onclick = function(e) {
        var params;
        diffPlatform({
            ios: function() {
                params = didiAppCfg.ios;
            },
            android: function() {
                params = didiAppCfg.android;
            }
        });
        setTimeout(function() {
            if (typeof WeixinJSBridge != "undefined") {
                WeixinJSBridge.invoke('getInstallState', params, function(e) {
                    var msg = e.err_msg;
                    // location.href = (msg.indexOf("get_install_state:yes") > -1) ? params.packageUrl : params.downloadUrl;
                    location.href = params.packageUrl;
                });
            } else {
                location.href = 'http://pay.xiaojukeji.com/share/tmp_download.html';
            }
        }, 200);
    };
    var mySwiper = new Swiper('.swiper-container', {
        mode: 'vertical', //'vertical', 垂直  'horizontal',水平
        onSlideChangeEnd: function() { //当滑块滑到下一块时
            var thisDiv = mySwiper.activeSlide();
            for (var i = 0; i < allMoveBox.length; i++) {
                removeClass(allMoveBox[i], 'slide-move');
            }
            addClass(thisDiv, 'slide-move');
            // localStorage.gohomePageIndex = thisDiv.index();
        }
    });
    // var pageIdx = localStorage.gohomePageIndex;
    // pageIdx&&mySwiper.swipeTo(pageIdx);
    addClass(oVoice, 'play');
    playAudio();
})()
