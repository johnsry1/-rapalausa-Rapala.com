'use strict';

module.exports = function (gb) {

    gb.gulp.task('cleanup-data', ['webdav-upload'], function () {
        var del = require('del');
        console.log('Cleaning up data .zip files from: ' + gb.deployment.archivePath);

        return del([gb.deployment.archivePath + '/*.zip'], {force: true});
    });

};
