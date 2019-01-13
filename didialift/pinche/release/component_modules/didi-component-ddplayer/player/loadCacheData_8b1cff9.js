define('didi-component-ddplayer/player/loadCacheData.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义播放器内部数据
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 播放器内部数据
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');
  var Cookie = require('cookie');
  var special = require('didi-component-ddplayer/base/special.js');

  /**
   * @class LoadCacheData
   * @classdesc 播放器内部数据对象
   * @property {function}  getPlayList                     - 获取当前播放列表
   * @property {function}  getNextUrl                      - 获取下一条播放链接
   * @property {function}  getFirstUrl                     - 获取第一条播放链接
   *
   * @example
   *   var LoadCacheData = require('./loadCacheData.js');
   *   cache = new LoadCacheData(config, videoData);
   */

  var defaultVideoInfo = {
    //影片id
    vid: '',
    //标签id
    elemId: '',
    //海报
    poster: '',
    //海报类型
    posterType: '',
    //播放类型  live: 直播, vod: 点播
    mediaType: '',
    //模式类型  nor:标清, hig:高清, sup:超清
    modeType: '',
    //支持的播放类型
    modeTypeList: [],
    //源类型 点播 m3u8  mp4  直播 m3u8 client
    srcType: '',
    //宽
    width: '',
    //高
    height: '',
    //音量
    volume: 0,
    //当前视频url
    curPlayUrl: '',
    //播放源
    srcList: {},
    //打点列表
    pointList: [],
    //是否自动播放
    autoplay: false,
    //是否显示默认控制条
    defControls: false,
    //是否循环播放
    loop: false,
    //是否预加载
    preload: false,
    //内容标题,或者直播频道名称
    title: '',
    //总时长
    duration: 0,
    //当前播放的内容索引值
    curIndex: -1,
    //内容总数
    totCounts: -1,
    //记录播放位置
    history: {},
    //ip限制
    ipLimit: '',
    //直播频道英文名
    liveEnName: '',
    //直播频道图标
    liveIcon: '',
    //直播标示
    liveId: '',
    //播放时长限制, -1: 无限制, num: 指定播放时长(毫秒)
    timeLimit: -1,
    //地址
    liveUrl: '',
    //联播vid列表
    vidList: [],
    //联播播放索引
    vidCurIndex: -1,
    //调试环境
    debug: false,
    //主要演员
    mainActor: '',
    //更新至多少集
    latestCount: '',
    //剧情梗概
    desc: '',
    //原始播放器地址列表
    oriUrls: null,
    //是否真全屏. 默认0：假全屏；1：系统默认全屏
    fullscreenType: 0,
    //是否记录播放记录, false: 不记录, true: 记录, 默认flase
    isRemHistory: false,
    //可展示的清晰度
    modeList: ['nor', 'hig', 'sup', 'app']
  };

  //播放信息操作
  var LoadCacheData = function (config, videoData) {

    //获取默认属性
    $.extend(this, defaultVideoInfo);
    /*合并 vid width height volume autoplay controls
      loop preload mediaType modeType html5SkinCss等属性*/
    $.merge(this, config);

    if (!$.isUndefined(videoData)) {
      this._initVOD(videoData);
    }
  };

  /**
   * @memberof LoadCacheData.prototype
   * @summary 获取当前播放列表
   * @type {function}
   */
  LoadCacheData.prototype.getPlayList = function () {

    return this.srcList[this.modeType] || [];
  };

  /**
   * @memberof LoadCacheData.prototype
   * @summary 获取下一条播放链接
   * @type {function}
   */
  LoadCacheData.prototype.getNextUrl = function () {
    var playList = this.getPlayList(),
        curIndex = this.curIndex + 1;
    var nextVideo = playList[curIndex];

    return !$.isUndefined(nextVideo) ? nextVideo.url : '';
  };

  /**
   * @memberof LoadCacheData.prototype
   * @summary 获取第一条播放链接
   * @type {function}
   */
  LoadCacheData.prototype.getFirstUrl = function () {
    var playList = this.getPlayList();
    var firstVideo = playList[0];

    return !$.isUndefined(firstVideo) ? firstVideo.url : '';
  };

  //点播内容初始化
  LoadCacheData.prototype._initVOD = function (videoData) {
    var _this = this;
    //海报水平
    if (_this.posterType === 'horizon') {
      _this.poster = videoData.horHighPic || videoData.verHighPic || '';
    //垂直图
    } else {
      _this.poster = videoData.verHighPic || videoData.horHighPic || '';
    }
    //总时长
    var duration = videoData.totalDuration || videoData.total_duration || 0;
    _this.duration = parseInt(duration, 10);
    //配置时长限制
    if (_this.timeLimit > -1 && _this.timeLimit < _this.duration) {
      _this.duration = _this.timeLimit;
    }
    //标题
    _this.title = videoData.tvname || videoData.videoName || videoData.video_name || '';
    //主要演员
    _this.mainActor = videoData.main_actor || '',
    //更新至多少集
    _this.latestCount =  videoData.latest_video_count || '';
    //剧情梗概
    _this.desc = videoData.video_desc || '';
    //源类型
    //如果videoData中直接制定了播放类型，直接按指定设置
    _this.srcType = videoData.srcType || 'mp4';

    //初始化原始播放列表
    if (!$.isUndefined(videoData.urls)) {
      _this.oriUrls = videoData.urls;
    }
    //初始化打点列表
    if (!$.isUndefined(videoData.ep) && videoData.ep instanceof Array) {
      //打点数据结构转换
      $.each(videoData.ep, function (index, item) {
        var point = {};
        point.time = parseInt(item.k, 10);
        point.desc = item.v;
        _this.pointList.push(point);
      });
    }
    //内容id
    _this.vid = videoData.vid;

    //是否有播放源
    var isHasSrc = false;
    //初始化内容列表
    if (!$.isUndefined(videoData.urls)) {
      //获取支持的分片链接和分片时长
      var urls = videoData.urls[_this.srcType],
          dura = videoData.durations;
      //遍历所有类型
      for (var i in urls) {
        //为每个类型的片子申请一个数组
        _this.srcList[i] = [];

        if (urls[i] instanceof Array) {
          //遍历所有链接
          $.each(urls[i], function (index, item) {
            var data = {};
            data.url = item;
            
            if (_this.srcType === 'm3u8') {
              data.duration = videoData.totalDuration || videoData.total_duration || -1;

            } else {
              data.duration = parseInt((dura[i][index] || -1), 10);
            }
            //将单个子片源缓存到数组中
            _this.srcList[i].push(data);
          });
        }
          
        if (!isHasSrc && _this.srcList[i].length > 0) {
          isHasSrc = true;
          //内容总数
          _this.totCounts = _this.srcList[i].length;
        }
      }

      var initDownloadUrl = function () {
        var data = {};
        data.url = '';

        if (!$.isUndefined(videoData.urls.downloadUrl)) {
          data.url = videoData.urls.downloadUrl[0] || '';
        }
        data.duration = parseInt((_this.duration || -1), 10);
        _this.srcType = 'mp4';
        _this.modeType = _this.modeType;
        _this.srcList['nor'] = [data];
        _this.totCounts = _this.srcList['nor'].length;
      };

      //如果匹配类型没有可播放内容，采用downloadUrl字段播放
      if (!isHasSrc && _this.srcType !== 'client') {
        initDownloadUrl();
      }

      if (_this.totCounts > 0) {
        //当前播放的内容索引值
        _this.curIndex = 0;
      }

      //android UC分片体验不好，这里只播downloadurl将流畅的分片改为downloadurl字段的值
      if (!vars.IsIphone && vars.IsUCBrowser && _this.srcType !== 'client') {
        initDownloadUrl();
      }

      //如果是安卓2.xx，采用downloadurl播放
      if (/Android 2./i.test(vars.UA)) {
        initDownloadUrl();
      }
      //初始化当前可播放内容的url和modeType类型
      _this._initCurPlayUrlAndModeType();
    }
  };

  //初始化当前播放的链接
  LoadCacheData.prototype._initCurPlayUrlAndModeType = function () {
    var _this = this;
    //获取当前播放列表
    var playList = _this.getPlayList();
    //如果获取的列表为空
    var mList = this.modeList;
    //遍历支持的模型列表，获取可播放内容
    $.each(mList, function (index, item) {
      //如果有可播放内容
      if (!$.isUndefined(_this.srcList[item]) && _this.srcList[item].length > 0) {
        //如果默认类型没有可播放内容，则取可播放内容
        if (playList.length === 0) {
          //自动修改当前类型
          _this.modeType = item;

          return false;
        }
        //将其支持的类型缓存起来
        _this.modeTypeList.push(item);
      }
    });
    
    if ($(mList).indexOf('app') > -1) {
      this.modeTypeList.push('app');
    }
    //再次获取播放列表
    playList = this.getPlayList();

    if (playList.length > 0) {
      this.curPlayUrl = playList[0].url;
    }
  };

  module.exports = LoadCacheData;
 
});