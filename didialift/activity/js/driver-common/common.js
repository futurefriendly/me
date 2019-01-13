(function(window, dd, undefined) {

    var dd = dd || {};
    var common = common || {};

    common.navig = window.navigator.userAgent;

    /*
    @@descrption:初始化rem值，PC时只显示中间一条
    */
    common.init = function() {
        var docuH = document.documentElement.clientHeight,
            docuW = document.documentElement.clientWidth,
            html = document.getElementsByTagName('html')[0];
        var num = docuW / 320;
        html.style.fontSize = 12 * num + "px";
    };

    /*
    @@description:判断参数是否为数组
    */
    common.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    /*
    @@description:判断参数是否为对象
    */
    common.isObject = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };


    /*添加class*/
    common.addClass = function(obj, sClass) {
        var re = new RegExp('\\b' + sClass + '\\b');
        if (!re.test(obj.className)) {
            obj.className += obj.className ? ' ' + sClass : sClass;
            //看原来obj有没有class,第一种可能,原来有class，就需要再添加之前加上空格，没有class，就直接添加
        }
    };

    /*是否包含指定样式名*/
    common.hasClass = function(obj, sClass) {
        var re = new RegExp('\\b' + sClass + '\\b');
        if (!re.test(obj.className)) {
            return false;
        } else {
            return true;
        }
    };

    /*移除指定样式名*/
    common.removeClass = function(obj, sClass) {
        if (this.hasClass(obj, sClass)) {
            var reg = new RegExp('(\\s|^)' + sClass + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    };

    /*
    @@判断当前环境是否微信
    @@return [Boolean]
    */
    common.isWeixin = function() {
        if (this.navig.indexOf('MicroMessenger') != -1) return true;
        else return false;
    };

    /*
    @@判断当前环境是否QQ浏览器
    @@微信安卓版用的QQX5浏览器内核，所以UA中会有QQ字符，单纯用QQ去判断会不准确
    @@return [Boolean]
    */
    common.isQQBrowser = function() {
        if (this.navig.toLowerCase().indexOf("qq") != -1 && !this.isWeixin()) return true;
        return false;
    };

    /*
    @@判断当前环境是否安卓webview
    @@return [Boolean]
    */
    common.isAndroid = function() {
        var app = navigator.appVersion;
        var isAndroid = this.navig.indexOf('Android') > -1 || this.navig.indexOf('Linux') > -1; //android终端或者uc浏览器
        return isAndroid;
    };

    /*
    @@判断当前环境是否IOS webview
    @@return [Boolean]
    */
    common.isIos = function() {
        var app = navigator.appVersion;
        var isIOS = this.navig.indexOf('iPhone') > -1; //ios终端
        return isIOS;
    };

    /*
    @@获取字符串的长度，汉字为2个字符
    @@return [int]
    */
    common.getStringLength = function(str) {
        str = str || "";
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };

    /*
     *火狐不支持innerText写入content，innerText本身也不是DHTML的标准。
     */
    common.innerText = function(obj, text) {
        if (navig.toLowerCase().indexOf("firefox") != -1) {
            obj.textContent = text;
        } else {
            obj.innerText = text;
        }
    };

    /*
    @@截取字符串长度，汉字算2个字符
    @@return [string]+'...'
    */
    common.subString = function(str, len) {
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength > len) {
                break;
            }
            newStr += singleChar;
        }
        if (strLength > len) {
            newStr += "...";
        }
        return newStr;
    };

    /*
    @@判断是PC还是移动端
    @@return [string] phone|pc
    */
    common.browserRedirect = function() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return "phone";
        } else {
            return "pc";
        }
    };


    /*
    @@将html的<>标签转义为 &lt; &gt;
    @@如果文本中带有<>的标签，用innerHTML方法写到页面上时，<>会被浏览器渲染成html标签，如果用innerText会原样显示在页面上
    */
    common.html2Escape = function(sHtml) {
        sHtml = sHtml || '';
        return sHtml.replace(/[<>&"]/g, function(c) {
            return {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;'
            }[c];
        });
    };


    /*
    @@获取url中的参数
    */
    common.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return "";
    };

    common.init();

    //dialog补丁
    dd.dialog.hide = function() {
        var wrap = document.getElementById("d-wrap");
        var wall = document.getElementById("d-wall");
        wrap.style.display = "none";
        wall.style.display = "none";
    };

    window.dd.common = common;

})(window, dd, undefined);