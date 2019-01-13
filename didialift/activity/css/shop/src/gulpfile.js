/**
 * 引入gulp对象
 * @type {Gulp|exports}
 */
var gulp = require('gulp');
var replace = require('gulp-replace');
var minifyCSS = require('gulp-minify-css');
var hash_src = require("gulp-hash-src");


//单个文件
var path = {
    src: './*.css',
    dest: '../'
};


/**
 *
 * 只支持href=,src=,url()三种形式的替换，如果需要匹配自定义的asyncLoadJs需要自己去修改源码更改中的正则表达式
 * 不需要修改任何html结构，直接搞即可
 * @type {[type]}
 */
/*gulp.task("hash-src", function() {
    gulp.src(path.src)
        .pipe(hash_src({
            build_dir: "/", //js/css/images所在的文件根目录
            src_path: "./", //要替换引用的html文件目录
            hash: 'md5',
            enc: 'hex', //hex，base64
            exts: ['.js', '.css'],
            query_name: "v"
        }))
        .pipe(gulp.dest(path.dest));
});*/

/**
 * gulp-replace
 */
gulp.task('replace', function() {
    gulp.src(path.src)
        .pipe(replace('/static/activity/', 'http://static.diditaxi.com.cn/activity/'))
        .pipe(gulp.dest(path.dest));
});

/**
 * html-compressor
 */
gulp.task('min', function() {
    gulp.src('.' + path.src).pipe(minifyCSS()).pipe(gulp.dest(path.dest));
});