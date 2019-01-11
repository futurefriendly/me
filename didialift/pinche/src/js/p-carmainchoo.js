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
$(function(){
  $('#choose_list li a').bind('touchstart',function(){
    $(this).addClass('hover');
  }).bind('touchmove',function(){
    $(this).removeClass('hover');
  }).bind('touchend',function(){
    $(this).removeClass('hover');
  })
});
// 配置分享信息
var wx_funcs = [];
var wxShare = {
    title: '你接第一单，我送大礼包',
    desc: '车主只要接首单就能领取养护大礼包',
    link: 'http://wap.didialift.com/pinche/baoyang/libao/libao_share',
    imgUrl: 'http://static.xiaojukeji.com/pinche/images/carmainter/car_main_07.jpg'
  }

  // http://wap.didialift.com/pinche/baoyang/libao/libao_share
  // http://test.diditaxi.com.cn/pinche/baoyang/libao/libao_share