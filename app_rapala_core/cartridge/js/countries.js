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
    $('body').on('click', 'a.country', function(e) {
        e.stopPropagation(); 
        if ($(this).attr('href').includes('eu-en')) {
            document.cookie = 'preferredRegion=rapalaEU-; max-age=180000, domain=rapala.com';
        } else if ($(this).attr('href').includes('.ca')) {
            document.cookie = 'preferredRegion=rapalaCA-; max-age=180000, domain=rapala.com';
        } else {
            document.cookie = 'preferredRegion=rapala-; max-age=180000, domain=rapala.com';
        }
        window.location.assign($(this).attr('href'));
    });
};
