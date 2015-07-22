var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),

    path = require('path');


// compiling less
gulp.task('less', function () {
    gulp.src('./public/less/main.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'public', 'less') ]
        }))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./public/css'));

    gulp.src('./public/less/api.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'public', 'less') ]
        }))
        .pipe(gulp.dest('./public/css'));
});

// minifying js and css
gulp.task('css', function () {
    return gulp.src('./public/css/*.css')
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public/css'));
});

// right now is too inconvenient to debugging with compression
gulp.task('js', function () {

    return gulp.src('./public/js/app/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/libs'));

});


// watch for changes
gulp.task('watch', function() {
    //gulp.watch('./public/js/app/**/*.js', ['js']);
    gulp.watch('./public/less/*.less', ['less']);
    gulp.watch('./public/css/*.css', ['css']);
});


// Default Task
gulp.task('default', ['less', 'css', 'watch']);
