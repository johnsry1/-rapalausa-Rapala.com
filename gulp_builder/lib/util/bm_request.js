var request = require('request');
var lastCsrfToken;

/**
 * gets CSRF token stored in business manager page chrome
 */
function parseCsrfToken(body) {
    if (!body || body.indexOf('csrf_token') === -1) {
        return;
    }

    var matches = body.match(/\'csrf_token\',\n\'(.*)\',/);

    if (matches && matches[1] && matches[1].length >= 20) {
        lastCsrfToken = matches[1];
    }
}

/**
 * prepends csrf detection into given callback
 */
function patchCallback(callback) {
    var patchedCallback = function(error, response, body) {

        if (!error) {
            parseCsrfToken(body);
        }
        if (typeof callback === 'function') {
            return callback.apply(request, arguments);
        } else {
            return null;
        }
    };

    return patchedCallback;
}

/**
 * if last request handled through this module carried a csrf token, it will be
 * appended to the given URL
 */
function appendCSRF(url) {
    if (lastCsrfToken) {
        url = (url.indexOf('?') === -1) ? url + '?' : url + '&';
        url += 'csrf_token=' + lastCsrfToken;
    }
    return url;
}

/**
 * calls csrf handler and proxies request to request modules
 */
var bmRequest = function(options, callback) {
    options.url = appendCSRF(options.url);
    options.followAllRedirects = true;
    return request(options, patchCallback(callback));
};

/**
 * POST csrf handling; proxies request to request modules
 */
bmRequest.post = function(options, callback) {
    options.url = appendCSRF(options.url);
    options.followAllRedirects = true;
    return request.post(options, patchCallback(callback));
};

module.exports = bmRequest;