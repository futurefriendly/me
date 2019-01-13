window.addEventListener('DOMContentLoaded', function(ev) {

	//DOM元素
	var doc = document;
	var base = dd.base;
	var common = dd.common;
	var dialog = dd.dialog;
	var jsonData = JSON.parse(doc.querySelector('#detail-data').value);
	var divTaskDesc = doc.querySelector(".task-count");
	var divTaskTitle = doc.querySelector(".task-title");
	var ulRewardRule = doc.querySelector('.reward_rule');
	var ulTaskRuel = doc.querySelector('.task_rule');
	var divTag = doc.querySelector(".task-tag");
	var spSign = doc.querySelector(".sign");
	var divRewardStatus = doc.querySelector(".reward_status");
	var ulTaskDetail = doc.querySelector('.task-detail ul');
	var btnOrange = doc.querySelector('.btn-orange');
	var spOrderNum = doc.querySelector('.order_num');
	var spOnlineNum = doc.querySelector('.online_num');
	var spOrderStriveNum = doc.querySelector('.order_strive_num');
	var divTaskStage = doc.querySelector('.task-stage');
	var haveget = doc.querySelector(".haveget");
	var amount = doc.querySelector('.number');

	console.log(jsonData);

	//进度条下的三角
	function triangle(content) {
		var order_count = 0;
		if (common.isArray(content)) {
			order_count = content.length;
			// [].forEach.call(content, function(item, index) {
			// 	var targets = item.targets;
			// 	order_count += parseInt(targets.order);
			// });
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
				progress += ((index + 1) / order_count) * 100;
				progress = progress == 100 ? 88 : progress;
				var postion_style = index == content_length - 1 ? 'text-align:right' : '';
				var tag = rewards.rewards_type == 1 ? '元' : '';
				task_stage += '<span style="left:' + progress + '%;' + postion_style + '"><img src="../img/triangle.png"/><br/>' + rewards.reward + tag + '</span>';
			});
			doc.querySelectorAll('.task-item')[0].style.height = "17rem";
			doc.querySelectorAll('.task-item')[0].style.marginTop = "0";
			divTaskStage.innerHTML = task_stage;
		} else {
			divTaskStage.style.display = "none";
			// [].forEach.call(content.rewards, function(item, index) {
			// 	var rewards = item;
			// 	progress += Math.ceil((content.rewards.length / 100)) * 100;
			// 	progress = progress >= 100 ? 92 : progress;
			// 	var postion_style = index == content.rewards.length - 1 ? 'text-align:right' : '';
			// 	var tag = rewards.rewards_type == 1 ? '元' : '';
			// 	task_stage += '<span style="left:' + progress + '%;' + postion_style + '"><img src="../img/triangle.png"/><br/>' + rewards.reward + tag + '</span>';
			// });
		}
	}

	function create_task_rule(detail) {
		var task_rule = [];
		var task_type = detail.task_type;
		var content = JSON.parse(detail.content) || {};
		var tag_string = '累计';
		if (task_type === '1') {
			task_rule.push('<li>任务有效期：' + detail.begin_time.split(' ').shift() + '~' + detail.end_time.split(' ').shift() + ' ' + detail["from_time"] + '~' + detail["to_time"] + '</li>');
			tag_string = '每天';
		} else if (task_type === '2') {
			task_rule.push('<li>任务有效期：' + detail["from_time"] + '~' + detail["to_time"] + '</li>');
		} else if (task_type === '3') {
			task_rule.push('<li>任务有效期：' + detail.begin_time.split(' ').shift() + '~' + detail.end_time.split(' ').shift() + ' ' + detail["from_time"] + '~' + detail["to_time"] + '</li>');
		}
		if (common.isArray(content)) {
			for (var i = 0, len = content.length; i < len; i++) {
				var index = i + 1;
				var targets = content[i]['targets'];
				var rewards = content[i]['rewards'][0];
				var task_rule_string = tag_string;
				if (targets.order) {
					task_rule_string += '完成' + targets.order + '单';
				}
				if (targets.orderStrive) {
					task_rule_string += ',点抢' + targets.orderStrive + '次';
				}
				if (targets.onlineTime) {
					task_rule_string + ',在线时长' + (targets.onlineTime) / 60 + '小时';
				}
				var award_string = '奖励' + (rewards.rewards_type == 1 ? rewards.reward : rewards.reward_name) + (rewards.rewards_type == 1 ? '元' : '');
				task_rule.push('<li>任务目标' + index + '＋奖励规则' + index + '：' + task_rule_string + award_string + '</li>');
			}
		} else {

		}
		return task_rule;
	}

	function progress_normal(obj) {
		function rule(key, dom, color, index) {
			if (typeof obj[key] === 'undefined') {
				var item = doc.querySelectorAll(".task-detail li")[index];
				item.style.display = "none";
			} else {
				dom.innerText = obj[key];
				if (color === 'true') {
					dom.style.color = '#ffae53';
				}
			}

		}
		rule('order_num', spOrderNum, obj.order_num_color, 0);
		rule('online_num', spOnlineNum, obj.online_num_color, 1);
		rule('order_strive_num', spOrderStriveNum, obj.order_strive_num_color, 2);

		var liTaskDetail = doc.querySelectorAll('.task-detail li');
		if (liTaskDetail.length == 2) {
			liTaskDetail[0].style.borderRight = "none";
		}
		if (liTaskDetail.length == 1) {
			liTaskDetail[0].style.border = "none";
		}
	}

	function progress_special(obj) {
		var target_type = {
			'1': '成单数',
			'2': '在线时长',
			'3': '点抢次数'
		};
		var html = [];
		[].forEach.call(obj, function(item, index) {
			for (var key in item) {
				var time = key.split('-')[1] + '-' + key.split('-')[2]
				var style = index === 0 ? 'style="height:6rem;line-height:5rem;border-bottom:1px solid #ddd;border-right:1px solid #ddd;"' : 'style="background:#fafafa;border-bottom:1px solid #e9e9e9;"';

				var extend_class = index === 0 ? 'progress_special_extend' : 'progress_special_extend_other';

				var isFold = index > 0 ? 'data-isfold="true"' : 'data-isfold="false"';

				html.push('<li class="' + extend_class + ' progress_special_key" ' + isFold + '><span class="task-number order_num">' + time + '</span>日期</li>');
				html.push('<li class="' + extend_class + ' progress_special_value" ' + isFold + '>');
				html.push('<div><ul>');
				for (var i = 0, len = item[key].length; i < len; i++) {
					var info = item[key][i];
					var color = info.color === 'true' ? 'style="color:#ff8903"' : ''
					html.push('<li><span class="task-number order_num" ' + color + '>' + info.stats + '</span>' + target_type[info.target_type] + '</li>');
				}
				html.push('</ul></div></li>');
			}
		});
		if (html.length > 0) {
			html.push('<li class="unfold-detail" data-status="up" style="line-height:3rem;">本期任务详情 <span><img src="../public/img/arrow-up.png" style="width:1.3rem"/></span></li>');
		}
		var height = ((obj.length - 1) * 5) + 3;
		var task_item = doc.querySelectorAll('.task-item')[0];
		task_item.style.height = parseInt(task_item.style.height) + height + "rem";
		ulTaskDetail.className = 'progress_special';
		ulTaskDetail.innerHTML = html.join('');
		fold_task_detail(task_item, obj.length);
	}

	function fold_task_detail(dom, obj_length) {
		var fold_arrow = doc.querySelector(".unfold-detail");
		var fold_arrow_img = doc.querySelector(".unfold-detail img");
		var isFold = doc.querySelectorAll('li[data-isfold="true"]');
		fold_arrow.addEventListener("click", function(ev) {
			ev.preventDefault();
			var status = fold_arrow.getAttribute('data-status');
			if (status === 'up') {
				dom.style.height = parseInt(dom.style.height) - (obj_length - 1) * 5 + 'rem';
				[].forEach.call(isFold, function(item, index) {
					item.style.display = 'none';
				});
				fold_arrow_img.src = '../public/img/arrow-down.png';
				fold_arrow.setAttribute('data-status', 'down');
			} else {
				dom.style.height = parseInt(dom.style.height) + (obj_length - 1) * 5 + 'rem';
				[].forEach.call(isFold, function(item, index) {
					item.style.display = 'inline-block';
				});
				fold_arrow_img.src = '../public/img/arrow-up.png';
				fold_arrow.setAttribute('data-status', 'up');
			}

		}, false);
	}

	//初始化页面数据
	function initData(callbacks) {
		var detail = jsonData.detail[0];
		var content = JSON.parse(jsonData.detail[0]['content']) || {};
		var driver_id = detail.driver_id;
		var task_id = detail.task_id;
		divTaskDesc.innerText = detail.reward_brief;
		ulTaskRuel.querySelector("li").innerText = detail.task_brief;
		divTaskTitle.innerText = detail.title;
		triangle(content);

		//非周期任务与非周期任务布局
		if (typeof detail.progress_normal !== 'undefined') {
			progress_normal(detail.progress_normal);
		} else {
			progress_special(detail.progress_special);
		}
		var task_rule = create_task_rule(detail);
		ulRewardRule.innerHTML = task_rule.join("");
		if (detail.reward_type != 1) {
			common.addClass(divTag, 'hidden');
			spSign.parentNode.removeChild(spSign);
		}

		divRewardStatus.querySelector("li").innerText = detail.is_send == 0 ? '未发放' : '已发放';
		if (detail.reward_type != 2) {
			haveget.style.display = "none";
		}
		if (detail.reward_type == 3) {
			if (detail.reward_status == 0) {
				divRewardStatus.querySelector("li").innerText = "未领取";
			} else {
				divRewardStatus.querySelector("li").innerText = "已领取";
				btnOrange.className = "btn-gray";
			}
		}

		//数据填充后的回调
		for (var item in callbacks) {
			if (callbacks[item].name === "reloadAnimation") {
				callbacks[item](detail.progress, content.length);
			} else {
				callbacks[item](driver_id, task_id);
			}
		}
	}

	initData([reloadAnimation, changeStatus]);

	function reloadAnimation(progress, task_length) {
		var divProgressList = doc.querySelector(".task-progress-img");
		divProgressList.removeAttribute('style');
		var percent = progress / task_length + "%";
		divProgressList.style.width = percent;
		setTimeout(function() {
			divProgressList.style.webKitTransition = "all 0.5s ease-in";
		}, 50);
	}

	function changeStatus(driver_id, task_id) {
		if (btnOrange && btnOrange.className === "btn-orange") {
			btnOrange.addEventListener("click", function() {
				base.ajax({
					url: '/task/interface/receiveReward?driver_id=' + driver_id + '&task_id=' +
						task_id,
					method: "GET",
					succFunc: function(data) {
						data = JSON.parse(data);
						if (data.errno == 0) {
							btnOrange.className = "btn-gray";
							dialog.alert('操作成功');
						}
					},
					failFunc: function() {
						dialog.alert('系统错误，请稍后再试');
					}
				});
			}, false);
		}
	}

}, false);