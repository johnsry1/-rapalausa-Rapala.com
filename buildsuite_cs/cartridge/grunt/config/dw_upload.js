module.exports = {
	options: {
		basic_auth: true,
		overwrite_release: true,
		two_factor: '<%=instance["webdav.two_factor"] %>',
		two_factor_p12: '<%=instance["webdav.two_factor.cert"] %>', //path to p12 (pfx) file
		two_factor_password: '<%=instance["webdav.two_factor.password"] %>',
		two_factor_url: 'https://<%=instance["webdav.server.cert.url"]%>',
		url: 'https://<%= instance["webdav.server"] %>'
	},
	code: {
		/* Set in lib/generate_config */
	},
	site_import: {
		options: {
			release_path: '<%= instance["webdav.site_import.root"] %><%= version %>.zip'
		},
		files: {
			src: 'output/site_import/<%= version %>.zip'
		}
	}
}
