'use strict';

/**
 * Controller for the default single shipping scenario.
 * Single shipping allows only one shipment, shipping address, and shipping method per order.
 *
 * @module controllers/COShipping
 */

/* API Includes */
var CustomerMgr = require('dw/customer/CustomerMgr');
var HashMap = require('dw/util/HashMap');
var Resource = require('dw/web/Resource');
var ShippingMgr = require('dw/order/ShippingMgr');
var Site = require('dw/system/Site');
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');
var Pipelet = require('dw/system/Pipelet');
/* Script Modules */
var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');
var Customer 	= app.getModel('Customer');

/**
 * Handles the selected shipping address and shipping method. Copies the
 * address details and gift options to the basket's default shipment. Sets the
 * selected shipping method to the default shipment.
 *
 * @transactional
 * @param {module:models/CartModel~CartModel} cart - A CartModel wrapping the current Basket.
 */
function handleShippingSettings(cart) {
    Transaction.wrap(function () {
        var defaultShipment, shippingAddress;
        defaultShipment = cart.getDefaultShipment();
        shippingAddress = cart.createShipmentShippingAddress(defaultShipment.getID());

        var subbmittedAddressFileds = request.httpParameterMap.getParameterMap('dwfrm_singleshipping_shippingAddress_addressFields_');
        shippingAddress.setTitle(subbmittedAddressFileds.isParameterSubmitted('title') ? subbmittedAddressFileds.get('title').value : '');
        shippingAddress.setFirstName(session.forms.singleshipping.shippingAddress.addressFields.firstName.value);
        shippingAddress.setLastName(session.forms.singleshipping.shippingAddress.addressFields.lastName.value);
        shippingAddress.setAddress1(session.forms.singleshipping.shippingAddress.addressFields.address1.value);
        shippingAddress.setAddress2(session.forms.singleshipping.shippingAddress.addressFields.address2.value);
        shippingAddress.setCity(session.forms.singleshipping.shippingAddress.addressFields.city.value);
        shippingAddress.setPostalCode(subbmittedAddressFileds.isParameterSubmitted('postal') ? subbmittedAddressFileds.get('postal').value : '');
        shippingAddress.setStateCode(subbmittedAddressFileds.isParameterSubmitted('states_state') ? subbmittedAddressFileds.get('states_state').value : '');
        shippingAddress.setCountryCode(session.forms.singleshipping.shippingAddress.addressFields.country.value);
        shippingAddress.setPhone(subbmittedAddressFileds.isParameterSubmitted('phone') ? subbmittedAddressFileds.get('phone').value : '');
        defaultShipment.setGift(session.forms.singleshipping.shippingAddress.isGift.value);
        defaultShipment.setGiftMessage(session.forms.singleshipping.shippingAddress.giftMessage.value);

        cart.updateShipmentShippingMethod(cart.getDefaultShipment().getID(), session.forms.singleshipping.shippingAddress.shippingMethodID.value, null, null);
        cart.calculate();

        cart.validateForCheckout();
    });
}

/**
 * Form handler for the singleshipping form. Handles the following actions:
 * - __save__ - saves the shipping address from the form to the customer address book. If in-store
 * shipments are enabled, saves information from the form about in-store shipments to the order shipment.
 * Flags the save action as done and calls the {@link module:controllers/Cart~Show|Cart controller Show function}.
 * If it is not able to save the information, calls the {@link module:controllers/Cart~Show|Cart controller Show function}.
 * - __selectAddress__ - updates the address details and page metadata, sets the ContinueURL property to COShipping-SingleShipping,  and renders the singleshipping template.
 * - __shipToMultiple__ - calls the {@link module:controllers/COShippingMultiple~Start|COShippingMutliple controller Start function}.
 * - __error__ - calls the {@link module:controllers/COShipping~Start|COShipping controller Start function}.
 */
function singleShipping() {
    var singleShippingForm = app.getForm('singleshipping');
    singleShippingForm.handleAction({
        save: function () {
            var cart = app.getModel('Cart').get();
            if (!cart) {
                // @FIXME redirect
                app.getController('Cart').Show();
                return;
            }
            
            var stateVerification = require('app_rapala_controllers/cartridge/controllers/COShipping.js').StartStateVerification();
            var shippingmethod = session.forms.singleshipping.shippingAddress.shippingMethodID.value;
            if (stateVerification) {
            	response.redirect(URLUtils.https('COShipping-Start','ShipLimit',stateVerification));
            	app.getView({ShipLimit : stateVerification}).render('checkout/shipping/singleshipping');
            } else if (shippingmethod == null) {
                response.redirect(URLUtils.https('COShipping-Start','ShipLimit',true));
                app.getView({ShipLimit : true}).render('checkout/shipping/singleshipping');
            } else {
            	//UPS validation code
                var DAVResult = require('app_rapala_controllers/cartridge/controllers/COShipping.js').ValidateDAV(cart);
                if (DAVResult.endNodeName !== 'success') {
                   app.getView(DAVResult.params).render('checkout/shipping/singleshipping');
                   return;
               }

                handleShippingSettings(cart);

                // Attempts to save the used shipping address in the customer address book.
                if (customer.authenticated && session.forms.singleshipping.shippingAddress.addToAddressBook.value) {
                	app.getModel('Profile').get(customer.profile).addAddressToAddressBook(session.forms.singleshipping.shippingAddress.addressid.value,cart.getDefaultShipment().getShippingAddress());
                }
               

                // Mark step as fulfilled.
                session.forms.singleshipping.fulfilled.value = true;

                /*****************************PREVAIL - PayPal Integration*****************************************/
                    if (!empty(cart.getPaymentInstruments()) && cart.getPaymentInstruments('PayPal')) {
                        app.getForm('billing').object.fulfilled.value = true;
                        app.getController('COBilling').Start();
                        return;
                    }    
                    // Redirect to cart if restricted products are in cart               
                    	var shippingmethod = session.forms.singleshipping.shippingAddress.shippingMethodID.value;
                    	if(shippingmethod == null)
                    		{                 		
                    			response.redirect(URLUtils.https('Cart-Show'));
                    		}
                // @FIXME redirect
                    	response.redirect(URLUtils.https('COBilling-Start'));
            }
        },
        selectAddress: function () {
            require('app_rapala_controllers/cartridge/controllers/COShipping.js').UpdateAddressDetails(app.getModel('Cart').get());

            var pageMeta = require('app_rapala_controllers/cartridge/scripts/meta');
            pageMeta.update({
                pageTitle: Resource.msg('singleshipping.meta.pagetitle', 'checkout', 'Rapala Checkout')
            });
            app.getView({
                ContinueURL: URLUtils.https('COShipping-SingleShipping')
            }).render('checkout/shipping/singleshipping');
        },
        shipToMultiple: app.getController('COShippingMultiple').Start,
        error: function () {
            response.redirect(URLUtils.https('COShipping-Start'));
        }
    });
}


/*
* Module exports
*/

/*
* Web exposed methods
*/
/** Starting point for the single shipping scenario.
 * @see module:controllers/COShipping~start */
exports.Start = require('app_rapala_controllers/cartridge/controllers/COShipping.js').Start;
/** Selects a shipping method for the default shipment.
 * @see module:controllers/COShipping~selectShippingMethod */
exports.SelectShippingMethod = require('app_rapala_controllers/cartridge/controllers/COShipping.js').SelectShippingMethod;
/** Determines the list of applicable shipping methods for the default shipment of the current basket.
 * @see module:controllers/COShipping~updateShippingMethodList */
exports.UpdateShippingMethodList = require('app_rapala_controllers/cartridge/controllers/COShipping.js').UpdateShippingMethodList;
/** Determines the list of applicable shipping methods for the default shipment of the current customer's basket and returns the response as a JSON array.
 * @see module:controllers/COShipping~getApplicableShippingMethodsJSON */
exports.GetApplicableShippingMethodsJSON = require('app_rapala_controllers/cartridge/controllers/COShipping.js').GetApplicableShippingMethodsJSON;
/** Renders a form dialog to edit an address.
 * @see module:controllers/COShipping~editAddress */
exports.EditAddress = require('app_rapala_controllers/cartridge/controllers/COShipping.js').EditAddress;
/** Updates shipping address for the current customer with information from the singleshipping form.
 * @see module:controllers/COShipping~updateAddressDetails */
exports.UpdateAddressDetails = require('app_rapala_controllers/cartridge/controllers/COShipping.js').UpdateAddressDetails;
/** Form handler for the singleshipping form.
 * @see module:controllers/COShipping~singleShipping */
exports.SingleShipping = guard.ensure(['https'], singleShipping);
/** Form handler for the shippingAddressForm.
 * @see module:controllers/COShipping~editShippingAddress */
exports.EditShippingAddress = require('app_rapala_controllers/cartridge/controllers/COShipping.js').EditShippingAddress;
/** Form handler for the shippingAddressForm.
 * @see module:controllers/COShipping~miniCheckOut */
exports.MiniCheckOut = require('app_rapala_controllers/cartridge/controllers/COShipping.js').MiniCheckOut;
/** Form handler for the shippingAddressForm.
 * @see module:controllers/COShipping~shippingLogin */
exports.ShippingLogin = require('app_rapala_controllers/cartridge/controllers/COShipping.js').ShippingLogin;
/** @see module:controllers/COShipping~signOut */
exports.Signout = require('app_rapala_controllers/cartridge/controllers/COShipping.js').Signout;
/** @see module:controllers/COShipping~copyCart */
exports.CopyCart = require('app_rapala_controllers/cartridge/controllers/COShipping.js').CopyCart;
/** @see module:controllers/COShipping~emptyCart */
exports.EmptyCart = require('app_rapala_controllers/cartridge/controllers/COShipping.js').EmptyCart;
