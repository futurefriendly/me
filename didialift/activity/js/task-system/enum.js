(function(window, dd, undefined) {
	var baseEnum = baseEnum || {};
	baseEnum.reward_type = {
		"1": "现金",
		"2": "实物",
		"3": "滴米"
	};

	baseEnum.start_type = {
		"1": "自动领取",
		"2": "手动领取"
	};

	task_item_html = [];
	task_item_html.push('<div class="task-item" {{style}} data-taskid="{{task_id}}" data-driverid="{{driver_id}}">');
	task_item_html.push('<div class="task-tag {{tag_hidden}}"><img src="../public/img/tips.png"/></div>');
	task_item_html.push('<div class="task-title">{{title}}</div>');
	task_item_html.push('<div class="task-content">');
	task_item_html.push('<div class="task-gift"><span class="sign" data-isshow="true" style="{{rmb_style}}">￥</span><span class="number" style="{{style}}">{{reward_brief}}</span></div>');
	task_item_html.push('<div class="task-require">');
	task_item_html.push('<div class="task-count">{{task_brief}}</div>');
	// task_item_html.push('<div class="task-time">9-28日06:30～9-29日10:00</div>');
	task_item_html.push('</div>');
	task_item_html.push('</div>');
	task_item_html.push('<div class="task-botton {{btn_status}} {{hidden}}"  data-taskid="{{task_id}}" data-driverid="{{driver_id}}">领取</div>');
	task_item_html.push('<div class="task-progress">');
	task_item_html.push('<div class="task-progress-img" data-itemid="1" data-progerss="{{progress}}%"></div>');
	task_item_html.push('</div>');
	task_item_html.push('<div class="task-stage {{stage_hidden}}">{{task_stage}}</div>');
	task_item_html.push('</div>');
	baseEnum.task_item_template = task_item_html.join("");

	baseEnum.empty_template = '<div class="empty"><img src="../img/empty.png"/><br/>暂时还没有任务哦~~</div>';


	task_award_html = [];
	task_award_html.push('<div class="task-item {{givend-status}}" data-driverid="{{driver_id}}" data-taskid="{{task_id}}">');
	task_award_html.push('<div class="task-tag {{tag_hidden}}"><img src="../public/img/tips.png"/></div>');
	task_award_html.push('<div class="task-title">{{title}}</div>');
	task_award_html.push('<div class="task-content">');
	task_award_html.push('<div class="task-gift"><span class="sign" data-isshow="true">￥</span><span class="number" {{style}}>{{amount}}</span></div>');
	task_award_html.push('<div class="task-require">');
	task_award_html.push('<div class="task-count">{{task_brief}}</div>');
	task_award_html.push('</div>');
	task_award_html.push('</div>');
	task_award_html.push('<div class="task-botton btn-orange hidden">未发放</div>');
	task_award_html.push('</div>');
	baseEnum.task_award_template = task_award_html.join("");

	window.dd.baseEnum = baseEnum;

})(window, dd, undefined);