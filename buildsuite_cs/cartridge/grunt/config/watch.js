module.exports = {
	css: {

		files: [{
			expand:true, 
			cwd: 'C:/Users/jmoody/git/schl-rco/app_storefront_core/cartridge/scss/default/',
			src: '*.scss'
		}],
  		tasks: ['sass:dev'],
  		options: {
                nospawn: true, 
                forever: false
            }
	}
}