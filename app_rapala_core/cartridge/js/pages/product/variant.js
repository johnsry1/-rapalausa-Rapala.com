'use strict';

var image = require('./image'),
    progress = require('../../progress'),
    productStoreInventory = require('../../storeinventory/product'),
    tooltip = require('../../tooltip'),
    util = require('../../util');

var $pdpMain = $('#pdpMain');
//var $variationAttributes = $('.variationattributes');
var swatchesSelected = {
    initialSetup: function ($this) {
        if (!$this.hasClass('size')) {
            $this.addClass('future');
            $this.find('.optionwrapper').slideUp(400);
        } else {
            $this.addClass('current');
        }
    },
    init: function () {
        var $pdpMain = $('#pdpMain');
        var $sizeContainer = $pdpMain.find('.swatches.size');

        var $variationAttributes = $('.variationattributes');
        if ($sizeContainer.find('ul li.selected').length > 0) {
            $sizeContainer.removeClass('current').addClass('selected');
            $sizeContainer.find('.selectedvarval').text($sizeContainer.find('ul .selected-value').text());
            $sizeContainer.find('.optionwrapper').slideUp(400);
            $variationAttributes.find('.variantdropdown').each(function () {
                var $this = $(this);
                var $selectBox = $this.find('.variation-select');
                if ($selectBox.find('option').length > 2) {
                    if ($this.find('select option[selected=\'selected\']').length > 0) {
                        $this.removeClass('future current').addClass('selected');
                        $this.find('select option').eq(1).attr('selected', 'selected');
                        //$this.find('.selectedvarval').text($this.find('select option[selected='selected']').text());
                        $this.find('.selectedvarval').text($this.find('.selectedVariationVal').val());
                        $this.find('.optionwrapper').slideUp(400);
                    } else {
                        $this.removeClass('future').addClass('current');
                        $this.find('.optionwrapper').slideDown(400);
                        $this.nextAll('.swatches, .variantdropdown').each(function () {
                            var $variant = jQuery(this);
                            $variant.addClass('future').removeClass('selected current');
                            if ($variant.hasClass('swatches')) {
                                $variant.find('.optionwrapper').slideUp(400);
                            } else if ($variant.hasClass('variantdropdown')) {
                                $variant.find('.optionwrapper').slideUp(400);
                            }
                        });
                        return false;
                    }
                } else if ($selectBox.find('option').length < 3) {
                    if ($this.find('select option[selected=\'selected\']').length > 0) {
                        $this.removeClass('future').addClass('selected');
                        $this.find('select option').eq(1).attr('selected', 'selected');
                        //$this.find('.selectedvarval').text($this.find('select option[selected='selected']').text());
                        $this.find('.selectedvarval').text($this.find('.selectedVariationVal').val());
                        $this.find('.optionwrapper').slideUp(400);
                    } else {
                        $this.removeClass('future').addClass('current');
                        $this.find('.optionwrapper').slideDown(400);
                        $this.nextAll('.swatches, .variantdropdown').each(function () {
                            var $variant = jQuery(this);
                            $variant.addClass('future').removeClass('selected current');
                            if ($variant.hasClass('swatches')) {
                                $variant.find('.optionwrapper').slideUp(400);
                            } else if ($variant.hasClass('variantdropdown')) {
                                $variant.find('.optionwrapper').slideUp(400);
                            }
                        });
                        return false;
                    }

                }

            });
        } else {
            $('#pdpMain').find('.variationattributes .swatches,.variationattributes .variantdropdown').each(function () {
                var $this = $(this);
                if (!$this.hasClass('size')) {
                    $this.addClass('future');
                    $this.find('.optionwrapper').slideUp(400);
                } else {
                    $this.addClass('current');
                }
            });
        }
        initializeEvent();
    },
    color: function () {
        var $pdpMain = $('#pdpMain');
        var $sizeContainer = $pdpMain.find('.swatches.color ');
        if ($sizeContainer.find('ul li.selected').length > 0) {
            $sizeContainer.find('.selectedvarval').text($sizeContainer.find('ul .selected-value').text());
        }
    }
};
/**
 * @description update product content with new variant from href, load new content to #product-content panel
 * @param {String} href - url of the new product variant
 **/
var updateContent = function (href) {
    var $pdpForm = $('.pdpForm');
    var qty = $pdpForm.find('input[name=Quantity]').first().val();
    var params = {
        Quantity: isNaN(qty) ? '1' : qty,
        format: 'ajax',
        productlistid: $pdpForm.find('input[name=productlistid]').first().val()
    };

    progress.show($('#pdpMain'));
    $.ajax({
        url: util.appendParamsToUrl(href, params),
        async: false
    }).done(function (data) {
        $('#product-content').html(data);
        if (SitePreferences.STORE_PICKUP) {
            productStoreInventory.init();
        }

        image.replaceImages();
        $('#Quantity').trigger('change');
        //JIRA PREV-235:PD page: 'Not Available' message is not displaying when more than Available Qty entered in Qty field.
        swatchesSelected.init();
        swatchesSelected.color();
        tooltip.init();
        progress.hide();
    });

};

function initializeEvent() {
    //bind the 'previous' buttons in the picker
    jQuery('a.previous').on('click keypress', function (e) {
        e.preventDefault();
        jQuery(this)
            .closest('.swatches, .variantdropdown')
            .prevUntil('.swatches, .variantdropdown')
            .prev()
            .find('a.filter').trigger('click');
    });

    // hover on swatch - should update main image with swatch image
    $('body').off('mouseenter mouseleave focusin', '.swatchanchor').on('mouseenter mouseleave focusout', '.swatchanchor', function (e) {
        var largeImg = $(this).data('lgimg'),
            $imgZoom = $pdpMain.find('.main-image'),
            $mainImage = $pdpMain.find('.primary-image');
        $(this).closest('.swatches.color ').find('.selectedvarval').text('');
        if (e.type == 'mouseenter' || e.type == 'mouseover' || e.type == 'focus') {
            $(this).closest('.swatches.color ').find('.selectedvarval').text($(this).text());
        } else if (e.type == 'mouseout' || e.type == 'mouseleave') {
            $(this).closest('.swatches.color ').find('.selectedvarval').text($pdpMain.find('.swatches.color ').find('ul .selected-value').text());
        }

        if (!largeImg) {
            return;
        }
        // store the old data from main image for mouseleave handler
        $(this).data('lgimg', {
            hires: $imgZoom.attr('href'),
            url: $mainImage.attr('src'),
            alt: $mainImage.attr('alt'),
            title: $mainImage.attr('title')
        });
        // set the main image
        image.setMainImage(largeImg);
    });

    // click on swatch - should replace product content with new variant
    $('body').off('click', '.product-detail .swatchanchor').on('click', '.product-detail .swatchanchor', function (e) {
        e.preventDefault();
        if ($(this).parents('li').hasClass('unselectable')) {
            return;
        }
        updateContent(this.href);
    });

    // change drop down variation attribute - should replace product content with new variant
    $('body').off('change', '.variation-select').on('change', '.variation-select', function () {
        if ($(this).val().length === 0) {
            return;
        }
        updateContent($(this).val());
    });
    // clicking on a previous step
    $('.variationattributes').on('click', '.selected a.filter', function (e) {
        e.preventDefault();
        var $this = $(this).closest('.selected');
        $('.variationattributes .swatches,.variationattributes .variantdropdown').removeClass('current');
        $this.removeClass('selected').addClass('current');
        $(this).parent().find('.swatchesdisplay .selected a').trigger('click');
        $(this).parent().find('select').val($(this).parent().find('select').find('option.emptytext').attr('value')).trigger('change');
        $this = $('body').find('.product-variations .attribute.current').last();
        $this.nextAll('.swatches, .variantdropdown').each(function (i) {
            var $variant = $('body').find('.product-variations .attribute').eq(i + 1);
            if ($variant.hasClass('future')) {
                $variant.addClass('future').removeClass('selected');
                if ($variant.hasClass('swatches')) {
                    $variant.find('.selected a').trigger('click');
                } else if ($variant.hasClass('variantdropdown')) {
                    var $select = $variant.find('select');
                    $select.val($select.find('option.emptytext').attr('value')).trigger('change');
                }
            } else if ($variant.closest('.product-variations').find('.future').length == 1 || $variant.closest('.product-variations').find('.future').length == 2) {
                if ($variant.closest('.product-variations').find('.future').find('.selected a').length > 0) {
                    var unSelectUrl = $variant.closest('.product-variations').find('.future').find('.selected a').attr('href');
                    unSelectUrl = util.appendParamToURL(unSelectUrl, 'unselect', 'true');
                    $variant.closest('.product-variations').find('.future').find('.selected a').attr('href', unSelectUrl);
                    $variant.closest('.product-variations').find('.future').find('.selected a').trigger('click');
                }

            }

        });

        jQuery('.variationattributes').find('.future .optionwrapper').slideUp(400, function () {
            jQuery('.current .optionwrapper').slideDown(400, function () {
                $(this).find('.filter .value').text('');
            });
        });
        jQuery('.variationattributes').find('.current .optionwrapper').slideDown(400, function () {
            $(this).closest('.current').find('.filter .value').text('');
        });
    });
    $pdpMain.find('.variationattributes .variantdropdown').each(function () {
        var $this = $(this);
        if ($this.hasClass('variantdropdown')) {
            if ($this.find('input.unselectURL').length > 0) {
                var $select = $this.find('select');

                var unSelectUrl = $this.find('input.unselectURL').val();
                if (unSelectUrl == '') {
                    unSelectUrl = $this.find('input.unselectURL').val();
                }
                unSelectUrl = util.appendParamToURL(unSelectUrl, 'unselect', 'true');
                $select.find('option.emptytext').attr('value', unSelectUrl);
            }
        }
    });
}

module.exports = function () {
    initializeEvent();
    $pdpMain.find('.variationattributes .swatches,.variationattributes .variantdropdown').each(function () {
        var $this = $(this);
        if ($this.hasClass('variantdropdown')) {
            if ($this.find('input.unselectURL').length > 0) {
                var $select = $this.find('select');

                var unSelectUrl = $this.find('input.unselectURL').val();
                if (unSelectUrl == '') {
                    unSelectUrl = $this.find('input.unselectURL').val();
                }
                unSelectUrl = util.appendParamToURL(unSelectUrl, 'unselect', 'true');
                $select.find('option.emptytext').attr('value', unSelectUrl);
            }
        }
        swatchesSelected.init();
    });
};
