'use strict';

/**
 * The onSession hook is called for every new session in a site. This hook can be used for initializations,
 * like to prepare promotions or pricebooks based on source codes or affiliate information in
 * the initial URL. For performance reasons the hook function should be kept short.
 *
 * @module  request/OnSession
 */

var Status = require('dw/system/Status');

var RapalaHelper = require('*/cartridge/scripts/util/RapalaHelper')

/**
 * Gets the device type of the current user.
 * @return {String} the device type (desktop, mobile or tablet)
 */
function getDeviceType() {
    var deviceType = 'desktop';
    var iPhoneDevice = 'iPhone';
    var iPadDevice = 'iPad';
    var androidDevice = 'Android'; //Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; ADR6300 Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1

    var httpUserAgent = request.httpUserAgent;

    if (httpUserAgent.indexOf(iPhoneDevice) > -1) {
        deviceType = 'mobile';

    } else if (httpUserAgent.indexOf(androidDevice) > -1) {
        if (httpUserAgent.toLowerCase().indexOf('mobile') > -1) {
            deviceType = 'mobile';
        } else {
        		deviceType = 'tablet';
        }
    } else if (httpUserAgent.indexOf(iPadDevice) > -1) {
        deviceType = 'tablet';
    }

    return deviceType;
}

function geolocationRestrictions() {
    if (dw.system.Site.getCurrent().getCustomPreferenceValue('enableGeoIPRedirects')) {
        var logMessage = '';
        logMessage += 'Requested IP address: ' + request.httpRemoteAddress + ', site: ' + dw.system.Site.getCurrent().ID + '\n';
        try {
            var geolocation = request.getGeolocation();
            var host = request.getHttpHost();
            var path = request.getHttpPath();
            if (geolocation != null) {
                var country = geolocation.getCountryCode();
                logMessage += 'Geolocation country: ' + country + ', site: ' + dw.system.Site.getCurrent().ID + '\n';
                var json = dw.system.Site.getCurrent().getCustomPreferenceValue("GeoIPRedirects");
                var redirects = JSON.parse(json);
                if (!empty(redirects)) {
                    var ignoreUserAgents = redirects["userAgent"];
                    var userAgent = request.getHttpUserAgent();
                    if (!empty(ignoreUserAgents) && userAgent in ignoreUserAgents && ignoreUserAgents[userAgent] == "skip") {
                        logMessage += 'Ignored userAgent found: ' + ignoreUserAgents[userAgent] + ' \n';
                        RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
                        return;
                    } else {
                        var redirectto = redirects["default"];
                        if (country in redirects) {
                            redirectto = redirects[country];
                        } else if (path == null || path == '') {
                            logMessage += 'Country not found in config JSON file and path value empty or equal NULL, no redirect. \n';
                            RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
                            return;
                        }

                        if ((host + path) == redirectto) {
                            logMessage += 'Host and path equals redirected value, no redirect. \n';
                            RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
                            return;
                        } else {
                            if(redirectto == null || redirectto == 'undefined' || redirectto == '') {
                              RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: "No country found & no default redirect set. no redirect. "}));
                              return;
                            } else if(redirectto.indexOf(request.httpHost) < 0) {
                              RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: "Another domain was request that does not match country based redirect. i.e. strikemaster.com -> rapala.com.  no redirect."}));
                              return;
                            }
                            //Append original request queryString if applicable
                            if (request.httpQueryString != '' || request.httpQueryString != null) {
                              RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: "Appending query string to redirect url: " + request.httpQueryString}));
                              redirectto += ('?' + request.httpQueryString);
                            }

                            logMessage += 'Redirect country found, making redirect to : ' + redirectto + ' \n';
                            RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));

                            response.redirect(redirectto);
                        }
                    }
                } else {
                    logMessage += 'Empty JSON redirect config \n';
                }
            } else {
                logMessage += 'Geolocation not available, no redirect. \n';
            }
            RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
        } catch (e) {
            RapalaHelper.getLogger('geoip-country-redirect').error(RapalaHelper.prepareLogMessage(e));
        }
    }
    return;
}

function geoIpDefaultCurrency() {
    var logMessage = '';
    if (dw.system.Site.getCurrent().getCustomPreferenceValue('enableCountryDefaultCurrency')) {
        logMessage += 'Requested IP address: ' + request.httpRemoteAddress + ', site: ' + dw.system.Site.getCurrent().ID + '\n';
        try {
            var availableCurrency = dw.system.Site.getCurrent().getAllowedCurrencies();

            var geolocation = request.getGeolocation();
            if (geolocation == null) {
                logMessage += 'Geolocation not available, set up default currency from config \n';
            }
            var country = (geolocation != null) ? geolocation.getCountryCode() : 'default';
            logMessage += 'Geolocation country: ' + country + ', site: ' + dw.system.Site.getCurrent().ID + '\n';

            var json = dw.system.Site.getCurrent().getCustomPreferenceValue("countriesDefaultCurrency");
            var currencies = JSON.parse(json);

            if (!empty(currencies)) {
                if (country in currencies) {
                    currency = currencies[country];
                    if (availableCurrency.indexOf(currency) != -1) {
                        session.setCurrency(dw.util.Currency.getCurrency(currency));
                        logMessage += 'Sep up session currency to: ' + currency + '\n';
                    } else {
                        logMessage += 'Currency not allowed by current site : ' + currency + '\n';
                        session.setCurrency(dw.util.Currency.getCurrency(currencies['default']));
                        logMessage += 'Sep up session currency to default : ' + currencies['default'] + '\n';
                    }
                } else {
                    session.setCurrency(dw.util.Currency.getCurrency(currencies['default']));
                    logMessage += 'Sep up session currency to default : ' + currencies['default'] + '\n';
                }
            } else {
                logMessage += 'Empty JSON default currency config \n';
            }
            RapalaHelper.getLogger('geoip-default-currency').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
        } catch (e) {
            RapalaHelper.getLogger('geoip-default-currency').error(RapalaHelper.prepareLogMessage(e));
        }
    }
}

/**
 * The onSession hook function.
 */
exports.onSession = function () {
    session.custom.device = getDeviceType();
    geolocationRestrictions();
    geoIpDefaultCurrency();
    return new Status(Status.OK);
};
