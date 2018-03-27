'use strict';

/**
 * Controller that update address fields based on country code
 *
 * @module controllers/Avs
 */

/* API Includes */
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Locale = require('dw/util/Locale');
var Resource = require('dw/web/Resource');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');


/**
 * Get html code for state field
 */
function getStateHtml() {
    var type = 'input';
    var formID = request.httpParameterMap.formID.value;
    var countryValue = request.httpParameterMap.country.value;
    var formField = 'profile.address.states.state';
    var formFieldAdditional = '';
    var formAddressName;
    var mandatoryAttribute;
 
    if (formID) {
        if (formID === 'dwfrm_billing') {
            formField = 'billing.billingAddress.addressFields.states.state';
            formFieldAdditional = 'state' + countryValue;
            formAddressName = 'billing.billingAddress.addressFields.states';
        } else if (formID === 'dwfrm_singleshipping_shippingAddress') {
            formField = 'singleshipping.shippingAddress.addressFields.states.state';
            formFieldAdditional = 'state' + countryValue;
            formAddressName = 'singleshipping.shippingAddress.addressFields.states';
        }

        if (!empty(formAddressName)) {
            var formObject = app.getForm(formAddressName);
            var stateFieldAdditional = formObject.object[formFieldAdditional];
        }
    }
    var stateField = app.getForm(formField);
    
    if (stateFieldAdditional != null || stateFieldAdditional != undefined) {
        mandatoryAttribute =  stateFieldAdditional.mandatory;
        stateField = stateFieldAdditional;
    } else {
        mandatoryAttribute = stateField.object.mandatory;
    }
    
    if (('object' in stateField && stateField.object.options != null && stateField.object.options.optionsCount > 0) ||
            (stateField.options != null && stateField.options.optionsCount > 0)) {
        type = 'select';
    }
    var fieldObject = {
            formfield: 'object' in stateField ? stateField.object : stateField,
            type: type
        };

    app.getView({
        fieldObject: fieldObject,
        mandatoryAttribute: mandatoryAttribute,
        countryValue: countryValue
    }).render('checkout/address/state');
}

function getPhoneHtml() {
    var type = request.httpParameterMap.fieldType.value;
    var formID = request.httpParameterMap.formID.value;
    var countryValue = request.httpParameterMap.country.value;
    var formField = 'profile.address.phone';
    var formFieldAdditional = '';
    var formAddressName;
    var mandatoryAttribute;
 
    if (formID) {
        if (formID === 'dwfrm_billing') {
            formField = 'billing.billingAddress.addressFields.phone';
            formFieldAdditional = 'phone' + countryValue;
        } else if (formID === 'dwfrm_singleshipping_shippingAddress') {
            formField = 'singleshipping.shippingAddress.addressFields.phone';
            formFieldAdditional = 'phone' + countryValue;
        }
    }
    var phoneField = app.getForm(formField);
    
    var fieldObject = {
            formfield: phoneField.object,
            type: type
        };

    app.getView({
        fieldObject: fieldObject,
        countryValue: countryValue
    }).render('checkout/address/phone');   
}

/**
 * Renders registered customer information.
 *
 * This is designed as a remote include as it represents dynamic session information and must not be
 * cached.
 */
function includeOnlyRegisteredCustomerHeaderInfo() {
    app.getView().render('components/header/registeredheadercustomerinfo');
}


exports.IncludeRegisteredHeaderCustomerInfo = guard.ensure(['get'], includeOnlyRegisteredCustomerHeaderInfo);
exports.GetPhoneHtml = guard.all(getPhoneHtml);
exports.GetStateHtml = guard.all(getStateHtml);
