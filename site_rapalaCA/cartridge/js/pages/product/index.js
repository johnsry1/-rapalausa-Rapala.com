'use strict';

var pdpEvents = require('./pdpEvents'),
    addToCart = require('./addToCart');

var product = {
    init: function () {
        //initializeDom();
        //initializeEvents();
        addToCart.init();
        pdpEvents.init();
    }
};

module.exports = product;
