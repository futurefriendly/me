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
    sectionOffset[i] = Math.floor($('section:eq('+ i +')').offset().top)
  }
}

function onScroll(){

    scrollPos = Math.floor($(document).scrollTop());

    if (scrollPos > 290){
    	$("body").addClass('scroll');
    }else{
    	$("body").removeClass('scroll');
    };

    if (scrollPos > sectionOffset[2]){
      $("body").addClass('f_dark_bg');
    }else{
      $("body").removeClass('f_dark_bg');
    };
    if(scrollPos > sectionOffset[4]){
      $("body").removeClass('f_dark_bg');
    };
    if(scrollPos > sectionOffset[7]){
      $("body").addClass('f_dark_bg');
    };
    if(scrollPos > sectionOffset[8]){
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
  speed: 1000
});

function textsize(n,o){
	$('html').removeClass('f_font14 f_font16 f_font18').addClass('f_font' + n);
	document.getElementById('option_txtsize').childNodes[0].style = 'text-decoration:none';
	document.getElementById('option_txtsize').childNodes[1].style = 'text-decoration:none';
	document.getElementById('option_txtsize').childNodes[2].style = 'text-decoration:none';
	o.style = 'text-decoration:underline';
  secHeight();
}

$(function(){
  // // queryLoader
  // $("body").css("overflow","hidden").append("<style>@keyframes loadingbar{0%{background-position:0 0}0%{background-position:-1200% 0}}</style><div id=\"bodyloadwrap\" style=\"position:absolute; position:fixed; width:100%;height:100%; top:0; left:0;background:#fff;z-index:1000000;text-align:center;font-family:Georgia,serif;color:#fff\"><div style=\"position:absolute;left:50%;top:38%;margin-left:-145px;width:290px;overflow:hidden;padding-right:2px;animation:loadingbar 80s linear infinite;background:#000 linear-gradient(45deg, #000 0%,#000 25%,#222 25%,#222 50%,#000,50%,#000 75%,#222 75%,#222 100%) 0px 0 repeat;background-size:1.2rem 1.2rem\"\><p style=\"margin:0;height:1.2rem; line-height:1.2rem; top:-2rem;font-size:1rem;font-family:Georgia,serif\">Hello, This is Dongfang.<\/p><div id=\"bodyload\" data-progress=\"0\" style=\"position:absolute;left:0;top:0; height:1.2rem;width:105%;mix-blend-mode:difference;background:#fff;transform:translateX(0) skewX(15deg)\"><\/div><\/div><div style=\"position:absolute;width:100%;bottom:2rem;left:0;color:#000;font-size:.875rem\">Visit <a href=\"https://futurefriendly.gitee.io/designer/\"><u>the mirror website<\/u><\/a> (for slow connections).<\/div><\/div>");
  // $("body").queryLoader2({
  //   barColor: "#000",
  //   backgroundColor: "#fff",
  //   percentage: false,
  //   barHeight: 0,
  //   minimumTime: 500,
  //   maxTime: 60000,
  //   fadeOutTime: 500,
  //   onProgress: function(){
  //     $('#bodyload').css({
  //       "transform" : "translateX(" + $("#bodyload").attr("data-progress") + "px) skewX(15deg)"
  //     }).attr({
  //       "data-progress" : Math.floor($("#bodyload").attr("data-progress")) + 4
  //     });
  //   },
  //   onComplete: function(){
  //     $('#bodyloadwrap').fadeOut();
  //     $('body').css("overflow","auto");
  //   }
  // });

  secHeight();
  $('nav').show();

  $('nav a').on(tapend,function(){
    secHeight();
  });

  $('.f_play').on(tapend,function(){
    $(this).attr('target',(windowW > 1239)?'h5stage':'_blank');
  });

  $('.f_display').on(tapend,function(){
    $('#scene .layer').remove();
    $('#showexp').css('opacity','1');
    $('#showexp')[0].play();
  });

  $('.f_expand').on(tapend,function(){
    $(this).parents('.f_sm').hide().siblings('.hid').show();
  });
  
  $('.f_owl-carousel_map').owlCarousel({
    autoplay:false,
    smartSpeed:250,
    loop:false,
    lazyLoad:true,
    margin:20,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:1
        }
    }
  });
  
  $('.f_owl-carousel_designsystem').owlCarousel({
    autoplay:false,
    smartSpeed:250,
    loop:true,
    lazyLoad:true,
    margin:20,
    responsive:{
        0:{
            items:1
        },
        800:{
            items:2
        }
    }
  });
  
  $('.f_owl-carousel_pku').owlCarousel({
    autoplay:false,
    smartSpeed:250,
    loop:false,
    lazyLoad:true,
    margin:20,
    responsive:{
        0:{
            items:1
        },
        480:{
            items:1
        }
    }
  });
  
  $('.f_owl-carousel_ufo').owlCarousel({
    autoplay:false,
    smartSpeed:250,
    loop:true,
    lazyLoad:true,
    margin:20,
    responsive:{
        0:{
            items:2
        },
        600:{
            items:3
        }
    }
  });
  
  $('.f_owl-carousel_wb').owlCarousel({
    autoplay:true,
    smartSpeed:250,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    loop:true,
    lazyLoad:true,
    margin:20,
    responsive:{
        0:{
            items:1
        },
        800:{
            items:2
        }
    }
  });
  
  $('.f_owl-carousel_dd').owlCarousel({
    autoplay:false,
    smartSpeed:100,
    loop:true,
    lazyLoad:true,
    margin:20,
    responsive:{
        0:{
            items:2
        },
        800:{
            items:4
        },
        1240:{
            items:5
        }
    }
  });

  $("#h5stage").attr("src","https://www.futurefriendly.cn/ds/page/invitation2016.html");

});