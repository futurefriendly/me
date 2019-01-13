// 开发环境不需要配置，所有代码都唯一指向src文件夹下
// 测试环境的配置，因为源代码中关于专车的接口就已经是线上路径了，所以需要变更为测试环境
var devCfg = [{
    pattern: '/static/webapp/src/',
    replacement: '/static/webapp/'
}, {
    pattern: 'http://static.udache.com/gulfstream/webapp/js/biz.min.js',
    replacement: 'http://static.udache.com/gulfstream/webapp/js/biz.min.js'
}, {
    pattern: 'http://api.udache.com/gulfstream/api/v1/webapp/pIndex',
    replacement: 'http://api.udache.com/gulfstream/api/v1/webapp/pIndex'
}, {
    pattern: 'http://api.udache.com/gulfstream/api/v1/webapp/pGetFlag',
    replacement: 'http://api.udache.com/gulfstream/api/v1/webapp/pGetFlag'
}, {
    pattern: 'http://api.udache.com/gulfstream/api/v1/webapp/',
    replacement: 'http://api.udache.com/gulfstream/api/v1/webapp/'
}];

// 上线配置，因为源代码中关于专车的接口就已经是线上路径了，所以不需要变更
var releaseCfg = [{
    pattern: '/static/activity/',
    replacement: 'http://static.xiaojukeji.com/activity/'
}];

// 单个文件配置
var file = {
    src: './page_portal.css',
    dest: '../'
};

// 要合并构建的文件配置
var files = [{
    src: ['./css/dd.common.css', './css/dd.ui.css'],
    name: 'merged-common-ui.css',
    dest: './css/'
}, {
    src: ['./lib/dd.base.js', './lib/dd.dialog.js', './lib/color.js', './js/p-hold.js'],
    name: 'merged-base-dialog-color-hold.js',
    dest: './js/'
}, {
    src: ['./lib/dd.base.js', './lib/sha1.js'],
    name: 'merged-base-sha1.js',
    dest: './js/'
}, {
    src: ['./lib/dd.base.js', './lib/dd.dialog.js'],
    name: 'merged-base-dialog.js',
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
    gulp.src(file.src).pipe(frep(cfg)).pipe(getHandler(file.src)()).pipe(gulp.dest(file.dest));

    for (var i = 0, l = files.length; i < l; i++) {
        var item = files[i];
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
