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
    $('body').on('click', 'a.country.single-row', function(e) {
        e.stopPropagation();  
        document.cookie = 'preferredRegion=' + $(this).attr('href');
        window.location.assign($(this).attr('href'));
    });
};
