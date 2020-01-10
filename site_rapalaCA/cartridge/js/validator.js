'use strict';

var regex = {
    phone: {
        gb: /^[+0-9]{10,17}$/,
        default: /^[+0-9]{7,20}$/
    },
    postal: {
        ca: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )3?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
        default: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )3?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i
    },
    notCC: /^(?!(([0-9 -]){13,19})).*$/
};

//Here list of countries where postal code is required
var requiredSettings = {
    postal: {
        us: true,
        ca: true,
        gb: true
    }
};

// global form validator settings
var settings = {
    errorClass: 'errorclient',
    errorElement: 'span',
    focusInvalid: true,
    onkeyup: function (element) {
        if (!this.checkable(element)) {
            $(element).addClass('stopKeypress');
            if ($(element).val().length > 0) {
                this.element(element);
            }
            if ($('.account-logs').length > 0 || $('.new-register').length > 0 || $('.wish-logs').length > 0 || $('.forgot_old').length > 0 || $('.createan-account').length > 0 || $('.promo-sec').length > 0 || $('.headercustomerinfo').length > 0 || $('.ui-login').length > 0 || $('.vipInsider-dlg.ui-dialog ').length > 0 || $('.passwordreset').length > 0) {
                $(element).closest('.formfield').find('.label span').removeClass('inputlabel');
                $('.promo-sec').find('.couponinput').removeClass('inputlabel');
            }
        }
    },
    //focusCleanup: false,
    //onfocusout: false,

    onfocusout: function (element) {
        if (!this.checkable(element)) {
            $(element).removeClass('stopKeypress');
            this.element(element);
            var $selectStyleElement = $(element).parent('.select-style');
            if ($('.account-logs').length > 0 || $('.new-register').length > 0 || $('.wish-logs').length > 0 || $('.forgot_old').length > 0 || $('.passwordreset').length > 0 || $('.vipInsider-dlg.ui-dialog ').length > 0 || $('.promo-sec').length > 0 || $('.pt_checkout').length > 0 || $('.pt_leftnav-addressbook').length > 0 || $('.pt_leftnav-payment').length > 0 || $('.formfields-global').length > 0) {
                if ($(element).hasClass('errorclient')) {
                    $(element).closest('.form-row').addClass('inputlabel');
                    $(element).closest('.formfield').addClass('inputlabel');
                    $(element).closest('.formfield').find('.label span').addClass('inputlabel');
                    $(element).closest('.form-row').find('.label span').addClass('inputlabel');
                    $(element).closest('.formfield').find('.logerror , .existing_register').hide();
                    $selectStyleElement.addClass('select-style-error');
                } else {
                    $(element).closest('.form-row').removeClass('inputlabel');
                    $(element).closest('.formfield').removeClass('inputlabel');
                    $(element).closest('.form-row').find('.label span').removeClass('inputlabel');
                    $(element).closest('.formfield').find('.label span').removeClass('inputlabel');
                    $(element).closest('.formfield').find('.logerror , .existing_register').hide();
                    $selectStyleElement.removeClass('select-style-error');
                }
            }
            /*** if($(element).closest('.ui-dialog').hasClass('vipInsider-dlg')) {
				if($(element).hasClass("errorclient")) {
					if($(element).closest(".formfield").find(".label span.errorclient").is(':visible')){
						$(element).closest(".form-row").addClass("erroroccured");
					}else {
						$(element).closest(".form-row").removeClass("erroroccured");
					}
				}
			} ***/
        }
    },
    errorPlacement: function (error, element) {
        var $selectStyle = $(element).parent('.select-style');

        if ($(element).hasClass('errorclient')) {
            $(element).closest('.form-row').addClass('inputlabel');
            $(element).closest('.formfield').addClass('inputlabel');
            $(element).closest('.formfield').find('.label span').addClass('inputlabel');
            $(element).closest('.form-row').find('.label span').addClass('inputlabel');
            $(element).closest('.formfield').find('.logerror , .existing_register').hide();
            $selectStyle.addClass('select-style-error');
        } else {
            $(element).closest('.form-row').removeClass('inputlabel');
            $(element).closest('.formfield').removeClass('inputlabel');
            $(element).closest('.form-row').find('.label span').removeClass('inputlabel');
            $(element).closest('.formfield').find('.label span').removeClass('inputlabel');
            $(element).closest('.formfield').find('.logerror , .existing_register').hide();
            $selectStyle.removeClass('select-style-error');
        }
        if ($(element).hasClass('emailfooter')) {
            $(element).closest('#emailfooter').before(error);
        } else if ($(element).closest('.ui-dialog').hasClass('vipInsider-dlg')) {
            $(element).closest('.formfield').find('.label').append(error);
            if ($(element).closest('.formfield').find('.label span.errorclient').is(':visible') && !($(element).closest('.formfield').find('.label').hasClass('erroroccured'))) {
                $(element).closest('.formfield').find('.label').addClass('erroroccured');
            } else {
                $(element).closest('.formfield').find('.label').removeClass('erroroccured');
            }
        } else {

            if ($('.passwordreset').find('button.send.clickedButton').length > 0) {
                $(element).after(error);
                $('.passwordreset').find('button.send.clickedButton').removeClass('clickedButton');
            } else {
                if ($('.header-forgot-pwd.accountcontent').css('display') == 'none') {
                    if ($(element).hasClass('input-select')) {
                        error.insertAfter($(element).parent('.select-style'));
                    } else {
                        $(element).after(error);
                    }
                } else if ($('.header-forgot-pwd.accountcontent').css('display') == 'block') {
                    // Do Nothing
                } else {
                    if ($(element).hasClass('custom-select-wrap')) {
                        $(element).closest('.field-wrapper').after(error);
                    } else if ($selectStyle.length) {
                        $selectStyle.after(error);
                    } else {
                        if ($(element).hasClass('checkinput')) {
                            $(element).parent('.field-wrapper').append(error);
                        } else {
                            $(element).after(error);
                        }
                    }
                }
            }
        }
    }
};

//firstname validation
var ctrl = false;
var selectText = false;
$('input[attributemaxlength],textarea[attributemaxlength]').on('keydown', function (e) {
    //var j;
    if ($(this).hasClass('firstname')) {
        //j = document.getElementById('dwfrm_profile_customer_firstname');
    } else if ($(this).hasClass('lastname')) {
        //j = document.getElementById('dwfrm_profile_customer_lastname');
    }
    if (e.keyCode == 17) {
        ctrl = true;
    }

    if (($(this).hasClass('vip-textarea') && e.keyCode != 8 && e.keyCode != 46 && !selectText) || (((e.keyCode >= 48 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105)) && !ctrl && !selectText)) {
        var currObj = $(this);
        var maxchars = $(this).attr('maxlength');
        var tlength = $(this).val().length;
        if (tlength >= maxchars) {
            $(this).val($(this).val().substring(0, maxchars));
            if ($(currObj).closest('.field-wrapper').find('.max-length-error').length == 0 && $(currObj).closest('.formfield').find('.max-length-error').length == 0) {
                var error = '<div class=\'max-length-error\'> This field is limited to 30 characters.</div>';
                if ($(currObj).hasClass('vip-textarea')) {
                    error = '<div class=\'max-length-error\'> -This field is limited to 1200 characters.</div>';
                }
                if ($(currObj).hasClass('vip-textarea1')) {
                    error = '<div class=\'max-length-error\'> -This field is limited to 30 characters.</div>';
                } else if ($(currObj).closest('form').hasClass('vipfieldstaff')) {
                    error = '<div class=\'max-length-error\'> -This field is limited to 30 characters.</div>';
                }

                if ($(this).closest('form').hasClass('vipfieldstaff') > 0) {
                    $(this).closest('.formfield').find('.label').append(error);
                } else {
                    $(this).closest('.field-wrapper').append(error);
                }

                $(this).closest('.formfield').find('.label span').addClass('countlabelerror');
                $(this).addClass('counterror');
            } else if (e.keyCode != 9) {
                if ($(this).closest('form').hasClass('vipfieldstaff') > 0) {
                    $(this).closest('.formfield').find('.label').find('.max-length-error').removeClass('hide');
                } else {
                    $(this).closest('.field-wrapper').find('.max-length-error').removeClass('hide');
                }
                $(this).addClass('counterror');
                $(this).closest('.formfield').find('.label span').addClass('countlabelerror');
                return false;
            }
        } else {
            $(this).removeClass('counterror');
            $('.max-length-error').remove();
            $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
        }
    } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
        if ($(this).hasClass('vipinsideremail')) {
            return true;
        } else {
            return false;
        }
    } else {
        $(this).closest('.formfield').find('.max-length-error').remove();
        $(this).removeClass('counterror');
        $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
        selectText = false;
    }

}).on('keyup', function () {
    ctrl = false;
    //var currObj = $(this);
    var maxchars = $(this).attr('maxlength');
    var tlength = $(this).val().length;
    if (tlength < maxchars) {
        $(this).removeClass('counterror');
        $('.max-length-error').remove();
        $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
    }
}).on('select', function () {
    selectText = true;
    $(this).removeClass('counterror');
    $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
});
$('input[attributemaxlength],textarea[attributemaxlength]').on('focusout', function () {
    $(this).removeClass('counterror');
    $(this).closest('.formfield').find('.label span').removeClass('countlabelerror');
    $(this).closest('.field-wrapper').find('.max-length-error').remove();
    $(this).closest('.formfield').find('.max-length-error').remove();
    //$(this).closest('.formfield').find('.label span').removeClass('inputlabel');
});
if ($('.loginfailedclass:visible').length > 0) {
    $('.registration .formfield_email').find('.labeltext').removeClass('inputlabel');
    $('.registration .formfield_email').find('.requiredindicator').removeClass('inputlabel');
    $('.registration .formfield_email').find('.requiredindicator').removeClass('inputlabel');
    $('.registration .formfield_email').find('.existing_register').hide();
}

//$("body").on('change input',".accountemail , .guestemail, .emailCMrapala, .guestemailcon, .vipinsideremail, .emailfooter, .accountemailconf, .accountEmailConfirmation, .resetemail, .accemailcon, .loggedemail", function (e) {
//	//$(this).val(this.value.replace(/[\s]/g, ''));
//
//});
$('.accountemail , .guestemail, .emailCMrapala, .guestemailcon, .vipinsideremail, .emailfooter, .accountemailconf, .accountEmailConfirmation, .resetemail, .accemailcon, .loggedemail').on({
    keydown: function (e) {
        if (e.which === 32) {
            return false;
        }
    },
    change: function () {
        this.value = this.value.replace(/\s/g, '');
    }
});
//override default required field message
$.validator.messages.required = function ($1, ele) {
    var requiredText = $(ele).closest('.form-row').attr(
        'data-required-text');
    return requiredText || '';
};

/**
 * @function
 * @description Validates a given postal code against the countries phone regex
 * @param {String} value The postal code which will be validated
 * @param {String} el The input field
 */
var validatePostal = function(value, el) {
    var country = $(el).closest('form').find('.country');
    if (country.length === 0 || country.val().length === 0 || !regex.postal[country.val().toLowerCase()]) {
        if (!regex.postal[country.val().toLowerCase()]) {
            var rgxDefault = regex.postal.default;
            var isOptionalDefault = this.optional(el);
            var isValidDefault = rgxDefault.test($.trim(value));
            return isOptionalDefault || isValidDefault;
        }
        return true;
    }

    var postalRequired = false;
    if ($.trim(value).length === 0) {
        postalRequired = requiredSettings.postal[country.val().toLowerCase()];

        if (postalRequired) {
            return false;
        }
    }
    var rgx = regex.postal[country.val().toLowerCase()];
    var isOptional = this.optional(el);
    var isValid = rgx.test($.trim(value));

    return isOptional || isValid;
};

/**
 * @function
 * @description Validates a given phone number against the countries phone regex
 * @param {String} value The phone number which will be validated
 * @param {String} el The input field
 */
var validatePhone = function (value, el) {
    var country = $(el).closest('form').find('.country');
    if (country.length === 0 || country.val().length === 0 || !regex.phone[country.val().toLowerCase()]) {
        if (country.val() == null || !regex.phone[country.val().toLowerCase()]) {
            var rgxDefault = regex.phone.default;
            var isOptionalDefault = this.optional(el);
            var isValidDefault = rgxDefault.test($.trim(value));
            return isOptionalDefault || isValidDefault;
        }
        return true;
    }

    var rgx = regex.phone[country.val().toLowerCase()];
    var isOptional = this.optional(el);
    var isValid = rgx.test($.trim(value));

    return isOptional || isValid;
};

/**
 * Add phone validation method to jQuery validation plugin.
 * Text fields must have 'phone' css class to be validated as phone
 */
$.validator.addMethod('phone', validatePhone, Resources.INVALID_PHONE);

/**
 * Add postal validation method to jQuery validation plugin.
 * Text fields must have 'postal' css class to be validated as postal
 */
$.validator.addMethod('postal', validatePostal, Resources.INVALID_ZIP);

$.validator.addMethod('zipCodeCustom', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        if (value == '') {
            return true;
        }
        return (/^(\d{5}(-\d{4})?|[A-Z]\d[A-Z] ?\d[A-Z]\d)$/).test(value);
    }
}, '- Please enter a valid ZipCode');

$.validator.addMethod('phoneCustom', function (phoneNumber, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        phoneNumber = phoneNumber.replace(/\s+/g, '');
        return this.optional(element) || phoneNumber.length > 9 && phoneNumber
            .match(/^\(?[\d]{3}\)?[\s-]?[\d]{3}[\s-]?[\d]{4}$/);
    }
}, '- Please specify a valid phone number');

$.validator.addMethod('emailCM', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        if (value == '') {
            return true;
        }
        return (/^[\w-\.]{1,}\@([\da-zA-Z-]{1,}\.){1,}[\da-zA-Z-]{2,4}$/).test(value);
    }
}, 'Please specify a valid Email Id');

var customErrormsg = '';
var customError = function () {
    return customErrormsg;
};

$.validator.addMethod('emailCMrapala', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = '-Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else {
            return true;
        }
    }
}, customError);

$.validator.addMethod('creditcard_name', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        if (value == '') {
            return true;
        }
        return (/^[a-zA-Z ]+$/).test(value);
    }
}, 'Only letters are valid for this field');

$.validator.addMethod('creditcard_cvn', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {

        var cardtype = $('.select-creditCard-type').val();
        var cvvLength = 3;
        if (value == '') {
            return true;
        }
        if (cardtype == 'Amex') {
            cvvLength = 4;
        }
        if ((value.length != cvvLength)) {
            $('.errorKeypress').remove();
            return false;
        } else {
            return true;
        }
    }
}, 'Please enter a valid Security Code for the Credit Card entered');

$.validator.addMethod('guestemailcon', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if (!$('.checkoutasguestbutton').is(':visible')) {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        var emailVal = $(element).closest('.formfield').prev('.formfield').find('.guestemail').val();
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else if (emailVal != value) {
            customErrormsg = 'Please make sure emails match.';
            return false;
        } else {
            return true;
        }

    }
}, customError);

$.validator.addMethod('guestemail', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if (!$('.checkoutasguestbutton').is(':visible')) {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }

        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else {
            return true;
        }

    }
}, customError);

$.validator.addMethod('loggedemail', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if (!$('.signintomyaccountbutton').is(':visible')) {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        //var emailVal = $(element).closest('.formfield').prev('.formfield').find('.guestemail').val();
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else {
            return true;
        }

    }
}, customError);

$.validator.addMethod('accemailcon', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if (!$('.createanaccountbutton').is(':visible')) {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        var emailVal = $(element).closest('.formfield').prev('.formfield').find('.accemail').val();
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else if (emailVal != value) {
            customErrormsg = 'Please make sure emails match.';
            return false;
        } else {
            return true;
        }
    }
}, customError);

$.validator.addMethod('a-zA-Z0-9', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if (!$('.createanaccountbutton').is(':visible')) {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }

        var fcharS = (/^[a-zA-Z]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        //var emailVal = $(element).closest('.formfield').prev('.formfield').find('.email').val();

        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else {
            return true;
        }
    }
}, customError);

$.validator.addMethod('cm_password', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if (!$('.createanaccountbutton').is(':visible') && $(element).hasClass('required')) {
        var passwordVal = $('.c_password').val();
        if ($(element).closest('form').length > 0 && $(element).closest('form').attr('id') == 'RegistrationForm') {
            passwordVal = $(element).closest('form').find('.c_password').val();
        }

        if (value.length < 8) {
            customErrormsg = Resources.PASSWORD_VALIDATION_ERROR;
            return false;
        } else if (passwordVal != value) {
            customErrormsg = 'Oops - your passwords do not match.';
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}, customError);

$.validator.addMethod('confirm_password', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if ($(element).hasClass('required')) {
        var passwordVal = $(element).closest('form').find('.c_password').val();
        if (value.length < 8) {
            customErrormsg = Resources.PASSWORD_VALIDATION_ERROR;
            return false;
        } else if (passwordVal != value) {
            customErrormsg = 'Oops - your passwords do not match.';
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}, customError);

$.validator.addMethod('c_password', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if ($(element).hasClass('required') && (value.length < 8)) {
        customErrormsg = Resources.PASSWORD_VALIDATION_ERROR;
        return false;
    } else {
        return true;
    }
}, customError);

$.validator.addMethod('login_password', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else if ($(element).hasClass('required') && (value.length < 8)) {
        customErrormsg = Resources.PASSWORD_VALIDATION_ERROR;
        return false;
    } else {
        return true;
    }
}, customError);

$.validator.addMethod('resetemail', function (value, element) {
    var vIndex = value.length;
    var fchar = value.substring(0, 1);
    var lchar = value.substring(vIndex - 1);

    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';

            return false;
        } else {
            return true;
        }
    }
}, customError);

$.validator.addMethod('accountemail', function (value, element) {
    var vIndex = value.length;
    var fchar = value.substring(0, 1);
    var lchar = value.substring(vIndex - 1);
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else {
            return true;
        }
    }

}, customError);

//email validation for vipinsider

$.validator.addMethod('vipinsideremail', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = '-Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else {
            return true;
        }
    }
}, customError);

$.validator.addMethod('emailfooter', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        var vIndex = value.length;
        if (vIndex > 0) {
            var fchar = value.substring(0, 1);
            var lchar = value.substring(vIndex - 1);
            if (value.indexOf('@') != -1) {
                var splitval = value.split('@');
                fchar = splitval[0].substring(0, 1);
                lchar = splitval[0].substring(splitval[0].length - 1);
            }
            var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
            var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
            var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
            if ((fcharS == false) || (lcharS == false)) {
                customErrormsg = 'Something doesn\'t look right, please try again.';
                return false;
            } else if (emailCheck == false) {
                customErrormsg = 'Oops - the email entered is not in a valid format.';
                return false;
            } else {
                return true;
            }
        } else {
            customErrormsg = 'Please enter your email address.';

        }
    }
}, customError);

$.validator.addMethod('accountemailconf', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        var emailVal = $('.accountemail').val();
        if ($(element).closest('form').length > 0 && $(element).closest('form').attr('id') == 'RegistrationForm') {
            emailVal = $(element).closest('form').find('.accountemail').val();
        }
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else if (emailVal != value) {
            customErrormsg = 'Please make sure emails match.';
            return false;
        } else {
            return true;
        }
    }
}, customError);

$.validator.addMethod('accountEmailConfirmation', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        var vIndex = value.length;
        var fchar = value.substring(0, 1);
        var lchar = value.substring(vIndex - 1);
        if (value.indexOf('@') != -1) {
            var splitval = value.split('@');
            fchar = splitval[0].substring(0, 1);
            lchar = splitval[0].substring(splitval[0].length - 1);
        }
        var fcharS = (/^[a-zA-Z0-9]$/).test(fchar);
        var lcharS = (/^[a-zA-Z0-9]$/).test(lchar);
        var emailCheck = (/^[-0-9a-zA-Z.-_]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value);
        var emailVal = $(element).closest('form').find('.accountemail').val();
        if ((fcharS == false) || (lcharS == false)) {
            customErrormsg = 'Something doesn\'t look right, please try again.';
            return false;
        } else if (emailCheck == false) {
            customErrormsg = 'Oops - the email entered is not in a valid format.';
            return false;
        } else if (emailVal != value) {
            customErrormsg = 'Please make sure emails match.';
            return false;
        } else {
            return true;
        }
    }
}, customError);
/**
 * Add positive number validation method to $ validation
 * plugin. Text fields must have 'positivenumber' css class to be
 * validated as positivenumber it validates a number and throws
 * error if it is below 0 or if it is not a number.
 */
$.validator.addMethod('positivenumber', function (value,
                                                  element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        if (value == '') {
            return true;
        }
        return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(value) && Number(value) >= 0;
    }
}, ''); // "" should be replaced with error message if needed

$.validator.addMethod('monthselect', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        var d = new Date(),
            mth = d.getMonth() + 1,
            yy = d.getFullYear();
        var selectedMth = $('.custom-select select[id$=\'_expiration_month\']').val();

        var selectedyear = $('.custom-select select[id$=\'_expiration_year\']').val();

        if (selectedyear) {
            selectedyear = selectedyear.replace(',', '');
            if ((selectedyear <= yy) && (selectedMth < mth)) {
                return false;
            } else {
                return true;
            }
        }
    }
}, '');

$.validator.addMethod('yearselect', function (value, element) {
    if ($(element).hasClass('stopKeypress')) {
        return true;
    } else {
        var d = new Date(),
            mth = d.getMonth() + 1,
            yy = d.getFullYear();
        var selectedMth = $('.custom-select select[id$=\'_expiration_month\']').val();

        var selectedyear = $('.custom-select select[id$=\'_expiration_year\']').val();

        if (selectedyear) {
            selectedyear = selectedyear.replace(',', '');
            if ((selectedyear <= yy) && (selectedMth < mth)) {
                return false;
            } else {
                return true;
            }
        }
    }
}, '');

// register form validator for form elements
// except for those which are marked "suppress"
$.each($('form:not(.suppress)'), function () {
    $(this).validate(settings);
});
/**
 * @function
 * @description Validates a given phone number against the countries phone regex
 * @param {String} value The phone number which will be validated
 * @param {String} el The input field
 */
/*var validatePhone = function (value, el) {
    var country = $(el).closest('form').find('.country');
    if (country.length === 0 || country.val().length === 0 || !regex.phone[country.val().toLowerCase()]) {
        return true;
    }

    var rgx = regex.phone[country.val().toLowerCase()];
    var isOptional = this.optional(el);
    var isValid = rgx.test($.trim(value));

    return isOptional || isValid;
};*/

/**
 * @function
 * @description Validates that a credit card owner is not a Credit card number
 * @param {String} value The owner field which will be validated
 * @param {String} el The input field
 */
/*var validateOwner = function (value) {
    var isValid = regex.notCC.test($.trim(value));
    return isValid;
};
*/
/**
 * Add phone validation method to $ validation plugin.
 * Text fields must have 'phone' css class to be validated as phone
 */
/*$.validator.addMethod('phone', validatePhone, Resources.INVALID_PHONE);*/

/**
 * Add CCOwner validation method to $ validation plugin.
 * Text fields must have 'owner' css class to be validated as not a credit card
 */
/*$.validator.addMethod('owner', validateOwner, Resources.INVALID_OWNER);*/

/**
 * Add gift cert amount validation method to $ validation plugin.
 * Text fields must have 'gift-cert-amont' css class to be validated
 */
$.validator.addMethod('gift-cert-amount', function (value, el) {
    var isOptional = this.optional(el);
    var isValid = (!isNaN(value)) && (parseFloat(value) >= 5) && (parseFloat(value) <= 5000);
    return isOptional || isValid;
}, Resources.GIFT_CERT_AMOUNT_INVALID);

/**
 * Add positive number validation method to $ validation plugin.
 * Text fields must have 'positivenumber' css class to be validated as positivenumber
 */
/*$.validator.addMethod('positivenumber', function (value) {
    if ($.trim(value).length === 0) { return true; }
    return (!isNaN(value) && Number(value) >= 0);
}, ''); // '' should be replaced with error message if needed
*/
/*Start JIRA PREV-77 : Zip code validation is not happening with respect to the State/Country.*/
/*function validateZip(value, el) {
    var country = $(el).closest('form').find('.country');
    if (country.length === 0 || country.val().length === 0 || !regex.postal[country.val().toLowerCase()]) {
        return true;
    }
    var isOptional = this.optional(el);
    var isValid = regex.postal[country.val().toLowerCase()].test($.trim(value));
    return isOptional || isValid;
}
$.validator.addMethod('postal', validateZip, Resources.INVALID_ZIP);*/
/*End JIRA PREV-77*/

$.extend($.validator.messages, {
    //required: Resources.VALIDATE_REQUIRED,
    remote: Resources.VALIDATE_REMOTE,
    email: Resources.VALIDATE_EMAIL,
    url: Resources.VALIDATE_URL,
    date: Resources.VALIDATE_DATE,
    dateISO: Resources.VALIDATE_DATEISO,
    number: Resources.VALIDATE_NUMBER,
    digits: Resources.VALIDATE_DIGITS,
    creditcard: Resources.VALIDATE_CREDITCARD,
    equalTo: Resources.VALIDATE_EQUALTO,
    maxlength: $.validator.format(Resources.VALIDATE_MAXLENGTH),
    minlength: $.validator.format(Resources.VALIDATE_MINLENGTH),
    rangelength: $.validator.format(Resources.VALIDATE_RANGELENGTH),
    range: $.validator.format(Resources.VALIDATE_RANGE),
    max: $.validator.format(Resources.VALIDATE_MAX),
    min: $.validator.format(Resources.VALIDATE_MIN)
});

var validator = {
    regex: regex,
    settings: settings,
    init: function () {
        var self = this;
        $('form:not(.suppress)').each(function () {
            $(this).validate(self.settings);
        });
    },
    initForm: function (f) {
        $(f).validate(this.settings);
    },
    phoneValidation: function () {
        // phone validation
        var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
        var isExplorer = navigator.userAgent.indexOf('MSIE') > -1;
        if (isFirefox || isExplorer) {
            $('input[name$=\'phone\']').bind('keyup keydown', function (e) {
                if (e.shiftKey || e.ctrlKey || e.altKey) {
                    e.preventDefault();
                } else {
                    var key = e.keyCode;
                    if (!((key == 8) || (key == 9) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
                        e.preventDefault();
                    }
                }
                //var curchr = $(this).val().length;
                var curval = $(this).val();

                var curval1 = curval.replace(/[A-Za-z` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                var str1 = curval1.substring(0, 3);
                var str2 = curval1.substring(3, 6);
                var str3 = curval1.substring(6, 10);

                if (curval.indexOf('(') == -1 && curval.indexOf(')') == -1 && curval1.length == 3) {
                    $(this).val('(' + str1 + ') ');
                } else if (curval.indexOf('(') != -1 && curval.indexOf(')') == -1 && curval1.length == 4) {
                    $(this).val('(' + str1 + ') ' + str2);
                } else if (curval.indexOf('(') != -1 && curval.indexOf(')') != -1 && curval.indexOf(' ') == -1 && curval1.length == 6) {
                    $(this).val('(' + str1 + ') ' + str2);
                } else if (curval.indexOf('(') != -1 && curval.indexOf(')') != -1 && curval.indexOf(' ') != -1 && curval.indexOf('-') == -1 && curval1.length > 6) {
                    $(this).val('(' + str1 + ') ' + str2 + '-' + str3);
                }
                if (curval.length == 0) {
                    $(this).val('');
                }
            });
        } else {
            $('body').on('change input keyup', 'input[name$=\'phone\']', function (e) {
                //var curchr = $(this).val().length;
                $(this).val(this.value.replace(/[^\d]/g, ''));
                var curval = $(this).val();

                var curval1 = curval;
                var str1 = curval1.substring(0, 3);
                var str2 = curval1.substring(3, 6);
                var str3 = curval1.substring(6, 10);
                var key = event.which || event.keyCode || event.charCode;

                if (key == 8 || e.shiftKey || e.ctrlKey || e.altKey) {
                    e.preventDefault();
                    if (curval1.length == 4 || curval1.length == 5 || curval1.length == 6) {
                        $(this).val('(' + str1 + ') ' + str2);
                    } else if (curval1.length > 6) {
                        $(this).val('(' + str1 + ') ' + str2 + '-' + str3);
                    }
                } else {
                    if (curval1.length == 3) {
                        $(this).val('(' + str1 + ') ');
                    } else if (curval1.length == 4 || curval1.length == 5 || curval1.length == 6) {
                        $(this).val('(' + str1 + ') ' + str2);
                    } else if (curval1.length > 6) {
                        $(this).val('(' + str1 + ') ' + str2 + '-' + str3);
                    }
                    if (curval.length == 0) {
                        $(this).val('');
                    }
                }
            });
        }

        /* $("input[name$='phone']").on('blur', function (e) {
             $(this).val(this.value.replace(/[A-Za-z` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''));
                 var curval = $(this).val();
                 var str1 = curval.substring(0, 3);
                 var str2 = curval.substring(3, 6);
                 var str3 = curval.substring(6, 10);
                 if(curval.length <= 3 && curval.length > 0){
                     $(this).val( "(" + str1 + ") ");
                 }
                 else  if(curval.length <= 6 && curval.length > 3){
                     $(this).val( "(" + str1 + ") " + str2 );
                 }
                 else  if(curval.length <= 10 && curval.length > 6){
                     $(this).val( "(" + str1 + ") " + str2 + "-" + str3);
                 }
         });*/

    },
    zipFormatter: function () {
        $('body').on('change input', 'input[name$=\'postal\'], input[name$=\'zip\']', function () {
            $(this).val(this.value.replace(/[^\d]/g, ''));
            var curval = $(this).val();
            if (curval.length > 5) {
                $(this).val(curval.substring(0, 5) + ' ' + curval.substring(5, 9));
            }
        });
    }
};

module.exports = validator;
