window.addEventListener('DOMContentLoaded', function(ev) {

	//DOM元素
	var doc = document;
	var base = dd.base;
	var common = dd.common;
	var baseEnum = dd.baseEnum;
	var dialog = dd.dialog;
	var spanAmount = doc.querySelector(".amount");
	var divWatchDetail = doc.querySelector(".watch-detail");
	var btnMyTask = doc.querySelector("#my-task");
	var btnPreTask = doc.querySelector("#pre-task");
	var divMyTaskList = doc.querySelector("#my-task-list");
	var divPreTaskList = doc.querySelector("#pre-task-list");
	var divProgressList = doc.querySelectorAll(".task-progress-img");
	var divOveredTask = doc.querySelector(".task-overed");
	var divTaskItem = doc.querySelectorAll(".task-item");
	var hidData = doc.querySelector("#page-data");
	var dataJson = JSON.parse(hidData.value);
	var driver_id = common.getQueryString("driver_id");
	var loading = document.querySelector(".loading");
	var global = {};
	global.initMytask = false;
	global.initPreTask = false;

	console.log(dataJson);

	function initData() {
		spanAmount.innerText = dataJson.amount || 0;
		getMyTask();
	}
	initData();

	//奖励数字跳动
	function numberAnimation(number) {
		var start = 0;
		var handler = setInterval(function() {
			start += 10;
			spanAmount.innerText = start;
			if (start >= number) {
				start = number;
				spanAmount.innerText = number;
				clearInterval(handler);
			}
		}, 10);
	}
	numberAnimation(parseInt(spanAmount.innerText));

	//跳转到奖励详情
	divWatchDetail.addEventListener("click", function() {
		location.href = "/task/rewardlist?driver_id=" + driver_id;
	}, false);

	//切换tab	
	btnMyTask.addEventListener("click", function() {
		if (btnMyTask.className !== "current") {
			btnMyTask.className = "current";
			btnPreTask.className = "";
		}
		getMyTask();
	}, false);


	btnPreTask.addEventListener("click", function() {
		if (btnPreTask.className !== "current") {
			btnPreTask.className = "current";
			btnMyTask.className = "";
		}
		getPreTask();
	}, false);


	//进度条下的三角
	function triangle(content) {
		var order_count = 0;
		if (common.isArray(content)) {
			order_count = content.length;
		} else {
			order_count = content.rewards.length;
		}

		var content_length = content.length;
		var task_stage = '';
		//进度条下的三角
		var progress = 0;
		if (common.isArray(content) && content.length > 0) {
			[].forEach.call(content, function(item, index) {
				var rewards = item.rewards[0];
				var targets = item.targets;
				progress += (((index + 1) / order_count) * 100);
				progress = progress >= 100 ? 88 : progress - (4 * (index + 1));
				var postion_style = index == content_length - 1 ? 'text-align:right' : '';
				var tag = rewards.rewards_type == 1 ? '元' : '';
				task_stage += '<span style="left:' + progress + '%;' + postion_style + '"><img src="../img/triangle.png"/><br/>' + rewards.reward + tag + '</span>';
			});
		}
		return task_stage;
	}


	//往任务模板中填充数据
	function insertData(taskArray) {
		var result_Array = [];
		if (taskArray.length > 0) {
			for (var i = 0, len = taskArray.length; i < len; i++) {
				var item = taskArray[i];
				var html = baseEnum.task_item_template;
				var content = JSON.parse(item.content);
				var content_length = content.length ? content.length : 1;
				var task_tage = triangle(content);
				html = html.replace('{{title}}', item.title);
				html = html.replace('{{progress}}', item.progress / content_length);
				html = html.replace('{{task_brief}}', item.task_brief);
				html = html.replace(/{{task_id}}/g, item.task_id);
				html = html.replace(/{{driver_id}}/g, item.driver_id);
				html = html.replace('{{task_stage}}', task_tage);
				html = html.replace('{{reward_brief}}', item.reward_brief);
				if (item.reward_brief.length > 2) {
					html = html.replace('{{brief_style}}', 'font-size:1.8rem;display:inline-block;line-height:2rem;');
				}
				if (item.task_status == 0) {
					html = html.replace('{{btn_status}}', 'btn-orange');
				} else {
					html = html.replace('{{btn_status}}', 'btn-gray');
				}
				if (task_tage === "") {
					html = html.replace('{{stage_hidden}}', 'hidden');
				} else {
					html = html.replace('{{style}}', 'height:11.5rem;');
				}
				if (item.start_type === "1") {
					html = html.replace('{{hidden}}', 'hidden');
				}
				if (item.reward_type !== "1") {
					html = html.replace('{{tag_hidden}}', 'hidden');
					html = html.replace('{{rmb_style}}', 'display:none');
				}
				result_Array.push(html);
			}
		}
		return result_Array;
	}

	//获取数据
	function getMyTask() {
		if (!global.initMytask) {
			dialog.loading("加载中");
			//填充数据
			var html_result = insertData(dataJson.now_task);
			if (html_result.length > 0) {
				divMyTaskList.innerHTML = html_result.join("");
			} else {
				var empty_string = baseEnum.empty_template.replace('{{errmsg}}','暂时还没有任务哦~~');
				divMyTaskList.innerHTML = empty_string;
				divOveredTask.style.position = "fixed";
				divOveredTask.style.bottom = "0";
			}
			dialog.hide();
			jumpToDetail();
			reloadAnimation();
			accecptTask();
			global.initMytask = true;
		}
		common.removeClass(divMyTaskList, 'hidden');
		common.addClass(divPreTaskList, 'hidden');
	}

	//获取即将开始的任务
	function getPreTask() {
		if (!global.initPreTask) {
			dialog.loading("加载中");
			//填充数据
			var html_result = insertData(dataJson.future_task);
			if (html_result.length > 0) {
				divPreTaskList.innerHTML = html_result.join("");
			} else {
				var empty_string = baseEnum.empty_template.replace('{{errmsg}}','暂时还没有任务哦~~');
				divPreTaskList.innerHTML = empty_string;
				divOveredTask.style.position = "fixed";
				divOveredTask.style.bottom = "0";
			}
			dialog.hide();
			jumpToDetail();
			reloadAnimation();
			accecptTask();
			global.initPreTask = true;
		}
		common.addClass(divMyTaskList, 'hidden');
		common.removeClass(divPreTaskList, 'hidden');
	}

	//查看任务详情
	function jumpToDetail() {
		var divTaskItem = doc.querySelectorAll(".task-item");
		[].forEach.call(divTaskItem, function(item, index) {
			item.addEventListener("click", function(ev) {
				ev.preventDefault();
				if (ev.target.className.indexOf('task-botton') != -1) {
					return;
				}
				var isBind = item.getAttribute('isBind');
				if (isBind !== "true") {
					var task_id = item.getAttribute("data-taskid");
					item.setAttribute("isBind", 'true');
					location.href = '/task/rewarddetail?driver_id=' + driver_id + '&task_id=' + task_id;
				}
			}, !1);

		});
	}

	//进度条动画
	function reloadAnimation() {
		var divProgressList = doc.querySelectorAll(".task-progress-img");
		[].forEach.call(divProgressList, function(item, index) {
			item.style.width = "0";
			item.style.webkitTransition = "all 0.5s ease-in";
			var percent = item.getAttribute("data-progerss");
			setTimeout(function() {
				item.style.width = percent;
			}, 50);
		});
	}

	//领取/接受任务
	function accecptTask() {
		var taskItem = doc.querySelectorAll(".task-item");
		[].forEach.call(taskItem, function(item, index) {
			item.addEventListener("click", function(ev) {
				ev.preventDefault();
				var taskId = ev.target.getAttribute("data-taskid");
				var driverId = ev.target.getAttribute("data-driverid");
				if (ev.target.className.indexOf("task-botton btn-orange") != -1) {
					base.ajax({
						url: '/task/interface/receiveTask?task_id=' + taskId + '&driver_id=' + driverId,
						method: 'GET',
						succFunc: function(data) {
							data = JSON.parse(data);
							if (data.errno == 0) {
								dialog.alert('成功领取任务');
								ev.target.className.replace('{{hidden}}', 'hidden');
								//ev.target.className = "task-botton btn-gray";
							} else {
								dialog.alert('任务领取失败,请稍后再试');
							}
						},
						failFunc: function() {
							dialog.alert('系统错误，请稍后再试');
						}
					});
				}
			}, false);
		});
	}

	divOveredTask.addEventListener("click", function() {
		location.href = '/task/finish?driver_id=' + driver_id;
	}, false);

	function commentData(page) {
		loading.style.display = "block";
		var current_type = doc.querySelector('.current').getAttribute('data-type');
		var curnnet_interface = current_type == 1 ? 'nowTaskNextPage' : 'FutureTaskNextPage';
		base.ajax({
			url: '/task/main/' + curnnet_interface + '?driver_id=' + driver_id + "&page_no=" + page,
			method: 'GET',
			succFunc: function(data) {
				data = JSON.parse(data);
				if (data.length > 0) {
					var html_result = insertData(data);
					if (current_type == 1) {
						divMyTaskList.innerHTML = divMyTaskList.innerHTML + html_result.join("");
					} else {
						divPreTaskList.innerHTML = divPreTaskList.innerHTML + html_result.join("");
					}
					jumpToDetail();
					reloadAnimation();
					accecptTask();
					loading_show = true;
				} else {
					loading_show = false;
					isNext = false;
				}
				loading.style.display = "none";
			},
			failFunc: function() {
				dialog.alert('网络错误，请稍后再试！');
			}
		});
	}

	var loading_show = true;
	var isNext = true;
	var page = 1;
	window.onscroll = window.onresize = function() {

		var winHeight = document.documentElement.clientHeight;
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		var scrollHeight = document.body.scrollHeight;

		//console.log(scrollHeight+"--"+(winHeight + scrollTop));

		if (scrollHeight == (winHeight + scrollTop) && loading_show && isNext) {
			loading.style.display = "block";
			loading_show = false;
			page++;
			commentData(page);
		}

	};

}, false);