'use strict';

/**
 * @function
 * @description Initializes the tooltip-content and layout
 */
var settings = {
    items: '.tooltip, .Custom-tooltip',
    delay: 0,
    track: false,
    showURL: false,
    extraClass: 'tooltipshadow',
    top: 5,
    left: -150
};
exports.init = function () {
    $(document).tooltip(
        $.extend({}, settings, {
            content: function () {
                return $(this).find('.tooltip-content , .tooltip-body').html();
            }
        }));
    /*$('.Custom-tooltip').tooltipster({
            content: jQuery(this).find('.tooltipcontainer').html(),
            contentAsHTML: true,
            maxWidth: 300,
            touchDevices: true,
            trigger: 'click'
    }); */
    $('.share-link').on('click', function (e) {
        e.preventDefault();
        var target = $(this).data('target');
        if (!target) {
            return;
        }
        $(target).toggleClass('active');
    });

    /*JIRA PREV-282 : DEV-32: SG issue- 'What is this' link in checkout billing page should not be clickable. Added the folloiwng block.*/
    $('a.tooltip').click(function (e) {
        e.preventDefault();
    });
};
