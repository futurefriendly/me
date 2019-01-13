  // 页面初始化
  dd.ready(function() {

      var base = dd.base,
          dialog = dd.dialog,
          pageDom = null, //当前页面显示的 .page 
          pages = document.getElementsByClassName("page"),
          ulList = document.getElementById("ul-list"),
          others = document.getElementById("others");

      // 格式转换
      pageno = pageno || 1;
      errno = errno || 0;
      hb_info = base.txtToJson(hb_info) || {}; //hb_info type==1分享，type==2 渠道
      theme_config = base.txtToJson(theme_config) || {}; //页面配置相关 
      all_hb_info = base.txtToJson(all_hb_info) || {}; //跟个人相关 抢到的代金券及朋友抢到代金券列表
      var max_display_count = (theme_config.receiver && theme_config.receiver.max_display_count) || 15; //朋友列表最多显示条目数

      // 页面配置
      var pageMap = {
          "1": "page-grab", // 1 表示抢代金券输入手机号页面
          "2": "page-result", // 2 表示抢代金券结果页面(服务器端我们没有区分成功，失败等状态，还有一个errno)
          "3": "page-error", // 3表示异常页面
          "4": "page-changephone" //4修改手机号
      };

      var config = {};

      config.resPageStMap = { // 抢代金券结果页面各种状态map 5001及以上是pageno=3
          "0": { // 成功
              tip: (theme_config.page_wording && theme_config.page_wording.success_txt) || "恭喜您抢代金券成功了！！！"
          },
          "301": { // 已抢过
              tip: "这是你已经领过的代金券了哦～"
          },
          "302": { // 已抢完 
              tip: (theme_config.page_wording && theme_config.page_wording.finish_txt) || "对不起，此代金券已被抢完~"
          },
          "303": { // 已过期
              tip: "这个代金券过期了... "
          },
          "304": { // 还不能领
              tip: "代金券还没开抢，晚点再来！"
          },
          "305": {
              tip: "运气不够，没领到代金券~"
          },
          "401": {
              tip: "不能再领这个代金券了哦～"
          },
          "5001": {
              tip: "服务器忙，稍后再试试～"
          },
          "5004": {
              tip: "签名验证失败~"
          }
      };
      // end 页面配置

      // 加载页面及泡泡
      var load_page = function(pageno, errno) {
          for (var i = 0, len = pages.length; i < len; i++) {
              pages[i].style.display = "none";
          }
          pageDom = document.getElementById(pageMap[pageno]);
          pageDom.style.display = "block";

          // update_bubble
          var update_bubble = function(cfg, pageDom) {
              var tip = pageDom.getElementsByClassName("bubble")[0];
              if (pageno == 2) {
                  tip.innerHTML = (config.resPageStMap[errno] && config.resPageStMap[errno].tip) || "程序员哥哥出现了让人无法理解的错误~";
              } else if (pageno == 1) {
                  tip.innerHTML = cfg.page_wording && cfg.page_wording.phone_txt;
              } else {
                  tip.innerHTML = (config.resPageStMap[errno] && config.resPageStMap[errno].tip) || "程序员哥哥出现了让人无法理解的错误~";
              }
          };
          // all_hb_info = all_hb_info || {};
          update_bubble(theme_config, pageDom);
      };

      //加载代金券主题
      var using_config = function(theme_config, pageDom) {

          //head img
          var update_head_img = function(cfg, pageDom) {
              var head_img = pageDom.getElementsByClassName('head')[0];
              if (hb_info.type == 2) { //渠道代金券会使用该样式
                  head_img.src = (cfg.sender && cfg.sender.sender_img_url) || "http://static.xiaojukeji.com/pinche/hongbao/images/hb-head.png";
              } else { //分享代金券
                  head_img.src = (all_hb_info.create && all_hb_info.create.headimgurl) || "http://static.xiaojukeji.com//pinche/hongbao/images/hb-head.png";
              }
          };

          // background image
          var load_bg = function(cfg) {
              var page_bg_img = cfg.page_bg_img || {};

              var b = document.body;
              var w = window.screen.width;
              if (w < 321) {
                  b.style.background = "url('" + page_bg_img.top_small_img + "')  no-repeat";
                  b.style.backgroundSize = "100% auto"
              } else {
                  b.style.background = "url('" + page_bg_img.top_big_img + "')  no-repeat";
                  b.style.backgroundSize = "100% auto"
              }
          };

          //extra button
          var add_btn = function(cfg, pageDom) {
              var _btn = cfg.extra_btn;
              if (!_btn) return;
              var html = '<a class="btn-orange" name="link" data-href="' + (_btn.btn_extra_link || "") + '">' + (_btn.btn_extra_name || "") + '</a>';
              var letter = pageDom.getElementsByClassName("letter")[0];
              letter.innerHTML += html;
          };

          //when first onload page 初始化
          var init = function(cfg, pageDom) {
              update_head_img(cfg, pageDom);
              load_bg(cfg);
              add_btn(cfg, pageDom);
          };

          init(theme_config, pageDom);
      };

      //加载代金券页面 page==2
      var load_hongbao = function(all_hb_info, max_length) {
          // 券加载
          var load_coupon = function(all_hb_info) {
              // 已抢过 301
              // 已抢完 302
              // 已过期 303
              // 还不能领 304
              var coupon = document.getElementById('coupon');
              if (errno == 0 || errno == 301) { //抢成功或已经抢过会显示券样式

                  coupon.className = "coupon " + (all_hb_info.bonus_type || "");
                  coupon.innerHTML = (all_hb_info.amount || 0) + "<em>元</em>";
                  phone.innerHTML = all_hb_info.phone || "";

              } else {
                  coupon.style.display = "none";
                  var title = pageDom.getElementsByClassName("title")[0];
                  title.innerHTML = (config.resPageStMap[errno] && config.resPageStMap[errno].tip) || "程序员哥哥出现了让人无法理解的错误~";
              }
          };

          // 代金券获取人列表
          var load_friend_list = function(all_hb_info, max_length) {
              var list_info = all_hb_info.list_info || [];
              var html = "",
                  len = list_info.length > max_length ? max_length : list_info.length; //显示长度
              if (len === 0) {
                  html = '<li class="empty">暂无小朋友抢代金券</li>';
                  return;
              }

              for (var i = 0; i < len; i++) {
                  html += '<li><img src="' + (list_info[i]["headimgurl"] || "http://static.xiaojukeji.com/pinche/hongbao/images/hb-head.png") + '" width="32px" height="32px"><div class="detail">';
                  html += '<span class="name">' + (list_info[i]["nickname"] || "滴滴小伙伴") + '</span>';
                  html += '<span class="time">' + (list_info[i]["create_time"] || "") + '</span>';
                  html += '<b class="amount">' + (list_info[i]["amount"] || 0) + '元</b>';
                  html += '<p class="comment">以后出门就靠你了，么么哒~</p></div></li>';
              }

              ulList.innerHTML = html;
              others.style.display = "block";
          };

          load_coupon(all_hb_info);

          load_friend_list(all_hb_info, max_length);

      };

      //初始化下载按钮事件 
      var apply_download_event = function() {
          var list_download = document.getElementsByName("btnDownload");
          for (var i = 0, len = list_download.length; i < len; i++) {
              base.touch(list_download[i], function() {
                  base.diffPlatform({
                      ios: function() {
                          location.href = "https://itunes.apple.com/cn/app/di-di-da-che-zhi-jian-shang/id554499054?ls=1&mt=8";
                      },
                      android: function() {
                          location.href = "http://dldir1.qq.com/diditaxi/apk/didi_psngr.apk";
                      }
                  });
              });
          }
      };

      // 初始化链接事件把click改成touch
      var apply_link_event = function() {
          // 下载按钮
          var list_link = document.getElementsByName("link");
          var _link = null;
          for (var i = 0, len = list_link.length; i < len; i++) {
              _link = list_link[i];
              base.touch(list_link[i], function() {
                  location.href = _link.getAttribute("data-href");
              });
          }
          // end 下载按钮
      };

      // 打开代金券按钮
      var apply_openbtn_event = function() {
          // 打开代金券按钮
          var txtPhone = document.getElementById('txt-phone'),
              btnOpen = document.getElementById('btnOpen');
          // 输手机号
          var getPayHBAjax = function(phone_txt) {
              var _dialog = dd.dialog.loading("请求中，请稍后...");
              var urlStr = "?openid=" + encodeURIComponent(hb_info.openid) + "&phone=" + encodeURIComponent(phone_txt);
              for (var i in hb_info) {
                  urlStr += "&" + i + "=" + hb_info[i];
              }
              base.ajax({
                  method: "GET",
                  url: '/beatles_hb/EHongbao/getPayHBAjax' + urlStr,
                  succFunc: function(data) {
                      data = base.txtToJson(data) || {};
                      setTimeout(function() {
                          _dialog.hide();
                      }, 300); //兼容处理 按钮穿透

                      pageno = data.pageno || pageno;
                      errno = data.errno || errno;

                      load_page(pageno, errno);
                      using_config(theme_config, pageDom);

                      if (data.pageno == 2) {
                          load_hongbao(data, max_display_count); //加载代金券
                      }
                  },
                  failFunc: function() {
                      dd.dialog.alert("网络请求失败，请稍后重试");
                      btnOpen.className = "btn-orange";
                  }
              });
          };
          // 手机号格式是否正确
          var is_phone = function(v) {
              if ((/^1[3|4|5|8|7][0-9]\d{8}$/.test(v))) {
                  return true;
              } else {
                  return false;
              }
          };
          // 唤起打开代金券按钮
          var click_arouse = function() {
              var phone_txt = txtPhone.value.trim();
              if (phone_txt.length === 11) {
                  btnOpen.className = "btn-orange";
              } else {
                  btnOpen.className = "btn-gray";
              }
          };

          txtPhone.addEventListener('input', click_arouse, false);
          txtPhone.addEventListener('focus', click_arouse, false);

          base.touch(btnOpen, function() {
              if (btnOpen.className == "btn-gray") return;
              btnOpen.className='btn-gray';
              var phone_txt = txtPhone.value.trim();
              this.blur();
              if (is_phone(phone_txt)) {
                  getPayHBAjax(phone_txt);
              } else {
                  dd.dialog.alert("手机号填写错误~");
              }
          });

      };

      //初始化
      load_page(pageno, errno); //加载页面 气泡文案 

      using_config(theme_config, pageDom); //使用配置页面背景，额外按钮，文案等

      pageno == "2" && load_hongbao(all_hb_info, max_display_count); //配置代金券

      pageno == "1" && apply_openbtn_event(); //打开代金券事件

      apply_link_event(); //绑定链接事件

      apply_download_event(); //绑定下载按钮事件


  });
