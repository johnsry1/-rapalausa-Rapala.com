'use strict';

var ajax = require('./ajax'),
    util = require('./util'),
    tooltip = require('./tooltip'),
    validator = require('./validator'),
    dialog = require('./dialog');

var setDialogify = function(e) {
    e.preventDefault();
    var actionSource = $(this),
        dlgAction = $(actionSource).data('dlg-action') || {}, // url, target, isForm
        dlgOptions = $.extend({}, dialog.settings, $(actionSource).data('dlg-options') || {});

    dlgOptions.title = dlgOptions.title || $(actionSource).attr('title') || '';

    var url = dlgAction.url // url from data
        ||
        (dlgAction.isForm ? $(actionSource).closest('form').attr('action') : null) // or url from form action if isForm=true
        ||
        $(actionSource).attr('href'); // or url from href

    if (!url) {
        return;
    }

    var form = jQuery(this).parents('form');
    var method = form.attr('method') || 'POST';

    if (actionSource[0].tagName === 'BUTTON' && !form.valid() || actionSource[0].tagName === 'INPUT' && !form.valid()) {
        return false;
    }

    // if this is a content link, update url from Page-Show to Page-Include
    if ($(this).hasClass('attributecontentlink')) {
        var uri = util.getUri(url);
        url = Urls.pageInclude + uri.query;
    }
    var postData;
    if (method && method.toUpperCase() === 'POST') {
        postData = form.serialize() + '&' + jQuery(this).attr('name') + '=submit';
    } else {
        if (url.indexOf('?') === -1) {
            url += '?';
        } else {
            url += '&';
        }
        url += form.serialize();
        url = util.appendParamToURL(url, jQuery(this).attr('name'), 'submit');
    }

    var dlg = dialog.create({
        target: dlgAction.target,
        options: dlgOptions
    });

    ajax.load({
        url: $(actionSource).attr('href') || $(actionSource).closest('form').attr('action'),
        target: dlg,
        callback: function () {
            dlg.dialog('open'); // open after load to ensure dialog is centered
            validator.init();
            tooltip.init();
            if (dlg.find('.closedialog').length > 0) {
                dialog.close();
            }
        },
        data: !$(actionSource).attr('href') ? postData : null,
        type: method

    });
}

exports.setDialogify = setDialogify;
