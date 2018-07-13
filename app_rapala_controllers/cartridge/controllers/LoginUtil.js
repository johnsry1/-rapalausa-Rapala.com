'use strict'

var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
let responseUtils = require('~/cartridge/scripts/util/Response');

function isLoggedInCustomer() {
	var isAuthenciated = customer.isAuthenticated();
	var path = request.httpPath;
	var responseObj = responseUtils.renderJSON({
		isAuthenciated: isAuthenciated 
	});
	return responseObj;
}

exports.IsLoggedInCustomer = guard.ensure(['get'], isLoggedInCustomer);

