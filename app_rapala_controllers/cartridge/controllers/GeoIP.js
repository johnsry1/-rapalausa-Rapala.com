'use strict';

/**
 * Controller for rendering a country isml.
 * @module controllers/GeoIP
 */

/* API Includes */
var Logger = require('dw/system/Logger');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

/**
 * Renders a country isml based on current request IP and checks current country 
 */
function country() {
        app.getView().render('geoip/country');
}


/*
 * Export the publicly available controller methods
 */
/** @see module:controllers/GeoIP~country */
exports.Country = guard.ensure(['get'], country);
