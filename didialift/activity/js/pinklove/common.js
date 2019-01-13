/*
 *@@description:粉爱红包通用方法库
 *@@author:songchao@diditaxi.com.cn
 *@@createTime:2014/10/10 11:10
 *@@copyright:songchao@diditaxi.com.cn
 *@@currentVersion:v1.0.0
 *@@modifiedRecord:
 *@@    1:2014/10/10 11:10 v1.0.0
 *@@    2:2014/10/10 17:11 v1.0.1
 *@@    3:2014/10/14 11:20 v2.0.0
 */
function Common() {
    return {
        /*
         *@@description:取得页面元素
         *@@parent parentDom|default=document
         *@@selector 选择器,与jquery一致  String
         *@@isArray 选择结果是否为集合
         */
        getDom: function(parent, selector, isArray) {
            parent = parent || document;
            isArray = isArray || false;
            if (!isArray) return parent.querySelector(selector);
            else return parent.querySelectorAll(selector);
        },
        /*
         *@@description:取得当前URl参数
         *@@key 需要获取参数名 String
         */
        getUrlParams: function(key) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2];
            return "";
        },
        setClass: function(dom, className) {
            dom.className = className;
        },
        addClass: function(dom, className) {
            if (dom.className.indexOf(className) == -1) dom.className += " " + className;
        },
        removeClass: function(dom, className) {
            if (hasClass(dom, className)) {
                var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
                dom.className = dom.className.replace(reg, ' ');
            }
        },
        hasClass: function(dom) {
            return dom.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
        },
        html: function(dom, value) {
            if (value) dom.innerHTML = value;
            else return dom.innerHTML;
        },
        text: function(dom, value) {
            if (value) dom.innerText = value;
            else return dom.innerText;
        },
        val: function(dom, value) {
            if (value) dom.value = value;
            else return dom.value;
        },
        remove: function(dom) {
            dom.remove();
        },
        show: function(dom) {
            dom.style.display = "block";
        },
        hide: function(dom) {
            dom.style.display = "none";
        },
        attr: function(dom, key, value) {
            if (value) dom.setAttribute(key, value);
            else dom.getAttribute(key);
        },
        append: function(dom, node) {
            dom.appendChild(node);
        },
        browser: function() {
            var sUserAgent = navigator.userAgent;
            if (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('Linux') > -1) {
                return "android";
            }
            if (sUserAgent.indexOf('iPhone') > -1) {
                return "ios";
            }
        }
    };
};
