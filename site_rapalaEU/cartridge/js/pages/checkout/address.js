'use strict';

var util = require('../../util'),
    uievents = require('../../uievents'),
    shipping = require('./shipping');

/**
 * @function
 * @description Selects the first address from the list of addresses
 */
exports.init = function () {
    var $form = $('.address');
    
    if ($form && $form.length) {
        //set which section should display
        util.updateStateOptions($form);
        //Need to set the province or state value
    }

    // select address from list
    $('select[name$="_addressList"]', $form).on('change', function () {
        var selected = $(this).children(':selected').first();
        var selectedAddress = $(selected).data('address');
        if (!selectedAddress) {
            if ($('.checkout').hasClass('billingsection')) {
                $('.addressoptions-addToAddressBook,.addressoptions-makedefault ').removeClass('hide');
                $('input[name$=\'shippingAddress_selectedaddress\']').val('');
                $('.selected-shipping-address').empty();
                $('input[name$=\'_addressid\']').val('');
                $('input[name$=\'_addressFields_firstName\']').val('');
                $('input[name$=\'_addressFields_lastName\']').val('');
                $('input[name$=\'_addressFields_address1\']').val('');
                $('input[name$=\'_addressFields_address2\']').val('');
                $('input[name$=\'_addressFields_city\']').val('');
                $('input[name$=\'_addressFields_postal\']').val('');
                $('input[name$=\'_addressFields_phone\']').val('');
                $('input[name$=\'_addressFields_states_state\']').val('');
                uievents.changeFormSelection(jQuery('select[name$=\'_addressFields_title\']')[0], '');
                uievents.changeFormSelection(jQuery('select[name$=\'_addressFields_country\']')[0], '');
                uievents.changeFormSelection(jQuery('select.address-select')[0], '');
                $('.shipping-address-field-section').removeClass('hide');
                $('.selected-shipping-address, .new-address-field, .edit-address-field').addClass('hide');
                $('input[name$=\'_addressFields_phone\']').closest('div.phone').find('span.errorclient').remove();
                $('input[name$=\'_addressFields_postal\']').closest('div.zip').find('span.errorclient').remove();
                $('.addressform .form-row.custom-select').removeClass('customselect-error');
                $('.custom-select').each(function () {
                    var selectVal = $(this).find(':selected').text();
                    $(this).find('.selectorOut').text(selectVal);
                });
                $('a.clearbutton').hide();
                $('.shipping-address-field-section .form-row').find('input').removeClass('errorclient');
                uievents.customFields();
            } else {
                $('.selected-shipping-address, .new-address-field').addClass('hide');
                $('.shipping-address-field-section').removeClass('hide');
            }
            uievents.synccheckoutH();
            return;
        }
        $('.selected-shipping-address').empty();
        if (selectedAddress.address2 == null) {
            selectedAddress.address2 = '';
        }
        selectedAddress.title = selectedAddress.title != null ? selectedAddress.title : '';
        selectedAddress.stateCode = selectedAddress.stateCode != null ? selectedAddress.stateCode : '';
        selectedAddress.postalCode = selectedAddress.postalCode != null ? selectedAddress.postalCode : '';
        selectedAddress.phone = selectedAddress.phone != null ? selectedAddress.phone : '';
        
        $('.selected-shipping-address').append(selectedAddress.title + ' ' + selectedAddress.firstName + ' ' + selectedAddress.lastName + '<br/>' + selectedAddress.address1 + ' ' + selectedAddress.address2 + '<br/>' + selectedAddress.city + ' ' + selectedAddress.stateCode + ' ' + selectedAddress.postalCode + '<br/>' + selectedAddress.countryDisplayValue + '<br/>' + selectedAddress.phone);
        if ($('.checkout').hasClass('billingsection')) {
            var editAddressObject = {
                firstName: selectedAddress.firstName,
                lastName: selectedAddress.lastName,
                address1: selectedAddress.address1,
                address2: selectedAddress.address2,
                postalCode: selectedAddress.postalCode,
                city: selectedAddress.city,
                stateCode: selectedAddress.stateCode,
                countryCode: selectedAddress.countryCode,
                countryDisplayValue: selectedAddress.countryDisplayValue,
                phone: selectedAddress.phone
            };
            $('.new-address-field').addClass('hide');
            $('.edit-address-field').attr('data-address', JSON.stringify(editAddressObject));
            $('.selected-shipping-address, .edit-address-field').removeClass('hide');
        } else {
            $('.selected-shipping-address, .new-address-field').removeClass('hide');
        }
        $('.shipping-address-field-section').addClass('hide');
        util.fillAddressFields(selectedAddress, $form);
        $('body').find('input[name$=_sameasshippingaddress]').removeAttr('checked');
        $('body').find('input[name$=_sameasshippingaddress]').closest('.custom-checkbox').find('.custom-link').removeClass('active');
        uievents.synccheckoutH();
        shipping.updateShippingMethodList();
        // re-validate the form
        /* JIRA PREV-95 : Highlighting the Credit card  details field, when the user select any saved address from the 'Select An Address' drop down.
           (logged-in user) .Commented to prevent form from re-validation.
		*/
        //$form.validate().form();
    });

    // update state options in case the country changes
    $('select[id$="_country"]', $form).on('change', function () {
        util.updateStateOptions($form);
        /*
         *Run again as option is selected in back-end,
         * but front-end needs to be refreshed. Call updateShippingMethodList()
         * to ensure shipping method is changed.
         */
        util.updateStateOptions($form);
        shipping.updateShippingMethodList();
    });

};
