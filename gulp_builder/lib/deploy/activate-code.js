'use strict';

module.exports = function (gb) {

    gb.gulp.task('activate-code', ['unzip-files'], function () {

        var activateCode = function (server) {

            return gb.bmLogin(gb, server).then(function() {

                var deferred = gb.Q.defer();
                gb.request.post({
                    url: 'https://' + server + gb.deployment.instanceRoot + '/on/demandware.store/Sites-Site/default/ViewCodeDeployment-Activate',
                    form: {
                        CodeVersionID: gb.deployment.archiveName
                    },
                    jar: true,
                    rejectUnauthorized: false
                }, function(error, response) {
                    if (response.statusCode === 200) {
                        deferred.resolve();
                        console.log('Code version activated on ' + server + '. Deployment successful!');
                        return;
                    } else {
                        deferred.reject(new Error('Unknown Error: ' + response.statusCode));
                        return;
                    }
                });

                return deferred.promise;
            });
        };

        if (gb.deployment.activationInstances) {
            var instanceActivations = [];

            for (var i in gb.deployment.activationInstances) {
                instanceActivations.push(activateCode(gb.deployment.activationInstances[i]));
            }
        } else {
            console.error('Please enter an activationInstance list in the configuration.');
        }

        return gb.Q.all(instanceActivations);
    });

};
