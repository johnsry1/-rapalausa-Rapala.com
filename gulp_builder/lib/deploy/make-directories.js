'use strict';

module.exports = function (gb) {

    gb.gulp.task('make-directories', ['init-deployment', 'webdav-delete'], function () {

        var makeDirectory = function (server) {
            var deferred = gb.Q.defer(),
                url = 'https://' + server + gb.deployment.instanceRoot + gb.deployment.uploadPath,
                mkdirRequest = gb.request({
                    url: url,
                    method: 'MKCOL',
                    auth: {
                        user: gb.deployment.user,
                        pass: gb.deployment.password
                    },
                    jar: true,
                    rejectUnauthorized: false
                });

            mkdirRequest.on('response', function (response) {

                if (response.statusCode === 201) {
                    console.log('Directory ' + gb.deployment.uploadPath + ' created on ' + server);
                    deferred.resolve();
                    return;
                } else if (response.statusCode === 405) {
                    console.log('Directory ' + gb.deployment.uploadPath + ' already existed on ' + server);
                    deferred.resolve();
                    return;
                } else if (response.statusCode === 404) {
                    deferred.reject(new Error('Given file', gb.deployment.uploadPath, 'not found'));
                    return;
                } else {
                    deferred.reject(new Error('Unknown Error: ' + response.statusCode));
                    return;
                }

            });

            return deferred.promise;
        };

        if (gb.deployment.instances) {
            var mkdirInstances = [];

            for (var i in gb.deployment.instances) {
                mkdirInstances.push(makeDirectory(gb.deployment.instances[i]));
            }
        } else {
            console.error('Please enter an `instances` list in the configuration.');
        }

        return gb.Q.all(mkdirInstances);

    });

};
