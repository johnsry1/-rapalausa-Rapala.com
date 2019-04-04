'use strict';

/**
 * Events are divided up by name space so only the
 * events that are needed are initialized.
 */
var events = {
    account: function () {
        $('[name$="_profile_confirm"]').on('click', function() {
            signUpEvent('Account Sign Up', $(this), '_customer_addtoemaillist');
        });
    },
    cart: function () {
        $('[name$=_deleteProduct]').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                removeFromCart($.parseJSON($(this).attr('data-gtmdata')), $(this).closest('div').parent().find('[name$=_quantity]').val());
            }
        });
    },
    checkout: function () {
        $('[name$=_deleteProduct]').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                removeFromCart($.parseJSON($(this).attr('data-gtmdata')), 1);
            }
        });
        $('[name$="_billing_save"]').on('click', function(){
            signUpEvent('Billing Sign Up', $(this), '_billingAddress_addToEmailList');
        });
    },
    compare: function () {},
    product: function () {
        $('[name$=_addToCart]').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                addToCart($.parseJSON($(this).attr('data-gtmdata')), $(this).closest('div').find('[name=Quantity]').val());
            }
        });	
    },
    search: function () {},
    storefront: function () {},
    wishlist: function () {
        $('[name$=_addToCart]').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                addToCart($.parseJSON($(this).attr('data-gtmdata')), $(this).closest('div').find('[name=Quantity]').val());
            }
        });
    },
    // events that should happen on every page
    all: function () {
        $('.name-link').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                productClick($.parseJSON($(this).attr('data-gtmdata')));
            }
        });
        $('.thumb-link').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                productClick($.parseJSON($(this).attr('data-gtmdata')));
            }
        });
        $('.has-sub-menu').on('click', function () {
            pushEvent('trackEvent', 'User Action', 'Header Click', $(this).html());
        });
        $('.primary-logo').on('click', function () {
            pushEvent('trackEvent', 'User Action', 'Header Click', 'Home Link');
        });

        $(document).ready(function() {
            $('#footerSubForm button').on('click', function () {
                if (SitePreferences.GTM_ENABLED) {
                    var validF = $(this).closest('form').valid();
                    if (validF) {
                        dataLayer.push({
                            'event': 'emailSignUp',
                            'eventCategory': 'Secondary Goals',
                            'eventAction': 'Email Sign-up',
                            'eventLabel': 'Footer Sign Up'
                        });
                    }
                }
            });

            $('.header-signup button').on('click', function() {
                signUpEvent('Header Sign Up', $(this), '_customer_addtoemaillist');
            })
        })
    }
};

/**
 * Push to DataLayer sign up event info
 */
function signUpEvent(location, event, signUpCheckbox) {
    if (SitePreferences.GTM_ENABLED) {
        var validF = $(event).closest('form').valid();
        var $signUpElem = $(event).closest('form').find('[name$="' + signUpCheckbox + '"]')[0];
        if (validF && $signUpElem != undefined && $signUpElem.checked) {
            pushEvent('emailSignUp', 'Secondary Goals', 'Email Sign-up', location);
        }
    }
}

/**
 * @param {Object} productObject The product data
 * @description gets the data for a product click
 */
function productClick (productObject) {
    var obj = {
        'event': 'productClick',
        'event_info': {
            'label' : 'PDP'
        },
        'ecommerce': {
            'click': {
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
function addToCart (productObject, quantity, price) {
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
    if (price != undefined && price > 0) {
        obj.ecommerce.add.products[0].price = price;
    }
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
    obj.ecommerce.remove.products.push($.extend(productObject,quantityObj));
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
