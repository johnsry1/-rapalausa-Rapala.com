'use strict';

var ajax = require('../../ajax'),
    //formPrepare = require('./formPrepare'),
    uievents = require('../../uievents'),
    tooltip = require('../../tooltip'),
    progress = require('../../progress'),
    validator = require('../../validator'),
    //giftcard = require('../../giftcard'),
    util = require('../../util'),
    adyenCse = require('./adyen-cse');

/**
 * @function
 * @description updates the order summary based on a possibly recalculated basket after a shipping promotion has been applied
 */
var flageallotmentcover = $('input.flageallotmentcover').val();
var allotmentAmount = parseInt($('input.allotmentAmount').val(), 10);
var couponMenthods = {
    showPromoCode: false,
    updateSummary: function () {
        var $summary = $('#secondary .new-summery-cart');
        // indicate progress
        progress.show($summary);
        var stateValue = $('body').find('.shipping-state').val();
        var url = util.appendParamToURL(Urls.summaryRefreshURL, 'selectedState', stateValue);
        // load the updated summary area
        $summary.load(url, function () {
            // hide edit shipping method link
            $summary.fadeIn('fast');
            $summary.find('.checkout-mini-cart .minishipment .header a').hide();
            $summary.find('.order-totals-table .order-shipping .label a').hide();
            uievents.synccheckoutH();
        });
    },
    updatecartsummary: function () {
        var url = util.appendParamToURL(Urls.UpdateCartSummary);
        // load the updated cart summary area
        jQuery.ajax({
            url: url,
            dataType: 'html',
            success: function (data) {
                jQuery('.ajax-cartsummary').html(data);
                uievents.synccheckoutH();
            }
        });
    },
    setCouponRedemptionInfo: function (redemption) {
        if (!redemption) {
            return;
        }
        //var redeemMsg = "${Resource.msg('billing.couponnotapplied','checkout',null)}";
        //if(redemption.applied) redeemMsg = "${Resource.msg('billing.couponapplied','checkout',null)}";
        //jQuery("${'#'}couponentry .redemption").append("<div class=\"discount-success\">${Resource.msg('billing.couponlabel','checkout',null)} <span class=\"submitedcoupon\">" + redemption.couponCode + "</span> " + redeemMsg + "<button  value="+redemption.couponCode+" class='removecoupon'>Remove</button></div>");
        var url = util.appendParamToURL(Urls.SuccessDisplayCoupon);
        jQuery.get(url, function (data) {
            jQuery('#couponentry .redemption').html(data);
            uievents.synccheckoutH();
        });
    },
    setCouponError: function (msg) {
        var $couponcode = jQuery('input[name$=\'_billing_couponCode\']').closest('.couponcode');
        if (!msg) {
            jQuery('#couponentry span.error').remove();
            return;
        }
        if ($couponcode.find('span.error').length == 0) {
            $('input[name$=\'_billing_couponCode\']').closest('.couponcode').append('<span class=\'error\'><\/span>');
        }
        $couponcode.find('span.error').html(msg);
        jQuery('input[name$=\'_billing_couponCode\']').addClass('errorclient');
    },
    setGiftCertError: function (msg) {
        var $redeemcode = jQuery('input[name$=\'_billing_giftCertCode\']').closest('.giftcertfields');
        if (!msg) {
            jQuery('.giftcertfields .error').remove();
            jQuery('input[name$=\'_billing_couponCode\']').removeClass('errorclient');
            return;
        }
        if ($redeemcode.find('span.error').length == 0) {
            jQuery('input[name$=\'_billing_giftCertCode\']').closest('.giftcertfields').append('<span class=\'error\'><\/span>');
        }
        $redeemcode.find('span.error').html(msg);
        jQuery('input[name$=\'_billing_giftCertCode\']').addClass('errorclient');
        //jQuery("input[name=${pdict.CurrentForms.billinggiftcert.giftCertCode.htmlName}]").parent().append("<span class=\"errormessage\">" + msg + "<\/span>");
    },
    //refresh CC form
    refreshCC: function () {
        var url = util.appendParamToURL(Urls.ClearCCForm);
        jQuery.ajax({
            url: url,
            dataType: 'html',
            success: function () {
                uievents.synccheckoutH();
            }
        });
    },
    setPaymentSection: function (orderBalance) {

        /*if(!orderBalance) {
            return;
        }*/

        if (orderBalance <= 0) {
            //Clearing the CC Form if the remaining balance after allotment and GC is zero
            couponMenthods.refreshCC();

            // if the whole order total was paid with gift certs then hide other payment methods and show a message
            $('#paymentmethods').hide();
            $('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
            // if the order total is zero, determine was it because of the gift certificate use or a promotion? and show appropriate message
            if (flageallotmentcover == 'true') {
                $('.giftcertused').addClass('allotmentcover');
                $('.giftcertused').html('<p class=\'first-para\'>Your allotment balance will cover the full cost of this order.</p><p>No further payment will be necessary.</p>').show();
            } else {
                if (allotmentAmount > 0) {
                    $('.giftcertused').addClass('allotmentcover');
                    var allotmentMessage = '<div class="greater-than-767"><p class="first-para">Your allotment balance will cover the full cost of this order.</p><p>No further payment will be necessary.</p></div><div class="less-than-767"><p>Your allotment balance will cover the full cost of this order. No further payment will be necessary.</p></div>';
                    $('.giftcertused').html(allotmentMessage).show();
                } else {
                    $('.giftcertused').addClass('merchantcover').html($('.giftcertpi').length > 0 ? '<p class=\'first-para\'>' + Resources.GIFTCERT_NO + '</p>' : '<p class=\'first-para\'>' + Resources.ZERO_BALANCE + '</p>').show();
                }
            }
            $('.cardnotworking').hide();
        }
        if ((orderBalance > 0) && ($('input[name$="paymentMethods_selectedPaymentMethodID"]:checked').val() == 'CREDIT_CARD')) {
            $('.cardnotworking').show();
        } else {
            $('.cardnotworking').hide();
        }
    },
    ordertotals: function () {
        var url = Urls.GetOrderTotalJson;
        ajax.getJson({
            url: url,
            callback: function (data) {
                if (data.Total.OrderTotal.indexOf('0.00') != -1) {
                    couponMenthods.setPaymentSection('0.0');
                } else {
                    $('#paymentmethods').show();
                    jQuery('.giftcertused ').removeClass('merchantcover').hide();
                }
                uievents.synccheckoutH();
            }
        });
    },
    removeGiftCertificate: function (giftCertificateId) {
        jQuery('.balance').empty();
        // remove gift certificate
        var url = util.appendParamToURL(Urls.RemoveGiftCertificate, 'giftCertificateID', giftCertificateId);
        ajax.getJson({
            url: url,
            callback: function (data) {
                if (!data || !data.giftCertificate || !data.giftCertificate.removed) {
                    couponMenthods.setGiftCertError(Resources.GIFTCERT_ERROR);
                    return false;
                }
                // remove message in UI
                $('#gc-' + giftCertificateId).remove();
                // reinstate payment methods section which might have been hidden if the whole order was paid with gift certs
                if (!flageallotmentcover) {
                    $('#paymentmethods').show();
                }
                // hide gift cert used for otder total message
                if (!flageallotmentcover) {
                    jQuery('.giftcertused').hide();
                }
                //commenting this since we don't need to clear the payment form on applying GC as in order CC fields are first.
                //var countryCode = jQuery("input[name=${pdict.CurrentForms.billing.billingAddress.addressFields.country.htmlName}]").val();
                //updatePaymentMethods( countryCode );
                var countryCode = jQuery('input[name$=\'addressFields_country\']').val();
                if (typeof countryCode == 'undefined') {
                    countryCode = 'US';
                }
                couponMenthods.updatePaymentMethods(countryCode);
                couponMenthods.updateSummary();
                couponMenthods.ordertotals();
                uievents.synccheckoutH();
                if ($('#paymentmethods .toggle').eq(0).hasClass('active')) {
                    $('.cardnotworking').show();
                }

            }
        });
    },
    bindGiftCertificateRemoval: function () {
        $('#giftcertentry a.remove').unbind('click').bind('click', function () {
            var gcId = util.trimPrefix($(this).attr('id'), 'rgc-');
            couponMenthods.removeGiftCertificate(gcId);
            uievents.synccheckoutH();
            return false;
        });
    },
    setGiftCertRedemptionInfo: function (giftCertificateId, amountExpr) {

        if (!giftCertificateId || !giftCertificateId) {
            return;
        }
        $('#gc-' + giftCertificateId).remove();
        /*jQuery("${'#'}giftcertentry .redemption").append("<div class='success giftcertpi' id='gc-"+ giftCertificateId+"'><div class='gcremove discount-success'><div class='gcremove_icon'><a id='rgc-"+giftCertificateId +"' class='remove' href='${'#'}'><img src='${URLUtils.staticURL('/images/icon_remove.gif')}' alt='${Resource.msg('global.remove','locale',null)}'/></a></div><div class='gc_idlabel'>${Resource.msg('minibillinginfo.giftcertificate','checkout',null)} - "+giftCertificateId+" </div><div class='gcredeemamount'>"+'-'+""+amountExpr+"</div></div><div class='gcdiscapplied'>"+ amountExpr+" "+' '+" ${Resource.msg('billing.giftcertredeemed','checkout',null)}</div></div>");*/
        $('#giftcertentry .redemption').append('<div class=\'success giftcertpi\' id=\'gc-' + giftCertificateId + '\'><div class=\'gcremove discount-success\'><div class=\'gc_idlabel\'>' + giftCertificateId + ' </div><div class=\'gcredeemamount\'>' + ' - ' + '' + amountExpr + ' ' + Resources.GIFT_CERTIFICATE_CREDIT + '</div><div class=\'gcremove_icon\'><a id=\'rgc-' + giftCertificateId + '\' class=\'remove\' href=\'#\'><span>' + Resources.REMOVE + '</span></a></div></div></div>');
        $('.giftcertfields').css({'display': 'none'});
        couponMenthods.bindGiftCertificateRemoval();
    },
    // initializes the payment method forms
    initPaymentMethodSelection: function () {

        // get selected payment method from payment method form
        var paymentMethodID = jQuery('input[name$=\'_selectedPaymentMethodID\']:checked').val();
        if (!paymentMethodID) {
            // if necessary fall back to default payment method (first non-gift-certificate method)
            paymentMethodID = $('input[value=\'CREDIT_CARD\']').attr('id');
        }

        // show payment method section
        couponMenthods.changePaymentMethod(paymentMethodID);
    },
    // changes the payment method form
    changePaymentMethod: function (paymentMethodID) {
        //if (jQuery(".giftcertused").css("display") != "none") return;
        /*
           jQuery(".paymentform").hide();
           jQuery("#PaymentMethod_" + paymentMethodID).show();
           if( jQuery("#PaymentMethod_" + paymentMethodID).length == 0 )
           {
               jQuery("#PaymentMethod_Custom").show();
           }

           // ensure checkbox of payment method is checked
           jQuery("#is-" + paymentMethodID).attr("checked", true);
           if($("#PaymentMethod_CREDIT_CARD").is(':visible')){
               if(paymentMethodID == "PayPal"){
                   $('.cardnotworking').hide();
               }else{
                   $('.cardnotworking').show();
                   jQuery('.paymentform.paypal .paypalmsg').removeClass('error');
               }
           }*/

        var $paymentMethods = $('.payment-method');
        $paymentMethods.removeClass('payment-method-expanded');

        var $selectedPaymentMethod = $paymentMethods.filter('[data-method="' + paymentMethodID + '"]');
        if ($selectedPaymentMethod.length === 0) {
            $selectedPaymentMethod = $('[data-method="Custom"]');
        }
        $selectedPaymentMethod.addClass('payment-method-expanded');

        // ensure checkbox of payment method is checked
        $('input[name$="_selectedPaymentMethodID"]').removeAttr('checked');
        $('input[value=' + paymentMethodID + ']').prop('checked', 'checked');
    },
    bindCreditCardPopulationHandler: function () {
        // select credit card from list
        $('.creditcardlist select').change(function () {
            var cardUUID = $(this).val();
            if (!cardUUID) {
                jQuery('input[name$=\'paymentMethods_creditCard_owner\']').val('');
                jQuery('input[name$=\'paymentMethods_creditCard_number\']').val('');
                jQuery('select[name$=\'paymentMethods_creditCard_month\']').val('');
                jQuery('select[name$=\'paymentMethods_creditCard_year\']').val('');
                jQuery('select[name$=\'paymentMethods_creditCard_cvn\']').val('');
                $('.cardtypeimg > div').hide();
                $('.expirationdate.error').hide();
                jQuery('.paymentform a.clearbutton').hide();
                $('.custom-select').each(function () {
                    var selectVal = $(this).find(':selected').text();
                    $(this).find('.selectorOut').text(selectVal);
                });
                return false;
            } else {
                jQuery('form[id$=\'paymentMethods_creditCard\'] input, form[id$=\'paymentMethods_creditCard\'] select').removeClass('errorclient');
                jQuery('form[id$=\'paymentMethods_creditCard\'] span.errorclient').hide();
                jQuery('form[id$=\'paymentMethods_creditCard\'] .custom-select').removeClass('customselect-error');
                jQuery('form[id$=\'paymentMethods_creditCard\'] .expirationdate.error').hide();
            }
            couponMenthods.populateCreditCardForm(cardUUID);
            uievents.synccheckoutH();
            return false;
        });
    },
    bindPaymentMethodChangeHandler: function () {
        // bind payment method change handler
        $('#paymentmethods .toggle').click(function () {
            if (jQuery('input[name$="billing_paypalprocessed"]').val() != 'true') {
                $('#paymentmethods .toggle').removeClass('active');
                $(this).addClass('active');
                var selectedID = jQuery(this).find('input[name$="_billing_paymentMethods_selectedPaymentMethodID"]').val();
                if (selectedID == 'PayPal') {
                    var paypalStatus = jQuery('input[name$="_billing_paypalval_paypalprocessed"]').val();
                    $('.cardnotworking').hide();
                    if (paypalStatus == 'true') {
                        //$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
                    } else {
                        //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
                    }
                } else if (selectedID == 'CREDIT_CARD') {
                    if (!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_expiration_month"]').val() != '' && $('select[name$="paymentMethods_creditCard_expiration_month"]').val() != '') {
                        //$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
                    } else {
                        //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
                    }
                }
                $(this).find('input[name="billing_paymentMethods_selectedPaymentMethodID"]').prop('checked', true);
                couponMenthods.changePaymentMethod(selectedID);
            }
        });
        $('#paymentmethods .paymentform.creditcardpayment').click(function () {
            $('.paymentmethods .toggle input#is-CREDIT_CARD').closest('.toggle').addClass('active');
        });
        $('#paymentmethods .paymentform.paypal').click(function () {
            $('.paymentmethods .toggle input#is-PayPal').closest('.toggle').addClass('active');
        });
    },
    updatePaymentMethods: function (countryCode) {

        var url = util.appendParamToURL(Urls.RefreshPaymentMethods, 'countryCode', countryCode);

        // indicate progress
        progress.show('#paymentmethodform');

        // load the updated payment method area
        $('#paymentmethodform').load(url, function () {
            $('#paymentmethodform').fadeIn('fast');
            //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
            //couponMenthods.initPaymentMethodSelection();
            couponMenthods.bindPaymentMethodChangeHandler();
            couponMenthods.bindCreditCardPopulationHandler();
            validator.init();
            tooltip.init();
            util.cardtype.init();
            $('.expirationdate .custom-select select');
            $('#PaymentMethod_CREDIT_CARD input');
            $('#PaymentMethod_CREDIT_CARD select');
            uievents.init($('#paymentmethodform'));
            //load checking for payment type
            var $paySelected = jQuery('#paymentmethods').find('input[name$="paymentMethods_selectedPaymentMethodID"]:checked');
            if ($paySelected.length == 1) {
                $paySelected.closest('.toggle').addClass('active');
                var selectedID = $paySelected.val();
                couponMenthods.changePaymentMethod(selectedID);
            }
            couponMenthods.ordertotals();
            uievents.synccheckoutH();

            if (couponMenthods.showPromoCode) {
                $('.couponcode .label').click();
            }
        });
        //app.execUjs();
    },
    removeCouponCode: function (couponCode) {
        couponMenthods.setCouponError(null);
        // nothing entered
        if (!couponCode) {
            couponMenthods.setCouponError(Resources.BILLING_COUPONMIS);
            return;
        }
        // attempt to remove
        jQuery('input[name$=\'billing_couponCode\']').val('');

        var url = util.appendParamToURL(Urls.RemoveCoupon, 'couponCode', couponCode);
        $.get(url, function (data) {
            couponMenthods.updateSummary();
            couponMenthods.updatecartsummary();
            var giftCertificates = jQuery(data).filter('#giftCertificateData').text();
            if (giftCertificates != 'undefined' && giftCertificates.length > 0) {
                var giftCertificatedata = giftCertificates.split('|');
                for (var index = 0; index < giftCertificatedata.length; index++) {
                    couponMenthods.setGiftCertRedemptionInfo(giftCertificatedata[index].split('-')[0].trim(), giftCertificatedata[index].split('-')[1].trim());
                }
            }
            uievents.synccheckoutH();
        });
        var countryCode = jQuery('input[name$=\'addressFields_country\']').val();
        if (typeof countryCode == 'undefined') {
            countryCode = 'US';
        }
        couponMenthods.showPromoCode = true;
        couponMenthods.updatePaymentMethods(countryCode);
        couponMenthods.ordertotals();

        // Determine if a bonus-product promotion was triggered by the coupon.
        // If so, display a popup alert and give the customer a chance to
        // return to the cart and select the bonus product.

        /*$('.noBonusBtn').unbind("click").click( function() {
            $('.bonusdiscountcontainer').dialog('close');
          });*/
    },
    populateCreditCardForm: function (cardID) {
        // load card details
        var url = Urls.billingSelectCC;
        url = util.appendParamToURL(url, 'creditCardUUID', cardID);
        var result = ajax.getJson({
            url: url,
            callback: function (data) {
                if (!data) {
                    alert(Resources.CC_LOAD_ERROR);
                    return false;
                }
                var $creditCard = $('body').find('.creditcardpayment');
                // fill the form / clear the former cvn input
                $creditCard.find('input[name$="creditCard_owner"]').val(data.holder).trigger('change');
                $creditCard.find('select[name$="_type"]').val(data.type).trigger('change');
                $creditCard.find('.creditCard-number').val(data.maskedNumber).trigger('change');
                $creditCard.find('[name$="_month"]').val(data.expirationMonth).trigger('change');
                var date = new Date();
                var currentYear = date.getFullYear();
                if ((data.expirationYear <= currentYear)) {
                    $creditCard.find('[name$="_year"]').val('').change();
                } else {
                    $creditCard.find('[name$="_year"]').val(data.expirationYear).trigger('change');
                }
                $creditCard.find('input[name$="_cvn"]').val('').trigger('change');
                jQuery('input[name$="creditCard_owner"]').val(data.creditCard.holder);
                uievents.changeFormSelection($('select[name$="_type"]')[0], data.creditCard.type);
                $('.creditCard-number').val(data.creditCard.maskedNumber);
                uievents.changeFormSelection($('[name$="_month"]')[0], data.creditCard.expirationMonth);
                uievents.changeFormSelection($('[name$="_year"]')[0], data.creditCard.expirationYear);
                $('input[name$="_cvn"]').val('');
                // remove error messaging
                $('#PaymentMethod_CREDIT_CARD span.errormessage').remove();
                $('#PaymentMethod_CREDIT_CARD input.errormessage').removeClass('errormessage');
                $('#PaymentMethod_CREDIT_CARD .errorlabel').removeClass('errorlabel');

                $('.paymentform.creditcardpayment .formfield .field-wrapper').each(function () {
                    if ($(this).find('input').val() != undefined) {
                        if ($(this).find('input').val().length > 0) {
                            $(this).parent('.formfield').find('a.clearbutton').show();
                        } else {
                            $(this).parent('.formfield').find('a.clearbutton').hide();
                        }
                    }
                });
                if (data.creditCard.type == 'Visa') {
                    result = 'Visa';
                    //visa
                } else if (data.creditCard.type == 'Discover') {
                    result = 'Discover';
                    //Discover
                } else if (data.creditCard.type == 'Amex') {
                    result = 'Amex';
                    //American Express
                } else if (data.creditCard.type == 'MasterCard') {
                    result = 'MasterCard';
                    //Master Card
                }
                //errorspan.hide();
                $('#paymentmethods').find('select[name$="_paymentMethods_creditCard_type"]').val(result);
                $('.cardtypeimg > div').hide();
                $('.cardtypeimg > div.' + result).show();
            }
        });
    },
    setGiftCertBalanceInfo: function (amountExpr) {
        if (!amountExpr) {
            jQuery('.balance').empty();
            return;
        }
        $('.balance').append('<div class=\'balanceamt\'>' + Resources.GIFT_CERT_BALANCE + ' ' + amountExpr + ' </div>');
    },
    redeemGiftCert: function (giftCertificateId) {
        couponMenthods.setGiftCertError(null);
        couponMenthods.setGiftCertBalanceInfo(null);
        // nothing entered
        if (!giftCertificateId) {
            couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
            return;
        }
        // attempt to redeem
        var url = util.appendParamsToUrl(Urls.redeemGiftCert, {giftCertificateID: giftCertificateId, format: 'ajax'});
        ajax.getJson({
            url: url,
            callback: function (data) {
                if (!data) {
                    couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
                    return false;
                }
                if (data.redemptionErrorMsg) {
                    couponMenthods.setGiftCertError(data.redemptionErrorMsg);
                    return false;
                }
                if (!data.redemption) {
                    couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
                    return false;
                }
                // empty input field and display redemption in UI
                $('input[name$=\'billing_giftCertCode\']').val('');
                //couponMenthods.setGiftCertRedemptionInfo(data.redemption.giftCertificateID, data.redemption.amount);
                var countryCode = $('input[name$=\'_addressFields_country\']').val();
                if (typeof countryCode == 'undefined') {
                    countryCode = 'US';
                }
                couponMenthods.updatePaymentMethods(countryCode);
                couponMenthods.updateSummary();
                couponMenthods.ordertotals();
                uievents.synccheckoutH();
            }
        });
    },
    checkGiftCertBalance: function (giftCertificateId) {
        couponMenthods.setGiftCertError(null);
        couponMenthods.setGiftCertBalanceInfo(null);
        // nothing entered
        if (!giftCertificateId) {
            couponMenthods.setGiftCertError(Resources.GIFT_CERT_MISSING);
            return;
        }
        // load gift certificate details
        var url = util.appendParamsToUrl(Urls.GetGiftCertificateBalance, {
            giftCertificateID: giftCertificateId,
            format: 'ajax'
        });
        ajax.getJson({
            url: url,
            callback: function (data) {
                if (!data || !data.giftCertificate) {
                    couponMenthods.setGiftCertError(Resources.GIFT_CERT_INVALID);
                    return false;
                }
                // display details in UI
                couponMenthods.setGiftCertBalanceInfo(data.giftCertificate.balance);
                uievents.synccheckoutH();
            }
        });
    }
};

/**
 * @function
 * @description Fills the Credit Card form with the passed data-parameter and clears the former cvn input
 * @param {Object} data The Credit Card data (holder, type, masked number, expiration month/year)
 */
function setCCFields(data) {

    var $creditCard = $('[data-method="CREDIT_CARD"]');
    $creditCard.find('input[id$="creditCard_owner"]').val(data.holder).trigger('change');
    $creditCard.find('input[id$="creditCard_owner"]').val(data.holder).trigger('blur');
    $creditCard.find('select[name$="_type"]').val(data.type).trigger('change');
    $creditCard.find('select[name$="_type"]').val(data.type).trigger('blur');
    $creditCard.find('input[id*="creditCard_number"]').val(data.maskedNumber).trigger('change');
    $creditCard.find('input[id*="creditCard_number"]').val(data.maskedNumber).trigger('blur');
    $creditCard.find('[id*="_expiration_month"]').val(data.expirationMonth).trigger('change');
    var date = new Date();
    var currentYear = date.getFullYear();
    if ((data.expirationYear <= currentYear)) {
        $creditCard.find('[id$="_year"]').val('').change();
    } else {
        $creditCard.find('[id$="_year"]').val(data.expirationYear).trigger('change');
    }
    $creditCard.find('[id$="_expiration_month"]').val(data.expirationMonth).trigger('blur');
    if ((data.expirationYear <= currentYear)) {
        $creditCard.find('[id$="_year"]').val('').blur();
    } else {
        $creditCard.find('[id$="_year"]').val(data.expirationYear).trigger('blur');
    }
    $creditCard.find('input[id*="_cvn"]').val('').trigger('change');
    $creditCard.find('input[id*="_cvn"]').val('').trigger('blur');
    $creditCard.find('[name$="creditCard_selectedCardID"]').val(data.selectedCardID).trigger('change');
    uievents.synccheckoutH();
}

/**
* @function
* @description Changes the payment type or issuerId of the selected payment method
* @param {String, Boolean} value of payment type or issuerId and a test value to see which one it is, to which the payment type or issuerId should be changed to
*/
function updatePaymentType(selectedPayType, test) {
    if (!test) {
        $('input[name="brandCode"]').removeAttr('checked');
    } else {
        $('input[name="issuerId"]').removeAttr('checked');
    }
    $('input[value=' + selectedPayType + ']').prop('checked','checked');
    uievents.synccheckoutH();
}

/**
 * @function
 * @description Adyen - Initializes the visibility of HPP fields
 */
/*
function initializeHPPFields () {
    if($('[name="brandCode"]:checked').hasClass('openInvoice')) {
        $('.additionalfield').hide().find('input').val('');
        $('.additionalfield.' + $('.checkout-billing').find('select.country').val()).show();
    } else {
        $('.additionalfield').hide().find('input').val('');
    }
}
*/
/**
 * @function
 * @description Updates the credit card form with the attributes of a given card
 * @param {String} cardID the credit card ID of a given card
 */
function populateCreditCardForm(cardID) {
    // load card details
    var url = util.appendParamToURL(Urls.billingSelectCC, 'creditCardUUID', cardID);
    ajax.getJson({
        url: url,
        callback: function (data) {
            uievents.synccheckoutH();
            if (!data) {
                window.alert(Resources.CC_LOAD_ERROR);
                return false;
            }
            setCCFields(data);
            uievents.synccheckoutH();
        }
    });
}

/**
 * @function
 * @description Changes the payment method form depending on the passed paymentMethodID
 * @param {String} paymentMethodID the ID of the payment method, to which the payment method form should be changed to
 */
function updatePaymentMethod(paymentMethodID) {
    var $paymentMethods = $('.payment-method');
    $paymentMethods.removeClass('payment-method-expanded');

    var $selectedPaymentMethod = $paymentMethods.filter('[data-method="' + paymentMethodID + '"]');
    if ($selectedPaymentMethod.length === 0) {
        $selectedPaymentMethod = $('[data-method="Custom"]');
    }
    $selectedPaymentMethod.addClass('payment-method-expanded');

    // ensure checkbox of payment method is checked
    $('input[name$="_selectedPaymentMethodID"]').removeAttr('checked');
    $('input[value=' + paymentMethodID + ']').prop('checked', 'checked');

    //formPrepare.validateForm();
}

/**
 * @function
 * @description Changes the payment type or issuerId of the selected payment method
 * @param {String, Boolean} value of payment type or issuerId and a test value to see which one it is, to which the payment type or issuerId should be changed to
 */
/*
function updatePaymentType(selectedPayType, test) {
    if(!test) {
        $('input[name="brandCode"]').removeAttr('checked');
    } else {
        $('input[name="issuerId"]').removeAttr('checked');
    }
    $('input[value=' + selectedPayType + ']').prop('checked', 'checked');
    formPrepare.validateForm();
}
*/
/**
 * @function
 * @description Adyen - Initializes the visibility of HPP fields
 */
/*
function initializeHPPFields () {
	if($('[name="brandCode"]:checked').hasClass('openInvoice')) {
		$('.additionalfield').hide().find('input').val('');
		$('.additionalfield.' + $('.checkout-billing').find('select.country').val()).show();
	} else {
		$('.additionalfield').hide().find('input').val('');
	}
}
*/
/**
 * @function
 * @description loads billing address, Gift Certificates, Coupon and Payment methods
 */
exports.init = function () {
    //var $checkoutForm = $('.checkout-billing');
    //var $addGiftCert = $('#add-giftcert');
    //var $giftCertCode = $('input[name$="_giftCertCode"]');
    //var $addCoupon = $('#add-coupon');
    //var $couponCode = $('input[name$="_couponCode"]');
    var $selectPaymentMethod = $('.payment-method-options');
    var selectedPaymentMethod = $selectPaymentMethod.find(':checked').val();
    var $payType = $('[name="brandCode"]');
    var $issuerId = $('[name="issuerId"]');
    var $issuer = $('ul#issuer');
    var selectedPayType = $payType.find(':checked').val();
    var selectedIssuerId = $issuerId.find(':checked').val();
    /* formPrepare.init({
         formSelector: 'form[id$="billing"]',
         continueSelector: '[name$="billing_save"]'
     });*/
    var activePaymentMethodID = $('body').find('.paymentmethods_cont .input-radio:checked').attr('id');
    if (activePaymentMethodID == 'is-PayPal') {
        $('.paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput').removeClass('required');
        $('.cardnotworking').hide();

    } else {
        $('.paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput').addClass('required');
        $('.cardnotworking').show();

    }
    if (!jQuery('.creditcardlist select').val()) {
        $('.creditcard_name').val('');
        $('.creditCard-number').val('');
        $('.monthselect').val('');
        $('.yearselect').val('');
        $('.creditcard_cvn').val('');
        $('.cardtypeimg > div').hide();
        $('.expirationdate.error').hide();
        $('.expirationdatevalid.error').hide();
        $('.paymentform a.clearbutton').hide();
    }
    $('.expirationdate .custom-select select').on('blur', function () {
        var d = new Date(),
            mth = d.getMonth() + 1,
            yy = d.getFullYear();
        if (!jQuery(this).val()) {
            $('.expirationdate.error').show();
            $('.expirationdatevalid.error').hide();
        } else {
            if (jQuery('.expirationdate .custom-select.customselect-error').length == 0) {
                $('.expirationdate.error').hide();
                $('.expirationdatevalid.error').hide();
            }
            var selectedMth = $('.expirationdate .custom-select select[id$=\'billing_paymentMethods_creditCard_expiration_month\']').val();
            var selectedyear = $('.expirationdate .custom-select select[id$=\'billing_paymentMethods_creditCard_expiration_year\']').val();
            if (selectedyear && selectedMth) {
                selectedyear = selectedyear.replace(',', '');
                if ((selectedyear <= yy) && (selectedMth < mth)) {
                    $('.expirationdate.error').hide();
                    $('.expirationdatevalid.error').show();
                }
            }
        }
    });
    $('body').on('click', '.redemption .discount-success button.remove-cop', function (e) {
        e.preventDefault();
        var url = $(this).val();
        couponMenthods.removeCouponCode(url);
        return false;
    });
    /* JIRA PREV-135 : Disabled Credit Card in BM is displaying in the application.
       Changed default option from 'CREDIT_CARD' to first available payment method.*/
    updatePaymentMethod((selectedPaymentMethod) ? selectedPaymentMethod : $('.payment-method-options input').first().val());
    $('body').on('click', '.payment-method-options input[type="radio"]', function () {
        updatePaymentMethod($(this).val());
        if ($(this).val() == 'Adyen' && $payType.length > 0) {
            updatePaymentMethod($(this).val()); //set payment type of Adyen to the first one
            updatePaymentType((selectedPayType) ? selectedPayType : $payType[0].value, false);
        } else {
            $payType.removeAttr('checked');
            $issuerId.removeAttr('checked');
        }
        if ($(this).is(':checked')) {
            $(this).closest('.toggle').siblings('.toggle').removeClass('active');
            if ($(this).attr('id') == 'is-PayPal') {
                $('.paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput').removeClass('required');
                $('.cardnotworking').hide();
            } else {
                $('.paymentform .textinput, .paymentform .yearselect select, .paymentform .monthselect select, .addressoptions .checkinput').addClass('required');
                $('.cardnotworking').show();
            }
            $(this).closest('.toggle').addClass('active');
        }
        uievents.customFields();
        uievents.synccheckoutH();
    });

    // Adyen - Click event for payment methods
    $payType.on('click', function () {
        updatePaymentType($(this).val(), false);
        //if the payment type contains issuerId fields, expand form with the values
        if ($(this).siblings('#issuer').length > 0) {
            $issuer.show();
            updatePaymentType((selectedIssuerId) ? selectedIssuerId : $issuerId[0].value, true);
        } else {
            $issuer.hide();
            $('input[name="issuerId"]').removeAttr('checked');
        }
        //initializeHPPFields();
    });

    $issuerId.on('click', function () {
        updatePaymentType($(this).val(), true);
    });
    $('body').on('click', '.payment-method-options .toggle  img', function () {
        $(this).closest('label').find('input[type="radio"]').trigger('click');
    });

    // select credit card from list
    $('body').on('change', '#creditCardList', function () {
        var cardUUID = $(this).val();
        if (!cardUUID) {
            return;
        }
        populateCreditCardForm(cardUUID);

        // remove server side error
        $('.required.error').removeClass('error');
        $('.error-message').remove();
    });
    $('body').on('click', '#giftcertentry a.remove', function () {
        var gcId = util.trimPrefix($(this).attr('id'), 'rgc-');
        couponMenthods.removeGiftCertificate(gcId);
        return false;
    });
    $('body').on('click', '#check-giftcert', function (e) {
        e.preventDefault();
        var gcId = jQuery('input[name$=\'billing_giftCertCode\']').val().toUpperCase();
        couponMenthods.checkGiftCertBalance(gcId);
        uievents.synccheckoutH();
        return false;
    });

    $('body').on('click', '#add-giftcert', function (e) {
        e.preventDefault();
        var gcId = jQuery('input[name$=\'billing_giftCertCode\']').val().toUpperCase();
        couponMenthods.redeemGiftCert(gcId);
        uievents.synccheckoutH();
        return false;
    });

    $('body').on('click', '#add-coupon', function (e) {
        e.preventDefault();
        var //$error = $checkoutForm.find('.coupon-error'),
            code = $('input[name$="_couponCode"]').val();
        couponMenthods.setCouponError(null);
        if (code.length === 0) {
            couponMenthods.setCouponError(Resources.COUPON_CODE_MISSING);
            return false;
        }

        var url = util.appendParamsToUrl(Urls.addCoupon, {
            couponCode: code,
            format: 'ajax'
        });
        $.getJSON(url, function (data) {
            var msg = '';
            if (!data) {
                msg = Resources.COUPON_INVALID;
                couponMenthods.setCouponError(msg);
                return false;
            }
            if (data.redemption.redemptionErrorMsg) {
                couponMenthods.setCouponError(data.redemption.redemptionErrorMsg);
                return false;
            }
            if (!data.redemption) {
                msg = Resources.COUPON_INVALID;
                couponMenthods.setCouponError(msg);
                return false;
            }
            // empty input field and display redemption in UI
            jQuery('input[name$=\'_billing_couponCode\']').val('');
            jQuery('input[name$=\'_billing_couponCode\']').removeClass('errorclient');
            couponMenthods.setCouponRedemptionInfo(data.redemption);
            // update gift card redemptions as amounts might have changed after coupon
            jQuery.each(data.redemption.gcRedemptions, function () {
                couponMenthods.setGiftCertRedemptionInfo(this.giftCertificateID, this.amount);
            });
            var countryCode = $('input[name$=\'_addressFields_country\']').val();
            if (typeof countryCode == 'undefined') {
                countryCode = 'US';
            }

            couponMenthods.updateSummary();
            couponMenthods.updatecartsummary();
            couponMenthods.updatePaymentMethods(countryCode);
            couponMenthods.ordertotals();
            uievents.synccheckoutH();
            // Determine if a bonus-product promotion was triggered by the coupon.
            // If so, display a popup alert and give the customer a chance to
            // return to the cart and select the bonus product.
            if (data.redemption.bonusPromotionApplied) {
                $('.bonusdiscountcontainer .bonusproductpromo').append(data.redemption.bonusPromotionCallout);
                $('.bonusdiscountcontainer div.details').html(data.redemption.bonusPromotionDetails);

                $('.bonusdiscountcontainer').show();
                $('.bonusdiscountcontainer').dialog({
                    title: Resources.BONUS_PRODUCT,
                    bgiframe: true,
                    autoOpen: false,
                    modal: true,
                    height: 250,
                    width: 500,
                    resizable: false
                });
                jQuery('.bonusdiscountcontainer').dialog('open');

            }

            jQuery('.selectBonusBtn').unbind('click').click(function () {
                jQuery('.bonusdiscountcontainer').dialog('close');
                location.href = '${URLUtils.https(\'Cart-Show\')}';
                return false;
            });

            jQuery('.noBonusBtn').unbind('click').click(function () {
                jQuery('.bonusdiscountcontainer').dialog('close');
            });
        });
    });

    // trigger events on enter
    $('body').on('keydown', 'input[name$="_couponCode"]', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#add-coupon').click();
        }
    });
    $('body').on('keydown', 'input[name$="_giftCertCode"]', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#add-giftcert').click();
        }
    });

    $('.trypaypal').on('click', function () {
        $('.continuecheckout-paypallogin').trigger('click');
    });

    if ($('.pt_checkout .paymentform.paypal .error-paypal-heading').length > 0 || $('.pt_checkout .paymentform.paypal .paypalmsg.success-paypal').length > 0) {
        $('body, html').animate({
            scrollTop: $('#paymentmethodform legend').offset().top
        }, 600);
    }

    $('.switchtocredit').on('click', function () {
        $('.paymentmethods_cont .toggle').eq(0).find('.input-radio').trigger('click');
    });
    //PREVAIL - init Address Validation
    require('../../addressvalidation').init();

    util.cardtype.init();
    $('body').on('click', '.couponcode .label', function () {
        if ($('.promo-input-button').is(':visible') == true) {
            $('.promo-input-button').hide();
            $(this).closest('.couponcode').find('span.error').hide();
        } else {
            $('.promo-input-button').show();
            $(this).closest('.couponcode').find('span.error').show();
        }
        uievents.synccheckoutH();
    });
    if ($('.guestbillingform .password .errormessage').length > 0) {
        $('.guestbillingform .password .errormessage').remove();
    }

    $('.guestbillingform .billing-conpassword').blur(function () {
        var billingPas = $('.guestbillingform .billing-password').val();
        var billingConpas = $('.guestbillingform .billing-conpassword').val();
        $('.guestbillingform .password .errormessage').remove();
        if (billingPas.length > 0) {
            if (billingConpas.length < 5) {
                $('.guestbillingform .billing-conpassword').addClass('errorclient');
                $('.billingconfpassword').text(Resources.billingpasswordconfirm_min).removeClass('hide');
                //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
            } else if (billingPas != billingConpas) {
                $('.guestbillingform .billing-conpassword').addClass('errorclient');
                $('.billingconfpassword').text(Resources.billingpasswordconfirm).removeClass('hide');
                //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
            } else {
                $('.guestbillingform .billing-conpassword').removeClass('errorclient');
                $('.billingconfpassword').text(Resources.billingpasswordconfirm).addClass('hide');
                if (!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_year"]').val() != '' && $('select[name$="paymentMethods_creditCard_month"]').val() != '') {
                    //$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
                }
            }
        } else {
            $('.guestbillingform .billing-conpassword').removeClass('errorclient');
            $('.billingconfpassword').text(Resources.billingpasswordconfirm).addClass('hide');
            if (!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_year"]').val() != '' && $('select[name$="paymentMethods_creditCard_month"]').val() != '') {
                //$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
            }
        }
    });
    $('.guestbillingform .billing-password').bind('blur', function () {
        var billingPas = $('.guestbillingform .billing-password').val();
        var billingConpas = $('.guestbillingform .billing-conpassword').val();
        //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');

        if ($(this).length > 0) {
            $('.guestbillingform .billing-conpassword').addClass('required');
        } else {
            $('.guestbillingform .billing-conpassword').removeClass('required');
            $('.guestbillingform .billing-conpassword').removeClass('errorclient');
        }
        if (billingPas.length > 0) {
            if (billingPas.length < 5) {
                $('.guestbillingform .billing-password').addClass('errorclient');
                $('.billingpassword').text(Resources.billingpasswordconfirm_min).removeClass('hide');
                //$('.continuecheckoutbutton .continuecheckout').attr('disabled', 'disabled');
            } else {
                $('.guestbillingform .billing-password').removeClass('errorclient');
                $('.billingpassword').addClass('hide');
            }
        } else {
            $('.guestbillingform .billing-password').removeClass('errorclient');
            $('.billingpassword').addClass('hide');
        }

        if ((billingPas == billingConpas) && (billingPas.length >= 5)) {
            if (!$('input[name$="_creditCard_owner"]').hasClass('errorclient') && !$('input[name$="_creditCard_number"]').hasClass('errorclient') && !$('input[name$="_creditCard_cvn"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_year"]').hasClass('errorclient') && !$('select[name$="paymentMethods_creditCard_month"]').hasClass('errorclient') && $('input[name$="_creditCard_owner"]').val() != '' && $('input[name$="_creditCard_number"]').val() != '' && $('input[name$="_creditCard_cvn"]').val() != '' && $('select[name$="paymentMethods_creditCard_year"]').val() != '' && $('select[name$="paymentMethods_creditCard_month"]').val() != '') {
                //$('.continuecheckoutbutton .continuecheckout').removeAttr('disabled');
            }
        }
    });

    if ($('.expirationdate .custom-select .field-wrapper span.errormessage').length > 0) {
        $('.expirationdate .custom-select span.errormessage').hide();
        $('.expirationdate.error').show();
    }
    $('.checkoutbilling .continue-checkout-button .continuecheckout').click(function () {
        var $content = $('.primary-content');
        progress.show($content);
        var errorcount = 0;
        if (!($('#PaymentMethod_CREDIT_CARD').is(':visible'))) {
            $('.paymentform .textinput, .paymentform select').removeClass('required');
        }
        if (!jQuery('form[id$="_billing"]').valid()) {
            progress.hide();
            jQuery('.state-blk select').trigger('blur');
            if (jQuery('.billing-address-fields').hasClass('hide')) {
                $('select[name$=billing_addressList]').val('');
                $('input[name$="billingAddress_selectedbillingadd"]').val('');
                $('.custom-select').each(function () {
                    var selectVal = $(this).find(':selected').text();
                    $(this).find('.selectorOut').text(selectVal);
                });
                jQuery('.billing-address-fields').removeClass('hide');
                jQuery('.selected-billing-address , .selected-shipping-address').addClass('hide');
                uievents.customFields();
            }
            errorcount++;
        }
        if ($('#PaymentMethod_CREDIT_CARD').is(':visible')) {
            if (!$('form[id$="dwfrm_billing"]').valid()) {
                progress.hide();
                $('.expirationdate select').trigger('blur');

                if ($('.vip-terms .custom-link').is(':visible') && !$('input[name$="_isvip"]').is(':checked')) {
                    if ($('.vip-terms .custom-checkbox .vip-message #message').length == 0) {
                        $('.vip-terms .custom-checkbox .vip-message').prepend('<span id="message" class="error vipcheckmessage">Please check the box to confirm you have read and agree to the Rapala VIP Terms & Conditions.</span>');
                        $('.singleshipping_error').show();
                    }
                    $('.vip-terms .custom-checkbox .custom-link').addClass('error');
                    uievents.synccheckoutH();
                }
                if ($('.knife .custom-link.agecheck-link').is(':visible') && !$('input[name$="agecheck_ischeck"]').is(':checked')) {
                    if ($('.addressoptions.knife .agecheck_message #message').length == 0) {
                        $('.addressoptions.knife .agecheck_message').prepend('<span id="message" class="error agecheckmessage">Please Verify you are 18 years of age or older, or remove all knives from your cart.</span>');
                        $('.singleshipping_error').show();
                    }
                    $('.addressoptions.knife > .custom-checkbox .custom-link').addClass('error');
                    uievents.synccheckoutH();
                }
                errorcount++;
            } else {

                if ($('.vip-terms .custom-link').is(':visible') && !$('input[name$="_isvip"]').is(':checked')) {
                    if ($('.vip-terms .custom-checkbox .vip-message #message').length == 0) {
                        $('.vip-terms .custom-checkbox .vip-message').prepend('<span id="message" class="error vipcheckmessage">Please check the box to confirm you have read and agree to the Rapala VIP Terms & Conditions.</span>');
                        $('.singleshipping_error').show();
                    }
                    $('.vip-terms .custom-checkbox .custom-link').addClass('error');
                    uievents.synccheckoutH();
                    errorcount++;
                }
                if ($('.knife .custom-link.agecheck-link').is(':visible') && !$('input[name$="agecheck_ischeck"]').is(':checked')) {
                    if ($('.addressoptions.knife .agecheck_message #message').length == 0) {
                        $('.addressoptions.knife .agecheck_message').prepend('<span id="message" class="error agecheckmessage">Please Verify you are 18 years of age or older, or remove all knives from your cart.</span>');
                        $('.singleshipping_error').show();
                    }
                    $('.addressoptions.knife > .custom-checkbox .custom-link').addClass('error');
                    uievents.synccheckoutH();
                    errorcount++;
                }
            }
        } else {
            if ($('.vip-terms .custom-link').is(':visible') && !$('input[name$="_isvip"]').is(':checked')) {
                if ($('.vip-terms .custom-checkbox .vip-message #message').length == 0) {
                    $('.vip-terms .custom-checkbox .vip-message').prepend('<span id="message" class="error vipcheckmessage">Please check the box to confirm you have read and agree to the Rapala VIP Terms & Conditions.</span>');
                    $('.singleshipping_error').show();
                }
                $('.vip-terms .custom-checkbox .custom-link').addClass('error');
                uievents.synccheckoutH();
                errorcount++;
            }
            if ($('.knife .custom-link.agecheck-link').is(':visible') && !$('input[name$="agecheck_ischeck"]').is(':checked')) {
                if ($('.addressoptions.knife .agecheck_message #message').length == 0) {
                    $('.addressoptions.knife  .agecheck_message').prepend('<span id="message" class="error agecheckmessage">Please Verify you are 18 years of age or older, or remove all knives from your cart.</span>');
                    $('.singleshipping_error').show();
                }
                $('.addressoptions.knife  > .custom-checkbox .custom-link').addClass('error');
                uievents.synccheckoutH();
                errorcount++;
            }
            /*     if(!$('input.paypalprocessed').val()){
                     $('.paymentform.paypal .paypalmsg').addClass('error');
                      return false;

                 }*/
        }
        if (errorcount > 0) {
            progress.hide();
            $('.singleshipping_error').show();
            return false;
        }
        if ($('.billing-address-fields').is(':visible')) {
            $('.billing-address-fields .state-blk select').blur();
        }
    });
    //JIRA PREV-38 : Billing page_Credit Card Section: CVV number should not pre-populate.
    /*if ($('.bypassDAV').length === 0) {
        $('.spc-billing .form-row.cvn input').val('');
    }*/
    if ($('.invalidCreditcard').length > 0) {
        //$('.singleshipping_error').show();
        $('.cardnumber input').addClass('errorclient');
        $('.cardnumber .labeltext').addClass('error');
        $('<span class="invalidcredit error">- Invalid Credit Card Number</span>').appendTo('.cardnumber .field-wrapper');
        //$('.singleshipping_error').show();
        $('.cardnumber .errormessage').css('display', 'none');
    }

    if (SitePreferences.ADYEN_CSE_ENABLED) {
        adyenCse.initBilling();
    }

    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var initYear = currentYear - 100;
    $('.openinvoiceInput input[name$="_dob"]').datepicker({
        showOn: 'focus',
        yearRange: initYear + ':' + currentYear,
        changeYear: true,
        dateFormat: 'yyyy-mm-dd'
    });

};
