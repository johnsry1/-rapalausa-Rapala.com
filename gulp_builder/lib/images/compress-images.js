'use strict';

//TODO: Finish this task
module.exports = function (gb) {

    var imagemin = require('gulp-imagemin'),
        pngquant = require('imagemin-pngquant'); // $ npm i -D imagemin-pngquant

    gb.gulp.task('compress-images', function () {

        var imageDirectories = '../**/images/*';

        return gb.gulp.src(imageDirectories)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false}
                ],
                use: [pngquant()]
            }))
            .pipe(gb.gulp.dest('dist/images'));

    });

};
