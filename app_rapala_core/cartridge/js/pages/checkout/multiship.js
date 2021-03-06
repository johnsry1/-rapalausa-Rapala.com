'use strict';

var address = require('./address'),
    formPrepare = require('./formPrepare'),
    dialog = require('../../dialog'),
    util = require('../../util'),
    shipping = require('./shipping'), //JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav.
    ajax = require('../../ajax'); //JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav.

/**
 * @function
 * @description Initializes gift message box for multiship shipping, the message box starts off as hidden and this will display it if the radio button is checked to yes, also added event handler to listen for when a radio button is pressed to display the message box
 */
function initMultiGiftMessageBox() {
    $.each($('.item-list'), function () {
        var $this = $(this);
        var $giftMessage = $this.find('.gift-message-text');

        //handle initial load
        $giftMessage.toggleClass('hidden', $('input[name$="_isGift"]:checked', this).val() !== 'true');

        //set event listeners
        $this.on('change', function () {
            $giftMessage.toggleClass('hidden', $('input[name$="_isGift"]:checked', this).val() !== 'true');
        });
    });
}

/**
 * @function
 * @description capture add edit adddress form events
 */
function addEditAddress(target) {
    var $addressForm = $('form[name$="multishipping_editAddress"]'),
        $addressDropdown = $addressForm.find('select[name$=_addressList]'),
        $addressList = $addressForm.find('.address-list'),
        add = true,
        selectedAddressUUID = $(target).parent().siblings('.select-address').val();

    $addressDropdown.on('change', function (e) {
        e.preventDefault();
        var selectedAddress = $addressList.find('select').val();
        if (selectedAddress !== 'newAddress') {
            selectedAddress = $.grep($addressList.data('addresses'), function (add) {
                return add.UUID === selectedAddress;
            })[0];
            add = false;
            // proceed to fill the form with the selected address
            util.fillAddressFields(selectedAddress, $addressForm);
        } else {
            //reset the form if the value of the option is not a UUID
            add = true; //PREVAIL - Added to handle back and forth scenarios.
            $addressForm.find('.input-text, .input-select').val('');
        }
    });

    $addressForm.on('click', '.cancel', function (e) {
        e.preventDefault();
        dialog.close();
    });

    $addressForm.on('submit', function (e) {
        e.preventDefault();

        // PREV-98: validation error messages are not displayed when adding address in Multi-Shipping. Added the following IF block.
        if (!$addressForm.valid()) {
            return false;
        }
        $.getJSON(Urls.addEditAddress, $addressForm.serialize(), function (response) {
            if (!response.success) {
                // @TODO: figure out a way to handle error on the form
                return;
            }
            var address = response.address,
                $shippingAddress = $(target).closest('.shippingaddress'),
                $select = $shippingAddress.find('.select-address'),
                $selected = $select.find('option:selected'),
                newOption = '<option value="' + address.UUID + '">' +
                    ((address.ID) ? '(' + address.ID + ')' : address.firstName + ' ' + address.lastName) + ', ' +
                    address.address1 + ', ' + address.city + ', ' + address.stateCode + ', ' + address.postalCode +
                    '</option>';
            dialog.close();
            if (add) {
                $('.shippingaddress select').removeClass('no-option').append(newOption);
                $('.no-address').hide();
            } else {
                $('.shippingaddress select').find('option[value="' + address.UUID + '"]').html(newOption);
            }
            // if there's no previously selected option, select it
            if ($selected.length === 0 || $selected.val() === '') {
                $select.find('option[value="' + address.UUID + '"]').prop('selected', 'selected').trigger('change');
            }
        });
    });

    //preserve the uuid of the option for the hop up form
    if (selectedAddressUUID) {
        //update the form with selected address
        $addressList.find('option').each(function () {
            //check the values of the options
            if ($(this).attr('value') === selectedAddressUUID) {
                $(this).prop('selected', 'selected');
                $addressDropdown.trigger('change');
            }
        });
    }
}

/**
 * @function
 * @description shows gift message box in multiship, and if the page is the multi shipping address page it will call initmultishipshipaddress() to initialize the form
 */
exports.init = function () {
    initMultiGiftMessageBox();
    if ($('.cart-row .shippingaddress .select-address').length > 0) {
        formPrepare.init({
            continueSelector: '[name$="addressSelection_save"]',
            formSelector: '[id$="multishipping_addressSelection"]'
        });
    }
    $('.edit-address').on('click', 'a', function (e) {
        e.preventDefault(); //JIRA PREV-205-Checkout Multiple Shipping Page - In Add/Edit address page cancel button not responding
        dialog.open({
            url: this.href,
            options: {
                open: function () {
                    address.init();
                    addEditAddress(e.target);
                    require('../../validator').init(); //JIRA PREV-98 : validation error messages are not displayed when adding  multiple address.re-init validator.
                    require('../../tooltip').init(); // JIRA PREV-84 : Multiple shipping page: Not displaying Tool tip. re-init tooltips.
                }
            }
        });
    });

    /*
      Start JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav
      Start JIRA PREV-103 : Selected shipping method will not update automatically in right nav
    */
    $(document).find('.checkoutmultishipping select[name$="_shippingMethodID"]').on('change', function () {
        var shipmentID = $(this).data('shipmentid');
        var shippingMethodId = $('option:selected', this).attr('value');
        ajax.getJson({
            url: Urls.multiShippingSelectSM,
            data: {
                'shipmentID': shipmentID,
                'shippingMethodId': shippingMethodId
            },
            callback: function (data) {
                shipping.updateSummary();
                if (!data || !data.success) {
                    window.alert('Could not select shipping method.');
                    return false;
                }
            }
        });
    });
    /*End JIRA PREV-103, PREV-99*/
};
