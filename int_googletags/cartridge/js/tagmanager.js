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
        initProductRecommendations('Cart: Recommended For You', 'ecommerce');
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
        initProductRecommendations('PDP: Recommended For You', 'ecommerce');
    },
    search: function () {
        initProductRecommendations('Grid: Recommended For You', 'ecommerce');
    },
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


function initProductRecommendations(listType, parentKey) {
    // Select the node that will be observed for mutations
    var targetNodes = $('[id^="cq_recomm"]');
    for (var i = 0; i < targetNodes.length; i++) {
        var targetNode = targetNodes[i];
        var config = {attributes: true, childList: true, subtree: true, attributeFilter: ['class']};
        var callback = function(mutationsList) {
            //var newTilesCount = 0;
            for (var j = 0; j < mutationsList.length; j++) {
                var mutation = mutationsList[j];
                if (mutation.type == 'childList') {
                    for (var k = 0; k < mutation.addedNodes.length; k++) {
                        if ($(mutation.addedNodes[k]).hasClass('owl-stage-outer')) {
                            getRecommendedProductImpressions('', parentKey, mutation);
                        } 
                    }
                }// else if (mutation.type == 'attributes' && $(mutation.target).hasClass('active')) {
                 //   console.log('active class added'); //eslint-disable-line
                 //   newTilesCount++;
                //    if (newTilesCount == 5) {
                //        getRecommendedProductImpressions(listType, parentKey)
                //    }
               // }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
}

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
 * @description get product recommendations impressions on pdp
 * 
 */
function getRecommendedProductImpressions (listType, parentKey, mutation) {
    // helper function to update the ecommerce object with impression data
    var listTypePrefix = '';
    var targetTitle = $(mutation.target).closest('.product-listing').find('h2').text();
    if (listType.length <= 0 && targetTitle.toLowerCase().indexOf('recommended') > -1) {
        switch (window.pageContext.ns) {
            case 'product':
                listTypePrefix = 'PDP: ';
                break;
            case 'search':
                listTypePrefix = 'Grid: ';
                break;
            case 'cart':
                listTypePrefix = 'Cart: ';
                break;
            default:
                listTypePrefix = '';
        }
    }
    
    listType = (listType.length > 0) ? listType : listTypePrefix + targetTitle;
    var prodImpressions = getImpressionObjectsArray(listType, mutation);

    for (var i = 0; i < dataLayer.length; i++) {
        if (!$.isEmptyObject(dataLayer[i][parentKey])) {
            if (!$.isEmptyObject(dataLayer[i][parentKey].impressions)) {
                // add new impression objects to existing impressions
                dataLayer[i][parentKey].impressions = $.merge(dataLayer[i][parentKey].impressions, prodImpressions);
            } else {
                dataLayer[i][parentKey].impressions = prodImpressions;
            }
        }
    }
    
}
function getImpressionObjectsArray(impressionType, mutation) {
    var visibleProductRecommendations = $(mutation.target).find('.owl-item.active');
    var rpDataObjs = [];
    for (var i = 0; i < visibleProductRecommendations.length; i++) {
        var rp = visibleProductRecommendations[i];
        var gtmData = $(rp).find('a.thumb-link').data('gtmdata');
        var obj = {
            'name': gtmData.name, 
            'id': gtmData.id,
            'price': gtmData.price,
            'brand': gtmData.brand,
            'category': gtmData.category,
            'secondary category' : gtmData['secondary category'],
            'list': impressionType
        }
        rpDataObjs.push(obj);
    }
    return rpDataObjs;
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
exports.addToCart = function (productObject, quantity, price) {
    addToCart(productObject, quantity, price);
};
exports.getImpressionObjectsArray = function (impressionType) {
    getImpressionObjectsArray(impressionType);
};
exports.initProductRecommendations = function (listType, parentKey) {
    initProductRecommendations(listType, parentKey);
};

