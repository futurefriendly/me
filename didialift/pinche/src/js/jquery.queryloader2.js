/*
 * QueryLoader v2 - A simple script to create a preloader for images
 *
 * For instructions read the original post:
 * http://www.gayadesign.com/diy/queryloader2-preload-your-images-with-ease/
 *
 * Copyright (c) 2011 - Gaya Kessler
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version:  2.1
 * Last update: 11-1-2011
 *
 */
(function($) {
    var qLimages = new Array;
    var qLdone = 0;

    var qLimageContainer = "";
    var qLoverlay = "";
    var qLbar = "";
    var qLpercentage = "";
    var qLimageCounter = 0;

    var qLoptions = {
        onComplete: function () {},
        backgroundColor: "#000",
        barColor: "#fff",
        barHeight: 1,
        percentage: false,
        deepSearch: true,
        completeAnimation: "fade",
        onLoadComplete: function () {
            if (qLoptions.completeAnimation == "grow") {
                //zepto无 stop方法
                // $(qLbar).css("width", "100%").animate({
                //     top: "0%",
                //     height: "100%"
                // }, 500,'', function () {
                //     //兼容zepto无fadeout改写 并且 不兼容stop()
                //     try{
                //         $(qLoverlay).fadeOut(500, function () {
                //             $(this).remove();
                //             qLoptions.onComplete();
                //         })
                //     }
                    
                //     //zepto的animate方法参数是有顺序传入的,回调前有参数
                //     catch(e){
                //         $(qLoverlay).animate({'opacity':0},500,'',function(){
                //             $(this).remove();
                //             qLoptions.onComplete();
                //         })
                //     }
                // });
                try{
                    $(qLoverlay).fadeOut(500, function () {
                        $(this).remove();
                        qLoptions.onComplete();
                    })
                }
                
                //zepto的animate方法参数是有顺序传入的,回调前有参数
                catch(e){
                    $(qLoverlay).animate({'opacity':0},500,'',function(){
                        $(this).remove();
                        qLoptions.onComplete();
                    })
                }
            } else {
                //兼容zepto无fadeout改写 并且 不兼容stop()
                try{
                    $(qLoverlay).fadeOut(500, function () {
                        $(qLoverlay).remove();
                        qLoptions.onComplete();
                    });
                }
                catch(e){
                    $(qLoverlay).animate({'opacity':0},500,'',function(){
                        $(this).remove();
                        qLoptions.onComplete();
                    })
                }
                
                
            }
        }
    }

    var afterEach = function () {
        createPreloadContainer();
        createOverlayLoader();
    }

    var createPreloadContainer = function() {
        qLimageContainer = $("<div></div>").appendTo("body").css({
            display: "none",
            width: 0,
            height: 0,
            overflow: "hidden"
        });

        for (var i = 0; qLimages.length > i; i++) {
            // $.ajax({
            //     url: qLimages[i],
            //     type: 'HEAD',
            //     success: function(data) {

            //         qLimageCounter++;
                    
            //         addImageForPreload(this['url']);
            //     }
            // });
            //改写库中用ajax获取图片url ,可以用zepto,但是没有fadeOut stop等方法
            qLimageCounter++;
            addImageForPreload(qLimages[i]);
        }

    }

    var addImageForPreload = function(url) {
        var image = $("<img />").attr("src", url).bind("load", function () {
            completeImageLoading();
        }).appendTo(qLimageContainer);
    }

    var completeImageLoading = function () {
        qLdone++;
        
        var percentage = (qLdone / qLimageCounter) * 100;

        //zepto 无stop方法
        $(qLbar).animate({
            width: percentage + "%"
        }, 200);

        if (qLoptions.percentage == true) {
            $(qLpercentage).text(Math.ceil(percentage) + "%");
        }

        if (qLdone == qLimageCounter) {
            destroyQueryLoader();
        }
    }

    var destroyQueryLoader = function () {
        $(qLimageContainer).remove();
        qLoptions.onLoadComplete();
    }

    var createOverlayLoader = function () {
        qLoverlay = $("<div id='qLoverlay'></div>").css({
            width: "100%",
            height: "100%",
            backgroundColor: qLoptions.backgroundColor,
            backgroundPosition: "fixed",
            position: "fixed",
            zIndex: 666999,
            top: 0,
            left: 0
        }).appendTo("body");
        // qLbar = $("<div id='qLbar'></div>").css({
        //     height: qLoptions.barHeight + "px",
        //     marginTop: "-" + (qLoptions.barHeight / 2) + "px",
        //     backgroundColor: qLoptions.barColor,
        //     width: "0%",
        //     position: "absolute",
        //     top: "50%"
        // }).appendTo(qLoverlay);
        loadingdiv=$('<div id="loadingDiv"><div class="load_01"></div><div class="load_02"></div></div>').appendTo(qLoverlay);
        if (qLoptions.percentage == true) {
            qLpercentage = $("<div id='qLpercentage'></div>").text("0%").css({
                height: "40px",
                width: "100px",
                position: "absolute",
                fontSize: qLoptions.fontsize,
                top: "65%",
                left: "50%",
                marginTop: "-" + (59 + qLoptions.barHeight) + "px",
                textAlign: "center",
                marginLeft: "-50px",
                color: qLoptions.barColor,
                fontWeight :qLoptions.fontWeight
            }).appendTo(qLoverlay);
        }
    }

    var findImageInElement = function (element) {
        var url = "";

        if ($(element).css("background-image") != "none") {
            var url = $(element).css("background-image");
        } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
            var url = $(element).attr("src");
        }
        if (url.indexOf("gradient") == -1) {
            url = url.replace(/url\(\"/g, "");
            url = url.replace(/url\(/g, "");
            url = url.replace(/\"\)/g, "");
            url = url.replace(/\)/g, "");

            var urls = url.split(", ");

            for (var i = 0; i < urls.length; i++) {
                if (urls[i].length > 0) {
                    var extra = "";
                    if ($.browser.msie && $.browser.version < 9) {
                        extra = "?" + Math.floor(Math.random() * 3000);
                    }
                    qLimages.push(urls[i] + extra);
                }
            }
        }
    }

    $.fn.queryLoader2 = function(options) {
        if(options) {
            $.extend(qLoptions, options );
        }
        this.each(function() {
            findImageInElement(this);
            if (qLoptions.deepSearch == true) {
                $(this).find("*:not(script)").each(function() {
                    findImageInElement(this);
                });
            }
        });

        afterEach();

        return this;
    };

})(window.Zepto||window.jQuery);