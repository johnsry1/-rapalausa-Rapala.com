'use strict';

/**
 * Controller for Avatax test functions
 *
 * @module controllers/AvataxTest
 */

/* API includes */
var URLUtils = require('dw/web/URLUtils');
var Site = require('dw/system/Site');
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
var addressValidationRequest = require('int_avatax/cartridge/scripts/avatax/AddressValidationRequest');
var Avatax = require('~/cartridge/controllers/Avatax');

function validateAddress() {
	var validateOrder, validateAddress, validateResponse;
	var orderNo = request.httpParameterMap.get('orderNo');
	if(!Site.getCurrent().getCustomPreferenceValue('ATEnableTesting')) {
		app.getView().render('avatax/TestError');
	} else {
		validateOrder = OrderMgr.getOrder(orderNo.toString());
		validateAddress = validateOrder.defaultShipment.shippingAddress;
				
		let validateResponse = Avatax.ValidateAddress(validateAddress);
		
		app.getView({
	        Order: validateOrder,
	        ReasonCode: validateResponse.ReasonCode,
	        ResponseObject: validateResponse.ResponseObject,
	        ErrorMsg: validateResponse.ErrorMsg
		}).render('avatax/TestValidateAddress');	
	}	
}

function postTax() {
	var validateOrder, validateResponse;
	var orderNo = request.httpParameterMap.get('orderNo');
	if(!Site.getCurrent().getCustomPreferenceValue('ATEnableTesting')) {
		app.getView().render('avatax/TestError');
	} else {
		validateOrder = OrderMgr.getOrder(orderNo.toString());
		let validateResponse = Avatax.PostTax(validateOrder);
		
		app.getView({
	        Order: validateOrder,
	        ReasonCode: validateResponse.ReasonCode,
	        ErrorMsg: validateResponse.ErrorMsg
		}).render('avatax/TestPostTax');
	}
}

function cancelTax() {
	var validateOrder, validateResponse;
	var orderNo = request.httpParameterMap.get('orderNo');
	if(!Site.getCurrent().getCustomPreferenceValue('ATEnableTesting')) {
		app.getView().render('avatax/TestError');
	} else {
		validateOrder = OrderMgr.getOrder(orderNo.toString());
		let validateResponse = Avatax.CancelTax(validateOrder);
		
		app.getView({
	        Order: validateOrder,
	        ReasonCode: validateResponse.ReasonCode,
	        ErrorMsg: validateResponse.ErrorMsg
		}).render('avatax/TestCancelTax');
	}
}

exports.ValidateAddress = guard.ensure(['https'], validateAddress);
exports.PostTax = guard.ensure(['https'], postTax);
exports.CancelTax = guard.ensure(['https'], cancelTax);