'use strict';

/**
 * Controller that renders the store finder and store detail pages.
 *
 * @module controllers/Stores
 */

/* API Includes */
var StoreMgr = require('dw/catalog/StoreMgr');
var SystemObjectMgr = require('dw/object/SystemObjectMgr');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');


/**
 * Provides a form to locate stores by geographical information.
 *
 * Clears the storelocator form. Gets a ContentModel that wraps the store-locator content asset.
 * Updates the page metadata and renders the store locator page (storelocator/storelocator template).
 */
function find() {
    var storeLocatorForm = app.getForm('storelocator');
    storeLocatorForm.clear();
    var Content = app.getModel('Content');
    var storeLocatorAsset = Content.get('store-locator');

    //var pageMeta = require('~/cartridge/scripts/meta');
    //pageMeta.update(storeLocatorAsset);

    app.getView('StoreLocator').render('storelocator/storelocator');
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
    var Content = app.getModel('Content');
    //var storeLocatorAsset = Content.get('store-locator');

    //var pageMeta = require('~/cartridge/scripts/meta');
    //pageMeta.update(storeLocatorAsset);

    var storeLocatorForm = app.getForm('storelocator');
    app.getForm('storelocator').clear();    
    var searchResult = storeLocatorForm.handleAction({
        
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
            	
            	var brandStores = require('app_rapala_core/cartridge/scripts/storelocator/FilterStoreByBrand.ds').filterStoreByBrand(storeLocatorForm,storesMgrResult);	
                return {'stores': brandStores.keySet(), 'searchKey': searchKey, 'type': 'findbyzip'};
            }
        }
    });

    if (searchResult) {
    	app.getView('StoreLocator', searchResult).render('storelocator/storelocatorresults');
    } else {
    	app.getView().render('storelocator/storelocator');
    }

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

    var pageMeta = require('~/cartridge/scripts/meta');
    pageMeta.update(store);

    app.getView({Store: store})
        .render('storelocator/storedetails');

}

/**
 * Renders the details of stores.
 *
 * Sends the response back to ajax.
 */
function findStoresJson() {
	var storeLocatorForm = app.getForm('storelocator').object;
	var searchKey = storeLocatorForm.postalCode.value;
    var storesMgrResult = StoreMgr.searchStoresByPostalCode(storeLocatorForm.countryCode.value, searchKey, storeLocatorForm.distanceUnit.value, storeLocatorForm.maxdistance.value);
    
    var stores = storesMgrResult.keySet();
    if (empty(stores)) {
        return null;
    } else {
    	
    	var brandStores = require('app_rapala_core/cartridge/scripts/storelocator/FilterStoreByBrand.ds').filterStoreByBrand(storeLocatorForm,storesMgrResult);	
    	//send the ajax response
    	app.getView({
    		StoresCount : brandStores.size(),
    		Stores : brandStores.entrySet()
    	}).render('storelocator/storelocatorresultsjson');
    }
	
}
/**
 * Renders the details of stores.
 *
 * Sends the response back to ajax.
 */
function findServiceStoresJson() {
	var storeLocatorForm = app.getForm('storelocator').object;
	var searchKey = storeLocatorForm.postalCode.value;
    var storesMgrResult = StoreMgr.searchStoresByPostalCode(storeLocatorForm.countryCode.value, searchKey, storeLocatorForm.distanceUnit.value, storeLocatorForm.maxdistance.value);
    app.getForm('storelocator').clear();
    var stores = storesMgrResult.keySet();
    if (empty(stores)) {
        return null;
    } else {
    	
    	var brandStores = require('app_rapala_core/cartridge/scripts/storelocator/FilterStoreByBrand.ds').filterStoreByServiceCenter(storesMgrResult);	
           
    	//send the ajax response
    	app.getView({
    		StoresCount : brandStores.size(),
    		Stores : brandStores.entrySet()
    	}).render('storelocator/storelocatorresultsjson');
    }
	
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

/** Renders the details of a store.
 * @see module:controllers/Stores~findStoresJson */
exports.FindStoresJson = guard.ensure(['post'], findStoresJson);
/** Renders the details of a store.
 * @see module:controllers/Stores~findStoresJson */
exports.FindServiceStoresJson = guard.ensure(['post'], findServiceStoresJson);
