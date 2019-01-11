function swiperInit(){
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical',
        speed: 650,
        followFinger: false,
        resistanceRatio : 0,
        // preloadImages : false,
        // updateOnImagesReady : false,
        // lazyLoading : true,
        // lazyLoadingInPrevNext : true,
        // lazyLoadingInPrevNextAmount : 3,
        // lazyLoadingOnTransitionStart : false,


        onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
        swiperAnimateCache(swiper); //隐藏动画元素 
        swiperAnimate(swiper); //初始化完成开始动画
        // $('.swiper-slide').eq(swiper.activeIndex).find('.ani').addClass('visible'); //如swiper.js作者没有解决onSlideChangeEnd中的transitionEnd问题，此句保留
        }, 
        onSlideChangeStart: function(swiper){
        swiperAnimate(swiper); //每个slide切换开始时也运行当前slide动画
        // $('.swiper-slide').eq(swiper.activeIndex).find('.ani').addClass('visible'); //如swiper.js作者没有解决onSlideChangeEnd中的transitionEnd问题，此句保留
        }
    });
    mySwiper.enableKeyboardControl(); //支持键盘控制

    $('.next').on('click',function(){
        mySwiper.slideNext(); //点击进入下一场景
    });
}

// music
function switchMusic(){
    var mts = document.getElementById('music_tool_switch'),
        mt = document.getElementById('music_tool'),
        ma = document.getElementById('music_audio');
    if(ma!==null){
        if(mts.checked == true && ma.paused){
            mts.checked = false;
            ma.play();
        }else{
            mts.checked = true;
            ma.pause();
        } 
    }
};  

// loading
window.addEventListener('DOMContentLoaded', function() {
    new QueryLoader2(document.querySelector("body"), {
        barColor: "#fff",
        backgroundColor: "#e84487",
        percentage: true,
        barHeight: 3,
        minimumTime: 300,
        maxTime:100000,
        fadeOutTime: 900,
        onComplete : function() {
            swiperInit();
            setTimeout(function(){
                if($('.e_slide_1').hasClass('swiper-slide-active')){
                    $('.next:eq(0)').trigger('click');
                }
            },3000);
        },
    });
});

$(function() {

    //音乐自动播放
    function autoPlay() {
        document.getElementById('music_audio').play();
        $("body").off("touchstart");
    };
    autoPlay();
    
    //浏览器不自动播放fix
    $("body").on("touchstart", autoPlay);

    //统计
    var _send = DidiMonitor.sendBeatles;
    var _channel = DidiMonitor.getQuery('regfrom');
    var _moreLink = 'http://static.didialift.com/pinche/xiaojushow/release/56ea5a3e42d3c9ac430650fc.html?regfrom=' + _channel;

    var VARS = {};
    VARS.UA = window.navigator.userAgent;
    VARS.IsDiDiBrowser = !! (window['DidiJSBridge'] || /didi.passenger/.test(VARS.UA));

    var _shareLink = location.href + '?regfrom=' + _channel;

    //初始化Entrance
    var romance2016_param = {
        wxShareConfig: {
            link: _shareLink,
            imgUrl: 'http://static.didialift.com/pinche/images/romance2016/share180.jpg',
            img_url: 'http://static.didialift.com/pinche/images/romance2016/share180.jpg',
            title: '一见钟情？命中注定？邂逅顺风车上的浪漫故事！',
            desc: '顺风车上，邂逅最美好的浪漫，遇见邻家萌妹，遇见长腿偶吧！',
            weibo_desc: '顺风车上，邂逅最美好的浪漫，遇见邻家萌妹，遇见长腿偶吧！'
        },
        shareConfig: {
            share_url: _shareLink,
            share_img_url: 'http://static.didialift.com/pinche/images/romance2016/share180.jpg',                      
            share_icon_url: 'http://static.didialift.com/pinche/images/romance2016/share180.jpg',                      
            share_title: '一见钟情？命中注定？邂逅顺风车上的浪漫故事！',       
            share_content: '顺风车上，邂逅最美好的浪漫，遇见邻家萌妹，遇见长腿偶吧！',
            desc: '顺风车上，邂逅最美好的浪漫，遇见邻家萌妹，遇见长腿偶吧！'
        }
    }; 

    // 微信分享
    
    initWxShare(romance2016_param.wxShareConfig); 

    if(VARS.IsDiDiBrowser){

        var entranceConfig = {
            entrance: {
                icon: "http://static.xiaojukeji.com/api/img/i-webview-entrance.png"
            },
            buttons: [{
                    type: "share_weixin_timeline",
                    name: "分享到微信朋友圈",
                    data: romance2016_param.shareConfig,
                    callback: function() {}
                }, {
                    type: "share_weixin_appmsg",
                    name: "分享给微信好友",
                    data: romance2016_param.shareConfig,
                    callback: function() {}
                }, {
                    type: "share_sina_weibo",
                    name: "分享到新浪微博",
                    data: $.extend({}, romance2016_param.shareConfig, {
                        share_content: romance2016_param.shareConfig.weibo_desc || romance2016_param.shareConfig.desc
                    }),
                    callback: function() {}
                }, {
                    type: "share_qq_appmsg",
                    name: "分享给QQ好友",
                    data: romance2016_param.shareConfig,
                    callback: function() {}
                }, {
                    type: "share_qzone",
                    name: "分享到QQ空间",
                    data: romance2016_param.shareConfig,
                    callback: function() {}
                }, {
                    type: "page_refresh",
                    name: "刷新"
            }]
        };

        DidiBridge.initEntrance(entranceConfig);
        DidiBridge.showEntrance();
    }

    // 发送显示日志，等同于PV
    _send('romance2016_index_sw', {
        channel: _channel
    });

    $('#sharebtn').on('touchend',function(){
        if(VARS.IsDiDiBrowser){
            DidiBridge && DidiBridge.invokeEntrance();
        }else{
            $('#sharelayer').show();
        }
        _send('romance2016_share_ck');
    });

    $('#morebtn').on('touchend',function(){
        _send('romance2016_more_ck');
        setTimeout(function(){
            location.href = _moreLink;
        },300);
    });

    $('#sharelayer').on('touchend',function(){
        $(this).css('display','none');
    });
});