'use strict';

/**
 * eslint-server-js: Make sure that the Javascript follows the given
 * formatting guidelines (contained in .eslintrc.json)
 */
module.exports = function (gb, task) {

    gb.gulp.task('eslint-server-js', function() {

        var eslint = require('gulp-eslint');

        console.log('Lint using following patterns as defined in config.json:', task.lintDirectories);

        return gb.gulp.src(task.lintDirectories)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());

    });

};
