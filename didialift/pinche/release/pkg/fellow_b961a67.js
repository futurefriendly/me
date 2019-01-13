define('cookie', function(require, exports, module){ /**
 *
 *   @description: 该文件用于cookie基础操作
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - cookie基础操作定义
 *
 **/


    'use strict';
    

    /**
     * @module base.cookie
     * @namespace Cookie
     * @property {boolean} isEnabled                    - 是否支持Cookie
     * @property {function} set                         - 设置Cookie
     * @property {function} get                         - 读取指定的Cookie
     * @property {function} del                         - 删除指定的Cookie
     * @property {function} test                        - 测试浏览器是否支持Cookie
     * @property {function} serialize                   - 将对象转换成字符串
     * @property {function} deserialize                 - 将字符串转换成对象
     * @property {function} setSession                  - 设置sessionStorage
     * @property {function} getSession                  - 获取sessionStorage
     */
    var Cookie = {

        /**
         * @memberof Cookie
         * @summary 是否支持Cookie
         * @type {boolean}
         */
        isEnabled: false,

        /**
         * @memberof Cookie
         * @summary 设置Cookie
         * @type {function}
         * @param {String} name 要设置的Cookie名称
         * @param {String} value 要设置的Cookie值
         * @param {Int} expire 过期时间，单位是小时
         * @param {String} domain 域，默认为本域
         */
        set: function (name, value, expire, domain) {
            var expires = '';

            if (0 !== expire) {
                var t = new Date();
                t.setTime(t.getTime() + (expire || 24) * 3600000);
                expires = ';expires=' + t.toGMTString();
            }
            var s = escape(name) + '=' + escape(value) + expires + ';path=/' + (domain ? (';domain=' + domain) : '');
            document.cookie = s;

            return true;
        },

        /**
         * @memberof Cookie
         * @summary 读取指定的Cookie
         * @type {function}
         * @param {String} name 要获取的Cookie名称
         * @return {String} 对应的Cookie值，如果不存在，返回{null}
         */
        get: function (name) {
            var arrCookie = document.cookie.split(';'),
                arrS;

            for (var i = 0; i < arrCookie.length; i++) {
                arrS = arrCookie[i].split('=');

                if (arrS[0].trim() === name) {

                    return unescape(arrS[1]);
                }
            }

            return '';
        },

        /**
         * @memberof Cookie
         * @summary 删除指定的Cookie
         * @type {function}
         * @param {String} name 要获取的Cookie名称
         * @param {String} domain 域，默认为本域
         * @param {String} path 路径
         */
        del: function (name, domain, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie = name + '=; expires=' + exp.toGMTString() + ';' + (path ? ('path=' + path + '; ') : 'path=/; ') + (domain ? ('domain=' + domain + ';') : ('domain=' + window.location.host + ';'));
        },

        /**
         * @memberof Cookie
         * @summary 测试浏览器是否支持Cookie, 如果浏览器支持Cookie,Cookie.isEnabled的值为TRUE,不支持Cookie.isEnabled的值为FALSE
         * @type {function}
         * @return {boolean}
         */
        test: function () {
            var testKey = '_c_t_';
            this.set(testKey, '1');
            this.isEnabled = ('1' === this.get(testKey));
            this.del(testKey);

            return this.isEnabled;
        },

        /**
         * @memberof Cookie
         * @summary 将对象转换成字符串
         * @type {function}
         * @param {object} value                            - 数据对象
         * @return {string}
         */
        serialize: function (value) {

            return JSON.stringify(value);
        },

        /**
         * @memberof Cookie
         * @summary 将字符串转换成对象
         * @type {function}
         * @param {string} value                            - 数据字符串
         * @return {object|undefined}                       - 返回对象，出错时返回undefined
         */
        deserialize: function (value) {

            if (typeof value !== 'string') {

                return value;
            }

            try {

                return JSON.parse(value);

            } catch (e) {

                return value || {};
            }
        },

        /**
         * @memberof Cookie
         * @summary 设置sessionStorage
         * @type {function}
         * @param {string} name                             - 参数名称
         * @param {string} value                            - 参数值
         */
        setSession: function (name, value) {

            try {

                if (!!window.sessionStorage) {
                    window.sessionStorage.setItem(name, this.serialize(value));
                }

            } catch (e) {
                alert('not support session', e);
                this.set(name, this.serialize(value), 24);
            }
        },

        /**
         * @memberof Cookie
         * @summary 获取sessionStorage
         * @type {function}
         * @param {string} name                             - 参数名称
         * @return {string}
         */
        getSession: function (name) {
            var sRet = '';

            try {

                if (!!window.sessionStorage) {
                    sRet = this.deserialize(window.sessionStorage.getItem(name));
                }

            } catch (e) {
                alert('not support session', e);
                sRet = this.deserialize(this.get(name));
            }

            return sRet;
        }
    };

    Cookie.test();
    window.Cookie = Cookie;
    module.exports = Cookie;

 
});
;define('store', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义localStorage工具类
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - localStorage工具类
 *
 **/
	  
  'use strict';
  
  /**
   * @module base.store
   * @namespace store
   * @property {function}  set                      - 设置存储项的键和相应的值
   * @property {function}  get                      - 根据键读取相应的键值
   * @property {function}  remove                   - 清除指定键值对
   * @property {function}  clearAll                 - 清除所有键值对
   * @property {function}  getAll                   - 返回由所有键值对组成的对象
   * @property {function}  forEach                  - 遍历所有键值对，以每个键和键值为参数执行传入的callback函数
   */
   
  var store = {},
      win = window,
      doc = document,
      localStorageName = 'localStorage',
      scriptTag = 'script',
      storage;

  try {
    storage = win[localStorageName];
  
  } catch (e) {}

  var noop = function () {};

  store.disabled = false;

  store.set = noop;

  store.get = noop;

  store.remove = noop;

  store.clear = noop;

  store.transact = function (key, defaultVal, transactionFn) {
    var val = store.get(key);
    
    if (transactionFn === null) {
      transactionFn = defaultVal;
      defaultVal = null;
    }

    if (typeof val === 'undefined') {
      val = defaultVal || {};
    }
    transactionFn(val);
    store.set(key, val);
  };

  store.getAll = function () {};

  store.forEach = function () {};

  store.serialize = function (value) {
    
    return JSON.stringify(value);
  };

  store.deserialize = function (value) {
    
    if (typeof value !== 'string') {
      return undefined;
    }

    try {

      return JSON.parse(value);

    } catch (e) {
      
      return value || undefined;
    }
  };

  // Functions to encapsulate questionable FireFox 3.6.13 behavior
  // when about.config::dom.storage.enabled === false
  // See https://github.com/marcuswestin/store.js/issues#issue/13
  var isLocalStorageNameSupported = function () {
    try {

      return (localStorageName in win && win[localStorageName]);
    
    } catch (err) {
      
      return false;
    }
  };

  if (isLocalStorageNameSupported()) {
    storage = win[localStorageName];

    /**
     * @memberof store
     * @summary 设置存储项的键和相应的值
     * @type {function}
     * @param {string} key                        - 键
     * @param {string} val                        - 值
     * @return {string}           				  - 返回设置的键值
     */
    store.set = function (key, val) {
      if (val === undefined) {
        return store.remove(key);
      }
      storage.setItem(key, store.serialize(val));
      return val;
    };

    /**
     * @memberof store
     * @summary 根据键读取相应的键值
     * @type {function}
     * @param {string} key                        - 键
     * @return {object|array|undefined}           - 返回键对应的键值，可能是已被解析过的对象、字符串或undefined
     */
    store.get = function (key) {

      return store.deserialize(storage.getItem(key));
    };

   /**
     * @memberof store
     * @summary 清除指定键值对
     * @type {function}
     * @param {string} key                        - 键
     */
    store.remove = function (key) {
      storage.removeItem(key);
    };

   	/**
     * @memberof store
     * @summary 清除所有键值对
     * @type {function}
     */
    store.clearAll = function () {
      storage.clear();
    };

   /**
   * @namespace store
   * @property {function} forEach                 - 遍历所有键值对，以每个键和键值为参数执行传入的callback函数
   * @param {string} callback                     - 将要以每个键和键值为参数执行的函数
   */
    store.forEach = function (callback) {
      
      for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        callback(key, store.get(key));
      }
    };
  
  } else if (doc.documentElement.addBehavior) {
    var storageOwner,
      storageContainer;

    try {
      storageContainer = new ActiveXObject('htmlfile');
      storageContainer.open();

      var writeStr = '<' + scriptTag + '>document.w=window</' + scriptTag + '>';
      writeStr += '<iframe src="/favicon.ico"></iframe>';
     
      storageContainer.write(writeStr);
      storageContainer.close();
      storageOwner = storageContainer.w.frames[0].document;
      storage = storageOwner.createElement('div');
    
    } catch (e) {
      // somehow ActiveXObject instantiation failed (perhaps some special
      // security settings or otherwse), fall back to per-path storage
      storage = doc.createElement('div');
      storageOwner = doc.body;
    }

    var withIEStorage = function (storeFunction) {
      
      var rst = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(storage);
        // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
        // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
        storageOwner.appendChild(storage);
        storage.addBehavior('#default#userData');
        storage.load(localStorageName);
        var result = storeFunction.apply(store, args);
        storageOwner.removeChild(storage);
        return result;
      };

      return rst;
    };

    // In IE7, keys cannot start with a digit or contain certain chars.
    // See https://github.com/marcuswestin/store.js/issues/40
    // See https://github.com/marcuswestin/store.js/issues/83
    var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
    
    var ieKeyFix = function (key) {
      
      return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___');
    };

    store.set = withIEStorage(function (storage, key, val) {
      key = ieKeyFix(key);
      
      if (val === undefined) {
        
        return store.remove(key);
      }
      storage.setAttribute(key, store.serialize(val));
      storage.save(localStorageName);
      
      return val;
    });

    store.get = withIEStorage(function (storage, key) {
      key = ieKeyFix(key);

      return store.deserialize(storage.getAttribute(key));
    });

    store.remove = withIEStorage(function (storage, key) {
      key = ieKeyFix(key);
      storage.removeAttribute(key);
      storage.save(localStorageName);
    });

    store.clear = withIEStorage(function (storage) {
      var attributes = storage.XMLDocument.documentElement.attributes;
      storage.load(localStorageName);

      for (var i = 0, l = attributes.length; i < l; i++) {
        var attr = attributes[i];
        storage.removeAttribute(attr.name);
      }
      storage.save(localStorageName);
    });

    store.forEach = withIEStorage(function (storage, callback) {
      var attributes = storage.XMLDocument.documentElement.attributes;
      
      for (var i = 0, l = attributes.length; i < l; i++) {
        var attr = attributes[i];
        callback(attr.name, store.deserialize(storage.getAttribute(attr.name)));
      }
    });
  }

	 /**
	* @memberof store
	* @summary 读取所有的键值对
	* @type {function}
	* @return {object}                           - 返回由所有键值对组成的对象
	*/
	store.getAll = function () {
	  var ret = {};
	  
	  store.forEach(function (key, val) {
	    ret[key] = val;
	  });

	  return ret;
	};

  try {
    var testKey = '__storejs__';
    store.set(testKey, testKey);

    if (store.get(testKey) !== testKey) {
      store.disabled = true;
    }
    store.remove(testKey);

  } catch (e) {
    store.disabled = true;
  }
  store.enabled = !store.disabled;

/*  if (typeof module !== 'undefined' && module.exports && this.module !== module) {
      module.exports = store;

    } else if (typeof define === 'function' && define.amd) {
      define(store);
    }*/

  //兼容老版本
  store.getStorage = function () {
    try {
      /* 在Android 4.0下，如果webview没有打开localStorage支持，在读取localStorage对象的时候会导致js运行出错，所以要放在try{}catch{}中 */
      storage = win[localStorageName];
    
    } catch (e) {
      console.log('localStorage is not supported');
    }
    
    return storage;
  };

  /**
  * 清除本地存贮数据
  * @param {String} prefix 可选，如果包含此参数，则只删除包含此前缀的项，否则清除全部缓存
  */
  store.clear = function (prefix) {
    var storage = store.getStorage();

    if (storage) {
      
      if (prefix) {
        
        for (var key in storage) {
          
          if (0 === key.indexOf(prefix)) {
            storage.removeItem(key);
          }
        }

      } else {
        storage.clear();
      }
    }
  };
  
  window.Store = store;
  module.exports = store;

 
});
;define('didibridge', function(require, exports, module){ (function(root, factory) {

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
;define('didi-component-ddplayer/base/vars.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于给VARS扩展设备/平台判断的相关参数和部分方法扩展
 *
 *   @version    : 1.0.2
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - VARS扩展设备、平台判断的相关参数和部分方法扩展
 *                 1.0.2 - 新增note3判断参数IsSAMSUNGNote3
 *                         新增IsBaiduBoxApp、IsOldBaiduBrowser和IsNewUCBrowser参数
 *
 **/


  'use strict';
  
  /**
   * @module base/vars
   * @namespace VARS
   * @property {boolean}  ENABLE_DEBUG                - 是否启用全局调试
   * @property {string}   API_KEY                     - api_key
   * @property {boolean}  IsAutoTrace                 - window加载完后是否自动发送trace类数据
   * @property {string}   UA                          - 浏览器userAgent
   * @property {number}   PixelRatio                  - 设备屏幕象素密度
   * @property {boolean}  IS_HISTORY_SUPPORT          - 是否支持h5，不刷新页面，修改页面访问历史链接
   * @property {boolean}  IS_EXTERNAL_PLAYER          - 是否启外部player
   * @property {boolean}  IsAndroid                   - 是否是androd设备
   * @property {boolean}  IsAndroidPad                - 是否是androd pad
   * @property {boolean}  IsIOS                       - 是否是ios设备
   * @property {boolean}  IsIpad                      - 是否是ios pad
   * @property {boolean}  IsIpod                      - 是否是ios pod
   * @property {boolean}  IsIphone                    - 是否是ios phone
   * @property {boolean}  IsWindowsPhone              - 是否是windows phone
   * @property {boolean}  IsOldWindowsPhone           - 是否是老版本windows phone(8.1之前算)
   * @property {boolean}  IsNewWindowsPhone           - 是否是新版本windows phone(8.1之后算)
   * @property {boolean}  IsWindowsPad                - 是否是windows pad
   * @property {boolean}  IsWindows                   - 是否是windows系统
   * @property {boolean}  IsVivoPhone                 - 是否是vivo手机
   * @property {boolean}  IsIEBrowser                 - 是否是ie browser
   * @property {boolean}  IsSafariBrowser             - 是否是safari browser
   * @property {boolean}  IsChromeBrowser             - 是否是chrome browser
   * @property {boolean}  IsWeiXinBrowser             - 是否是微信 webview
   * @property {boolean}  IsQQBrowser                 - 是否是qq browser
   * @property {boolean}  IsUCBrowser                 - 是否是uc browser
   * @property {boolean}  IsOldUCBrowser              - 是否是老版本uc browser(10.2之前版本为老版本，认为不支持m3u8)
   * @property {boolean}  IsNewUCBrowser              - 是否是新版本uc browser(10.2之后版本为新版本，认为支持m3u8)
   * @property {boolean}  IsMiBrowser                 - 是否是小米 browser
   * @property {boolean}  IsBaiduBrowser              - 是否是baidu browser
   * @property {boolean}  IsOldBaiduBrowser           - 是否是旧baidu browser 5.7.3.0之前为新百度播放器 
   * @property {boolean}  IsNewBaiduBrowser           - 是否是新baidu browser 5.7.3.0之后为新百度播放器
   * @property {boolean}  IsBaiduBoxApp               - 是否是手机baidu
   * @property {boolean}  IsTouch                     - 是否支持触屏
   * @property {boolean}  OsVersion                   - 获取系统版本
   * @property {boolean}  IsMIOne                     - 是否是小米1
   * @property {boolean}  IsXiaoMI                    - 是否是小米
   * @property {boolean}  IsVivoPhone                 - 是否vivo手机
   * @property {boolean}  IsSonyPhone                 - 是否是索尼手机
   * @property {boolean}  IsSAMSUNG                   - 是否是三星
   * @property {boolean}  IsSAMSUNGNote3              - 是否是三星note3
   * @property {string}   BrowserVersion              - 浏览器版本
   * @property {string}   START_EVENT                 - 动作起始事件
   * @property {string}   MOVE_EVENT                  - 动作移动事件
   * @property {string}   END_EVENT                   - 动作结束事件
   * @property {string}   CANCEL_EVENT                - 动作取消事件
   * @property {string}   RESIZE_EVENT                - 屏幕横竖屏切换事件
   * @property {boolean}  IsHistorySupport            - 是否支持history
   * @property {boolean}  IsDiDiBrowser               - 是否是DiDiApp webview
   * @property {boolean}  IsWeiBoBrowser              - 是否是weibo webview
   *
   * @example
   *   var VARS = require('./vars.js');
   *   if (VARS.ENABLE_DEBUG) {}
   *
   */
  var VARS = {};

  /**
   * @summary 对外接口，用户设置和获取播放记录，具体属性由播放器添加
   * @namespace DiDiVideoJSBridge
   * @global
   */
  window.DiDiVideoJSBridge = window.DiDiVideoJSBridge || {};

  /**
   * @memberof VARS
   * @summary 是否启用全局调试
   * @type {boolean}
   */
  VARS.ENABLE_DEBUG = false;

  /**
   * @memberof VARS
   * @summary 是否支持h5，不刷新页面，修改页面访问历史链接
   * @type {boolean}
   */
  VARS.IS_HISTORY_SUPPORT = ('pushState' in history);

  /**
   * @memberof VARS
   * @summary 浏览器userAgent
   * @type {boolean}
   */
  VARS.UA = window.navigator.userAgent;

  
  //获取设备密度
  var getDevicePixelRatio = function () {
    var ratio = 1;
    
    try {
      
      if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
        ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
      
      } else if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      
      } else {
        ratio = window.devicePixelRatio;
      }
      ratio = parseFloat(ratio) || 1;

    } catch (e) {}
    
    return ratio;
  };
  /**
   * @memberof VARS
   * @summary 设备屏幕象素密度
   * @type {number}
   */
  VARS.PixelRatio = getDevicePixelRatio();



  /**
   * @memberof VARS
   * @summary 是否是androd设备
   * @type {boolean}
   */
  // HTC Flyer平板的UA字符串中不包含Android关键词
  // 极速模式下视频不显示 UCWEB/2.0 (Linux; U; Adr 4.0.3; zh-CN; LG-E612) U2/1.0.0 UCBrowser/9.6.0.378 U2/1.0.0 Mobile
  VARS.IsAndroid = !!(/Android|HTC|Adr/i.test(VARS.UA)  || !!(window.navigator.platform + '').match(/Linux/i));
  
  /**
   * @memberof VARS
   * @summary 是否是ios pad
   * @type {boolean}
   */
  VARS.IsIpad = !VARS.IsAndroid && /iPad/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是ios pod
   * @type {boolean}
   */
  VARS.IsIpod = !VARS.IsAndroid && /iPod/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是是否是ios phone
   * @type {boolean}
   */
  VARS.IsIphone = !VARS.IsAndroid && /iPod|iPhone/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是ios设备
   * @type {boolean}
   */
  VARS.IsIOS = VARS.IsIpad || VARS.IsIphone;

  /**
   * @memberof VARS
   * @summary 是否是windows phone
   * @type {boolean}
   */
  VARS.IsWindowsPhone = /Windows Phone/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是老版本windows phone(8.1之前算) winphone 8.1之前算old(采用全屏播放),8.1(含)之后，采用的是标准播放(小窗+假全屏)
   * @type {boolean}
   */
  VARS.IsOldWindowsPhone = /Windows\sPhone\s([1234567]\.|8\.0)/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是新版本windows phone(8.1之前算) winphone 8.1之前算old(采用全屏播放),8.1(含)之后，采用的是标准播放(小窗+假全屏)
   * @type {boolean}
   */
  VARS.IsNewWindowsPhone = VARS.IsWindowsPhone && !VARS.IsOldWindowsPhone;

  /**
   * @memberof VARS
   * @summary 是否是windows pad
   * @type {boolean}
   */
  VARS.IsWindowsPad = /Windows\sPad/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是windows系统
   * @type {boolean}
   */
  VARS.IsWindows = /Windows/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是vivo手机
   * @type {boolean}
   */
  VARS.IsVivoPhone = /vivo/i.test(VARS.UA);

  VARS.ScreenSizeCorrect = 1;
  
  if (VARS.IsAndroid) {
    
    if ((window['screen']['width'] / window['innerWidth']).toFixed(2) ===  VARS.PixelRatio.toFixed(2)) {
      VARS.ScreenSizeCorrect = 1 / VARS.PixelRatio;
    }
  }
  VARS.AdrPadRegex = /pad|XiaoMi\/MiPad|lepad|MediaPad|GT-P|SM-T|GT-N5100|sch-i800|Nexus\s7|Nexus\s8|Nexus\s11|Kindle Fire HD|Tablet/i;
  VARS.ScreenSize = Math.floor(window.screen['width'] * VARS.ScreenSizeCorrect) + 'x' + Math.floor(window.screen['height'] * VARS.ScreenSizeCorrect);
  //根据这些值就可以反向算出屏幕的物理尺寸 ,屏幕尺寸=屏幕对角线的像素值/（密度*160）
  //屏幕尺寸=Math.sqrt(Math.pow(width, 2)+Math.pow(height, 2))/ (密度*160)
  //判断是否为平板
  var isGpad = function () {
    //安卓pad正则
    var padScreen = 1;
    var _IsAndroidPad = false;
    var _ratio = VARS.ScreenSizeCorrect || 1;
    //像素
    var sw = Math.floor(window.screen.width * _ratio);
    var sh = Math.floor(window.screen.height * _ratio);
    var inch = 1;
    
    try {
      //对角线长度大于
      padScreen = parseFloat(Math.sqrt(sw * sw + sh * sh));
      //尺寸
      inch = parseFloat(padScreen / (160 * VARS.PixelRatio));
    
    } catch (e) {}
    // 对角线长度大于1280 则为Pad
    if (!!('ontouchstart' in window) && VARS.IsAndroid) {

      if (/mobile/i.test(VARS.UA)) {
        _IsAndroidPad = false;

      } else {
        var adrPad = !!(VARS.AdrPadRegex.test(VARS.UA));

        if (adrPad) {
          _IsAndroidPad = true;
        } else {
          // 对角线长度大于 2500 ,inch > 7.8  则为Pad
          if (!_IsAndroidPad && (padScreen >= 2500 || inch > 7.8)) {
            _IsAndroidPad = true;
          }
        }
      }
    }
    //alert(' width:'+sw+' ,height:'+sh +' ,PixelRatio:' +PixelRatio+' ,pScreen: '+padScreen +' ,inch:'+inch  +' ,isgpad: ' +_IsAndroidPad +' '+UA);
    return _IsAndroidPad;
  };

  /**
   * @memberof VARS
   * @summary 是否是androd pad
   * @type {boolean}
   */
  VARS.IsAndroidPad = isGpad();

  /**
   * @memberof VARS
   * @summary 是否是ie browser
   * @type {boolean}
   */
  VARS.IsIEBrowser = !!document.all && ((navigator.platform === 'Win32') || (navigator.platform === 'Win64') || (navigator.platform === 'Windows'));

  /**
   * @memberof VARS
   * @summary 是否是safari browser
   * @type {boolean}
   */
  VARS.IsSafariBrowser = !! (VARS.UA.match(/Safari/i) && !VARS.IsAndroid);

  /**
   * @memberof VARS
   * @summary 是否是chrome browser
   * @type {boolean}
   */
  VARS.IsChromeBrowser = !! (VARS.UA.match(/Chrome/i) && !VARS.IsAndroid);

  /**
   * @memberof VARS
   * @summary 是否是微信 webview
   * @type {boolean}
   */
  VARS.IsWeiXinBrowser = !! (window['WeixinJSBridge'] || /MicroMessenger/i.test(VARS.UA));  

  /**
   * @memberof VARS
   * @summary 是否是DiDiApp webview
   * @type {boolean}
   */
  VARS.IsDiDiBrowser = !! (window['DidiJSBridge'] || /didi.passenger/.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是weibo webview
   * @type {boolean}
   */
  VARS.IsWeiBoBrowser = /weibo/.test(VARS.UA.toLowerCase());

  /**
   * @memberof VARS
   * @summary 是否是qq browser
   * @type {boolean}
   */
  VARS.IsQQBrowser = !!(/MQQBrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是uc browser
   * @type {boolean}
   */
  VARS.IsUCBrowser = !!(/UCBrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是老版本uc browser(10.2之前版本为老版本，认为不支持m3u8)
   * @type {boolean}
   */
  VARS.IsOldUCBrowser = !!(/UCBrowser\/([1-9]\..*|10\.[01].*)/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是老版本uc browser(10.2之前版本为老版本，认为不支持m3u8)
   * @type {boolean}
   */
  VARS.IsNewUCBrowser = VARS.IsUCBrowser && !VARS.IsOldUCBrowser;

  /**
   * @memberof VARS
   * @summary 是否是小米 browser
   * @type {boolean}
   */
  VARS.IsMiBrowser = !!(/MiuiBrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是baidu browser
   * @type {boolean}
   */
  VARS.IsBaiduBrowser = !!(/baidubrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是手机baidu
   * @type {boolean}
   */
  VARS.IsBaiduBoxApp = !!(/baiduboxapp/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是老baidu browser 5.7.3.0之前为老版本百度播放器
   * @type {boolean}
   */
  VARS.IsOldBaiduBrowser = !!(/baidubrowser\/([01234]\..*|5\.[0123456]\..*|5\.7\.[012])/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是新baidu browser 5.7.3.0之后为新百度播放器，新版本播放器能够正常触发timeupdate事件和允许小窗播放(小窗video标签能遮盖导航栏)
   * @type {boolean}
   */
  VARS.IsNewBaiduBrowser = VARS.IsBaiduBrowser && !VARS.IsOldBaiduBrowser;

  /**
   * @memberof VARS
   * @summary 是否支持触屏
   * @type {boolean}
   */
  VARS.IsTouch = 'ontouchstart' in window;

  //获取浏览器版本
  var getBrowserVer = function () {
    var ua = VARS.UA;
    var MQQBrowser = ua.match(/MQQBrowser\/(\d+\.\d+)/i),
        MQQClient = ua.match(/QQ\/(\d+\.(\d+)\.(\d+)\.(\d+))/i),
        WeChat = ua.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/) || ua.match(/MicroMessenger\/((\d+)\.(\d+))/),
        MiuiBrowser = ua.match(/MiuiBrowser\/(\d+\.\d+)/i),
        UC = ua.match(/UCBrowser\/(\d+\.\d+(\.\d+\.\d+)?)/) || ua.match(/\sUC\s/),
        IEMobile = ua.match(/IEMobile(\/|\s+)(\d+\.\d+)/),
        //HTC = ua.indexOf('HTC') > -1,
        ipod = ua.match(/(ipod\sOS)\s([\d_]+)/);
    var ver = NaN;

    if (window.ActiveXObject) {
      ver = 6;
      
      if (window.XMLHttpRequest || (ua.indexOf('MSIE 7.0') > -1)) {
        ver = 7;
      }

      if (window.XDomainRequest || (ua.indexOf('Trident/4.0') > -1)) {
        ver = 8;
      }
      
      if (ua.indexOf('Trident/5.0') > -1) {
        ver = 9;
      }

      if (ua.indexOf('Trident/6.0') > -1) {
        ver = 10;
      }
      
    } else if (ua.indexOf('Trident/7.0') > -1) {
      ver = 11;
    }

    if (ipod) {
      ver = ipod[2].replace(/_/g, '.');
    }

    if (MQQBrowser) {
      ver = MQQBrowser[1];
    }

    if (MQQClient) {
      ver = MQQClient[1];
    }

    if (WeChat) {
      ver = WeChat[1]; //weixin
    }

    if (MiuiBrowser) {
      ver = MiuiBrowser[1];
    }

    if (UC) {
      ver = UC[1] || NaN;
    }

    if (MQQBrowser && (!window.mtt || !window.mtt.getBrowserParam) && VARS.IsAndroid) {
      ver = '9.6.0' || NaN;
    }

    if (IEMobile) {
      ver = IEMobile[2];
    }

    return ver;
  };
  /**
   * @memberof VARS
   * @summary 浏览器版本
   * @type {string}
   */
  VARS.BrowserVersion = getBrowserVer();

  var getOsVer = function () {
    var ua = VARS.UA;
    var ver = NaN;

    if ($.os && $.os.version) {
      ver = $.os.version;
    
    } else {
      var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
          android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
          ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
          ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
          iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
          webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
          kindle = ua.match(/Kindle\/([\d.]+)/),
          blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
          bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
          rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);

      if (webkit) {
        ver = webkit[1];
      }

      if (android) {
        ver = android[2];
      }

      if (iphone && !ipod) {
        ver = iphone[2].replace(/_/g, '.');
      }

      if (ipad) {
        ver = ipad[2].replace(/_/g, '.');
      }

      if (ipod) {
        ver = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
      }

      if (webos) {
        ver = webos[2];
      }

      if (blackberry) {
        ver = blackberry[2];
      }

      if (bb10) {
        ver = bb10[2];
      }

      if (rimtabletos) {
        ver = rimtabletos[2];
      }

      if (kindle) {
        ver = kindle[1];
      }
    }

    return ver;
  };
  /**
   * @memberof VARS
   * @summary 获取系统版本
   * @type {boolean}
   */
  VARS.OsVersion = getOsVer();

  /**
   * @memberof VARS
   * @summary 是否是小米1
   * @type {boolean}
   */
  VARS.IsMIOne = /MI-ONE/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是小米
   * @type {boolean}
   */
  VARS.IsXiaoMI = /MI/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否vivo手机
   * @type {boolean}
   */
  VARS.IsVivoPhone = /vivo/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是索尼手机
   * @type {boolean}
   */
  VARS.IsSonyPhone = /Sony/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是三星设备
   * @type {boolean}
   */
  VARS.IsSAMSUNG = /SAMSUNG/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是三星note3
   * @type {boolean}
   */
  VARS.IsSAMSUNGNote3 = /SAMSUNG SM-N90/i.test(VARS.UA);
  /**
   * @memberof VARS
   * @summary 动作起始事件
   * @type {boolean}
   */
  VARS.START_EVENT = VARS.IsTouch ? 'touchstart' : 'mousedown';

  /**
   * @memberof VARS
   * @summary 动作移动事件
   * @type {boolean}
   */
  VARS.MOVE_EVENT = VARS.IsTouch ? 'touchmove' : 'mousemove';

  /**
   * @memberof VARS
   * @summary 动作结束事件
   * @type {boolean}
   */
  VARS.END_EVENT = VARS.IsTouch ? 'touchend' : 'mouseup';

  /**
   * @memberof VARS
   * @summary 动作取消事件
   * @type {boolean}
   */
  VARS.CANCEL_EVENT = VARS.IsTouch ? 'touchcancel' : 'mouseup';

  /**
   * @memberof VARS
   * @summary 屏幕横竖屏切换事件
   * @type {boolean}
   */
  VARS.RESIZE_EVENT = 'onorientationchange' in window ? 'orientationchange' : 'resize';

  /**
   * @memberof VARS
   * @summary 是否支持history
   * @type {boolean}
   */
  VARS.IsHistorySupport = ('pushState' in history);

  //导出接口
  module.exports = VARS;
  
  window.ddvp.VARS = VARS;
   
 
});
;define('didi-component-ddplayer/base/console.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义日志(工具)方法
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 义日志(工具)方法
 *
 **/


  'use strict';

  var vars = require('didi-component-ddplayer/base/vars.js');
  
  /**
   * @module base/console
   * @namespace Console
   * @property {function}  log                      - 以log形式输入日志
   * @property {function}  debug                    - 以debug形式输入日志
   * @property {function}  info                     - 以info形式输入日志
   * @property {function}  error                    - 以error形式输入日志
   * @property {function}  warn                     - 以warn形式输入日志
   *
   * @example
   *   var Console = require('./console.js');
   *   Console.log('222');
   */
  var Console = {
    level: 'info',
    dateFormat: 'yyyyMMdd hh:mm:ss',
    DOM: null,
    line: '<p class="Console-line"></p>',
    tgt: '<div id="Console-log" style="-webkit-overflow-scrolling:touch;overflow:auto;line-height:1.5;z-index:5000;width:100%;font-size:11px;background:rgba(0,0,0,.8);color:#fff;bottom:0;-webkit-user-select: initial;"></div>',//pointer-events:none;
    style: '<style>.Console-line{ margin-top:-1px;padding:.5em;border-top:1px solid rgba(255,255,255,.3);width:70% } .c_info .c_log { color:white; } .c_error { color:red; } .c_warn { color:yellow; } .c_debug { color:green; } </style>',
    inited: false,
  };

  //业务对象
  var service = {};
  //内部工具类
  var util = {};

  //获取参数类型
  util.getType = function (t) {
    var _t, o = t;
    
    return ((_t = typeof (o)) === "object" ? o === null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
  };

  //转换成指定模式的时间字符串
  util.DateFormat = function (date, format) {
    var o = {
      "M+" : date.getMonth() + 1, // month
      "d+" : date.getDate(), // day
      "h+" : date.getHours(), // hour
      "m+" : date.getMinutes(), // minute
      "s+" : date.getSeconds(), // second
      "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
      "S" : date.getMilliseconds()
    // millisecond
    };
    try{
        if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {

          if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
          }
        }
    }catch(e){
        console.log(e);
    }

    return format;
  };

  //返回模板对象
  service.logObj = function (level) {
    var l = level || "INFO";
    var logobj = {
      timestamp : service.getTimestamp(),
      level : l
    };
    
    return logobj;
  };

  //生成输出标头
  service.applyData = function (data) {
    data.alisLevel = data.level.toUpperCase().substring(0, 1);
    var t = [/*'',data.timestamp,*/" [ ", data.level, ' ] '].join('');
    
    return t;
  };

  //获取当前时间戳字符串
  service.getTimestamp = function () {
    
    return util.DateFormat(new Date(), Console.dateFormat);
  };

  //添加html
  service.output = function (prefixObj, text1, text2) {
    
    if (typeof text1 !== 'undefined' && typeof text2 !== 'undefined') {
      console.log(text1, text2);
    
    } else if (typeof text1 !== 'undefined') {
      console.log(text1);
    }

    if (!vars.ENABLE_DEBUG) {

      return;
    }

    try {
      //如果没有创建过log容器，则初始化容器
      if (!Console.inited) {
        service.init();
      }
      var div = document.createElement('div');
      div.className = 'c_' + prefixObj.level.toLowerCase() || "c_info";
      var html = service.applyData(prefixObj) + " " + text1;

      if (typeof text2 !== 'undefined') {
        html += ', ' + text2;
      }

      div.innerHTML = html;

      if ($('.c_log').length > 0) {
        Console.DOM.insertBefore(div, $('.c_log')[0]);
      
      } else {
        Console.DOM.appendChild(div);
      }

    } catch (e) {
      console.log("exception :" + e);
    }
  };

  //业务初始化
  service.init = function () {
    
    if (!Console.inited) {
      var style = document.createElement("style");
      style.innerHTML = Console.style;
      document.body.appendChild(style);
      var div = document.createElement("div");
      div.innerHTML = Console.tgt;
      document.body.appendChild(div);
      Console.DOM = document.getElementById('Console-log');
      Console.inited = true;
    }
  };

  /**
   * @memberof Console
   * @summary 以log形式输入日志
   * @type {function}
   * @property text1                            - 需要打印的内容1
   * @property text2                            - 需要打印的内容2,和内容1用逗号分隔
   */
  Console.log = function (text1, text2) {
    var logs = service.logObj("LOG");
    service.output(logs, text1, text2);
  };

  /**
   * @memberof Console
   * @summary 以log形式输入日志
   * @type {function}
   * @property text1                            - 需要打印的内容1
   * @property text2                            - 需要打印的内容2,和内容1用逗号分隔
   */
  Console.debug = function (text1, text2) {
    var logs = service.logObj("DEBUG");
    service.output(logs, text1, text2);
  };

  /**
   * @memberof Console
   * @summary 以info形式输入日志
   * @type {function}
   * @property text1                            - 需要打印的内容1
   * @property text2                            - 需要打印的内容2,和内容1用逗号分隔
   */
  Console.info = function (text1, text2) {
    var logs = service.logObj("INFO");
    service.output(logs, text1, text2);
  };

  /**
   * @memberof Console
   * @summary 以error形式输入日志
   * @type {function}
   * @property text1                            - 需要打印的内容1
   * @property text2                            - 需要打印的内容2,和内容1用逗号分隔
   */
  Console.error = function (text1, text2) {
    var logs = service.logObj("ERROR");
    service.output(logs, text1, text2);
  };

  /**
   * @memberof Console
   * @summary 以warn形式输入日志
   * @type {function}
   * @property text1                            - 需要打印的内容1
   * @property text2                            - 需要打印的内容2,和内容1用逗号分隔
   */
  Console.warn = function (text1, text2) {
    var logs = service.logObj("WARN");
    service.output(logs, text1, text2);
  };
  
  window.Console = Console;
  module.exports = Console;
  
 
});
;define('didi-component-ddplayer/base/special.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义特殊名单列表
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 特殊名单列表
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');

  /**
   * @module base/special
   * @namespace special
   * @property {boolean}                                - 是否启用全局调试
   * @property {array}    TIMEUPDATE_REPLACE_ENDED_LIST - 使用timeupdate模拟ended名单
   * @property {function} isAllowTimeupdateReplaceEnded - 是否允许用timeupdate事件替代ended事件
   *
   * 
   */

  
  var special = {};

  /**
   * @memberof special
   * @summary 使用timeupdate模拟ended名单
   * @type {array}
   */
  special.TIMEUPDATE_REPLACE_ENDED_LIST = [
    /SM\-N90/i           //三星note3 三星note3当切换片源后就不再会触发ended事件，这里，note3用timeupdate模拟
  ];

  /**
   * @memberof special
   * @summary 是否允许用timeupdate事件替代ended事件
   * @type {function}
   * @return {boolean}                                  - 结果
   */
  special.isAllowTimeupdateReplaceEnded = function () {
    var rst = false;
    //如果在替代名单中
    $.each(special.TIMEUPDATE_REPLACE_ENDED_LIST, function (index, item) {

      if (item.test(vars.UA)) {
        rst = true;

        return false;
      }
    });

    return rst;
  };
  /**
   * @memberof special
   * @summary 是否强制使用mp4播放（滴滴目前都使用mp4）
   * @type {function}
   * @return {boolean}
   */
  special.isDiDiForceUseMp4 = function(){
    return true;
  };
  

  module.exports = special;
 
});
;define('didi-component-ddplayer/base/util.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义公共(工具)方法
 *
 *   @version    : 1.0.2
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 定义公共(工具)方法
 *                 1.0.2 - 在带有parseXXX处理的方法中加入了try-catch处理
 *                         进行了jshint优化
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');

  /**
   * @module base.util
   * @namespace Util
   * @property {function}  pingback                     - 发送统计数据
   * @property {function}  getOSVersion                 - 获取系统版本号
   * @property {function}  getAndroidVersionNumber      - 获取Android设备的系统版本
   * @property {function}  getVersionNumber             - 解析字符串版本号，返回一个数字版本号
   * @property {function}  timeFromNow                  - 加载评论列表后的时间(从现在到评论的时间)
   * @property {function}  secondsToTime                - 将秒数转换为hh:mm:ss格式
   * @property {function}  secondsToTimeText            - 将秒数转换为文本格式的时间，eg. 65 -> "1分5秒"
   * @property {function}  shortCount                   - 将数字数量缩短为带单位的字符串，如10,000转化为'1万'
   * @property {function}  shortFixedCount              - 将数字数量缩短为带单位的字符串，如10,000转化为'1万 106000 会转为1.1万 (四舍五入)
   * @property {function}  dateString                   - 截取日期字符串 2013-12-18 07:07:46:57.000 转换为2013-12-18
   * @property {function}  setLoad                      - 为dom节点添加loading效果
   * @property {function}  loadScript                   - 加载script
   * @property {function}  formatURL                    - 把web地址转为移动端地址
   * @property {function}  makePlayUrl                  - 生成播放页地址
   * @property {function}  getPageOffset                - 取得页面的垂直滚动距离
   * @property {function}  getConnectionType            - Android获取网络连接类型,如果取不到返回空字符串,取到的话返回值为 2g|3g|wifi
   * @property {function}  formatDateWithBar            - 格式化时间，返回xxxx-xx-xx
   * @property {function}  formatDateWithZh             - 格式化时间，返回xxxx年xx月xx日
   * @property {function}  formatDateStr                - 格式化时间，返回指定样式的字符串
   * @property {function}  getUserPt                    - 获取平台参数类型编码
   * @property {function}  reverse                      - 将数组逆序
   * @property {function}  getFnName                    - 获取方法名称
   * @property {function}  createUUIDPart               - 生成uuid的一部分
   * @property {function}  getRandomNum                 - 生成一个随机数
   * @property {function}  formatDateWithBar2           - 格式化当前日期 如20150325
   * @property {function}  createUUID                   - 生成一个完整的uuid
   *
   * @example
   *   var util = require('./util.js');
   *   util.pingback('http://xxx');
   */
 
  var Util = {

    /**
     * @memberof Util
     * @summary 获取系统版本号
     * @type {function}
     * @return {string}
     */
    getOSVersion: function () {
      var osVersion = '0';
      
      if (vars.IsIOS) {
        var match = vars.UA.match(/os ([0-9_]+)/i);
        
        if (match && match[1]) {
          osVersion = Util.getVersionNumber(match[1]);
        }
      
      } else if (vars.IsAndroid) {
        osVersion = Util.getAndroidVersionNumber();
      
      } else {
        osVersion = '4.0.1';
      }
      
      return osVersion;
    },

    /**
     * @memberof Util
     * @summary 获取Android设备的系统版本
     * @type {function}
     * @return {string}
     */
    getAndroidVersionNumber: function () {
      var versionNum = vars.UA.match(/android(.*?);/i) || [];
      
      return versionNum[1] || '0';
    },

    /**
     * @memberof Util
     * @summary 解析字符串版本号，返回一个数字版本号
     * @type {function}
     * @param {string} versionStr               - 版本号字符串
     * @return {Number}
     */
    getVersionNumber: function (versionStr) {
      var rst = 0;
      
      try {
        var versionNum = versionStr.replace(/_/g, '.').replace(/^([0-9]+\.[0-9]+)[0-9\.]*/, '$1');
        rst = parseFloat(versionNum || 0);
      
      } catch (e) {}

      return rst;
    },

    /**
     * @memberof Util
     * @summary 加载评论列表后的时间(从现在到评论的时间)
     * @type {function}
     * @param {number} time                     - 时间戳
     * @return {string}                         - 1分钟前-59分钟前-1小时前-23小时前-1天前-29天前-1个月前-11个月前-1年前—2年前
     */
    timeFromNow: function (time) {
      var rst = time;

      try {
        var sec = 60,
            hour = sec * 60,
            day = hour * 24,
            month = day * 30,
            year = month * 12;

        time = (+new Date() - parseInt(time, 10)) / 1000;

        if (time >= year) {
          rst = Math.floor(time / year) + '年前';
        
        } else if (time >= month) {
          rst = Math.floor(time / month) + '个月前';
        
        } else if (time >= day) {
          rst = Math.floor(time / day) + '天前';
        
        } else if (time >= hour) {
          rst = Math.floor(time / hour) + '小时前';
        
        } else if (time >= sec) {
          rst = Math.floor(time / sec) + '分钟前';
        
        } else {
          rst = '刚刚';
        }

      } catch (e) {}

      return rst;
    },

    /**
     * @memberof Util
     * @summary 将秒数转换为hh:mm:ss格式
     * @type {function}
     * @param {number|string} seconds           - 秒数
     * @return {string}                         - hh:mm:ss格式的字符串
     */
    secondsToTime: function (seconds) {
      var rst = seconds;

      try {
        var totalSeconds = parseInt(seconds, 10);
        
        if (isNaN(totalSeconds)) {
          totalSeconds = 0;
        }
        var minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60;

        if (seconds < 10) {
          seconds = '0' + seconds;
        }

        if (minutes < 60) {
          
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          
          rst = minutes + ':' + seconds;
        
        } else {
          var hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
          
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          
          if (hours < 10) {
            hours = '0' + hours;
          }
          
          rst = hours + ':' + minutes + ':' + seconds;
        }

      } catch (e) {}

      return rst;
    },

    /**
     * @memberof Util
     * @summary 将秒数转换为文本格式的时间，eg. 65 -> "1分5秒"
     * @type {function}
     * @param {number|string} seconds           - 秒数
     * @return {string}                         - 文本格式的时间
     */
    secondsToTimeText: function (seconds) {
      var rst = seconds;

      try {
        var totalSeconds = parseInt(seconds, 10);
      
        if (isNaN(totalSeconds)) {
          totalSeconds = 0;
        }
        var minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60 + '秒';

        if (minutes < 60) {
          
          rst = (minutes > 0 ? minutes + '分' : '') + seconds;

        } else {
          var hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
          
          rst = (hours > 0 ? hours + '小时' : '') + minutes + '分' + seconds;
        }

      } catch (e) {}

      return rst;
    },

    /**
     * @memberof Util
     * @summary 将数字数量缩短为带单位的字符串，如10,000转化为'1万'
     * @type {function}
     * @param {number|string} count             - 数量
     * @return {string}                         - 带单位的字符串
     */
    shortCount: function (count) {
      var rst = count;

      try {
        count = parseInt(count, 10);
        
        if (count > 100000000) {
          count = Math.floor(count / 100000000) + '亿';
        
        } else if (count > 10000) {
          count = Math.floor(count / 10000) + '万';
        }

        rst = count;
      
      } catch (e) {}
      
      return rst;
    },

    /**
     * @memberof Util
     * @summary 将数字数量缩短为带单位的字符串，如10,000转化为'1万 106000 会转为1.1万 (四舍五入)
     * @type {function}
     * @param {number|string} count             - 数量
     * @return {string}                         - 带单位的字符串
     */
    shortFixedCount: function (count) {
      var rst = count;

      try {
        count = parseFloat(count);
      
        if (count && count >= 100000000) {
          count = (count / 100000000).toFixed(1) + '亿';
        
        } else if (count && count >= 10000) {
          count = (count / 10000).toFixed(1) + '万';
        }
        rst = count;

      } catch (e) {}
      
      return rst;
    },

    /**
     * @memberof Util
     * @summary 截取日期字符串 2013-12-18 07:07:46:57.000 转换为2013-12-18
     * @type {function}
     * @param {string} timeString               - 时间字符串
     * @return {string}                         - 日期字符串
     */
    dateString: function (timeString) {
      var match = timeString.match(/([0-9]{4}\-[0-9]+\-[0-9]+)/);
      
      if (match) {
        timeString = match[1];
      }

      return timeString;
    },

    /**
     * @memberof Util
     * @summary 为dom节点添加loading效果
     * @type {function}
     * @param {docElement} el                   - dom节点
     * @return {docElement}                     - 源dom节点
     */
    setLoad: function (el) {
      el = $(el);
      
      if (!el.hasClass('_load_inited')) {
        el.addClass('_load_inited').append($('<i class="ui_loading"><u></u><u></u><u></u></i>'));
      }

      return el;
    },

    /**
     * @memberof Util
     * @summary 加载script
     * @type {function}
     * @param {string} url                      - script的url地址
     * @param {function} callback               - 可选参数,加载完script后的回调函数
     * @param {object} opts                     - 可选参数,给回调函数传的参数
     */
    loadScript: function (url, callback, opts) {
      var head = document.getElementsByTagName('head')[0] || document.body,
        script = document.createElement('script'),
        done = false;

      script.src = url;

      script.onload = script.onreadystatechange = function () {
        
        if (!done && (!this.readyState || this.readyState !== 'loading')) {
          done = true;
          
          if (callback) {
            callback.apply(null, opts || []);
          }
          script.onload = script.onreadystatechange = null;
          head.removeChild(script);
        }
      };
      head.appendChild(script);
    },

    /**
     * @memberof Util
     * @summary Android获取网络连接类型,如果取不到返回空字符串,取到的话返回值为 2g|3g|wifi
     * @type {function}
     * @return {string}                         - 网络连接类型
     */
    getConnectionType: function () {
      var _connection = window.navigator['connection'],
          _connectionType,
          connectionType = '';
      
      if (_connection) {
        _connectionType = _connection['type'];
        
        if (_connectionType === _connection['CELL_2G']) {
          connectionType = '2g';
        
        } else if (_connectionType === _connection['CELL_3G']) {
          connectionType = '3g';
        
        } else if (_connectionType === _connection['WIFI']) {
          connectionType = 'wifi';
        }
      }
      
      return connectionType;
    },
 
    /**
     * @memberof Util
     * @summary 格式化时间，返回xxxx-xx-xx
     * @type {function}
     * @param {date} date                       - 时间对象，不填返回当前时间字符串
     * @return {string}                         - 返回时间字符串,如2013-12-04
     */
    formatDateWithBar: function (date) {
      date = date || new Date();
      var month = date.getMonth() + 1,
          day = date.getDate();

      if (month.toString().length < 2) {
        month = '0' + month;
      }

      if (day.toString().length < 2) {
        day = '0' + day;
      }

      return date.getFullYear() + '-' + month + '-' + day;
    },

    /**
     * @memberof Util
     * @summary 格式化时间，返回xxxx年xx月xx日
     * @type {function}
     * @param {date} date                       - 时间对象，不填返回当前时间字符串
     * @return {string}                         - 返回时间字符串,如2013年12月04日
     */
    formatDateWithZh: function (date) {
      date = date || new Date();
      var month = date.getMonth() + 1,
          day = date.getDate();

      if (month.toString().length < 2) {
        month = '0' + month;
      }

      if (day.toString().length < 2) {
        day = '0' + day;
      }

      return date.getFullYear() + '年' + month + '月' + day + '日';
    },

    /**
     * @memberof Util
     * @summary 格式化时间，返回指定样式的字符串
     * @type {function}
     * @param {date} date                       - 时间对象
     * @param {string} format                   - 格式化结果,如: yyyy-MM-dd hh:mm:ss
     * @return {string}                         - 返回时间字符串,如20131204
     */
    formatDateStr: function (date, format) {
      var o = {
        'M+' : date.getMonth() + 1, // month
        'd+' : date.getDate(), // day
        'h+' : date.getHours(), // hour
        'm+' : date.getMinutes(), // minute
        's+' : date.getSeconds(), // second
        'q+' : Math.floor((date.getMonth() + 3) / 3), // quarter
        'S' : date.getMilliseconds()
      // millisecond
      };

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }

      for (var k in o) {

        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }

      return format;
    },

    /**
     * @memberof Util
     * @summary 获取平台参数类型编码
     *          1. PC
     *          2. iPad
     *          3. iPhone
     *          4. AndroidPad
     *          5. AndroidPhone
     *          6. AndroidTV
     *          7. WindowsPad
     *          8. WindowsPhone
     *          9. Symbian
     * @type {function}
     * @return {number}                         - 返回对应的平台类型编码
     */
    getUserPt: function () {
      var pt = 1;

      if (typeof navigator.platform !== 'undefined') {
        var pcArr = ['Win32', 'Win64', 'Windows', 'Mac68K', 'MacPC', 'Macintosh', 'MacIntel'];
        
        for (var i = 0, l = pcArr.length; i < l; i++) {

          if (navigator.platform === pcArr[i]) {
            pt = 1;

            break;
          }
        }
      }

      if (vars.IsIpad) {
        pt = 2;
      }
      
      if (vars.IsIphone) {
        pt = 3;
      }
      
      if (vars.IsAndroid) {
        pt = 5;
        
        if (/tv/i.test(vars.UA)) {
          pt = 6;
        }
      }

      if (vars.IsAndroidPad) {
        pt = 4;
      }

      if (vars.IsWindowsPad) {
        pt = 7;
      }
      
      if (vars.IsWindowsPhone) {
        pt = 8;
      }

      return pt;
    },
    
    getUserPt2: function () {
      var pt = 'pc';

      if (typeof navigator.platform !== 'undefined') {
        var pcArr = ['Win32', 'Win64', 'Windows', 'Mac68K', 'MacPC', 'Macintosh', 'MacIntel'];
        
        for (var i = 0, l = pcArr.length; i < l; i++) {
          if (navigator.platform === pcArr[i]) {
            pt = 'pc';
            break;
          }
        }
      }
      
      if (vars.IsIpad) {
        pt = 'iPad';
      }
      
      if (vars.IsIphone) {
        pt = 'iPhone';
      }
      
      if (vars.IsAndroid) {
        pt = 'android';
      }
      
      if (vars.IsAndroidPad) {
        pt = 'androidPad';
      }
      
      if (vars.IsWindowsPad) {
        pt = 'windowsPad';
      }
      
      if (vars.IsWindowsPhone) {
        pt = 'windowsPhone';
      }
      
      return pt;
    },

    getUserSysPt: function () {
      var pt = 'pc';
      
      if (typeof navigator.platform !== 'undefined') {
        var pcArr = ['Win32', 'Win64', 'Windows', 'Mac68K', 'MacPC', 'Macintosh', 'MacIntel'];
        
        for (var i = 0, l = pcArr.length; i < l; i++) {
          
          if (navigator.platform === pcArr[i]) {
            pt = 'pc';
            
            break;
          }
        }
      }
      if (vars.IsAndroid) {
        pt = 'android';
      }
        if (vars.IsAndroidPad) {
        pt = 'android';
      } 

      if (vars.IsIpad) {
        pt = 'ios';
      }
      
      if (vars.IsIphone) {
        pt = 'ios';
      }
      
      if (vars.IsWindowsPad) {
        pt = 'windows';
      }
      
      if (vars.IsWindowsPhone) {
        pt = 'windows';
      }
    },
    /**
     * @memberof Util
     * @summary 将数组逆序
     * @type {function}
     * @param {array|object} obj               - 数组对象
     * @return {array|string}                  - 调整顺序后的数组对象
     */
    reverse: function (obj) {
      
      return Array.isArray(obj) ? obj.reverse() : String(obj).split('').reverse().join('');
    },
    
    /**
     * @memberof Util
     * @summary 获取方法名称
     * @type {function}
     * @param {function} fn                    - 方法
     * @return {string}                        - 方法名称
     */
    getFnName: function (fn) {
      var fnstr = '';
      
      if (typeof fn === 'function') {
        fnstr = fn.name || (/function ([^\(]+)/.exec(fn.toString()) || [])[1] || '';
      }
      
      return fnstr;
    },
 
    /**
     * @memberof Util
     * @summary 生成一个随机数
     * @type {function}
     * @param {number} Min                     - 随机数最小值
     * @param {number} Max                     - 随机数最大值
     * @return {number}                        - 随机数
     */
    getRandomNum: function (Min, Max) {
      var Range = Max - Min;
      var Rand = Math.random();
      return (Min + Math.round(Rand * Range));
    },
    
    /**
     * @memberof Util
     * @summary 格式化当前日期
     * @type {function}
     * @return {number}                        - 格式化结果，如20150325
     */
    formatDateWithBar2: function () {
      var date = date || new Date(),
        month = date.getMonth() + 1,
        day = date.getDate();

      if (month.toString().length < 2) {
        month = '0' + month;
      }

      if (day.toString().length < 2) {
        day = '0' + day;
      }
      //yyyymmdd
      return date.getFullYear() + '' + month + day;
    }
  };

  String.prototype.replaceAll = function (s1, s2) {
    
    return this.replace(new RegExp(s1, 'gm'), s2); //g全局
  };

  //如果浏览器不支持String原生trim的方法，模拟一个
  if (!String.prototype.hasOwnProperty('trim')) {
    String.prototype.trim = function () {
      
      return this.replace(/^(\s|\r|\n|\r\n)*|(\s|\r|\n|\r\n)*$/g, '');
    };
  }

  //如果浏览器不支持Function原生bind的方法，模拟一个
  if (!Function.prototype.hasOwnProperty('bind')) {

    Function.prototype.bind = function (context) {
      var fn = this,
          args = arguments.length > 1 ? Array.slice(arguments, 1) : null;
      
      return function () {
        
        return fn.apply(context || this, args);
      };
    };
  }

  module.exports = Util;

 
});
;define('didi-component-ddplayer/player/mediaPlayer.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义原始播放器
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 原始播放器
 *
 **/


  'use strict';

  var Console = require('didi-component-ddplayer/base/console.js');
  var vars = require('didi-component-ddplayer/base/vars.js');

  /**
   * @module player.mediaPlayer
   * @namespace MediaPlayer
   * @summary 播放器抽象方法与事件
   * @param {Object} config 配置
   * @constructor
   * @property {dom}       videoTag                        - video标签对象
   * @property {object}    $video                          - video标签$对象
   * @property {object}    cache                           - 播放器内部当前视频播放的操作对象
   * @property {object}    videoData                       - 播放器当前播放视频数据
   * @property {object}    config                          - 播放器配置参数
   * @property {object}    videoList                       - 多视频数据对象
   * @property {number}    currentTime                     - 当前视频播放时间
   * @property {number}    duration                        - 视频总时长
   * @property {function}  _onDomLoaded                    - 获取成功加载完dom后
   * @property {function}  pause                           - 暂停
   * @property {function}  play                            - 播放
   * @property {function}  getSrc                          - 获取当前视频播放地址
   * @property {function}  setSrc                          - 设置当前视频播放地址
   * @property {function}  getPoster                       - 获取当前视频海报地址
   * @property {function}  setPoster                       - 设置当前视频海报地址
   * @property {function}  getPreLoad                      - 获取当前视频预加载方式
   * @property {function}  setPreLoad                      - 设置当前视频预加载方式
   */
 
  var MediaPlayer = function (config) {
    /**
     * @memberof MediaPlayer.prototype
     * @summary video标签对象
     * @type {dom}
     */
    this.videoTag = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary video标签$对象
     * @type {object}
     */
    this.$video = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 播放器内部当前视频播放的操作对象
     * @type {object}
     */
    this.cache = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 播放器当前播放视频数据
     * @type {object}
     */
    this.videoData = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 播放器配置参数
     * @type {object}
     */
    this.config = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 多视频数据对象
     * @type {object}
     */
    this.videoList = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 当前视频播放时间
     * @type {number}
     */
    this.currentTime = 0;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 视频总时长
     * @type {number}
     */
    this.duration = 0;
    //dom节点是否加载完
    this._loadedDomFlag = false;
    //超时
    this._timeoutFlag = false;
    //得到video数据
    this._getDataFlag = false;
    //播放监控标志位(就开始时候监控)
    this._playCheckFlag = false;
    //播放监控时间(mm)
    this._playCheckTime = 6000;
    //初始化方法
    this._init(config);
  };

  //所有播放器的事件处理对象
  MediaPlayer.prototype.eventProcess = {
    'pause': [],              //pause()触发
    'ended': [],              //播放结束
    'userEnded': [],          //用户自定义播放结束(单个片源播放结束触发)
    'error': [],              //请求数据时遇到错误
    'play': [],               //play()和autoplay开始播放时触发
    'playing': [],            //正在播放
    'timeupdate': [],         //播放时间改变
  };

    // canplay seeking seeked ended play pause loadeddata loadedmetadata timeupdate
  MediaPlayer.prototype.eventList = [
    'loadedvideodata',        //获取播放器相关数据(自定义事件)
    'loadstart',              //客户端开始请求数据
    'progress',               //客户端正在请求数据
    'suspend',                //延迟下载
    'abort',                  //客户端主动终止下载（不是因为错误引起），
    'error',                  //请求数据时遇到错误
    'stalled',                //网速失速
    'play',                   //play()和autoplay开始播放时触发
    'playing',                //正在播放
    'pause',                  //pause()触发
    'loadedmetadata',         //成功获取资源长度
    'loadeddata',             //当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧
    'waiting',                //等待数据，并非错误
    'canplay',                //可以播放，但中途可能因为加载而暂停
    'canplaythrough',         //可以播放，歌曲全部加载完毕
    'seeking',                //寻找中
    'seeked',                 //寻找完毕
    'timeupdate',             //播放时间改变
    'ended',                  //播放结束
    'ratechange',             //播放速率改变
    'durationchange',         //资源长度改变
    'volumechange'            //音量改变
  ];

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频播放地址
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getSrc = function () {
    
    return this.$video.attr('src');
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频播放地址
   * @type {function}
   * @param {string} srcUrl                             - 设置指定的url
   */
  MediaPlayer.prototype.setSrc = function (srcUrl) {
    this.$video.attr('src', srcUrl);
  };

    /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频音量
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getVolume = function () {
    
    return this.videoTag.volume;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频音量
   * @type {function}
   * @param {string} volume                             - 设置音量 0 - 1
   */
  MediaPlayer.prototype.setVolume = function (volume) {

    if ($.isNumber(volume)) {
      volume = volume < 0 ? 0 : volume;
      volume = volume > 1 ? 1 : volume;
      Console.log('音量:', volume);
      this.videoTag.volume = volume;
    }
    
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频海报地址
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getPoster = function () {
    
    return this.cache.poster || '';
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频海报地址
   * @type {function}
   * @param {string} posterUrl                          - 海报地址
   * @param {string} srcUrl                             - 设置指定的url
   */
  MediaPlayer.prototype.setPoster = function (posterUrl) {
    this.changePoster(posterUrl);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频预加载方式
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getPreLoad = function () {
    
    return this.$video.attr('preload');
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频预加载方式
   * @type {function}
   * @param {string} preloadType                        - 预加载方式
   */
  MediaPlayer.prototype.setPreLoad = function (preloadType) {
    this.$video.attr('preload', preloadType);
  };
  // //获取当前视频控制条方式
  // MediaPlayer.prototype.getControls = function () {
  //   return this.$video.attr('controls');
  // };
  // //设置当前视频控制条方式
  // MediaPlayer.prototype.setControls = function (controlsType) {
  //   this.$video.attr('controls', controlsType);
  // };
  // //获取当前视频循环播放方式
  // MediaPlayer.prototype.getLoop = function () {
  //   return this.$video.attr('loop');
  // };
  // //设置当前视频循环播放方式
  // MediaPlayer.prototype.setLoop = function (loopType) {
  //   this.$video.attr('loop', loopType);
  // };
  // //获取当前视频是否静音
  // MediaPlayer.prototype.getMuted = function () {
  //   return this.$video.attr('muted');
  // };
  // //设置当前视频是否静音
  // MediaPlayer.prototype.setMuted = function (mutedType) {
  //   this.$video.attr('muted', mutedType);
  // };
  // //获取当前视频播放速度
  // MediaPlayer.prototype.getPlaybackRate = function () {
  //   return this.$video.attr('playbackRate');
  // };
  // //设置当前视频播放速度
  // MediaPlayer.prototype.setPlaybackRate = function (playbackRateNum) {
  //   this.$video.attr('playbackRate', playbackRateNum);
  // };
  // //获取当前播放时间
  // MediaPlayer.prototype.getCurrentTime = function () {
  //   return this.$video.attr('currentTime');
  // };
  // //set播放时间
  // MediaPlayer.prototype.setCurrentTime = function (seconds) {
  //   this.$video.attr('currentTime', seconds);
  // };

  //初始化
  MediaPlayer.prototype._init = function () {};
  //添加事件处理
  MediaPlayer.prototype._addEvent = function (eventType, param1, param2) {};
  //移除处理事件
  MediaPlayer.prototype._removeEvent = function (eventType, param1) {};
  //触发事件
  MediaPlayer.prototype._fireEvent = function (eventType) {};
  //暂停
  MediaPlayer.prototype._pause = function () {
    var _this = this;

    this._onDomLoaded(function () {

      if (_this.$video.attr('data-noSupport') === null) {
        _this.videoTag.pause();
      }
    });
  };
  //播放
  MediaPlayer.prototype._play = function () {
    var _this = this;

    //获取数据成功
    var loadSuccess = function () {

      if (_this.$video.attr('data-noSupport') === null) {

        try {
            //播放监控开始(就开始时候监控)
          if (!this._playCheckFlag && this.config.autoplay) {
            this._playCheckFlag = true;
            var startTime = 0,
                pTime = 200;

            var checkInterval = setInterval(function () {
              startTime += pTime;
              var notPlayFlag = (startTime >= _this._playCheckTime);
              //如果在检查时间内没播放或者播放都清空计时器
              if (notPlayFlag || _this.currentTime > 1) {
                //如果在检查时间内没播放,调用暂停事件
                if (notPlayFlag) {
                  _this.pause();
                  _this.$video.trigger('pause');
                }
                clearInterval(checkInterval);
              }
            }, pTime);
          }

          if (_this.$video.attr('preload') !== null) {
            _this.$video.removeAttr('preload');
          }
          _this.videoTag.play();

        } catch (e) {
          _this.$video.one('canplay', function () {

            if (_this.videoTag.paused) {
              _this.videoTag.play();
            }
          });
        }
      }
    };

    this._onDomLoaded(loadSuccess);
  };
  //暂停播放业务
  MediaPlayer.prototype._playOrPause = function (type) {};

  /**
   * @memberof MediaPlayer.prototype
   * @summary 暂停
   * @type {function}
   */
  MediaPlayer.prototype.pause = function () {
    var _this = this;

    this._onDomLoaded(function () {
      _this._playOrPause('pause');
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 播放
   * @type {function}
   */
  MediaPlayer.prototype.play = function () {
    var _this = this;
    
    this._onDomLoaded(function () {
      _this._playOrPause('play');
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 跳转到指定位置，全片跳转(seconds: 跳转到指定时间)
   * @type {function}
   * @param {number}   seconds                          - 跳转到指定时间点，秒
   */
  MediaPlayer.prototype.seekTo = function (seconds) {
    var _this = this;
    var curMediaSeekTo = function (sec) {
      
      try {
        _this.videoTag.currentTime = sec;

        if (_this.videoTag.paused) {
          _this.videoTag.play();
        }
      
      } catch (e) {
        _this.$video.one("canplay", function () {
          _this.videoTag.currentTime = sec;

          if (_this.videoTag.paused) {
            _this.videoTag.play();
          }
        });
      }
    };

    var childDurList = this.cache.srcList[this.cache.modeType];

    if (/Android\s4\./i.test(vars.UA) && !vars.IsBaiduBrowser) {
      //显示加载状态
      this._showLoading();
    }

    //如果只有一个片源
    if (childDurList.length === 1) {
      //跳转播放
      curMediaSeekTo(seconds);

    //如果有多个片源
    } else {
      //查找拖拽时间所处的片源
      var beforeTotal = 0;

      $.each(childDurList, function (index, item) {
        //逐个累加每个播放片源的总时间，定位指定片源
        if ((beforeTotal + item.duration) > seconds) {
          var cache = _this.cache;
          //如果和当前播放的片源不是同一个
          if (index !== cache.curIndex) {
            //修改cache中的播放索引
            cache.curIndex = index;
            //获取播放链接
            var url = item.url;
            //更新当前播放内容
            cache.curPlayUrl = url;
            //更新video片源地址
            _this.setSrc(url);
          }
          //当前子内容播放时间
          seconds -= beforeTotal;
          //跳转播放
          setTimeout(function () {
            curMediaSeekTo(seconds);
          }, 300);

          return false;
        
        } else {
          beforeTotal += item.duration;
        }
      });
    }
  };
  //绑定事件
  MediaPlayer.prototype.on = function (eventType, fn) {};
  //移除事件
  MediaPlayer.prototype.off = function (eventType, fn) {};
  //触发事件
  MediaPlayer.prototype.trigger = function (eventType) {};
  //只触发一次
  MediaPlayer.prototype.one = function (eventType, fn) {};
  //获取播放总时长
  MediaPlayer.prototype.htmlTo = function (dom) {};
  //清晰度切换播放
  MediaPlayer.prototype.playByMode = function () {};
  //更新播放器
  MediaPlayer.prototype.updateMedia = function (data) {};
  //更新海报
  MediaPlayer.prototype.changePoster = function (posterUrl) {};

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取成功加载完dom后
   * @type {function}
   * @param {function}   successFun                     - dom加载完成后，执行的回调方法
   */
  MediaPlayer.prototype._onDomLoaded = function (successFun) {
    var _this = this;

    if (this._loadedDomFlag) {
      successFun.call(this);
    
    } else {
      var checkInterval = setInterval(function () {
        
        if (_this._loadedDomFlag) {
          clearInterval(checkInterval);
          successFun.call(_this);
        }
      }, 100);
    }
  };

  module.exports = MediaPlayer;
 
});
;define('didi-component-ddplayer/player/events.js', function(require, exports, module){ /**
 *
 *   @description: 该文件为播放器实现事件方法
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 为播放器实现事件方法
 *           
 * 
 **/


  'use strict';

  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var special = require('didi-component-ddplayer/base/special.js');
  var Console = require('didi-component-ddplayer/base/console.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器事件
   * @property {function}  on                              - 绑定播放器事件
   * @property {function}  off                             - 注销播放器事件
   * @property {function}  trigger                         - 触发播放器指定事件
   * @property {function}  one                             - 绑定播放器事件, 只触发一次后就注销
   * @property {function}  _addEvent                       - (播放器内部使用) 绑定播放器事件,添加到事件数组中
   * @property {function}  _removeEvent                    - (播放器内部使用) 注销播放器事件,从事件数组中删除
   * @property {function}  _fireEvent                      - (播放器内部使用) 触发指定播放器事件
   * @property {function}  _initEvent                      - (播放器内部使用) 初始化内部事件
   *
   * @example
   *   var DiDiPlayer = require('./didiPlayer.js');
   *   var player = new DiDiPlayer(settings);
   *   player.on('timeupdate', function () {});
   *   player.on('ended', function () {});
   */
  
  /**
   * @memberof MediaPlayer.prototype
   * @summary 事件绑定
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {function} fn                               - 事件触发后的回调函数
   */
  MediaPlayer.prototype.on = function (eventType, fn) {
    var _this = this;

    this._onDomLoaded(function () {

        if (eventType === 'ended' || eventType === 'onended') {
          
          _this.eventProcess.userEnded.push({
            name: 'ended',
            process: function () {
              fn.call(_this);
            }
          });
        
        } else {

          _this.$video.on(eventType, function (e) {
            
            fn.call(_this, e);
          });
        }
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 移除事件
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {function} fn                               - 事件触发后的回调函数
   */
  MediaPlayer.prototype.off = function (eventType, fn) {
    var _this = this;

    this._onDomLoaded(function () {
      eventType = eventType.toLowerCase();
      _this.$video.off(eventType, fn);
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 触发事件
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   */
  MediaPlayer.prototype.trigger = function (eventType) {
    var _this = this;

    this._onDomLoaded(function () {
      eventType = eventType.toLowerCase();
      _this.$video.trigger(eventType);
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 只触发一次
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {function} fn                               - 事件触发后的回调函数
   */
  MediaPlayer.prototype.one = function (eventType, fn) {
    var _this = this;

    this._onDomLoaded(function () {
      eventType = eventType.toLowerCase();

      if (eventType === 'ended') {
        //在播最后一个视频的时候执行该事件
        this.$video.on(eventType, function () {

          if (_this.cache.curIndex === _this.cache.totCounts - 1) {
            _this.$video.one(eventType, function (e) {
              fn.call(_this, e);
            });
          }
        });

      } else {
        this.$video.one(eventType, function (e) {
          fn.call(_this, e);
        });
      }
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 为播放器添加事件处理 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {string|function} param1                    - string: 给该事件添加别名(如果有删除removeEvent需求时用), 并且param2为对应的事件触发后回调方法
   *                                                    - function: 对应的事件触发后回调方法,如果该参数为function, param2则不填
   * @param {function} param2                           - param1为string时生效,对应的事件触发后回调方法
   * @example
   *      player.addEvent('timeupdate', fn);
   *      player.addEvent('timeupdate', 'myTimeupdate', fn);
   */
  MediaPlayer.prototype._addEvent = function (eventType, param1, param2) {
    var pro = this.eventProcess;
    var _this = this;

    // 转换成小写
    eventType = eventType.toLowerCase();

    if (!$.isUndefined(eventType) && !$.isUndefined(pro[eventType])) {
      var proObj = {};
      var isTimeupdateRepEnded = special.isAllowTimeupdateReplaceEnded() && (eventType === 'ended' || eventType === 'onended');
      //事件和处理方法
      if ($.isFunction(param1)) {
        
        if (isTimeupdateRepEnded) {
          eventType = 'timeupdate';
          proObj.process = function () {

            if (_this.videoTag.duration - _this.videoTag.currentTime < 0.5) {
              param1.call(_this);
            }
          };

        } else {

          proObj.process = function () {
            param1.call(_this);
          };
        }
        //自动为该处理事件生成一个属性名
        proObj.name = '_' + eventType + (new Date()).getTime();

        pro[eventType].push(proObj);
        //事件、处理方法名称和处理方法
      } else if ($.isString(param1) && $.isFunction(param2)) {

        if (isTimeupdateRepEnded) {
          proObj.process = function () {

            if (_this.videoTag.duration - _this.videoTag.currentTime < 0.5) {
              param2.call(_this);
            }
          };

        } else {
          proObj.process = function () {
            param2.call(_this);
          };
        }
        proObj.name = param1;
        

        pro[eventType].push(proObj);
      }
    }
  };

  //使用方式1: removeEvent('timeupdate'); //移除所有timeupdate事件处理
  //使用方式2: removeEvent('timeupdate', 'myTimeupdate'); //移除所有timeupdate事件中叫做myTimeupdate的相关处理
  /**
   * @memberof MediaPlayer.prototype
   * @summary 移除处理事件 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {string}   param1                           - 可选参数，事件名称下的别名，如果该参数不填，则移除事件列表中的所有处理方法
   * @example
   *      player.addEvent('timeupdate');
   *      player.removeEvent('timeupdate', 'myTimeupdate');
   */
  MediaPlayer.prototype._removeEvent = function (eventType, param1) {
    var pro = this.eventProcess;

    if (!$.isUndefined(eventType) && !$.isUndefined(pro[eventType])) {
      //删除所有该事件处理方法
      if ($.isUndefined(param1)) {
        pro[eventType] = [];
        //删除指定事件下的指定处理方法
      } else if ($.isString(param1)) {

        $.each(pro[eventType], function (index, item) {

          if (item.name === param1) {
            pro[eventType].splice(index, 1);
          }
        });
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 触发指定事件 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   */
  MediaPlayer.prototype._fireEvent = function (eventType) {
    var pro = this.eventProcess,
        _this = this;

    if (!$.isUndefined(eventType) && !$.isUndefined(pro[eventType])) {

      $.each(pro[eventType], function (index, item) {

        item.process.call(_this);
      });
    }
  };

  //播放结束事件
  MediaPlayer.prototype._onBaseEnded = function () {
    var _this = this,
      cache = _this.cache;
    //播放起始时间更新
    this._startPlayTime = $.now();
    //缓冲次数重置
    this._bufferCount = 0;
    //如果是-1，说明是循环播放第一个子片，设置为0
    if (cache.curIndex === -1) {
      cache.curIndex = 0;
    }
    //百度浏览器中，直接修改cache的变量无效，下次触发ended事件还是原来的值，这里用window参数传值
    if (vars.IsBaiduBrowser || vars.IsBaiduBoxApp) {
      var srcList = cache.srcList[cache.modeType];
      var currentTime = 0;

      $.each(srcList, function (index, item) {

        currentTime += item.duration;

        if (index >= cache.curIndex) {

          return false;
        }
      });
    }
    var nextUrl = cache.getNextUrl();
    //继续播放后面的子片源
    if (nextUrl !== '') {
      //触发等待事件
      this.trigger('waiting');
      //修改cache中的信息
      cache.curPlayUrl = nextUrl;
      cache.curIndex++;
      this.setSrc(cache.curPlayUrl);
      //指定新地址，并播放
      setTimeout(function () {
        _this.videoTag.play();
      }, 100);
      //修改videoData中的属性，供统计用
      this.videoData.video_src = nextUrl;
    //已经播到该片源的最后
    } else {
      //如果是循环播放并且是非广告内容
      if (cache.loop) {
        //触发等待事件
        this.trigger('waiting');
        var firstUrl = cache.getFirstUrl();
        //指定新地址，并播放
        this.setSrc(firstUrl);
        this.play();
        //修改cache中的信息
        cache.curPlayUrl = firstUrl;
        //如果是循环播放，设置器curIndex为-1
        cache.curIndex = -1;
        //修改videoData中的属性，供统计用
        this.videoData.video_src = firstUrl;
      //已经播放到最后，并不进行循环播放
      } else {
        //修改cache中的信息
        cache.curPlayUrl = nextUrl;
      }
      //触发用户自定义结束事件
      $.each(this.eventProcess.userEnded, function (index, item) {
        item.process();
      });
    }
    //置空缓存预加载对象
    this._nextPreLoadImg = null;
  };

  //键盘事件
  MediaPlayer.prototype._onKeyDown = function (e, player) {
    var keyCode = e.keyCode || e.which || e.charCode;

    var volume = function (val) {
      var vol = player.getVolume();
      vol += val;
      player.setVolume(vol);
    };

    if (!$.isUndefined(keyCode)) {

      switch (keyCode) {
        //up 音量加
        case 38:
          volume(0.1);
          break;
        //down 音量减
        case 40:
          volume(-0.1);
          break;
        //left
        case 37:
          player.seekTo(player.currentTime - 10);
          break;
        //right
        case 39:
          player.seekTo(player.currentTime + 10);
          break;
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化内部事件 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   */
  MediaPlayer.prototype._initEvent = function () {
    var _this = this;
    var pro = this.eventProcess;

    if (this.$video && this.$video.length > 0) {
      //绑定事件
      $.each(_this.eventList, function (index, item) {
        //note3时候不绑定ended事件
        if ($.isArray(pro[item]) && ((vars.IsSAMSUNGNote3 && item !== 'ended') || !vars.IsSAMSUNGNote3)) {

          _this.$video.on(item, function (e) {

            if ($(_this.$video, _this.$main).length > 0) {
              
              $.each(pro[item], function (eIndex, eItem) {
                eItem.process.call(_this, e);
              });
            }
          });
        }
      });
    }
    //添加ended事件
    this._addEvent('ended', this._onBaseEnded);
    //绑定键盘事件
    $('body').on('keydown', function (e) {
      _this._onKeyDown(e, _this);
    });
  };

 
});
;define('didi-component-ddplayer/player/playHistory.js', function(require, exports, module){ /**
 *
 *   @description: playHistory
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 操作播放记录功能,对sid过滤的功能
 *
 */

    'use strict';
    
    var Storage = require('store');

    /**
     * @module player.playHistory
     * @namespace playHistory
     * @property {object}   param
     * @property {object}   model
     * @property {object}   view
     * @property {object}   ctrl
     * @property {function} setHistory  设置播放历史
     * @property {function} getHistory  获取播放历史
     * @example
     *      var history = require('./playHistory.js');
     *
     *      history.setHistory({
     *          sid: '',       //(必) 专辑id
     *          vid: '',       //(必) 视频id
     *          site: 2,       //(必) 视频类型
     *          playTime: 22,  //(必) 当前播放时间
     *          duration: 23,  //(必) 视频总时长
     *          cid: '',       //(可) 视频分类
     *          title: ''      //(可) 视频标题
     *      });
     *
     *      history.getHistory(data); //data参数可选，返回数组
     *
     *      1) 通过vid和site查找
     *         data : {          //(可)
     *             vid: '',      //(必) string 视频id
     *             site: '2'     //(必) string 视频类型
     *         }
     *      2) 通过sid查找
     *         data : {          //(可)
     *             sid: ''       //(必) string 专辑id
     *             type: 0       //(可) number 获取类型 0: 取最新一条, 1: 获取所有, 默认0
     *         }
     */
    var historyRec = {
        param: {
            //本地存储名称
            localHistoryName: 'dd_video_history',
            //最大存储记录数
            maxSize: 20,
            //记录中必须有的字段
            checkArr: ['sid', 'vid', 'site', 'playTime', 'duration'],
            //数据属性全集
            paramArr: ['sid', 'vid', 'site', 'cid', 'playTime', 'duration', 'sysTime', 'title']
        },
        model: {
            //缓存本地存储数据对象字符串
            localDataStr: ''
        },
        view: {},
        ctrl: {}
    };

    var p = historyRec.param,
        m = historyRec.model,
        v = historyRec.view,
        c = historyRec.ctrl;

    //========================== 模型层 ================================
    //历史记录数据检查
    m.historyCheck = function (data) {
        var rst = true;

        $.each(p.checkArr, function (index, item) {

            if (typeof data[item] === 'undefiend') {
                rst = false;

                return false;
            }
        });

        return rst;
    };

    //数据处理,将数据对象转换成字符串
    m.objToStr = function (data) {
        var rstArr = [],
            isFinishedFlag = false;
        //检查是否已经播放完成
        try {
            var dur = parseInt(data.duration, 10),
                cur = parseInt(data.playTime, 10);
            //如果播放完成95%以上，我们认为该片子已经播放完成
            if (cur / dur > 0.97) {
                isFinishedFlag = true;
            }

        } catch (e) {}

        if (isFinishedFlag) {

          return 'finished';  

        } else {
            //设置时间
            data.sysTime = Date.now();

            $.each(p.paramArr, function (index, item) {

                if (item === 'playTime') {

                    try {
                        data[item] = parseInt(data[item], 10);

                    } catch (e) {}
                }
                data[item] = data[item] ? data[item] : '';
                rstArr.push(encodeURIComponent(data[item]));
            });

            return rstArr.join(',');
        }
    };

    //数据处理,将字符串转换成数据对象
    m.strToObj = function (data) {
        var rst = null;

        if (typeof data === 'string' && data !== 'null' && data !== '') {
            var dataArr = data.split(',');
            rst = {};

            $.each(p.paramArr, function (index, item) {

                if (item === 'playTime' || item === 'duration' || item === 'sysTime' ||
                    item === 'flag' || item === 'sid') {
                    rst[item] = parseInt(dataArr[index], 10);

                } else {
                    rst[item] = decodeURIComponent(dataArr[index]);
                }
            });
        }

        return rst;
    };

    //将字符串解析成数组对象
    m.strToArr = function (data) {
        var rst = [];

        if (typeof data === 'string' && data !== '' && data !== 'null') {

            if (data.indexOf('|') === 0) {
                data = data.substr(1);
            }
            var dataStrArr = data.split('|');

            $.each(dataStrArr, function (index, item) {
                rst.push(m.strToObj(item));
            });
        }

        return rst;
    };

    //========================== 控制层 ================================
    /**
     * @memberof playHistory
     * @summary 设置播放记录
     * @type {function}
     * @param {object} data 设置的记录
     */
    c.setHistory = function (data) {
        //数据检查
        if (m.historyCheck(data)) {
            //数据加工，转换成字符串
            var dataStr = m.objToStr(data);
            //如果缓存中还没有数据
            if (m.localDataStr === '') {
                //获取本地存储的数据(字符串)
                m.localDataStr = Storage.get(p.localHistoryName) || '';
            }
            //字符串数组
            var localDataStrArr = (m.localDataStr !== '') ? m.localDataStr.split('|') : [];
            //检查索引字符串(vid和site能判断数据是否已经存在)
            var keyStr = ',' + data.vid + ',' + data.site + ',';
            //本地还没有存储过当前播放记录且该视频还没播放结束(数组操作)
            if (dataStr !== 'finished' && m.localDataStr.indexOf(keyStr) === -1) {
                //首添加到数组
                localDataStrArr.unshift(dataStr);
            //本地已经存在该数据
            } else {
                var arr = [];
                //如果视频没播放完成,则更新记录，如果已经播放完成，则删除该记录
                if (dataStr !== 'finished') {
                    arr.push(dataStr);
                }

                $.each(localDataStrArr, function (index, item) {

                    if (item.indexOf(keyStr) === -1) {
                        arr.push(item);
                    }
                });
                localDataStrArr = arr;
            }

            if (localDataStrArr.length > p.maxSize) {
                localDataStrArr.length = p.maxSize;
            }
            m.localDataStr = localDataStrArr.join('|');

            Storage.set(p.localHistoryName, m.localDataStr);
        }
    };

    /**
     * @memberof playHistory
     * @summary 获取播放记录
     * @type {function}
     * @param {object} data 获取记录的条件
     * @returns {Array} 满足条件的记录
     */
    c.getHistory = function (data) {
        var rst = [];
        var localDataStr = (m.localDataStr && m.localDataStr !== '') ? m.localDataStr : Storage.get(p.localHistoryName);

        if (localDataStr && typeof data !== 'undefined') {

            if (typeof data.vid !== 'undefined' && typeof data.site !== 'undefined') {
                var reg = new RegExp('(^|\\|)\\d+' + ',' + data.vid + ',' + data.site + '(,[\\w\\.\\W]*){6}', 'ig');
                var rstStr = localDataStr.match(reg) + '';
                rst = m.strToObj(rstStr);
                rst = (rst === null) ? [] : [rst];

            } else if (typeof data.sid !== 'undefined') {
                var historyList = m.strToArr(localDataStr);

                $.each(historyList, function (index, item) {

                    if ((item.sid + '') === (data.sid + '')) {
                        rst.push(item);
                    }
                });

                if (typeof data.type === 'undefiend' || data.type === 0 || data.type !== 1) {
                    rst.length = 1;
                }
            }

        } else {
            rst = m.strToArr(localDataStr);
        }

        return rst;
    };

    //对外接口
    window.DiDiVideoJSBridge = window.DiDiVideoJSBridge || {};
    window.DiDiVideoJSBridge.setHistory = c.setHistory;
    window.DiDiVideoJSBridge.getHistory = c.getHistory;

    module.exports = {
        setHistory: c.setHistory,
        getHistory: c.getHistory
    };
 
});
;define('didi-component-ddplayer/player/errorTypes.js', function(require, exports, module){ /**
 *
 *   @description: errorTypes
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 基本编码信息
 *
 */

    'use strict';

    /**
     * @module player.errorTypes
     * @namespace Error
     * @summary 编码信息
     * @property {Object}   PROCESS    数据处理提示信息
     * @property {Object}   SUPPORT    支持性提示信息
     * @property {Object}   REQUEST    请求提示信息
     *
     * @example
     *      var error = require('./errorTypes.js');
     */
    var Error = {
        //数据处理
        'PROCESS': {
            '200': '数据处理完成',
            '201': '无效数据,请刷新重试',
            '202': '无效视频数据',
            '203': '数据结构错误',
            '204': '解析数据出错'
        },
        //支持性提示信息
        'SUPPORT': {
            '300': '您的浏览器不支持播放功能，请尝试使用其它浏览器',
        },
        //请求提示信息
        'REQUEST': {
            '400': '网络超时，请刷新重试'
        }
    };

    module.exports = Error;
 
});
;define('didi-component-ddplayer/player/ctrlProgress.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器banner-进度条业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器banner-进度条业务
 *                 
 *
 **/



  'use strict';
  
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var playHistory = require('didi-component-ddplayer/player/playHistory.js');
  var Console = require('didi-component-ddplayer/base/console.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');
  /**
   * @class MediaPlayer
   * @classdesc 播放器进度条业务
   * @property {function}  _initCtrlProgress               - (播放器内部使用) 初始化进度条业务
   */
  
  //获取当前播放时间
  var getCurrentTime = function (player) {
    var cache = player.cache;
    var childDurList = cache.srcList[cache.modeType] || [];
    //多个子片
    if (childDurList.length > 1) {
      var curTime = player.videoTag.currentTime;
      var curIndex = cache.curIndex;
      //加上之前已经播放完成的分片时间
      $.each(childDurList, function (index, item) {

        if (index < curIndex) {
          curTime += item.duration || 0;
        
        } else {

          return false;
        }
      });

      return curTime;
    //直接返回当前视频播放时间
    } else {

      return player.videoTag.currentTime;
    }
  };

  //设置历史记录
  var setHistory = function (player) {
    var videoData = player.videoData,
        cache = player.cache;

    if (player.currentTime !== 0) {
      
      //生成播放记录
      if (!player._makeHistoryFlag) {
        var rec = {
          playTime: player.currentTime,
          duration: videoData.totalDuration,
          title: videoData.tvname || ''
        };
        playHistory.setHistory(rec);
        player._makeHistoryFlag = true;
        
        setTimeout(function () {
          player._makeHistoryFlag = false;
        }, 1000);
      }
    }
  };

  //断点续播
  var continuePlay = function (player) {
    var videoData = player.videoData;

    if (player.cache.isRemHistory) {
      var vData = {
        vid: videoData.vid,
        site: videoData.site
      };
      //获取历史记录
      var historyList = playHistory.getHistory(vData),
          history = null;

      if (historyList.length > 0) {
        history = historyList[0];
        //按照播放记录中的数据继续播放
        Console.log('prgress:', history.playTime);
        player.seekTo(history.playTime);
      }
      player._playByHistoryFlag = true;
      
    }
  };

  //绑定时间更新事件
  var timeupdateService = function (player) {
    //添加updatetime事件
    player._addEvent('timeupdate', function () {

      //发送统计vv
      if (!player._sendVVFlag) {
        player._sendVVFlag = true;
      }

      if (!ddvp.debug.isShowPlayerPlayStartTime && player.currentTime > 0) {
        Console.log('视频加载时间:' + (Date.now() - ddvp.debug.playerPlayStartTime) / 1000 + '秒');
        ddvp.debug.isShowPlayerPlayStartTime = true;
      }
      var cache = player.cache;
      //如果videoData中总时长为''，则从视频中获取总时长
      if (player.videoData.totalDuration === '' && player.videoTag.duration) {
        cache.duration = player.videoData.duration = player.videoData.totalDuration = player.videoTag.duration;
      }

      //给player对象设置duration属性
      var duration = player.duration = cache.duration;
      //给player对象设置currentTime属性
      var currentTime = player.currentTime = getCurrentTime(player);
      if (currentTime > 0) {
        //隐藏海报
        if (!vars.IsIphone || (vars.IsIphone && vars.IsWeiXinBrowser)) {
          player.hidePoster();
        }

        //隐藏loading
        player._hideLoading();

        if (currentTime > 1) {
          //第一次播放成功发送realvv
          if (!player._sendRealVVFlag) {
            
            player._sendRealVVFlag = true;
          }
          //播放记录
          if (cache.isRemHistory) {
            //断点续播
            if (!player._playByHistoryFlag) {
              continuePlay(player);
            }
            //播放记录操作
            setHistory(player);
          }

          //如果两次timeupdate之间的时间间隔大于2秒，认为用户拖动了视频
          if (currentTime > 0 && Math.abs(currentTime - player._lastCurTime) > 2) {
            player._startPlayTime = $.now();
          }

          //如果是iphone或者8.1之前的winphone，隐藏播放模式选择列表
          if (vars.IsIphone || vars.IsOldWindowsPhone) {
            player.$midModeList.oriHide();
          }
          //更新播放时长
          player._lastCurTime = currentTime;

          //如果离播放事件还剩15秒之内，发送完成统计数据
          if (!player._sendEndFlag && currentTime > duration - 15) {
            player._sendEndFlag = true;
          }

          //2分钟发送心跳统计
          if (player._traceHeartInterval === null) {
            
            player._traceHeartInterval = setInterval(function () {
              // Console.log('');
            }, 1000 * 60 * 2);
          }

          //变更标志位
          player._changeModeFlag = false;
          //更新拖拽状态
          player._dragRangeFlag = false;
          //更新首次加载请求标志位
          player._firstWaitingFlag = false;

          //iphone、安卓2.X mione、8.1前winphone播放时会调用系统播放器全屏
          if ((vars.IsIphone && !vars.IsWeiXinBrowser) || vars.IsOldWindowsPhone ||
              /Android\/?\s?2\../i.test(vars.UA) || vars.IsQQBrowser || vars.IsUCBrowser) {
            //显示播放按钮
            player._showPlayBtn();

          } else if (!vars.IsIphone && !vars.IsIpad) {
            //显示暂停按钮
            player._showPauseBtn();
          }

          //进度条宽度
          var playedPro = currentTime / duration * 100 + '%';
          //如果有播放时长限制，并且已经播放到最后
          if (currentTime >= duration && cache.timeLimit === duration) {
            currentTime = duration;
            playedPro = '100%';
            var freeTime = cache.timeLimit;
            var time = (freeTime - freeTime % 60) / 60;
            time = (freeTime % 60 === 0) ? time : (time + 1);
          }
          //更新时间
          if (currentTime > duration) {
            currentTime = duration;
          }

          player.$ctrlCurTime.html($.formatSeconds(currentTime));
          player.$ctrlDuration.html($.formatSeconds(duration));
          //如果当前描点没有处于拖拽状态，进行更新拖拽锚点位置
          if (!player._dragFlag) {
            player.$ctrlCurPlayedBar.css({width: playedPro});
          }

          //iphone下uc无法触发ended事件，这里通过监听当前播放时间来触发ended事件
          if (vars.IsUCBrowser && vars.IsIphone) {
            
            if (parseInt(currentTime, 10) === parseInt(duration, 10)) {
              player._fireEvent('ended');
            }
          }
        }
      }
    });
  };

  //拖拽进度条业务
  var dragService = function (player) {
    //时间锚点拖拽-开始
    player.$ctrlDragAnchor.on(vars.START_EVENT, function (e) {
      //停止隐藏控制界面的计时器
      clearTimeout(player._hideMainCtrlTime);
      //快进快退提示计时器
      clearTimeout(player._rewindForwardInterval);
      //显示快进快退提示
      player.$midRewindForwardCon.oriShow();
      //更新锚点拖动标志位
      player._dragFlag = true;
      //被拖拽（统计用）
      player._dragRangeFlag = true;
      //缓存触摸起始点的x坐标
      player._touchStratX = (e.touches && e.touches[0]) ? e.touches[0].pageX : e.pageX;
      
      return false;
    });

    //时间锚点拖拽-移动
    player.$ctrlDragAnchor.on(vars.MOVE_EVENT, function (e) {

      if (player._dragFlag) {
        //获取进度条总宽度
        var trackBarWidth = player.$ctrlTrackBar.width(),
        //获取视频总时长
            duration = player.duration,
        //当前播放时间
            currentTime = player.currentTime;
        //停止隐藏控制界面的计时器
        clearTimeout(player._hideMainCtrlTime);
        //快进快退提示计时器
        clearTimeout(player._rewindForwardInterval);
        //更新拖拽时间
        var moveTimeUpdate = function (moveTime, duration) {
          player.$mid.oriShow();

          if (currentTime > moveTime) {
            player.$midRewindForwardCon.addClass('rewind').removeClass('forward');

          } else {
            player.$midRewindForwardCon.addClass('forward').removeClass('rewind');
          }
          //缓存拖拽时间
          player._moveTime = moveTime;
          //更新内容,注:要先写内容，下面才能获取其准确宽度
          player.$midTime.html($.formatSeconds(moveTime));
          //更新拖拽锚点位置
          player.$ctrlCurPlayedBar.width((moveTime / duration) * 100 + '%');
        };

        //获取移动的距离并缓存
        player._touchMoveX =  (e.touches && e.touches[0]) ? e.touches[0].pageX : e.pageX;
        //计算出变化时间
        var changeTime = duration / trackBarWidth * (player._touchStratX -  player._touchMoveX) * -1;
        //计算出当前拖动的时间
        var moveTime = currentTime + changeTime;
        //拖动超出进度条最左边
        if (moveTime < 0) {
          moveTimeUpdate(0, duration);
        //拖动超出进度条最右边边
        } else if (moveTime > duration) {
          moveTimeUpdate(duration, duration);
        //正常范围内
        } else {
          moveTimeUpdate(moveTime, duration);
        }
      }
        
      return false;
    });

    //时间锚点拖拽-结束
    player.$ctrlDragAnchor.on(vars.END_EVENT + ' mouseout', function () {

      if (player._dragFlag) {
        //更新锚点拖动标志位
        player._dragFlag = false;
        //将视频跳至拖动时间点
        player.seekTo(player._moveTime);
        //重置卡顿计时
        player._startPlayTime = $.now();
        //隐藏快进快退界面
        player._rewindForwardInterval = setTimeout(function () {
          player.$midRewindForwardCon.oriHide();
        }, 2000);
        //如果没有任何操作，3秒后主操作界面隐藏
        player._hideMainCtrlTime = setTimeout(function () {
          player._hideMainCtrl();
        }, 3000);
      }

      return false;
    });
  };

  //点击进度条业务
  var clickService = function (player) {
    
    player.$ctrlBar.on(vars.END_EVENT, function () {
      
      return false;
    });

    player.$ctrlTrackBar.on(vars.START_EVENT, function (e) {
      var dom = $(this);
      var x = (e.touches && e.touches[0]) ? e.touches[0].pageX : e.pageX;
      var xDist = x - dom.offset().left;
      var width = dom.width();

      var clickTime = player.duration / width * xDist;
      //重置卡顿计时
      player._startPlayTime = $.now();
      //跳转到指定时间
      player.seekTo(clickTime);

      return false;
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化播放器进度条业务 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._initCtrlProgress = function () {
    //是否发送realvv标志位
    this._sendRealVVFlag = false;
    //vvend发送标志位
    this._sendEndFlag = false;
    //断点续播标志位
    this._playByHistoryFlag = false;
    //生成播放记录标志位
    this._makeHistoryFlag = false;
    //当前播放时间
    this._lastCurTime = 0;
    //起始时间，发送统计用
    this._startPlayTime = 0;
    //缓冲计数
    this._bufferCount = 0;
    //心跳统计计时器
    this._traceHeartInterval = null;
    //快进快退消失计时器
    this._rewindForwardInterval = null;
    //视频进度条是否处于拖拽状态标志位
    this._dragRangeFlag = false;
    //视频质量切换标志位
    this._changeModeFlag = false;
    //第一次加载等待标志位
    this._firstWaitingFlag = true;
     //时间锚点是否处于拖拽状态
    this._dragFlag = false;
    //触摸开始x坐标
    this._touchStratX = 0;
    //触摸移动x坐标
    this._touchMoveX = 0;
    //拖动时候的时间轴时间
    this._moveTime = -1;
    //绑定时间更新事件
    timeupdateService(this);
    //直播没有进度条
    if (this.config.mediaType === 'live') {
    
      return;
    }
    //拖拽进度条业务
    dragService(this);
    //点击进度条业务
    clickService(this);
  };
 
});
;define('didi-component-ddplayer/player/ctrlButton.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器banner-按钮业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器banner-按钮业务
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器按钮条业务
   * @property {function}  _initCtrlButton                 - (播放器内部使用) 初始化播放器按钮业务
   * @property {function}  _showPlayBtn                    - (播放器内部使用) 显示播放按钮
   * @property {function}  _showMidPlayBtn                 - (播放器内部使用) 显示中间播放按钮
   * @property {function}  _showPauseBtn                   - (播放器内部使用) 显示暂停按钮
   * @property {function}  _showLoading                    - (播放器内部使用) 显示loading图
   * @property {function}  _hideLoading                    - (播放器内部使用) 隐藏loading图
   */
  
  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示播放按钮 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showPlayBtn = function () {
    this.$ctrlPlay.oriShow();
    this.$ctrlPause.oriHide();
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示中间播放按钮 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showMidPlayBtn = function () {
    this._hideLoading();
    this._hideMainCtrl();
    this.$ctrlBar.oriHide();
    this.$midModeListCon.oriHide();
    this.$mid.oriShow();
    this.$midPlay.oriShow();
    this.$title.oriHide();
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示暂停按钮 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showPauseBtn = function () {
    this.$ctrlPlay.oriHide();
    this.$ctrlPause.oriShow();
    // alert(1);
    return;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示loading (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showLoading = function () {
    //ios下的uc和qq不做loading处理
    if (!(vars.IsIOS && (vars.IsQQBrowser || vars.IsUCBrowser))) {

      if (!vars.IsBaiduBrowser) {
        this.$midPlay.oriHide();
      }
      this.$loading.oriShow();
      this.$mid.oriHide();
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示loading (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._hideLoading = function () {
    
    if (!vars.IsBaiduBrowser) {
      this.$midPlay.oriHide();
    }
    this.$loading.oriHide();
  };

  //中间播放按钮业务
  var midPlayBtnService = function (player) {

    player.$midPlay.on(vars.END_EVENT, function () {
      $(this).oriHide();
      player._playOrPause('play');

      return false;
    });
  };

  //左下角播放、暂停按钮
  var playOrPauseBtnService = function (player) {
    //播放
    player.$ctrlPlay.on(vars.END_EVENT, function () {
      player._playOrPause('play');

      return false;
    });

    //暂停
    player.$ctrlPause.on(vars.END_EVENT, function () {
      player._playOrPause('pause');

      return false;
    });

    player._addEvent('pause', function () {
      //隐藏loading
      player._hideLoading();
      //显示播放按钮
      player._showPlayBtn();
      //显示标题、控制条
      player._showMainCtrl();
    });

    if (!vars.IsIphone || (vars.IsIphone && vars.IsWeiXinBrowser)) {
      player._addEvent('play', player._showPauseBtn);
      player._addEvent('playing', player._showPauseBtn);
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化播放器按钮业务 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._initCtrlButton = function () {
    //中间播放按钮业务
    midPlayBtnService(this);
    //左下角播放、暂停按钮
    playOrPauseBtnService(this);
  };
 
});
;define('didi-component-ddplayer/player/ctrlFullscreen.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器全屏播放业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器全屏播放业务
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');
  var player = require('didi-component-ddplayer/player/mediaPlayer.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器全屏播放业务
   * @property {function}  _initCtrlFullscreen             - (播放器内部使用) 初始化播放器全屏播放业务
   * @property {function}  _isSupportSysFullScreen         - (播放器内部使用) 检测是否支持系统全屏
   * @property {function}  _apiEnterFullScreen             - (播放器内部使用) 进入系统全屏接口
   * @property {function}  _apiExitFullScreen              - (播放器内部使用) 退出系统全屏接口
   * @property {function}  _enterSysFullScreen             - (播放器内部使用) 进入系统全屏
   * @property {function}  _fullOrShrink                   - (播放器内部使用) 进入或退出全屏
   */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 检测是否支持系统全屏 (播放器内部使用)
   * @type {function}
   */
  player.prototype._isSupportSysFullScreen = function () {
    // 不支持全屏的视频
    var isSptFullscreen = false;
    var elem = this.videoTag;
    
    if (elem.requestFullscreen) {
      isSptFullscreen = true;
    
    } else if (elem.mozRequestFullScreen) {
      isSptFullscreen = true;
    
    } else if (elem.webkitRequestFullscreen) {
      isSptFullscreen = true;
    
    } else if (elem.webkitEnterFullscreen) {
      isSptFullscreen = true;
    
    } else if (elem.msRequestFullscreen) {
      isSptFullscreen = true;
    }
    
    if ($(this.videoTag).hasClass('inline_player') && (!$.isEmpty(this.cache.fullscreenType) && this.cache.fullscreenType !== '1')) {
      isSptFullscreen = false;

    }
    
    return isSptFullscreen;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 进入系统全屏接口 (播放器内部使用)
   * @type {function}
   */
  player.prototype._apiEnterFullScreen = function (elem) {
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    
    } else if (elem.webkitEnterFullscreen) {
      elem.webkitEnterFullscreen();
    
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 退出系统全屏接口 (播放器内部使用)
   * @type {function}
   */
  player.prototype._apiExitFullScreen = function (elem) {
    
    if (elem.exitFullscreen) {
      elem.exitFullscreen();
    
    } else if (elem.mozCancelFullScreen) {
      elem.mozCancelFullScreen();
    
    } else if (elem.webkitExitFullscreen) {
      elem.webkitExitFullscreen();
    
    } else if (elem.webkitCancelFullScreen) {
      elem.webkitCancelFullScreen();
    
    } else if (elem.msExitFullscreen) {
      elem.msExitFullscreen();
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 进入系统全屏 (播放器内部使用)
   * @type {function}
   */
  player.prototype._enterSysFullScreen = function () {
    var _this = this;
    // 开始播放后才可以全屏
    if (vars.UA.match(/HS\-U950|HUAWEI_C8812|vivo/i) && !vars.IsUCBrowser && !vars.IsQQBrowser) {
      _this.videoTag['play']();
    }
    var fullscreenchange = function () {
      
      if (_this.videoTag.paused && !vars.IsIOS) {
        
        setTimeout(function () {
          _this.videoTag['play']();
        }, 0);
      }
    };

    if (this._isSupportSysFullScreen()) {
      var elem = _this.videoTag;
      document.addEventListener("fullscreenchange", fullscreenchange, false);
      document.addEventListener("mozfullscreenchange", fullscreenchange, false);
      document.addEventListener("webkitfullscreenchange", fullscreenchange, false);
      document.addEventListener("MSFullscreenChange", fullscreenchange, false);
      _this._apiEnterFullScreen(elem);

    }
    
    setTimeout(function () {
      _this.videoTag['play']();
    }, 0);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 退出系统全屏 (播放器内部使用)
   * @type {function}
   */
  player.prototype._exitSysFullScreen = function () {
    var _this = this;
    var elem = _this.videoTag;
    _this._apiExitFullScreen(elem);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 进入/退出全屏 (播放器内部使用)
   * @type {function}
   * @property {string} type  -  全屏缩屏类型(fullScreen/shrinkScreen)
   */
  player.prototype._fullOrShrink = function (type) {
    var _this = this;
    clearTimeout(this._hideMainCtrlTime);
    
    //全屏
    if (type === 'fullScreen') {
      
      if (this.cache.fullscreenType === '1') {
        this._enterSysFullScreen();
      
      } else {
        //如果在iphone、8.1前winphone设备下，点击全屏直接播放
        if ((vars.IsIphone && !vars.IsWeiXinBrowser) || vars.IsOldWindowsPhone ||
            (vars.IsAndroid && vars.IsQQBrowser) || vars.IsBaiduBrowser) {
          this._playOrPause('play');
        
        } else {
          $('html').addClass('position_fullscreen');
          //缓存当前scrollTop
          this._scrollTop = document.body.scrollTop;
          //隐藏全屏按钮
          this.$ctrlFullScreen.oriHide();
          //显示缩小按钮
          this.$ctrlShrinkScreen.oriShow();
        }
  
        $('.finPic').oriHide();
      }
    //缩屏
    } else {
      $('html').removeClass('position_fullscreen');
      //显示全屏按钮
      this.$ctrlFullScreen.oriShow();
      //隐藏缩小按钮
      this.$ctrlShrinkScreen.oriHide();
      //恢复到原来的scrollTop
      document.body.scrollTop = this._scrollTop;

      setTimeout(function () {
        $('.finPic').oriShow();
      }, 500);
    }
    //如果没有任何操作，3秒后主操作界面隐藏
    this._hideMainCtrlTime = setTimeout(function () {
      _this._hideMainCtrl();
    }, 3000);
  };

  //进入全屏、退出全屏按钮事件注册
  var fullScreenBtnService = function (player) {
    
    player.$ctrlFullScreen.on(vars.END_EVENT, function () {
      player._fullOrShrink('fullScreen');
      
      return false;
    });

    player.$ctrlShrinkScreen.on(vars.END_EVENT, function () {
      player._fullOrShrink('shrinkScreen');

      return false;
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化播放器全屏播放业务 (播放器内部使用)
   * @type {function}
   */
  player.prototype._initCtrlFullscreen = function () {
    fullScreenBtnService(this);
  };
 
});
;define('didi-component-ddplayer/player/controls.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器主控界面业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器主控界面业务
 *
 **/


  'use strict';
  
  //扩展进度条操作
  require('didi-component-ddplayer/player/ctrlProgress.js');
  //扩展播放按钮业务
  require('didi-component-ddplayer/player/ctrlButton.js');
  //扩展全屏业务
  require('didi-component-ddplayer/player/ctrlFullscreen.js');

  var vars = require('didi-component-ddplayer/base/vars.js');

  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  
  /**
   * @class MediaPlayer
   * @classdesc 播放器事件
   * @property {function}  _hideMainCtrl                   - 隐藏主控界面
   * @property {function}  _showMainCtrl                   - 显示主控界面
   * @property {function}  _initMainClick                  - 主控容器点击业务
   * @property {function}  _initControls                   - 控制面板业务
   */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 隐藏主控界面
   * @type {function}
   */
  MediaPlayer.prototype._hideMainCtrl = function () {
    var _this = this;
    clearInterval(this._mainCtrlInterval);
    //ios微信小窗 所以200ms后隐藏buttons
    if (!(vars.IsIphone) || (vars.IsIphone && vars.IsWeiXinBrowser)) {
      this._mainCtrlInterval = setTimeout(function () {
        _this.$title.oriHide();
        _this.$ctrlBar.oriHide();
        _this.$midModeListCon.oriHide();
      }, 200);
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示主控界面
   * @type {function}
   */
  MediaPlayer.prototype._showMainCtrl = function () {
    var _this = this;
    clearInterval(this._mainCtrlInterval);

    this._mainCtrlInterval = setTimeout(function () {
      _this.$title.oriShow();
      _this.$ctrlBar.oriShow();
      _this.$midModeListCon.oriShow();
    }, 200);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 主控容器点击业务
   * @type {function}
   */
  MediaPlayer.prototype._initMainClick = function () {
    var _this = this;
    //显示和隐藏主控界面计时器
    this._mainCtrlInterval = null;

    this.$ctrlCon.on(vars.END_EVENT, function () {
      
      if (_this.$midPlay.css('display') === 'block') {
        _this._playOrPause('play');
      }

      if (_this.$ctrlBar.css('display') === 'none') {
        _this._showMainCtrl();

        //清除消失动画计时器
        clearTimeout(_this._hideMainCtrlTime);
        //如果没有任何操作，3秒后主操作界面隐藏
        _this._hideMainCtrlTime = setTimeout(function () {
          _this._hideMainCtrl();
        }, 3000);

      } else {
        _this._hideMainCtrl();
      }
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 控制面板业务
   * @type {function}
   */
  MediaPlayer.prototype._initControls = function () {
    //初始化进度条
    this._initCtrlProgress();
    //播放按钮业务
    this._initCtrlButton();
    //主控容器点击业务
    this._initMainClick();
    //全屏业务
    this._initCtrlFullscreen();
  };

 
});
;define('didi-component-ddplayer/player/loadCacheData.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器内部数据
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器内部数据
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');
  var Cookie = require('cookie');
  var special = require('didi-component-ddplayer/base/special.js');

  /**
   * @class LoadCacheData
   * @classdesc 播放器内部数据对象
   * @property {function}  getPlayList                     - 获取当前播放列表
   * @property {function}  getNextUrl                      - 获取下一条播放链接
   * @property {function}  getFirstUrl                     - 获取第一条播放链接
   *
   * @example
   *   var LoadCacheData = require('./loadCacheData.js');
   *   cache = new LoadCacheData(config, videoData);
   */

  var defaultVideoInfo = {
    //影片id
    vid: '',
    //标签id
    elemId: '',
    //海报
    poster: '',
    //海报类型
    posterType: '',
    //播放类型  live: 直播, vod: 点播
    mediaType: '',
    //模式类型  nor:标清, hig:高清, sup:超清
    modeType: '',
    //支持的播放类型
    modeTypeList: [],
    //源类型 点播 m3u8  mp4  直播 m3u8 client
    srcType: '',
    //宽
    width: '',
    //高
    height: '',
    //音量
    volume: 0,
    //当前视频url
    curPlayUrl: '',
    //播放源
    srcList: {},
    //打点列表
    pointList: [],
    //是否自动播放
    autoplay: false,
    //是否显示默认控制条
    defControls: false,
    //是否循环播放
    loop: false,
    //是否预加载
    preload: false,
    //内容标题,或者直播频道名称
    title: '',
    //总时长
    duration: 0,
    //当前播放的内容索引值
    curIndex: -1,
    //内容总数
    totCounts: -1,
    //记录播放位置
    history: {},
    //ip限制
    ipLimit: '',
    //直播频道英文名
    liveEnName: '',
    //直播频道图标
    liveIcon: '',
    //直播标示
    liveId: '',
    //播放时长限制, -1: 无限制, num: 指定播放时长(毫秒)
    timeLimit: -1,
    //地址
    liveUrl: '',
    //联播vid列表
    vidList: [],
    //联播播放索引
    vidCurIndex: -1,
    //调试环境
    debug: false,
    //主要演员
    mainActor: '',
    //更新至多少集
    latestCount: '',
    //剧情梗概
    desc: '',
    //原始播放器地址列表
    oriUrls: null,
    //是否真全屏. 默认0：假全屏；1：系统默认全屏
    fullscreenType: 0,
    //是否记录播放记录, false: 不记录, true: 记录, 默认flase
    isRemHistory: false,
    //可展示的清晰度
    modeList: ['nor', 'hig', 'sup', 'app']
  };

  //播放信息操作
  var LoadCacheData = function (config, videoData) {

    //获取默认属性
    $.extend(this, defaultVideoInfo);
    /*合并 vid width height volume autoplay controls
      loop preload mediaType modeType html5SkinCss等属性*/
    $.merge(this, config);

    if (!$.isUndefined(videoData)) {
      this._initVOD(videoData);
    }
  };

  /**
   * @memberof LoadCacheData.prototype
   * @summary 获取当前播放列表
   * @type {function}
   */
  LoadCacheData.prototype.getPlayList = function () {

    return this.srcList[this.modeType] || [];
  };

  /**
   * @memberof LoadCacheData.prototype
   * @summary 获取下一条播放链接
   * @type {function}
   */
  LoadCacheData.prototype.getNextUrl = function () {
    var playList = this.getPlayList(),
        curIndex = this.curIndex + 1;
    var nextVideo = playList[curIndex];

    return !$.isUndefined(nextVideo) ? nextVideo.url : '';
  };

  /**
   * @memberof LoadCacheData.prototype
   * @summary 获取第一条播放链接
   * @type {function}
   */
  LoadCacheData.prototype.getFirstUrl = function () {
    var playList = this.getPlayList();
    var firstVideo = playList[0];

    return !$.isUndefined(firstVideo) ? firstVideo.url : '';
  };

  //点播内容初始化
  LoadCacheData.prototype._initVOD = function (videoData) {
    var _this = this;
    //海报水平
    if (_this.posterType === 'horizon') {
      _this.poster = videoData.horHighPic || videoData.verHighPic || '';
    //垂直图
    } else {
      _this.poster = videoData.verHighPic || videoData.horHighPic || '';
    }
    //总时长
    var duration = videoData.totalDuration || videoData.total_duration || 0;
    _this.duration = parseInt(duration, 10);
    //配置时长限制
    if (_this.timeLimit > -1 && _this.timeLimit < _this.duration) {
      _this.duration = _this.timeLimit;
    }
    //标题
    _this.title = videoData.tvname || videoData.videoName || videoData.video_name || '';
    //主要演员
    _this.mainActor = videoData.main_actor || '',
    //更新至多少集
    _this.latestCount =  videoData.latest_video_count || '';
    //剧情梗概
    _this.desc = videoData.video_desc || '';
    //源类型
    //如果videoData中直接制定了播放类型，直接按指定设置
    _this.srcType = videoData.srcType || 'mp4';

    //初始化原始播放列表
    if (!$.isUndefined(videoData.urls)) {
      _this.oriUrls = videoData.urls;
    }
    //初始化打点列表
    if (!$.isUndefined(videoData.ep) && videoData.ep instanceof Array) {
      //打点数据结构转换
      $.each(videoData.ep, function (index, item) {
        var point = {};
        point.time = parseInt(item.k, 10);
        point.desc = item.v;
        _this.pointList.push(point);
      });
    }
    //内容id
    _this.vid = videoData.vid;

    //是否有播放源
    var isHasSrc = false;
    //初始化内容列表
    if (!$.isUndefined(videoData.urls)) {
      //获取支持的分片链接和分片时长
      var urls = videoData.urls[_this.srcType],
          dura = videoData.durations;
      //遍历所有类型
      for (var i in urls) {
        //为每个类型的片子申请一个数组
        _this.srcList[i] = [];

        if (urls[i] instanceof Array) {
          //遍历所有链接
          $.each(urls[i], function (index, item) {
            var data = {};
            data.url = item;
            
            if (_this.srcType === 'm3u8') {
              data.duration = videoData.totalDuration || videoData.total_duration || -1;

            } else {
              data.duration = parseInt((dura[i][index] || -1), 10);
            }
            //将单个子片源缓存到数组中
            _this.srcList[i].push(data);
          });
        }
          
        if (!isHasSrc && _this.srcList[i].length > 0) {
          isHasSrc = true;
          //内容总数
          _this.totCounts = _this.srcList[i].length;
        }
      }

      var initDownloadUrl = function () {
        var data = {};
        data.url = '';

        if (!$.isUndefined(videoData.urls.downloadUrl)) {
          data.url = videoData.urls.downloadUrl[0] || '';
        }
        data.duration = parseInt((_this.duration || -1), 10);
        _this.srcType = 'mp4';
        _this.modeType = _this.modeType;
        _this.srcList['nor'] = [data];
        _this.totCounts = _this.srcList['nor'].length;
      };

      //如果匹配类型没有可播放内容，采用downloadUrl字段播放
      if (!isHasSrc && _this.srcType !== 'client') {
        initDownloadUrl();
      }

      if (_this.totCounts > 0) {
        //当前播放的内容索引值
        _this.curIndex = 0;
      }

      //android UC分片体验不好，这里只播downloadurl将流畅的分片改为downloadurl字段的值
      if (!vars.IsIphone && vars.IsUCBrowser && _this.srcType !== 'client') {
        initDownloadUrl();
      }

      //如果是安卓2.xx，采用downloadurl播放
      if (/Android 2./i.test(vars.UA)) {
        initDownloadUrl();
      }
      //初始化当前可播放内容的url和modeType类型
      _this._initCurPlayUrlAndModeType();
    }
  };

  //初始化当前播放的链接
  LoadCacheData.prototype._initCurPlayUrlAndModeType = function () {
    var _this = this;
    //获取当前播放列表
    var playList = _this.getPlayList();
    //如果获取的列表为空
    var mList = this.modeList;
    //遍历支持的模型列表，获取可播放内容
    $.each(mList, function (index, item) {
      //如果有可播放内容
      if (!$.isUndefined(_this.srcList[item]) && _this.srcList[item].length > 0) {
        //如果默认类型没有可播放内容，则取可播放内容
        if (playList.length === 0) {
          //自动修改当前类型
          _this.modeType = item;

          return false;
        }
        //将其支持的类型缓存起来
        _this.modeTypeList.push(item);
      }
    });
    
    if ($(mList).indexOf('app') > -1) {
      this.modeTypeList.push('app');
    }
    //再次获取播放列表
    playList = this.getPlayList();

    if (playList.length > 0) {
      this.curPlayUrl = playList[0].url;
    }
  };

  module.exports = LoadCacheData;
 
});
;define('didi-component-ddplayer/player/settings.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器配置参数
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 定义播放器配置参数
 *                 
 *
 **/


  'use strict';
  
  var special = require('didi-component-ddplayer/base/special.js');
  /**
   * @module base.settings
   * @namespace settings
   * @property {object}   PLAY_MODE                     - 播放类型
   * @property {function} initConfig                    - 将配置参数和默认参数合并
   *
   * @example
   *   var settings = require('./settings.js');
   *   var config = settings.initConfig(config);
   */
  var settings = {};

  /**
   * @memberof settings
   * @summary 播放类型
   * @type {object}
   */
  settings.PLAY_MODE = {nor: '流畅', hig: '高清', sup: '超清', ori: '原画'};

  //默认配置参数
  var DEFAULT_CONFIG = {
    //视频数据
    data: null,
    //外围容器id
    mainId: '',
    //video标签id
    playerId: '',
    //宽
    width: '100%',
    //高
    height: '100%',
    //父级容器的宽
    pWidth: '',
    //父级容器的高
    pHeight: '',
    //音量
    volume: 1,
    //video标签id, 默认是ddvideo_video_player
    elemId: 'ddvideo_video_player_' + Date.now(),
    //数据类型vid_list:vid的聚集列表; video_data: 页面videoData; play_source:带有src的播放源数据对象;  unknown
    dataType: '',
    //是否自动播放
    autoplay: true,
    //是否使用默认控制条
    defControls: false,
    //是否循环播放
    loop: false,
    //当前视频是否预加载
    preload: false,
    //片源类型 nor:流畅, hig:高清, sup:超清
    modeType: 'nor',
    //海报图片类型 horizon: 横图, vertical: 竖图
    posterType: 'horizon',
    //调试环境
    debug: false,
    //是否真全屏. 默认0：假全屏；1：系统默认全屏
    fullscreenType: 1,
    //是否记录播放记录, false: 不记录, true: 记录, 默认flase
    isRemHistory: false
  };

  /**
   * @memberof settings
   * @summary 将配置参数和默认参数合并
   * @type {function}
   * @param {object} config                             - 播放器配置参数
   * @return {object}                                   - 合并后的配置参数
   */
  settings.initConfig = function (config) {
    var rst = $.extend({}, DEFAULT_CONFIG, config);
    //克隆一个数据对象，以免在后面修改数据时会对源数据一起修改
    if (rst.data !== null) {
      rst.data = $.extend({}, rst.data);
    }
    
    if (rst.mainId === '') {
      
      if ($.isUndefined(ddvp.mainId)) {
        ddvp.mainId = 1;
      }
      rst.mainId = 'ddvp_main_' + ddvp.mainId;
      ddvp.mainId++;
    }

    //合并
    return rst;
  };

  module.exports = settings;
 
});
;define('didi-component-ddplayer/player/html5UI.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于播放器模板管理
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器模板管理
 *
 **/


  'use strict';
  
  var template = ddvp.template;
  var vars = require('didi-component-ddplayer/base/vars.js');
  var special = require('didi-component-ddplayer/base/special.js');
  var settings = require('didi-component-ddplayer/player/settings.js');
  
  /**
   * @module player/template
   * @namespace template
   * @property {function} makeVideoTmpl                    - 生成播放器整体模板
   * @property {function} makeLoadingTmpl                  - 播放器加载完成前的loading
   *
   * @example
   *   var html5UI = require('./html5UI.js');
   *   var html = html5UI.makeVideoTmpl(cache);
   */
  var html5UI = {};

  var tmpl = {
    param: {},
    model: {},
    view: {},
    ctrl: {}
  };

  var p = tmpl.param,
      m = tmpl.model,
      v = tmpl.view,
      c = tmpl.ctrl;

  //数据处理
  m.parseCache = function (cache) {
    var rst = {
      title: cache.title || '',
      poster: cache.poster || '',
      pointList: [{left: 0}],
      mainId: cache.mainId || 'ddvp_main_1',
      height: cache.height || '100%',
      width: cache.width || '100%',
      srcType: cache.srcType || 'mp4',
      elemId: cache.elemId || '',
      autoplay: cache.autoplay || false,
      defControls: cache.defControls || false,
      isInitSrc: false,
      isIphone: vars.IsIphone || false,
      isUCBrowser: vars.IsUCBrowser || false,
      isQQBrowser: vars.IsQQBrowser || false,
      IsWeiXinBrowser: vars.IsWeiXinBrowser || false,
      isIphoneWeixinBrowser: (vars.IsWeiXinBrowser && vars.IsIphone) || false,
      curMode: cache.modeType || '',
      curModeName: settings.PLAY_MODE[cache.modeType],
      selList: []
    };

    //清晰度列表
    $.each(cache.modeTypeList, function (index, item) {
      
      if (item !== rst.curMode) {
        var data = {
          mode: item,
          modeName: settings.PLAY_MODE[item]
        };
        rst.selList.push(data);
      }
    });

    return rst;
  };

  //配置参数处理
  m.parseConfig = function (config) {
    var rst = {
      mainId: config.mainId || 'ddvp_main_1',
      height: config.height || '100%',
      width: config.width || '100%',
    };

    return rst;
  };

  //video标签
  v.videoTag = function () {
              //video标签拼接
    var html = '<div class="video">' +
                 '<% if (srcType === "client") { %>' +
                    '<div data-noSupport="noSupport"' +
                 '<% } else { %>' +
                    '<video' +
                 '<% } %>' +
                 //添加id
                 ' id="<%=elemId%>"' +
                 //autoplay属性
                 '<% if (autoplay) { %> autoplay<% } %>' +
                 //ios微信小窗播放-给video添加webkit-playsinline
                 '<% if (isIphoneWeixinBrowser) { %> webkit-playsinline<% } %>' +
                 //controls属性
                 '<% if (defControls) { %> controls<% } %>' +
                 //设置默认属性
                 ' x-webkit-airplay="isHtml5UseAirPlay"' +
                 //非自动播放时候不进行预加载视频
                 '<% if (autoplay) { %> preload="none"<% }%>' +
                 //src
                 ' src="<%=curPlayUrl%>"' +
                 //height
                 ' height="<%=height%>"' +
                 //width
                 ' width="<%=width%>"' +
                 //style属性
                 '<% if (isIphone && !IsWeiXinBrowser) { %>' +
                   ' style="position:absolute; left:-200%;' +
                 '"<% } else if (!autoplay && isUCBrowser) { %>' +
                   ' style="display: none;"' +
                 '<% } %>' +
                 //音量属性
                 '>' +
               '</div>';

    return html;
  };

  //控制条
  v.ctrl = function () {
    var html = '<div class="player_controls ddvp_ctrl">' +
                 //中间大的播放/暂停按钮
                 '<div class="mid ddvp_mid">' +
                   //中间播放按钮
                   '<span class="mid_play ddvp_mid_play">' +
                     '<b></b>' +
                   '</span>' +
                   //中间快进快退
                   '<span class="mid_rewind_forward rewind ddvp_mid_rewind_forward" style="display:none;">' +
                     '<b class="mid_forward"></b>' +
                     '<b class="mid_rewind"></b>' +
                     '<span class="mid_time ddvp_mid_time">02:04</span>' +
                   '</span>' +
                 '</div>' +
                 //底部控制条部分
                 '<div class="slider_bar ddvp_ctrl_bar">' +
                   //左侧播放按钮
                   '<div class="left_btn_play">' +
                     //左侧播放按钮
                     '<div class="ddvp_ctrl_play">' +
                       '<b class="state_play"></b>' +
                     '</div>' +
                     //左侧暂停按钮
                     '<div class="ddvp_ctrl_pause" style="display:none;">' +
                       '<b class="state_pause"></b>' +
                     '</div>' +
                   '</div>' +
                   //进度条
                   '<div class="action_trackBar ddvp_ctrl_track_bar">' +
                     '<% if (!((isUCBrowser || isQQBrowser) && isIphone)) { %>' +
                       '<div class="trackbar">' +
                         //已缓冲的进度条
                         '<b class="buffered ddvp_ctrl_buffer"></b>' +
                         '<div class="click_area ddvp_ctrl_click_area">' +
                           '<div class="time_points ddvp_ctrl_points">' +
                             //打点
                             '<% for (var i = 0, l = pointList.length; i < l; i++) { %>' +
                               '<em style="left:<%=pointList[i].left%>"></em>' +
                             '<% } %>' +
                           '</div>' +
                         '</div>' +
                         //当前播放的锚点
                         '<b class="played ddvp_ctrl_played_bar">' +
                           //当前进度锚点
                           '<em class="handle ddvp_ctrl_drag_anchor"></em>' +
                         '</b>' +
                       '</div>' +
                     '<% } %>' +
                   '</div>' +
                   '<% if (!((isUCBrowser || isQQBrowser) && isIphone)) { %>' +
                     //视频当前播放时间/总时长区域
                     '<div class="time ddvp_ctrl_time">' +
                       //当前播放时间/总时长
                       '<b class="current_time ddvp_ctrl_cur_time">00:00</b> / ' +
                       '<span class="duration ddvp_ctrl_duration" data-key="totalDuration" data-type="time">00:00</span>' +
                     '</div>' +
                   '<% } %>' +
                   //缩放控制
                   '<div class="controllers ddvp_ctrl_screen">' +
                   //全屏
                   '<div class="fullscreen disabled ddvp_ctrl_full_screen">' +
                     '<span></span>' +
                   '</div>' +
                   //退出全屏
                   '<div class="shrinkscreen disabled ddvp_ctrl_shrink_screen" style="display:none;">' +
                     '<span></span>' +
                   '</div>' +
                 '</div>' +
               '</div>';
    return html;
  };

  //播放清晰度
  v.playMode = function () {
    var html = '<% if (curMode !== "" && selList.length > 0) { %>' +

                  '<div class="quality_button quality_container ddvp_mid_mode' +
                    '<% if (selList.length > 2) { %>' +
                      ' smaller' +
                    '<% } %>' +
                  '">' +
                    '<% if (selList.length > 0) { %>' +
                       '<div class="quality_definition_button ddvp_mid_cur_mode_btn">' +
                         '<span class="ddvp_mid_cur_mode" data-mode="<%=curMode%>"><%=curModeName%></span>' +
                       '</div>' +
                       '<div class="quality_definition_list">' +
                         '<ul class="ddvp_mid_mod_list">' +
                            '<% for (var i = 0, l = selList.length; i < l; i++) { %>' +
                               '<li data-mode="<%=selList[i].mode%>"><span><%=selList[i].modeName%></span></li>' +
                            '<% } %>' +
                         '</ul>' +
                       '</div>' +
                    '<% } %>' +
                 '</div>' +
               '<% } %>';
    return html;
  };

  //整体模板
  v.video = function () {
    var html =  '<div class="player_main ddvp_player_main">' +
                  //video标签
                  v.videoTag() +
                  
                  //标题
                  '<div class="video_title ddvp_title">' +
                    '<strong>' +
                      '<span class="ddvp_title_content title_content"><%=title%></span>' +
                    '</strong>' +
                  '</div>' +

                  //海报
                  '<div class="poster ddvp_poster" style="background-image:url(<%=poster%>);"></div>' +
                  
                  //控制条
                  v.ctrl() +

                  //清晰度选择
                  v.playMode() +

                  //遮罩层
                  '<div class="mask-layer ddvp_mask_layer" style="display: none;"></div>' +
                '</div>';
    return html;
  };

  //loading模板
  v.loading = function () {
    var html = '<div class="player inline_player" id="<%=mainId%>" style="height:<%=height%>; width:<%=width%>">' +
                  '<div class="ddvp_player_loading player_loading"></div>' +
                  '<div class="ddvp_player_loading_notice player_loading_notice">努力加载中,请稍后...</div>' +
               '</div>';

    return html;
  };

  /**
   * @memberof html5UI
   * @summary 生成播放器整体模板
   * @type {function}
   * @param {object} cache                             - 播放器内部数据缓存对象
   * @return {boolean}                                 - 结果
   */
  html5UI.makeVideoTmpl = function (cache) {
    var render = template.compile(v.video());
    var data = m.parseCache(cache);

    return render(data);
  };

  /**
   * @memberof html5UI
   * @summary 播放器加载完成前的loading
   * @type {function}
   * @param {object} cache                             - 播放器内部数据缓存对象
   * @return {boolean}                                 - 结果
   */
  html5UI.makeLoadingTmpl = function (config) {
    var render = template.compile(v.loading());
    var data = m.parseConfig(config);

    return render(data);
  };

  module.exports = html5UI;
 
});
;define('didi-component-ddplayer/player/update.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器视频更新业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器视频更新业务
 *                 
 *
 **/


  'use strict';
  
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var LoadCacheData = require('didi-component-ddplayer/player/loadCacheData.js');
  var special = require('didi-component-ddplayer/base/special.js');
  var html5UI = require('didi-component-ddplayer/player/html5UI.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');
  var Console = require('didi-component-ddplayer/base/console.js');
  var settings = require('didi-component-ddplayer/player/settings.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器进度条业务
   * @property {function}  update                          - 更新播放器视频
   */

  //获取数据类型
  var getDataType = function (data) {
    //初始化为错误类型
    var rst = 'error';

    if (!$.isUndefined(data) && data !== null) {
      //完整数据类型
      if (!$.isUndefined(data.urls) && !$.isUndefined(data.durations)) {
        //数据校验,校验每个分片是否有对应的时长
        try {
          var playType = (vars.IsIphone || vars.IsQQBrowser) ? 'm3u8' : 'mp4';
          //滴滴暂时都使用mp4
          playType = special.isDiDiForceUseMp4() ? 'mp4' : playType;

          //默认为完整数据类型(无需走接口，直接就可以使用)
          rst = 'whole';

          for (var i in data.urls[playType]) {
            //数据有问题(字段不全，需要走接口获取完整数据)
            if (data.durations[i].length !== data.urls[playType][i].length) {
              rst = 'partial';
            }
          }
        
        } catch (e) {
          //数据有问题(字段不全，需要走接口获取完整数据)
          rst = 'partial';
        }
        
      //部分数据类型(字段不全，需要走接口获取完整数据)
      } else if (!$.isUndefined(data.vid) || !$.isUndefined(data.liveId)) {
        rst = 'partial';
      //原始数据(无需走接口，直接播放源地址)
      } else if (!$.isUndefined(data.src)) {
        rst = 'source';
      }
    }

    return rst;
  };

  //更新界面信息
  var updateUIInfo = function (player) {
    var cache = player.cache;

    if (!$.isUndefined(player.adv) && $.isFunction(player.adv.hideMediaView)) {
      player.adv.hideMediaView();
    }
    //标题
    player.$title.html(cache.title);
    //修改页面标题
    document.title = cache.title;
    //更新时间轴
    player.$ctrlCurTime.html($.formatSeconds(0));
    player.$ctrlDuration.html($.formatSeconds(cache.duration));
    player.$ctrlCurPlayedBar.css({width: 0});
    //更换海报
    player.changePoster({url: cache.poster});
  };

  //更新播放器对象信息
  var updatePlayerInfo = function (player, videoData) {
    player.trigger('loadedvideodata');
    //覆盖全局变量
    if (player.videoList.type === 'videoDataList') {
      var curVideoData = player.videoList.videoDataList[player.videoList.curIndex];
      videoData.timeLimit = curVideoData.timeLimit || '0';
    }
    window.videoData = videoData;

    //添加播放器内部数据对象
    player.cache = new LoadCacheData(player.config, videoData);

    //添加播放器数据对象
    player.videoData = $.extend({}, videoData);
    
    //如果第一次加载，添加dom节点，事件初始化
    if (player._firstLoadFlag) {
      //添加播放器模板
      player.$player.append(html5UI.makeVideoTmpl(player.cache));
      Console.log('加载dom完成, 耗时--->' + (Date.now() - ddvp.debug.playerLoadDomStartTime) / 1000);
      //初始化dom节点
      player._initDoms();
      //浏览器不支持播放
      if (player.$video.attr('data-nosupport') === 'noSupport') {
        var noteInfo = errorTypes['SUPPORT']['300'];

        player._showMsg({
          text: noteInfo,
          btns: {
            btnA: {
              text: '暂时无法播放'
            }
          }
        });

        return;
      }
      //修改dom加载完成标志位
      player._loadedDomFlag = true;
      //初始化事件
      player._initEvent();
      //初始化控制界面
      player._initControls();
      //初始化出错处理
      player._initException();
      //启动自动播放下一个视频的业务
      player._autoNextVideoService();
      //隐藏努力加载中的文字
      player.$loadingDesc.oriHide();

      if (player.$video.length > 0) {
        //声音设置
        player.videoTag.volume = player.config.volume;
        player.$ctrlDuration.html($.formatSeconds(player.cache.duration));
      }

    //更新界面信息
    } else {
      updateUIInfo(player);
    }
    
    //修改视频源
    player.setSrc(player.cache.curPlayUrl);
    //更新player对象duration属性
    player.duration = player.cache.duration;
    //给重置currentTime属性
    player.currentTime = 0;
    //隐藏加载中
    player._hideLoading();

    if (player.cache.autoplay) {
      //显示中间播放按钮
      //player._showMidPlayBtn();
      //隐藏中间播放按钮
      player.$midPlay.oriHide();
      //播放器加载就发送vv统计
      if (!player._sendVVFlag) {
        //加载播放器完成发送统计vv
        Console.log('统计: vv');
        player._sendVVFlag = true;
      }
      player._playOrPause('play');

    } else {
      player._playOrPause('pause');
      //隐藏主控界面
      player._hideMainCtrl();
      //显示中间播放按钮
      player._showMidPlayBtn();
      //显示海报
      player.showPoster();
      //如果UC,QQ切换片源时，先隐藏video标签，这样才能显示海报
      if (vars.IsUCBrowser || (vars.IsQQBrowser && !/QQBrowser\/4\.2/i.test(vars.UA))) {
        player.$video.oriHide();
      }
    }

    if (player._firstLoadFlag) {
      //全屏处理
      // if (!$.isUndefined(Action.URLGlobalParams.player)) {
      //   player._fullOrShrink('fullScreen');
      //   player._playOrPause('play');
      // }
    }
    Console.log('播放器加载时间:' + (Date.now() - ddvp.debug.playerLoadStartTime) / 1000 + '秒');

    if (!player._sendPlayDisplayCompleteFlag) {
      Console.log('发送行为统计点:(play_display_complete)');
      //发送行为统计点(数据加载完成)
      player._sendPlayDisplayCompleteFlag = true;
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 播放器视频切换
   * @type {function}
   * @param {object}   data                                - 数据对象
   */
  MediaPlayer.prototype.updateMedia = function (data, isAutoplay) {
    var _this = this;

    if (!$.isUndefined(data)) {
      //获取数据类型
      var dataType = getDataType(data);
      //部分和整体数据类型
      if (dataType !== 'error') {

        if (_this.videoData !== null) {
          //隐藏相关推荐内容
          _this.hideRecommend();

          if (_this.config.isShowRecommend) {
            
            if (dataType === 'source' && _this.videoData.video_src.indexOf(data.src) > -1) {
              //修改显示相关推荐标志位
              _this._showRecommendFlag = true;

              return;
            }
          }
        }
        
        //修改显示相关推荐标志位
        _this._showRecommendFlag = false;

        if (!_this._firstLoadFlag) {
          //更新播放器加载时间
          ddvp.debug.playerLoadStartTime = Date.now();
          //在iosqq浏览器中，无法捕获ended事件，这里在联播时候法从end统计
          // if (this._sendRealVVFlag && !this._sendEndFlag && (/QQBrowser\/5\./i.test(vars.UA) || vars.IsUCBrowser) && vars.IsIphone) {
          //更新视频时，如果没发ended统计，则补发
          if (this._sendRealVVFlag && !this._sendEndFlag) {
            Console.log('统计: ended');
            this._sendEndFlag = true;
          }
          //用vid切换视频源的时候强制转换成video_data类型(采用通过查vid来查找详细信息的方式)
          if (!$.isUndefined(this.videoData)) {
            
            this.config.data = this.videoData;
            this.config.dataType = 'video_data';
          }
          //重置标志位
          this._sendVVFlag = false;
          this._sendRealVVFlag = false;
          this._sendStartFlag = false;
          this._sendEndFlag = false;
          this._playByHistoryFlag = false;
          this._timeoutFlag = false;

          //如果没有配置参数
          if ($.isUndefined(this.config)) {
            //获取默认配置参数
            this.config = settings.initConfig({});
          }
          //重置数据
          data = $.extend({}, data);
          //更新自动播放
          if (typeof isAutoplay !== 'undefined') {
            this.config.autoplay = isAutoplay;
          }
          //暂停
          this._playOrPause('pause');

          if (!vars.IsBaiduBrowser) {
            //显示加载中
            this._showLoading();
          }
        }

        //需要从接口获取详细数据
        if (dataType === 'partial' || dataType === 'source') {
          this._getDataFlag = false;

          //超时
          setTimeout(function () {

            if (!_this._getDataFlag) {
              _this._timeoutFlag = true;
              _this._showMsg({
                text: errorTypes['REQUEST']['400'], //网络超时，请刷新重试
                btns: {
                  btnA: {
                    text: '刷新',
                    callback: function () {
                      _this._timeoutFlag = false;
                      _this._hideMsg();
                      _this.updateMedia(data, isAutoplay);
                    }
                  }
                }
              });
            }
          }, this._dataTimeout);
          ddvp.debug.playerLoadMediaDataStartTime = Date.now();

        //已经是完整数据，直接使用
        } else {

          updatePlayerInfo(_this, data);
        }
      //无效数据
      } else {
        _this._showMsg({text: errorTypes['PROCESS']['202']});
      }
    }
  };
 
});
;define('didi-component-ddplayer/player/poster.js', function(require, exports, module){ /**
 *
 *   @description: poster
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 海报
 *                 
 *
 */

    'use strict';
    
    var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
    /**
     * @class MediaPlayer
     * @classdesc 播放器海报业务
     * @property {function}  hidePoster         - 隐藏海报
     * @property {function}  showPoster         - 显示海报
     */

    /**
     * @memberof MediaPlayer.prototype
     * @summary 隐藏海报
     * @type {function}
     */
    MediaPlayer.prototype.hidePoster = function () {
        
        if (this.$posterCon.length > 0) {
            this.$posterCon.addClass('hidden');
        }
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 显示海报
     * @type {function}
     */
    MediaPlayer.prototype.showPoster = function () {
        
        if (this.$posterCon.length > 0) {
            this.$posterCon.removeClass('hidden');
        }
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 更换海报
     * @type {function}
     * @property {object}  poster         - 海报数据对象
     */
    MediaPlayer.prototype.changePoster = function (poster) {
        
        if (!poster || !poster.url) {
            
            return;
        }
        
        if (this.$posterCon.length > 0) {
            this.$posterCon.css({
                'background-image': 'url(' + poster.url + ');'
            });
        }
    };
 
});
;define('didi-component-ddplayer/player/message.js', function(require, exports, module){ /**
 *
 *   @description: message
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 消息提示弹窗
 *
 */

    'use strict';

    var vars = require('didi-component-ddplayer/base/vars.js');
    var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');

    /**
     * @class MediaPlayer
     * @classdesc 信息提示业务
     * @property {function}  _showMsg                        - (播放器内部使用) 创建/显示信息提示窗口
     * @property {function}  _hideMsg                        - (播放器内部使用) 隐藏信息提示窗口
     *
     * @example
     *   var player = require('./mediaPlayer.js');
     *
     */

    //合成样式
    var cusStyle = function (obj) {
        var cStyle = '';

        if (obj.background) {
            cStyle += 'background:' + obj.background + ';';
        }

        if (obj.color) {
            cStyle += 'color:' + obj.color + ';';
        }

        if (obj.fontSize) {
            cStyle += 'font-size:' + obj.fontSize + ';';
        }

        return cStyle;
    };

    //生成按钮HTML
    var createBtnHTML = function (btn, btnStyle, unit) {

        return '<a href="' + (btn.link ? btn.link : 'javascript:void(0);') + '" class="msg_btn_' + unit + ' msg_btn ' + (btn.ClassName ? btn.ClassName : '') + '" style="' + btnStyle + '">' + btn.text + '</a>';
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 隐藏信息提示窗口 (播放器内部使用)
     * @type {function}
     */
    MediaPlayer.prototype._hideMsg = function () {

        if (!this.$main || this.$main.length === 0) {
            this._initDoms();
        }
        //隐藏信息提示窗口
        this.$main.children('.message').hide();
        //显示控制界面
        this.$main.find('.player_main').length && this.$main.find('.player_main').show();
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 创建/显示信息提示窗口 (播放器内部使用)
     * @type {function}
     */
    MediaPlayer.prototype._showMsg = function (msgConf) {

        if (!this.$main || this.$main.length === 0) {
            this._initDoms();
        }
        //暂停播放
        this._pause();
        //隐藏loading
        this._hideLoading();
        //隐藏控制界面
        this.$main.find('.player_main').length && this.$main.find('.player_main').hide();

        var msgStyle, contHtml, btnsHtml, msgBoxHtml, btnAStyle, btnBStyle;
        msgStyle = btnsHtml = btnAStyle = btnBStyle = '';

        msgStyle = cusStyle(msgConf);

        //生成消息内容模板
        if (msgConf.dom) {
            contHtml = msgConf.dom;

        } else {
            contHtml = '<div class="msg_cont"><span class="msg">' + msgConf.text + '</span></div>';
        }

        //生成按钮组模板
        if (msgConf.btns) {

            if (msgConf.btns.btnA) {
                btnAStyle = cusStyle(msgConf.btns.btnA);
                btnsHtml += createBtnHTML(msgConf.btns.btnA, btnAStyle, "a");
            }

            if (msgConf.btns.btnB) {
                btnBStyle = cusStyle(msgConf.btns.btnB);
                btnsHtml += createBtnHTML(msgConf.btns.btnB, btnBStyle, "b");
            }

            if (btnsHtml !== '') {
                btnsHtml = '<div class="msg_btns">' + btnsHtml + '</div>';
            }
        }

        msgBoxHtml = '<div class="message ' + (msgConf.className ? msgConf.className : '') + '" style="' + msgStyle + '"><div class="inner_msg">' + contHtml + btnsHtml + '</div></div>';

        if (this.$main.children('.message').length) {
            this.$main.find('.message').empty().append('<div class="inner_msg">' + contHtml + btnsHtml + '</div>').attr('style', msgStyle).show();

        } else {
            this.$main.append(msgBoxHtml);
        }

        //注册按钮的点击事件,在事件处理程序中调用按钮数据中的callback方法，并将其this指针指向当前按钮
        if (msgConf.btns) {

            if (msgConf.btns.btnA && msgConf.btns.btnA.callback && $.isFunction(msgConf.btns.btnA.callback)) {
                this.$main.find('.message .msg_btn_a').on(vars.END_EVENT, function () {
                    msgConf.btns.btnA.callback.call(this);
                });
            }

            if (msgConf.btns.btnB && msgConf.btns.btnB.callback && $.isFunction(msgConf.btns.btnB.callback)) {
                this.$main.find('.message .msg_btn_b').on(vars.END_EVENT, function () {
                    msgConf.btns.btnB.callback.call(this);
                });
            }
        }

        //调用msgConf配置信息中的callback方法，可在其中为自定义dom中的元素绑定事件
        if (msgConf.callback && $.isFunction(msgConf.callback)) {
            msgConf.callback.call(this.$main.find('.message')[0]);
        }
    };
 
});
;define('didi-component-ddplayer/player/videoList.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于视频列表数据处理业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 视频列表数据处理业务
 *
 **/


  'use strict';
  
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器事件
   * @property {function}  _videoList                      - 视频列表数据处理
   */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 处理多视频业务
   * @type {function}
   * @param {object}   data                                - config.data数据对象
   */
  MediaPlayer.prototype._videoList = function (data) {

    if (!$.isUndefined(data)) {
      var videoList = {};
      //初始化vidList数据
      if (!$.isUndefined(data.vidList) && $.isArray(data.vidList)) {
        videoList.vidList = data.vidList;
        videoList.site = data.site || '1';
        videoList.curIndex = 0;
        videoList.type = 'vidList';
      //初始化vidList数据
      } else if (!$.isUndefined(data.videoDataList) && $.isArray(data.videoDataList)) {
        videoList.videoDataList = data.videoDataList;
        videoList.curIndex = 0;
        videoList.type = 'videoDataList';
      }
      return videoList;
    //无效数据
    } else {
      this._showMsg({text: errorTypes['PROCESS']['202']});

      return false;
    }
  };
 
});
;define('didi-component-ddplayer/player/exception.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于播放器出错处理
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器出错处理
 *
 */

  'use strict';

  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var util = require('didi-component-ddplayer/base/util.js');

  /**
  * @class MediaPlayer
  * @classdesc 播放器出错处理业务
  * @property {function}  _initException                  - (播放器内部使用) 初始化播放器错误处理业务
  * @property {function}  _sendException                  - (播放器内部使用) 发送播放出错统计
  */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 发送播放出错统计 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._sendException = function (option) {
    console.log('play error');
  };

  //播放出错处理
  var errorProcess = function (player) {

    // //屏蔽pc模拟手机ua时，不支持m3u8格式的错误
    // if (/Win32|Win64|Windows|Mac68K|MacPC|Macintosh|MacIntel/i.test(window.navigator.platform)) {

    //   return false;
    // }

    //2g3g出问题时不做处理
    if (/2g|3g/i.test(util.getConnectionType())) {

      return false;
    }

    var cache = player.cache;

    player._sendException({});
    //如果是m3u8视频源，直接播放下一视频
    if (vars.IsIOS) {
      player.trigger('ended');
    //如果是mp4,播放下一个分片
    } else if (vars.IsAndroid) {
      //播放下一条片源
      if (cache.curIndex < cache.totCounts) {
        //暂停当前片源
        player.pause();
        //显示loading图
        player._showLoading();
        //修改当前播放的url
        player.cache.curPlayUrl = player.cache.getNextUrl();
        //修改地址
        player.setSrc(player.cache.curPlayUrl);
        //修改播放索引
        cache.curIndex++;
        //播放
        player.play();
      //最后一条分片
      } else {
        player.trigger('ended');
      }
    }
  };

  //播放器报错
  var onError = function (player) {
    //播放出错
    player._addEvent('error', function () {
      errorProcess(player);
    });
  };

  //播放器出错中断
  var onAbort = function (player) {

    // player.on('abort', function () {
      
    //   // if (player.videoTag.error)
    // });
  };

  /**
  * @memberof MediaPlayer.prototype
  * @summary 初始化播放器错误处理业务 (播放器内部使用)
  * @type {function}
  */
  MediaPlayer.prototype._initException = function () {
    //播放器报错处理
    onError(this);
    //播放器中断
    onAbort(this);
  };
 
});
;define('didi-component-ddplayer/player/didiPlayer.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义整体播放器
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 整体播放器
 *                 
 *
 **/


  'use strict';

  //播放器事件
  require('didi-component-ddplayer/player/events.js');
  //播放器主控界面
  require('didi-component-ddplayer/player/controls.js');
  //播放器更新
  require('didi-component-ddplayer/player/update.js');
  //播放器更新
  require('didi-component-ddplayer/player/poster.js');
  //信息提示
  require('didi-component-ddplayer/player/message.js');
  //多视频数据处理业务
  require('didi-component-ddplayer/player/videoList.js');
  //播放器出错处理
  require('didi-component-ddplayer/player/exception.js');

  var vars = require('didi-component-ddplayer/base/vars.js');
  var Console = require('didi-component-ddplayer/base/console.js');
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var html5UI = require('didi-component-ddplayer/player/html5UI.js');
  var settings = require('didi-component-ddplayer/player/settings.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化方法
   * @type {function}
   * @param {object}   config                              - 播放器配置参数
   */
  MediaPlayer.prototype._init = function (config) {
    //隐藏主控界面计时器
    this._hideMainCtrlTime = null;
    //第一次加载
    this._firstLoadFlag = true;
    //数据请求超时时间
    this._dataTimeout = 5000;
    //是否需要限制相关推荐标志位
    this._showRecommendFlag = false;
    //是否发送vv标志位
    this._sendVVFlag = false;
    //合并配置参数
    this.config = settings.initConfig(config);
    //发送play_display_complete标志位
    this._sendPlayDisplayCompleteFlag = false;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 添加播放器
   * @type {function}
   * @param {object}   dom                                 - 要添加播放器的dom节点
   */
  MediaPlayer.prototype.htmlTo = function (dom) {
    dom = $(dom);

    if (dom.length > 0) {
      var _this = this;
      //缓存容器dom
      this.$parentDom = dom;
      //首次添加
      if ($.isUndefined(this.$player)) {
        ddvp.debug.playerLoadDomStartTime = Date.now();
        //添加背景loading图
        dom.html(html5UI.makeLoadingTmpl(this.config));
        Console.log('加载loading完成, 耗时--->' + (Date.now() - ddvp.debug.playerLoadDomStartTime) / 1000);
        //缓存player对象
        this.$player = $('#' + this.config.mainId);
        //缓存loading图对象
        this.$playerLoading = $('#' + this.config.mainId + ' .ddvp_player_loading');
        //重置标志位
        this._getDataFlag = false;

        var data = this.config.data;

        if (!$.isUndefined(data)) {
          //单视频处理,将单视频加工为一个只有videoData的数组
          if ($.isUndefined(data.vidList) && $.isUndefined(data.videoDataList)) {
            var tempData = {
              videoDataList: [data]
            };
            this.videoList = this._videoList(tempData);
            //更新视频
            this.updateMedia(data);
          //视频列表数据处理
          } else {
            var videoList = this.videoList = this._videoList(data);
            var curData;

            try {
              //vidList处理
              if (videoList.type === 'vidList') {
                curData = {
                  vid: videoList.vidList[videoList.curIndex],
                  site: videoList.site
                };
              //videoDataList处理
              } else {
                curData = videoList.videoDataList[videoList.curIndex];
              }

            } catch (e) {
              //数据错误

              _this._showMsg({text: errorTypes['PROCESS']['204']});
            }
            this.updateMedia(curData);
          }
          
        //数据无效
        } else {

          _this._showMsg({text: errorTypes['PROCESS']['202']});
        }
        
      //如果页面已经存在播放器，则移动播放器到指定dom中
      } else {
        this.$parentDom.html(this.$main);

        if (this.cache.autoplay) {
          this._playOrPause('play');
        }
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化dom节点
   * @type {function}
   */
  MediaPlayer.prototype._initDoms = function () {
    var mainId = '#' + this.config.mainId;
    //外围容器节点
    this.$main = $(mainId);
    //loading图
    this.$loading = $(mainId + ' .ddvp_player_loading');
    //loading说明
    this.$loadingDesc = $(mainId + ' .ddvp_player_loading_notice');
    //video标签$对象
    this.$video = $(mainId + ' #' + this.config.elemId);
    //video标签
    this.videoTag = $(mainId + ' #' + this.config.elemId)[0];
    //顶部通栏title标题容器节点
    this.$titleCon = $(mainId + ' .ddvp_title');
    //通栏标题内容节点
    this.$title = $(mainId + ' .ddvp_title_content');
    //海报容器
    this.$posterCon = $(mainId + ' .ddvp_poster');
    //右海报图
    this.$posterRight = $(mainId + ' .ddvp_poster_right');
    //中间播放按钮容器
    this.$mid = $(mainId + ' .ddvp_mid');
    //中间播放按钮
    this.$midPlay = $(mainId + ' .ddvp_mid_play');
    //中间快进快退容器
    this.$midRewindForwardCon = $(mainId + ' .ddvp_mid_rewind_forward');
    //中间快进快退时间
    this.$midTime = $(mainId + ' .ddvp_mid_time');
    //中间靠右测播放模式选择容器
    this.$midModeListCon = $(mainId + ' .ddvp_mid_mode');
    //当前选中播放类型按钮
    this.$mideCurModeBtn = $(mainId + ' .ddvp_mid_cur_mode_btn');
    //当前选中的播放模型
    this.$midCurMode = $(mainId + ' .ddvp_mid_cur_mode');
    //除了当前选中模式之外的所有可选模式列表
    this.$midModeList = $(mainId + ' .ddvp_mid_mod_list');
    //除了当前选中模式之外的所有可选模式列表
    this.$midModeLi = $(mainId + ' .ddvp_mid_mod_list li');
    //控制界面容器
    this.$ctrlCon = $(mainId + ' .ddvp_ctrl');
    //视频控制条
    this.$ctrlBar = $(mainId + ' .ddvp_ctrl_bar');
    //视频控制条-播放按钮
    this.$ctrlPlay = $(mainId + ' .ddvp_ctrl_play');
    //视频控制条-暂停按钮
    this.$ctrlPause = $(mainId + ' .ddvp_ctrl_pause');
    //视频控制条-缓冲进度
    this.$ctrlBuffer = $(mainId + ' .ddvp_ctrl_buffer');
    //视频控制条-打点容器
    this.$ctrlPointsCon = $(mainId + ' .ddvp_ctrl_points');
    //视频控制条-当前播放进度条
    this.$ctrlCurPlayedBar = $(mainId + ' .ddvp_ctrl_played_bar');
    //视频控制条-时间显示区域
    this.$ctrlTime = $(mainId + ' .ddvp_ctrl_time');
    //视频控制条-当前播放时间显示
    this.$ctrlCurTime = $(mainId + ' .ddvp_ctrl_cur_time');
    //视频控制条-总时长显示
    this.$ctrlDuration = $(mainId + ' .ddvp_ctrl_duration');
    //拖拽锚点
    this.$ctrlDragAnchor = $(mainId + ' .ddvp_ctrl_drag_anchor');
    //整体进度条
    this.$ctrlTrackBar = $(mainId + ' .ddvp_ctrl_track_bar');
    //全屏缩屏容器
    this.$ctrlScreen = $(mainId + ' .ddvp_ctrl_screen');
    //全屏
    this.$ctrlFullScreen = $(mainId + ' .ddvp_ctrl_full_screen');
    //缩屏
    this.$ctrlShrinkScreen = $(mainId + ' .ddvp_ctrl_shrink_screen');
    //遮罩层
    this.$maskLayer = $(mainId + ' .ddvp_mask_layer');
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 播放/暂停按钮点击事件
   * @type {function}
   * @param {object}   type                                - 操作类型play/pause
   */
  MediaPlayer.prototype._playOrPause = function (type) {
    var _this = this;
    ddvp.debug.playerPlayStartTime = Date.now();
    //清除消失动画计时器
    clearTimeout(this._hideMainCtrlTime);
    //显示主界面
    if (type === 'pause') {
      //暂停
      this._pause();

      if (vars.IsNewWindowsPhone) {
        //8.1之后的winphone需要延迟显示，否徐需要点击2次暂停按钮才能显示playbtn
        setTimeout(function () {
          //显示播放按钮
          _this._showPlayBtn();
        }, 300);
        
      } else {
        //显示播放按钮
        this._showPlayBtn();
      }
      //显示标题、控制条
      this._showMainCtrl();

    } else {
 
      //如果是baidu、iosQQ、iosUC点击播放直接发送统计vv，这几类播放器timeupdate无法正常触发timeupdate事件
      if (!this._sendVVFlag && (vars.IsBaiduBrowser || vars.IsBaiduBoxApp || (vars.IsIOS && (vars.IsQQBrowser || vars.IsUCBrowser)))) {
        //加载播放器完成发送统计vv
        Console.log('统计: vv');
        this._sendVVFlag = true;
      }

      //ios 的qq uc浏览器无法捕获事件，这里直接发送realvv
      if (!this._sendRealVVFlag && ((/QQBrowser\/5\./i.test(vars.UA) || vars.IsUCBrowser) && vars.IsIOS || ($.isUndefined(this.adv) || this.adv.isMediaPlayed) && vars.IsBaiduBoxApp)) {
        Console.log('统计: reallvv');
        this._sendRealVVFlag = true;
      }

      if (vars.IsUCBrowser || vars.IsQQBrowser) {
        this.$video.oriShow();
      }
      //播放
      if ((/UCBrowser\/9\./i.test(vars.UA) || vars.IsSonyPhone || vars.IsVivoPhone || vars.IsUCBrowser) && vars.IsAndroid) {
        
        setTimeout(function () {
          _this._play();
        }, 50);
      //window phone需要延迟300毫秒以上才能拉起播放器
      } else if (vars.IsWindowsPhone) {

        setTimeout(function () {
          _this._play();
        }, 300);
        //ios qq切换视频不能自动播放，增加延迟播放
      } else if (!this._firstLoadFlag && vars.IsIOS && vars.IsQQBrowser){
        
        setTimeout(function(){
          _this._play();
        },50);
        
      } else {
        this._play();
      }

      //记录播放时间戳
      this._startPlayTime = $.now();

      //如果没有任何操作，3秒后主操作界面隐藏
      this._hideMainCtrlTime = setTimeout(function () {
        _this._hideMainCtrl();
      }, 3000);

      //第一次加载时候不显示loading图
      if (this._firstLoadFlag) {

        if (!vars.IsIphone && !vars.IsBaiduBrowser && this.cache.autoplay) {
          this.$midPlay.oriShow();
          this._showPlayBtn();
          this.showPoster();
          // this.$ctrlBar.oriHide();
          // this.$midModeListCon.oriHide();
          // this.$titleCon.oriHide();
        }
        
        //显示loading图
        this._showLoading();
        //修改标志位
        this._firstLoadFlag = false;
      } else {
        //百度浏览器不支持timeupdate事件,所以showloading后无法消失
        if (vars.IsBaiduBrowser) {
          //隐藏loading图
          this._hideLoading();
        } else {
          //显示loading图
          this._showLoading();
        }
      }
      
      if (vars.IsOldWindowsPhone || vars.IsBaiduBrowser) {
        // this._showMidPlayBtn();
      }

      if (vars.IsIphone && (vars.IsUCBrowser || vars.IsQQBrowser || vars.IsWeiXinBrowser || vars.IsDiDiBrowser)) {
        this._showMainCtrl();
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 自动播放下一个片源
   * @type {function}
   * @param {object}   type                                - 操作类型play/pause
   */
  MediaPlayer.prototype._autoNextVideoService = function () {
    var _this = this;

    if (_this.config.isShowRecommend) {
      _this._showRecommendFlag = true;
      //继续播放下一个片源
      this.on('ended', function () {

        setTimeout(function () {

          if (_this._showRecommendFlag) {
            Console.log('显示相关推荐')
            var videoList = _this.videoList;
            var curIndex = videoList.curIndex;
            var nextVideo = null;
            //获取下一个需要播放的视频源
            if (videoList.type === 'vidList' && curIndex < videoList.vidList.length - 1) {
              videoList.curIndex++;

              nextVideo = {
                vid: videoList.vidList[videoList.curIndex],
                site: videoList.site
              };

            } else if (videoList.type === 'videoDataList' && curIndex < videoList.videoDataList.length - 1) {
              videoList.curIndex++;
              nextVideo = videoList.videoDataList[videoList.curIndex];
            }
            Console.log('nextVideo' + nextVideo);
            //播放下一条视频
            if (nextVideo !== null) {
              _this.updateMedia(nextVideo, true);
            //显示推荐列表
            } else {
              Console.log('showRecommend 11');
              _this.showRecommend();
            }
          }
        }, 800);
      });
    }
  };
  module.exports = MediaPlayer;
 
});
;define('ddplayer', function(require, exports, module){ /*
*
* @require didi-component-ddplayer/ddplayer.css
*
*
*
*/
(function () {
	//声明ddvp中debug变量
	window.ddvp = window.ddvp || {};
    window.ddvp.debug = {};
	var startTime = Date.now();
	ddvp.debug.playerLoadStartTime = startTime || 0;
	ddvp.debug.playerLoadScriptTime = startTime || 0;
	ddvp.debug.playerPlayStartTime = 0;
	ddvp.debug.playerLoadDomStartTime = 0;
	ddvp.debug.playerLoadAdDataStartTime = 0;
	ddvp.debug.playerLoadMediaDataStartTime = 0;
	ddvp.debug.isShowPlayerPlayStartTime = false;
})();
;
/*!
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 */
 
 window.ddvp = ( typeof  window.ddvp =='undefined' ) ? {} :  window.ddvp; 

!(function(global, undefined) { 
/**
 * 模板引擎
 * @name    template
 * @param   {String}            模板名
 * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
 * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
 */
var template = function (filename, content) {
    return typeof content === 'string'
    ?   compile(content, {
            filename: filename
        })
    :   renderFile(filename, content);
};
 
template.version = '3.0.0';


/**
 * 设置全局配置
 * @name    template.config
 * @param   {String}    名称
 * @param   {Any}       值
 */
template.config = function (name, value) {
    defaults[name] = value;
};



var defaults = template.defaults = {
    openTag: '<%',    // 逻辑语法开始标签
    closeTag: '%>',   // 逻辑语法结束标签
    escape: true,     // 是否编码输出变量的 HTML 字符
    cache: true,      // 是否开启缓存（依赖 options 的 filename 字段）
    compress: false,  // 是否压缩输出
    parser: null      // 自定义语法格式器 @see: template-syntax.js
};


var cacheStore = template.cache = {};


/**
 * 渲染模板
 * @name    template.render
 * @param   {String}    模板
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
template.render = function (source, options) {
    return compile(source, options);
};


/**
 * 渲染模板(根据模板名)
 * @name    template.render
 * @param   {String}    模板名
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
var renderFile = template.renderFile = function (filename, data) {
    var fn = template.get(filename) || showDebugInfo({
        filename: filename,
        name: 'Render Error',
        message: 'Template not found'
    });
    return data ? fn(data) : fn;
};


/**
 * 获取编译缓存（可由外部重写此方法）
 * @param   {String}    模板名
 * @param   {Function}  编译好的函数
 */
template.get = function (filename) {

    var cache;
    
    if (cacheStore[filename]) {
        // 使用内存缓存
        cache = cacheStore[filename];
    } else if (typeof document === 'object') {
        // 加载模板并编译
        var elem = document.getElementById(filename);
        
        if (elem) {
            var source = (elem.value || elem.innerHTML)
            .replace(/^\s*|\s*$/g, '');
            cache = compile(source, {
                filename: filename
            });
        }
    }

    return cache;
};


var toString = function (value, type) {

    if (typeof value !== 'string') {

        type = typeof value;
        if (type === 'number') {
            value += '';
        } else if (type === 'function') {
            value = toString(value.call(value));
        } else {
            value = '';
        }
    }

    return value;

};


var escapeMap = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};


var escapeFn = function (s) {
    return escapeMap[s];
};

var escapeHTML = function (content) {
    return toString(content)
    .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
};


var isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]';
};


var each = function (data, callback) {
    var i, len;        
    if (isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
            callback.call(data, data[i], i, data);
        }
    } else {
        for (i in data) {
            callback.call(data, data[i], i);
        }
    }
};


var utils = template.utils = {

	$helpers: {},

    $include: renderFile,

    $string: toString,

    $escape: escapeHTML,

    $each: each
    
};/**
 * 添加模板辅助方法
 * @name    template.helper
 * @param   {String}    名称
 * @param   {Function}  方法
 */
template.helper = function (name, helper) {
    helpers[name] = helper;
};

var helpers = template.helpers = utils.$helpers;




/**
 * 模板错误事件（可由外部重写此方法）
 * @name    template.onerror
 * @event
 */
template.onerror = function (e) {
    var message = 'Template Error\n\n';
    for (var name in e) {
        message += '<' + name + '>\n' + e[name] + '\n\n';
    }
    console.log(message); 
};


// 模板调试器
var showDebugInfo = function (e) {

    template.onerror(e);
    
    return function () {
        return '{Template Error}';
    };
};


/**
 * 编译模板
 * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
 * @name    template.compile
 * @param   {String}    模板字符串
 * @param   {Object}    编译选项
 *
 *      - openTag       {String}
 *      - closeTag      {String}
 *      - filename      {String}
 *      - escape        {Boolean}
 *      - compress      {Boolean}
 *      - debug         {Boolean}
 *      - cache         {Boolean}
 *      - parser        {Function}
 *
 * @return  {Function}  渲染方法
 */
var compile = template.compile = function (source, options) {
    
    // 合并默认配置
    options = options || {};
    for (var name in defaults) {
        if (options[name] === undefined) {
            options[name] = defaults[name];
        }
    }


    var filename = options.filename;


    try {
        
        var Render = compiler(source, options);
        
    } catch (e) {
    
        e.filename = filename || 'anonymous';
        e.name = 'Syntax Error';

        return showDebugInfo(e);
        
    }
    
    
    // 对编译结果进行一次包装

    function render (data) {
        
        try {
            
            return new Render(data, filename) + '';
            
        } catch (e) {
            
            // 运行时出错后自动开启调试模式重新编译
            if (!options.debug) {
                options.debug = true;
                return compile(source, options)(data);
            }
            
            return showDebugInfo(e)();
            
        }
        
    }
    

    render.prototype = Render.prototype;
    render.toString = function () {
        return Render.toString();
    };


    if (filename && options.cache) {
        cacheStore[filename] = render;
    }

    
    return render;

};




// 数组迭代
var forEach = utils.$each;


// 静态分析模板变量
var KEYWORDS =
    // 关键字
    'break,case,catch,continue,debugger,default,delete,do,else,false'
    + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
    + ',throw,true,try,typeof,var,void,while,with'

    // 保留字
    + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
    + ',final,float,goto,implements,import,int,interface,long,native'
    + ',package,private,protected,public,short,static,super,synchronized'
    + ',throws,transient,volatile'

    // ECMA 5 - use strict
    + ',arguments,let,yield'

    + ',undefined';

var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
var SPLIT_RE = /[^\w$]+/g;
var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
var BOUNDARY_RE = /^,+|,+$/g;
var SPLIT2_RE = /^$|,+/;


// 获取变量
function getVariable (code) {
    return code
    .replace(REMOVE_RE, '')
    .replace(SPLIT_RE, ',')
    .replace(KEYWORDS_RE, '')
    .replace(NUMBER_RE, '')
    .replace(BOUNDARY_RE, '')
    .split(SPLIT2_RE);
}


// 字符串转义
function stringify (code) {
    return "'" + code
    // 单引号与反斜杠转义
    .replace(/('|\\)/g, '\\$1')
    // 换行符转义(windows + linux)
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n') + "'";
}


function compiler (source, options) {
    
    var debug = options.debug;
    var openTag = options.openTag;
    var closeTag = options.closeTag;
    var parser = options.parser;
    var compress = options.compress;
    var escape = options.escape;
    

    
    var line = 1;
    var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};
    


    var isNewEngine = ''.trim;// '__proto__' in {}
    var replaces = isNewEngine
    ? ["$out='';", "$out+=", ";", "$out"]
    : ["$out=[];", "$out.push(", ");", "$out.join('')"];

    var concat = isNewEngine
        ? "$out+=text;return $out;"
        : "$out.push(text);";
          
    var print = "function(){"
    +      "var text=''.concat.apply('',arguments);"
    +       concat
    +  "}";

    var include = "function(filename,data){"
    +      "data=data||$data;"
    +      "var text=$utils.$include(filename,data,$filename);"
    +       concat
    +   "}";

    var headerCode = "'use strict';"
    + "var $utils=this,$helpers=$utils.$helpers,"
    + (debug ? "$line=0," : "");
    
    var mainCode = replaces[0];

    var footerCode = "return new String(" + replaces[3] + ");"
    
    // html与逻辑语法分离
    forEach(source.split(openTag), function (code) {
        code = code.split(closeTag);
        
        var $0 = code[0];
        var $1 = code[1];
        
        // code: [html]
        if (code.length === 1) {
            
            mainCode += html($0);
         
        // code: [logic, html]
        } else {
            
            mainCode += logic($0);
            
            if ($1) {
                mainCode += html($1);
            }
        }
        

    });
    
    var code = headerCode + mainCode + footerCode;
    
    // 调试语句
    if (debug) {
        code = "try{" + code + "}catch(e){"
        +       "throw {"
        +           "filename:$filename,"
        +           "name:'Render Error',"
        +           "message:e.message,"
        +           "line:$line,"
        +           "source:" + stringify(source)
        +           ".split(/\\n/)[$line-1].replace(/^\\s+/,'')"
        +       "};"
        + "}";
    }
    
    
    
    try {
        
        
        var Render = new Function("$data", "$filename", code);
        Render.prototype = utils;

        return Render;
        
    } catch (e) {
        e.temp = "function anonymous($data,$filename) {" + code + "}";
        throw e;
    }



    
    // 处理 HTML 语句
    function html (code) {
        
        // 记录行号
        line += code.split(/\n/).length - 1;

        // 压缩多余空白与注释
        if (compress) {
            code = code
            .replace(/\s+/g, ' ')
            .replace(/<!--[\w\W]*?-->/g, '');
        }
        
        if (code) {
            code = replaces[1] + stringify(code) + replaces[2] + "\n";
        }

        return code;
    }
    
    
    // 处理逻辑语句
    function logic (code) {

        var thisLine = line;
       
        if (parser) {
        
             // 语法转换插件钩子
            code = parser(code, options);
            
        } else if (debug) {
        
            // 记录行号
            code = code.replace(/\n/g, function () {
                line ++;
                return "$line=" + line +  ";";
            });
            
        }
        
        
        // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
        // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
        if (code.indexOf('=') === 0) {

            var escapeSyntax = escape && !/^=[=#]/.test(code);

            code = code.replace(/^=[=#]?|[\s;]*$/g, '');

            // 对内容编码
            if (escapeSyntax) {

                var name = code.replace(/\s*\([^\)]+\)/, '');

                // 排除 utils.* | include | print
                
                if (!utils[name] && !/^(include|print)$/.test(name)) {
                    code = "$escape(" + code + ")";
                }

            // 不编码
            } else {
                code = "$string(" + code + ")";
            }
            

            code = replaces[1] + code + replaces[2];

        }
        
        if (debug) {
            code = "$line=" + thisLine + ";" + code;
        }
        
        // 提取模板中的变量名
        forEach(getVariable(code), function (name) {
            
            // name 值可能为空，在安卓低版本浏览器下
            if (!name || uniq[name]) {
                return;
            }

            var value;

            // 声明模板变量
            // 赋值优先级:
            // [include, print] > utils > helpers > data
            if (name === 'print') {

                value = print;

            } else if (name === 'include') {
                
                value = include;
                
            } else if (utils[name]) {

                value = "$utils." + name;

            } else if (helpers[name]) {

                value = "$helpers." + name;

            } else {

                value = "$data." + name;
            }
            
            headerCode += name + "=" + value + ",";
            uniq[name] = true;
            
            
        });
        
        return code + "\n";
    }
};  
template.parseTpl = function( str, data ) {
    var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
            str.replace( /\\/g, '\\\\' )
            .replace( /'/g, '\\\'' )
            .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
            } )
            .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                return '\');' + code.replace( /\\'/, '\'' )
                        .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
            } )
            .replace( /\r/g, '\\r' )
            .replace( /\n/g, '\\n' )
            .replace( /\t/g, '\\t' ) +
            '\');}return __p.join("");',

        /* jsbint evil:true */
        func = new Function( 'obj', tmpl ); 
    return data ? func( data ) : func;
}
 
var oldTemplate;
if( typeof global.template === 'function' ) {
    oldTemplate = global.template;

}else{
    global.template = template;
}

// RequireJS && SeaJS
if (typeof define === 'function') {
    define(function() {
        return template;
    });

}else if (typeof define === 'function') {
    define(function() {
        return template;
    });

// NodeJS
} else if (typeof exports !== 'undefined') {
    module.exports = template;

}   

 
})(ddvp);;
;(function($){
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
  // make available to unit tests
  $.__detect = detect

})(Zepto);
;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    clearProperties = {}

  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-'
      eventPrefix = event
      return false
    }
  })

  clearProperties[prefix + 'transition-property'] =
  clearProperties[prefix + 'transition-duration'] =
  clearProperties[prefix + 'transition-timing-function'] =
  clearProperties[prefix + 'animation-name'] =
  clearProperties[prefix + 'animation-duration'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration
    if (duration) duration = duration / 1000
    return this.anim(properties, duration, ease, callback)
  }

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd
    if (duration === undefined) duration = 0.4
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssProperties[prefix + 'animation-name'] = properties
      cssProperties[prefix + 'animation-duration'] = duration + 's'
      endEvent = $.fx.animationEnd
    } else {
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) {
          transforms || (transforms = [])
          transforms.push(key + '(' + properties[key] + ')')
        }
        else cssProperties[key] = properties[key]

      if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ')
      if (!$.fx.off && typeof properties === 'object') {
        cssProperties[prefix + 'transition-property'] = Object.keys(properties).join(', ')
        cssProperties[prefix + 'transition-duration'] = duration + 's'
        cssProperties[prefix + 'transition-timing-function'] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, arguments.callee)
      }
      $(this).css(clearProperties)
      callback && callback.call(this)
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    setTimeout(function() {
      that.css(cssProperties)
      if (duration <= 0) setTimeout(function() {
        that.each(function(){ wrappedCallback.call(this) })
      }, 0)
    }, 0)

    return this
  }

  testEl = null
})(Zepto);
//     Zepto.Extend.js 实现了通用fn方法。 
 /**
 * @file 平台特性检测
 * @name detect
 * @short detect
 * @desc 扩展zepto中对browser的检测
 * @import zepto.js
 */
;(function($, navigator ,undefined) {
    
    /**
     * @name $.browser
     * @desc 扩展zepto中对browser的检测
     *
     * **可用属性**
     * - ***qq*** 检测qq浏览器
     * - ***uc*** 检测uc浏览器, 有些老版本的uc浏览器，不带userAgent和appVersion标记，无法检测出来
     * - ***baidu*** 检测baidu浏览器
     * - ***version*** 浏览器版本 
     */ 

    var ua = navigator.userAgent,
        br = $.browser,
        detects = {
            wx: /WeixinJSBridge|MicroMessenger\/([\d.]+)/i,
            qq: /MQQBrowser\/([\d.]+)/i,
            uc: /UCBrowser\/([\d.]+)/i,
            miui: /MiuiBrowser\/([\d.]+)/i,
            baidu: /baidubrowser\/.*?([\d.]+)/i
        },
        ret;

    $.each( detects, function( i, re ) {
        
        if ( (ret = ua.match( re )) ) {
            br[ i ] = true;
            br.version = ret[ 1 ];

            // 终端循环
            return false;
        }
    } );

    // uc还有一种规则，就是appVersion中带 Uc字符
    if ( !br.uc && /Uc/i.test( navigator.appVersion ) ) {
        br.uc = true;
    }

})( Zepto, window.navigator );

/**
 * @name fix
 * @grammar fix(options) => self
 * @desc 固顶fix方法，对不支持position:fixed的设备上将元素position设为absolute，
 * 在每次scrollstop时根据opts参数设置当前显示的位置，类似fix效果。
 *
 * Options:
 * - ''top'' {Number}: 距离顶部的px值
 * - ''left'' {Number}: 距离左侧的px值
 * - ''bottom'' {Number}: 距离底部的px值
 * - ''right'' {Number}: 距离右侧的px值
 * @example
 * var div = $('div');
 * div.fix({top:0, left:0}); //将div固顶在左上角
 * div.fix({top:0, right:0}); //将div固顶在右上角
 * div.fix({bottom:0, left:0}); //将div固顶在左下角
 * div.fix({bottom:0, right:0}); //将div固顶在右下角
 *
 */

;(function ($, undefined) {
	var doc = window.document, docElem = document.documentElement, win=window; 
    var fix_ext = {
        fix: function(opts) {
            var me = this;                      //如果一个集合中的第一元素已fix，则认为这个集合的所有元素已fix，
            if(me.attr('isFixed')) return me;   //这样在操作时就可以针对集合进行操作，不必单独绑事件去操作
            me.css(opts).css('position', 'fixed').attr('isFixed', true);
            var buff = $('<div style="position:fixed;top:10px;"></div>').appendTo('body'),
                top = buff[0].getBoundingClientRect().top,
                checkFixed = function() {
                    if(window.pageYOffset > 0) {
                        if(buff[0].getBoundingClientRect().top !== top) {
                            me.css('position', 'absolute');
                            doFixed();
                            $(window).on('scrollStop', doFixed);
                            $(window).on('ortchange', doFixed);
                        }
                        $(window).off('scrollStop', checkFixed);
                        buff.remove();
                    }
                },
                doFixed = function() {
                    me.css({
                        top: window.pageYOffset + (opts.bottom !== undefined ? window.innerHeight - me.height() - opts.bottom : (opts.top ||0)),
                        left: opts.right !== undefined ? document.body.offsetWidth - me.width() - opts.right : (opts.left || 0)
                    });
                    opts.width == '100%' && me.css('width', document.body.offsetWidth);
                };

            $(window).on('scrollStop', checkFixed);

            return me;
        }
    };
    $.extend($.fn, fix_ext );
    $.extend($, fix_ext );
   
	/**
     
     * 返回值MediaQueryList对象包含的属性<br />
     * - ***matches*** 是否满足query<br />
     * - ***query*** 查询的css query，类似\'screen and (orientation: portrait)\'<br />
     * - ***addListener*** 添加MediaQueryList对象监听器，接收回调函数，回调参数为MediaQueryList对象<br />
     * - ***removeListener*** 移除MediaQueryList对象监听器<br /> 
     *
     * @method $.matchMedia
     * @grammar $.fn.matchMedia(query)  ⇒ MediaQueryList
     * @param {String} query 查询的css query，类似\'screen and (orientation: portrait)\'
     * @return {Object} MediaQueryList
     * @example
     * $.matchMedia('screen and (orientation: portrait)').addListener(fn);
     */
    $.matchMedia = (function() {
        var mediaId = 0,
            cls = 'media-detect',
            transitionEnd = $.fx.transitionEnd,
            cssPrefix = $.fx.cssPrefix,
            $style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: absolute; clip: rect(1px, 1px, 1px, 1px);}\n').appendTo('head');

        return function (query) {
            var id = cls + mediaId++,
                $mediaElem,
                listeners = [],
                ret;

            $style.append('@media ' + query + ' { #' + id + ' { width: 1px; } }\n') ;   //原生matchMedia也需要添加对应的@media才能生效

            // 统一用模拟的，时机更好。
            // if ('matchMedia' in window) {
            //     return window.matchMedia(query);
            // }

            $mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>')
                .appendTo('body')
                .on(transitionEnd, function() {
                    ret.matches = $mediaElem.width() === 1;
                    $.each(listeners, function (i,fn) {
                        $.isFunction(fn) && fn.call(ret, ret);
                    });
                });

            ret = {
                matches: $mediaElem.width() === 1 ,
                media: query,
                addListener: function (callback) {
                    listeners.push(callback);
                    return this;
                },
                removeListener: function (callback) {
                    var index = listeners.indexOf(callback);
                    ~index && listeners.splice(index, 1);
                    return this;
                }
            };

            return ret;
        };
    })();

  //扩展常用media query
  $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
  };
  //通过matchMedia派生转屏事件
  $.matchMedia($.mediaQuery.ortchange).addListener(function () {
        $(window).trigger('ortchange');
  });

   
	/**
	*   highlight
	 *  @file 实现了通用fn方法。
	 *  @name Highlight
	 *  @desc 点击高亮效果
	 *  @import zepto.js
	 */ 
     var $doc = $( document ),
        $el,    // 当前按下的元素
        timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时
    // 负责移除className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );

        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @name highlight
     * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
     * 当不传入className是，此操作将解除事件绑定。
     * 
     * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
     * @grammar  highlight(className, selector )   ⇒ self
     * @grammar  highlight(className )   ⇒ self
     * @grammar  highlight()   ⇒ self
     * @example var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// 把所有a的自带的高亮效果去掉。
     */
    $.fn.highlight = function( className, selector ) {
        return this.each(function() {
            var $this = $( this );

            $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                    .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                        this )) && match.length && match : $this;

                // selctor可能找不到元素。
                if ( $el ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };
    /**
	 * @file 减少对方法、事件的执行频率，多次调用，在指定的时间内只会执行一次
     * ```
     * ||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
     * X    X    X    X    X    X      X    X    X    X    X    X
     * ```
     * 
     * @method $.fn.throttle
     * @grammar $.fn.throttle(delay, fn) ⇒ function
     * @param {Number} [delay=250] 延时时间
     * @param {Function} fn 被稀释的方法
     * @param {Boolean} [debounce_mode=false] 是否开启防震动模式, true:start, false:end
     * @example var touchmoveHander = function(){
     *     //....
     * }
     * //绑定事件
     * $(document).bind('touchmove', $.fn.throttle(250, touchmoveHander));//频繁滚动，每250ms，执行一次touchmoveHandler
     *
     * //解绑事件
     * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.fn.throttle返回的function, 当然unbind那个也是一样的效果
     *
     */
    $.fn.throttle = function(delay, fn, debounce_mode) {
            var last = 0,
                timeId; 
            if (typeof fn !== 'function') {
                debounce_mode = fn;
                fn = delay;
                delay = 250;
            }

            function wrapper() {
                var that = this,
                    period = Date.now() - last,
                    args = arguments;

                function exec() {
                    last = Date.now();
                    fn.apply(that, args);
                };

                function clear() {
                    timeId = undefined;
                };

                if (debounce_mode && !timeId) {
                    // debounce模式 && 第一次调用
                    exec();
                }

                timeId && clearTimeout(timeId);
                if (debounce_mode === undefined && period > delay) {
                    // throttle, 执行到了delay时间
                    exec();
                } else {
                    // debounce, 如果是start就clearTimeout
                    timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                }
            };
            // for event bind | unbind
            wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
            return wrapper;
     };

    /**
     * @desc 减少执行频率, 在指定的时间内, 多次调用，只会执行一次。
     * **options:**
     * - ***delay***: 延时时间
     * - ***fn***: 被稀释的方法
     * - ***t***: 指定是在开始处执行，还是结束是执行, true:start, false:end
     *
     * 非at_begin模式
     * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
     *                         X                                X</code>
     * at_begin模式
     * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
     * X                                X                        </code>
     *
     * @grammar $.fn.debounce(delay, fn[, at_begin]) ⇒ function
     * @name $.fn.debounce
     * @example var touchmoveHander = function(){
     *     //....
     * }
     * //绑定事件
     * $(document).bind('touchmove', $.fn.debounce(250, touchmoveHander));//频繁滚动，只要间隔时间不大于250ms, 在一系列移动后，只会执行一次
     *
     * //解绑事件
     * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.fn.debounce返回的function, 当然unbind那个也是一样的效果
     */
    $.fn.debounce=function(delay, fn, t) {
        return fn === undefined ? $.fn.throttle(250, delay, false) : $.fn.throttle(delay, fn, t === undefined ? false : t !== false);
    };
   

    //todo 待统一解决后退事件触发问题
    $(win).on('pageshow', function (e) {
        //如果是从bfcache中加载页面，为了防止多次注册，需要先off掉
        e.persisted && $(win).off('touchstart', backEventOffHandler).one('touchstart', backEventOffHandler);
    });

     /**
     * 解析模版str。当data未传入时返回编译结果函数；当需要多次解析时，建议保存编译结果函数，然后调用此函数来得到结果。
     * 
     * @method $.fn.parseTpl 
     * @param {String} tplstr 模板
     * @param {Object} data 数据
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'ajean'};
     * console.log($.fn.parseTpl(tplstr, data)); // => <p>ajean</p>
     */
    $.fn.parseTpl = function( tplstr, data ) {
        var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                tplstr.replace( /\\/g, '\\\\' )
                .replace( /'/g, '\\\'' )
                .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                    return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                } )
                .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                    return '\');' + code.replace( /\\'/, '\'' )
                            .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                } )
                .replace( /\r/g, '\\r' )
                .replace( /\n/g, '\\n' )
                .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

            /* jsbint evil:true */
            func = new Function( 'obj', tmpl );
        
        return data ? func( data ) : func;
    };

    var extFun = { 
        highlight : $.fn.highlight,
        throttle : $.fn.throttle,
        debounce : $.fn.debounce,
        parseTpl : $.fn.parseTpl,

          /**
         * @namespace $
         * @property {function} oriHide                   - 显示dom元素
         * @desc zepto中的show hide已被重写，这里还原原先的show hide方法
         */
        oriShow: function() {
          this.css({display: 'block'});

          return this;
        },

        /**
         * @namespace $
         * @property {function} oriHide                   - 隐藏dom元素
         * @desc zepto中的show hide已被重写，这里还原原先的show hide方法
         */
        oriHide: function() {
          this.css({display: 'none'});

          return this;
        },
        /**
         * @namespace $
         * @property {function} htmlLog                   - 添加日志
         */
        htmlLog: function (param1, param2) {

            if ($('#js_htmlLog').length === 0) {
                $('body').append($('<div id="js_htmlLog" style="height: 200px;overflow: scroll;"></div>'));
            }
            var arr = [];
            
            if (!$.isUndefined(param1)) {
                arr.push('<span>' + param1 + '</span>');
            }

            if (!$.isUndefined(param2)) {
                arr.push('<span>' + param2 + '</span>');
            }

            $('#js_htmlLog').prepend(arr.join(' ') + '<br>');
        },

        /**
         * @namespace $
         * @property {function} noop                      - 空函数
         */
          noop: function () {},

          /**
         * @namespace $
         * @property {function} blankFun                  - 空函数
         */
          blankFun: function () {},
          
          /**
         * @namespace $
         * @property {function} isString                  - 是否是字符串
         * @param {string} val
         * @returns {boolean}
         */
          isString: function (val) {
          
          return $.type(val) === 'string';
          },

          /**
         * @namespace $
         * @property {function} isUndefined                - 是否是字符串
         * @return {boolean}
         */
          isUndefined: function (val) {
          
             return typeof val === 'undefined';
          },

          isNumber: function (val) {

            return $.type(val) === 'number';
          },
          isEmpty:function (obj){ 
              if (obj == null) return true; 
              if (obj.length > 0)    return false;
              if (obj.length === 0)  return true;
              for (var key in obj) {
                if (hasOwnProperty.call(obj, key) || obj[key] !== null)  return false; 
              }  
              return true; 
          },
          isArray: function (val) {

            return ((!$.isUndefined(val)) && (val instanceof Array));
          },
          //对象非添加型合并
          merge: function (a, b) {

            for (var i in a) {

                if (!$.isUndefined(b[i])) {
                    a[i] = b[i];
                }
            }

            return a;
          },
        isScript : function ( filename ) {
            filename = filename || '';
            return !!/\.js(?=[\?#]|$)/i.exec( filename );
        },

        isCss : function ( filename ) {
            filename = filename || '';
            return !!/\.css(?=[\?#]|$)/i.exec( filename );
        },  
        isRegExp : function ( o ) {
            return o &&  Object.prototype.toString.call( o ) === '[object RegExp]';
        },
        now: function () { return new Date().getTime(); },
        nowDataString : function() {
            var dt = new Date();
            var dm = String((dt.getMonth() + 1) >= 12 ? 12 : (dt.getMonth() + 1));
            if (dm.length < 2) {
                dm = '0' + dm;
            }
            var dd = String(dt.getDate());
            if (dd.length < 2) {
                dd = '0' + dd;
            }
            var dh = String(dt.getHours());
            if (dh.length < 2) {
                dh = '0' + dh;
            }
            var dmi = String(dt.getMinutes());
            if (dmi.length < 2) {
                dmi = '0' + dmi;
            }
            var dse = String(dt.getSeconds());
            if (dse.length < 2) {
                dse = '0' + dse;
            }
            var dtstr = " " + dt.getFullYear() + '' + dm + '' + dd + ' ' + dh + ':' + dmi + ':' + dse;
            return dtstr;
        },
        getISOTimeFormat: function () {
          var date = new Date(),
            y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate(),
            h = date.getHours(),
            M = date.getMinutes(),
            s = date.getSeconds();
          
          return [[y, m < 10 ? "0" + m : m, d < 10 ? "0" + d : d].join("-"), [h < 10 ? "0" + h : h, M < 10 ? "0" + M : M, s < 10 ? "0" + s : s].join(":")].join(" ");
        },
        
        formatSeconds: function (seconds) {
            seconds = parseInt(seconds);
            var M = parseInt(seconds / 60),
                h = M >= 60 ? parseInt(M / 60) : 0,
                s = seconds % 60,
                str = "";
            M >= 60 && (M = M % 60);
            if (h > 0) {
                str += h < 10 ? "0" + h : h;
                str += ":";
            }
            str += M < 10 ? "0" + M : M;
            str += ":";
            str += s < 10 ? "0" + s : s;
            
            return str;
        },
        getHost: function () {
            var _host = window.location.hostname || window.location.host,
                _sarray = location.host.split(".");
            if (_sarray.length > 1) {
                _host = _sarray.slice(_sarray.length - 2).join(".");
            }
            return _host;
        },
        getUrlParam: function (p, u) {
            u = u || document.location.toString();
            var reg = new RegExp("(^|&|\\\\?)" + p + "=([^&]*)(&|$|#)"),
                r = null;
            if (r = u.match(reg)) return r[2];
            return "";
        },
            
        filterXSS: function (str) { 
            if (!$.isString(str)) return str;
            str=str.replace(/</g, "&lt;");
            str=str.replace(/>/g, "&gt;");
            str=str.replace(/\"/g, "&quot;"); 
            str=str.replace(/\'/g, "&apos;");  
            return str;    
        } ,
            
        //32 guid
        createGUID: function (len) {
            len = len || 32;
            var guid = "";
            for (var i = 1; i <= len; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
            }
            return guid; 
        },
        formatSize: function (size) {
            var s = "" + size;
            if (s.indexOf("%") > 0) return s;
            if (s.indexOf("px") > 0) return s;
            if (/^\d+$/.test(s)) return s + "px";
            return s;
        }
    };
    $.extend($, extFun); 
    $.extend($.fn, extFun);
   

})( Zepto );
;; 

/**
 *
 *   @description: 该文件用于对全局变量ddvp和播放器的整体定义
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 基础工具类定义
 *
 **/

    /**
     * @summary 全局视频业务对象
     * @namespace ddvp
     * @global
     */
    window.ddvp = window.ddvp || {};
    var Console = require('didi-component-ddplayer/base/console.js');
    var didiPlayer = require('didi-component-ddplayer/player/didiPlayer.js');
    // var ClickTrace = require('trace.click');


    /**
     * @summary 全局视频业务对象
     * @namespace didiPlayer
     * @global
     */
    ddvp.didiPlayer = {
        //播放器个数
        maxId: 1
    };

    /**
     * @namespace didiPlayer
     * @method didiPlayer.ready
     * @example
     *   didiPlayer.ready(function (DiDiPlayer) {
   *       var player = new DiDiPlayer(settings);
   *    });
     * @property {function} ready                         - 播放器模块加载完成方法
     * @param {function} callback                  - 播放器模块加载完成回调方法
     */
    ddvp.didiPlayer.ready = function (callback) {
        Console.log('发送行为统计点:(ddPlayer_display)');

        $(document).ready(function () {
      
            if ($.isFunction(callback)) {
                callback(didiPlayer);
            }
        });
    };

    module.exports = ddvp.didiPlayer;
    module.exports.vars = require('didi-component-ddplayer/base/vars.js');
 
});
;define('page/fellow/main.js', function(require, exports, module){ /**
 *
 *   @description: 页面播放器生成
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-09-02
 *
 *   @update-date: 2015-09-02
 *
 *   @update-log :
 *                 1.0.1 - 页面播放器生成
 *
 */

'use strict';

var ddplayer = require('ddplayer');
var bridge = require('didibridge');
var vars = ddplayer.vars;
// var DidiMonitor = require('didimonitor');
var _send = DidiMonitor.sendBeatles;
var wxsharedidi = require('wxsharedidi');
var init = function() {
	ddplayer.ready(function(Player) {
		// var shareLink = location.href.replace(/[?&](token|phone)=[^&]+/g, '');
		var shareLink = location.href.replace(/[?#].*/g,"");
		var playerMaker = {
			param: {
				//播放器容器id
				playerConId: 'playerWrap',
				playerConfig: {
					//视频数据 
					data: window.videoData || {},
					//是否自动播放
					autoplay: false
				},
				//body bg container
				clsBodyBg: 'js_body_bg',
				clsBodyBgPlayed: 'js_body_bg_played',
				//猛戳Get button class
				clsBtnGet: 'js_power_get',
				//分享button id
				idBtnShare: 'btnShare',
				isPlayed: false,
				//横竖屏 layer
				idWrongLayer: 'wrongLayer',
				shareConfig: {
					share_url: shareLink,                   
			        share_img_url: 'http://static.xiaojukeji.com/pinche/release/page/fellow/images/share_a5c4cec.png',                      
			        share_icon_url: 'http://static.xiaojukeji.com/pinche/release/page/fellow/images/share_a5c4cec.png',                      
			        share_title: '2016第一支暖心视频，送给过年回家的你',       
			        share_content: '没有一种感情比亲情更浓烈，没有一种温暖比得上回家过年。2016第一支暖心视频，送给过年回家的你！',
			        weibo_desc: '没有一种感情比亲情更浓烈，没有一种温暖比得上回家过年。2016第一支暖心视频，送给过年回家的你！快戳→（http://t.cn/Rb1OCOl）'  
				}
			},
			model: {
				//播放器对象
				player: null
			},
			view: {},
			ctrl: {}
		};

		var p = playerMaker.param,
			m = playerMaker.model,
			v = playerMaker.view,
			c = playerMaker.ctrl;

		//参数检查和初始化
		p.init = function() {

			if (!$.isFunction(Player)) {

				return false;
			}

			if ($('#' + p.playerConId).length === 0) {

				return false;
			}
		
			return true;
		};
		m.initEntranceConfig = function(){
			p.entranceConfig =  {
				    entrance: {
				        icon: "http://static.xiaojukeji.com/api/img/i-webview-entrance.png"
				    },
				    buttons: [{
				        type: "share_weixin_timeline",
				        name: "分享到微信朋友圈",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "share_weixin_appmsg",
				        name: "分享给微信好友",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "share_sina_weibo",
				        name: "分享到新浪微博",
				        data: $.extend({}, p.shareConfig, {
				            share_content: p.shareConfig.weibo_desc || p.shareConfig.desc
				        }),
				        callback: function() {}
				    }, {
				        type: "share_qq_appmsg",
				        name: "分享给QQ好友",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "share_qzone",
				        name: "分享到QQ空间",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "page_refresh",
				        name: "刷新"
				    }]
				};
		};
		//业务初始化
		c.init = function() {

			//参数检查和初始化
			if (p.init()) {
				//声明播放器
				window.ddplayer = m.player = new Player(p.playerConfig);
				p.$btnGet = $('.' + p.clsBtnGet);
				p.$btnShare = $('#' + p.idBtnShare);
				p.$wrongLayer = $('#' + p.idWrongLayer);
				//事件初始化
				c.eventInit();
				//生成播放器
				m.player.htmlTo($('#' + p.playerConId));

				if(vars.IsDiDiBrowser){
					m.initEntranceConfig();
					bridge.initEntrance(p.entranceConfig);
					bridge.showEntrance();
					p.$btnShare.show();
				}
				//有些机型键盘出来会缩小webview高度，会导致页面错乱，初始化就给body设置成clientHeight
				$('body').css('height', $(window).height());
				//统计
				
				$(window).bind('load',function(){
					_send('sfc-video-160129_index_sw',null,true);
				});
				
			}
		};

		//事件初始化
		c.eventInit = function() {
			var cp = c.process;
			//开始播放 更改body背景
			m.player.on('play', function(){
				
				if(!p.isPlayed){
					//通过添加class改变body背景
					$('body').addClass('played');
					//隐藏猛戳Get button
					p.$btnGet.hide();
					//改变标识为
					p.isPlayed = true;
					_send('sfc-video-160129_index_ck',null,true);
				}

			});
			m.player.on('pause',function(){
				// console.log('pause');
			})
			//猛戳get 播放
			p.$btnGet.on(vars.END_EVENT, function(){
				if(m.player){
					m.player.$midPlay.trigger(vars.END_EVENT);
				}
			});
			//播放结束逻辑
			m.player.on('ended', function() {
				cp.ended();

				return false;
			});
			//分享
			cp.share();
			//横竖屏
			cp.orient();
		};

		//事件处理
		c.process = {};

		//播放结束处理
		c.process.ended = function() {
			p.isPlayed = false;
		};
		//分享
		c.process.share = function(){
			
			p.$btnShare.on(vars.END_EVENT, function(){
				bridge && bridge.invokeEntrance();
				_send('sfc-video-160129_share_ck',null,true);
			});
			wxsharedidi.initWxShare(p.shareConfig);
		};
		//横竖屏处理
		c.process.orient = function(){
			$(window).bind('orientationchange', function(e){
				if (window.orientation == 0 || window.orientation == 180) {
				    p.$wrongLayer.hide();
				    $('html').removeClass('orientation');
				}
				else if ((window.orientation == 90 || window.orientation == -90) && !p.isPlayed) {
				    p.$wrongLayer.show();
				}else{
					// m.player.$ctrlFullScreen.trigger('click');//此处用click会失效
					m.player.$ctrlFullScreen.trigger(vars.END_EVENT);
					$('html').addClass('orientation');
				}
			});
		};
		c.init();
	});
};
init(); 
});