'use strict';

/**
 * Controller that renders the home page.
 *
 * @module controllers/Home
 */

var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');

/**
 * Renders the home page.
 */
function show() {
	var fdid = request.httpParameterMap.fdid.stringValue!=null ? request.httpParameterMap.fdid.stringValue : fdid;
	var folder : Folder= require('~/cartridge/scripts/scripts/GetFolder.ds').getFolderFromID(fdid);
	
	if(empty(folder.template)){
		app.getView({
			Folder : folder
			}).render('content/folder/folderview');
	}
	else{
		app.getView({
			Folder : folder
			}).render(folder.template);
	}
	
}



/*
 * Export the publicly available controller methods
 */
/** Renders the home page.
 * @see module:controllers/Folder~show */
exports.Show = guard.ensure(['get'], show);

