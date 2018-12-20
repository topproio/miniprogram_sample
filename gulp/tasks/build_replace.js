module.exports = function (gulp, plugin, config) {
    gulp.task('build:replace', () => {
        gulp.src([config.dist_wxml_path, config.dist_wxss_path])
            .pipe(replace(/[\.|\.\.\/]+[(a-z0-9A-Z_)+/]+(\.jpg|\.png)/g, function (match) {
                return match.replace(/^[(\.)|(\.\.)\/]+/, uploadOption.viewPath);
            }))
            .pipe(gulp.dest(config.dist_path));
    });
}