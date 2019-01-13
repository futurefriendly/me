define('didi-component-ddplayer/base/vars.js', function(require, exports, module){ /**
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