define('page/trip/main.js', function(require, exports, module){ /**
 *
 *   @description: 页面播放器生成
 *
 *   @version    : 1.0.1
 *
 *   @create-date: 2015-09-02
 *
 *   @update-date: 2015-09-02
 *
 *   @update-log :
 *                 1.0.1 - 页面播放器生成
 *
 */

'use strict';

var ddplayer = require('ddplayer');
var bridge = require('didibridge');
var vars = ddplayer.vars;
var DidiMonitor = require('didimonitor');

var init = function() {
	ddplayer.ready(function(Player) {
		// var shareLink = location.href.replace(/[?&](token|phone)=[^&]+/g, '');
		var shareLink = location.href.replace(/[?#].*/g,"");
		var playerMaker = {
			param: {
				//播放器容器id
				playerConId: 'playerWrap',
				playerConfig: {
					//视频数据 
					data: window.videoData || {},
					//是否自动播放
					autoplay: false
				},
				//body bg container
				clsBodyBg: 'js_body_bg',
				clsBodyBgPlayed: 'js_body_bg_played',
				//猛戳Get button class
				clsBtnGet: 'js_power_get',
				//分享button id
				idBtnShare: 'btnShare',
				isPlayed: false,
				//横竖屏 layer
				idWrongLayer: 'wrongLayer',
				wxShareConfig: {
				    link: shareLink,
				    img_url: 'http://static.xiaojukeji.com/pinche/release/page/trip/img/share_ed5cb12.jpg',
				    title: '最sexy的城市出行方式！新技能get',
				    desc: '最经济，最有趣！城市出行sexy秘籍！',
				    weibo_desc: '最经济，最有趣！城市出行sexy秘籍！-滴滴 (来自@滴滴顺风车) http://t.cn/RyVFtQ4'
				},
				shareConfig: {
					share_url: shareLink,                   
			        share_img_url: 'http://static.xiaojukeji.com/pinche/release/page/trip/img/share_ed5cb12.jpg',                      
			        share_icon_url: 'http://static.xiaojukeji.com/pinche/release/page/trip/img/share_ed5cb12.jpg',                      
			        share_title: '最sexy的城市出行方式！新技能get',       
			        share_content: '最经济，最有趣！城市出行sexy秘籍！',
			        weibo_desc: '最经济，最有趣！城市出行sexy秘籍！-滴滴 (来自@滴滴顺风车) http://t.cn/RyVFtQ4'  
				}
			},
			model: {
				//播放器对象
				player: null
			},
			view: {},
			ctrl: {}
		};

		var p = playerMaker.param,
			m = playerMaker.model,
			v = playerMaker.view,
			c = playerMaker.ctrl;

		//参数检查和初始化
		p.init = function() {

			if (!$.isFunction(Player)) {

				return false;
			}

			if ($('#' + p.playerConId).length === 0) {

				return false;
			}
		
			return true;
		};
		m.initEntranceConfig = function(){
			p.entranceConfig =  {
				    entrance: {
				        icon: "http://static.xiaojukeji.com/api/img/i-webview-entrance.png"
				    },
				    buttons: [{
				        type: "share_weixin_timeline",
				        name: "分享到微信朋友圈",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "share_weixin_appmsg",
				        name: "分享给微信好友",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "share_sina_weibo",
				        name: "分享到新浪微博",
				        data: $.extend({}, p.shareConfig, {
				            share_content: p.shareConfig.weibo_desc || p.shareConfig.desc
				        }),
				        callback: function() {}
				    }, {
				        type: "share_qq_appmsg",
				        name: "分享给QQ好友",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "share_qzone",
				        name: "分享到QQ空间",
				        data: p.shareConfig,
				        callback: function() {}
				    }, {
				        type: "page_refresh",
				        name: "刷新"
				    }]
				};
		};
		//业务初始化
		c.init = function() {

			//参数检查和初始化
			if (p.init()) {
				//声明播放器
				window.ddplayer = m.player = new Player(p.playerConfig);
				p.$btnGet = $('.' + p.clsBtnGet);
				p.$btnShare = $('#' + p.idBtnShare);
				p.$wrongLayer = $('#' + p.idWrongLayer);
				//事件初始化
				c.eventInit();
				//生成播放器
				m.player.htmlTo($('#' + p.playerConId));

				if(vars.IsDiDiBrowser){
					m.initEntranceConfig();
					bridge.initEntrance(p.entranceConfig);
					bridge.showEntrance();
					p.$btnShare.show();
				}
				//有些机型键盘出来会缩小webview高度，会导致页面错乱，初始化就给body设置成clientHeight
				$('body').css('height', $(window).height());
				//统计
				var _send = DidiMonitor.sendBeatles;

				_send('sfc-video-150922_index_sw',null,true);
			}
		};

		//事件初始化
		c.eventInit = function() {
			var cp = c.process;
			//开始播放 更改body背景
			m.player.on('play', function(){
				
				if(!p.isPlayed){
					//通过添加class改变body背景
					$('body').addClass('played');
					//隐藏猛戳Get button
					p.$btnGet.hide();
					//改变标识为
					p.isPlayed = true;
				}
			});
			//猛戳get 播放
			p.$btnGet.on(vars.END_EVENT, function(){
				if(m.player){
					m.player.$midPlay.trigger(vars.END_EVENT);
				}
			});
			//播放结束逻辑
			m.player.on('ended', function() {
				cp.ended();

				return false;
			});
			//分享
			cp.share();
			//横竖屏
			cp.orient();
		};

		//事件处理
		c.process = {};

		//播放结束处理
		c.process.ended = function() {
			
		};
		//分享
		c.process.share = function(){
			
			p.$btnShare.on(vars.END_EVENT, function(){
				bridge && bridge.invokeEntrance();
			});
			initWxShare(p.wxShareConfig);
		};
		//横竖屏处理
		c.process.orient = function(){
			$(window).bind('orientationchange', function(e){
				if (window.orientation == 0 || window.orientation == 180) {
				    p.$wrongLayer.hide();
				    $('html').removeClass('orientation');
				}
				else if ((window.orientation == 90 || window.orientation == -90) && !p.isPlayed) {
				    p.$wrongLayer.show();
				}else{
					// m.player.$ctrlFullScreen.trigger('click');//此处用click会失效
					m.player.$ctrlFullScreen.trigger(vars.END_EVENT);
					$('html').addClass('orientation');
				}
			});
		};
		c.init();
	});
};
init(); 
});