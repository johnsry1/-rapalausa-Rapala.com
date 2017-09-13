'use strict';

/**
 * Controller that renders the home page.
 *
 * @module controllers/Home
 */

var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');

/**
 * Renders the left nav in static page.
 */
function show() {
	
	if(!empty(request.httpParameterMap.rootfdid.stringValue)){
		var rootfdid = request.httpParameterMap.rootfdid.stringValue!=null ? request.httpParameterMap.rootfdid.stringValue : rootfdid;
		var folder : Folder= require('~/cartridge/scripts/scripts/GetFolder.ds').getFolderFromID(rootfdid);
		if(folder != null && !empty(folder)){
			app.getView({
				Folder : folder
				}).render('content/leftnav/leftnav');
		}
		else{
			app.getView().render('content/error/emptydiv');
			
		}
	}
	else{
		app.getView().render('content/error/emptydiv');
	}
	
}

/**
 * Renders the css brands.
 */
function showCSBrands() {
	app.getView().render('content/leftnav/csbrands');
}

/*
 * Export the publicly available controller methods
 */
/** Renders the static lev nav page.
 * @see module:controllers/Folder~show */
exports.Show = guard.ensure(['get'], show);

/** Renders the static lev nav page.
 * @see module:controllers/Folder~show */
exports.ShowCSBrands = guard.ensure(['get'], showCSBrands);

