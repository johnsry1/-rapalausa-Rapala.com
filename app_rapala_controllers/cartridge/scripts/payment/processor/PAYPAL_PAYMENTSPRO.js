'use strict';

/**
 * Verifies a credit card against a valid card number and expiration date and
 * possibly invalidates invalid form fields. If the verification was successful
 * a credit card payment instrument is created. The pipeline just reuses the
 * basic credit card validation pipeline from processor BASIC_CREDIT.
 */
function Handle(args) {
    return require('./BASIC_CREDIT').Handle(args);
}

/**
 * Authorizes a payment using a credit card. A real integration is not
 * supported, that's why the pipeline returns this state back to the calling
 * checkout pipeline.
 */
function Authorize(args) {
   /* if (dw.system.Site.getCurrent().getCustomPreferenceValue('isEndToEndMerchant') ||
        dw.system.Site.getCurrent().getCustomPreferenceValue('isAFSEnabled')) {
        var pdict = dw.system.Pipeline.execute('ETECybersourceFraudCheck-StartAFS', {
            Order : dw.order.OrderMgr.getOrder(args.OrderNo)
        });
        if (pdict.EndNodeName === 'ERROR') {
            return {error: true};
        }
    }*/

    var pdict = dw.system.Pipeline.execute('Paypal-DoDirectPayment', {
        Order: args.Order,
        PaymentInstrument: args.PaymentInstrument
    });

    if (pdict.EndNodeName === 'Error') {
        return {error: true};
    } else if (pdict.EndNodeName === 'authorized') {
        return {authorized: true};
    }
}

/*
 * Module exports
 */

/*
 * Local methods
 */
exports.Handle = Handle;
exports.Authorize = Authorize;
