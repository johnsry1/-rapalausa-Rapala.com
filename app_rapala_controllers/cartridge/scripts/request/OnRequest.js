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
/**
 * The onRequest hook function.
 */
exports.onRequest = function () {
	
/*	Site Context called for every request to identify current site user is browsing
	Sets the currentSite value to default value if the session is new */
	require('app_rapala_core/cartridge/scripts/siteContext/SetCurrentSiteContext.ds').setSiteContext(request.httpParameterMap);
	ltkActivityTracking.TrackRequest();
    return new Status(Status.OK);
};
