'use strict';

var quickview = require('./quickview');

function initQuickViewButtons() {
    $('.product-content-asset').on('mouseenter', function () {
        var $qvButton = $('#quickviewbutton-asset');
        if ($qvButton.length === 0) {
            $qvButton = $('<a id="quickviewbutton-asset" class="quickview-asset">' + Resources.QUICK_VIEW + '<i class="fa fa-arrows-alt"></i></a>');
        }
        var $link = $(this).find('.buyBtn');
        $qvButton.attr({
            'href': $link.attr('href')
        }).appendTo(this);
        $qvButton.off('click').on('click', function (e) {
            e.preventDefault();
            quickview.show({
                url: $(this).attr('href').split('#')[0],
                source: 'quickview'
            });
        });
    });
    $('.product-content-asset').on('mouseleave', function () {
        var $qvButton = $('#quickviewbutton-asset');
        if ($qvButton.length != 0) {
            $qvButton.remove();
        }
    });
}

exports.init = function () {
    var $holidayAsset = $('.content-asset-quickview');
    if ($holidayAsset === 0) {
        return;
    }
    initQuickViewButtons();
};

