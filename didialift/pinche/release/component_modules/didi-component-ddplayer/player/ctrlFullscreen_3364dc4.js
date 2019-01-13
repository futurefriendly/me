define('didi-component-ddplayer/player/ctrlFullscreen.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器全屏播放业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器全屏播放业务
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');
  var player = require('didi-component-ddplayer/player/mediaPlayer.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器全屏播放业务
   * @property {function}  _initCtrlFullscreen             - (播放器内部使用) 初始化播放器全屏播放业务
   * @property {function}  _isSupportSysFullScreen         - (播放器内部使用) 检测是否支持系统全屏
   * @property {function}  _apiEnterFullScreen             - (播放器内部使用) 进入系统全屏接口
   * @property {function}  _apiExitFullScreen              - (播放器内部使用) 退出系统全屏接口
   * @property {function}  _enterSysFullScreen             - (播放器内部使用) 进入系统全屏
   * @property {function}  _fullOrShrink                   - (播放器内部使用) 进入或退出全屏
   */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 检测是否支持系统全屏 (播放器内部使用)
   * @type {function}
   */
  player.prototype._isSupportSysFullScreen = function () {
    // 不支持全屏的视频
    var isSptFullscreen = false;
    var elem = this.videoTag;
    
    if (elem.requestFullscreen) {
      isSptFullscreen = true;
    
    } else if (elem.mozRequestFullScreen) {
      isSptFullscreen = true;
    
    } else if (elem.webkitRequestFullscreen) {
      isSptFullscreen = true;
    
    } else if (elem.webkitEnterFullscreen) {
      isSptFullscreen = true;
    
    } else if (elem.msRequestFullscreen) {
      isSptFullscreen = true;
    }
    
    if ($(this.videoTag).hasClass('inline_player') && (!$.isEmpty(this.cache.fullscreenType) && this.cache.fullscreenType !== '1')) {
      isSptFullscreen = false;

    }
    
    return isSptFullscreen;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 进入系统全屏接口 (播放器内部使用)
   * @type {function}
   */
  player.prototype._apiEnterFullScreen = function (elem) {
    
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    
    } else if (elem.webkitEnterFullscreen) {
      elem.webkitEnterFullscreen();
    
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 退出系统全屏接口 (播放器内部使用)
   * @type {function}
   */
  player.prototype._apiExitFullScreen = function (elem) {
    
    if (elem.exitFullscreen) {
      elem.exitFullscreen();
    
    } else if (elem.mozCancelFullScreen) {
      elem.mozCancelFullScreen();
    
    } else if (elem.webkitExitFullscreen) {
      elem.webkitExitFullscreen();
    
    } else if (elem.webkitCancelFullScreen) {
      elem.webkitCancelFullScreen();
    
    } else if (elem.msExitFullscreen) {
      elem.msExitFullscreen();
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 进入系统全屏 (播放器内部使用)
   * @type {function}
   */
  player.prototype._enterSysFullScreen = function () {
    var _this = this;
    // 开始播放后才可以全屏
    if (vars.UA.match(/HS\-U950|HUAWEI_C8812|vivo/i) && !vars.IsUCBrowser && !vars.IsQQBrowser) {
      _this.videoTag['play']();
    }
    var fullscreenchange = function () {
      
      if (_this.videoTag.paused && !vars.IsIOS) {
        
        setTimeout(function () {
          _this.videoTag['play']();
        }, 0);
      }
    };

    if (this._isSupportSysFullScreen()) {
      var elem = _this.videoTag;
      document.addEventListener("fullscreenchange", fullscreenchange, false);
      document.addEventListener("mozfullscreenchange", fullscreenchange, false);
      document.addEventListener("webkitfullscreenchange", fullscreenchange, false);
      document.addEventListener("MSFullscreenChange", fullscreenchange, false);
      _this._apiEnterFullScreen(elem);

    }
    
    setTimeout(function () {
      _this.videoTag['play']();
    }, 0);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 退出系统全屏 (播放器内部使用)
   * @type {function}
   */
  player.prototype._exitSysFullScreen = function () {
    var _this = this;
    var elem = _this.videoTag;
    _this._apiExitFullScreen(elem);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 进入/退出全屏 (播放器内部使用)
   * @type {function}
   * @property {string} type  -  全屏缩屏类型(fullScreen/shrinkScreen)
   */
  player.prototype._fullOrShrink = function (type) {
    var _this = this;
    clearTimeout(this._hideMainCtrlTime);
    
    //全屏
    if (type === 'fullScreen') {
      
      if (this.cache.fullscreenType === '1') {
        this._enterSysFullScreen();
      
      } else {
        //如果在iphone、8.1前winphone设备下，点击全屏直接播放
        if ((vars.IsIphone && !vars.IsWeiXinBrowser) || vars.IsOldWindowsPhone ||
            (vars.IsAndroid && vars.IsQQBrowser) || vars.IsBaiduBrowser) {
          this._playOrPause('play');
        
        } else {
          $('html').addClass('position_fullscreen');
          //缓存当前scrollTop
          this._scrollTop = document.body.scrollTop;
          //隐藏全屏按钮
          this.$ctrlFullScreen.oriHide();
          //显示缩小按钮
          this.$ctrlShrinkScreen.oriShow();
        }
  
        $('.finPic').oriHide();
      }
    //缩屏
    } else {
      $('html').removeClass('position_fullscreen');
      //显示全屏按钮
      this.$ctrlFullScreen.oriShow();
      //隐藏缩小按钮
      this.$ctrlShrinkScreen.oriHide();
      //恢复到原来的scrollTop
      document.body.scrollTop = this._scrollTop;

      setTimeout(function () {
        $('.finPic').oriShow();
      }, 500);
    }
    //如果没有任何操作，3秒后主操作界面隐藏
    this._hideMainCtrlTime = setTimeout(function () {
      _this._hideMainCtrl();
    }, 3000);
  };

  //进入全屏、退出全屏按钮事件注册
  var fullScreenBtnService = function (player) {
    
    player.$ctrlFullScreen.on(vars.END_EVENT, function () {
      player._fullOrShrink('fullScreen');
      
      return false;
    });

    player.$ctrlShrinkScreen.on(vars.END_EVENT, function () {
      player._fullOrShrink('shrinkScreen');

      return false;
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化播放器全屏播放业务 (播放器内部使用)
   * @type {function}
   */
  player.prototype._initCtrlFullscreen = function () {
    fullScreenBtnService(this);
  };
 
});