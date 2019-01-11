/**
 * 统计字段
 */
// feedmsg_add.html 添加吐槽
// PV: msgadd_team-wechat_sw; 发送成功：msgadd-success_team-wechat_ck
// 
// feedmsg_list.html 吐槽列表
// PV: msglist_team-wechat_sw; 发表按钮: msgadd_team-wechat_ck
// 
// feedmsg_view.html 吐槽详情
// PV: msgview_team-wechat_sw
// 
// sendmail.html GM信箱
// PV: sendmail_team-wechat_sw; 发送成功：sendmail-success_team-wechat_ck
// 
// sendmail_success.html 信箱发送成功
// PV: sendmail-success_team-wechat_sw

var _send = DidiMonitor.sendBeatles;

// 发送点击数据
function sendClick(field,href){

    _send(field);
    setTimeout(function(){
        location.href = href;
    }, 300);
}

// 输入框
var $textarea = $("#txtArea");
var $areaMsgLength = $("#txtCount");

//input事件
$textarea.on('input', function() {

    // var val = $(this).val();
    // if (new RegExp('\n').test(val)) {
    //     var indexOf = val.indexOf('\n');
    //     val = val.replace(/\n/g, '');
    //     $(this).val(val);
    // }
    resetLength();
})

//计算长度并显示
function resetLength() {
    $areaMsgLength.html($textarea.val().length);
}

$(function(){

});