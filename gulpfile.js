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


const uploadOption = require('./uploadOption.js');
    upload = require('gulp-qndn').upload,//七牛上传
    replace = require('gulp-replace');

gulp.task('build:uploadimage', () => {
    gulp.src(['src/**/*.jpg','src/**/*.png'],{ base: 'src' })
        .pipe(upload({qn: uploadOption.qnOption}));
})

gulp.task('build:replace', () => {
    gulp.src(['dist/**/*.wxml','dist/**/*.wxss'])
        .pipe(replace(/[\.|\.\.\/]+[(a-z0-9A-Z_)+/]+(\.jpg|\.png)/g, function(match){
            return match.replace(/^[(\.)|(\.\.)\/]+/,uploadOption.viewPath);
        }))
        .pipe(gulp.dest('dist'));
})

gulp.task('default', ['watch', 'build:lint', 'build:style', 'build:page']);
gulp.task('uploadImg', ['build:uploadimage', 'build:replace']);

gulp.task('watch', () => {
    gulp.watch('src/**', ['build:lint', 'build:style', 'build:page']);
});

