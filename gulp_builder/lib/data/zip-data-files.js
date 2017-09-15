'use strict';

module.exports = function(gb) {

    gb.gulp.task('zip-data-files', function() {
        // Only add changed files to zip
        var compareToLastDataDeploy = function(stream, cb, sourceFile) {
            if (gb.lastDeploymentTimestamp === null || (sourceFile.stat && sourceFile.stat.mtime > gb.lastDeploymentTimestamp)) {
                stream.push(sourceFile);
            }

            cb();
        };

        var zipDataFile = function(gb, archiveName, archiveFilename) {
            return function() {
                var deferred = gb.Q.defer();

                gb.gulp.src(
                    gb.deployment.archivePath + '/' + archiveName + '/**', {
                        base : gb.deployment.archivePath
                    })
                    .pipe(gb.changed(gb.deployment.archivePath, {hasChanged: compareToLastDataDeploy}))
                    .pipe(gb.zip(archiveFilename))
                    .pipe(gb.gulp.dest(gb.deployment.archivePath))
                    .on('end', function() {
                        return deferred.resolve();
                    });

                return deferred.promise;
            };
        };

        var zips = [];
        for (var i = 0; i < gb.deployment.archiveFilenames.length; i++) {
            var archiveName = gb.deployment.siteDataFolderNames[i];
            var archiveFilename = gb.deployment.archiveFilenames[i];
            zips.push(zipDataFile(gb, archiveName, archiveFilename));
        }

        var result = gb.Q();
        zips.forEach(function(f) {
            result = result.then(f);
        });

        result.then(function() {
            // update archive filenames in case any were empty and zip was skipped
            var filenames = [];
            for (var j = 0; j < gb.deployment.archiveFilenames.length; j++) {
                var filename = gb.deployment.archiveFilenames[j];
                var distFile = gb.deployment.archivePath + '/' + filename;
                if(gb.fileSystem.existsSync(distFile)) {
                    filenames.push(filename);
                }
            }
            gb.deployment.archiveFilenames = filenames;
        });

        return result;
    });

};
