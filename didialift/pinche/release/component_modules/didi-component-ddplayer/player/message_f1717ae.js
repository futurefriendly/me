define('didi-component-ddplayer/player/message.js', function(require, exports, module){ /**
 *
 *   @description: message
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-08-28
 *
 *   @update-date: 2015-08-28
 *
 *   @update-log :
 *                 1.0.1 - 消息提示弹窗
 *
 */

    'use strict';

    var vars = require('didi-component-ddplayer/base/vars.js');
    var MediaPlayer = require('didi-component-ddplayer/player/mediaPlayer.js');

    /**
     * @class MediaPlayer
     * @classdesc 信息提示业务
     * @property {function}  _showMsg                        - (播放器内部使用) 创建/显示信息提示窗口
     * @property {function}  _hideMsg                        - (播放器内部使用) 隐藏信息提示窗口
     *
     * @example
     *   var player = require('./mediaPlayer.js');
     *
     */

    //合成样式
    var cusStyle = function (obj) {
        var cStyle = '';

        if (obj.background) {
            cStyle += 'background:' + obj.background + ';';
        }

        if (obj.color) {
            cStyle += 'color:' + obj.color + ';';
        }

        if (obj.fontSize) {
            cStyle += 'font-size:' + obj.fontSize + ';';
        }

        return cStyle;
    };

    //生成按钮HTML
    var createBtnHTML = function (btn, btnStyle, unit) {

        return '<a href="' + (btn.link ? btn.link : 'javascript:void(0);') + '" class="msg_btn_' + unit + ' msg_btn ' + (btn.ClassName ? btn.ClassName : '') + '" style="' + btnStyle + '">' + btn.text + '</a>';
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 隐藏信息提示窗口 (播放器内部使用)
     * @type {function}
     */
    MediaPlayer.prototype._hideMsg = function () {

        if (!this.$main || this.$main.length === 0) {
            this._initDoms();
        }
        //隐藏信息提示窗口
        this.$main.children('.message').hide();
        //显示控制界面
        this.$main.find('.player_main').length && this.$main.find('.player_main').show();
    };

    /**
     * @memberof MediaPlayer.prototype
     * @summary 创建/显示信息提示窗口 (播放器内部使用)
     * @type {function}
     */
    MediaPlayer.prototype._showMsg = function (msgConf) {

        if (!this.$main || this.$main.length === 0) {
            this._initDoms();
        }
        //暂停播放
        this._pause();
        //隐藏loading
        this._hideLoading();
        //隐藏控制界面
        this.$main.find('.player_main').length && this.$main.find('.player_main').hide();

        var msgStyle, contHtml, btnsHtml, msgBoxHtml, btnAStyle, btnBStyle;
        msgStyle = btnsHtml = btnAStyle = btnBStyle = '';

        msgStyle = cusStyle(msgConf);

        //生成消息内容模板
        if (msgConf.dom) {
            contHtml = msgConf.dom;

        } else {
            contHtml = '<div class="msg_cont"><span class="msg">' + msgConf.text + '</span></div>';
        }

        //生成按钮组模板
        if (msgConf.btns) {

            if (msgConf.btns.btnA) {
                btnAStyle = cusStyle(msgConf.btns.btnA);
                btnsHtml += createBtnHTML(msgConf.btns.btnA, btnAStyle, "a");
            }

            if (msgConf.btns.btnB) {
                btnBStyle = cusStyle(msgConf.btns.btnB);
                btnsHtml += createBtnHTML(msgConf.btns.btnB, btnBStyle, "b");
            }

            if (btnsHtml !== '') {
                btnsHtml = '<div class="msg_btns">' + btnsHtml + '</div>';
            }
        }

        msgBoxHtml = '<div class="message ' + (msgConf.className ? msgConf.className : '') + '" style="' + msgStyle + '"><div class="inner_msg">' + contHtml + btnsHtml + '</div></div>';

        if (this.$main.children('.message').length) {
            this.$main.find('.message').empty().append('<div class="inner_msg">' + contHtml + btnsHtml + '</div>').attr('style', msgStyle).show();

        } else {
            this.$main.append(msgBoxHtml);
        }

        //注册按钮的点击事件,在事件处理程序中调用按钮数据中的callback方法，并将其this指针指向当前按钮
        if (msgConf.btns) {

            if (msgConf.btns.btnA && msgConf.btns.btnA.callback && $.isFunction(msgConf.btns.btnA.callback)) {
                this.$main.find('.message .msg_btn_a').on(vars.END_EVENT, function () {
                    msgConf.btns.btnA.callback.call(this);
                });
            }

            if (msgConf.btns.btnB && msgConf.btns.btnB.callback && $.isFunction(msgConf.btns.btnB.callback)) {
                this.$main.find('.message .msg_btn_b').on(vars.END_EVENT, function () {
                    msgConf.btns.btnB.callback.call(this);
                });
            }
        }

        //调用msgConf配置信息中的callback方法，可在其中为自定义dom中的元素绑定事件
        if (msgConf.callback && $.isFunction(msgConf.callback)) {
            msgConf.callback.call(this.$main.find('.message')[0]);
        }
    };
 
});