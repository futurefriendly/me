(function(window) {
    var config = {};

    // 红包链接，上线变更
    config.globalUri = 'http://pay.xiaojukeji.com/new_hb/EHongbao/';
    //config.globalUri = 'http://10.10.8.172:8877/activity/hb/EHongbao/';
    config.defaultLogo = '/static/webapp/images/driver.png';

    // 主题等配置
    config.defaultTheme = {
        name: "默认主题", //主题名称

        chk_share: "1", //开启分享  1:开启  空关闭 
        title: '这是红包分享标题',
        content: '这是红包默认分享内容',
        share_img_url: '', //分享图片url

        chk_sendman: "1", //开启发红包人定制  1:开启  空关闭
        send_name: 'JiangbeiLiu',
        sender_img_url: "", //头像

        chk_bubble: '1',
        bubble_bg: '#fff',
        bubble_opacity: '0.4',

        chk_page_bg: "1", //开启页面背景定制 
        grap_bg_img_url: "", //background_img_url: "",(todo:)
        result_bg_img_url: "", //background_img_url: "",

        con_bg_col: "", //内容层背景颜色
        con_txt_col: "", //内容层文案颜色
        con_hig_col: "", //内容层突出文案颜色
        con_top_height: "", //内容层距顶部高度

        get_bg_color: "#fdf7d8", //领取详情背景颜色
        get_txt_color: "", //领取详情文案颜色 （todo:这个地方有三种颜色）
        get_hig_color: "#ff7a01", //领取详情突出文案颜色
        get_line_color: "#eee", //领取详情分割线颜色

        chk_txt: "1", //开启页面文案定制
        phone: "2014年4月3日第一次使用滴滴打车 送你新用户红包，一起来使用吧~ZZZZ", //输入手机号页
        get_success: "2014年4月3日第一次使用滴滴打车 送你新用户红包，一起来使用吧~", //领取成功页
        get_fail: "", //领取失败页(todo:不同的状态取不同的值)
        other_fail: "", //其他报错页

        chk_down_btn: "1", //1:显示下载滴滴打车
        chk_share_btn: "", //1:显示分享红包给好友
        chk_partner_btn: "1", //1:显示合作方按钮

        btn_name: "第三方AppAA",
        resultbutton_img_url: "http://static.xiaojukeji.com/webapp/images/taxi-w.png" //按钮定制头像

        //todo:合作方按钮的行为链接
        
    };

    // 页面MAP
    config.pageMap = {
        '1': 'page-grap', // 1 表示抢红包输入手机号页面
        '2': 'page-result', // 2 表示抢红包结果页面(服务器端我们没有区分成功，失败等状态，还有一个errno)
        '3': 'page-exception' // 3表示异常页面
    };

    // 抢红包结果页面MAP
    config.resPageStMap = { // 抢红包结果页面各种状态map
        '0': { // 成功
            tip: '恭喜您抢打车券成功了！！！'
        },
        '301': { // 已抢过
            tip: '这是你已经领过的打车券了哦～'
        },
        '302': { // 已抢完 
            tip: '打车券抢光了。别伤心，邀好友坐专车，各得30元。'
        },
        '303': { // 已过期
            tip: '这个打车券过期了。别伤心，邀好友坐专车，各得30元。'
        },
        '304': { // 还不能领
            tip: '打车券还没开抢，晚点再来！'
        },
        '5001':{
            tip: '服务器忙，稍后再试试～'
        },
        '401':{
            tip: '不能再领这个打车券了哦～'
        },
        '305':{
            tip: '运气不够，没领到打车券。别伤心，邀好友坐专车，各得30元。'
        }      
    };

    window.config = config;

})(window);