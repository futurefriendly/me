define('didi-component-ddplayer/player/controls.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器主控界面业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器主控界面业务
 *
 **/


  'use strict';
  
  //扩展进度条操作
  require('didi-component-ddplayer/player/ctrlProgress.js');
  //扩展播放按钮业务
  require('didi-component-ddplayer/player/ctrlButton.js');
  //扩展全屏业务
  require('didi-component-ddplayer/player/ctrlFullscreen.js');

  var vars = require('didi-component-ddplayer/base/vars.js');

  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  
  /**
   * @class MediaPlayer
   * @classdesc 播放器事件
   * @property {function}  _hideMainCtrl                   - 隐藏主控界面
   * @property {function}  _showMainCtrl                   - 显示主控界面
   * @property {function}  _initMainClick                  - 主控容器点击业务
   * @property {function}  _initControls                   - 控制面板业务
   */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 隐藏主控界面
   * @type {function}
   */
  MediaPlayer.prototype._hideMainCtrl = function () {
    var _this = this;
    clearInterval(this._mainCtrlInterval);
    //ios微信小窗 所以200ms后隐藏buttons
    if (!(vars.IsIphone) || (vars.IsIphone && vars.IsWeiXinBrowser)) {
      this._mainCtrlInterval = setTimeout(function () {
        _this.$title.oriHide();
        _this.$ctrlBar.oriHide();
        _this.$midModeListCon.oriHide();
      }, 200);
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 显示主控界面
   * @type {function}
   */
  MediaPlayer.prototype._showMainCtrl = function () {
    var _this = this;
    clearInterval(this._mainCtrlInterval);

    this._mainCtrlInterval = setTimeout(function () {
      _this.$title.oriShow();
      _this.$ctrlBar.oriShow();
      _this.$midModeListCon.oriShow();
    }, 200);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 主控容器点击业务
   * @type {function}
   */
  MediaPlayer.prototype._initMainClick = function () {
    var _this = this;
    //显示和隐藏主控界面计时器
    this._mainCtrlInterval = null;

    this.$ctrlCon.on(vars.END_EVENT, function () {
      
      if (_this.$midPlay.css('display') === 'block') {
        _this._playOrPause('play');
      }

      if (_this.$ctrlBar.css('display') === 'none') {
        _this._showMainCtrl();

        //清除消失动画计时器
        clearTimeout(_this._hideMainCtrlTime);
        //如果没有任何操作，3秒后主操作界面隐藏
        _this._hideMainCtrlTime = setTimeout(function () {
          _this._hideMainCtrl();
        }, 3000);

      } else {
        _this._hideMainCtrl();
      }
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 控制面板业务
   * @type {function}
   */
  MediaPlayer.prototype._initControls = function () {
    //初始化进度条
    this._initCtrlProgress();
    //播放按钮业务
    this._initCtrlButton();
    //主控容器点击业务
    this._initMainClick();
    //全屏业务
    this._initCtrlFullscreen();
  };

 
});