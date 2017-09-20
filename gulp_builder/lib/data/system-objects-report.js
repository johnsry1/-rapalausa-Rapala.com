'use strict';

module.exports = function (gb) {

    gb.gulp.task('system-objects-report', function() {

        var path = gb.deployment.archivePath + '/' + gb.deployment.archiveName + '/meta/system-objecttype-extensions.xml';

        gb.createSystemObjectsReport(path);

    });

};
