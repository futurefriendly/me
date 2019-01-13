define('didi-component-ddplayer/player/errorTypes.js', function(require, exports, module){ /**
 *
 *   @description: errorTypes
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 基本编码信息
 *
 */

    'use strict';

    /**
     * @module player.errorTypes
     * @namespace Error
     * @summary 编码信息
     * @property {Object}   PROCESS    数据处理提示信息
     * @property {Object}   SUPPORT    支持性提示信息
     * @property {Object}   REQUEST    请求提示信息
     *
     * @example
     *      var error = require('./errorTypes.js');
     */
    var Error = {
        //数据处理
        'PROCESS': {
            '200': '数据处理完成',
            '201': '无效数据,请刷新重试',
            '202': '无效视频数据',
            '203': '数据结构错误',
            '204': '解析数据出错'
        },
        //支持性提示信息
        'SUPPORT': {
            '300': '您的浏览器不支持播放功能，请尝试使用其它浏览器',
        },
        //请求提示信息
        'REQUEST': {
            '400': '网络超时，请刷新重试'
        }
    };

    module.exports = Error;
 
});