!function (window, undefined) {

    var base = dd.base || {};
    var obj = base.getQueryStr();
    var default_data = {
        share_url: "http://www.xiaojukeji.com",
        share_icon_url: "http://static.xiaojukeji.com/webapp/images/taxi.png",
        share_img_url: "http://diditaxi.com.cn/share/images/na_landing_kuhang/02.png",
        share_title: "滴滴一下，美好出行",
        share_content: "滴滴打车，美好出行",
        share_from: ""
    };

    function main() {
        return {
            doc: document,
            global_touch: false,
            audio:document.querySelector('audio')|| undefined,
            isApp: function () {
                if (obj.datatype === "1" || obj.datatype === "101" || /didi\.passenger\/\d/.test(navigator.userAgent)) {
                    return true;
                } else {
                    return false;
                }
            },
            isIOS: function () {
                if (navigator.userAgent.match(/(iphone)|(ipad)/i)) {
                    return true;
                } else {
                    return false;
                }
            },
            //解决ios端内不能自动调起音乐问题
            iosMusicTouch: function () {
                //alert(this.isApp());
                if (this.isApp() && this.isIOS() && typeof(this.audio)!='undefined' && this.global_touch == false) {
                    var that = this;
                    this.doc.body.addEventListener('touchend', function () {
                        if (that.global_touch == false) {
                            that.global_touch = true;
                            document.querySelector('audio').play();
                        }
                    }, false)
                }
            },
            ajax: function (opt) {
                var xmlHttp = new XMLHttpRequest();
                var obj2Body = function (obj) {
                    if (!obj) return;
                    var res = '';
                    for (var p in obj) {
                        if (obj.hasOwnProperty(p)) res += '&' + p + '=' + obj[p] + '';
                    }
                    return res.replace(/^\&/, "");
                };

                xmlHttp.open(opt.method, opt.url);
                if (opt.method.toUpperCase() === 'GET') {
                    xmlHttp.send(null);
                } else if (opt.method.toUpperCase() === 'POST') {
                    var body = opt.data ? obj2Body(opt.data) : "";
                    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xmlHttp.send(body);
                }
                //xmlHttp.send(JSON.stringify(opt.data));
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        if (xmlHttp.status == 200) {
                            opt.succFunc && opt.succFunc(xmlHttp.responseText);
                        }
                        else {
                            opt.failFunc && opt.failFunc(xmlHttp.responseText);
                        }
                    }
                }
            },

            //音乐开关
            //html <div class="stopmusic" id="playmusic"><img src="images/startmusic.png"></div>
            // 使用实例
            //actMain.pauseMusic('#playmusic','startmusic','stopmusic',"images/startmusic.png","images/stopmusic.png");

            pauseMusic: function (id, startmusic, stopmusic, imgsrcStart, imgsrcStop) {
                var musicId = document.querySelector(id);
                var that=this;
                    base.touch(musicId, function () {
                    if (musicId.className == stopmusic) {
                        musicId.className = startmusic;
                        musicId.querySelector('img').setAttribute('src', imgsrcStop);
                        that.audio.pause();
                    } else if (musicId.className == startmusic) {
                        musicId.className = stopmusic;
                        musicId.querySelector('img').setAttribute('src', imgsrcStart);
                        that.audio.play();
                    }
                });
                this.iosMusicTouch();
            },
            connectDidiJSBridge : function(callback) {
                if (window.DidiJSBridge) {
                    callback(DidiJSBridge)
                } else {
                    document.addEventListener("DidiJSBridgeReady", function() {
                            callback(DidiJSBridge)
                        }
                        , false)
                }
            }
        }
    }
    window.actMain = main();
    //actMain.iosMusicTouch();

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
                    type: "share_sina_weibo",
                    name: "新浪微博",
                    data: shareData,
                    callback: callback
                }, {
                    type: "page_refresh",
                    name: "刷新"
                }]
            };
            actMain.connectDidiJSBridge(function(bridge) {
                    if (typeof bridge === "undefined") {
                        return
                    }
                    bridge.callHandler("init_entrance", JSON.stringify(entranceCfg));
                    bridge.callHandler("show_entrance")
                }
            )
        },
        nativeClose: function (callback) {
            if (typeof callback !== "function") {
                callback = function () {}
            }
            connectDidiJSBridge(function (bridge) {
                if (typeof bridge === 'undefined') {
                    return;
                }
                bridge.callHandler('nativeClose');
            });
        }
    };
    window.didi = didi;

    var weixin = {
        initShare: function (shareData, callFn) {
            if (!shareData) {
                shareData = default_data
            }

            document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

                WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                    WeixinJSBridge.invoke('sendAppMessage', {
                        "appid": "wx69b6673576ec5a65",
                        "img_url": shareData.share_icon_url,
                        "img_width": "",
                        "img_height": "",
                        "link": shareData.share_url,
                        "title": shareData.share_title,
                        "desc": shareData.share_content
                    }, function (res) {
                        callFn(res);
                    });
                });
                // 分享到朋友圈
                WeixinJSBridge.on('menu:share:timeline', function (argv) {

                    WeixinJSBridge.invoke('shareTimeline', {
                        "img_url": shareData.share_icon_url,
                        "img_width": "",
                        "img_height": "",
                        "link": shareData.share_url,
                        "title": shareData.share_title,
                        "desc": shareData.share_content
                    }, function (res) {
                        callFn(res);
                    });
                });
            });
        }


    };
    window.weixin = weixin;



}(window);