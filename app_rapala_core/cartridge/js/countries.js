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
    $('.country .single-row').click(function (e) {
        // e.preventDefault();
        e.stopPropagation();
        if (location.pathname.indexOf('rapalaEU-') != -1) {
            $.cookie('preferredRegion', 'rapalaEU-');
        } else if (location.pathname.indexOf('rapalaCA-') != -1) {
            $.cookie('preferredRegion','rapalaCA-');
        } else if (location.pathname.indexOf('rapala-')) {
            $.cookie('preferredRegion', 'rapala-');
        } else {
            $.cookie('preferredRegion', 'rapala-');                     
        }
        $.cookie('CountrySelectorViewed', 'true');
        window.location.href = $(this).attr('href');
    });
};
