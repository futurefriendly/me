/*添加class*/
function addClass(obj, sClass) {
    var re = new RegExp('\\b' + sClass + '\\b');
    if (!re.test(obj.className)) {
        obj.className += obj.className ? ' ' + sClass : sClass;
    }
}

/*删除class*/
function removeClass(obj, sClass)
{
    if(/^\s*$/.test(obj.className)) return;
    var arr=obj.className.split(/\s+/g);
    for(var i=0;i<arr.length;i++)
    {
        if(arr[i]==sClass)
        {
            arr.splice(i, 1);
            i--;
        }
    }
    obj.className=arr.join(' ');
}

/*获取样式*/
function getStyle(obj,name)
{
    return parseInt(obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name]);
}

//图片预加载   
function load_img(eles) {
    var winHeight = document.documentElement.clientHeight;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var aImg = eles.getElementsByTagName("img");
    for (var i = 0; i < aImg.length; i++) {
        if( (getPos(aImg[i]).top< winHeight+scrollTop) && (aImg[i].getAttribute("src") != aImg[i].getAttribute("_src")))
        { 
            (function(index) {
                var oImg = new Image();
                oImg.src = aImg[index].getAttribute('_src');
                oImg.onload = function() {
                    aImg[index].src = this.src;
                };
            })(i);
        }
    };
};

//获取到页面顶端的距离
function getPos(obj) {
    var l = 0;
    var t = 0;
    while (obj) {
        l += obj.offsetLeft;
        t += obj.offsetTop;
        obj = obj.offsetParent;
    };
    return {
        left: l,
        top: t
    }
}

/*跳转*/
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

//下拉加载
function pulldown(fn,ele){
    if(pulldown.isScroll != undefined && !pulldown.isScroll){
        pulldown.isScroll = true;
        return;
    }
        
    var winHeight = document.documentElement.clientHeight,
        scrollTop = document.body.scrollTop||document.documentElement.scrollTop,
        scrollHeight = document.body.scrollHeight,
        showH = getStyle(ele,"height");

    if(scrollHeight == (winHeight + scrollTop)){
        ele.style.display = "block";
        window.scrollTo(0,scrollHeight + showH + 50);
        fn();
        pulldown.isScroll = false;
    }
}

//是否是最后一页
function isLastPage(page,data_json,fn){
    page_count = data_json.data.page_count;
    if (page_count == 0) {
        noRecord.style.display = "block";
    } else if (page > page_count) {
        foo_loading.style.display = "none";
        sys();
    } else if (page == page_count){
        fn(data_json);
        foo_loading.style.display = "none";
        sys();
    } else{
        fn(data_json);
    }
    return page_count;
}

//android  or iphone
function sys(){
    diff_platform({
        android: function() {
            
        },
        ios: function() {
            iphone.style.display = "block";
        }
    });
}

//恢复页面高度
function load_page(back_top,cbFn){
    if (localStorage.state === "true") {
        cbFn && cbFn();
        document.body.scrollTop = localStorage[back_top];
        document.documentElement.scrollTop = localStorage[back_top];

        localStorage.removeItem("state");
    }else{
        localStorage.removeItem(back_top);
    }
}