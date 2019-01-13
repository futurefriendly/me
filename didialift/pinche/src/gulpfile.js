// 开发环境的配置，滴滴顺风车 车主招募静态资源
var devCfg = [{
    pattern: '/static/pinche/src/',
    replacement: '/static/pinche/'
}, {
    pattern: 'http://test.diditaxi.com.cn/static/pinche/src/',
    replacement: 'http://static.xiaojukeji.com/pinche/'
}];

// 上线配置，因为源代码中关于专车的接口就已经是线上路径了，所以不需要变更
var releaseCfg = [{
    pattern: '/static/pinche/src/',
    replacement: 'http://static.xiaojukeji.com/pinche/'
}];

var minFiles = [{
    src: './js/iscroll-lite.js',
    dest: '../js/'
},{
    src: './css/tenday_main.css',
    dest: '../css/'
}
// ,{
//     src: './lib/*.js',
//     dest: '../lib/'
// },{
//     src: './js/app-share.js',
//     dest: '../js/'
// },{
//     src: './css/merged-common-ui.css',
//     dest: '../css/'
// },{
//     src: './css/dd.common.css',
//     dest: '../css/'
// },{
//     src: './css/dd.ui.css',
//     dest: '../css/'
// }
// ,{
//     src: './lib/dd.base.js',
//     dest: '../lib/'
// },{
//     src: './lib/dd.dialog.js',
//     dest: '../lib/'
// },{
//     src: './lib/dd.slideSelect.js',
//     dest: '../lib/'
// }
];

// 要合并构建的文件配置
var concatFiles = [{
    src: ['./css/dd.common.css', './css/dd.ui.css'],
    name: 'merged-common-ui.css',
    dest: './css/'
},{
    src: ['./lib/dd.base.js', './lib/dd.dialog.js'],
    name: 'merged-base-dialog.js',
    dest: './js/'
},{
    src: ['./lib/dd.qrcode.base.js', './lib/dd.qrcode.h5.js'],
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