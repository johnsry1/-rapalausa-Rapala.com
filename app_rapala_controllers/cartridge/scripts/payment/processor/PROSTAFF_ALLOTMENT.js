'use strict';

/* API Includes */
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

/**
 * Authorizes a payment using a prostaff allotment. The payment is authorized by redeeming the allotment amount and
 * simply setting the order no as transaction ID.
 */
function Authorize(args) {
	var orderNo = args.OrderNo;
    var paymentInstrument = args.PaymentInstrument;
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();
    
    Transaction.wrap(function () {
		paymentInstrument.paymentTransaction.transactionID = orderNo;
		paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
    });
    
    return {authorized: true};
}

/*
 * Module exports
 */

/*
 * Local methods
 */
exports.Authorize = Authorize;