'use strict';

/**
 * Events are divided up by name space so only the
 * events that are needed are initialized.
 */
var events = {
    account: function () {},
    cart: function () {},
    checkout: function () {
        $('[name$=_deleteProduct]').on('click', function () {
            removeFromCart($.parseJSON($(this).attr('data-gtmdata')), 1);
        });
    },
    compare: function () {},
    product: function () {
        $('#add-to-cart').on('click', function () {
            addToCart($.parseJSON($(this).attr('data-gtmdata')), $(this).closest('div').find('[name=Quantity]').val());
        });
    },
    search: function () {},
    storefront: function () {},
    wishlist: function () {
        $('[name$=_addToCart]').on('click', function () {
            addToCart($.parseJSON($(this).attr('data-gtmdata')), $(this).closest('div').find('[name=Quantity]').val());
        });
    },
    // events that should happen on every page
    all: function () {
        $('.name-link').on('click', function () {
            productClick($.parseJSON($(this).attr('data-gtmdata')));
        });
        $('.thumb-link').on('click', function () {
            productClick($.parseJSON($(this).attr('data-gtmdata')));
        });
        $('.has-sub-menu').on('click', function () {
            pushEvent('trackEvent', 'User Action', 'Header Click', $(this).html());
        });
        $('.primary-logo').on('click', function () {
            pushEvent('trackEvent', 'User Action', 'Header Click', 'Home Link');
        });
    }
};

/**
 * @param {Object} productObject The product data
 * @description gets the data for a product click
 */
function productClick (productObject) {
    var obj = {
        'event': 'productClick',
        'ecommerce': {
            'click': {
                'actionField': {'list': 'SearchResults'},
                'products': []
            }
        }
    };
    obj.ecommerce.click.products.push(productObject);
    dataLayer.push(obj);
}

/**
 * @description Click event for add product to cart
 * @param {Object} productObject The product data
 * @param {String} quantity
 */
function addToCart (productObject, quantity) {
    var quantityObj = {'quantity': quantity},
        obj = {
            'event': 'addToCart',
            'ecommerce': {
                'add': {
                    'products': []
                }
            }
        };
    obj.ecommerce.add.products.push($.extend(productObject,quantityObj));
    dataLayer.push(obj);
}

/**
 *
 * @param {Object} productObject
 * @param {String|Number} quantity
 */
function removeFromCart (productObject, quantity) {
    var quantityObj = {'quantity': quantity},
        obj = {
            'event': 'removeFromCart',
            'ecommerce': {
                'remove': {
                    'products': []
                }
            }
        };
    obj.ecommerce.add.products.push($.extend(productObject,quantityObj));
    dataLayer.push(obj);
}

/**
 * @description Convenience method for creating a click event.
 * @param {String} event
 * @param {String} eventCategory
 * @param {String} eventAction
 * @param {String} eventLabel
 */
function pushEvent (event, eventCategory, eventAction, eventLabel) {
    dataLayer.push({
        'event': event,
        'eventCategory': eventCategory,
        'eventAction': eventAction,
        'eventLabel': eventLabel
    });
}

/**
 * @description Initialize the tag manager functionality
 * @param {String} nameSpace The current name space
 */
exports.init = function (nameSpace) {
    if (nameSpace && events[nameSpace]) {
        events[nameSpace]();
    }
    events.all();
};
