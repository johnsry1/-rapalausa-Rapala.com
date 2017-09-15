'use strict';

module.exports = function (gb, task) {

    var Webdav = require('../util/webdav');
    var dependencies = task.uploadDependencies || [];

    gb.gulp.task('webdav-delete', ['init-deployment'], function () {
        if (gb.deployment.overwriteRelease) {
            var uploads = [],
                webdavObj = new Webdav(gb);

            for (var i in gb.deployment.instances) {
                var destination;

                for (var j = 0; j < gb.deployment.archiveFilenames.length; j++) {
                    if (gb.deployment.instances[i] === 'staging' && gb.deployment.twoFactor === 'true') {
                        destination = 'https://cert.staging' + gb.deployment.instanceRoot + gb.deployment.uploadPath;
                    } else {
                        destination = 'https://' + gb.deployment.instances[i] + gb.deployment.instanceRoot + gb.deployment.uploadPath;
                    }

                    uploads.push(webdavObj.deleteDirectory(destination));
                }
            }

            return gb.Q.all(uploads);
        } else {
            console.log('overwriteRelease not set, ignoring webdav-delete');

            // Create a deferred object to satisfy the gulp task requirement
            var deferred = gb.Q.defer();
            deferred.resolve();

            return deferred.promise;
        }
    });

    gb.gulp.task('webdav-delete-data', ['init-deployment'], function () {
        var deletions = [],
            webdavObj = new Webdav(gb);

        for (var i in gb.deployment.instances) {
            var destination;

            for (var j = 0; j < gb.deployment.archiveFilenames.length; j++) {
                if (gb.deployment.instances[i] === 'staging' && gb.deployment.twoFactor === 'true') {
                    destination = 'https://cert.staging' + gb.deployment.instanceRoot + gb.deployment.uploadPath + gb.deployment.archiveFilenames[j];
                } else {
                    destination = 'https://' + gb.deployment.instances[i] + gb.deployment.instanceRoot + gb.deployment.uploadPath + gb.deployment.archiveFilenames[j];
                }

                deletions.push(webdavObj.deleteDirectory(destination));
            }
        }

        return gb.Q.all(deletions);
    });

    gb.gulp.task('webdav-upload', dependencies, function () {
        var uploads = [],
            webdavObj = new Webdav(gb);

        for (var i in gb.deployment.instances) {
            var destination, archiveFilename;

            for (var j = 0; j < gb.deployment.archiveFilenames.length; j++) {
                archiveFilename = gb.deployment.archiveFilenames[j];

                if (gb.deployment.instances[i] === 'staging' && gb.deployment.twoFactor === 'true') {
                    destination = 'https://cert.staging' + gb.deployment.instanceRoot + gb.deployment.uploadPath + archiveFilename;
                } else {
                    destination = 'https://' + gb.deployment.instances[i] + gb.deployment.instanceRoot + gb.deployment.uploadPath + archiveFilename;
                }

                uploads.push(webdavObj.uploadFile(destination, archiveFilename));
            }
        }

        return gb.Q.all(uploads);
    });

};
