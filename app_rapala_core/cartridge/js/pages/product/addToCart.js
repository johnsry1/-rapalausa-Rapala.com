'use strict';

var dialog = require('../../dialog'),
    minicart = require('../../minicart'),
    util = require('../../util'),
    TPromise = require('promise'),
    _ = require('lodash');

/**
 * @description Handler to handle the add all items to cart event
 */
var addAllToCart = function (e) {
    e.preventDefault();

    var $productForms = $('#product-set-list').find('form').toArray();
    TPromise.all(_.map($productForms, addToCart))
        .then(function (responses) {
            dialog.close();
            // show the final response only, which would include all the other items
            minicart.show(responses[responses.length - 1]);
        });
};

/**
 * @function
 * @description Binds the click event to a given target for the add-to-cart handling
 */
// adds a product to the mini cart
// @params
// progressImageSrc - source/url of the image to show when the item
// is being added to the cart
// postdata - form data containing the product information to be
// added to mini-cart
// callback - call back function/handler
var addToCart = {
    init: function () {
        $('.checkoutminicart').slimscroll();
        $('.add-to-cart[disabled]').attr('title', $('.availability-msg').text());
        //Start JIRA PREV-454, PREV-469 : Application navigation not consistent when click of add to cart button of the Product set page
        $('#add-all-to-cart').on('click', addAllToCart);
        if ($('.mini-cart-product').length > 1) {
            $('.minicartcontent .slimScrollDiv').removeClass('less');
            $('.minicartcontent .slimScrollDiv .slimScrollBar').show();
        } else {
            $('.minicartcontent .slimScrollDiv').addClass('less');
            $('.minicartcontent .slimScrollDiv .slimScrollBar').hide();
        }
    },
    add: function (progressImageSrc, postdata, callback) {
        // get the data of the form as serialized string
        //var postdata = postdata;

        fbq('track', 'AddToCart', {
            'content_ids': [postdata.pid],
            'content_type': 'product'
        });

        // get button reference
        var addButtons = [];

        // the button to update
        var addButton = null;

        // it is an array of buttons, but we need only one all
        // other combinations are strange so far
        if (addButtons.length == 1) {
            addButton = addButtons[0];
        }

        var previousImageSrc = null;

        // show progress indicator
        if (addButton != null) {
            previousImageSrc = addButton.src;
            addButton.src = progressImageSrc;
        }

        // handles successful add to cart
        var handlerFunc = function (req) {

            if ($('#container').hasClass('pt_cart')) {
                window.location.href = window.location.href;
            }
            // hide progress indicator
            if (addButton != null) {
                addButton.src = previousImageSrc;
            }

            // replace the content
            jQuery('#minicart').html(req);
            addToCart.init();
            if ($('.minirow').length > 1 && !($('body').hasClass('rapala_device'))) {
                $('.checkoutminicart').slimscroll({
                    railVisible: true,
                    alwaysVisible: true
                });
                $('.minicarttable').find('thead').first().addClass('theadfixedTop');
                $('.checkoutminicart').find('.cartordertotals').removeClass('carttotals');
                $('.checkoutminicart').find('.minicarttable').removeClass('miniwithoutScroll');
                $('.minicartcontent').find('.minicarttableheader').removeClass('miniwithoutScrollhead');
                $('.minicarttableheader').css('border-bottom', '1px solid #ccc');

            } else {
                $('.minicarttable').find('.theadfixedTop').removeClass('theadfixedTop');
                $('.minicarttable').find('.fixedTop').removeClass('fixedTop');
                $('.minicart').find('.cartordertotals').addClass('carttotals');
                $('.checkoutminicart').find('.minicarttable').addClass('miniwithoutScroll');
                $('.minicartcontent').find('.minicarttableheader').addClass('miniwithoutScrollhead');
                $('.minicarttableheader').css('border-bottom', '1px solid #ccc');

            }

            if ($('body').hasClass('rapala_device')) {
                $('.checkoutminicart').find('.minicarttable').removeClass('miniwithoutScroll');
                // $(".minicarttable .tr_rotation:last-child").find('.minirow').css('border','1px');
                $('.minicarttable').find('thead').first().addClass('theadfixedTop');
                $('.minicarttable .tr_rotation:last-child').find('.minirow').css('border', '0px');
                $('.minicarttableheader').css('border-bottom', '1px solid #ccc');
            }
            $('.minicarttable .tr_rotation:last-child').find('.minirow').css('border', '0px');

            if (minicart.suppressSlideDown && minicart.suppressSlideDown()) {
                // do nothing
                // the hook 'MiniCart.suppressSlideDown()' should have
                // done the refresh
            } else {
                minicart.slide();
                minicart.setminicarheight();
                if (callback) {
                    callback();
                }
            }
            $('#pdpMain .addtocartconfirm-tooltip').fadeIn(400).show()
                .delay(1500).fadeOut(400);
            // fire the BonusDiscountLineItemCheck event so we can check
            // if there is a bonus discount line item
            jQuery(document).trigger(
                /*eslint-disable */
                jQuery.Event('BonusDiscountLineItemCheck'));
                /*eslint-enable */
        };

        // handles add to cart error
        var errFunc = function () {
            // hide progress indicator
            if (addButton != null) {
                addButton.src = previousImageSrc;
            }
        };

        // closes a previous mini cart
        minicart.close();

        var url = Urls.addProduct;

        // add the product
        if ($('#container').hasClass('pt_cart') && !$('#QuickViewDialog').hasClass('recommendation')) {
            var plItemId = $('.addTo-cart-section input.line-itemid').val();
            var params = {
                updateQty: 'true',
                lineItemId: plItemId
            };
            url = util.appendParamsToUrl(Urls.editLineItem, params);
        }

        $.ajax({
            type: 'POST',
            url: util.ajaxUrl(url),
            cache: true,
            data: postdata,
            success: handlerFunc,
            error: errFunc
        });
    }
};
module.exports = addToCart;
