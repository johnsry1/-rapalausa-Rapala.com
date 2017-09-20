'use strict';

var account = require('./account'),
    bonusProductsView = require('../bonus-products-view'),
    quickview = require('../quickview'),
    validator = require('../validator'),
    cartStoreInventory = require('../storeinventory/cart');

/**
 * @private
 * @function
 * @description Binds events to the cart page (edit item's details, bonus item's actions, coupon code entry)
 */

function initQuickViewrecommButtons() {
    var $qvButton = $('.pt_cart .producttile #quickviewbutton');
    var $link = $(this).find('.thumb-link');
    $qvButton.attr({
        'href': $link.attr('href'),
        'title': $link.attr('title')
    }).appendTo(this);
    $qvButton.off('click').on('click', function (e) {
        e.preventDefault();
        quickview.show({
            url: $(this).attr('href').split('#')[0], //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
            source: 'quickview'
        });
    });
}

function initQuickVieweditButtons() {
    var $qvButton = $('.pt_cart  table#cart-table td.itemtotalcolumn.cartactions .item-edit-details #quickviewbutton');
    var $link = $(this);
    $qvButton.attr({
        'href': $link.attr('href'),
        'title': $link.attr('title')
    }).appendTo(this);
    $qvButton.off('click').on('click', function (e) {
        e.preventDefault();
        quickview.show({
            url: $(this).attr('href').split('#')[0], //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
            source: 'quickview'
        });
    });
}

function initializeEvents() {
    quickview.init();
    validator.init();
    initQuickViewrecommButtons();
    initQuickVieweditButtons();
    $('#cart-table').on('click', '.bonus-item-actions a, .item-details .bonusproducts a', function (e) {
        e.preventDefault();
        bonusProductsView.show(this.href);
    });
    /* used to slide toggle event in cart page promo code*/
    if ($('.pt_cart').length > 0) {
        $(this).find('.applycoupon .label').text('Have a Promo Code?');
        $('.couponcode .label').click(function () {
            var $curObj = $(this);
            var fieldSection = '';
            if ($(this).hasClass('pre_label')) {

                fieldSection = $curObj.closest('.cart-coupon-code').find('.promo-sec.pre-promo');
                if ($(fieldSection).is(':visible') == true) {
                    $(fieldSection).slideUp();
                } else {
                    $(fieldSection).slideDown();
                }
            } else if ($(this).hasClass('post-couponcode')) {
                fieldSection = $curObj.closest('.cart-coupon-code').find('.promo-sec.bottom-promo-section');
                if ($(fieldSection).is(':visible') == true) {
                    $(fieldSection).slideUp();
                } else {
                    $(fieldSection).slideDown();
                }
            }
        });
        var $curObj = $('.couponcode .label.post-couponcode');
        var fieldSection = $curObj.closest('.cart-coupon-code').find('.promo-sec.bottom-promo-section');
        if ($(fieldSection).length > 0) {
            if ($('.promo-sec.bottom-promo-section .error').length > 0) {
                $(fieldSection).slideDown();
                $('.promo-sec.bottom-promo-section').find('.couponinput').addClass('inputlabel');
                if ($(window).width() < 481) {
                    $('body, html').animate({
                        scrollTop: $('.couponcode .label.post-couponcode').offset().top
                    }, 600);
                }
            }
        }
        var $curObjtop = $('.couponcode .label.pre_label');
        var fieldSectiontop = $curObjtop.closest('.cart-coupon-code').find('.promo-sec.pre-promo');
        if ($(fieldSectiontop).length > 0) {
            if ($('.promo-sec.pre-promo .error').length > 0) {
                $(fieldSectiontop).slideDown();
                $('.promo-sec.pre-promo').find('.couponinput').addClass('inputlabel');
                $('body, html').animate({
                    scrollTop: $('.couponcode .label.pre_label').offset().top
                }, 600);
            }
        }

    }
    $('.promo-sec').find('.couponinput').click(function () {
        $('.promo-sec').find('.couponinput').removeClass('inputlabel');
    });

    var cartpromo = $('.pt_cart .upshift.cell.contentbox .contentboxcontent table#cart-table tr.cart-row td.itemtotalcolumn');
    cartpromo.each(function () {
        if ($(this).find('.promo-adjustment').length >= 1) {
            $(this).addClass('promodiv');
        } else {
            $(this).removeClass('promodiv');
        }
    });

    $('body').on('click', '.cartcoupon-apply', function () {
        var $curObj = $('.couponcode .label');
        var fieldSection = '';
        if ($(this).closest('.bottom-promo-section').length > 0) {
            $('.promo-applied-position').val('bottomsection');
            $('.promo-applied-position').attr('value', 'bottomsection');
            fieldSection = $curObj.closest('.cart-coupon-code').find('.promo-sec.bottom-promo-section');
            if ($(fieldSection).length > 0) {
                if ($('.error').length > 0) {
                    $(fieldSection).slideDown();
                    $('.promo-sec.bottom-promo-section').find('.couponinput').addClass('inputlabel');
                }
            }
        } else if ($(this).closest('.top-promo-section').length > 0) {
            $('.promo-applied-position').val('topsection');
            $('.promo-applied-position').attr('value', 'topsection');
            fieldSection = $curObj.closest('.cart-coupon-code').find('.promo-sec.top-promo-section');
            if ($(fieldSection).length > 0) {
                if ($('.error').length > 0) {
                    $(fieldSection).slideDown();
                    $('.promo-sec.top-promo-section').find('.couponinput').addClass('inputlabel');
                }
            }
        }
    });
    $('.pt_cart .cartrecommads_cont').css('height', '44px');
    // override enter key for coupon code entry
    $('form input.couponinput').on('keydown', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $(this).closest('form').find('.cartcoupon-apply').click();
        } // JIRA PREV-30 : Cart page:  Coupon Code is not applying, when the user hit enter key.
    });

    $('body').on('change,input', function () {
        var $curObj = $(this);
        $('body').find('.couponinput').val($curObj.val());
        $('body').find('.couponinput').attr('value', $curObj.val());
    });
    //to prevent multiple submissions of the form when removing a product from the cart
    var removeItemEvent = false;
    $('button[name$="deleteProduct"]').on('click', function (e) {
        if (removeItemEvent) {
            e.preventDefault();
        } else {
            removeItemEvent = true;
        }
    });
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 3,
        slideBy: 3,
        rewind: true,
        nav: true,
        loop: true,
        dots: false
    });
}

exports.init = function () {
    initializeEvents();
    if (SitePreferences.STORE_PICKUP) {
        cartStoreInventory.init();
    }
    account.initCartLogin();
};
