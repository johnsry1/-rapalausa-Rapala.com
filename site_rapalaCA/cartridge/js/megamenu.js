'use strict';

var $main = $('#main'),
    $footer = $('#footernew'),
    $banner = $('.banner_prostaff');

var megamenu = {
    globalTimer: 0,
    init: function () {
        megamenu.megamenuEvent();
    },
    open: function () {

        //var $width = $('#brand-tabs-header').width();
        // To make default menu based on the brand active
        $('#brand-tabs-header > ul > li.active .mobile-main-menu-heading').trigger('click');
        $('#container').addClass('js-container-active');
        $('.menu-toggle').addClass('js-menu-toggle');
        $('.menu-open-shadow').remove();
        $main.wrap('<div class=\'open-menu-wrap\'></div>');
        $('body').addClass('js-body');
        $('.open-menu-wrap').prepend($banner);
        $('.open-menu-wrap').append($footer).prepend('<a href=\'javascript:void(0);\' class=\'menu-open-shadow\'></a>');
        //$("#main, #footernew").prepend("<div class='menu-open-shadow'></div>")
        $('#container, .open-menu-wrap').animate({marginLeft: '280px'}, 300);
        $('#brand-tabs-header').wrap('<div class=\'brand-active\'></div>');
        $('.brand-active').animate({left: '0'}, 300);
        $('.banner_prostaff').animate({left: '280px'}, 300);
        $('.owl-carousel').find('.owl-item, .owl-item img').trigger('mouseenter');
    },
    close: function () {
        $('#container, .open-menu-wrap').animate({marginLeft: '0'}, 300);
        $('.banner_prostaff').animate({left: '0'}, 300);
        $('#container').removeClass('js-container-active');
        $('body').removeClass('js-body');
        $('.owl-carousel').find('.owl-item, .owl-item img').trigger('mouseout');
        $('#main, #footernew').unwrap();
        $('.magnifier-icon').removeClass('js-magnifier-icon-active');
        $('.menu-toggle').removeClass('js-menu-toggle');
        $('#brand-tabs-header').unwrap();
        setTimeout(function () {
            $(window).scrollTop(0);
        }, 300);

    },
    megamenuEvent: function ($con) {
        if ($con == null) {
            $con = $('#brand-tabs-header > ul > li .megamenudrop');
        }
        $con.each(function () {
            var maxlength = 24;
            var $mega = $(this);
            //var textlinklength = $(this).find('> a').length;
            var divlength = 4;
            if ($(this).attr('id') == 'rapala') {
                divlength = 6;
            } else if ($(this).attr('id') == 'vmc') {
                divlength = 6;
            } else if ($(this).attr('id') == 'luhrjensen') {
                divlength = 4;
            } else if ($(this).attr('id') == 'sufix') {
                divlength = 6;
            } else if ($(this).attr('id') == 'storm') {
                divlength = 4;
            } else if ($(this).attr('id') == 'triggerx') {
                divlength = 4;
            } else if ($(this).attr('id') == 'bluefox') {
                divlength = 4;
            } else if ($(this).attr('id') == 'terminator') {
                divlength = 4;
            } else if ($(this).attr('id') == 'williamson') {
                divlength = 4;
            } else if ($(this).attr('id') == 'strikemaster') {
                divlength = 6;
            } else if ($(this).attr('id') == 'marcum') {
                divlength = 6;
            } else if ($(this).attr('id') == 'otter') {
                divlength = 6;
            } else if ($(this).attr('id') == 'iceforce') {
                divlength = 4;
            }
            //var intial = 0;
            var end = maxlength;
            var datalist = '';
            var brandlist = $(this).find('.brand-assets').clone();
            var containerwidth = $('.megamenu-drop .wrapper').width() / divlength + 'px';
            var lasttext = '';
            var prev = '';
            //var next = '';
            $mega.find('.brand-assets').remove();

            for (var i = 1; i <= divlength; i++) {
                $mega.append('<div class="menulist menulist-' + i + '" style="width:' + containerwidth + '"></div>');
                $mega.find('.mega_subcategory').each(function () {
                    if ($(this).find('a.level-1').eq(0).hasClass('column-' + i)) {
                        datalist = $(this).html();
                        $mega.find('.menulist-' + i).append(datalist);
                    }
                });
                if (i == divlength) {
                    $mega.find('.menulist-' + i).append(brandlist);
                }
            }

            $mega.find('.menulist').each(function ($i) {
                $i = $i + 1;
                if ($(this).find('> a').length > maxlength) {
                    end = $(this).find('> a').length;
                    if (end > maxlength) {
                        datalist = $(this).find('> a').slice(maxlength, end).clone();
                        if ($mega.find('.menulist-' + ($i + 1)).length != 0) {
                            $mega.find('.menulist-' + ($i + 1)).prepend(datalist);
                        }
                    }
                }
                if ($i != 1) {
                    if ($mega.find('.menulist-' + $i + '> a').eq(0).hasClass('level-2')) {
                        prev = $i - 1;
                        lasttext = $mega.find('.menulist-' + prev + '> a.level-1').last().attr('hreflang');
                        $mega.find('.menulist-' + $i).prepend('<div class="level-continue">' + lasttext + ', Continued</div>');
                    }
                }
                $(this).find('> a').slice(maxlength, end).remove();
            });
            $mega.find('.mega_subcategory').remove();
        });
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
                $this.find('.menulist .sub-category-section-1 > a').each(function () {
                    var menuList = $(this).closest('.menulist');
                    var mainContent = $(this).closest('.sub-category-section-1');
                    $(mainContent).find('.sub-cat-drop-down').removeAttr('style');
                    var achorWidth = $(this).width();
                    var dropDownWisth = $(menuList).width() - achorWidth;
                    dropDownWisth = dropDownWisth - 70;
                    if (dropDownWisth > 17) {
                        $(mainContent).find('.sub-cat-drop-down').width(dropDownWisth);
                    }
                });

            } else if ($(window).width() > 959 && $(window).width() < 1025) {
                var deviceAgent = navigator.userAgent.toLowerCase(),
                    deviceType = deviceAgent.match(/(iphone|ipod|ipad|android|blackBerry)/);
                if (deviceType[0] == 'iphone' || deviceType[0] == 'ipad') {
                    /*$(".mobile-main-menu-heading > a").removeClass("selected");
                    if(!$(this).hasClass('selected')) {
                        e.preventDefault();
                        megamenu.megamenuEvent();
                        $(this).addClass('selected');
                        return false;
                    }
                    else {
                        return true;
                    }*/
                }
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
                        $('#container').find('.simplesearchinput').trigger('focus');
                    }
                }
            }
        });

        // Mega menu events for window width greater than 959
        $('#brand-tabs-header > ul > li').on('mouseenter', function () {
            var $id = $(this).find('.mobile-main-menu-heading > a').attr('class');
            var $this = $(this);

            if ($(window).width() > 959) {
                $('.owl-carousel').find('.owl-item, .owl-item img').trigger('mouseenter');
                $this.siblings('li').find('.megamenudrop, .megamenu-drop').hide();
                $('.accountcontent').hide();
                clearTimeout(megamenu.globalTimer);
                //megamenu.globalTimer == 0;
                $('#brand-tabs-header li').removeClass('current');
                if ($this.find('.megamenudrop').find('a').length != 0) {
                    $this.find('.megamenudrop').show();
                    $this.find('.megamenu-drop').show();
                    //$('.megamenudrop[id="'+ $id +'"]').closest('.mega-menu').find('.mask').css('left',$(this).offset().left);
                    //$('.megamenudrop[id="'+ $id +'"]').closest('.mega-menu').find('.mask').attr('href',$(this).find('a').attr('href'));
                }
                var containerwidth = $('.megamenu-drop .wrapper').width() / $('#' + $id + ' .menulist').length;
                containerwidth = containerwidth - 21;
                $('#' + $id + ' .menulist').removeAttr('style');
                $('#' + $id + ' .menulist').width(containerwidth);
                megamenu.syncheight($('#' + $id + '.megamenudrop .menulist'));

                $(this).addClass('current');
                if (!$(this).hasClass('active')) {
                    $('#brand-tabs-header li.active').addClass('inactive');
                } else {
                    $(this).removeClass('inactive');
                }
                $('.brand-tabs-header-mask').show();
            }
        }).on('mouseleave', function () {

            if ($(window).width() > 959) {
                $('.owl-carousel').find('.owl-item, .owl-item img').trigger('mouseout');
                /*var deviceAgent = navigator.userAgent.toLowerCase(),
                deviceType = deviceAgent.match(/(iphone|ipod|ipad|android|blackBerry)/);
                if(deviceType[0] == "iphone" || deviceType[0] == "ipad"){
                    var $this = $(this);
                    $this.find(".mobile-main-menu-heading > a").removeClass('selected');
                }*/
            }
        });

        /** single click redirecting of megamenu categories*/
        /*$('.rapala_device .menulist a').on('mouseenter', function(){
            window.location.href = $(this).attr('href');
        });*/
        $('#brand-tabs-header').on('mouseleave', function () {
            if ($(window).width() > 959) {
                $('.megamenu-drop').hide();
                $('.megamenudrop').hide();
                $('#brand-tabs-header > ul > li.active').removeClass('inactive');
                $('#brand-tabs-header > ul > li').removeClass('current');
            }
        });

        $('.brand-tabs-header-mask').on('mouseenter', function () {
            if ($(window).width() > 959) {
                $('.megamenu-drop').hide();
                $('.megamenudrop').hide();
                $('#brand-tabs-header > ul > li.active').removeClass('inactive');
                $('#brand-tabs-header > ul > li').removeClass('current');
                $(this).hide();
            }
        });

        /*$(".rapala_device #brand-tabs-header a").on('click', function(e){
            e.preventDefault();
            if($(this).hasClass('selected')){
                $(this).removeClass('selected');
                window.location.href = $(this).attr('href');
            }else{
                $(this).closest("li").siblings().find("a").removeClass('selected');
                $(this).addClass('selected');
            }
        });*/
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
