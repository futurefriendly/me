define('upload/upload.js', function(require, exports, module){

var ImgCliper = require('upload/imgcliper.js');
/**
* 
* 图片上传+裁剪功能类
* fis语法依赖 _canvasresize/main.js
* @require upload/_canvasresize/main.js
*
**/

var ImgUpload = module.exports = function(el, opt) {
    var iframeID = 'iframepost' + Math.floor(Math.random() * 1000);
    var filekey = opt.filekey || 'file';
    this.opt = $.extend({
        outputWidth: 500,
        outputHeight: 500,
        data: {}
    }, opt);
    this.$el = el;
    this.fileInput = document.createElement("INPUT");
    this.form = document.createElement("FORM");
    this.iframe = document.createElement("IFRAME");


    this.fileInput.name = filekey;
    this.fileInput.type = 'file';
    this.fileInput.setAttribute('accept',"image/*");
    this.fileInput.style.cssText = "position: absolute;left:0;top:0;height:100%;width:100%; opacity: 0";

    this.form.target = iframeID;
    this.form.method = 'POST';
    this.form.encoding = "multipart/form-data";
    this.form.action = opt.url;

    if (typeof FileReader === 'undefined') {
        alert('非常抱歉，您的手机不支持文件上传，请更换手机注册，谢谢');
        this.iframe.style.display = 'none';
        this.iframe.name = iframeID;
        document.body.appendChild(this.iframe);

    }
    this.form.appendChild(this.fileInput);
    el.appendChild(this.form);
    this.register();
}

ImgUpload.prototype = {
    //事件注册
    register: function() {
        var me = this;
        this.fileInput.addEventListener('change', function(e) {
            me.onFileChange(e);
        }, false);
        this.iframe && this.iframe.addEventListener('load', function() {
            me.onsuccess(this.contentWindow.document.body.innerHTML);
        }, false);
    },
    //文件选择事件
    onFileChange: function(e) {
        var me = this;
        var file = e.target.files[0];
        if (file === undefined) {
            return;
        }
        var ext = e.target.value.match(/\.(png|jpg|jpeg|gif)$/i)[1];
        this.fileInfo = {
                ext: ext,
                type: file.type,
                name: file.name,
                size: file.size
            }
        //在iOS下，来自拍摄的图片，是宽高反向的，canvasResize有做处理。
        //这一步android消耗2000ms左右、iOS消耗500ms左右
        me.showLoading()
        var max = Math.max( Math.max(me.opt.outputWidth, me.opt.outputHeight), 1000 );
        canvasResize(file, {
            width: max,
            height: max,
            crop: false,
            quality: 80,
            rotate: 0,
            callback: function(dataURL, width, height) {
                me.closeLoading();
                me.clip(dataURL, width, height);
            }
        });

        return;


        // CANVAS RESIZING
        /*
        var reader = new FileReader();
        reader.onloadend = function(e) {
            var dataURL = e.target.result;
            var img = document.createElement('IMG')
            img.onload = function() {
                img.style.opacity = '0';
                img.style.position = 'absolute';
                document.body.appendChild(img);                
                me.clip(dataURL, img.offsetWidth, img.offsetHeight);
                img.parentNode.removeChild(img);
                img.onload = function() {};
                img = undefined;
                dataURL = undefined;
            }
            img.src = dataURL;
        };
        reader.readAsDataURL(file);
        */
    },
    //开始裁剪
    clip: function(data, originWidth, originHeight) {
        var me = this;
        var opt = {
            clipWidth: me.opt.outputWidth,
            clipHeight: me.opt.outputHeight,
            // clipZoneWidth: me.opt.clipZoneWidth,
            // clipZoneHeight: me.opt.clipZoneHeight,
            originHeight: originHeight,
            originWidth: originWidth,
            fileType: me.fileInfo.type,
            rawData: data,
            onSave: function(data) {
                me.showLoading();
                me.compress({
                    dataURL: data
                }, function(minData) {
                    me.upload(minData);
                });
                me.fileInput.value = '';
            },
            onCancel: function(){
                me.fileInput.value = '';
                me.opt.onCancelUpload
                && me.opt.onCancelUpload();
            }
        };
        if (this.imgCliper) {
            this.imgCliper.destroy();
        }

        this.imgCliper = new ImgCliper(opt);

    },
    //压缩图片
    compress: function(data, cb) {
        var me = this;
        canvasResize(data, {
            fileType: me.fileInfo.type,
            width: me.opt.outputWidth,
            height: me.opt.outputHeight,
            crop: false,
            quality: 80,
            rotate: 0,
            callback: function(data, width, height) {
                cb(data);
            }
        });
    },
    //上传图片
    upload: function(data) {
        var me = this;
        var fd = new FormData();




        // Add file data
        // var f = canvasResize('dataURLtoBlob', data);
        //第三个参数是filename
        // fd.append(me.opt.filekey, f, me.fileInfo.name);

         fd.append('file', data);
         fd.append('type', me.fileInfo.type);
         fd.append('size', me.fileInfo.size);
         fd.append('filename', me.fileInfo.name);
         fd.append('ext', me.fileInfo.ext);
        $.each(me.opt.data, function(key, val){
            fd.append(key,val);
        });
        fd.append('filename', me.fileInfo.name + ~~(Math.random() * 1E6));
        var xhr = new XMLHttpRequest();
        xhr.open('POST', me.opt.url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("pragma", "no-cache");
        //Upload progress
        xhr.upload.addEventListener("progress", function(e) {
            if (e.lengthComputable) {
            }
            var loaded = Math.ceil((e.loaded / e.total) * 100);
            // console.log(loaded);
        }, false);
        // File uploaded
         xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                clearTimeout(timer);
                xhr.status === 200 
                ? me.onUploadSuccess(xhr.responseText) 
                : me.uploadFailed(xhr.responseText);
            } 
        };
        var timer = setTimeout(function(){
            xhr.abort();
            me.uploadFailed('timeout');
        }, me.opt.timeout || 20000);
        // Send data
        xhr.send(fd);
    },
    //上传成功
    onUploadSuccess: function(response) {
        this.imgCliper.close();
        this.closeLoading();
        this.opt.onSuccessUpload && this.opt.onSuccessUpload(response);
    },
    uploadFailed: function(){
        this.opt.onFailedUpload && this.opt.onFailedUpload();
    },
    showLoading: function(){
        window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 3000);
    },
    closeLoading: function(){
        window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 0);
    }
};


});