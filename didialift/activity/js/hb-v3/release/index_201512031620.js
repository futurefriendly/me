window.addEventListener('DOMContentLoaded', function() {

    var doc = document,
        pages = [],
        weixinObj,
        currentPage,
        shareInfo,
        base = dd.base || {},
        dialog = dd.dialog || {};

    var txtTel = doc.getElementById('txt-tel'),
        div_master = doc.getElementById("master"),
        hidPageNO = doc.getElementById('hid-page-no'),
        hidErrnoNO = doc.getElementById('hid-errno'),
        btnOpen = doc.getElementById('btn-open'),
        hidThemeCfg = doc.getElementById('hid-theme-config'),
        hidHbInfo = doc.getElementById('hid-hb-info'),
        hidAllHbInfo = doc.getElementById('hid-all-hb-info'),
        hidMoreTicket = doc.getElementById('hid-more-ticket'),
        displayJumpC2C = doc.getElementById('display_jump_c2c'),
        pageGrap = doc.getElementById('page-grap'),
        pageResult = doc.getElementById('page-result'),
        pageChangePhone = doc.getElementById('page-changephone'),
        btn_modify_phone = doc.getElementById("btn-modify-phone"),
        sp_origin_phone = doc.getElementById("sp-origin-phone"),
        // queryStr = base.getQueryStr(),
        tips = doc.getElementById('tips'),
        couponList = doc.getElementById('coupon-list'),
        hidSource = doc.getElementById("hid-source"),
        hidUserInfo = doc.getElementById("hid-userInfo"),
        btns = doc.getElementById('btns'),
        btns_container = doc.getElementById("btns-container"),
        div_activity = doc.getElementById("activity"),
        activity_title = activity.querySelector(".activity-title"),
        activity_content = activity.querySelector(".activity-content"),
        result_header_wrap = doc.querySelector(".result-header-wrap"),
        grap_input_phone = doc.querySelector(".dv-wrap-posi"),
        dv_wrap_result = doc.querySelector(".dv-wrap-posi2"),
        ulList = doc.getElementById('ul-list'),
        dvList = doc.getElementById('dv-list'),
        dv_cover = doc.getElementById("dv-cover"),
        card_list = doc.getElementById("hid-cardlist"),
        config_list = doc.getElementById("hid-configlist"),
        auto_card = doc.getElementById("hid-autocard").value,
        btn_addCard = doc.getElementById("btn-addCard"),
        videotag = doc.querySelector("video"),
        div_video = doc.getElementById("div-video"),
        div_video_show = doc.getElementById("video-show"),
        div_video_play = doc.getElementById("video-play");

    /*
    @@如果PC环境则页面宽度为iphone6的宽度
    @@return [undefined]
    */
    function initPageStyle() {
        if (browserRedirect() == "pc") {
            div_master.style.width = "375px";
            div_master.style.height = "504px";
            doc.body.style.height = "504px";
            div_master.style.margin = "0 auto";
            doc.querySelector("#page-grap .dv-result").style.marginTop = "0px";
            doc.querySelector(".p-tips").style.marginTop = "0px";
            html.style.fontSize = "14.0625px";
            currentFontSize = "14.0625px";
            grap_input_phone.style.top = "31.6rem";
        }
    }
    initPageStyle();

    /*
    @@初始化微信对象
    @@用hbUtils.initWeixin方法无法初始化weixinBridge，时间紧没有再继续debug下去找原因
    @@最后确定两个问题，一是js加载的先后顺序有问题，二是进入页面的时候无法初始化WeixinJSBridge
    @@param  [Function]
    @@return [undefined]
    */
    var initWeixin = function(callback) {
        var onBridgeReady = function() {
            if (!WeixinJSBridge) return;
            weixinObj = WeixinJSBridge;
            weixinObj.call("showOptionMenu");
            weixinObj.call('hideToolbar');
            if (typeof callback === 'function') {
                callback();
            }
        };
        if (typeof WeixinJSBridge === 'undefined') {
            doc.addEventListener('WeixinJSBridgeReady', onBridgeReady);
        } else {
            onBridgeReady();
        }
    };


    /*
    @@点击分享提示蒙层时关闭蒙层
    @@return [undefined]
    */
    function closeShareDiv() {
        dv_cover.addEventListener("click", function(ev) {
            dv_cover.style.display = "none";
            dv_cover.style.height = "100%";
        }, false);
    }
    closeShareDiv();

    /*
    @@页面集合
    @@page-grap 输入手机号页面
    @@page-result 领取结果页
    @@page-exception 异常页
    @@page-changephone 修改手机号页面
    */
    var pageIds = ['page-grap', 'page-result', 'page-exception', 'page-changephone'];
    var hbInfo = base.txtToJson(hidHbInfo.value);
    hidThemeCfg = base.txtToJson(hidThemeCfg.value);
    hidThemeCfg = base.txtToJson(hidThemeCfg.ti_info);
    var allHBinfo = base.txtToJson(hidAllHbInfo.value);
    var globalCreate = base.txtToJson(allHBinfo.create);
    hidMoreTicket = base.txtToJson(hidMoreTicket.value);
    hidSource = base.txtToJson(hidSource.value);
    hidUserInfo = base.txtToJson(hidUserInfo.value);
    card_list = base.txtToJson(card_list.value);
    config_list = base.txtToJson(config_list.value);
    var globalErrno = hidErrnoNO.value;
    var globalPhone = hidUserInfo.phone;
    var globalReplaceStr = '{phone}';
    var bindCardCallback = config.globalUri + 'bindCardCallBack';
    var tempSaveBodyHeight = 0; //临时存储body的高度
    
    
    /*
    @@视频功能
    @@return [undefined]
    */
    function initVideo(){
        if (hidSource.source == 1) {
            div_video.style.display = "none";
        } else if(hidThemeCfg.chk_videoshow){
            var video_url = hidThemeCfg.video_img_url;
            var video_thumbnail_url = hidThemeCfg.video_cover_img_url;

            if (div_video_show && videotag) {
                videotag.src = video_url;
                div_video_show.getElementsByTagName('img')[0].src = video_thumbnail_url;
                
                div_video_show.addEventListener("click", function() {
                    div_video_show.style.display = "none";
                    div_video_play.style.display = "block";
                    videotag.play();
                    statistics({
                        "videoplay": "1"
                    });
                }, false);
        
                var handler = null;
        
                function playHandler() {
                    if (videotag.currentTime >= 15) {
                        div_video_show.style.display = "block";
                        div_video_play.style.display = "none";
                        clearInterval(handler);
                    }
                }
        
                videotag.onplay = function() {
                    handler = setInterval(playHandler, 1000);
                };
                
                div_video.style.display = "block";  
            }
        } else {
            div_video.style.display = "none";
        }
    }
    initVideo();

    /*
    @@当前访问红包的平台
    @@return [String]
    */
    function getPlatForm() {
        if (isIos()) return 'ios';
        if (isAndroid()) return 'android';
        else return 'webapp';
    }

    /*
    @@当前访问红包的渠道
    @@return [String]
    */
    function getChannel() {
        function isWeibo() {
            if (hidSource.source == 1) return true;
            else return false;
        }
        if (isWeixin()) return 'weixin';
        if (isQQBrowser()) return 'mqq';
        if (isWeibo()) return 'weibo';
        if (!isWeixin() && !isQQBrowser() && !isWeibo() && browserRedirect() === "phone") return 'other_mb';
        if (browserRedirect() === "pc") return 'other_pc';
    }

    /*
    @@发送统计请求，后端打日志
    @@params [Object]
    @@return [undefined]
    */
    function statistics(statisObj, callback) {
        var videoplay = "0";
        if (statisObj.videoplay) {
            videoplay = "1";
        }
        var url = config.globalUri + "datastatistics?0=pay_hb_page&product_line=" + hbInfo.prd + "&platform=" + getPlatForm() + "&channel=" + getChannel() + "&phone=" + globalPhone + "&type=" + (statisObj.type || "") + "&theme=" + (statisObj.theme || "") + "&position=" + (statisObj.position || "") + "&num_item=" + hbInfo.rob_cnt + "&listid=" + hbInfo.instance_id + "&videoplay=" + videoplay;
        base.ajax({
            method: "GET",
            url: url,
            succFunc: function() {
                if (typeof callback === "function") {
                    callback();
                }
            },
            failFunc: function() {}
        });
    };

    //微信卡券配置，新版JS SDK
    if (isWeixin() && config_list) {
        wx.config({
            debug: false,
            appId: config_list.appId,
            timestamp: config_list.timestamp,
            nonceStr: config_list.nonceStr,
            signature: config_list.signature,
            jsApiList: ["addCard"]
        });
    }

    /*
    @@批量添加卡券
    @@param [object] [卡券信息]
    @@return [undefined]
    */
    function batchAddCard(cardList, phone) {
        if (!cardList || cardList.length == 0) return;

        function callBack(cardList) {
            base.ajax({
                url: bindCardCallback,
                method: 'POST',
                data: {
                    "card_list": JSON.stringify(cardList),
                    "phone": phone
                },
                succFunc: function() {},
                failFunc: function() {}
            });
        }
        var readyFunc = function onBridgeReady() {
            wx.addCard({
                cardList: cardList, // 需要添加的卡券列表
                success: function(res) {
                    callBack(res.cardList);
                },
                fail: function(res) {
                    callBack(res.cardList);
                }
            });
        };
        if (typeof WeixinJSBridge === "undefined") {
            document.addEventListener('WeixinJSBridgeReady', readyFunc, false);
        } else {
            readyFunc();
        }
    }

    function changeBtnCardStyle(tickets) {
        if (tickets && tickets.coupon_list.length === 1) {
            btn_addCard.style.marginBottom = "5rem";
            if (hidThemeCfg.chk_activity === "1") {
                btn_addCard.style.marginBottom = "2rem";
            }
        }
    }

    /*
    @@展示服务器需要渲染的页面
    @@这个errno实际上是状态
    @@param  [String]
    @@param  [Number]||[String]
    @@return [undefined]
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
            if (fromServerPage === '3') {
                // 3表示老用户
                // 4表示已经领取过这个红包
                // 1 openid 错误
                // 6 入库、绑券等失败
                // 7 签名失败
                var codes = ['1', '3', '4', '6', '7'];
                if (codes.contain(errno)) currentPage = 'page-result';
            }
            if (fromServerPage === '2') {
                // 3表示老用户
                // 4表示已经领取过这个红包
                // 1 openid 错误
                // 6 入库、绑券等失败 
                // 7 签名失败
                //var codes = '10303';
                showPage('page-result');
            }
        }
        currentPage = currentPage || 'page-exception';
    };

    /*
    @@根据页面的值，显示对应的页面
    @@page的值为[page-grap,page-result,page-expection,page-changephone]
    @@param  [String]
    @@return [undefined]
    */
    var showPage = function(page) {
        if (!pages.length) return;
        var item, tmpDom;
        for (var i = pages.length - 1; i >= 0; i--) {
            item = pages[i];
            tmpDom = item && item.dom;
            if (tmpDom) {
                tmpDom.style.display = (page === item.id || page === tmpDom) ? 'inline-block' : 'none';
            }
        }
        currentPage = page;
        sessionStorage.SEARCH_NEW_CURRENT_PAGE = page;
        afterShowPage();
        if (currentPage == "page-grap") {
            statistics({
                theme: 'input'
            });
        }
    };
    
    
    /*
    @@结果页添加乘推乘导流右侧按钮
    @@
    @@errno=0表示正常领取，10301表示是已经领取过的红包
    */
    window.timeRightBar = 0;
    window.expandedClass = "right-bar-expanded";
    window.contractedClass = "right-bar-contracted";
    function initRightBar(){
        if(displayJumpC2C && displayJumpC2C.value == "1" && globalPhone != "" && doc.getElementById('right-bar') == null){
            var barNode = document.createElement("div");
            barNode.id = "right-bar";
            barNode.className = expandedClass;
            barNode.innerHTML = '<div class="right-bar-inner"></div>';
            pageResult.appendChild(barNode);
            doc.getElementById('right-bar').addEventListener("click", function() {
                if(this.className==expandedClass){
                    //activityID：活动id，"1"为乘推乘；recommendMobile：推荐人号码
                    location.href = "http://pay.xiaojukeji.com/growth/index_outside.html?activityID=1&recommendMobile="+globalPhone;
                }
                else{
                    this.className = expandedClass;
                    closeRightBar();
                }
            }, false);
            closeRightBar();
        }
        else{
            return;
        }
    }
    function closeRightBar(){
        //默认展开，5秒后闭合
        if(timeRightBar) clearTimeout(timeRightBar);
        timeRightBar = setTimeout(function(){
            doc.getElementById('right-bar').className = contractedClass;
        },5000);
    }
    

    /*
    @@页面渲染之后的操作
    @@活动说明，领取列表，按钮位置的计算
    @@这一段代码实在是太恶心了！
    @@return [undefined]
    */
    function afterShowPage() {
        doc.body.style.backgroundColor = hidThemeCfg.record_bg;
        html.style.backgroundColor = hidThemeCfg.record_bg;
        div_master.style.backgroundColor = hidThemeCfg.record_bg;

        if (currentPage === "page-grap" || currentPage === "page-changephone" || currentPage === "page-exception") {
            dvList.style.display = 'none';
            div_activity.style.display = 'none';
            if ((currentPage === "page-changephone" || currentPage === "page-exception") && div_video) {
                div_video.style.display = "none";
                videotag.pause();
            }
        } else {
            var coupons = doc.querySelectorAll(".dache-coupon");
            if (hidThemeCfg.chk_activity == "1") {
                div_activity.style.display = "inline-block";
            }
            if (!isWeixin()) {
                btn_addCard.style.display = "none";
            }

            //按钮的个数
            var btnsCount = btns_container.childNodes;
            //活动说明及领取列表的位置 
            //券多于一张时，动态修改活动说明或领取列表的margin-top值
            if (coupons.length > 1) {
                dv_wrap_result.setAttribute("id", "result-dv-wrap");
                btns_container.style.width = "89%";
                btns_container.style.marginLeft = "1.3rem";
                btns.className = "btns";
                doc.querySelector("#page-result .dv-result").style.top = "10.8rem";
                btns_container.parentNode.style.background = hidThemeCfg.btn_bub_bg;
                btns_container.style.marginTop = "0.3rem";

                if (btnsCount.length === 1) { //只有一个按钮时，按钮居中 
                    btns.style.height = "6rem";
                    btnsCount[0].style.marginTop = '1rem';
                }
                if (btnsCount.length === 0) {
                    btns.style.display = "none";
                }
                if (tempSaveBodyHeight) {
                    doc.body.style.height = tempSaveBodyHeight + "px";
                } else {
                    doc.body.style.height = parseInt(doc.body.scrollHeight) + btns.offsetHeight + "px";
                }
            }
            if (coupons.length === 1) {
                btns.style.background = "rgba(0,0,0,0)";
                btns_container.style.background = "rgba(0,0,0,0)";
                if (btnsCount.length > 1) {
                    div_activity.style.marginTop = "-0.3rem";
                }
                if (btnsCount.length === 1 && hidThemeCfg.chk_activity != "1") {
                    dvList.style.marginTop = "-5rem";
                }
                if (btnsCount.length === 1) { //只有一个按钮时，按钮居中 
                    btns.style.height = "6rem";
                    btnsCount[0].style.marginTop = '1rem';
                }
                doc.querySelector(".dache-coupon").style.marginTop = "0.1rem";
            }
            
            initRightBar();
        }
        //PC端按钮宽度及位置
        if (browserRedirect() === "pc" && (coupons && coupons.length > 1)) {
            btns.style.width = "375px";
            btns.style.left = (docuW - 375) / 2 + "px";
        }
    }

    /*
    @@隐藏弹出框，放在微信分享后的回调中
    @@param  [function]
    @@return [undefined]
    */
    var hideDialog = function(callback) {
        var dvWall = doc.getElementById('d-wall'),
            dvWrap = doc.getElementById('d-wrap');

        if (dvWall) dvWall.style.display = 'none';
        if (dvWrap) dvWrap.style.display = 'none';
        if (typeof callback === 'function') callback();
    };

    /*
    @@请求发送中的按钮状态
    @@param  [DOMObject]
    @@param  [String]
    @@return [undefined]
    */
    var actionPreDo = function(tar, txt) {
        if (tar.className !== 'btn-orange') return false;

        dialog.loading('正在加载', 3000);
        tar.className = 'btn-gray';
        innerText(tar, txt);
        txtTel.blur();
    };

    /*
    @@请求发送失败后的按钮状态
    @@param  [DOMObject]
    @@param  [String]
    @@return [undefined]
    */
    var actionFailReset = function(tar, txt) {
        hideDialog(function() {
            tar.className = 'btn-orange';
            txt = txt || "确认";
            innerText(tar, txt);
        });
    };

    /*
    @@请求发送成功后的按钮状态
    @@param  [DOMObject]
    @@param  [String]
    @@return [undefined]
    */
    var actionSuccReset = function(tar, txt) {
        hideDialog(function() {
            tar.className = 'btn-gray';
            txt = txt || "确认";
            innerText(tar, txt);
            txtTel.value = '';
        });
    };


    /*
    @@显示抢红包列表
    @@除了支付后红包，渠道红包与定额红包都不会调用该方法
    @@param  [Object]
    @@param  [Object]
    @@param  [Object]
    @@return [undefined]
    */
    var showList = function(d, themeCfg, coupon_list) {
        if (!d || !d.list_info) return;
        if (themeCfg.get_record !== "1") return;

        var array = d.list_info;
        if (!base.isArray(array)) return;
        var html = [];
        //文案颜色
        var txt_color = themeCfg.record_col;
        var record_count = parseInt(themeCfg.record_count);
        if (array.length > record_count) {
            array = array.slice(0, record_count);
        }
        //生成领取列表HTML
        hbUtils.map(array, function(it) {
            it = base.txtToJson(it);
            var _amount = 0,
                _nickname = it.nickname,
                _comment = config.commentList[Math.ceil(Math.random() * config.commentList.length - 1)];
            if (it.amount == null || typeof it.amount == "undefined") it.amount = 1;
            _amount = isNaN(it.amount) ? "1" : ((typeof it.amount === 'number') ? it.amount.toFixed(2) : parseFloat(it.amount).toFixed(2));
            _nickname = getStringLength(_nickname) > 10 ? subString(_nickname, 10) : _nickname;
            html.push('<li class="grap-list-li" style="border-bottom:1px solid rgba(' + txt_color + ',0.05);"><div class="d-wx-photo" style="margin-right:5px; width:31px; height: 32px; background: url(' + it.head_url + ') no-repeat top left; background-size: 31px 32px;"></div><div class="d-hb-detail"><p><span style="color:rgba(' + txt_color + ',1.0);font-size:1rem;padding-left:1px">' + html2Escape(_nickname) + '</span><span class="hbfont" style="font-size:1rem;color:rgba(' + txt_color + ',0.2)">' + it.create_time + '</span><b class="hb_amount">' + _amount + '元</b></p><p class="comment_tx" style="color:rgba(' + txt_color + ',0.8);font-size:1rem;">' + _comment + '</p></div></li>');
        });

        dvList.querySelector(".hr-tip").style.backgroundColor = "rgba(" + txt_color + ",0.05)";
        dvList.querySelector(".hr-tip span").style.color = "rgba(" + txt_color + ",0.8)";
        dvList.querySelector(".hr-tip span").style.backgroundColor = themeCfg.record_bg;

        ulList.innerHTML = html.join("");
        dvList.style.display = 'block';

        //列表背景颜色
        dvList.style.backgroundColor = themeCfg.record_bg;
        var frinds_tips = doc.getElementById("friends-tips");
        frinds_tips.style.background = themeCfg.record_bg;
        frinds_tips.style.color = 'rgba(' + txt_color + ',0.6)';
    };

    /*
    @@显示券列表，单张或多张券
    @@param  [Object]
    @@param  [Object]
    @@return [String]
    */
    var showMoreTicket = function(tickets, d) {
        if ( !tickets || tickets == "[]" || !tickets.coupon_list ) {
            if (!tickets.coupon_list) console.log('Error! coupon_list is null.');
            doc.getElementById("tips").style.display = "none";
            return;
        }
        var ticketHtml = [];

        var bonus_type_obj = {
            "200": {
                "title": "专车券",
                "bg": "url('http://static.diditaxi.com.cn/activity/img-hb/v3/zhuanche-new.png')",
                "couponType": 'coupon_type_zhuanche'
            },
            "100": {
                "title": "出租车券",
                "bg": "url('http://static.diditaxi.com.cn/activity/img-hb/v3/chuzuche-new.png')",
                "couponType": 'coupon_type_chuzuche'
            },
            "210": {
                "title": "快车券",
                "bg": "url('http://static.diditaxi.com.cn/activity/img-hb/v3/kuaiche-new.png')",
                "couponType": 'coupon_type_kuaiche'
            },
            "150": {
                "title": "顺风车券",
                "bg": "url('http://static.diditaxi.com.cn/activity/img-hb/v3/shunfengche-new.png')",
                "couponType": 'coupon_type_shunfengche'
            },
            "188": {
                "title": "试驾券",
                "bg": "url('http://static.diditaxi.com.cn/activity/img-hb/v3/shichengshijia-new.png')",
                "couponType": "coupon_type_shichengshijia"
            },
            "184": {
                "title": "巴士券",
                "bg": "url('http://static.diditaxi.com.cn/activity/img-hb/v3/bashi-new.png')",
                "couponType": "coupon_type_bashi"
            }
        };
        
        //如果普通卡券启用点击跳转
        var targetPrefix = "",
            targetSuffix = ""
        if( (d.click_coupon_jump && d.click_coupon_jump=='1') || tickets.click_coupon_jump && tickets.click_coupon_jump=='1') {
            targetPrefix = '<a style="display:block;height:100%;margin-top:0;" href="http://d.xiaojukeji.com/c/70263">';
            targetSuffix = '</a>';
        }
        
        [].forEach.call(tickets.coupon_list, function(item, index) {
            ticketHtml.push('<div class="dache-coupon" id="' + bonus_type_obj[item.productid].couponType + '" style="background-image:' + bonus_type_obj[item.productid].bg + '">'+ targetPrefix +'<span class="couponTitle">' + bonus_type_obj[item.productid].title + '</span>');
            var remark = '';
            //item.remark = "这是朱姝要的第三行文案呀呀呀呀哼哼哈兮";
            if (item.remark) {
                remark = '<div class="counpon-remark">' + item.remark + '</div>';
            }
            if (item.couponType === "100") {
                var firstChar = item.discount.toString()[0];
                var lastChar = item.discount.toString()[1];
                ticketHtml.push('<label id="lbl-amount" class="lbl-amount">' + firstChar + '<span class="yuan">.' + lastChar + '折</span></label>' + remark);
            } else if (item.couponType == "103") {
                var amount = (item.vMount / 100).toString();
                var font_size = amount.length >= 3 ? "2rem" : "4.5rem";
                var font_weight = amount.length >= 3 ? "500" : "300";
                ticketHtml.push('<label id="lbl-amount" class="lbl-amount" style="font-size:' + font_size + ';font-weight:' + font_weight + '"><span class="yuan only-pay">仅需支付 </span>' + amount + '</label>' + remark);
            } else {
                ticketHtml.push('<label id="lbl-amount" class="lbl-amount"><span class="yuan">￥ </span>' + item.amount + '</label>' + remark);
            }
            ticketHtml.push(targetSuffix + '</div>');
        });
        couponList.innerHTML = ticketHtml.join("");
        var spChangePhone = doc.getElementById('sp-change-phone');
        var __phone = d.phone || '';
        innerText(spChangePhone, __phone);
        //只在微信中显示修改手机号按钮
        if (hbInfo.access_type == 1 && (isWeixin() || hidSource.source == 1)) {
            btn_modify_phone.style.display = "inline-block";
        }
    }

    /*
    @@ 验证手机号
    @@param  [DOMObject]
    @@param  [DOMObject]
    @@param  [String]
    @@return [undefined]
    */
    function validatePhone(inputObj, btn, extendClz) {
        extendClz = extendClz || "";
        inputObj.addEventListener('input', function(e) {
            var tar = e.target;
            tar.value = tar.value.replace(/[^\d]/g, '').slice(0, 11);
            if ((/^1[3|4|5|8|7][0-9]\d{8}$/.test(tar.value))) {
                btn.className = extendClz + 'btn-orange';
                tar.blur();
            } else btn.className = extendClz + 'btn-gray';
        }, false);
    }
    validatePhone(txtTel, btnOpen);

    /*
    @@显示气泡文案
    @@param  [Object]
    @@return [undefined]
    */
    var showBubbleTips = function(d) {
        if (!d || !d.tip) return;
        var resBubble2 = doc.getElementById('result-bubble-2');
        resBubble2.innerHTML = d.tip;
    };

    /*
    @@js 适配自定义的背景皮肤
    @@不管在mis中有没有传背景，mis都会传一个默认的背景皮肤过来。
    @@屏幕宽度小于320时默认适配为小尺寸的背景（iphone4/4s/5/5s）
    @@屏幕宽度大于320时黑夜适配为大尺寸的背景 (iphone6/plus)
    @@param  [Object]
    @@return [undefined]
    */
    function changeBackgroundImages(themeObj) {
        //加试乘试驾的背景图片
        if (hbInfo.prd == 188) {
            base.ajax({
                "url": config.themeUri + encodeURIComponent(hbInfo.instance_id),
                "method": "GET",
                succFunc: function(success) {
                    var data = JSON.parse(success);
                    if (data.result && data.code == 0) {
                        //themeObj.tel_bg_img_url = data.result;
                        themeObj.res_bg_img_url = data.result;
                    }
                    changeImage();
                },
                failFunc: function() {
                    changeImage();
                }
            });
        } else {
            changeImage();
        }

        function changeImage() {
            var screenWidth = window.screen.width,
                screenHeight = window.innerHeight;
            if (isQQBrowser() || hidSource.source == 1) screenHeight = window.innerHeight + 54;
            if (isQQBrowser() && isAndroid()) screenHeight = screenHeight + 40;

            [].forEach.call([pageGrap, pageResult], function(item) {
                item.style.width = "100%";
                //item.style.height = screenHeight + "px";
                //item.style.backgroundSize = "100%";
                item.style.backgroundRepeat = "no-repeat";
                item.style.backgroundColor = hidThemeCfg.record_bg;
            });
            if (themeObj.tel_bg_img_url) pageGrap.style.backgroundImage = 'url(' + themeObj.tel_bg_img_url + ')';
            if (themeObj.res_bg_img_url) pageResult.style.backgroundImage = 'url(' + themeObj.res_bg_img_url + ')';
        }
    }

    /*
    @@显示错误信息，红包已抢完等
    @@此处在红包已抢完，红包过期等状态的时候显示相应的背景图片，同时背景图片显示page-grap的背景图片
    @@只有正常抢到红包[errno=0]，已抢过红包[errno=10301]时page-result才会显示自己的背景图片
    @@param  [Object]
    @@param  [Number]||[String]
    @@return [undefined]
    */
    var showErrorMsg = function(d, json) {
        if (d == 10301 || d == 0) return;
        var div_gain_tips = doc.querySelector(".dv-result-tips");
        div_gain_tips.style.display = "block";
        if (btns) btns.style.display = "block";
        if (btns) {
            var btn_parent = doc.querySelector("#page-result .dv-result");
            btn_parent.style.height = "10rem";
            btn_parent.style.marginTop = "10rem";
        }
        if (tips) tips.style.display = "none";
        btn_addCard.style.display = "none";

        changeBackgroundImages(hidThemeCfg);

        var grapContents = base.getElesByKls(pageGrap, 'dv-result'),
            resContents = base.getElesByKls(pageResult, 'dv-result');

        hbUtils.map([grapContents[0]], function(it) {
            it.style.display = "none";
        });

        if (hidThemeCfg.tel_bg_img_url) pageResult.style.backgroundImage = 'url(' + hidThemeCfg.tel_bg_img_url + ')';

        result_header_wrap.setAttribute("id", "result-header-wrap");
        dv_wrap_result.setAttribute("id", "expection-result-wrap");
        result_header_wrap.style.position = "absolute";
        result_header_wrap.style.left = '0';
        result_header_wrap.style.width = '100%';
        result_header_wrap.querySelector(".tip-bubble").style.background = "rgba(0,0,0,0)";
        btns_container.parentNode.style.background = "rgba(0,0,0,0)";
        doc.getElementById('result-bubble-2').style.textAlign = "center";
        if (d != 10302) {
            showBubbleTips(config.resPageStMap[d]);
        }

        if (d == 10302) {
            showBubbleTips({
                tip: hidThemeCfg.res_finish
            });
        }

        doc.querySelector("#result-bubble-1").style.display = "none";
        ulList.style.display = "none";
        btns.className = "";
        div_activity.style.display = "none";
        btn_addCard.style.display = "none";

        var themeString = {
            "10302": "finish",
            "11006": "expire",
            "10305": "unlucky"
        };
        var errno_arr = ['10302', '11006', '10305'];

        if (errno_arr.indexOf(d) != -1) {
            statistics({
                theme: themeString[d]
            });
            return;
        }
        statistics({
            theme: 'other'
        });
    }

    /*
    @@替换按钮上的链接上的特殊字符
    @@param [String] [实际的手机号]
    */
    function replacePhone(phone) {
        var redirectBtns = btns_container.querySelectorAll("a");
        for (var i = 0, len = redirectBtns.length; i < len; i++) {
            var data_url = redirectBtns[i].getAttribute("data-url");
            if (data_url) {
                var result_url = replaceTemplate(data_url, globalReplaceStr, phone);
                redirectBtns[i].setAttribute('data-url', result_url);
            }
        }
    }

     /*
    @@领取失败跳转
    @@return [undefined]
    */
    function jumpToApp(){
        setTimeout(function(){
            location.replace('http://d.xiaojukeji.com/c/70255');
            location.href = 'http://d.xiaojukeji.com/c/70255';
        },1000);
    }

    /*
    @@点击打开红包按钮，获取红包
    @@return [undefined]
    */
    function openRedpackage(e) {
        var btnVal = {
            doing: '正在打开...',
            reset: '打开红包'
        };
        if (actionPreDo(e.target, btnVal.doing) === false) return;

        var bubbleTips = {
            '10302': {
                'tip': hidThemeCfg.finish_txt
            },
            '0': {
                'tip': hidThemeCfg.success_txt
            }
        };

        // var urlStr = "";
        // for (var i in hbInfo) {
        //     urlStr += "&" + i + "=" + hbInfo[i];
        // }
        var _interface = "getHongbaoAjax";
        globalPhone = txtTel.value.trim();
        replacePhone(globalPhone);
        //var url = config.globalUri + _interface + '?phone=' + encodeURIComponent(txtTel.value.trim()) + "&user_info=" + JSON.stringify(hidUserInfo) + "&source=" + doc.getElementById("hid-source").value + urlStr;

        var url = config.globalUri + _interface;
        var postData = {
            "phone": encodeURIComponent(txtTel.value.trim()),
            "user_info": JSON.stringify(hidUserInfo),
            "source": doc.getElementById("hid-source").value
        };
        var paramsArray = ["strategy_gid", "prd", "rob_cnt", "instance_id", "sign"];
        for (var i in hbInfo) {
            if (paramsArray.indexOf(i) != -1) {
                postData[i] = hbInfo[i];
            }
        }

        //修改手机号：type=1支付红包有btn_modify_phone
        (hbInfo.access_type == "1" && isWeixin()) ? btn_modify_phone.style.display = "block": btn_modify_phone.style.display = "none";

        base.ajax({
            method: 'POST',
            url: url,
            data: postData,
            succFunc: function(d) {
                d = base.txtToJson(d);
                actionSuccReset(e.target, btnVal.reset);
                var resultObj = {};
                globalCreate = d.errno;
                var weixinCardList = base.txtToJson(d.card_list);
                if (!weixinCardList) { //容错
                    weixinCardList = [];
                }
                if (weixinCardList.length > 0) {
                    btn_addCard.style.display = "block";
                    changeBtnCardStyle(d.coupon_list);
                }
                if (d.errno == "401") {
                    var finish_txt = {};
                    finish_txt.tip = config.resPageStMap[d.errno];
                    resultObj = finish_txt;
                } else {
                    resultObj = config.resPageStMap[d.errno.toString()];
                    if (d.errno == "0") resultObj.tip = hidThemeCfg.res_succ;
                    if (d.errno == "10302") resultObj.tip = hidThemeCfg.res_finish;
                }

                if (d.pageno != "3") {
                    showBubbleTips(resultObj);
                    if (hbInfo.access_type == 1 && (d.errno == 0 || d.errno == 10301) && hidThemeCfg.get_record === "1") {
                        showList(d, hidThemeCfg, d.coupon_list);
                    }

                    if (d.errno == 0) { // 新人领取成功
                        showMoreTicket(d.coupon_list, d);
                        showPage('page-result');
                        if (d.card_auto == "1") {
                            setTimeout(function() {
                                batchAddCard(weixinCardList, globalPhone);
                            }, 500);
                        }
                        if (isWeixin() && weixinCardList.length > 0) {
                            btn_addCard.addEventListener("click", function() {
                                batchAddCard(weixinCardList, globalPhone);
                            }, false);
                        }
                        statistics({
                            theme: 'suc'
                        });
                    } else {
                        // 已抢过 10301
                        // 已抢完 10302
                        // 已过期 10303
                        // 还不能领 304 
                        if (d.errno != 10301) {
                            showErrorMsg(d.errno, d);
                            
                            //启用跳转，下载流量
                            if(d.jump && d.jump =='1' && (d.errno == '11006' || d.errno == '401' || d.errno == '10305' || d.errno == '10302')){
                                jumpToApp()
                            }
                            
                        } else {
                            if (isWeixin()) {
                                btn_addCard.addEventListener("click", function() {
                                    batchAddCard(base.txtToJson(d.card_list), globalPhone);
                                }, false);
                            }
                            showMoreTicket(d.coupon_list, d);
                            var resultObj = (!d.coupon_list) ? ({tip: hidThemeCfg.res_finish}) : config.resPageStMap["'"+d.errno+"'"];
                            showBubbleTips(resultObj); // 显示气泡文案
                            statistics({
                                theme: 'repeat'
                            });
                        }
                        showPage('page-result');
                    }

                } else {
                    location.href = "http://static.diditaxi.com.cn/activity/pages/serverbusy/serverbusy.html?datatype=driver&errmsg=" + d.errmsg + '&errno='+ d.errno +'&phone=' + globalPhone;
                }
            },
            failFunc: function() {
                alert('对不起服务器错误,请稍后再试.');
                actionFailReset(e.target, btnVal.reset);
            }
        });
    }

    //打开红包
    btnOpen.addEventListener("click", function(e) {
        openRedpackage(e);
    }, false);

    /******读取分享、发红包、按钮等文案配置，应用红包主题等******/
    /*
    @@发送红包者配置
    @@param  [String]
    @@return [undefined]
    */
    var applyOwnerLogo = function(logoUrl) {
        if (!logoUrl) return;

        var ownerLogoEles = base.getElesByKls(doc.body, 'owner-logo');
        hbUtils.map(ownerLogoEles, function(item) {
            item.style.backgroundImage = 'url(' + logoUrl + ')';
        });
        ownerLogoEles[0].style.opacity = hidThemeCfg.tel_head_opacity;
    };

    /*
    @@发红包人level-icon
    @@param  [String]
    @@return [undefined]
    */
    var applyOwnerLevelIcon = function(levelIcon) {
        if (!levelIcon) return;

        var ownerLogoEles = base.getElesByKls(doc.body, 'owner-logo');
        var levelInstructionURL = '';
        hbUtils.map(ownerLogoEles, function(item) {
            item.innerHTML = '<i style="background-image:url('+ levelIcon +')"></i>';
            if(levelInstructionURL){
                item.addEventListener("click", function() {
                    location.href = levelInstructionURL;
                }, false);
            }
        });
    }
    
    /*
    @@发红包人nickname
    @@param  [String]
    @@return [undefined]
    */
    var applyNickName = function(nickname) {
        if (!nickname) nickname = "滴滴";
        nickname = nickname = getStringLength(nickname) > 12 ? subString(nickname, 12) : nickname;

        var nicknameEles = doc.querySelectorAll(".nickname");
        hbUtils.map(nicknameEles, function(item) {
            innerText(item, "我是" + nickname + ",");
        });
    }

    // 解析并使用红包主题
    // 这个obj是默认的红包主题结构化数据
    var usingConfig = function(obj, d) {
        if (!obj || !base.isObject(obj)) return;

        // 现实气泡文字
        var applyBubbleTips = function(obj) {
            var defaultSend_Name = '我是滴滴';
            var grapBubbleFst = doc.getElementById('grap-bubble-1'),
                grapBubbleSnd = doc.getElementById('grap-bubble-2'),
                resBubbleFst = doc.getElementById('result-bubble-1'),
                resBubbleSnd = doc.getElementById('result-bubble-2');

            grapBubbleFst.style.color = obj.tel_bub_col;
            grapBubbleSnd.style.color = obj.tel_bub_col;
            resBubbleFst.style.color = obj.res_bub_txt_col;
            resBubbleSnd.style.color = obj.res_bub_txt_col;
            doc.querySelector(".p-tips").style.color = obj.res_bub_txt_col;
            doc.querySelector("#page-result .tip-bubble").style.backgroundColor = obj.res_bub_bg_col;

            if (obj.chk_sendman === "1") {
                obj.send_name = obj.send_name || defaultSend_Name;
            } else {
                obj.send_name = defaultSend_Name;
            }

            obj.send_name = getStringLength(obj.send_name) > 12 ? subString(obj.send_name, 12) : obj.send_name;

            if (hbInfo.access_type != 1) {
                innerText(grapBubbleFst, obj.send_name + ",");
            }
            innerText(grapBubbleFst, obj.send_name);
            innerText(grapBubbleSnd, obj.tel_bub_txt || '');
            if (hbInfo.access_type == 1) {
                resBubbleFst.innerHTML = '<span class="nickname">' + obj.send_name + '</span>';
            } else {
                resBubbleFst.innerHTML = (html2Escape(obj.send_name) + "," || '') + '<span class="nickname"></span>';
            }

            innerText(resBubbleSnd, obj.res_succ || '');
            if (d && typeof d === "object" && currentPage === "page-result") {
                if (d.errno == 0) {
                    innerText(grapBubbleSnd, obj.res_succ || '');
                    innerText(resBubbleSnd, obj.res_succ || '');
                } else if (d.errno == 10302) {
                    innerText(grapBubbleSnd, obj.res_finish || '');
                    innerText(resBubbleSnd, obj.res_finish || '');
                }
            }
        };

        // 应用领取列表样式
        var applyListStyle = function(obj) {
            var ul = doc.getElementById('ul-list'),
                dvList = doc.getElementById('dv-list'),
                allLi = ul.getElementsByTagName('li');

            dvList.style.backgroundColor = obj.record_bg; // 背景颜色

            hbUtils.map(allLi, function(li) {
                li.style.borderBottomColor = obj.get_line_color; //分割线的颜色
                li.getElementsByTagName('b')[0].style.color = obj.get_hig_color; // 突出文案的颜色
            });
        };

        // 应用按钮样式
        var applyButtonConfig = function(obj, d) { //kiki添加需求，非领取页，增加按钮
            var btnCnt = 0;
            var lnks = base.getElesByKls(pageResult, 'btn-orange');

            function insertButton(btnName, btnLink) {
                var a = doc.createElement("a");
                a.setAttribute("class", "btn-orange");
                a.setAttribute("id", btnName);
                a.setAttribute("data-url", btnLink ? btnLink : '');
                btns_container.appendChild(a);
                innerText(a, btnName);
                //按钮二态
                a.addEventListener("touchstart", function(ev) {
                    if (ev.target.className === "btn-orange") {
                        ev.target.style.backgroundColor = "#ee7f00";
                    }
                }, false);

                a.addEventListener("touchend", function(ev) {
                    if (ev.target.className === "btn-orange") {
                        ev.target.style.backgroundColor = "#ff8a01";
                    }
                }, false);
            }

            function getTheme() {
                if (globalErrno == 0) return 'suc';
                if (globalErrno == 10302) return 'finish';
                if (globalErrno == 10301) return 'repeat';
                if (globalErrno == 11006) return 'expire';
                if (globalErrno == 10305) return 'unlucky';
                else return 'other';
            }

            if (obj.chk_btn_01 === '1') {
                btnCnt++;
                var redirectUrl = replaceTemplate(obj.btn_link_01, globalReplaceStr, globalPhone);
                insertButton(obj.btn_name_01, redirectUrl);
                var btn1 = doc.getElementById(obj.btn_name_01);
                btn1.addEventListener("click", function() {
                    statistics({
                        type: "button_1",
                        position: '1',
                        theme: getTheme()
                    }, function() {
                        location.href = btn1.getAttribute("data-url");
                    });

                }, false);
            }

            if (obj.chk_btn_02 === "1") {
                btnCnt++;
                var redirectUrl = replaceTemplate(obj.btn_link_02, globalReplaceStr, globalPhone);
                insertButton(obj.btn_name_02, redirectUrl);
                var btn2 = doc.getElementById(obj.btn_name_02);
                btn2.addEventListener("click", function() {
                    statistics({
                        type: "button_2",
                        position: '2',
                        theme: getTheme()
                    }, function() {
                        location.href = btn2.getAttribute("data-url");
                    }, function() {});

                }, false);
            }

            //分享按钮，在微信下无此按钮
            if (obj.chk_btn_03 === "1" && !isWeixin() && browserRedirect() == "phone") {
                btnCnt++;
                insertButton(obj.btn_name_03, obj.btn_link_03);
                var btn3 = doc.getElementById(obj.btn_name_03);
                btn3.setAttribute("href", "javascript:void(0)");
                if (isQQBrowser()) {
                    base.touch(btn3, function(ev) {
                        statistics({
                            type: "button_3",
                            position: '3',
                            theme: getTheme()
                        });
                        ev.preventDefault();
                        mqq.ui.showShareMenu();
                    });
                } else {
                    //非微信环境的移动端就弹指引蒙层好了
                    btn3.addEventListener("click", function(ev) {
                        statistics({
                            type: "button_3",
                            position: '3',
                            theme: getTheme()
                        });
                        ev.preventDefault();
                        dv_cover.style.display = "block";
                        dv_cover.style.height = document.body.clientHeight + "px";
                        document.body.scrollTop = 0;
                        App.trigger('scrollTo', 0);
                    }, false);
                }
            }

            //如果配置了，且在微信环境下才会有此按钮
            if (obj.chk_btn_04 === "1" && btnCnt <= 2) {
                btnCnt++;
                var redirectUrl = replaceTemplate(obj.btn_link_04, globalReplaceStr, globalPhone);
                insertButton(obj.btn_name_04, redirectUrl);
                var btn4 = doc.getElementById(obj.btn_name_04);
                btn4.addEventListener("click", function() {
                    statistics({
                        type: "button_3",
                        position: '3',
                        theme: getTheme()
                    }, function() {
                        location.href = btn4.getAttribute("data-url");
                    });

                }, false);
            }

            if (btnCnt === 3) {
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
        };

        var applyActivity = function(obj) {
            if (obj.chk_activity === "1") {
                div_activity.style.display = "inline-block";
                innerText(activity_title, obj.act_title);
                activity_content.innerHTML = obj.act_cont ? obj.act_cont : "";
                // div_activity.style.backgroundColor = obj.act_bg;
                div_activity.style.color = obj.act_col;
            }
        }

        innerText(btnOpen, obj.tel_btn_txt || "领取打车券");
        applyOwnerLogo(obj.send_img_url);
        applyBubbleTips(obj);
        applyListStyle(obj);
        applyButtonConfig(obj, d);
        applyActivity(obj);
        div_master.style.background = obj.record_bg;
    };

    // 初始化
    (function init() {
        var pageno = hidPageNO.value,
            errno = hidErrnoNO.value;

        var initPages = function(array) {
            hbUtils.map(array, function(item) {
                var tmp = doc.getElementById(item);
                pages.push({
                    id: item,
                    dom: tmp
                });
            });
        };
        initPages(pageIds); // 初始化页集合
        // 兼容placeholder
        hbUtils.compatibilityPlaceHolder([txtTel]);
        // 根据pageno 和 errno 设置当前要显示的页面
        // 这个函数只决策当前要显示的页面，根据提页面状态无关
        setLoadPage(pageno, errno);
        usingConfig(hidThemeCfg, {
            errno: errno
        });
        changeBackgroundImages(hidThemeCfg);

        //为可口可乐赋值手机号,并且不能修改
        function coke() {
            if (getQueryString("flag") && getQueryString("flag") != true) {
                var phoneTxt = doc.getElementById("phoneTxt");
                innerText(phoneTxt, "");
                txtTel.readOnly = true;
                txtTel.value = getQueryString("mobile");
                btnOpen.className = "btn-orange";
            }
        }
        coke();

        //输手机号页面复选按钮事件
        var checkbox = doc.getElementById("checked-box");
        var activitybox = doc.querySelector(".didi-activity");
        activitybox.addEventListener("click", function(ev) {
            if (ev.target.id !== "linkbox") {
                if (checkbox.className === "checked") {
                    checkbox.className = "unchecked";
                } else {
                    checkbox.className = "checked";
                }
            }
        }, false);

        if (pageno == 2) {
            if (errno == 0) {
                statistics({
                    theme: 'suc'
                });
            }
            if (errno == 10301) {
                statistics({
                    theme: 'repeat'
                });
            }

            if (card_list.length === 0) {
                btn_addCard.style.display = "none";
            }
            if (auto_card == "1" && errno == 0) {
                setTimeout(function() {
                    batchAddCard(card_list, hidUserInfo.phone);
                }, 500);
            }

            if (isWeixin() && (errno == 0 || errno == 10301) && card_list.length > 0) {
                btn_addCard.style.display = "block";
                changeBtnCardStyle(hidMoreTicket);
                btn_addCard.addEventListener("click", function() {
                    batchAddCard(card_list, hidUserInfo.phone);
                }, false);
            }
        }

        /*
        @@老用户直接抢红包，直接进入到红包结果页面并初始化分享信息
        @@pageno=2表示领取的结果页
        @@errno=0表示正常领取，10301表示是已经领取过的红包
        */
        function showResult() {
            if (pageno === '2' && hbInfo.access_type == 1) {
                if (allHBinfo) {
                    if (errno == 0 || errno == 10301) {
                        showMoreTicket(hidMoreTicket, hidUserInfo);
                    }
                    if (errno == 10301) {
                        var resultObj = (!hidMoreTicket.coupon_list)? ({tip: hidThemeCfg.res_finish}) : config.resPageStMap[errno];
                        showBubbleTips(resultObj); // 显示气泡文案
                    }
                    if (globalCreate.nickname && globalCreate.head_url) {
                        applyOwnerLogo(globalCreate.head_url);
                        applyNickName(globalCreate.nickname);
                        applyOwnerLevelIcon(globalCreate.level_icon_url);
                    }
                    if (hidThemeCfg.get_record == 1 && (errno == 0 || errno == 10301)) {
                        showList(allHBinfo, hidThemeCfg, hidMoreTicket.coupon_list);
                    }
                }
            }
        }
        showResult();
        showPage(currentPage);
        showErrorMsg(errno);

        /*
        @@设置微博分享链接
        */
        function setWeiboShare() {
            App.trigger('setBrowserTitle', '滴滴出行');
            if (hidThemeCfg.chk_weibo === "1") {
                App.trigger('setShareDefaultText', hidThemeCfg.weibo_cont);
            }
        }
        setWeiboShare();

        /*
        @@设置分享信息
        @@weiXin/mqq
        */
        function setShareInfo() {
            if (hidThemeCfg.chk_share === "1") {
                shareInfo = hbUtils.genShareInfo(hidThemeCfg);
                initWeixin(function() {
                    dd.share.shareAll(weixinObj, shareInfo);
                });
                //手Q分享信息
                mqq.data.setShareInfo({
                    title: shareInfo.appmsg.title,
                    desc: shareInfo.appmsg.desc,
                    image_url: shareInfo.appmsg.img_url
                }, function(r) {});
            } else {
                initWeixin(function() {
                    weixinObj.call("hideOptionMenu");
                });
            }
        }
        setShareInfo();

        /*
        @@修改手机号
        @@修改手机号只有支付后红包才会有 [hbInfo.access_type=1]
        */
        var new_sign = doc.getElementById("hid-new-sign");
        new_sign.value = hbInfo.sign;
        var btn_confirm = doc.querySelector(".div-btn-confirm"),
            spChangePhone = doc.getElementById('sp-change-phone'),
            androidAtag = doc.querySelector("#sp-change-phone a"),
            hid_newphone = doc.getElementById("hid-newphone"),
            input_new_phone = doc.querySelector("#div-new-phone input");

        /*
        @@有些型号的安卓手机会给页面上的手机号加上a标签，能点击然后跳一个404页面，所以如果有a标签就要把他的点击事件干掉
        @@此处是一个坑，目前碰到的机型是三星，米3，米4
        */
        function specialHandleForAndroid() {
            if (androidAtag) {
                base.touch(androidAtag, function() {
                    return;
                });
                androidAtag.addEventListener("click", function() {
                    return;
                });
            }
        }
        specialHandleForAndroid();

        /*
        @@展示修改手机号页面
        */
        base.touch(btn_modify_phone, function() {
            window.scrollTo(0, 0);
            showPage('page-changephone');
            tempSaveBodyHeight = doc.body.style.height;
            if (hbInfo.access_type == 1) {
                dvList.style.display = "none";
            }
            sp_origin_phone.innerText = hid_newphone.value ? hid_newphone.value : spChangePhone.innerText;
            input_new_phone.value = "";
            btn_confirm.className = "div-btn-confirm btn-gray";
            validatePhone(input_new_phone, btn_confirm, "div-btn-confirm ");
        });

        pageChangePhone.addEventListener("touchmove", function(ev) {
            ev.preventDefault();
            return;
        }, false);

        /*
        @@修改手机号
        */
        base.touch(btn_confirm, function() {
            if (btn_confirm.className == "div-btn-confirm btn-gray") return;
            dialog.loading('正在加载', 1500);
            // var url = config.globalUri + "changeBindPhone?phone=" + encodeURIComponent(sp_origin_phone.innerText) + "&user_info=" + JSON.stringify(hidUserInfo) + "&source=" + doc.getElementById("hid-source").value + "&new_phone=" + encodeURIComponent(input_new_phone.value) + "&sign=" + encodeURIComponent(hbInfo.sign) + "&instance_id=" + hbInfo.instance_id;
            var url = config.globalUri + "changeBindPhone";
            base.ajax({
                url: url,
                method: "POST",
                data: {
                    "phone": encodeURIComponent(sp_origin_phone.innerText),
                    "user_info": JSON.stringify(hidUserInfo),
                    "source": doc.getElementById("hid-source").value,
                    "new_phone": encodeURIComponent(input_new_phone.value),
                    "sign": encodeURIComponent(hbInfo.sign),
                    "instance_id": hbInfo.instance_id
                },
                succFunc: function(d) {
                    d = base.txtToJson(d);
                    if (d.errno == 0) {
                        alert("手机号修改成功");
                        //new_sign.value = d.sign;
                        hid_newphone.value = input_new_phone.value;
                        showPage("page-result");
                        if (hbInfo.access_type == 1 && hidThemeCfg.get_record == 1) {
                            var dvList = doc.getElementById('dv-list');
                            dvList.style.display = "block";
                        }
                    } else {
                        alert(d.errmsg);
                    }
                },
                failFunc: function(d) {
                    showPage("page-exception");
                }
            });
        });
    })();

}, false);