'use strict';

/**
 * Controller for Avatax functions
 *
 * @module controllers/Avatax
 */

/* API Includes */
var Site = require('dw/system/Site');
var Transaction = require('dw/system/Transaction');
var OrderMgr = require('dw/order/OrderMgr');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
var createTaxationItemsObject = require('int_avatax/cartridge/scripts/avatax/CreateAvataxTaxationItemsObject');
var createShipToObject = require('int_avatax/cartridge/scripts/avatax/CreateAvataxShipToObject');
var taxationRequest = require('int_avatax/cartridge/scripts/avatax/TaxationRequest');
var addressValidationRequest = require('int_avatax/cartridge/scripts/avatax/AddressValidationRequest');
var postTaxationRequest = require('int_avatax/cartridge/scripts/avatax/PostTaxationRequest');
var cancelTaxationRequest = require('int_avatax/cartridge/scripts/avatax/CancelTaxationRequest');
var libAvatax = require('int_avatax/cartridge/scripts/avatax/libAvatax');

var murmurhash = require('~/cartridge/scripts/avatax/murmurhash');

function calculateTaxes(basket) {
	var ia, shipto, reasonCode;
	var AvataxHelper = new libAvatax();
	var NoCall = session.custom.NoCall;
	var finalCall = session.custom.finalCall;
	var OrderNo = session.custom.OrderNo;

	if(customer && customer.profile && 'VATid' in customer.profile.custom) {
		var VATid = customer.profile.custom.VATid;
	}
	var shipFrom = {
			city: AvataxHelper.getShipFromCity(),
			stateCode: AvataxHelper.getShipFromStateCode(),
			postalCode: AvataxHelper.getShipFromZipCode(),
			countryCode: AvataxHelper.getShipFromCountryCode()
	}
	if (!Site.getCurrent().getCustomPreferenceValue('ATEnable')) {
		return {OK: true};
	}
	if(empty(basket) || empty(basket.defaultShipment) || empty(basket.defaultShipment.shippingAddress)) {
		return {OK: true};
	}
	if(NoCall === true) {
		return {OK: true};
	}
	try {
		ia = createTaxationItemsObject.Execute({Basket: basket, controller: true});
		shipTo = createShipToObject.Execute({Basket: basket, controller: true});

		if (!callsvc(ia, shipTo, shipFrom, basket, OrderNo, VATid)){
			return {OK: true};
		}
		reasonCode = taxationRequest.Execute({Basket: basket, billTo: basket.getBillingAddress(), customer: customer, finalCall: finalCall, itemArray: ia.items, OrderNo: OrderNo, shipFrom: shipFrom, shipTo: shipTo.shipToArray, VATid: VATid});
		if(!empty(reasonCode) && reasonCode == 2) {
			//return PIPELET_ERROR; =>> reasonCode == 2
			return {ERROR: true};
		}
		session.custom.finalCall = false;
		session.custom.OrderNo = null;

		return {OK: true};
	}
	catch(e) {
		return {ERROR: true};
	}
}

function callsvc(ia, shipTo, shipFrom, basket, OrderNo, VATid) {
	var AvataxHelper = new libAvatax();
	var req = {
			ia: ia.hashArray,
			shipTo: shipTo.hashArray
	};

	// DocType
	if (session.custom.finalCall != null && session.custom.finalCall) {
		req.docType = 'SalesInvoice';
	}
	else {
		req.docType = 'SalesOrder';
	}

	// JurisdictionID
	var jurisdictionID = null;
	if (!empty(basket.defaultShipment.shippingAddress)) {
		var loc = new dw.order.ShippingLocation(basket.defaultShipment.shippingAddress);
		jurisdictionID = dw.order.TaxMgr.getTaxJurisdictionID(loc);
	}
	req.jurisdictionID = jurisdictionID;

	// detailLevel
	var detailLevel = 'Line';
	if (!empty(jurisdictionID)) {
		detailLevel = 'Tax';
	}

	req.commit 					= true;
	req.detailLevel 			= detailLevel;
	req.companyCode 			= AvataxHelper.getCompanyCode();
	req.docDate 				= AvataxHelper.getFormattedDate();;
	req.docCode 				= OrderNo;
	req.customerCode 			= customer != null && "ID" in customer ? customer.ID : "Cust123";
	req.customerUsageType		= customer.authenticated && "entityCode" in customer.profile.custom ? customer.profile.custom.entityCode : "";
	req.currencyCode			= basket.getCurrencyCode();
	req.businessIdentificationNo = VATid;

	var addresses = new Array();

	//set to billing address using the origin address (i.e. warehouse address)
	var origin 					= {};

	origin.addressCode 			= "0";
	origin.line1 				= "";
	origin.line2 				= "";
	origin.city 				= shipFrom.city;
	origin.region 				= shipFrom.stateCode;
	origin.postalCode 			= shipFrom.postalCode;
	origin.country 				= shipFrom.countryCode;
	addresses.push(origin);

	//Using the shipToObject, set the destination addresses
	for each (let destAddress in shipTo.hashArray){
		addresses.push(destAddress);
	}

	req.addresses = addresses;
	req.destinationCountryCode = loc.countryCode;
	req.originCountryCode = origin.country;

	// Add line items to array for request object
	var _items = new Array();
	for each (var item in ia.hashArray) {
		_items.push(item);	
	}
	req.lines = _items;

	var reqHash = murmurhash.hashBytes(JSON.stringify(req), JSON.stringify(req).length, 523);

	if (session.custom.avataxhash != null && session.custom.avataxhash == reqHash) {
		return true;
	}
	
	session.custom.avataxhash = reqHash;
	return true;
}

function validateAddress(shippingAddress) {
	var address, ErrorMsg, ReasonCode, Response, ResponseObject;

	if (!Site.getCurrent().getCustomPreferenceValue('ATEnable')) {
		return {OK: true};
	}

	if(empty(shippingAddress)) {
		return {OK: true};
	}

	try {
		Response = addressValidationRequest.Execute({ValidateAddress: shippingAddress, controller: true});
		return Response;
	}
	catch(e) {
		return {ERROR: true};
	}
}

function postTax(order){
	var Response;
	if (!Site.getCurrent().getCustomPreferenceValue('ATEnable')) {
		return {OK: true};
	}

	if(!order) {
		return {OK: true};
	}

	try {
		return Response = postTaxationRequest.Execute({Order: order, controller: true});
	}
	catch(e) {
		return {ERROR: true};
	}
}

function cancelTax(order){
	var Response;
	var orderNo = order.orderNo;
	if (!Site.getCurrent().getCustomPreferenceValue('ATEnable')) {
		return {OK: true};
	}

	if(!order) {
		return {OK: true};
	}

	try {
		return Response = cancelTaxationRequest.Execute({OrderNo: orderNo, controller: true});
	}
	catch(e) {
		return {ERROR: true};
	}
}

exports.CalculateTaxes = guard.ensure(['https'], calculateTaxes);
exports.ValidateAddress = guard.ensure(['https'], validateAddress);
exports.PostTax = guard.ensure(['https'], postTax);
exports.CancelTax = guard.ensure(['https'], cancelTax);