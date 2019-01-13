document.addEventListener("DOMContentLoaded", function(ev) {
    var doc = document,
        list = doc.getElementById("list"),
        record = doc.getElementById("record"),
        shop = doc.getElementById("shop"),
        rule = doc.getElementById("rule"),
        foo_loading = doc.getElementById("foo_loading");

    var token = doc.getElementById("token").value,
        lat = doc.getElementById("lat").value,
        lng = doc.getElementById("lng").value,
        logid = 0,//页数 
        isScroll = true;//标示能否继续滚动请求数据 

    var dialog = new dd.dialog.Fn('<div class="loading-logo"></div>');
    dialog.hide();

    window.addEventListener('popstate', function(ev) {
        dialog.hide(); //为了兼容IOS5
    }, false);

    shareFn();
    showList();

    window.onscroll=window.onresize=function()
    {
        if(isScroll){//todo
            pulldownCount(showList,foo_loading);
        }   
    };

    //下拉加载
    function pulldownCount(fn,ele){
        if(!isScroll){
            isScroll = true;
            return;
        }
        var winHeight = document.documentElement.clientHeight,
            scrollTop = document.body.scrollTop||document.documentElement.scrollTop,
            scrollHeight = document.body.scrollHeight,
            showH = getStyle(ele,"height");

        if(scrollHeight <= (winHeight + scrollTop)){
            isScroll = false;
            ele.style.display = "block";
            window.scrollTo(0,scrollHeight + showH);
            fn();
        }
    }

    //请求数据 
    function showList() {
        ajax({
            method: "GET",
            url: "/imall/integral_flow/integralRecord?token=" + token + "&logid=" + logid,
            succFunc: function(data) {
                var data = txtToJson(data);
                if (data.errno == 0) {
                    var tempDom = doc.createElement('section');
                        tempDom.innerHTML = template('count_list', data);
                        list.insertBefore(tempDom, null);
                    logid = data.nextlogid;

                    if (data.nextlogid == 0) {//最后一页
                        isScroll = false;
                        foo_loading.style.display = "none";

                    } else {
                        isScroll = true;
                    }
                    
                } else {
                    foo_loading.style.display = "none";
                }
            },
            failFunc: function() {
                foo_loading.style.display = "none";
            }
        });
    }

    //防止穿透，乐视用settimeout延迟处理穿透，在端里面不起作用
    shop.addEventListener("click",function(ev){
        dialog.show();
        location.href = "/imall/index?token=" + token + "&lng=" + lng + "&lat=" + lat + "&datatype=" + getQuerySting().datatype + "&version=" + getQuerySting().version + "&source=" + getQuerySting().source;
    },false);

    record.addEventListener("click",function(ev){
        dialog.show();
        location.href = "/imall/change_log/index?token=" + token + "&lng=" + lng + "&lat=" + lat;
    },false);

    touch(rule, function(ev) {
        dialog.show();
        location.href = "/imall/rule?token=" + token;
    }, false);

}, false);
