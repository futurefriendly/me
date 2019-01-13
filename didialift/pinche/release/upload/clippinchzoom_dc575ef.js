define('upload/clippinchzoom.js', function(require, exports, module){

/**
*
* rewrite pinchZoom by zhangnan03
*
*/
var PinchZoom = require('upload/pinchzoom.js');
var ClipPinchZoom = module.exports = function(){
    PinchZoom.apply(this, arguments);
}
ClipPinchZoom.prototype = $.extend(
    {},
    PinchZoom.prototype, {
     sanitize: function () {
        if(this.zoomFactor == 1) return;
        if (this.zoomFactor < this.options.zoomOutFactor) {
            this.zoomOutAnimation();
        } else if (this.isInsaneOffset(this.offset)) {
            this.sanitizeOffsetAnimation();
        }
    },
    canDrag: function(){
        return true;
    },

    /**
     * Event handler for 'drag'
     * @param event
     */
    handleDrag: function (event) {
        // if (this.zoomFactor > 1.0) {
            var touch = this.getTouches(event)[0];
            this.drag(touch, this.lastDragPosition);
            this.offset = this.sanitizeOffset(this.offset);
            this.lastDragPosition = touch;
        // }
    },
    sanitizeOffset: function (offset) {

        var radio = this.options.imgWidth / this.options.imgHeight;
        var containerY = this.getContainerY();
        var containerX = this.getContainerX();
        var maxX = (this.zoomFactor - 1) * containerX,
            maxY = (this.zoomFactor - 1) * containerY;
        var direct = containerX / containerY;
        var viewportRect = this.options.imgCliper.getViewportRect();
        var viewportHeight = viewportRect.h;
        var viewportWidth = viewportRect.w;
        //竖屏
        if(direct < 1){
            var imageHeight = containerX / radio;
            var imageWidth = containerX;
        //横屏    
        }else{
            var imageWidth = containerY * radio;
            var imageHeight = containerY;
        }
        var surplusHeight = (containerY - viewportHeight) / 2 - (containerY -  imageHeight) / 2 * this.zoomFactor;
        maxY += surplusHeight;
        var surplusWidth = (containerX - viewportWidth) / 2 - (containerX - imageWidth)/2 * this.zoomFactor;
        maxX += surplusWidth;
        var maxOffsetX = Math.max(maxX, direct < 1 ? surplusWidth : surplusWidth),
            maxOffsetY = Math.max(maxY, direct < 1 ? surplusHeight : surplusHeight),
            minOffsetX = Math.min(maxX, direct < 1 ? -surplusWidth : -surplusWidth),
            minOffsetY = Math.min(maxY, direct < 1 ? -surplusHeight : -surplusHeight);

        return {
            x: Math.min(Math.max(offset.x, minOffsetX), maxOffsetX),
            y: Math.min(Math.max(offset.y, minOffsetY), maxOffsetY)
        };
    },
});

});