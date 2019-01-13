// 开发环境的配置，滴滴顺风车 车主招募静态资源
var devCfg = [{
    pattern: '/static/pinche/common/src/',
    replacement: '/static/pinche/common'
}, {
    pattern: 'http://test.diditaxi.com.cn/static/pinche/common/src/',
    replacement: 'http://static.xiaojukeji.com/pinche/common/'
}];

// 上线配置，因为源代码中关于专车的接口就已经是线上路径了，所以不需要变更
var releaseCfg = [{
    pattern: '/static/pinche/common/src/',
    replacement: 'http://static.xiaojukeji.com/pinche/common/'
}];

var minFiles = [{
    src: './css/dd.common.css',
    dest: '../css/'
},{
    src: './css/dd.ui.css',
    dest: '../css/'
},{
    src: './js/dd.base.js',
    dest: '../js/'
},{
    src: './js/dd.dialog.js',
    dest: '../js/'
},{
    src: './js/dd.slideSelect.js',
    dest: '../js/'
},{
    src: './js/dd.wechat.js',
    dest: '../js/'
}];

// 要合并构建的文件配置
var concatFiles = [{
    src: ['./css/dd.common.css', './css/dd.ui.css'],
    name: 'merged-common-ui.css',
    dest: './css/'
},{
    src: ['./js/dd.base.js', './js/dd.dialog.js'],
    name: 'merged-base-dialog.js',
    dest: './js/'
},{
    src: ['./js/dd.qrcode.base.js', './js/dd.qrcode.h5.js'],
    name: 'merged-qrcode.js',
    dest: './js/'
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

    concatFiles.forEach(function(file){
        gulp.src(file.src).pipe(concat(file.name)).pipe(gulp.dest(file.dest));
        gulp.src(file.dest + file.name).pipe(frep(cfg)).pipe(getHandler(file.name)()).pipe(gulp.dest('.' + file.dest));
    });

    minFiles.forEach(function(file){
        gulp.src(file.src).pipe(frep(cfg)).pipe(getHandler(file.src)()).pipe(gulp.dest(file.dest));
    });
};

gulp.task('default', function() {
    handler(devCfg);
});

gulp.task('release', function() {
    handler(releaseCfg);
});