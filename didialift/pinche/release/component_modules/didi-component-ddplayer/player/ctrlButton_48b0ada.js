define('didi-component-ddplayer/player/ctrlButton.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器banner-按钮业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器banner-按钮业务
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器按钮条业务
   * @property {function}  _initCtrlButton                 - (播放器内部使用) 初始化播放器按钮业务
   * @property {function}  _showPlayBtn                    - (播放器内部使用) 显示播放按钮
   * @property {function}  _showMidPlayBtn                 - (播放器内部使用) 显示中间播放按钮
   * @property {function}  _showPauseBtn                   - (播放器内部使用) 显示暂停按钮
   * @property {function}  _showLoading                    - (播放器内部使用) 显示loading图
   * @property {function}  _hideLoading                    - (播放器内部使用) 隐藏loading图
   */
  
  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示播放按钮 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showPlayBtn = function () {
    this.$ctrlPlay.oriShow();
    this.$ctrlPause.oriHide();
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示中间播放按钮 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showMidPlayBtn = function () {
    this._hideLoading();
    this._hideMainCtrl();
    this.$ctrlBar.oriHide();
    this.$midModeListCon.oriHide();
    this.$mid.oriShow();
    this.$midPlay.oriShow();
    this.$title.oriHide();
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示暂停按钮 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showPauseBtn = function () {
    this.$ctrlPlay.oriHide();
    this.$ctrlPause.oriShow();
    // alert(1);
    return;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示loading (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._showLoading = function () {
    //ios下的uc和qq不做loading处理
    if (!(vars.IsIOS && (vars.IsQQBrowser || vars.IsUCBrowser))) {

      if (!vars.IsBaiduBrowser) {
        this.$midPlay.oriHide();
      }
      this.$loading.oriShow();
      this.$mid.oriHide();
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示loading (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._hideLoading = function () {
    
    if (!vars.IsBaiduBrowser) {
      this.$midPlay.oriHide();
    }
    this.$loading.oriHide();
  };

  //中间播放按钮业务
  var midPlayBtnService = function (player) {

    player.$midPlay.on(vars.END_EVENT, function () {
      $(this).oriHide();
      player._playOrPause('play');

      return false;
    });
  };

  //左下角播放、暂停按钮
  var playOrPauseBtnService = function (player) {
    //播放
    player.$ctrlPlay.on(vars.END_EVENT, function () {
      player._playOrPause('play');

      return false;
    });

    //暂停
    player.$ctrlPause.on(vars.END_EVENT, function () {
      player._playOrPause('pause');

      return false;
    });

    player._addEvent('pause', function () {
      //隐藏loading
      player._hideLoading();
      //显示播放按钮
      player._showPlayBtn();
      //显示标题、控制条
      player._showMainCtrl();
    });

    if (!vars.IsIphone || (vars.IsIphone && vars.IsWeiXinBrowser)) {
      player._addEvent('play', player._showPauseBtn);
      player._addEvent('playing', player._showPauseBtn);
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化播放器按钮业务 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._initCtrlButton = function () {
    //中间播放按钮业务
    midPlayBtnService(this);
    //左下角播放、暂停按钮
    playOrPauseBtnService(this);
  };
 
});