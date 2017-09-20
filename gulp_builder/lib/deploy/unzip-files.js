'use strict';

module.exports = function (gb) {

    gb.gulp.task('unzip-files', ['webdav-upload'], function () {

        console.log('Decompressing the deployed archive...');

        var unzipCode = function (server, filename) {
            var deferred = gb.Q.defer(),
                url = 'https://' + server + gb.deployment.instanceRoot + gb.deployment.uploadPath + filename,
                unzipRequest = gb.request({
                    url: url,
                    method: 'POST',
                    auth: {
                        user: gb.deployment.user,
                        pass: gb.deployment.password
                    },
                    form: {
                        method: 'UNZIP'
                    },
                    jar: true,
                    rejectUnauthorized: false
                });

            unzipRequest.on('response', function (response) {

                if (response.statusCode === 201) {
                    console.log('Code unzipped on ' + server);
                } else if (response.statusCode === 404) {
                    deferred.reject(new Error('Given file', filename, 'not found'));
                    return;
                } else {
                    deferred.reject(new Error('Unknown Error: ' + response.statusCode));
                    return;
                }

                var deleteRequest = gb.request({
                    url: url,
                    method: 'POST',
                    auth: {
                        user: gb.deployment.user,
                        pass: gb.deployment.password
                    },
                    form: {
                        method: 'DELETE'
                    },
                    jar: true,
                    followRedirect: true,
                    rejectUnauthorized: false
                });

                deleteRequest.on('response', function (response) {

                    if (response.statusCode === 204) {
                        console.log('Zip file deleted.');
                        deferred.resolve();
                    } else {
                        deferred.reject(new Error('Unknown Error: ' + response.statusCode));
                    }

                    return;

                });

            });

            return deferred.promise;
        };

        if (gb.deployment.instances) {
            var unzipInstances = [];

            for (var i in gb.deployment.instances) {
                for (var j = 0; j < gb.deployment.archiveFilenames.length; j++) {
                    unzipInstances.push(unzipCode(gb.deployment.instances[i], gb.deployment.archiveFilenames[j]));
                }
            }
        } else {
            console.error('Please enter an `instances` list in the configuration.');
        }

        return gb.Q.all(unzipInstances);

    });

};
