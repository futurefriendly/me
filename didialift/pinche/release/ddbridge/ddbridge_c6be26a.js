define("ddbridge/ddbridge.js",function(i,a,e){e.exports=window.Didibridge=function(){};var r=["callbackImageLiteratureReviewTakeCamera","callbackImageLiteratureReviewPhotoLibrary","callbackImageLiteratureReview"];Didibridge.uploadImage=function(i,e,t,l){if("function"!=typeof e)throw"must supply callback function";if(void 0===l)throw"must supply upload url";var d;switch(t){case"camera":d=r[0];break;case"library":d=r[1];break;default:d=r[2]}var c={data:i,url:l};n(function(i){var r=i;a.callHandler&&(r=a),r.callHandler(d,JSON.stringify(c),function(i){e(i)})})},e.exports.updateDriverAuth=function(i,a){a=a||function(){},n(function(e){return $.isEmptyObject(i)?a("params is empty"):(e.callHandler("hideProgressHUD",null),e.callHandler("callbackDriverAuthFinished",JSON.stringify(i)),void a(null))})};var n=function(i){var a=function(){l(DidiJSBridge),i(DidiJSBridge)};window.DidiJSBridge?a():document.addEventListener("DidiJSBridgeReady",a,!1)},t=!1,l=function(i){if(t===!1){if(t=!0,navigator.userAgent.match(/iphone/i))return i.init&&i.init({});a.callHandler=function(a,e,n){var t,l=Array.prototype.slice.call(arguments,0);if(r.indexOf(a)>-1){if(t="didibridge"+~~(1e6*Math.random()),window[t]=function(){window[t]=void 0,n.apply(null,arguments)},l[2]=void 0,"string"==typeof l[1]){var e=JSON.parse(l[1]);e.callback=t}l[1]=JSON.stringify(e),i.callHandler(l[0],l[1])}else i.callHandler.apply(i,l)}}}});