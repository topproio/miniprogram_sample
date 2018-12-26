module.exports = function (gulp, plugin, config) {
    gulp.task('build:uploadimage',() => {
        uploadImgsAndGetMapper().then((res) => {
            console.log(res)
        });
    });
    var uploadMapper = {};
    async function uploadImgsAndGetMapper(){
        await (function() {
            gulp.src(['dist/**/*.wxml', 'dist/**/*.wxss'])
                .pipe(plugin.through.obj(function (file, enc, callback) {
                    this.push(file.path);
                    callback();
                }))
                .on('data', function (xmlPath) {
                    // 获取当前（.wxml,.wxss）文件的绝对路径，并处理为gulp能读出的路径
                    xmlPath = xmlPath.replace(/\\/g, '/');
                    xmlPath = xmlPath.replace(/^[\w:/\\\-]*dist/, 'dist');
                    gulp.src([xmlPath], {base: 'dist'})
                    // 对全文进行匹配，只要符合../../xxx/xxx.jpg这种格式的字符串进行替换
                        .pipe(plugin.replace(/[\.|\.\.\/]+[(a-z0-9A-Z_)+/]+(\.jpg|\.png)/g, function (imgPath) {
                            // 根据文件的绝对路径和照片的相对路径计算出照片的绝对路径
                            var relPath = getImgPath(imgPath, xmlPath);
                            gulp.src(['src/' + relPath])
                                .pipe(plugin.rev())
                                .pipe(plugin.upload({qn: config.uploadOptions}))
                                .pipe(plugin.through.obj(function (file, enc, callback) {
                                    var pathDev = file.path;
                                    var relPathDev = pathDev.slice(pathDev.indexOf('src')+4,pathDev.length).replace(/\\/g,'/');
                                    !uploadMapper[xmlPath] && (uploadMapper[xmlPath] = []);
                                    uploadMapper[xmlPath].push({
                                        resource: imgPath,
                                        cdn_resource: config.uploadViewPath + relPathDev
                                    });
                                    plugin.fs.writeFile('../../mapper/imgsCDN.json', JSON.stringify(uploadMapper, null, 4), () => {});
                                    callback();
                                }));
                            // 返回静态服务器的前缀加上相对路径即为显示路径
                            //return config.uploadViewPath + relPath;
                            return imgPath;
                        }))
                        .pipe(gulp.dest('dist'));
                });
        })();
        return 'ok'
    }

};
function getImgPath(imgPath, xmlPath){
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

