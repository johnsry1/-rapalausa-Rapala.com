'use strict';

/**
 * This controller implements the last step of the checkout. A successful handling
 * of billing address and payment method selection leads to this controller. It
 * provides the customer with a last overview of the basket prior to confirm the
 * final order creation.
 *
 * @module controllers/COSummary
 */

/* API Includes */
var Resource = require('dw/web/Resource');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

var Cart = app.getModel('Cart');

/**
 * Renders the summary page prior to order creation.
 */
function start() {
    var cart = Cart.get();

    // Checks whether all payment methods are still applicable. Recalculates all existing non-gift certificate payment
    // instrument totals according to redeemed gift certificates or additional discounts granted through coupon
    // redemptions on this page.
    var COBilling = app.getController('COBilling');
    if (!COBilling.ValidatePayment(cart)) {
        COBilling.Start();
        return;
    } else {

        Transaction.wrap(function () {
            cart.calculate();
        });

        Transaction.wrap(function () {
            if (!cart.calculatePaymentTransactionTotal()) {
                COBilling.Start();
            }
        });

        var pageMeta = require('~/cartridge/scripts/meta');
        pageMeta.update({pageTitle: Resource.msg('summary.meta.pagetitle', 'checkout', 'Rapala Checkout')});
        app.getView({
            Basket: cart.object
        }).render('checkout/summary/summary');
    }
}

/**
 * This function is called when the "Place Order" action is triggered by the
 * customer.
 */
function submit() {
    // Calls the COPlaceOrder controller that does the place order action and any payment authorization.
    // COPlaceOrder returns a JSON object with an order_created key and a boolean value if the order was created successfully.
    // If the order creation failed, it returns a JSON object with an error key and a boolean value.
    var placeOrderResult = app.getController('COPlaceOrder').Start();
    if (('Order' in placeOrderResult) && ('order_created' in placeOrderResult && placeOrderResult.order_created)) {
        showConfirmation(placeOrderResult.Order);
    } else if('error' in placeOrderResult && placeOrderResult.error){
    	var cart = Cart.get();
        var COBilling = app.getController('COBilling');
        COBilling.ReturnToBIlling(placeOrderResult.error);
    } else {
    	dw.system.Logger.getLogger('CheckoutError', 'CheckoutError').error('checkout error: could not send confirmation email');
    }
}

/**
 * Renders the order confirmation page after successful order
 * creation. If a nonregistered customer has checked out, the confirmation page
 * provides a "Create Account" form. This function handles the
 * account creation.
 */
function showConfirmation(order) {
	
    if (!customer.authenticated) {
        // Initializes the account creation form for guest checkouts by populating the first and last name with the
        // used billing address.
        var customerForm = app.getForm('profile.customer');
        customerForm.setValue('firstname', order.billingAddress.firstName);
        customerForm.setValue('lastname', order.billingAddress.lastName);
        customerForm.setValue('email', order.customerEmail);
    }

    app.getForm('profile.login.passwordconfirm').clear();
    app.getForm('profile.login.password').clear();
    var priceVals;
    priceVals = require('app_rapala_core/cartridge/scripts/cart/calculateProductNetPrice.ds').prodNetPrice(order);
    if(empty(priceVals) || priceVals.length == 0){
    	priceVals[0] = new dw.value.Money(0, dw.system.Site.current.getCurrencyCode());
    	priceVals[1] = new dw.value.Money(0, dw.system.Site.current.getCurrencyCode());
    }
    var pageMeta = require('~/cartridge/scripts/meta');
    pageMeta.update({pageTitle: Resource.msg('confirmation.meta.pagetitle', 'checkout', 'Checkout Confirmation')});
    app.getView({
        Order: order,
        prodNetPrice : priceVals[0],
        surcharge : priceVals[1],
        ContinueURL: URLUtils.https('Account-RegistrationForm') // needed by registration form after anonymous checkouts
    }).render('checkout/confirmation/confirmation');
	
}

/*
 * Module exports
 */

/*
 * Web exposed methods
 */
/** @see module:controllers/COSummary~Start */
exports.Start = guard.ensure(['https'], start);
/** @see module:controllers/COSummary~Submit */
exports.Submit = guard.ensure(['https', 'post'], submit);

/*
 * Local method
 */
exports.ShowConfirmation = showConfirmation;
