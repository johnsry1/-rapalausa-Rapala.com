'use strict';
var dialog = require('./dialog');

var $cache = {};

function initializeCache() {
    $cache.primary = $('#primary');
    $cache.checkoutForm = $cache.primary.find('.checkout-shipping.address').length > 0 ? $cache.primary.find('.checkout-shipping.address') : $cache.primary.find('.checkout-billing.address');
    $cache.submitFormButton = $cache.checkoutForm.find('button.saveShipping').length > 0 ? $cache.checkoutForm.find('button.saveShipping') : $cache.checkoutForm.find('button[name$=_save]');
    $cache.validatoionDialog = $cache.primary.find('#address-validation-dialog');
    $cache.byPassDAV = $cache.checkoutForm.find('.bypassDAV');
    $cache.address1 = $cache.checkoutForm.find('input[name$="_address1"]');
    $cache.address2 = $cache.checkoutForm.find('input[name$="_address2"]');
    $cache.city = $cache.checkoutForm.find('input[name$="_city"]');
    $cache.stateCode = $cache.checkoutForm.find('select[id$="_state"]');
    $cache.countryCode = $cache.checkoutForm.find('select[id$="_country"]');
    $cache.postalCode = $cache.checkoutForm.find('input[name$="_postal"]');
}

function initializeDom() {
    if ($cache.validatoionDialog.length > 0) {

        var dlg = dialog.create({
            target: $cache.validatoionDialog,
            options: {
                width: 300,
                dialogClass: 'address-validation-dialog',
                open: initializeEvents
            }
        });

        $cache.validatoionDialog.show();
        dlg.dialog('open');
    }
}

function initializeEvents() {

    $cache.validatoionDialog.on('click', '#original-address-edit', function () {
        $cache.validatoionDialog.dialog('close');
        $('.shipping-address-field-section').removeClass('hide');
        $('.selected-shipping-address').addClass('hide');
        $('.new-address-field').addClass('hide');

        /*jQuery('html, body').animate({
            scrollTop: $('#navigation').position().top
        }, 500);*/
    });
    $cache.validatoionDialog.on('click', '#suggested-address-edit-1', function () {

        $('.shipping-address-field-section').removeClass('hide');
        $('.selected-shipping-address').addClass('hide');
    });

    $cache.validatoionDialog.on('click', '#ship-to-original-address', function () {

        $cache.validatoionDialog.dialog('close');
        $cache.byPassDAV.attr('value', 'true');
        $cache.submitFormButton.click();
    });

    $cache.validatoionDialog.on('click', '[id|="suggested-address-edit"]', function () {
        var selectedAddress = $(this).data('address').split('||');
        $cache.address1.val(selectedAddress[0]);
        if (selectedAddress[1] !== 'undefined' && selectedAddress[1] !== '') {
            $cache.address2.val(selectedAddress[1]);
        }
        $cache.city.val(selectedAddress[2]);
        $cache.stateCode.val(selectedAddress[3]);
        $cache.countryCode.val(selectedAddress[4]);
        $cache.postalCode.val(selectedAddress[5]);
        $cache.validatoionDialog.dialog('close');
        jQuery('html, body').animate({
            scrollTop: $('#navigation').position().top
        }, 500);
    });

    $cache.validatoionDialog.on('click', '[id|="ship-to-address-selected"]', function () {
        var selectedAddress = $(this).data('address').split('||');
        $cache.address1.val(selectedAddress[0]);
        if (selectedAddress[1] !== 'undefined' && selectedAddress[1] !== '') {
            $cache.address2.val(selectedAddress[1]);
        }
        $cache.city.val(selectedAddress[2]);
        $cache.stateCode.val(selectedAddress[3]);
        $cache.countryCode.val(selectedAddress[4]);
        $cache.postalCode.val(selectedAddress[5]);
        $cache.byPassDAV.attr('value', 'true');
        $cache.validatoionDialog.dialog('close');

        $cache.submitFormButton.click();
    });
}

exports.init = function () {
    initializeCache();
    initializeDom();
};
