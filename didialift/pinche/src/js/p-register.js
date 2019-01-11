   dd.ready(function() {
       var base = dd.base,
           dialog = dd.dialog;

       var driver_form = base.txtToJson(localStorage.driver_form || {});

       var regular = {
           is_Chinese_name: function(str) {
               var reg = /^[\u4E00-\u9FA5]{2,}$/;
               if (!reg.test(str)) {
                   return false;
               }
               return true;
           },
           // 身份证校验
           is_ID_card: function(code) {
               // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
               var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
               if (reg.test(code) === false) {
                   return false;
               }
               return true;
           },
           // 车牌号校验
           is_carNo: function(str) {
               var reg = /^[A-Za-z]{1}[A-Za-z0-9]{5}$/;
               if (!reg.test(str)) {
                   return false;
               }
               return true;
           }
       };
       (function init() {
           //车牌首字初始化
           carno_init(page_driver.car_province_id);

           // 恢复数据
           if (pageParams.type == "join") { //
               // 恢复数据
               register_recover();
           }

           //表达校验初始化
           validata_init();
           // 点击提交
           base.touch(btnSubmit, function() {
               if (btnSubmit.className == "btn-gray") return;
               // hide keyborad
               var list_input = document.getElementsByTagName("input");
               for (var i = 0, len = list_input.length; i < len; i++) {
                   var _input = list_input[i];
                   _input.setAttribute("readOnly", "true");
                   _input.blur();
               }
               scrollTo(0, 0);
               setTimeout(function() {
                   for (i = 0, len = list_input.length; i < len; i++) {
                       var _input = list_input[i];
                       _input.removeAttribute("readOnly");
                   }
               }, 100);
               //end hide keyborad

               var data_form = {
                   drive_license_name: txt_realname.value, //驾驶证姓名
                   drive_license_number: txt_licence.value.toLocaleUpperCase(), //驾驶证号

                   travel_license_name: txt_carower.value, //行驶证姓名
                   car_province_id: txt_carOne.getAttribute("data-id"), //车省号
                   car_license_number: txt_carOne2.value.toLocaleUpperCase(), //车牌号：A234567

                   phone_number: pageParams.phone || "", //电话号
                   token: pageParams.token || "",
                   sign: pageParams.sign || ""
               };
               var form_ok = form_validate(data_form);
               if (form_ok) {
                   form_commit(data_form);
               }
           });


       })();


       //车牌首字
       function carno_init(value) {
               var carnoSelect = document.getElementById("carnoSelect");

               ulEl = carnoSelect.getElementsByClassName("options")[0];
               var get_no = function() {
                   base.ajax({
                       method: "POST",
                       url: "/pinche/cartype/getlicensehead",
                       succFunc: function(j) {
                           var da = base.txtToJson(j);
                           if (da.errno == "0") {
                               var data = da.data;
                               var sort = da.sort;
                               var html = "";
                               for (var i = 0, len = sort.length; i < len; i++) {
                                   html += '<li data-id="' + sort[i] + '" data-show="' + data[sort[i]] + '">' + data[sort[i]] + '</li>';

                               }
                               ulEl.innerHTML += html;
                               slideSelect_carno(txt_carOne, carnoSelect, []); //carno
                           }

                       },
                       failFunc: function() {}
                   });
               };
               get_no();

           }
           /*对文本框的输入进行一个保存恢复操作*/
       function register_recover() {
           //保存表单数据
           var _store = function(key, value) {
               driver_form[key] = value;
               localStorage.driver_form = JSON.stringify(driver_form);
           };
           txt_realname.addEventListener("change", function() {
               _store("txt_realname", this.value);
           }, false);

           txt_licence.addEventListener("change", function() {
               _store("txt_licence", this.value);
           }, false);

           txt_carower.addEventListener("change", function() {
               _store("txt_carower", this.value);
           }, false);

           // txt_carOne.addEventListener("click", function() {
           //     _store("txt_carOne", txt_carOne.value);
           // }, false);

           txt_carOne2.addEventListener("change", function() {
               _store("txt_carOne2", this.value);
           }, false);

           if (driver_form) {
               txt_realname.value = driver_form.txt_realname || "";
               txt_licence.value = driver_form.txt_licence || "";
               txt_carower.value = driver_form.txt_carower || "";
               // txt_carOne.value = driver_form.txt_carOne || "";
               txt_carOne2.value = driver_form.txt_carOne2 || "";
           }
       }

       function validata_init() {
               // 真实姓名
               txt_realname.addEventListener("focus", function() {
                   this.className = "";
               }, false);
               txt_realname.addEventListener("blur", function() {
                   if (!regular.is_Chinese_name(this.value)) {
                       this.className = "error";
                   }
               }, false);

               // 驾驶证号
               txt_licence.addEventListener("focus", function() {
                   this.className = "";
               }, false);
               txt_licence.addEventListener("blur", function() {
                   if (!regular.is_ID_card(this.value)) {
                       this.className = "error";
                   }
               }, false);

               // 行驶本姓名
               txt_carower.addEventListener("focus", function() {
                   this.className = "";
               }, false);
               txt_carower.addEventListener("blur", function() {
                   if (!regular.is_Chinese_name(this.value)) {
                       this.className = "error";
                   }
               }, false);

               // 车牌号验证
               txt_carOne2.addEventListener("focus", function() {
                   this.className = "";
               }, false);
               txt_carOne2.addEventListener("blur", function() {
                   if (!regular.is_carNo(this.value)) {
                       this.className = "error";
                   }
               }, false);
           }
           //表单校验
       function form_validate(data) {
               // 文本输入错误
               var input_error = function(ele, title) {
                   dialog.alert({
                       title: "",
                       tip: title,
                       btn: {
                           handler: function() {
                               ele.focus();
                           }
                       }
                   });
               };

              if(pageParams.drive_license_changeable === '1'){
                 //驾驶人
                 if (!regular.is_Chinese_name(data.drive_license_name)) {
                     input_error(txt_realname, "请填写真实姓名");
                     return false;
                 }
                 if (!regular.is_ID_card(data.drive_license_number)) {
                     input_error(txt_licence, "身份证号填写错误");
                     return false;
                 }
              }

              //如果这些可以修改
              if(pageParams.travel_license_changeable === '1' ){
                 //车辆
                 if (!regular.is_Chinese_name(data.travel_license_name)) {
                     input_error(txt_carower, "行驶证姓名填写错误");
                     return false;
                 }
                 if (txt_carOne.value == "") {
                     dialog.alert('请选择车牌归属地');
                     return false;
                 }
                 if (!regular.is_carNo(data.car_license_number)) {
                     input_error(txt_carOne2, "车牌号填写错误");
                     return false;
                 }
               }
               return true;
           }
           //提交新增表单
       function form_commit(data) {
           dialog.loading("正在请求，请稍后~");
           base.ajax({
               method: "POST",
               url: pageParams.submit_url,
               data: data,
               succFunc: function(j) {
                   var da = base.txtToJson(j);
                   if (da.errno == "0") { //注册成功   
                       localStorage.removeItem("driver_form");
                       location.replace(da.url);
                   } else if (da.errno == "3002") {
                       localStorage.removeItem("driver_form");
                       location.replace(da.url);
                   } else {
                       dialog.alert(da.errmsg);
                   }
               },
               failFunc: function() {
                   dialog.alert("网络有点不给力，请稍后再试哦~");
               }
           });
       }
   });
