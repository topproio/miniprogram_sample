module.exports = function (gulp, plugin, config) {
    gulp.task('build:page', () => {
        gulp.src(config.page_path, {base: config.src_path})
            .pipe(plugin.rename((path) => {
                if (path.extname === '.html') {
                    path.extname = '.wxml';
                }
            }))
            .pipe(gulp.dest(config.dist_path));
    });
};
