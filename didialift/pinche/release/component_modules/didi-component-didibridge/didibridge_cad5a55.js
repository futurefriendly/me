define('didibridge', function(require, exports, module){ (function(root, factory) {

    if(typeof define == 'function' && define.amd) {
        define(['exports'], function(exports){
            factory(exports);
        });
    }
    else if(typeof exports !== 'undefined'){
        factory(exports);
    } 
    else {
        root.DidiBridge = factory({});
    }

})(this, function(DidiBridge){



/**
* A module representing DidiJSBridge APIs. 
* @exports DidiBridge 
*/

/**
 * Bugfix for Android DidiJSBridge
 * @see http://wiki.intra.xiaojukeji.com/display/BEAT/DidiJSBridge
 */
var bugfix = (function(){

    var cleanBridge;

    function _init(){
        if(cleanBridge === undefined){
            window.DidiJSBridge = cleanBridge = create(); 
            trigger();
        }
        return window.DidiJSBridge = cleanBridge;
    }

    function create(){

        var bridgeContext = {
                queue: []
                , callback: function() {
                    var args = Array.prototype.slice.call(arguments, 0);
                    var c = args.shift();
                    var e = args.shift();
                    this.queue[c].apply(this, args);
                    if (!e) {
                        delete this.queue[c];
                    }
                }
            };

        bridgeContext.callHandler = function() {

            var args = Array.prototype.slice.call(arguments, 0);
            var queue = bridgeContext.queue;

            args.unshift('callHandler');
            var types = [];
            for (var i = 1; i < args.length; i++) {
                var item = args[i];
                var type = typeof item;
                types.push(type);
                if (type == "function") {
                    var oldLen = queue.length;
                    queue.push(item);
                    args[i] = oldLen;
                }
            }

            var jsonString = JSON.stringify({
                    method: args.shift()
                    , types: types
                    , args: args
                });

            var result = prompt(jsonString);
            var g = JSON.parse(result);

            if (g.code != 200) {
                throw "DidiJSBridge call error, code:" + g.code + ", message:" + g.result
            }
            return g.result;

        };

        return bridgeContext;
    }

    function trigger(){
        var ev = document.createEvent('HTMLEvents');
        ev.initEvent('DidiJSBridgeReady', false, false);
        document.dispatchEvent(ev);
    }

    return {
        init: _init
    };

})();



var ua = navigator.userAgent;
var isIOS = /(?:iPhone|iPad|iPod).*OS\s[\d_]+/.test(ua);
var isAndroid = /Android;?[\s\/]+[\d.]+?/.test(ua);

// ua = 'didi.passenger/4.0';


var syncCallsWithoutParams = [
        {   method: 'getUserInfo',          version: '*',       ioscbk: 1 } 
        , { method: 'getSystemInfo',        version: '*',       ioscbk: 1 }
        , { method: 'getLocationInfo',      version: '*',       ioscbk: 1 }

        , { method: 'callNativeLogin',      version: '*' }

        , { alia: 'closePage',          method: 'page_close',           version: '*' }
        , { alia: 'refreshPage',        method: 'page_refresh',         version: '*' }

        , { alia: 'showEntrance',       method: 'show_entrance',        version: '*' }
        , { alia: 'hideEntrance',       method: 'hide_entrance',        version: '*' }
        , { alia: 'invokeEntrance',     method: 'invoke_entrance',      version: '*' }
    ],

    syncCallsWithParams = [
        {   alia: 'initEntrance',       method: 'init_entrance',         version: '*' }
        , { alia: 'shareWxTimeline',    method: 'share_weixin_timeline', version: '*' }
        , { alia: 'shareWxAppmsg',      method: 'share_weixin_appmsg',   version: '*' }
        , { alia: 'shareQQAppmsg',      method: 'share_qq_appmsg',       version: '*' }
        , { alia: 'shareQZone',         method: 'share_qzone',           version: '*' }
        , { alia: 'shareSinaWeibo',     method: 'share_sina_weibo',      version: '*' }
        , { alia: 'openUrl',            method: 'open_url',              version: 'ios' }
            /** toNative */
        , { method: 'beatlesCommunicate',   version: '*' , ioscbk:1 } 

        // http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=14682692
        // , { method: 'getContacts',      version: 'android >= 4.0.0' }
    ],

    asyncCallsWithParams = [
        {   
            alia: 'uploadImageBySelect' 
            , method: 'callbackImageLiteratureReview'
            , version: 'ios >= 3.9.5, android >= 3.9.4'
        }

        , { 
            alia: 'uploadImageByCamera' 
            , method: 'callbackImageLiteratureReviewTakeCamera'
            , version: 'ios >= 3.9.5, android >= 3.9.4'
        }

        , { 
            alia: 'uploadImageByPhotoLibrary' 
            , method: 'callbackImageLiteratureReviewPhotoLibrary'
            , version: 'ios >= 3.9.5, android >= 3.9.4'
        }

        , { 
            method: 'resizeImage'
            , version: 'ios >= 4.0, android >= 3.9.5' 
        }

    ];


function findAction (method) {
    var arr = syncCallsWithoutParams.concat(
            syncCallsWithParams
            , asyncCallsWithParams
        );

    if (!method) return null;

    for (var i=0; i<arr.length; i++) {
        if (arr[i].method == method || arr[i].alia == method) {
            return arr[i];
        }
    }

    return null;
}


/**
 * Check if an action or a method is supported
 * @param {String|Object} - method name or action config object
 * @return {Boolean|Object}
 */
function check (action) {

    if (typeof action == 'string' && action) {
        action = findAction(action);
    }

    if (!action) {
        return false;
    } 

    var appVersion = getAppVersion(),
        tmp = action.version.split(/\s*,\s*/),
        rules = [];

    for (var i=0; i<tmp.length; i++){
        rules.push(tmp[i].split(/\s+/));
    }

    var rule = rules[0];

    // version: '* >= 3.9.5'
    if (rule[0] == '*' && rule.length == 3) {
        rule[0] = 'ios';
        rules.push([
            'android'
            , rule[1] 
            , rule[2]
        ]);
    } 
    // version: '*'
    else if (rule[0] == '*' && rule.length == 1) {
        rules.length = 0;
        rules = [
            [ 'ios',     '>', '0' ]
            , [ 'android', '>', '0' ]
        ];
    }
    // version: 'ios' or version: 'android'
    else if (rule[0] != '*' && rule.length == 1) {
        rules.length = 0;
        rules = [
            [ rule[0],     '>', '0' ]
            , [ rule[0] == 'ios' ? 'android' : 'ios', '<', '0' ]
        ];
    }
    // version: 'ios >= 3.9.5'
    else if (rules.length == 1) {
        rules.push([
            rule[0] == 'ios' ? 'android' : 'ios'
            , '<'
            , '0'
        ]);
    }

    var versionCheckState,
        osCheckState;

    for (var i=0; i<rules.length; i++) {
        rule = rules[i];
        if (rule[0] == 'ios') {
            osCheckState = isIOS;
        }
        else if (rule[0] == 'android') {
            osCheckState = isAndroid;
        }
        else {
            osCheckState = false;
        }
        versionCheckState = compareVersion(appVersion, rule[1], rule[2]);    
        if (osCheckState && versionCheckState ) {
            return action;
        }
    }

    return false;
}

// Just a simple implementation
function _extend(dest, obj){
    for (var i in obj) {
        dest[i] = obj[i];
    }
    return dest;
}


/**
 * Get APP version
 * @param {String|Object} [version] - version 
 * @return {Object} version object
 */
function getAppVersion (version) {
    var target = ua;

    if (typeof version == 'object') {
        return version;
    }

    if (typeof version == 'string') {
        target = 'didi.passenger/' + version;
    }

    version = ( 
        /didi\.passenger\/([\d.]+)/.test(target)
            ? RegExp.$1 
            : '0.0.0' 
    ).split('.');

    switch (version.length) {
        case 1: 
            version[1] = version[2] = 0;
            break;
        case 2: 
            version[2] = 0;
            break;
    }
    
    return {
        main: version[0] - 0
        , sub: version[1] - 0
        , mini: version[2] - 0
    };
}

function parseVersionToInt (version){
    var num = 0;

    version = getAppVersion(version);
    num += version.main * 10000;
    num += version.sub * 100;
    num += version.mini * 1;
    return num;
}


function compareVersion (version1, operator, version2) {
    var v1 = parseVersionToInt(version1),
        v2 = parseVersionToInt(version2);
    return eval(v1 + operator + v2);
}

function connectDidiJSBridge (callback) {

    if (window.DidiJSBridge) {
        isAndroid && bugfix && bugfix.init();
        callback(DidiJSBridge);
    } else {
        document.addEventListener('DidiJSBridgeReady', function() {
            isAndroid && bugfix && bugfix.init();
            callback(DidiJSBridge);
        }, false);
    }
};

connectDidiJSBridge(function(bridge){
    window.DidiBeatlesJSBridge = bridge;
    isIOS && bridge.init && bridge.init(); 

    /**
     * [_beatlesCommunicate native toWebView "_"前缀表示该方法只由客户端主动调用]
     */
    bridge._beatlesCommunicate = function(data, fn) {
        if(data && data['header']){
            var header = data['header'];
            var eventKey = header['event_key'];
            if(eventKey){
                var event = document.createEvent('Event');
                event.initEvent(eventKey);
                event.data = JSON.parse(data);
                document.dispatchEvent(event);
            }
        }
        fn && fn('{"test": "ok"}');
    }
    //ios 使用
    // bridge.registerHandler('_beatlesCommunicate', bridge._beatlesCommunicate);



});


function syncCall(action, params, callback) {
    connectDidiJSBridge(function(bridge){
        var actionConfig = findAction(action);
        if (isIOS) {
            bridge.callHandler(
                actionConfig.method 
                , JSON.stringify(params || '')
                , function(json){
                    typeof callback == 'function'
                        && callback(json);
                }
            );  
            if (!actionConfig.ioscbk) {
                typeof callback == 'function'
                    && callback();
            }
        }
        else {
            var json = bridge.callHandler(
                    action
                    , params && JSON.stringify(params)
                );  
            typeof callback == 'function'
                && callback(json);
        }
    }); 
}

function asyncCall(action, params, callback) {
    connectDidiJSBridge(function(bridge){
        if (isIOS) {
            bridge.callHandler(
                action
                , JSON.stringify(params || '')
                , function(json){
                    typeof callback == 'function'
                        && callback(json);
                }
            );  
        }
        else {
            var callbackName = 'didibridge_callback_' + (new Date()).getTime();

            window[callbackName] = function(json){
                typeof callback == 'function'
                    && callback(json);
            };

            var _params = _extend( 
                    params || {}
                    , { callback: callbackName } 
                );

            bridge.callHandler(
                action
                , JSON.stringify(_params)
            );  

        }
    }); 
}




(function(){

    var arr,
        len;

    arr = syncCallsWithoutParams;
    len = arr.length;
    for(var i=0; i<len; i++){
        (function(){
            var action = arr[i];
            DidiBridge[action.alia || action.method] = function(callback){
                if (check(action)) {
                    syncCall(action.method, '', callback);
                }
            };
        })();
    }

    arr = syncCallsWithParams;
    len = arr.length;
    for(var i=0; i<len; i++){
        (function(){
            var action = arr[i];
            DidiBridge[action.alia || action.method] = function(params, callback){
                if (check(action)) {
                    syncCall(action.method, params, callback);
                }
            };
        })();
    }

    arr = asyncCallsWithParams;
    len = arr.length;
    for(var i=0; i<len; i++){
        (function(){
            var action = arr[i];
            DidiBridge[action.alia || action.method] = function(params, callback){
                if (check(action)) {
                    asyncCall(action.method, params, callback);
                }
            };
        })();
    }

})();

_extend(DidiBridge, {
    /** appVersion property */
    appVersion: getAppVersion(), 

    /** Connect to JS Bridge to call certain handler */
    connect: connectDidiJSBridge,

    /**
     * Check if an action or a method is supported
     */
    check: check,

    /** Compare two versions */
    compareVersion: compareVersion
});


return DidiBridge;


});
 
});