module.exports = {
	all: {
		files: [{
			expand: true,
			cwd: 'output/code/<%= settings["build.project.version"] %>/',
			src: '**/cartridge/static/**/*.css',
			dest: 'output/code/<%= settings["build.project.version"] %>/'
		}]
	}
	/* Additional targets created in lib/generate_config */
}
