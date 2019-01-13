var docuH = document.documentElement.clientHeight,
    docuW = document.documentElement.clientWidth,
    html = document.getElementsByTagName('html')[0];
var num = docuW / 320;
html.style.fontSize = 12 * num + "px";
var currentFontSize = 12 * num + "px";

var navig = window.navigator.userAgent;
/*添加class*/
var addClass = function(obj, sClass) {
    var re = new RegExp('\\b' + sClass + '\\b');
    if (!re.test(obj.className)) {
        obj.className += obj.className ? ' ' + sClass : sClass;
        //看原来obj有没有class,第一种可能,原来有class，就需要再添加之前加上空格，没有class，就直接添加
    }
};

/*
@@判断当前环境是否微信
@@return [Boolean]
*/
var isWeixin = function() {
    if (navig.indexOf('MicroMessenger') != -1) return true;
    else return false;
};

/*
@@判断当前环境是否QQ浏览器
@@微信安卓版用的QQX5浏览器内核，所以UA中会有QQ字符，单纯用QQ去判断会不准确
@@return [Boolean]
*/
var isQQBrowser = function() {
    if (navig.toLowerCase().indexOf("qq") != -1 && !isWeixin()) return true;
    return false;
};

/*
@@判断当前环境是否安卓webview
@@return [Boolean]
*/
var isAndroid = function() {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    return isAndroid;
};

/*
@@判断当前环境是否IOS webview
@@return [Boolean]
*/
var isIos = function() {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    var isIOS = u.indexOf('iPhone') > -1; //ios终端
    return isIOS;
};

/*
@@获取字符串的长度，汉字为2个字符
@@return [int]
*/
var getStringLength = function(str) {
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
function innerText(obj, text) {
    if (navig.toLowerCase().indexOf("firefox") != -1) {
        obj.textContent = text;
    } else {
        obj.innerText = text;
    }
}

/*
@@截取字符串长度，汉字算2个字符
@@return [string]+'...'
*/
var subString = function(str, len) {
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
function browserRedirect() {
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
}


/*
@@将html的<>标签转义为 &lt; &gt;
@@如果文本中带有<>的标签，用innerHTML方法写到页面上时，<>会被浏览器渲染成html标签，如果用innerText会原样显示在页面上
*/
function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g, function(c) {
        return {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }[c];
    });
}


/*
@@获取url中的参数
*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return "";
}


/*
@@替换url中的特殊字符
@@param [String] [按钮跳转url]
@@param [String] [url需要替换的特殊字符]
@@param [String] [替换特殊字符的值]
*/
function replaceTemplate(url, template, value) {
    if (url.indexOf(template) != -1 && value) {
        url = url.replace(template, value);
    }
    return url;
}


/*
@@动态加载js
@@param [sScriptSrc] [js url]
@@param [cb] [function 回调函数]
*/
function loadScript(sScriptSrc, callback) {
    //gets document head element
    var oHead = document.getElementsByTagName('head')[0];
    if (oHead) {
        //creates a new script tag
        var oScript = document.createElement('script');

        //adds src and type attribute to script tag
        oScript.setAttribute('src', sScriptSrc);
        oScript.setAttribute('type', 'text/javascript');

        //calling a function after the js is loaded (IE)
        var loadFunction = function() {
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                callback();
            }
        };
        oScript.onreadystatechange = loadFunction;

        //calling a function after the js is loaded (Firefox)
        oScript.onload = callback;

        //append the script tag to document head element
        oHead.appendChild(oScript);
    }
}

/*
@@微信获取网络状态
@@param [callback]
@@return [] [//2g, 3g, 4g, wifi, ethernet, unknown]
*/
function getNetworkType_Weixin(cb) {
    wx.getNetworkType({
        success: function(res) {
            // 返回网络类型2g，3g，4g，wifi
            //return (res.networkType);
            (cb && typeof(cb) === "function") && cb(res.networkType);
        },
        fail: function(res) {
            // 返回"unknown"
            (cb && typeof(cb) === "function") && cb("unknown");
        }
    });
}

/*
@@是否是移动设备
@@param []
@@return [] 
*/
function isMobile(){
    var a = navigator.userAgent || navigator.vendor || window.opera;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
        return true;
    }
    return false;
}

/*
@@普通获取网络状态，不一定支持
@@param []
@@return [] [//2g, 3g, 4g, wifi, ethernet, unknown]
*/
function getNetworkType_Common() {
    var connection = window.navigator.connection || window.navigator.mozConnection || navigator.webkitConnection || null;
    var type_text = ['unknown', 'ethernet', 'wifi', '2g', '3g', '4g', 'none'];
    var net = "unknown";
    if (connection === null) {
        net = "unknown";
    // old-api: "metered"
    } else if ('metered' in connection) {
        if (typeof(connection.bandwidth) == "number") {
            if (connection.bandwidth > 10) {
                net = 'wifi';
            } else if (connection.bandwidth > 2) {
                net = '3g';
            } else if (connection.bandwidth > 0) {
                net = '2g';
            } else if (connection.bandwidth == 0) {
                net = 'none';
            } else {
                net = 'unknown';
            }
        } else {
            net = 'unknown';
        }
    // new-api
    } else {
        if (typeof(connection.type) == "number") {
            //大部分浏览器返回一个int型的类型
            net = type_text[connection.type];
        } else if (connection.type == "?") {
            net = "unknown";
        } else {
            net = connection.type;
        }
    }
    return net;
}

/*
@@获取网络状态
@@param [callback]
@@return [] [//2g, 3g, 4g, wifi, ethernet, unknown]
*/
function getNetworkType(cb) {
    if (isWeixin) {
        getNetworkType_Weixin(cb);
    } else {
        var net = getNetworkType_Common();
        (cb && typeof(cb) === "function") && cb(net);
    }
}

/*
@@高速网络
@@param [callback]
@@return [][//true or false]
*/
function highBandWidth(cb) {
    getNetworkType(function(t){
        (cb && typeof(cb) === "function") && cb((t == "4g" || t == "wifi") ? true : false);
    });
}
    
