!function(){

  var gifType = {
   	vgif: "http://nsclick.baidu.com/v.gif?pid=104&",
   	pgif: "http://nsclick.baidu.com/p.gif?pid=104&",
   };

   var oldquery = "";

   var appRootUrl = location.protocol + location.host + location.pathname;

   function sendPVStats(options) {
   	var time = Date.now(),
   		img = new Image(),
   		node, target,
   		options = options || {},
   		callback = options.callback,
   		query = options.query || {
   			u: location.href
   		},
   		event = options.event,
   		gif = gifType[(options.pv || 'p') + 'gif'];

   	window[ "bd_" + time * Math.random() ] = img;

   	if (oldquery == query) //同一个统计一段时间内不允许连续发送
   		return false;
   	oldquery = query;
   	setTimeout(function() {
   		oldquery = '';
   	}, 500)

   	if (options.pv && options.pv.toLowerCase() == 'v') { //延迟200MS
   		if ($.isObject(query) && !query.cu) {
   			query.cu = location.href;
   			delete query.u;
   		}

   		target = event && ((node = event.target).nodeType == 1 ? node : node.parentNode);

   		if (target && target.getAttribute('data-clicked') == "1") { //防止重复点击
   			return false;
   		}
   		target && target.setAttribute('data-clicked', "1");

   		if (callback) {
   			setTimeout(function() {
   				callback(event);
   				target && target.removeAttribute("data-clicked");
   			}, 200)
   		} else {
   			target && target.removeAttribute("data-clicked");
   		}
   	}

   	query = $.isPlainObject(query) ? $.param(query) : query;
   	img.src = gif + query + "&t=" + time;

   	return false;

   }
 $.pv = sendPVStats;

}(); 
