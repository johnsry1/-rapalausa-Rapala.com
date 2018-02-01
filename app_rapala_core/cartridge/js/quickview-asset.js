'use strict';

var quickview = require('./quickview');

function initQuickviewButtonAsset() {
    $('.product-buy-content-asset').on('click', function (e) {
        e.preventDefault();
        quickview.show({
            url: $(this).attr('href').split('#')[0],
            source: 'quickview'
        });
        if (window.innerWidth < 1024) {
            $('#QuickViewDialog').dialog('widget').position({
                my: 'top+20',
                at: 'top',
                of: window
            });
        }
    });
}
exports.init = function () {
    var $quickviewAsset = $('.product-buy-content-asset-init');
    if ($quickviewAsset.length === 0) {
        return;
    }
    initQuickviewButtonAsset();
}

