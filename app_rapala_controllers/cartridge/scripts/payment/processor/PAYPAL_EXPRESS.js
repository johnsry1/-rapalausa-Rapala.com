'use strict';

/* API Includes */
var Cart = require('~/cartridge/scripts/models/CartModel');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

/**
 * This is where additional PayPal integration would go. The current implementation simply creates a PaymentInstrument and
 * returns 'success'.
 */
function Handle(args) {
    var cart = Cart.get(args.Basket);

    Transaction.wrap(function () {
        cart.removeExistingPaymentInstruments('PayPal');
        cart.createPaymentInstrument('PayPal', cart.getNonGiftCertificateAmount());
    });

    var pdict = dw.system.Pipeline.execute('Paypal-Handle', {
        PaypalCheckoutFromCart : false
    });

    if (pdict.EndNodeName === 'Error') {
    	cart.setVar(pdict.ScriptLog);
        return {error: true};
    }

    return {success: true, redirectUrl : pdict.PaypalRedirectUrl};
}

/**
 * Authorizes a payment using a credit card. The payment is authorized by using the PAYPAL_EXPRESS processor only
 * and setting the order no as the transaction ID. Customizations may use other processors and custom logic to
 * authorize credit card payment.
 */
function Authorize(args) {
    var orderNo = args.OrderNo;
    var paymentInstrument = args.PaymentInstrument;
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();   
    var paypalErrorContainer;
    
    Transaction.wrap(function () {
        //paymentInstrument.paymentTransaction.transactionID = orderNo;
        paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
    });

    var pdict = dw.system.Pipeline.execute('Paypal-CommitTransaction', {
        Order : args.Order,
        PaymentInstrument : args.PaymentInstrument
    });
    var cart = Cart.get();
    
    if (pdict.EndNodeName === 'Error' || pdict.ErrorCode == true) {
    	paypalErrorContainer = pdict.ResponseData.l_errorcode0+"; "+pdict.ResponseData.l_shortmessage0;
    	cart.setVar(paypalErrorContainer);
    	session.forms.billing.paypalval.paypalprocessed.value = "";
        return {error: true};
    }

    return {authorized: true};
}

/*
 * Module exports
 */

/*
 * Local methods
 */
exports.Handle = Handle;
exports.Authorize = Authorize;
