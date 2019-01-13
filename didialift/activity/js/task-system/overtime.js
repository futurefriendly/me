window.addEventListener("DOMContentLoaded", function(ev) {
	var base = dd.base || {};
	var common = dd.common || {};
	var dialog = dd.dialog || {};
	var baseEnum = dd.baseEnum || {};
	var doc = document;
	var jsonData = JSON.parse(doc.getElementById("detail-data").value);
	var divPageBody = doc.querySelector('.page-body');
	var loading = document.querySelector(".loading");
	var driver_id = common.getQueryString('driver_id');

	console.log(jsonData);

	//初始化数据
	function initData(taskArray) {
		var result_Array = [];
		if (taskArray.length === 0) {
			return result_Array;
		}
		for (var j in taskArray) {
			var brand = taskArray[j];
			result_Array.push('<div class="task-time-title">' + j + '</div>');
			result_Array.push('<div class="task-list task-list-overed">');

			for (var i = 0, len = brand.length; i < len; i++) {
				var item = brand[i];
				var html = baseEnum.task_award_template;
				if (item.is_send === "1") {
					html = html.replace('{{givend-status}}', "givend-task");
				} else if (item.is_send === "2") {
					html = html.replace('{{givend-status}}', "un-givend-task");
				} else {
					html = html.replace('{{givend-status}}', "outtime-task");
				}
				html = html.replace('{{driver_id}}', item.driver_id);
				html = html.replace('{{task_id}}', item.task_id);
				html = html.replace('{{title}}', item.title);
				html = html.replace('{{task_brief}}', item.task_brief);
				html = html.replace('{{task_id}}', item.task_id);
				if (item.start_type === "2") {
					html = html.replace('{{hidden}}', 'hidden');
				}
				if (item.reward_type == "1") {
					html = html.replace('{{tag_hidden}}', '');
					html = html.replace('{{amount}}', item.reward_brief);
				} else {
					html = html.replace('{{tag_hidden}}', 'hidden');
					html = html.replace('<span class="sign" data-isshow="true">￥</span>', '');
					html = html.replace('{{amount}}', item.reward_brief);
					if (item.reward_brief.length > 2) {
						html = html.replace('{{style}}', 'style="font-size:1.8rem;display:inline-block;line-height:2rem;"');
					}
				}
				result_Array.push(html);
			}

			result_Array.push('</div>');
		}

		return result_Array;
	}

	function insertData(callback) {
		var result_html = initData(jsonData.list).join("");
		if (result_html) {
			divPageBody.innerHTML = result_html;
			if (typeof callback === "function") {
				callback();
			}
		} else {
			divPageBody.innerHTML = baseEnum.empty_template;
			loading.style.display = "none";
		}
	}

	//将任务列表插入DOM
	insertData(function() {
		var divTaskItem = doc.querySelectorAll('.task-item');
		[].forEach.call(divTaskItem, function(item, index) {
			item.addEventListener('click', function(ev) {
				ev.preventDefault();
				var driver_id = item.getAttribute('data-driverid');
				var task_id = item.getAttribute('data-taskid');
				location.href = '/task/rewarddetail?driver_id=' + driver_id + '&task_id=' + task_id;
			});
		});
	});

	function commentData(page) {
		base.ajax({
			url: '/task/finish/getFinishNextPage?driver_id=' + driver_id + "&page_no=" + page,
			method: 'GET',
			succFunc: function(data) {
				data = data || '[]';
				data = JSON.parse(data);
				if (data.length > 0) {
					var result_html = initData(data).join("");
					if (result_html) {
						divPageBody.innerHTML = divPageBody.innerHTML + result_html;
					}
					var divTaskItem = doc.querySelectorAll('.task-item');
					[].forEach.call(divTaskItem, function(item, index) {
						item.addEventListener('click', function(ev) {
							ev.preventDefault();
							var driver_id = item.getAttribute('data-driverid');
							var task_id = item.getAttribute('data-taskid');
							location.href = '/task/rewarddetail?driver_id=' + driver_id + '&task_id=' + task_id;
						});
					});
					loading_show = true;
				} else {
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