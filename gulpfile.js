var gulp = require('gulp');
var sass = require('gulp-sass');

// Watch Sass and convert to css
gulp.task('styles', function () {
    gulp.src('./src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src'));
});
gulp.task('watch-sass', function () {
    gulp.watch('./src/*.scss ', ['styles']);
});
