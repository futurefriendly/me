(function(root, factory) {

    // AMD
    if(typeof define == 'function' && define.amd) {
        define(['jquery', 'exports'], function($, exports){
            factory($, exports);
        });
    }
    // CMD: for didi-component
    else if(typeof exports !== 'undefined') {
        // Make sure window.$ exist
        factory(window.$, exports);
    }
    else {
        var $ = root.jQuery || root.Zepto || root.$;
        if(!$) {
            throw Error('DidiMonitor: jQuery or Zepto is needed!');
        }
        root.DidiMonitor = factory($, {});
    }

})(this, function($, DidiMonitor){

    var didiFID = 'didifid';
    var ua = navigator.userAgent;


    /**
     * Browser types detection
     */
    function _isBD() {
        return /baidubrowser/i.test(ua);
    }

    function _isWX() {
        return /micromessenger/i.test(ua);
    }

    function _isDD() {
        return /didi\.passenger\//i.test(ua);
    }

    var browserType = 
            _isDD() ? 'didi' 
            : _isWX() ? 'wx'
            : 'other';


    /**
     * @description
     * 1. 使用同一个link标签发送统计请求，如果两个统计请求几乎同时发出，
     *    可能导致其中一个pending，从而丢失。
     * 2. 使用image对象，每个请求单独使用一个image，能解决1描述的问题，但image统计可能
     *    受无图模式影响，根本发送不出去
     * 3. 使用队列方式，设定一个时间间隔，该间隔内，后续的请求需等待。不过这存在一个问题，
     *    为了让请求尽快发送出去，这个时间间隔会比较小，网络状态较差情况下，仍然可能存在丢失
     * 4. 使用link标签，每个请求单独使用一个link标签，指定时间后将link标签删除。该时间间隔
     *    可以设置得较大，尽可能使较差网络环境下也能发送出去
     */

    function _sendStatData(url, params){

        var requestURL = url 
                + ( url.indexOf('?') >= 0 ? '' : '?' )
                + $.param(params);

        setTimeout(function(){

            var $statLink = $('<link rel="'+ (_isBD() ? 'alternate ' : '') +'stylesheet" />');
            $('head').append($statLink);

            $statLink.attr(
                'href'
                , requestURL + '&_ra_=' + (new Date()).getTime()
            );

            setTimeout(function(){
                $statLink.remove();
            }, 5000);

        },0);

        return requestURL;
    }



    /**
     * @return {String} YYYYMMDDhhmmssxxx
     */
    function _time(dateStr) {
        var date;

        if (dateStr) {
            date = new Date(dateStr);
        }
        else {
            date = new Date();
        }

        return [
            date.getFullYear()
            , ( date.getMonth() + 1 < 10 ? '0' : '' ) + ( date.getMonth() - 0 + 1 )
            , ( date.getDate() < 10 ? '0' : '' ) + date.getDate()
            , ( date.getHours() < 10 ? '0' : '' ) + date.getHours()
            , ( date.getMinutes() < 10 ? '0' : '' ) + date.getMinutes()
            , ( date.getSeconds() < 10 ? '0' : '' ) + date.getSeconds()
            , ( date.getMilliseconds() < 10 
                ? '00' 
                : date.getMilliseconds() < 100 
                    ? '0' 
                    : '' 
              ) + date.getMilliseconds()
        ].join('');
    }

    /**
     * @return {String} [a-zA-Z0-9]{24}
     */
    function _randomChars(size) {
        var cArr = [],
            constStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
            len = constStr.length;

        while(size-- > 0){
            cArr.push(
                constStr.charAt(
                    Math.floor(
                        Math.random() * len 
                    )
                )
            );
        }

        return cArr.join('');
    }

    /**
     * @return {String} 24 characters string
     */
    function _fid(dateStr) {
        return _time(dateStr) + _randomChars(7);
    }

    /**
     * @description 
     * For DIDI domains, use parent domain, otherwise hostname
     */
    function _getDomain() {
        var hostname = location.hostname,
            domain = hostname;

        if(/(xiaojukeji\.com|diditaxi\.com\.cn|didialift\.com|udache\.com)$/
            .test(hostname)){
            domain = RegExp.$1;
        }
        return domain;
    }

    function _getCookie(name) {
        if(!navigator.cookieEnabled) {
            return '';
        }

        var cookie = document.cookie, 
            regexName = new RegExp('(^|\\s)' + name + '=([^;]*)', 'g');
        if(regexName.test(cookie)){
            return unescape(RegExp.$2);
        }
        return '';
    }

    /**
     * @description set or delete cookie
     * @example
     *   _setCookie('didifid'); // Delete
     *   _setCookie('didifid', '...'); // Set Cookie
     */
    function _setCookie(name, value, expires, domain, path, secure) {
        if(!navigator.cookieEnabled || !name) {
            return;
        }

        var arr = [];

        if (value === undefined) {
            // Delete
            expires = new Date('1970-01-01');
        }

        arr.push(name + '=' + escape(value || ''));

        if(expires) {
            arr.push('expires=' + expires.toGMTString());
        }

        arr.push('domain=' + ( domain || _getDomain() ));

        if(path) {
            arr.push('path=' + path);
        }
        if(secure) {
            arr.push('secure');
        }

        document.cookie = arr.join('; ');
    }

    function _ensureFID(dateStr) {

        var name = didiFID,
            date = new Date();

        // Expires in 10 years
        date.setTime(date.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);

        if(_getCookie(name) === ''){
            _setCookie(
                name
                , _fid(dateStr)
                , date
                , null
                , '/'
            );
        }
        
        return _getCookie(name);
    }

    function _getRawQuery(key, search) {
        if(!key) {
            return '';
        }
        var search = search || location.search,
            regexKey = new RegExp(
                key + '=([^&]*)' 
                , 'g'
            );

        if(regexKey.test(search)) {
            return RegExp.$1;
        }
        return '';
    }

    /**
     * @description 获取指定查询参数
     * @param {String} key 查询参数名称
     * @param {String} search 可选，查询参数，不提供则使用location.search
     */
    function _getQuery(key, search) {
        return decodeURIComponent(_getRawQuery(key, search));
    }

    /**
     * @description 发送顺风车H5日志
     * @param {String} action='...' 统计名称
     * @param {JSON} params={a:1, b:2} 统计参数
     * @param {Boolean} instantly 可选参数，true:立即发送；false:延时发送
     */
    function _sendH5BeatlesStat(action, params, instantly/*optional*/){
        var url = '//api.diditaxi.com.cn/api/v2/onlinelog',
            _params,
            _url = location.href.replace(/\?.*$/, ''),
            _ref = document.referrer.replace(/\?.*$/, ''),

            _actid = _getQuery('psource') || _getQuery('actid'),
            _channel = _getQuery('regfrom') || _getQuery('channel');

        // @todo: other common parameters

        // Empty action, abort
        if(!action) {
            return '';
        }

        _params = $.extend(        
            {
                type: 'h5_beatles'           
                , action: action
                , didifid: _ensureFID()
                , url: _url
                , ref: _ref
                , browser: browserType

                // Send channel even if it's empty
                , channel: _channel
                , actid: _actid
            }
            , params
        );
     
        if(!instantly){
            setTimeout(function(){ 
                _sendStatData(url, _params);     
            }, 100);               
        }
        else{                      
            return _sendStatData(url, _params);
        }
                                   
    }


    $.extend(DidiMonitor, {
        getQuery: _getQuery
        , setCookie: _setCookie
        , getCookie: _getCookie
        , sendBeatles: _sendH5BeatlesStat 
        , sendStatData: _sendStatData
    });

    return DidiMonitor;


});



