var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  css: ['./www/css/**/*.css'],
  js: ['./www/js/**/*.js'],
  html: ['./www/index.html', './www/templates/**/*.html'],
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('js', function(done) {
  gulp.src(paths.js)
    .pipe(connect.reload())
    .on('end', done);
});
 
gulp.task('css', function(done) {
  gulp.src(paths.css)
    .pipe(connect.reload())
    .on('end', done);
});
 
gulp.task('html', function(done) {
  gulp.src(paths.html)
    .pipe(connect.reload())
    .on('end', done);
});
 
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.html, ['html']);
});
 
gulp.task('default', ['watch', 'server']);

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
