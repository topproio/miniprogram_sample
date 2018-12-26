const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const eslint = require('gulp-eslint');
const gulpLoadPlugins = require('gulp-load-plugins');
const {upload} = require('gulp-qndn');
const replace = require('gulp-replace');
const gulpTaskList = require('fs').readdirSync('./gulp/tasks/');
const through =  require('through2');
const fs = require('fs');
const rev = require('gulp-rev');
const config = require('./gulp/config.json');
gulpLoadPlugins.eslint = eslint;
gulpLoadPlugins.less = less;
gulpLoadPlugins.rename = rename;
gulpLoadPlugins.cssnano = cssnano;
gulpLoadPlugins.upload = upload;
gulpLoadPlugins.through = through;
gulpLoadPlugins.rev = rev;
gulpLoadPlugins.fs = fs;
gulpLoadPlugins.replace = replace;
gulpTaskList.forEach(function (taskFile) {
    require('./gulp/tasks/' + taskFile)(gulp, gulpLoadPlugins, config);
});
gulp.task('default', ['watch', 'build:lint', 'build:style', 'build:page']);
gulp.task('watch', () => {
    gulp.watch('src/**', ['build:lint', 'build:style', 'build:page']);
});
