/**
 *    (c) 2009-2014 Demandware Inc.
 *    Subject to standard usage terms and conditions
 *    For all details and documentation:
 *    https://bitbucket.com/demandware/sitegenesis
 */
'use strict';

var countries = require('./countries'),
    dialog = require('./dialog'),
    minicart = require('./minicart'),
    page = require('./page'),
    searchplaceholder = require('./searchplaceholder'),
    searchsuggest = require('./searchsuggest'),
    tooltip = require('./tooltip'),
    util = require('./util'),
    validator = require('./validator'),
    megamenu = require('./megamenu'),
    headerinit = require('./headerinit'),
    uievents = require('./uievents'),
    //progress = require('./progress'),
    tls = require('./tls'),
    imagesLoaded = require('imagesloaded'),
    tagmanager = require('./tagmanager');

// if $ has not been loaded, load from google cdn
if (!window.$) {
    var s = document.createElement('script');
    s.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/$/1.7.1/$.min.js');
    s.setAttribute('type', 'text/javascript');
    document.getElementsByTagName('head')[0].appendChild(s);
}

require('./jquery-ext')();
require('./cookieprivacy')();
require('./captcha')();
require('picturefill');

var $ = window.$;

function resetPasswordEvents() {
    $('body').find('.PasswordResetDialog .field-wrapper input').off('change').on('click change', function () {
        $(this).removeClass('errorclient');
        $(this).closest('.passwordreset').find('#message').hide();
        $(this).closest('.formfield').find('.label').find('span.errorclient').remove();
        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
    });
    if ($('.PasswordResetDialog').length > 0) {
        $('.PasswordResetDialog').find('.formfield').each(function () {
            if ($(this).find('.field-wrapper .clearbutton').length == 0 && $(this).find('.field-wrapper input[type="text"]').length > 0 || $(this).find('.field-wrapper input[type="password"]').length > 0) {
                $(this).find('.field-wrapper').append('<a class="clearbutton"></a>');
            }
        });
    }
    $('body').find('.PasswordResetDialog a.clearbutton').on('click', function () {
        $(this).closest('.field-wrapper').find('span').remove();
        $(this).closest('.field-wrapper').find('.required').removeClass('errorclient');
        $(this).closest('.formfield ').find('.form-row , .label span').removeClass('inputlabel');
        $(this).closest('.formfield').find('input').val('');
        $(this).closest('.formfield').find('a.clearbutton').hide();
        $(this).closest('.formfield').find('span.logerror , .existing_register').hide();

    });
    // Attach keypress handler to input box.  Submit form if user presses 'enter' key.
    $('body').find('.PasswordResetDialog input.resetold').keypress(function (e) {
        if (e.which == 13) {
            //$('#sendBtn').trigger('click');
            return false;
        }
        return true;
    });
    $('body').find('.PasswordResetDialog .field-wrapper input').on('keyup input blur', function () {
        if ($(this).val() != undefined) {
            if ($(this).val().length > 0) {
                $(this).closest('.formfield').find('a.clearbutton').show();
            } else {
                $(this).closest('.formfield').find('a.clearbutton').hide();
            }
        }
    });
    var $requestPasswordForm = $('[name$="_requestpassword"]'),
        $submit = $requestPasswordForm.find('[name$="_requestpassword_send"]');
    $($submit).on('click', function (e) {
        if (!$requestPasswordForm.valid()) {
            return;
        }
        e.preventDefault();
        dialog.submit($submit.attr('name'));
        setTimeout(function () {
            resetPasswordEvents();
        }, 1300);
    });
    validator.init();
}
function changeRegionPopUp() {
    $('.haspop').each(function(){
        $(this).on('click', function(e) {
            e.preventDefault();
            var id = $(this).data('id'),
                name = $(this).data('name');
            dialog.open({
                url: util.appendParamToURL(Urls.internationalHomeCountyPopUp, 'coid', id),
                options: {
                    title: name,
                    dialogClass: 'change-region-popup',
                    height: 500,
                    width: 500
                }
            });
        });
    });
}

function initializeEvents() {
    var isSafari = navigator.userAgent.indexOf('Safari') > -1;
    var isChrome = navigator.userAgent.indexOf('Chrome') > -1;
    var isExplorer = navigator.userAgent.indexOf('MSIE') > -1;
    var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
    //var is_safari = navigator.userAgent.indexOf('Safari') > -1;
    var isOpera = navigator.userAgent.toLowerCase().indexOf('op') > -1;
    if ((isChrome) && (isSafari)) {
        isSafari = false;
    }
    if ((isChrome) && (isOpera)) {
        isChrome = false;
    }
    if (isSafari) {
        $('body').addClass('safari-browser');
    } else if (isFirefox) {
        $('body').addClass('firefox-browser');
    } else if (isExplorer) {
        $('body').addClass('ie-browser');
    } else if (isChrome) {
        $('body').addClass('chrome-browser');
    }
    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
        $('body').addClass('mac');
    } else {
        $('body').addClass('pc');
    }
    var controlKeys = ['8', '13', '46', '45', '36', '35', '38', '37', '40', '39'];

    //PREVAIL-Added to handle form dialog boxes server side issues.
    $('body').on('click', '.dialogify, [data-dlg-options], [data-dlg-action]', require('./dialogify').setDialogify)
        .on('keydown', 'textarea[data-character-limit]', function (e) {
            var text = $.trim($(this).val()),
                charsLimit = $(this).data('character-limit'),
                charsUsed = text.length;

            if ((charsUsed >= charsLimit) && (controlKeys.indexOf(e.which.toString()) < 0)) {
                e.preventDefault();
            }
        })
        .on('change keyup mouseup', 'textarea[data-character-limit]', function () {
            var text = $.trim($(this).val()),
                charsLimit = $(this).data('character-limit'),
                charsUsed = text.length,
                charsRemain = charsLimit - charsUsed;

            if (charsRemain < 0) {
                $(this).val(text.slice(0, charsRemain));
                charsRemain = 0;
            }

            $(this).next('div.char-count').find('.char-remain-count').html(charsRemain);
        });

    /**
     * initialize search suggestions, pending the value of the site preference(enhancedSearchSuggestions)
     * this will either init the legacy(false) or the beta versions(true) of the the search suggest feature.
     * */

    /*** minicart hide ***/
    var minicartlink = $('#headerwrapper #header .row.column1 #minicart .minicarttotal .minicarticon-cont .minicart-button');
    minicartlink.on('click', function () {
        if ($(window).width() < 959) {
            $('#minicart .minicartcontent').hide();
        }
    });

    var $searchContainer = $('.site-suggestion-section');
    searchsuggest.init($searchContainer, Resources.SIMPLE_SEARCH);

    $('#password-reset').on('click', function (e) {
        e.preventDefault();
        dialog.open({
            url: $(e.target).attr('href'),
            options: {
                //Start JIRA PREV-334 : Title is missing for the Forgot password overlay.
                title: Resources.FORGOT_PASSWORD,
                width: 475,
                dialogClass: 'PasswordResetDialog',
                open: function () {
                    resetPasswordEvents();
                }
            }
        });
    });

    // print handler
    $('.print-page').on('click', function () {
        window.print();
        return false;
    });

    $('.mobile-banner-stuff').on('click', function (e) {
        e.preventDefault();
        if ($('.calloutexist').length > 0) {
            var promoCallOut = $('.calloutexist').html();
            var bannerDialogOpen = dialog.create({
                target: '#calloutexist',
                options: {
                    dialogClass: 'dialogBanner'
                }
            });
            util.scrollBrowser($('html').offset().top);
            bannerDialogOpen.html(promoCallOut);
            $('.ui-dialog-content:visible').each(function () {
                $(this).dialog('option', 'position', $(this).dialog('option', 'position'));
            });
            bannerDialogOpen.dialog('open');
        }
    });
    $(document).on('click', '.dialogBanner #closeBtn01', function (e) {
        e.preventDefault();
        $(this).parents('.dialogBanner').find('.ui-dialog-titlebar-close').trigger('click');
    });
    //footer change region event
    $('.change-region-footer').on('hover', function () {
        $('.domainswitch').show();
    }, function () {
        $('.domainswitch').hide();
    });

    // Footer copyright year
    $('.copyright-year').html(new Date().getFullYear());

    // Footer Brands carousel
    $('#footer-brands').owlCarousel({
        items: 5,
        slideBy: 5,
        margin: 0,
        navRewind: false,
        rewind: false,
        nav: true,
        dots: false,
        navigation: false,
        autoWidth: true,
        responsive: {
            0: {
                items: 3
            },
            567: {
                items: 5
            }
        }
    });
    /* should be set before slider init */
    $('.horizontal-carousel').each(function() {
        var $tiles = $(this).find('.product-tile');
        if ($tiles.length === 0) { return; }
        if ($tiles.length > 1 && $tiles.is('[style]')) {
            $tiles.removeAttr('style');
        }
        imagesLoaded($(this)).on('always', function () {
            $tiles.syncHeight()
                .each(function (idx) {
                    $(this).data('idx', idx);
                });
        });
        $(this).on('initialized.owl.carousel changed.owl.carousel refreshed.owl.carousel', function(event) {
            if (!event.namespace) return;
            var carousel = event.relatedTarget,
                element = event.target,
                current = carousel.current();
            $('.owl-next', element).toggleClass('disabled', current === carousel.maximum());
            $('.owl-prev', element).toggleClass('disabled', current === carousel.minimum());

        });
    });
    $('.horizontal-carousel').each(function() {
        $(this).owlCarousel({
            items: 4,
            slideBy: 4,
            nav: true,
            loop: false,
            dots: true,
            responsive: {
                0: {
                    items: 2,
                    slideBy: 2,
                    nav: false
                },
                567: {
                    items: 3,
                    slideBy: 3,
                    nav: false
                },
                768: {
                    items: 4,
                    slideBy: 4,
                    nav: true
                }
            }
        });
    });
    $('.horizontal-carousel').each(function() {
        $(this).on('changed.owl.carousel', function (event) {
            if (event.item.count - event.page.size == event.item.index)
                $(event.target).find('.owl-dots div:last')
                    .addClass('active').siblings().removeClass('active');
        });
    });
    $('.domainswitch').on('hover', function () {
        $(this).show();
    }, function () {
        $(this).hide();
    });
    $('div.pseudo_self_label').each(
        function () {
            var $this = $(this);
            var $input = $this.children('input[type="text"]');
            $input.data('toggle', $input.val());
            //used to add a class to placeholder for styling
            if ($('.emailinput.emailfooter').attr('data-placeholder') == $input.val()) {
                $('.emailinput.emailfooter').addClass('footerplace');
            }

            $input.on('blur', function () {
                var $this = $(this);
                if ($.trim($this.val()) == '') {
                    $this.val($this.data('toggle'));
                    if ($('.emailinput.emailfooter').attr('data-placeholder') == $input.val()) {
                        $('.emailinput.emailfooter').addClass('footerplace');
                    }
                }
            });

            $input.on('focus', function () {
                $('.emailinput.emailfooter').removeClass('footerplace');
                var $this = $(this);
                if ($this.data('toggle') && ($.trim($this.val()) == $.trim($this.data('toggle')))) {
                    $this.val('');
                }
            });

            $this.parents('form').on('submit', function () {
                var $this = $(this);
                $this.find('div.pseudo_self_label input').each(function () {
                    var $this = $(this);
                    if ($this.data('toggle') && $this.data('toggle') == $this.val()) {
                        $this.val('');
                    }
                });
            });
        });

    //
    $('body').on('submit', '#customercontactus', function (e) {
        e.preventDefault();
        var $form = $(this);
        if ($form.valid()) {
            // serialize the form and get the post url
            var data = $form.serialize();
            var url = $form.attr('action');
            if (data.indexOf('ajax') === -1) {
                data += '&format=ajax';
            }

            $.ajax({
                url: url,
                type: 'POST',
                data: data
            }).done(function (response) {
                $('.column.colspan2').empty().html(response);
            });
        }
    });

    $('.first-level').on('click', function () {
        $(this).children('.second-level').toggle();
        $(this).toggleClass('list-active');
    });
    $('.first-level li.active').closest('.first-level').trigger('click');
    $('.first-level li a').on('click', function (event) {
        event.stopPropagation();
    });
    $('.first-levell').on('click', function () {
        $(this).children('.second-levell').toggle();
        //$(this).toggleClass('list-active');
    });
    $(window).on('load', function () {
        var currentItem = null;
        if ($('.newMargin').length > 0) {
            currentItem = $('.newMargin');
            currentItem.parents('.cell-header').addClass('new-margin-update');
        }
        if ($('.newMargin-one').length > 0) {
            currentItem = $('.newMargin-one');
            currentItem.parents('.cell-header').addClass('new-margin-updateone');
        }
        if ($('.vmc-manufacturer-margin').length > 0) {
            currentItem = $('.vmc-manufacturer-margin');
            currentItem.parents('.cell-header').addClass('manufacture-margin-update');
        }
        if ($('.strikemaster-paragraph').length > 0) {
            currentItem = $('.strikemaster-paragraph');
            currentItem.parents('.cell-header').addClass('strikemaster-margin-update');
        }
        var spancountleftnav = $('.pt_customerservice .customer .column .contentbox .left-nav-top .contentboxcontent .nav-group li span');
        spancountleftnav.each(function () {
            if ($(this).height() > 19) {
                $(this).addClass('newone');
            } else {
                $(this).removeClass('newone');
            }
        });
        spancountleftnav = $('.pt_customerservice .style-cservice .column .contentbox .left-nav-top .contentboxcontent .nav-group li span');
        spancountleftnav.each(function () {
            if ($(this).height() > 19) {
                $(this).addClass('newone');
            } else {
                $(this).removeClass('newone');
            }
        });
        if ($('.shadow-box').length > 0) {
            currentItem = $('.shadow-box');
            currentItem.parents('.pt_customerservice').addClass('pt_customerservice-box');
        }
        if ($('.zero-margin').length > 0) {
            currentItem = $('.zero-margin');
            currentItem.parents('.cell-header').addClass('zero-margin-cell-header');
        }
        if ($('.checkoutloginsignin').find('.TokenExpired').length > 0) {
            $('#password-reset').trigger('click');
            setTimeout(function () {
                $('#dialog-container').find('p').hide();
                if ($('#dialog-container #PasswordResetForm').length > 0) {
                    $('#dialog-container #PasswordResetForm').prepend('<div class="TokenExpireError">We&#39;re sorry, the link to reset your password has expired. Reset Password links expire after 30 minutes for security purposes. Please submit your email again.</div>');
                    $('#dialog-container #PasswordResetForm .passwordemail').prepend('<div class="Emaillabel">Enter your email address to get reset password instructions sent to your inbox.</div>');
                }
            }, 2000);
        }
    });
    $(window).on('resize', function () {
        if ($(window).width() > 960) {
            if ($('#container').hasClass('js-container-active')) {
                $('#container, .open-menu-wrap').removeAttr('style');
                $('#container').removeClass('js-container-active').find('.menu-toggle').removeClass('js-menu-toggle');
                $('#main, #footernew').unwrap();
                $('#brand-tabs-header').unwrap();
            }
            // Disable mobile nav
            $('.sub-category-section-2').slideUp();
            $('.sub-category-section-1').removeClass('js-active-sub-menu');
            //megamenu.init();
        }
    });
    // add generic toggle functionality
    $('.toggle').next('.toggle-content').hide();
    if ($('.pt_checkout').length == 0) {
        if ($('.pt_customerservice').length == 0) {
            $('.toggle').off('click').on('click', function (e) {
                e.preventDefault(); //JIRA PREV-90 : When click on advance search from gift registry login page, focus is happening towards top of the page.
                $(this).toggleClass('expanded').next('ul, .toggle-content').toggle();
            });
        }
    }
    // toggle for customer service FAQ
    if ($('.pt_customerservice').length > 0) {
        $('.section a.toggle').off('click').on('click', function (e) {
            e.preventDefault();
            $(this).parent().next('.reveal').slideToggle('fast', function () {
            });
            return false;
        });
    }

    $('#footernew .footer-main #linkheading').on('click', function () {
        $(this).toggleClass('show');
        $(this).closest('div').toggleClass('expanded');
        if ($('#about, #customer-service, #More-ways-to-shop').hasClass('expanded')) {
            $('#rapala_insider').addClass('new');
        } else {
            $('#rapala_insider').removeClass('new');
        }
        if ($('#busniness').hasClass('expanded')) {
            $('#follow_us').addClass('new');
        } else {
            $('#follow_us').removeClass('new');
        }
    });

    function isTouchDevice() {
        return true == ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
    }

    if (isTouchDevice() === true) {
        //alert('Touch Device'); //your logic for touch device here
        $('.old-swim').removeClass('show').addClass('hide');
        $('.new-swim').removeClass('hide').addClass('show');
    } else {
        //alert('Not a Touch Device');//your logic for non touch device here
        $('.old-swim').removeClass('hide').addClass('show');
        $('.new-swim').removeClass('show').addClass('hide');
    }
    $(window).bind('scroll resize', function () {
        if ($('.rapala_device').length > 0 && $(window).width() < 768) {
            if ($('#footerEmailDialog.ui-dialog-content').length > 0) {
                $('.ui-dialog').css({'left': ($(document).width() - $('.ui-dialog').width()) / 2, 'top': '100px'});
            } else {
                $('.ui-dialog').css({'left': ($(document).width() - $('.ui-dialog').width()) / 2});
            }

        }
    });

    $('.tabsHeader').bind('click', function () {
        var currentItem = $(this);
        currentItem.closest('.mobile-tabs-section').toggleClass('active');
    });

    $(document).on('click', '.upgradenow-link', function () {
        $('html, body').animate({
            scrollTop: $('.viploginsignin').offset().top
        }, 2000);
    });
    $('.menu-category li .menu-item-toggle').on('click', function (e) {
        e.preventDefault();
        var $parentLi = $(e.target).closest('li');
        $parentLi.siblings('li').removeClass('active').find('.menu-item-toggle').removeClass('fa-chevron-up active').addClass('fa-chevron-right');
        $parentLi.toggleClass('active');
        $(e.target).toggleClass('fa-chevron-right fa-chevron-up active');
    });

    $('body').on('click', '.dialog-close', function () {
        $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').trigger('click');
    });
    if ($(window).width() > 959) {
        var item = $('.sign-up-blk'),
            clickItem = item.find('.userlogin');

        clickItem.on('click', function () {
            return false;
        });
    }

    $('.email-subscribe').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        if ($form.valid()) {
            // set the action
            $('<input/>').attr({
                name: $form.attr('action'),
                type: 'hidden'
            }).appendTo($form);
            // serialize the form and get the post url
            var data = $form.serialize();
            var url = $form.attr('action');
            // make sure the server knows this is an ajax request
            if (data.indexOf('ajax') === -1) {
                data += '&format=ajax';
            }

            dialog.open({
                url: url,
                data: data,
                options: {
                    title: 'email',
                    width: 800,
                    height: 530,
                    dialogClass: 'footerEmailDialog'
                },
                open: function () {
                }
            });
        }
    });
    $('body .formfields-global').find('input').on('focusin', function () {
        $(this).closest('.formfield, .form-row').removeClass('inputlabel');
        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
        $(this).removeClass('errorclient');
    });
    $('body .formfields-global').find('select').on('focusin', function () {
        $(this).closest('.formfield, .form-row').removeClass('inputlabel');
        $(this).closest('.formfield').find('.form-row , .label span').removeClass('inputlabel');
        $(this).removeClass('errorclient');
        $(this).parent('.select-style').removeClass('select-style-error');
    });
    if ($('.remove-bottom-button').length > 0) {
        $('.style-cservice').find('.content-back-button').remove();
    }
}
/**
 * @private
 * @function
 * @description Adds class ('js') to html for css targeting and loads js specific styles.
 */
function initializeDom() {
    // add class to html for css targeting
    $('html').addClass('js');
    if (SitePreferences.LISTING_INFINITE_SCROLL) {
        $('html').addClass('infinite-scroll');
    }
    // load js specific styles//
    util.limitCharacters();
    //check login status
    util.loggedInStatus();
    /*setInterval(timeoutModal, 1000);
    function timeoutModal(){
        if (window.isAuthenciatedUser && document.cookie && document.cookie.indexOf('loginStatus') == -1) {
            dialog.open({
                html: Resources.SESSION_TIMEOUT_MODAL,
                options: {
                    width: 280,
                    height: 250,
                    dialogClass: 'session-warning',
                    close: function () {
                        window.isAuthenciatedUser = false;
                    },
                    buttons: [{
                        text: 'Log In',
                        click: function(){
                            window.location.replace(Urls.accountShow);
                        },
                        class : 'greybutton timeout-modal-redirect'
                    }]
                }
            })
        }
    }*/
    // Make sure that the SVGs work properly in older browsers
    /*eslint-disable */
    svg4everybody();
    /*eslint-enable */
}


var pages = {
    account: require('./pages/account'),
    cart: require('./pages/cart'),
    checkout: require('./pages/checkout'),
    compare: require('./pages/compare'),
    product: require('./pages/product'),
    registry: require('./pages/registry'),
    search: require('./pages/search'),
    storefront: require('./pages/storefront'),
    wishlist: require('./pages/wishlist'),
    rapalainsider: require('./pages/rapalainsider'),
    storelocator: require('./pages/storelocator'),
    blog: require('./pages/blog')
};

var app = {
    init: function () {
        if (typeof geoipCountryCode == 'function') {
            var IPGeoCode = geoipCountryCode();
            var allowedCountries = $('.allowed-countries').text();
            if (allowedCountries == null || allowedCountries == 'null' || allowedCountries == 'undefined') {
                allowedCountries = 'US';
            }
            if (allowedCountries.indexOf(IPGeoCode) == -1) {
                $('html').addClass('no-pricing');
                $('.non-usa-alert').removeClass('hide');
                $('.ui-customer,.dividers.pipe,.ui-email,.ui-storelocator,.ui-wishlist,.ui-login,.handle-non-us,.welcomemessage,.anonymous,.site-suggestion-section').addClass('hide');
                $('.minicart, .promotional-message, .product-colors-size').css({'display': 'none'});
                $('#customer-returns,#customer-shipping,#customer-warranty').addClass('hide');
                $('.addtowishlist').addClass('hide');
                $('.non-us-contactus geo,.us-contactus').addClass('hide');
                $('.non-us-contactus-non').removeClass('hide');
                $('.desktopHide.handle-non-us.geo').removeClass('desktopHide');
                $('.mobileHide.handle-non-us.geo').removeClass('mobileHide');
                var contactusNonusUrl = Urls.contactusnonus;
                $('.handle-non-us.geo').addClass('hide');
                $('.ca-contactus-link').attr('href', contactusNonusUrl);
                $('.cust-non-us').find('a').attr('href', contactusNonusUrl);
                $('.ui-login,.magnifier-icon').css({'background': 'none'});
                $('.handle-non-us-vh').addClass('vhide');
                $('.userregister').css({'display': 'none'});
                $('.currency-selector').css({'display': 'none'});
                $('.currency-flag').css({'display': 'none'});
                $('.change-regionnew currency-selector').css({'display': 'none'});
                $('.email-signup').css({'display': 'none'});
                setTimeout(function () {
                    $('.product-promo, .newrecommendation').css({'display': 'none'});
                }, 5000);

            }
        }

        // Check TLS status if indicated by site preference
        var checkTLS = SitePreferences.CHECK_TLS;
        if (checkTLS == true) {
            var tlsBroswer = tls.getUserAgent();
            if ((tlsBroswer.name == 'Chrome' && tlsBroswer.version < 22) || (tlsBroswer.name == 'Firefox' && tlsBroswer.version < 27) || (tlsBroswer.name == 'Safari' && tlsBroswer.version < 5) || (tlsBroswer.name == 'MSIE' && tlsBroswer.version < 11)) {
                if (tlsBroswer.name == 'MSIE') {
                    tlsBroswer.name = 'Internet Explorer';
                }
                $('.browser-compatibility-alert').removeClass('hide');
                $('.browser-compatibility-alert p').find('.browser_version').text(' ' + tlsBroswer.name + ' ' + tlsBroswer.version + '.');
            }
        }
        initializeDom();
        // init specific global components
        countries.init();
        tooltip.init();
        minicart.init();
        validator.init();
        uievents.init();
        megamenu.init();
        headerinit.init();
        searchplaceholder.init();
        if (SitePreferences.GTM_ENABLED) {
            tagmanager.init(window.pageContext.ns);
        }

        // execute page specific initializations
        $.extend(page, window.pageContext);
        var ns = page.ns;
        if (ns && pages[ns] && pages[ns].init) {
            pages[ns].init();
        }
        initializeEvents();
        changeRegionPopUp();
        require('./browsera').init();
        if (!util.isMobile()) {
            $('body').addClass('desktop-device');
        }
        $('.sub-category-section-3').each(function(){
            if ($(this).children().length == $(this).children('.mobileHide').length) {
                $(this).parents('.sub-category-section-1').addClass('no-desktop-menu');

            }
        });

    }
};

// general extension functions
(function () {
    String.format = function () {
        var s = arguments[0];
        var i, len = arguments.length - 1;
        for (i = 0; i < len; i++) {
            var reg = new RegExp('\\{' + i + '\\}', 'gm');
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    };
})();

$(function () {
    $('.accordion')
        .on('hover', function () {
            var $this = $(this);
            if ($this.hasClass('highlight')) {
                $this.addClass('contentbox');
            } else {
                $this.removeClass('contentbox').addClass('tabover');
            }
        },
            function () {
                $(this).removeClass('tabover').addClass('contentbox');
            }
        ).on('click', function () {
            var $this = $(this);
            if ($this.find('.expandcontent').length > 0) {
                $this.find('h1').toggleClass('downarrow').next().toggle('fast');
                $this.toggleClass('highlight').toggleClass('tabover').toggleClass('contentbox');
            } else {
                window.location.href = $this.find('a').attr('href');
            }
        });
});

// initialize app
$(document).ready(function () {
    app.init();
});
