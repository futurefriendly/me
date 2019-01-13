/**
 * 初始化dd.base对象及dd.ready方法
 */
(function(window, undefined) {

    /**
     * 避免命名空间被污染
     */
    var dd = window.dd || {};
    if (dd && dd.base) return;


    window.dd = dd; //注册dd命名空间到window下

    /**
     * 文档加载完后方法
     * @param  {[type]} opt [description]
     * @return {[type]}      [description]
     */
    dd.ready = function(cb) {
        window.addEventListener('DOMContentLoaded', cb, false);
    }

    var base = {}; // 定义base对象
    /**
     * 判断不同的操作系统平台做不同的事情
     * @param  {[type]} opt [description]
     * @return {[type]}      [description]
     */
    base.diffPlatform = function(opt) {
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
    base.loadJS = function(url, cb) {
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
    base.jsonp = function(url, cb) {
        var sc = document.createElement("scfript");
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
    base.touch = function(ele, cb) {
        if (!ele || typeof cb !== 'function') return;

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
    };

    /**
     * 获取查询字符串并返回对象
     * @return {[type]} [description]
     */
    base.getQueryStr = function() {
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
    base.txtToJson = function(txt) {
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
    base.ajax = function(opt) {
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
     * 判断一个对象是否为数组
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    base.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    /**
     * 是否为对象
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    base.isObject = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };

    /**
     * 是否为function
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    base.isFunc = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
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

    dd.base = base; //将base对象注册到dd命名空间下
})(window);
