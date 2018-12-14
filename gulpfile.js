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

// 以下为一些测试
gulp.task('test', ['test:save2',]);

gulp.task('test:save2',() => {
    gulp.src(['dist/**/*.wxml','dist/**/*.wxss'])
        .pipe(through.obj(function(file, enc, callback){
            this.push(file.path);
            callback()
        }))
        .on('data',function(xmlPath){
            console.log(xmlPath)
            xmlPath.replace('\\','/')
            console.log(path.resolve('../../img/2.jpg'))
            gulp.src(['dist/pages/test.wxml'])
                .pipe(replace(/[\.|\.\.\/]+[(a-z0-9A-Z_)+/]+(\.jpg|\.png)/g, function(imgPath){
                    //this.push(match)
                    //getImgPath(imgPath,xmlPath)
                    //console.log(imgPath,xmlPath)
                    //return match.replace(/^[(\.)|(\.\.)\/]+/,uploadOption.viewPath)

                    return imgPath;
                }))
        })
})


function getImgPath(imgPath,xmlPath){
    console.log('xml',xmlPath)
    console.log('img',imgPath)
    var imgPathArr = imgPath.split("/")
    var xmlPathArr = xmlPath.split("\\")
    var dirPathArr = __dirname.split("\\")
    xmlPathArr = xmlPathArr.slice(xmlPathArr.indexOf(dirPathArr.pop())+1,xmlPathArr.length)
    // xmlPathArr.indexOf(dirPathArr.pop())
    xmlPathArr.pop()
    var abslutePath = dgOfChangePath(imgPathArr)
    console.log('over',xmlPathArr)
    console.log('___________________________________')
    console.log('___________________________________')
    function dgOfChangePath(imgPathArr){
        if(imgPathArr.length == 0)return
        var curr = imgPathArr.shift()
        if(curr === ".."){
            xmlPathArr.pop()
            dgOfChangePath(imgPathArr)
        }else if(curr === "."){
            dgOfChangePath(imgPathArr)
        } else if(/[a-zA-Z0-9_]+(.png|.jpg|.jpeg)$/.test(curr)){
            xmlPathArr.push(curr)
        }else {
            //xmlPathArr.pop()
            xmlPathArr.push(curr)
            dgOfChangePath(imgPathArr)
        }

    }
    return
}
function getRootPath(dir,path){

}
function GetAbsoluteUrl(oldUrl, relativeUrl, domain)
{
    var result = "";
    var virtualPath = oldUrl;
    if (!oldUrl.ToLower().Contains("http://")) //oldUrl不以http://开头，无法比较
    {
        return relativeUrl;
    }
    var fromDomain = domain;
    if (fromDomain.LastIndexOf("/") == fromDomain.Length - 1)
    {
        fromDomain = fromDomain.Substring(0, fromDomain.Length - 1);
    }
    if (relativeUrl.IndexOf("/") == 0)
    {
        result = domain + relativeUrl;
    }
    else
    {
        var oldUrl1 = oldUrl.Substring(7);
        if (oldUrl1.IndexOf("/") != -1)
            oldUrl1 = oldUrl1.Substring(0, oldUrl1.LastIndexOf("/"));
        while (relativeUrl.IndexOf("../") != -1)
        {
            relativeUrl = relativeUrl.Replace("../", "");
            oldUrl1 = oldUrl1.Substring(0, oldUrl1.LastIndexOf("/"));
        }
        result = preHttp + oldUrl1 + "/" + relativeUrl;
    }
    return result;
}
