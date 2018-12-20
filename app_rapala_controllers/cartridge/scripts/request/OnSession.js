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
var URLUtils = require('dw/web/URLUtils');
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
	var showPopup = true,
		isUsSite = dw.system.Site.getCurrent().ID == 'rapala';

	session.custom.showShopByBrand = isUsSite;
	session.custom.redirectGeolocation = false;
	
	// check for cookie
	var InterstitialHelper = require('*/cartridge/scripts/util/InterstitialHelper');
	var CountrySelectorViewed = InterstitialHelper.getPopupShownCookie();
	if (CountrySelectorViewed) {
		return showPopup = false;
		sesssion.custom.showShopByBrand = false;
	}

	// check if a category page or PDP is being accessed directly
	if (request.httpParameterMap.isParameterSubmitted('pid')) {
		session.custom.countrySelectorPid=request.httpParameterMap.pid.value;
	} else if (request.httpParameterMap.isParameterSubmitted('cgid')) {
		session.custom.countrySelectorCgid=request.httpParameterMap.cgid.value;
	} else if (request.httpParameterMap.isParameterSubmitted('cid')) {
		session.custom.countrySelectorCid=request.httpParameterMap.cid.value;
	} else if (request.httpParameterMap.isParameterSubmitted('fdid')) {
		session.custom.countrySelectorFdid=request.httpParameterMap.fdid.value;
	}
	
	// set cookie
	InterstitialHelper.setPopupShownCookie();
	
	return showPopup;
}

function getPreferredRegion() {
	// check for cookie
	var InterstitialHelper = require('*/cartridge/scripts/util/InterstitialHelper');
	var preferredRegion = InterstitialHelper.getInterstitialSiteCookie();
	
	return preferredRegion;
}

/**
 * The onSession hook function.
 */
exports.onSession = function () {
    session.custom.device = getDeviceType();
    session.custom.showCountryPopup = showCountryPopup();
    session.custom.interstitialSiteId = getPreferredRegion();
    var InterstitialHelper = require('*/cartridge/scripts/util/InterstitialHelper');
    
    if (dw.system.Site.current.getCustomPreferenceValue('GeoIPRedirectType').value === 'session' && !session.custom.showCountryPopup) {
		app.getController('GeoipRedirects').geolocationRestrictions();
    }
    app.getController('GeoipRedirects').geoIpDefaultCurrency();
    if (!request.httpParameterMap.isParameterSubmitted('countrySelect')) {
	    var cookies = request.getHttpCookies(),
	        cookieCount = cookies.cookieCount,
	        CountrySelectorViewed = InterstitialHelper.getPopupShownCookie(),
	        geoRedirect = !empty(CountrySelectorViewed) && dw.system.Site.current.getCustomPreferenceValue('enableGeoIPRedirects');

		if (geoRedirect && !empty(dw.system.Site.current.getCustomPreferenceValue('GeoIPRedirects'))) {
			let geolocation = request.geolocation;
			let redirects = JSON.parse(dw.system.Site.current.getCustomPreferenceValue('GeoIPRedirects'));
			app.getController('GeoipRedirects').geoIPRedirection(geolocation , redirects);
		}
    }

    return new Status(Status.OK);
};
