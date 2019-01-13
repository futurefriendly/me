window.addEventListener('DOMContentLoaded', function() {
	
   /* var ua=navigator.userAgent;
    if(ua.indexOf('MicroMessenger')!=-1){
	if(location.href.toLowerCase().indexOf("wxsource")==-1){
		location.href="http://pay.xiaojukeji.com/activity/hongbao/c_recommend/wxsource";
	}	
    }*/

    var doc = document,
        pages = [],
        weixinObj,
        currentPage,
        base = dd.base || {},
        dialog = dd.dialog || {},
        pageIds = ['page-grap', 'page-result-1', 'page-result-2', 'page-gen-hb-1', 'page-gen-hb-2', 'page-exception'],
        pageMap = {
            '0': 'page-gen-hb-1', // 0 表示生成红包页面
            '1': 'page-gen-hb-2', // 1 表示生成红包结果页面
            '2': 'page-grap', // 2 表示抢红包输入手机号页面
            '3': 'page-result-1', // 3 表示抢红包结果页面(服务器端我们没有区分成功，失败等状态，还有一个errno)
            '4': 'page-result-2'
        },
        resPageStMap = { // 抢红包结果页面各种状态map
            '0': {    //成功
                tip: '4个小伙伴，3个用滴滴，你已经是滴滴小伙伴啦'
            },
            '1004': { // 老用户抢红包
                tip: '你已经是滴滴小伙伴了，不能领我的邀请红包了哟~'
            },
            '1005': { // 还有新手券未过期，暂时不能抢
                tip: '你已经领过红包了，快去使用吧' // 妈蛋这句话不是固定的要带上姓名
            }
        };

    /*
    @@获取url中的参数
    @@return [string]
    */
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return "";
    }

    // 红包链接，上线变更
    // 默认头像，当获取发红包用户信息失败时候
    // 下载或者打开滴滴客户端配置
    var globalUri = 'http://pay.xiaojukeji.com/activity/hongbao/c_recommend/',
        wxSourceUri = 'http://pay.xiaojukeji.com/activity/hongbao/c_recommend/wxSource';
    /* var globalUri = 'http://test.diditaxi.com.cn/zhaowanli/fenai/c_recommend/',
        wxSourceUri = 'http://test.diditaxi.com.cn/zhaowanli/fenai/c_recommend/wxSource';*/

    if(getQueryString("show")=="1"){
        wxSourceUri+="?show=1";
    }

    var defaultLogo = '/';
    var didiAppCfg = {
        ios: {
            "packageName": "com.xiaojukeji.didi",
            "packageUrl": "diditaxi:passenger",
            "downloadUrl": "https://itunes.apple.com/cn/app/di-di-da-che-zhi-jian-shang/id554499054?ls=1&mt=8"
        },
        android: {
            "packageName": "com.sdu.didi.psnger",
            "packageUrl": "didipasnger://didi_apk_intalled_scheme",
            "downloadUrl": "http://dldir1.qq.com/diditaxi/apk/didi_psngr.apk"
        }
    };

    // 页面DOM元素
    var txtTel = doc.getElementById('txt-tel'),
        txtGenTel = doc.getElementById('txt-gen-tel'),
        hidPageNO = doc.getElementById('hid-page-no'),
        hidErrnoNO = doc.getElementById('hid-errno'),
        hidErrmsg = doc.getElementById('hid-errmsg'),
        btnOpen = doc.getElementById('btn-open'),
        btnGen = doc.getElementById('btn-gen'),
        btnNewerShare = doc.getElementById('btn-newer-share'),
        btnOlderShare = doc.getElementById('btn-older-share'),
        //btnShare = doc.getElementById('btn-share'),
        btnHideCover = doc.getElementById('btn-hide-cover'), //生成红包页面的链接
        pResultTip = doc.getElementById('p-result-tip'),
        pResultBanner = doc.getElementById('p-result-banner'),
        spIcon = doc.getElementById('sp-icon'),
        hidPhone = doc.getElementById('hid-phoneno'),
        hidDefaultP = doc.getElementById('hid-default-phone'),
        hidRebateP = doc.getElementById('hid-rebate-phone'),
        hidCheckInfo = doc.getElementById('hid-check-info'),
        newerGiftText = doc.getElementById('newer-gift-text'),
        queryStr = base.getQueryStr();


    if(hidErrnoNO.value=="1001"){
        alert("参数错误，复制链接分享时注意是否复制完整");
        return;
    }

    function changeNewSkin(currentPage){
        var newskill=getQueryString("show");
        if(newskill=="1"){
            var page_container=document.getElementById(currentPage);
            if(currentPage==="page-gen-hb-1"||currentPage==="page-gen-hb-2"){
                page_container.style.backgroundImage='url("/static/activity/imgs/recommend/spring_01.png")';   
            }
            if(currentPage==="page-result-1"){
                page_container.style.backgroundImage='url("/static/activity/imgs/recommend/spring_03.png")';   
            }
            if(currentPage==="page-grap"||currentPage==="page-result-2"){
                page_container.style.backgroundImage='url("/static/activity/imgs/recommend/spring_02.png")'; 
            }
            page_container.style.backgroundRepeat="no-repeat";
        }
    }

    // 兼容type为tel的placeholder特性
    var compatibilityPlaceHolder = function(array) {
        if (!array || !array.length) return;

        // 是否支持placeholder
        var hasPlaceHolder = function() {
            return ('placeholder' in document.createElement('input'));
        };

        var phcfg = {
            placeholder: '#888',
            fill: '#666',
            tip: '请输入您的手机号'
        };
        // 获得焦点
        var focus = function(e) {
            e.target.value = '';
            e.target.style.color = phcfg.fill;
        };

        // 失去焦点
        var blur = function(e) {
            e.target.value = '';
            e.target.color = phcfg.placeholder;
        };

        // 处理兼容
        var doCompact = function(txtBox) {
            if (!hasPlaceHolder()) {
                txtBox.value = phcfg.tip;
                txtBox.style.color = phcfg.placeholder;
                txtBox.addEventListener('focus', focus, false);
                txtBox.addEventListener('blur', blur, false);
            } else {
                txtBox.style.color = phcfg.fill;
            }
        };

        for (var i = array.length - 1; i >= 0; i--) {
            doCompact(array[i]);
        }
    };

    // 简单的数组map
    var map = function(array, callback) {
        if (!base.isArray(array)) return;
        var tmp;
        for (var i = array.length - 1; i >= 0; i--) {
            tmp = array[i]
            if (!tmp) continue;
            callback(tmp);
        };
    }

    // 展示服务器需要渲染的页面
    // 这个errno实际上是状态
    var setLoadPage = function(fromServerPage, errno) {

        // 数组包含对象
        var contains = function(arr, item) {
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === item) {
                    return true;
                }
            };
            return false;
        };

        // 用户主动刷新 和 第一次从外边链接请求是一样的，优先使用服务器指定的
        // 当用户做了一些操作后，用户进入的页面服务器会知晓的，所以不需要担心页面信息不同步的问题
        if (!errno || errno === '0') {
            var tmpPage = sessionStorage.SEARCH_NEW_CURRENT_PAGE;
            currentPage = (fromServerPage.length || !tmpPage) ? pageMap[fromServerPage] : tmpPage;
        } else {
            // 抢红包结果页面，有很多状态
            if (fromServerPage === '3') {
                if (errno === '1008') {
                    currentPage = 'page-result-1';
                }
                var codes = ['1008']; // 表示抢红包正常
                if (contains(codes, errno)) {}
            }
        }
        currentPage = currentPage || 'page-exception';
    };

    // 隐藏弹出框，本来这个地方应该集成到ajax里面
    // 后续优化
    var hideDialog = function(callback) {
        var dvWall = doc.getElementById('d-wall'),
            dvWrap = doc.getElementById('d-wrap');
        if (dvWall) dvWall.style.display = 'none';
        if (dvWrap) dvWrap.style.display = 'none';
        if (typeof callback === 'function') {
            callback();
        }
    };

    // 显示指引蒙层
    var showShadeLayer = function(txt) {
        var dvCover = doc.getElementById('dv-cover');
        if (!dvCover) return;
        dvCover.style.height = doc.documentElement.scrollHeight + 'px';
        dvCover.style.display = 'block';
    };

    // input event
    var inputHandler = function(e) {
        var tar = e.target;
        tar.value = tar.value.replace(/[^\d]/g, '').slice(0, 11);
        var classN = 'btn-gray';
        if ((/^1[3|4|5|8|7][0-9]\d{8}$/.test(tar.value))) {
            classN = 'btn-orange';
            tar.blur();
        }
        if (tar === txtTel) btnOpen.className = classN;
        if (tar === txtGenTel) btnGen.className = classN;
    };

    // 输入手机号
    txtTel.addEventListener('input', inputHandler, false);
    txtGenTel.addEventListener('input', inputHandler, false);

    if (txtTel.value) {
        var tar = txtTel;
        tar.value = tar.value.replace(/[^\d]/g, '').slice(0, 11);
        var classN = 'btn-gray';
        if ((tar.value && tar.value.length === 11)) {
            classN = 'btn-orange';
            tar.blur();
        }
        if (tar === txtTel) btnOpen.className = classN;
        if (tar === txtGenTel) btnGen.className = classN;
    }

    // check and pre action
    var actionPreDo = function(tar, txt) {
        if (tar.className !== 'btn-orange') return false;

        dialog.loading('正在加载', 30000);
        tar.className = 'btn-gray';
        tar.innerText = txt;
        txtTel.blur();
        txtGenTel.blur();
    };

    // failed reset
    var actionFailReset = function(tar, txt) {
        hideDialog(function() {
            tar.className = 'btn-orange';
            tar.innerText = txt || "确认";
        });
    };

    // succ reset
    var actionSuccReset = function(tar, txt) {
        hideDialog(function() {
            tar.className = 'btn-gray';
            tar.innerText = txt || "确认";

            txtTel.value = '';
            txtGenTel.value = '';
        });
    };

    //根据不同的平台返回对应的字符串
    var device="ios";
    base.diffPlatform({
        "android":function(){
            device="android";
        },
        "ios":function(){
            device="ios"
        },
        "wp":function(){
            device="wp";
        }
    });

    //分享回调函数
    var shareCallBack=function(){
        base.ajax({
            method:"GET",
            url:" http://pay.xiaojukeji.com/activity/hongbao/c_recommend/wx_share_succ?phone="+(hidRebateP.value||hidPhone.value)+"&device="+device,
            succFunc:function(){
            },
            failFunc:function(){
            }
        });
    };


    // 生成分享信息
    var genShareInfo = function(d) {
        var _share_link=d.share_url,
            _share_img_url=d.share_img_url;

        if(getQueryString("show")==1){
            _share_link=d.share_url.indexOf("?")!=-1?d.share_url+"&show=1":d.share_url+"?show=1";
        }
        _share_img_url="/static/activity/imgs/recommend/spring_share.png";
        return {
            appmsg: {
                appid: 'wx69b6673576ec5a65',
                link: _share_link,
                img_url:_share_img_url,
                title: d.share_title || ' ',
                desc: d.share_desc || ' ',
                succCB:shareCallBack
            },
            timeline: {
                appid: 'wx69b6673576ec5a65',
                link: _share_link,
                img_url:_share_img_url,
                title: d.share_title || ' ',
                desc: d.share_desc || ' ',
                succCB:shareCallBack
            }
        };
    };

    // 生成红包结果页面提示信息
    var showGenSuccTips = function(phone) {
        if (!phone) return;
        doc.getElementById('p-gen-succ-tip').innerText = '奖励将放入滴滴账户' + phone;
    }

    // 显示发红包者logo
    var showSenderLogo = function(logoUrl) {
        if (!logoUrl) logoUrl = '';
        var ownerLogoEle = base.getElesByKls(doc.body, 'owner-logo');
        var item = null;
        for (var i = ownerLogoEle.length - 1; i >= 0; i--) {
            item = ownerLogoEle[i];
            item.style.backgroundImage = 'url(' + logoUrl + ')';
        };
    };

    // 显示气泡文案
    var showBubbleTip = function(obj) {
        if (!obj || !base.isObject(obj)) return;

        var tmpNickName, tmpTips,
            bubbles = base.getElesByKls(doc.getElementById(obj.pageflag), 'tip-bubble'),
            gift_text = base.getElesByKls(doc.getElementById(obj.pageflag),'newer-gift-text'),
            subs = bubbles[0].getElementsByTagName('p');


        if (obj.pageflag === 'page-grap') { // 抢红包输入手机号页面文案

            tmpNickName = (!obj.nickname || obj.nickname === '小伙伴') ? '我是滴滴小伙伴~' : ('我是滴滴小伙伴 ' + (obj.nickname || '') + '~');
            tmpTips = (obj.register_days && obj.owner_order_num) ? ('使用滴滴' + obj.register_days + '天，叫车' + obj.owner_order_num + '次，感觉棒棒哒，邀请你一起来~') : '用滴滴感觉棒棒哒，邀请你一起来！';
        }
        if (obj.pageflag === 'page-result-1' && obj.errno === 0) { // 抢红包成功页面
            tmpNickName = obj.nickname ? ('Hi，' + obj.nickname) : 'Hi，小伙伴';
            tmpTips = '4个小伙伴，3个用滴滴，打车3缺1，就差一个你！';
        }
        if (obj.pageflag === 'page-result-1' && obj.errno === '1008') { // 再次进入抢红包结果页面（成功）
            tmpNickName = obj.nickname ? ('Hi，' + obj.nickname) : 'Hi，小伙伴';
            tmpTips = '这是你已经领过的红包哦~';
        }
        if (obj.pageflag === 'page-result-2' && obj.errno === 1004) { // 老用户抢红包
            tmpNickName = obj.nickname ? ('Hi，' + obj.nickname) : 'Hi，小伙伴';
            tmpTips = '你已经是滴滴小伙伴了，不能领我的邀请红包了哟~';
            if(gift_text[0]) gift_text[0].innerText="只有新伙伴才能领哦~";
        }
        if (obj.pageflag === 'page-result-2' && obj.errno === 1005) { // 已经领过，但是红包还未过期
            tmpNickName = obj.nickname ? ('Hi，' + obj.nickname) : 'Hi，小伙伴';
            tmpTips = '你已经领过小伙伴的邀请红包，快去使用吧~';
            if(gift_text[0]) gift_text[0].innerText="你已经领过了~";
        }

        if (subs[0]) subs[0].innerText = tmpNickName;
        if (subs[1]) subs[1].innerText = tmpTips;

        if(getQueryString("show")=="1"){//朱叔说不用换颜色
            //subs[0].style.color="#cf2c29";
            //subs[0].style.paddingLeft="5px";
            //subs[1].style.color="#cf2c29";
            //subs[1].style.paddingLeft="5px";
        }
    };

    // 抢红包成功正常填充手机号和金额
    var fillAmountAndPhone = function(d) {
        // alert(d + ' ' + d.hb_amount + ' ' + d.phone);
        if (!d || !d.hb_amount || !d.phone) return;

        var lblAmount = doc.getElementById('lbl-amount');
        var spChangePhone = doc.getElementById('sp-change-phone');
        lblAmount.innerText = d.hb_amount + '元';
        spChangePhone.innerText = d.phone;
    };

    // 生成红包
    base.touch(btnGen, function(e) {
        var tar = e.target;
        var btnVal = {
            doing: '正在生成...',
            reset: '生成红包'
        };
        if (actionPreDo(tar, btnVal.doing) === false) return;

        // 失败的动作
        var failedAction = function(msg) {
            dd.dialog.alert({
                tip: msg || '对不起，程序出现了一点问题~',
                btn: {
                    val: '我知道了',
                    handler: function() {
                        actionFailReset(tar, btnVal.reset);
                    }
                }
            });
            tar.className = 'btn-orange';
            tar.innerText = txt || "确认";
        };

        var checkInfo = base.txtToJson(hidCheckInfo.value);

        base.ajax({
            method: 'GET',
            url: globalUri + 'ajaxCreateShareUrl?phone=' + txtGenTel.value.trim() + '&unique=' + checkInfo.unique + '&timestamp=' + checkInfo.timestamp + '&sign=' + encodeURIComponent(checkInfo.sign),
            succFunc: function(d) {
                d = base.txtToJson(d);
                if (d.errno === 0) {

                    showGenSuccTips(d.rebate_phone);
                    if (d.shareinfo) {
                        showSenderLogo(d.shareinfo.owner_header_img);
                        var share_info = genShareInfo(d.shareinfo);

                        if (weixinObj) {
                            dd.share.shareAll(weixinObj, share_info);
                        }
                    }
                    actionSuccReset(tar, btnVal.reset);
                    changeNewSkin('page-gen-hb-2');
                    showPage('page-gen-hb-2');
                } else {
                    failedAction(d.errmsg);
                }
            },
            failFunc: failedAction
        });

    });

    // 打开红包
    base.touch(btnOpen, function(e) {
        var btnVal = {
            doing: '正在打开...',
            reset: '打开红包'
        };
        if (actionPreDo(e.target, btnVal.doing) === false) return;

        var checkInfo = base.txtToJson(doc.getElementById('hid-open-check-info').value);
        var url = globalUri + 'receive_result?msisdn=' + checkInfo.msisdn + '&phone=' + txtTel.value.trim();

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

        base.ajax({
            method: 'GET',
            url: url, // ajax为1是因为葫芦娃的后台方法是一个，应该区分开
            succFunc: function(d) {
                //alert(d);
                d = base.txtToJson(d);
                actionSuccReset(e.target, btnVal.reset);

                if (d.errno === 0) { // 新人领取成功
                    if (d.info) {
                        fillAmountAndPhone(d.info);
                        var mine_info = d.info.mine_share;
                        var share_data = genShareInfo(mine_info);

                        showBubbleTip({
                            pageflag: 'page-result-1',
                            nickname: mine_info && mine_info.owner_nick_name,
                            errno: d.errno
                        });

                        dd.share.shareAll(weixinObj, share_data);
                        changeNewSkin('page-result-1');
                        showPage('page-result-1');

                        if (d.info.seed_url) {
                            doc.getElementById('hid-seed-url').value = d.info.seed_url;
                        }
                    }
                } else if (d.errno === 1004 || d.errno === 1005) {
                    // 1004 老用户
                    // 1005 已领过但是，券未过期（因为新手红包必须要先使用）
                    if (d.info) {
                        var mine_info = d.info.mine_share;
                        var share_data = genShareInfo(mine_info);

                        showBubbleTip({
                            pageflag: 'page-result-2',
                            nickname: mine_info && mine_info.owner_nick_name,
                            errno: d.errno
                        });

                        dd.share.shareAll(weixinObj, share_data);
                        changeNewSkin('page-result-2');
                        showPage('page-result-2');

                        if (d.info.seed_url) {
                            doc.getElementById('hid-seed-url').value = d.info.seed_url;
                        }
                    }
                } else if (d.errno === 1009 || d.errno === 1011) {
                    // 1009 表示不能领自己的红包
                    // 1011 表示还有未使用的打车券
                    if (d.info) {
                        //alert(d.info.seed_url);
                        //location.replace(d.info.seed_url || 'http://diditaxi.com.cn/activity/hongbao/c_recommend/wxSource');
                        if(getQueryString("show")=="1"){
                            d.info.seed_url=d.info.seed_url.indexOf("?")!=-1?(d.info.seed_url+"&show=1"):(d.info.seed_url+"?show=1");
                        }
                        location.replace(d.info.seed_url || wxSourceUri);
                    }
                } else {
                    if (d.errmsg) {
                        dAlert(d.errmsg);
                        return;
                    }
                }
            },
            failFunc: function() {
                alert('对不起服务器错误,请稍后再试.');
                actionFailReset(e.target, btnVal.reset);
            }
        });
    });

    var didiAppHandler = function(e) {
        var params;
        base.diffPlatform({
            ios: function() {
                params = didiAppCfg.ios
            },
            android: function() {
                params = didiAppCfg.android
            }
        });
        setTimeout(function() {
            WeixinJSBridge.invoke('getInstallState', params, function(e) {
                var msg = e.err_msg;
                location.href = (msg.indexOf("get_install_state:yes") > -1) ? params.packageUrl : params.downloadUrl;
            });
        }, 200);
    };

    // 滴滴客户端，已安装则生成，未安装则下载
    base.touch(doc.getElementById('btn-didiapp'), didiAppHandler, false);
    base.touch(doc.getElementById('btn-didiapp-2'), didiAppHandler, false);

    // 隐藏指引分享蒙层
    base.touch(btnHideCover, function(e) {
        var ddCover = doc.getElementById('dv-cover');
        if (ddCover) {
            ddCover.style.display = 'none';
        }
    });

    // 分享按钮的handler
    var shareHandler = function(e) {
        if (e.target.className !== 'btn-orange') return;

        if (e.target === btnNewerShare || e.target === btnOlderShare) {
            var seedUrl = doc.getElementById('hid-seed-url').value;
            if(getQueryString("show")=="1"){
                seedUrl=seedUrl.indexOf("?")!=-1?seedUrl+"&show=1":seedUrl+"?show=1";
            }
            //location.replace(seedUrl || 'http://diditaxi.com.cn/activity/hongbao/c_recommend/wxSource');
            location.replace(seedUrl || wxSourceUri);
        } else {
            if (navigator.userAgent.indexOf('MicroMessenger') > -1) {
                showShadeLayer();
            }
        }

    };

    //base.touch(btnShare, shareHandler, false); // 生成分享链接页面
    base.touch(btnOlderShare, shareHandler, false); // 老用户进入抢红包页面的分享按钮
    base.touch(btnNewerShare, shareHandler, false); // 新用户抢红包页面的分享按钮

    // 初始化微信对象
    var initWeixin = function(callback) {
        var onBridgeReady = function() {
            if (!WeixinJSBridge) return;
            weixinObj = WeixinJSBridge;
            weixinObj.call("hideOptionMenu");
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

    // 初始化分享功能
    var initDiDiJSBridge = function(callback) {
        //didiJSBridge就绪后
        var onDidiJsReady = function(e) {
            if (typeof DidiJSBridge === 'undefined') return;

            if (typeof callback === 'function') {
                callback(DidiJSBridge);
            }

        };
        if (typeof DidiJSBridge === 'undefined') {
            document.addEventListener('DidiJSBridgeReady', onDidiJsReady, false);
        } else {
            onDidiJsReady();
        }
    };

    // didi native share
    var nativeShare = function(DidiJSBridge, data) {
        var btnShareTimeline = doc.getElementById('btn-share-timeline'),
            btnShareAppmsg = doc.getElementById('btn-share-appmsg');

        // 组装数据
        var genShareinfo = function(da) {
            if (!da) return;
			var _share_link=da.share_url;
			if(getQueryString("show")==1){
				_share_link=da.share_url.indexOf("?")!=-1?da.share_url+"&show=1":da.share_url+"?show=1"
			}
            return {
                share_url: _share_link,
                share_icon_url: da.share_img_url, // 分享小图icon
                share_img_url: da.share_img_url, // 分享大图
                share_title: da.share_title,
                share_content: da.share_desc
            };
        };
        base.touch(btnShareTimeline, function() {

            // alert('GO' + JSON.stringify(genShareinfo(data)));
            DidiJSBridge.callHandler('share_weixin_timeline', JSON.stringify(genShareinfo(data)), function(da) {});

        });

        base.touch(btnShareAppmsg, function() {
            // alert('GO' + JSON.stringify(genShareinfo(data)));
            DidiJSBridge.callHandler('share_weixin_appmsg', JSON.stringify(genShareinfo(data)), function(da) {});
        });
    };

    // 兼容背景
    // 这个方法写的很二，因为不靠谱的PM连夜该需求
    function compactBG(tmpDom) {
        var width = doc.body.clientWidth || doc.documentElement.clientWidth;
        var height = (1206 / 750) * width;

        tmpDom.style.width = width + 'px';
        tmpDom.style.height = height + 'px';
        tmpDom.style.backgroundSize = '100% ' + height + 'px';

        var h = height / 505; // 高度拉升的倍数
        var headers = base.getElesByKls(doc.body, 'header');
        var tipBubbles = base.getElesByKls(doc.body, 'tip-bubble');

        for (var j = headers.length - 1; j >= 0; j--) {
            headers[j].style.height = h * 5.2 + 'rem';
        };
        for (var k = tipBubbles.length - 1; k >= 0; k--) {
            tipBubbles[k].style.height = h * 10 + 'rem';
        };

        if (tmpDom.id === 'page-grap') base.getElesByKls(tmpDom, 'dv-result')[0].style.top = 1.02 * h + 'rem';
        //if (tmpDom.id === 'page-result-1') base.getElesByKls(tmpDom, 'dv-result')[0].style.top = 2.8 * h + 'rem';
        //if (tmpDom.id === 'page-result-2') base.getElesByKls(tmpDom, 'dv-result')[0].style.top = 8.7 * h + 'rem';
        if (tmpDom.id === 'page-gen-hb-1') base.getElesByKls(tmpDom, 'dv-wrap')[0].style.top = 31 * h + 'rem';
        if (tmpDom.id === 'page-gen-hb-2') base.getElesByKls(tmpDom, 'dv-wrap')[0].style.top = 23.2 * h + 'rem';

    }


    // 显示页面
    var showPage = function(page) {
        if (!pages.length) return;
        // 应该要有相应的校验

        var item, tmpDom;
        for (var i = pages.length - 1; i >= 0; i--) {
            item = pages[i];
            tmpDom = item && item.dom;
            if (tmpDom) {
                compactBG(tmpDom);
                tmpDom.style.display = (page === item.id || page === tmpDom) ? 'inline-block' : 'none';
            }
        }
        currentPage = page;
        sessionStorage.SEARCH_NEW_CURRENT_PAGE = page; // 存储到会话中
    };

    // 初始化
    (function init() {
        var pageno = hidPageNO.value,
            errno = hidErrnoNO.value,
            errmsg = hidErrmsg.value;
        var initFlag = false;

        // 兼容placeholder
        compatibilityPlaceHolder([txtTel, txtGenTel]);

        // 初始化页集合
        (function initPages(array) {
            var tmp;
            for (var i = array.length - 1; i >= 0; i--) {
                tmp = doc.getElementById(array[i]);
                if (!tmp) continue;
                pages.push({
                    id: array[i],
                    dom: tmp
                });
            }
        })(pageIds);

        (function compactWeixin() {
            var pShareButtons = doc.getElementById('p-share-button'),
                btnTimeline = doc.getElementById('btn-share-timeline'),
                btnAppmsg = doc.getElementById('btn-share-appmsg');
            var isWxApp = navigator.userAgent.indexOf('MicroMessenger') > -1;

            if (isWxApp) {
                //btnShare.style.display = 'inline-block';
                newerGiftText.innerHTML = "点击<span style='color:#fbdd57'>右上角</span>分享邀请红包";
                newerGiftText.style.marginTop = '5rem';
                pShareButtons.style.display = 'none';

            } else {
                //btnShare.style.display = 'none';
                pShareButtons.style.display = 'block';
            }
        })();

        (function initPhone() {
            if (hidPhone.value) {
                txtGenTel.value = hidPhone.value;
                if (txtGenTel.value.length === 11) btnGen.className = 'btn-orange';

            }

            if (hidDefaultP.value) {
                txtTel.value = hidDefaultP.value;
                if (txtTel.value.length === 11) btnOpen.className = 'btn-orange';
            }

        })()


        // 根据pageno 和 errno 设置当前要显示的页面
        // 这个函数只决策当前要显示的页面，根据提页面状态无关
        setLoadPage(pageno, errno);
        // alert('pageno ' + pageno);
        // alert('errno ' + errno);
        // alert(errmsg);

        // 老用户从公众号消息直接进入
        // 需要直接展示红包链接生成结果页面，并显示右上角分享按钮
        if (pageno === '1') {
            var shareInfo = base.txtToJson(doc.getElementById('hid-share-info').value);

            showSenderLogo(shareInfo.owner_header_img);
            showGenSuccTips(hidRebateP.value);

            initWeixin(function() {
                if (shareInfo && shareInfo.share_url) {
                    dd.share.shareAll(weixinObj, genShareInfo(shareInfo));
                }
            });

            initDiDiJSBridge(function(DidiJSBridge) {
                nativeShare(DidiJSBridge, shareInfo);
            });

            initFlag = true;
        }

        // 直接进入抢红包输入手机号页面
        if (pageno === '2') {
            var shareInfo = base.txtToJson(doc.getElementById('hid-share-info').value);
            showSenderLogo(shareInfo.owner_header_img);

            showBubbleTip({
                pageflag: 'page-grap',
                nickname: shareInfo.owner_nick_name,
                register_days: shareInfo.register_days,
                owner_order_num: shareInfo.owner_order_num
            });

            initWeixin(function() {
                if (shareInfo && shareInfo.share_url) {
                    dd.share.shareAll(weixinObj, genShareInfo(shareInfo));
                }
            });

            initDiDiJSBridge(function(DidiJSBridge) {
                nativeShare(DidiJSBridge, shareInfo);
            });

            initFlag=true;

        }

        // 已经抢过红包，直接进入到红包结果页面并初始化分享信息
        if (pageno === '3') {

            if (errno === '1008') {

                var obj = base.txtToJson(doc.getElementById('hid-info').value);

                fillAmountAndPhone(obj);
                showSenderLogo(obj.owner_header_img);

                if (obj.mine_share) {
                    var mine_info = obj.mine_share

                    showBubbleTip({
                        pageflag: 'page-result-1',
                        nickname: mine_info && mine_info.owner_nick_name,
                        errno: errno
                    });
                }

                initWeixin(function() {
                    dd.share.shareAll(weixinObj, genShareInfo(obj.mine_share));
                });

                initDiDiJSBridge(function(DidiJSBridge) {
                    nativeShare(DidiJSBridge, obj.mine_share);
                });
                initFlag = true;
            }
        }

        if (initFlag === false) initWeixin();

        // alert(currentPage);
        // showPage('page-grap');
        // showPage('page-result-1');
        // showPage('page-result-2');
        // showPage('page-gen-hb-1');
        // showPage('page-gen-hb-2');
        // showPage('page-exception');
        changeNewSkin(currentPage);
        showPage(currentPage);

    })();

}, false);
