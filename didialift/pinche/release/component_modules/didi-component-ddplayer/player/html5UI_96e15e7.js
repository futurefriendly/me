define('didi-component-ddplayer/player/html5UI.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于播放器模板管理
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器模板管理
 *
 **/


  'use strict';
  
  var template = ddvp.template;
  var vars = require('didi-component-ddplayer/base/vars.js');
  var special = require('didi-component-ddplayer/base/special.js');
  var settings = require('didi-component-ddplayer/player/settings.js');
  
  /**
   * @module player/template
   * @namespace template
   * @property {function} makeVideoTmpl                    - 生成播放器整体模板
   * @property {function} makeLoadingTmpl                  - 播放器加载完成前的loading
   *
   * @example
   *   var html5UI = require('./html5UI.js');
   *   var html = html5UI.makeVideoTmpl(cache);
   */
  var html5UI = {};

  var tmpl = {
    param: {},
    model: {},
    view: {},
    ctrl: {}
  };

  var p = tmpl.param,
      m = tmpl.model,
      v = tmpl.view,
      c = tmpl.ctrl;

  //数据处理
  m.parseCache = function (cache) {
    var rst = {
      title: cache.title || '',
      poster: cache.poster || '',
      pointList: [{left: 0}],
      mainId: cache.mainId || 'ddvp_main_1',
      height: cache.height || '100%',
      width: cache.width || '100%',
      srcType: cache.srcType || 'mp4',
      elemId: cache.elemId || '',
      autoplay: cache.autoplay || false,
      defControls: cache.defControls || false,
      isInitSrc: false,
      isIphone: vars.IsIphone || false,
      isUCBrowser: vars.IsUCBrowser || false,
      isQQBrowser: vars.IsQQBrowser || false,
      IsWeiXinBrowser: vars.IsWeiXinBrowser || false,
      isIphoneWeixinBrowser: (vars.IsWeiXinBrowser && vars.IsIphone) || false,
      curMode: cache.modeType || '',
      curModeName: settings.PLAY_MODE[cache.modeType],
      selList: []
    };

    //清晰度列表
    $.each(cache.modeTypeList, function (index, item) {
      
      if (item !== rst.curMode) {
        var data = {
          mode: item,
          modeName: settings.PLAY_MODE[item]
        };
        rst.selList.push(data);
      }
    });

    return rst;
  };

  //配置参数处理
  m.parseConfig = function (config) {
    var rst = {
      mainId: config.mainId || 'ddvp_main_1',
      height: config.height || '100%',
      width: config.width || '100%',
    };

    return rst;
  };

  //video标签
  v.videoTag = function () {
              //video标签拼接
    var html = '<div class="video">' +
                 '<% if (srcType === "client") { %>' +
                    '<div data-noSupport="noSupport"' +
                 '<% } else { %>' +
                    '<video' +
                 '<% } %>' +
                 //添加id
                 ' id="<%=elemId%>"' +
                 //autoplay属性
                 '<% if (autoplay) { %> autoplay<% } %>' +
                 //ios微信小窗播放-给video添加webkit-playsinline
                 '<% if (isIphoneWeixinBrowser) { %> webkit-playsinline<% } %>' +
                 //controls属性
                 '<% if (defControls) { %> controls<% } %>' +
                 //设置默认属性
                 ' x-webkit-airplay="isHtml5UseAirPlay"' +
                 //非自动播放时候不进行预加载视频
                 '<% if (autoplay) { %> preload="none"<% }%>' +
                 //src
                 ' src="<%=curPlayUrl%>"' +
                 //height
                 ' height="<%=height%>"' +
                 //width
                 ' width="<%=width%>"' +
                 //style属性
                 '<% if (isIphone && !IsWeiXinBrowser) { %>' +
                   ' style="position:absolute; left:-200%;' +
                 '"<% } else if (!autoplay && isUCBrowser) { %>' +
                   ' style="display: none;"' +
                 '<% } %>' +
                 //音量属性
                 '>' +
               '</div>';

    return html;
  };

  //控制条
  v.ctrl = function () {
    var html = '<div class="player_controls ddvp_ctrl">' +
                 //中间大的播放/暂停按钮
                 '<div class="mid ddvp_mid">' +
                   //中间播放按钮
                   '<span class="mid_play ddvp_mid_play">' +
                     '<b></b>' +
                   '</span>' +
                   //中间快进快退
                   '<span class="mid_rewind_forward rewind ddvp_mid_rewind_forward" style="display:none;">' +
                     '<b class="mid_forward"></b>' +
                     '<b class="mid_rewind"></b>' +
                     '<span class="mid_time ddvp_mid_time">02:04</span>' +
                   '</span>' +
                 '</div>' +
                 //底部控制条部分
                 '<div class="slider_bar ddvp_ctrl_bar">' +
                   //左侧播放按钮
                   '<div class="left_btn_play">' +
                     //左侧播放按钮
                     '<div class="ddvp_ctrl_play">' +
                       '<b class="state_play"></b>' +
                     '</div>' +
                     //左侧暂停按钮
                     '<div class="ddvp_ctrl_pause" style="display:none;">' +
                       '<b class="state_pause"></b>' +
                     '</div>' +
                   '</div>' +
                   //进度条
                   '<div class="action_trackBar ddvp_ctrl_track_bar">' +
                     '<% if (!((isUCBrowser || isQQBrowser) && isIphone)) { %>' +
                       '<div class="trackbar">' +
                         //已缓冲的进度条
                         '<b class="buffered ddvp_ctrl_buffer"></b>' +
                         '<div class="click_area ddvp_ctrl_click_area">' +
                           '<div class="time_points ddvp_ctrl_points">' +
                             //打点
                             '<% for (var i = 0, l = pointList.length; i < l; i++) { %>' +
                               '<em style="left:<%=pointList[i].left%>"></em>' +
                             '<% } %>' +
                           '</div>' +
                         '</div>' +
                         //当前播放的锚点
                         '<b class="played ddvp_ctrl_played_bar">' +
                           //当前进度锚点
                           '<em class="handle ddvp_ctrl_drag_anchor"></em>' +
                         '</b>' +
                       '</div>' +
                     '<% } %>' +
                   '</div>' +
                   '<% if (!((isUCBrowser || isQQBrowser) && isIphone)) { %>' +
                     //视频当前播放时间/总时长区域
                     '<div class="time ddvp_ctrl_time">' +
                       //当前播放时间/总时长
                       '<b class="current_time ddvp_ctrl_cur_time">00:00</b> / ' +
                       '<span class="duration ddvp_ctrl_duration" data-key="totalDuration" data-type="time">00:00</span>' +
                     '</div>' +
                   '<% } %>' +
                   //缩放控制
                   '<div class="controllers ddvp_ctrl_screen">' +
                   //全屏
                   '<div class="fullscreen disabled ddvp_ctrl_full_screen">' +
                     '<span></span>' +
                   '</div>' +
                   //退出全屏
                   '<div class="shrinkscreen disabled ddvp_ctrl_shrink_screen" style="display:none;">' +
                     '<span></span>' +
                   '</div>' +
                 '</div>' +
               '</div>';
    return html;
  };

  //播放清晰度
  v.playMode = function () {
    var html = '<% if (curMode !== "" && selList.length > 0) { %>' +

                  '<div class="quality_button quality_container ddvp_mid_mode' +
                    '<% if (selList.length > 2) { %>' +
                      ' smaller' +
                    '<% } %>' +
                  '">' +
                    '<% if (selList.length > 0) { %>' +
                       '<div class="quality_definition_button ddvp_mid_cur_mode_btn">' +
                         '<span class="ddvp_mid_cur_mode" data-mode="<%=curMode%>"><%=curModeName%></span>' +
                       '</div>' +
                       '<div class="quality_definition_list">' +
                         '<ul class="ddvp_mid_mod_list">' +
                            '<% for (var i = 0, l = selList.length; i < l; i++) { %>' +
                               '<li data-mode="<%=selList[i].mode%>"><span><%=selList[i].modeName%></span></li>' +
                            '<% } %>' +
                         '</ul>' +
                       '</div>' +
                    '<% } %>' +
                 '</div>' +
               '<% } %>';
    return html;
  };

  //整体模板
  v.video = function () {
    var html =  '<div class="player_main ddvp_player_main">' +
                  //video标签
                  v.videoTag() +
                  
                  //标题
                  '<div class="video_title ddvp_title">' +
                    '<strong>' +
                      '<span class="ddvp_title_content title_content"><%=title%></span>' +
                    '</strong>' +
                  '</div>' +

                  //海报
                  '<div class="poster ddvp_poster" style="background-image:url(<%=poster%>);"></div>' +
                  
                  //控制条
                  v.ctrl() +

                  //清晰度选择
                  v.playMode() +

                  //遮罩层
                  '<div class="mask-layer ddvp_mask_layer" style="display: none;"></div>' +
                '</div>';
    return html;
  };

  //loading模板
  v.loading = function () {
    var html = '<div class="player inline_player" id="<%=mainId%>" style="height:<%=height%>; width:<%=width%>">' +
                  '<div class="ddvp_player_loading player_loading"></div>' +
                  '<div class="ddvp_player_loading_notice player_loading_notice">努力加载中,请稍后...</div>' +
               '</div>';

    return html;
  };

  /**
   * @memberof html5UI
   * @summary 生成播放器整体模板
   * @type {function}
   * @param {object} cache                             - 播放器内部数据缓存对象
   * @return {boolean}                                 - 结果
   */
  html5UI.makeVideoTmpl = function (cache) {
    var render = template.compile(v.video());
    var data = m.parseCache(cache);

    return render(data);
  };

  /**
   * @memberof html5UI
   * @summary 播放器加载完成前的loading
   * @type {function}
   * @param {object} cache                             - 播放器内部数据缓存对象
   * @return {boolean}                                 - 结果
   */
  html5UI.makeLoadingTmpl = function (config) {
    var render = template.compile(v.loading());
    var data = m.parseConfig(config);

    return render(data);
  };

  module.exports = html5UI;
 
});