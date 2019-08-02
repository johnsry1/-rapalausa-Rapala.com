'use strict';

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function runBrowseraTest() {

    var hoverSelector = decodeURI(getUrlVars().hover);
    if (hoverSelector !== '') {
        hoverSelector = hoverSelector.replace(' eq ', '=');
        if ($(hoverSelector).length > 0) {
            $(hoverSelector).trigger('mouseenter');
        }
    }
    var clickSelector = decodeURI(getUrlVars().click);
    if (clickSelector !== '') {
        clickSelector = clickSelector.replace(' eq ', '=');
        if ($(clickSelector).length > 0) {
            $(clickSelector).trigger('click');
        }
    }
}

exports.init = function() {
    runBrowseraTest();
};
