'use strict';

/**
 * TestHelpers are for automating developer testing tasks
 * They should all use the 'nonproduction' guard filter so they cannot be used on Production
 *
 * @module controllers/TestHelpers
 */

var OrderMgr = require('dw/order/OrderMgr');
var URLUtils = require('dw/web/URLUtils');

var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');

//depecencies of customer login
var Customer = app.getModel('Customer');
//dependency in Billing().  required for adding shipping data to cart
var Transaction = require('dw/system/Transaction');


/**
 * Adds inputed products to cart and redirects to cart page
 * Accepts URL params 'pid'*
 * Ex. TestHelpers-GetTestCart1?pid=SKU1234&pid=SKU5678
 */
function getTestCart1() {

	var cart = app.getModel('Cart').goc();
    var Product = app.getModel('Product');
    var productIDsToAdd;
    var productToAdd;

    var productParams = request.httpParameterMap.pid.stringValues;
    if (productParams.length > 0) {
        productIDsToAdd = productParams.toArray();
    } else {
    	// default products to add can be set here
        productIDsToAdd = [];
    }

    productIDsToAdd.forEach(function(productIDToAdd) {
        productToAdd = Product.get(productIDToAdd);
        cart.addProductItem(productToAdd.object, 1, null);
    });

    response.redirect(URLUtils.https('Cart-Show'));
}

/**
 * Adds inputed products to cart, sets shipping method, shipping address, billing address, and redirects to cart page
 * Accepts URL params 'pid'*
 * Ex. https://dev08.rapala.com/on/demandware.store/Sites-rapalaEU-Site/en_EC/TestHelpers-Billing?pid=BXB06TAM
 */
function getBilling() {

	var cart = app.getModel('Cart').goc();
  var Product = app.getModel('Product');
  var productIDsToAdd;
  var productToAdd;

  var productParams = request.httpParameterMap.pid.stringValues;
  if (productParams.length > 0) {
      productIDsToAdd = productParams.toArray();
  } else {
  	// default products to add can be set here
      productIDsToAdd = [];
  }

  productIDsToAdd.forEach(function(productIDToAdd) {
      productToAdd = Product.get(productIDToAdd);
      cart.addProductItem(productToAdd.object, 1, null);
  });

	Transaction.wrap(function () {
		var defaultShipment, shippingAddress;
		defaultShipment = cart.getDefaultShipment();
		shippingAddress = cart.createShipmentShippingAddress(defaultShipment.getID());

		shippingAddress.setTitle('Mr');
		shippingAddress.setFirstName('Derrick - Test');
		shippingAddress.setLastName('Turner - Test');
		shippingAddress.setAddress1('29 Hazlebury');
		shippingAddress.setAddress2('');
		shippingAddress.setCity('London');
		shippingAddress.setPostalCode('SW6 2NA');
		shippingAddress.setStateCode('London');
		shippingAddress.setCountryCode('GB');
		shippingAddress.setPhone('07761659438');
		//defaultShipment.setGift('');
		//defaultShipment.setGiftMessage('');
		cart.updateShipmentShippingMethod(cart.getDefaultShipment().getID(), defaultShipment.getID(), null, null);


		var billingAddress = cart.getBillingAddress();
    if (!billingAddress) {
        billingAddress = cart.createBillingAddress();
    }

		billingAddress.setTitle('Mr');
		billingAddress.setFirstName('Derrick - Test');
		billingAddress.setLastName('Turner - Test');
		billingAddress.setAddress1('29 Hazlebury');
		billingAddress.setAddress2('');
		billingAddress.setCity('London');
		billingAddress.setPostalCode('SW6 2NA');
		billingAddress.setStateCode('London');
		billingAddress.setCountryCode('GB');
		billingAddress.setPhone('07761659438');

    cart.setCustomerEmail('dcturner@lyonscg.com');

		cart.calculate();
		cart.validateForCheckout();

});

  response.redirect(URLUtils.https('COBilling-Start'));
}



/**
 * Displays the order confirmation page for a given order
 * Guest Checkout
 * Accepts URL param 'order'
 * Ex. TestHelpers-GetTestOrderConfirmation?order=00000001
 * Registered User Checkout
 * Accepts 'order', 'user', 'password'
 * Ex. TestHelpers-GetTestOrderConfirmation?order=00000001&user=john@smith.com&password=123456
 * This is useful for styling the Order Confirmation page
 */
function getTestOrderConfirmation() {
    if (request.httpParameterMap.order) {
        var orderNo = request.httpParameterMap.order.stringValue
    }
    var orders = OrderMgr.searchOrders('orderNo={0}', 'creationDate desc', orderNo);
    var order = orders.next();

    if (session.customerAuthenticated) {
      Customer.logout();
    }
    var user = "",
      password = "";

    if(request.httpParameterMap.user != "" && request.httpParameterMap.password != "" ) {
      user = request.httpParameterMap.user.stringValue
      password = request.httpParameterMap.password.stringValue

      var success = Customer.login(user, password, false);
    }

    app.getView({
        OrderNo: orderNo,
        Order: order,
        ContinueURL: URLUtils.https('Account-RegistrationForm') // needed by registration form after anonymous checkouts
    }).render('checkout/confirmation/confirmation');
}

/*
 * Web exposed methods
 */
/** Adds inputed products to cart and redirects to cart page
 * @see module:controllers/TestHelpers~GetTestCart1 */
exports.GetTestCart1 = guard.ensure(['get','nonproduction'], getTestCart1);

/** Adds inputed products to cart and redirects to cart page
 * @see module:controllers/TestHelpers~GetTestCart1 */
exports.Billing = guard.ensure(['get','nonproduction'], getBilling);

/** Displays the order confirmation page for a given order
 * @see module:controllers/TestHelpers~TestOrderConfirmation */
exports.OrderConfirmation = guard.ensure(['get','nonproduction'], getTestOrderConfirmation);
