'use strict';

var util = require('./util');
    //bonusProductsView = require('./bonus-products-view');

var timer = {
    id: null,
    clear: function () {
        if (this.id) {
            window.clearTimeout(this.id);
            delete this.id;
        }
    },
    start: function (duration, callback) {
        this.id = setTimeout(callback, duration);
    }
};

var minicart = {
    url: util.ajaxUrl(Urls.addProduct),
    init: function () {
        minicart.reset();
        $('.checkoutminicart').slimscroll();
        this.$el = $('#minicart');
        this.$content = this.$el.find('.minicartcontent');
        jQuery('.minicarticon-cont').on('mouseover touchstart', function () {
            if (!minicart.isShow()) {
                minicart.hoverSlide();
            }
            $('.Custom-tooltip, .cvc_tooltip, .ordergothrough_tooltip').each(function () {
                if ($('.rapala_device').length == 1) {
                    jQuery(this).tooltipster({
                        content: jQuery(this).find('.tooltipcontainer').html(),
                        contentAsHTML: true,
                        maxWidth: 300,
                        touchDevices: true,
                        trigger: 'click'
                    });
                } else {
                    jQuery(this).tooltipster({
                        content: jQuery(this).find('.tooltipcontainer').html(),
                        contentAsHTML: true,
                        maxWidth: 300,
                        touchDevices: true
                    });
                }
            });

        });
        // register close button event
        $('.minicartcontent .minicartclose').on('click', function () {
            // reset all the events bindings
            minicart.reset();
            minicart.close(0);
            $('.rapala_device .minicart-button').removeClass('clicked');
        });
        $('.minicartcontent').on('click', function () {
            clearTimeout(minicart.timer);
            minicart.timer = null;
        });
        $('.minicart').on('mouseenter', function () {
            minicart.setminicarheight();
            clearTimeout(minicart.timer);
            minicart.timer = null;
            if ($('.minicartcontent').is(':animated')) {
                $('.minicartcontent').stop();
                $('.minicartcontent').css({'opacity': '1', 'height': 'auto'});
                minicart.init();
            }
        }).on('mouseleave', function () {
            $('.rapala_device .minicart-button').removeClass('clicked');
            clearTimeout(minicart.timer);
            minicart.timer = null;
            // after a time out automatically close it
            minicart.timer = setTimeout(
                'minicart.close()', 30);
            minicart.close();
        });

        if ($('.mini-cart-product').length > 1) {
            $('.minicartcontent').removeClass('lessone');
            $('.minicartcontent .slimScrollDiv').removeClass('less');
        } else {
            $('.minicartcontent').addClass('lessone');
            $('.minicartcontent .slimScrollDiv').addClass('less');
        }

    },

    // returns a boolean if a minicart is visible/shown or hidden
    isShow: function () {
        return jQuery('.minicartcontent').css('display') == 'none' ? false : true;
    },

    // reset minicart
    reset: function () {
        jQuery('.minicarticon-cont').off('hover');
        jQuery('.minicart').off('mouseenter').off(
            'mouseleave');
    },

    enablehovereffect: function () {
        jQuery('.minicarttotal').on('mouseenter', function () {
            minicart.setminicarheight();
            //clearTimeout(minicart.timer);
            //minicart.timer = null;
            timer.clear();
            if ($('.minicartcontent').is(':animated')) {
                $('.minicartcontent').stop();
                $('.minicartcontent').css({'opacity': '1', 'height': 'auto'});
                minicart.init();
            }

        });
        jQuery('.minicarttotal').on('mouseleave', function () {
            jQuery('.minicartcontent').fadeOut(1000);
            $('.rapala_device .minicart-button').removeClass('clicked');

        });

    },
    /**
     * @function
     * @description Shows the given content in the mini cart
     * @param {String} A HTML string with the content which will be shown
     */
    // shows the given content in the mini cart
    show: function (html) {
        jQuery('#minicart').html(html);
        // bind all the events
        minicart.init();
        if (minicart.suppressSlideDown && minicart.suppressSlideDown()) {
            // do nothing
            // the hook 'MiniCart.suppressSlideDown()' should have done
            // the refresh
        } else {
            minicart.slide();
        }
    },
    setminicarheight: function () {
        var scrollheight = $('.mini-cart-product:eq(0)').height();
        if ($('.mini-cart-product').length > 1) {
            var scrollheight2 = $('.mini-cart-product:eq(1)').height();
            var avgheight = (scrollheight + scrollheight2) / 2;
            var newscrollheight = ((avgheight) + (avgheight - (avgheight / 4))) + 20;

            $('.slimScrollDiv').css('height', newscrollheight + 'px');
            $('.checkoutminicart').css('height', newscrollheight + 'px');
        } else {
            var heightImg = $('.minibrandcolumn').find('a').height();
            var heightImg1 = $('.minibrandcolumn').find('img').height();

            while (scrollheight < heightImg + heightImg1) {
                heightImg = $('.minibrandcolumn').find('a').height();
                scrollheight = $('.tr_rotation').height();
                $('.slimScrollDiv').css('height', scrollheight + 'px');

                var scrollheight1 = $('.checkoutminicart').height();
                if (scrollheight1 > scrollheight) {
                    $('.checkoutminicart').css('height', scrollheight1 + 'px');
                } else {
                    $('.checkoutminicart').css('height', scrollheight + 'px');
                }
            }
        }
    },
    // hook which can be replaced by individual pages/page types (e.g.
    // cart)
    suppressSlideDown: function () {
        return false;
    },
    /**
     * @function
     * @description Slides down and show the contents of the mini cart
     */
    slide: function () {
        timer.clear();
        // show the item
        this.$content.slideDown('slow');
        // after a time out automatically close it
        timer.start(3000, this.close.bind(this));

        if (minicart.suppressSlideDown && minicart.suppressSlideDown()) {
            return;
        }
        // register close button event
        jQuery('.minicartcontent .minicartclose').on('click', function () {
            // reset all the events bindings
            minicart.reset();
            minicart.close(0);
            $('.rapala_device .minicart-button').removeClass('clicked');
        });

        //Removing padding from the banner if it doesnot contains data/image
        if ($('.slot_banner').find('img').length == 0) {
            $('.slot_banner').css('padding', '0 0 0px 0');
        }

        // register the mouseout events
        jQuery('.minicartcontent').on('mouseenter', function () {
            minicart.setminicarheight();
            clearTimeout(minicart.timer);
            minicart.timer = null;
            if ($(this).is(':animated')) {
                $(this).stop();
                $(this).css({'opacity': '1', 'height': 'auto'});
                minicart.init();
            }
        });
        $('.minicart').on('mouseleave', function () {
            $('.rapala_device .minicart-button').removeClass('clicked');
            clearTimeout(minicart.timer);
            minicart.timer = null;
            // after a time out automatically close it
            minicart.timer = setTimeout(
                'minicart.close()', 30);
            minicart.init();
            minicart.close();
        });

        // show the item
        jQuery('.minicartcontent').slideDown('2000', function () {
            minicart.setminicarheight();
        });
        // show("slide",
        // { direction:
        // "up" },
        // 1000);

        // add the open class to the total
        jQuery('.minicart .minicarttotal').addClass('open');

        jQuery('.summaryproduct').each(
            function () {
                var $this = jQuery(this);
                var height = '';
                if ($this.find('.imageexpanded').is(':visible')) {
                    $this.find('.hideoncollapse').hide().end()
                        .find('.attribute').addClass(
                        'collapsed');
                    height = $(this).find('.attributes').height();
                    height += $(this).find('.name').height();
                    jQuery(this).find('.image').css({
                        'min-height': height
                    });
                }
                if ($this.find('.imagecollapsed').is(':visible')) {
                    height = $(this).find('.attributes').height();
                    height += $(this).find('.name').height() + 30;
                    jQuery(this).find('.image').css({
                        'min-height': height
                    });
                }
            });

        clearTimeout(minicart.timer);
        minicart.timer = null;

        // after a time out automatically close it
        minicart.timer = setTimeout('minicart.close()', 1000);

    },
    hoverSlide: function () {
        if (minicart.suppressSlideDown && minicart.suppressSlideDown()) {
            return;
        }
        // register close button event
        jQuery('.minicartcontent .minicartclose').on('click', function () {
            // reset all the events bindings
            minicart.reset();
            minicart.close(0);
            $('.rapala_device .minicart-button').removeClass('clicked');
        });

        //Removing padding from the banner if it doesnot contains data/image
        if ($('.slot_banner').find('img').length == 0) {
            $('.slot_banner').css('padding', '0 0 0px 0');
        }

        // register the mouseout events
        jQuery('.minicartcontent').on('mouseenter', function () {
            minicart.setminicarheight();
            clearTimeout(minicart.timer);
            minicart.timer = null;
            if ($(this).is(':animated')) {
                $(this).stop();
                $(this).css({'opacity': '1', 'height': 'auto'});
                minicart.init();
            }
        });
        $('.minicart').on('mouseleave', function () {
            $('.rapala_device .minicart-button').removeClass('clicked');
            clearTimeout(minicart.timer);
            minicart.timer = null;
            // after a time out automatically close it
            minicart.timer = setTimeout(
                'minicart.close()', 30);
            minicart.close();
        });

        // show the item
        jQuery('.minicartcontent').slideDown('2000', function () {
            minicart.setminicarheight();
        });
        // show("slide",
        // { direction:
        // "up" },
        // 1000);

        // add the open class to the total
        jQuery('.minicart .minicarttotal').addClass('open');

        jQuery('.summaryproduct').each(
            function () {
                var $this = jQuery(this);
                var height = '';
                if ($this.find('.imageexpanded').is(':visible')) {
                    $this.find('.hideoncollapse').hide().end()
                        .find('.attribute').addClass(
                        'collapsed');
                    height = $(this).find('.attributes').height();
                    height += $(this).find('.name').height();
                    jQuery(this).find('.image').css({
                        'min-height': height
                    });
                }
                if ($this.find('.imagecollapsed').is(':visible')) {
                    height = $(this).find('.attributes').height();
                    height += $(this).find('.name').height() + 30;
                    jQuery(this).find('.image').css({
                        'min-height': height
                    });
                }
            });

        jQuery('.minicarttotal').addClass('enablehover');
        minicart.enablehovereffect();

        $('#main , #header , #footernew, #footernew .row').off('touchstart').bind('touchstart', function (e) {
            if ($('.minicartcontent').is(':visible')) {
                var currentLinkLength = $(e.target).closest('.minicartcontent').length;
                var minicarttotal = $(e.target).closest('.minicart-button').length;
                if (currentLinkLength === 0 && minicarttotal === 0) {
                    clearTimeout(minicart.timer);
                    minicart.timer = null;
                    // after a time out automatically close it
                    minicart.timer = setTimeout(
                        'minicart.close()', 30);
                    minicart.reset();
                    minicart.close();
                    minicart.init();
                    $('.rapala_device .minicart-button').removeClass('clicked');
                } else if (minicarttotal > 0) {
                    $('.rapala_device .minicart-button').trigger('click');
                }
            }

        });
    },
    // adds a product to the mini cart
    // @params
    // progressImageSrc - source/url of the image to show when the item
    // is being added to the cart
    // postdata - form data containing the product information to be
    // added to mini-cart
    // callback - call back function/handler
    add: function (progressImageSrc, postdata, callback) {
        // get the data of the form as serialized string
        //var postdata = postdata;

        // get button reference
        var addButtons = [];

        // the button to update
        var addButton = null;

        // it is an array of buttons, but we need only one all
        // other combinations are strange so far
        if (addButtons.length == 1) {
            addButton = addButtons[0];
        }

        var previousImageSrc = null;

        // show progress indicator
        if (addButton != null) {
            previousImageSrc = addButton.src;
            addButton.src = progressImageSrc;
        }

        // handles successful add to cart
        var handlerFunc = function (req) {
            // hide progress indicator
            if (addButton != null) {
                addButton.src = previousImageSrc;
            }

            // replace the content
            jQuery('#minicart').html(req);

            // bind all the events
            minicart.init();
            if ($('.mini-cart-product').length > 1) {
                $('.checkoutminicart').slimscroll({
                    railVisible: true,
                    alwaysVisible: true
                });
                $('.minicarttable').find('thead').first().addClass('theadfixedTop');
                $('.checkoutminicart').find('.cartordertotals').removeClass('carttotals');
                $('.checkoutminicart').find('.minicarttable').removeClass('miniwithoutScroll');
                $('.minicartcontent').find('.minicarttableheader').removeClass('miniwithoutScrollhead');
                $('.minicarttableheader').css('border-bottom', '1px solid #ccc');

            } else {
                $('.minicarttable').find('.theadfixedTop').removeClass('theadfixedTop');
                $('.minicarttable').find('.fixedTop').removeClass('fixedTop');
                $('.minicart').find('.cartordertotals').addClass('carttotals');
                $('.checkoutminicart').find('.minicarttable').addClass('miniwithoutScroll');
                $('.minicartcontent').find('.minicarttableheader').addClass('miniwithoutScrollhead');
                $('.minicarttableheader').css('border-bottom', '1px solid #ccc');
            }
            $('.minicarttable .mini-cart-product:last-child').find('.mini-cart-product').css('border', '0px');

            if ($('body').hasClass('rapala_device')) {
                $('.checkoutminicart').find('.minicarttable').removeClass('miniwithoutScroll');
                // $(".minicarttable .tr_rotation:last-child").find('.minirow').css('border','1px');
                $('.minicarttable').find('thead').first().addClass('theadfixedTop');
                $('.minicarttable .mini-cart-product:last-child').find('.mini-cart-product').css('border', '0px');
                $('.minicarttableheader').css('border-bottom', '1px solid #ccc');
            }

            if (minicart.suppressSlideDown && minicart.suppressSlideDown()) {
                // do nothing
                // the hook 'MiniCart.suppressSlideDown()' should have
                // done the refresh
            } else {
                minicart.slide();
                minicart.setminicarheight();
                if (callback) {
                    callback();
                }
            }
            $('#pdpMain .addtocartconfirm-tooltip').fadeIn(400).show()
                .delay(1500).fadeOut(400);
            // fire the BonusDiscountLineItemCheck event so we can check
            // if there is a bonus discount line item
            jQuery(document).trigger(jQuery.Event('BonusDiscountLineItemCheck'));
        };

        // handles add to cart error
        var errFunc = function () {
            // hide progress indicator
            if (addButton != null) {
                addButton.src = previousImageSrc;
            }
        };

        // closes a previous mini cart
        minicart.close();

        // add the product
        jQuery.ajax({
            type: 'POST',
            url: minicart.url,
            cache: true,
            data: postdata,
            success: handlerFunc,
            error: errFunc
        });
    },

    // closes the mini cart with given delay
    close: function (delay) {
        if (minicart.timer != null || delay == 0) {
            clearTimeout(minicart.timer);
            minicart.timer = null;
            jQuery('.minicartcontent').fadeOut(1000);
            // hide with "slide" causes to fire mouse enter/leave events
            // sometimes infinitely thus changed it to fadeOut
            // add the open class to the total
            jQuery('.minicart .minicarttotal').removeClass('open');
            jQuery('.minicartcontent .minicartclose').off('click');
        }
    }
};

module.exports = minicart;
