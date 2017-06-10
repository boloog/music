var gulp = require('gulp');
// 引入组件
var minifycss = require('gulp-minify-css'),     // CSS压缩
    uglify = require('gulp-uglify'),            // js压缩
    concat = require('gulp-concat'),            // 合并文件
    rename = require('gulp-rename'),            // 重命名
    clean = require('gulp-clean'),              // 清空文件夹
    jshint = require('gulp-jshint'),            // js代码规范性检查
    imagemin = require('gulp-imagemin'),        // 图片压缩
    less = require('gulp-less');

gulp.task('css', function(){
    gulp.src('./css/*.css')
        .pipe(concat('style.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('less', function () {
    gulp.src(['./less/*.less','!./less/{reset,test}.less'])
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('js', function(){
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('index.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('img', function(){
    gulp.src('./images/*')
        .pipe(imagemin({optimizationLevel:5}))
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('clear', function(){
    gulp.src('dist/*',{ read: false})
        .pipe(clean());
});

gulp.task('default', ['css', 'less', 'js', 'img']);