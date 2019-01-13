define('page/driver_register_edition/third/select.js', function(require, exports, module){

var base = dd.base;
var rm_wall = function() {
    var dvWalls = document.getElementsByClassName("select-wall");
    for (var i = 0, len = dvWalls.length; i < len; i++) {
        document.body.removeChild(dvWalls[i]);
    }
};
var add_wall = function() {
    var dvWall = document.createElement('div');
    dvWall.id = "d-wall";
    dvWall.className = "select-wall";
    dvWall.style.width = document.clientWidth + "px";
    dvWall.style.height = document.body.scrollHeight + "px";
    document.body.appendChild(dvWall);
};

// 滑动下拉框包括支持一级及以上
var slideSelect_carno = module.exports = function(input, selectDiv, valueArr) {
    var valueList = valueArr || [],
        nameList = [];
    var linkCancel = selectDiv.getElementsByClassName("cancel")[0],
        linkConfirm = selectDiv.getElementsByClassName("confirm")[0],
        optionsList = selectDiv.getElementsByClassName("options");

    var init = function() {
        for (var i = 0, len = valueArr.length; i < len; i++) {
            var onLi = optionsList[i].querySelector("[data-id='" + valueArr[i] + "']");
            nameList[i] = onLi.getAttribute("data-show");
        }
        input.setAttribute("data-id", valueList.join(""));
        input.value = nameList.join("");
        if (input.getAttribute("disabled") == "disabled") return; //禁用下拉框 
    }


    // 事件触发
    base.touch(input, function(ev) {
        var seList = document.getElementsByClassName("select");
        for (var i = 0, length = seList.length; i < length; i++) {
            seList[i].style.display = "none";
        }
        selectDiv.style.display = 'block';
        add_wall();
        var options = null,
            value = "",
            listLi = null;

        for (var j = 0, len = optionsList.length; j < len; j++) {
            options = optionsList[j];
            value = valueArr[j];
            listLi = options.getElementsByTagName("li");
            for (var k = 0, l = listLi.length; k < l; k++) {
                if (listLi[k].getAttribute("data-id") == value) {
                    options.scrollTop = k * 44;
                }
            }
        }
    }, false);

    // 取消按钮
    // base.touch(linkCancel, function(ev) {
    linkCancel.addEventListener('click', function(ev) {
        selectDiv.style.display = 'none';
        rm_wall();
    }, false);
    var Event = function(type){
        var ev = document.createEvent('Events');
        ev.initEvent(type, true, true);
        return ev;
    }
    // 确定按钮
    linkConfirm.addEventListener('click', function(ev) {
        var options = null,
            //index = 0,
            selectedLi = null;
        for (var i = 0, length = optionsList.length; i < length; i++) {
            options = optionsList[i];

            var liIndex = options.scrollTop / 44;
            var selectedLi = options.getElementsByTagName("li")[liIndex];

            valueList[i] = selectedLi.getAttribute("data-id");
            nameList[i] = selectedLi.getAttribute("data-show");

        };
        var oldValue = input.value;
        input.value = nameList.join("");
        input.setAttribute("data-id", valueList.join(""));
        if(oldValue != input.value){
            input.dispatchEvent && input.dispatchEvent( Event('change') );
        }
        selectDiv.style.display = 'none';
        rm_wall();
    }, false);

    ///----------------------------bind-----------
    for (var i = 0, length = optionsList.length; i < length; i++) {
        ul_bind(optionsList[i], i);
    };

    function ul_bind(options) {
        var starty = 0,
            dy = 0;

        options.addEventListener("touchstart", function(ev) {
            ev.preventDefault();
            if (!ev.touches.length) {
                return false;
            }
            var touch = ev.touches[0];

            starty = (touch.pageY - this.offsetTop);
            return;

        }, false);
        options.addEventListener("touchmove", function(ev) {
            ev.preventDefault();
            if (!ev.touches.length) {
                return false;
            }
            var touch = ev.touches[0];

            var touchy = (touch.pageY - this.offsetTop);
            dy = starty - touchy;
            starty = touchy;

            this.scrollTop += dy;
            return;

        }, false);
        options.addEventListener("touchend", function(ev) {
            ev.preventDefault();
            if (!ev.changedTouches.length) {
                return false;
            }

            starty = 0;
            dy = 0;

            var nowTop = this.scrollTop;
            var gap = nowTop % 44; //44

            if (gap < 22) {
                this.scrollTop -= gap;
            } else {
                this.scrollTop += 44 - gap;
            }

        }, false);
    }
};


});