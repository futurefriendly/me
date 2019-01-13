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

var url = location.search,
    channel = /[?&]channel=([^&]+)/.test(url) && RegExp.$1 || '100052';
    redirectURL = 'http://wap.didialift.com/pinche/publicreg/program/login?regfrom=' + channel +'&regsource=4' 


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
