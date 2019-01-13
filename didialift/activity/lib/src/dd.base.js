(function(window, undefined) {

    /**
     * 避免命名空间被污染
     */
    var dd = window.dd || {};
    if (dd && dd.base) return;


    window.dd = dd; //注册dd命名空间到window下
    var b = dd.base || {}; // 定义base对象

    /**
     * 判断不同的操作系统平台做不同的事情
     * @param  {[type]} opt [description]
     * @return {[type]}      [description]
     */
    b.diffPlatform = function(opt) {
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

    /**
     * 加载javascript，加载完成后执行回调函数
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    b.loadJS = function(url, cb) {
        var sc = document.createElement("script");
        sc.type = "text/javascript";
        sc.src = url;
        document.getElementsByTagName("head")[0].appendChild(sc);
        sc.onload = sc.onreadystatechange = function() {
            if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
                if (typeof cb === "function") cb();
            }
        };
    };

    /**
     * [jsonp description]
     * @param  {[type]}   url [description]
     * @param  {Function} cb  [description]
     * @return {[type]}       [description]
     */
    b.jsonp = function(url, cb) {
        var sc = document.createElement("script");
        sc.type = "text/javascript";
        sc.src = url + (url.indexOf("?") > -1 ? "&" : "?") + "callback=dd.jsonp." + cb;
        document.getElementsByTagName("head")[0].appendChild(sc);
    };


    /**
     * touch事件
     * @param  {[type]}   ele      [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   bubble   [description]
     * @return {[type]}            [description]
     */
    b.touch = function(ele, cb) {
        if (!ele || typeof cb !== 'function') return;

        if (("ontouchstart" in window) && ("ontouchmove" in window) && ("ontouchend" in window)) {

            ele.addEventListener('touchstart', function(ev) {
                ev.target.focus();
                ev.stopPropagation(); //阻止冒泡
            }, false);

            ele.addEventListener('touchmove', function(ev) {
                ev.target.setAttribute("moved", "true");
            }, false);

            ele.addEventListener('touchend', function(ev) {
                ev.target.blur();
                if (ev.target.getAttribute("moved") !== "true") {
                    cb(ev);
                } else {
                    ev.target.setAttribute("moved", "false");
                }
            }, false);
        } else {
            ele.addEventListener('click', function(ev) {
                cb(ev);
            }, false);
        }


    };

    /**
     * 根据classname获得DOM元素
     * @param  {[type]} node      [description]
     * @param  {[type]} className [description]
     * @return {[type]}           [description]
     */
    b.getElesByKls = function(node, klsName) {
        node = node ? node : document.body;
        if (node.getElementsByClassName) {
            return node.getElementsByClassName(klsName);
        } else {
            var res = [],
                eles = node.getElementsByTagName("*");
            for (var i = 0, len = eles.length; i < len; i++) {
                if (eles[i].getAttribute) {
                    if (eles[i].getAttribute("className").indexOf(klsName) !== -1) res.push(eles[i]);
                }
            }
            return res;
        }
    };

    /**
     * 获取查询字符串并返回对象
     * @return {[type]} [description]
     */
    b.getQueryStr = function() {
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
                item = items[i].split('=');
                key = decodeURIComponent(item[0]);
                val = decodeURIComponent(item[1]);
                if (key) res[key] = val;
            };
            return res;
        }
    };

    /**
     * text convert to json object
     * @param  {[type]} txt [description]
     * @return {[type]}     [description]
     */
    b.txtToJson = function(txt) {
        if (!txt) return;
        var j = {};
        try {
            j = JSON.parse(txt);
        } catch (e) {
            try {
                j = eval("(" + txt + ")");
            } catch (ee) {}
        }
        return j;
    };



    /**
     * 单例模式－－包装盒
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    var _singleton = function(fn) {
        var _ins = null;
        return function() {
            return _ins || (_ins = fn.apply(this, arguments));
        };
    };

    /**
     * 创建XMLHttpRequest对象
     * @return {[type]} [description]
     */
    var createXhr = function() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        }
    };

    var _XHR = _singleton(createXhr);

    /**
     * ajax function
     * @param  {[type]} opt [description]
     * @return {[type]}      [description]
     */
    b.ajax = function(opt) {
        /**
         * 将object转换成body
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
        var obj2Body = function(obj) {
            if (!obj) return;
            var res = '';
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) res += '&' + p + '=' + obj[p] + '';
            }
            return res.replace(/^\&/, "");
        };

        if (!opt) return;

        var xhr = opt.isSequenceReq === true ? new _XHR() : createXhr();
        if (opt.isSequenceReq === true && xhr.readyState !== 0) xhr.abort();

        var _time = 0,
            timeObj = opt.timeout;
        if (opt.async !== false) opt.async = true;

        xhr.open(opt.method, opt.url, opt.async); //true表示异步
        /**
         * 监听xhr对象的statechange事件
         * @return {[type]} [description]
         */
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (_time) clearTimeout(_time);
                xhr.status === 200 ? opt.succFunc(xhr.responseText) : opt.failFunc(xhr.responseText);
            } //else if (xhr.readyState === 3) {} else {}
        };

        if (opt.method.toUpperCase() === 'GET') {
            xhr.send(null);
        } else if (opt.method.toUpperCase() === 'POST') {
            var body = opt.data ? obj2Body(opt.data) : "";
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(body);
        }

        /**
         * 控制timeout操作
         */
        if (timeObj) {
            var millSec = timeObj.millisecond || 10000;
            _time = setTimeout(function() {
                xhr.abort();
                if (timeObj.callback) timeObj.callback();
            }, millSec);
        }
    };

    /**
     * 设置cookies
     * @param {[type]} name  [description]
     * @param {[type]} value [description]
     * @param {[type]} time  [description]
     */
    b.setCookie = function(name, value, time) {
        var exp = new Date();
        if (!time) {
            exp.setTime(exp.getTime() + 2592000000); //默认一个月
        } else {
            exp.setTime(exp.getTime() + time);
        }
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };

    /**
     * 获取cookies
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    b.getCookie = function(name) {
        var arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        arr = document.cookie.match(reg);
        if (arr) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    };

    /**
     * 删除cookies
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    b.delCookie = function(name) {
        // var cval = b.getCookie(name);
        // if (cval) {
        //     console.log('delete cooke ' + name);
        //     document.cookie = name + "=" + cval + ";expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        // }
        // 
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = b.getCookie(name);
        if (cval != null) document.cookie = name + "=11111;expires=" + exp.toGMTString();
    };

    /**
     * 清除cookies
     * @return {[type]} [description]
     */
    b.clearCookies = function() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            }
        }
    };

    /**
     * 判断一个对象是否为数组
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    b.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    /**
     * 是否为对象
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    b.isObject = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };

    /**
     * 是否为function
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    b.isFunc = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };

    /**
     * 收集日志使用
     * @param  {[type]} openid [description]
     * @param  {[type]} phone  [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    b.collectLog = function(openid, phone, params) {
        this.ajax({
            method: "GET",
            url: "/api/v2/weixinapi/collect_log?openid=" + openid + "&phone=" + phone + params
        });
    };


    /**
     * 为原型对象注册方法
     * @param  {[type]} funcName [description]
     * @param  {[type]} func     [description]
     * @return {[type]}          [description]
     */
    Function.prototype.method = function(funcName, func) {
        if (!this.prototype[funcName]) {
            this.prototype[funcName] = func;
        }
        return this;
    };

    /**
     * 为String添加trim方法
     * @return {[type]} [description]
     */
    String.method('trim', function() {
        return this.replace(/^\s+|\s$/g, '');
    });

    /**
     * 判断某对象是否在数组内
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    Array.method('contain', function(item) {
        for (var i in this) {
            if (this[i] === item) return true;
        }
        return false;
    });

    dd.base = b; //将base对象注册到dd命名空间下
})(window);