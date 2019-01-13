define('upload/main.js', function(require, exports, module){

var ImgUpload = require('upload/upload.js');
new ImgUpload(second, {
	// url: 'http://test.diditaxi.com.cn/pinche/native/picUpload',
	url: '/output/upload.php',
	filekey:'file',
	
	outputHeight: 500,
	outputWidth: 800,
	onSuccessUpload: function(response){
		response = JSON.parse(response);
		second.style.backgroundImage = 'url('+ response.img +')';
	},
	onCancelUpload: function(){
	},
	onFailedUpload: function(){
		
	}
});

});