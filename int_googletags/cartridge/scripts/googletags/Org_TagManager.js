const Util = require('./Util');

/** @type {ProductMgr} */
const ProductMgr = require('dw/catalog/ProductMgr');

/** @type {Resource} */
const Resource = require('dw/web/Resource');

/** @type {Site} */
const Site = require('dw/system/Site');

const app = require(Util.PATH.APP);

/**
 * @module Org_TagManager
 */
const Org_TagManager = {

    util: Util,
    
    /**
     *
     * @param {PipelineDictionary} args
     * @param {String} nameSpace
     * @return {Object}
     */
    setPageData: function (args, nameSpace) {

        var pageType = this.getPageType(nameSpace, args);
        args.pageType = pageType;
        switch (nameSpace) {
            case Util.NAMESPACE.CART :
                return this.getCheckoutData(args);
            case Util.NAMESPACE.CHECKOUT :
                return this.getCheckoutData(args);
            case Util.NAMESPACE.ORDER_CONFIRMATION :
                return this.getConfirmationData(args);
            case Util.NAMESPACE.PRODUCT :
                return this.getPdpData(args);
            case Util.NAMESPACE.SEARCH :
                return this.getSearchImpressionData(args);
            case Util.NAMESPACE.WISHLIST :
                return this.getWishlistImpressionData(args);
            //case Util.HOME : 
            //    return this.getHomeData(args);
            default :
                return {
                    pageType: args.pageType,
                };
        }

    },
    
    getPageType : function (nameSpace, args) {
        var type = Util.HOME;
        switch (nameSpace) {
            case Util.NAMESPACE.CART :
            case Util.NAMESPACE.CHECKOUT :
                return 'checkout';
            case Util.NAMESPACE.ORDER_CONFIRMATION :
                return 'confirmation';
            case Util.NAMESPACE.PRODUCT :
                return 'productPage';
            case Util.NAMESPACE.SEARCH :
                var productId = ''+request.httpParameterMap.productid.value || null;
                var pageCategoryId = ''+request.httpParameterMap.cgid.value || null;
                if (pageCategoryId != 'null' && productId == 'null') {
                    return 'categoryPage';
                }
                return 'searchResults';
            case Util.NAMESPACE.WISHLIST :
                return '';
            case Util.NAMESPACE.HOME : 
                return 'home';
            default :
                return '';
        }        
    },

    /**
     *
     * @param {PipelineDictionary} args
     * @return {Object}
     */
    getCheckoutData: function (args) {

        /** @type {Object} */
        let obj = {
            pageType: args.pageType,
            event: 'checkout',
            ecommerce: {
                checkout: {
                    actionField: {
                        step: ''
                    },
                    products: []
                }
            }
        };

        /** @type {Basket} */
        const basket = app.getModel('Cart').goc();

        if (basket) {
            obj.ecommerce.checkout.products = Util.getProductArrayFromList(basket.getProductLineItems().iterator(), this.getOrderProductObject);
            obj.ecommerce.checkout.flowbox = Util.getFlowBoxProductArrayFromList(basket.getProductLineItems().iterator());
        }

        obj.ecommerce.checkout.actionField.step = session.custom.checkoutStep;

        return obj;
    },

    /**
     *
     * @param {PipelineDictionary} args
     * @return {Object}
     */
    getConfirmationData: function (args) {

        let obj = {
            "pageType": args.pageType,
            "ecommerce": {
                "purchase": {
                    "actionField": {},
                    "products": []
                }
            }
        };

        const order = args.Order;

        if (order) {
            obj.ecommerce.purchase.products = Util.getProductArrayFromList(order.productLineItems.iterator(), this.getOrderConfirmationProductObject);
            obj.ecommerce.purchase.actionField = this.getConfirmationActionFieldObject(order);
            obj.ecommerce.purchase.flowbox = Util.getFlowBoxProductArrayFromList(order.productLineItems.iterator());
        }

        return obj;

    },

    /**
     * product detail data
     * @param {PipelineDictionary} args
     * @return {Object}
     */
    getPdpData: function (args) {

        /** @type {Object} */
        let obj = {
            pageType: args.pageType,    
            ecommerce: {
                detail: {
                	actionField: {list: null},
                    products: []
                }
            }
        };

        /** @type {Product} */
        let product;

        if ('Product' in args) {
            product = args.Product;
        }

        var productObj = this.getProductObject(product);

        // update list if product was clicked from category page
    	if (!empty(request.httpParameterMap.taglist) && request.httpParameterMap.taglist.value != null) {
			var list = request.httpParameterMap.taglist.value;
			productObj = this.getProductObject(product);
			productObj.list = list;
    	}

    	//set list in to the actionField and delete list from products
    	obj.ecommerce.detail.actionField.list = productObj.list;
    	delete productObj.list;

    	//set product
    	obj.ecommerce.detail.products.push(productObj);

        return obj;

    },

    /**
     * Search impressions
     * @param {PipelineDictionary} args
     * @return {Object}
     */
    getSearchImpressionData: function (args) {

        let obj = {
            pageType: args.pageType,
            ecommerce: {
                impressions: []
            }
        };

        if ('ProductSearchResult' in args) {
            if (!empty(args.ProductSearchResult.searchPhrase)) {
                obj.eventLabel = args.ProductSearchResult.searchPhrase + ' | ' + args.ProductSearchResult.count;
                obj.eventAction = (args.ProductSearchResult.count > 0 ? 'True Search Results' : 'Null Results');
            }
            if ('ProductPagingModel' in args) {
            	var list = null;
            	if (args.pageType == "categoryPage" && args.ProductSearchResult.categorySearch) {
            		list = Util.getCategorySearch(args.ProductSearchResult.category);
            	}

                obj.ecommerce.impressions = Util.getProductArrayFromList(Util.getSearchProducts(args.ProductSearchResult, args.ProductPagingModel).iterator(), this.getProductObject, list)
            }
        }

        return obj;

    },

    /**
     * ProductList impressions
     * @param {PipelineDictionary} args
     * @return {Object}
     */
    getWishlistImpressionData: function (args) {

        let obj = {
            pageType: args.pageType,    
            ecommerce: {
                impressions: []
            }
        };

        /** @type {ProductList} */
        let productList;

        if ('ProductList' in args) {
            productList = args.ProductList;
        }

        if (productList) {
            obj.ecommerce.impressions = Util.getProductArrayFromList(productList.items.iterator(), this.getProductObject);
        }

        return obj;

    },

    /**
     * Order information
     * @param {Order} order
     * @return {Object}
     */
    getConfirmationActionFieldObject: function (order) {

        let obj = {};

        obj.id = order.orderNo;
        obj.affiliation = Site.current.ID;
        obj.revenue = order.totalNetPrice.value + order.totalTax.value;
        obj.salesRevenue = order.getAdjustedMerchandizeTotalGrossPrice().value;
        obj.tax = order.totalTax.value;
        obj.shipping = order.shippingTotalPrice.value;
        obj.coupon = Util.getCoupons(order.couponLineItems.iterator());
        obj.discount = Util.getTotalDiscount(order).value;

        return obj;

    },


    /**
     * This is where data that appears on every page will be included
     * @return {Object}
     * @private
     */
    getGlobalData: function () {

        /** @type {Customer} */
        const customer = session.customer;

        /** @type {Object} */
        let customerObject = {};

        if (customer) {

            customerObject.demandwareID = customer.ID;
            
        }
        
        return customerObject;

    },

    /**
     *
     * @param {PipelineDictionary} args
     * @param {String} NameSpace
     * @return {Array}
     */
    getDataLayer: function (args, NameSpace) {

        /** @type {Array} */
        let dataLayer = [];

        /** @type {String} */
        let nameSpace = empty(NameSpace) ? "" : NameSpace;

        /** @type {Object} */
        const globalData = this.getGlobalData();

        /** @type {Object} */
        const pageData = this.setPageData(args, nameSpace);

        if (!empty(globalData)) {
            dataLayer.push(globalData);
        }

        if (!empty(pageData)) {
            dataLayer.push(pageData);
        }

        return dataLayer;

    },

    /**
     *
     * @param {String} productId
     * @return {Object}
     */
    getProductData: function (productId) {

        /** @type {Product} */
        const product = ProductMgr.getProduct(productId);

        return this.getProductObject(product);

    }

};


/**
 * Data for a ProductLineItem
 * @param {ProductLineItem} productLineItem
 * @return {Object}
 */
Org_TagManager.getOrderProductObject = function (productLineItem) {

    let obj = Org_TagManager.getProductObject(productLineItem.product);

    obj.quantity = productLineItem.quantityValue;
    obj.price = Util.getProductOriginalPrice(productLineItem.product).value;

    return obj;

};


/**
 * Data for a ProductLineItem
 * @param {ProductLineItem} productLineItem
 * @return {Object}
 */
Org_TagManager.getOrderConfirmationProductObject = function (productLineItem) {

    let obj = Org_TagManager.getOrderProductObject(productLineItem);

    obj.coupon = Util.getProductCoupon(productLineItem);

    return obj;

};

/**
 * Data for a Product
 * @param {Product} product
 * @return {Object}
 */
Org_TagManager.getProductObject = function (product) {

    let obj = {};
    
    obj.id = product.ID;
    obj.name = product.name;

    if (product.isVariant() || product.isVariationGroup()) {
        obj.productID = product.getMasterProduct().ID;
    }

    if (product.master && product.variationModel.variants.size() > 0) {
        obj.productID = product.ID;
    }
    
    obj.category = Util.getPrimarytCategory(product);
    obj.brand = product.brand;
    obj.price = Util.getProductOriginalPrice(product).value;

    return obj;

};

Org_TagManager.getCategorySearch = function (args, nameSpace) {

	var categorySearch = null;

	var pageType = this.getPageType(nameSpace, args);
	if (pageType == "categoryPage" && nameSpace == Util.NAMESPACE.SEARCH) {
		categorySearch = Util.getCategorySearch(args.ProductSearchResult.category);
	}

	return categorySearch;

};

Org_TagManager.getCategorySearchById = function (id) {

	var category = dw.catalog.CatalogMgr.getCategory(id);
	var categorySearch = Util.getCategorySearch(category);

	return categorySearch;

};

module.exports = Org_TagManager;