'use strict';
var storeLocator = require('../store-locator');

exports.init = function () {
    var locator = window.Scripts.storeLocator,
        options = locator.vars,
        marker  = options.markerurl;

    if ($('#storedetails-wrapper').length > 0) {
        marker = options.markerdetailurl;
    }

    storeLocator.init(options.zoomradius, options.storeurl, marker, options.queryurl, options.cookieurl, options.cookiename, options.defaultlocation, options.maptype);
};
