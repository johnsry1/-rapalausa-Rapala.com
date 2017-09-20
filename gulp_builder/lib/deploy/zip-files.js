'use strict';

module.exports = function (gb) {

    gb.gulp.task('zip-files', ['copy-cartridges', 'update-cartridge-references'], function () {

        var zipFile = function (gb, cartridges, archiveFilename) {
            return function () {
                var deferred = gb.Q.defer();

                gb.gulp.src(cartridges.map(function (cartridgeName) {
                    if (cartridgeName === '**') {
                        return 'deploy/working/**/*';
                    } else if (gb.deployment.cartridgeSuffix) {
                        return 'deploy/working/**/' + cartridgeName + '_' + gb.deployment.cartridgeSuffix + '/**/*';
                    }
                    return 'deploy/working/**/' + cartridgeName + '/**/*';
                }), {
                    base: 'deploy/working/' + gb.deployment.archiveName + '/'
                })
                .pipe(gb.zip(archiveFilename))
                .pipe(gb.gulp.dest('deploy/output'))
                .on('end', function () {
                    return deferred.resolve();
                });

                return deferred.promise;
            };
        };

        var zips = [];
        for (var i = 0; i < gb.deployment.archiveFilenames.length; i++) {
            var cartridges = gb.deployment.cartridges[i],
                archiveFilename = gb.deployment.archiveFilenames[i];

            zips.push(zipFile(gb, cartridges, archiveFilename));
        }

        var result = gb.Q();
        zips.forEach(function (f) {
            result = result.then(f);
        });

        return result;

    });
};
