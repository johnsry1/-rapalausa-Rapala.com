'use strict';

/**
 * get-paths-client-js: Retrieve the paths for the javascript
 * files based on the config
 */
module.exports = function (gb) {

    //store reference to all directories containing styles and init task
    gb.allJavascriptFiles = [];

    gb.gulp.task('get-paths-client-js', function () {

        for ( var i = 0; i < gb.sites.length; i++ ) {
            for ( var j = gb.sites[i].cartridges.length - 1; j >= 0; j-- ) {
                var path = gb.sites[i].cartridges[j] + '/cartridge/js/**/*.js';

                // Make sure we set up the pathing to work correctly for SVN and Git projects respectively
                if ( gb.sites[i].cartridges[j].split('/')[0] === '.') {
                    path = '../' + path;
                } else {
                    path = '../../' + path;
                }

                gb.allJavascriptFiles.push(path);
            }
        }

    });

};
