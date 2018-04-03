'use strict';

var page = require('../page'),
    quickview = require('../quickview'),
    account = require('./account'), 
    util = require('../util');


function initQuickVieweditButtons() {
    var $qvButton = $('#quickviewbutton');
    var $link = $(this);
    $qvButton.attr({
        'href': $link.attr('href'),
        'title': $link.attr('title')
    }).appendTo(this);
    $qvButton.off('click').on('click', function (e) {
        e.preventDefault();
        quickview.show({
            url: $(this).attr('href').split('#')[0], //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
            source: 'quickview'
        });
    });
}

exports.init = function () {
    //Start JIRA PREV-412 : SG Issue: Password reset overlay displayed as a page
    account.initCartLogin();
    $('#editAddress').on('change', function () {
        page.redirect(util.appendParamToURL(Urls.wishlistAddress, 'AddressID', $(this).val()));
    });

    //add js logic to remove the , from the qty feild to pass regex expression on client side
    $('.option-quantity-desired input').on('focusout', function () {
        $(this).val($(this).val().replace(',', ''));
    });
    
    initQuickVieweditButtons();
};
