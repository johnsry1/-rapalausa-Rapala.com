'use strict';

module.exports = function (gb) {

    gb.gulp.task('update-cartridge-references', ['update-cartridge-properties'], function () {

        if (typeof gb.deployment.cartridgeSuffix === 'string' && gb.deployment.cartridgeSuffix) {
            var vp = gb.vinylPaths(),
                /**
                 * Updates all of the references to cartridges in the given file to the suffixed version
                 *
                 * @param path {String}
                 */
                updateCartridgeReferences = function (path) {

                    gb.fileSystem.readFile(path, 'utf8', function (err,data) {

                        if (err) { return console.error(err); }

                        var result = data;

                        for ( var i = 0; i < gb.sites.length; i++ ) {
                            // Retrieve the project names from the cartridge paths
                            for ( var j = 0; j < gb.sites[i].cartridges.length; j++ ) {
                                // Replace the name of the catridge in each file with the suffixed name
                                var parts = gb.sites[i].cartridges[j].split('/'),
                                    regex = new RegExp(parts[1] + '(:|/)', 'g');

                                result = result.replace(regex, parts[1] + '_' + gb.deployment.cartridgeSuffix + '$1');
                            }
                        }

                        gb.fileSystem.writeFile(path, result, 'utf8', function (err) {

                            if (err) { return console.error(err); }

                        });

                    });

                };

            return gb.gulp.src([gb.workingPath + '/deploy/working/**/*.js', gb.workingPath + '/deploy/working/**/*.ds', gb.workingPath + '/deploy/working/**/*.isml', gb.workingPath + '/deploy/working/**/*.xml'])
                .pipe(vp)
                .on('end', function () {

                    for ( var k = 0; k < vp.paths.length; k++ ) {
                        var path = vp.paths[k];

                        updateCartridgeReferences(path);
                    }

                });
        } else {
            console.log('No cartridge reference update necessary');
        }

    });

};
