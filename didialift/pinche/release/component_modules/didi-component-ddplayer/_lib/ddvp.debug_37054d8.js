(function () {
	//声明ddvp中debug变量
	window.ddvp = window.ddvp || {};
    window.ddvp.debug = {};
	var startTime = Date.now();
	ddvp.debug.playerLoadStartTime = startTime || 0;
	ddvp.debug.playerLoadScriptTime = startTime || 0;
	ddvp.debug.playerPlayStartTime = 0;
	ddvp.debug.playerLoadDomStartTime = 0;
	ddvp.debug.playerLoadAdDataStartTime = 0;
	ddvp.debug.playerLoadMediaDataStartTime = 0;
	ddvp.debug.isShowPlayerPlayStartTime = false;
})();
