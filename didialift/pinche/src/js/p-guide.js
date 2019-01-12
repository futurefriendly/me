(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
    };
 
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//开始
$(function () {
var pageController = {
    stage: $(".stage"),  //舞台
    currentStage: $(".stage-start"), //当前舞台
    targetStage: "", //目标舞台
    currentIndex: 0, //当前舞台索引
    targetIndex: 0,//目标舞台索引
    init: function (index) {
        this.currentIndex = index || 0;
        this.stageLength = this.stage.length; //舞台数
        this.currentStage = this.stage.eq(this.currentIndex);
        this.currentStage.addClass("stage-start").find(".main-layer").addClass("animate");
        this.bindEvent();
    },
    bindEvent: function () {
        var $shareBtn = $("#shareBtn");
        var $backBtn = $("#backBtn");
        var botParent = $('#bottomindex');
        var contentPa = $('#mainLayer').children().length;

        var self = this;
        var touchStart = false;
        var startY = 0;
        var endY = 0;
        var disY = 0;
        var moveCent = 0;
        // var winW = $(window).height();
        var winW = $(window).width();
        var isMoving = false;
        var scrollType = "";

        var currentEffect = "";
        var targetEffect = "";
        var moveTime = 0;

        var $shareLayer = $("#shareLayer");
        $shareBtn.on("tap", function () {
            $shareLayer.show();
        })
        $backBtn.on("touchend", function (e) {
            e.preventDefault();
            $shareLayer.hide();
            isMoving = false;
        })


        this.stage.on("touchstart", function (e) {
            touchStart = true;
            if (!isMoving) {
                winW = $(window).width();
                startY = e.changedTouches[0].clientY;
                startX = e.changedTouches[0].clientX;
                moveTime = new Date() * 1;
            }

        });

        var scrollIndex = 3;
        $(document).on("touchmove", function (e) {
            e.preventDefault();
            if (scrollIndex >= 3) {
                if (isMoving || !touchStart)return true;
                endY = e.changedTouches[0].clientY;
                endX = e.changedTouches[0].clientX;
                // disY = endY - startY;
                disY = endX - startX;
                moveCent = (disY / winW);
                if (disY < 0) { //下一页
                    self.targetIndex = Math.min(self.currentIndex + 1, self.stageLength - 1);
                    scrollType = "next";
                } else { //上一页
                    self.targetIndex = Math.max(self.currentIndex - 1, 0);
                    scrollType = "prev";
                }
                if (self.targetIndex != self.currentIndex) {   //可以滚动
                    self.targetStage = self.stage.eq(self.targetIndex);
                    // self.targetStage.children("div").show();
                    // self.targetStage.find(".main-layer").addClass("animate");
                    // scrollType == "next" ? nextPageMove() : prevPageMove();
                }
                scrollIndex = 0;
            }
            scrollIndex++;

        });
        function nextPageMove() {
            currentEffect = 'scale(' + (1 + moveCent / 10) + ') translateX(0)';
            targetEffect = 'translateX(' + (winW + winW * moveCent / 2) + 'px)'
            self.animate(self.currentStage, currentEffect, 0);
            self.animate(self.targetStage, targetEffect, 0);
            
        }
        function prevPageMove() {
            currentEffect = 'translateX(' + ( winW * moveCent / 2) + 'px)';
            targetEffect = 'scale(' + (0.9 + moveCent / 10) + ') translateX(0)';
            self.animate(self.currentStage, currentEffect, 0);
            self.animate(self.targetStage, targetEffect, 0);
            
        }
        function nextAdd(){
            if(self.targetIndex!=0 && self.targetIndex!=contentPa-1){
                self.currentStage.find('.main-layer').children().removeClass('fadeLeft').removeClass('fadeRight');
                self.targetStage.find('.main-layer').children().removeClass('fadeLeft').addClass('fadeRight');
            }
        }
        function prevAdd(){
            if(self.targetIndex!=0 && self.targetIndex!=(contentPa-1)){
                self.currentStage.find('.main-layer').children().removeClass('fadeLeft').removeClass('fadeRight');
                self.targetStage.find('.main-layer').children().removeClass('fadeRight').addClass('fadeLeft');
            }
        }
        $(document).on("touchend", function (e) {
            touchStart = false;
            moveTime = new Date() * 1 - moveTime;
            var back = false;
            if ((self.targetIndex == self.currentIndex) || isMoving) {
                return true;
            }
            if (moveTime < 500 || Math.abs(disY) > 100) {  //翻页
                switch (scrollType) {
                    case "next":
                        currentEffect = 'scale(0.9) translateX(0)';
                        targetEffect = 'translateX(0)';
                        nextAdd();
                        break;
                    case "prev":
                        currentEffect = 'translateX(' + winW + 'px)';
                        targetEffect = 'scale(1) translateX(0)'; 
                        prevAdd();              
                        break;
                }
                if(self.targetIndex!=contentPa-1){
                    botParent.show();
                    botParent.find('span').removeClass('active');
                    botParent.find('span').eq(self.targetIndex).addClass('active');
                }
                else{
                    botParent.hide();
                }
                self.targetStage.children("div").show();
                self.targetStage.find(".main-layer").addClass("animate");
                // scrollType == "next" ? nextPageMove() : prevPageMove();

            } else { //回到当前页
                back = true;
                switch (scrollType) {
                    case "next":
                        currentEffect = 'scale(1) translateX(0)';
                        targetEffect = 'translateX(' + winW + 'px)';
                        break;
                    case "prev":
                        currentEffect = 'translateX(0)';
                        targetEffect = 'scale(0.9) translateX(0)';
                        break;
                }
            }

            self.animate(self.currentStage, currentEffect, 0.1);
            self.animate(self.targetStage, targetEffect, 0.1);

            isMoving = true;
            self.currentStage.one("webkitTransitionEnd", function () {
                isMoving = false;
                if (!back) {
                    self.currentIndex = self.targetIndex;
                    self.currentStage.children("div").hide().removeClass('animate');
                    self.currentStage = self.targetStage;
                } else {
                    self.targetStage.children("div").hide().removeClass('animate');
                }
            });
        });
        return this;
    },
    animate: function (obj, target, time) {
        obj.css({"transition": time + "s", "-webkit-transition": time + "s", "transform": target, "-webkit-transform": target, "transition-timing-function": "ease-out", "-webkit-transition-timing-function": "ease-out"});
        return obj;
    }
}

     
    // pageController.init();
    $("body").queryLoader2({
        barColor: "#666666",
        backgroundColor: "#f0f0f0",
        percentage: true,
        barHeight: 30,
        completeAnimation: "grow",
        fontsize:"1.5rem",
        fontWeight:'bold',
        onComplete:function(){
            pageController.init();
            loading_div.hide();
            icount=-1;
        }
    });
    var loading_div=$('#loading_div'),icount=0;
    changeGuid();
    function changeGuid(){
        loading_div.find('span').removeClass('swing_loading');
        loading_div.find('span').eq(icount).addClass('swing_loading');
        if(icount>=0){
            setTimeout(changeGuid,500)
        }
        icount++;
        if(icount==6){
            icount=0;
        }
    }
})
