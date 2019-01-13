/*
 *description:是否存在样式名称
 *params: [Object] domObject
 *params: [string] className
 *return: [bool]
 */
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/*
 *description:添加样式
 *params: [Object] domObject
 *params: [string] className
 *return: undefined
 */
function addClass(obj, cls) {
	if (!hasClass(obj, cls)) obj.className += " " + cls;
}

/*
 *description:移除样式
 *params: [Object] domObject
 *params: [string] className
 *return: [bool]
 */
function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}
/*
 *description:获取下一个元素节点
 *params: [object] node
 *return: [object] node
 */
function getNextElement(node){
	if(node.nextSibling.nodeType==1){
		return node.nextSibling;
	}else if(node.nextSibling.nodeType==3){
		return getNextElement(node.nextSibling);
	}else{
		return null;
	}
};


/*
*description:获取链接参数
*params: [string]
*return: [string]
*/
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2]; return "";
}
