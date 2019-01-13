'use strict';
(function(window, undefined) {
    if (window.dd && window.dd.share) {
        return window.dd.share;
    }

    var s = {};

    // 默认分享数据
    var d = {
        appmsg: {
            appid: 'wx69b6673576ec5a65',
            img_url: 'http://diditaxi.com.cn/share/images/webapp_share/diditaxi-logo.png',
            link: 'http://diditaxi.com.cn/api/v1/share/',
            title: '最近用滴滴打车，每次都很快打到车，推荐给你试试！',
            desc: '用滴滴打车，室内叫好车再出发，再也不用路边日晒雨淋跟人抢车了~'
        },
        timeline: {
            appid: 'wx69b6673576ec5a65',
            img_url: 'http://diditaxi.com.cn/share/images/webapp_share/diditaxi-logo.png',
            link: 'http://diditaxi.com.cn/api/v1/share/',
            title: '滴滴打车室内叫好车，再不用路边日晒雨淋跟人抢车了',
            desc: '滴滴打车室内叫好车，再不用路边日晒雨淋跟人抢车了'
        },
        weibo: {
            content: '今天用滴滴打车了，室内叫好车再出发，再也不用路边日晒雨淋跟人抢车了，推荐你也下载试试 http://diditaxi.com.cn/api/v1/share',
            url: 'http://diditaxi.com.cn/api/v1/share'
        }
    };

    // check
    var valid = function(wxJsObj) {
        if (!wxJsObj) {
            return function() {
                return false;
            };
        }
        return function() {
            wxJsObj.call('showOptionMenu');
            wxJsObj.call('hideToolbar');
        };
    };

    // 默认分享
    s.defaultShare = function(wxJsObj) {
        s.shareAll(wxJsObj, d);
    };

    // 分享所有
    s.shareAll = function(wxJsObj, opt) {
        if (!opt) return;
        valid(wxJsObj)();

        this.appMsg(wxJsObj, opt.appmsg);
        this.timeline(wxJsObj, opt.timeline);
        this.weibo(wxJsObj, opt.weibo);
    };

    // 分享给好友
    s.appMsg = function(wxJsObj, opt) {
        valid(wxJsObj)();

        if (!opt) opt = d.appmsg;
        wxJsObj.on('menu:share:appmessage', function() {
            wxJsObj.invoke('sendAppMessage', opt, opt.succCB);
        });
    };

    // 分享到朋友圈
    s.timeline = function(wxJsObj, opt) {
        valid(wxJsObj)();
        if (!opt) opt = d.timeline;

        wxJsObj.on('menu:share:timeline', function() {
            wxJsObj.invoke('shareTimeline', opt, opt.succCB);
        });
    };

    // 分享到腾讯微博
    s.weibo = function(wxJsObj, opt) {
        valid(wxJsObj)();
        if (!opt) opt = d.weibo;

        wxJsObj.on('menu:share:weibo', function() {
            wxJsObj.invoke('shareWeibo', opt, opt.succCB);
        });
    };

    var dd = window.dd || {};
    dd.share = s; // 将share注册到dd命名空间下

})(window);