(function(window) {
    var config = {};

    // 红包链接，上线变更
    //config.globalUri = 'http://pay.xiaojukeji.com/veyron/market_entry/hbrob/';
    config.globalUri = 'http://10.94.100.66:8000/veyron/market_entry/hbrob/';
    config.defaultLogo = '/static/webapp/images/driver.png';
    config.themeUri = 'http://pay.xiaojukeji.com/veyron/market_entry/proxyApi/getHongbaoThemeBgFromTestDrive?instance_id=';
    //config.themeUri = 'http://10.10.36.132:8882/veyron/market_entry/proxyApi/getHongbaoThemeBgFromTestDrive?instance_id='

    // 主题等配置
    config.defaultTheme = {
        "name": "默认主题",
        "chk_share": "1", //开启分享定制  1:开启，0：关闭
        "share_title": "小伙伴们，快来领滴滴红包吧！", //标题
        "share_cont": "滴滴叫车快，红包还能抵车费，来试试！", //内容
        "share_img_url": "http://static.diditaxi.com.cn/activity/img-hb/v2/share_default.png", //图

        "chk_weibo": "1", //微博定制
        "weibo_cont": "＃滴滴红包＃分享滴滴红包，@滴滴出行官方微博，可赢取神秘大奖！",
        "weibo_img_url": "http://static.diditaxi.com.cn/activity/img-hb/v2/share_default.png",

        "chk_sendman": "1", //开启发红包人定制
        "sendman_attr": "1", //0：投放平台自带sns属性 1：自定义头像及昵称
        "send_name": "滴滴",
        "send_img_url": "http://static.diditaxi.com.cn/activity/img-hb/v2/head_default.png",
        "tel_head_opacity": "1", //头像透明度,

        "tel_bub_txt": "送你滴滴出行券，赶快来领么么哒~", //气泡文案
        "tel_bub_col": "rgba(255,255,255,0)", //气泡内文字颜色
        "tel_btn_txt": "领取打车券",
        "tel_bg_url": "http://static.diditaxi.com.cn/activity/img-hb/v3/grap_before.png",

        //领取结果页面
        "res_succ": "恭喜你抢到了我的红包，下次打车用滴滴呗！", //领取成功页
        "res_finish": "红包已领光了，下次早点啦~",
        "res_bub_txt_col": "rgba(255,255,255,0.8)",
        "res_bub_bg_col": "rgba(0,0,0,0.8)",
        "res_bg_url": "http://static.diditaxi.com.cn/activity/img-hb/v3/grap_after.png",

        //活动说明
        "chk_activity": "1",
        "act_title": "活动说明",
        "act_cont": "这里就是活动说明哟",
        "act_col": "rgba(255,255,255,0.8)",
        "act_bg": "rgba(0,0,0,0.8)",

        //红包领取记录
        "get_record": "1", //0:无领取记录 1:有领取记录
        "record_count": "20", //记录条数上限
        "record_bg": "rgba(0,0,0,0.8)",
        "record_col": "rgba(255,255,255,0.8)", //领取记录区字色

        //结果页按钮区
        "btn_bub_bg": "rgba(255,255,255,0.8)",
        "chk_btn_01": "1",
        "btn_name_01": "这是按钮",
        "btn_link_01": "https://www.baidu.com/", //按钮链接

        "chk_btn_02": "1",
        "btn_name_02": "还是按钮",
        "btn_link_02": "https://www.baidu.com/", //按钮链接

        "chk_btn_03": "1",
        "btn_name_03": "按钮真多",
        "btn_link_03": "https://www.baidu.com/", //按钮链接

        "chk_btn_04": "1",
        "btn_name_04": "按钮名称",
        "btn_link_04": "https://www.baidu.com/" //按钮链接
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
            tip: '恭喜您抢红包成功了！！！'
        },
        '10301': { // 已抢过
            tip: '这是你已经领过的红包了哦～'
        },
        '10302': { // 已抢完 
            tip: '红包抢光了。别伤心，邀好友坐专车，各得30元。'
        },
        '11006': { // 已过期
            tip: '这个红包过期了。别伤心，邀好友坐专车，各得30元。'
        },
        '304': { // 还不能领
            tip: '红包还没开抢，晚点再来！'
        },
        '5001': {
            tip: '服务器忙，稍后再试试～'
        },
        '401': {
            tip: '不能再领这个红包了哦～'
        },
        '10305': {
            tip: '运气不够，没领到红包。攒人品下次领大的~'
        }
    };

    config.commentList = ['感谢，以后打车就靠你了', '真棒，拿券抵车费赚到啦', '哦耶，抢红包的姿势很重要', '哈哈，今天我人品大爆发', '多谢，我用滴滴已经很久了'];
    window.config = config;

})(window);