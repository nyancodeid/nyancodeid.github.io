var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function() {
 return gulp.src('css/*.css')
	.pipe(concat("style.css"))
	.pipe(gulp.dest('dist/'))
	.pipe(rename("style.min.css"))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
	.pipe(uglifycss())
	.pipe(gulp.dest("dist/css"));
});


gulp.task('js', function() {
 return gulp.src('js/*.js')
	.pipe(concat("master.js"))
	.pipe(gulp.dest('dist/'))
	.pipe(rename("master.min.js"))
	.pipe(uglify())
	.pipe(gulp.dest("dist/"));

});

gulp.task('js-min', function() {
 return gulp.src('dist/*.js')
	.pipe(uglify())
	.pipe(gulp.dest("dist/"));
});


