define('didi-component-ddplayer/player/exception.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于播放器出错处理
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器出错处理
 *
 */

  'use strict';

  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var util = require('didi-component-ddplayer/base/util.js');

  /**
  * @class MediaPlayer
  * @classdesc 播放器出错处理业务
  * @property {function}  _initException                  - (播放器内部使用) 初始化播放器错误处理业务
  * @property {function}  _sendException                  - (播放器内部使用) 发送播放出错统计
  */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 发送播放出错统计 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._sendException = function (option) {
    console.log('play error');
  };

  //播放出错处理
  var errorProcess = function (player) {

    // //屏蔽pc模拟手机ua时，不支持m3u8格式的错误
    // if (/Win32|Win64|Windows|Mac68K|MacPC|Macintosh|MacIntel/i.test(window.navigator.platform)) {

    //   return false;
    // }

    //2g3g出问题时不做处理
    if (/2g|3g/i.test(util.getConnectionType())) {

      return false;
    }

    var cache = player.cache;

    player._sendException({});
    //如果是m3u8视频源，直接播放下一视频
    if (vars.IsIOS) {
      player.trigger('ended');
    //如果是mp4,播放下一个分片
    } else if (vars.IsAndroid) {
      //播放下一条片源
      if (cache.curIndex < cache.totCounts) {
        //暂停当前片源
        player.pause();
        //显示loading图
        player._showLoading();
        //修改当前播放的url
        player.cache.curPlayUrl = player.cache.getNextUrl();
        //修改地址
        player.setSrc(player.cache.curPlayUrl);
        //修改播放索引
        cache.curIndex++;
        //播放
        player.play();
      //最后一条分片
      } else {
        player.trigger('ended');
      }
    }
  };

  //播放器报错
  var onError = function (player) {
    //播放出错
    player._addEvent('error', function () {
      errorProcess(player);
    });
  };

  //播放器出错中断
  var onAbort = function (player) {

    // player.on('abort', function () {
      
    //   // if (player.videoTag.error)
    // });
  };

  /**
  * @memberof MediaPlayer.prototype
  * @summary 初始化播放器错误处理业务 (播放器内部使用)
  * @type {function}
  */
  MediaPlayer.prototype._initException = function () {
    //播放器报错处理
    onError(this);
    //播放器中断
    onAbort(this);
  };
 
});