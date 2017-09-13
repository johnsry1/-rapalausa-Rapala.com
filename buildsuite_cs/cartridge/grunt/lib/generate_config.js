'use strict';

/**
 * Retrieves source from multiple repositories and copies to the output directory.  Source repositories are put in exports
 * file:// repositories are copies directly to output directory.
 *
 * @Contributors: Holger Nestmann, Danny Gehl, Jason Moody, Danny Domhardt
 * @DocRef: https://github.com/gruntjs/grunt-contrib-copy
 **/

var path = require('path');
var getMoveParameters = require('./util/get_move_parameters');

function configureOptimize(moveParameters, grunt) {
	var version = grunt.config.get('version');
	moveParameters.options = {
		// exclude everything except ISML, negative globbing pattern seems not to work
		// which is why this is a poor man's replacement for "!**/*.isml"
		noProcess: ["**/static/**", "**/pipelines/**", "**/scripts/**", "**/webreferences*/**"],
		process: function (content, srcpath) {
			if (srcpath.indexOf('.isml') === -1) {
				return content;
			}
			// get path to cartridge
			var basePath = srcpath.split('/').splice(0, 5).join('/');
			// get cartridge name
			var cartridgeName = srcpath.split('/')[5];
			// replace the tagged sections
			if (grunt.config('settings.build\\.optimize\\.js')) {
				content = content.replace(/<!--- BEGIN JS files to merge(.*)--->([\s\S]*)\s*<!--- END JS files to merge.*--->/g, function (all, params, scripts, m3) {
					var relpath = params.match(/source_path=([^;)]*)/)[1];
					var target = params.match(/targetfile=([^;)]*)/)[1];
					// create uglify config
					grunt.config('uglify.' + target.split('.')[0], {
						src: scripts.replace(/.*\('/g, basePath + '/' + relpath + '/').replace(/'\).*/g, '').match(/[^\r\n]+/g).filter(function (e) {
							return e.length;
						}),
						dest: 'output/code/' + version + '/' + relpath + '/' + target
					});
					return '<script type="text/javascript" src="${URLUtils.absStatic(\'' + target + '\')}"></script>';
				});
			}

			if (grunt.config('settings.build\\.optimize\\.css')) {
				content = content.replace(/<!--- BEGIN CSS files to merge(.*)--->([\s\S]*)\s*<!--- END CSS files to merge.*--->/g, function (all, params, scripts, m3) {
					var relpath = params.match(/source_path=([^;)]*)/)[1];
					var target = params.match(/targetfile=([^;)]*)/)[1];
					// create uglify config
					grunt.config('cssmin.' + target.split('.')[0], {
						src: scripts.replace(/.*\('/g, basePath + '/' + relpath + '/').replace(/'\).*/g, '').match(/[^\r\n]+/g).filter(function (e) {
							return e.length;
						}),
						dest: 'output/code/' + version + '/' + relpath + '/' + target
					});
					return '<link href="${URLUtils.absStatic(\'' + target + '\')}" rel="stylesheet" type="text/css" />';
				});
			}
			return content;
		}
	};
}

function configureLocalCheckout(cloneOptions, grunt) {
	var cwd = path.normalize(cloneOptions.repository.slice('file://'.length));
	return ['log: Repository: file://' + cwd, 'log: Skipping source checkout as we have a local path.'];
}

function configureGITCheckout(cloneOptions, grunt) {
	var checkoutpath = 'exports/' + cloneOptions.id;

	if (grunt.file.exists(checkoutpath) && !grunt.task.exists('clean')) {
		grunt.config('gitfetch.' + cloneOptions.id, {
			options : {
				cwd: checkoutpath,
				all: true
			}
		});
		grunt.config('gitreset.' + cloneOptions.id, {
			options : {
				cwd: checkoutpath,
				mode: 'hard'
			}
		});

		return ['gitfetch:' + cloneOptions.id, 'gitreset:' + cloneOptions.id];
	}
	else {
		grunt.config('gitclone.' + cloneOptions.id, {
			options : {
				repository: cloneOptions.repository,
				branch: (cloneOptions.branch || 'master'),
				directory: checkoutpath
			}
		});
		return ['gitclone:' + cloneOptions.id];
	}
}

function configureSVNCheckout(cloneOptions, grunt) {
	grunt.config('dw_svncheckout.' + cloneOptions.id + '.options', cloneOptions);

	return ['dw_svncheckout:' + cloneOptions.id];
}
/**
 * outEmptyString
 *
 * @param value
 * @return
 */
function outEmptyString(value) {
	return value !== '';
}

/**
 * Converts either a string or object in the dependencies array into a
 * clone options object used by the clone task.
 *
 * @param value
 * @return
 */
function toCloneOptions(value) {
	var cloneOptionsDefaults = {
		includeCartridges: [],
		// Keep `null` so that each VCS type can determine the default.
		branch: null,
		directory: 'exports/',
		type: null
	};

	var cloneOptions = null;

	// Allow a string for backwards compatibility.
	if (typeof value === 'string') {
		cloneOptions = Object.create(cloneOptionsDefaults);

		var options = value.split(/ -\s?/);
		cloneOptions.repository = options[0];

		var includeCartridges = cloneOptions.includeCartridges;

		options.forEach(function (option) {
			var parts = option.split(' ');
			var name = parts[0];
			var value = parts[1];

			if (name === 'include-cartridges') {
				var dirs = value.split(',');

				// Add all dirs into the `includeDirs` array.
				includeCartridges.push.apply(includeCartridges, dirs);
			}
			else {
				cloneOptions[name] = value;
			}
		});
	}
	else {
		cloneOptions = value;
		cloneOptions.__proto__ = cloneOptionsDefaults;
	}

	var repo = cloneOptions.repository;

	// Augment the defaults to allow an implicit id.
	cloneOptionsDefaults.id = repo.slice(repo.lastIndexOf('/') + 1);

	// Try and detect the type if it wasn't explicity passed.
	if (!cloneOptions.type) {
		// Is this a Git repository?
		if (repo.indexOf('git') > -1) {
			cloneOptions.type = 'git';
		}
		// What about an SVN repository?
		else if (repo.indexOf('svn') > -1) {
			cloneOptions.type = 'svn';
		}
		else {
			cloneOptions.type = 'file';
		}
	}

	// now that we have a type, clean the ID
	if (cloneOptions.type == 'git') {
		cloneOptionsDefaults.id = cloneOptionsDefaults.id.replace('.git', '');
	}

	return cloneOptions;
}
function buildVersion(grunt) {

	var version_name = grunt.option('build.project.version') || grunt.config('settings.build\\.project\\.version');
	grunt.log.writeln("Using project: " + version_name);
	grunt.config('settings.build\\.project\\.version', version_name);

	var build_number = grunt.option('build.project.number') || grunt.config('settings.build\\.project\\.number');
	var version = version_name;
	if (build_number) {
		version = version_name + '-' + build_number;
	}

	grunt.config('version', version);

	return version;
}

function buildHTTPConfig(instance, cartridgeArchiveName, method) {
	return {
		options: {
			auth: {
				user: instance["webdav.username"],
				pass: instance["webdav.password"]
			},
			url: 'https://' + instance["webdav.server"] + instance["webdav.cartridge.root"] + cartridgeArchiveName,
			form: {
				method: method
			}
		}
	};
}

module.exports = function (grunt) {
	var settings = grunt.config.get('settings');
	var instance = grunt.config.get('instance');

	var project = settings['build.project.name'];

	var version = buildVersion(grunt);

	// Try and intelligently decide which configuration file to load.
	var configLines = grunt.config('dependency');

	var sourcePath = instance['source.path'] || '.';
	var sourceGlob = instance['source.glob'] ? instance['source.glob'].split(',') : '**/*';

	var configurationPath = instance['site_import.path'] || 'sites/site_template';

	var checkoutTasks = [];
	var compressTasks = [];
	var uploadTasks = [];
	var unzipTasks = [];
	var deleteTasks = [];

	configLines
		.filter(outEmptyString)
		.map(toCloneOptions)
		.forEach(function (cloneOptions) {
			var cwd = 'exports/' + cloneOptions.id + '/' + sourcePath;

			grunt.log.verbose.writeln('Repository: ' + cloneOptions.repository);

			// checkout - local repository
			if (cloneOptions.type === 'file' && cloneOptions.repository.indexOf('file:') === 0) {
				cwd = path.normalize(cloneOptions.repository.slice('file://'.length));
				checkoutTasks.push.apply(checkoutTasks, configureLocalCheckout(cloneOptions, grunt));
			}
			// checkout - GIT repository
			else if (cloneOptions.type === 'git') {
				checkoutTasks.push.apply(checkoutTasks, configureGITCheckout(cloneOptions, grunt));
			}
			// checkout -  SVN repository
			else if (cloneOptions.type === 'svn') {
				checkoutTasks.push.apply(checkoutTasks, configureSVNCheckout(cloneOptions, grunt));
			}

			var moveParameters = getMoveParameters({
				grunt: grunt,
				includeDirs: cloneOptions.includeCartridges,
				cwd: cwd,
				dest: 'output/code/' + version + '/',
				sourceGlob: sourceGlob
			});

			if (settings['build.optimize.js'] || settings['build.optimize.css']) {
				configureOptimize(moveParameters, grunt);
			}

			grunt.config('copy.' + cloneOptions.id, moveParameters);

			if (settings['code.upload.granularity'] === 'CARTRIDGE') {
				// create upload ZIP file per cartridge
				cloneOptions.includeCartridges.forEach(function (cartridge) {

					var cartridgeArchiveName = cartridge + '-' + version + '.zip';
					var cartridgeArchivePath = 'output/code/' + cartridgeArchiveName;

					// define parameters for compress task
					grunt.config('compress.code_' + cartridge, {
						options: {
							archive: cartridgeArchivePath
						},
						files: [{
							src: ['**'],
							cwd: 'output/code/' + version + '/' + cartridge,
							dest: version + '/' + cartridge,
							expand: true
						}]
					});
					compressTasks.push('compress:code_' + cartridge);

					// define parameters for upload task
					grunt.config('dw_upload.code_' + cartridge, {
						options: {
							release_path: instance["webdav.cartridge.root"] + cartridgeArchiveName
						},
						files: {
							src: cartridgeArchivePath
						}
					});
					uploadTasks.push('dw_upload:code_' + cartridge);

					// define parameters for unzip task
					grunt.config('http.unzipUpload_' + cartridge, buildHTTPConfig(instance, cartridgeArchiveName, 'UNZIP'));
					unzipTasks.push('http:unzipUpload_' + cartridge);

					// define parameters for delete task
					if (settings['code.upload.cleanup']) {
						grunt.config('http.deleteUpload_' + cartridge, buildHTTPConfig(instance, cartridgeArchiveName, 'DELETE'));
						deleteTasks.push('http:deleteUpload_' + cartridge);
					}
				});
			}

			// Copy site_template data when
			if (settings['build.project.codeonly']) {
				grunt.log.verbose.writeln('Skipping site_template data, codeonly set to true');
			}
			else {

				var siteTemplateMoveParameters = getMoveParameters({
					grunt: grunt,
					includeDirs: ['.'],
					cwd: 'exports/' + cloneOptions.id + '/' + configurationPath,
					dest: 'output/site_import/' + version + '/',
					sourceGlob: '/**/*'
				});

				grunt.config('copy.site_import' + cloneOptions.id, siteTemplateMoveParameters);
			}
		});

		grunt.registerTask('checkout', checkoutTasks);

		if (!settings['code.upload.granularity'] || settings['code.upload.granularity'] === 'VERSION') {

			// define parameters for compress task
			grunt.config('compress.code',
				{
					options: {
						archive: 'output/code/' + version + '.zip'
					},
					files: [{
						src: ['**'],
						cwd: 'output/code/' + version,
						dest: version,
						expand: true
					}]
				}
			);

			// define parameters for upload task
			grunt.config('dw_upload.code', {
				options: {
					release_path: instance["webdav.cartridge.root"] + version + '.zip'
				},
				files: {
					src: 'output/code/' + version + '.zip',
				}
			});

			// define parameters for unzip task
			grunt.config('http.unzipUpload', buildHTTPConfig(instance, version + '.zip', 'UNZIP'));

			// define parameters for delete task
			if (settings['code.upload.cleanup']) {
				// define parameters for delete task
				grunt.config('http.deleteUpload', buildHTTPConfig(instance, version + '.zip', 'DELETE'));
			}

		}
		else {
			grunt.registerTask('compress:code', compressTasks);
			grunt.registerTask('dw_upload:code', uploadTasks);
			grunt.registerTask('http:unzipUpload', unzipTasks);
			grunt.registerTask('http:deleteUpload', deleteTasks);
		}

		grunt.log.verbose.writeln(JSON.stringify(grunt.config(), null, 1));
};