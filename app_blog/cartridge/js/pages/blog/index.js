'use strict';

//var util = require('../../util');

/**
 * @function Initializes the page events depending on the checkout stage (shipping/billing)
 */
exports.init = function () {
    var $moreLinks = $('#more-posts-link'),
        $additionalPosts = $('#additional-posts'),
        $blogLeftNav = $('#blog-left-nav'),
        $blogShowNav = $('#blog-nav-show');

    $moreLinks.on('click', function (e) {
        e.preventDefault();
        $additionalPosts.show();
    });

    $blogLeftNav.on('click', '.arrow-light-container', function () {
        $(this).parents('.toggle-blog').toggleClass('expanded');
    });

    $blogShowNav.on('click', function () {
        $(this).toggleClass('active');
        $blogLeftNav.toggleClass('active');
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
