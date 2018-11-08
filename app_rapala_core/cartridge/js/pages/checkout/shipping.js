'use strict';

var ajax = require('../../ajax'),
    progress = require('../../progress'),
    tooltip = require('../../tooltip'),
    util = require('../../util'),
    dialog = require('../../dialog'),
    uievents = require('../../uievents'),
    $submitButton = $('button.continue-checkout');

/**
 * @function
 * @description Initializes gift message box, if shipment is gift
 */
function giftMessageBox() {
    // show gift message box, if shipment is gift
    $('.gift-message-text').toggleClass('hidden', $('input[name$="_shippingAddress_isGift"]:checked').val() !== 'true');
}

/**
 * @function
 * @description shows the spinning icon on the Continue To Billing button for IE11
 */
function updateButtonIE() {
    // indicate progress
    $submitButton.append('<div class="loader"><div class="loader-indicator"></div><div class="loader-bg"></div></div>');
}

/**
 * @function
 * @description updates the order summary based on a possibly recalculated basket after a shipping promotion has been applied
 */
function updateSummary() {
    var $summary = $('#secondary .new-summery-cart');
    // indicate progress
    if (navigator.userAgent.match(/Trident\/7\./)) {
        updateButtonIE();
    }
    progress.show($summary);
    var stateValue = $('body').find('select[id$="_addressFields_states_state"]').val();
    
    var url = util.appendParamToURL(Urls.summaryRefreshURL, 'selectedState', stateValue);
    url = util.appendParamToURL(url, 'checkoutstep', 3);

    // load the updated summary area
    $summary.load(url, function () {
        // hide edit shipping method link
        $summary.fadeIn('fast');
        $summary.find('.checkout-mini-cart .minishipment .header a').hide();
        $summary.find('.order-totals-table .order-shipping .label a').hide();
        uievents.synccheckoutH();
    });
}

/**
 * @function
 * @description shows the spinning icon on the Continue To Billing button
 */
function updateButton() {
    // indicate progress
    $(function (){
        if (navigator.userAgent.match(/Trident\/7\./)) {
            $submitButton.append('<div class="loader"><div class="loader-indicator"></div><div class="loader-bg"></div></div>');
        }
    });
    progress.show($submitButton);
}

/**
 * @function
 * @description Helper method which constructs a URL for an AJAX request using the
 * entered address information as URL request parameters.
 */
function getShippingMethodURL(url, extraParams) {
    var $form = $('.address');
    var params = {
        address1: $form.find('input[name$="_address1"]').val(),
        address2: $form.find('input[name$="_address2"]').val(),
        countryCode: $form.find('select[id$="_country"]').val(),
        stateCode: $form.find('select[id$="_state"]').val(),
        postalCode: $form.find('input[name$="_postal"]').val(),
        city: $form.find('input[name$="_city"]').val()
    };
    return util.appendParamsToUrl(url, $.extend(params, extraParams));
}

/**
 * @function
 * @description selects a shipping method for the default shipment and updates the summary section on the right hand side
 * @param
 */
function selectShippingMethod(shippingMethodID) {
    // nothing entered
    if (!shippingMethodID) {
        return;
    }

    // attempt to set shipping method
    var url = getShippingMethodURL(Urls.selectShippingMethodsList, {
        shippingMethodID: shippingMethodID
    });
    ajax.getJson({
        url: url,
        callback: function (data) {
            updateSummary();
            $('button.continue-checkout .loader').remove();
            uievents.synccheckoutH();
            if (!data || !data.shippingMethodID) {
                window.alert('Couldn\'t select shipping method.');
                return false;
            }
            // display promotion in UI and update the summary section,
            // if some promotions were applied
            $('.shippingpromotions').empty();

            // if (data.shippingPriceAdjustments && data.shippingPriceAdjustments.length > 0) {
            // 	var len = data.shippingPriceAdjustments.length;
            // 	for (var i=0; i < len; i++) {
            // 		var spa = data.shippingPriceAdjustments[i];
            // 	}
            // }
        }
    });
}

/**
 * @function
 * @description Make an AJAX request to the server to retrieve the list of applicable shipping methods
 * based on the merchandise in the cart and the currently entered shipping address
 * (the address may be only partially entered).  If the list of applicable shipping methods
 * has changed because new address information has been entered, then issue another AJAX
 * request which updates the currently selected shipping method (if needed) and also updates
 * the UI.
 */
function updateShippingMethodList() {
    var $shippingMethodList = $('#shipping-method-list');
    if (!$shippingMethodList || $shippingMethodList.length === 0) {
        return;
    }

    if (navigator.userAgent.match(/Trident\/7\./)) {
        updateButtonIE();
    }
    var url = getShippingMethodURL(Urls.shippingMethodsJSON);

    ajax.getJson({
        url: url,
        callback: function (data) {
            if (!data) {
                window.alert('Couldn\'t get list of applicable shipping methods.');
                return false;
            }
            /*if (false && shippingMethods && shippingMethods.toString() === data.toString()) { // PREVAIL-Added for 'false' to handle SPC.
                // No need to update the UI.  The list has not changed.
                return true;
            }*/

            // We need to update the UI.  The list has changed.
            // Cache the array of returned shipping methods.
            //shippingMethods = data;
            // indicate progress
            progress.show($shippingMethodList);
            updateButton();
            // load the shipping method form
            var smlUrl = getShippingMethodURL(Urls.shippingMethodsList);
            $shippingMethodList.load(smlUrl, function () {
                $shippingMethodList.fadeIn('fast');
                // rebind the radio buttons onclick function to a handler.
                $shippingMethodList.find('[name$="_shippingMethodID"]').click(function () {
                    updateButton();
                    $('.shipping-methods .shipping-method .value .custom-link ').removeClass('active');
                    $(this).closest('.custom-link').addClass('active');
                    selectShippingMethod($(this).val());
                });

                // update the summary
                updateSummary();
                uievents.synccheckoutH();
                progress.hide();
                tooltip.init();
                //if nothing is selected in the shipping methods select the first one
                if ($shippingMethodList.find('.input-radio:checked').length === 0) {
                    $shippingMethodList.find('.input-radio:first').prop('checked', 'checked');
                }
                $(function (){
                    if (navigator.userAgent.match(/Trident\/7\./)) {
                        $('button.continue-checkout .loader').remove();
                    }
                });
            });
        }
    });
}

function signin() {
    $('#addressform .textinput').addClass('blured');
    $('#addressform .custom-select').addClass('blured');
    $('#addressform .custom-checkbox').addClass('blured');
    $('.signintomyaccount-block,.shipping-createrapalaaccount,.shipping-confirmemailaddress,.shipping-emailaddress,.shipping-guestconfirmemailaddress,.shipping-guestemailaddress,.shipping-password,.shipping-confirmpassword,.shipping-checkoutasguest,.or1,.createaccountmsg')
        .addClass('hide');
    $('.checkoutasguest-block,.shippinglogindetails,.createanaccount-block,.or2,.addressoptions-addToAddressBook,.addressoptions-makedefault,.addressid').removeClass('hide');
    $('.shippinglogindetails').find('input[name$=\'_username\'],input[name$=\'_password\']').addClass('required');
    $('.New-shipping-authentication-detail').find('input[name$=\'_passwordconfirm\'],input[name$=\'_password\'],input[name$=\'_email\'],input[name$=\'_emailconfirm\'],input[name$=\'_guestemailconfirm\'],input[name$=\'_guestemail\']').removeClass('required');
    $('.New-shipping-authentication-detail').find('input[name$=\'_ProcessWay\']').val('2');
    $('.New-shipping-authentication-detail').find('input[name$=\'_passwordconfirm\'],input[name$=\'_password\']').val('');
    $('.checkout .shipping-address-field-section .formfield span.errorclient').remove();
    $('.shipping-address-field-section').addClass('signin-error');
    uievents.synccheckoutH();
}

exports.init = function () {
    if ($(document).find('.address-select').val() != '' && $(document).find('.address-select').val() != undefined) {
        $(document).find('.shipping-address-field-section').addClass('hide');
    } else {
        $(document).find('.shipping-address-field-section').removeClass('hide');
        $(document).find('.selected-shipping-address').addClass('hide');
        $(document).find('.new-address-field').addClass('hide');
    }
    if ($(document).find('.fromreturn1').val() == 'true') {
        $(document).find('.shipping-address-field-section').removeClass('hide');
    }
    $('input[name$="_shippingAddress_isGift"]').on('click', giftMessageBox);

    $('.address').on('change',
        'input[name$="_addressFields_address1"], input[name$="_addressFields_address2"], select[name$="_addressFields_states_state"], input[name$="_addressFields_city"], input[name$="_addressFields_postal"]', // PREVAIL-Changed ZIP to postal
        updateShippingMethodList
    );

    giftMessageBox();
    updateShippingMethodList();

    $('.continue-checkout-button .continue-checkout').on('click', function () {

        updateButton();
        var form = $(this).closest('form[id$="_shippingAddress"]');
        if ($('.state-blk select').valid() == 0) {
            if (!$('.state-blk.custom-select').hasClass('blured')) {
                $('.state-blk.custom-select').addClass('customselect-error');
                //$('.state-blk .stateerror').show();
            }
        } else {
            //$('.state-blk  .stateerror').hide();
            $('.state-blk.custom-select').removeClass('customselect-error');
        }

        if (!$('.checkoutasguestbutton').is(':visible')) {
            $('.guestemailcon').blur();
            $('.guestemail').blur();
        }
        if (!form.valid()) {
            progress.hide();
            if (navigator.userAgent.match(/Trident\/7\./)) {
                $('button.continue-checkout .loader').remove();
            }
            if (jQuery('.shipping-address-field-section').hasClass('hide')) {
                $('select[name$=singleshipping_addressList]').val('');
                $('input[name$="singleshipping_shippingAddress_selectedaddress"]').val('');
                $('.custom-select').each(function () {
                    var selectVal = $(this).find(':selected').text();
                    $(this).find('.selectorOut').text(selectVal);
                });
                $('.shipping-address-field-section').removeClass('hide');
                $('.selected-shipping-address').addClass('hide');
            }
            if (!$('.shippinglogindetails').is(':visible')) {
                $('.singleshipping_error').removeClass('hide');
                $('.signinabove').hide();
            } else if ($('.shippinglogindetails').is(':visible')) {
                if (!$('.shippinglogindetails form').valid()) {
                    $('.shippinglogindetails .username .textinput, .shippinglogindetails .textinputpw').blur();
                    $('button[name$="login_login"]').trigger('click');
                }
                var errormsg = '<div id=\'message\' class=\'error-alert signinabove\' style=\'text-align: left;\'>Please Log in above to continue</div>';
                if ($('#dwfrm_singleshipping_shippingAddress .formactions #message').length > 0 || $('#dwfrm_singleshipping_shippingAddress .formactions .singleshipping_error').length > 0) {
                    jQuery('#dwfrm_singleshipping_shippingAddress .formactions #message').remove();
                    jQuery('#dwfrm_singleshipping_shippingAddress .formactions .singleshipping_error').hide();
                }
                jQuery('.singleshipping_error').hide();
                jQuery('#dwfrm_singleshipping_shippingAddress .formactions').prepend(errormsg);
                uievents.synccheckoutH();
                return false;
            }
        } else {
            $('.singleshipping_error').addClass('hide');
        }
        uievents.synccheckoutH();
    });

    $('body').on('click', '.go-as-guest-checkout', function () {
        $('.shipping-checkoutasguest, .signintomyaccount-block').removeClass('hide');
        $('.shippinglogindetails , .addressid').addClass('hide');
        uievents.synccheckoutH();
    });
    if ($('.state-shipping-valid-dialog').length > 0) {
        var dialogWidth = 511;
        var singOutDialog = dialog.create({
            target: '#dialog-container',
            options: {
                bgiframe: true,
                autoOpen: false,
                modal: true,
                width: dialogWidth,
                dialogClass: 'state-shipping-dialog'
            }
        });
        $(singOutDialog).empty().append($('.state-shipping-valid-dialog').html());
        singOutDialog.dialog('open');
    }
    $('body').on('click', '.shippingsignout', function (e) {
        e.preventDefault();
        $.ajax({
            url: this.href,
            success: function (data) {
                var dialogWidth = 500;
                /*if( $(window).width() < 767 ){
                    dialogWidth = 300
                }*/
                var singOutDialog = dialog.create({
                    target: '#dialog-container',
                    options: {
                        bgiframe: true,
                        autoOpen: false,
                        modal: true,
                        width: dialogWidth,
                        dialogClass: 'sing-out-dialog'
                    }
                });
                $(singOutDialog).empty().append(data);
                singOutDialog.dialog('open');
            }
        });
    });
    $('body').on('click', '.signintomyaccountbutton', function () {
        signin();
        $('form[id$="_login"] .formfield.username, form[id$="_login"] .formfield.password').each(function () {
            $(this).find('.value input').val('').removeClass('errorclient');
            $(this).find('.value span.errorclient').hide();
        });
        $('form[id$="_login"] .wrongaddress').hide();
        $('form[id$="_login"] .#message.error').remove();

        $('.singleshipping_error').hide();
        $('.shipping-emaildetaillinks').addClass('loginactive');
        $('.shipping-emaildetaillinks').removeClass('reginactive');
        $('.New-shipping-authentication-detail input[id$="shippingAddress_email"]').removeClass('accemail');
        $('.New-shipping-authentication-detail input[id$="shippingAddress_emailconfirm"]').removeClass('accemailcon');
        $('.New-shipping-authentication-detail input[name$=\'_guestemailconfirm\']').removeClass('guestemailcon');
        $('.New-shipping-authentication-detail input[name$=\'_guestemail\']').removeClass('guestemail');
        $('.shippinglogindetails input[name$=\'login_username\']').addClass('loggedemail');
        $('.shippinglogindetails .correctaddress').removeClass('error').hide();
        if ($('.emailhidden').val()) {
            $('input[id$="login_username"]').val($('.emailhidden').val());
            $('input[id$="login_username"]').blur();
            $('input[id$="login_username"]').closest('.formfield').find('.correctaddress').show();
        }
        $('.New-shipping-authentication-detail input[name$=\'shippingAddress_password\']').removeClass('c_password');
        $('.New-shipping-authentication-detail input[name$=\'shippingAddress_passwordconfirm\']').removeClass('cm_password');
        $('.shippinglogindetails input[name$=\'login_password\']').addClass('login_password');
        $('.shipping-address-field-section .value input').removeClass('errorclient');
        $('.shipping-address-field-section .value span.errorclient').hide();
        $('.custom-select').removeClass('customselect-error');
        $('.stateerror').hide();
        uievents.synccheckoutH();
    });

    $('.shipping-guestemailaddress .textinput, .shipping-guestconfirmemailaddress .textinput, .shippinglogindetails .username .textinput, .shippinglogindetails .textinputpw, .shipping-emailaddress .textinput, .shipping-confirmemailaddress .textinput, .shipping-password .textinputpw, .shipping-confirmpassword .textinputpw').blur(function () {
        if ($(this).valid() == 0) {
            $(this).closest('.formfield').find('.correctaddress').addClass('error').show();
        } else {
            $(this).closest('.formfield').find('.correctaddress').removeClass('error').show();
        }
    });
    //PREVAIL - init Address Validation
    require('../../addressvalidation').init();
};

exports.updateShippingMethodList = updateShippingMethodList;
exports.updateSummary = updateSummary; //JIRA PREV-99 : shipping methods is not displayed for 2nd address in right nav.
