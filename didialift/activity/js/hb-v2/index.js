window.addEventListener('DOMContentLoaded', function() {
    /*
    @@全局变量
    */
    var doc = document,
        pages = [],
        weixinObj,
        currentPage,
        shareInfo,
        base = dd.base || {},
        link_share_url = (window.location.href).replace('r_common', 'r_get_strive_info');
    dialog = dd.dialog || {};

    /*统计*/
    var statistics = function(statisObj) {
        var url = config.globalUri + "datastatistics?page_name=" + statisObj.page_name + "&page_no=" + statisObj.page_no + "&phone=" + statisObj.phone + "&openid=" + statisObj.openid + "&hb_id=" + statisObj.hb_id;
        base.ajax({
            method: "GET",
            url: url,
            succFunc: function() {},
            failFunc: function() {}
        });
    };

    /*
    @@页面DOM元素 
    */
    /*hid-page-no:1输入手机号页，2结果页，3维修页，4修改手机号*/
    var txtTel = doc.getElementById('txt-tel'),
        div_master = doc.getElementById("master"),
        hidPageNO = doc.getElementById('hid-page-no'),
        hidErrnoNO = doc.getElementById('hid-errno'),
        hidErrmsg = doc.getElementById('hid-errmsg'),
        btnOpen = doc.getElementById('btn-open'),
        newBtnShare = doc.getElementById('new-btn-share'),
        btnShop = doc.getElementById('btn-shop'),
        btnShare = doc.getElementById('btn-share'),
        btnHideCover = doc.getElementById('btn-hide-cover'),
        btnDidiApp = doc.getElementById('btn-didiapp'),
        btnParter = doc.getElementById('btn-thirdparty'),
        pResultTip = doc.getElementById('p-result-tip'),
        pResultBanner = doc.getElementById('p-result-banner'),
        spIcon = doc.getElementById('sp-icon'),
        hidPhone = doc.getElementById('hid-phoneno'),
        hidThemeCfg = doc.getElementById('hid-theme-config'),
        hidSign = doc.getElementById('hid-sign'),
        hidOpenid = doc.getElementById('hid-openid'),
        hidHbInfo = doc.getElementById('hid-hb-info'),
        hidAllHbInfo = doc.getElementById('hid-all-hb-info'),
        pageGrap = doc.getElementById('page-grap'),
        pageResult = doc.getElementById('page-result'),
        link_info = doc.getElementById("hid-link-info").value,
        mask = doc.getElementById('mask'),
        alertDiv = doc.getElementById('alert_more'),
        get_up = doc.getElementById('get_up'),
        d_cover = doc.getElementById('dv-cover'),
        d_cover_QQ = doc.getElementById('dv-cover-QQ'),
        send_hb_friends_hover = doc.getElementById('send_hb_friends_hover'),
        btn_know = doc.getElementById("btn-hide-cover"),
        btn_modify_phone = doc.getElementById("btn-modify-phone"),
        sp_origin_phone = doc.getElementById("sp-origin-phone"),
        queryStr = base.getQueryStr(),
        navig = window.navigator.userAgent,
        tips = doc.getElementById('tips'),
        btns = doc.getElementById('btns');

    /*添加class*/
    var addClass = function(obj, sClass) {
        var re = new RegExp('\\b' + sClass + '\\b');
        if (!re.test(obj.className)) {
            obj.className += obj.className ? ' ' + sClass : sClass;
            //看原来obj有没有class,第一种可能,原来有class，就需要再添加之前加上空格，没有class，就直接添加
        }
    };

    /*
    @@获取字符串的长度，汉字为2个字符
    @@return [int]
    */
    var getStringLength = function(str) {
        var realLength = 0,
            len = str.length,
            charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };

    /*
     *火狐不支持innerText写入content，innerText本身也不是DHTML的标准。
     */
    function innerText(obj, text) {
        if (navig.toLowerCase().indexOf("firefox") != -1) {
            obj.textContent = text;
        } else {
            obj.innerText = text;
        }
    }

    /*
    @@截取字符串长度，汉字算2个字符
    @@return [string]+'...'
    */
    var subString = function(str, len) {
        var newLength = 0;
        var newStr = "";
        var chineseRegex = /[^\x00-\xff]/g;
        var singleChar = "";
        var strLength = str.replace(chineseRegex, "**").length;
        for (var i = 0; i < strLength; i++) {
            singleChar = str.charAt(i).toString();
            if (singleChar.match(chineseRegex) != null) {
                newLength += 2;
            } else {
                newLength++;
            }
            if (newLength > len) {
                break;
            }
            newStr += singleChar;
        }
        if (strLength > len) {
            newStr += "...";
        }
        return newStr;
    }

    /*
    @@判断是PC还是移动端
    @@return [string] phone|pc
    */
    function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return "phone";
        } else {
            return "pc";
        }
    }

    /*
    @@如果PC环境则页面宽度为iphone4的宽度
    @@二期需要做PC的适配
    */
    if (browserRedirect() == "pc") {
        div_master.style.width = "320px";
        div_master.style.margin = "0 auto";
        document.querySelector("#page-grap .dv-result").style.marginTop = "0px";
        document.querySelector(".p-tips").style.marginTop = "0px";
    }

    /*
    @@将html的<>标签转义为 &lt; &gt;
    @@如果文本中带有<>的标签，用innerHTML方法写到页面上时，<>会被浏览器渲染成html标签，如果用innerText会原样显示在页面上
    */
    function html2Escape(sHtml) {
        return sHtml.replace(/[<>&"]/g, function(c) {
            return {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;'
            }[c];
        });
    }


    /*
    @@获取url中的参数
    */
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return "";
    }

    /*
    @@初始化微信对象？？？
    @@用hbUtils.initWeixin方法无法初始化weixinBridge，时间紧没有再继续debug下去找原因
    @@最后确定两个问题，一是js加载的先后顺序有问题，二是进入页面的时候无法初始化WeixinJSBridge
    */
    var initWeixin = function(callback) {
        var onBridgeReady = function() {
            if (!WeixinJSBridge) return;
            weixinObj = WeixinJSBridge;
            weixinObj.call("hideOptionMenu");
            weixinObj.call('hideToolbar');

            //btnShare.style.display="none";
            newBtnShare.style.display = "none";

            if (typeof callback === 'function') {
                callback();
                //btnShare.style.display="inline-block";
                newBtnShare.style.display = "none";//又是因为微信的问题，需要给屏蔽掉
            }
        };
        if (typeof WeixinJSBridge === 'undefined') {
            doc.addEventListener('WeixinJSBridgeReady', onBridgeReady);
        } else {
            onBridgeReady();
        }
    };

    /*
    @@页面集合
    @@page-grap 输入手机号页面
    @@page-result 领取结果页
    @@page-exception 异常页
    @@page-changephone 修改手机号页面
    */
    var pageIds = ['page-grap', 'page-result', 'page-exception', 'page-changephone'];
    var hbInfo = base.txtToJson(hidHbInfo.value);
    hbInfo = typeof hbInfo === "object" ? hbInfo : base.txtToJson(hbInfo);


    /*
    @@展示服务器需要渲染的页面
    @@这个errno实际上是状态
    */
    var setLoadPage = function(fromServerPage, errno) {
        // 用户主动刷新 和 第一次从外边链接请求是一样的，优先使用服务器指定的
        // 当用户做了一些操作后，用户进入的页面服务器会知晓的，所以不需要担心页面信息不同步的问题
        if (!errno || errno === '0') {
            var tmpPage = sessionStorage.SEARCH_NEW_CURRENT_PAGE;
            currentPage = (fromServerPage.length || !tmpPage) ? config.pageMap[fromServerPage] : tmpPage;
        } else {
            // 表示生成红包页面错误()
            if (fromServerPage === '1' && errno === '2') {
                currentPage = 'page-exception';
            }
            // 抢红包结果页面，有很多状态
            if (fromServerPage === '3') {
                // 3表示老用户
                // 4表示已经领取过这个红包
                // 1 openid 错误
                // 6 入库、绑券等失败
                // 7 签名失败
                var codes = ['1', '3', '4', '6', '7'];
                if (codes.contain(errno)) currentPage = 'page-result'; // contain method is defined in dd.base.js
            }
            if (fromServerPage === '2') {
                // 3表示老用户
                // 4表示已经领取过这个红包
                // 1 openid 错误
                // 6 入库、绑券等失败
                // 7 签名失败
                //var codes = '303';
                showPage('page-result');
            }
        }
        currentPage = currentPage || 'page-exception';
    };

    /*
    @@根据页面的值，显示对应的页面
    @@page的值为[page-grap,page-result,page-expection,page-changephone]
    */
    var showPage = function(page) {
        if (!pages.length) return;
        // 应该要有相应的校验

        var item, tmpDom;
        for (var i = pages.length - 1; i >= 0; i--) {
            item = pages[i];
            tmpDom = item && item.dom;
            if (tmpDom) {
                tmpDom.style.display = (page === item.id || page === tmpDom) ? 'inline-block' : 'none';
            }
        }
        currentPage = page;
        sessionStorage.SEARCH_NEW_CURRENT_PAGE = page; // 存储到会话中
    };

    /*
    @@隐藏弹出框，本来这个地方应该集成到ajax里面
    @@后续优化
    */
    var hideDialog = function(callback) {
        var dvWall = doc.getElementById('d-wall'),
            dvWrap = doc.getElementById('d-wrap');

        if (dvWall) dvWall.style.display = 'none';
        if (dvWrap) dvWrap.style.display = 'none';
        if (typeof callback === 'function') callback();
    };

    // check and pre action
    var actionPreDo = function(tar, txt) {
        if (tar.className !== 'btn-orange') return false;

        dialog.loading('正在加载', 3000);
        tar.className = 'btn-gray';
        //tar.innerText = txt;
        innerText(tar, txt);
        txtTel.blur();
    };

    // failed reset
    var actionFailReset = function(tar, txt) {
        hideDialog(function() {
            tar.className = 'btn-orange';
            //tar.innerText = txt || "确认";
            txt = txt || "确认";
            innerText(tar, txt);
        });
    };

    // succ reset
    var actionSuccReset = function(tar, txt) {
        hideDialog(function() {
            tar.className = 'btn-gray';
            //tar.innerText = txt || "确认";
            txt = txt || "确认";
            innerText(tar, txt);
            txtTel.value = '';
        });
    };

    // 手机号输入错误提示
    var dAlert = function(message) {
        dd.dialog.alert({
            tip: message,
            btn: {
                val: '我知道了',
                handler: function() {
                    actionFailReset(e.target, btnVal.reset);
                }
            }
        });
    };

    /* 
    @@根据类别显示不同的券背景
    @@chezuche 出租车
    @@zhuanche 专车
    */
    function changeBonusType(bonus_type) {
        var coupon = doc.querySelector(".dache-coupon");
        if (bonus_type == "zhuanche") {
            coupon.style.backgroundImage = "url('http://static.diditaxi.com.cn/activity/img-hb/v3/zhuanche-new.png?v=3')";
            //coupon.style.backgroundSize = "185px 76px";
        }else if(bonus_type == "chuzuche"){
            coupon.style.backgroundImage = "url('http://static.diditaxi.com.cn/activity/img-hb/v3/chuzuche-new.png?v=3')";
        }else if(bonus_type == "kuaiche"){
            coupon.style.backgroundImage = "url('http://static.diditaxi.com.cn/activity/img-hb/v3/kuaiche-new.png?v=3')";
        }else if(bonus_type == "shunfengche"){
            coupon.style.backgroundImage = "url('http://static.diditaxi.com.cn/activity/img-hb/v3/shunfengche-new.png')";
        }
    }

    /*
    @@显示抢红包列表
    @@后端只会传过来黑色或浅色，如果是黑色则列表文案为rgba(255,255,255,0.9)色值加透明度来处理
    @@如果是浅色则列表文案为rgba(0,0,0,0.9)色值加透明度来处理
    @@除了支付后红包，渠道红包与定额红包都不会调用该方法
    */
    var showList = function(d, themeCfg) {
        if (!d || !d.list_info) return;
        var array = d.list_info;
        if (!base.isArray(array)) return;
        var html = '';
        //文案颜色
        var txt_color = themeCfg.record_txt_col == 1 ? "0,0,0" : "255,255,255";
        var record_count = parseInt(themeCfg.record_count);
        if (array.length > record_count) {
            array = array.slice(0, record_count);
        }
        hbUtils.map(array, function(it) {
            var _amount = 0,
                _nickname = it.nickname;
            if (it.amount == null || typeof it.amount == "undefined") it.amount = 1;
            _amount = isNaN(it.amount) ? "1" : ((typeof it.amount === 'number') ? it.amount.toFixed(2) : parseFloat(it.amount).toFixed(2));
            _nickname = getStringLength(_nickname) > 16 ? subString(_nickname, 16) : _nickname;
            html += '<li style="border-bottom:1px solid rgba(' + txt_color + ',0.05);"><div class="d-wx-photo" style="margin-right:5px; width:31px; height: 32px; background: url(' + it.headimgurl + ') no-repeat top left; background-size: 31px 32px;"></div><div class="d-hb-detail"><p><span style="color:rgba(' + txt_color + ',1.0);">' + html2Escape(_nickname) + '</span><span class="hbfont" style="font-size:1.2rem;color:rgba(' + txt_color + ',0.5)">' + it.create_time + '</span><b class="hb_amount">' + _amount + '元</b></p><p class="comment_tx" style="color:rgba(' + txt_color + ',0.7);font-size:1.2rem;">以后打车就靠你了，么么哒</p></div></li>';
        });

        var ulList = doc.getElementById('ul-list');
        var dvList = doc.getElementById('dv-list');
        dvList.querySelector(".hr-tip").style.backgroundColor = "rgba(" + txt_color + ",0.3)";
        dvList.querySelector(".hr-tip span").style.color = "rgba(" + txt_color + ",0.5)";
        dvList.querySelector(".hr-tip span").style.backgroundColor = themeCfg.record_bg_col;

        ulList.innerHTML = html;
        if (themeCfg.get_record == 1) {
            dvList.style.display = 'block';
        }
        if (currentPage === "page-changephone") {
            dvList.style.display = 'none';
        }
        //列表背景颜色
        dvList.style.backgroundColor = themeCfg.record_bg_col;
        document.getElementById("friends-tips").style.background = themeCfg.record_bg_col;
    };

    // 输入手机号
    txtTel.addEventListener('input', function(e) {
        var tar = e.target;
        tar.value = tar.value.replace(/[^\d]/g, '').slice(0, 11);

        if ((/^1[3|4|5|8|7][0-9]\d{8}$/.test(tar.value))) {
            btnOpen.className = 'btn-orange';
            tar.blur();
        } else btnOpen.className = "btn-gray";
    }, false);


    /*
    @@抢红包成功正常填充手机号和金额
    @@只有支付红包时才会显示修改手机号的按钮
    */
    var fillAmountAndPhone = function(d) {
        if (d.amount == 0) d.amount = 1;
        if (!d || !d.amount) return;

        var lblAmount = doc.getElementById('lbl-amount');
        var bonus_type = d.bonus_type;
        var car_type = document.createElement("div");

        if(bonus_type == 'shunfengche'){
            car_type.innerHTML = '<span class="couponTitle">' + '顺风车券' + '</span>';
        }else if(bonus_type == 'zhuanche'){
            car_type.innerHTML = '<span class="couponTitle">' + '专车券' + '</span>';
            document.getElementsByClassName("dache-coupon")[0].style.color = '#484858';
        }else if (bonus_type== 'kuaiche'){
            car_type.innerHTML = '<span class="couponTitle">' + '快车券' + '</span>';
        }else if (bonus_type == 'chuzuche'){
            car_type.innerHTML = '<span class="couponTitle">' + '出租车券' + '</span>';
        }
        document.getElementsByClassName('dache-coupon')[0].appendChild(car_type);

        var spChangePhone = doc.getElementById('sp-change-phone');
        lblAmount.innerHTML ='<span class="yuan">￥ </span>'+ (d.amount || '1')  ;
        lblAmount.style.fontSize = '4rem';
        lblAmount.style.fontWeight = '500';
        var __phone = d.phone || '';
        innerText(spChangePhone, __phone);
        //spChangePhone.innerText = d.phone || '';
        if (hbInfo.type == 1 && navig.indexOf('MicroMessenger') != -1) {
            btn_modify_phone.style.display = "inline-block";
        }

    };

    /*
    @@显示气泡文案
    */
    var showBubbleTips = function(d) {
        if (!d || !d.tip) return;
        var resBubble2 = doc.getElementById('result-bubble-2');
        var tempTips = d.tip.replace("红包","打车券");
        resBubble2.innerHTML = tempTips;
    };

    /*
    @@显示红包发送者??从这个方法的实现来看，这个方法有意义？
    */
    var showSender = function(d) {
        if (!d) return;
    }

    /*
    @@显示错误信息，红包已抢完等
    @@此处在红包已抢完，红包过期等状态的时候显示相应的背景图片，同时背景图片显示page-grap的背景图片
    @@只有正常抢到红包[errno=0]，已抢过红包[errno=301]时page-result才会显示自己的背景图片
    */
    var showErrorMsg = function(d, json) {
        if (d == 301 || d == 0) return;

        var div_gain_tips = doc.querySelector(".dv-result-tips");

        div_gain_tips.style.display = "block";
        if (btns) btns.style.display = "block";
        //if(btns) btns.style.marginTop = "12rem";
        if (btns) {
            var btn_parent = doc.querySelector("#page-result .dv-result");
            btn_parent.style.height = "14rem";
            btn_parent.style.marginTop = "14rem";
        }
        if (tips) tips.style.display = "none";

        var hidThemeCfg = doc.getElementById('hid-theme-config');
        var hidThemeCfg_val = JSON.parse(hidThemeCfg.value);
        hidThemeCfg_val = typeof hidThemeCfg_val === "object" ? hidThemeCfg_val : base.txtToJson(hidThemeCfg_val);

        var screenWidth = window.screen.width,
            screenHeight = window.screen.height;

        pageGrap.style.width = "100%";
        pageResult.style.width = "100%";

        //iphone4,4s
        if (screenWidth <= 320 && screenHeight <= 480) {
            if (hidThemeCfg_val.small_log_err_img_url) pageResult.style.backgroundImage = 'url(' + hidThemeCfg_val.small_log_err_img_url + ')';
        }
        //iphone 5+
        if (screenWidth >= 320 && screenHeight > 480) {
            if (hidThemeCfg_val.big_log_err_img_url) pageResult.style.backgroundImage = 'url(' + hidThemeCfg_val.big_log_err_img_url + ')';
        }
        pageResult.style.backgroundSize = "100%";
        pageResult.style.backgroundRepeat = "no-repeat";

        var grapContents = base.getElesByKls(pageGrap, 'dv-result'),
            resContents = base.getElesByKls(pageResult, 'dv-result');

        hbUtils.map([grapContents[0]], function(it) {
            it.style.display = "none";
        });

        if (d != 302) {
            showBubbleTips(config.resPageStMap[d]);
            //其他异常页的统计
            statistics({
                "page_name": "other_page",
                "page_no": "2",
                "phone": json ? json.phone : "",
                "openid": hbInfo ? hbInfo.openid : "",
                "hb_id": hbInfo ? hbInfo.id : ""
            });
        }

        if (d == 302) {
            //已领完的统计
            statistics({
                "page_name": "gone_page",
                "page_no": "2",
                "phone": json ? json.phone : "",
                "openid": hbInfo ? hbInfo.openid : "",
                "hb_id": hbInfo ? hbInfo.id : ""
            });
        }

        //统计积分商城按钮
        if (btnShop) {
            btnShop.addEventListener("click", function(ev) {
                ev.preventDefault();
                var href = btnShop.getAttribute("href");
                statistics({
                    "page_name": "mall_button",
                    "page_no": "2",
                    "phone": json ? json.phone : "",
                    "openid": hbInfo ? hbInfo.openid : "",
                    "hb_id": hbInfo ? hbInfo.id : ""
                });
                setTimeout(function() {
                    location.href = href;
                }, 500);
            }, false);
        }

        doc.querySelector("#result-bubble-1").style.display = "none";
        //doc.querySelector("#result-bubble-2").style.fontSize = "2rem";
        initWeixin();
    }

    /*
    @@分享成功后关闭弹层
    @@分享成功后调用该回调函数，关闭“我知道了”，蒙层（一部分安卓机型下可能不生效，这个目前没有办法做兼容）
    */
    function shutDownDialog() {
        d_cover.style.display = "none";
        mask.style.display = "none";
        alertDiv.style.display = "none";
    }

    //链式红包弹层
    //type:1 支付后红包 ，2渠道红包  3，定额红包
    function moreBlock(phone, hbInfo) {
        var link_info = doc.getElementById("hid-link-info").value;
        if (!link_info || link_info == "") return;

        link_info = JSON.parse(link_info);
        link_info = typeof link_info === "object" ? link_info : base.txtToJson(link_info);

        var more = link_info.cnt,
            share_url = link_info.share_url,
            link_title = link_info.title,
            link_content = link_info.content,
            link_pic = link_info.pic;

        //TODO:修改弹层上的文案，图片
        alertDiv.querySelector("h4 i").innerText = more;

        if (parseInt(more) != '0') {
            var documentWidth = doc.documentElement.clientWidth,
                documentHeight = doc.body.scrollHeight || doc.documentElement.scrollHeight;
            mask.style.height = documentHeight + 'px';
            alertDiv.style.left = (documentWidth - 260) / 2 + 'px';
            window.setTimeout(function() {
                mask.style.display = 'block';
                alertDiv.style.display = 'block';
            }, 1000);

            base.touch(get_up, function(ev) {
                mask.style.display = 'none';
                alertDiv.style.display = 'none';
            }, false);

            base.touch(send_hb_friends_hover, function() {
                d_cover.style.width = '100%';
                d_cover.style.height = '100%';
                d_cover.style.display = 'block';
                d_cover.style.height = doc.body.scrollHeight || doc.documentElement.scrollHeight + "px";

            }, false);

            base.touch(btn_know, function(ev) {
                d_cover.style.display = "none";
            }, false);

            link_share_url = link_info.share_url;
            initWeixin(function() {
                shareInfo.appmsg.link = link_share_url;
                shareInfo.timeline.link = link_share_url;
                shareInfo.appmsg.succCB = function() {
                    shutDownDialog();
                    statistics({
                        "page_name": "share_button_link",
                        "page_no": "2",
                        "phone": phone ? phone : "",
                        "openid": hbInfo ? hbInfo.openid : "",
                        "hb_id": hbInfo ? hbInfo.id : ""
                    });
                };
                shareInfo.timeline.succCB = function() {
                    shutDownDialog();
                    statistics({
                        "page_name": "share_button_link",
                        "page_no": "2",
                        "phone": phone ? phone : "",
                        "openid": hbInfo ? hbInfo.openid : "",
                        "hb_id": hbInfo ? hbInfo.id : ""
                    });
                };
                dd.share.shareAll(weixinObj, shareInfo);
            });

            //手Q分享信息
            mqq.data.setShareInfo({
                title: shareInfo.appmsg.title,
                desc: shareInfo.appmsg.desc,
                image_url: shareInfo.appmsg.img_url
            }, function(r) {});

        }
    }


    /*
    @@点击打开红包按钮，获取红包
    */
    function openRedpackage(e) {
        var btnVal = {
            doing: '正在打开...',
            reset: '领取打车券'
        };
        if (actionPreDo(e.target, btnVal.doing) === false) return;

        var hbInfo = base.txtToJson(hidHbInfo.value);
        hbInfo = typeof hbInfo === "object" ? hbInfo : base.txtToJson(hbInfo);
        var hbThemeConfig = base.txtToJson(hidThemeCfg.value);
        hbThemeConfig = typeof hbThemeConfig === "object" ? hbThemeConfig : base.txtToJson(hbThemeConfig);

        var bubbleTips = {
            '302': {
                'tip': hbThemeConfig.finish_txt
            },
            '0': {
                'tip': hbThemeConfig.success_txt
            }
        };

        var urlStr = "";
        for (var i in hbInfo) {
            urlStr += "&" + i + "=" + hbInfo[i];
        }
        var _interface = (hbInfo.type == "2" || hbInfo.type == "3") ? "getOtherHB" : "getPayHBAjax";
        if (getQueryString("share_channel") == 3 || getQueryString("share_channel") == 4) {
            _interface = "getOtherHB";
        }
        var url = config.globalUri + _interface + '?openid=' + encodeURIComponent(hbInfo.openid) + '&phone=' + encodeURIComponent(txtTel.value.trim()) + urlStr;

        //修改手机号：type=1支付红包有btn_modify_phone
        (hbInfo.type == "1" && navig.indexOf('MicroMessenger') != -1) ? btn_modify_phone.style.display = "block": btn_modify_phone.style.display = "none";

        base.ajax({
            method: 'GET',
            url: url,
            succFunc: function(d) {
                d = base.txtToJson(d);
                actionSuccReset(e.target, btnVal.reset);
                var resultObj;
                if (d.errno == "401") {
                    var finish_txt = {};
                    finish_txt.tip = hbThemeConfig.finish_txt;
                    resultObj = finish_txt;
                } else {
                    resultObj = config.resPageStMap[d.errno.toString()];
                }

                if (d.pageno != "3") {
                    showBubbleTips(resultObj);
                    showBubbleTips(bubbleTips[d.errno.toString()]);
                    if (hbInfo.type == 1) {
                        showList(d, hbThemeConfig);
                    }

                    if (d.errno === "0") { // 新人领取成功
                        fillAmountAndPhone(d);
                        changeBonusType(d.bonus_type);
                        showPage('page-result');
                        if (d.link_info) {
                            doc.getElementById("hid-link-info").value = d.link_info;
                        }
                        //链式红包弹层
                        if (hbInfo.type == 1) {
                            setTimeout(function() {
                                moreBlock(d.phone, hbInfo);
                                mask.style.height = doc.body.scrollHeight || doc.documentElement.scrollHeight + "px";
                            }, 500);
                        }
                        var link_info = doc.getElementById("hid-link-info").value;
                        //分享功能是否开启是通过mis配置的,与红包类型无关

                        if (hbThemeConfig.chk_share_btn == "1") {

                            shareInfo = hbUtils.genShareInfo(hbThemeConfig);
                            if (link_info && shareInfo) {
                                link_info = base.txtToJson(link_info);
                                link_info = typeof link_info === "object" ? link_info : base.txtToJson(link_info);
                                if (link_info.share_url) link_share_url = link_info.share_url;
                            }
                            initWeixin(function() {
                                shareInfo.appmsg.link = link_share_url;
                                shareInfo.timeline.link = link_share_url;
                                shareInfo.appmsg.succCB = function() {
                                    shutDownDialog();
                                    statistics({
                                        "page_name": "share_button",
                                        "page_no": "2",
                                        "phone": d ? d.phone : "",
                                        "openid": hbInfo ? hbInfo.openid : "",
                                        "hb_id": hbInfo ? hbInfo.id : ""
                                    });
                                };
                                shareInfo.timeline.succCB = function() {
                                    shutDownDialog();
                                    statistics({
                                        "page_name": "share_button",
                                        "page_no": "2",
                                        "phone": d ? d.phone : "",
                                        "openid": hbInfo ? hbInfo.openid : "",
                                        "hb_id": hbInfo ? hbInfo.id : ""
                                    });
                                };
                                dd.share.shareAll(weixinObj, shareInfo);
                            });

                            //设置手Q分享信息
                            mqq.data.setShareInfo({
                                title: shareInfo.appmsg.title,
                                desc: shareInfo.appmsg.desc,
                                image_url: shareInfo.appmsg.img_url
                            }, function(r) {});
                        }

                        statistics({
                            "page_name": "success_page",
                            "page_no": "2",
                            "phone": d ? d.phone : "",
                            "openid": hbInfo ? hbInfo.openid : "",
                            "hb_id": hbInfo ? hbInfo.id : ""
                        });

                    } else {
                        // 已抢过 301
                        // 已抢完 302
                        // 已过期 303
                        // 还不能领 304 
                        if (d.errno != 301) {
                            showErrorMsg(d.errno, d);

                        } else {
                            fillAmountAndPhone(d);
                            changeBonusType(d.bonus_type);

                            statistics({
                                "page_name": "success_page",
                                "page_no": "2",
                                "phone": d ? d.phone : "",
                                "openid": hbInfo ? hbInfo.openid : "",
                                "hb_id": hbInfo ? hbInfo.id : ""
                            });

                        }
                        showPage('page-result');

                        if (d.errno == 301 && hbThemeConfig.chk_share_btn === "1") {
                            shareInfo = hbUtils.genShareInfo(config.defaultTheme);

                            initWeixin(function() {
                                shareInfo.appmsg.link = link_share_url;
                                shareInfo.timeline.link = link_share_url;
                                shareInfo.appmsg.succCB = function() {
                                    shutDownDialog();
                                    statistics({
                                        "page_name": "share_button",
                                        "page_no": "2",
                                        "phone": d ? d.phone : "",
                                        "openid": hbInfo ? hbInfo.openid : "",
                                        "hb_id": hbInfo ? hbInfo.id : ""
                                    });
                                };
                                shareInfo.timeline.succCB = function() {
                                    shutDownDialog();
                                    statistics({
                                        "page_name": "share_button",
                                        "page_no": "2",
                                        "phone": d ? d.phone : "",
                                        "openid": hbInfo ? hbInfo.openid : "",
                                        "hb_id": hbInfo ? hbInfo.id : ""
                                    });
                                };
                                dd.share.shareAll(weixinObj, shareInfo);
                            });

                            //手Q分享信息
                            mqq.data.setShareInfo({
                                title: shareInfo.appmsg.title,
                                desc: shareInfo.appmsg.desc,
                                image_url: shareInfo.appmsg.img_url
                            }, function(r) {});
                        } else {

                            initWeixin();
                        }
                    }
                } else {
                    showPage('page-exception');
                }
            },
            failFunc: function() {
                alert('对不起服务器错误,请稍后再试.');
                actionFailReset(e.target, btnVal.reset);
            }
        });
    }

    /*
    @@打开红包按钮的事件，兼容PC与mobile平台
    @@pc只认click事件
    @@mobile同时兼容click与touch事件，但是click事件会有300ms的延迟
    */
    if (browserRedirect() == "pc") {
        btnOpen.addEventListener("click", function(e) {
            openRedpackage(e);
        }, false);
    }
    if (browserRedirect() == "phone") {
        base.touch(btnOpen, function(e) {
            openRedpackage(e);
        });
    }

    function showShadeLayerHandler(event) {

        event = event || window.event;
        hbUtils.showShadeLayerHandler(event, function() {
            mqq.ui.showShareMenu();
            var count_url = config.globalUri + "shouQStatistics?phone=" + encodeURIComponent(doc.getElementById('sp-change-phone').innerText.trim());
            base.ajax({
                method: "GET",
                url: count_url
            });
        });
    }

    function didiAppHandler(event) {
        event = event || window.event;
        hbUtils.didiAppHandler(event, function() {
            var hbInfo = base.txtToJson(hidHbInfo.value);
            hbInfo = typeof hbInfo === "object" ? hbInfo : base.txtToJson(hbInfo);

            var allHBinfo = base.txtToJson(hidAllHbInfo.value);
            allHBinfo = typeof allHBinfo === "object" ? allHBinfo : base.txtToJson(allHBinfo);
            //统计正常页下载按钮
            var page_name = "";
            if (hidErrnoNO.value == 0 || hidErrnoNO.value == 301) {
                page_name = "download_button";
            } else {
                page_name = "otherdownload_button";
            }
            statistics({
                "page_name": page_name,
                "page_no": "2",
                "phone": allHBinfo ? allHBinfo.phone : "",
                "openid": hbInfo ? hbInfo.openid : "",
                "hb_id": hbInfo ? hbInfo.id : ""
            });
        });
    }

    if (browserRedirect() == "pc") {
        btnDidiApp.addEventListener("click", didiAppHandler, false);
        btnShare.addEventListener("click", showShadeLayerHandler, false);
        btnHideCover.addEventListener("click", hbUtils.hideShadeLayerHandler, false);
    }
    if (browserRedirect() == "phone") {
        base.touch(btnDidiApp, didiAppHandler, false); // 滴滴客户端，已安装则打开，未安装则下载
        if (navig.indexOf("QQ") != -1 && navig.indexOf("MicroMessenger") == -1) {
            base.touch(btnShare, showShadeLayerHandler, false); // 新用户抢红包页面的分享按钮
            //base.touch(btnHideCover, hbUtils.hideShadeLayerHandler, false); // 隐藏指引分享蒙层
        }
    }

    /******读取分享、发红包、按钮等文案配置，应用红包主题等******/
    // using 发送红包者配置
    var applyOwnerLogo = function(logoUrl) {
        if (!logoUrl) return;

        var ownerLogoEles = base.getElesByKls(doc.body, 'owner-logo');
        hbUtils.map(ownerLogoEles, function(item) {
            item.style.backgroundImage = 'url(' + logoUrl + ')';
        });
    };

    var applyNickName = function(nickname) {
        if (!nickname) nickname = "hello,滴滴小伙伴";

        var nicknameEles = doc.querySelectorAll(".nickname");
        hbUtils.map(nicknameEles, function(item) {
            //item.innerText = "我是" + nickname + ",";
            innerText(item, "我是" + nickname + ",");
        });
    }

    // 解析并使用红包主题
    // 这个obj是默认的红包主题结构化数据
    var usingConfig = function(obj, d) {
        if (!obj || !base.isObject(obj)) return;


        // using 气泡配置
        var applyBubbleStyle = function(op, bg, color) {
            if (!bg || !color) return;

            var bubbleEles = base.getElesByKls(doc.body, 'tip-bubble');
            hbUtils.map(bubbleEles, function(item) {
                item.style.backgroundColor = bg;
                hbUtils.map(item.querySelectorAll("p"), function(item1) {
                    item1.style.color = color;
                });
            });
        };

        // 现实气泡文字
        var applyBubbleTips = function(obj) {
            var grapBubbleFst = doc.getElementById('grap-bubble-1'),
                grapBubbleSnd = doc.getElementById('grap-bubble-2'),
                resBubbleFst = doc.getElementById('result-bubble-1'),
                resBubbleSnd = doc.getElementById('result-bubble-2');

            if (hbInfo.type != 1) {
                //grapBubbleFst.innerText = "我是" + obj.send_name + "," || '';
                innerText(grapBubbleFst, "我是" + obj.send_name + "," || '');
            }
            //grapBubbleSnd.innerText = obj.login_txt || '';
            innerText(grapBubbleSnd, obj.login_txt || '');
            if (hbInfo.type == 1) {
                resBubbleFst.innerHTML = '<span class="nickname"></span>';
            } else {
                resBubbleFst.innerHTML = "我是" + (html2Escape(obj.send_name) + "," || '') + '<span class="nickname"></span>';
            }

            //resBubbleSnd.innerText = obj.get_success || '';
            innerText(resBubbleSnd, obj.get_success || '');
            if (d && typeof d === "object" && currentPage === "page-result") {
                if (d.errno == 0) {
                    //grapBubbleSnd.innerText = obj.success_txt || '';
                    //resBubbleSnd.innerText = obj.success_txt || '';
                    innerText(grapBubbleSnd, obj.success_txt || '');
                    innerText(resBubbleSnd, obj.success_txt || '');
                } else if (d.errno == 302) {
                    //grapBubbleSnd.innerText = obj.finish_txt || '';
                    //resBubbleSnd.innerText = obj.finish_txt || '';
                    innerText(grapBubbleSnd, obj.finish_txt || '');
                    innerText(resBubbleSnd, obj.finish_txt || '');
                }
            }
        };

        // 应用操作区样式
        var applyBackgroundAndContentStyle = function(obj) {

            var grapContents = base.getElesByKls(pageGrap, 'dv-result'),
                resContents = base.getElesByKls(pageResult, 'dv-result');

            hbUtils.map([grapContents[0], resContents[0]], function(it) {
                it.style.backgroundColor = obj.oper_fl_col; //操作区背景颜色
                it.style.color = obj.oper_txt_col; // 操作区文字颜色
            });
            var color = "#532d00";
            if (obj.oper_txt_col == 1) color = "#532d00";
            else color = "#fff";
            pageGrap.querySelector(".dv-result p").style.color = color;
            pageResult.querySelector(".dv-result .p-tips").style.color = color;
        };

        // 应用领取列表样式
        var applyListStyle = function(obj) {
            var ul = doc.getElementById('ul-list'),
                dvList = doc.getElementById('dv-list'),
                allLi = ul.getElementsByTagName('li');

            dvList.style.backgroundColor = obj.record_bg_col; // 背景颜色

            hbUtils.map(allLi, function(li) {
                li.style.borderBottomColor = obj.get_line_color; //分割线的颜色
                li.getElementsByTagName('b')[0].style.color = obj.get_hig_color; // 突出文案的颜色
            });
        };

        // 应用第三方按钮配置
        var useThirdBtn = function(obj) {
            btnParter.innerHTML = obj.btn_name || '合作方按钮';
            //点击三方按钮事件
            base.touch(btnParter, function() {
                if (!obj.btn_link) return;

                var hbInfo = base.txtToJson(hidHbInfo.value);
                hbInfo = typeof hbInfo === "object" ? hbInfo : base.txtToJson(hbInfo);

                var allHBinfo = base.txtToJson(hidAllHbInfo.value);
                allHBinfo = typeof allHBinfo === "object" ? allHBinfo : base.txtToJson(allHBinfo);

                //统计第三方按钮事件
                var page_name = "";
                if (hidErrnoNO.value == 0 || hidErrnoNO.value == 301) {
                    page_name = "thirdparty_button";
                } else {
                    page_name = "otherthirdparty_button";
                }
                statistics({
                    "page_name": page_name,
                    "page_no": "2",
                    "phone": allHBinfo ? allHBinfo.phone : "",
                    "openid": hbInfo ? hbInfo.openid : "",
                    "hb_id": hbInfo ? hbInfo.id : ""
                });

                location.href = obj.btn_link;
            });
        };

        // 应用按钮样式
        var applyButtonConfig = function(obj, d) { //kiki添加需求，非领取页，增加按钮
            var btnCnt = 0;
            var lnks = base.getElesByKls(pageResult, 'btn-orange');
            if (obj.chk_down_btn == '1') {
                btnCnt++;
            }

            if (navig.indexOf("QQ") != -1 && navig.indexOf('MicroMessenger') == -1) { //qq浏览器
                if (d.errno == "0" || d.errno == "301") { //只显示气泡的时候
                    if (obj.chk_share_btn == '1') {
                        btnCnt++; //由于微信禁止使用蒙层引导用户分享
                    }
                }
            }
            if (obj.chk_partner_btn == '1') {
                btnCnt++;
            }

            if (navig.indexOf("MicroMessenger") != -1) { //微信
                if (d.errno != "0" && d.errno != "301") { //只显示气泡的时候
                    btnCnt++;
                }
            }

            if (btnCnt == 3) { //这个不可能为3了
                lnks[0].style.width = '47%';
                lnks[0].style.float = 'left';
                addClass(lnks[0], "btn-light");

                lnks[1].style.width = '47%';
                lnks[1].style.float = 'right';
                addClass(lnks[1], "btn-light");

                hbUtils.map(lnks, function(it) {
                    it.style.display = 'inline-block';
                });

            }

            if (btnCnt <= 2) {

                if (obj.chk_down_btn == '1') btnDidiApp.style.display = 'inline-block';

                if (obj.chk_share_btn == '1' && (navig.indexOf("MicroMessenger") != -1)) { //微信浏览器

                    newBtnShare.style.display = 'none';//因为微信的问题需要屏蔽掉这个按钮
                    btnShare.style.display = 'none';

                    if (d.errno != "0" && d.errno != "301") {
                        btnShop.style.display = 'inline-block';
                    }
                } else if (obj.chk_share_btn == '1' && navig.indexOf("QQ") != -1) { //QQ浏览器
                    if (d.errno == "0" || d.errno == "301") {
                        btnShare.style.display = 'inline-block';
                        newBtnShare.style.display = 'none';
                    }
                }
                if (obj.chk_partner_btn == '1') btnParter.style.display = 'inline-block';
            }

            if (btnCnt == 1) {
                if (obj.chk_down_btn == '1') btnDidiApp.style.marginTop = '3rem';
                /*if (obj.chk_share_btn == '1'&&(navig.indexOf("QQ")!=-1||navig.indexOf("MicroMessenger")!=-1)){ 
                    btnShare.style.marginTop = '3rem';
                }*/
                if (obj.chk_partner_btn == '1') btnParter.style.marginTop = '3rem';
            }

            useThirdBtn(obj);

        };

        applyOwnerLogo(obj.sender_img_url); //发红包人
        applyBubbleStyle(obj.bubble_fl_opacity, obj.bubble_fl_col, obj.bubble_txt_col);
        applyBackgroundAndContentStyle(obj);
        applyBubbleTips(obj);
        applyListStyle(obj);
        applyButtonConfig(obj, d);
    };



    // 初始化
    (function init() {
        var pageno = hidPageNO.value,
            errno = hidErrnoNO.value;

        var allHBinfo = base.txtToJson(hidAllHbInfo.value);
        allHBinfo = typeof allHBinfo === "object" ? allHBinfo : base.txtToJson(allHBinfo);

        var initPages = function(array) {
            //var tmp;
            hbUtils.map(array, function(item) {
                var tmp = doc.getElementById(item);
                pages.push({
                    id: item,
                    dom: tmp
                });
            });
        };

        // 能拿到手机号码，设置按钮为激活状态
        // 理论上不会出现这种情况
        var showPhone = function(phone) {
            if (!phone || phone.trim().length !== 11) return;
            txtTel.value = hidPhone.value.trim().replace(/[^\d]/g, ''); //老用户内置手机号
            btnOpen.className = txtTel.value.length === 11 ? 'btn-orange' : 'btn-gray';
        };

        initPages(pageIds); // 初始化页集合

        // 兼容placeholder
        hbUtils.compatibilityPlaceHolder([txtTel]);

        // 根据pageno 和 errno 设置当前要显示的页面
        // 这个函数只决策当前要显示的页面，根据提页面状态无关
        setLoadPage(pageno, errno);

        config.defaultTheme = base.txtToJson(hidThemeCfg.value);

        config.defaultTheme = typeof config.defaultTheme === "object" ? config.defaultTheme : base.txtToJson(config.defaultTheme);
        usingConfig(config.defaultTheme, {
            errno: errno
        });

        /*
        @@js 适配自定义的背景皮肤
        @@不管在mis中有没有传背景，mis都会传一个默认的背景皮肤过来。
        @@屏幕宽度小于320时默认适配为小尺寸的背景（iphone4/4s/5/5s）
        @@屏幕宽度大于320时黑夜适配为大尺寸的背景 (iphone6/plus)
        */
        function changeBackgroundImages(themeObj) {
            var screenWidth = window.screen.width,
                screenHeight = window.screen.height;
            pageGrap.style.width = "100%";
            pageResult.style.width = "100%";
            if (screenWidth <= 320 && screenHeight <= 480) {
                //小于等于320视为iphone4或窄屏手机
                if (themeObj.small_log_err_img_url) pageGrap.style.backgroundImage = 'url(' + themeObj.small_log_err_img_url + ')';
                if (themeObj.small_succ_img_url) pageResult.style.backgroundImage = 'url(' + themeObj.small_succ_img_url + ')';
            }
            if (screenWidth >= 320 && screenHeight > 480) {
                //大于320视为iphone6的或安卓等宽屏幕手机
                if (themeObj.big_log_err_img_url) pageGrap.style.backgroundImage = 'url(' + themeObj.big_log_err_img_url + ')';
                if (themeObj.big_succ_img_url) pageResult.style.backgroundImage = 'url(' + themeObj.big_succ_img_url + ')';
            }

            pageGrap.style.backgroundSize = "100%";
            pageGrap.style.backgroundRepeat = "no-repeat";
            pageResult.style.backgroundSize = "100%";
            pageResult.style.backgroundRepeat = "no-repeat";
        }

        changeBackgroundImages(config.defaultTheme);

        showPage(currentPage);

        showErrorMsg(errno);

        if (navig.indexOf("QQ") != -1 && navig.indexOf('MicroMessenger') == -1) { //QQ浏览器
            btnShop.style.display = "none";
        } else if (navig.indexOf('MicroMessenger') != -1) { //微信
            btnShare.style.display = "none";
        }

        if (currentPage == "page-grap") {
            initWeixin();
            statistics({
                "page_name": "inputphone_page",
                "page_no": "1",
                "phone": allHBinfo ? allHBinfo.phone : "",
                "openid": hbInfo.openid || "",
                "hb_id": hbInfo.id || ""
            });
        }

        //为可口可乐赋值手机号,并且不能修改
        function coke() {
            if (getQueryString("flag") && getQueryString("flag") != true) {
                var phoneTxt = doc.getElementById("phoneTxt");
                //phoneTxt.innerText = "";
                innerText(phoneTxt, "");
                txtTel.readOnly = true;
                txtTel.value = getQueryString("mobile");
                btnOpen.className = "btn-orange";
            }
        }
        coke();

        // 老用户直接抢红包，直接进入到红包结果页面并初始化分享信息
        if (pageno === '2' && hbInfo.type == 1) {
            if (allHBinfo) {
                fillAmountAndPhone(allHBinfo); // 替换金额
                changeBonusType(allHBinfo.bonus_type);

                if (errno == 301) {
                    var resultObj = config.resPageStMap[errno];
                    showBubbleTips(resultObj); // 显示气泡文案
                }
                if (allHBinfo.create) {
                    applyOwnerLogo(allHBinfo.create.headimgurl);
                    applyNickName(allHBinfo.create.nickname);
                }
                if (config.defaultTheme.get_record == 1) {
                    showList(allHBinfo, config.defaultTheme);
                }

                setTimeout(function() {
                    moreBlock(allHBinfo.phone, hbInfo);
                    mask.style.height = doc.body.scrollHeight || doc.documentElement.scrollHeight + "px";
                }, 500);
            }
        }

        //############链式红包分享开始##########################
        //默认分享出去的链接为本红包的链接,在微信中分享出去后微信会重定向一次，所以要把链接中的一个路径替换
        //如果是链式红包，则分出去的是链式红包的链接
        if (config.defaultTheme.chk_share_btn === "1" && (errno == 0 || errno == 301) && pageno == 2) {

            statistics({
                "page_name": "success_page",
                "page_no": "2",
                "phone": allHBinfo ? allHBinfo.phone : "",
                "openid": hbInfo ? hbInfo.openid : "",
                "hb_id": hbInfo ? hbInfo.id : ""
            });

            shareInfo = hbUtils.genShareInfo(config.defaultTheme);

            if (link_info && shareInfo) {
                link_info = base.txtToJson(link_info);
                link_info = typeof link_info === "object" ? link_info : base.txtToJson(link_info);
                if (link_info.share_url) link_share_url = link_info.share_url;
            }
            initWeixin(function() {
                shareInfo.appmsg.link = link_share_url;
                shareInfo.timeline.link = link_share_url;
                shareInfo.appmsg.succCB = function() {
                    shutDownDialog();
                    //成功分享到朋友
                    statistics({
                        "page_name": "share_button",
                        "page_no": pageno,
                        "phone": allHBinfo ? allHBinfo.phone : "",
                        "openid": hbInfo ? hbInfo.openid : "",
                        "hb_id": hbInfo ? hbInfo.id : ""
                    });
                };
                shareInfo.timeline.succCB = function() {
                    shutDownDialog();
                    //成功分享到朋友圈
                    statistics({
                        "page_name": "share_button",
                        "page_no": pageno,
                        "phone": allHBinfo ? allHBinfo.phone : "",
                        "openid": hbInfo ? hbInfo.openid : "",
                        "hb_id": hbInfo ? hbInfo.id : ""
                    });
                };
                dd.share.shareAll(weixinObj, shareInfo);
            });

            //设置手Q分享信息
            mqq.data.setShareInfo({
                title: shareInfo.appmsg.title,
                desc: shareInfo.appmsg.desc,
                image_url: shareInfo.appmsg.img_url
            }, function(r) {});
        }
        //###########链式红包分享结束#########################

        /*
        @@修改手机号
        @@修改手机号只有支付后红包才会有 [hbInfo.type=1]
        */
        var new_sign = doc.getElementById("hid-new-sign");
        new_sign.value = hbInfo.sign;
        var btn_confirm = doc.querySelector(".div-btn-confirm"),
            spChangePhone = doc.getElementById('sp-change-phone'),
            androidAtag = doc.querySelector("#sp-change-phone a"),
            hid_newphone = doc.getElementById("hid-newphone"),
            input_new_phone = doc.querySelector("#div-new-phone input");

        if (androidAtag) {
            base.touch(androidAtag, function() {
                return;
            });

            androidAtag.addEventListener("click", function() {
                return;
            });
        }

        base.touch(btn_modify_phone, function() {
            showPage('page-changephone');
            // showList(allHBinfo,config.defaultTheme);
            if (hbInfo.type == 1) {
                var dvList = doc.getElementById('dv-list');
                dvList.style.display = "none";
            }
            sp_origin_phone.innerText = hid_newphone.value ? hid_newphone.value : spChangePhone.innerText;

            input_new_phone.value = "";
            btn_confirm.className = "div-btn-confirm btn-gray";
            // 输入手机号
            input_new_phone.addEventListener('input', function(e) {
                var tar = e.target;
                tar.value = tar.value.replace(/[^\d]/g, '').slice(0, 11);

                if ((/^1[3|4|5|8|7][0-9]\d{8}$/.test(tar.value))) {
                    btn_confirm.className = 'div-btn-confirm btn-orange';
                    tar.blur();
                } else {
                    btn_confirm.className = "div-btn-confirm btn-gray";
                }
            }, false);
        });

        base.touch(btn_confirm, function() {
            if (btn_confirm.className == "div-btn-confirm btn-gray") return;
            dialog.loading('正在加载', 1500);
            var url = config.globalUri + "changeBindPhone?phone=" + encodeURIComponent(sp_origin_phone.innerText) + "&openid=" + encodeURIComponent(hbInfo.openid) + "&new_phone=" + encodeURIComponent(input_new_phone.value) + "&sign=" + encodeURIComponent(new_sign.value);
            base.ajax({
                url: url,
                method: "get",
                succFunc: function(d) {
                    d = base.txtToJson(d);
                    if (d.errno == 0) {
                        alert("手机号修改成功");
                        new_sign.value = d.sign;
                        hid_newphone.value = input_new_phone.value;
                        showPage("page-result");
                        if (hbInfo.type == 1 && config.defaultTheme.get_record == 1) {
                            var dvList = doc.getElementById('dv-list');
                            dvList.style.display = "block";
                        }
                    } else {
                        alert(d.errmsg);
                    }
                },
                failFunc: function(d) {
                    //请求失败
                    showPage("page-exception");
                }
            });
        });
    })();

    //document.getElementsByClassName("owner-logo")[0].style.backgroundImage = "url(http://10.10.10.138/static/activity/img-hb/head_default.png)";
    //document.getElementsByClassName("owner-logo")[1].style.backgroundImage = "url(http://10.10.10.138/static/activity/img-hb/head_default.png)";
    //document.getElementById("page-grap").style.backgroundImage = "url(http://10.10.10.138/static/activity/img-hb/bgtmp-750-1206.png)";
    document.getElementById("page-grap").style.backgroundSize = "";
    //document.getElementById("page-result").style.backgroundImage = "url(http://10.10.10.138/static/activity/img-hb/bg2tmp-750-1206.png)";
    document.getElementById("page-result").style.backgroundSize = "";

}, false);
