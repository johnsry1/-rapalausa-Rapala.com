/*
 * Initialize FTP services for a cartridge
 */    
var ServiceRegistry = require('dw/svc/ServiceRegistry');

ServiceRegistry.configure("listrak.ftp", {
	createRequest: function(svc, args){
		return svc;
	},
	parseResponse: function(svc, client) {
		return client;
	}
});