'use strict';

var path = require('path');
var utils = require('./util/utils');

var prop = '.properties';
var formats = {
	'.properties': require('./format/properties'),
	'.json': require('./format/json')
};

module.exports = function(grunt) {
	/**
	 * Determines how to load the configuration, via if it's a .properties file
	 * or not.
	 *
	 * @param names
	 */
	var handleConfig = function(names) {
		names.forEach(function(name) {
			grunt.log.verbose.writeln('Parsing ' + name + ' properties');

			var settings = grunt.config.get('dw_properties.' + name);
			var settingsAreProps = path.extname(settings) === prop;
			handlePropertiesFile(name, settings, migrate && settingsAreProps);
		});
	};

	/**
	 * Handles a given file that could be either a Java properties file or JSON.
	 *
	 * @param {string} name -
	 * @param {string} filepath -
	 * @param {boolean} migrate - optional
	 */
	var handlePropertiesFile = function(name, filepath, migrate) {
		var extname = path.extname(filepath);

		// If migrating, always use `.properties`.
		var format = formats[extname];

		if (!format) {
			throw new Error('Invalid filetype: ' + extname + ' passed.');
		}

		var contents = grunt.file.read(filepath);
		contents = utils.replaceEnvVars(contents);
		var parsed = format.convert(contents);
		var pretty = JSON.stringify(parsed, null, 2);

		// If we are migrating, write out the correct JSON file.
		if (migrate) {
			grunt.file.write(filepath.slice(0, filepath.length-extname.length) +
				'.json', pretty);
			grunt.log.verbose.writeln('Writing migration file for: %s', filepath);
		}

		grunt.config(name, parsed);

		grunt.log.verbose.writeln('grunt.config.' + name + ' = ' +
			JSON.stringify(parsed, null, 2));
	};

	var migrate = grunt.option.flags().indexOf('--migrate') > -1;

	// Overriding configuration option.
	var config = grunt.config.get('dw_properties.config');

	// Opt-into the nicer configuration strategy, where you can read from single
	// files.
	if (config) {
		// Get the config JSON.
		var build = grunt.file.read(config);
		build = JSON.parse(utils.replaceEnvVars(build));
		var project = grunt.file.read('build/projects/' +
			build.settings['build.project.name'] + '/config.json');
		project = JSON.parse(utils.replaceEnvVars(project));

		grunt.config('settings', build.settings);
		grunt.config('synch', build.synch);
		grunt.config('analyzeLogs', build.analyzeLogs);
		grunt.config('instance', project.environment);
		grunt.config('dependency', project.dependencies);
		return;
	}

	console.log("Should never be hit");

	// Determine each settings section inside the Grunt configuration.
	handleConfig([
		"settings",
		"instance",
		"dependency",
		"analyzeLogs",
		"sync"
	]);
};
