'use strict';

/*
 * combine-svg: Combine the SVG files in the given path into one file
 */
module.exports = function (gb) {

    gb.gulp.task('combine-svg', ['get-svg-sprite-projects'], function () {

        // Stores the list of promises returned from building each projects SVG sprite images
        var svgSprite = require('gulp-svg-sprite'),
            promises = [];

        // Compile the style icon SVG from the individual files
        var buildSVG = function (proj) {

            var deferred = gb.Q.defer(),
                projectPath = '../' + proj + '/cartridge',
                stream = gb.gulp.src(projectPath + '/static/default/images/svg-icons/*.svg')
                    .pipe(svgSprite({
                        mode: {
                            symbol: { // Activate the «view» mode
                                inline: true,
                                dest: './',
                                sprite: './static/default/images/compiled/sprites.svg',
                                bust: false,
                                render: {
                                    scss: {
                                        dest: './scss/default/compiled/_svg.scss'
                                    } // Activate Sass output
                                }
                            },
                            defs: {
                                inline: false,
                                dest: './',
                                sprite: './templates/default/components/svg.isml'
                            }
                        }
                    }))
                    .pipe(gb.gulp.dest(projectPath));

            // When the stream has finished processing set the promise to resolved
            stream.on('end', function () {
                deferred.resolve();
            });

            return deferred.promise;

        };

        for ( var i = 0; i < gb.allSVGIconProjects.length; i++ ) {
            promises.push(buildSVG(gb.allSVGIconProjects[i]));
        }

        return gb.Q.all(promises);

    });

};
