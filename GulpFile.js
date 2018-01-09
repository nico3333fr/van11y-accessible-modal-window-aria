var gulp  = require('gulp'),
    babel   = require('gulp-babel'),
    rename   = require('gulp-rename'),
    header  = require('gulp-header'),
    uglify = require('gulp-uglify');

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %> : https://github.com/nico3333fr/van11y-accessible-modal-window-aria/blob/master/LICENSE',
  ' */',
  ''].join('\n');
	
gulp.task('default', ['es5'], function() {

  gulp
	.src(['./src/*.js', '!./src/*.es6.js'])
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
	.pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'));

  gulp
    .src('./src/*.es6.js')
    .pipe(gulp.dest('./dist'));
});



gulp.task('es5', function() {
  gulp
    .src('./src/*.es6.js')
    .pipe(babel())
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(uglify())
	.pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest('./dist'))
});