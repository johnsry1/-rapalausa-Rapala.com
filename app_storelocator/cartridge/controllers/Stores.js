'use strict';

/**
 * Controller that renders the store finder and store detail pages.
 *
 * @module controllers/Stores
 */

/* API Includes */
var StoreMgr = require('dw/catalog/StoreMgr');
var SystemObjectMgr = require('dw/object/SystemObjectMgr');
var StringUtils = require('dw/util/StringUtils');
var Site = require('dw/system/Site');
var Logger = require('dw/system/Logger');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');

var isSearched;
/**
 * Provides a form to locate stores by geographical information.
 *
 * Clears the storelocator form. Gets a ContentModel that wraps the store-locator content asset.
 * Updates the page metadata and renders the store locator page (storelocator/storelocator template).
 */
function find() {
    isSearched = false;
    var storeLocatorForm = app.getForm('storelocator');
    storeLocatorForm.clear();

    var Content = app.getModel('Content');
    var storeLocatorAsset = Content.get('store-locator');

    var pageMeta = require('*/cartridge/scripts/meta');
    pageMeta.update(storeLocatorAsset);

    app.getView('StoreLocator', {isSearched: isSearched}).render('storelocator/storelocator');
}

/**
 * The storelocator form handler. This form is submitted with GET.
 * Handles the following actions:
 * - findbycountry
 * - findbystate
 * - findbyzip
 * In all cases, gets the search criteria from the form (formgroup) passed in by
 * the handleAction method and queries the platform for stores matching that criteria. Returns null if no stores are found,
 * otherwise returns a JSON object store, search key, and search criteria information. If there are search results, renders
 * the store results page (storelocator/storelocatorresults template), otherwise renders the store locator page
 * (storelocator/storelocator template).
 */
function findStores() {
    isSearched = true;
    var Content = app.getModel('Content');
    var storeLocatorAsset = Content.get('store-locator');

    var pageMeta = require('*/cartridge/scripts/meta');
    pageMeta.update(storeLocatorAsset);

    var storeLocatorForm = app.getForm('storelocator');
    var searchResult = storeLocatorForm.handleAction({
        findbycountry: function (formgroup) {
            var searchKey = formgroup.country.htmlValue;
            var stores = SystemObjectMgr.querySystemObjects('Store', 'countryCode = {0}', 'countryCode desc', searchKey);
            if (empty(stores)) {
                return null;
            } else {
                return {'stores': stores, 'searchKey': searchKey, 'type': 'findbycountry'};
            }
        },
        findbystate: function (formgroup) {
            var searchKey = formgroup.state.htmlValue;
            var stores = null;

            if (!empty(searchKey)) {
                stores = SystemObjectMgr.querySystemObjects('Store', 'stateCode = {0}', 'stateCode desc', searchKey);
            }

            if (empty(stores)) {
                return null;
            } else {
                return {'stores': stores, 'searchKey': searchKey, 'type': 'findbystate'};
            }
        },
        findbyzip: function (formgroup) {
            var searchKey = formgroup.postalCode.value;
            var storesMgrResult = StoreMgr.searchStoresByPostalCode(formgroup.countryCode.value, searchKey, formgroup.distanceUnit.value, formgroup.maxdistance.value);
            var stores = storesMgrResult.keySet();
            if (empty(stores)) {
                return null;
            } else {
                return {'stores': stores, 'searchKey': searchKey, 'type': 'findbyzip'};
            }
        }
    });

    if (searchResult) {
        app.getView('StoreLocator', searchResult)
            .render('storelocator/storelocatorresults');
    } else {
        app.getView('StoreLocator', {isSearched: isSearched})
            .render('storelocator/storelocator');
    }

}

/**
 * The storelocator form handler. This form is submitted with GET.
 * Handles the following parameters:
 * - country
 * - distanceUnit
 * - maxDistance
 * - latitude
 * - longitude
 * In all cases, gets the search criteria from the form (formgroup) passed in by
 * the handleAction method and queries the platform for stores matching that criteria. Returns null if no stores are found,
 * otherwise returns a JSON object store, search key, and search criteria information. If there are search results, renders
 * the store results page (storelocator/storesjson template), otherwise renders the store locator page
 * (storelocator/storesjson template).
 */
function getNearestStores() {
    isSearched = true;
    var Content = app.getModel('Content');
    var storeLocatorAsset = Content.get('store-locator');
    var pageMeta = require('*/cartridge/scripts/meta');
    pageMeta.update(storeLocatorAsset);

    var countrycode = request.httpParameterMap.countryCode.value;
    var postalcode = request.httpParameterMap.postalCode.value;
    var distanceUnit = request.httpParameterMap.distanceUnit.value;
    var latitude = request.httpParameterMap.latitude.value;
    var longitude = request.httpParameterMap.longitude.value;
    var maxdistance = request.httpParameterMap.maxdistance.value;
    var stores;
    if (latitude!=null && longitude!=null) {
    	stores = StoreMgr.searchStoresByCoordinates(Number(latitude), Number(longitude), distanceUnit, Number(maxdistance));
    } else if (postalcode!=null && countrycode!=null) {
    	stores = StoreMgr.searchStoresByPostalCode(countrycode, postalcode, distanceUnit, Number(maxdistance));
    } else {
    	stores = SystemObjectMgr.querySystemObjects('Store', 'countryCode = {0}', 'countryCode desc', countrycode);
    }
   	var storesobj = {'stores': stores, 'searchKey': countrycode, 'type': 'findbycountry'};

    app.getView('StoreLocator', storesobj)
        .render('storelocator/components/storesjson');

}

/**
 * Renders the details of a store.
 *
 * Gets the store ID from the httpParameterMap. Updates the page metadata.
 * Renders the store details page (storelocator/storedetails template).
 */
function details() {

    var storeID = request.httpParameterMap.StoreID.value;
    var store = dw.catalog.StoreMgr.getStore(storeID);

    var pageMeta = require('*/cartridge/scripts/meta');
    pageMeta.update(store);

    app.getView({Store: store})
        .render('storelocator/storedetails');

}
/**
 * Sets geo location cookie
 *
 * Gets the location value from the httpParameterMap. Sets the PreferredLocation in session.
 * Renders a blank template.
 */
function setGeoLocation() {

    var location = request.httpParameterMap.location.value;
    if (location.submitted) {

        var cookieName = Site.current.getCustomPreferenceValue('storeLocatorCookieName');

	    if (empty(cookieName)){
	        Logger.error('## GoogleGeolocator: No cookie name available!');
	    }

	    if (!empty(cookieName) && !empty(location)) {
	        var geoCookie = new Cookie(cookieName, location);
	        geoCookie.path = "/";
	        geoCookie.maxAge = 604800;
	        response.addHttpCookie(geoCookie);
	    }

    }
    app.getView().render('components/blank');
}
/**
 * Sets the session store id.
 *
 * Sets session.privacy.storeID with the nearest store on Session.
 * Renders true.
 */
function setSessionStoreID() {

    if (empty(session.privacy.storeID)) {
        if (!empty(request.geolocation) && !empty(request.geolocation.latitude) && !empty(request.geolocation.longitude)) {
            args.latitude = request.geolocation.latitude;
            args.longitude = request.geolocation.longitude;

            var distanceUnit = dw.system.Site.current.preferences.custom.storeLookupUnit.value;
            var countryCode = dw.system.Site.current.preferences.custom.countryCode.value;
            var latitude = request.geolocation.latitude;
            var longitude = request.geolocation.longitude;
            var maxdistance = 200;
            var stores;
            if (latitude!=null && longitude!=null) {
            	stores = StoreMgr.searchStoresByCoordinates(Number(latitude), Number(longitude), distanceUnit, Number(maxdistance));
            } else {
            	stores = SystemObjectMgr.querySystemObjects('Store', 'countryCode = {0}', 'countryCode desc', countryCode);
            }
            if (stores!=null) {
            	session.privacy.storeID = stores.keySet()[0].ID;
	        } else {
	        	session.privacy.storeID = '';
	        }
        } else {
        	session.privacy.storeID = '';
        }
    }
    return true;
}

/*
 * Exposed web methods
 */
/** Renders form to locate stores by geographical information.
 * @see module:controllers/Stores~find */
exports.Find = guard.ensure(['get'], find);
/** The storelocator form handler.
 * @see module:controllers/Stores~findStores */
exports.FindStores = guard.ensure(['post'], findStores);
/** Renders the details of a store.
 * @see module:controllers/Stores~details */
exports.Details = guard.ensure(['get'], details);
/** Renders the stores nearest specified parameters.
 * @see module:controllers/Stores~GetNearestStores */
exports.GetNearestStores = guard.ensure(['get'], getNearestStores);
/** Renders the stores nearest specified parameters.
 * @see module:controllers/Stores~GetNearestStores */
exports.SetGeoLocation = guard.ensure(['get'], setGeoLocation);
/** Sets the session store id.
 * @see module:controllers/Stores~SetSessionStoreID */
exports.SetSessionStoreID = guard.ensure(['get'], setSessionStoreID);
