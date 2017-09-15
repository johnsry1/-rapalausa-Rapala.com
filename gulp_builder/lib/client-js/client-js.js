'use strict';

/**
 * client-js: Bundle and compile each site's javascript.
 */
module.exports = function (gb) {

    gb.gulp.task('client-js', ['build-temp-client-js'], function () {

        // List of Browserify bundles used to compile each project's Javascript
        var browserify = require('browserify'),
            source = require('vinyl-source-stream'),
            bundles = [];

        // Use the given bundler stream to bundle all of the located files together using Browserify
        var rebundle = function (bundler, proj) {

            var deferred = gb.Q.defer(),
                stream = bundler.bundle()
                    .on('error', function (e) {
                        deferred.reject(e);
                    })
                    .pipe(source('app.js'))
                    .pipe(gb.gulp.dest('../' + proj + '/cartridge/static/default/js'));

            // When the stream has finished processing set the promise to resolved
            stream.on('end', function () {
                deferred.resolve();
            });

            return deferred.promise;

        };

        for ( var i = 0; i < gb.sites.length; i++ ) {
            var opts = {
                entries: gb.workingPath + '/temp-' + gb.sites[i].name + '/app.js',
                debug: true
            },
            bundler = browserify(opts).transform("babelify");
            bundles.push(rebundle(bundler, gb.sites[i].publicJavascript));
        }

        return gb.Q.all(bundles);

    });

};
