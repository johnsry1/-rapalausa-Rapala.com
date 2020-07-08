'use strict';

exports.init = function init() {
    $('.country-selector .current-country').on('click', function () {
        $('.country-selector .selector').toggleClass('active');
        $(this).toggleClass('selector-active');
    });
    // set currency first before reload
    $('.country-selector .selector .locale').on('click', function (e) {
        e.preventDefault();
        var url = this.href;
        var currency = this.getAttribute('data-currency');
        $.ajax({
            dataType: 'json',
            url: Urls.setSessionCurrency,
            data: {
                format: 'ajax',
                currencyMnemonic: currency
            }
        })
            .done(function (response) {
                if (!response.success) {
                    throw new Error('Unable to set currency');
                }
                window.location.href = url;
            });
    });

    $('.change-currency-link').on('click', function (e) { 
        e.preventDefault();
        var url = this.href;
        $.ajax({
            dataType: 'json',
            url: url,
            data: {
                format: 'ajax'
            }
        })
            .done(function (response) {
                if (!response.success) {
                    throw new Error('Unable to set currency');
                }
                window.location.reload(false);
            });
    });
};
