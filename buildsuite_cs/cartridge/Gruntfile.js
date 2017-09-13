/**
 *  Demandware Build Suite - part of the Community Suite
 *  @Contributors: Holger Nestmann, Danny Gehl, Jason Moody, Danny Domhardt
 **/

module.exports = function(grunt) {
	var path = require('path');

	// Required.  Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs where hostname / IP do not match
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	// load all Demandware specific plugins (not distributed by npm)
	grunt.loadTasks('grunt/tasks');

	// display execution time of grunt tasks
	require('time-grunt')(grunt);

	// load all grunt configs, look in the config directory to modify configuration for any specific task
	require('load-grunt-config')(grunt, {
		configPath: path.join(process.cwd(), 'grunt/config')
	});

  // Include the Demandware library.
  require('./grunt/lib/properties')(grunt);
  require('./grunt/lib/generate_config')(grunt);

  grunt.log.writeln('Finished loading Grunt File');

};
