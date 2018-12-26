module.exports = function (gulp, plugin, config) {
    gulp.task('build:replace', () => {
        replaceImgByJson();
    });

    function replaceImgByJson(){
        var mapper = require('../../mapper/imgsCDN.json');
        for(var i in mapper){
            var filePath = i;
            var imgs = mapper[i];
            imgs.forEach( i => {
                var imgPath = i.resource;
                var cdnPath = i.cdn_resource;
                gulp.src(filePath,{base: 'dist'})
                    .pipe(plugin.replace(imgPath, cdnPath))
                    .pipe(gulp.dest('dist'));
            });
        };
    };
};
