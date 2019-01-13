document.addEventListener('DOMContentLoaded', function(ev) {
    var dialog = null;

    dialog = new dd.dialog.Fn('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>');
    dialog.show();
    dialog.hide();
    shareFn();
   
    var doc = document,
        wheel = doc.getElementById("wheel"),
        count = doc.getElementById("count"),
        record = doc.getElementById("record"),
        goods = doc.getElementById("goods"),
        footer = doc.getElementById("footer"),
        foo_more = doc.getElementById("foo_more"),
        foo_loading = doc.getElementById("foo_loading"),
        foo_noth = doc.getElementById("foo_noth"),
        foo_no = doc.getElementById("foo_no"),
        myCount = doc.getElementById("myCount");

    var token = doc.getElementById("token").value,
        wheel_info = doc.getElementById("wheel_info").value,
        lat = doc.getElementById("lat").value,
        lng = doc.getElementById("lng").value,
        errno = doc.getElementById("errno").value,
        errmsg = doc.getElementById("errmsg").value,
        wheel_data = txtToJson(wheel_info),
        page_size = 16, //每页条数
        page = 1; //分页 

    window.addEventListener('popstate', function(ev) {
        dialog.hide(); //为了兼容IOS5
        countData();

    }, false);

    //我的积分实时更新
    function countData() {
        ajax({
            method: "GET",
            url: "/imall/get_integral/index?token=" + token + "&lat=" + lat + "&lng=" + lng,
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

    //获取滚动的高度 
    touch(goods, function(ev) {
        var scrollTop = doc.body.scrollTop || doc.documentElement.scrollTop;
        localStorage.scrollTop = scrollTop;
    }, false);

    //轮播
    if (errno == 0) {
        dialog.show();

        //轮播列表
        var html = template('wheel_list', wheel_data);
        wheel.innerHTML = html;

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

        if (wheel.getElementsByTagName("img").length > 0) {
            wheel.getElementsByTagName("img")[0].onload = function() {
                dialog.hide();
            };
        } else {
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

    } else if (errno == 3008) {
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

    //判断是否是返回进来的
    function load_page(){
        function pull_goods_from_server(){
            ajax_goods(page);
            localStorage.removeItem("agoData");
            localStorage.removeItem("scrollTop");
        }

        if (localStorage.state === "true") {
            dialog.hide();
            var befJson = {};

            if(!localStorage.agoData){
                pull_goods_from_server();
                return;
            }
            var befData = JSON.parse(localStorage.agoData);
            befJson.goods_list = befData;

            var tempDom = doc.createElement('span');
            tempDom.innerHTML = template('goods_list', befJson);
            goods.innerHTML = "";
            goods.insertBefore(tempDom, null);

            load_img(tempDom.getElementsByTagName("img"));
            page = Math.ceil(tempDom.getElementsByTagName("img").length / page_size);

            doc.body.scrollTop = localStorage.scrollTop;
            doc.documentElement.scrollTop = localStorage.scrollTop;

            //点击loading
            var aEle = goods.getElementsByTagName('a');
            loading(aEle);

            //var aEleWheel = wheel.getElementsByTagName("a");
            //loading(aEleWheel);

            switch (localStorage.fooState) {
                case "0":
                    footer.style.display = "none";
                    foo_no.style.display = "block";
                    break;
                case "1":
                    fooState("none", "inline-block", "none");
                    break;
                case "2":
                    footer.style.display = "none";
                    break;
                case "3":
                    fooState("none", "none", "block");
                    break;
                default:
                    fooState("none", "none", "block");
                    break;
            }
            localStorage.removeItem("state");
        } else {
            pull_goods_from_server();
        }
    }

    load_page();

    function link(clickEle,fn){
        var getLi = function(ele) {
            if (!ele.getAttribute("href")) {
                return arguments.callee(ele.parentNode);
            } else {
                return ele;
            }
        };

        var li = getLi(clickEle);
        if (li.getAttribute("href")) {
            fn();
            location.href = li.getAttribute("href");
            return;
        }
    }

    //跳转到我的积分页面
    touch(count, function(ev) {
        dialog.show();
        location.href = "/imall/integral_flow?token=" + token + "&lat=" + lat + "&lng=" + lng;
    }, false);

    touch(record, function(ev) {
        dialog.show();
        setTimeout(function() {
            location.href = "/imall/change_log/index?token=" + token + "&lng=" + lng + "&lat=" + lat;
        }, 300);
    }, false);

    //列表请求
    function ajax_goods(page) {
        ajax({
            method: "GET",
            url: "/imall/home/goods_list?pg=" + page + "&page_size=" + page_size + "&token=" + token + "&lat=" + lat + "&lng=" + lng + "&datatype=" + getQuerySting().datatype + "&version=" + getQuerySting().version,
            succFunc: function(data) {
                var da = txtToJson(data);
                //console.log(da);
                if (da.errno == 0) {
                    var goods_data = {};
                    var tempDom = doc.createElement('span');
                    var goodsArray = da.data.goods_list;
                    var notNeedId = [319, 389, 390, 354, 352, 377, 345, 346, 361, 387, 388, 367, 380, 383, 379, 384, 394];
                    chooseNeedId(notNeedId, goodsArray);
                    goods_data.goods_list = goodsArray;
                    tempDom.innerHTML = template('goods_list', goods_data);
                    goods.insertBefore(tempDom, null);
                    //存储数据，返回页面时候用
                    saveData(goodsArray);

                    var aImg = goods.children[goods.children.length - 1].getElementsByTagName('img');
                    load_img(aImg);

                    var aEle = goods.children[goods.children.length - 1].getElementsByTagName('a');
                    loading(aEle);

                    if (da.data.page_count === page) {
                        footer.style.display = "none";
                        foo_no.style.display = "block";
                        localStorage.fooState = "0";
                    } else {
                        fooState("none", "inline-block", "none");
                        localStorage.fooState = "1";
                    }
                } else {
                    footer.style.display = "none";
                    localStorage.fooState = "2";
                }
            },
            failFunc: function() {
                fooState("none", "none", "block");
                localStorage.fooState = "3";
            }
        });
    };
    //过滤商品id
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
    //存储数据，返回页面时候用
    function saveData(goodsArray) {
        var saveArray = null;
        if (localStorage.agoData) {
            saveArray = JSON.parse(localStorage.agoData);
        } else {
            saveArray = [];
        }
        for (var i = 0; i < goodsArray.length; i++) {
            saveArray.push(goodsArray[i]);
        }
        localStorage.agoData = JSON.stringify(saveArray);
    }

    //点击loading
    function loading(eles) {
        for (var i = 0; i < eles.length; i++) {
            eles[i].addEventListener('click', function(ev) {
                dialog.show();
            });
        }
    };

    //点击加载,用click防止
    footer.addEventListener('click', function() {
        fooState("inline-block", "none", "none");
        page++;
        ajax_goods(page);
    }, false);

}, false);
