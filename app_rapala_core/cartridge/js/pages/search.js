'use strict';

var compareWidget = require('../compare-widget'),
    productTile = require('../product-tile'),
    progress = require('../progress'),
    uievents = require('../uievents'),
    //imagesLoaded = require('imagesloaded'),
    util = require('../util');

function infiniteScroll() {
    // getting the hidden div, which is the placeholder for the next page
    var loadingPlaceHolder = $('.infinite-scroll-placeholder[data-loading-state="unloaded"]');
    // get url hidden in DOM
    var gridUrl = loadingPlaceHolder.attr('data-grid-url');
    if (loadingPlaceHolder.length === 1 && util.elementInViewport(loadingPlaceHolder.get(0), 250)) {
        // switch state to 'loading'
        // - switches state, so the above selector is only matching once
        // - shows loading indicator
        loadingPlaceHolder.attr('data-loading-state', 'loading');
        loadingPlaceHolder.addClass('infinite-scroll-loading');

        // named wrapper function, which can either be called, if cache is hit, or ajax repsonse is received
        var fillEndlessScrollChunk = function (html) {
            loadingPlaceHolder.removeClass('infinite-scroll-loading');
            loadingPlaceHolder.attr('data-loading-state', 'loaded');
            $('div.search-result-content').append(html);
        };

        // old condition for caching was `'sessionStorage' in window && sessionStorage["scroll-cache_" + gridUrl]`
        // it was removed to temporarily address RAP-2649

        $.ajax({
            type: 'GET',
            dataType: 'html',
            url: gridUrl,
            success: function (response) {
                // put response into cache
                try {
                    sessionStorage['scroll-cache_' + gridUrl] = response;
                } catch (e) {
                    // nothing to catch in case of out of memory of session storage
                    // it will fall back to load via ajax
                }
                // update UI
                fillEndlessScrollChunk(response);
                productTile.init();
            }
        });
    }
}

/**
 * @private
 * @function
 * @description replaces breadcrumbs, lefthand nav and product listing with ajax and puts a loading indicator over the product listing
 */
function updateProductListing(url) {
    if (url == null) {
        return;
    }
    $('#main').addClass('hidecontent');
    progress.show('#main');
    $('#main').load(util.appendParamToURL(url, 'format', 'ajax'), function () {
        searchRefinment.searchRefinementToggle();
        uievents.init();
        compareWidget.init();
        productTile.init();
        owlcarousel();
        /* $('.scrollable').each(function(){
             $(this).slimScroll({
                 size: '10px',
                 height: '200px',
                 railVisible: true,
                 alwaysVisible: true
             });

         });*/

        progress.hide();
        $('#main').removeClass('hidecontent');
        history.pushState(undefined, '', url);
        $('html, body').animate({scrollTop: 0}, 'fast');
        if ($('.pt_product-search-result .search-blk').length > 0) {
            $('.pt_product-search-result').find('#primary').addClass('search-result');
        }
        if ($('.refine-display.refine-values .breadcrumb-refinement').length > 0) {
            $('.pt_product-search-result.searchresult').find('#primary').addClass('search-result');
            $('.pt_product-search-result.categorylanding').find('#primary').addClass('search-result');
        } else {
            $('.pt_product-search-result.searchresult').find('#primary').addClass('search-result');
            $('.pt_product-search-result.categorylanding').find('#primary').removeClass('search-result');
        }
        gridSyncheight();
        $('#secondary').removeClass('visible-hidden').addClass('secondary-hide');
    });
}

// updates the grid using the 'post hash' refinement values
function gridSyncheight() {
    $('.tiles-container .product-tile').syncHeight();
}


function owlcarousel() {
    setTimeout(function () {
        var owl = $('.owl-carousel');
        owl.owlCarousel({
            items: 5,
            slideBy: 5,
            rewind: false,
            nav: true,
            navRewind: false,
            loop: false,
            dots: true,
            responsive: {
                0: {
                    items: 2,
                    slideBy: 2
                },
                767: {
                    items: 2,
                    slideBy: 2
                },
                768: {
                    items: 5,
                    slideBy: 5
                }
            }
        });

        var viewport = jQuery(window).width();
        //var current = $(this);
        var itemCount = $('.recommendations.cross-sell.Recommended.For.You .owl-carousel .owl-item').length;
        if (
            (viewport >= 768 && itemCount > 5) || (viewport < 768 && itemCount > 2)
        ) {
            $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-prev, .owl-next').show();
            $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-dots').show();

        } else {
            $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-prev, .owl-next').hide();
            $('.recommendations.cross-sell.Recommended.For.You .pdprecomo-owl').find('.owl-dots').hide();
        }

        //var viewportone = jQuery(window).width();
        //var currentone = $(this);
        var itemCountone = $('.recommendations.cross-sell.Recently.Viewed .owl-carousel .owl-item').length;

        if (
            (viewport >= 768 && itemCountone > 5) || (viewport < 768 && itemCountone > 2)
        ) {
            $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-prev, .owl-next').show();
            $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-dots').show();

        } else {
            $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-prev, .owl-next').hide();
            $('.recommendations.cross-sell.Recently.Viewed .pdprecomo-owl').find('.owl-dots').hide();
        }
        $('.product-listing').find('h2.hide').removeClass('hide');

        productTile.init();
        $('.pt_product-search-result .recommendations.cross-sell .search-result-items .product-tile.item').last().addClass('recomlast');
    }, 5500);

}

var searchRefinment = {
    searchRefinementToggle: function () {
        //$("#secondary").removeAttr("style");
        $('.js-scrollbar').each(function ($i) {
            //var curObj = $(this);
            //var thresholdValue = $(curObj).closest('.refinement').find('.device-refine').val();
            if ($('.rapala_device').length == 0) {
                if ($(this).closest('.navgroup').hasClass('refinement')) {
                    if ($(this).find('li').length > 8) {
                        $(this).addClass('js-scrollbar-height');
                        $(this).find('.overview').slimScroll({
                            railVisible: true,
                            height: '200px',
                            size: '10px',
                            railColor: 'transparent',
                            color: '#a0a0a0',
                            alwaysVisible: true
                        });
                        //$(this).tinyscrollbar({trackSize : 200});
                    } else {
                        $(this).find('.overview').css('position', 'static');

                    }
                } else {
                    //$(this).tinyscrollbar({trackSize : 200});
                    $(this).find('.overview').slimScroll({
                        railVisible: true,
                        height: '200px',
                        size: '10px',
                        railColor: 'transparent',
                        color: '#a0a0a0',
                        alwaysVisible: true
                    });

                }
            } else {
                /*if($(this).find('li').length > thresholdValue && $(this).find('.seeMoreRefinements').length == 0){
                    if($(this).find('.seeNextRefinements').length == 0 && $(this).find('.seePrevRefinements').length == 0){
                        $(this).append('<a href="#" class="seeNextRefinements">See Next</a>');
                        $(this).append('<a href="#" class="seePrevRefinements">See Previous</a>');
                    }
                    thresholdValue -= 1;
                    $(this).find('li').eq(thresholdValue).nextAll('li').hide();
                    $('.seePrevRefinements').hide();
                }
                else{
                    $(this).find('li').show();
                    $(this).find('.seeNextRefinements').hide();
                }*/
            }

            if ($i == ($('.js-scrollbar').length - 1)) {
                $('#searchrefinements div.navgroup').each(function (i) {
                    if ($(window).width() < 960) {
                        if ($(this).find('li.selected').length == 0) {
                            $(this).find('div.refineattributes').hide();
                            $(this).find('.filter').addClass('expand');
                            $(this).addClass('collapse-expand');
                        }
                    } else {
                        if (i > 2 && $(this).find('li.selected').length == 0) {
                            $(this).find('div.refineattributes').hide();
                            $(this).find('.filter').addClass('expand');
                            $(this).addClass('collapse-expand');
                        } else if (i < 3) {
                            $(this).find('div.refineattributes').show();
                            $(this).find('.filter').removeClass('expand');
                            $(this).removeClass('collapse-expand');
                        }
                    }

                });
            }
        });

        // init refinement toggling
        $('#searchrefinements .filter').off('click').on('click', function (e) {
            e.preventDefault();
            jQuery(this).toggleClass('expand');
            $(this).closest('.navgroup').toggleClass('collapse-expand');
            jQuery(this).closest('.navgroup').find('div.refineattributes').toggle();
            //jQuery(this).closest('.navgroup').find(".js-scrollbar").tinyscrollbar({trackSize : 200});
        });

        $(window).load(function () {
            $('#secondary').removeClass('visible-hidden').addClass('secondary-hide');
        });
        if ($(window).width() > 959) {
            $('.mobile-filter-by').removeClass('js-filter-active');
            $('#secondary').removeClass('.visible-hidden').removeAttr('style');
        }
    }
};

/**
 * @private
 * @function
 * @description Initializes events for the following elements:<br/>
 * <p>refinement blocks</p>
 * <p>updating grid: refinements, pagination, breadcrumb</p>
 * <p>item click</p>
 * <p>sorting changes</p>
 */
function initializeEvents() {
    owlcarousel();
    gridSyncheight();
    productTile.init();
    var $main = $('#main');
    // compare checked
    $main.on('click', 'input[type="checkbox"].compare-check', function () {
        var cb = $(this);
        var tile = cb.closest('.product-tile');

        var func = this.checked ? compareWidget.addProduct : compareWidget.removeProduct;
        var itemImg = tile.find('.product-image a img').first();
        func({
            itemid: tile.data('itemid'),
            uuid: tile[0].id,
            img: itemImg,
            cb: cb
        });

    });

    if ($('.contentAsset-new').find('.html-slot-container').length > 0) {
        var current = $('.contentAsset-new').find('.html-slot-container');
        current.parents('.desktop').removeClass('promohide').addClass('promoshow');
    } else {
        $('.desktop').removeClass('promoshow').addClass('promohide');
    }

    $main.on('click', '.mobile-filter-by', function () {
        if (!$('.mobile-filter-by').hasClass('js-filter-active')) {
            $('.mobile-filter-by').addClass('js-filter-active');
            $('#secondary').show();
            //$("#secondary").css("top",secondaryTop+"px");
        } else {
            $('.mobile-filter-by').removeClass('js-filter-active');
            $('#secondary').hide();
            //$("#secondary").css("top",secondaryTop+"px");
        }
    });
    $('#tabs a').on('click', function (e) {
        e.preventDefault();
        $(this).prev('input[type="radio"]').prop('checked', true);
        var href = $(this).attr('href');
        window.location = href;
    });

    $main.on('click', '#tabs input[type="radio"]', function () {
        var checked = $(this).prop('checked', true);
        if (checked) {
            $(this).prop('checked', false);
        } else {
            $(this).prop('checked', true);
        }
        $(this).next('a').trigger('click');
        $(this).prop('checked', true);
    });

    //searchcontent-section
    $main.on('click', '.mobile-filter-by.results-content', function () {
        if (!$('.mobile-filter-by.results-content').hasClass('js-filter-active')) {
            $('.mobile-filter-by.results-content').addClass('js-filter-active');
            $('#secondary.searchResult-refinement').show();
            //$("#secondary").css("top",secondaryTop+"px");
        } else {
            $('.mobile-filter-by.results-content').removeClass('js-filter-active');
            $('#secondary.searchResult-refinement').hide();
            //$("#secondary").css("top",secondaryTop+"px");
        }
    });

    if ($('.pt_product-search-result .search-blk').length > 0) {
        $('.pt_product-search-result').find('#primary').addClass('search-result');
    }

    if ($('.pt_content-search-result .folder-content-list').length > 0) {
        $('.pt_content-search-result').find('#tabs #producttab').prop('checked', false);
        $('.pt_content-search-result').find('#tabs #contenttab').prop('checked', true);
    }

    $main.on('click', '.sortby-button', function () {
        if ($(window).width() >= 481 && $(window).width() <= 959) {
            if (!$('.sortby-button').hasClass('js-sort-active')) {
                $('.sortby-button').addClass('js-sort-active');
                $('.search-result-options').addClass('show-sort');
                $('.mobile-sort-by-content').show();
            } else {
                $('.sortby-button').removeClass('js-sort-active');
                $('.search-result-options').removeClass('show-sort');
                $('.mobile-sort-by-content').hide();
            }

        }
    });

    searchRefinment.searchRefinementToggle();

    /*$(window).on('resize',function(){
		searchRefinment.searchRefinementToggle();
    });*/

    /* $('.scrollable').each(function(){
    	$(this).slimScroll({
            size: '10px',
            height: '200px',
            railVisible: true,
            alwaysVisible: true
        });

    });*/
    // handle toggle refinement blocks
    /* $main.on('click', '.refinement h3', function () {
          if( !$(this).hasClass('expand') ){
              $(this).addClass('expand').closest('.navgroup').addClass('collapse-expand').find('.sub-refinement').hide();

          }else {
              $(this).removeClass('expand').closest('.navgroup').removeClass('collapse-expand').find('.sub-refinement').show();
          }
     });*/

    // color swatches events //
    $main.on('click', '.product-swatches .product-swatches-all', function () {
        if ($(this).hasClass('loaded')) {
            $(this).next('.swatch-list.swatch-toggle').show();
            return false;
        }
        $(this).addClass('loaded');
        var cont = $(this).parent().find('ul.swatch-list.swatch-toggle');
        cont.show().trigger('focus');
        $(this).parent().find('ul.swatch-toggle li > a').each(function () {
            if ($(this).data('href')) {
                $(this).find('img').attr('src', $(this).data('href'));
            }

        });
        cont.show().trigger('focus');
    });
    // prepare swatch palettes and thumbnails
    // show the palette

    // hide the palette
    $('#content div.product-swatches div.swatch-image').on('mouseout', function (e) {
        // fix for event bubbling (http://www.quirksmode.org/js/events_mouse.html)
        if (!e) {
            e = window.event;
        }
        var tg = (window.event) ? e.srcElement : e.target;
        if (tg.nodeName != 'DIV') {
            return;
        }
        var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
        while (reltg != tg && reltg.nodeName != 'BODY') {
            reltg = reltg.parentNode;
        }
        if (reltg == tg) {
            return;
        }

        // mouseout took place when mouse actually left layer
        // handle event now
        $(this).hide();
        return false;
    });

    $('.swatch-list.swatch-toggle').on('mouseleave', function () {
        $('.swatch-list.swatch-toggle').hide();
    });

    jQuery('#content .producttile div.swatches div.invisible').hide();
    jQuery('#content .producttile div.swatches a.swatch img.hiddenthumbnail').hide();

    $('#content.product-swatches .product-swatches-all.loaded').on('click', function () {
        //var swatch = jQuery(this);
        updateProductListing(this.href);
        // omit following the swatch link
        return false;
    });

    $('body').on('mouseleave', function () {
        if ($(window).width() > 960) {
            $('.swatch-list.swatch-toggle').hide();
        }
    });
    $('body').on('blur', function () {
        $('.swatch-list.swatch-toggle').hide();

    });

    // handle events for updating grid
    $main.on('click', '.refinement a, .sorthitscontainer .pagination a, .breadcrumb-refinement-value a, .mobile-sort-by-content a', function (e) {
        // don't intercept for category and folder refinements, as well as unselectable
        if ($(this).parents('.category-refinement').length > 0 || $(this).parents('.folder-refinement').length > 0 || $(this).parent().hasClass('unselectable')) {
            return;
        }
        e.preventDefault();
        var query = util.getQueryString(this.href);
        window.location.hash = query;
        if (this.href === window.location.href) {
            return;
        }
        updateProductListing(this.href);
    });

    $('.productlisting.sub-cat').each(function () {
        $(this).find('.product.producttile.cell').first().addClass('subfirst');
    });

    // handle events item click. append params.
    $main.on('click', '.product-tile a:not("#quickviewbutton")', function () {
        var a = $(this);
        // get current page refinement values
        var wl = window.location;

        var qsParams = (wl.search.length > 1) ? util.getQueryStringParams(wl.search.substr(1)) : {};
        var hashParams = (wl.hash.length > 1) ? util.getQueryStringParams(wl.hash.substr(1)) : {};

        // merge hash params with querystring params
        var params = $.extend(hashParams, qsParams);
        if (!params.start) {
            params.start = 0;
        }
        // get the index of the selected item and save as start parameter
        var tile = a.closest('.product-tile');
        var idx = tile.data('idx') ? +tile.data('idx') : 0;

        /*Start JIRA PREV-50 : Next and Previous links will not be displayed on PDP if user navigate from Quick View.Added cgid to hash*/
        if (!params.cgid && tile.data('cgid') !== null && tile.data('cgid') !== '') {
            params.cgid = tile.data('cgid');
        }
        /*End JIRA PREV-50*/

        // convert params.start to integer and add index
        params.start = (+params.start) + (idx + 1);
        // set the hash and allow normal action to continue
        a[0].hash = $.param(params);
    });

    // handle sorting change
    $main.on('change', '.sort-by select', function (e) {
        var selectedOption = $('.sort-by option:selected').val().split('?')[1].split('&');
        //var url = $(this).val();
        var selectedOptionval = '';
        $.each(selectedOption, function (i, v) {
            if (v.indexOf('srule') != -1) {
                selectedOptionval = v.split('=')[1];
            }
        });

        if (selectedOptionval.length != 0) {
            var dateObj = new Date();
            dateObj.setTime(dateObj.getTime() + (60 * 60 * 1000));
            document.cookie = 'selectedOption=' + selectedOptionval + '; expires=' + dateObj.toUTCString() + '; path=/';
            /*
            var sortRule = url.split('?')[1].split('&');
            var sortType = '';

            $.each(sortRule, function (i, v) {
                if (v.indexOf('srule') != -1) {
                    sortType = v.split('=')[1];
                }
            });
            */
        }
        e.preventDefault();
        var query = util.getQueryString($(this).find('option:selected').val());
        window.location.hash = query;
        if ($(this).find('option:selected').val() === window.location.href) {
            return;
        }
        updateProductListing($(this).find('option:selected').val());
    }).on('change', '.items-per-page select', function () {
        var refineUrl = $(this).find('option:selected').val();
        if (refineUrl === 'INFINITE_SCROLL') {
            $('html').addClass('infinite-scroll').removeClass('disable-infinite-scroll');
        } else {
            $('html').addClass('disable-infinite-scroll').removeClass('infinite-scroll');
            var query = util.getQueryString(refineUrl);
            window.location.hash = query;
            if (refineUrl === window.location.href) {
                return;
            }
            updateProductListing(refineUrl);
        }
    });
}

exports.init = function () {
    compareWidget.init();
    if (SitePreferences.LISTING_INFINITE_SCROLL) {
        $(window).on('scroll', infiniteScroll);
    }
    productTile.init();
    initializeEvents();
};
