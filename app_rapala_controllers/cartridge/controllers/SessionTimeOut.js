'use strict'

var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
let responseUtils = require('~/cartridge/scripts/util/Response');

function sessionWarnPopUp() {
	app.getView().render('components/session_warn_popup');
}

function sessionExpiredPopUp() {
	app.getView().render('components/session_expired_popup');
}

function sessionReset() {
	var responseObj = responseUtils.renderJSON({
		sessionReset: true
	});
	return responseObj;
}

function isLoggedInCustomer() {
	var isAuthenciated = customer.isAuthenticated();
	var responseObj = responseUtils.renderJSON({
		isAuthenciated: isAuthenciated 
	});
	return responseObj;
}

exports.SessionWarnPopUp = guard.ensure(['get'], sessionWarnPopUp);
exports.SessionExpiredPopUp = guard.ensure(['get'], sessionExpiredPopUp);
exports.SessionReset = guard.ensure(['get'], sessionReset);
exports.IsLoggedInCustomer = guard.ensure(['get'], isLoggedInCustomer);
