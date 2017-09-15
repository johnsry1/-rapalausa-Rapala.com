'use strict';

/**
 * bless: Create split IE CSS for 4095 selector limit
 */
module.exports = function (gb) {

    gb.gulp.task('bless', ['minify'], function () {

        var bless = require('gulp-bless'),
            promises = [];

        //create the split style sheet from the minified Sass
        var blessStyles = function (localePath) {

            var deferred = gb.Q.defer(),
                stream = gb.gulp.src([localePath + '/*.min.css'])
                    .pipe(bless())
                    .pipe(gb.gulp.dest(localePath.replace('/css', '/ie-css')));

            //when stream completed set promise to resolved
            stream.on('end', function () {
                deferred.resolve();
            });

            return deferred.promise;

        };

        for ( var i = 0; i < gb.allStyleDirectories.length; i++ ) {
            promises.push(blessStyles(gb.allStyleDirectories[i].cssPath));
        }

        return gb.Q.all(promises);

    });

};
