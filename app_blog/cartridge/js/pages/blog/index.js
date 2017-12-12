'use strict';

//var util = require('../../util');

/**
 * @function Initializes the page events depending on the checkout stage (shipping/billing)
 */
exports.init = function () {  
    
    $('#more-posts-link').on('click', function (e) {
        e.preventDefault();
        $('#additional-posts').show(); 
    });

    /* Ajax call to load more-posts
     * 
    $('#more-posts-link').on('click', function (e) {
        e.preventDefault();
        var url = this.href;
        var $container = $('#more-posts-container')
        var options = {
            url: url,
            type: 'GET',
            target: $container
        };
        $.ajax(options).done(function (response) {
            if (options.target) {
                $($container).empty().html(response);
            }
        });
    })
    */
}
