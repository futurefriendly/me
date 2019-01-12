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

/*
* 注意：
* 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
* 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
* 3. 常见问题及完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
*
* 开发中遇到问题详见文档“附录5-常见错误及解决办法”解决，如仍未能解决可通过以下渠道反馈：
* 邮箱地址：weixin-open@qq.com
* 邮件主题：【微信JS-SDK反馈】具体问题
* 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
*/
wx.config({
  debug: false,
  appId: 'wxf8b4f85f3a794e77',
  timestamp: 1446434325,
  nonceStr: 'wXi9iJ2JnQtJf5Cu',
  signature: '9cbd44de76372e964076976891ad966009a90c24',
  jsApiList: [
    'checkJsApi',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'playVoice',
    'onVoicePlayEnd',
    'pauseVoice',
    'stopVoice',
    'uploadVoice',
    'downloadVoice',
    'chooseImage',
    'previewImage',
    'uploadImage',
    'downloadImage',
    'getNetworkType',
    'openLocation',
    'getLocation',
    'hideOptionMenu',
    'showOptionMenu',
    'closeWindow',
    'scanQRCode',
    'chooseWXPay',
    'openProductSpecificView',
    'addCard',
    'chooseCard',
    'openCard'
  ]
});

$(function(){

});