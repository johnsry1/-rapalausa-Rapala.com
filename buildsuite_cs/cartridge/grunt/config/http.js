module.exports = {
	options: {
		method: 'POST',
		headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'de-de,de;q=0.8,en-us;q=0.5,en;q=0.3',
				'Connection': 'keep-alive',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0'
			},
		},
	unzipUpload: {
		/* Set in lib/generate_config */
	},
	deleteUpload: {
		/* Set in lib/generate_config */
	},
	login: {
		options: {
			url: 'https://<%= instance["webdav.server"] %>/on/demandware.store/Sites-Site/default/ViewApplication-ProcessLogin',
			form: {
				LoginForm_Login: '<%= instance["webdav.username"] %>',
				LoginForm_Password: '<%= instance["webdav.password"] %>',
				LoginForm_RegistrationDomain: 'Sites'
			},
			jar: true,
			followRedirect: true,
			ignoreErrors: true
		}
	},
	welcomePage: {
		options: {
			url: 'https://<%= instance["webdav.server"] %>/on/demandware.store/Sites-Site/default/ViewApplication-DisplayWelcomePage',
			jar: true
		}
	},
	activateCodeVersion: {
		options: {
			url: 'https://<%= instance["webdav.server"] %>/on/demandware.store/Sites-Site/default/ViewCodeDeployment-Activate',
			form: {
				CodeVersionID: '<%= version %>'
			},
			jar: true
		}
	},
	importSite: {
		// Import site template configuration, status of import is not being checked yet.
		// reference https://bitbucket.org/demandware/build-suite-ant/src/ebdc2054820dec01047f547469aa2f5a8292cd66/cartridges/build_cs/cartridge/build/build_remote.xml?at=master
		options: {
			url: 'https://<%= instance["webdav.server"] %>/on/demandware.store/Sites-Site/default/ViewSiteImpex-Dispatch',
			form: {
				ImportFileName: '<%= version %>.zip',
				import: 'OK',
				realmUse: 'false'
			},
			jar: true
		}
	}
}