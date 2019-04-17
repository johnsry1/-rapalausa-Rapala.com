/**
 * @module
 * @extends {Org_TagManager}
 */
const Site_TagManager = require('./Org_TagManager');

const Util = require('./Util');

/**
 * @override
 * @return {Object}
 */
Site_TagManager.getGlobalData = function () {

    /** @type {Customer} */
    const customer = session.customer;

    /** @type {String} */
    const httpLocale = request.httpLocale;

    /** @type {Object} */
    const customerObject = {};

    if (customer) {

        customerObject.demandwareID = customer.ID;
        customerObject.loggedInState = customer.authenticated;

    }

    if (httpLocale) {
        customerObject.pageLanguage = httpLocale;
    }

    customerObject.currencyCode = session.currency.currencyCode;

    return customerObject;

};

/**
 * @override
 * @param {Product} product
 * @return {Object}
 */
Site_TagManager.getProductObject = function (product) {

    let obj = {};

    obj.id = product.ID;
    obj.name = product.name;

    if (product.isVariant() || product.isVariationGroup()) {
        obj.id = product.getMasterProduct().ID;
    }
    
    if (product.master && product.variationModel.variants.size() > 0) {
        obj.id = product.ID;
    }
    
    obj.category = Util.getPrimaryCategory(product);
    obj["secondary category"] = Util.getSecondaryCategory(product);
    obj.brand = product.brand;
    obj.price = Util.getProductOriginalPrice(product).value;


    return obj;

};

module.exports = Site_TagManager;