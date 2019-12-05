'use strict';

var addProductToCart = require('./product/addToCart'),
    ajax = require('../ajax'),
    page = require('../page'),
    productTile = require('../product-tile'),
    quickview = require('../quickview');

/**
 * @private
 * @function
 * @description Binds the click events to the remove-link and quick-view button
 */
function initializeEvents() {
    $('#compare-table').on('click', '.remove-link', function (e) {
        e.preventDefault();
        ajax.getJson({
            url: this.href,
            callback: function (response) {
                /* Start JIRA PREV-74 : Compare page: Not navigating to PLP, When user clicks the "Remove (X)" icon on the last product,present in the product compare page.
                   Added condition to check for the last product removal if so navigate back to previous PLP.
                 */
                if (response.success && $('#compare-table .product-tile').length <= 1 && $('#compare-category-list').length === 0) {
                    window.location.href = $('.back').attr('href');
                } else if (response.success && $('#compare-table .product-tile').length <= 1 && $('#compare-category-list').length > 0) {
                    $('#compare-category-list option:selected').remove();
                    $('#compare-category-list').trigger('change');
                } else {
                    page.refresh();
                }
                /*End JIRA PREV-74 */
            }
        });
    })
        .on('click', '.open-quick-view', function (e) {
            e.preventDefault();
            var url = $(this).closest('.product').find('.thumb-link').attr('href');
            quickview.show({
                url: url,
                source: 'quickview'
            });
        });

    $('#compare-category-list').on('change', function () {
        $(this).closest('form').trigger('submit');
    });
}

exports.init = function () {
    productTile.init();
    initializeEvents();
    addProductToCart();
};
