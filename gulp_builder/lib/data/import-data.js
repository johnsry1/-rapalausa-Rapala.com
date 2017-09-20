'use strict';

module.exports = function (gb) {

    // Imports ZIP into DW server using HTTP posts
    gb.gulp.task('import-data', ['webdav-upload'], function() {

        console.log('Starting data import...');

        var importFile = function (gb, instance, archiveFilename) {
            var deferred = gb.Q.defer();
            console.log('Importing file: ' + archiveFilename);
            var httpOptions = {
                url: 'https://' + instance + gb.deployment.instanceRoot + '/on/demandware.store/Sites-Site/default/ViewSiteImpex-Dispatch',
                form: {
                    ImportFileName: archiveFilename,
                    realmUse: 'false',
                    import: 'OK'
                },
                jar: true,
                rejectUnauthorized: false
            };

            gb.request.post(
                httpOptions,
                function(error, response) {
                    if (response.statusCode === 200) {
                        console.log('Successful import of ' + archiveFilename + ' on ' + instance);
                        deferred.resolve();
                        return deferred.promise;
                    } else {
                        console.log('Failed import of ' + archiveFilename + ' on ' + instance);
                        deferred.reject(new Error('Unknown Error: ' + response.statusCode));
                        return;
                    }
                }
            );

            return deferred.promise;
        };

        var importFiles = function (gb, instance) {
            gb.bmLogin(gb, instance).then(function() {
                // import each data zip file sequentially with a delay to avoid db lock conflicts
                // TODO add intermediary check to make sure previous file is not still importing
                return gb.deployment.archiveFilenames.reduce(function(promise, item) {
                    return promise.then(function() {
                        return importFile(gb, instance, item).delay(gb.deployment.dataDeployDelay);
                    });
                }, gb.Q());
            });
        };

        var instances = [];

        for (var i in gb.deployment.importInstances) {
            instances.push(gb.deployment.importInstances[i]);
        }

        var imports = [];

        for (var j in instances) {
            imports.push(importFiles(gb, instances[j], true));
        }

        // After imports are complete, record timestamp of deployment
        gb.fileSystem.writeFile(gb.lastDeploymentFileName, new Date().getTime(), (err) => {
            if (err) { throw err; }
        });

        return gb.Q.all(imports);

    });

};
