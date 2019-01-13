define("upload/upload.js",function(t,e,i){var o=t("upload/imgcliper.js"),n=[/UCBrowser\/10\.6\.0\.620/i],a=i.exports=function(t,e){for(var i=0;i<n.length;i++)n[i].exec(navigator.userAgent)&&alert("发现您当前使用的浏览器上传图片有故障。\n请尝试更换浏览器访问本页");var o="iframepost"+Math.floor(1e3*Math.random()),a=e.filekey||"file";this.opt=$.extend({outputWidth:500,outputHeight:500,data:{}},e),this.$el=t,this.fileInput=document.createElement("INPUT"),this.form=document.createElement("FORM"),this.iframe=document.createElement("IFRAME"),this.fileInput.name=a,this.fileInput.type="file",this.fileInput.setAttribute("accept","image/*"),this.fileInput.style.cssText="position: absolute;left:0;top:0;height:100%;width:100%; opacity: 0",this.form.target=o,this.form.method="POST",this.form.encoding="multipart/form-data",this.form.action=e.url,"undefined"==typeof FileReader&&(alert("非常抱歉，您的手机不支持文件上传，请更换手机注册，谢谢"),this.iframe.style.display="none",this.iframe.name=o,document.body.appendChild(this.iframe)),this.form.appendChild(this.fileInput),t.appendChild(this.form),this.register()};a.prototype={register:function(){var t=this;this.fileInput.addEventListener("change",function(e){t.onFileChange(e)},!1),this.iframe&&this.iframe.addEventListener("load",function(){t.onsuccess(this.contentWindow.document.body.innerHTML)},!1)},onFileChange:function(t){function e(t){t=void 0===t?!0:t,i.showLoading();var e=Math.max(Math.max(i.opt.outputWidth,i.opt.outputHeight),100);canvasResize(o,{width:e,height:e,crop:!1,quality:80,rotate:0,callback:function(e,o,n){i.closeLoading(),t?i.clip(e,o,n):(i.showLoading(),i.compress({dataURL:data},function(t){i.upload(t)}),i.fileInput.value="")}})}var i=this,o=t.target.files[0];if(void 0!==o){var n=t.target.value.match(/\.(png|jpg|jpeg|gif)$/i)[1];this.fileInfo={ext:n,type:o.type,name:o.name,size:o.size},i.opt.onFileSelect?i.opt.onFileSelect(t,e):e()}},clip:function(t,e,i){var n=this,a={clipWidth:n.opt.outputWidth,clipHeight:n.opt.outputHeight,originHeight:i,originWidth:e,fileType:n.fileInfo.type,rawData:t,onSave:function(t){n.showLoading(),n.compress({dataURL:t},function(t){n.upload(t)}),n.fileInput.value=""},onCancel:function(){n.fileInput.value="",n.opt.onCancelUpload&&n.opt.onCancelUpload()}};this.imgCliper&&this.imgCliper.destroy(),this.imgCliper=new o(a)},compress:function(t,e){var i=this;canvasResize(t,{fileType:i.fileInfo.type,width:i.opt.outputWidth,height:i.opt.outputHeight,crop:!1,quality:80,rotate:0,callback:function(t){e(t)}})},upload:function(t){var e=this,i=new FormData;i.append("file",t),i.append("type",e.fileInfo.type),i.append("size",e.fileInfo.size),i.append("filename",e.fileInfo.name),i.append("ext",e.fileInfo.ext),$.each(e.opt.data,function(t,e){i.append(t,e)}),i.append("filename",e.fileInfo.name+~~(1e6*Math.random()));var o=new XMLHttpRequest;o.open("POST",e.opt.url,!0),o.setRequestHeader("X-Requested-With","XMLHttpRequest"),o.setRequestHeader("pragma","no-cache"),o.upload.addEventListener("progress",function(t){t.lengthComputable;Math.ceil(t.loaded/t.total*100)},!1),o.onreadystatechange=function(){4===o.readyState&&(clearTimeout(n),200===o.status?e.onUploadSuccess(o.responseText):e.uploadFailed(o.responseText))};var n=setTimeout(function(){o.abort(),e.uploadFailed("timeout")},e.opt.timeout||2e4);o.send(i)},onUploadSuccess:function(t){this.imgCliper.close(),this.closeLoading(),this.opt.onSuccessUpload&&this.opt.onSuccessUpload(t)},uploadFailed:function(){this.opt.onFailedUpload&&this.opt.onFailedUpload()},showLoading:function(){window.dd&&window.dd.dialog&&window.dd.dialog.loading("正在加载",3e3)},closeLoading:function(){window.dd&&window.dd.dialog&&window.dd.dialog.loading("正在加载",0)}}});