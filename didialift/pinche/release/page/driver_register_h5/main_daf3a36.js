define('page/driver_register_h5/main.js', function(require, exports, module){

var ImgUpload = require('upload/upload.js');
/*
new ImgUpload(first, {
	// url: 'http://test.diditaxi.com.cn/pinche/native/picUpload',
	url: '/output/upload.php',
	filekey:'file',
	onSuccessUpload: function(response){
		// response = JSON.parse(response);
		first.style.backgroundImage = 'url('+ response.img +')';
	}	
});
*/
new ImgUpload(second, {
	// url: 'http://test.diditaxi.com.cn/pinche/native/picUpload',
	url: '/output/upload.php',
	filekey:'file',
	
	outputHeight: 100,
	outputWidth: 100,
	onSuccessUpload: function(response){
		response = JSON.parse(response);
		second.style.backgroundImage = 'url('+ response.img +')';
	}	
});
/*
new ImgUpload(third, {
	// url: 'http://test.diditaxi.com.cn/pinche/native/picUpload',
	url: '/output/upload.php',
	filekey:'file',
	onSuccessUpload: function(response){
		// response = JSON.parse(response);
		third.style.backgroundImage = 'url('+ response.img +')';
	}	
});


*/

});