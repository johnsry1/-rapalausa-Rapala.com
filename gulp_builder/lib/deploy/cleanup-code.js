'use strict';

module.exports = function (gb) {

    gb.gulp.task('cleanup-code', ['webdav-upload'], function () {
        var del = require('del');
        console.log('Cleaning up code...');

        return del([
            'deploy/working/**/*',
            'deploy/output/**/*'
        ]);

    });

};
