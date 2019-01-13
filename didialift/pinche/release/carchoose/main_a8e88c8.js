define('carchoose/main.js', function(require, exports, module){

/**
* 图片上传+裁剪功能类
* fis语法依赖 iscroll
* @require carchoose/_iscroll/iscroll-lite.js
*
**/

(function($){


var brandScroll,
    typeScroll,
    colorScroll,

    $wrapper,
    $brandLayer,
    $typeLayer, 
    $colorLayer,

    $lastBrandItem,
    $lastTypeItem,
    $lastColorItem,

    carTypesCache = {},
    colorsCache,

    currentValue,

    // iScroll scroll deceleration
    scrollDeceleration,

    // urls
    brandsURL,
    typesURL,
    colorsURL,

    // callbacks
    onselect;


scrollDeceleration = 0.002;


// Init current value
currentValue = {
    brand: {}
    , type: {}
    , color: {}
};


function closeLayers () {
    slideRightOutBrands();
    slideRightOutBrandTypes();
    slideRightOutColors();
}

function openLayers () {
    slideRightInBrands();
}

function showLoading(){
    window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 2000);
}

function hideLoading(){
    window.dd && window.dd.dialog 
        && window.dd.dialog.loading('正在加载', 100);
}


function resize(){
    $wrapper && $wrapper.height($(window).height()); 
}

$(window).on('resize', function(){
    resize(); 
});



function render () {
    $wrapper = $('<div class="choose-cartype-layer" />').prependTo('body')
        .css('visibility', 'hidden'); 

    resize();

    $wrapper.append('<section class="choose-brand-layer"><div></div></section>');
    $wrapper.append('<section class="choose-type-layer"><div></div></section>');
    $wrapper.append('<section class="choose-color-layer"><div></div></section>');

    $brandLayer = $('.choose-brand-layer')
        .append('<div class="choose-cartype-shortcut"></div>');
    $typeLayer = $('.choose-type-layer');
    $colorLayer = $('.choose-color-layer');
    $shortcut = $brandLayer.find('.choose-cartype-shortcut');
    
    loadCarBrands();
}

function loadCarBrands() {

    showLoading();

    $.ajax({
        url: brandsURL
        , dataType: 'json'
        , success: function (json) {

            hideLoading();

            if(json.errno != '0') return;

            renderCarBrands(json.data);
            $wrapper.css('visibility', 'visible');
            slideRightInBrands();
            renderShortCut(json.data);

            bindCarBrandEvents();
            bindCarTypeEvents();
            bindColorsEvents();
            bindShortCut();
        } 
        , error: function (json) {
            hideLoading();
        }
    });
}

function renderShortCut (data) {
    var arr = [];

    for(var key in data){
        arr.push([
            '<div><a href="javascript:void(0);" data-anchor="car-brand-'
            ,     key
            , '">'
            ,     key
            , '</a></div>'
        ].join(''));
    }

    $shortcut.html(arr.join(''));
}

function renderCarBrands (data) {
    var arr = [];

    for(var key in data){
        arr.push([
            '<h3 id="car-brand-' + key + '">'
            , '<div><span>' + key + '</span></div>'
            , '</h3>'
            , '<ul>'
        ].join('')); 

        var brands = data[key];
        for(var i=0; i<brands.length; i++) {
            arr.push([
                '<li data-brand-id="' + brands[i]['brand_id'] + '">'
                , brands[i].name
                , '</li>'
            ].join(''));
        } 
        arr.push('</ul>');
    } 

    $brandLayer.find('div').html(arr.join(''));
    if(!brandScroll) {
        brandScroll = new IScroll($brandLayer[0], { click: true, deceleration: scrollDeceleration });
    }
    else {
        brandScroll.refresh();
    }
}





function bindShortCut () {
    $shortcut.on('click', function (e) {
        var $link = $(e.target).closest('a'),
            anchor;

        if(!$link.length) return;

        $link.addClass('selected');
        setTimeout(function () {
            $link.removeClass('selected');
        }, 200);

        anchor = $link.data('anchor');

        brandScroll.scrollToElement('#' + anchor, 0);

    });
}


function bindCarBrandEvents () {
    $brandLayer.on('click', function(e){
        var $li = $(e.target).closest('li'),
            brandID,
            brandName;

        if(!$li.length || $li == $lastBrandItem) return;

        $lastBrandItem && $lastBrandItem.removeClass('selected');
        $lastBrandItem = $li;
        $li.addClass('selected');

        brandID = $li.data('brand-id'); 
        brandName = $li.text(); 

        currentValue.brand = {
            id: brandID
            , name: brandName
        };

        if(carTypesCache[brandID]) {
            renderCarTypes(carTypesCache[brandID]);
            slideRightInBrandTypes();
            slideRightOutColors();
        }
        else {
            slideRightOutBrandTypes();
            slideRightOutColors();
            showLoading();
            $.ajax({
                // @todo: add query &token=...
                url: typesURL
                    + '?carbrand=' + brandID
                , dataType: 'json'
                , success: function (json) {
                    hideLoading();
                    if(json.errno != 0) return;
                    carTypesCache[brandID] = json.data;
                    renderCarTypes(json.data);
                    slideRightInBrandTypes();
                } 
                , error: function (json) {
                    hideLoading();
                }
            });
        }
        
    });
}

function bindCarTypeEvents () {

    $typeLayer.on('click', function(e){
        var $li = $(e.target).closest('li'),
            brandTypeID, brandTypeName,
            regexBrand;

        if(!$li.length || $li == $lastTypeItem) return;

        $lastTypeItem && $lastTypeItem.removeClass('selected');
        $lastTypeItem = $li;
        $li.addClass('selected');

        brandTypeID = $li.data('brand-type-id'); 
        brandTypeName = $li.text(); 

        regexBrand = new RegExp(
            currentValue.brand.name.replace(
                /[\\\|*+?^$]/g
                , '\\$&'
            )
            , 'g'
        ); 

        currentValue.type = {
            id: brandTypeID
            // Remove brand name from type name
            , shortName: brandTypeName.replace(
                regexBrand, ''
            )
            , name: brandTypeName
        };

        if(colorsCache) {
            slideRightInColors(); 
        }
        else {
            slideRightOutColors(); 
            showLoading();
            $.ajax({
                // @todo: add query &token=...
                url: colorsURL
                , dataType: 'json'
                , success: function (json) {
                    hideLoading();
                    if(json.errno != 0) return;
                    colorsCache = json.data;
                    renderColors(json.data);
                    slideRightInColors(); 
                } 
                , error: function (json) {
                    hideLoading();
                }
            });
        }
        
    });
}

function bindColorsEvents () {
    $colorLayer.on('click', function(e){
        var $li = $(e.target).closest('li'),
            colorID, colorName,
            carInfo;

        if(!$li.length) return;

        colorID = $li.data('color-id'); 
        colorName = $li.text(); 

        currentValue.color = {
            id: colorID
            , name: colorName
        };

        carInfo = 
            StringUtil.subStrg(currentValue.brand.name, 6)
            + ' ' 
            + StringUtil.subStrg(currentValue.type.shortName, 4)
            + ' ' 
            + currentValue.color.name
            ;

        onselect && onselect({
            value: currentValue
            , carInfo: carInfo
        });

        closeLayers(); 

    });
}






function renderCarTypes (data) {
    var arr = ['<ul>'];

    var brandTypes = data;
    for(var i=0; i<brandTypes.length; i++) {
        arr.push([
            '<li data-brand-type-id="' + brandTypes[i]['brand_type_id'] + '">'
            , brandTypes[i]['brand_type_name']
            , '</li>'
        ].join(''));
    } 
    arr.push('</ul>');

    $typeLayer.find('div').html(arr.join(''));
    if(!typeScroll) {
        typeScroll = new IScroll($typeLayer[0], { click: true, deceleration: scrollDeceleration });
    }
    else {
        typeScroll.refresh();
    }
}


function renderColors (data) {
    var arr = ['<ul>'];

    var colors = data;
    for(var key in colors) {
        arr.push([
            '<li data-color-id="' + key + '">'
            , colors[key]['name']
            , '</li>'
        ].join(''));
    } 
    arr.push('</ul>');

    $colorLayer.find('div').html(arr.join(''));
    if(!colorScroll) {
        colorScroll = new IScroll($colorLayer[0], { click: true, deceleration: scrollDeceleration });
    }
    else {
        colorScroll.refresh();
    }
}

function slideRightInBrands(){

    translate(
        $wrapper[0]
        , $(window).width()
        , 0
    ); 

    translate(
        $wrapper[0]
        , 0
        , 150
    ); 

}

function slideRightOutBrands(){

    // Remove selected state
    $lastBrandItem && $lastBrandItem.removeClass('selected');
    $lastBrandItem = null;

    translate(
        $wrapper[0]
        , 0
        , 0
    ); 
    translate(
        $wrapper[0]
        , $(window).width()
        , 150
    ); 
}

function slideRightInBrandTypes(){
    translate(
        $typeLayer[0]
        , -0.66 * $(window).width()
        , 150
    ); 
}

function slideRightOutBrandTypes(){

    // Remove selected state
    $lastTypeItem && $lastTypeItem.removeClass('selected');
    $lastTypeItem = null;

    translate(
        $typeLayer[0]
        , -0.66 * $(window).width()
        , 0
    ); 
    translate(
        $typeLayer[0]
        , 0
        , 150
    ); 
}

function slideRightInColors(){
    translate(
        $colorLayer[0]
        , -0.33 * $(window).width()
        , 150
    ); 
}

function slideRightOutColors(){

    translate(
        $colorLayer[0]
        , -0.33 * $(window).width()
        , 0
    ); 
    translate(
        $colorLayer[0]
        , 0
        , 150
    ); 
}



// 特效移动，来自已有实现
function translate(elem, dist, speed, timefunc, delay) {

    var style = elem && elem.style;
    var t1 = "", t2 = "";

    if(!timefunc) timefunc = "linear";

    if(!delay) delay = 0;

    if (!style) return;

    if(Object.prototype.toString.call(dist) === '[object Array]'){
        switch(dist.length) {
            case 3:
                t1 = t2 = 'translate3d(' + dist[0] + 'px,'+ dist[1] + 'px,' + dist[2] + 'px)';
                break;
            case 2:
                t1 = t2 = 'translate(' + dist[0] + 'px,' + dist[1] + 'px)' + 'translateZ(0)';
                break;
            case 1:
                t1 = 'translate(' + dist[0] + 'px,0)' + 'translateZ(0)';
                t2 = 'translateX(' + dist[0] + 'px)';
                break;
            default:
                t1 = 'translate(' + dist[0] + 'px,0)' + 'translateZ(0)';
                t2 = 'translateX(' + dist[0] + 'px)';
        }
    }
    else if( !isNaN(parseInt(dist)) ){
        t1 = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        t2 = 'translateX(' + dist + 'px)';
    }
    else{
        return;
    }

    style.webkitTransitionDuration =
    style.MozTransitionDuration =
    style.msTransitionDuration =
    style.OTransitionDuration =
    style.transitionDuration = speed + 'ms';

    style.webkitTransitionTimingFunction =
    style.MozTransitionTimingFunction =
    style.msTransitionTimingFunction =
    style.OTransitionTimingFunction =
    style.transitionTimingFunction = timefunc;

    style.webkitTransitionDelay =
    style.MozTransitionDelay =
    style.msTransitionDelay =
    style.OTransitionDelay =
    style.transitionDelay = delay + 'ms';

    style.webkitTransform = t1;
    style.msTransform =
    style.MozTransform =
    style.OTransform = t2;
}

// 字节数截取，来自已有实现
function subString(str, len, hasDot) {
    if(str=="") return "";
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = '';
    var strLength = str.replace(chineseRegex, '**').length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += '...';
    }
    return newStr;
}

// 字符阶段，来自已有实现
var StringUtil = function() {
    var LenB = function(str) {
        return str.replace(/[^\x00-\xff]/g, "**").length;
    }
    var subStrg = function(str, size) {
        if (str == null) {
            return "";
        }
        if (LenB(str) > size) {
            var l = 0;
            var lStr = "";
            var c;
            for (var i = 0; i < str.length; i++) {
                c = str.charAt(i);
                l += LenB(c);
                if (l >= size) {
                    lStr = str.substring(0, i + 1);
                    break;
                }
            }
            lStr += "...";
            return lStr;
        } else {
            return str;
        }
    }
    return {
        LenB: LenB
        , subStrg: subStrg
    };
}();




function init(options){

    // Blur if anything focused
    document.activeElement
        && document.activeElement.blur();

    // Reentry
    if( $wrapper ) {

        // Delay to make slide-in-from-right smoothly
        setTimeout(function(){
            openLayers();
        }, 300);

        return;
    }

    options = options || {};

    brandsURL = options.brandsURL 
        || '/pinche/cartype/getcarbrand';
    typesURL = options.typesURL
        || '/pinche/cartype/getcartype';
    colorsURL = options.colorsURL
        || '/pinche/cartype/getcolor';

    onselect = options.onselect || function(){};
    render();
}

$.didiCarChoose = function(options){
    init(options);
};



})(Zepto);



});