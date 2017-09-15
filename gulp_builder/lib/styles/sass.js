'use strict';

/**
 * sass: Compile from sass, add vendor prefixes and write sourcemap
 */
module.exports = function (gb) {

    gb.gulp.task('sass', ['get-style-directories'], function () {

        var sass = require('gulp-sass'),
            sourcemaps = require('gulp-sourcemaps'),
            prefix = require('gulp-autoprefixer'),
            promises = [];

        //compile the style main style sheet from the source Sass
        var buildSass = function (options) {

            var deferred = gb.Q.defer(),
                stream = gb.gulp.src(options.scssPath + '/[^_]*.s+(a|c)ss')
                    .pipe(sourcemaps.init())
                    .pipe(sass())
                    .pipe(prefix({
                        browsers: ['last 5 versions', 'ie 9']
                    }))
                    .pipe(sourcemaps.write('./'))
                    .pipe(gb.gulp.dest(options.cssPath));

            //when stream completed set promise to resolved
            stream.on('end', function () {
                deferred.resolve();
            });

            return deferred.promise;

        };

        //build styles for each directory
        for ( var i = 0; i < gb.allStyleDirectories.length; i++ ) {
            promises.push(buildSass(gb.allStyleDirectories[i]));
        }

        return gb.Q.all(promises);

    });

};
