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
var app 		= require('~/cartridge/scripts/app');
var guard 		= require('~/cartridge/scripts/guard');
var Customer 	= app.getModel('Customer');

/**
 * Prepares shipments. Theis function separates gift certificate line items from product
 * line items. It creates one shipment per gift certificate purchase
 * and removes empty shipments. If in-store pickup is enabled, it combines the
 * items for in-store pickup and removes them.
 * This function can be called by any checkout step to prepare shipments.
 *
 * @transactional
 * @return {Boolean} true if shipments are successfully prepared, false if they are not.
 */
function prepareShipments() {
    var cart, homeDeliveries;
    cart = app.getModel('Cart').get();

    homeDeliveries = Transaction.wrap(function () {
        var homeDeliveries = false;

        cart.updateGiftCertificateShipments();
        cart.removeEmptyShipments();
        
        //remove invalid coupons
        Transaction.wrap(function () {
       	 var removeinvalidcoupon= require('app_rapala_core/cartridge/scripts/cart/RemoveInvalidcoupon.ds').removeInvalidCoupon(cart.object);
           cart.calculate();
        });
        
        var priceVals = require('app_rapala_core/cartridge/scripts/cart/calculateProductNetPrice.ds').prodNetPrice(cart);
        
        if (Site.getCurrent().getCustomPreferenceValue('enableStorePickUp')) {
            homeDeliveries = cart.consolidateInStoreShipments();

            session.forms.singleshipping.inStoreShipments.shipments.clearFormElement();
            app.getForm('singleshipping.inStoreShipments.shipments').copyFrom(cart.getShipments());
        } else {
            homeDeliveries = true;
        }

        return homeDeliveries;
    });

    return homeDeliveries;
}

/**
 * Starting point for the single shipping scenario. Prepares a shipment by removing gift certificate and in-store pickup line items from the shipment.
 * Redirects to multishipping scenario if more than one physical shipment is required and redirects to billing if all line items do not require
 * shipping.
 *
 * @transactional
 */
function start() {
    var cart = app.getModel('Cart').get();
    var physicalShipments, pageMeta, homeDeliveries;

    if (!cart) {
        app.getController('Cart').Show();
        return;
    }
    if(customer.authenticated && 'iceforce' != session.custom.currentSite){
	    Transaction.wrap(function () {
	    	var orderTotal = require('app_rapala_core/cartridge/scripts/prostaff/UseProStaffAllowance.ds').checkAllotmentPayment(customer,cart.object);
	    	 if(request.httpParameterMap.billingreturn.value != 'true'){
	        	 require('app_rapala_core/cartridge/scripts/checkout/RemoveGiftPaymentInstruments.ds').removeGC(cart.object);
	        }
	    });
    }
    // Redirects to multishipping scenario if more than one physical shipment is contained in the basket.
    physicalShipments = cart.getPhysicalShipments();
    /*if (Site.getCurrent().getCustomPreferenceValue('enableMultiShipping') && physicalShipments && physicalShipments.size() > 1) {
        app.getController('COShippingMultiple').Start();
        return;
    }*/
    var addrid = session.forms.singleshipping.shippingAddress.addressid.value;
    // Initializes the singleshipping form and prepopulates it with the shipping address of the default
    // shipment if the address exists, otherwise it preselects the default shipping method in the form.
    var verification=false;
	if(request.httpParameterMap.ShipLimit == 'true')
		{
		verification=request.httpParameterMap.ShipLimit;
		}
    if (cart.getDefaultShipment().getShippingAddress()  && verification !="true") {
        app.getForm('singleshipping.shippingAddress.addressFields').copyFrom(cart.getDefaultShipment().getShippingAddress());
        app.getForm('singleshipping.shippingAddress.addressFields.states').copyFrom(cart.getDefaultShipment().getShippingAddress());
        app.getForm('singleshipping.shippingAddress').copyFrom(cart.getDefaultShipment());
        app.getForm('singleshipping.shippingAddress').setValue('addressid',addrid);        
    } else {
    	
    	 verification=false;
    	if(request.httpParameterMap.ShipLimit == 'true')
    		{
    		verification=request.httpParameterMap.ShipLimit;
    		}
        if (customer.authenticated && customer.registered && customer.addressBook.preferredAddress && verification !="true") {
            app.getForm('singleshipping.shippingAddress.addressFields').copyFrom(customer.addressBook.preferredAddress);
            app.getForm('singleshipping.shippingAddress').copyFrom(customer.addressBook.preferredAddress);
            app.getForm('singleshipping.shippingAddress.addressFields.states').copyFrom(customer.addressBook.preferredAddress);
        }
    }
    
    if (customer.authenticated && customer.registered){
    	var addressBookSize = customer.addressBook.addresses.size();
    	if(addressBookSize < 1){
    		app.getForm('singleshipping.shippingAddress.addressFields').clear();
    		app.getForm('singleshipping.shippingAddress.addressid').clear();
    	}
    }
    session.forms.singleshipping.shippingAddress.shippingMethodID.value = cart.getDefaultShipment().getShippingMethodID();
    session.forms.billing.paypalval.paypalprocessed.value = "";
    // Prepares shipments.
    homeDeliveries = prepareShipments();
    //get Product net price & surcharge price
    var priceVals = require('app_rapala_core/cartridge/scripts/cart/calculateProductNetPrice.ds').prodNetPrice(cart.object);
    Transaction.wrap(function () {
        cart.calculate();
    });

    // Go to billing step, if we have no product line items, but only gift certificates in the basket, shipping is not required.
    if (cart.getProductLineItems().size() === 0) {
        app.getController('COBilling').Start();
    } else {
        pageMeta = require('~/cartridge/scripts/meta');
        pageMeta.update({
            pageTitle: Resource.msg('singleshipping.meta.pagetitle', 'checkout', 'Rapala Checkout')
        });
        app.getView({
            ContinueURL: URLUtils.https('COShipping-SingleShipping'),
            Basket: cart.object,
            HomeDeliveries: homeDeliveries,
            prodNetPrice : priceVals[0],
            surcharge : priceVals[1]
        }).render('checkout/shipping/singleshipping');
    }
}

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

        shippingAddress.setTitle(session.forms.singleshipping.shippingAddress.addressFields.title.value);
        shippingAddress.setFirstName(session.forms.singleshipping.shippingAddress.addressFields.firstName.value);
        shippingAddress.setLastName(session.forms.singleshipping.shippingAddress.addressFields.lastName.value);
        shippingAddress.setAddress1(session.forms.singleshipping.shippingAddress.addressFields.address1.value);
        shippingAddress.setAddress2(session.forms.singleshipping.shippingAddress.addressFields.address2.value);
        shippingAddress.setCity(session.forms.singleshipping.shippingAddress.addressFields.city.value);
        shippingAddress.setPostalCode(session.forms.singleshipping.shippingAddress.addressFields.postal.value);
        shippingAddress.setStateCode(session.forms.singleshipping.shippingAddress.addressFields.states.state.value);
        shippingAddress.setCountryCode(session.forms.singleshipping.shippingAddress.addressFields.country.value);
        shippingAddress.setPhone(session.forms.singleshipping.shippingAddress.addressFields.phone.value);
        defaultShipment.setGift(session.forms.singleshipping.shippingAddress.isGift.value);
        defaultShipment.setGiftMessage(session.forms.singleshipping.shippingAddress.giftMessage.value);

        cart.updateShipmentShippingMethod(cart.getDefaultShipment().getID(), session.forms.singleshipping.shippingAddress.shippingMethodID.value, null, null);
        cart.calculate();

        cart.validateForCheckout();
    });
}

/**
 * Updates shipping address for the current customer with information from the singleshipping form. If a cart exists, redirects to the
 * {@link module:controllers/COShipping~start|start} function. If one does not exist, calls the {@link module:controllers/Cart~Show|Cart controller Show function}.
 *
 * @transactional
 */
function updateAddressDetails() {
    var addressID, segments, lookupCustomer, lookupID, address, profile;
    //Gets an empty cart object from the CartModel.
    var cart = app.getModel('Cart').get();

    if (!cart) {
        app.getController('Cart').Show();
        return;
    }
    addressID = request.httpParameterMap.addressID.value ? request.httpParameterMap.addressID.value : request.httpParameterMap.dwfrm_singleshipping_addressList.value;
    segments = addressID.split('??');

    lookupCustomer = customer;
    lookupID = addressID;

    if (segments.length > 1) {
        profile = CustomerMgr.queryProfile('email = {0}', segments[0]);
        lookupCustomer = profile.getCustomer();
        lookupID = segments[1];
    }

    address = lookupCustomer.getAddressBook().getAddress(lookupID);
    app.getForm('singleshipping.shippingAddress.addressFields').copyFrom(address);
    app.getForm('singleshipping.shippingAddress.addressFields.states').copyFrom(address);

    Transaction.wrap(function () {
        var defaultShipment = cart.getDefaultShipment();
        var shippingAddress = cart.createShipmentShippingAddress(defaultShipment.getID());

        shippingAddress.setFirstName(session.forms.singleshipping.shippingAddress.addressFields.firstName.value);
        shippingAddress.setLastName(session.forms.singleshipping.shippingAddress.addressFields.lastName.value);
        shippingAddress.setAddress1(session.forms.singleshipping.shippingAddress.addressFields.address1.value);
        shippingAddress.setAddress2(session.forms.singleshipping.shippingAddress.addressFields.address2.value);
        shippingAddress.setCity(session.forms.singleshipping.shippingAddress.addressFields.city.value);
        shippingAddress.setPostalCode(session.forms.singleshipping.shippingAddress.addressFields.postal.value);
        shippingAddress.setStateCode(session.forms.singleshipping.shippingAddress.addressFields.states.state.value);
        shippingAddress.setCountryCode(session.forms.singleshipping.shippingAddress.addressFields.country.value);
        shippingAddress.setPhone(session.forms.singleshipping.shippingAddress.addressFields.phone.value);
        defaultShipment.setGift(session.forms.singleshipping.shippingAddress.isGift.value);
        defaultShipment.setGiftMessage(session.forms.singleshipping.shippingAddress.giftMessage.value);
    });

    start();
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
            
            var stateVerification = startStateVerification();
            var shippingmethod = session.forms.singleshipping.shippingAddress.shippingMethodID.value;
            if (stateVerification) {
            	response.redirect(URLUtils.https('COShipping-Start','ShipLimit',stateVerification));
            	app.getView({ShipLimit : stateVerification}).render('checkout/shipping/singleshipping');
            } else if (shippingmethod == null) {
                response.redirect(URLUtils.https('COShipping-Start','ShipLimit',true));
                app.getView({ShipLimit : true}).render('checkout/shipping/singleshipping');
            } else {
            	//UPS validation code
                var DAVResult = validateDAV(cart);
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
            updateAddressDetails(app.getModel('Cart').get());

            var pageMeta = require('~/cartridge/scripts/meta');
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

/**
 * Selects a shipping method for the default shipment. Creates a transient address object, sets the shipping
 * method, and returns the result as JSON response.
 *
 * @transaction
 */
function selectShippingMethod() {
    var cart = app.getModel('Cart').get();
    var TransientAddress = app.getModel('TransientAddress');
    var address, applicableShippingMethods;

    if (!cart) {
        app.getView.render('checkout/shipping/selectshippingmethodjson');
        return;
    }
    address = new TransientAddress();
    address.countryCode = request.httpParameterMap.countryCode.stringValue;
    address.stateCode = request.httpParameterMap.stateCode.stringValue;
    address.postalCode = request.httpParameterMap.postalCode.stringValue;
    address.city = request.httpParameterMap.city.stringValue;
    address.address1 = request.httpParameterMap.address1.stringValue;
    address.address2 = request.httpParameterMap.address2.stringValue;

    applicableShippingMethods = cart.getApplicableShippingMethods(address);

    Transaction.wrap(function () {
        cart.updateShipmentShippingMethod(cart.getDefaultShipment().getID(), request.httpParameterMap.shippingMethodID.stringValue, null, applicableShippingMethods);
        cart.calculate();
    });

    app.getView({
        Basket: cart.object
    }).render('checkout/shipping/selectshippingmethodjson');
}

/**
 * Determines the list of applicable shipping methods for the default shipment of
 * the current basket. The applicable shipping methods are based on the
 * merchandise in the cart and any address parameters included in the request.
 * Changes the shipping method of this shipment if the current method
 * is no longer applicable. Precalculates the shipping cost for each applicable
 * shipping method by simulating the shipping selection i.e. explicitly adds each
 * shipping method and then calculates the cart.
 * The simulation is done so that shipping cost along
 * with discounts and promotions can be shown to the user before making a
 * selection.
 * @transaction
 */
function updateShippingMethodList() {
    var i, address, applicableShippingMethods, shippingCosts, currentShippingMethod, method;
    var cart = app.getModel('Cart').get();
    var TransientAddress = app.getModel('TransientAddress');

    if (!cart) {
        app.getController('Cart').Show();
        return;
    }
    address = new TransientAddress();
    address.countryCode = request.httpParameterMap.countryCode.stringValue;
    address.stateCode = request.httpParameterMap.stateCode.stringValue;
    address.postalCode = request.httpParameterMap.postalCode.stringValue;
    address.city = request.httpParameterMap.city.stringValue;
    address.address1 = request.httpParameterMap.address1.stringValue;
    address.address2 = request.httpParameterMap.address2.stringValue;

    applicableShippingMethods = cart.getApplicableShippingMethods(address);
    shippingCosts = new HashMap();
    currentShippingMethod = cart.getDefaultShipment().getShippingMethod() || ShippingMgr.getDefaultShippingMethod();

    // Transaction controls are for fine tuning the performance of the data base interactions when calculating shipping methods
    Transaction.begin();

    for (i = 0; i < applicableShippingMethods.length; i++) {
        method = applicableShippingMethods[i];

        cart.updateShipmentShippingMethod(cart.getDefaultShipment().getID(), method.getID(), method, applicableShippingMethods);
        cart.calculate();
        shippingCosts.put(method.getID(), cart.preCalculateShipping(method));
    }

    Transaction.rollback();

    Transaction.wrap(function () {
        cart.updateShipmentShippingMethod(cart.getDefaultShipment().getID(), currentShippingMethod.getID(), currentShippingMethod, applicableShippingMethods);
        cart.calculate();
    });

    session.forms.singleshipping.shippingAddress.shippingMethodID.value = cart.getDefaultShipment().getShippingMethodID();

    app.getView({
        Basket: cart.object,
        ApplicableShippingMethods: applicableShippingMethods,
        ShippingCosts: shippingCosts
    }).render('checkout/shipping/shippingmethods');
}

/**
 * Determines the list of applicable shipping methods for the default shipment of
 * the current customer's basket and returns the response as a JSON array. The
 * applicable shipping methods are based on the merchandise in the cart and any
 * address parameters are included in the request parameters.
 */
function getApplicableShippingMethodsJSON() {
    var cart = app.getModel('Cart').get();
    var TransientAddress = app.getModel('TransientAddress');
    var address, applicableShippingMethods;

    address = new TransientAddress();
    address.countryCode = request.httpParameterMap.countryCode.stringValue;
    address.stateCode = request.httpParameterMap.stateCode.stringValue;
    address.postalCode = request.httpParameterMap.postalCode.stringValue;
    address.city = request.httpParameterMap.city.stringValue;
    address.address1 = request.httpParameterMap.address1.stringValue;
    address.address2 = request.httpParameterMap.address2.stringValue;

    applicableShippingMethods = cart.getApplicableShippingMethods(address);

    app.getView({
        ApplicableShippingMethods: applicableShippingMethods
    }).render('checkout/shipping/shippingmethodsjson');
}

/**
 * Renders a form dialog to edit an address. The dialog is opened
 * by an Ajax request and ends in templates, which trigger a JavaScript
 * event. The calling page of this dialog is responsible for handling these
 * events.
 */
function editAddress() {
    session.forms.shippingaddress.clearFormElement();
    var shippingAddress = customer.getAddressBook().getAddress(request.httpParameterMap.addressID.stringValue);

    if (shippingAddress) {
        app.getForm(session.forms.shippingaddress).copyFrom(shippingAddress);
        app.getForm(session.forms.shippingaddress.states).copyFrom(shippingAddress);
    }

    app.getView({
        ContinueURL: URLUtils.https('COShipping-EditShippingAddress')
    }).render('checkout/shipping/shippingaddressdetails');
}

/**
 * Form handler for the shippingAddressForm. Handles the following actions:
 *  - __apply__ - if form information cannot be copied to the platform, it sets the ContinueURL property to COShipping-EditShippingAddress and
 *  renders the shippingAddressDetails template. Otherwise, it renders the dialogapply template.
 *  - __remove__ - removes the address from the current customer's address book and renders the dialogdelete template.
 */
function editShippingAddress() {
    var shippingAddressForm = app.getForm('shippingaddress');
    shippingAddressForm.handleAction({
        apply: function () {
            var object = {};
            // @FIXME what is this statement used for?
            if (!app.getForm(session.forms.shippingaddress).copyTo(object) || !app.getForm(session.forms.shippingaddress.states).copyTo(object)) {
                app.getView({
                    ContinueURL: URLUtils.https('COShipping-EditShippingAddress')
                }).render('checkout/shipping/shippingaddressdetails');
            } else {
                app.getView().render('components/dialog/dialogapply');
            }
        },
        remove: function () {
            customer.getAddressBook().removeAddress(session.forms.shippingaddress.object);
            app.getView().render('components/dialog/dialogdelete');
        }
    });
}


/**
 * PREVAIL - address validation integrations kept some piece of code to use for ups
 */
function validateDAV(cart) {
    var result = {};
    var homeDeliveries = prepareShipments();
    var pdict;
        pdict = dw.system.Pipeline.execute('UPS-ValidateAddress');
        result.endNodeName = pdict.EndNodeName;
        result.params = {
            ContinueURL: URLUtils.https('COShipping-SingleShipping'),
            Basket: cart.object,
            MultiAddressCheck: pdict.MultiAddressCheck,
            RequestAddress: pdict.RequestAddress,
            AddressList: pdict.AddressList,
            HomeDeliveries: homeDeliveries
        };
    return result;
}

/**
 * To redirect checkout page from Mincart
 */
function miniCheckOut() {
	var basket = app.getModel('Cart').get();
	if(basket != null){
		var validationResult = basket.validateForCheckout();
		 app.getForm('cart.shipments').copyFrom(basket.object.shipments);
		 app.getForm('cart.coupons').copyFrom(basket.object.couponLineItems);
		 if (validationResult.EnableCheckout) {
	         response.redirect(URLUtils.https('COShipping-Start'));
	     } else {
	    	 response.redirect(URLUtils.https('Cart-Show'));
	     }
	} else {
		 response.redirect(URLUtils.https('Cart-Show'));
	}
}

/**
 * login section in checkout
 */
function shippingLogin() {
	var email,tempCustomer,Customer,password,rememberme,sendMail,Email;
	var Message = {};
	Customer = app.getModel('Customer');
	email = app.getForm('login.username').value();
	password = app.getForm('login.password').value();
	tempCustomer = Customer.retrieveCustomerByLogin(email);
	
	if(tempCustomer !=null && tempCustomer.object.profile != null && tempCustomer.object.profile.credentials.locked){
		app.getForm('login.loginsucceeded').invalidate();
		
	} else { 
		var success = Customer.login(email,password,false);
		if(success){
			app.getForm('login').invalidate();
			var TempCustomer = Customer.get();
        	var customerGroups =TempCustomer.object.customerGroups;
        	app.getController('Account').SetPriceBookFromCustomerGroups(customerGroups);
			Message.process = "sign-in";
			Message.status = "success";
			Message.email = tempCustomer.object.profile.email;
			response.redirect(URLUtils.https('COShipping-Start'));
			
		} else {
			if(tempCustomer !=null && tempCustomer.object.profile != null && tempCustomer.object.profile.credentials.locked){
				sendMail = Email.get('mail/lockoutemail', tempCustomer.object.profile.email);
				sendMail.setSubject(Resource.msg('resource.youraccount', 'email', null));
				sendMail.send({
                     Customer: tempCustomer.object
                 });
			}
			app.getForm('login.loginsucceeded').invalidate();
			response.redirect(URLUtils.https('COShipping-Start','loginstatus','failed'));
			
		}
	}
	
}

/**
 * to achieve copy and empty cart functionality in checkout
 */
function signOut() {
	 app.getView().render('checkout/shipping/shipingsignoutoption');
}


function copyCart() {
	var qty_ids, cart, qtyitrs, product;
	//get existing basket {Cart-GetExsitingBasket}
	var existingcart = app.getModel('Cart').get();
	var qty_idslist = require('app_rapala_core/cartridge/scripts/checkout/StoreProdIdtosession.ds').storeProdIdtoSession(existingcart);
	qty_ids = qty_idslist.split("|");
	Customer.logout();
	cart = app.getModel('Cart').goc();
	for each( itr in qty_ids ) {
		product = app.getModel('Product').get(itr.split("_")[0]).object;
		var quantity = Number(itr.split("_")[1]);
		Transaction.wrap(function () {
			//Add product to the basket pipelet replacement
			var shipment = cart.object.defaultShipment;
			var productLineItem = cart.object.createProductLineItem(product.ID,shipment);
			productLineItem.setQuantityValue(quantity);
			cart.calculate();
        });
	}
	
	response.redirect(URLUtils.https('Cart-Show'));
}


function emptyCart() {
	Customer.logout();
	response.redirect(URLUtils.url('Page-Show','cid',"shop-by-brand"));
}

function startStateVerification() {
	var existingcart = app.getModel('Cart').get();
	var singleShippingForm = app.getForm('singleshipping');
	var shipLimit = require('app_rapala_core/cartridge/scripts/checkout/ValidateShippingStateForCartItems.ds').validateProductCategory(existingcart,singleShippingForm);
	return shipLimit;
}
/*
* Module exports
*/

/*
* Web exposed methods
*/
/** Starting point for the single shipping scenario.
 * @see module:controllers/COShipping~start */
exports.Start = guard.ensure(['https'], start);
/** Selects a shipping method for the default shipment.
 * @see module:controllers/COShipping~selectShippingMethod */
exports.SelectShippingMethod = guard.ensure(['https', 'get'], selectShippingMethod);
/** Determines the list of applicable shipping methods for the default shipment of the current basket.
 * @see module:controllers/COShipping~updateShippingMethodList */
exports.UpdateShippingMethodList = guard.ensure(['https', 'get'], updateShippingMethodList);
/** Determines the list of applicable shipping methods for the default shipment of the current customer's basket and returns the response as a JSON array.
 * @see module:controllers/COShipping~getApplicableShippingMethodsJSON */
exports.GetApplicableShippingMethodsJSON = guard.ensure(['https', 'get'], getApplicableShippingMethodsJSON);
/** Renders a form dialog to edit an address.
 * @see module:controllers/COShipping~editAddress */
exports.EditAddress = guard.ensure(['https', 'get'], editAddress);
/** Updates shipping address for the current customer with information from the singleshipping form.
 * @see module:controllers/COShipping~updateAddressDetails */
exports.UpdateAddressDetails = guard.ensure(['https', 'get'], updateAddressDetails);
/** Form handler for the singleshipping form.
 * @see module:controllers/COShipping~singleShipping */
exports.SingleShipping = guard.ensure(['https'], singleShipping);
/** Form handler for the shippingAddressForm.
 * @see module:controllers/COShipping~editShippingAddress */
exports.EditShippingAddress = guard.ensure(['https', 'post'], editShippingAddress);
/** Form handler for the shippingAddressForm.
 * @see module:controllers/COShipping~miniCheckOut */
exports.MiniCheckOut = guard.ensure(['https', 'get'], miniCheckOut);
/** Form handler for the shippingAddressForm.
 * @see module:controllers/COShipping~shippingLogin */
exports.ShippingLogin = guard.ensure(['https', 'post'], shippingLogin);
/** @see module:controllers/COShipping~signOut */
exports.Signout = guard.ensure(['https', 'get'], signOut);
/** @see module:controllers/COShipping~copyCart */
exports.CopyCart = guard.ensure(['https'], copyCart);
/** @see module:controllers/COShipping~emptyCart */
exports.EmptyCart = guard.ensure(['https'], emptyCart);


/*
 * Local methods
 */
exports.PrepareShipments = prepareShipments;
