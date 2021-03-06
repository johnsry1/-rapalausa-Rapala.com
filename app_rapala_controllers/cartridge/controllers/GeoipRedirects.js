/**
*	Controllers to enforce the GeoIP redirection based on the geolocation and the country code. 
*	The redirection JSON has been configured in the site preference.
*
*/
var Status = require('dw/system/Status');

var RapalaHelper = require('*/cartridge/scripts/util/RapalaHelper');


function geolocationRestrictions() {
    if (dw.system.Site.current.getCustomPreferenceValue('enableGeoIPRedirects')) {
        var logMessage = '';
        logMessage += 'Requested IP address: ' + request.httpRemoteAddress + ', site: ' + dw.system.Site.current.ID + '\n';
        var geolocation = request.geolocation;
        if (geolocation != null) {
        	var path = request.httpPath;
        	var json = dw.system.Site.current.getCustomPreferenceValue("GeoIPRedirects");
            var redirects = JSON.parse(json);
            var country = geolocation.countryCode;
            var hostWhitelist = redirects["hostWhitelist"];
            var ignoreUserAgents = redirects["userAgent"];
            var userAgent = request.httpUserAgent;
            var host = request.httpHost;
            var redirectType = dw.system.Site.current.getCustomPreferenceValue("GeoIPRedirectType").value;
            if(redirectType === 'request' && (!empty(redirects[country]) && ( !empty(redirects[country]).url || (!empty(redirects[country].siteID) && path.indexOf('Sites-' +redirects[country].siteID + '-Site') < 0)))){
            	geoIPRedirection(geolocation, redirects, logMessage);
            }
            if(redirectType === 'session'){
            	geoIPRedirection(geolocation, redirects, logMessage);
            }
            if(geolocation.countryCode !== 'US' && !empty(ignoreUserAgents) && userAgent in ignoreUserAgents && ignoreUserAgents[userAgent] == "skip" && hostWhitelist != 'undefined' && hostWhitelist != '' && hostWhitelist != null && hostWhitelist.indexOf(host) > -1 && session.clickStream.clicks.length == 1){
            	var url = require('*/cartridge/scripts/util/Url').getCurrentInSession(request, 'rapala', 'default', 'Home-Show');
                response.redirect(url);
            }
            
        } else {
            logMessage += 'Geolocation not available, no redirect. \n';
        }
        RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
    }
    return;
}
function geoIPRedirection(geolocation , redirects, logMessage){
	try {
			var host = request.httpHost;
        	var path = request.httpPath;
            var country = geolocation.countryCode;
            logMessage += 'Geolocation country: ' + country + ', site: ' + dw.system.Site.current.ID + '\n';
            if (!empty(redirects)) {

                var ignoreUserAgents = redirects["userAgent"];
                var userAgent = request.httpUserAgent;
                if (!empty(ignoreUserAgents) && userAgent in ignoreUserAgents && ignoreUserAgents[userAgent] == "skip") {
                    logMessage += 'Ignored userAgent found.  No redirect.  User Agent: ' + ignoreUserAgents[userAgent] + ' \n';
                    RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
                    return;
                }

                var hostWhitelist = redirects["hostWhitelist"];
                if(hostWhitelist != 'undefined' && hostWhitelist != '' && hostWhitelist != null && hostWhitelist.indexOf(host) > -1) {
                  logMessage += 'Whitelisted Host found.  No Redirect.   Host: ' + host + ' \n';
                  RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));

                  return;
                }


                var redirectto = redirects["default"];
                if (country in redirects) {

                  if(redirects[country].url) {
                    logMessage += 'Direct URL identified in GeoIP json. \n';
                    RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));

                    directUrlRedirect = true;
                    redirectto = redirects[country].url;

                  } else {
                    directUrlRedirect = false;
                    redirectto = redirects[country].siteID;
                  }

                } else if (path == null || path == '') {
                    logMessage += 'Country not found in config JSON file and path value empty or equal NULL, no redirect. \n';
                    RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
                    return;
                }


                if ((host + path) == redirectto) {
                    logMessage += 'Host and path equals redirected value, no redirect. \n';
                    RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: logMessage}));
                    return;
                }

                if (redirectto == null || redirectto == 'undefined' || redirectto == '') {
                  RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: "No country found & no default redirect set. no redirect. "}));
                  return;
                }
                // prepare SFCC url for redirection
                var siteID = redirectto;
                var locale = redirects[country].locale;
                var requestedAction = request.httpPath.split("/").pop();
                
                if(requestedAction.indexOf("Sites-") > -1) {
                  requestedAction = "Home-Show"
                }

                RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: "Requested Path: " + request.httpPath}));

                if (redirects[country].action != '' && redirects[country].action != null && redirects[country].action != 'undefined') {
                    requestedAction = redirects[country].action;
                }

                if (!directUrlRedirect) {
                	
                	var url = require('*/cartridge/scripts/util/Url').getCurrentInSession(request, siteID, locale, requestedAction);
            		logMessage += 'Redirect country found, making redirect to : ' + redirectto + ' \n';
                    RapalaHelper.getLogger('geoip-country-redirect').info(RapalaHelper.prepareLogMessage({fileName: 'OnSession.js hook, action: onSession', message: "Redirect Ready.  SiteID:  " + siteID + ".  Locale: " + locale + ".  Action: " + requestedAction + ".  Redirect URL:  " + url }));
                    response.redirect(url);
                    
                } else {
                    response.redirect(redirectto);
                }
            } else {
                logMessage += 'Empty JSON redirect config \n';
            }
        
        } catch (e) {
            RapalaHelper.getLogger('geoip-country-redirect').error(RapalaHelper.prepareLogMessage(e));
        }
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


exports.geolocationRestrictions = geolocationRestrictions;
exports.geoIpDefaultCurrency = geoIpDefaultCurrency;
exports.geoIPRedirection = geoIPRedirection;