'use strict';

/**
 * The onRequest hook is called with every top-level request in a site. This happens both for requests to cached and non-cached pages.
 * For performance reasons the hook function should be kept short.
 *
 * @module  request/OnRequest
 */
var ltkActivityTracking = require('int_listrak_controllers/cartridge/controllers/ltkActivityTracking.js');
var Status = require('dw/system/Status');
var app = require('*/cartridge/scripts/app');
var URLParsing = require('*/cartridge/scripts/util/URLParsing');
/**
 * The onRequest hook function.
 */
exports.onRequest = function () {
	var isAuthenticatedCustomer = customer.isAuthenticated();
	if(isAuthenticatedCustomer){
		var cookie = request.httpCookies['loginStatus'];
		if(!empty(cookie)){
			cookie.setMaxAge(1800000);
		}
	}

/*	Site Context called for every request to identify current site user is browsing
	Sets the currentSite value to default value if the session is new */
	require('app_rapala_core/cartridge/scripts/siteContext/SetCurrentSiteContext.ds').setSiteContext(request.httpParameterMap);
	ltkActivityTracking.TrackRequest();

	// if(request.httpCookies['redirectURL']) {
	// 	return response.redirect(request.httpCookies['redirectURL']);
	// }

	var InterstitialHelper = require('*/cartridge/scripts/util/InterstitialHelper');

	// var interstitialSiteId = session.custom.interstitialSiteId ? session.custom.interstitialSiteId : null;

	
	// if (session.custom.interstitialSiteId) {
	// 	// if(session.custom.redirectURL) {
	// 	// 	return new Status(Status.OK);
	// 	// }
	// 	var temp = request.httpCookies['preferredRegion'];
	// 	console.log(temp);

	// 	if (request.httpPath.indexOf(interstitialSiteID) != -1) {
	// 		return new Status(Status.OK);
	// 	}

	// 	var url = InterstitialHelper.setRedirectUrl(request);
	// 	// session.custom.redirectURL = url;
	// 	return response.redirect(url);
	// }

	// if(request.httpCookies['preferredRegion'] && request.httpPath.indexOf('Analytics-Start') != -1) {
	// 		var url = InterstitialHelper.setRedirectUrl(request);
	// 		Logger.debug('URL', url);

	// }
	
	var temp = URLParsing.getPreferredRegion(request);
	// console.log(temp);
	
	// var prefReg = session.custom.hasProperty('preferredRegion');
	// console.log(prefReg);

	if (!request.httpCookies.preferredRegion && !session.custom.showCountryPopup
		&& (URLParsing.getPreferredRegion(request) != null || request.httpPath.indexOf('UpdateCurrency') != -1 
		|| request.httpPath.indexOf('SetLocale') != -1 || request.httpPath.indexOf('Default') != -1)) {
		InterstitialHelper.setInterstitialSiteCookie(request);
	}

	if (!request.httpParameterMap.isParameterSubmitted('countrySelect') && !request.httpParameterMap.isParameterSubmitted('sessionRedirect')) {
		if (!empty(InterstitialHelper.getInterstitialSiteCookie())) {
			interstitialSiteId = InterstitialHelper.getInterstitialSiteCookie().value;
		}
		if (!empty(interstitialSiteId) && request.httpPath.indexOf(interstitialSiteId) == -1) {
			var url = InterstitialHelper.setRedirectUrl(request);
			return response.redirect(url);
		}
	}

	var enableGeoRedirect = dw.system.Site.current.getCustomPreferenceValue('enableGeoIPRedirects');
	if (enableGeoRedirect && dw.system.Site.current.getCustomPreferenceValue('GeoIPRedirectType').value === 'request') {
		var GeoipRedirects = require('*/cartridge/controllers/GeoipRedirects.js');
		app.getController('GeoipRedirects').geolocationRestrictions();
    }

    return new Status(Status.OK);
};