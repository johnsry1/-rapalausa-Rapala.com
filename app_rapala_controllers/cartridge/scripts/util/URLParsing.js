'use strict';

/**
 * The URLParsing module parses and processes rapala URL strings
 * typically from requests
 * @module util/URLParsing
 */

exports.getPreferredRegion = function(request) {
    var regionOptions = ['rapala-', 'rapalaCA-', 'rapalaEU-'];
    for (var i = 0; i < regionOptions.length; i++){

        if (request.httpPath.indexOf(regionOptions[i]) != -1) {
            return regionOptions[i];
        }
    }
    return null;
}
