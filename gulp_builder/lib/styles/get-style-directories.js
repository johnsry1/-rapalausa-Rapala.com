'use strict';

/**
 * get-style-directories: retrieve the paths for all scss/css path pairs in the workspace
 */
module.exports = function (gb, task) {

    var dependencies = task.styleDependencies || [];

    //store reference to all directories containing styles and init task
    gb.allStyleDirectories = [];

    gb.gulp.task('get-style-directories', dependencies, function () {

        var vp = gb.vinylPaths(),
            paths = [];

        //for all gb.sites and cartridges
        for (var i = 0; i < gb.sites.length; i++) {
            for ( var j = 0; j < gb.sites[i].cartridges.length; j++ ) {

                //make sure we set up the pathing to work correctly for SVN and Git projects respectively
                var path = (gb.sites[i].cartridges[j].split('/')[0] === '.') ? '../' : '../../';
                path += gb.sites[i].cartridges[j] + '/cartridge/scss/*';
                paths.push(path);

            }
        }

        //add exclusion for all files, so we only have directories
        paths.push('!../**/*.*');

        // Build the array of scss/css path pairs
        return gb.gulp.src(paths, {read: false})
            .pipe(vp)
            .on('end', function () {

                for ( var i = 0; i < vp.paths.length; i++ ) {
                    var scssPath = vp.paths[i],
                        cssPath = vp.paths[i].replace('scss','static') + '/css',
                        pathSet = { scssPath: scssPath, cssPath: cssPath };

                    gb.allStyleDirectories.push(pathSet);
                }

            });

    });

};
