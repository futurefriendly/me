define('didi-component-ddplayer/player/events.js', function(require, exports, module){ /**
 *
 *   @description: 该文件为播放器实现事件方法
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 为播放器实现事件方法
 *           
 * 
 **/


  'use strict';

  var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
  var vars = require('didi-component-ddplayer/base/vars.js');
  var special = require('didi-component-ddplayer/base/special.js');
  var Console = require('didi-component-ddplayer/base/console.js');

  /**
   * @class MediaPlayer
   * @classdesc 播放器事件
   * @property {function}  on                              - 绑定播放器事件
   * @property {function}  off                             - 注销播放器事件
   * @property {function}  trigger                         - 触发播放器指定事件
   * @property {function}  one                             - 绑定播放器事件, 只触发一次后就注销
   * @property {function}  _addEvent                       - (播放器内部使用) 绑定播放器事件,添加到事件数组中
   * @property {function}  _removeEvent                    - (播放器内部使用) 注销播放器事件,从事件数组中删除
   * @property {function}  _fireEvent                      - (播放器内部使用) 触发指定播放器事件
   * @property {function}  _initEvent                      - (播放器内部使用) 初始化内部事件
   *
   * @example
   *   var DiDiPlayer = require('./didiPlayer.js');
   *   var player = new DiDiPlayer(settings);
   *   player.on('timeupdate', function () {});
   *   player.on('ended', function () {});
   */
  
  /**
   * @memberof MediaPlayer.prototype
   * @summary 事件绑定
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {function} fn                               - 事件触发后的回调函数
   */
  MediaPlayer.prototype.on = function (eventType, fn) {
    var _this = this;

    this._onDomLoaded(function () {

        if (eventType === 'ended' || eventType === 'onended') {
          
          _this.eventProcess.userEnded.push({
            name: 'ended',
            process: function () {
              fn.call(_this);
            }
          });
        
        } else {

          _this.$video.on(eventType, function (e) {
            
            fn.call(_this, e);
          });
        }
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 移除事件
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {function} fn                               - 事件触发后的回调函数
   */
  MediaPlayer.prototype.off = function (eventType, fn) {
    var _this = this;

    this._onDomLoaded(function () {
      eventType = eventType.toLowerCase();
      _this.$video.off(eventType, fn);
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 触发事件
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   */
  MediaPlayer.prototype.trigger = function (eventType) {
    var _this = this;

    this._onDomLoaded(function () {
      eventType = eventType.toLowerCase();
      _this.$video.trigger(eventType);
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 只触发一次
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {function} fn                               - 事件触发后的回调函数
   */
  MediaPlayer.prototype.one = function (eventType, fn) {
    var _this = this;

    this._onDomLoaded(function () {
      eventType = eventType.toLowerCase();

      if (eventType === 'ended') {
        //在播最后一个视频的时候执行该事件
        this.$video.on(eventType, function () {

          if (_this.cache.curIndex === _this.cache.totCounts - 1) {
            _this.$video.one(eventType, function (e) {
              fn.call(_this, e);
            });
          }
        });

      } else {
        this.$video.one(eventType, function (e) {
          fn.call(_this, e);
        });
      }
    });
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 为播放器添加事件处理 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {string|function} param1                    - string: 给该事件添加别名(如果有删除removeEvent需求时用), 并且param2为对应的事件触发后回调方法
   *                                                    - function: 对应的事件触发后回调方法,如果该参数为function, param2则不填
   * @param {function} param2                           - param1为string时生效,对应的事件触发后回调方法
   * @example
   *      player.addEvent('timeupdate', fn);
   *      player.addEvent('timeupdate', 'myTimeupdate', fn);
   */
  MediaPlayer.prototype._addEvent = function (eventType, param1, param2) {
    var pro = this.eventProcess;
    var _this = this;

    // 转换成小写
    eventType = eventType.toLowerCase();

    if (!$.isUndefined(eventType) && !$.isUndefined(pro[eventType])) {
      var proObj = {};
      var isTimeupdateRepEnded = special.isAllowTimeupdateReplaceEnded() && (eventType === 'ended' || eventType === 'onended');
      //事件和处理方法
      if ($.isFunction(param1)) {
        
        if (isTimeupdateRepEnded) {
          eventType = 'timeupdate';
          proObj.process = function () {

            if (_this.videoTag.duration - _this.videoTag.currentTime < 0.5) {
              param1.call(_this);
            }
          };

        } else {

          proObj.process = function () {
            param1.call(_this);
          };
        }
        //自动为该处理事件生成一个属性名
        proObj.name = '_' + eventType + (new Date()).getTime();

        pro[eventType].push(proObj);
        //事件、处理方法名称和处理方法
      } else if ($.isString(param1) && $.isFunction(param2)) {

        if (isTimeupdateRepEnded) {
          proObj.process = function () {

            if (_this.videoTag.duration - _this.videoTag.currentTime < 0.5) {
              param2.call(_this);
            }
          };

        } else {
          proObj.process = function () {
            param2.call(_this);
          };
        }
        proObj.name = param1;
        

        pro[eventType].push(proObj);
      }
    }
  };

  //使用方式1: removeEvent('timeupdate'); //移除所有timeupdate事件处理
  //使用方式2: removeEvent('timeupdate', 'myTimeupdate'); //移除所有timeupdate事件中叫做myTimeupdate的相关处理
  /**
   * @memberof MediaPlayer.prototype
   * @summary 移除处理事件 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   * @param {string}   param1                           - 可选参数，事件名称下的别名，如果该参数不填，则移除事件列表中的所有处理方法
   * @example
   *      player.addEvent('timeupdate');
   *      player.removeEvent('timeupdate', 'myTimeupdate');
   */
  MediaPlayer.prototype._removeEvent = function (eventType, param1) {
    var pro = this.eventProcess;

    if (!$.isUndefined(eventType) && !$.isUndefined(pro[eventType])) {
      //删除所有该事件处理方法
      if ($.isUndefined(param1)) {
        pro[eventType] = [];
        //删除指定事件下的指定处理方法
      } else if ($.isString(param1)) {

        $.each(pro[eventType], function (index, item) {

          if (item.name === param1) {
            pro[eventType].splice(index, 1);
          }
        });
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 触发指定事件 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   */
  MediaPlayer.prototype._fireEvent = function (eventType) {
    var pro = this.eventProcess,
        _this = this;

    if (!$.isUndefined(eventType) && !$.isUndefined(pro[eventType])) {

      $.each(pro[eventType], function (index, item) {

        item.process.call(_this);
      });
    }
  };

  //播放结束事件
  MediaPlayer.prototype._onBaseEnded = function () {
    var _this = this,
      cache = _this.cache;
    //播放起始时间更新
    this._startPlayTime = $.now();
    //缓冲次数重置
    this._bufferCount = 0;
    //如果是-1，说明是循环播放第一个子片，设置为0
    if (cache.curIndex === -1) {
      cache.curIndex = 0;
    }
    //百度浏览器中，直接修改cache的变量无效，下次触发ended事件还是原来的值，这里用window参数传值
    if (vars.IsBaiduBrowser || vars.IsBaiduBoxApp) {
      var srcList = cache.srcList[cache.modeType];
      var currentTime = 0;

      $.each(srcList, function (index, item) {

        currentTime += item.duration;

        if (index >= cache.curIndex) {

          return false;
        }
      });
    }
    var nextUrl = cache.getNextUrl();
    //继续播放后面的子片源
    if (nextUrl !== '') {
      //触发等待事件
      this.trigger('waiting');
      //修改cache中的信息
      cache.curPlayUrl = nextUrl;
      cache.curIndex++;
      this.setSrc(cache.curPlayUrl);
      //指定新地址，并播放
      setTimeout(function () {
        _this.videoTag.play();
      }, 100);
      //修改videoData中的属性，供统计用
      this.videoData.video_src = nextUrl;
    //已经播到该片源的最后
    } else {
      //如果是循环播放并且是非广告内容
      if (cache.loop) {
        //触发等待事件
        this.trigger('waiting');
        var firstUrl = cache.getFirstUrl();
        //指定新地址，并播放
        this.setSrc(firstUrl);
        this.play();
        //修改cache中的信息
        cache.curPlayUrl = firstUrl;
        //如果是循环播放，设置器curIndex为-1
        cache.curIndex = -1;
        //修改videoData中的属性，供统计用
        this.videoData.video_src = firstUrl;
      //已经播放到最后，并不进行循环播放
      } else {
        //修改cache中的信息
        cache.curPlayUrl = nextUrl;
      }
      //触发用户自定义结束事件
      $.each(this.eventProcess.userEnded, function (index, item) {
        item.process();
      });
    }
    //置空缓存预加载对象
    this._nextPreLoadImg = null;
  };

  //键盘事件
  MediaPlayer.prototype._onKeyDown = function (e, player) {
    var keyCode = e.keyCode || e.which || e.charCode;

    var volume = function (val) {
      var vol = player.getVolume();
      vol += val;
      player.setVolume(vol);
    };

    if (!$.isUndefined(keyCode)) {

      switch (keyCode) {
        //up 音量加
        case 38:
          volume(0.1);
          break;
        //down 音量减
        case 40:
          volume(-0.1);
          break;
        //left
        case 37:
          player.seekTo(player.currentTime - 10);
          break;
        //right
        case 39:
          player.seekTo(player.currentTime + 10);
          break;
      }
    }
  };

  /**
   * @memberof MediaPlayer.prototype
   * @summary 初始化内部事件 (播放器内部使用)
   * @type {function}
   * @param {string}   eventType                        - 事件名称(w3c标准播放器事件)
   */
  MediaPlayer.prototype._initEvent = function () {
    var _this = this;
    var pro = this.eventProcess;

    if (this.$video && this.$video.length > 0) {
      //绑定事件
      $.each(_this.eventList, function (index, item) {
        //note3时候不绑定ended事件
        if ($.isArray(pro[item]) && ((vars.IsSAMSUNGNote3 && item !== 'ended') || !vars.IsSAMSUNGNote3)) {

          _this.$video.on(item, function (e) {

            if ($(_this.$video, _this.$main).length > 0) {
              
              $.each(pro[item], function (eIndex, eItem) {
                eItem.process.call(_this, e);
              });
            }
          });
        }
      });
    }
    //添加ended事件
    this._addEvent('ended', this._onBaseEnded);
    //绑定键盘事件
    $('body').on('keydown', function (e) {
      _this._onKeyDown(e, _this);
    });
  };

 
});