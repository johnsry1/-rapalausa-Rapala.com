'use strict';

var ajax = require('../../ajax'),
    util = require('../../util');

var updateContainer = function (data, $this) {
    var currentForm = $this.closest('form[id]');
    var $availabilityMsgContainer = currentForm.find('.availability-msg'),
        $availabilityMsg;
    if (!data) {
        $availabilityMsgContainer.html(Resources.ITEM_STATUS_NOTAVAILABLE);
        return;
    }
    if (data.isMaster) {
        return false;
    }
    $availabilityMsgContainer.empty();
    // Look through levels ... if msg is not empty, then create span el
    if (data.levels.IN_STOCK > 0) {
        $availabilityMsg = $availabilityMsgContainer.find('.in-stock-msg');
        if ($availabilityMsg.length === 0) {
            $availabilityMsg = $('<p/>').addClass('in-stock-msg').appendTo($availabilityMsgContainer);
        }
        if (data.levels.PREORDER === 0 && data.levels.BACKORDER === 0 && data.levels.NOT_AVAILABLE === 0) {
            // Just in stock
            $availabilityMsg.text(Resources.IN_STOCK);
        } else {
            // In stock with conditions ...
            $availabilityMsg.text(data.inStockMsg);
        }
        currentForm.find('.add-to-cart').attr('disabled', false);
    }
    if (data.levels.PREORDER > 0) {
        $availabilityMsg = $availabilityMsgContainer.find('.preorder-msg');
        if ($availabilityMsg.length === 0) {
            $availabilityMsg = $('<p/>').addClass('preorder-msg');
        }
        if (data.levels.IN_STOCK === 0 && data.levels.BACKORDER === 0 && data.levels.NOT_AVAILABLE === 0) {
            // Just in stock
            $availabilityMsg.text(Resources.PREORDER);
        } else {
            $availabilityMsg.text(data.preOrderMsg);
        }
    }
    if (data.levels.BACKORDER > 0) {
        $availabilityMsg = $availabilityMsgContainer.find('.backorder-msg');
        if ($availabilityMsg.length === 0) {
            $availabilityMsg = $('<p/>').addClass('backorder-msg');
        }
        if (data.levels.IN_STOCK === 0 && data.levels.PREORDER === 0 && data.levels.NOT_AVAILABLE === 0) {
            // Just in stock
            $availabilityMsg.text(Resources.BACKORDER);
        } else {
            $availabilityMsg.text(data.backOrderMsg);
        }
    }
    if (data.inStockDate !== '') {
        $availabilityMsg = $availabilityMsgContainer.find('.in-stock-date-msg');
        if ($availabilityMsg.length === 0) {
            $availabilityMsg = $('<p/>').addClass('in-stock-date-msg');
        }
        $availabilityMsg.text(String.format(Resources.IN_STOCK_DATE, data.inStockDate));
    }
    if (data.levels.NOT_AVAILABLE > 0) {
        $availabilityMsg = $availabilityMsgContainer.find('.not-available-msg');
        if ($availabilityMsg.length === 0) {
            $availabilityMsg = $('<p/>').addClass('not-available-msg');
        }
        if (data.levels.PREORDER === 0 && data.levels.BACKORDER === 0 && data.levels.IN_STOCK === 0) {
            $availabilityMsg.text(Resources.NOT_AVAILABLE);
        } else {
            $availabilityMsg.text(Resources.REMAIN_NOT_AVAILABLE);
        }
        currentForm.find('.add-to-cart').attr('disabled', true);
        $('#add-all-to-cart').attr('disabled', true);

    } else {
        if ($('.add-to-cart[disabled="disabled"]').length === 0) {
            $('#add-all-to-cart').attr('disabled', false);
        } else {
            $('#add-all-to-cart').attr('disabled', true);
        }
    }

    $availabilityMsgContainer.append($availabilityMsg);
};

var getAvailability = function () {
    var $this = $(this);
    ajax.getJson({
        url: util.appendParamsToUrl(Urls.getAvailability, {
            pid: $this.closest('form').find('#pid').val(), // JIRA PREV-55:Inventory message is not displaying for the individual product within the product set.
            Quantity: $(this).val()
        }),
        async: false, //JIRA PREV-45 : Able to proceed to checkout flow with more than instock qty by clicking on Go straight to checkout in the Mini cart.
        callback: function (data) {
            updateContainer(data, $this);
        }
    });
};

module.exports = function() {
    $('#pdpMain').on('change', '.pdpForm input[name="Quantity"]', getAvailability);
};
