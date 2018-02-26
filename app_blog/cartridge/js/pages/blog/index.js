'use strict';

/**
 * @function Initializes the page events depending on the checkout stage (shipping/billing)
 */
exports.init = function () {
    var $blogLeftNav = $('#blog-left-nav'),
        $blogShowNav = $('#blog-nav-show');

    $blogLeftNav.on('click', '.arrow-light-container', function () {
        $(this).parents('.toggle-blog').toggleClass('expanded');
    });

    $blogShowNav.on('click', function () {
        $(this).toggleClass('active');
        $blogLeftNav.toggleClass('active');
    });
    $blogLeftNav.find('.blog-nav-level-2 li').each(function() {
        if ($(this).hasClass('active')) {
            $(this).parents('.toggle-blog').addClass('expanded');
        }
    });
};
