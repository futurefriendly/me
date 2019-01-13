(function(){

var version, mainVersion, qrImage;

// $.browser.ie = 1;
// $.browser.version = '9.1.3';

if($.browser.ie) {
    version = $.browser.version;
    mainVersion = parseInt(version);
    // Goto orangeday index page directly
    if(mainVersion <= 8) {
        return;
    }
}

var url = location.href,
    invitePhone = /[?&](invitephone=[^&]+)/.test(url) && RegExp.$1 || '',
    channel = /[?&](channel=[^&]+)/.test(url) && RegExp.$1 || '',
    redirectURL = 
        invitePhone 
            ? 'http://wap.didialift.com/pinche/orangemonday/index/share'
                + '?' + channel + '&' + invitePhone
            : 'http://wap.didialift.com/pinche/orangemonday/index/index'
                + '?' + channel;

console.log(redirectURL);

$('.qr-cont img').remove();
$('.qr-cont').append(
    showQRCode(
        redirectURL
        , {
            QRCodeVersion: 6
            , padding: 0
        }
    )
);

})();
