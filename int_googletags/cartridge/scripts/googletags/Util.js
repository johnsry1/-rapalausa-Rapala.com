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
    APP: 'app_rapala_controllers/cartridge/scripts/app'

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
    HOME: 'storefront',

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
exports.getProductArrayFromList = function (productList, objectCreationCallback, list) {

    /** @type {Array} */
    let productArray = [];

    /** @type {Number} */
    let position = 1;
    
    let count = 0;

    while (productList.hasNext()) {
        
        if (count >= 20) {
            break;
        }

        let item = productList.next(),
            prodObj = objectCreationCallback(item);

        prodObj.position = position;
        if (!empty(list)) {
        	prodObj.list = list;
        } else {
        	prodObj.list = "Internal Search"; // default value for most CLP pages
        }

        productArray.push(prodObj);

        position++;
        count++;

    }

    return productArray;

};

/**
 * Creates an ecommerce array based on an Product iterator. The itertor can contain
 * Product, ProductListItem, or ProductLineItem.
 *
 * This is a GTM output for flowbox
 *
 * @param {Iterator} productList
 * @return {Array}
 */
 exports.getFlowBoxProductArrayFromList = function (productList) {
    /** @type {Array} */
    let productArray = [];
    let count = 0;

    while (productList.hasNext()) {
        
        if (count >= 20) {
            break;
        }
        let item = productList.next();
        prodObj = { "id": item.product.ID , "quantity" : item.quantityValue};
        productArray.push(prodObj);
        count++;   
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

exports.getTotalDiscount = function (order) {
    var ordertotalsaving = new dw.value.Money(0.0, session.currency.currencyCode);
    var priceVals = require('*/cartridge/scripts/cart/calculateProductNetPrice.ds').prodNetPrice(order);

    if (priceVals[0] > order.getAdjustedMerchandizeTotalPrice(true).add(order.giftCertificateTotalPrice)) {
        ordertotalsaving = ordertotalsaving.add(priceVals[0].subtract(order.getAdjustedMerchandizeTotalPrice(true).add(order.giftCertificateTotalPrice)));
    }
    var shippingExclDiscounts : dw.value.Money = order.shippingTotalPrice;
    var shippingInclDiscounts : dw.value.Money = order.getAdjustedShippingTotalPrice();
    var shippingDiscount : dw.value.Money = shippingExclDiscounts.subtract( shippingInclDiscounts );

    if (shippingDiscount > 0) { 
        //ordertotalsaving = ordertotalsaving.add(shippingDiscount);
    }
    
    return ordertotalsaving;
};

exports.getProductCategory = function (product) {
    if (product.isVariant() || product.isVariationGroup()) {
        product = product.getMasterProduct();
    }
    var cat = product.getPrimaryCategory();
    return (!empty(cat) ? cat.ID.replace('-', '/', 'g') : '');

};

exports.getPrimaryCategory = function (product) {
    var cat = "";
    if (product.isVariant() || product.isVariationGroup()) {
        product = product.getMasterProduct();
    }
    cat = product.getPrimaryCategory().getDisplayName();
    return cat;
};

exports.getSecondaryCategory = function (product) {
    if (product.isVariant() || product.isVariationGroup()) {
        product = product.getMasterProduct();
    }
    var cat = product.getPrimaryCategory().getDisplayName();
    return cat;

};


exports.getProductCoupon = function (lineItem) {
    var priceAdjustments = lineItem.getPriceAdjustments();
    if (priceAdjustments != null && priceAdjustments.length > 0) {
        var multipleCoupons = '';
        for (var q = 0; q < priceAdjustments.length; q++) {
            var pa = priceAdjustments[q];
            if (pa.getPromotion() && pa.getPromotion().getPromotionClass().equals(dw.campaign.Promotion.PROMOTION_CLASS_PRODUCT) && pa.getPromotion().isBasedOnCoupons()) {
                multipleCoupons += (!empty(multipleCoupons)) ? pa.getCouponLineItem().getCouponCode() + '|' : pa.getCouponLineItem().getCouponCode();
            }
        }
        return multipleCoupons;

    } else {
        return '';
    }
};

exports.getProductOriginalPrice = function (product) {
    var PriceModel = product.getPriceModel();
    var standardPrice = dw.value.Money.NOT_AVAILABLE;

    if (!empty(PriceModel) && PriceModel.priceInfo != null) {
        var priceBook = PriceModel.priceInfo.priceBook;
        standardPrice = PriceModel.getPriceBookPrice(priceBook.ID);
    }

    if (!standardPrice.equals(dw.value.Money.NOT_AVAILABLE) && !session.getCurrency().getCurrencyCode().equals(standardPrice.getCurrencyCode())) {
        standardPrice = dw.value.Money.NOT_AVAILABLE;
    }

    if (product.master && !product.priceModel.isPriceRange() && product.variationModel.variants.size() > 0) {
        product = product.variationModel.variants[0]
        PriceModel = product.getPriceModel();
        if (!empty(PriceModel) && PriceModel.priceInfo != null) {
            var priceBook = PriceModel.priceInfo.priceBook;
            standardPrice = PriceModel.getPriceBookPrice(priceBook.ID);
        }

        if (!standardPrice.equals(dw.value.Money.NOT_AVAILABLE) && !session.getCurrency().getCurrencyCode().equals(standardPrice.getCurrencyCode())) {
            standardPrice = dw.value.Money.NOT_AVAILABLE;
        }
    }
    return standardPrice;
};

exports.getCategorySearch = function (foundCategory) {
	var result = "";
	var categoryArray = [];
	var category = foundCategory;
	var isRootCategory = category.root;
	while (!empty(category) && !isRootCategory) {
		categoryArray.unshift(category.displayName);
		if (empty(category.parent)) {
			break;
		}
		category = category.parent;
		isRootCategory = category.root;
	}
	if (categoryArray.length > 0) {
		result = categoryArray.join('|');
	}
	return result;
}