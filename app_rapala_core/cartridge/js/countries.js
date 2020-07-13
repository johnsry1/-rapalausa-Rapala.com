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
        var url =  $(this)[0].host;
        document.cookie = 'preferredRegion=' + url + '; max-age=180000';
        document.cookie = 'preferredRegion=' + url + '; max-age=180000, domain=dev03.rapala.ca';
        document.cookie = 'preferredRegion=' + url + '; max-age=180000, domain=dev03.rapala.com';        
        document.cookie = 'preferredRegion=' + url + '; max-age=180000, domain=dev03.rapala.fi';
        document.cookie = 'preferredRegion=' + url + '; max-age=180000, domain=dev03.rapala.co.uk';
        window.location.assign(url);
    });
};
