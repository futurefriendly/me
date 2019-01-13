define('didi-component-ddplayer/player/didiPlayer.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义整体播放器
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 整体播放器
 *                 
 *
 **/


  'use strict';

  //播放器事件
  require('didi-component-ddplayer/player/events.js');
  //播放器主控界面
  require('didi-component-ddplayer/player/controls.js');
  //播放器更新
  require('didi-component-ddplayer/player/update.js');
  //播放器更新
  require('didi-component-ddplayer/player/poster.js');
  //信息提示
  require('didi-component-ddplayer/player/message.js');
  //多视频数据处理业务
  require('didi-component-ddplayer/player/videoList.js');
  //播放器出错处理
  require('didi-component-ddplayer/player/exception.js');

  var vars = require('didi-component-ddplayer/base/vars.js');
  var Console = require('didi-component-ddplayer/base/console.js');
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var html5UI = require('didi-component-ddplayer/player/html5UI.js');
  var settings = require('didi-component-ddplayer/player/settings.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化方法
   * @type {function}
   * @param {object}   config                              - 播放器配置参数
   */
  MediaPlayer.prototype._init = function (config) {
    //隐藏主控界面计时器
    this._hideMainCtrlTime = null;
    //第一次加载
    this._firstLoadFlag = true;
    //数据请求超时时间
    this._dataTimeout = 5000;
    //是否需要限制相关推荐标志位
    this._showRecommendFlag = false;
    //是否发送vv标志位
    this._sendVVFlag = false;
    //合并配置参数
    this.config = settings.initConfig(config);
    //发送play_display_complete标志位
    this._sendPlayDisplayCompleteFlag = false;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 添加播放器
   * @type {function}
   * @param {object}   dom                                 - 要添加播放器的dom节点
   */
  MediaPlayer.prototype.htmlTo = function (dom) {
    dom = $(dom);

    if (dom.length > 0) {
      var _this = this;
      //缓存容器dom
      this.$parentDom = dom;
      //首次添加
      if ($.isUndefined(this.$player)) {
        ddvp.debug.playerLoadDomStartTime = Date.now();
        //添加背景loading图
        dom.html(html5UI.makeLoadingTmpl(this.config));
        Console.log('加载loading完成, 耗时--->' + (Date.now() - ddvp.debug.playerLoadDomStartTime) / 1000);
        //缓存player对象
        this.$player = $('#' + this.config.mainId);
        //缓存loading图对象
        this.$playerLoading = $('#' + this.config.mainId + ' .ddvp_player_loading');
        //重置标志位
        this._getDataFlag = false;

        var data = this.config.data;

        if (!$.isUndefined(data)) {
          //单视频处理,将单视频加工为一个只有videoData的数组
          if ($.isUndefined(data.vidList) && $.isUndefined(data.videoDataList)) {
            var tempData = {
              videoDataList: [data]
            };
            this.videoList = this._videoList(tempData);
            //更新视频
            this.updateMedia(data);
          //视频列表数据处理
          } else {
            var videoList = this.videoList = this._videoList(data);
            var curData;

            try {
              //vidList处理
              if (videoList.type === 'vidList') {
                curData = {
                  vid: videoList.vidList[videoList.curIndex],
                  site: videoList.site
                };
              //videoDataList处理
              } else {
                curData = videoList.videoDataList[videoList.curIndex];
              }

            } catch (e) {
              //数据错误

              _this._showMsg({text: errorTypes['PROCESS']['204']});
            }
            this.updateMedia(curData);
          }
          
        //数据无效
        } else {

          _this._showMsg({text: errorTypes['PROCESS']['202']});
        }
        
      //如果页面已经存在播放器，则移动播放器到指定dom中
      } else {
        this.$parentDom.html(this.$main);

        if (this.cache.autoplay) {
          this._playOrPause('play');
        }
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化dom节点
   * @type {function}
   */
  MediaPlayer.prototype._initDoms = function () {
    var mainId = '#' + this.config.mainId;
    //外围容器节点
    this.$main = $(mainId);
    //loading图
    this.$loading = $(mainId + ' .ddvp_player_loading');
    //loading说明
    this.$loadingDesc = $(mainId + ' .ddvp_player_loading_notice');
    //video标签$对象
    this.$video = $(mainId + ' #' + this.config.elemId);
    //video标签
    this.videoTag = $(mainId + ' #' + this.config.elemId)[0];
    //顶部通栏title标题容器节点
    this.$titleCon = $(mainId + ' .ddvp_title');
    //通栏标题内容节点
    this.$title = $(mainId + ' .ddvp_title_content');
    //海报容器
    this.$posterCon = $(mainId + ' .ddvp_poster');
    //右海报图
    this.$posterRight = $(mainId + ' .ddvp_poster_right');
    //中间播放按钮容器
    this.$mid = $(mainId + ' .ddvp_mid');
    //中间播放按钮
    this.$midPlay = $(mainId + ' .ddvp_mid_play');
    //中间快进快退容器
    this.$midRewindForwardCon = $(mainId + ' .ddvp_mid_rewind_forward');
    //中间快进快退时间
    this.$midTime = $(mainId + ' .ddvp_mid_time');
    //中间靠右测播放模式选择容器
    this.$midModeListCon = $(mainId + ' .ddvp_mid_mode');
    //当前选中播放类型按钮
    this.$mideCurModeBtn = $(mainId + ' .ddvp_mid_cur_mode_btn');
    //当前选中的播放模型
    this.$midCurMode = $(mainId + ' .ddvp_mid_cur_mode');
    //除了当前选中模式之外的所有可选模式列表
    this.$midModeList = $(mainId + ' .ddvp_mid_mod_list');
    //除了当前选中模式之外的所有可选模式列表
    this.$midModeLi = $(mainId + ' .ddvp_mid_mod_list li');
    //控制界面容器
    this.$ctrlCon = $(mainId + ' .ddvp_ctrl');
    //视频控制条
    this.$ctrlBar = $(mainId + ' .ddvp_ctrl_bar');
    //视频控制条-播放按钮
    this.$ctrlPlay = $(mainId + ' .ddvp_ctrl_play');
    //视频控制条-暂停按钮
    this.$ctrlPause = $(mainId + ' .ddvp_ctrl_pause');
    //视频控制条-缓冲进度
    this.$ctrlBuffer = $(mainId + ' .ddvp_ctrl_buffer');
    //视频控制条-打点容器
    this.$ctrlPointsCon = $(mainId + ' .ddvp_ctrl_points');
    //视频控制条-当前播放进度条
    this.$ctrlCurPlayedBar = $(mainId + ' .ddvp_ctrl_played_bar');
    //视频控制条-时间显示区域
    this.$ctrlTime = $(mainId + ' .ddvp_ctrl_time');
    //视频控制条-当前播放时间显示
    this.$ctrlCurTime = $(mainId + ' .ddvp_ctrl_cur_time');
    //视频控制条-总时长显示
    this.$ctrlDuration = $(mainId + ' .ddvp_ctrl_duration');
    //拖拽锚点
    this.$ctrlDragAnchor = $(mainId + ' .ddvp_ctrl_drag_anchor');
    //整体进度条
    this.$ctrlTrackBar = $(mainId + ' .ddvp_ctrl_track_bar');
    //全屏缩屏容器
    this.$ctrlScreen = $(mainId + ' .ddvp_ctrl_screen');
    //全屏
    this.$ctrlFullScreen = $(mainId + ' .ddvp_ctrl_full_screen');
    //缩屏
    this.$ctrlShrinkScreen = $(mainId + ' .ddvp_ctrl_shrink_screen');
    //遮罩层
    this.$maskLayer = $(mainId + ' .ddvp_mask_layer');
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 播放/暂停按钮点击事件
   * @type {function}
   * @param {object}   type                                - 操作类型play/pause
   */
  MediaPlayer.prototype._playOrPause = function (type) {
    var _this = this;
    ddvp.debug.playerPlayStartTime = Date.now();
    //清除消失动画计时器
    clearTimeout(this._hideMainCtrlTime);
    //显示主界面
    if (type === 'pause') {
      //暂停
      this._pause();

      if (vars.IsNewWindowsPhone) {
        //8.1之后的winphone需要延迟显示，否徐需要点击2次暂停按钮才能显示playbtn
        setTimeout(function () {
          //显示播放按钮
          _this._showPlayBtn();
        }, 300);
        
      } else {
        //显示播放按钮
        this._showPlayBtn();
      }
      //显示标题、控制条
      this._showMainCtrl();

    } else {
 
      //如果是baidu、iosQQ、iosUC点击播放直接发送统计vv，这几类播放器timeupdate无法正常触发timeupdate事件
      if (!this._sendVVFlag && (vars.IsBaiduBrowser || vars.IsBaiduBoxApp || (vars.IsIOS && (vars.IsQQBrowser || vars.IsUCBrowser)))) {
        //加载播放器完成发送统计vv
        Console.log('统计: vv');
        this._sendVVFlag = true;
      }

      //ios 的qq uc浏览器无法捕获事件，这里直接发送realvv
      if (!this._sendRealVVFlag && ((/QQBrowser\/5\./i.test(vars.UA) || vars.IsUCBrowser) && vars.IsIOS || ($.isUndefined(this.adv) || this.adv.isMediaPlayed) && vars.IsBaiduBoxApp)) {
        Console.log('统计: reallvv');
        this._sendRealVVFlag = true;
      }

      if (vars.IsUCBrowser || vars.IsQQBrowser) {
        this.$video.oriShow();
      }
      //播放
      if ((/UCBrowser\/9\./i.test(vars.UA) || vars.IsSonyPhone || vars.IsVivoPhone || vars.IsUCBrowser) && vars.IsAndroid) {
        
        setTimeout(function () {
          _this._play();
        }, 50);
      //window phone需要延迟300毫秒以上才能拉起播放器
      } else if (vars.IsWindowsPhone) {

        setTimeout(function () {
          _this._play();
        }, 300);
        //ios qq切换视频不能自动播放，增加延迟播放
      } else if (!this._firstLoadFlag && vars.IsIOS && vars.IsQQBrowser){
        
        setTimeout(function(){
          _this._play();
        },50);
        
      } else {
        this._play();
      }

      //记录播放时间戳
      this._startPlayTime = $.now();

      //如果没有任何操作，3秒后主操作界面隐藏
      this._hideMainCtrlTime = setTimeout(function () {
        _this._hideMainCtrl();
      }, 3000);

      //第一次加载时候不显示loading图
      if (this._firstLoadFlag) {

        if (!vars.IsIphone && !vars.IsBaiduBrowser && this.cache.autoplay) {
          this.$midPlay.oriShow();
          this._showPlayBtn();
          this.showPoster();
          // this.$ctrlBar.oriHide();
          // this.$midModeListCon.oriHide();
          // this.$titleCon.oriHide();
        }
        
        //显示loading图
        this._showLoading();
        //修改标志位
        this._firstLoadFlag = false;
      } else {
        //百度浏览器不支持timeupdate事件,所以showloading后无法消失
        if (vars.IsBaiduBrowser) {
          //隐藏loading图
          this._hideLoading();
        } else {
          //显示loading图
          this._showLoading();
        }
      }
      
      if (vars.IsOldWindowsPhone || vars.IsBaiduBrowser) {
        // this._showMidPlayBtn();
      }

      if (vars.IsIphone && (vars.IsUCBrowser || vars.IsQQBrowser || vars.IsWeiXinBrowser || vars.IsDiDiBrowser)) {
        this._showMainCtrl();
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 自动播放下一个片源
   * @type {function}
   * @param {object}   type                                - 操作类型play/pause
   */
  MediaPlayer.prototype._autoNextVideoService = function () {
    var _this = this;

    if (_this.config.isShowRecommend) {
      _this._showRecommendFlag = true;
      //继续播放下一个片源
      this.on('ended', function () {

        setTimeout(function () {

          if (_this._showRecommendFlag) {
            Console.log('显示相关推荐')
            var videoList = _this.videoList;
            var curIndex = videoList.curIndex;
            var nextVideo = null;
            //获取下一个需要播放的视频源
            if (videoList.type === 'vidList' && curIndex < videoList.vidList.length - 1) {
              videoList.curIndex++;

              nextVideo = {
                vid: videoList.vidList[videoList.curIndex],
                site: videoList.site
              };

            } else if (videoList.type === 'videoDataList' && curIndex < videoList.videoDataList.length - 1) {
              videoList.curIndex++;
              nextVideo = videoList.videoDataList[videoList.curIndex];
            }
            Console.log('nextVideo' + nextVideo);
            //播放下一条视频
            if (nextVideo !== null) {
              _this.updateMedia(nextVideo, true);
            //显示推荐列表
            } else {
              Console.log('showRecommend 11');
              _this.showRecommend();
            }
          }
        }, 800);
      });
    }
  };
  module.exports = MediaPlayer;
 
});