define('didi-component-ddplayer/player/poster.js', function(require, exports, module){ /**
 *
 *   @description: poster
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 海报
 *                 
 *
 */

    'use strict';
    
    var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');
    /**
     * @class MediaPlayer
     * @classdesc 播放器海报业务
     * @property {function}  hidePoster         - 隐藏海报
     * @property {function}  showPoster         - 显示海报
     */

    /**
     * @memberof MediaPlayer.prototype
     * @summary 隐藏海报
     * @type {function}
     */
    MediaPlayer.prototype.hidePoster = function () {
        
        if (this.$posterCon.length > 0) {
            this.$posterCon.addClass('hidden');
        }
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 显示海报
     * @type {function}
     */
    MediaPlayer.prototype.showPoster = function () {
        
        if (this.$posterCon.length > 0) {
            this.$posterCon.removeClass('hidden');
        }
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 更换海报
     * @type {function}
     * @property {object}  poster         - 海报数据对象
     */
    MediaPlayer.prototype.changePoster = function (poster) {
        
        if (!poster || !poster.url) {
            
            return;
        }
        
        if (this.$posterCon.length > 0) {
            this.$posterCon.css({
                'background-image': 'url(' + poster.url + ');'
            });
        }
    };
 
});