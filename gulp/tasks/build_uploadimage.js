module.exports = function (gulp, plugin, config) {
    gulp.task('build:uploadimage', () => {
        gulp.src([config.jpg_path, config.png_path], {base: config.src_path})
            .pipe(upload({qn: config.uploadOptions}));
    });
};
