module.exports = {
	dist: {
		src: [ '**/*.ds' ],
		options: {
			destination: 'doc',
			configure: 'dw-conf.json'
		}
	}
}