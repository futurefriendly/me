define("didi-component-ddplayer/base/vars.js",function(e,i,o){"use strict";var s={};window.DiDiVideoJSBridge=window.DiDiVideoJSBridge||{},s.ENABLE_DEBUG=!1,s.IS_HISTORY_SUPPORT="pushState"in history,s.UA=window.navigator.userAgent;var r=function(){var e=1;try{e=void 0!==window.screen.systemXDPI&&void 0!==window.screen.logicalXDPI&&window.screen.systemXDPI>window.screen.logicalXDPI?window.screen.systemXDPI/window.screen.logicalXDPI:void 0!==window.devicePixelRatio?window.devicePixelRatio:window.devicePixelRatio,e=parseFloat(e)||1}catch(i){}return e};s.PixelRatio=r(),s.IsAndroid=!(!/Android|HTC|Adr/i.test(s.UA)&&!(window.navigator.platform+"").match(/Linux/i)),s.IsIpad=!s.IsAndroid&&/iPad/i.test(s.UA),s.IsIpod=!s.IsAndroid&&/iPod/i.test(s.UA),s.IsIphone=!s.IsAndroid&&/iPod|iPhone/i.test(s.UA),s.IsIOS=s.IsIpad||s.IsIphone,s.IsWindowsPhone=/Windows Phone/i.test(s.UA),s.IsOldWindowsPhone=/Windows\sPhone\s([1234567]\.|8\.0)/i.test(s.UA),s.IsNewWindowsPhone=s.IsWindowsPhone&&!s.IsOldWindowsPhone,s.IsWindowsPad=/Windows\sPad/i.test(s.UA),s.IsWindows=/Windows/i.test(s.UA),s.IsVivoPhone=/vivo/i.test(s.UA),s.ScreenSizeCorrect=1,s.IsAndroid&&(window.screen.width/window.innerWidth).toFixed(2)===s.PixelRatio.toFixed(2)&&(s.ScreenSizeCorrect=1/s.PixelRatio),s.AdrPadRegex=/pad|XiaoMi\/MiPad|lepad|MediaPad|GT-P|SM-T|GT-N5100|sch-i800|Nexus\s7|Nexus\s8|Nexus\s11|Kindle Fire HD|Tablet/i,s.ScreenSize=Math.floor(window.screen.width*s.ScreenSizeCorrect)+"x"+Math.floor(window.screen.height*s.ScreenSizeCorrect);var t=function(){var e=1,i=!1,o=s.ScreenSizeCorrect||1,r=Math.floor(window.screen.width*o),t=Math.floor(window.screen.height*o),d=1;try{e=parseFloat(Math.sqrt(r*r+t*t)),d=parseFloat(e/(160*s.PixelRatio))}catch(n){}if("ontouchstart"in window&&s.IsAndroid)if(/mobile/i.test(s.UA))i=!1;else{var a=!!s.AdrPadRegex.test(s.UA);a?i=!0:!i&&(e>=2500||d>7.8)&&(i=!0)}return i};s.IsAndroidPad=t(),s.IsIEBrowser=!!document.all&&("Win32"===navigator.platform||"Win64"===navigator.platform||"Windows"===navigator.platform),s.IsSafariBrowser=!(!s.UA.match(/Safari/i)||s.IsAndroid),s.IsChromeBrowser=!(!s.UA.match(/Chrome/i)||s.IsAndroid),s.IsWeiXinBrowser=!(!window.WeixinJSBridge&&!/MicroMessenger/i.test(s.UA)),s.IsDiDiBrowser=!(!window.DidiJSBridge&&!/didi.passenger/.test(s.UA)),s.IsWeiBoBrowser=/weibo/.test(s.UA.toLowerCase()),s.IsQQBrowser=!!/MQQBrowser/i.test(s.UA),s.IsUCBrowser=!!/UCBrowser/i.test(s.UA),s.IsOldUCBrowser=!!/UCBrowser\/([1-9]\..*|10\.[01].*)/i.test(s.UA),s.IsNewUCBrowser=s.IsUCBrowser&&!s.IsOldUCBrowser,s.IsMiBrowser=!!/MiuiBrowser/i.test(s.UA),s.IsBaiduBrowser=!!/baidubrowser/i.test(s.UA),s.IsBaiduBoxApp=!!/baiduboxapp/i.test(s.UA),s.IsOldBaiduBrowser=!!/baidubrowser\/([01234]\..*|5\.[0123456]\..*|5\.7\.[012])/i.test(s.UA),s.IsNewBaiduBrowser=s.IsBaiduBrowser&&!s.IsOldBaiduBrowser,s.IsTouch="ontouchstart"in window;var d=function(){var e=s.UA,i=e.match(/MQQBrowser\/(\d+\.\d+)/i),o=e.match(/QQ\/(\d+\.(\d+)\.(\d+)\.(\d+))/i),r=e.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/)||e.match(/MicroMessenger\/((\d+)\.(\d+))/),t=e.match(/MiuiBrowser\/(\d+\.\d+)/i),d=e.match(/UCBrowser\/(\d+\.\d+(\.\d+\.\d+)?)/)||e.match(/\sUC\s/),n=e.match(/IEMobile(\/|\s+)(\d+\.\d+)/),a=e.match(/(ipod\sOS)\s([\d_]+)/),w=0/0;return window.ActiveXObject?(w=6,(window.XMLHttpRequest||e.indexOf("MSIE 7.0")>-1)&&(w=7),(window.XDomainRequest||e.indexOf("Trident/4.0")>-1)&&(w=8),e.indexOf("Trident/5.0")>-1&&(w=9),e.indexOf("Trident/6.0")>-1&&(w=10)):e.indexOf("Trident/7.0")>-1&&(w=11),a&&(w=a[2].replace(/_/g,".")),i&&(w=i[1]),o&&(w=o[1]),r&&(w=r[1]),t&&(w=t[1]),d&&(w=d[1]||0/0),!i||window.mtt&&window.mtt.getBrowserParam||!s.IsAndroid||(w="9.6.0"),n&&(w=n[2]),w};s.BrowserVersion=d();var n=function(){var e=s.UA,i=0/0;if($.os&&$.os.version)i=$.os.version;else{var o=e.match(/Web[kK]it[\/]{0,1}([\d.]+)/),r=e.match(/(Android);?[\s\/]+([\d.]+)?/),t=e.match(/(iPad).*OS\s([\d_]+)/),d=e.match(/(iPod)(.*OS\s([\d_]+))?/),n=!t&&e.match(/(iPhone\sOS)\s([\d_]+)/),a=e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),w=e.match(/Kindle\/([\d.]+)/),c=e.match(/(BlackBerry).*Version\/([\d.]+)/),I=e.match(/(BB10).*Version\/([\d.]+)/),h=e.match(/(RIM\sTablet\sOS)\s([\d.]+)/);o&&(i=o[1]),r&&(i=r[2]),n&&!d&&(i=n[2].replace(/_/g,".")),t&&(i=t[2].replace(/_/g,".")),d&&(i=d[3]?d[3].replace(/_/g,"."):null),a&&(i=a[2]),c&&(i=c[2]),I&&(i=I[2]),h&&(i=h[2]),w&&(i=w[1])}return i};s.OsVersion=n(),s.IsMIOne=/MI-ONE/i.test(s.UA),s.IsXiaoMI=/MI/i.test(s.UA),s.IsVivoPhone=/vivo/i.test(s.UA),s.IsSonyPhone=/Sony/i.test(s.UA),s.IsSAMSUNG=/SAMSUNG/i.test(s.UA),s.IsSAMSUNGNote3=/SAMSUNG SM-N90/i.test(s.UA),s.START_EVENT=s.IsTouch?"touchstart":"mousedown",s.MOVE_EVENT=s.IsTouch?"touchmove":"mousemove",s.END_EVENT=s.IsTouch?"touchend":"mouseup",s.CANCEL_EVENT=s.IsTouch?"touchcancel":"mouseup",s.RESIZE_EVENT="onorientationchange"in window?"orientationchange":"resize",s.IsHistorySupport="pushState"in history,o.exports=s,window.ddvp.VARS=s});