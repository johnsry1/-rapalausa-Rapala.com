/*
 * Initialize HTTP services for a cartridge
 */
var ServiceRegistry = require('dw/svc/ServiceRegistry');

ServiceRegistry.configure("listrak.http", {
	createRequest: function(service, args){
		service.setRequestMethod("GET");
		return service;
	},
	parseResponse: function(svc, client) {
		return client.text;
	},
	filterLogMessage: function(msg) {
		return msg.replace("headers", "OFFWITHTHEHEADERS");
	}
});
	
	