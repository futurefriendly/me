//底部状态
function fooState(loading, more, noth) {
    foo_loading.style.display = loading;
    foo_more.style.display = more;
    foo_noth.style.display = noth;
}

/*添加class*/
function addClass(obj, sClass) {
    var re = new RegExp('\\b' + sClass + '\\b');
    if (!re.test(obj.className)) {
        obj.className += obj.className ? ' ' + sClass : sClass;
    }
}

//图片预加载   
function load_img(eles) {
    var winHeight = document.documentElement.clientHeight;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    // var aImg = document.getElementsByTagName("img");
    for (var i = 0; i < eles.length; i++) {
        /*if( getPos(eles[i]).top< winHeight+scrollTop )
        { */
        (function(index) {
            var oImg = new Image();
            oImg.src = eles[index].getAttribute('_src');
            oImg.onload = function() {
                eles[index].src = this.src;
            };
        })(i);
        //}
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
