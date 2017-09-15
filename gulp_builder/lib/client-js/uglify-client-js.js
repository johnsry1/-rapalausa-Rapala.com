'use strict';

/**
 * uglify-client-js: Minify the JavaScript for every site
 */
module.exports = function (gb) {

    gb.gulp.task('uglify-client-js', ['client-js', 'combine-plugin-js'], function() {

        var uglify = require('gulp-uglify'),
            rename = require('gulp-rename'),
            uglifiedFiles = [];

        var uglifyFiles = function (paths) {

            var deferred = gb.Q.defer(),
                stream = gb.gulp.src(paths.src)
                            .pipe(uglify())
                            .pipe(rename({extname:'.min.js'}))
                            .pipe(gb.gulp.dest(paths.dest));

          //when stream completed set promise to resolved
            stream.on('end', function () {
                deferred.resolve();
            });

            return deferred.promise;

        };

        for ( var i = 0; i < gb.sites.length; i++ ) {
            var jsPath = '../' + gb.sites[i].publicJavascript + '/cartridge/static/default/js';

            uglifiedFiles.push(uglifyFiles({
                src: [jsPath + '/**/*.js', '!' + jsPath + '/**/*.min.js'],
                dest: jsPath
            }));
        }

        return gb.Q.all(uglifiedFiles);

    });

};
