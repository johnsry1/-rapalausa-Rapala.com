'use strict';

module.exports = function (gb) {

    // Copy the Demandware cartridges to the working folder for compression
    gb.gulp.task('copy-cartridges', ['init-deployment'], function () {

        // Create a working directory with all of the cartridges
        var buildTempDir = require('../util/build-temp-dir'),
            builds = [],
            rename = function (path) {
                path.dirname = path.dirname.replace(/^(\w+)\/*/g, '$1_' + gb.deployment.cartridgeSuffix + '/');
            };

        for ( var i = 0; i < gb.sites.length; i++ ) {
            // Retrieve the project names from the cartridge paths
            for ( var j = 0; j < gb.sites[i].cartridges.length; j++ ) {
                var parts = gb.sites[i].cartridges[j].split('/');

                var path = gb.sites[i].cartridges[j] + '/**/*.*',
                    base = parts[0];

                // Make sure we set up the pathing to work correctly for SVN and Git projects respectively
                if (parts[0] === '.') {
                    path = '../' + path;
                    base = '../' + base;
                } else {
                    path = '../../' + path;
                    base = '../../' + base;
                }

                // Setup the temporary working directory options
                var tempDirOptions = {
                    paths: path,
                    dirName: '.',
                    srcOptions: {base: base},
                    destOptions: {cwd: gb.workingPath + '/deploy/working/' + gb.deployment.archiveName}
                };

                // Add a suffix to the cartridge if one is provided by the configuration
                if (typeof gb.deployment.cartridgeSuffix === 'string' && gb.deployment.cartridgeSuffix) {
                    tempDirOptions.rename = rename;
                }

                builds.push(buildTempDir(gb, tempDirOptions));
            }
        }

        return gb.Q.all(builds);

    });

};
