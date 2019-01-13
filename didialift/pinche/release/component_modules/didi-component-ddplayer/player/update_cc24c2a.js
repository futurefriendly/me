define('didi-component-ddplayer/player/update.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器视频更新业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器视频更新业务
 *                 
 *
 **/


  'use strict';
  
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var LoadCacheData = require('didi-component-ddplayer/player/loadCacheData.js');
  var special = require('didi-component-ddplayer/base/special.js');
  var html5UI = require('didi-component-ddplayer/player/html5UI.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');
  var Console = require('didi-component-ddplayer/base/console.js');
  var settings = require('didi-component-ddplayer/player/settings.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器进度条业务
   * @property {function}  update                          - 更新播放器视频
   */

  //获取数据类型
  var getDataType = function (data) {
    //初始化为错误类型
    var rst = 'error';

    if (!$.isUndefined(data) && data !== null) {
      //完整数据类型
      if (!$.isUndefined(data.urls) && !$.isUndefined(data.durations)) {
        //数据校验,校验每个分片是否有对应的时长
        try {
          var playType = (vars.IsIphone || vars.IsQQBrowser) ? 'm3u8' : 'mp4';
          //滴滴暂时都使用mp4
          playType = special.isDiDiForceUseMp4() ? 'mp4' : playType;

          //默认为完整数据类型(无需走接口，直接就可以使用)
          rst = 'whole';

          for (var i in data.urls[playType]) {
            //数据有问题(字段不全，需要走接口获取完整数据)
            if (data.durations[i].length !== data.urls[playType][i].length) {
              rst = 'partial';
            }
          }
        
        } catch (e) {
          //数据有问题(字段不全，需要走接口获取完整数据)
          rst = 'partial';
        }
        
      //部分数据类型(字段不全，需要走接口获取完整数据)
      } else if (!$.isUndefined(data.vid) || !$.isUndefined(data.liveId)) {
        rst = 'partial';
      //原始数据(无需走接口，直接播放源地址)
      } else if (!$.isUndefined(data.src)) {
        rst = 'source';
      }
    }

    return rst;
  };

  //更新界面信息
  var updateUIInfo = function (player) {
    var cache = player.cache;

    if (!$.isUndefined(player.adv) && $.isFunction(player.adv.hideMediaView)) {
      player.adv.hideMediaView();
    }
    //标题
    player.$title.html(cache.title);
    //修改页面标题
    document.title = cache.title;
    //更新时间轴
    player.$ctrlCurTime.html($.formatSeconds(0));
    player.$ctrlDuration.html($.formatSeconds(cache.duration));
    player.$ctrlCurPlayedBar.css({width: 0});
    //更换海报
    player.changePoster({url: cache.poster});
  };

  //更新播放器对象信息
  var updatePlayerInfo = function (player, videoData) {
    player.trigger('loadedvideodata');
    //覆盖全局变量
    if (player.videoList.type === 'videoDataList') {
      var curVideoData = player.videoList.videoDataList[player.videoList.curIndex];
      videoData.timeLimit = curVideoData.timeLimit || '0';
    }
    window.videoData = videoData;

    //添加播放器内部数据对象
    player.cache = new LoadCacheData(player.config, videoData);

    //添加播放器数据对象
    player.videoData = $.extend({}, videoData);
    
    //如果第一次加载，添加dom节点，事件初始化
    if (player._firstLoadFlag) {
      //添加播放器模板
      player.$player.append(html5UI.makeVideoTmpl(player.cache));
      Console.log('加载dom完成, 耗时--->' + (Date.now() - ddvp.debug.playerLoadDomStartTime) / 1000);
      //初始化dom节点
      player._initDoms();
      //浏览器不支持播放
      if (player.$video.attr('data-nosupport') === 'noSupport') {
        var noteInfo = errorTypes['SUPPORT']['300'];

        player._showMsg({
          text: noteInfo,
          btns: {
            btnA: {
              text: '暂时无法播放'
            }
          }
        });

        return;
      }
      //修改dom加载完成标志位
      player._loadedDomFlag = true;
      //初始化事件
      player._initEvent();
      //初始化控制界面
      player._initControls();
      //初始化出错处理
      player._initException();
      //启动自动播放下一个视频的业务
      player._autoNextVideoService();
      //隐藏努力加载中的文字
      player.$loadingDesc.oriHide();

      if (player.$video.length > 0) {
        //声音设置
        player.videoTag.volume = player.config.volume;
        player.$ctrlDuration.html($.formatSeconds(player.cache.duration));
      }

    //更新界面信息
    } else {
      updateUIInfo(player);
    }
    
    //修改视频源
    player.setSrc(player.cache.curPlayUrl);
    //更新player对象duration属性
    player.duration = player.cache.duration;
    //给重置currentTime属性
    player.currentTime = 0;
    //隐藏加载中
    player._hideLoading();

    if (player.cache.autoplay) {
      //显示中间播放按钮
      //player._showMidPlayBtn();
      //隐藏中间播放按钮
      player.$midPlay.oriHide();
      //播放器加载就发送vv统计
      if (!player._sendVVFlag) {
        //加载播放器完成发送统计vv
        Console.log('统计: vv');
        player._sendVVFlag = true;
      }
      player._playOrPause('play');

    } else {
      player._playOrPause('pause');
      //隐藏主控界面
      player._hideMainCtrl();
      //显示中间播放按钮
      player._showMidPlayBtn();
      //显示海报
      player.showPoster();
      //如果UC,QQ切换片源时，先隐藏video标签，这样才能显示海报
      if (vars.IsUCBrowser || (vars.IsQQBrowser && !/QQBrowser\/4\.2/i.test(vars.UA))) {
        player.$video.oriHide();
      }
    }

    if (player._firstLoadFlag) {
      //全屏处理
      // if (!$.isUndefined(Action.URLGlobalParams.player)) {
      //   player._fullOrShrink('fullScreen');
      //   player._playOrPause('play');
      // }
    }
    Console.log('播放器加载时间:' + (Date.now() - ddvp.debug.playerLoadStartTime) / 1000 + '秒');

    if (!player._sendPlayDisplayCompleteFlag) {
      Console.log('发送行为统计点:(play_display_complete)');
      //发送行为统计点(数据加载完成)
      player._sendPlayDisplayCompleteFlag = true;
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 播放器视频切换
   * @type {function}
   * @param {object}   data                                - 数据对象
   */
  MediaPlayer.prototype.updateMedia = function (data, isAutoplay) {
    var _this = this;

    if (!$.isUndefined(data)) {
      //获取数据类型
      var dataType = getDataType(data);
      //部分和整体数据类型
      if (dataType !== 'error') {

        if (_this.videoData !== null) {
          //隐藏相关推荐内容
          _this.hideRecommend();

          if (_this.config.isShowRecommend) {
            
            if (dataType === 'source' && _this.videoData.video_src.indexOf(data.src) > -1) {
              //修改显示相关推荐标志位
              _this._showRecommendFlag = true;

              return;
            }
          }
        }
        
        //修改显示相关推荐标志位
        _this._showRecommendFlag = false;

        if (!_this._firstLoadFlag) {
          //更新播放器加载时间
          ddvp.debug.playerLoadStartTime = Date.now();
          //在iosqq浏览器中，无法捕获ended事件，这里在联播时候法从end统计
          // if (this._sendRealVVFlag && !this._sendEndFlag && (/QQBrowser\/5\./i.test(vars.UA) || vars.IsUCBrowser) && vars.IsIphone) {
          //更新视频时，如果没发ended统计，则补发
          if (this._sendRealVVFlag && !this._sendEndFlag) {
            Console.log('统计: ended');
            this._sendEndFlag = true;
          }
          //用vid切换视频源的时候强制转换成video_data类型(采用通过查vid来查找详细信息的方式)
          if (!$.isUndefined(this.videoData)) {
            
            this.config.data = this.videoData;
            this.config.dataType = 'video_data';
          }
          //重置标志位
          this._sendVVFlag = false;
          this._sendRealVVFlag = false;
          this._sendStartFlag = false;
          this._sendEndFlag = false;
          this._playByHistoryFlag = false;
          this._timeoutFlag = false;

          //如果没有配置参数
          if ($.isUndefined(this.config)) {
            //获取默认配置参数
            this.config = settings.initConfig({});
          }
          //重置数据
          data = $.extend({}, data);
          //更新自动播放
          if (typeof isAutoplay !== 'undefined') {
            this.config.autoplay = isAutoplay;
          }
          //暂停
          this._playOrPause('pause');

          if (!vars.IsBaiduBrowser) {
            //显示加载中
            this._showLoading();
          }
        }

        //需要从接口获取详细数据
        if (dataType === 'partial' || dataType === 'source') {
          this._getDataFlag = false;

          //超时
          setTimeout(function () {

            if (!_this._getDataFlag) {
              _this._timeoutFlag = true;
              _this._showMsg({
                text: errorTypes['REQUEST']['400'], //网络超时，请刷新重试
                btns: {
                  btnA: {
                    text: '刷新',
                    callback: function () {
                      _this._timeoutFlag = false;
                      _this._hideMsg();
                      _this.updateMedia(data, isAutoplay);
                    }
                  }
                }
              });
            }
          }, this._dataTimeout);
          ddvp.debug.playerLoadMediaDataStartTime = Date.now();

        //已经是完整数据，直接使用
        } else {

          updatePlayerInfo(_this, data);
        }
      //无效数据
      } else {
        _this._showMsg({text: errorTypes['PROCESS']['202']});
      }
    }
  };
 
});