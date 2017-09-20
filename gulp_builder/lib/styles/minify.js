'use strict';

/**
 * minify: Create minified CSS files
 */
module.exports = function (gb) {

    gb.gulp.task('minify', ['sass'], function () {

        var cssNano = require('gulp-cssnano'),
            rename = require('gulp-rename'),
            promises = [];

        // Compile the style main style sheet from the source Sass
        var minifyStyles = function (localePath) {

            var deferred = gb.Q.defer(),
                stream = gb.gulp.src([localePath + '/*.css', '!' + localePath + '/*.min.*'])
                    .pipe(cssNano())
                    .pipe(rename({suffix: '.min'}))
                    .pipe(gb.gulp.dest(localePath));

            //when stream completed set promise to resolved
            stream.on('end', function () {
                deferred.resolve();
            });

            return deferred.promise;

        };

        //minify styles for each directory
        for ( var i = 0; i < gb.allStyleDirectories.length; i++ ) {
            promises.push(minifyStyles(gb.allStyleDirectories[i].cssPath));
        }

        return gb.Q.all(promises);

    });

};
