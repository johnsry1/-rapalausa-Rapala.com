module.exports = {
  options: {
    processors: [
        require('autoprefixer')({
        })
    ]
  },
  build: {
    files: [{
			expand: true,
			cwd: 'output/code/<%= settings["build.project.version"] %>/',
			src: '**/*.css',
			dest: 'output/code/<%= settings["build.project.version"] %>/'
		}]
  },
  dev: {
    files: [{
			expand: true, 
			cwd: '<%= instance["watch.path"] %>/',			
			src:  'app_storefront_core/cartridge/static/default/' + 'style.css',
			dest: '<%= instance["watch.path"] %>/',
		}]
  }
}

