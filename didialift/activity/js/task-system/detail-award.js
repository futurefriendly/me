window.addEventListener("DOMContentLoaded", function(ev) {
	var base = dd.base || {};
	var common = dd.common || {};
	var dialog = dd.dialog || {};
	var baseEnum = dd.baseEnum || {};
	var doc = document;
	var jsonData = JSON.parse(doc.getElementById("detail-data").value);
	var divPageBody = doc.querySelector('.page-body');

	console.log(jsonData);

	function initData() {
		var result_Array = [];
		taskArray = jsonData.list;
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
				html = html.replace('{{title}}', item.title);
				html = html.replace('{{task_brief}}', item.task_brief);
				html = html.replace(/{{task_id}}/g, item.task_id);
				html = html.replace(/{{driver_id}}/g, item.driver_id);
				if (item.start_type === "2") {
					html = html.replace('{{hidden}}', 'hidden');
				}
				if (item.reward_type == "1") {
					html = html.replace('{{tag_hidden}}', '');
					html = html.replace('{{amount}}', item.amount);
				} else {
					html = html.replace('{{tag_hidden}}', 'hidden');
					html = html.replace('<span class="sign" data-isshow="true">￥</span>', '');
					html = html.replace('{{amount}}', item.reward_name);
				}
				result_Array.push(html);
			}

			result_Array.push('</div>');
		}

		return result_Array;
	}

	function insertData(callback) {
		var result_html = initData().join("");
		if (result_html) {
			divPageBody.innerHTML = result_html;
			if (typeof callback === "function") {
				callback();
			}
		} else {
			divPageBody.innerHTML = baseEnum.empty_template;
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

}, false);