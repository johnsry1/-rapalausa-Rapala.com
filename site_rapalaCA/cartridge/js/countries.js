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
    // $('.country.single-row').on('click', function (e) {
    //     // e.preventDefault();
    //     e.stopPropagation();
    //     if (location.pathname.indexOf('rapalaEU-') != -1) {
    //         $.cookie('preferredRegion', 'rapalaEU-');
    //     } else if (location.pathname.indexOf('rapalaCA-') != -1) {
    //         $.cookie('preferredRegion','rapalaCA-');
    //     } else if (location.pathname.indexOf('rapala-')) {
    //         $.cookie('preferredRegion', 'rapala-');
    //     } else {
    //         $.cookie('preferredRegion', 'rapala-');                     
    //     }
    //     $.cookie('CountrySelectorViewed', 'true');
    //     window.location.href = $(this).attr('href');
    // });
    $('body').on('click', 'a.country.single-row', function(e) {
        e.stopPropagation(); 
        
        // var urlString = $(this).attr('href');

        //endpoint to value
        

        // var id = 'trial';
        // if (window.path.indexOf('rapalaEU-') != -1) {
        //     // $.cookie('preferredRegion', 'rapalaEU-');
        //     id = 'rapalaEU-';
        // } else if (window.path.indexOf('rapalaCA-') != -1) {
        //     // $.cookie('preferredRegion','rapalaCA-');
        //     id = 'rapalaCA-';
        // } else if (window.path.indexOf('rapala-')) {
        //     // $.cookie('preferredRegion', 'rapala-');
        //     id = 'rapala-';
        // }
        window.alert('clicked url value is ' +$(this).attr('href'));
        document.cookie = 'preferredRegion=' + $(this).attr('href');
        // window.SessionAttributes.PREFERRED_REGION = id;
        // window.SessionStorage.setItem('preferredLocation', id);
        window.location.assign($(this).attr('href'));
    });
};
