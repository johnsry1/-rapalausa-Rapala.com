'use strict';

/**
 * eslint-client-js: Make sure that the Javascript follows the given
 * formatting guidelines (contained in .eslintrc.json)
 */
module.exports = function (gb) {

    gb.gulp.task('eslint-client-js', ['get-paths-client-js'], function() {

        var eslint = require('gulp-eslint');

        return gb.gulp.src(gb.allJavascriptFiles)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.results(function (results) {
                if (results.errorCount) {
                    console.log('JavaScript failed linting test. Deleting temp js directory.');
                    var del = require('del');
                    gb.gulp.src(gb.workingPath + '/temp-*')
                        .pipe(gb.vinylPaths(del));
                }
            }))
            .pipe(eslint.failAfterError());

    });

};
