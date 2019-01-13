define('didi-component-ddplayer/player/mediaPlayer.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义原始播放器
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 原始播放器
 *
 **/


  'use strict';

  var Console = require('didi-component-ddplayer/base/console.js');
  var vars = require('didi-component-ddplayer/base/vars.js');

  /**
   * @module player.mediaPlayer
   * @namespace MediaPlayer
   * @summary 播放器抽象方法与事件
   * @param {Object} config 配置
   * @constructor
   * @property {dom}       videoTag                        - video标签对象
   * @property {object}    $video                          - video标签$对象
   * @property {object}    cache                           - 播放器内部当前视频播放的操作对象
   * @property {object}    videoData                       - 播放器当前播放视频数据
   * @property {object}    config                          - 播放器配置参数
   * @property {object}    videoList                       - 多视频数据对象
   * @property {number}    currentTime                     - 当前视频播放时间
   * @property {number}    duration                        - 视频总时长
   * @property {function}  _onDomLoaded                    - 获取成功加载完dom后
   * @property {function}  pause                           - 暂停
   * @property {function}  play                            - 播放
   * @property {function}  getSrc                          - 获取当前视频播放地址
   * @property {function}  setSrc                          - 设置当前视频播放地址
   * @property {function}  getPoster                       - 获取当前视频海报地址
   * @property {function}  setPoster                       - 设置当前视频海报地址
   * @property {function}  getPreLoad                      - 获取当前视频预加载方式
   * @property {function}  setPreLoad                      - 设置当前视频预加载方式
   */
 
  var MediaPlayer = function (config) {
    /**
     * @memberof MediaPlayer.prototype
     * @summary video标签对象
     * @type {dom}
     */
    this.videoTag = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary video标签$对象
     * @type {object}
     */
    this.$video = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 播放器内部当前视频播放的操作对象
     * @type {object}
     */
    this.cache = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 播放器当前播放视频数据
     * @type {object}
     */
    this.videoData = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 播放器配置参数
     * @type {object}
     */
    this.config = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 多视频数据对象
     * @type {object}
     */
    this.videoList = null;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 当前视频播放时间
     * @type {number}
     */
    this.currentTime = 0;
    /**
     * @memberof MediaPlayer.prototype
     * @summary 视频总时长
     * @type {number}
     */
    this.duration = 0;
    //dom节点是否加载完
    this._loadedDomFlag = false;
    //超时
    this._timeoutFlag = false;
    //得到video数据
    this._getDataFlag = false;
    //播放监控标志位(就开始时候监控)
    this._playCheckFlag = false;
    //播放监控时间(mm)
    this._playCheckTime = 6000;
    //初始化方法
    this._init(config);
  };

  //所有播放器的事件处理对象
  MediaPlayer.prototype.eventProcess = {
    'pause': [],              //pause()触发
    'ended': [],              //播放结束
    'userEnded': [],          //用户自定义播放结束(单个片源播放结束触发)
    'error': [],              //请求数据时遇到错误
    'play': [],               //play()和autoplay开始播放时触发
    'playing': [],            //正在播放
    'timeupdate': [],         //播放时间改变
  };

    // canplay seeking seeked ended play pause loadeddata loadedmetadata timeupdate
  MediaPlayer.prototype.eventList = [
    'loadedvideodata',        //获取播放器相关数据(自定义事件)
    'loadstart',              //客户端开始请求数据
    'progress',               //客户端正在请求数据
    'suspend',                //延迟下载
    'abort',                  //客户端主动终止下载（不是因为错误引起），
    'error',                  //请求数据时遇到错误
    'stalled',                //网速失速
    'play',                   //play()和autoplay开始播放时触发
    'playing',                //正在播放
    'pause',                  //pause()触发
    'loadedmetadata',         //成功获取资源长度
    'loadeddata',             //当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧
    'waiting',                //等待数据，并非错误
    'canplay',                //可以播放，但中途可能因为加载而暂停
    'canplaythrough',         //可以播放，歌曲全部加载完毕
    'seeking',                //寻找中
    'seeked',                 //寻找完毕
    'timeupdate',             //播放时间改变
    'ended',                  //播放结束
    'ratechange',             //播放速率改变
    'durationchange',         //资源长度改变
    'volumechange'            //音量改变
  ];

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频播放地址
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getSrc = function () {
    
    return this.$video.attr('src');
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频播放地址
   * @type {function}
   * @param {string} srcUrl                             - 设置指定的url
   */
  MediaPlayer.prototype.setSrc = function (srcUrl) {
    this.$video.attr('src', srcUrl);
  };

    /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频音量
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getVolume = function () {
    
    return this.videoTag.volume;
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频音量
   * @type {function}
   * @param {string} volume                             - 设置音量 0 - 1
   */
  MediaPlayer.prototype.setVolume = function (volume) {

    if ($.isNumber(volume)) {
      volume = volume < 0 ? 0 : volume;
      volume = volume > 1 ? 1 : volume;
      Console.log('音量:', volume);
      this.videoTag.volume = volume;
    }
    
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频海报地址
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getPoster = function () {
    
    return this.cache.poster || '';
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频海报地址
   * @type {function}
   * @param {string} posterUrl                          - 海报地址
   * @param {string} srcUrl                             - 设置指定的url
   */
  MediaPlayer.prototype.setPoster = function (posterUrl) {
    this.changePoster(posterUrl);
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取当前视频预加载方式
   * @type {function}
   * @return {string}
   */
  MediaPlayer.prototype.getPreLoad = function () {
    
    return this.$video.attr('preload');
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 设置当前视频预加载方式
   * @type {function}
   * @param {string} preloadType                        - 预加载方式
   */
  MediaPlayer.prototype.setPreLoad = function (preloadType) {
    this.$video.attr('preload', preloadType);
  };
  // //获取当前视频控制条方式
  // MediaPlayer.prototype.getControls = function () {
  //   return this.$video.attr('controls');
  // };
  // //设置当前视频控制条方式
  // MediaPlayer.prototype.setControls = function (controlsType) {
  //   this.$video.attr('controls', controlsType);
  // };
  // //获取当前视频循环播放方式
  // MediaPlayer.prototype.getLoop = function () {
  //   return this.$video.attr('loop');
  // };
  // //设置当前视频循环播放方式
  // MediaPlayer.prototype.setLoop = function (loopType) {
  //   this.$video.attr('loop', loopType);
  // };
  // //获取当前视频是否静音
  // MediaPlayer.prototype.getMuted = function () {
  //   return this.$video.attr('muted');
  // };
  // //设置当前视频是否静音
  // MediaPlayer.prototype.setMuted = function (mutedType) {
  //   this.$video.attr('muted', mutedType);
  // };
  // //获取当前视频播放速度
  // MediaPlayer.prototype.getPlaybackRate = function () {
  //   return this.$video.attr('playbackRate');
  // };
  // //设置当前视频播放速度
  // MediaPlayer.prototype.setPlaybackRate = function (playbackRateNum) {
  //   this.$video.attr('playbackRate', playbackRateNum);
  // };
  // //获取当前播放时间
  // MediaPlayer.prototype.getCurrentTime = function () {
  //   return this.$video.attr('currentTime');
  // };
  // //set播放时间
  // MediaPlayer.prototype.setCurrentTime = function (seconds) {
  //   this.$video.attr('currentTime', seconds);
  // };

  //初始化
  MediaPlayer.prototype._init = function () {};
  //添加事件处理
  MediaPlayer.prototype._addEvent = function (eventType, param1, param2) {};
  //移除处理事件
  MediaPlayer.prototype._removeEvent = function (eventType, param1) {};
  //触发事件
  MediaPlayer.prototype._fireEvent = function (eventType) {};
  //暂停
  MediaPlayer.prototype._pause = function () {
    var _this = this;

    this._onDomLoaded(function () {

      if (_this.$video.attr('data-noSupport') === null) {
        _this.videoTag.pause();
      }
    });
  };
  //播放
  MediaPlayer.prototype._play = function () {
    var _this = this;

    //获取数据成功
    var loadSuccess = function () {

      if (_this.$video.attr('data-noSupport') === null) {

        try {
            //播放监控开始(就开始时候监控)
          if (!this._playCheckFlag && this.config.autoplay) {
            this._playCheckFlag = true;
            var startTime = 0,
                pTime = 200;

            var checkInterval = setInterval(function () {
              startTime += pTime;
              var notPlayFlag = (startTime >= _this._playCheckTime);
              //如果在检查时间内没播放或者播放都清空计时器
              if (notPlayFlag || _this.currentTime > 1) {
                //如果在检查时间内没播放,调用暂停事件
                if (notPlayFlag) {
                  _this.pause();
                  _this.$video.trigger('pause');
                }
                clearInterval(checkInterval);
              }
            }, pTime);
          }

          if (_this.$video.attr('preload') !== null) {
            _this.$video.removeAttr('preload');
          }
          _this.videoTag.play();

        } catch (e) {
          _this.$video.one('canplay', function () {

            if (_this.videoTag.paused) {
              _this.videoTag.play();
            }
          });
        }
      }
    };

    this._onDomLoaded(loadSuccess);
  };
  //暂停播放业务
  MediaPlayer.prototype._playOrPause = function (type) {};

  /**
   * @memberof MediaPlayer.prototype
   * @summary 暂停
   * @type {function}
   */
  MediaPlayer.prototype.pause = function () {
    var _this = this;

    this._onDomLoaded(function () {
      _this._playOrPause('pause');
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 播放
   * @type {function}
   */
  MediaPlayer.prototype.play = function () {
    var _this = this;
    
    this._onDomLoaded(function () {
      _this._playOrPause('play');
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 跳转到指定位置，全片跳转(seconds: 跳转到指定时间)
   * @type {function}
   * @param {number}   seconds                          - 跳转到指定时间点，秒
   */
  MediaPlayer.prototype.seekTo = function (seconds) {
    var _this = this;
    var curMediaSeekTo = function (sec) {
      
      try {
        _this.videoTag.currentTime = sec;

        if (_this.videoTag.paused) {
          _this.videoTag.play();
        }
      
      } catch (e) {
        _this.$video.one("canplay", function () {
          _this.videoTag.currentTime = sec;

          if (_this.videoTag.paused) {
            _this.videoTag.play();
          }
        });
      }
    };

    var childDurList = this.cache.srcList[this.cache.modeType];

    if (/Android\s4\./i.test(vars.UA) && !vars.IsBaiduBrowser) {
      //显示加载状态
      this._showLoading();
    }

    //如果只有一个片源
    if (childDurList.length === 1) {
      //跳转播放
      curMediaSeekTo(seconds);

    //如果有多个片源
    } else {
      //查找拖拽时间所处的片源
      var beforeTotal = 0;

      $.each(childDurList, function (index, item) {
        //逐个累加每个播放片源的总时间，定位指定片源
        if ((beforeTotal + item.duration) > seconds) {
          var cache = _this.cache;
          //如果和当前播放的片源不是同一个
          if (index !== cache.curIndex) {
            //修改cache中的播放索引
            cache.curIndex = index;
            //获取播放链接
            var url = item.url;
            //更新当前播放内容
            cache.curPlayUrl = url;
            //更新video片源地址
            _this.setSrc(url);
          }
          //当前子内容播放时间
          seconds -= beforeTotal;
          //跳转播放
          setTimeout(function () {
            curMediaSeekTo(seconds);
          }, 300);

          return false;
        
        } else {
          beforeTotal += item.duration;
        }
      });
    }
  };
  //绑定事件
  MediaPlayer.prototype.on = function (eventType, fn) {};
  //移除事件
  MediaPlayer.prototype.off = function (eventType, fn) {};
  //触发事件
  MediaPlayer.prototype.trigger = function (eventType) {};
  //只触发一次
  MediaPlayer.prototype.one = function (eventType, fn) {};
  //获取播放总时长
  MediaPlayer.prototype.htmlTo = function (dom) {};
  //清晰度切换播放
  MediaPlayer.prototype.playByMode = function () {};
  //更新播放器
  MediaPlayer.prototype.updateMedia = function (data) {};
  //更新海报
  MediaPlayer.prototype.changePoster = function (posterUrl) {};

  /**
   * @memberof MediaPlayer.prototype
   * @summary 获取成功加载完dom后
   * @type {function}
   * @param {function}   successFun                     - dom加载完成后，执行的回调方法
   */
  MediaPlayer.prototype._onDomLoaded = function (successFun) {
    var _this = this;

    if (this._loadedDomFlag) {
      successFun.call(this);
    
    } else {
      var checkInterval = setInterval(function () {
        
        if (_this._loadedDomFlag) {
          clearInterval(checkInterval);
          successFun.call(_this);
        }
      }, 100);
    }
  };

  module.exports = MediaPlayer;
 
});