'use strict';

/**
 * Controller for the billing logic. It is used by both the single shipping and the multishipping
 * functionality and is responsible for payment method selection and entering a billing address.
 *
 * @module controllers/COBilling
 */

/* API Includes */
var GiftCertificate = require('dw/order/GiftCertificate');
var GiftCertificateMgr = require('dw/order/GiftCertificateMgr');
var GiftCertificateStatusCodes = require('dw/order/GiftCertificateStatusCodes');
var PaymentInstrument = require('dw/order/PaymentInstrument');
var PaymentMgr = require('dw/order/PaymentMgr');
var ProductListMgr = require('dw/customer/ProductListMgr');
var Resource = require('dw/web/Resource');
var Status = require('dw/system/Status');
var StringUtils = require('dw/util/StringUtils');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');
var Countries = require('app_rapala_core/cartridge/scripts/util/Countries');

/* Script Modules */
var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');
var ltkSendSca = require('int_listrak_controllers/cartridge/controllers/ltkSendSca.js');
var ltkSignupEmail = require('int_listrak_controllers/cartridge/controllers/ltkSignupEmail.js');

/**
 * Gets or creates a billing address and copies it to the billingaddress form. Also sets the customer email address
 * to the value in the billingAddress form.
 * @transaction
 * @param {module:models/CartModel~CartModel} cart - A CartModel wrapping the current Basket.
 * @returns {boolean} true
 */
function handleBillingAddress(cart) {

    var billingAddress = cart.getBillingAddress();
    Transaction.wrap(function () {

        if (!billingAddress) {
            billingAddress = cart.createBillingAddress();
        }

        app.getForm('billing.billingAddress.addressFields').copyTo(billingAddress);
        app.getForm('billing.billingAddress.addressFields.states').copyTo(billingAddress);
        
        var subbmittedAddressFileds = request.httpParameterMap.getParameterMap('dwfrm_billing_billingAddress_addressFields_');
        billingAddress.setTitle(subbmittedAddressFileds.isParameterSubmitted('title') ? subbmittedAddressFileds.get('title').value : '');
        billingAddress.setPostalCode(subbmittedAddressFileds.isParameterSubmitted('postal') ? subbmittedAddressFileds.get('postal').value : '');
        billingAddress.setStateCode(subbmittedAddressFileds.isParameterSubmitted('states_state') ? subbmittedAddressFileds.get('states_state').value : '');
        billingAddress.setPhone(subbmittedAddressFileds.isParameterSubmitted('phone') ? subbmittedAddressFileds.get('phone').value : '');


        cart.setCustomerEmail(app.getForm('billing').object.billingAddress.email.emailAddress.value);
    });

    return true;
}

/**
 * Form handler for the billing form. Handles the following actions:
 * - __applyCoupon__ - gets the coupon to add from the httpParameterMap couponCode property and calls {@link module:controllers/COBilling~handleCoupon|handleCoupon}
 * - __creditCardSelect__ - calls the {@link module:controllers/COBilling~updateCreditCardSelection|updateCreditCardSelection} function.
 * - __paymentSelect__ - calls the {@link module:controllers/COBilling~publicStart|publicStart} function.
 * - __redeemGiftCert__ - redeems the gift certificate entered into the billing form and returns to the cart.
 * - __save__ - validates payment and address information and handles any errors. If the billing form is valid,
 * saves the billing address to the customer profile, sets a flag to indicate the billing step is successful, and calls
 * the {@link module:controllers/COSummary~start|COSummary controller Start function}.
 * - __selectAddress__ - calls the {@link module:controllers/COBilling~updateAddressDetails|updateAddressDetails} function.
 */
function billing() {
	app.getForm('agecheck').clear();
    app.getForm('billing').handleAction({
        applyCoupon: function () {
            var couponCode = request.httpParameterMap.couponCode.stringValue || request.httpParameterMap.dwfrm_billing_couponCode.stringValue;


            app.getController('Cart').AddCoupon(couponCode);

            require('app_rapala_controllers/cartridge/controllers/COBilling.js').HandleCoupon();
            return;
        },
        creditCardSelect: function () {
            require('app_rapala_controllers/cartridge/controllers/COBilling.js').UpdateCreditCardSelection();
            return;
        },
        paymentSelect: function () {
            // ToDo - pass parameter ?
            require('app_rapala_controllers/cartridge/controllers/COBilling.js').Start();
            return;
        },
        redeemGiftCert: function () {
            var status = require('app_rapala_controllers/cartridge/controllers/COBilling.js').RedeemGiftCertificate(app.getForm('billing').object.giftCertCode.htmlValue);
            if (!status.isError()) {
                require('app_rapala_controllers/cartridge/controllers/COBilling.js').ReturnToForm(app.getModel('Cart').get(), {
                    NewGCPaymentInstrument: status.getDetail('NewGCPaymentInstrument')
                });
            } else {
                require('app_rapala_controllers/cartridge/controllers/COBilling.js').ReturnToForm(app.getModel('Cart').get());
            }

            return;
        },
        save: function () {
            var cart = app.getModel('Cart').get();

            /****************PREVAIL Address verification Integration*
            var DAVResult = validateDAV();
            if (DAVResult && DAVResult.endNodeName !== 'success') {
                returnToForm(cart, DAVResult.params);
                return;
            }*********************/
            
            if(customer.authenticated && 'iceforce' != session.custom.currentSite){
        	    Transaction.wrap(function () {
        	    	require('app_rapala_core/cartridge/scripts/prostaff/HandleAllotmentExpiry.ds').handleAllotmentExp(customer,cart.object);
        	    });
            }
            if (!require('app_rapala_controllers/cartridge/controllers/COBilling.js').ResetPaymentForms() || !require('app_rapala_controllers/cartridge/controllers/COBilling.js').ValidateBilling() || !handleBillingAddress(cart))// Performs validation steps, based upon the entered billing address
            // and address options.
            {// Performs payment method specific checks, such as credit card verification.
                require('app_rapala_controllers/cartridge/controllers/COBilling.js').ReturnToForm(cart);
            } else {
                //PREVAIL - Removed handlePaymentSelection(cart) from main condition and handled speperately.
                if(app.getForm('billing.paypalval').object.paypalprocessed.value != "true"){
	            	var handlePaymentSelectionResult = require('app_rapala_controllers/cartridge/controllers/COBilling.js').HandlePaymentSelection(cart);
	                if (handlePaymentSelectionResult.error) {
	                    require('app_rapala_controllers/cartridge/controllers/COBilling.js').ReturnToForm(cart);
	                    return;
	                }
	
	                /**********************PREVAIL - PayPal Integration**************************/
	                if (handlePaymentSelectionResult.redirectUrl) {
	                    response.redirect(handlePaymentSelectionResult.redirectUrl);
	                    return;
	                }
                }
                if (customer.authenticated && app.getForm('billing').object.billingAddress.addToAddressBook.value) {
                    app.getModel('Profile').get(customer.profile).addAddressToAddressBook(cart.getBillingAddress());
                }


                // Mark step as fulfilled
                app.getForm('billing').object.fulfilled.value = true;
                
                ltkSignupEmail.Signup();
                ltkSendSca.SendSCA();

                // A successful billing page will jump to the next checkout step.
                //app.getController('COSummary').Start();
                app.getController('COSummary').Submit();
                return;
            }
        },
        selectAddress: function () {
            require('app_rapala_controllers/cartridge/controllers/COBilling.js').UpdateAddressDetails();
            return;
        }
    });
}

/*
* Web exposed methods
*/
/** Starting point for billing.
 * @see module:controllers/COBilling~publicStart */
exports.Start = require('app_rapala_controllers/cartridge/controllers/COBilling.js').Start;
/** Redeems gift certificates.
 * @see module:controllers/COBilling~redeemGiftCertificateJson */
exports.RedeemGiftCertificateJson = require('app_rapala_controllers/cartridge/controllers/COBilling.js').RedeemGiftCertificateJson;
/** Removes gift certificate from the basket payment instruments.
 * @see module:controllers/COBilling~removeGiftCertificate */
exports.RemoveGiftCertificate = require('app_rapala_controllers/cartridge/controllers/COBilling.js').RemoveGiftCertificate;
/** Updates the order totals and recalculates the basket after a coupon code is applied.
 * @see module:controllers/COBilling~updateSummary */
exports.UpdateSummary = require('app_rapala_controllers/cartridge/controllers/COBilling.js').UpdateSummary;
/** Gets the customer address and saves it to the customer address book.
 * @see module:controllers/COBilling~updateAddressDetails */
exports.UpdateAddressDetails = require('app_rapala_controllers/cartridge/controllers/COBilling.js').UpdateAddressDetails;
/** Renders a form dialog to edit an address.
 * @see module:controllers/COBilling~editAddress */
exports.EditAddress = require('app_rapala_controllers/cartridge/controllers/COBilling.js').EditAddress;
/** Returns information of a gift certificate including its balance as JSON response.
 * @see module:controllers/COBilling~getGiftCertificateBalance */
exports.GetGiftCertificateBalance = require('app_rapala_controllers/cartridge/controllers/COBilling.js').GetGiftCertificateBalance;
/** Selects a customer credit card and returns the details of the credit card as JSON response.
 * @see module:controllers/COBilling~selectCreditCard */
exports.SelectCreditCard = require('app_rapala_controllers/cartridge/controllers/COBilling.js').SelectCreditCard;
/** Adds the currently selected credit card to the billing form and initializes the credit card selection list.
 * @see module:controllers/COBilling~updateCreditCardSelection */
exports.UpdateCreditCardSelection = require('app_rapala_controllers/cartridge/controllers/COBilling.js').UpdateCreditCardSelection;
/** Form handler for the billing form.
 * @see module:controllers/COBilling~billing */
exports.Billing = guard.ensure(['https'], billing);
/** Form handler for the returnToForm form.
 * @see module:controllers/COBilling~editBillingAddress */
exports.EditBillingAddress = require('app_rapala_controllers/cartridge/controllers/COBilling.js').EditBillingAddress;

/*
 * Local methods
 */
/** Saves the credit card used in the billing form in the customer payment instruments.
 * @see module:controllers/COBilling~saveCreditCard */
exports.SaveCreditCard = require('app_rapala_controllers/cartridge/controllers/COBilling.js').SaveCreditCard;
/** Revalidates existing payment instruments in later checkout steps.
 * @see module:controllers/COBilling~validatePayment */
exports.ValidatePayment = require('app_rapala_controllers/cartridge/controllers/COBilling.js').ValidatePayment;
/** Handles the selection of the payment method and performs payment method specific validation and verification upon the entered form fields.
 * @see module:controllers/COBilling~handlePaymentSelection */
exports.HandlePaymentSelection = require('app_rapala_controllers/cartridge/controllers/COBilling.js').HandlePaymentSelection;
/** Handles the response from PayPal
 * @see module:controllers/COBilling~ */
exports.HandlePayPalResponse = require('app_rapala_controllers/cartridge/controllers/COBilling.js').HandlePayPalResponse;
/** Handles the response from PayPal
 * @see module:controllers/COBilling~ */
exports.UpdateCartSummary = require('app_rapala_controllers/cartridge/controllers/COBilling.js').UpdateCartSummary;
/**Handles the Remove coupon
 * @see module:controllers/COBilling~removeCoupon */
exports.RemoveCoupon = require('app_rapala_controllers/cartridge/controllers/COBilling.js').RemoveCoupon;
/** Refreshes Payment Methods
 * @see module:controllers/COBilling~refreshPaymentMethods */
exports.RefreshPaymentMethods = require('app_rapala_controllers/cartridge/controllers/COBilling.js').RefreshPaymentMethods;
/** Gets the Order Total
 * @see module:controllers/COBilling~getOrderTotalJson */
exports.GetOrderTotalJson = require('app_rapala_controllers/cartridge/controllers/COBilling.js').GetOrderTotalJson;
/** Display the addded coupon message in billing page
 * @see module:controllers/COBilling~displayCoupon */
exports.DisplayCoupon = require('app_rapala_controllers/cartridge/controllers/COBilling.js').DisplayCoupon;
/** Remove CC payment instrument
* @see module:controllers/COBilling~RemoveCCPaymentInstrument */
exports.ClearCCForm = require('app_rapala_controllers/cartridge/controllers/COBilling.js').ClearCCForm;
/** Billing redirect
* @see module:controllers/COBilling~ReturnToBIlling */
exports.ReturnToBIlling = require('app_rapala_controllers/cartridge/controllers/COBilling.js').ReturnToBIlling;