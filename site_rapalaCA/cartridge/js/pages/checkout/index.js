'use strict';

var address = require('./address'),
    billing = require('./billing'),
    multiship = require('./multiship'),
    uievents = require('../../uievents'),
    util = require('../../util'),
    shipping = require('./shipping');

/**
 * @function Initializes the page events depending on the checkout stage (shipping/billing)
 */
exports.init = function () {
    address.init();
    if ($('.allotment-label').length > 0 || $('.brand-rapala-checkout').length > 0) {
        $('body').find('#main').addClass('allotment-available');
    }
    if ($('.checkout-shipping').length > 0) {
        shipping.init();
    } else if ($('.checkout-multi-shipping').length > 0) {
        multiship.init();
    }  else {
        billing.init();
    }
    $(window).resize(function () {
        $('.ui-dialog-content:visible').each(function () {
            $(this).dialog('option', 'position', $(this).dialog('option', 'position'));
        });
    });
    $('body').find('.form-row').each(function () {
        if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper').find('input[type=\'text\']').length > 0) {
            $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
            if ($(this).find('.field-wrapper').find('input[type=\'text\']').val().length > 0) {
                $(this).find('.field-wrapper').find('.clearbutton').show();
            }
        } else if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper').find('input[type=\'password\']').length > 0) {
            $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
            if ($(this).find('.field-wrapper').find('input[type=\'password\']').val().length > 0) {
                $(this).find('.field-wrapper').find('.clearbutton').show();
            }
        }
    });
    $('body').find('.form-row .field-wrapper input').on('focus', function () {
        if ($(this).hasClass('errorclient')) {
            $(this).removeClass('errorclient');
        }
    });
    $('body').find('.form-row .field-wrapper input').on('keyup input blur', function () {
        if ($(this).val() != undefined) {
            if ($(this).val().length > 0) {
                $(this).closest('.form-row').find('a.clearbutton').show();
            } else {
                $(this).closest('.form-row').find('a.clearbutton').hide();
            }
        }
    });
    $('body').find('input').focusin(function () {
        $(this).closest('.formfield, .form-row').removeClass('inputlabel');
        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
        $(this).removeClass('errorclient');
        $(this).closest('.formfield , .form-row').find('.logerror , .existing_register').css('display', 'none');
    });
    $('body').find('.form-row a.clearbutton').on('click', function () {
        $(this).closest('.field-wrapper').find('span').remove();
        $(this).closest('.field-wrapper').find('.required').removeClass('errorclient');
        $(this).closest('.form-row').find('.form-row , .label span').removeClass('inputlabel');
        $(this).closest('.form-row').find('input').val('');
        $(this).closest('.form-row').find('a.clearbutton').hide();
        $(this).closest('.form-row').find('span.logerror , .existing_register').hide();
    });

    $('.pt_checkout .textinput, .pt_checkout .custom-select-wrap, .pt_checkout .textinputpw').bind('keyup blur', function () {
        if (jQuery('.New-shipping-authentication-detail').find('input[name$=\'_ProcessWay\']').val() == 2) {
            var errordiv = '<div class=\'error loginerror\'>' + Resources.checkout_login_error + '</div>';
            if ($('.shippinglogindetails').is(':visible') || !$('.checkoutshipping form[id$="_login"]').valid()) {
                if ($('.checkout .loginerror').length > 0) {
                    $('.checkout .loginerror').remove();
                }
                jQuery('.state-blk .stateerror.error').hide();
                if ($(this).closest('.formfield').find('.loginerror').length == 0) {
                    $(this).closest('.formfield').append(errordiv);
                }
            }
        }
        setTimeout(function () {
            uievents.synccheckoutH();
        }, 100);
    });

    $('.new-address-button').bind('click', function () {
        //jQuery("input[name=${pdict.CurrentForms.singleshipping.shippingAddress.makedefault.htmlName}]").attr('checked', true);
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
        uievents.changeFormSelection(jQuery('select[name$=\'_addressFields_states_state\']')[0], '');
        uievents.changeFormSelection(jQuery('select.address-select')[0], '');
        $('.shipping-address-field-section').removeClass('hide');
        $('.selected-shipping-address, .new-address-field').addClass('hide');
        $('input[name$=\'_addressFields_phone\']').closest('div.phone').find('span.errorclient').remove();
        $('input[name$=\'_addressFields_postal\']').closest('div.zip').find('span.errorclient').remove();
        $('.addressform .form-row.custom-select').removeClass('customselect-error');
        $('.custom-select').each(function () {
            var selectVal = $(this).find(':selected').text();
            $(this).find('.selectorOut').text(selectVal);
        });
        if ($('.checkout').hasClass('billingsection')) {
            $('body').find('input[name$=_sameasshippingaddress]').removeAttr('checked');
            $('body').find('input[name$=_sameasshippingaddress]').closest('.custom-checkbox').find('.custom-link').removeClass('active');
        }
        $('a.clearbutton').hide();
        $('.shipping-address-field-section .form-row').find('input').removeClass('errorclient');
        uievents.customFields();
        uievents.synccheckoutH();
    });
    $('.edit-address-field .edit-billing-button').bind('click', function () {
        var $form = $('.address');
        var selectedAddress = $(this).closest('.edit-address-field').data('address');
        util.fillAddressFields(selectedAddress, $form);
        $('.edit-address-field').addClass('hide');
        $('.selected-shipping-address, .new-address-field').addClass('hide');
        $('.billing-address-fields').removeClass('hide');
        uievents.customFields();
        uievents.synccheckoutH();
    });
    uievents.synccheckoutH();
    //if on the order review page and there are products that are not available diable the submit order button
    /* if ($('.order-summary-footer').length > 0) {
         if ($('.notavailable').length > 0) {
             $('.order-summary-footer .submit-order .button-fancy-large').attr('disabled', 'disabled');
         }
     }*/
};
