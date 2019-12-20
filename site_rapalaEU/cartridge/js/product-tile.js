'use strict';

var imagesLoaded = require('imagesloaded'),
    util = require('./util'),
    quickview = require('./quickview');

function initQuickViewButtons() {
    $('.product-tile .product-image').on('mouseenter', function () {
        var $qvButton = $('#quickviewbutton');
        if ($qvButton.length === 0) {
            $qvButton = $('<a id="quickviewbutton" class="quickview">' + Resources.QUICK_VIEW + '<i class="fa fa-arrows-alt"></i></a>');
        }
        var $link = $(this).find('.thumb-link');
        $qvButton.attr({
            'href': $link.attr('href'),
            'title': $link.attr('title')
        }).appendTo(this);
        $qvButton.off('click').on('click', function (e) {
            e.preventDefault();
            if (SitePreferences.GTM_ENABLED && $(this).attr('data-gtmdata')) {
                var obj = {
                    'event': 'productClick',
                    'event_info': {
                        'label' : 'Quickview'
                    },
                    'ecommerce': {
                        'click': {
                            'actionField': {'list': 'SearchResults'},
                            'products': []
                        }
                    }
                };
                obj.ecommerce.click.products.push(JSON.parse($(this).attr('data-gtmdata')));
                dataLayer.push(obj);
            }
            quickview.show({
                url: $(this).attr('href').split('#')[0], //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
                source: 'quickview'
            });
        });
    });
}

function gridViewToggle() {
    var CookieImageValue = util.readCookie('ImageSize');
    //This is used to persist the ImageSizes overall site.
    if (CookieImageValue != null) {
        if (CookieImageValue == 'listview') {
            jQuery('.search-result-content').addClass('wide-tiles');
            jQuery('.product-image').addClass('grid');
            $('.toggle-grid i').removeClass('active');
            $('.toggle-grid .listview').addClass('active');
            $('.search-result-content.wide-tiles .product-tile .product-image img').each(function () {
                this.src = this.src.replace('sw=130&sh=92', 'sw=352&sh=251');
            });
            $('.product-img').each(function () {
                $(this).find('img').remove();
                $(this).append('<img src="' + $(this).attr('data-large-src') + '" title="' + $(this).attr('data-title') + '" alt="' + $(this).attr('data-alt') + '"></img>');

            });

        } else {
            jQuery('.search-result-content').removeClass('wide-tiles');
            jQuery('.product-image').removeClass('grid');
            $('.toggle-grid i').removeClass('active');
            $('.toggle-grid .gridview').addClass('active');
            $('.search-result-content.wide-tiles .product-tile .product-image img').each(function () {
                this.src = this.src.replace('sw=130&sh=92', 'sw=130&sh=92');
            });
            $('.product-img').each(function () {
                $(this).find('img').remove();
                $(this).append('<img src="' + $(this).attr('data-small-src') + '" title="' + $(this).attr('data-title') + '" alt="' + $(this).attr('data-alt') + '"></img>');
            });
        }

        if ($('.listview.active').length == 1) {
            $('.pt_product-search-result').attr('data-viewType', 'listview');
        } else {
            $('.pt_product-search-result').attr('data-viewType', 'gridview');
        }
    }

    $('.toggle-grid i').on('click', function () {
        var dateObj = new Date();
        dateObj.setTime(dateObj.getTime() + (60 * 60 * 1000));
        if ($(this).hasClass('gridview')) {
            document.cookie = 'ImageSize=' + 'gridview' + '; expires=' + dateObj.toUTCString() + '; path=/';
            $('.toggle-grid i').parent('.toggle-grid').removeClass('wide');
            $('.toggle-grid i').removeClass('active');
            $(this).parent('.toggle-grid').removeClass('wide');
            $(this).addClass('active');
            $('.search-result-content').removeClass('wide-tiles');
            $('.product-img').each(function () {
                $(this).find('img').remove();
                $(this).append('<img src="' + $(this).attr('data-large-src') + '" title="' + $(this).attr('data-title') + '" alt="' + $(this).attr('data-alt') + '"></img>');
            });
        } else if ($(this).hasClass('listview')) {
            document.cookie = 'ImageSize=' + 'listview' + '; expires=' + dateObj.toUTCString() + '; path=/';
            $('.toggle-grid i').parent('.toggle-grid').removeClass('wide');
            $('.toggle-grid i').removeClass('active');
            $(this).parent('.toggle-grid').addClass('wide');
            $(this).addClass('active');
            $('.search-result-content').addClass('wide-tiles');
            $('.search-result-content.wide-tiles .product-tile .product-image img').each(function () {
                this.src = this.src.replace('sw=130&sh=92', 'sw=352&sh=251');
            });
            $('.product-img').each(function () {
                $(this).find('img').remove();
                $(this).append('<img src="' + $(this).attr('data-small-src') + '" title="' + $(this).attr('data-title') + '" alt="' + $(this).attr('data-alt') + '"></img>');
            });
        }
        var currObj = $(this);
        jQuery('.toggle-grid .fa').removeClass('active');
        $(currObj).addClass('active');
        if ($('.large.active').length == 1) {
            $('.pt_product-search-result').attr('data-viewType', 'listview');
        } else {
            $('.pt_product-search-result').attr('data-viewType', 'gridview');
        }
    });

}

/**
 * @private
 * @function
 * @description Initializes events on the product-tile for the following elements:
 * - swatches
 * - thumbnails
 */
function initializeEvents() {
    initQuickViewButtons();
    gridViewToggle();
    $('.swatch-list').on('mouseleave', function () {
        // Restore current thumb image
        var $tile = $(this).closest('.product-tile'),
            $thumb = $tile.find('.product-image .thumb-link img').eq(0),
            data = $thumb.data('current');
        $thumb.attr({
            src: data.src,
            alt: data.alt,
            title: data.title
        });
        $('.search-result-content.wide-tiles .product-tile .product-image a.thumb-link.currentimg img').each(function () {
            this.src = this.src.replace('sw=130&sh=92', 'sw=352&sh=251');
        });
    });
    $('.swatch-list .swatch').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('selected')) {
            return;
        }

        var $tile = $(this).closest('.product-tile');
        $(this).closest('.swatch-list').find('.swatch.selected').removeClass('selected');
        $(this).addClass('selected');
        $tile.find('.thumb-link').attr('href', $(this).attr('href'));
        $tile.find('name-link').attr('href', $(this).attr('href'));

        var data = $(this).children('img').filter(':first').data('thumb');
        var $thumb = $tile.find('.product-image .thumb-link img').eq(0);
        var currentAttrs = {
            src: data.src,
            alt: data.alt,
            title: data.title
        };
        $thumb.closest('.thumb-link').addClass('currentimg');
        $thumb.attr(currentAttrs);
        $thumb.data('current', currentAttrs);

        /*Start JIRA PREV-466 : Product images are not updating in the compare section when the color swatches are changed in PLP.*/
        var pid = $(this).closest('.product-tile').attr('data-itemid');
        $('.compare-items-panel .compare-item').each(function () {
            var compareid = $(this).attr('data-itemid');
            if (pid === compareid) {
                var $compare = $(this).find('.compare-item-image').eq(0);
                $compare.attr(currentAttrs);
                $compare.data('current', currentAttrs);
            }
        });
        /*End JIRA PREV-466*/
    }).bind('mouseenter click', function () {
        // get current thumb details
        var $tile = $(this).closest('.product-tile'),
            $thumb = $tile.find('.product-image .thumb-link img').eq(0),
            data = $(this).children('img').filter(':first').data('thumb'),
            current = $thumb.data('current');

        // If this is the first time, then record the current img
        if (!current) {
            $thumb.data('current', {
                src: $thumb[0].src,
                alt: $thumb[0].alt,
                title: $thumb[0].title
            });
        }

        // Set the tile image to the values provided on the swatch data attributes
        $thumb.attr({
            src: data.src,
            alt: data.alt,
            title: data.title
        });
        $('.search-result-content.wide-tiles .product-tile .product-image a.thumb-link.currentimg img').each(function () {
            this.src = this.src.replace('sw=130&sh=92', 'sw=352&sh=251');
        });

    });
}

exports.init = function () {
    var $tiles = $('.tiles-container .product-tile');
    if ($tiles.length === 0) {
        return;
    }
    imagesLoaded('.tiles-container').on('done', function () {
        $tiles.syncHeight()
            .each(function (idx) {
                $(this).data('idx', idx);
            });
    });
    initializeEvents();
};

