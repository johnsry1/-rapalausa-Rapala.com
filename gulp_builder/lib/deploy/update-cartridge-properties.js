'use strict';

module.exports = function (gb) {

    gb.gulp.task('update-cartridge-properties', ['copy-cartridges'], function () {

        // Only update the properties files if they are in copies of the cartridges
        if (typeof gb.deployment.cartridgeSuffix === 'string' && gb.deployment.cartridgeSuffix) {
            var builds = [],
            /**
             * Create a new file with the given filename and content
             *
             * @param filename {String}
             * @param text {String}
             * @returns {Promise}
             */
            createFile = function (filename, text) {

                var deferred = gb.Q.defer();

                gb.fileSystem.writeFile(filename, text, function () {
                    deferred.resolve();
                });

                return deferred.promise;

            },
            /**
             * Remove a new file with the given filename
             *
             * @param filename {String}
             * @returns {Promise}
             */
            removeFile = function (filename) {
                var deferred = gb.Q.defer();

                gb.fileSystem.unlink(filename, function () {
                    deferred.resolve();
                });

                return deferred.promise;
            };

            for ( var i = 0; i < gb.sites.length; i++ ) {
                // Retrieve the project names from the cartridge paths
                for ( var j = 0; j < gb.sites[i].cartridges.length; j++ ) {
                    var parts = gb.sites[i].cartridges[j].split('/'),
                        cartridgeName = parts[1] + '_' + gb.deployment.cartridgeSuffix,
                        oldFilename = gb.workingPath + '/deploy/working/' + cartridgeName + '/cartridge/' + parts[1] + '.properties',
                        newFilename = gb.workingPath + '/deploy/working/' + cartridgeName + '/cartridge/' + cartridgeName + '.properties',
                        content = 'demandware.cartridges.' + cartridgeName + '.id=' + cartridgeName + '\ndemandware.cartridges.' + cartridgeName + '.multipleLanguageStorefront=true';

                    builds.push(removeFile(oldFilename));
                    builds.push(createFile(newFilename, content));
                }
            }

            return gb.Q.all(builds);
        } else {
            console.log('No properties update necessary');
        }

    });

};
