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
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');

var Cart = app.getModel('Cart');

var AdyenController = require("int_adyen_controllers/cartridge/controllers/Adyen");
var ltkSignupEmail = require('int_listrak_controllers/cartridge/controllers/ltkSignupEmail.js');

/**
 * Renders the summary page prior to order creation.
 */
function start() {
    var cart = Cart.get();

    // Checks whether all payment methods are still applicable. Recalculates all existing non-gift certificate payment
    // instrument totals according to redeemed gift certificates or additional discounts granted through coupon
    // redemptions on this page.
    var COBilling = require('site_rapalaEU/cartridge/controllers/COBilling.js');
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

        var pageMeta = require('*/cartridge/scripts/meta');
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
    var placeOrderResult = require('site_rapalaEU/cartridge/controllers/COPlaceOrder.js').Start();
    if (placeOrderResult.error) {
        var cart = Cart.get();
        var COBilling = require('site_rapalaEU/cartridge/controllers/COBilling.js');
        COBilling.ReturnToBIlling(placeOrderResult);
    } else if (placeOrderResult.order_created) {
        if (placeOrderResult.Order.paymentInstrument.paymentMethod == "Adyen") {
            AdyenController.Redirect(placeOrderResult.Order);
        } else {
            if (placeOrderResult.skipSubmitOrder === true) {
                placeOrderResult.view.render('adyenform');
            } else {
                showConfirmation(placeOrderResult.Order);
            }
        }
    }
}

/**
 * Renders the order confirmation page after successful order
 * creation. If a nonregistered customer has checked out, the confirmation page
 * provides a "Create Account" form. This function handles the
 * account creation.
 */
function showConfirmation(order) {
    var signUpMap = new dw.util.HashMap();
    signUpMap.put('ltkSubscriptionCode', 'checkout');
    signUpMap.put('dwfrm_billing_billingAddress_addToEmailList', app.getForm('billing').object.billingAddress.addToEmailList.value);
    signUpMap.put('dwfrm_billing_billingAddress_email_emailAddress', app.getForm('billing').object.billingAddress.email.emailAddress.value);
    signUpMap.put('dwfrm_billing_billingAddress_addressFields_firstName', app.getForm('billing').object.billingAddress.addressFields.firstName.value);
    signUpMap.put('dwfrm_billing_billingAddress_addressFields_lastname', app.getForm('billing').object.billingAddress.addressFields.lastName.value);
    signUpMap.put('brand', session.custom.currentSite);
    signUpMap.put('source', 'checkout');
    var signupObject = {
        httpParameterMap : signUpMap
    }
    ltkSignupEmail.Signup(signupObject);
    
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

    var priceVals = require('*/cartridge/scripts/cart/calculateProductNetPrice.ds').prodNetPrice(order);
    
    var pageMeta = require('*/cartridge/scripts/meta');
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
