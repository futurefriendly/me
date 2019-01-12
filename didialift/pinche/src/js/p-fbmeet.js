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
  var reg=/^1[3|4|5|8|7][0-9]\d{8}$/;
  var phone=$('.nomal_inp');
  // var shiArr=[],shiObj={};
  $('#iwBtn').bind('touchend',function(){
    $('.content_main').hide();
    $('.have_log').show();
  })
  $('#sub_mit').bind('touchend',function(){
    var _this=$(this)
    if(!reg.test(phone.val())){
      phone.addClass('err_inp');
      return;
    }
    if($(this).hasClass('wait_sub')){return}
    $(this).addClass('wait_sub');
    $('#indexForm').submit();
    // $.ajax({
    //   url:'2.php?t='+Math.random(),
    //   data:{"phone":phone.val(),"view":1},
    //   timeout:'3000',
    //   success:function(data){
    //     var json=JSON.parse(data);
    //     json&&showSucc(json);
    //   },error:function(){
    //     _this.removeClass('wait_sub')
    //   }
    // })
  });
  phone.bind('focus',function(){
    if($(this).hasClass('err_inp')){
      $(this).removeClass('err_inp')
    }
  });
  // $('#writeBtn').bind('touchend',function(){
  //   if(!getcheck()){
  //     dd.dialog.alert("诗人不能耍赖，写满3行~");
  //     return;
  //   }
  //   if($('.shu_inp').val()==''){
  //     dd.dialog.alert("诗人请留下尊姓大名")
  //     return;
  //   }
  //   shiArr.length=0;
  //   $('.write_ul .write_in').each(function(){
  //      shiArr.push($(this).val());
  //   });
  //   shiObj["shi_content"]=shiArr;
  //   var str=JSON.stringify(shiObj);
  //   $('#shiContent').val(str);
  //   $('#write_form').submit();
  // });
  // $('.show_opadiv').bind('touchend',function(){
  //   $(this).hide();
  // });
  // $('.left_btn').bind('touchend',function(){
  //   $('.show_opadiv').show();
  // });
  // function getcheck(){
  //   var b = true;
  //   $('.write_in').each(function(){
  //     if($(this).val()==''){
  //       b = false;
  //     }
  //   })
  //   return b;
  // }
  // function showSucc(data){
  //   if(!data.errno){
  //     $('.bottomdiv').hide();
  //     $('.have_log').hide();
  //     $('.showEnd').show();
  //     var pt_user=$('#pt_user'),mt_user=$('#mt_user')
  //     if(data.page==2){
  //       pt_user.show();
  //       pt_user.find('h2').text('Hi,'+data.nick+'('+data.phone+')');
  //       $('.orang_big').text(data.countdown.day);
  //       $('.txt_org').text(data.phone);
  //       $('.have_two .left_btn').text(data.button[0].text);
  //       $('.have_two .right_btn').text(data.button[1].text).attr('href',data.button[1].link);
  //     }
  //     else if(data.page==1){
  //       mt_user.show();
  //       mt_user.find('h2').text('Hi,'+data.nick);
  //       $('.orang_big').text(data.countdown.day);
  //       $('.have_one .left_btn').text(data.button[0].text);
  //     }else{alert('页面出错，请重新刷新')}
  //   }else{
  //     $('#sub_mit').removeClass('wait_sub');
  //     alert('数据出错，请重新刷新');
  //   }
  // }
})