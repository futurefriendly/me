document.addEventListener('DOMContentLoaded', function(ev) {
    var dialog = null;

    dialog = new dd.dialog.Fn('<div class="loading-logo"></div>');
    dialog.show();
    dialog.hide();
    shareFn();

    var doc = document,
        wheel = doc.getElementById("wheel"),
        classify = doc.getElementById("classify"),
        classify_child = classify.getElementsByTagName("div"),
        gold = doc.getElementById("gold"),
        gold_left = doc.getElementById("gold_left"),
        gold_right = doc.getElementById("gold_right"),
        modules = doc.getElementById("modules"),
        goods = doc.getElementById("goods"),
        count = doc.getElementById("count"),
        record = doc.getElementById("record"),
        myCount = doc.getElementById("myCount"),
        iphone  = doc.getElementById("iphone"),
        body = doc.getElementsByTagName("body")[0],
        clientW = document.documentElement.clientWidth,
        law = doc.getElementById("law");

    var token = doc.getElementById("token").value,
        wheel_info = doc.getElementById("wheel_info").value,
        classify_info = doc.getElementById("classify_info").value,
        lat = doc.getElementById("lat").value,
        lng = doc.getElementById("lng").value,
        errno = doc.getElementById("errno").value,
        errmsg = doc.getElementById("errmsg").value,
        source = doc.getElementById("source").value,
        wheel_data = txtToJson(wheel_info),
        classify_json = txtToJson(classify_info);

    calcHeight(wheel,375,117,1);//轮播图片
    calcHeight(gold,140,174,0.44);//黄金区一的图片
    wheelInit();
    goldInit();
    classifyInit();
    modulesInit();
    sys();//添加苹果说明
    load_page("back_index_top");//恢复页面位置

    /*分享相关*/
    var shareData = {
        share_url: "http://pay.xiaojukeji.com/api/v2/weixinapi?page=middlepage",
        share_icon_url: "http://static.diditaxi.com.cn/activity/img-mall/share.jpg", // 分享的出去后所显示的图标的链接   ，如下图所示的2
        share_img_url: "http://static.diditaxi.com.cn/activity/img-mall/share.jpg", //分享的大图  （不必理会）    
        share_title: "有积分享福利，任性兑换不花钱", // 分享出去时所显示的标题             如下图所示的1
        share_content: '滴滴积分商城天天上新品：水果零食、休闲购物、生活娱乐、鲜花礼品，好礼兑不停', // 分享出去时所显示的描述           如下图所示的3   （分享到朋友圈时描述是不会显示的）
        share_from: '滴滴打车' // 分享来源，非必填,默认为滴滴打车
    };

    if (window.didi) {
        didi.initShare(shareData, function() {});
    }

    window.addEventListener('popstate', function(ev) {
        dialog.hide(); //为了兼容IOS5
        countData();
    }, false);

    window.onscroll=window.onresize=function()
    {
        load_img(modules);
    };

    /*法律申明*/
    diff_platform({
        android: function() {
            addClass(law,"law-pad");
        },
        ios: function() {

        }
    });

    //跳转到我的积分页面,防止穿透
    count.addEventListener("click",function(ev){
        dialog.show();
        location.href = "/imall/integral_flow?token=" + token + "&lat=" + lat + "&lng=" + lng + "&datatype=" + getQuerySting().datatype + "&version=" + getQuerySting().version;
    },false);

    //跳转到兑换记录页,防止穿透
    record.addEventListener("click",function(ev){
        dialog.show();
        location.href = "/imall/change_log/index?token=" + token + "&lng=" + lng + "&lat=" + lat;
    },false);

    /*跳转到详情页*/
    /*touch(wheel, function(ev) {
        link(ev.target,function(){
            dialog.show();
        });
    }, false);*/

    touch(goods, function(ev) {
        var back_index_top = doc.body.scrollTop || doc.documentElement.scrollTop;
        localStorage.back_index_top = back_index_top;

        link(ev.target,function(){
            dialog.show();
        });
    }, false);

    touch(law, function(ev) {
        dialog.show();
        location.href = "/imall/help/law";
    }, false);

    //我的积分实时更新
    function countData() {
        ajax({
            method: "GET",
            url: "/imall/get_integral/index?token=" + token + "&lat=" + lat + "&lng=" + lng + "&datatype=" + getQuerySting().datatype + "&version=" + getQuerySting().version,
            succFunc: function(data) {
                var da = txtToJson(data);
                if (da.errno == 0) {
                    myCount.innerHTML = da.score.score_available;
                } else {

                }
            },
            failFunc: function() {

            }
        });
    };

    //占位，防止轮播，黄金区大幅度抖动,scale占屏幕的比例
    function calcHeight(ele,w,h,scale){
        ele.style.height = parseInt(clientW*h*scale/w)+"px";
    }

    //轮播列表
    function wheelInit(){
        if (errno == 0) {
            dialog.show();
            
            //轮播列表
            var html = template('wheel_list', wheel_data);
            wheel.innerHTML = html;

            //为华为手机用，轮播多点两下才跳转,需优化，
            var startX, startY ,moveEndX,moveEndY;
            wheel.addEventListener("touchstart",function(ev){
                ev.preventDefault();
                startX = ev.changedTouches[0].pageX;
                startY = ev.changedTouches[0].pageY;
            },false);

            wheel.addEventListener('touchmove', function(ev) {
                ev.preventDefault();
                moveEndX = ev.changedTouches[0].pageX;
                moveEndY = ev.changedTouches[0].pageY;
                X = moveEndX - startX;
                Y = moveEndY - startY;

                if(Math.abs(X)>=20||Math.abs(Y)>=20){
                    ev.target.setAttribute("moved","true");
                }
             },false);

            wheel.addEventListener('touchend', function(ev) {
                ev.preventDefault();
                if(ev.target.getAttribute("moved") == "true"){
                    ev.target.setAttribute("moved","false");
                    return;
                }
                
                link(ev.target,function(){
                    dialog.show();
                });
                ev.target.setAttribute("moved","false");
            }, false);
            //end 

            if (wheel.getElementsByTagName("img").length > 0) {
                wheel.getElementsByTagName("img")[0].onload = function() {
                    dialog.hide();
                };
            } else {
                wheel.style.display = "none";
                dialog.hide();
            }

            //创建指示器:todo放到插件里
            var indicator = doc.getElementById("indicator");
            var wItem = wheel_data.wheel_item;
            if (wItem && wItem.length > 0) {
                var indLength = wItem.length;
                for (var i = 0; i < indLength; i++) {
                    var indNew = doc.createElement("span");
                    indicator.appendChild(indNew);
                }
                indicator.children[0].className = "on";
            }

            //轮播动画
            asyncLoadJS("/static/activity/js/shop/s-wheel.js", function() {
                if (typeof wheel === "function") {
                    wheel();
                }
            })
        }else if (errno == 3008) {
        //没有轮播图，不提示信息
        } else {
            dd.dialog.alert({
                icon: {
                    url: "/static/activity/img-mall/error.png",
                    width: "7px",
                    height: "42px"
                },
                tip: errmsg,
                title: "",
                btn: {
                    val: "我知道啦",
                    handler: function(ev) {

                    }
                }
            });
        };
    }
    
    //黄金区：等级兑换：如果同时出现金卡和黑金卡，则显示黑金卡，其他模块区两个都显示，template判断的
    function goldInit(){
        ajax({
            method: "GET",
            url: "/imall/gold_area?token=" + token + "&lat=" + lat + "&lng=" + lng + "&datatype=" + getQuerySting().datatype + "&version=" + getQuerySting().version + "&source=" + source,
            succFunc: function(data) {
                var da = txtToJson(data);
                if (da.errno == 0) {
                    var gold_json = da.data;
                    if(gold_json.length && gold_json.length>0){
                        var gold_data_fir = gold_json[0],
                            gold_data_sec = gold_json[1],
                            gold_data_thi = gold_json[2];

                        var html_fir = template('gold_list_fir', gold_data_fir);
                        gold_left.innerHTML = html_fir;

                        if(gold_data_sec){//黄金区二三位置可能没有数据
                            var html_sec = template('gold_list_sec', gold_data_sec);
                            gold_right.innerHTML += html_sec;
                        }
                        
                        if(gold_data_thi){
                            var html_thi = template('gold_list_sec', gold_data_thi);
                            gold_right.innerHTML += html_thi;
                        }
                       
                        load_img(gold);
                    }else{
                        gold.style.display="none";
                    }
                } else {
                    gold.style.display="none";
                }
            },
            failFunc: function() {
                gold.style.display="none";
            }
        });   
    }
    
    //分类列表
    function classifyInit(){
        var classify_data = {};
        if(classify_json.length && classify_json.length>0){
            classify_data.classify_item = classify_json;
            var html = template('classify_list', classify_data);
            classify.innerHTML = html;

            //类目每个图片都加载完一起显示
            var aImg = classify.getElementsByTagName("img");
            for (var i = 0; i < aImg.length; i++) {
                (function(index) {
                    aImg[index].onload = function() {
                        aImg[index].style.display = "block";                    
                    };
                })(i);
            };
           
        }else{
            classify.style.display="none";
        }
    }

    //专题区
    function modulesInit(){
        ajax({
            method: "GET",
            url: "/imall/topic_area?token=" + token + "&lat=" + lat + "&lng=" + lng + "&datatype=" + getQuerySting().datatype + "&version=" + getQuerySting().version + "&source=" + source,
            succFunc: function(data) {
                var da = txtToJson(data);
                if (da.errno == 0) {
                    var modules_json = da.data;
                   if(modules_json.length && modules_json.length>0){
                        for(var i=0; i<modules_json.length; i++){
                            if(modules_json[i].items.length == 0){//某个专题为空时，不显示专题
                                continue;
                            }else{
                                var modules_data = modules_json[i];
                                var html = template('modules_list', modules_data);
                                modules.innerHTML += html;
                            }
                        }
                        load_img(modules);
                    }
                    else{
                        modules.style.display = "none";
                    }
                } else {
                    modules.style.display = "none";
                }
            },
            failFunc: function() {
                modules.style.display = "none";
            }
        });   
    }

    //过滤商品id-圣诞节是用过
    function chooseNeedId(arrNot, arrAll) {
        if (!arrNot) {
            return false;
        }
        for (var i = 0; i < arrAll.length; i++) {
            for (var j = 0; j < arrNot.length; j++) {
                if (arrAll[i].id == arrNot[j]) {
                    arrAll.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
        return arrAll;
    };

    
}, false);