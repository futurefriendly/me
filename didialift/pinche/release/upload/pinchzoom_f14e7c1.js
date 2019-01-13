define("upload/pinchzoom.js",function(t,i,n){(function(){"use strict";var t=function(t){var i=function(i,n){this.el=t(i),this.zoomFactor=1,this.lastScale=1,this.offset={x:0,y:0},this.options=t.extend({},this.defaults,n),this.setupMarkup(),this.bindEvents(),this.update(),this.enable()},n=function(t,i){return t+i},o=function(t,i){return t>i-.01&&i+.01>t};i.prototype={defaults:{tapZoomFactor:2,zoomOutFactor:1.3,animationDuration:300,animationInterval:5,maxZoom:4,minZoom:.5,lockDragAxis:!1,use2d:!0,zoomStartEventName:"pz_zoomstart",zoomEndEventName:"pz_zoomend",dragStartEventName:"pz_dragstart",dragEndEventName:"pz_dragend",doubleTapEventName:"pz_doubletap"},handleDragStart:function(t){this.el.trigger(this.options.dragStartEventName),this.stopAnimation(),this.lastDragPosition=!1,this.hasInteraction=!0,this.handleDrag(t)},handleDrag:function(t){if(this.zoomFactor>1){var i=this.getTouches(t)[0];this.drag(i,this.lastDragPosition),this.offset=this.sanitizeOffset(this.offset),this.lastDragPosition=i}},handleDragEnd:function(){this.el.trigger(this.options.dragEndEventName),this.end()},handleZoomStart:function(){this.el.trigger(this.options.zoomStartEventName),this.stopAnimation(),this.lastScale=1,this.nthZoom=0,this.lastZoomCenter=!1,this.hasInteraction=!0},handleZoom:function(t,i){var n=this.getTouchCenter(this.getTouches(t)),o=i/this.lastScale;this.lastScale=i,this.nthZoom+=1,this.nthZoom>3&&(this.scale(o,n),this.drag(n,this.lastZoomCenter)),this.lastZoomCenter=n},handleZoomEnd:function(){this.el.trigger(this.options.zoomEndEventName),this.end()},handleDoubleTap:function(t){var i=this.getTouches(t)[0],n=this.zoomFactor>1?1:this.options.tapZoomFactor,o=this.zoomFactor,e=function(t){this.scaleTo(o+t*(n-o),i)}.bind(this);this.hasInteraction||(o>n&&(i=this.getCurrentZoomCenter()),this.animate(this.options.animationDuration,this.options.animationInterval,e,this.swing),this.el.trigger(this.options.doubleTapEventName))},sanitizeOffset:function(t){var i=(this.zoomFactor-1)*this.getContainerX(),n=(this.zoomFactor-1)*this.getContainerY(),o=Math.max(i,0),e=Math.max(n,0),s=Math.min(i,0),a=Math.min(n,0);return{x:Math.min(Math.max(t.x,s),o),y:Math.min(Math.max(t.y,a),e)}},scaleTo:function(t,i){this.scale(t/this.zoomFactor,i)},scale:function(t,i){t=this.scaleZoomFactor(t),this.addOffset({x:(t-1)*(i.x+this.offset.x),y:(t-1)*(i.y+this.offset.y)})},scaleZoomFactor:function(t){var i=this.zoomFactor;return this.zoomFactor*=t,this.zoomFactor=Math.min(this.options.maxZoom,Math.max(this.zoomFactor,this.options.minZoom)),this.zoomFactor/i},drag:function(t,i){i&&this.addOffset(this.options.lockDragAxis?Math.abs(t.x-i.x)>Math.abs(t.y-i.y)?{x:-(t.x-i.x),y:0}:{y:-(t.y-i.y),x:0}:{y:-(t.y-i.y),x:-(t.x-i.x)})},getTouchCenter:function(t){return this.getVectorAvg(t)},getVectorAvg:function(t){return{x:t.map(function(t){return t.x}).reduce(n)/t.length,y:t.map(function(t){return t.y}).reduce(n)/t.length}},addOffset:function(t){this.offset={x:this.offset.x+t.x,y:this.offset.y+t.y}},sanitize:function(){this.zoomFactor<this.options.zoomOutFactor?this.zoomOutAnimation():this.isInsaneOffset(this.offset)&&this.sanitizeOffsetAnimation()},isInsaneOffset:function(t){var i=this.sanitizeOffset(t);return i.x!==t.x||i.y!==t.y},sanitizeOffsetAnimation:function(){var t=this.sanitizeOffset(this.offset),i={x:this.offset.x,y:this.offset.y},n=function(n){this.offset.x=i.x+n*(t.x-i.x),this.offset.y=i.y+n*(t.y-i.y),this.update()}.bind(this);this.animate(this.options.animationDuration,this.options.animationInterval,n,this.swing)},zoomOutAnimation:function(){var t=this.zoomFactor,i=1,n=this.getCurrentZoomCenter(),o=function(o){this.scaleTo(t+o*(i-t),n)}.bind(this);this.animate(this.options.animationDuration,this.options.animationInterval,o,this.swing)},updateAspectRatio:function(){this.setContainerY(this.getContainerX()/this.getAspectRatio())},getInitialZoomFactor:function(){return this.container[0].offsetWidth/this.el[0].offsetWidth},getAspectRatio:function(){return this.el[0].offsetWidth/this.el[0].offsetHeight},getCurrentZoomCenter:function(){var t=this.container[0].offsetWidth*this.zoomFactor,i=this.offset.x,n=t-i-this.container[0].offsetWidth,o=i/n,e=o*this.container[0].offsetWidth/(o+1),s=this.container[0].offsetHeight*this.zoomFactor,a=this.offset.y,h=s-a-this.container[0].offsetHeight,r=a/h,c=r*this.container[0].offsetHeight/(r+1);return 0===n&&(e=this.container[0].offsetWidth),0===h&&(c=this.container[0].offsetHeight),{x:e,y:c}},canDrag:function(){return!o(this.zoomFactor,1)},getTouches:function(t){var i=this.container.offset();return Array.prototype.slice.call(t.touches).map(function(t){return{x:t.pageX-i.left,y:t.pageY-i.top}})},animate:function(t,i,n,o,e){var s=(new Date).getTime(),a=function(){if(this.inAnimation){var h=(new Date).getTime()-s,r=h/t;h>=t?(n(1),e&&e(),this.update(),this.stopAnimation(),this.update()):(o&&(r=o(r)),n(r),this.update(),setTimeout(a,i))}}.bind(this);this.inAnimation=!0,a()},stopAnimation:function(){this.inAnimation=!1},swing:function(t){return-Math.cos(t*Math.PI)/2+.5},getContainerX:function(){return this.container[0].offsetWidth},getContainerY:function(){return this.container[0].offsetHeight},setContainerY:function(t){return this.container.height(t)},setupMarkup:function(){this.container=t('<div class="pinch-zoom-container"></div>'),this.el.before(this.container),this.container.append(this.el),this.container.css({overflow:"hidden",position:"relative"}),this.el.css({"-webkit-transform-origin":"0% 0%","-moz-transform-origin":"0% 0%","-ms-transform-origin":"0% 0%","-o-transform-origin":"0% 0%","transform-origin":"0% 0%",position:"absolute"})},end:function(){this.hasInteraction=!1,this.sanitize(),this.update()},bindEvents:function(){e(this.container.get(0),this),t(window).on("resize",this.update.bind(this)),t(this.el).find("img").on("load",this.update.bind(this))},update:function(){this.updatePlaned||(this.updatePlaned=!0,setTimeout(function(){this.updatePlaned=!1,this.updateAspectRatio();var t=this.getInitialZoomFactor()*this.zoomFactor,i=-this.offset.x/t,n=-this.offset.y/t,o="scale3d("+t+", "+t+",1) translate3d("+i+"px,"+n+"px,0px)",e="scale("+t+", "+t+") translate("+i+"px,"+n+"px)",s=function(){this.clone&&(this.clone.remove(),delete this.clone)}.bind(this);!this.options.use2d||this.hasInteraction||this.inAnimation?(this.is3d=!0,s(),this.el.css({"-webkit-transform":o,"-o-transform":e,"-ms-transform":e,"-moz-transform":e,transform:o})):(this.is3d&&(this.clone=this.el.clone(),this.clone.css("pointer-events","none"),this.clone.appendTo(this.container),setTimeout(s,200)),this.el.css({"-webkit-transform":e,"-o-transform":e,"-ms-transform":e,"-moz-transform":e,transform:e}),this.is3d=!1)}.bind(this),0))},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1}};var e=function(t,i){var n=null,o=0,e=null,s=null,a=function(t,o){if(n!==t){if(n&&!t)switch(n){case"zoom":i.handleZoomEnd(o);break;case"drag":i.handleDragEnd(o)}switch(t){case"zoom":i.handleZoomStart(o);break;case"drag":i.handleDragStart(o)}}n=t},h=function(t){2===o?a("zoom"):1===o&&i.canDrag()?a("drag",t):a(null,t)},r=function(t){return Array.prototype.slice.call(t).map(function(t){return{x:t.pageX,y:t.pageY}})},c=function(t,i){var n,o;return n=t.x-i.x,o=t.y-i.y,Math.sqrt(n*n+o*o)},f=function(t,i){var n=c(t[0],t[1]),o=c(i[0],i[1]);return o/n},u=function(t){t.stopPropagation(),t.preventDefault()},m=function(t){var s=(new Date).getTime();if(o>1&&(e=null),300>s-e)switch(u(t),i.handleDoubleTap(t),n){case"zoom":i.handleZoomEnd(t);break;case"drag":i.handleDragEnd(t)}1===o&&(e=s)},d=!0;t.addEventListener("touchstart",function(t){i.enabled&&(d=!0,o=t.touches.length,m(t))}),t.addEventListener("touchmove",function(t){if(i.enabled){if(d)h(t),n&&u(t),s=r(t.touches);else{switch(n){case"zoom":i.handleZoom(t,f(s,r(t.touches)));break;case"drag":i.handleDrag(t)}n&&(u(t),i.update())}d=!1}}),t.addEventListener("touchend",function(t){i.enabled&&(o=t.touches.length,h(t))})};return i};n.exports=t(window.$)}).call(this)});