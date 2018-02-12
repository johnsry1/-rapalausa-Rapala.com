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
var Countries = require('*/cartridge/scripts/util/Countries');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var ltkSendSca = require('int_listrak_controllers/cartridge/controllers/ltkSendSca.js');
var ltkSignupEmail = require('int_listrak_controllers/cartridge/controllers/ltkSignupEmail.js');
var AdyenController = require("int_adyen_controllers/cartridge/controllers/Adyen");
var AdyenHelper = require("int_adyen/cartridge/scripts/util/AdyenHelper");

/**
 * Initializes the address form. If the customer chose "use as billing
 * address" option on the single shipping page the form is prepopulated with the shipping
 * address, otherwise it prepopulates with the billing address that was already set.
 * If neither address is available, it prepopulates with the default address of the authenticated customer.
 */
function initAddressForm(cart) {

    if (app.getForm('singleshipping').object.shippingAddress.useAsBillingAddress.value === true) {
        app.getForm('billing').object.billingAddress.addressFields.title.value = app.getForm('singleshipping').object.shippingAddress.addressFields.title.value;
        app.getForm('billing').object.billingAddress.addressFields.firstName.value = app.getForm('singleshipping').object.shippingAddress.addressFields.firstName.value;
        app.getForm('billing').object.billingAddress.addressFields.lastName.value = app.getForm('singleshipping').object.shippingAddress.addressFields.lastName.value;
        app.getForm('billing').object.billingAddress.addressFields.address1.value = app.getForm('singleshipping').object.shippingAddress.addressFields.address1.value;
        app.getForm('billing').object.billingAddress.addressFields.address2.value = app.getForm('singleshipping').object.shippingAddress.addressFields.address2.value;
        app.getForm('billing').object.billingAddress.addressFields.city.value = app.getForm('singleshipping').object.shippingAddress.addressFields.city.value;
        app.getForm('billing').object.billingAddress.addressFields.postal.value = app.getForm('singleshipping').object.shippingAddress.addressFields.postal.value;
        app.getForm('billing').object.billingAddress.addressFields.phone.value = app.getForm('singleshipping').object.shippingAddress.addressFields.phone.value;
        app.getForm('billing').object.billingAddress.addressFields.states.state.value = app.getForm('singleshipping').object.shippingAddress.addressFields.states.state.value;
        app.getForm('billing').object.billingAddress.addressFields.country.value = app.getForm('singleshipping').object.shippingAddress.addressFields.country.value;
        app.getForm('billing').object.billingAddress.addressFields.phone.value = app.getForm('singleshipping').object.shippingAddress.addressFields.phone.value;
        app.getForm('billing').object.billingAddress.sameasshippingaddress.value = app.getForm('singleshipping').object.shippingAddress.useAsBillingAddress.value

    } else if (cart.getBillingAddress() !== null) {
         app.getForm('billing').object.billingAddress.sameasshippingaddress.value = false;
        app.getForm('billing.billingAddress.addressFields').copyFrom(cart.getBillingAddress());
        app.getForm('billing.billingAddress.addressFields.states').copyFrom(cart.getBillingAddress());
    } else if (customer.authenticated && customer.profile.addressBook.preferredAddress !== null) {
        app.getForm('billing').object.billingAddress.sameasshippingaddress.value = false;
        app.getForm('billing.billingAddress.addressFields').copyFrom(customer.profile.addressBook.preferredAddress);
        app.getForm('billing.billingAddress.addressFields.states').copyFrom(customer.profile.addressBook.preferredAddress);
    }
}

/**
 * Initializes the email address form field. If there is already a customer
 * email set at the basket, that email address is used. If the
 * current customer is authenticated the email address of the customer's profile
 * is used.
 */
function initEmailAddress(cart) {
    if (cart.getCustomerEmail() !== null) {
        app.getForm('billing').object.billingAddress.email.emailAddress.value = cart.getCustomerEmail();
    } else if (customer.authenticated && customer.profile.email !== null) {
        app.getForm('billing').object.billingAddress.email.emailAddress.value = customer.profile.email;
    }
}

/**
 * Initializes the credit card list by determining the saved customer payment methods for the current locale.
 * @param {module:models/CartModel~CartModel} cart - A CartModel wrapping the current Basket.
 * @return {object} JSON object with members ApplicablePaymentMethods and ApplicableCreditCards.
 */
function initCreditCardList(cart) {
    var paymentAmount = cart.getNonGiftCertificateAmount();
    var countryCode;
    var applicablePaymentMethods;
    var applicablePaymentCards;
    var applicableCreditCards;

    countryCode = Countries.getCurrent({
        CurrentRequest: {
            locale: request.locale
        }
    }).countryCode;

    applicablePaymentMethods = PaymentMgr.getApplicablePaymentMethods(customer, countryCode, paymentAmount.value);
    applicablePaymentCards = PaymentMgr.getPaymentMethod(PaymentInstrument.METHOD_CREDIT_CARD).getApplicablePaymentCards(customer, countryCode, paymentAmount.value);

    app.getForm('billing').object.paymentMethods.creditCard.type.setOptions(applicablePaymentCards.iterator());

    applicableCreditCards = null;

    if (customer.authenticated) {
        var profile = app.getModel('Profile').get();
        if (profile) {
            applicableCreditCards = profile.validateWalletPaymentInstruments(countryCode, paymentAmount.getValue()).ValidPaymentInstruments;
        }
    }


    return {
        ApplicablePaymentMethods: applicablePaymentMethods,
        ApplicableCreditCards: applicableCreditCards
    };
}

/**
 * Starting point for billing. After a successful shipping setup, both COShipping
 * and COShippingMultiple call this function.
 */
function publicStart() {
    var cart = app.getModel('Cart').get();

    if(!empty(request.httpParameterMap.PayerID) && request.httpParameterMap.PayerID.value != null){
         app.getForm('billing.paypalval').setValue('paypalprocessed', 'true');
    }
    if (cart) {

        // Initializes all forms of the billing page including: - address form - email address - coupon form
        initAddressForm(cart);
        initEmailAddress(cart);

        // Get the Saved Cards from Adyen to get latest saved cards
        require('int_adyen/cartridge/scripts/UpdateSavedCards').updateSavedCards({CurrentCustomer : customer});

        var creditCardList = initCreditCardList(cart);
        var applicablePaymentMethods = creditCardList.ApplicablePaymentMethods;

        var billingForm = app.getForm('billing').object;
        var paymentMethods = billingForm.paymentMethods;
        if (paymentMethods.valid) {
            paymentMethods.selectedPaymentMethodID.setOptions(applicablePaymentMethods.iterator());
        } else {
            paymentMethods.clearFormElement();
        }

        app.getForm('billing.couponCode').clear();
        app.getForm('billing.giftCertCode').clear();

//        var AdyenHppPaymentMethods = AdyenController.GetPaymentMethods(cart);
//        start(cart, {ApplicableCreditCards: creditCardList.ApplicableCreditCards, AdyenHppPaymentMethods : AdyenHppPaymentMethods});
        require('app_rapala_controllers/cartridge/controllers/COBilling.js').Start(cart, {ApplicableCreditCards: creditCardList.ApplicableCreditCards, AdyenHppPaymentMethods : []});
    } else {
        app.getController('Cart').Show();
    }
}

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

        if (dw.system.Site.getCurrent().getCustomPreferenceValue("Adyen_enableAVS")) {
            billingAddress.setSuite(subbmittedAddressFileds.isParameterSubmitted('suite') ? subbmittedAddressFileds.get('suite').value : '');
            billingAddress.custom.streetName = subbmittedAddressFileds.isParameterSubmitted('streetName') ? subbmittedAddressFileds.get('streetName').value : '';
            billingAddress.setAddress1( billingAddress.suite + (!empty(dw.system.Site.getCurrent().getCustomPreferenceValue("Adyen_address1Delimiter")) ? dw.system.Site.getCurrent().getCustomPreferenceValue("Adyen_address1Delimiter") : " ") + billingAddress.custom.streetName);
        }


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

            if(customer.authenticated && 'iceforce' != session.privacy.currentSite){
        	    Transaction.wrap(function () {
        	    	require('*/cartridge/scripts/prostaff/HandleAllotmentExpiry.ds').handleAllotmentExp(customer,cart.object);
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

                require('site_rapalaEU/cartridge/controllers/COSummary.js').Submit();
                return;
            }
        },
        selectAddress: function () {
            require('app_rapala_controllers/cartridge/controllers/COBilling.js').UpdateAddressDetails();
            return;
        }
    });
}


/**
 * Revalidates existing payment instruments in later checkout steps.
 *
 * @param {module:models/CartModel~CartModel} cart - A CartModel wrapping the current Basket.
 * @return {Boolean} true if existing payment instruments are valid, false if not.
 */
function validatePayment(cart) {
    var paymentAmount, countryCode, invalidPaymentInstruments, result;
    if (AdyenHelper.getAdyenCseEnabled()) {
        return true;
    }
    if (app.getForm('billing').object.fulfilled.value) {
        paymentAmount = cart.getNonGiftCertificateAmount();
        countryCode = Countries.getCurrent({
            CurrentRequest: {
                locale: request.locale
            }
        }).countryCode;

        invalidPaymentInstruments = cart.validatePaymentInstruments(customer, countryCode, paymentAmount.value).InvalidPaymentInstruments;

        //PREVAIL - Added transaction.
        Transaction.wrap(function () {
            if (!invalidPaymentInstruments && cart.calculatePaymentTransactionTotal()) {
                result = true;
            } else {
                app.getForm('billing').object.fulfilled.value = false;
                result = false;
            }
        });
    } else {
        result = false;
    }
    return result;
}

/**
 * Attempts to save the used credit card in the customer payment instruments.
 * The logic replaces an old saved credit card with the same masked credit card
 * number of the same card type with the new credit card. This ensures creating
 * only unique cards as well as replacing expired cards.
 * @transactional
 * @return {Boolean} true if credit card is successfully saved.
 */
function saveCreditCard() {
    if (AdyenHelper.getAdyenRecurringPaymentsEnabled()) {
        //   saved   credit   cards   are   handling   in   COPlaceOrder   and   Login   for   Adyen   -   saved cards   are   synced   with   Adyen   ListRecurringDetails   API   call
        return true;
    } else {

        var i, creditCards, newCreditCard;

        if (customer.authenticated && app.getForm('billing').object.paymentMethods.creditCard.saveCard.value) {
            creditCards = customer.getProfile().getWallet().getPaymentInstruments(PaymentInstrument.METHOD_CREDIT_CARD);

            Transaction.wrap(function () {
                newCreditCard = customer.getProfile().getWallet().createPaymentInstrument(PaymentInstrument.METHOD_CREDIT_CARD);

                    //copy the credit card details to the payment instrument
                    newCreditCard.setCreditCardHolder(app.getForm('billing').object.paymentMethods.creditCard.owner.value);
                    newCreditCard.setCreditCardNumber(app.getForm('billing').object.paymentMethods.creditCard.number.value);
                    newCreditCard.setCreditCardExpirationMonth(app.getForm('billing').object.paymentMethods.creditCard.expiration.month.value);
                    newCreditCard.setCreditCardExpirationYear(app.getForm('billing').object.paymentMethods.creditCard.expiration.year.value);
                    newCreditCard.setCreditCardType(app.getForm('billing').object.paymentMethods.creditCard.type.value);

                for (i = 0; i < creditCards.length; i++) {
                    var creditcard = creditCards[i];

                    if (creditcard.maskedCreditCardNumber === newCreditCard.maskedCreditCardNumber && creditcard.creditCardType === newCreditCard.creditCardType) {

                       /* if (dw.system.Site.getCurrent().getCustomPreferenceValue('CCPaymentService').toString() === 'AUTHORIZE_NET') {
                            newCreditCard.custom.cim_payment_profile_id = creditcard.custom.cim_payment_profile_id;
                            newCreditCard.custom.cim_customer_profile_id = creditcard.custom.cim_customer_profile_id;
                        }*/

                        customer.getProfile().getWallet().removePaymentInstrument(creditcard);
                    }
                }
            });

    }
    return true;
    }
}
/*
* Web exposed methods
*/
/** Starting point for billing.
 * @see module:controllers/COBilling~publicStart */
exports.Start = guard.ensure(['https'], publicStart);
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
exports.SaveCreditCard = saveCreditCard;
/** Revalidates existing payment instruments in later checkout steps.
 * @see module:controllers/COBilling~validatePayment */
exports.ValidatePayment = validatePayment;
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
