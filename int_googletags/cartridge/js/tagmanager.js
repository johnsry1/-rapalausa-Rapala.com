'use strict';

var util = require('./util');

/**
 * Events are divided up by name space so only the
 * events that are needed are initialized.
 */
var events = {
    account: function () {
        $('[name$="_profile_confirm"]').on('click', function() {
            signUpEvent('Account Sign Up', $(this), '_customer_addtoemaillist');
        });
        initAccountUpgrade();
    },
    cart: function () {
        $('[name$=_deleteProduct]').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                removeFromCart($.parseJSON($(this).attr('data-gtmdata')), $(this).closest('div').parent().find('[name$=_quantity]').val());
            }
        });
        initProductRecommendations('Cart: Recommended For You', 'ecommerce');
        initProductBestSelling('Don\'t Forget these Best Selling Essentials', 'ecommerce');
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
                var prodObj = $.parseJSON($(this).attr('data-gtmdata'));
                var quantity = $(this).closest('div').find('[name=Quantity]').val();
                var source = ($(this).data('quickview')) ? 'Quickview' : 'PDP';
                addToCart(prodObj, quantity, source, null);
            }
        });
        initProductRecommendations('PDP: Recommended For You', 'ecommerce');
        initPdpEngagement();
    },
    search: function () {
        initProductRecommendations('Grid: Recommended For You', 'ecommerce');
        initPdpEngagement();
    },
    storefront: function () {},
    wishlist: function () {
        $('[name$=_addToCart]').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                addToCart($.parseJSON($(this).attr('data-gtmdata')), $(this).closest('div').find('[name=Quantity]').val());
            }
        });
        initAccountUpgrade();
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
        });
        // navigation click tracking
        initNavigationClick();
    }
};

function initNavigationClick() {
    var event = 'navigationClick';
    // brand level navigation
    $('#brand-tabs-header ul li > span > a').on('click', function(e) {
        pushEvent(event, '', 'Main Navigation', $(e.target).text().trim())
    })
    // main mega nav with brands for mobile and desktop
    $('.megamenu-drop a').on('click', function(e){
        var isMobile = $(window).width() < 960;
        pushEvent(event , '', (isMobile ? 'Primary Mobile Navigation' : 'Primary Desktop Navigation'), $(e.target).text().trim());
    });
    // left hand navigation
    $('.categorymenusnew a').on('click', function(e){
        pushEvent(event , '', 'Left Hand Nav', $(e.target).text().trim());
    });
    // footer navigation
    $('.footer-main a').on('click', function(e){
        pushEvent(event , '', 'Footer Nav', $(e.target).text().trim());
    });
    // customer service and about us navigation
    $('.pt_customerservice .nav-group a').on('click', function(e){
        var isAboutNav = $('.pt_customerservice .nav-group').closest('div').find('h2').text().toLowerCase().indexOf('about') > -1;
        pushEvent(event , '', (isAboutNav ? 'About Us Nav' : 'Customer Service Nav'), $(e.target).text().trim());
    });
    // breadcrumb navigation
    $('.breadcrumb a').on('click', function(e){
        pushEvent(event , '', 'Breadcrumb Nav', $(e.target).text().trim());
    });
}

function initProductBestSelling(listType, parentKey) {
    // Select the node that will be observed for mutations
    var targetNodes = $('.cartrecommendations').first();
    for (var i = 0; i < targetNodes.length; i++) {
        var targetNode = targetNodes[i];
        var config = {attributes: true, childList: true, subtree: true, attributeFilter: ['class']};
        var callback = function(mutationsList) {
            for (var j = 0; j < mutationsList.length; j++) {
                var mutation = mutationsList[j];
                if (mutation.type == 'childList') {
                    for (var k = 0; k < mutation.addedNodes.length; k++) {
                        if ($(mutation.addedNodes[k]).hasClass('owl-stage-outer')) {
                            getRecommendedProductImpressions(listType, parentKey, mutation);
                        } 
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
}

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
                }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
}

function initPdpEngagement() {
    var obj = {
        'event' : 'pdpEngagement',
        'event_info' : {
            'label' : $('input[name="pid"]').val()
        }
    }
    function checkObj(obj, ele) {
        if (obj.event_info.label == null) {
            obj.event_info.label = ele.closest('#pdpMain').find('input[name="pid"]').val(); // eslint-disable-line
        }
        if ($('#QuickViewDialog').length > 0) {
            obj.event = 'quickviewEngagement';
        }
    }
    // 'Spec Chart' click on top right of the product details
    $('.specChart-link').on('click', function(){
        obj['event_info']['action'] = 'Top Spec Chart Link'; // eslint-disable-line
        checkObj(obj, $(this));
        dataLayer.push(obj);
    });
    // Tab click handling on pdp
    $('body').on('click', '#tabs .ui-tabs-nav > li', function(e) {
        if (typeof e.originalEvent != 'undefined') {
            obj['event_info']['action'] = e.target.innerText + ' Tab'; // eslint-disable-line
            checkObj(obj);
            dataLayer.push(obj);
        }
    });
    // When the video link above the product image is clicked (not on all products)
    $('body').on('click', '.provideo-spec-link', function(){
        obj['event_info']['action'] = 'Top Video Link'; // eslint-disable-line
        checkObj(obj, $(this));
        dataLayer.push(obj);
    });
    $('body').on('click', '.owl-nav > div', function() {
        obj['event_info']['action'] = 'Alt Image Arrow Click'; // eslint-disable-line
        checkObj(obj, $(this));
        dataLayer.push(obj);
    });
    $('body').on('click', '#pdpFullDetailsLink', function() {
        obj['event_info']['action'] = 'View Full Details'; // eslint-disable-line
        checkObj(obj, $(this));
        dataLayer.push(obj);
    });
    $('body').on('click', '.add-to-wishlist', function() {
        obj['event_info']['action'] = 'Wish List Link'; // eslint-disable-line
        checkObj(obj, $(this));
        dataLayer.push(obj);
    });
    $('body').on('click', '.addthis_toolbox', function() {
        obj['event_info']['action'] = 'Share This'; // eslint-disable-line
        checkObj(obj, $(this));
        dataLayer.push(obj);
    });
}

function initAccountUpgrade() {
    var obj = {
        'event' : 'accountUpgrade',
        'event_info' : {
            'action' : 'New'
        }
    }
    // drop down from header registration
    $('.header-create .register-button').on('click', function() {
        obj['event_info']['label'] = 'New B2C Account Drop-Down'; // eslint-disable-line
        obj['event_info']['action'] = 'New'; // eslint-disable-line
        dataLayer.push(obj);
    });
    // drop down from header login
    $('.header-sign-in .signin-button').on('click', function() {
        obj['event_info']['label'] = 'Create Account - Log In Drop Down'; // eslint-disable-line
        obj['event_info']['action'] = ''; // eslint-disable-line
        dataLayer.push(obj);
    });
    // VIP account creation signup and registration
    $('.viplogin .vip-chks').on('click', function() {
        if ($('.vip-register').length > 0) { // initial registration
            obj['event_info']['label'] = 'Create Account - VIP Register'; // eslint-disable-line
            obj['event_info']['action'] = 'New'; // eslint-disable-line        
        } else { // signup 
            obj['event_info']['label'] = 'Create Account - VIP Sign Up'; // eslint-disable-line
            obj['event_info']['action'] = 'New'; // eslint-disable-line
        }
        dataLayer.push(obj);
    });
    // VIP Upgrade signup and registration
    $('.viploginsignin .vip-chk').on('click', function() {
        if ($('.vip-register').length > 0) { // initial registration
            obj['event_info']['label'] = 'Upgrade Account - VIP Register'; // eslint-disable-line
            obj['event_info']['action'] = 'Upgrade'; // eslint-disable-line        
        } else { // signup 
            obj['event_info']['label'] = 'Upgrade Account - VIP Signup'; // eslint-disable-line
            obj['event_info']['action'] = 'Upgrade'; // eslint-disable-line
        }
        dataLayer.push(obj);
    });
    
    // register button on wishlist and account pages
    $('.registration-button').on('click', function() {
        obj['event_info']['label'] = (window.pageContext.ns.toLowerCase() == 'wishlist') ? 'Create Account - Wishlist' : 'Create Account - My Account'; // eslint-disable-line
        obj['event_info']['action'] = 'New'; // eslint-disable-line
        dataLayer.push(obj);
    });
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
                'products': [],
                'actionField' : {
                    'list' : productObject.list
                }
            }
        }
    };

    // delete list from products because it is in the actionField
    delete productObject.list;

    obj.ecommerce.click.products.push(productObject);
    dataLayer.push(obj);
}

/**
 * @description Click event for add product to cart
 * @param {Object} productObject The product data
 * @param {String} quantity
 * @param {String} source Optional where the a2c button was clicked, typically pdp or quickview
 * @param {String} price Optional price value to pass. 
 */
function addToCart (productObject, quantity, source, price) {
    var quantityObj = {'quantity': quantity},
        obj = {
            'event': 'addToCart',
            'event_info': {
                'label' : source
            },
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
    listType = (listType.length > 0) ? listType : getListDataValue(mutation);
    var prodImpressions = getImpressionObjectsArray(listType, mutation);

    for (var i = 0; i < dataLayer.length; i++) {
        if (!$.isEmptyObject(dataLayer[i][parentKey])) {
            if (!$.isEmptyObject(dataLayer[i][parentKey].impressions)) {
                // add new impression objects to existing impressions
                for (var prodIndex = 0; prodIndex < prodImpressions.length; prodIndex++) {
                    dataLayer[i][parentKey].impressions.push(prodImpressions[prodIndex]);
                }
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

        // init events for recommended and recently viewed product
        $(rp).find('.name-link').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                productClick($.parseJSON($(this).attr('data-gtmdata')));
            }
        });
        $(rp).find('.thumb-link').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                productClick($.parseJSON($(this).attr('data-gtmdata')));
            }
        });
        // for click on product name in Best Selling Essentials in the cart
        $(rp).find('.cart-recommendationName').on('click', function () {
            if ($(this).attr('data-gtmdata')) {
                productClick($.parseJSON($(this).attr('data-gtmdata')));
            }
        });

        // update list
        var gtmDataAttr = JSON.parse($(rp).find('a.thumb-link').attr('data-gtmdata'));
        gtmDataAttr.list = impressionType;
        $(rp).find('a.thumb-link').attr('data-gtmdata', JSON.stringify(gtmDataAttr));
        $(rp).find('a.name-link').attr('data-gtmdata', JSON.stringify(gtmDataAttr));
        $(rp).find('a.quickview').attr('data-gtmdata', JSON.stringify(gtmDataAttr));
        $(rp).find('a.cart-recommendationName').attr('data-gtmdata', JSON.stringify(gtmDataAttr));

        // update links with adding parameter tagList which should be passed to PDP
        addTagListParamToLink($(rp).find('a.thumb-link'), gtmDataAttr.list);
        addTagListParamToLink($(rp).find('a.name-link'), gtmDataAttr.list);
        addTagListParamToLink($(rp).find('a.cart-recommendationName'), gtmDataAttr.list);

        var obj = {
            'name': gtmDataAttr.name, 
            'id': gtmDataAttr.id,
            'price': gtmDataAttr.price,
            'brand': gtmDataAttr.brand,
            'category': gtmDataAttr.category,
            'dimension3' : gtmDataAttr.dimension3,
            'list': gtmDataAttr.list, 
            'childID': gtmDataAttr.childID,
            'position' : i+1
        }
        rpDataObjs.push(obj);
    }
    return rpDataObjs;
}
function getListDataValue(mutation) {
    var listValue = 'Internal Search'; // default value for PDP click and PDP Detail
    var listTypePrefix = '';
    if (mutation) {
        listValue = $(mutation.target).closest('.product-listing').find('h2').text();
        if (listValue.toLowerCase().indexOf('recommended') > -1) {
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
    }
    listValue = listTypePrefix + listValue;
    return listValue;
}

function addTagListParamToLink (linkElement, tagList) {
    if (linkElement.length > 0) {
        var href = linkElement.attr('href');
        href = util.appendParamToURL(href, 'taglist', tagList);
        linkElement.attr('href', href);
    }
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
exports.addToCart = function (productObject, quantity, source, price) {
    addToCart(productObject, quantity, source, price);
};
exports.getImpressionObjectsArray = function (impressionType) {
    getImpressionObjectsArray(impressionType);
};
exports.initProductRecommendations = function (listType, parentKey) {
    initProductRecommendations(listType, parentKey);
};

