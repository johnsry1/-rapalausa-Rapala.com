'use strict';

/**
 * eslint-builder-js: Make sure that the Javascript follows the given
 * formatting guidelines (contained in .eslintrc.json)
 */
module.exports = function (gb) {

    gb.gulp.task('eslint-builder-js', function() {

        var eslint = require('gulp-eslint');

        return gb.gulp.src(['./gulpfile.js', './lib/**/*.js'])
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());

    });

};
