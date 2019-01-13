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

/**
 * 生成对话框dd.dialog 不依赖其他库but dd.ui.css
 */
(function(window, undefined) {

    // dd.dialog不依赖于dd.base
    // 需要将dialog注册到dd命名空间下
    var dd = window.dd || {};
    if (dd.dialog) return dd.dialog;

    dd.dialog = {};

    var docElem = document.documentElement,
        dvWall = null,
        dvWrap = null,
        dialog = null;

    /**
     * util
     */
    var util = {
        /**
         * 判断一个对象是否为数组
         */
        isArray: function(obj) {
            return (typeof Array.isArray) ? Array.isArray(obj) : (Object.prototype.toString.call(obj) === '[object Array]');
        },

        /**
         * 往body中插入div
         */
        insertDom: function(newNode) {
            document.body.appendChild(newNode);
        },
        /**
         * 初始化配置及生成dom元素
         */
        genDom: function(opts, div_wall, div_wrap) {
            if (!opts) return;

            if (Object.prototype.toString.call(opts, null) === '[object Object]') { // 传入的object
                opts.type = opts.type || "loading";

                div_wall.style.cssText = opts.wallCss;
                div_wrap.style.cssText = opts.wrapCss;

                //生成弹窗内容
                var html = "<div class='" + opts.type + "'>";
                html += this.genIcon(opts.icon);
                html += this.genTitle(opts.title);
                html += this.genTip(opts);
                html += this.genButtons(opts.btns, opts.ext) + "</div>";
                html += this.genClose(opts.close);

                div_wrap.innerHTML = html;

            } else if (Object.prototype.toString.call(opts, null) === '[object String]') { // 配置为html
                div_wrap.innerHTML = opts;
            } else if (Object.prototype.toString.call(opts, null) === '[object HTMLDivElement]') { // 传入的dom
                opts.style.display = "inline-block";
                div_wrap.appendChild(opts);
            }

        },
        /**
         * 生成icon相关的html
         */
        genIcon: function(icon) {
            //默认无icon,true为默认icon
            if (!icon) return "";

            var w = icon.width || "8px",
                h = icon.height || "36px",
                url = icon.url || "/static/pinche/common/src/images/i-plaint.png",
                cssText = icon.cssText || "";

            var html = '<img src=' + url + ' style="width:' + w + ';height:' + h + ';vertical-align:middle;' + cssText + '"/>';

            return '<p class="icon">' + html + '</p>';
        },

        /**
         * Title的样式和HTML
         */
        genTitle: function(title) {
            title = title || {};
            var cssText = title.cssText || "";

            return '<p class="title" style="' + cssText + '">' + (title.txt || "") + '</p>';
        },

        /**
         * 生成提示信息
         */
        genTip: function(opts) {
            var tip = opts.tip || {},
                title = opts.title || {};

            if (title.txt) {
                tip.color = tip.color || "#666";
                tip.size = tip.size || '1.4rem'
            } else {
                tip.color = tip.color || "#333";
                tip.size = tip.size || '1.6rem';
            }

            var cssText = 'color:' + tip.color + ';font-size:' + tip.size + ';';
            
            return tip.txt ? '<div class="tip" style="' + cssText + '">' + tip.txt + '</div>' : "";
        },
        /**
         * 右上角关闭按钮
         */
        genClose: function(close) {
            return close ? '<a class="close" href="javascript:void(0);"></a>' : '';
        },
        /**
         * 尾部红包
         */
        genButtons: function(btns, ext) {
            var res = "";
            if (btns && this.isArray(btns)) {
                res += '<div class="btns clearfix">';

                for (var i = 0, btn = null, l = btns.length; i < l; i++) {
                    btn = btns[i];
                    res += '<a class="' + btn.kls + '" id="' + btn.id + '">' + btn.val + '</a>';
                }
                res += '</div>';
            }
            //按钮下面附加内容
            if (ext && typeof ext === 'string') {
                res += ext;
            }
            return res;
        },

        /**
         * 为按钮注册事件
         */
        addEvents: function(opts) {
            if (opts.close) {
                var close = dvWrap.getElementsByClassName("close")[0];
                close.addEventListener("touchstart", function() {
                    dialog.hide();
                }, false);
            }

            if (!this.isArray(opts.btns) || !opts.btns.length) return;

            for (var i = 0, btn = null, l = opts.btns.length; i < l; i++) {
                btn = opts.btns[i];
                if (btn) {
                    var ev = btn.event || "click",
                        ele = document.getElementById(btn.id);
                    if (ele) {
                        ele.removeEventListener(ev, btn.handler, false);
                        ele.addEventListener(ev, btn.handler, false);
                    }
                }
            }
        }
    };

    /**
     * Dialog对象应该使用强制使用new模式
     */
    var Dialog = function(opts) {
        if (!(this instanceof Dialog)) {
            dialog = new Dialog(opts);
            return dialog; // 当不使用new的时候，会走到前一句，然后再走到dialog.fn.init,然后再执行return
        } else {
            new Dialog.fn.init(opts);
        }
    };

    /**
     * Dialog prototype
     * @type {Function}
     */
    Dialog.fn = Dialog.prototype = {
        constructor: Dialog,
        init: function(opts) {
            if (!opts) return;

            var div_wall = document.createElement('div');
            var div_wrap = document.createElement("div");
            div_wall.id = "d-wall";
            div_wrap.id = "d-wrap";

            //初始化配置 生成内容HTML
            util.genDom(opts, div_wall, div_wrap);

            //删除已存在的弹窗
            dvWall && document.body.removeChild(dvWall);
            dvWrap && document.body.removeChild(dvWrap);

            //插入dom
            util.insertDom(div_wall);
            util.insertDom(div_wrap);

            dvWall = div_wall;
            dvWrap = div_wrap;

            if (Object.prototype.toString.call(opts, null) === '[object Object]') {
                window.setTimeout(function() {
                    util.addEvents(opts);
                }, 400);
            }
        },
        show: function() {
            var that = this;
            if (dvWall && dvWrap) {
                that.reset();
                dvWall.style.display = "block";
                dvWrap.style.display = "inline-block";

                window.addEventListener("resize", reset, false);
                window.addEventListener("scroll", reset, false);

                function reset(event) {
                    window.removeEventListener(event.type, reset, false); //先remove event
                    that.reset.call(that);
                }
            }
        },
        hide: function() {
            if (dvWall && dvWrap) {
                dvWall.style.display = "none";
                dvWrap.style.display = "none";
            }
        },
        reset: function() {
            if (dvWall && dvWrap) {
                dvWrap.style.top = (docElem.clientHeight - dvWrap.clientHeight - 20) / 2 + "px";
                dvWrap.style.left = (docElem.clientWidth - dvWrap.clientWidth) / 2 + "px";
                var scrollH = document.body.scrollHeight || document.documentElement.scrollHeight; //考虑到页面滚动和窗体重置
                dvWall.style.width = docElem.clientWidth + "px";
                dvWall.style.height = scrollH + "px";
            }
        }
    };


    /**
     * alert弹出框
     */
    dd.dialog.alert = function(cfg) {
        var opts = {};
        if (typeof arguments[0] === "string" && arguments[0]) {
            opts.title = arguments[1] || "";
            opts.tip = arguments[0];
            opts.btn = {
                val: arguments[2] || "我知道了"
            };
        } else if (cfg && typeof cfg === 'object') {
            opts = cfg;
        }

        dialog = Dialog({
            type: "alert",
            icon: opts.icon || {
                url: "/static/pinche/common/src/images/i-plaint.png",
                width: "8px",
                height: "36px"
            },
            wrapCss: "background: #fff;width: 280px;text-align: center;",
            title: {
                txt: opts.title
            },
            tip: {
                txt: opts.tip
            },
            btns: [{
                id: "btn-close",
                kls: 'btn-orange',
                event: "click",
                val: (opts.btn && opts.btn.val) || "我知道了",
                handler: function(ev) {
                    dialog.hide();
                    if (typeof opts.btn.handler === 'function') {
                        opts.btn.handler(ev);
                    }
                }
            }]
        });
        dialog.show();
        return dialog;
    };

    /**
     * confirm dialog
     */
    dd.dialog.confirm = function(cfg) {
        var opts = {};

        if (typeof arguments[0] === 'string' && arguments[0]) {
            opts.text = arguments[0] || "";
            opts.confirm = {};
            opts.confirm.handler = arguments[1];

        } else if (cfg && typeof cfg === 'object') {
            opts = cfg;
        }

        var cancel = opts.cancel || {};
        var confirm = opts.confirm || {};

        dialog = Dialog({
            type: "confirm",
            tip: {
                txt: opts.text
            },
            icon: opts.icon || {
                url: "/static/pinche/common/src/images/i-plaint.png",
                width: "8px",
                height: "36px"
            },
            wrapCss: "background: #fff;width: 280px;text-align: center;",
            btns: [{
                id: cancel.id || "btn-cancel",
                val: cancel.val || "取消",
                kls: cancel.kls || "btn-white",
                event: cancel.event || "click",
                handler: function(e) {
                    dialog.hide();
                    if (typeof cancel.handler === 'function') {
                        cancel.handler(e);
                    }
                }
            }, {
                id: confirm.id || "btn-ok",
                val: confirm.val || "确定",
                kls: confirm.kls || "btn-orange",
                event: confirm.event || "click",
                handler: function(e) {
                    dialog.hide();
                    if (typeof confirm.handler === 'function') {
                        confirm.handler(e);
                    }
                }
            }],
            ext: opts.ext
        });
        dialog.show();
        return dialog;
    };

    /**
     * Loading Dialog
     */
    dd.dialog.loading = function(cfg) {
        var opts = {};
        if (typeof arguments[0] !== "object") {
            opts.text = arguments[0];
            opts.time = arguments[1] || 0
        } else {
            opts = cfg;
        }
        dialog = Dialog({
            type: "loading",
            wallCss: "",
            wrapCss: "background:#0c0d0d;opacity:0.7;width:140px;height:140px;",
            icon: (cfg && cfg.icon) || {
                width: "30px",
                height: "30px",
                url: "/static/pinche/common/src/images/loading_2.gif"
            },
            tip: {
                txt: opts.text || "正在加载",
                color: "#fff",
                size: "14px"
            }
        });

        dialog.show();

        if (!opts.time) {
            opts.time = 5000;
        }
        window.setTimeout(function() {
            dialog.hide();
            console.log(typeof opts.hideCB === 'function')
            if (typeof opts.hideCB === 'function') {
                opts.hideCB();
            }
        }, opts.time);
        return dialog;
    };

    /**
     * 扁平化的loading
     */
    dd.dialog.flatLoading = function(cfg) {
        var opts = {};
        if (typeof arguments[0] !== "object") {
            opts.text = arguments[0];
            opts.time = arguments[1] || 0
        } else {
            opts = cfg;
        }
        dialog = Dialog({
            type: "loading",
            wallCss: "",
            wrapCss: "background:#fff;width:140px;height:140px;",
            icon: (cfg && cfg.icon) || {
                width: "30px",
                height: "30px",
                url: "/static/pinche/common/src/images/loading_2.gif"
            },
            tip: {
                txt: opts.text || "",
                color: "#666",
                size: "14px"
            }
        });

        dialog.show();

        if (!opts.time) {
            opts.time = 5000;
        }
        window.setTimeout(function() {
            dialog.hide();
            if (typeof opts.hideCB === 'function') {
                opts.hideCB();
            }
        }, opts.time);
        return dialog;
    };

    /**
     * 滴滴打车logo的loading
     */
    dd.dialog.logoLoading = function(time, hideCB) {
        dialog = Dialog('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>');
        dialog.show();
        if (!time) {
            time = 5000;
        }
        setTimeout(function() {
            dialog.hide();
            if (typeof hideCB === 'function') {
                hideCB();
            }
        }, time);
        return dialog;
    };



    /**
       //提示
    */
    dd.dialog.tip = function(cfg) {
        var _cfg = {};
        if (typeof arguments[0] !== "object") {
            _cfg.text = arguments[0];
            _cfg.time = arguments[1] || 0
        } else {
            _cfg = cfg;
        }
        _cfg.time = parseInt(_cfg.time) || 600;

        dialog = Dialog({
            type: "tip",
            wallCss: "",
            wrapCss: "background:#0c0d0d;width:140px;height:140px;opacity:0.7;",
            icon: _cfg.icon || {
                url: "/static/pinche/common/src/images/i-plaint.png",
                width: "8px",
                height: "36px"
            },
            tip: {
                txt: _cfg.text || "温馨提醒",
                color: "#fff",
                size: "14px"
            }
        });

        dialog.show();

        window.setTimeout(function() {
            dialog.hide();
        }, _cfg.time);
    };

    dd.dialog.Fn = Dialog;

    window.dd = dd; // 注册dd对象到window下

})(window);
