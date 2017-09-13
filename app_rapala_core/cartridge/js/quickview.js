'use strict';

var dialog = require('./dialog'),
    product = require('./pages/product'),
    progress = require('./progress'),
    util = require('./util'),
    _ = require('lodash');


var makeUrl = function (url, source, productListID) {
    if (source) {
        url = util.appendParamToURL(url, 'source', source);
    }
    if (productListID) {
        url = util.appendParamToURL(url, 'productlistid', productListID);
    }
    return url;
};

var removeParam = function (url) {
    if (url.indexOf('?') !== -1) {
        return url.substring(0, url.indexOf('?'));
    } else {
        return url;
    }
};

var quickview = {
    init: function () {
        if (!this.exists()) {
            this.$container = $('<div/>').attr('id', 'QuickViewDialog').appendTo(document.body);
        }
        this.productLinks = $('#search-result-items .thumb-link').map(function (index, thumbLink) {
            return $(thumbLink).attr('href');
        });
    },

    setup: function (qvUrl) {
        var $btnNext = $('.quickview-next'),
            $btnPrev = $('.quickview-prev');

        product.init();

        this.productLinkIndex = _(this.productLinks).findIndex(function (url) {
            return removeParam(url) === removeParam(qvUrl);
        });

        // hide the buttons on the compare page or when there are no other products
        if (this.productLinks.length <= 1 || $('.compareremovecell').length > 0) {
            $btnNext.hide();
            $btnPrev.hide();
            return;
        } else {
            /*  Start JIRA PREV-50: Next and Previous links will not be displayed on PDP if user navigate from Quick View.
              Added current URL parameters and index to viewfulldetails link
            */
            var a = $('#view-full-details');
            var wl = window.location;
            var qsParams = (wl.search.length > 1) ? util.getQueryStringParams(wl.search.substr(1)) : {};
            var hashParams = (wl.hash.length > 1) ? util.getQueryStringParams(wl.hash.substr(1)) : {};
            var params = $.extend(hashParams, qsParams);
            params.start = parseInt(this.productLinkIndex, 10) + 1;
            var tile = $('#search-result-items .product-tile').first();
            if (!params.cgid && tile.data('cgid') !== null && tile.data('cgid') !== '') {
                params.cgid = tile.data('cgid');
            }
            a.attr('href', a.attr('href') + '#' + $.param(params));
            /*End JIRA PREV-50*/
        }

        if (this.productLinkIndex === this.productLinks.length - 1) {
            $btnNext.attr('disabled', 'disabled');
        }
        if (this.productLinkIndex === 0) {
            $btnPrev.attr('disabled', 'disabled');
        }

        $btnNext.on('click', function (e) {
            e.preventDefault();
            this.navigateQuickview(1);
        }.bind(this));
        $btnPrev.on('click', function (e) {
            e.preventDefault();
            this.navigateQuickview(-1);
        }.bind(this));
    },

    /**
     * @param {Number} step - How many products away from current product to navigate to. Negative number means navigate backward
     */
    navigateQuickview: function (step) {
        // default step to 0
        this.productLinkIndex += (step ? step : 0);
        var url = makeUrl(this.productLinks[this.productLinkIndex], 'quickview');
        dialog.replace({
            url: url,
            callback: this.setup.bind(this, url)
        });
    },

    /**
     * @description show quick view dialog
     * @param {Object} options
     * @param {String} options.url - url of the product details
     * @param {String} options.source - source of the dialog to be appended to URL
     * @param {String} options.productlistid - to be appended to URL
     * @param {Function} options.callback - callback once the dialog is opened
     */
    show: function (options) {
        var url;
        if (!this.exists()) {
            this.init();
        }
        url = makeUrl(options.url, options.source, options.productlistid);
        $("#QuickViewDialog").empty();
        var quickViewDialog = dialog.create({
            target: this.$container,
            options: {
                height: 530,
                width: 760,
                dialogClass: 'quickview',
                title: Resources.QUICK_VIEW_POPUP
            }
        });
        quickViewDialog.dialog("open");
        progress.show("#QuickViewDialog");
    	$.ajax({
    		url: url,
    		success: function(data){
    			$(quickViewDialog).append(data);
    			product.init();
    			progress.hide();
    		}
    	})
        //PREVAIL-Added for GA integration
        //GAcommented
        if (isEventTrackingEnabled && isGoogleAnalyticsEnabled) {
            googleAnalyticsEvents.quickView();
        }
    },
    exists: function () {
        return this.$container && (this.$container.length > 0);
    },
    close : function () {
        jQuery('#QuickViewDialog').dialog('close');
    }
};

module.exports = quickview;
