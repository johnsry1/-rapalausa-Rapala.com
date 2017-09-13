'use strict';

var addProductToCart = require('./product/addToCart'),
    page = require('../page'),
    account = require('./account'),
    util = require('../util');

exports.init = function() {
   // addProductToCart();
    //Start JIRA PREV-412 : SG Issue: Password reset overlay displayed as a page
    account.initCartLogin();
    $('#editAddress').on('change', function () {
        page.redirect(util.appendParamToURL(Urls.wishlistAddress, 'AddressID', $(this).val()));
    });

    //add js logic to remove the , from the qty feild to pass regex expression on client side
    $('.option-quantity-desired input').on('focusout', function () {
        $(this).val($(this).val().replace(',', ''));
    });
};
