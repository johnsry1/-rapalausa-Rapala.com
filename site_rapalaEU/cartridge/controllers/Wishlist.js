'use strict';

/**
 * This controller implements the functionality for wishlists.
 *
 * @module controllers/Wishlist
 */

/* API Includes */
var GiftCertProductListItem = require('dw/customer/ProductListItem').TYPE_GIFT_CERTIFICATE;
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');



/**
 * Uses request parameters to add a product.
 */
function addProduct() {
    var Product = app.getModel('Product');
    var product = Product.get(request.httpParameterMap.pid.stringValue);
    var productOptionModel = product.updateOptionSelection(request.httpParameterMap);
    var alreadyExist = false;
    var ProductList = app.getModel('ProductList');
    var productList = ProductList.get();
    var listItems = productList.object.getItems();
    for each(var listItem in listItems){
    	if(listItem.getProductID() == request.httpParameterMap.pid.stringValue) {
    		alreadyExist = true;
            if (request.httpParameterMap.isParameterSubmitted('wishlist')) {
                Transaction.wrap(function () {
                    listItem.setQuantityValue(request.httpParameterMap.Quantity.doubleValue);
                })
            }
    	}
    }
    if(!alreadyExist){
    	productList.addProduct(product.object, request.httpParameterMap.Quantity.doubleValue || 1, productOptionModel);
    }
}

/**
 * Adds a product given by the HTTP parameter "pid" to the wishlist and displays
 * the updated wishlist.
 */
function add() {
    addProduct();
    response.redirect(dw.web.URLUtils.https('Wishlist-Show'));
}

/*
 * Web exposed methods
 */
// own wishlist
/** @see module:controllers/Wishlist~Add */
exports.Add = guard.ensure(['get', 'https', 'loggedIn'], add, {scope: 'wishlist'});
/** @see module:controllers/Wishlist~AddAjax */
exports.AddAjax = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').AddAjax;
/** @see module:controllers/Wishlist~Show */
exports.Show = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').Show;
/** @see module:controllers/Wishlist~ReplaceProductListItem */
exports.ReplaceProductListItem = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').ReplaceProductListItem;
/** @see module:controllers/Wishlist~SetShippingAddress */
exports.SetShippingAddress = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').SetShippingAddress;

// others wishlist
/** @see module:controllers/Wishlist~Search */
exports.Search = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').Search;
/** @see module:controllers/Wishlist~ShowOther */
exports.ShowOther = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').ShowOther;

// form handlers
/** @see module:controllers/Wishlist~LandingForm */
exports.LandingForm = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').LandingForm;
/** @see module:controllers/Wishlist~WishListForm */
exports.WishListForm = require('app_rapala_controllers/cartridge/controllers/Wishlist.js').WishListForm;
