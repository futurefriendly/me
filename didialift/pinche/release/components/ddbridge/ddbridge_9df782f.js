define("ddbridge",function(i,e,n){var a,r=navigator.userAgent.match(/android/i),t=function(){r&&(a=i("ddbridge/javainsert.js"),a.init())};n.exports=window.Didibridge=function(){};var o=["callbackImageLiteratureReviewTakeCamera","callbackImageLiteratureReviewPhotoLibrary","callbackImageLiteratureReview"],d=function(i){var e=function(){c(DidiJSBridge),i(DidiJSBridge)};window.DidiJSBridge?e():document.addEventListener("DidiJSBridgeReady",e,!1)},l=!1,c=function(i){if(l===!1){if(l=!0,navigator.userAgent.match(/iphone/i))return i.init&&i.init({});e.callHandler=function(e,n,a){var r,t=Array.prototype.slice.call(arguments,0);if(o.indexOf(e)>-1){if(r="didibridge"+~~(1e6*Math.random()),window[r]=function(){window[r]=void 0,a.apply(null,arguments)},t[2]=void 0,"string"==typeof t[1]){var n=JSON.parse(t[1]);n.callback=r}t[1]=JSON.stringify(n),window.DidiJSBridge.callHandler(t[0],t[1])}else window.DidiJSBridge.callHandler.apply(i,t)}}};Didibridge.uploadImage=function(i,n,a){if("function"!=typeof n)throw"must supply callback function";if(void 0===i.url)throw"must supply upload url";var r;switch(a){case"camera":r=o[0];break;case"library":r=o[1];break;default:r=o[2]}var l=$.extend({data:{}},i);t(),d(function(i){var a=i;e.callHandler&&(a=e),a.callHandler(r,JSON.stringify(l),function(i){n(i)})})},n.exports.updateDriverAuth=function(i,e){e=e||function(){},d(function(n){return $.isEmptyObject(i)?e("params is empty"):(n.callHandler("hideProgressHUD",null),n.callHandler("callbackDriverAuthFinished",JSON.stringify(i)),void e(null))})};var u=function(){var i="";return navigator.userAgent.match(/(Android)/i)?i="android":navigator.userAgent.match(/(iPhone|iPod|ios|iPad)/i)&&(i="ios"),i};n.exports.getAppVersion=function(i){d(function(e){var n=u();if("undefined"!=typeof e){if("android"==n){var a=JSON.parse(e.callHandler("getSystemInfo"));i(a.appversion)}"ios"==n&&e.callHandler("getSystemInfo",JSON.stringify(""),function(e){var n=JSON.parse(e);i(n.appversion)})}})},n.exports.getToken=function(i){d(function(e){var n=u();if("undefined"!=typeof e){if("android"==n){var a=JSON.parse(e.callHandler("getUserInfo"));i(a.token)}"ios"==n&&e.callHandler("getUserInfo",JSON.stringify(""),function(e){var n=JSON.parse(e);i(n.token)})}})}});