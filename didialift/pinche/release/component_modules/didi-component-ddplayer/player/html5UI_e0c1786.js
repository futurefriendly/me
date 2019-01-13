define("didi-component-ddplayer/player/html5UI.js",function(i,e,d){"use strict";{var s=ddvp.template,a=i("didi-component-ddplayer/base/vars.js"),l=(i("didi-component-ddplayer/base/special.js"),i("didi-component-ddplayer/player/settings.js")),t={},r={param:{},model:{},view:{},ctrl:{}},n=(r.param,r.model),o=r.view;r.ctrl}n.parseCache=function(i){var e={title:i.title||"",poster:i.poster||"",pointList:[{left:0}],mainId:i.mainId||"ddvp_main_1",height:i.height||"100%",width:i.width||"100%",srcType:i.srcType||"mp4",elemId:i.elemId||"",autoplay:i.autoplay||!1,defControls:i.defControls||!1,isInitSrc:!1,isIphone:a.IsIphone||!1,isUCBrowser:a.IsUCBrowser||!1,isQQBrowser:a.IsQQBrowser||!1,IsWeiXinBrowser:a.IsWeiXinBrowser||!1,isIphoneWeixinBrowser:a.IsWeiXinBrowser&&a.IsIphone||!1,curMode:i.modeType||"",curModeName:l.PLAY_MODE[i.modeType],selList:[]};return $.each(i.modeTypeList,function(i,d){if(d!==e.curMode){var s={mode:d,modeName:l.PLAY_MODE[d]};e.selList.push(s)}}),e},n.parseConfig=function(i){var e={mainId:i.mainId||"ddvp_main_1",height:i.height||"100%",width:i.width||"100%"};return e},o.videoTag=function(){var i='<div class="video"><% if (srcType === "client") { %><div data-noSupport="noSupport"<% } else { %><video<% } %> id="<%=elemId%>"<% if (autoplay) { %> autoplay<% } %><% if (isIphoneWeixinBrowser) { %> webkit-playsinline<% } %><% if (defControls) { %> controls<% } %> x-webkit-airplay="isHtml5UseAirPlay"<% if (autoplay) { %> preload="none"<% }%> src="<%=curPlayUrl%>" height="<%=height%>" width="<%=width%>"<% if (isIphone && !IsWeiXinBrowser) { %> style="position:absolute; left:-200%;"<% } else if (!autoplay && isUCBrowser) { %> style="display: none;"<% } %>></div>';return i},o.ctrl=function(){var i='<div class="player_controls ddvp_ctrl"><div class="mid ddvp_mid"><span class="mid_play ddvp_mid_play"><b></b></span><span class="mid_rewind_forward rewind ddvp_mid_rewind_forward" style="display:none;"><b class="mid_forward"></b><b class="mid_rewind"></b><span class="mid_time ddvp_mid_time">02:04</span></span></div><div class="slider_bar ddvp_ctrl_bar"><div class="left_btn_play"><div class="ddvp_ctrl_play"><b class="state_play"></b></div><div class="ddvp_ctrl_pause" style="display:none;"><b class="state_pause"></b></div></div><div class="action_trackBar ddvp_ctrl_track_bar"><% if (!((isUCBrowser || isQQBrowser) && isIphone)) { %><div class="trackbar"><b class="buffered ddvp_ctrl_buffer"></b><div class="click_area ddvp_ctrl_click_area"><div class="time_points ddvp_ctrl_points"><% for (var i = 0, l = pointList.length; i < l; i++) { %><em style="left:<%=pointList[i].left%>"></em><% } %></div></div><b class="played ddvp_ctrl_played_bar"><em class="handle ddvp_ctrl_drag_anchor"></em></b></div><% } %></div><% if (!((isUCBrowser || isQQBrowser) && isIphone)) { %><div class="time ddvp_ctrl_time"><b class="current_time ddvp_ctrl_cur_time">00:00</b> / <span class="duration ddvp_ctrl_duration" data-key="totalDuration" data-type="time">00:00</span></div><% } %><div class="controllers ddvp_ctrl_screen"><div class="fullscreen disabled ddvp_ctrl_full_screen"><span></span></div><div class="shrinkscreen disabled ddvp_ctrl_shrink_screen" style="display:none;"><span></span></div></div></div>';return i},o.playMode=function(){var i='<% if (curMode !== "" && selList.length > 0) { %><div class="quality_button quality_container ddvp_mid_mode<% if (selList.length > 2) { %> smaller<% } %>"><% if (selList.length > 0) { %><div class="quality_definition_button ddvp_mid_cur_mode_btn"><span class="ddvp_mid_cur_mode" data-mode="<%=curMode%>"><%=curModeName%></span></div><div class="quality_definition_list"><ul class="ddvp_mid_mod_list"><% for (var i = 0, l = selList.length; i < l; i++) { %><li data-mode="<%=selList[i].mode%>"><span><%=selList[i].modeName%></span></li><% } %></ul></div><% } %></div><% } %>';return i},o.video=function(){var i='<div class="player_main ddvp_player_main">'+o.videoTag()+'<div class="video_title ddvp_title"><strong><span class="ddvp_title_content title_content"><%=title%></span></strong></div><div class="poster ddvp_poster" style="background-image:url(<%=poster%>);"></div>'+o.ctrl()+o.playMode()+'<div class="mask-layer ddvp_mask_layer" style="display: none;"></div></div>';return i},o.loading=function(){var i='<div class="player inline_player" id="<%=mainId%>" style="height:<%=height%>; width:<%=width%>"><div class="ddvp_player_loading player_loading"></div><div class="ddvp_player_loading_notice player_loading_notice">努力加载中,请稍后...</div></div>';return i},t.makeVideoTmpl=function(i){var e=s.compile(o.video()),d=n.parseCache(i);return e(d)},t.makeLoadingTmpl=function(i){var e=s.compile(o.loading()),d=n.parseConfig(i);return e(d)},d.exports=t});