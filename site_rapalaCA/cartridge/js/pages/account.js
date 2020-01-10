'use strict';

var giftcert = require('../giftcert'),
    tooltip = require('../tooltip'),
    util = require('../util'),
    dialog = require('../dialog'),
    page = require('../page'),
    validator = require('../validator'),
    adyenCse = require('./checkout/adyen-cse');

/**
 * @function
 * @description Initializes the events on the address form (apply, cancel, delete)
 * @param {Element} form The form which will be initialized
 */
function initializeAddressForm() {
    var $form = $('#edit-address-form');

    $form.find('input[name="format"]').remove();
    tooltip.init();
    //$("<input/>").attr({type:"hidden", name:"format", value:"ajax"}).appendTo(form);

    $form.on('click', '.apply-button', function (e) {
        e.preventDefault();
        if (!$form.valid()) {
            $('body .input-select.errorclient').parent('.select-style').addClass('select-style-error');
            return false;
        }
        var url = util.appendParamToURL($form.attr('action'), 'format', 'ajax');
        var applyName = $form.find('.apply-button').attr('name');
        var options = {
            url: url,
            data: $form.serialize() + '&' + applyName + '=x',
            type: 'POST'
        };
        $.ajax(options).done(function (data) {
            if (typeof(data) !== 'string') {
                if (data.success) {
                    dialog.close();
                    page.refresh();
                } else {
                    window.alert(data.message);
                    return false;
                }
            } else {
                $('#dialog-container').html(data);
                account.init();
                tooltip.init();
            }
        });
    })
        .on('click', '.cancel-button, .close-button', function (e) {
            e.preventDefault();
            dialog.close();
        })
        .on('click', '.delete-button', function (e) {
            e.preventDefault();
            if (window.confirm(String.format(Resources.CONFIRM_DELETE, Resources.TITLE_ADDRESS))) {
                var url = util.appendParamsToUrl(Urls.deleteAddress, {
                    AddressID: $form.find('#addressid').val(),
                    format: 'ajax'
                });
                $.ajax({
                    url: url,
                    method: 'POST',
                    dataType: 'json'
                }).done(function (data) {
                    if (data.status.toLowerCase() === 'ok') {
                        dialog.close();
                        page.refresh();
                    } else if (data.message.length > 0) {
                        window.alert(data.message);
                        return false;
                    } else {
                        dialog.close();
                        page.refresh();
                    }
                });
            }
        });
    if ($('.logerror:visible').length > 0) {
        $('.account-logs .returningcustomers').find('.accountemail').addClass('errorclient');
        $('.account-logs .logincustomers .login_password').addClass('errorclient');
        //$(".pt_account .wrapper .account-section .returningcustomers .value ").css("margin-bottom", "0");
    }
    $('.registration-button').on('click', function () {
        var maskheight = $('.createan-account .formsubmit').parent('div').outerHeight();
        var realForm = jQuery(this).closest('form');
        if (!realForm.valid()) {
            $(this).closest('.form-row').addClass('inputlabel');
            realForm.find('.max-length-error').each(function () {
                if ($(this).closest('.value').find('input').val().length > 0) {
                    realForm.find('.max-length-error').remove();
                }
            });
            return false;
        } else {
            $('.registration-button span.loadImage').css('display', 'block');
            $('.createan-account .formsubmit').css({'height': maskheight + 'px', 'display': 'block'});

        }
    });
    if ($('.existing_register:visible').length > 0) {
        $('.createan-account .registration').find('.accountemail').addClass('errorclient');
        $('.createan-account .registration').find('.formfield_email').find('.labeltext').addClass('inputlabel');
        $('.createan-account .registration').find('.formfield_email').find('.requiredindicator').addClass('inputlabel');
        if ($('.registration').find('input.required').val().length > 0) {
            $('.registration').find('.clearbutton').show();
        }
    }
    if ($('.account-email.err.log_error:visible').length > 0) {
        $('.returningcustomers').find('.formfield_email').find('.labeltext').addClass('inputlabel');
        $('.returningcustomers').find('.formfield_email').find('.requiredindicator').addClass('inputlabel');
    }
    $('.signinbtn').on('click', function () {
        var maskheight = $('.account-logs .formsubmit').parent('div').outerHeight();
        var maskheightwishlist = $('.wish-logs .formsubmit').parent('div').outerHeight();
        var realForm = jQuery(this).closest('form');
        if (!realForm.valid()) {
            return false;
        } else {
            //$(this).closest('.formactions').addClass('loadImage');
            $('.signinbtn span.loadImage').css('display', 'block');
            $('.account-logs .formsubmit').css({'height': maskheight + 'px', 'display': 'block'});
            $(this).closest('.wish-logs').find('.formsubmit').css({
                'height': maskheightwishlist + 'px',
                'display': 'block'
            });
        }
    });
    if ($('.ui-login .header-forgot-pwd').length > 0) {
        $(this).find('input.required').bind('keydown keyup focusin focusout keypress', function () {
            //e.stopPropagation();
            $(this).closest('.value').find('errorclient').remove();

        });
        $('.ui-login header-forgot-pwd').find('input.required').bind('focusin', function () {
            $(this).closest('.value').find('errorclient').remove();
        });
    }
    $('.sample-section').on('click', function () {
        if (!$(this).find('.sample_mail_main').is(':visible')) {
            $(this).find('.sample_mail_main').slideDown(500);
        }
    });
    validator.init();
    $('body').find('input').on('focusin', function () {
        $(this).closest('.formfield, .form-row').removeClass('inputlabel');
        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
        $(this).removeClass('errorclient');
    });
    $('body').find('select').on('focusin', function () {
        $(this).closest('.formfield, .form-row').removeClass('inputlabel');
        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
        $(this).removeClass('errorclient');
        $(this).parent('.select-style').removeClass('select-style-error');
    });
}

/**
 * @private
 * @function
 * @description Toggles the list of Orders
 */
function toggleFullOrder() {
    $('.order-items')
        .find('li.hidden:first')
        .prev('li')
        .append('<a class="toggle">View All</a>')
        .children('.toggle')
        .on('click', function () {
            $(this).parent().siblings('li.hidden').show();
            $(this).remove();
        });
}

/**
 * @private
 * @function
 * @description Binds the events on the address form (edit, create, delete)
 */
function initAddressEvents() {
    var addresses = $('#addresses');
    if (addresses.length === 0) {
        return;
    }

    addresses.on('click', '.address-edit, .address-create', function (e) {
        e.preventDefault();
        dialog.open({
            url: this.href,
            options: {
                dialogClass: 'addressadd',
                open: function () {
                    initializeAddressForm();
                }
            }
        });
    }).on('click', '.delete', function (e) {
        e.preventDefault();
        if (window.confirm(String.format(Resources.CONFIRM_DELETE, Resources.TITLE_ADDRESS))) {
            $.ajax({
                url: util.appendParamToURL($(this).attr('href'), 'format', 'ajax'),
                dataType: 'json'
            }).done(function (data) {
                if (data.status.toLowerCase() === 'ok') {
                    page.redirect(Urls.addressesList);
                } else if (data.message.length > 0) {
                    window.alert(data.message);
                } else {
                    page.refresh();
                }
            });
        }
    });
}

/**
 * @private
 * @function
 * @description Binds the events of the payment methods list (delete card)
 */
function initPaymentEvents() {
    /*
    $('.add-card').on('click', function (e) {
        e.preventDefault();
        dialog.open({
            //PREVAIL-Added  to handle validation issues
            url: $(e.target).attr('href'),
            options: {
                dialogClass: 'payment-settings',
                open: initializePaymentForm
            }
        });
    });
    */

    if (SitePreferences.ADYEN_CSE_ENABLED) {
        adyenCse.initAccount();
    }

    var paymentList = $('.payment-list');
    if (paymentList.length === 0) {
        return;
    }

    util.setDeleteConfirmation(paymentList, String.format(Resources.CONFIRM_DELETE, Resources.TITLE_CREDITCARD));

    $('form[name="payment-remove"]').on('submit', function (e) {
        e.preventDefault();
        // override form submission in order to prevent refresh issues
        var button = $(this).find('.delete');
        $('<input/>').attr({
            type: 'hidden',
            name: button.attr('name'),
            value: button.attr('value') || 'delete card'
        }).appendTo($(this));
        var data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: data
        })
            .done(function () {
                page.redirect(Urls.paymentsList);
            });
    });
}

/*
function initializePaymentForm() {

    $('#CreditCardForm').on('click', '.cancel-button', function (e) {
        e.preventDefault();
        dialog.close();
    });
    if (SitePreferences.ADYEN_CSE_ENABLED) {
        adyenCse.initAccount();
    }

}
*/
/**
 * @private
 * @function
 * @description init events for the loginPage
 */
function initLoginPage() {
    //o-auth binding for which icon is clicked
    $('.oAuthIcon').bind('click', function () {
        $('#OAuthProvider').val(this.id);
    });

    //toggle the value of the rememberme checkbox
    $('#dwfrm_login_rememberme').bind('change', function () {
        if ($('#dwfrm_login_rememberme').attr('checked')) {
            $('#rememberme').val('true');
        } else {
            $('#rememberme').val('false');
        }
    });
}

/**
 * @private
 * @function
 * @description Binds the events of the order, address and payment pages
 */
function initializeEvents() {
    initializeAddressForm(); // JIRA PREV-63: 'Add Address' or 'Edit address' overlay changing to page after click on Apply button,when there is an error message on overlay.
    toggleFullOrder();
    initAddressEvents();
    initPaymentEvents();
    initLoginPage();
    if ($('.server-error').length > 0) {
        $(window).scrollTop($('.server-error').offset().top);
    }
    $('body').on('change input', '.desktop-accesscode', function () {
        var curValue = $(this).val();
        $('body').find('.mobile-accesscode').val(curValue);
        $('body').find('.mobile-accesscode').attr('value', curValue);
    });
    $('body').on('change input', '.mobile-accesscode', function () {
        var curValue = $(this).val();
        $('body').find('.desktop-accesscode').val(curValue);
        $('body').find('.desktop-accesscode').attr('value', curValue);
    });
}

var account = {
    init: function () {
        initializeEvents();
        giftcert.init();
    },
    initCartLogin: function () {
        initLoginPage();
    }
};

module.exports = account;
