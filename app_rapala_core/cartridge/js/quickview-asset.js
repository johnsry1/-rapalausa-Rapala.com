'use strict';

var quickview = require('./quickview');

exports.init = function () {
    console.log('init');
    $('.product-buy-content-asset').on('click', function (e) {
        e.preventDefault();
        console.log('click');
        quickview.show({
            url: $(this).attr('href').split('#')[0],
            source: 'quickview'
        });
    });
};

