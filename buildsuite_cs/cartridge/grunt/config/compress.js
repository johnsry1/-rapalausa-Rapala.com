module.exports = {
	code: {
		/* Set in lib/generate_config */
	},
	site_import: {
		options: {
			archive: 'output/site_import/<%= version %>.zip'
		},
		files: [{
			src: [ '**/*' ],
			cwd: 'output/site_import',
			expand: true
		}]
	}
}