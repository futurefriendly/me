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
//$(function(){
var 
    // left_txtPa=$('#left_txtPa')
    // ,right_txtPa=$('#right_txtPa')
    // ,xhb_div=$('#xhb_div')
    // ,ck_info=$('#ck_info')
    // ,cz_info=$('#cz_info')
    // ,trip_info=$('#trip_info')
    friend_list=$('#friend_list')
    // ,car_info=$('#car_info')
    // ,trip_info=$('#trip_info')
    ,write_input=$('#write_input')
    ,sub_btn=$('#sub_btn')
    ,fixjump_div=$('#fixjump_div')
    ,tipsTxt=$('#tipsTxt')
    ,close_jump=$('#close_jump')
    ,getPhone=$('#getPhone')
    ,myScroll
;var newHb={
  writezdata:function(){
    
    //写入第二个按钮的文案
    if(typeof theme_config == 'object' && theme_config.extra_btn.btn_extra_name.length!=0){
      $("#second_btn").attr('href',theme_config.extra_btn.btn_extra_link);
      $("#second_btn").text(theme_config.extra_btn.btn_extra_name);
    }
    else{
      $("#second_btn").parent().hide();
    }
  },
  addtips:function(arr){
    var arr1=[],obj=null;
    for(var i=0;i<arr.length;i++){
      arr1.push('<p>'+arr[i]+'</p>');
    }
    obj=arr1.join('');
    return obj;
  },
  replyfn:function(){
    sub_btn.bind('click',function(){
      var value=write_input.val()||write_input.attr('placeholder');
      var oPost={};
      var _this=$(this);
      if($(this).hasClass('hover')){return}
        $(this).addClass('hover');
      if(loadVar.need_phone==0){
        oPost={reply_words:value}
        newHb.goAjax(oPost,_this);
      }
      else{
        $(this).removeClass('hover');
        fixjump_div.show();
        $('#state_input').show();
       
        $('#get_djq').bind('click',function(){
          _this=$(this);
          if (!/^1[3|4|5|8|7][0-9]\d{8}$/.test(getPhone.val())) {
                return;
          }
          value=write_input.val()||write_input.attr('placeholder');
          oPost={"reply_words":value,"phone":getPhone.val()}
          console.log(oPost);
          if($(this).hasClass('hover')){return}
          $(this).addClass('hover');
          newHb.goAjax(oPost,_this);
        })
      }
      
    });
    $('.close_btn').bind('click',function(){
      $(this).parent().hide();
      fixjump_div.hide();
    });
    $('.close_jump').bind('click',function(){
      $(this).parents('.fix_son').hide();
      fixjump_div.hide();
    });
    getPhone.bind('input',function(){
      if (/^1[3|4|5|8|7][0-9]\d{8}$/.test(getPhone.val()) && getPhone.val().length==11) {
            $('#get_djq').removeClass('btn-gray').addClass('btn-orange');
      }
      else{
          $('#get_djq').removeClass('btn-orange').addClass('btn-gray');
      }
    });
    $('.yyw_div a').bind('touchend',function(){
      location.href=$(this).attr('href');
    });

  },
  getCode:function(json){
    var listlen=null;
    switch(json.status){
      case 0:
        listlen=json.list_info.length;
        fixjump_div.show();
        $('#state_0 .have_q').text(json.amount+'元乘车券');
        $('#my_phone').text(json.phone);
        $('#state_0').show();
        $('#change_phone').attr('href',json.modify_button_url);
        sub_btn.attr('disabled','disabled');
        write_input.attr('disabled','disabled');
        friend_list.html('');
        for(var i=0;i<listlen;i++){
          friend_list.append(newHb.creatList(json.list_info[i]));
        }
        newHb.isScroll();
        break;
      case 1:
        fixjump_div.hide();
        sub_btn.attr('disabled','disabled');
        write_input.attr('disabled','disabled');
        tipsTxt.text('你已经领过代金券了').show();
        newHb.isScroll();
        break;
      case 2:
        fixjump_div.show();
        $('#state_2').find('.top_p').text('手慢了，代金券已经被抢完');
        $('#state_2').find('.no_djq img').attr('src','/static/pinche/hongbao/src/images/nhb_img_10.png');
        $('#state_2').show();
        break;
      case 3:
        fixjump_div.show();
        $('#state_err').find('.fwq_down img').attr('src','/static/pinche/hongbao/src/images/nhb_img_11.png');
        $('#state_err').show();
        $('#state_err').find('.top_p').text('对不起，代金券还未开始');
        break;
      case 4:
        fixjump_div.show();
        $('#state_err').find('.fwq_down img').attr('src','/static/pinche/hongbao/src/images/nhb_img_11.png');
        $('#state_err').show();
        $('#state_err').find('.top_p').text('对不起，代金券已过期');
        break;
      case 5:
        fixjump_div.show();
        $('#state_err').find('.fwq_down img').attr('src','/static/pinche/hongbao/src/images/nhb_img_11.png');
        $('#state_err').show();
        $('#state_err').find('.top_p').text('对不起，手气不好，没有领到');
        break;
    }
  },
  goAjax:function(oPost,_this){
    var _dialog = dd.dialog.loading("请求中，请稍后...");
    $.ajax({
        type:'GET',
        url:loadVar.button_url,
        data:oPost,
        dataType:'json',
        timeout:'5000',
        success:function(json){
          console.log(json);
          _dialog.hide();
          _this.removeClass('hover');
          if($('#state_input').css('display')=='block'){
            $('#state_input').hide();
          }
          if($('.noper_get').css('display')=='block'){
            $('.noper_get').hide();
          }
          if(json.errno==0){
            newHb.getCode(json);
          }
          else{
            fixjump_div.show();
            $('#state_err').find('.top_p').text(json.errmsg);
            $('#state_err').find('.fwq_down img').attr('src','/static/pinche/hongbao/src/images/nhb_img_11.png')
            $('#state_err').show();
          }
        },
        error:function(){
            fixjump_div.show();
            _dialog.hide();
            $('#state_err').find('.fwq_down img').attr('src','/static/pinche/hongbao/src/images/nhb_img_11.png')
            $('#state_err').show();
            _this.removeClass('hover');
        }
      })
  },
  creatList:function(json){
    var arr=[],obj=null;
    arr.push('<li><span class="left_span"><img src="'+json.headimgurl+'" alt=""></span>');
    arr.push('<div class="right_div"><p class="top_txt"><span>'+json.floor+'</span>'+json.nickname+'<span>'+json.create_time+'</span></p>');
    arr.push('<div class="have_arrow"><i></i>'+json.reply_words+'<span class="add_djq">+'+json.amount+'元</span></div></div></li>');
    obj=arr.join('');
    return obj;
  },
  creatJump:function(options){
    // var h1='回复成功'||options.htxt,
    // obj=null,arr=[];
    // arr.push('<div class="fix_son" id="state_0"><div class="close_btn"><img src="/static/pinche/hongbao/src/images/nhb_img_09.png" alt=""></div>');
    // arr.push('<h1>'++'</h1>')
  },
  domUnload:function(){
      if(location.href.indexOf('?')>0){
        history.replaceState({}, document.title,location.search + '&a='+ Date.now() )
      }
  },
  isScroll:function(){
    myScroll = new IScroll('#wrapper', { 
      useTransition: true
    });
    setTimeout(function(){
      myScroll.refresh();
    }, 100);

    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    // if(/iphone/i.test(navigator.userAgent)){
    //   write_input.bind('focus',function(){
    //     $('.xhb_div_04').css('position','absolute');
    //     $('.xhb_div_04').animate({'top':$(window).scrollTop()+$(window).height()-$('.xhb_div_04').height()},500);
    //     // $('.xhb_div_04').css({'top':$(window).scrollTop()+$(window).height()-$('.xhb_div_04').height(),'bottom':'auto'})
    //     $(window).bind('scroll',function(){
    //       $('.xhb_div_04').css({'top':$(window).scrollTop()+$(window).height()-$('.xhb_div_04').height(),'bottom':'auto'})
    //     })
    //   }).bind('blur',function(){
    //     $('.xhb_div_04').css({'position':'fixed','bottom':0,'top':'auto'});
    //     $(window).unbind('scroll')
    //   });
    // }
    var _wHeight=$(window).height();
    var _eHeight=$('.xhb_div_04').height();
    $('#wrapper').height(_wHeight-_eHeight);
  },
  cireImg:function(){
    $('#cz_info img').css('height',$('#cz_info img').width());
    $('#ck_info img').css('height',$('#ck_info img').width());
  },
  isAndroid:function(){
    if(/Android/.test(navigator.appVersion)){
        $('.xhb_div_04').css('position','fixed');
    }
  },
  init:function(){
    // if(loadVar.errno==0){
      newHb.writezdata();
      newHb.replyfn();
      newHb.domUnload();
      newHb.isScroll();
      newHb.cireImg();
      newHb.isAndroid();
      $(window).bind('resize',function(){
        newHb.cireImg();
      });
    // }
  }
}
  newHb.init()
//})