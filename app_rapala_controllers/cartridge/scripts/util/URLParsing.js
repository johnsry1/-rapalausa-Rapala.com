'use strict';

/**
 * The URLParsing module parses and processes rapala URL strings
 * typically from requests
 * @module util/URLParsing
 */

exports.getPreferredRegion = function(request) {
    return new RegExp('^' + request.httpPath.replace(/\*/g, '.*') + '$').test('*rapala*-*');
}
