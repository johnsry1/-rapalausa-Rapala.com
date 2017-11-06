const ArrayList = require('dw/util/ArrayList');
const PagingModel = require('dw/web/PagingModel');

/**
 * @type {StringUtils}
 */
const StringUtils = require('dw/util/StringUtils');

/**
 * @type {Logger}
 */
const Logger = require('dw/system/Logger');

/**
 * @type {Log}
 */
const log = Logger.getLogger('int_googletagmanager', 'analytics');

/**
 * export the log so that it can be used by the other scripts
 * @type {Log}
 */
exports.log = log;

const PATH = {

    /**
     * Path to app.js
     * @type {String}
     */
    APP: 'app_storefront_controllers/cartridge/scripts/app'

};

exports.PATH = PATH;

const NAMESPACE = {

    /**
     * @type {String}
     */
    CART: 'cart',

    /**
     * @type {String}
     */
    CHECKOUT: 'checkout',

    /**
     * @type {String}
     */
    ORDER_CONFIRMATION: 'orderconfirmation',

    /**
     * @type {String}
     */
    PRODUCT: 'product',

    /**
     * @type {String}
     */
    SEARCH: 'search',

    /**
     * @type {String}
     */
    WISHLIST: 'wishlist'

};

exports.NAMESPACE = NAMESPACE;

/**
 * Creates an ecommerce array based on an Product iterator. The itertor can contain
 * Product, ProductListItem, or ProductLineItem.
 *
 * The composition of each object will be determined by a custom callback based on
 * client analytics requirements.
 *
 * @param {Iterator} productList
 * @param {function} objectCreationCallback
 * @return {Array}
 */
exports.getProductArrayFromList = function (productList, objectCreationCallback) {

    /** @type {Array} */
    let productArray = [];

    /** @type {Number} */
    let position = 1;

    while (productList.hasNext()) {

        let item = productList.next(),
            prodObj = objectCreationCallback(item);

        prodObj.position = position;

        productArray.push(prodObj);

        position++;

    }

    return productArray;

};

/**
 *
 * @param {ProductSearchModel} productSearchResult
 * @param {PagingModel} productPagingModel
 * @return {ArrayList}
 */
exports.getSearchProducts = function (productSearchResult, productPagingModel) {

    /** @type {ArrayList} */
    let products = new ArrayList();

    if (!empty(productPagingModel)) {

        /*
         *	Here we need to reconstruct the paging model. Unfortunately the original
         *	is constructed using an iterator. The iterator in the PagingModel generated in
         *	search pipeline has been exhausted by now. The new PagingModel is needed to
         *	accurately represent the clickable products on the page.
         *
         *	Possibly a better way to do this.
         */

        let newPagingModel = new PagingModel(productSearchResult.getProducts(), productPagingModel.getCount()),

            pagingModelProducts;

        newPagingModel.setPageSize(productPagingModel.getPageSize());

        newPagingModel.setStart(productPagingModel.getStart());

        pagingModelProducts = newPagingModel.getPageElements();

        while (pagingModelProducts.hasNext()) {

            products.add1(pagingModelProducts.next());

        }

    }

    return products;

};

/**
 * Attempts to get custom attribute value from object or null otherwise.
 * @param {Object} obj
 * @param {String} id
 * @return {*}
 */
exports.getObjectCustomValue = function (obj, id) {

    if (!empty(obj) && !empty(obj.custom) && obj.custom.hasOwnProperty(id)) {

        return (obj.custom)[id];

    }

    return null;

};

/**
 *
 * @param {Iterator} coupons
 * @return {String}
 */
exports.getCoupons = function (coupons) {

    /** @type {Array} */
    let text = [];

    while (coupons.hasNext()) {

        /** @type {CouponLineItem} */
        let coupon = coupons.next();

        text.push(coupon.getCouponCode());

    }

    return text.join(",");

};
