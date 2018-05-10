'use strict';

var util = require('../util');

function initializationEvent() {
    var currentSiteID = '';
    var currentSessionSite = $('body').find('.current-session-site').val();
    switch (currentSessionSite) {
        case 'rapala':
            currentSiteID = '1';
            break;
        case 'sufix':
            currentSiteID = '2';
            break;
        case 'triggerx':
            currentSiteID = '3';
            break;
        case 'storm':
            currentSiteID = '4';
            break;
        case 'luhrjensen':
            currentSiteID = '5';
            break;
        case 'vmc':
            currentSiteID = '6';
            break;
        case 'terminator':
            currentSiteID = '7';
            break;
        case 'bluefox':
            currentSiteID = '8';
            break;
        case 'williamson':
            currentSiteID = '9';
            break;
        case 'marcum':
            currentSiteID = '10';
            break;
        case 'strikemaster':
            currentSiteID = '11';
            break;
        case 'iceforce':
            currentSiteID = '20';
            break;
        case 'otter':
            currentSiteID = '21';
            break;
        default:
            currentSiteID = '1';
    }

}

var international = {
    init: function () {
        initializationEvent();
    }
};
module.exports = international;
