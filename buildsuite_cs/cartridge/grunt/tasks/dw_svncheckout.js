'use strict';

var url = require('url');
var path = require('path');
var which = require('which');

module.exports = function(grunt) {
	grunt.registerMultiTask('dw_svncheckout', 'SVN checkout task.', function() {

		var done = this.async();
		var options = this.options();

		var pathname = url.parse(options.repository).pathname;
		var name = pathname.slice(pathname.lastIndexOf('/') + 1);

		var out = path.join(__dirname, '../../exports', name);

		// Windows bug.  Create directory path
		grunt.file.mkdir(out);

		var checkoutUrl = "";
		var arrUrl;
		var arrCredentials;
		var credentials;
		var uid = "";
		var pwd = "";

		if (options.repository.indexOf("@") > 0) {
			// Extract Username Password from the URL in Config JSON
			arrUrl = options.repository.split("//");
			arrCredentials = arrUrl[1].split("@");
			credentials = arrCredentials[0].split(":");
			uid = credentials[0];
			pwd = credentials[1];
			checkoutUrl = "https://" + arrCredentials[1] + "/" + (options.branch || '');
		}
		else {
			checkoutUrl = options.repository + "/" + (options.branch || '');
		}

		var svnarg;
		if (uid != "" && pwd != "") {
			grunt.log.writeln("Username: " + uid);
			svnarg = ['co', checkoutUrl, out, '--username', uid, '--password', pwd, '--no-auth-cache', '--non-interactive'];
		}
		else if (uid == "" && pwd == "") {
			svnarg = ['co', checkoutUrl, out];
		}

		try {
			which.sync('svn');
		}
		catch(err) {
			return done(new Error('Missing svn in your system PATH'));
		}

		grunt.log.writeln("Checkout URL: " + checkoutUrl);

		grunt.util.spawn({
			cmd: 'svn',
			args: ['co', checkoutUrl, out, '--username', uid, '--password', pwd, '--no-auth-cache', '--non-interactive']
		}, function(err, result, code) {

			if (err) {
				grunt.log.writeln("Error occured: " + err.message);
				done(false);
			}

			grunt.log.writeln("Update: " + out);

			grunt.util.spawn({
				cmd: 'svn',
				args: ['update', out]
			}, done);

		});
	});
};
