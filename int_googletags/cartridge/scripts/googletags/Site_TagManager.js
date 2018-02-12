/**
 * @module
 * @extends {Org_TagManager}
 */
const Site_TagManager = require('./Org_TagManager');

/**
 * @override
 * @return {Object}
 */
Site_TagManager.getGlobalData = function () {

    /** @type {Customer} */
    const customer = session.privacyer;

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

    return customerObject;

};

/**
 * @override
 * @param {Product} product
 * @return {Object}
 */
Site_TagManager.getProductObject = function (product) {

    let obj = {};

    obj.productID = product.ID;
    obj.name = product.name;

    return obj;

};

module.exports = Site_TagManager;