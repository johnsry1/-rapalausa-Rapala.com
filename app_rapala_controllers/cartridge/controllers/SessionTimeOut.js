'use strict'

var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

function sessionWarnPopUp() {
	app.getView().render('components/session_warn_popup');
}

function sessionExpiredPopUp() {
	app.getView().render('components/session_expired_popup');
}

exports.SessionWarnPopUp = guard.ensure(['get'], sessionWarnPopUp);
exports.SessionExpiredPopUp = guard.ensure(['get'], sessionExpiredPopUp);
