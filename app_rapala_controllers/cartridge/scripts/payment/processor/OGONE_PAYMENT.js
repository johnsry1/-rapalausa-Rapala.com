'use strict';

/* API Includes */
var Cart = require('~/cartridge/scripts/models/CartModel');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('~/cartridge/scripts/app');

/**
 * Verifies a credit card against a valid card number and expiration date and possibly invalidates invalid form fields.
 * If the verification was successful a credit card payment instrument is created.
 */
function Handle(args) {
    var cart = Cart.get(args.Basket);

    app.getForm('billing.paymentMethods.creditCard').clear();
    app.getForm('billing.paymentMethods.bml').clear();

    Transaction.wrap(function () {
        Cart.goc().removeAllPaymentInstruments();
    });

    session.forms.billing.paymentMethods.creditCard.saveCard.value = false;

    Transaction.wrap(function () {
        cart.removeExistingPaymentInstruments('OGONE');
        cart.createPaymentInstrument('OGONE', cart.getNonGiftCertificateAmount());
    });

    return {success: true};
}

/**
 * Authorizes a payment using a credit card. The payment is authorized by using the BASIC_CREDIT processor
 * only and setting the order no as the transaction ID. Customizations may use other processors and custom
 * logic to authorize credit card payment.
 */
function Authorize(args) {
    var orderNo = args.OrderNo;
    var paymentInstrument = args.PaymentInstrument;
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();

    session.privacy.OrderNo = args.OrderNo;

    Transaction.wrap(function () {
        paymentInstrument.paymentTransaction.transactionID = orderNo;
        paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
    });


	var scriptResult = new dw.system.Pipelet('Script', {
        Transactional: true,
        OnError: 'PIPELET_ERROR',
        ScriptFile: 'int_ogone:ogone/CreateRequest.ds'
    }).execute({
        Basket: args.Order,
        PaymentInstrument : paymentInstrument,
        OrderNo : orderNo
    });

	if (scriptResult.result === 2) {
		return {error: true};
	}

	return {
        redirectUrl : scriptResult.ActionURL,
        redirectParams : scriptResult.OgoneParams
    };

}

/*
 * Module exports
 */

/*
 * Local methods
 */
exports.Handle = Handle;
exports.Authorize = Authorize;