var gulp = require('gulp');
//var frep = require('gulp-frep');
//var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

function jsmin() {
    gulp.src('./js/*.js').pipe(uglify()).pipe(gulp.dest('../js/'));
}

function cssmin() {
    gulp.src('./css/*.css').pipe(minifyCSS()).pipe(gulp.dest('../css/'));
}

gulp.task('default', function() {
    jsmin();
    cssmin();
});

gulp.task('jsmin', function() {
    jsmin();
});

gulp.task('cssmin', function() {
    cssmin();
});
