(function(root, undefined) {
    var doc = root.document,
        base = dd.base,
        dialog = dd.dialog,
        $ = function(selector, context) {
            var arr = (context || doc).querySelectorAll(selector);
            if (arr) {
                switch (arr.length) {
                    case 0:
                        return;
                    case 1:
                        return arr[0];
                }
            }
            return arr;
        },
        hasClass = function(el, clz) {
            return el ? new RegExp("\\b" + clz + "\\b").test(el.className) : false;
        },
        dom = {
            show: function(el) {
                el && (el.style.display = "block");
            },
            hide: function(el) {
                el && (el.style.display = "none");
            }
        };

    var mainEl = $("#main"),
        footEl = $("#foot"),
        treeEl = $("#tree"),
        rewardDescEl = $("#rewardDesc"),
        btnExplainEl = $("#btnExplain"),
        hd_dataEl = $("#hd_data"),
        guideEl = $("#guide"),
        snowBgEl = $("#snowBg");

    var paths = {
            v2Api: 'http://diditaxi.com.cn/api/v2/',
            imall: 'http://imall.diditaxi.com.cn/imall/'
        },
        netErrMsg = "网络不稳定，请稍后再试～",
        pageData = {},
        urlParams = base.getQueryStr(),
        notGetGiftErrmsg,
        getRandom = function(min, max) {
            return min + Math.round(Math.random() * max - min);
        },
        getUrl = function(action) {
            if (location.pathname.indexOf("christmas/") > 0)
                return action;
            return 'christmas/' + action;
        },
        rewardUtil = {
            phones: ['186****3908', '138****8615', '187****6563', '153****2799', '155****9022', '183****4074', '138****8017', '189****1958', '181****1922', '136****1930', '150****4411', '186****1974', '186****1318', '183****8853', '158****1363', '180****7976', '151****2122', '186****7935', '139****8559', '152****6357', '187****0223', '131****7852', '150****3645', '189****7650', '135****5725', '158****8159', '138****6173', '136****1371', '138****8870', '186****7229', '150****1890', '138****5217', '181****6555', '152****5607', '135****4544', '130****3818', '189****0879', '155****2227', '130****8999', '150****9191', '133****6658', '151****0222', '155****8776', '180****3063', '134****6486', '159****8007', '135****4445', '133****1133', '135****5816', '135****9897', '150****9779', '186****0003', '136****0986', '156****0119', '188****3882', '134****2068', '136****2041', '139****3712', '139****2658', '181****9002', '132****7089', '131****0769', '185****1660', '153****3220', '156****0203', '158****1315', '186****7371', '136****7546', '135****0064', '139****5353', '136****0179', '131****2199', '188****5411', '137****2736', '150****7865', '136****9118', '186****4997', '138****0770', '183****5669', '159****2844', '137****3947', '133****2898', '135****2444', '189****1882', '187****7799', '188****3543', '187****5679', '187****7171', '150****2500', '156****1166', '136****0222', '136****5280', '189****7602', '158****9808', '186****8800', '150****6602', '139****0218', '138****7732', '130****4244', '186****9414', '158****3379', '185****6671', '180****1588', '187****3605', '159****4972', '186****1040', '132****2350', '158****8692', '135****0567', '152****4435', '187****8891', '137****3606', '130****4415', '134****7836', '188****4795', '133****7031', '159****0713', '137****4620', '180****9466', '137****4757', '186****5757', '138****3902', '138****8808', '159****3340', '138****4077', '186****8622', '182****6543', '159****7835', '185****3116', '152****9564', '132****4712', '130****4321', '156****1822', '135****0521', '139****9910', '131****7766', '138****3151', '136****0343', '153****4290', '153****0429', '131****6378', '139****4287', '137****0824', '131****9707', '134****3039', '185****9697', '185****3321', '132****9267', '186****9735', '186****7616', '159****6776', '136****2967', '131****5320', '137****5178', '158****1653', '159****1947', '186****9903', '186****6006', '153****1888', '131****1777', '187****2171', '183****8662', '155****5599', '136****8248', '130****9190', '131****9597', '156****5569', '158****0663', '132****8566', '136****9055', '186****0660', '189****0835', '186****1309', '152****6624', '156****6004', '137****0377', '139****2076', '155****6973', '182****7888', '137****5876', '138****6293', '186****7113', '153****6555', '138****6912', '188****9255', '187****3032', '158****0823', '186****2233', '186****0055', '153****8579', '150****1844', '186****3116', '135****2123', '136****9591', '186****2845', '132****8107', '181****9835', '186****2055', '138****9924'],
            descs: ['5元出租车代金券', '我买网10元满减券', '鲜LIFE星星泡芙', '8元出租车代金券', '爱宝乐空气净化器', '来伊份5元满减券', '网易火车票', '麻库50元满减券', '10元出租车代金券', '新浪彩票10元礼包', '迪士尼儿童保温杯', '15元专车代金券', '马良行100元代金券', '每日优鲜10元代金券', 'Ferragamo香水', '20元专车代金券', 'SWAROVSKI项链', '化妆品100元代金券', '君乐宝菌粉40元代金券', '30元专车代金券', '嗨茶网20元现金券', '古方红糖10元代金券', '荣耀3C畅玩版', '小狗净化器'],
            getRandomInfo: function() {
                var _phones = this.phones,
                    _descs = this.descs;

                return {
                    phone: _phones[getRandom(0, _phones.length - 1)],
                    desc: _descs[getRandom(0, _descs.length - 1)]
                };
            }
        };

    function getGift() {
        if (notGetGiftErrmsg)
            return dialog.alert(notGetGiftErrmsg);

        dialog.loading({
            time: 1
        });
        setTimeout(function() {
            dom.show($("#d-wall"));
            dom.show($("#d-wrap"));
        }, 5);

        base.ajax({
            method: "POST",
            data: pageData,
            url: getUrl("getAward"),
            succFunc: function(res) {
                dom.hide($("#d-wall"));
                dom.hide($("#d-wrap"));
                res = base.txtToJson(res);

                switch (res.errno) {
                    case 0:
                        showGiftDetail(res.data);
                        break;
                    case 1001: //手机号不正确
                    case 1002: //token验证失败
                        res.errmsg = "";
                        var redirecturl = encodeURIComponent(location.href + (location.href.indexOf("?") > -1 ? "&" : "?") + "fromlogin=1");
                        location.href = paths.v2Api + "weixinapi?openid=thisisopenid&page=phonecode&phone=" + pageData.phone + "&redirecturl=" + redirecturl;
                        break;
                    case 1003: //活动己结束
                    case 1004: //一天只能抽奖2次
                        notGetGiftErrmsg = res.errmsg;
                        break;
                }
                res.errmsg && dialog.alert(res.errmsg);
            },
            failFunc: function() {
                dialog.alert(netErrMsg);
            }
        });
    }

    //自动显示获奖信息
    function autoShowReward() {
        var setReward = function() {
            var info = rewardUtil.getRandomInfo();
            rewardDescEl.innerHTML = info.phone + " " + info.desc;
        };

        setReward();
        setInterval(function() {
            setReward();
        }, 3000);
    }

    //显示活动说明
    function showHelp() {
        var dialog = dd.dialog.Fn({
            type: "",
            tip: {
                txt: [
                    '<div class="head"></div>',
                    '<div class="title">活动说明</div>',
                    '<div class="content">',
                    ' <ul>',
                    '  <li><em>1</em>礼品包含：Ferragamo香水、施华洛世奇项链、华为荣耀3c、空气净化器、小狗除螨仪、迪士尼保温杯、零食券还有更多积分商城礼品。</li>',
                    '  <li><em>2</em>2014年12月22日-25日打车成功即可参加活动。</li>',
                    '  <li><em>3</em>每人每天可以参加2次活动。</li>',
                    '  <li><em>4</em>获得商城礼品用户可在个人中心-积分商城-兑换记录中查看</li>',
                    ' </ul>',
                    '</div>',
                ].join('')
            },
            height: "auto",
            width: "250px",
            close: true
        });
        dialog.show();
    }

    function statistics(source) {
        var data = {
            source: source
        };
        for (var k in pageData) {
            data[k] = pageData[k];
        }

        base.ajax({
            method: "POST",
            data: data,
            url: getUrl("statistics"),
            succFunc: function() {},
            failFunc: function() {}
        });
    }

    function showGiftDetail(data) {
        var dialog = dd.dialog.Fn({
            type: "",
            tip: {
                txt: "<div class='head'></div><div class='txt-title'></div><div class='title'></div><div class='content getGift-content'><em>您获得的是：</em><p class='desc'></p></div>"
            },
            height: "auto",
            width: "270px",
            close: true,
            btns: [{
                id: "btn-detail",
                val: "查看礼物详情",
                kls: "btn-orange",
                event: "touchstart",
                handler: function(e) {
                    statistics("gift");

                    setTimeout(function() {
                        var type = $("#btn-detail").getAttribute("_type");
                        switch (type) {
                            case "1": //打车券
                            case "2": //专车券
                                location.href = paths.v2Api + "p_coupon/couponinfo?pid=" + pageData.token;
                                break;
                            case "3": //商城商品->商城记录
                                location.href = paths.imall + "change_log/index?token=" + pageData.token + "&lng=" + pageData.lng + "&lat=" + pageData.lat;
                                break;
                                //case "4": //积分->我的积分
                            default: //积分->我的积分
                                location.href = paths.imall + "integral_flow?token=" + pageData.token + "&lng=" + pageData.lng + "&lat=" + pageData.lat;
                                break;
                        }
                    }, 10);
                }
            }, {
                val: "去看看商城圣诞活动",
                kls: "btn-orange",
                event: "touchstart",
                handler: function(e) {
                    statistics("imall");
                    setTimeout(function() {
                        location.href = "http://static.diditaxi.com.cn/activity/pages/shop_christmas.html?token=" + pageData.token + "&lng=" + pageData.lng + "&lat=" + pageData.lat;
                    }, 10);
                }
            }]
        });

        if (data) {
            $("#btn-detail").setAttribute("_type", data.type);
            var descEl = $("#d-wrap .desc");
            descEl.innerHTML = data.desc;
            if (data.desc.length > 6)
                descEl.style['font-size'] = '16px';
        }
        dialog.show();
    }

    function bindHandler() {
        base.touch(treeEl, function(e) {
            if (hasClass(e.target, "gift")) {
                getGift();
            }
        });

        base.touch(btnExplainEl, function() { //活动说明
            showHelp();
        });
    }

    function init() {
        var hdEls = $("input[type=hidden]");
        for (var i = 0, l = hdEls.length; i < l; i++) {
            pageData[hdEls[i].id.replace("hd_", "")] = hdEls[i].value;
        };

        var phone = localStorage.phone || base.getCookie("phone");
        if(phone)
            pageData.phone = phone; 
        var token = localStorage.token || base.getCookie("token");
        if(token)
            pageData.token = token;

        setTimeout(function() {
            //snowBgEl.style.height = "85%";
            dom.show(snowBgEl);
            autoShowReward();
            dom.hide(guideEl);
            dom.show(mainEl);
            dom.show(footEl);
            bindHandler();
        }, urlParams.fromlogin ? 0 : 1000);
    }

    init();
})(window);
