$(".flipbook-viewport .flipbook").addClass("flipbookAndorid");
$(".flipbook-viewport .container").addClass("containerAndorid");
$(".flipbook-viewport .page").addClass("pageAndorid");

var config = {
    "device-width": parseInt(window.screen.availWidth),
    "top-value": 0,
    "offset": 50,
    "small-offset": 50,
    "valid-offset": 30,
    "left": "left",
    "right": "right"
};

var dv_pageBodys = _document.querySelectorAll(".flipbook-viewport .pageAndorid"),
    startPosition = null,
    startLeft = null,
    currentPage = null,
    divLength = dv_pageBodys.length,
    isSlide = false,
    startPosition = null,
    direction = null,
    leftArray = [],
    globalDiff = 0;

//初始化DIV位置
var initPosition = function() {
    [].forEach.call(dv_pageBodys, function(item, index) {
        var _index = parseInt(item.getAttribute("index"));
        item.setAttribute("currentIndex", index);
        item.style.left = (config["device-width"] * _index) + "px";
        if (_index > 0) item.style.top = config["top-value"] + "px";
    });
};

initPosition();
//改变DIV位置
var changePostion = function(diff) {
    [].forEach.call(dv_pageBodys, function(item) {
        var _index = parseInt(item.getAttribute("currentIndex"));
        item.style.left = _index * config["device-width"] + diff + "px";
    });
};

//改变所有DIV位置
var changePostionAll = function(direction, isSmallOffset) {
    var _offset = isSmallOffset ? "small-offset" : "offset";
    [].forEach.call(dv_pageBodys, function(item) {
        if (direction == config["left"]) {
            item.style.left = parseInt(item.style.left) - config[_offset] + "px";
        } else {
            item.style.left = parseInt(item.style.left) + config[_offset] + "px";
        }
    });
};

var initPostionOverride = function() {
    [].forEach.call(dv_pageBodys, function(item) {
        var currentIndex = item.getAttribute("currentIndex");
        item.style.left = -(currentIndex * config["device-width"]) + "px";
    });
};

//get the touchstart postion then record it
common.getDom(_document, ".flipbook-viewport").addEventListener("touchstart", function(ev) {
    ev.preventDefault();
    startPosition = ev.targetTouches[0].clientX;
    startLeft = parseInt(dv_pageBodys[0].style.left);
    currentPage = Math.floor(Math.abs(parseInt(dv_pageBodys[0].style.left)) / config["device-width"]) + 1;
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
        direction = config["left"];
    } else if (leftArray[_len - 2] < leftArray[_len - 1]) {
        direction = config["right"];
    }

    if (direction == config["left"] && parseInt(dv_pageBodys[3].style.left) <= 0 && currentPage == 4) return;
    if (direction == config["right"] && parseInt(dv_pageBodys[0].style.left) >= 0 && currentPage == 1) return;
    if (globalDiff > 30) {
        changePostion(diff);
        isSlide = true;
    }
}, false);*/

//重写滑动翻页
common.getDom(_document, ".flipbook-viewport").addEventListener("touchend", function(event) {
    event.preventDefault();
    //if (!isSlide) return;
    if (event.target.className != "leftArrow" && event.target.className != "rightArrow") return;
    var _index = direction == config["left"] ? currentPage : currentPage - 2;
    if (direction == null || currentPage == 1) _index = 0;
    var _smallOffset = true;

    if (currentPage == 1 && parseInt(dv_pageBodys[0].style.left) < 0 && direction == config["right"]) {
        dv_pageBodys[0].style.left = "0px";
        initPostionOverride();
        return;
    }
    if (currentPage == 4 && direction == config["left"]) {
        dv_pageBodys[3].style.left = "0px";
        initPostionOverride();
        return;
    }

    function animatePostion() {
        if (direction == config["right"]) {
            if (parseInt(dv_pageBodys[_index].style.left) >= 0) {
                dv_pageBodys[_index].style.left = "0px";
                [].forEach.call(dv_pageBodys, function(item) {
                    item.setAttribute("currentIndex", parseInt(item.getAttribute("currentIndex")) + 1);
                });
                initPostionOverride();
                //direction = null;
                return false;
            }
        } else {
            if (parseInt(dv_pageBodys[_index].style.left) <= 0) {
                dv_pageBodys[_index].style.left = "0px";
                [].forEach.call(dv_pageBodys, function(item) {
                    item.setAttribute("currentIndex", parseInt(item.getAttribute("currentIndex")) - 1);
                });
                initPostionOverride();
                //direction = null;
                return false;
            }
        }

        changePostionAll(direction, _smallOffset);
        animationFrame(animatePostion, 50);
    };
    animatePostion();
    isSlide = false;
    leftArray = [];

    var tempPage = direction == config["left"] ? currentPage + 1 : currentPage - 1;
    if (tempPage == 1) {
        cfg.firstLoad(false);
        cfg.firstAnimate();
    }
    if (tempPage == 2) {
        cfg.secondLoad(false);
        cfg.secondAnimate();
    }
    if (tempPage == 3) {
        cfg.thirdLoad(false);
        cfg.thirdAnimate();
    }
    if (tempPage == 4) {
        cfg.forthLoad(false);
        cfg.fouthAnimate();
    }
    // if (tempPage == 5) {
    //     cfg.fifthLoad();
    //     cfg.fifthAnimate();
    // }
}, false);
