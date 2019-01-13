document.addEventListener('DOMContentLoaded', function(ev) {
    var dialog = null;

    dialog = new dd.dialog.Fn('<div class="loading-logo"></div>');
    dialog.show();

    shareFn();

    var doc = document,
        goods = doc.getElementById("goods"),
        title = doc.getElementsByTagName("title")[0],
        noGoods = doc.getElementById("noGoods"),
        foo_loading = doc.getElementById("foo_loading"),
        iphone = doc.getElementById("iphone"),
        body = doc.getElementsByTagName("body")[0];

    var token = doc.getElementById("token").value,
        lat = doc.getElementById("lat").value,
        lng = doc.getElementById("lng").value,
        errno = doc.getElementById("errno").value,
        errmsg = doc.getElementById("errmsg").value,
        category_id = parseInt(doc.getElementById("category_id").value),
        category_name = doc.getElementById("category_name").value,
        page = 1,
        page_count = null,
        page_size = 16;//每页显示16条 

    title.innerHTML = category_name;

    if(errno == 0){
        /*if (localStorage.state === "true") {
            load_page("back_category_top",agoData);
        }else{
            ajaxDate();
        }*/
        ajaxDate();
    }else{
        noGoods.style.display = "block";
    }

    /*function agoData(){
        if(!localStorage.agoData){
            localStorage.removeItem("agoData");
            return;
        }
        var befJson = {},
            befData = JSON.parse(localStorage.agoData);
            befJson.goods_list = befData;

        var tempDom = doc.createElement('span');
            tempDom.innerHTML = template('goods_list', befJson);
            goods.innerHTML = "";
            goods.insertBefore(tempDom, null);

            load_img(tempDom);
            page = Math.ceil(tempDom.getElementsByTagName("img").length / page_size);

            doc.body.scrollTop = localStorage.scrollTop;
            doc.documentElement.scrollTop = localStorage.scrollTop;
    }*/

    /*跳转到详情页*/
    touch(body, function(ev) {
        var back_category_top = doc.body.scrollTop || doc.documentElement.scrollTop;
        localStorage.back_category_top = back_category_top;

        link(ev.target,function(){
            dialog.show();
        });
    }, false);

    window.onscroll=window.onresize=function()
    {
        showImg();
        if(page <= page_count){
            pulldown(ajaxDate,foo_loading);
        }   
    };

    function showImg(){
        var secEleLength = goods.getElementsByTagName("section").length,
            aEle = goods.getElementsByTagName("section")[secEleLength-1];
        load_img(aEle);
    }

    function ajaxDate(){
        ajax({
            method: "GET",
            url: "/imall/home/category_list?token=" + token + "&lat=" + lat + "&lng=" + lng + "&category="+ category_id + "&pg="+ page + "&page_size=" + page_size,
            succFunc: function(data) {
                dialog.hide();
                var data_json = txtToJson(data);
                if (data_json.errno == 0) {
                    var goodsArray = data_json.data.goods_list;
                    page_count = isLastPage(page,data_json,createData);
                    page++;
                    //saveData(goodsArray);
                } else{
                    noGoods.style.display = "block";
                }
            },
            failFunc: function() {
                foo_loading.style.display = "none";
            }
        });
    }

    function createData(data_json){
        var goods_data = {},
            tempDom = doc.createElement('section'),
            goodsArray = data_json.data.goods_list;

            /*if(goodsArray.length < 1){
                noGoods.style.display = "block";
                return;
            }*/

            goods_data.goods_list = goodsArray;
            tempDom.innerHTML = template('goods_list', goods_data);
            goods.insertBefore(tempDom, null);
 
            showImg();
    }

    //存储数据，返回页面时候用
    /*function saveData(goodsArray) {
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
    }*/
    
}, false);