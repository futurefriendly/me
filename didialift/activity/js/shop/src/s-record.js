document.addEventListener("DOMContentLoaded", function(ev) {
    var doc = document,
        record = doc.getElementById("record"),
        footer = doc.getElementById("footer"),
        noRecord = doc.getElementById("noRecord"),
        foo_more = doc.getElementById("foo_more"),
        foo_loading = doc.getElementById("foo_loading"),
        foo_noth = doc.getElementById("foo_noth"),
        foo_no = doc.getElementById("foo_no");

    var token = doc.getElementById("token").value,
        lat = doc.getElementById("lat").value,
        lng = doc.getElementById("lng").value,
        recordData = doc.getElementById("recordData").value,
        data_json = txtToJson(recordData),
        productId = doc.getElementById("product_id").value,
        page = 1;

    var dialog = new dd.dialog.Fn('<div class="loading-car"><div class="bg"></div><div class="loading-car-icon"></div></div>');
    dialog.hide();
    shareFn();

    window.addEventListener('popstate', function(ev) {
        dialog.hide(); //为了兼容IOS5
    }, false);

    getData(data_json);

    //让兑换&抽奖到的，和抽奖到的变色2秒;
    if (data_json.data.convertList.length > 0) {
        if (productId == data_json.data.convertList[0].product_id) {
            addClass(record.getElementsByClassName("list")[0], "new");
            addClass(record.getElementsByClassName("list")[0].getElementsByTagName("div")[0], "new_border");
        }
    }

    //防止用户复制券码的时候触发touchend
    record.addEventListener("click", function(ev) {
        var getLi = function(ele) {
            var re = new RegExp("\\blist\\b"); //className有两种情况:list 和 list new
            if (!re.test(ele.className)) {
                return arguments.callee(ele.parentNode);
            } else {
                return ele;
            }
        };

        var li = getLi(ev.target);

        if (li.getAttribute("href")) {
            dialog.show();
            location.href = li.getAttribute("href");
            return;
        }

    }, false);


    //获取数据
    function getData(data_json) {
        if (data_json.errno == 0) {
            creatData(data_json);
        } else {
            fooState("none", "none", "block");
        }
    }

    //创建数据
    function creatData(data_json) {
        var data = data_json.data;
        var page_count = data.page_count;
        var convertList = data.convertList;
        var arrData = [];
        var styleData = {};

        //初始化数据&样式
        for (var i = 0; i < convertList.length; i++) {
            var tempJson = {}; //临时用的json,为了组成每条数据
            var status = convertList[i].status;
            var actType = convertList[i].activity_type;
            var isEnd = convertList[i].isEnd;
            var goodsType = convertList[i].goods_type;
            if (status == 0 && actType == 1) { //抽奖失败
                var preData = {
                    "cTitle": "",
                    "cCount": "content_count",
                    "cCode": "orange",
                    "cValidity": "hide",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": "参与抽奖，未中奖 ~~",
                    "validity": convertList[i].validity,
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else if (status == 1 && actType == 0 && isEnd == 0) { //成功，兑换，有效期
                var codeTxt = "";
                if (goodsType == 1) { //券，不管有无券码，不需要显示券码，显示其他文案
                    codeTxt = "已发放，到“我的打车券”查看";
                } else {
                    codeTxt = "券码：" + convertList[i].comCode;
                }
                var preData = {
                    "cTitle": "",
                    "cCount": "content_count",
                    "cCode": "",
                    "cValidity": "orange",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": codeTxt,
                    "validity": convertList[i].validity + " 后过期",
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else if (status == 1 && actType == 0 && isEnd == 1) { //成功，兑换，过期
                var codeTxt = "";
                if (goodsType == 1) { //券，不管有无券码，不需要显示券码，显示其他文案
                    codeTxt = "已发放，到“我的打车券”查看";
                } else {
                    codeTxt = "券码：" + convertList[i].comCode;
                }
                var preData = {
                    "cTitle": "",
                    "cCount": "content_count",
                    "cCode": "",
                    "cValidity": "gray",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": codeTxt,
                    "validity": convertList[i].validity + " 后过期（已过期）",
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else if (status == 1 && actType == 1 && isEnd == 0) { //成功，抽奖，有效期
                var codeTxt = "";
                if (goodsType == 1) { //券，不管有无券码，不需要显示券码，显示其他文案
                    codeTxt = "已发放，到“我的打车券”查看";
                } else {
                    codeTxt = "券码：" + convertList[i].comCode;
                }
                var preData = {
                    "cTitle": "win",
                    "cCount": "content_count",
                    "cCode": "",
                    "cValidity": "orange",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": codeTxt,
                    "validity": convertList[i].validity + " 后过期",
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else if (status == 1 && actType == 1 && isEnd == 1) { //成功，抽奖，过期
                var codeTxt = "";
                if (goodsType == 1) { //券，不管有无券码，不需要显示券码，显示其他文案
                    codeTxt = "已发放，到“我的打车券”查看";
                } else {
                    codeTxt = "券码：" + convertList[i].comCode;
                }
                var preData = {
                    "cTitle": "win",
                    "cCount": "content_count",
                    "cCode": "",
                    "cValidity": "gray",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": codeTxt,
                    "validity": convertList[i].validity + " 后过期（已过期）",
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else {
                var preData = {
                    "cTitle": "hide",
                    "cCount": "hide",
                    "cCode": "hide",
                    "cValidity": "hide",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": convertList[i].comCode,
                    "validity": convertList[i].validity,
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            }
            arrData.push(tempJson);
        }

        function contentData(preData) {
            tempJson.cTitle = preData.cTitle;
            tempJson.cCount = preData.cCount;
            tempJson.cCode = preData.cCode;
            tempJson.cValidity = preData.cValidity;
            tempJson.title = preData.title;
            tempJson.comCount = preData.comCount;
            tempJson.comCode = preData.comCode;
            tempJson.validity = preData.validity;
            tempJson.link = preData.link;
            tempJson.imgUrl = preData.imgUrl;
        }
        styleData.recData = arrData;
        if (page_count == 0) {
            record.style.display = "none";
            footer.style.display = "none";
            noRecord.style.display = "block";
        } else if (page == page_count) {
            footer.style.display = "none";
            foo_no.style.display = "block";
        } else {
            fooState("none", "inline-block", "none");
        }

        var tempDom = doc.createElement('section');
        tempDom.innerHTML = template('list_item', styleData);
        record.insertBefore(tempDom, null);

        var aImg = record.children[record.children.length - 1].getElementsByTagName("img");
        load_img(aImg);

    }


    //底部
    footer.addEventListener('click', function() {
        page++;
        fooState("inline-block", "none", "none");
        ajax({
            method: "GET",
            url: "/imall/change_log/index?token=" + token + "&page=" + page + "&lng=" + lng + "&lat=" + lat,
            succFunc: function(data) {
                var data_json = txtToJson(data);
                getData(data_json);
            },
            failFunc: function() {
                fooState("none", "none", "block");
            }
        });
    }, false);

}, false);
