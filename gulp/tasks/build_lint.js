module.exports = function (gulp, plugin, config) {
    gulp.task('build:lint', () => {
        gulp.src(config.js_path)
            .pipe(plugin.eslint({
                configFile: config.eslintrc_path
            }))
            .pipe(plugin.eslint.format());
    });
};
