'use strict';

/**
 * delete-temp-client-js: Remove the temporary directories from the working path
 */
module.exports = function (gb) {

    gb.gulp.task('delete-temp-client-js', ['client-js'], function() {
        var del = require('del');
        return gb.gulp.src(gb.workingPath + '/temp-*')
           .pipe(gb.vinylPaths(del));
    });

};
