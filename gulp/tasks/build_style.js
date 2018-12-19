module.exports = function (gulp, plugin, config) {
    gulp.task('build:style', () => {
        gulp.src(config.less_path, {base: config.src_path})
            .pipe(plugin.less())
            .pipe(plugin.cssnano({
                zindex: false,
                autoprefixer: false,
                discardComments: {removeAll: true}
            }))
            .pipe(plugin.rename((path) => {
                path.extname = '.wxss';
            }))
            .pipe(gulp.dest(config.dist_path));
    });
};
