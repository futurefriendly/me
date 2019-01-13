define('didi-component-ddplayer/player/settings.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器配置参数
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 定义播放器配置参数
 *                 
 *
 **/


  'use strict';
  
  var special = require('didi-component-ddplayer/base/special.js');
  /**
   * @module base.settings
   * @namespace settings
   * @property {object}   PLAY_MODE                     - 播放类型
   * @property {function} initConfig                    - 将配置参数和默认参数合并
   *
   * @example
   *   var settings = require('./settings.js');
   *   var config = settings.initConfig(config);
   */
  var settings = {};

  /**
   * @memberof settings
   * @summary 播放类型
   * @type {object}
   */
  settings.PLAY_MODE = {nor: '流畅', hig: '高清', sup: '超清', ori: '原画'};

  //默认配置参数
  var DEFAULT_CONFIG = {
    //视频数据
    data: null,
    //外围容器id
    mainId: '',
    //video标签id
    playerId: '',
    //宽
    width: '100%',
    //高
    height: '100%',
    //父级容器的宽
    pWidth: '',
    //父级容器的高
    pHeight: '',
    //音量
    volume: 1,
    //video标签id, 默认是ddvideo_video_player
    elemId: 'ddvideo_video_player_' + Date.now(),
    //数据类型vid_list:vid的聚集列表; video_data: 页面videoData; play_source:带有src的播放源数据对象;  unknown
    dataType: '',
    //是否自动播放
    autoplay: true,
    //是否使用默认控制条
    defControls: false,
    //是否循环播放
    loop: false,
    //当前视频是否预加载
    preload: false,
    //片源类型 nor:流畅, hig:高清, sup:超清
    modeType: 'nor',
    //海报图片类型 horizon: 横图, vertical: 竖图
    posterType: 'horizon',
    //调试环境
    debug: false,
    //是否真全屏. 默认0：假全屏；1：系统默认全屏
    fullscreenType: 1,
    //是否记录播放记录, false: 不记录, true: 记录, 默认flase
    isRemHistory: false
  };

  /**
   * @memberof settings
   * @summary 将配置参数和默认参数合并
   * @type {function}
   * @param {object} config                             - 播放器配置参数
   * @return {object}                                   - 合并后的配置参数
   */
  settings.initConfig = function (config) {
    var rst = $.extend({}, DEFAULT_CONFIG, config);
    //克隆一个数据对象，以免在后面修改数据时会对源数据一起修改
    if (rst.data !== null) {
      rst.data = $.extend({}, rst.data);
    }
    
    if (rst.mainId === '') {
      
      if ($.isUndefined(ddvp.mainId)) {
        ddvp.mainId = 1;
      }
      rst.mainId = 'ddvp_main_' + ddvp.mainId;
      ddvp.mainId++;
    }

    //合并
    return rst;
  };

  module.exports = settings;
 
});