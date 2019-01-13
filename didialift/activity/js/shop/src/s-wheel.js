//轮播相关
var imgList = document.getElementById("wheel"),
    wheelImgs = imgList.children, //每一个图片li
    indicatorList = document.getElementById("indicator"), //指示器
    indicators = indicatorList.children,
    iNow = 0,//当前的
    isMove = false; //是move过去的touchend

if (wheelImgs.length <= 1) { //只有一张的情况，停止轮播
    imgList.style.width = "100%";
} else {
    imgList.innerHTML += imgList.innerHTML; //多一倍的长度
    imgList.style.width = 100 * wheelImgs.length + '%';
    var imgListW = imgList.offsetWidth / 2; //w是一个ul的宽度
    var translateX = 0;

    //自动轮播
    var playTimer = setInterval(playAuto, 4000);

    //轮播
    imgList.addEventListener('touchstart', function(ev) {
        ev.preventDefault();
        clearInterval(imgList.timer);
        clearInterval(playTimer);
        var disX = ev.targetTouches[0].pageX - translateX; //移动多少的宽度  
        var downX = ev.targetTouches[0].pageX;

        //触摸拖动效果
        function fnMove(ev) {
            ev.preventDefault();
            translateX = ev.targetTouches[0].pageX - disX;
            if (translateX < 0) { //？50
                imgList.style.WebkitTransform = 'translateX(' + translateX % imgListW + 'px)';
            } else {
                imgList.style.WebkitTransform = 'translateX(' + (translateX % imgListW - imgListW) % imgListW + 'px)';
            }
            isMove = true;
        }

        //触摸抬起效果
        if(isMove){
            function fnEnd(ev) {
                ev.preventDefault();
                playTimer = setInterval(playAuto, 2000);
                imgList.removeEventListener('touchmove', fnMove, false);
                imgList.removeEventListener('touchend', fnEnd, false);

                if (Math.abs(ev.changedTouches[0].pageX - downX) > 10) {
                    if (downX > ev.changedTouches[0].pageX) {
                        iNow++;
                        startMove(imgList, -iNow * wheelImgs[0].offsetWidth);
                        tab();
                    } else {
                        iNow--;
                        startMove(imgList, -iNow * wheelImgs[0].offsetWidth);
                        tab();
                    }
                } else {
                    startMove(imgList, -iNow * wheelImgs[0].offsetWidth);
                }
            }
            isMove = false;
        }
        
        imgList.addEventListener('touchmove', fnMove, false);
        imgList.addEventListener('touchend', fnEnd, false);
    }, false);
}

//轮播图添加链接
imgList.addEventListener("touchend",function(ev){
    
    if(!isMove){
        ev.preventDefault();
        var _target=ev.target;
        if(_target.nodeName == "IMG"){
            var dialog2 = new dd.dialog.Fn('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>');
            dialog2.show();
            var _href=_target.parentNode.getAttribute("href");
            location.href=_href; 
        }
    }
});

//自动播放
function playAuto() {
    iNow++;
    startMove(imgList, -iNow * wheelImgs[0].offsetWidth);
    tab();
}

//指示器效果
function tab() {
    for (var i = 0; i < indicators.length; i++) {
        indicators[i].className = '';
    }
    if (iNow > 0) {
        indicators[iNow % indicators.length].className = 'on';
    } else {
        indicators[(iNow % indicators.length + indicators.length) % indicators.length].className = 'on';
    }
}
//运动方法
function startMove(obj, iTarget) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var iSpeed = (iTarget - translateX) / 3;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

        translateX += iSpeed;

        if (translateX < 0) {
            obj.style.WebkitTransform = 'translateX(' + translateX % imgListW + 'px)';
        } else {
            obj.style.WebkitTransform = 'translateX(' + (translateX % imgListW - imgListW) % imgListW + 'px)';
        }
    }, 30);
}
