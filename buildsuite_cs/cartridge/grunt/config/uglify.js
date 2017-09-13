module.exports = {
	all: {
		files: [{
			expand: true,
			cwd: 'output/code/<%= settings["build.project.version"] %>/',
			src: ['**/cartridge/static/**/*.js', '!*.min.js', '!**/lib/**/*.js'],
			dest: 'output/code/<%= settings["build.project.version"] %>/'
		}]
	}
	/* Additional targets created in lib/generate_config */
}
