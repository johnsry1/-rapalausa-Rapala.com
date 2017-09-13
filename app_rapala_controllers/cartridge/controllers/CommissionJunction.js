'use strict';


/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
var Transaction = require('dw/system/Transaction');
/**
 *Renders the setcookie.isml template.
 */

function setCookie(){
	app.getView({
	}).render('components/header/setcookie');
}

/**
 *Renders the fetchingudodetails.isml template.
 */
function udoDetails(){
	app.getView({
		OrderID : request.httpParameterMap.OrderID
    }).render('components/header/fetchingudodetails');
}



/**
 *Renders the settingcookieinto_oms.isml template.
 */
function storeUDOToOms(){
	Transaction.wrap(function(){
		require('app_rapala_core/cartridge/scripts/common/SettingUDOAttribute.ds').setOrderData(request.httpParameterMap.OrderID);
	});
}

function appendCjGoogle(){
	app.getView().render('components/header/appendingcjtoga');
}


/** It will set cookie when commission junction parameters came from URL
* @see module:controllers/commissionJuntion~setCookie */
exports.SetCookie = guard.ensure(['get'], setCookie);

/** It will set UDO details as request by CJ and passing it into script
* @see module:controllers/commissionJuntion~udoDetails */
exports.UDODetails = guard.ensure(['get'], udoDetails);

/** It will cookie values set at header and storing the same into DW order attribute
* @see module:controllers/commissionJuntion~storeUDOToOms */
exports.StoreUDOToOms = guard.ensure(['get'], storeUDOToOms);

/** It will cookie values set at header and send the values to CJ
* @see module:controllers/commissionJuntion~storeUDOToOms */
exports.AppendCjGoogle = guard.ensure(['get'], appendCjGoogle);