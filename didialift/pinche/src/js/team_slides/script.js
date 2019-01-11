function swiperInit(){
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical',
        loop: false,
        // effect : 'slide',
        speed: 900,
        followFinger: false,
        resistanceRatio : 0,
        // lazyLoading : true,
        // lazyLoadingInPrevNext : true,
        // lazyLoadingOnTransitionStart : true,


        onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
        swiperAnimateCache(swiper); //隐藏动画元素 
        swiperAnimate(swiper); //初始化完成开始动画
        $('.swiper-slide').eq(swiper.activeIndex).find('.ani').addClass('visible'); //如swiper.js作者没有解决onSlideChangeEnd中的transitionEnd问题，此句保留
        }, 
        onSlideChangeStart: function(swiper){
        swiperAnimate(swiper); //每个slide切换开始时也运行当前slide动画
        $('.swiper-slide').eq(swiper.activeIndex).find('.ani').addClass('visible'); //如swiper.js作者没有解决onSlideChangeEnd中的transitionEnd问题，此句保留
        }
    });
    mySwiper.enableKeyboardControl(); //支持键盘控制

    $('.next').on('click',function(){
        mySwiper.slideNext(); //点击进入下一场景
    });
}

// loading
window.addEventListener('DOMContentLoaded', function() {
    new QueryLoader2(document.querySelector("body"), {
        barColor: "#ff8903",
        backgroundColor: "#fff",
        percentage: true,
        barHeight: 3,
        minimumTime: 300,
        maxTime:1000000,
        fadeOutTime: 900,
        onComplete : function() {
            swiperInit();
        },
    });
});

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
    var _channel = DidiMonitor.getQuery('channel');
    var jd_url = 'http://static.xiaojukeji.com/pinche/beat-dist/template/stpages/page/jd-0727.html?channel=' + _channel;
    var join_url = 'http://wap.didialift.com/pinche/driver_recruit/join?channel=' + _channel + '&sign=de5e28ae1a99fee0509b81ca2cc0d666';
    $('#goJd').attr('href', jd_url);
    $('#goJoin').attr('href', join_url);
    // 发送显示日志，等同于PV
    _send('teamslides_index_sw', {
        channel: _channel
    })
});