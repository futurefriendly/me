define("ddplayer/player/ctrlButton.js",function(i){"use strict";var t=i("ddplayer/base/vars.js"),o=i("ddplayer/player/mediaPlayer.js");o.prototype._showPlayBtn=function(){this.$ctrlPlay.oriShow(),this.$ctrlPause.oriHide()},o.prototype._showMidPlayBtn=function(){this._hideLoading(),this._hideMainCtrl(),this.$ctrlBar.oriHide(),this.$midModeListCon.oriHide(),this.$mid.oriShow(),this.$midPlay.oriShow(),this.$title.oriHide()},o.prototype._showPauseBtn=function(){this.$ctrlPlay.oriHide(),this.$ctrlPause.oriShow()},o.prototype._showLoading=function(){t.IsIOS&&(t.IsQQBrowser||t.IsUCBrowser)||(t.IsBaiduBrowser||this.$midPlay.oriHide(),this.$loading.oriShow(),this.$mid.oriHide())},o.prototype._hideLoading=function(){t.IsBaiduBrowser||this.$midPlay.oriHide(),this.$loading.oriHide()};var r=function(i){i.$midPlay.on(t.END_EVENT,function(){return $(this).oriHide(),i._playOrPause("play"),!1})},s=function(i){i.$ctrlPlay.on(t.END_EVENT,function(){return i._playOrPause("play"),!1}),i.$ctrlPause.on(t.END_EVENT,function(){return i._playOrPause("pause"),!1}),i._addEvent("pause",function(){i._hideLoading(),i._showPlayBtn(),i._showMainCtrl()}),(!t.IsIphone||t.IsIphone&&t.IsWeiXinBrowser)&&(i._addEvent("play",i._showPauseBtn),i._addEvent("playing",i._showPauseBtn))};o.prototype._initCtrlButton=function(){r(this),s(this)}});