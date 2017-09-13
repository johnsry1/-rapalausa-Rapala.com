/**
 * getMoveParameters
 *
 * @param options
 * @return
 */
module.exports = function(options) {
	var moveParameters = { files:[] };
	var grunt = options.grunt;
	var includeDirs = options.includeDirs;
	var cwd = options.cwd;
	var dest = options.dest;
	var sourceGlob = options.sourceGlob;

	includeDirs.forEach(function(dir){
		grunt.log.writeln('Mapping Directory: ' + dir);

		moveParameters.files.push({
			expand: true,
			cwd: '/'+cwd, //repositoryPath
			src: dir + '/**/*',
			dest: dest
		});
	});

	if (moveParameters.files.length == 0) {
		moveParameters.files.push({
			expand: true,
			cwd: '/'+cwd, //repositoryPath
			src: sourceGlob,
			dest: dest
		});
	}

	grunt.log.writeln("Source Directories: " + moveParameters.files.length);

	return moveParameters;
};
