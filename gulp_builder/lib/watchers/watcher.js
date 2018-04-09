'use strict';

/**
 * SCSS and JS files Watcher
 */
module.exports = function (gb) {
    gb.gulp.task('watcher', ['get-style-directories', 'get-paths-client-js', 'get-svg-sprite-projects'], function () {
        var watch = require('gulp-watch'),
            scssFiles = [],
            svgFiles = [];

        for (var i = 0; i < gb.allStyleDirectories.length; i++) {
            scssFiles.push(gb.allStyleDirectories[i].scssPath + '/**/*.scss');
        }

        for (var i = 0; i < gb.allSVGIconProjects.length; i++) {
            svgFiles.push('../' + gb.allSVGIconProjects[i] + '/cartridge/static/default/images/svg-icons/*.svg');
        }

        watch(scssFiles, function() {
            gb.gulp.start('styles');
        });

        watch(gb.allJavascriptFiles, function() {
            gb.gulp.start('client-javascript');
        });

        watch(svgFiles, function() {
            gb.gulp.start('svg');
        });
    });
};
