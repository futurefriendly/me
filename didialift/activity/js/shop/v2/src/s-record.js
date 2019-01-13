document.addEventListener("DOMContentLoaded", function(ev) {
    var doc = document,
        record = doc.getElementById("record"),
        noRecord = doc.getElementById("noRecord"),
        foo_loading = doc.getElementById("foo_loading"),
        iphone = doc.getElementById("iphone");

    var token = doc.getElementById("token").value,
        lat = doc.getElementById("lat").value,
        lng = doc.getElementById("lng").value,
        recordData = doc.getElementById("recordData").value,
        data_json = txtToJson(recordData),
        productId = doc.getElementById("product_id").value,
        page = 1,
        page_count = null;

    var dialog = new dd.dialog.Fn('<div class="loading-logo"></div>');
    dialog.hide();
    shareFn();

    window.addEventListener('popstate', function(ev) {
        dialog.hide(); //为了兼容IOS5
    }, false);

    getData(data_json);
    
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

    window.onscroll=window.onresize=function()
    {
        if(page <= page_count){
            showImg();
            pulldown(ajaxData,foo_loading);

        }   
    };

    function showImg(){
        var secEleLength = record.getElementsByTagName("section").length,
            aEle = record.getElementsByTagName("section")[secEleLength-1];
        load_img(aEle);
    }

    function ajaxData(){
        page++;
        ajax({
            method: "GET",
            url: "/imall/change_log/index?token=" + token + "&page=" + page + "&lng=" + lng + "&lat=" + lat,
            succFunc: function(data) {
                var data_json = txtToJson(data);
                getData(data_json);
            },
            failFunc: function() {
                
            }
        });
    }

    //获取数据
    function getData(data_json) {
        if (data_json.errno == 0) {
            page_count = isLastPage(page,data_json,createData);
            
        } else {
            foo_loading.style.display = "none";
            sys();
        }
    }  
    
    //创建数据
    function createData(data_json) {

        var data = data_json.data,
            convertList = data.convertList,
            arrData = [],
            styleData = {};

       
        function showCode(goodsType,comCode){
            var codeTxt = "",
                codeNum = "",
                code = {};
            if (goodsType == 1) { //券，不管有无券码，不需要显示券码，显示其他文案
                code.codeTxt = "已发放，到“我的打车券”查看";
            } else {
                code.codeTxt = "券码：";
                code.codeNum = comCode;
            }
            return code;
        }

        //初始化数据&样式
        for (var i = 0; i < convertList.length; i++) {
            var tempJson = {}, //临时用的json,为了组成每条数据
                status = convertList[i].status,
                actType = convertList[i].activity_type,
                isEnd = convertList[i].isEnd,
                goodsType = convertList[i].goods_type,
                comCode = convertList[i].comCode;
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

                var preData = {
                    "cTitle": "",
                    "cCount": "content_count",
                    "cCode": "gray999",
                    "cNum": "orange",
                    "cValidity": "gray999",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": showCode(goodsType,comCode).codeTxt,
                    "comNum": showCode(goodsType,comCode).codeNum,
                    "validity": convertList[i].validity + " 后过期",
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else if (status == 1 && actType == 0 && isEnd == 1) { //成功，兑换，过期
                
                var preData = {
                    "cTitle": "lightgray",
                    "cCount": "content_count",
                    "cCode": "lightgray",
                    "cNum":"lightgray",
                    "cValidity": "lightgray",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": showCode(goodsType,comCode).codeTxt,
                    "comNum": showCode(goodsType,comCode).codeNum,
                    "validity": convertList[i].validity + " 后过期（已过期）",
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else if (status == 1 && actType == 1 && isEnd == 0) { //成功，抽奖，有效期
                
                var preData = {
                    "cTitle": "win",
                    "cCount": "content_count",
                    "cCode": "gray999",
                    "cNum": "orange",
                    "cValidity": "gray999",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": showCode(goodsType,comCode).codeTxt,
                    "comNum": showCode(goodsType,comCode).codeNum,
                    "validity": convertList[i].validity + " 后过期",
                    "link": convertList[i].link,
                    "imgUrl": convertList[i].imgUrl
                };
                contentData(preData);
            } else if (status == 1 && actType == 1 && isEnd == 1) { //成功，抽奖，过期
            
                var preData = {
                    "cTitle": "lightgray",
                    "cCount": "content_count",
                    "cCode": "lightgray",
                    "cNum":"lightgray",
                    "cValidity": "lightgray",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": showCode(goodsType,comCode).codeTxt,
                    "comNum": showCode(goodsType,comCode).codeNum,
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
                    "cNum": "orange",
                    "cValidity": "hide",
                    "title": convertList[i].title,
                    "comCount": convertList[i].comCount,
                    "comCode": convertList[i].comCode,
                    "comNum": "",
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
            tempJson.cNum = preData.cNum;
            tempJson.cValidity = preData.cValidity;
            tempJson.title = preData.title;
            tempJson.comCount = preData.comCount;
            tempJson.comCode = preData.comCode;
            tempJson.comNum = preData.comNum;
            tempJson.validity = preData.validity;
            tempJson.link = preData.link;
            tempJson.imgUrl = preData.imgUrl;
        }

        styleData.recData = arrData;
        if (page_count == 0) {
            noRecord.style.display = "block";
        }
        var tempDom = doc.createElement('section');
        tempDom.innerHTML = template('list_item', styleData);
        record.insertBefore(tempDom, null);

        if (data_json.data.convertList.length > 0) {
            if (productId == data_json.data.convertList[0].product_id) {
                addClass(record.getElementsByClassName("list")[0], "new");
            }
        }

        showImg();
    }

}, false);
