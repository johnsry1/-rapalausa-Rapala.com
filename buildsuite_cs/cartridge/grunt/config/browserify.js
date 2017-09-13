module.exports = {
	build: {
		options: { 
			sourceMap: true, 
			browserifyOptions: {
						debug: true
					}
		},
		files: [{
			expand: true, 
			cwd: 'output/code/<%= version %>/',
			src:  '**/cartridge/js/' + 'app.js',
			dest: 'output/code/<%= version %>/',
			rename: function(dest,src) {
				return dest + src.replace('js/', 'static/default/js/');
			}
		}]
	}, 
	dev: {
		options: { 
			sourceMap: true, 
			browserifyOptions: {
						debug: true
					}
		},
		files: [
			{
			expand: true, 
			cwd: '<%= instance["watch.path"] %>/',			
			src:  'app_storefront_richUI/cartridge/js/' + 'app.js',
			dest: '<%= instance["watch.path"] %>/',
			rename: function(dest,src) {
				return dest + src.replace('js/', 'static/default/js/');
			}
		}]		
	}, 
	watchDev: {
		options: {
					watch: true
				},
				files: [
					{
					expand: true, 
					cwd: '<%= instance["watch.path"] %>/',			
					src:  'app_storefront_richUI/cartridge/js/' + 'app.js',
					dest: '<%= instance["watch.path"] %>/',
					rename: function(dest,src) {
						return dest + src.replace('js/', 'static/default/js/');
					}
		}]
				
			}

}