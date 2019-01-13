(function(window, undefined){

    var dd = widnow.dd || {};

    window.dd = dd;

    dd.touch = function(ele, cb) {
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

    dd.getQueryStr = function () {
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
            }
            ;
            return res;
        }
    };

    var createXhr = function() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        }
    };
    var _XHR = createXhr();

    dd.ajax = function(opt) {
        var obj2Body = function (obj) {
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
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (_time) clearTimeout(_time);
                xhr.status === 200 ? opt.succFunc(xhr.responseText) : opt.failFunc(xhr.responseText);
            }
        };

        if (opt.method.toUpperCase() === 'GET') {
            xhr.send(null);
        } else if (opt.method.toUpperCase() === 'POST') {
            var body = opt.data ? obj2Body(opt.data) : "";
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(body);
        }
    };

})(window);