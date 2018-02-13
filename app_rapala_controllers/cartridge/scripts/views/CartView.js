'use strict';

/**
 * View used to render the cart. This view makes sure the coupons, shipments, and basket
 * calculation are up to date before rendering the cart.
 * @module views/CartView
 */
var View = require('./View');

var Cart = require('~/cartridge/scripts/models/CartModel');
var Transaction = require('dw/system/Transaction');

/**
 * Updates shipments, coupons, and cart calculation for the view.
 *
 * @class views/CartView~CartView
 * @extends module:views/View
 * @lends module:views/CartView~CartView.prototype
 * @returns {module:views/CartView~CartView} A cart view with updated information.
 */
var CartView = View.extend({

    /**
     * Updates shipments, coupons, and cart calculation for the view and validates the cart
     * for checkout.
     */
    prepareView: function () {
        var cart = this.Basket;
        if (cart) {
        	
            // Refreshes the cart calculation.
        	Transaction.wrap(function () {
        		 var removeinvalidcoupon= require('app_rapala_core/cartridge/scripts/cart/RemoveInvalidcoupon.ds').removeInvalidCoupon(cart);
            	 require('app_rapala_core/cartridge/scripts/checkout/RemoveGiftPaymentInstruments.ds').removeGC(cart);
            	  //Deletes all the Discontinued products .
           		 Cart.get(cart).removeDiscontinuedProducts();
        		Cart.get(cart).calculate();
            });
            // Refreshes shipments.
            session.forms.cart.shipments.copyFrom(cart.shipments);
            // Refreshes coupons.
            session.forms.cart.coupons.copyFrom(cart.couponLineItems);
                       
            //set the default shipping method	
            Transaction.wrap(function () {
            	require('app_rapala_core/cartridge/scripts/checkout/SetDefaultShippingMethod.ds').setShippingMethod(cart, '', '');
            	
            	//var customer = app.getModel('Customer').get().object;
    		    if (customer.authenticated && 'iceforce' != session.privacy.currentSite){
    		    	var orderTotal = require('app_rapala_core/cartridge/scripts/prostaff/UseProStaffAllowance.ds').checkAllotmentPayment(customer,cart);
    		    }
            });
            //get the Product net price and surcharge if any
            var priceVals = require('app_rapala_core/cartridge/scripts/cart/calculateProductNetPrice.ds').prodNetPrice(cart);
            this.prodNetPrice = priceVals[0];
            this.surcharge = priceVals[1];
            var validationResult = Cart.get(cart).validateForCheckout();
            this.EnableCheckout = validationResult.EnableCheckout;
            this.BasketStatus = validationResult.BasketStatus;
            this.CouponStatus = validationResult.CouponStatus;
            //PREVAIL - Added .object
            this.WishList = customer.authenticated ? require('~/cartridge/scripts/models/ProductListModel').get().object : null;
        }

        return;
    },

    /**
     * View for store locator functionality.
     * @extends module:views/View~View
     * @constructs module:views/CartView~CartView
     */
    init: function (params) {
        var URLUtils = require('dw/web/URLUtils');

        this._super(params);
        this.Basket = params.cart ? params.cart.object : null;

        /** backward compatibility to URLUtils.continueURL() methods in old templates **/
        this.ContinueURL = URLUtils.abs('Cart-SubmitForm');

        return this;
    },

    render: function (params) {

        this.prepareView();
        return this._super(params);
    }

});

module.exports = CartView;
