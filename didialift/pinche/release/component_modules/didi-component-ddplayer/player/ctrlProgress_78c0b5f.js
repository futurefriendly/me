define('didi-component-ddplayer/player/ctrlProgress.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器banner-进度条业务
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器banner-进度条业务
 *                 
 *
 **/



  'use strict';
  
  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var playHistory = require('didi-component-ddplayer/player/playHistory.js');
  var Console = require('didi-component-ddplayer/base/console.js');
  var errorTypes = require('didi-component-ddplayer/player/errorTypes.js');
  /**
   * @class MediaPlayer
   * @classdesc 播放器进度条业务
   * @property {function}  _initCtrlProgress               - (播放器内部使用) 初始化进度条业务
   */
  
  //获取当前播放时间
  var getCurrentTime = function (player) {
    var cache = player.cache;
    var childDurList = cache.srcList[cache.modeType] || [];
    //多个子片
    if (childDurList.length > 1) {
      var curTime = player.videoTag.currentTime;
      var curIndex = cache.curIndex;
      //加上之前已经播放完成的分片时间
      $.each(childDurList, function (index, item) {

        if (index < curIndex) {
          curTime += item.duration || 0;
        
        } else {

          return false;
        }
      });

      return curTime;
    //直接返回当前视频播放时间
    } else {

      return player.videoTag.currentTime;
    }
  };

  //设置历史记录
  var setHistory = function (player) {
    var videoData = player.videoData,
        cache = player.cache;

    if (player.currentTime !== 0) {
      
      //生成播放记录
      if (!player._makeHistoryFlag) {
        var rec = {
          playTime: player.currentTime,
          duration: videoData.totalDuration,
          title: videoData.tvname || ''
        };
        playHistory.setHistory(rec);
        player._makeHistoryFlag = true;
        
        setTimeout(function () {
          player._makeHistoryFlag = false;
        }, 1000);
      }
    }
  };

  //断点续播
  var continuePlay = function (player) {
    var videoData = player.videoData;

    if (player.cache.isRemHistory) {
      var vData = {
        vid: videoData.vid,
        site: videoData.site
      };
      //获取历史记录
      var historyList = playHistory.getHistory(vData),
          history = null;

      if (historyList.length > 0) {
        history = historyList[0];
        //按照播放记录中的数据继续播放
        Console.log('prgress:', history.playTime);
        player.seekTo(history.playTime);
      }
      player._playByHistoryFlag = true;
      
    }
  };

  //绑定时间更新事件
  var timeupdateService = function (player) {
    //添加updatetime事件
    player._addEvent('timeupdate', function () {

      //发送统计vv
      if (!player._sendVVFlag) {
        player._sendVVFlag = true;
      }

      if (!ddvp.debug.isShowPlayerPlayStartTime && player.currentTime > 0) {
        Console.log('视频加载时间:' + (Date.now() - ddvp.debug.playerPlayStartTime) / 1000 + '秒');
        ddvp.debug.isShowPlayerPlayStartTime = true;
      }
      var cache = player.cache;
      //如果videoData中总时长为''，则从视频中获取总时长
      if (player.videoData.totalDuration === '' && player.videoTag.duration) {
        cache.duration = player.videoData.duration = player.videoData.totalDuration = player.videoTag.duration;
      }

      //给player对象设置duration属性
      var duration = player.duration = cache.duration;
      //给player对象设置currentTime属性
      var currentTime = player.currentTime = getCurrentTime(player);
      if (currentTime > 0) {
        //隐藏海报
        if (!vars.IsIphone || (vars.IsIphone && vars.IsWeiXinBrowser)) {
          player.hidePoster();
        }

        //隐藏loading
        player._hideLoading();

        if (currentTime > 1) {
          //第一次播放成功发送realvv
          if (!player._sendRealVVFlag) {
            
            player._sendRealVVFlag = true;
          }
          //播放记录
          if (cache.isRemHistory) {
            //断点续播
            if (!player._playByHistoryFlag) {
              continuePlay(player);
            }
            //播放记录操作
            setHistory(player);
          }

          //如果两次timeupdate之间的时间间隔大于2秒，认为用户拖动了视频
          if (currentTime > 0 && Math.abs(currentTime - player._lastCurTime) > 2) {
            player._startPlayTime = $.now();
          }

          //如果是iphone或者8.1之前的winphone，隐藏播放模式选择列表
          if (vars.IsIphone || vars.IsOldWindowsPhone) {
            player.$midModeList.oriHide();
          }
          //更新播放时长
          player._lastCurTime = currentTime;

          //如果离播放事件还剩15秒之内，发送完成统计数据
          if (!player._sendEndFlag && currentTime > duration - 15) {
            player._sendEndFlag = true;
          }

          //2分钟发送心跳统计
          if (player._traceHeartInterval === null) {
            
            player._traceHeartInterval = setInterval(function () {
              // Console.log('');
            }, 1000 * 60 * 2);
          }

          //变更标志位
          player._changeModeFlag = false;
          //更新拖拽状态
          player._dragRangeFlag = false;
          //更新首次加载请求标志位
          player._firstWaitingFlag = false;

          //iphone、安卓2.X mione、8.1前winphone播放时会调用系统播放器全屏
          if ((vars.IsIphone && !vars.IsWeiXinBrowser) || vars.IsOldWindowsPhone ||
              /Android\/?\s?2\../i.test(vars.UA) || vars.IsQQBrowser || vars.IsUCBrowser) {
            //显示播放按钮
            player._showPlayBtn();

          } else if (!vars.IsIphone && !vars.IsIpad) {
            //显示暂停按钮
            player._showPauseBtn();
          }

          //进度条宽度
          var playedPro = currentTime / duration * 100 + '%';
          //如果有播放时长限制，并且已经播放到最后
          if (currentTime >= duration && cache.timeLimit === duration) {
            currentTime = duration;
            playedPro = '100%';
            var freeTime = cache.timeLimit;
            var time = (freeTime - freeTime % 60) / 60;
            time = (freeTime % 60 === 0) ? time : (time + 1);
          }
          //更新时间
          if (currentTime > duration) {
            currentTime = duration;
          }

          player.$ctrlCurTime.html($.formatSeconds(currentTime));
          player.$ctrlDuration.html($.formatSeconds(duration));
          //如果当前描点没有处于拖拽状态，进行更新拖拽锚点位置
          if (!player._dragFlag) {
            player.$ctrlCurPlayedBar.css({width: playedPro});
          }

          //iphone下uc无法触发ended事件，这里通过监听当前播放时间来触发ended事件
          if (vars.IsUCBrowser && vars.IsIphone) {
            
            if (parseInt(currentTime, 10) === parseInt(duration, 10)) {
              player._fireEvent('ended');
            }
          }
        }
      }
    });
  };

  //拖拽进度条业务
  var dragService = function (player) {
    //时间锚点拖拽-开始
    player.$ctrlDragAnchor.on(vars.START_EVENT, function (e) {
      //停止隐藏控制界面的计时器
      clearTimeout(player._hideMainCtrlTime);
      //快进快退提示计时器
      clearTimeout(player._rewindForwardInterval);
      //显示快进快退提示
      player.$midRewindForwardCon.oriShow();
      //更新锚点拖动标志位
      player._dragFlag = true;
      //被拖拽（统计用）
      player._dragRangeFlag = true;
      //缓存触摸起始点的x坐标
      player._touchStratX = (e.touches && e.touches[0]) ? e.touches[0].pageX : e.pageX;
      
      return false;
    });

    //时间锚点拖拽-移动
    player.$ctrlDragAnchor.on(vars.MOVE_EVENT, function (e) {

      if (player._dragFlag) {
        //获取进度条总宽度
        var trackBarWidth = player.$ctrlTrackBar.width(),
        //获取视频总时长
            duration = player.duration,
        //当前播放时间
            currentTime = player.currentTime;
        //停止隐藏控制界面的计时器
        clearTimeout(player._hideMainCtrlTime);
        //快进快退提示计时器
        clearTimeout(player._rewindForwardInterval);
        //更新拖拽时间
        var moveTimeUpdate = function (moveTime, duration) {
          player.$mid.oriShow();

          if (currentTime > moveTime) {
            player.$midRewindForwardCon.addClass('rewind').removeClass('forward');

          } else {
            player.$midRewindForwardCon.addClass('forward').removeClass('rewind');
          }
          //缓存拖拽时间
          player._moveTime = moveTime;
          //更新内容,注:要先写内容，下面才能获取其准确宽度
          player.$midTime.html($.formatSeconds(moveTime));
          //更新拖拽锚点位置
          player.$ctrlCurPlayedBar.width((moveTime / duration) * 100 + '%');
        };

        //获取移动的距离并缓存
        player._touchMoveX =  (e.touches && e.touches[0]) ? e.touches[0].pageX : e.pageX;
        //计算出变化时间
        var changeTime = duration / trackBarWidth * (player._touchStratX -  player._touchMoveX) * -1;
        //计算出当前拖动的时间
        var moveTime = currentTime + changeTime;
        //拖动超出进度条最左边
        if (moveTime < 0) {
          moveTimeUpdate(0, duration);
        //拖动超出进度条最右边边
        } else if (moveTime > duration) {
          moveTimeUpdate(duration, duration);
        //正常范围内
        } else {
          moveTimeUpdate(moveTime, duration);
        }
      }
        
      return false;
    });

    //时间锚点拖拽-结束
    player.$ctrlDragAnchor.on(vars.END_EVENT + ' mouseout', function () {

      if (player._dragFlag) {
        //更新锚点拖动标志位
        player._dragFlag = false;
        //将视频跳至拖动时间点
        player.seekTo(player._moveTime);
        //重置卡顿计时
        player._startPlayTime = $.now();
        //隐藏快进快退界面
        player._rewindForwardInterval = setTimeout(function () {
          player.$midRewindForwardCon.oriHide();
        }, 2000);
        //如果没有任何操作，3秒后主操作界面隐藏
        player._hideMainCtrlTime = setTimeout(function () {
          player._hideMainCtrl();
        }, 3000);
      }

      return false;
    });
  };

  //点击进度条业务
  var clickService = function (player) {
    
    player.$ctrlBar.on(vars.END_EVENT, function () {
      
      return false;
    });

    player.$ctrlTrackBar.on(vars.START_EVENT, function (e) {
      var dom = $(this);
      var x = (e.touches && e.touches[0]) ? e.touches[0].pageX : e.pageX;
      var xDist = x - dom.offset().left;
      var width = dom.width();

      var clickTime = player.duration / width * xDist;
      //重置卡顿计时
      player._startPlayTime = $.now();
      //跳转到指定时间
      player.seekTo(clickTime);

      return false;
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化播放器进度条业务 (播放器内部使用)
   * @type {function}
   */
  MediaPlayer.prototype._initCtrlProgress = function () {
    //是否发送realvv标志位
    this._sendRealVVFlag = false;
    //vvend发送标志位
    this._sendEndFlag = false;
    //断点续播标志位
    this._playByHistoryFlag = false;
    //生成播放记录标志位
    this._makeHistoryFlag = false;
    //当前播放时间
    this._lastCurTime = 0;
    //起始时间，发送统计用
    this._startPlayTime = 0;
    //缓冲计数
    this._bufferCount = 0;
    //心跳统计计时器
    this._traceHeartInterval = null;
    //快进快退消失计时器
    this._rewindForwardInterval = null;
    //视频进度条是否处于拖拽状态标志位
    this._dragRangeFlag = false;
    //视频质量切换标志位
    this._changeModeFlag = false;
    //第一次加载等待标志位
    this._firstWaitingFlag = true;
     //时间锚点是否处于拖拽状态
    this._dragFlag = false;
    //触摸开始x坐标
    this._touchStratX = 0;
    //触摸移动x坐标
    this._touchMoveX = 0;
    //拖动时候的时间轴时间
    this._moveTime = -1;
    //绑定时间更新事件
    timeupdateService(this);
    //直播没有进度条
    if (this.config.mediaType === 'live') {
    
      return;
    }
    //拖拽进度条业务
    dragService(this);
    //点击进度条业务
    clickService(this);
  };
 
});