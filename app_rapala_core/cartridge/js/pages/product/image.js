'use strict';
var dialog = require('../../dialog'),
    util = require('../../util');

var zoomMediaQuery = matchMedia('(min-width: 960px)');

/**
 * @description Enables the zoom viewer on the product detail page
 * @param zmq {Media Query List}
 */
var loadZoom = function (zmq) {
    var $imgZoom = $('#pdpMain .main-image');
    if (!zmq) {
        zmq = zoomMediaQuery;
    }
    if ($imgZoom.length === 0 || dialog.isActive() || util.isMobile() || !zoomMediaQuery.matches) {
        // remove zoom
        $imgZoom.trigger('zoom.destroy');
        return;
    }
};

zoomMediaQuery.addListener(loadZoom);

/**
 * @description Sets the main image attributes and the href for the surrounding <a> tag
 * @param {Object} atts Object with url, alt, title and hires properties
 */
var setMainImage = function (atts) {
    $('#pdpMain .primary-image').attr({
        src: atts.url,
        alt: atts.alt,
        title: atts.title
    });
    if (!dialog.isActive() && !util.isMobile()) {
        $('#pdpMain .main-image').attr('href', atts.hires);
    }
    //loadZoom();
};

/**
 * @description Replaces the images in the image container, for eg. when a different color was clicked.
 */
var replaceImages = function () {
    var $newImages = $('#update-images'),
        $imageContainer = $('#pdpMain .product-image-container');
    if ($newImages.length === 0) {
        return;
    }

    $imageContainer.html($newImages.html());
    $newImages.remove();
    //loadZoom();
};

/* @module image
 * @description this module handles the primary image viewer on PDP
 **/

/**
 * @description by default, this function sets up zoom and event handler for thumbnail click
 **/
module.exports = function () {
    if (dialog.isActive() || util.isMobile()) {
        $('#pdpMain .main-image').removeAttr('href');
    }
    //loadZoom();
    // handle product thumbnail click event
    $('#pdpMain').on('click', '.productthumbnail', function () {
        // switch indicator
        $(this).closest('.product-thumbnails').find('.thumb.selected').removeClass('selected');
        $(this).closest('.thumb').addClass('selected');

        setMainImage($(this).data('lgimg'));
    });
};
//module.exports.loadZoom = loadZoom;
module.exports.setMainImage = setMainImage;
module.exports.replaceImages = replaceImages;
