define("page/complain/main.js",function(i,e){e.init=function(){function i(i){"type1"==i?($("#type2").removeClass("on").addClass("off"),$("#type1").removeClass("off").addClass("on"),$("#sslx").val(1)):($("#type1").removeClass("on").addClass("off"),$("#type2").removeClass("off").addClass("on"),$("#sslx").val(2))}$("#type1,[for='type1']").click(function(){i("type1")}),$("#type2,[for='type2']").click(function(){i("type2")}),$("#btn-submit").click(function(){var i=$.trim($("#username").val()),e=$.trim($("#phone").val()),t=$.trim($("#car_number").val()),o=$.trim($("#reason").val()),n=$.trim($("#complain_time").val()),a=$.trim($("#info").val()),d=$(this);return""==i?void dd.dialog.alert("请输入姓名"):/^1[3|4|5|8|7][0-9]\d{8}$/.test(e)?/^[\u4E00-\u9FFF]+$/.test(a)?""==t?void dd.dialog.alert("请输入车牌号码"):""==o?void dd.dialog.alert("请输入申诉理由"):o.length>200?void dd.dialog.alert("申诉理由超出200字数限制，请缩短申诉文字。"):void($(this).hasClass("hover")||($(this).addClass("hover"),$.ajax({type:"POST",url:"/pinche/complain/add",data:{phone:e,type:$("#sslx").val(),username:i,complain_time:n,reason:o,car_number:t,info:a},dataType:"json",timeout:"5000",success:function(i){console.log(i),d.removeClass("hover"),dd.dialog.alert(0==i.errno?{tip:"请确认以上信息属实且在滴滴顺风车平台无任何作弊行为，如有信息捏造、作假或作弊，滴滴顺风车将加重处罚，甚至永久封禁。",btn:{val:"我同意",handler:function(){$(".jump_div,.right_div").show()}}}:i.errmsg)},error:function(){d.removeClass("hover"),$(".jump_div,.err_div").show()}}))):void dd.dialog.alert("请输入正确的城市名称"):void dd.dialog.alert("请输入正确的手机号码")}),$("#btn").bind("click",function(){$(".jump_div,.right_div,.err_div").hide()}),$(".no_img").bind("click",function(){$(this).hide(),$(".ok_img").show(),$("#next_btn").removeClass("greybtn")}),$(".ok_img").bind("click",function(){$(this).hide(),$(".no_img").show(),$("#next_btn").addClass("greybtn")}),$("#next_btn").bind("click",function(){$(this).hasClass("greybtn")||$(".first_div").hide()})}});