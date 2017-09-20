'use strict';

/**
 * build-temp-client-js: Create temp directories for each project's javascript
 */
module.exports = function (gb) {

    var gulpConcat = require('gulp-concat');

    /**
     * @function
     * @description Combines the the Javascript files found in the given paths for the site and places them in the jsPath location
     * @param {string[]} paths - Javascript file paths retrieved from the config.json file for each site
     * @param {string} jsPath - Static Javascript location for plugins.js to be written to for each site
     */
    function combinePlugins (paths, jsPath) {
        // Define the source project based on the given projects
        var deferred = gb.Q.defer(),
            stream = gb.gulp.src(paths);

        stream = stream.pipe(gulpConcat('plugins.js'))
                    .pipe(gb.gulp.dest(jsPath));

        // When the stream has finished processing set the promise to resolved
        stream.on('end', function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    gb.gulp.task('combine-plugin-js', function () {
        var builds = [];

        for (var i = 0; i < gb.sites.length; i++) {
            var paths = [],
                jsPath = '../' + gb.sites[i].publicJavascript + '/cartridge/static/default/js';

            for (var j = 0; j < gb.sites[i].javascriptPluginPaths.length; j++) {
                paths.push(gb.sites[i].javascriptPluginPaths[j]);
            }

            builds.push(combinePlugins(paths, jsPath));
        }

        return gb.Q.all(builds);
    });

};
