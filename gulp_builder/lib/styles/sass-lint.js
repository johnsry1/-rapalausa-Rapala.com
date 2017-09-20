'use strict';

/**
 * sass-lint: lint the sass files to ensure proper formatting/syntax
 */
module.exports = function (gb) {
    gb.gulp.task('sass-lint', function () {
        var sassLint = require('gulp-sass-lint'),
            sassFiles = [gb.workingPath + '/../**/cartridge/scss/**/*.s+(a|c)ss',
                         '!' + gb.workingPath + '/../**/cartridge/scss/compiled/*.s+(a|c)ss',
                         '!' + gb.workingPath + '/../**/cartridge/scss/**/compiled/*.s+(a|c)ss'];
        return gb.gulp.src(sassFiles)
            .pipe(sassLint({
                'cache-config': true // NOTE: When changing the .sass-lint.yml file, this should be set to "false" while debugging changes. Otherwise, it should be set to "true".
            }))
            .pipe(sassLint.format())
            .pipe(sassLint.failOnError());
    });
};