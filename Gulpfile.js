var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    runSeq = require('run-sequence'),
    runSeq = require('run-sequence'),
    concat = require('gulp-concat'),
    runSeq = require('run-sequence'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver');

//编译less
var lessMap = require('./gulp/lessMap.js');
gulp.task('less', function () {
    //less编译映射文件
    for (var i = 0; i < lessMap.length; i++) {
        gulp.src(lessMap[i].src)
        .pipe(plumber())//防止异常
        .pipe(less())
        .pipe(gulp.dest(lessMap[i].to));
    }
});


//minifyCSS
gulp.task('minify-css', function() {
  gulp.src('source/css/**/*.css')
    .pipe(minifyCSS({keepBreaks:true}))     //keepBreaks是否保留空格、换行
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
});

//uglify js
gulp.task('uglify-js', function() {
  gulp.src('./source/js/normal/**/*.js')
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./dist/js'))
});


//js规范验证
gulp.task('jshint', function(){
  return gulp.src(['gulpfile.js', 'source/js/normal/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


//合并js文件
var concatTasks = require('./gulp/concatTasks');
var concatTaskNames = Object.keys(concatTasks).map(function(name){
  var taskName = 'concat:' + name,
      task = concatTasks[name];

  gulp.task(taskName, function(){
    return gulp.src(task.src, { cwd: task.cwd })
      .pipe(concat(task.name || 'test.js'))
      .pipe(gulp.dest(task.dest));
  });

  return taskName;
});

gulp.task('concat', function(cb){
  runSeq(concatTaskNames, cb);
});


//清除文件夹
gulp.task('clean', function(){
    del(['dist/'], function (err) {
        console.log('Files deleted');
    });
});

//注册监听
gulp.task('watch', function() {
    global.isWatching = true;
    gulp.watch('source/less/**/**.less', ['less']);
});

//打包css
gulp.task('dist-css', function(){
    runSeq('less', 'minify-css');
});

//打包js
gulp.task('dist-js', function(){
    runSeq('uglify-js');
});

//打包文件
gulp.task('dist', function(){
    del(['dist/'], function (err) {
        console.log('Files deleted');
        runSeq('dist-js', 'dist-css');
    });
});

//本地文件服务器
gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

//默认监听以及打开本地文件服务器
gulp.task('default', function(){
    runSeq('watch', 'webserver');
});





