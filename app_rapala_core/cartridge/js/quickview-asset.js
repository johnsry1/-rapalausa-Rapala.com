'use strict';

var quickview = require('./quickview');

exports.init = function () {
    $('.product-buy-content-asset').on('click', function (e) {
        e.preventDefault();
        quickview.show({
            url: $(this).attr('href').split('#')[0],
            source: 'quickview'
        });
    });
};

