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

    // var buildURLS = function(currentdomain) {
    //     var subdomain = currentdomain.split('.')[0];
    //     var topLevel = ['.rapala.ca', '.rapala.com', '.rapala.fi', 'rapala.co.uk'];
    //     for (var i = 0; i < topLevel.length; i++) {
    //         topLevel[i] = subdomain + topLevel[i];
    //     }
    //     return topLevel;
    // }
};
