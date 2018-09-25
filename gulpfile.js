const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const eslint = require('gulp-eslint');

gulp.task('build:lint', () => {
    gulp.src('src/**/*.js')
        .pipe(eslint({
            configFile: './.eslintrc.js'
        }))
        .pipe(eslint.format());
});

gulp.task('build:style', () => {
    gulp.src(['src/pages/**/*.less',
        'src/components/**/*.less',
        'src/app.less'], { base: 'src' })
        .pipe(less())
        .pipe(cssnano({
            zindex: false,
            autoprefixer: false,
            discardComments: { removeAll: true }
        }))
        .pipe(rename((path) => {
            path.extname = '.wxss';
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:page', () => {
    gulp.src(['src/**/*',
        '!src/**/*.less'], { base: 'src' })
        .pipe(rename((path) => {
            if (path.extname === '.html') {
                path.extname = '.wxml';
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('src/**', ['build:lint', 'build:style', 'build:page']);
});

gulp.task('default', ['watch', 'build:lint', 'build:style', 'build:page']);

