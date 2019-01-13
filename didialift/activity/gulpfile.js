'use strict';
// 开发环境不需要配置，所有代码都唯一指向src文件夹下
// 测试环境的配置，因为源代码中关于专车的接口就已经是线上路径了，所以需要变更为测试环境
var devCfg = [{
    pattern: '/static/activity/src/',
    replacement: '/static/activity/'
}];

// 上线配置，因为源代码中关于专车的接口就已经是线上路径了，所以不需要变更
var releaseCfg = [{
    pattern: '/static/activity/src/',
    replacement: 'http://static.diditaxi.com.cn/activity/'
}, {
    pattern: '/static/activity/imgs/recommend/',
    replacement: 'http://static.diditaxi.com.cn/activity/imgs/recommend/'
}, {
    pattern: 'http://test.diditaxi.com.cn/activity/hongbao/c_recommend/',
    replacement: 'http://pay.xiaojukeji.com/activity/hongbao/c_recommend/'
}];

// 单个文件配置
var singleCfg = [{
    src: './css/base/src/merged-common-ui.css',
    dest: './css/base/'
}, {
    src: './css/recommend/src/pasger-to-pasger.css',
    dest: './css/recommend/'
}, {
    src: './lib/src/dd.share.js',
    dest: './lib/'
}, {
    src: './js/recommend/src/pasger-to-pasger.js',
    dest: './js/recommend/'
}];

// 要合并构建的文件配置
var concatCfg = [{
    src: ['./lib/src/dd.base.js', './lib/src/dd.dialog.js'],
    name: 'merged-base-dialog.js',
    dest: './lib/'
}];

/***********************************************以上是配置文件*******************************************/

var gulp = require('gulp');
var frep = require('gulp-frep');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

var mapPattern = function(array) {
    var item = null;
    for (var i = array.length - 1; i >= 0; i--) {
        item = array[i];
        item.pattern = new RegExp(item.pattern, 'ig');
    }
};

var getHandler = function(filename) {
    var ext = filename.split('.').pop();
    var min = ext === 'js' ? uglify : minifyCSS;
    return min;
};

var handler = function(cfg) {
    mapPattern(cfg);

    for (var i = 0, l = singleCfg.length; i < l; i++) {
        var it = singleCfg[i];
        gulp.src(it.src).pipe(frep(cfg)).pipe(getHandler(it.src)()).pipe(gulp.dest(it.dest));
    }

    for (var j = 0, k = concatCfg.length; j < k; j++) {
        var item = concatCfg[j];
        gulp.src(item.src).pipe(concat(item.name)).pipe(gulp.dest(item.dest));
        gulp.src(item.dest + item.name).pipe(frep(cfg)).pipe(getHandler(item.name)()).pipe(gulp.dest('.' + item.dest));
    }
};

gulp.task('default', function() {
    handler(devCfg);
});

gulp.task('release', function() {
    handler(releaseCfg);
});
