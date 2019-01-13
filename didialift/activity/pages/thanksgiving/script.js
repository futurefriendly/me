(function(window) {
    var connectDidiJSBridge = function(callback) {
            if (window.DidiJSBridge) {
                callback(DidiJSBridge)
            } else {
                document.addEventListener("DidiJSBridgeReady", function() {
                        callback(DidiJSBridge)
                    }
                    , false)
            }
        }
        ;
    var didi = {
        initShare: function(shareData, callback) {

            if (typeof callback !== "function") {
                callback = function() {}
            }
            var entranceCfg = {
                entrance: {
                    icon: "http://static.xiaojukeji.com/api/img/i-webview-entrance.png"
                },
                buttons: [{
                    type: "share_weixin_timeline",
                    name: "微信朋友圈",
                    data: shareData,
                    callback: callback
                }, {
                    type: "share_weixin_appmsg",
                    name: "微信好友",
                    data: shareData,
                    callback: callback
                }, {
                    type: "share_sina_weibo",
                    name: "新浪微博",
                    data: shareData,
                    callback: callback
                }, {
                    type: "page_refresh",
                    name: "刷新"
                }]
            };
            connectDidiJSBridge(function(bridge) {
                    if (typeof bridge === "undefined") {
                        return
                    }
                    bridge.callHandler("init_entrance", JSON.stringify(entranceCfg));
                    bridge.callHandler("show_entrance")
                }
            )
        }
    };
    window.didi = didi;


    var weixin = {
        initShare: function(shareData) {

            document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

                function share(shareData){
                    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                        WeixinJSBridge.invoke('sendAppMessage', {
                            "appid": "wx69b6673576ec5a65",
                            "img_url": shareData.share_icon_url,
                            "img_width": "",
                            "img_height": "",
                            "link": shareData.share_url,
                            "title": shareData.share_title,
                            "desc": shareData.share_content
                        }, function(res) {

                        });
                    });
                    // 分享到朋友圈
                    WeixinJSBridge.on('menu:share:timeline', function(argv) {

                        WeixinJSBridge.invoke('shareTimeline', {
                            "img_url": shareData.share_icon_url,
                            "img_width": "",
                            "img_height": "",
                            "link": shareData.share_url,
                            "title": shareData.share_title,
                            "desc": shareData.share_content
                        }, function(res) {

                        });
                    });
                }
                share(shareData);
                weixin.initShare=share;

            });
        }

    };

    window.weixin = weixin;

})(window);

window.addEventListener('DOMContentLoaded', function() {

    var pageIndex = 0;
    var pageCount = 3;

    var sending = false;
    var labelNum;
    var label;
    var share_data = {
        share_url: 'http://static.diditaxi.com.cn/activity/pages/thanksgiving/index.html?v=' + Math.random(),
        share_icon_url: 'http://static.diditaxi.com.cn/activity/pages/thanksgiving/img/icon.jpg',
        share_img_url: 'http://static.diditaxi.com.cn/activity/pages/thanksgiving/img/icon.jpg',
        share_title: '原来京城“滴哥”这么有范儿！',
        share_content: '',
        share_from: "滴滴出行"
    };
    var initShare = function () {
        if(label){
            var icon="http://static.diditaxi.com.cn/activity/pages/thanksgiving/img/people/"+label+".jpg";
            share_data.share_icon_url=icon;
            share_data.share_img_url=icon;
            share_data.share_title=map[label];
        }

        didi.initShare(share_data);
        weixin.initShare(share_data);
    };


    var host = "http://pay.xiaojukeji.com";
    var selectLabelUrl = host + "/new_hb/thx/thxGiv/mark";
    var getLabelNumUrl = host + "/new_hb/thx/thxGiv/loadRank";

    var map={
            kanye: "没看过百科全书？看京城侃爷“滴哥”霸气讲解！",
            doubi: "感觉生活无趣？逗逼“滴哥”告诉你如何主宰快乐！",
            huoditu: "高峰期不想堵车？活地图“滴哥”给你支招！",
            quanchengtong: "凌晨三点下飞机，只有“滴哥”在等待！",
            guojihua: "看国际范“滴哥”如何用多国语言接待乘客！",
            kalaok: "华语流行歌曲小天王？非此“滴哥”莫属！",
            aojiao: "傲娇“滴哥”原来是这样的，你知道吗？",
            shijinbumei: "不慎将物品丢在出租车上？看雷锋“滴哥”如何解决！",
            pinglunyuan:"看最牛“滴哥”讲时事，保你大开眼界！"
        },
        params={},
        hasSelected=function(){
            for(var key in params){
                if(params[key]) return key;
            }
            return false;
        },
        showResult=function(id){
            ["text9","text10","text11"].forEach(function(item){
                id==item ? show(getById(item)) : hide(getById(item));
            });
        };
    var textIndex=1;
    var tips=["他们是保障交通正常运转的<br/>“动力齿轮”", "他们是通晓道路秘密捷径的<br/>“活地图”","他们是代表城市美好形象的<br/>“移动名片”","他们是北京出租车司机"];
    var timer=setInterval(function(){
        getById("loading-tip").innerHTML=tips[textIndex%4];
        textIndex++;
    },2000);

    loadImg(["bg0.jpg","text1.png","fan.png","car.png","text8.png"],function(){
        setTimeout(function(){
            hide(getById("loading"));
            getById("page0").className = "cur";
            clearInterval(timer);
        },200);
        onSwipe(getById("touch-wrap"), function (dir) {

            if (dir == "up" && pageIndex == pageCount) {

                hide(getById("touch-wrap"));
                show(getById("select-label"));

            } else if (dir == "up" && pageIndex < pageCount) {

                getById("page" + pageIndex).className = "top";
                pageIndex++;
                getById("page" + pageIndex).className = "cur";

            } else if (dir == "down" && pageIndex > 0) {

                getById("page" + pageIndex).className = "";
                pageIndex--;
                getById("page" + pageIndex).className = "cur";

            }
        });
    },function(process){
        getById("process").style.width = process*100+"%";
    });


    ajax(getLabelNumUrl, "post", false, function (res) {
        if (res.errno == 0) {
            labelNum = res.data;
            ["rank","kanye","doubi","huoditu","quanchengtong"].forEach(function(item){
                getById(item).innerHTML = labelNum[item];
            });
            getById("num").innerHTML = labelNum.rank;
            share_data.share_content="已经有"+labelNum.rank+"位乘客为北京“滴哥”点赞，你心目中的“滴哥”是什么范儿？";
            initShare();
        }
    });

    for(var key in map){
        bind(getById("label-"+key),"click",(function(type){
            return function(){
                if(params[type]){
                    params[type]=0;
                    getById("label-"+type).className="";
                    if(!hasSelected()){
                        getById("submit-label").className="";
                    }
                }else{
                    params[type]=1;
                    getById("label-"+type).className="selected";
                    getById("submit-label").className="active";
                }
            }
        }(key)));
        params[key]=0;
    }

    bind(getById("submit-label"), "click", function () {
        if(!hasSelected()){
            alertMsg("请先选择标签");
            return;
        }
        ajax(selectLabelUrl, "post", {
            label:JSON.stringify(params)
        }, function (res) {
            label=hasSelected();
            hide(getById("select-label"));
            show(getById("lucky-draw"));
            initShare();
        }, function () {
            sending = false;
            alertMsg("网络错误！请稍后重试");
        });
    });


    bind(getById("close"), "click", function () {
        hide(getById("alert"));
    });

    bind(getById("share"),"click",function(e){
        show(getById("share-tip"));
    });

    bind(getById("share-tip"), "click", function (e) {
        hide(getById("share-tip"));
    });

    bind(getById("switch"),"click",function(){
        var switcher=getById("switch");
        var audio=getById("audio");
        if(switcher.className === "off"){
            switcher.className="";
            audio.play();
        }else{
            switcher.className="off";
            audio.pause();
        }
    });


    function alertMsg(msg) {
        getById("alert-content").innerHTML = msg;
        show(getById("alert"));
    }

    function getById(id) {
        return document.getElementById(id);
    }

    function bind(el, type, cb) {
        el.addEventListener(type, cb, false);
    }

    function show(el) {
        el.style.display = "block";
    }

    function hide(el) {
        el.style.display = "none";
    }

    function loadImg(src,cb,process){
        var len=src.length;
        var load=0;
        src.forEach(function(item){
            var img=new Image();
            img.src="img/"+item;
            img.onload=function(){
                load++;
                process&&process(load/len);
                if(load===len){
                    cb&&cb();
                }
            }
        })
    }

    function ajax(url, method, params, cb, err) {
        var xhr = new XMLHttpRequest();
        var body;
        var bodies = [];

        if (params) {
            for (var name in params) {
                bodies.push(name + '=' + params[name]);
            }
            body = bodies.join('&');
            if (method == "get") {
                url += "?" + body;
            }
        }

        xhr.open(method, url, true);

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var data = xhr.responseText;
                    try {
                        data = JSON.parse(data);
                    } catch (exc) {
                    }
                    cb && cb(data);
                } else {
                    err && err(xhr.status);
                }
            }
        };
        xhr.send(body);
        return xhr;
    }


    function onSwipe(el, cb) {
        var touch = {}, firstTouch, swipeTimeout;

        function swipeDirection(x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'left' : 'right') : (y1 - y2 > 0 ? 'up' : 'down')
        }

        bind(el, "touchstart", function (e) {
            e.preventDefault();
            firstTouch = e.touches[0];
            if (e.touches && e.touches.length === 1 && touch.x2) {
                touch.x2 = undefined;
                touch.y2 = undefined;
            }
            touch.x1 = firstTouch.pageX;
            touch.y1 = firstTouch.pageY;
        });

        bind(el, 'touchmove', function (e) {
            firstTouch = e.touches[0];
            touch.x2 = firstTouch.pageX;
            touch.y2 = firstTouch.pageY;
        });

        bind(el,'touchend', function (e) {
            if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
                swipeTimeout = setTimeout(function () {
                    cb(swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
                    touch = {}
                }, 0)
            }

        });

        bind(el, 'touchcancel', function () {
            clearTimeout(swipeTimeout);
        });

    }

});
