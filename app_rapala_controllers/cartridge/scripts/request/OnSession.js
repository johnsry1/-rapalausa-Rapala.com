'use strict';

/**
 * The onSession hook is called for every new session in a site. This hook can be used for initializations,
 * like to prepare promotions or pricebooks based on source codes or affiliate information in
 * the initial URL. For performance reasons the hook function should be kept short.
 *
 * @module  request/OnSession
 */

var Status = require('dw/system/Status');

var GeoipRedirects = require('*/cartridge/controllers/GeoipRedirects.js');
var app = require('*/cartridge/scripts/app');
/**
 * Gets the device type of the current user.
 * @return {String} the device type (desktop, mobile or tablet)
 */
function getDeviceType() {
    var deviceType = 'desktop';
    var iPhoneDevice = 'iPhone';
    var iPadDevice = 'iPad';
    var androidDevice = 'Android'; //Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; ADR6300 Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1

    var httpUserAgent = request.httpUserAgent;

    if (httpUserAgent.indexOf(iPhoneDevice) > -1) {
        deviceType = 'mobile';

    } else if (httpUserAgent.indexOf(androidDevice) > -1) {
        if (httpUserAgent.toLowerCase().indexOf('mobile') > -1) {
            deviceType = 'mobile';
        } else {
        		deviceType = 'tablet';
        }
    } else if (httpUserAgent.indexOf(iPadDevice) > -1) {
        deviceType = 'tablet';
    }

    return deviceType;
}

function showCountryPopup() {
	var showPopup = true;
	
	return showPopup;
}

/**
 * The onSession hook function.
 */
exports.onSession = function () {
    session.custom.device = getDeviceType();
    session.custom.showCountryPopup = showCountryPopup();
    if (dw.system.Site.current.getCustomPreferenceValue('GeoIPRedirectType').value === 'session') {
		app.getController('GeoipRedirects').geolocationRestrictions();
    }
    app.getController('GeoipRedirects').geoIpDefaultCurrency();
    return new Status(Status.OK);
};
