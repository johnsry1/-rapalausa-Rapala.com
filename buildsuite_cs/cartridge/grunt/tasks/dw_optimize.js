'use strict';

module.exports = function (grunt) {
	grunt.registerTask('optimize', 'Static resource optimization', function(){
		if (grunt.config('settings.build\\.optimize\\.js')) {
			grunt.task.run('uglify');
		} else {
			grunt.log.writeln('Javascript optimization disabled - skipping.');
		}
		if (grunt.config('settings.build\\.optimize\\.css')) {
			grunt.task.run('cssmin');
		} else {
			grunt.log.writeln('CSS optimization disabled - skipping.');
		}
	});
};