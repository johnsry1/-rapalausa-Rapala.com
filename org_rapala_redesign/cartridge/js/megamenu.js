'use strict';

var megamenu = {
    globalTimer: 0,
    init: function () {
        if ($('#brand-tabs-header > ul > li.active').length == 0) {
            $('#brand-tabs-header > ul > li:first-child').addClass('active');
        }

        megamenu.megamenuEvent();
    },
    open: function () {

        //var $width = $('#brand-tabs-header').width();
        // To make default menu based on the brand active
        $('#brand-tabs-header > ul > li.active .mobile-main-menu-heading').trigger('click');
        $('#container').addClass('js-container-active');
        $('#header').addClass('js-menu-toggle');
        $('.menu-open-shadow').remove();
        //$main.wrap('<div class=\'open-menu-wrap\'></div>');
        $('body').addClass('js-body');
        //$('.open-menu-wrap').append($footer).prepend('<a href=\'javascript:void(0);\' class=\'menu-open-shadow\'></a>');
        //$("#main, #footernew").prepend("<div class='menu-open-shadow'></div>")
        //$('#container, .open-menu-wrap').animate({marginLeft: '280px'}, 300);
        $('#brand-tabs-header').wrap('<div class=\'brand-active\'></div>');
        $('.brand-active').animate({left: '0'}, 300);
        $('.banner_prostaff').animate({left: '280px'}, 300);
        $('.owl-carousel').find('.owl-item, .owl-item img').trigger('mouseenter');
        $('html').addClass('menu-open');
    },
    close: function () {
       //$('#container, .open-menu-wrap').animate({marginLeft: '0'}, 300);
        $('.banner_prostaff').animate({left: '0'}, 300);
        $('#container').removeClass('js-container-active');
        $('body').removeClass('js-body');
        $('.owl-carousel').find('.owl-item, .owl-item img').trigger('mouseout');
        $('.magnifier-icon').removeClass('js-magnifier-icon-active');
        $('.menu-toggle').removeClass('js-menu-toggle');
        $('#brand-tabs-header').unwrap();
        $('html').removeClass('menu-open');
        setTimeout(function () {
            $(window).scrollTop(0);
        }, 300);

    },
    megamenuEvent: function () {
        /* Click event for brands to see sub menus in mobile */
        $('#brand-tabs-header > ul > li .mobile-main-menu-heading').on('click', function (e) {
            if ($(window).width() <= 959) {
                e.preventDefault();
                var $this = $(this).closest('li');
                $this.closest('ul').addClass('hide-after');
                $this.siblings('li').removeClass('js-sub-menu-active').addClass('js-sub-menu-inactive');
                $this.removeClass('js-sub-menu-inactive').addClass('js-sub-menu-active');
                $this.find('.megamenu-drop').animate({'left': [0, 'easeOutExpo']});
                $this.find('.shop-rapala').each(function () {
                    var $curObj = $(this);
                    if (!$curObj.closest('.sub-category-section-1').hasClass('js-active-sub-menu')) {
                        $curObj.next('.sub-cat-drop-down').trigger('click');
                    }
                });
                $this.find('.megamenudrop .sub-category-section-1 > a').each(function () {
                    var menuList = $(this).closest('.mega_subcategory');
                    var mainContent = $(this).closest('.sub-category-section-1');
                    $(mainContent).find('.sub-cat-drop-down').removeAttr('style');
                    var achorWidth = $(this).width();
                    var dropDownWisth = $(menuList).width() - achorWidth;
                    dropDownWisth = dropDownWisth - 70;
                    if (dropDownWisth > 17) {
                        $(mainContent).find('.sub-cat-drop-down').width(dropDownWisth);
                    }
                });

            }
        });
        /* Click event for to see all the brands in mobile */
        $('body').off('click', '.see-all-brands').on('click', '.see-all-brands', function (e) {
            //var $width = $('#brand-tabs-header').width();
            if ($(window).width() <= 959) {
                e.preventDefault();
                var $width = $('#brand-tabs-header').width();
                var $this = $(this).closest('li');
                $this.find('.megamenu-drop').animate({'left': [$width, 'easeOutExpo']});
                $this.siblings('li').removeClass('js-sub-menu-inactive');
                $this.closest('ul').removeClass('hide-after');
                setTimeout(function () {
                    if ($this.find('.megamenu-drop').position().left == $width) {

                        $this.removeClass('js-sub-menu-active');
                    }
                }, 400);
            }
        });

        /* Click event for sub menu drop down in mobile */
        $('body').off('click', '.sub-category-section-1 .sub-cat-drop-down').on('click', '.sub-category-section-1 .sub-cat-drop-down', function (e) {
            if ($(window).width() <= 959) {
                if (!$(this).hasClass('no-click')) {
                    e.preventDefault();
                    var $this = $(this).closest('.sub-category-section-1');
                    if (!$this.hasClass('js-active-sub-menu')) {
                        $this.addClass('js-active-sub-menu');
                        $this.find('.sub-category-section-2').removeAttr('style');
                        $this.find('.sub-category-section-2').slideDown();
                    } else {
                        $this.find('.sub-category-section-2').slideUp();
                        $this.delay(1000).removeClass('js-active-sub-menu');
                    }
                }

            }
        });
        // main menu toggle
        $('body').off('click', '.menu-toggle').on('click', '.menu-toggle', function (e) {
            e.preventDefault();
            if ($(window).width() <= 959) {
                if (!$('#container').hasClass('js-container-active')) {
                    megamenu.open();
                } else {
                    megamenu.close();
                }
            }
        });
        $('body').off('touchstart click', 'a.menu-open-shadow').on('touchstart click', 'a.menu-open-shadow', function (e) {
            e.preventDefault();
            if ($(window).width() <= 959) {
                if (!$('#container').hasClass('js-container-active')) {
                    megamenu.open();
                } else {
                    megamenu.close();
                }
            }
        });
        $('body').off('click', 'a.magnifier-icon').on('click', 'a.magnifier-icon', function (e) {
            e.preventDefault();
            if ($(window).width() <= 959) {
                //var $width = $('#brand-tabs-header').width();
                if (!$('#container').hasClass('js-container-active')) {
                    $('.magnifier-icon').addClass('js-magnifier-icon-active');
                    megamenu.open();
                    if ($('.magnifier-icon').hasClass('js-magnifier-icon-active')) {
                        $('#container').find('.simplesearchinput').focus();
                    }
                }
            }
        });

        $('.mobile-account-menu .with-subcategory').on('click', function() {
            $(this).toggleClass('active');
            $(this).next('.mobile-account-submenu').slideToggle();
        });

        /** single click redirecting of megamenu categories*/
        $('#brand-tabs-header').mouseleave(function () {
            if ($(window).width() > 959) {
                $('.megamenu-drop').hide();
                $('.megamenudrop').hide();
                $('#brand-tabs-header > ul > li.active').removeClass('inactive');
                $('#brand-tabs-header > ul > li').removeClass('current');
            }
        });

        $('.brand-tabs-header-mask').mouseenter(function () {
            if ($(window).width() > 959) {
                $('.megamenu-drop').hide();
                $('.megamenudrop').hide();
                $('#brand-tabs-header > ul > li.active').removeClass('inactive');
                $('#brand-tabs-header > ul > li').removeClass('current');
                $(this).hide();
            }
        });
    },
    syncheight: function ($sel) {
        var current = 0;
        if ($($sel).hasClass('menulist')) {
            $sel.each(function () {
                if ($(this).height() > current) {
                    current = $(this).height();
                }
            });
        } else {
            $sel.each(function () {
                if ($(this).height() > current) {
                    current = $(this).height();
                }
            });
        }
        $sel.height(current);
    }
};

module.exports = megamenu;
