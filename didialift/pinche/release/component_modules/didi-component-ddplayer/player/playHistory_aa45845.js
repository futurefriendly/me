define('didi-component-ddplayer/player/playHistory.js', function(require, exports, module){ /**
 *
 *   @description: playHistory
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 操作播放记录功能,对sid过滤的功能
 *
 */

    'use strict';
    
    var Storage = require('store');

    /**
     * @module player.playHistory
     * @namespace playHistory
     * @property {object}   param
     * @property {object}   model
     * @property {object}   view
     * @property {object}   ctrl
     * @property {function} setHistory  设置播放历史
     * @property {function} getHistory  获取播放历史
     * @example
     *      var history = require('./playHistory.js');
     *
     *      history.setHistory({
     *          sid: '',       //(必) 专辑id
     *          vid: '',       //(必) 视频id
     *          site: 2,       //(必) 视频类型
     *          playTime: 22,  //(必) 当前播放时间
     *          duration: 23,  //(必) 视频总时长
     *          cid: '',       //(可) 视频分类
     *          title: ''      //(可) 视频标题
     *      });
     *
     *      history.getHistory(data); //data参数可选，返回数组
     *
     *      1) 通过vid和site查找
     *         data : {          //(可)
     *             vid: '',      //(必) string 视频id
     *             site: '2'     //(必) string 视频类型
     *         }
     *      2) 通过sid查找
     *         data : {          //(可)
     *             sid: ''       //(必) string 专辑id
     *             type: 0       //(可) number 获取类型 0: 取最新一条, 1: 获取所有, 默认0
     *         }
     */
    var historyRec = {
        param: {
            //本地存储名称
            localHistoryName: 'dd_video_history',
            //最大存储记录数
            maxSize: 20,
            //记录中必须有的字段
            checkArr: ['sid', 'vid', 'site', 'playTime', 'duration'],
            //数据属性全集
            paramArr: ['sid', 'vid', 'site', 'cid', 'playTime', 'duration', 'sysTime', 'title']
        },
        model: {
            //缓存本地存储数据对象字符串
            localDataStr: ''
        },
        view: {},
        ctrl: {}
    };

    var p = historyRec.param,
        m = historyRec.model,
        v = historyRec.view,
        c = historyRec.ctrl;

    //========================== 模型层 ================================
    //历史记录数据检查
    m.historyCheck = function (data) {
        var rst = true;

        $.each(p.checkArr, function (index, item) {

            if (typeof data[item] === 'undefiend') {
                rst = false;

                return false;
            }
        });

        return rst;
    };

    //数据处理,将数据对象转换成字符串
    m.objToStr = function (data) {
        var rstArr = [],
            isFinishedFlag = false;
        //检查是否已经播放完成
        try {
            var dur = parseInt(data.duration, 10),
                cur = parseInt(data.playTime, 10);
            //如果播放完成95%以上，我们认为该片子已经播放完成
            if (cur / dur > 0.97) {
                isFinishedFlag = true;
            }

        } catch (e) {}

        if (isFinishedFlag) {

          return 'finished';  

        } else {
            //设置时间
            data.sysTime = Date.now();

            $.each(p.paramArr, function (index, item) {

                if (item === 'playTime') {

                    try {
                        data[item] = parseInt(data[item], 10);

                    } catch (e) {}
                }
                data[item] = data[item] ? data[item] : '';
                rstArr.push(encodeURIComponent(data[item]));
            });

            return rstArr.join(',');
        }
    };

    //数据处理,将字符串转换成数据对象
    m.strToObj = function (data) {
        var rst = null;

        if (typeof data === 'string' && data !== 'null' && data !== '') {
            var dataArr = data.split(',');
            rst = {};

            $.each(p.paramArr, function (index, item) {

                if (item === 'playTime' || item === 'duration' || item === 'sysTime' ||
                    item === 'flag' || item === 'sid') {
                    rst[item] = parseInt(dataArr[index], 10);

                } else {
                    rst[item] = decodeURIComponent(dataArr[index]);
                }
            });
        }

        return rst;
    };

    //将字符串解析成数组对象
    m.strToArr = function (data) {
        var rst = [];

        if (typeof data === 'string' && data !== '' && data !== 'null') {

            if (data.indexOf('|') === 0) {
                data = data.substr(1);
            }
            var dataStrArr = data.split('|');

            $.each(dataStrArr, function (index, item) {
                rst.push(m.strToObj(item));
            });
        }

        return rst;
    };

    //========================== 控制层 ================================
    /**
     * @memberof playHistory
     * @summary 设置播放记录
     * @type {function}
     * @param {object} data 设置的记录
     */
    c.setHistory = function (data) {
        //数据检查
        if (m.historyCheck(data)) {
            //数据加工，转换成字符串
            var dataStr = m.objToStr(data);
            //如果缓存中还没有数据
            if (m.localDataStr === '') {
                //获取本地存储的数据(字符串)
                m.localDataStr = Storage.get(p.localHistoryName) || '';
            }
            //字符串数组
            var localDataStrArr = (m.localDataStr !== '') ? m.localDataStr.split('|') : [];
            //检查索引字符串(vid和site能判断数据是否已经存在)
            var keyStr = ',' + data.vid + ',' + data.site + ',';
            //本地还没有存储过当前播放记录且该视频还没播放结束(数组操作)
            if (dataStr !== 'finished' && m.localDataStr.indexOf(keyStr) === -1) {
                //首添加到数组
                localDataStrArr.unshift(dataStr);
            //本地已经存在该数据
            } else {
                var arr = [];
                //如果视频没播放完成,则更新记录，如果已经播放完成，则删除该记录
                if (dataStr !== 'finished') {
                    arr.push(dataStr);
                }

                $.each(localDataStrArr, function (index, item) {

                    if (item.indexOf(keyStr) === -1) {
                        arr.push(item);
                    }
                });
                localDataStrArr = arr;
            }

            if (localDataStrArr.length > p.maxSize) {
                localDataStrArr.length = p.maxSize;
            }
            m.localDataStr = localDataStrArr.join('|');

            Storage.set(p.localHistoryName, m.localDataStr);
        }
    };

    /**
     * @memberof playHistory
     * @summary 获取播放记录
     * @type {function}
     * @param {object} data 获取记录的条件
     * @returns {Array} 满足条件的记录
     */
    c.getHistory = function (data) {
        var rst = [];
        var localDataStr = (m.localDataStr && m.localDataStr !== '') ? m.localDataStr : Storage.get(p.localHistoryName);

        if (localDataStr && typeof data !== 'undefined') {

            if (typeof data.vid !== 'undefined' && typeof data.site !== 'undefined') {
                var reg = new RegExp('(^|\\|)\\d+' + ',' + data.vid + ',' + data.site + '(,[\\w\\.\\W]*){6}', 'ig');
                var rstStr = localDataStr.match(reg) + '';
                rst = m.strToObj(rstStr);
                rst = (rst === null) ? [] : [rst];

            } else if (typeof data.sid !== 'undefined') {
                var historyList = m.strToArr(localDataStr);

                $.each(historyList, function (index, item) {

                    if ((item.sid + '') === (data.sid + '')) {
                        rst.push(item);
                    }
                });

                if (typeof data.type === 'undefiend' || data.type === 0 || data.type !== 1) {
                    rst.length = 1;
                }
            }

        } else {
            rst = m.strToArr(localDataStr);
        }

        return rst;
    };

    //对外接口
    window.DiDiVideoJSBridge = window.DiDiVideoJSBridge || {};
    window.DiDiVideoJSBridge.setHistory = c.setHistory;
    window.DiDiVideoJSBridge.getHistory = c.getHistory;

    module.exports = {
        setHistory: c.setHistory,
        getHistory: c.getHistory
    };
 
});