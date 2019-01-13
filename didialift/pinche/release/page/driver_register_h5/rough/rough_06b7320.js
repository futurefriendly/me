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
                url = icon.url || "/static/pinche/src/images/i-plaint.png",
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
                url: "http://static.xiaojukeji.com/pinche/images/i-plaint.png",
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
                url: "/static/pinche/src/images/i-plaint.png",
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
                url: "/static/pinche/src/images/loading_2.gif"
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
                url: "/static/pinche/src/images/loading_2.gif"
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
                url: "/static/pinche/src/images/i-plaint.png",
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
;
var base = dd.base;
var rm_wall = function() {
    var dvWalls = document.getElementsByClassName("select-wall");
    for (var i = 0, len = dvWalls.length; i < len; i++) {
        document.body.removeChild(dvWalls[i]);
    }
};
var add_wall = function() {
    var dvWall = document.createElement('div');
    dvWall.id = "d-wall";
    dvWall.className = "select-wall";
    dvWall.style.width = document.clientWidth + "px";
    dvWall.style.height = document.body.scrollHeight + "px";
    document.body.appendChild(dvWall);
};
// // 滑动下拉框forcolor
// var slideSelect_color = function(input, selectDiv, value) {
//     var linkCancel = selectDiv.getElementsByClassName("cancel")[0];
//     var linkConfirm = selectDiv.getElementsByClassName("confirm")[0];
//     var options = selectDiv.getElementsByClassName("options")[0];

//     var option_con = null;
//     var option_can = null;
//     //初始化选择
//     if (value) {
//         option_can = selectDiv.querySelector("[data-id='" + value + "']");
//         option_can.className = "selected";
//         input.value = option_can.innerText;
//         input.setAttribute("data-id", value);
//     }
//     if (input.getAttribute("disabled") == "disabled") return;
//     base.touch(input, function(ev) {
//         var seList = document.getElementsByClassName("select");
//         for (var i = 0, length = seList.length; i < length; i++) {
//             seList[i].style.display = "none";
//         }
//         selectDiv.style.display = 'block';

//         add_wall();

//     }, false);

//     base.touch(linkCancel, function(ev) {
//         selectDiv.style.display = 'none';
//         if (option_can) {
//             for (var i = options.children.length - 1; i >= 0; i--) {
//                 options.children[i].className = "";
//             }
//             option_can.className = "selected";
//             option_con = null;
//         }
//         rm_wall();
//     }, false);

//     base.touch(linkConfirm, function(ev) {
//         selectDiv.style.display = 'none';
//         if (option_con) {
//             input.value = option_con.innerText;
//             input.setAttribute("data-id", option_con.getAttribute("data-id"));
//             option_can = option_con;
//             option_con = null;
//         }
//         rm_wall();
//     }, false);

//     base.touch(options, function(ev) {
//         if (ev.target.tagName === "UL") return;
//         //点击列表处理
//         var getLi = function(el) {
//             if (!el) el;
//             if (el.tagName === "LI") return el;
//             return arguments.callee(el.parentElement);
//         };
//         option_con = getLi(ev.target);
//         if (option_con) {
//             for (var i = options.children.length - 1; i >= 0; i--) {
//                 options.children[i].className = "";
//             }
//             option_con.className = "selected";
//         }
//     }, false);

//     options.addEventListener("touchend", function(ev) {
//         ev.preventDefault();
//         if (!ev.changedTouches.length) {
//             return false;
//         }

//         var nowTop = this.scrollTop;
//         var gap = nowTop % 44; //44

//         if (gap < 22) {
//             this.scrollTop -= gap;
//         } else {
//             this.scrollTop += 44 - gap;
//         }

//     }, false);
// };
// 滑动下拉框包括支持一级及以上
var slideSelect_carno = function(input, selectDiv, valueArr) {
    var valueList = valueArr || [],
        nameList = [];
    var linkCancel = selectDiv.getElementsByClassName("cancel")[0],
        linkConfirm = selectDiv.getElementsByClassName("confirm")[0],
        optionsList = selectDiv.getElementsByClassName("options");

    var init = function() {
        for (var i = 0, len = valueArr.length; i < len; i++) {
            var onLi = optionsList[i].querySelector("[data-id='" + valueArr[i] + "']");
            nameList[i] = onLi.getAttribute("data-show");
        }
        input.setAttribute("data-id", valueList.join(""));
        input.value = nameList.join("");
        if (input.getAttribute("disabled") == "disabled") return; //禁用下拉框 
    }


    // 事件触发
    base.touch(input, function(ev) {
        var seList = document.getElementsByClassName("select");
        for (var i = 0, length = seList.length; i < length; i++) {
            seList[i].style.display = "none";
        }
        selectDiv.style.display = 'block';
        add_wall();
        var options = null,
            value = "",
            listLi = null;

        for (var j = 0, len = optionsList.length; j < len; j++) {
            options = optionsList[j];
            value = valueArr[j];
            listLi = options.getElementsByTagName("li");
            for (var k = 0, l = listLi.length; k < l; k++) {
                if (listLi[k].getAttribute("data-id") == value) {
                    options.scrollTop = k * 44;
                }
            }
        }
    }, false);

    // 取消按钮
    base.touch(linkCancel, function(ev) {
        selectDiv.style.display = 'none';
        rm_wall();
    }, false);

    // 确定按钮
    base.touch(linkConfirm, function(ev) {


        var options = null,
            //index = 0,
            selectedLi = null;
        for (var i = 0, length = optionsList.length; i < length; i++) {
            options = optionsList[i];

            var liIndex = options.scrollTop / 44;
            var selectedLi = options.getElementsByTagName("li")[liIndex];

            valueList[i] = selectedLi.getAttribute("data-id");
            nameList[i] = selectedLi.getAttribute("data-show");

        };
        input.value = nameList.join("");
        input.setAttribute("data-id", valueList.join(""));
        selectDiv.style.display = 'none';
        rm_wall();
    }, false);

    ///----------------------------bind-----------
    for (var i = 0, length = optionsList.length; i < length; i++) {
        ul_bind(optionsList[i], i);
    };

    function ul_bind(options) {
        var starty = 0,
            dy = 0;

        options.addEventListener("touchstart", function(ev) {
            ev.preventDefault();
            if (!ev.touches.length) {
                return false;
            }
            var touch = ev.touches[0];

            starty = (touch.pageY - this.offsetTop);
            return;

        }, false);
        options.addEventListener("touchmove", function(ev) {
            ev.preventDefault();
            if (!ev.touches.length) {
                return false;
            }
            var touch = ev.touches[0];

            var touchy = (touch.pageY - this.offsetTop);
            dy = starty - touchy;
            starty = touchy;

            this.scrollTop += dy;
            return;

        }, false);
        options.addEventListener("touchend", function(ev) {
            ev.preventDefault();
            if (!ev.changedTouches.length) {
                return false;
            }

            starty = 0;
            dy = 0;

            var nowTop = this.scrollTop;
            var gap = nowTop % 44; //44

            if (gap < 22) {
                this.scrollTop -= gap;
            } else {
                this.scrollTop += 44 - gap;
            }

        }, false);
    }
};
;
dd.ready(function() {
	var base = dd.base,
		dialog = dd.dialog;

	var driver_form = base.txtToJson(localStorage.driver_form || {});

	var regular = {
		is_Chinese_name: function(str) {
			var reg = /^[\u4E00-\u9FA5]{2,}$/;
			if (!reg.test(str)) {
				return false;
			}
			return true;
		},
		// 身份证校验
		is_ID_card: function(code) {
			// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			if (reg.test(code) === false) {
				return false;
			}
			return true;
		},
		// 车牌号校验
		is_carNo: function(str) {
			var reg = /^[A-Za-z]{1}[A-Za-z0-9]{5}$/;
			if (!reg.test(str)) {
				return false;
			}
			return true;
		}
	};
	(function init() {
		//车牌首字初始化
		carno_init(page_driver.car_province_id);

		// 恢复数据
		if (pageParams.type == "join") { //
			// 恢复数据
			register_recover();
		}

		//表达校验初始化
		validata_init();
		// 点击提交
		$(btnSubmit).on('click', function(e) {

			if (btnSubmit.className == "btn-gray") return;
			// hide keyborad
			var list_input = document.getElementsByTagName("input");
			for (var i = 0, len = list_input.length; i < len; i++) {
				var _input = list_input[i];
				_input.setAttribute("readOnly", "true");
				_input.blur();
			}
			scrollTo(0, 0);
			setTimeout(function() {
				for (i = 0, len = list_input.length; i < len; i++) {
					var _input = list_input[i];
					_input.removeAttribute("readOnly");
				}
			}, 100);
			//end hide keyborad

			var data_form = {
				drive_license_name: txt_realname.value, //驾驶证姓名
				drive_license_number: txt_licence.value.toLocaleUpperCase(), //驾驶证号

				travel_license_name: txt_carower.value, //行驶证姓名
				car_province_id: txt_carOne.getAttribute("data-id"), //车省号
				car_license_number: txt_carOne2.value.toLocaleUpperCase(), //车牌号：A234567

				phone_number: pageParams.phone || "", //电话号
				token: pageParams.token || "",
				sign: pageParams.sign || ""
			};
			var form_ok = form_validate(data_form);



			if (form_ok) {
				next(function(){
					upload_card(data_form);
				});
				// form_commit(data_form);
			}
		});


	})();


	//车牌首字
	function carno_init(value) {
		var carnoSelect = document.getElementById("carnoSelect");

		ulEl = carnoSelect.getElementsByClassName("options")[0];
		var get_no = function() {
			base.ajax({
				method: "POST",
				url: "/pinche/cartype/getlicensehead",
				succFunc: function(j) {
					var da = base.txtToJson(j);
					if (da.errno == "0") {
						var data = da.data;
						var sort = da.sort;
						var html = "";
						for (var i = 0, len = sort.length; i < len; i++) {
							html += '<li data-id="' + sort[i] + '" data-show="' + data[sort[i]] + '">' + data[sort[i]] + '</li>';

						}
						ulEl.innerHTML += html;
						slideSelect_carno(txt_carOne, carnoSelect, []); //carno
					}

				},
				failFunc: function() {}
			});
		};
		get_no();

	}
	/*对文本框的输入进行一个保存恢复操作*/
	function register_recover() {
		//保存表单数据
		var _store = function(key, value) {
			driver_form[key] = value;
			localStorage.driver_form = JSON.stringify(driver_form);
		};
		txt_realname.addEventListener("change", function() {
			_store("txt_realname", this.value);
		}, false);

		txt_licence.addEventListener("change", function() {
			_store("txt_licence", this.value);
		}, false);

		txt_carower.addEventListener("change", function() {
			_store("txt_carower", this.value);
		}, false);

		txt_carOne.addEventListener("click", function() {
		    _store("txt_carOne", txt_carOne.value);
		}, false);

		txt_carOne2.addEventListener("change", function() {
			_store("txt_carOne2", this.value);
		}, false);

		if (driver_form) {
			txt_realname.value = driver_form.txt_realname || "";
			txt_licence.value = driver_form.txt_licence || "";
			txt_carower.value = driver_form.txt_carower || "";
			txt_carOne.value = driver_form.txt_carOne || "";
			txt_carOne2.value = driver_form.txt_carOne2 || "";
		}
	}

	function validata_init() {
		// 真实姓名
		txt_realname.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_realname.addEventListener("blur", function() {
			if (!regular.is_Chinese_name(this.value)) {
				this.className = "error";
			}
		}, false);

		// 驾驶证号
		txt_licence.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_licence.addEventListener("blur", function() {
			if (!regular.is_ID_card(this.value)) {
				this.className = "error";
			}
		}, false);

		// 行驶本姓名
		txt_carower.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_carower.addEventListener("blur", function() {
			if (!regular.is_Chinese_name(this.value)) {
				this.className = "error";
			}
		}, false);

		// 车牌号验证
		txt_carOne2.addEventListener("focus", function() {
			this.className = "";
		}, false);
		txt_carOne2.addEventListener("blur", function() {
			if (!regular.is_carNo(this.value)) {
				this.className = "error";
			}
		}, false);
	}
	//表单校验
	function form_validate(data) {
		// 文本输入错误
		var input_error = function(ele, title) {
			dialog.alert({
				title: "",
				tip: title,
				btn: {
					handler: function() {
						ele.focus();
					}
				}
			});
		};
		//如果这些可以修改
		if(pageParams.drive_license_changeable === '1'){
			//驾驶人
			if (!regular.is_Chinese_name(data.drive_license_name)) {
				input_error(txt_realname, "请填写真实姓名");
				return false;
			}
			if (!regular.is_ID_card(data.drive_license_number)) {
				input_error(txt_licence, "身份证号填写错误");
				return false;
			}
		}
		//如果这些可以修改
		if(pageParams.travel_license_changeable === '1' ){
			//车辆
			if (!regular.is_Chinese_name(data.travel_license_name)) {
				input_error(txt_carower, "行驶证姓名填写错误");
				return false;
			}
			if (txt_carOne.value == "") {
				dialog.alert('请选择车牌归属地');
				return false;
			}
			if (!regular.is_carNo(data.car_license_number)) {
				input_error(txt_carOne2, "车牌号填写错误");
				return false;
			}
		}
		return true;
	}
	//提交新增表单
	function form_commit(data) {
		dialog.loading("正在请求，请稍后~");
		base.ajax({
			method: "POST",
			url: pageParams.submit_url,
			data: data,
			succFunc: function(j) {
				var da = base.txtToJson(j);
				if (da.errno == "0") { //注册成功   
					localStorage.removeItem("driver_form");
					location.replace(da.url);
				} else if (da.errno == "3002") {
					localStorage.removeItem("driver_form");
					location.replace(da.url);
				} else {
					pre(function(){
						dialog.alert(da.errmsg);
					});
				}
			},
			failFunc: function() {
				dialog.alert("网络有点不给力，请稍后再试哦~");
			}
		});
	}
	function next(callback){
		$('.main').attr('class','main animate begin_animate');
		setTimeout(function(){
			$('.main').attr('class','main animate end_animate');
		}, 0 );
		setTimeout(function(){
			$('.main').attr('class','main ended_animate');
			callback();
		}, 350);
	}
	function pre(callback){
		$('.main').attr('class','main animate end_animate');
		setTimeout(function(){
			$('.main').attr('class','main animate begin_animate');
		}, 0 );
		setTimeout(function(){
			$('.main').attr('class','main');
			callback();
		}, 450);
	}
	// next(function(){
	//   	upload_card();
	// });
	var upload_card_init = false;
	function upload_card(data_form) {
		if(upload_card_init === true) return;
		upload_card_init = true;
		 var val_ary = [
			 'travelauthpicurl',  //行驶证照片
	         'driveauthpicurl',   //驾照照片
	         'carauthpicurl'
	         ];
		var $pick_ary = [
			'.driving_licence_front',
			'.driving_licence_backend', 
			'.car_photo'
		];
		var photo_data = {};

		var addPhoto = function(key, val){
			var index = val_ary.indexOf(key);
			if(index === -1) return;
		 	var $pick_node = $($pick_ary[index]);
		 	photo_data[ key ] = val;
			$pick_node.addClass('photo_uploaded');
		 	$pick_node.find('.shadow').html(val);
		 	$pick_node.find('.shadow').css('background-image', 'url('+ val +')');
		 	local.set(key,val);
		};
		var setThumb = function($node, src, retry){
			retry = retry || 0;
			var $img = $('<img>');
			$img.on('load error', function(e){
				$img.off();
				if( e.type === 'error' && retry){
					setThumb();
				}else{
					$node.css('background-image', 'url('+ src +')');
				}
			});
			$img.attr('src');
		}

		var removePhoto = function(key, e){
			var index = val_ary.indexOf(key);
			if(index === -1) return;
		 	$pick_node = $($pick_ary[index]);
		 	$pick_node.find('.shadow').html('error | ' + e.message);
			$pick_node.removeClass('photo_uploaded');
		 	delete photo_data[ key ];
		}
		// jsUpload({
		// 	pick_node: $pick_node_first,
		// 	file_key: key_ary[0]
		// }, function(src){
		// 	$pick_node_first.find('.shadow').css({
		// 		'background': 'url('+ src  +')'
		// 	});
		// 	console.log(src);
		// },function(resObj){
		// 	console.log(resObj);
		// });	
		addEventListener('error', function(e){
		 	$('.driving_licence_backend').find('.shadow').html( e.message );
		}, false);
		val_ary.forEach(function(val){
			var localPhoto = local.get(val);
			if(localPhoto){
				addPhoto(val, localPhoto);
			}
		});


		$('.upload_card').on('click', '.file_select', function(e){

			var $pick_node  = $(e.currentTarget);
			var className = $pick_node.attr('class').trim();
			className = className.split(/\s+/)[1];
			if(className == false) return;
			var index = $pick_ary.indexOf('.'+className);	
			if(index === -1) return;
    		var Didibridge = require('ddbridge/ddbridge.js');
    		 Didibridge.uploadImage(
	    		 {},
	    		function(resObj){
	    		 	try{
	    		 		resObj = JSON.parse(resObj);
	    		 		addPhoto(val_ary[index], resObj.data.data );
	    		 	}catch(e){
	    		 		removePhoto(val_ary[index], e);
	    		 	}
	    		}
    		);
		});
		// val_ary.forEach(function(val){
		// 	photo_data[ val ] = 'http://img.baidu.com/video/img/video_logo_new.gif'
		// });
		base.touch($('.register_submit')[0], function(){
		// $('.register_submit').on('click', function(){
			var check_pass = true;
			var check_fail_index;
			$.each(val_ary, function(key, val){
				if( photo_data[val] === undefined ){
					check_fail_index = key;
					return check_pass = false;
				}
			})
			if(check_pass === false){
				var title = $($pick_ary[check_fail_index]).find('.select_tips').text() || '完整资料';
				dialog.alert({
					title: "",
					tip: '请填写' + title,
					btn: {
						handler: function() {
						}
					}
				});
				return;
			}
			data_form = $.extend(data_form, photo_data);
			form_commit(data_form);
		});

	}

	var local = {
		set: function(key,val){
			try{
				localStorage.setItem(key,val);
				return true;
			}catch(e){
				return false;
			}
		},
		get: function(key){
			try{
				return localStorage.getItem(key);
			}catch(e){
				return false;
			}
		},
		remove: function(key){
			try{
				localStorage.removeItem(key);
				return true;
			}catch(e){
				return false;
			}

		}
	}

	function jsUpload(opt, thumbCallback, uploadSuccess){
		var $pick_node = opt.pick_node;
		var file_key = opt.file_key;
		var uploader = WebUploader.create({
			// 选完文件后，是否自动上传。
			auto: true,
			fileVal: file_key,
			formData: {
				// 1 随机文件名称 、 0原文件
				// type: '0',
				// url: 'http://list.video.baidu.com/yingbang/vce/',
			},
			// paste: me.$inputContent,
			// 文件接收服务端。
			server: pageParams.upload_url,

			// 选择文件的按钮。可选。
			// 内部根据当前运行是创建，可能是input元素，也可能是flash.
			pick: $pick_node,

			// 只允许选择图片文件。
			accept: {
				title: 'Images',
				extensions: 'gif,jpg,jpeg,bmp,png',
				mimeTypes: 'image/*'
			}
		});



		// 当有文件添加进来的时候
		uploader.on('fileQueued', function(file) {
			// 创建缩略图
			// 如果为非图片文件，可以不用调用此方法。
			// thumbnailWidth x thumbnailHeight 为 100 x 100
			uploader.makeThumb(file, function(error, src) {
				if (error) {
					console.log('<span>不能预览</span>');
					return;
				}
				thumbCallback(src);
			
			}, 200, 200);
		});

		uploader.on('uploadComplete', function(file) {

		});
		uploader.on('uploadSuccess', function(file, response) {
			var resObj = JSON.parse(response._raw);
			uploadSuccess(resObj);
			if (resObj.success) {
				me.set('newData', resObj.result.file_domain + resObj.result.file_name);
			} else {
				message('上传失败');
			}
		});
		uploader.on('uploadProgress', function(file, percentage) {
			if (percentage < 1){
				message('上传中：' + percentage * 100 + '%');
			}
			else{
				message('上传完毕', percentage);
			}
		});

	}
	function message(msg){
		console.log(msg);
	}


});;
// 微信app内分享 rely on dd.base.js
dd.ready(function weChatShare() {
    // alert(is_weixn());
    //  if (!is_weixn()) return;
    var base = dd.base || {};
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
                    share_config();
                });
            }
        },
        failFunc: function() {}
    });
    // function is_weixn() {
    //         var ua = navigator.userAgent.toLowerCase();
    //         if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    //分享配置
    function share_config(share_obj) {
        var share_obj = {
            title: '顺风出行，期待每一次的不期而遇。',
            desc: '滴滴顺风车车主有奖招募中，有车即可参与',
            link: location.href,
            imgUrl: "http://static.xiaojukeji.com/pinche/images/share.jpg"
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
});

//滴滴打车客户端分享包括（ios and Android）
window.addEventListener('DOMContentLoaded', function(e) {
    var btnShare = document.getElementById('btnNativeShare');
    var hdShareUrl = document.getElementById('nativeShareUrl');
    var _share_url = hdShareUrl ? hdShareUrl.value : "";
    var btnDownload = document.getElementById("btnDownload");
    var shareConfig = {
        img_url: "http://static.xiaojukeji.com/pinche/images/share.jpg", //小图的链接
        title: "顺风出行，期待每一次的不期而遇。",
        desc: "滴滴顺风车车主有奖招募中，有车即可参与",
        link: _share_url //分享出去的链接地址
    };

    var map = function(array, callback) {
        for (var i = 0, l = array.length; i < l; i++) {
            callback(array[i]);
        }
    };

    var entranceMap = [{
        button: btnShare,
        method: 'invoke_entrance'
    }];

    // 绑定入口操作
    var bindEntrance = function(bridge) {
        map(entranceMap, function(item) {
            (function(it) {
                it.button.addEventListener('touchend', function(e) {
                    if (typeof bridge === 'undefined') {
                        return;
                    }
                    bridge.callHandler(it.method);
                });
            })(item);
        });

    };

    // 初始化入口
    var entranceCfg = {
        entrance: {
            icon: 'http://static.diditaxi.com.cn/webapp/images/driver.png'
        },
        buttons: [{
            type: 'share_weixin_timeline',
            name: '分享到微信朋友圈',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }, {
            type: 'share_weixin_appmsg',
            name: '分享给微信好友',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }, {
            type: 'share_qq_appmsg',
            name: '分享给QQ好友',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }, {
            type: 'share_qzone',
            name: '分享到QQ空间',
            data: {
                share_url: shareConfig.link, // 分享出去的URL
                share_icon_url: shareConfig.img_url, // 分享小图icon
                share_img_url: shareConfig.img_url, // 分享大图
                share_title: shareConfig.title,
                share_content: shareConfig.desc,
                share_from: 'native' // 分享来源，便于做统计
            },
            callback: function() {

            }
        }]
    };
    //初始化sharebutton
    var initShareButton = function() {
        btnShare.style.display = "block";
        shareText.style.display = "none";
        if (btnDownload) {
            btnDownload.style.display = "none";
        }
        var domTitle = document.getElementById("domTitle");
        if (domTitle) {
            domTitle.innerHTML = "顺风车车主招募";
        }
    };
    // 连接DidiJSBridge
    var connectDidiJSBridge = function(callback) {
        if (window.DidiJSBridge) {
            callback(DidiJSBridge);
        } else {
            document.addEventListener('DidiJSBridgeReady', function() {
                callback(DidiJSBridge);
            }, false);
        }
    };

    // 执行连接DidiJSBridge`
    connectDidiJSBridge(function(bridge) {
        if (typeof bridge === 'undefined') {
            return;
        }
        bridge.callHandler('init_entrance', JSON.stringify(entranceCfg));
        bindEntrance(bridge);
        initShareButton();
    });

}, false);
;
