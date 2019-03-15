var hastouch = 'ontouchstart' in window,
    tapend = hastouch?'touchend':'click';

var scrollPos = 0;
var windowH = $(window).height();
var windowW = $(window).width();
var documentH = 0;
var pct = 0;

var sectionOffset = [];

$('nav').hide();

function secHeight(){
  var seccount = $('section').length;
  for (i=0;i<seccount;i++){
    sectionOffset[i] = Math.floor($('section:eq('+ i +')').offset().top - 180);
  }
}

function onScroll(){

    scrollPos = Math.floor($(document).scrollTop());

    if (scrollPos > 290){
    	$("body").addClass('scroll');
    }else{
    	$("body").removeClass('scroll');
    };

    if (scrollPos > sectionOffset[1]){
      $("body").addClass('f_dark_bg');
    }else{
      $("body").removeClass('f_dark_bg');
    };
    if(scrollPos > sectionOffset[3]){
      $("body").removeClass('f_dark_bg');
    };
    if(scrollPos > sectionOffset[5]){
      $("body").addClass('f_dark_bg');
    }
    if(scrollPos > sectionOffset[6]){
      $("body").removeClass('f_dark_bg');
    };

    documentH = $(document).height();
    pct = 100 - scrollPos / documentH * 100 + '%';
    $("#loadbar").css({
      'transform':'translateX(-' + pct + ')'
    });

}

window.onscroll = function(){
  onScroll();
};
window.onload = function(){
  onScroll();
  secHeight();
  windowH = $(window).height();
  windowW = $(window).width();
}
window.onresize = function(){
  secHeight();
  windowH = $(window).height();
  windowW = $(window).width();
}

// window.onload = function(){
//   lazyload();
// };

// All animations will take exactly 500ms
var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 500
});

function textsize(n,o){
	document.getElementById('root').style = 'font-size:' + n + 'px';
	document.getElementById('option_txtsize').childNodes[0].style = 'text-decoration:none';
	document.getElementById('option_txtsize').childNodes[1].style = 'text-decoration:none';
	document.getElementById('option_txtsize').childNodes[2].style = 'text-decoration:none';
	o.style = 'text-decoration:underline';
}

$(function(){
  secHeight();
  $('nav').show();

  $('.f_play').on(tapend,function(){
    $(this).attr('target',(windowW > 1239)?'h5stage':'_blank');
  });

  $('.f_expand').on(tapend,function(){
    $(this).parents('.f_sm').hide().siblings('.hid').show();
  });
});