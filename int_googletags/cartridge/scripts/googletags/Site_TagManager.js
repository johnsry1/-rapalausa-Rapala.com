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
        customerObject.customerGroup = getCustomerGroups(customer);
        customerObject.loggedInStatus = getLoggedInStatus(customer);
    }

    if (httpLocale) {
        customerObject.pageLanguage = httpLocale;
    }

    customerObject.currencyCode = session.currency.currencyCode;

    
    // get a string of all the customer groups the current customer is assigned to
    function getCustomerGroups(customer) {
        var allGroups = "";
        var groups = customer.customerGroups;
        for (var i = 0; i < groups.length; i++) {
        	
            var allGroups = (i+1 < groups.length ) ? allGroups + groups[i].ID + ' | ' : allGroups + groups[i].ID;
        }
        return allGroups;
    }
    function getLoggedInStatus(customer) {
        var logInStatus = "Logged Out";
        if (customer.isAuthenticated() && customer.isRegistered()){
            logInStatus = "Hard Logged In";
        } else if(customer.isAuthenticated()) {
            logInStatus = "Soft Logged In";
        }
        return logInStatus;
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

    obj.id = product.ID;
    obj.name = product.name;
    obj.childID = (product.master) ? product.getVariationModel().getDefaultVariant().getID() : product.getID();

    if (product.isVariant() || product.isVariationGroup()) {
        obj.id = product.getMasterProduct().ID;
    }
    
    if (product.master && product.variationModel.variants.size() > 0) {
        obj.id = product.ID;
    }
    
    obj.category = Util.getPrimaryCategory(product);
    obj["dimension3"] = Util.getSecondaryCategory(product);
    obj.brand = product.brand;
    obj.price = Util.getProductOriginalPrice(product).value;
    obj.list = 'Internal Search';


    return obj;

};

module.exports = Site_TagManager;