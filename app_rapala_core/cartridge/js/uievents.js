'use strict';
var util = require('./util'),
    dialog = require('./dialog'),
    cookieprivacy = require('./cookieprivacy');
/*function charcount($this){
	var characterLimit = parseInt($this.data("character-limit"));
	var charRemains = characterLimit - $this.val().trim().length;
	var charCountHtml = 'Characters Remaining ' + charRemains
	if($this.hasClass("vip-textarea")){
		if ($this.next('div.char-count').length === 0) {
			charCountContainer = $('<div class="char-count"/>').insertAfter($this);
		}
		$this.next('div.char-count').html(charCountHtml);
	}else {
		if ($this.prev('div.char-count').length === 0) {
			charCountContainer = $('<div class="char-count"/>').insertBefore($this);
		}
		$this.prev('div.char-count').html(charCountHtml);
	}
}*/
var uievents = {
    customFields: function () {
        var $con = $('body');
        $con.find('.custom-checkbox').each(function () {
            if (jQuery(this).find('input[type="checkbox"]').is(':checked')) {
                jQuery(this).find('.custom-link').addClass('active');
            }
        });

        $con.find('.custom-checkbox .custom-link').off('click').on('click', function () {
            var $customcheck = $(this).closest('.custom-checkbox');
            $(this).removeClass('error');
            if ($customcheck.find('input[type="checkbox"]').is(':checked')) {
                $customcheck.find('input[type="checkbox"]').trigger('click');
                $customcheck.find('.custom-link').removeClass('active');
            } else {
                $customcheck.find('input[type="checkbox"]').trigger('click');
                $customcheck.find('.custom-link').addClass('active');
            }
        });

        $con.find('.custom-checkbox input[type="checkbox"]').off('change').on('change', function () {
            $(this).closest('.custom-checkbox').find('.custom-link').removeClass('error');
            var $form = $('.address');
            if ($(this).is(':checked')) {
                $(this).closest('.custom-checkbox').find('.custom-link').addClass('active');
                if ($(this).is('[name$=_sameasshippingaddress]')) {
                    var selectedAddress = $(this).closest('.custom-checkbox').data('address');
                    $('.selected-shipping-address').empty();
                    $('.selected-shipping-address').append(selectedAddress.firstName + ' ' + selectedAddress.lastName + '<br/>' + selectedAddress.address1 + ' ' + selectedAddress.address2 + '<br/>' + selectedAddress.city + ' ' + selectedAddress.stateCode + ' ' + selectedAddress.postalCode + '<br/>' + selectedAddress.phone);
                    util.fillAddressFields(selectedAddress, $form);
                    $('.edit-address-field').addClass('hide');
                    $('.selected-shipping-address, .new-address-field').removeClass('hide');
                    $('.shipping-address-field-section').addClass('hide');
                    uievents.customFields();
                    uievents.synccheckoutH();
                }

            } else {
                $(this).closest('.custom-checkbox').find('.custom-link').removeClass('active');
                if ($(this).is('[name$=_sameasshippingaddress]')) {
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
                    uievents.changeFormSelection(jQuery('select[name$=\'_addressFields_states_state\']')[0], '');
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
                    uievents.synccheckoutH();
                }

            }
        });

        $con.find('.custom-select').each(function () {
            $(this).find('select').removeAttr('style');
            var selWidth = $(this).find('select').width();
            if ($(this).find('select').hasClass('input-longer')) {
                selWidth = selWidth - 17;
            }
            $(this).find('select').css({
                'width': selWidth + 20,
                'left': '0px',
                'line-height': '28px',
                'z-index': '99',
                'position': 'relative',
                'float': 'left',
                'padding': '0px'
            });
            $(this).find('.field-wrapper').css({
                'background-position': selWidth,
                'width': selWidth + 20,
                'padding': '0px'
            });
            if ($('.creditCard').length > 0) {
                $(this).css({
                    'background-position': selWidth,
                    'width': selWidth + 15,
                    'padding': '0px'
                });
            }

            if ($(this).find('.selectorOut').length == 0) {
                $(this).find('select').after('<div class=\'selectorOut\' style=\'position:absolute;top:0px;z-index:1;padding:0 20px 0 10px;\'></div>');
            }
            if ($(this).find('.selectorError').length == 0 && !$(this).closest('month') && !$(this).closest('year')) {
                $(this).closest('.formfield .field-wrapper').append('<div class=\'selectorError error\'></div>');
            }
            $(this).find('.selectorOut').text('').text($(this).find(':selected').text());

        }).on('change', function () {
            var str = '';
            str = $(this).find(':selected').text();
            $(this).find('.selectorOut').text('').text(str);
            if ($(this).hasClass('addresslist')) {
                if ($(this).find('.selectorOut').outerWidth() >= 298) {
                    str = str.substr(0, 34) + '...';
                    $(this).find('.selectorOut').text('').text(str);
                }
            }
        });

        $con.find('.custom-select select').on('blur change', function () {
            if ($(this).hasClass('valid') || $(this).val().length > 0) {
                $(this).closest('.custom-select').removeClass('customselect-error');
                $(this).removeClass('errorclient').addClass('valid');
                //$(this).find("option[value="+$(this).val()+"]").attr("selected","selected");
                if (jQuery(this).closest('.formfield').hasClass('state')) {
                    $('.state-blk .stateerror.error').hide();
                }
            } else {
                $(this).closest('.custom-select').addClass('customselect-error');
                if (jQuery(this).closest('.formfield').hasClass('state') && !jQuery(this).closest('.custom-select').hasClass('blured')) {
                    jQuery('.state-blk .stateerror.error').show();
                }
            }
            if (jQuery(this).hasClass('yearselect') || jQuery(this).hasClass('monthselect')) {
                if (jQuery('.yearselect').valid() == 1 && jQuery('.monthselect').valid() == 1) {
                    jQuery('.expirationdatevalid.error').hide();
                    jQuery('.expirationdate.error').hide();
                }
            }
        });
    },
    //changes the selection of the given form select to the given value
    changeFormSelection: function (selectElem, selectedValue) {
        if (!selectElem) {
            return;
        }
        var options = selectElem.options;
        if (options.length > 0) {
            // find index of value to select
            var idx = 0;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value != selectedValue) {
                    continue;
                }
                idx = i;
                break;
            }
            selectElem.selectedIndex = idx;
            $('.custom-select').each(function () {
                var selectVal = $(this).find(':selected').text();
                $(this).find('.selectorOut').text(selectVal);
            });
        }
    },
    init: function ($con) {

        if ($con == null) {
            $con = $('body');
        }

        uievents.customFields();
        // Dynamicaly generating tabindex for VIP
        if ($('.ui-dialog').hasClass('vipInsider-dlg')) {
            $('.vipInsider-dlg .formfield').each(function (i) {
                $(this).find(':input:not(:hidden)').attr('tabindex', i + 21);
            });
        }
        /*$(document).ajaxComplete(function () {
            if($('.pt_productsearchresult').length > 0){app.search.searchRefinementToggle();}
            uievents.synccheckoutH();
        });*/
        $con.find('a.clearbutton').on('click touchstart', function () {
            $(this).closest('.formfield').find('input').val('');
            $(this).closest('.formfield').find('textarea').val('');
            $(this).closest('.formfield').find('a.clearbutton').hide();
            $(this).closest('.formfield').find('.correctaddress').hide();
            $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
            var textareMaxLength = $(this).closest('.field-wrapper').find('textarea').attr('maxlength');
            $(this).closest('.field-wrapper').find('.char-count').html('').html('Characters Remaining ' + textareMaxLength);
            if ($(this).closest('.formfield').find('input[name$="_creditCard_number"]').length > 0 && $(this).closest('.formfield').find('input[name$="_creditCard_number"]').val().length < 4) {
                $('.cardtypeimg > div').hide();
            }
            if ($(this).closest('.formfield').find('.field-wrapper .maxelement').length > 0) {
                $(this).closest('.formfield').find('.field-wrapper .maxelement').remove();
            }
        });
        $con.find('.promo-input-button .field-wrapper').on('keyup blur', function () {
            if ($(this).find('input').val() != undefined) {
                if ($(this).find('input').val().length > 0) {
                    $(this).find('a.clearbutton').show();
                } else {
                    $(this).find('a.clearbutton').hide();
                }
            }
        });
        $con.find('.giftcertfields .field-wrapper').on('keyup blur', function () {
            if ($(this).find('input').val() != undefined) {
                $(this).find('input').removeClass('errorclient');
                if ($(this).find('input').val().length > 0) {
                    $(this).find('a.clearbutton').show();
                } else {
                    $(this).find('a.clearbutton').hide();
                }
            }
        });

        if ($('.ui-login').length > 0 || $('.passwordreset').length > 0) {
            $con.find('.ui-login .formfield').each(function () {
                var $val = $(this).find('input[type="text"]').length > 0 ? $(this).find('input[type="text"]').val() : $(this).find('input[type="password"]').val();
                if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0) {
                    $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
                    $(this).find('.clearbutton').hide();
                }
                if (($val != null || $val != undefined) && $val.length > 0) {
                    $(this).find('.clearbutton').show();
                }
            });
        }
        if ($('.account-section').length > 0 || $('.passwordreset').length > 0) {
            $con.find('.account-section .formfield').each(function () {
                var $val = $(this).find('input[type="text"]').length > 0 ? $(this).find('input[type="text"]').val() : $(this).find('input[type="password"]').val();
                if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0) {
                    $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
                }
                if (($val != null || $val != undefined) && $val.length > 0) {
                    $(this).find('.clearbutton').show();
                }
            });
        }

        $con.find('.formfield .field-wrapper input,.formfield .field-wrapper textarea').on('keyup input blur', function () {
            if ($(this).val() != undefined) {
                if ($(this).val().length > 0) {
                    $(this).closest('.formfield').find('a.clearbutton').show();
                } else {
                    $(this).closest('.formfield').find('a.clearbutton').hide();
                }
            }
        });
        //var OSName = 'Unknown OS';
        if (navigator.appVersion.indexOf('Mac') != -1) {
            $('.pt_vipinsider').find('span.rapala-entity-holder i').addClass('macfont');
        }

        $('.paymentmethods_cont .toggle').on('click', function () {
            uievents.synccheckoutH();
        });

        $('button[name=\'dwfrm_login_login\']').on('click', function () {
            setTimeout(function () {
                uievents.synccheckoutH();
            }, 100);
        });
        $('button[name=\'dwfrm_billinggiftcert_redeemGiftCert\']').on('click', function () {
            setTimeout(function () {
                uievents.synccheckoutH();
            }, 100);
        });
        $('button[name=\'dwfrm_billingcoupon_applyCoupon\']').on('click', function () {
            setTimeout(function () {
                uievents.synccheckoutH();
            }, 100);
        });
        $('.checkbalance a').on('click', function () {
            setTimeout(function () {
                uievents.synccheckoutH();
            }, 100);
        });
        $('.giftcertcouponform .gift-heading').on('click', function () {
            if ($('.show-content').is(':visible') == true) {
                $('.show-content').hide();
                $(this).closest('.giftcertfield').find('span.error').hide();
            } else {
                $('.show-content').show();
                $(this).closest('.giftcertfield').find('span.error').show();
            }
            uievents.synccheckoutH();
        });
        $('body').on('keypress keyup', 'input[id$="_addressid"],input[id$="_addressFields_firstName"],input[id$="_addressFields_lastName"],input[id$="_addressFields_address1"],input[id$="_addressFields_address2"],input[id$="_addressFields_city"],input[id$="_addressFields_phone"],input[id$="_addressFields_postal"],input[id$="_contactus_phone"]', function (e) {
            var keycode = e.keyCode ? e.keyCode : e.which;
            var maxlength = $(this).attr('maxlength');
            var maxlmsg = 'This field is limited to ' + maxlength + ' characters.';
            if (jQuery(this).hasClass('phone') || jQuery(this).hasClass('phoneCDUS')) {
                maxlength = 14;
                $(this).attr('maxlength', maxlength);
                maxlmsg = 'This field is limited to 10 numbers.';
            }

            if (jQuery(this).hasClass('postal')) {
                maxlength = 10;
                $(this).attr('maxlength', maxlength);
                maxlmsg = 'This field is limited to 9 numbers.';
            }
            if (keycode != 86) {
                var maxElement = '<div class=\'maxelement hide\'>' + maxlmsg + '</div>';
                if (($(this).val().length >= maxlength) && (keycode != 9)) {
                    if ($(this).closest('.field-wrapper').find('span.errorclient').length != 0) {
                        $(this).closest('.field-wrapper').find('span.errorclient').remove();
                    }
                    if ($(this).closest('.field-wrapper').find('.maxelement').length == 0) {
                        $(this).closest('.field-wrapper').append(maxElement);
                    } else {
                        $(this).closest('.field-wrapper').find('.maxelement').removeClass('hide');
                        $(this).val($(this).val().substr(0, maxlength));
                        return false;
                    }
                } else {
                    if ($(this).closest('.field-wrapper').find('.maxelement').length > 0) {
                        $(this).closest('.field-wrapper').find('.maxelement').remove();
                    }
                }
            }

        });
        $('body').on('blur', 'input[id$="_addressid"],input[id$="_addressFields_firstName"],input[id$="_addressFields_lastName"],input[id$="_addressFields_address1"],input[id$="_addressFields_address2"],input[id$="_addressFields_city"],input[id$="_addressFields_phone"],input[id$="_addressFields_postal"],input[id$="_contactus_phone"]', function () {
            $('.maxelement').addClass('hide');
            $('#customercontactus').find('span').removeClass('maxelement');
        });
        if ($('.ui-dialog').hasClass('vipInsider-dlg')) {
            $('.vipInsider-dlg .formfield').each(function () {
                if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper textarea').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0) {
                    $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
                }
                $(this).find('.field-wrapper input.textinput, .field-wrapper textarea').off('change').on('click change', function () {
                    if ($(this).hasClass('errorclient')) {
                        $(this).removeClass('errorclient');
                        $(this).closest('.formfield').find('.label').find('span.errorclient').remove();
                        $(this).closest('.formfield').find('.label').removeClass('erroroccured');
                        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
                    } else {
                        return false;
                    }
                });
                $(this).find('.field-wrapper select').off('change').on('focusin change', function () {
                    if ($(this).hasClass('errorclient')) {
                        $(this).removeClass('errorclient');
                        $(this).closest('.formfield').find('.label').find('span.errorclient').remove();
                        $(this).closest('.formfield').find('.label').removeClass('erroroccured');
                        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
                    }
                });
            });
            $('#VIPInsider-form-cancel-id').on('click', function () {
                $('.ui-dialog-titlebar-close').trigger('click');
            });

            /********************* vip phone and zip error exceed code **************************/

            $('input[id$="_vipinsider_customer_zip"],input[id$="_vipinsider_customer_phone"]').on('keypress keyup', function (e) {
                var keycode = e.keyCode ? e.keyCode : e.which;
                var maxlength = $(this).attr('maxlength');
                var maxlmsg = 'This field is limited to ' + maxlength + ' characters.';
                if (jQuery(this).hasClass('vip-phone')) {
                    maxlength = 14;
                    $(this).attr('maxlength', maxlength);
                    maxlmsg = '-This field is limited to 10 numbers.';
                }
                if (jQuery(this).hasClass('vip-zip')) {
                    maxlength = 10;
                    $(this).attr('maxlength', maxlength);
                    maxlmsg = '-This field is limited to 9 numbers.';
                }
                if (keycode != 86) {
                    var maxElement = '<div class=\'maxelement hide\'>' + maxlmsg + '</div>';
                    if ($(this).val().length >= maxlength) {
                        if ($(this).closest('.field-wrapper').find('span.errorclient').length != 0) {
                            $(this).closest('.field-wrapper').find('span.errorclient').remove();
                        }
                        if ($(this).closest('.formfield').find('.maxelement').length == 0) {
                            $(this).closest('.formfield').find('.label').append(maxElement);
                        } else {
                            if ((keycode > 47 && keycode < 58)) {
                                $(this).closest('.formfield').find('.maxelement').removeClass('hide');
                                $(this).closest('.formfield').find('.label').addClass('erroroccured');
                                $(this).val($(this).val().substr(0, maxlength));
                                return false;
                            }
                        }
                    } else {
                        if ($(this).closest('.formfield').find('.maxelement').length > 0) {
                            $(this).closest('.formfield').find('.maxelement').remove();
                            $(this).closest('.formfield').find('.label').removeClass('erroroccured');
                        }
                    }
                }
            });
            //this is used after to remove the exceeding error message on blur for 1143 ticket
            jQuery('input[id$="_vipinsider_customer_zip"],input[id$="_vipinsider_customer_phone"]').on('blur', function () {
                if ($(this).closest('.formfield').find('.label').find('.maxelement').is(':visible')) {
                    $('.maxelement').addClass('hide');
                    $('#VipinsiderForm').find('span').removeClass('maxelement');
                    $(this).closest('.formfield').find('.label').removeClass('erroroccured');
                }
            });
        }
        /**------- left nav----------------*/
        $con.find('.categorymenusnew li.active').closest('.category-top-level').addClass('current');
        $con.find('.category-top-level').each(function () {
            if ($(this).hasClass('current')) {
                var $this = $('.categorymenusnew li.active');
                $this.find('> ul').show();
                $this.parents('ul').show();
                if ($this.find('> ul').length > 0) {
                    $this.find('> a .count-products').addClass('sublevelarrow');
                }
                $this.parents('li').not('li.active').find('> a .count-products').addClass('sublevelarrow');
                $this.find('li').each(function () {
                    if ($(this).find('> ul').length > 0) {
                        $(this).find('> a .count-products').addClass('select_sublevelarrow');
                    }
                });
            } else {
                if ($(this).find('> ul').length > 0) {
                    $(this).find('> a .count-products').addClass('select_sublevelarrow');
                }
            }
        });
        if (window.SessionAttributes.SHOW_COUNTRY_POPUP) {
            dialog.open({
                url: Urls.countrySelectorPopup,
                options: {
                    width: 325,
                    height: 575,
                    close: function () {
                        cookieprivacy();
                    }
                }
            });
        } else {
            cookieprivacy();
        }
    },
    synccheckoutH: function () {
        if ($('.pt_checkout').length > 0) {
            $('.item-cart-scrollbar').removeAttr('style');
            $('.pt_checkout .summary-section .slimScrollDiv').removeAttr('style');
            $('.item-cart-scrollbar').removeClass('scrollbar-active');
            $('.pt_checkout  .ajax-cartsummary').find('.summary-carttable').removeClass('scrollbar-is-active');
            $('.item-cart-scrollbar').slimScroll({destroy: true});
            var checkoutLeftH = $('.pt_checkout .checkout_cont').height(),
                summaryH = $('.pt_checkout .summary-section').height(),
                newsummaryH = $('.pt_checkout  .new-summery-cart').not('.mobile-view').height();

            var newHeightRight = summaryH + newsummaryH;
            if (newHeightRight >= checkoutLeftH) {
                var summaryHeight = checkoutLeftH - newsummaryH;
                var summaryHeightRightBottom = summaryHeight - 99;
                $('.pt_checkout .summary-section .slimScrollDiv').css({'height': summaryHeightRightBottom});
                $('.item-cart-scrollbar').addClass('scrollbar-active').css({'height': summaryHeightRightBottom});
                $('.item-cart-scrollbar').slimScroll({
                    railVisible: true,
                    color: '#a0a0a0',
                    alwaysVisible: true
                });
                $('.pt_checkout  .ajax-cartsummary').find('.summary-carttable').addClass('scrollbar-is-active');
            } else {
                $('.item-cart-scrollbar').css({'height': 'auto'});
                $('.pt_checkout .summary-section .slimScrollDiv').css({'height': 'auto', 'overflow-y': 'auto'});
                $('.item-cart-scrollbar').removeClass('scrollbar-active');
                $('.pt_checkout  .ajax-cartsummary').find('.summary-carttable').removeClass('scrollbar-is-active');
                $('.item-cart-scrollbar').slimScroll({destroy: true});
            }
        }
    }
}
module.exports = uievents;
