module.exports = {
	build: {
		options: {
			style: 'expanded', 
			sourceMap: true, 
		},
		// Switch to using maps of files in config.json
		files: [{
			expand: true, 
			cwd: 'output/code/<%= version %>/',
			src: '**/<%= instance["sass.src"] %>/style.scss',
			ext: '.css',
			dest: 'output/code/<%= version %>/',
			sassSrc: '<%= instance["sass.src"] %>',
			sassDest: '<%= instance["sass.dest"] %>',
			rename: function (dest, src) {
				return dest + src.replace(this.sassSrc, this.sassDest);
			}
		}]
	}, 
	dev: {
		options: {
			style: 'expanded', 
			sourceMap: true, 
		},
		files: [{
			expand: true, 
			cwd: '<%= instance["watch.path"] %>/',
			ext: '.css',			
			src:  'app_storefront_core/cartridge/scss/default/' + 'style.scss',
			dest: '<%= instance["watch.path"] %>/',
			rename: function(dest,src) {
				return dest + src.replace('scss/default', 'static/default/css');
			}
		}]
			
		
	}

}