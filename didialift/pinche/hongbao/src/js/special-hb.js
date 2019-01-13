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
var 
    
    teshu_div_01=$('#teshu_div_01')
    ,sub_btn=$('#sub_btn')
    ,fixjump_div=$('#fixjump_div')
    ,tipsTxt=$('#tipsTxt')
    ,close_jump=$('#close_jump')
    ,getPhone=$('#getPhone')

    ,hastouch = 'ontouchstart' in window ? true:false
    ,tapend = hastouch?'touchend':'click'
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
  replyfn:function(){
    sub_btn.bind(tapend,function(){
      var oPost={};
      var _this=$(this);
      if($(this).hasClass('hover') || $(this).attr('disabled').length){return}
        $(this).addClass('hover');
      if(loadVar.need_phone==0){
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
          oPost={"phone":getPhone.val()}
          if($(this).hasClass('hover')){return}
          $(this).addClass('hover');
          newHb.goAjax(oPost,_this);
        })
      }
      
    });
    $('.close_btn').bind(tapend,function(){
      $(this).parent().hide();
      fixjump_div.hide();
    });
    $('.close_jump').bind(tapend,function(){
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
    
  },
  getCode:function(json){
    var listlen=null;
    switch(json.status){
      case 0:
        var state_0=$('#state_0');
        // listlen=json.list_info.length;
        // fixjump_div.show();
        // if(json.bonus_type=='shunfengche'){
        //   state_0.find('.top_p').text('送你1张滴滴顺风车代金券');
        //   state_0.find('.have_q').text(json.amount+'元乘车券').show();
        //   $('#for_server').text('顺风车');
        // }
        // else if(json.bonus_type=='zhuanche'){
        //   state_0.find('.top_p').text('送你1张滴滴专车代金券');
        //   state_0.find('.itNum').text(json.int_num);
        //   state_0.find('.ftNum').text(json.float_num);
        //   state_0.find('.top_zcq span').text(json.amount);
        //   state_0.find('.have_zcq').show();
        //   $('#for_server').text('专车');
        // }
        // else if(json.bonus_type=='daijia'){
        //   state_0.find('.top_p').text('送你1张滴滴代驾代金券');
        //   $('#for_server').text('代驾');
        //   state_0.find('#djMoney').text(json.amount);
        //   var strtxt=json.instructions;
        //   if(strtxt.length>10){
        //     strtxt=strtxt.substring(0,10)+'...';
        //   }
        //   state_0.find('#djTxt').text(strtxt);
        //   state_0.find('.have_daijia').show();
        // }
        // $('#my_phone').text(json.phone);
        // $('#state_0').show();
        // $('#change_phone').attr('href',json.modify_button_url);
        // sub_btn.attr('disabled','disabled');
        teshu_div_01.hide();
        if(json.amount!=0){
          tipsTxt.show().find('.havequan span').text(json.amount);
        }
        else{
          tipsTxt.find('.newAdddiv').hide();
          tipsTxt.show().find('.newAddimg').show();
        }
        _send('specialhbpage20160323-pv_index_ck',null,true);
        // json.amount//券金额
        // for(var i=0;i<listlen;i++){
        //   friend_list.append(newHb.creatList(json.list_info[i]));
        // }
        break;
      case 1:
        fixjump_div.hide();
        sub_btn.attr('disabled','disabled');
        tipsTxt.show();
        teshu_div_01.hide();
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
  domUnload:function(){
      if(location.href.indexOf('?')>0){
        history.replaceState({}, document.title,location.search + '&a='+ Date.now() )
      }
  },
  
  init:function(){
      newHb.writezdata();
      newHb.replyfn();
      newHb.domUnload();
  }
}
  newHb.init()
})