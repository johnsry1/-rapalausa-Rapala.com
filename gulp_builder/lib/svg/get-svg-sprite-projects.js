'use strict';

module.exports = function (gb) {

    //array for storing all SVG paths
    gb.allSVGIconProjects = [];

    //Retrieve the paths for all projects in the workspace that contain SVG sprite files
    gb.gulp.task('get-svg-sprite-projects', function () {

        var vp = gb.vinylPaths(),
            paths = [];

        for (var i = 0; i < gb.sites.length; i++) {
            for ( var j = 0; j < gb.sites[i].cartridges.length; j++ ) {
                var path = gb.sites[i].cartridges[j] + '/cartridge/static/default/images/svg-icons';

                if ( gb.sites[i].cartridges[j].split('/')[0] === '.') {
                    path = '../' + path;
                } else {
                    path = '../../' + path;
                }

                paths.push(path);
            }
        }

        // Build the set of projects that contain SVG files
        return gb.gulp.src(paths, {read: false})
            .pipe(vp)
            .on('end', function () {
                for ( var i = 0; i < vp.paths.length; i++ ) {
                    var parts = vp.paths[i].split(/\/|\\/);
                    gb.allSVGIconProjects.push(parts[parts.length - 6]);
                }
            });

    });

};
