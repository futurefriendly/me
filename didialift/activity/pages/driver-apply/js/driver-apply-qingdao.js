document.addEventListener('DOMContentLoaded', function () {

        var base = dd.base || {};
        var dialog = dd && dd.dialog;

        var btn = document.getElementById("btn");
        //var activity_s_time_el = document.getElementById("activity_s_time");
        //var apply_s_time_el = document.getElementById("apply_s_time");
        //var apply_e_time_el = document.getElementById("apply_e_time");
        //var rank_time_el = document.getElementById("rank_time");
        //var result_time_el = document.getElementById("result_time");

        //var baseUrl = "http://10.10.9.87:8046";
        var baseUrl = "http://market.api.diditaxi.com.cn";
        var result_time = null;
        var token = base.getQueryStr().token ? base.getQueryStr().token : "";

        //按钮状态(不可点)
        var btnGray = function (txt) {
            if (btn.classList.contains("btn-org")) {
                btn.classList.remove("btn-org");
            }
            btn.classList.add("btn-gray");
            btn.innerHTML = txt;
        };

        // 展示状态
        var getStatus = function () {
            var loading = dd.dialog.loading("加载中...");
            base.ajax({
                method: "GET",
                url: baseUrl + "/biz_tmp/assignorderdriver/Api_dev/status?token=" + token + "&serial=2",
                data: {},
                succFunc: function (data) {
                    loading.hide();
                    var da = base.txtToJson(data);

                    if (da.errno == 0) {
                        var status = da.status;
                        var time_data = da.time_data;
                        //activity_s_time_el.innerHTML = time_data.activity_s_time; //活动开始时间
                        //apply_s_time_el.innerHTML = time_data.apply_s_time; //报名开始时间
                        //apply_e_time_el.innerHTML = time_data.apply_e_time; //报名截止时间
                        //rank_time_el.innerHTML = time_data.rank_time;//排名时间
                        //result_time_el.innerHTML = time_data.result_time; //公布结果时间
                        result_time = time_data.result_time; //公布结果时间

                        if (status == 0) { //未报名
                            btn.classList.add("btn-org");
                            btn.innerHTML = "立即报名";
                            base.touch(btn, function () {
                                if (btn.classList.contains("btn-org")) {
                                    dd.dialog.confirm("确定报名?", function() {
                                        enrollFn();
                                    });

                                }
                            });

                        } else if (status == 1) { //已报名
                            btnGray("已报名" + result_time + "公布结果");

                        } else if (status == 2) { //报名成功
                            btn.classList.add("btn-org-opa");
                            btn.innerHTML = "恭喜！报名成功";

                        } else if (status == 10001) { //不是报名城市司机
                            btnGray("不是报名城市司机");

                        } else if (status == 10002) { //报名时间已过
                            btnGray("报名已截止，下次再来吧");

                        } else if (status == 10003) { //报名时间未开始
                            btnGray("报名时间未开始");

                        } else {
                            btnGray("报名失败，下次再来吧");

                        }
                    } else if (da.errno == 100) {
                        dd.dialog.alert("系统错误");
                    } else if (da.errno == 101) {
                        dd.dialog.alert("参数错误");
                    } else {
                        dd.dialog.alert("请稍后再试");
                    }

                },
                failFunc: function () {
                    loading.hide();
                    dd.dialog.alert("请稍后再试");
                }
            });

        };


        //立即报名
        var enrollFn = function () {
            var loading = dd.dialog.loading("加载中...");
            base.ajax({
                method: "GET",
                url: baseUrl + "/biz_tmp/assignorderdriver/Api_dev/enroll?token=" + token + "&serial=2",
                data: {},
                succFunc: function (data) {
                    loading.hide();
                    var da = base.txtToJson(data);

                    if (da.errno == 0) {
                        var status = da.status;
                        if (status == 1) {//成功
                            btnGray("已报名" + result_time + "公布结果");

                        } else if (status == 0) {//失败
                            btnGray("报名失败，下次再来吧");

                        } else if (status == 2) {//已经报名
                            btnGray("已经报名");

                        } else if (status == 10001) {//不是报名城市司机
                            btnGray("不是报名城市司机");

                        }

                    } else if (da.errno == 100) {
                        dd.dialog.alert("系统错误");
                    } else if (da.errno == 101) {
                        dd.dialog.alert("参数错误");
                    } else {
                        btnGray("报名失败，下次再来吧");
                    }

                },
                failFunc: function () {
                    loading.hide();
                    dd.dialog.alert("请稍后再试");
                }
            });
        }

        var init = function () {
            getStatus();

        };
        init();
    },
    false);