!function () {
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/)

    // todo clean this up with a better OS/browser
    // separation. we need to discern between multiple
    // browsers on android, and decide if kindle fire in
    // silk mode is android or not

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
  }

  detect.call($, navigator.userAgent)

    var str = window.navigator.userAgent;
    var version = parseFloat($.os.version);
    var upMedia = ($.os.ios && version >= 5) || ($.os.android && version >= 4);
    var supportFixed;
    var webView;

    if ($.os.ios) {
        if (/MicroMessenger/i.test(str)) {
            webView = 'WeChat';
        } else if (/weibo/i.test(str)) {
            webView = 'Weibo';
        } else if (/MQQwebView/i.test(str)) {
            webView = 'QQ-webView';
        } else if (/CriOS/i.test(str)) {
            webView = 'Chrome';
        } else if (/UCwebView/i.test(str) || /UCWEB/i.test(str)) {
            webView = 'UC';
        } else if (/FlyFlow/i.test(str)) {
            webView = 'Baidu';
        } else if (/Mercury/i.test(str)) {
            webView = 'Mercury';
        } else if (/SogouMobilewebView/i.test(str)) {
            webView = 'Sogou';
        } else if (/Opera/i.test(str)) {
            webView = 'Opera';
        } else if (/baiduboxapp/i.test(str)) {
            webView = 'BaiduBox';
        } else if (/hao123/i.test(str)) {
            webView = 'Hao123';
        }
    }

    function isSupportFixed() {
        var body = document.body,
            div, isFixed;
        div = document.createElement('div');
        div.style.cssText = 'display:none;position:fixed;z-index:100;';
        body.appendChild(div);
        isFixed = window.getComputedStyle(div).position == 'fixed';
        body.removeChild(div);
        div = '';
        return upMedia && isFixed;
    }

    $.browser = {
        supportFixed: function () {
            if ('supportfixed' in rocket.search_params) return rocket.search_params.supportfixed;
            return supportFixed === undefined ? supportFixed = isSupportFixed() : supportFixed;
        },
        supportScroll: function () {
            if ('supportscroll' in rocket.search_params) return rocket.search_params.supportscroll;
            return upMedia;
        },
        supportStyle: function (property, value) {
            var element = document.createElement('div');
            if (property in element.style) {
                element.style[property] = value;
                return element.style[property] === value;
            } else {
                return false;
            }
        },
        webView: webView,
        isPc: !($.os.android || $.os.iphone || $.os.ipad),
        // filter: '-webkit-filter' in document.body.style
    }
}()