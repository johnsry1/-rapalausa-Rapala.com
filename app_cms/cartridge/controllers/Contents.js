'use strict';
/**
* This controller is used to display the footer contents
* dynamically according to the Site Selected
* @module 
*/

var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');

var URLUtils = require('dw/web/URLUtils');

function show() {
	var currentSite : String = session.custom.currentSite;

	switch(currentSite){

	case 'rapala' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','1');
	break;

	case 'sufix' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','2');
	break;

	case 'triggerx' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','3');
	break;

	case 'storm' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','4');
	break;

	case 'luhrjensen' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','5');
	break;

	case 'vmc' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','6');
	break;

	case 'terminator' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','7');
	break;

	case 'bluefox' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','8');
	break;

	case 'williamson' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','9');
	break;

	case 'marcum' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','10');
	break;

	case 'strikemaster' : arrivalLink = URLUtils.url('Folder-Show','fdid','rapala-customer-service','id','11');
	break;

	}

	app.getView({
		ArrivalLink : arrivalLink
		}).render('content/folder/contentsmodel');
}

exports.Show = guard.ensure(['get'], show);


