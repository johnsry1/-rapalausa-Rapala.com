'use strict';

var $cache = {};
var ajax = require('./ajax'),
    util = require('./util');

function initializeCache() {
    $cache.main = $('#main');
    $cache.subscriptionForm = $('#footer .email-subscribe');
    $cache.subscribe = $cache.subscriptionForm.find('button');
    $cache.message = $cache.subscriptionForm.find('.newslettermsg');
}

function initializeEvents() {
    $cache.subscribe.on('click', function (e) {
        e.preventDefault();
        if (!$cache.subscriptionForm.valid()) {
            return false;
        }
        var url = util.ajaxUrl($cache.subscriptionForm.attr('action'));
        ajax.getJson({
            url: url,
            data: $cache.subscriptionForm.serialize(),
            callback: function (data) {
                if (data.success) {
                    $cache.message.text('').text(Resources.SIGNUPSUCCESS).css('color', 'GREEN');
                } else {
                    $cache.message.text('').text(Resources.SIGNUPFAIL).css('color', 'RED');
                }
            }
        });
    });
}

function initEmailSubscription() {
    initializeCache();
    initializeEvents();
}

exports.init = function() {
    initEmailSubscription();
};
