asyncLoadJS("http://static.xiaojukeji.com/activity/js/pinklove/turn.js", function() {
    function Turn(cfg) {
        function loadApp() {
            $('.flipbook').turn({
                width: cfg.width,
                height: cfg.height,
                elevation: 30,
                gradients: true,
                autoCenter: true,
                display: "single",
                direction: "ltr",
                turnCorners: "br,bl",
                acceleration: true,
                duration: cfg.duration
            });
        };

        cfg.firstAnimate && cfg.firstAnimate();


        //翻页完成后的执行事件
        $(".flipbook").bind("turned", function(event, page, view) {
            if (page == 1) {
                cfg.firstLoad(true);
                cfg.firstAnimate();
            }
            if (page == 2) {
                cfg.secondLoad(false);
                cfg.secondAnimate();
            }
            if (page == 3) {
                cfg.thirdLoad(false);
                cfg.thirdAnimate();
            }
            if (page == 4) {
                cfg.forthLoad(false);
                cfg.fouthAnimate();
            }
            // if (page == 5) {
            //     cfg.fifthLoad();
            //     cfg.fifthAnimate();
            // }
            globalPage = page;
        });

        $(".flipbook").bind("start", function(event, page, view) {
            if (page.page == 3) {
                cfg.forthLoad();
                cfg.fouthAnimate();
            }
        });

        loadApp();
        cfg.defaultFun && cfg.defaultFun();
    };

    var turn = new Turn(cfg);
});

var startPosition = null,
    isSlide = false,
    direction = null,
    leftArray = [],
    globalDiff = 0;
//get the touchstart postion then record it
common.getDom(_document, ".flipbook-viewport").addEventListener("touchstart", function(ev) {
    ev.preventDefault();
    startPosition = ev.targetTouches[0].clientX;
    if (ev.target.className == "leftArrow") direction = "right";
    if (ev.target.className == "rightArrow") direction = "left";
}, false);

//判断是否在屏幕上移动手指
/*common.getDom(_document, ".flipbook-viewport").addEventListener("touchmove", function(ev) {
    ev.preventDefault();
    var touches = ev.targetTouches,
        endTouch = touches[0],
        diff = endTouch.clientX - startPosition;

    leftArray.push(diff);
    globalDiff = Math.abs(diff);
    var _len = leftArray.length;
    if (leftArray[_len - 2] > leftArray[_len - 1]) {
        direction = "left"
    } else if (leftArray[_len - 2] < leftArray[_len - 1]) {
        direction = "right"
    }
    if (globalDiff > 50) {
        isSlide = true;
    }
}, false);*/

//重写滑动翻页
common.getDom(_document, ".flipbook-viewport").addEventListener("touchend", function(event) {
    event.preventDefault();
    if (event.target.className != "leftArrow" && event.target.className != "rightArrow") return;
    if (direction == "left") {
        $(".flipbook").turn("direction", "rtl").turn("next");
    }
    if (direction == "right") {
        $(".flipbook").turn("direction", "rtl").turn("previous");
    }
    isSlide = false;
    leftArray = [];
    direction = null
}, false);
