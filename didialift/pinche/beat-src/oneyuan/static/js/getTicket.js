
$('.phone').on('focus', function () {
    hideLoading();
});

function getTicket(onsuccess) {
    var $phone = $('.phone'),
        $tip = $('.tip'),
        $id = $('.tip span'),
        number = $phone.val(),
        $btnGet = $('.btn-get');

    if (/^1\d{10}$/
        .test(number)) {

        hideError();
        showLoading();

        $.ajax({
            type: 'POST'
            , url: '/pinche/oneyuannew/bingcoupon'
            , dataType: 'json'
            , data: $.param({
                    phone: number
                })
            , success: function (resp) {
                /*
                 *   {"errno":0,"errmsg":"\u6210\u529f","phone":false} 
                 * 
                 * errno:  
                 *   const ERROR_SUCCESS         = 0;
                 *   const ERROR_PARAMS          = 1001;    //非法参数
                 *   const ERROR_PHONE           = 1002;
                 *   const ERROR_COUPON_FAIL     = 1003;
                 *   const ERROR_ALREADY       = 1004;

                 *   private $errorMsg = array(
                 *       self::ERROR_PARAMS      => '非法参数',
                 *       self::ERROR_PHONE       => '手机号码格式错误',
                 *       self::ERROR_COUPON_FAIL => '领券失败',
                 *       self::ERROR_ALREADY   => '已经领券',
                 *   );
                 */
                if(resp && 0 == resp.errno) {
                    $id.html(number.replace(/(\d{3})\d{6}(\d{2})/g, '$1******$2'));
                    onsuccess && onsuccess();
                }
                else if(resp && 1004 == resp.errno) {
                    $tip.html('你已经领过券了，不要太贪心哦');
                    onsuccess && onsuccess();
                }
                else {
                    hideLoading();
                    showServerError();
                }
            } 
            , error: function () {
                showServerError();
                console.log('connection error');
            } 
        });
    }
    else {
        showError();
    }
}

function showServerError () {
    $('.btn-get')
        .html('连接失败');
}

function showError () {
    var $phone = $('.phone');

    $phone.css('border-color', '#f00');
}

function hideError () {
    var $phone = $('.phone');

    $phone.css('border-color', '#fff');
}

function showLoading(){
    $('.btn-get').addClass('loading')
        .html('&nbsp;'); 
}

function hideLoading(){
    $('.btn-get').removeClass('loading')
        .html('领取顺风车券'); 
}

