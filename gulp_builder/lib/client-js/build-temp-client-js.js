'use strict';

/**
 * build-temp-client-js: Create temp directories for each project's javascript
 */
module.exports = function (gb) {

    gb.gulp.task('build-temp-client-js', function () {
        var buildTempDir = require('../util/build-temp-dir'),
            builds = [];

        for (var i = 0; i < gb.sites.length; i++) {
            var paths = [];

            for (var j = gb.sites[i].cartridges.length - 1; j >= 0; j--) {
                var path = gb.sites[i].cartridges[j] + '/cartridge/js/**/*.js';

                // Make sure we set up the pathing to work correctly for SVN and Git projects respectively
                if (gb.sites[i].cartridges[j].split('/')[0] === '.') {
                    path = '../' + path;
                } else {
                    path = '../../' + path;
                }

                paths.push(path);
            }

            builds.push(buildTempDir(gb, {
                paths: paths,
                dirName: gb.workingPath + '/temp-' + gb.sites[i].name
            }));
        }

        return gb.Q.all(builds);

    });

};
