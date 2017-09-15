'use strict';

/**
 * build-temp-dir: Builds a set of temporary working directories for the build
 * process based on the given paths and directory name
 *
 * @param options
 * @returns {Promise}
 */
module.exports = function (gb, options) {
    // Create an empty options object if one wasn't provided
    var rename = require('gulp-rename'),
        paths = options.paths,
        dirName = options.dirName,
        srcOptions = options.srcOptions || {},
        destOptions = options.destOptions || {};

    // Define the source project based on the given projects
    var deferred = gb.Q.defer(),
        stream = gb.gulp.src(paths, srcOptions);

    // Rename the files/folders if a function is provided
    if (typeof options.rename === 'function') {
        stream = stream.pipe(rename(options.rename));
    }

    stream = stream.pipe(gb.gulp.dest(dirName, destOptions));

    // When the stream has finished processing set the promise to resolved
    stream.on('end', function () {
        deferred.resolve();
    });

    return deferred.promise;
};
