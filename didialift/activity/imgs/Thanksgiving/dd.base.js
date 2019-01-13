;
(function (window, undefined) {
    var dd = window.dd || {};
    if (dd && dd.base) return;

    //bridge是否初始化
    var _isBridgeInit = false;

    window.dd = dd; //注册dd命名空间到window下
    var b = dd.base || {}; // 定义base对象

    //触摸
    b.touch = function (ele, cb) {
        if (!ele || typeof cb !== 'function') return;

        ele.addEventListener('touchstart', function (ev) {
            ev.target.focus();
            ev.stopPropagation(); //阻止冒泡
        }, false);

        ele.addEventListener('touchmove', function (ev) {
            ev.target.setAttribute("moved", "true");
        }, false);

        ele.addEventListener('touchend', function (ev) {
            ev.target.blur();
            if (ev.target.getAttribute("moved") !== "true") {
                cb(ev);
            } else {
                ev.target.setAttribute("moved", "false");
            }
        }, false);
        //ele.addEventListener('click', function (ev) {
        //
        //
        //    cb(ev);
        //
        //}, false);
    };

    //读取url，遍历成对象
    b.getQueryStr = function () {
        var item, key, val, res = {};
        var queryStr = (location.search.length) ? location.search.substring(1) : '';

        if (!queryStr) return res;
        if (queryStr.indexOf('&') === -1 && queryStr.indexOf('=') > -1) {
            item = queryStr.split('=');
            key = decodeURIComponent(item[0]);
            val = decodeURIComponent(item[1]);
            if (key) res[key] = val || "";
            return res;
        }
        if (queryStr.indexOf('&') > -1) {
            items = queryStr.split('&');
            for (var i = 0, len = items.length; i < len; i++) {

                var paramRe = /(\w+)=([\s\S]{0,})/img.exec(items[i]);
                key = decodeURIComponent(paramRe[1]);
                val = decodeURIComponent(paramRe[2]);
                if (key) res[key] = val;
            }
            ;
            return res;
        }
    };

    //ajax get
    b.getJson = function (opt) {
        var xmlHttp;

        function createxmlHttpRequest() {
            if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
        }

        createxmlHttpRequest();
        xmlHttp.open("GET", opt.url);
        xmlHttp.send(null);
        xmlHttp.onreadystatechange = function () {
            if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)) {
                opt.succFunc(xmlHttp.responseText);
            } else {
                opt.failFunc(xmlHttp.responseText);
            }
        }
    };

    //加类
    b.addClass = function (ele, strClass) {
        var reg = new RegExp("(?:^| )" + strClass + "(?: |$)");
        if (reg.test(ele.className)) {
            //如果此类样式已经存在，则什么也不需要做
        } else { //不存在
            ele.className = ele.className.trim() + " " + strClass;
        }
    };

    //是否有类
    b.hasClass = function (ele, strClass) {
        var reg = new RegExp("(?:^| )" + strClass + "(?: |$)");
        if (reg.test(ele.className)) {
            return true;
        } else { //不存在
            return false;
        }
    };

    //删类
    b.removeClass = function (ele, strClass) {
        var reg = new RegExp("(?:^| )" + strClass + "(?: |$)", "g");
        ele.className = ele.className.replace(reg, '').trim();
    };

    //弹出模块
    b.alert = function (msg) {
        var alertMask = document.createElement('div');
        alertMask.id = 'd-wall';
        var alertBox = '<div id="d-wrap" style="width: 280px; text-align: center; top: 179px; left: 20px; display: inline-block; background: rgb(255, 255, 255);"><div class="alert"><p class="d-icon"><img src="http://static.xiaojukeji.com/webapp/images/i-plaint.png" style="width:8px;height:36px;vertical-align:middle;"></p><div class="d-tip" style="color:#333;font-size:1.6rem;">' + msg + '</div><div class="d-btns clearfix"><a class="btn-orange" id="dd-btn-close">确定</a></div></div></div>';
        alertMask.innerHTML = alertBox;
        document.querySelector('body').appendChild(alertMask);
        alertMask.addEventListener('touchend', function () {
            document.querySelector('body').removeChild(alertMask);
        });
    };

    //显示
    b.show = function (ele) {
        ele.style.display = 'block';
    };

    //隐藏
    b.hide = function (ele) {
        ele.style.display = 'none';
    };

    // //jsBridge初始化
    // document.addEventListener('DidiJSBridgeReady', function() {
    //     //bridge对象初始化
    //     _isBridgeInit = true;
    //     DidiJSBridge.init();
    // });
    // setInterval()

    var _bridgeQueue = [];

    //和native通信，name：约定的apiname，json：传参
    b.bindNativeRedirect = function (name, json) {
        if (window.DidiJSBridge) {
            try {
                DidiJSBridge.callHandler(name, JSON.stringify(json));

            } catch (ex) {
                alert(ex);
            }
        } else {
            _bridgeQueue.push({
                name: name,
                json: json,
                type: 'call'
            });
            // document.addEventListener('DidiJSBridgeReady', function() {
            //     DidiJSBridge.callHandler(name, JSON.stringify(json));
            // });
        }
    };

    //判断当前是否为IOS
    var isIOS = function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;

        return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }

    //和native通信，name：约定的apiname，json：传参
    b.registerHandler = function (name, callFun) {
        if (window.DidiJSBridge) {
            try {
                if (!isIOS()) return;
                if (!_isBridgeInit) {
                    //初始化
                    _isBridgeInit = true;

                    for (key in DidiJSBridge) {
                        alert(key);
                    }

                    DidiJSBridge.init(function () {
                        console.log('error');
                    });
                }

                //         //注册jsbridge监听
                //         DidiJSBridge.registerHandler(name, callFun);
            } catch (ex) {
                alert(ex);
            }
        } else {
            _bridgeQueue.push({
                name: name,
                fun: callFun,
                type: 'register'
            });
        }
    };

    document.addEventListener('DidiJSBridgeReady', function () {
        if (!_isBridgeInit && isIOS()) {
            _isBridgeInit = true;
            //初始化
            DidiJSBridge.init(function () {
                console.log('error');
            });
        }
        for (var i = 0; i < _bridgeQueue.length; i++) {
            if (_bridgeQueue[i].type == 'call') {
                DidiJSBridge.callHandler(_bridgeQueue[i].name, JSON.stringify(_bridgeQueue[i].json));
            } else if (isIOS()) {
                DidiJSBridge.registerHandler(_bridgeQueue[i].name, _bridgeQueue[i].fun)
            }
        }
    });

    //tmpl
    //<script id="id" type="text/dd-tmpl">xxxxxx</script>
    b.template = function (id, obj) {
        var scriptDom = document.querySelector('#' + id),
            scriptType = scriptDom.getAttribute('type');
        if (scriptType !== "text/dd-tmpl") return;

        var str = scriptDom.innerHTML,
            len = obj.length,
            html = "",
            _str = str;
        if (len) {
            var list = obj,
                obj = null;
            for (var i = 0; i < len; i++) {
                obj = list[i];
                _str = str;
                for (var n in obj) {
                    _str = _str.replace(new RegExp("{" + n + "}", "ig"), obj[n]);
                }
                html += _str;
            }
        } else if (obj) {
            for (var n in obj) {
                str = str.replace(new RegExp("{" + n + "}", "ig"), obj[n]);
            }
            html = str
        }
        return html;
    };

    b.share = function (opts) {

        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            // 分享给朋友
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {

                WeixinJSBridge.invoke('sendAppMessage', {
                    "appid": "wx69b6673576ec5a65",
                    "img_url": opts.share_icon_url,
                    "img_width": "120",
                    "img_height": "120",
                    "link": opts.share_url,
                    "title": opts.share_title,
                    "desc": opts.desc
                }, function (res) {

                });
            });

            // 分享到朋友圈
            WeixinJSBridge.on('menu:share:timeline', function (argv) {

                WeixinJSBridge.invoke('shareTimeline', {
                    "img_url": opts.share_icon_url,
                    "img_width": "120",
                    "img_height": "120",
                    "link": opts.share_url,
                    "title": opts.share_title,
                    "desc": opts.desc
                }, function (res) {

                });
            });
        });
    }
    dd.base = b; //将base对象注册到dd命名空间下


})(window);
