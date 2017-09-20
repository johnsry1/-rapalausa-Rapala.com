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
            themePaths = [],
            paths = [];

        //for all gb.sites and cartridges
        for (var i = 0; i < gb.sites.length; i++) {
            for ( var j = 0; j < gb.sites[i].cartridges.length; j++ ) {

                //make sure we set up the pathing to work correctly for SVN and Git projects respectively
                var path = (gb.sites[i].cartridges[j].split('/')[0] === '.') ? '../' : '../../';

                if( gb.sites[i].cartridges[j].indexOf("app_rapala_themes") > -1 ) {
                    for ( var x = 0; x < gb.sites[i].brands.length; x++ ) {
                        //console.log("BRAND TIME 0 " + gb.sites[i].cartridges[j] + '/cartridge/static/default/themes/' + gb.sites[i].brands[x]);

                        path += gb.sites[i].cartridges[j] + '/cartridge/static/default/themes/' + gb.sites[i].brands[x];
                        themePaths.push(path);
                        path = (gb.sites[i].cartridges[j].split('/')[0] === '.') ? '../' : '../../';

                    }
                } else {
                    path += gb.sites[i].cartridges[j] + '/cartridge/scss/*';
                    paths.push(path);
                }

                //console.log("list all paths: " + path);
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

                for ( var q = 0; q < themePaths.length; q++ ) {
                    var scssPath = themePaths[q] + '/scss',
                        cssPath = themePaths[q] + '/css',
                        pathSet = { scssPath: scssPath, cssPath: cssPath, themePaths: true };
                        //console.log("SCSS PATH: " + scssPath);
                        //console.log("CSS PATH: " + cssPath);

                        gb.allStyleDirectories.push(pathSet);
                }

            });

    });

};
