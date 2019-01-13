define('ddbridge/ddbridge.js', function(require, exports, module){

module.exports = window.Didibridge = function(){

};

var takePhotoIncantation = [
	'callbackImageLiteratureReviewTakeCamera',
	'callbackImageLiteratureReviewPhotoLibrary',
	'callbackImageLiteratureReview'
]

Didibridge.uploadImage = function(data, cb, take, url){
	if(typeof cb !== 'function') {
		throw 'must supply callback function';
	}
	if(url === undefined){
		throw 'must supply upload url';
	}
	var fnName;
	switch(take){
		case 'camera':
			fnName = takePhotoIncantation[0];
			break;
		case 'library':
			fnName = takePhotoIncantation[1];
			break;
		default:
			fnName = takePhotoIncantation[2];
	}
	var params = {
		data: data,	
		//上传地址
		url: url
	};	

	connectDidiJSBridge(function(DidiJSBridge){
        var bridge = DidiJSBridge;
        if( exports.callHandler ){
        	bridge = exports;
        }
		bridge.callHandler(
		    fnName,
			JSON.stringify(params),
			function(data){
				cb(data);
			}
		);	

	});
}


// 连接DidiJSBridge
var connectDidiJSBridge = function(callback) {

	var onDidiJSBridgeReady = function(){
		initDidiJSBridge(DidiJSBridge);
        callback(DidiJSBridge);
	}

    if (window.DidiJSBridge) {
    	onDidiJSBridgeReady();
    } else {
        document.addEventListener('DidiJSBridgeReady', onDidiJSBridgeReady, false);
    }
};

var isIninted = false;
var initDidiJSBridge = function(DidiJSBridge){
	if(isIninted === false){
		isIninted = true;

		// iPhone 
		if( navigator.userAgent.match(/iphone/i) ){
			return DidiJSBridge.init && DidiJSBridge.init({});
		}
		// Android
		//overwrite callHandler
		exports.callHandler = function(fnName, opt, callback){
			var callbackName;
			var args = Array.prototype.slice.call(arguments, 0);
			if( 
				takePhotoIncantation.indexOf(fnName) > -1
			){
				callbackName = 'didibridge' + ~~(Math.random() * 1e6);
				window[callbackName] = function(){
					window[callbackName] = undefined;
					callback.apply(null, arguments);
				};
				args[2] = undefined;
				if( typeof args[1] === 'string'){
					var opt = JSON.parse( args[1] );	 
					opt.callback = callbackName;
				}
				args[1] = JSON.stringify(opt);
				opt.callback = callbackName;
				DidiJSBridge.callHandler(args[0], args[1]);
			}else{
				DidiJSBridge.callHandler.apply(DidiJSBridge, args);
			}
		};

	}
}






});