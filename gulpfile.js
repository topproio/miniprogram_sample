const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const eslint = require('gulp-eslint');
const gulpLoadPlugins = require('gulp-load-plugins');
const {upload} = require('gulp-qndn');
const replace = require('gulp-replace');

const gulpTaskList = require('fs').readdirSync('./gulp/tasks/');
const config = require('./gulp/config.json');

gulpLoadPlugins.eslint = eslint;
gulpLoadPlugins.less = less;
gulpLoadPlugins.rename = rename;
gulpLoadPlugins.cssnano = cssnano;
gulpLoadPlugins.upload = upload;
gulpLoadPlugins.replace = replace;

gulpTaskList.forEach(function (taskFile) {
    require('./gulp/tasks/' + taskFile)(gulp, gulpLoadPlugins, config);
});


const uploadOption = require('./uploadOption.js');
    upload = require('gulp-qndn').upload,//七牛上传
    replace = require('gulp-replace');


gulp.task('default', ['watch', 'build:lint', 'build:style', 'build:page']);
gulp.task('uploadImg', ['build:uploadimage', 'build:replace']);

gulp.task('watch', () => {
    gulp.watch('src/**', ['build:lint', 'build:style', 'build:page']);
});

// 以下为一些测试
gulp.task('build:cdn',() => {
    uploadImgsAndGetMapper().then((res) => {
        console.log(res)
    });
});
var uploadMapper = {};
async function uploadImgsAndGetMapper(){
    await (function() {
        gulp.src(['dist/**/*.wxml', 'dist/**/*.wxss'])
            .pipe(through.obj(function (file, enc, callback) {
                this.push(file.path);
                callback();
            }))
            .on('data', function (xmlPath) {
                // 获取当前（.wxml,.wxss）文件的绝对路径，并处理为gulp能读出的路径
                xmlPath = xmlPath.replace(/\\/g, '/');
                xmlPath = xmlPath.replace(/^[\w:/\\\-]*dist/, 'dist');
                gulp.src([xmlPath], {base: 'dist'})
                // 对全文进行匹配，只要符合../../xxx/xxx.jpg这种格式的字符串进行替换
                .pipe(replace(/[\.|\.\.\/]+[(a-z0-9A-Z_)+/]+(\.jpg|\.png)/g, function (imgPath) {
                        // 根据文件的绝对路径和照片的相对路径计算出照片的绝对路径
                        var relPath = getImgPath(imgPath, xmlPath);
                        console.log(imgPath, xmlPath,relPath)
                        gulp.src(['src/' + relPath])
                            .pipe(rev())
                            .pipe(upload({qn: uploadOption.qnOption}))
                            .pipe(through.obj(function (file, enc, callback) {
                                !uploadMapper[xmlPath] && (uploadMapper[xmlPath] = []);
                                uploadMapper[xmlPath].push({
                                    resource: imgPath,
                                    cdn_resource: uploadOption.viewPath + relPath
                                });
                                fs.writeFile('./mapper/imgsCDN.json', JSON.stringify(uploadMapper, null, 4), () => {});
                                callback();
                            }));
                        // 返回静态服务器的前缀加上相对路径即为显示路径
                        return uploadOption.viewPath + relPath;
                    }))
                    .pipe(gulp.dest('dist'));
            });
    })();
    return 'ok'
}

function getImgPath(imgPath,xmlPath){
    var imgPathArr = imgPath.split(/[\\|/]/);
    var xmlPathArr = xmlPath.split(/[\\|/]/);
    var dirPathArr = __dirname.split("\\");
    xmlPathArr = xmlPathArr.slice(xmlPathArr.indexOf(dirPathArr.pop())+1,xmlPathArr.length);
    xmlPathArr.pop();
    dgOfChangePath(imgPathArr);
    function dgOfChangePath(imgPathArr){
        if(imgPathArr.length <= 0)return;
        var curr = imgPathArr.shift();
        if(curr === ".."){
            xmlPathArr.pop();
            dgOfChangePath(imgPathArr);
        }else if(curr === "."){
            dgOfChangePath(imgPathArr);
        } else if(/[a-zA-Z0-9_]+(.png|.jpg|.jpeg)$/.test(curr)){
            xmlPathArr.push(curr);
        }else {
            xmlPathArr.push(curr);
            dgOfChangePath(imgPathArr);
        }
    };
    xmlPathArr.shift() // 删除‘dist’
    return xmlPathArr.reduce((pre , next) => {
        return pre+'/'+next;
    });
}


