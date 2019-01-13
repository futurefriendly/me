define('didi-component-ddplayer/base/special.js', function(require, exports, module){ /**
 *
 *   @description: 该文件用于定义特殊名单列表
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 特殊名单列表
 *
 **/


  'use strict';
  
  var vars = require('didi-component-ddplayer/base/vars.js');

  /**
   * @module base/special
   * @namespace special
   * @property {boolean}                                - 是否启用全局调试
   * @property {array}    TIMEUPDATE_REPLACE_ENDED_LIST - 使用timeupdate模拟ended名单
   * @property {function} isAllowTimeupdateReplaceEnded - 是否允许用timeupdate事件替代ended事件
   *
   * 
   */

  
  var special = {};

  /**
   * @memberof special
   * @summary 使用timeupdate模拟ended名单
   * @type {array}
   */
  special.TIMEUPDATE_REPLACE_ENDED_LIST = [
    /SM\-N90/i           //三星note3 三星note3当切换片源后就不再会触发ended事件，这里，note3用timeupdate模拟
  ];

  /**
   * @memberof special
   * @summary 是否允许用timeupdate事件替代ended事件
   * @type {function}
   * @return {boolean}                                  - 结果
   */
  special.isAllowTimeupdateReplaceEnded = function () {
    var rst = false;
    //如果在替代名单中
    $.each(special.TIMEUPDATE_REPLACE_ENDED_LIST, function (index, item) {

      if (item.test(vars.UA)) {
        rst = true;

        return false;
      }
    });

    return rst;
  };
  /**
   * @memberof special
   * @summary 是否强制使用mp4播放（滴滴目前都使用mp4）
   * @type {function}
   * @return {boolean}
   */
  special.isDiDiForceUseMp4 = function(){
    return true;
  };
  

  module.exports = special;
 
});