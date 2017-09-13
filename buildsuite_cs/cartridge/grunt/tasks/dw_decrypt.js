'use strict';

var crypto = require('crypto');

module.exports = function (grunt) {
	var ENCRYPTION_MARKER = 't8kdrXdL61E_';
	grunt.registerTask('decryptpasswords', 'Decrypt the passwords.', function () {
		if (!grunt.config('settings.password\\.encryption')) {
			return;
		}
		var password = grunt.config('instance.webdav\\.password');
		var ext = ".properties";
		var dependencyFilename = 'build/projects/' + grunt.config('settings.build\\.project\\.name') + '/environment.' + grunt.config('settings.build\\.target\\.environment') + ext;

		if (grunt.file.exists('build/projects/' + grunt.config('settings.build\\.project\\.name') + '/config.json')) {
			dependencyFilename = 'build/projects/' + grunt.config('settings.build\\.project\\.name') + '/config.json';
		}

		var decipher = crypto.createDecipher('des','Here is some data for the coding');

		grunt.log.writeln("File:" + dependencyFilename);
		if (password.indexOf(ENCRYPTION_MARKER) === 0) {
			password = password.substring(ENCRYPTION_MARKER.length);
			decipher.setEncoding('utf8');
			decipher.end(password,'base64');
			grunt.config('instance.webdav\\.password',decipher.read(password));

		} else {
			var fileContent = grunt.file.read(dependencyFilename);
			var cipher = crypto.createCipher('des','Here is some data for the coding');
			cipher.setEncoding('base64');
			cipher.end(password,'utf8');
			//grunt.file.write('key.des',diffHell.getPrivateKey('base64'));
			grunt.file.write(dependencyFilename,fileContent.replace(password, ENCRYPTION_MARKER+cipher.read(password)));
			grunt.log.writeln('Password has been encrypted for security reasons.');
			grunt.config('instance.webdav\\.password',password);
		}
	});
};
