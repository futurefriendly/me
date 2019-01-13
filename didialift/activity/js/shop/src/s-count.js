document.addEventListener("DOMContentLoaded", function(ev) {
    var doc = document,
        list = doc.getElementById("list"),
        record = doc.getElementById("record"),
        rule = doc.getElementById("rule"),
        footer = doc.getElementById("footer"),
        foo_more = doc.getElementById("foo_more"),
        foo_loading = doc.getElementById("foo_loading"),
        foo_noth = doc.getElementById("foo_noth"),
        foo_no = doc.getElementById("foo_no");

    var token = doc.getElementById("token").value,
        lat = doc.getElementById("lat").value,
        lng = doc.getElementById("lng").value,
        logid = 0; //页数 
    var dialog = new dd.dialog.Fn('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>');
    dialog.hide();

    window.addEventListener('popstate', function(ev) {
        dialog.hide(); //为了兼容IOS5
    }, false);

    shareFn();
    showList();
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
                    if (data.nextlogid == 0) {
                        footer.style.display = "none";
                        foo_no.style.display = "block";
                    } else {
                        footer.style.display = "block";
                        fooState("none", "inline-block", "none");
                    }
                } else {
                    footer.style.display = "none";
                    foo_no.style.display = "none";
                }
            },
            failFunc: function() {
                fooState("none", "none", "block");
            }
        });
    }

    touch(footer, function(ev) {
        fooState("inline-block", "none", "none");
        showList();
    }, false);

    touch(record, function(ev) {
        setTimeout(function() {
            dialog.show();
            //dd.dialog.logoLoading(); 
            location.href = "/imall/change_log/index?token=" + token + "&lng=" + lng + "&lat=" + lat;
        }, 300);
    }, false);

    touch(rule, function(ev) {
        dialog.show();
        //dd.dialog.logoLoading(); 
        location.href = "/imall/rule?token=" + token;
    }, false);

}, false);
