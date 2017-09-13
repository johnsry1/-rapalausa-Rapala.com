'use strict';

/**
 * Controller that renders the home page.
 *
 * @module controllers/Home
 */

var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');

/**
 * Renders the about us page.
 */
function show() {
	app.getView().render('content/folder/customerserviceaboutus');
}

/**
 * Renders the about us left nav in about us page.
 */
function leftNav() {
	app.getView().render('content/folder/customerserviceaboutusleftnav');
}

/*
 * Export the publicly available controller methods
 */
/** Renders the static page.
 * @see module:controllers/AboutUs~show */
exports.Show = guard.ensure(['get'], show);

/** Renders the static left page.
 * @see module:controllers/AboutUs~show */
exports.LeftNav = guard.ensure(['get'], leftNav);
