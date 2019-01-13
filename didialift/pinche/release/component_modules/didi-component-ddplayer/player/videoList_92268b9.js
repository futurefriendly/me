define('didi-component-ddplayer/player/videoList.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于视频列表数据处理业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 视频列表数据处理业务
 *
 **/


  'use strict';
  
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器事件
   * @property {function}  _videoList                      - 视频列表数据处理
   */

  /**
   * @memberof MediaPlayer.prototype
   * @summary 处理多视频业务
   * @type {function}
   * @param {object}   data                                - config.data数据对象
   */
  MediaPlayer.prototype._videoList = function (data) {

    if (!$.isUndefined(data)) {
      var videoList = {};
      //初始化vidList数据
      if (!$.isUndefined(data.vidList) && $.isArray(data.vidList)) {
        videoList.vidList = data.vidList;
        videoList.site = data.site || '1';
        videoList.curIndex = 0;
        videoList.type = 'vidList';
      //初始化vidList数据
      } else if (!$.isUndefined(data.videoDataList) && $.isArray(data.videoDataList)) {
        videoList.videoDataList = data.videoDataList;
        videoList.curIndex = 0;
        videoList.type = 'videoDataList';
      }
      return videoList;
    //无效数据
    } else {
      this._showMsg({text: errorTypes['PROCESS']['202']});

      return false;
    }
  };
 
});