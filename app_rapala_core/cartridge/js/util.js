'use strict';

var _ = require('lodash');
var cardregex = {
    mastercard: /^5[1-5][0-9]{2,14}$/,
    visa: /^4[0-9]{3,15}$/,
    amex: /^3[47]([0-9]{2,13})$/,
    discover: /^6(?:011[0-9]{0,12}|5[0-9]{2,14})$/
};
var util = {
    /**
     * @function
     * @description appends the parameter with the given name and value to the given url and returns the changed url
     * @param {String} url the url to which the parameter will be added
     * @param {String} name the name of the parameter
     * @param {String} value the value of the parameter
     */
    appendParamToURL: function (url, name, value) {
        // quit if the param already exists
        if (url.indexOf(name + '=') !== -1) {
            return url;
        }
        var separator = url.indexOf('?') !== -1 ? '&' : '?';
        return url + separator + name + '=' + encodeURIComponent(value);
    },
    hiddenData: function () {
        jQuery.each(jQuery('.hidden'), function () {
            var hiddenStr = jQuery(this).html();

            if (hiddenStr === '') {
                return;
            }

            // see if its a json string
            if (jQuery(this).hasClass('json')) {
                // try to parse it as a json
                try {
                    hiddenStr = window.eval('(' + hiddenStr + ')');
                } catch (e) {
                    // Do Nothing
                }
            }

            jQuery(this).prev().data('data', hiddenStr);

            jQuery(this).remove();
        });
    },

    /**** Read cookieee  *****/
    readCookie: function (name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    },

    /***  Read cookie ***/
    /**
     * @function
     * @description appends the parameters to the given url and returns the changed url
     * @param {String} url the url to which the parameters will be added
     * @param {Object} params
     */
    appendParamsToUrl: function (url, params) {
        var _url = url;
        _.each(params, function (value, name) {
            _url = this.appendParamToURL(_url, name, value);
        }.bind(this));
        return _url;
    },

    /**
     * @function
     * @description remove the parameter and its value from the given url and returns the changed url
     * @param {String} url the url from which the parameter will be removed
     * @param {String} name the name of parameter that will be removed from url
     */
    removeParamFromURL: function (url, name) {
        if (url.indexOf('?') === -1 || url.indexOf(name + '=') === -1) {
            return url;
        }
        var hash;
        var params;
        var domain = url.split('?')[0];
        var paramUrl = url.split('?')[1];
        var newParams = [];
        // if there is a hash at the end, store the hash
        if (paramUrl.indexOf('#') > -1) {
            hash = paramUrl.split('#')[1] || '';
            paramUrl = paramUrl.split('#')[0];
        }
        params = paramUrl.split('&');
        for (var i = 0; i < params.length; i++) {
            // put back param to newParams array if it is not the one to be removed
            if (params[i].split('=')[0] !== name) {
                newParams.push(params[i]);
            }
        }
        return domain + '?' + newParams.join('&') + (hash ? '#' + hash : '');
    },

    /**
     * @function
     * @description extract the query string from URL
     * @param {String} url the url to extra query string from
     **/
    getQueryString: function (url) {
        var qs;
        if (!_.isString(url)) {
            return;
        }
        var a = document.createElement('a');
        a.href = url;
        if (a.search) {
            qs = a.search.substr(1); // remove the leading ?
        }
        return qs;
    },
    /**
     * @function
     * @description
     * @param {String}
     * @param {String}
     */
    elementInViewport: function (el, offsetToTop) {
        var top = el.offsetTop,
            left = el.offsetLeft,
            width = el.offsetWidth,
            height = el.offsetHeight;

        while (el.offsetParent) {
            el = el.offsetParent;
            top += el.offsetTop;
            left += el.offsetLeft;
        }

        if (typeof(offsetToTop) !== 'undefined') {
            top -= offsetToTop;
        }

        if (window.pageXOffset !== null) {
            return (
                top < (window.pageYOffset + window.innerHeight) &&
                left < (window.pageXOffset + window.innerWidth) &&
                (top + height) > window.pageYOffset &&
                (left + width) > window.pageXOffset
            );
        }

        if (document.compatMode === 'CSS1Compat') {
            return (
                top < (window.document.documentElement.scrollTop + window.document.documentElement.clientHeight) &&
                left < (window.document.documentElement.scrollLeft + window.document.documentElement.clientWidth) &&
                (top + height) > window.document.documentElement.scrollTop &&
                (left + width) > window.document.documentElement.scrollLeft
            );
        }
    },

    /**
     * @function
     * @description Appends the parameter 'format=ajax' to a given path
     * @param {String} path the relative path
     */
    ajaxUrl: function (path) {
        return this.appendParamToURL(path, 'format', 'ajax');
    },

    /**
     * @function
     * @description
     * @param {String} url
     */
    toAbsoluteUrl: function (url) {
        if (url.indexOf('http') !== 0 && url.charAt(0) !== '/') {
            url = '/' + url;
        }
        return url;
    },
    /**
     * @function
     * @description Loads css dynamically from given urls
     * @param {Array} urls Array of urls from which css will be dynamically loaded.
     */
    loadDynamicCss: function (urls) {
        var i, len = urls.length;
        for (i = 0; i < len; i++) {
            this.loadedCssFiles.push(this.loadCssFile(urls[i]));
        }
    },

    /**
     * @function
     * @description Loads css file dynamically from given url
     * @param {String} url The url from which css file will be dynamically loaded.
     */
    loadCssFile: function (url) {
        return $('<link/>').appendTo($('head')).attr({
            type: 'text/css',
            rel: 'stylesheet'
        }).attr('href', url); // for i.e. <9, href must be added after link has been appended to head
    },
    // array to keep track of the dynamically loaded CSS files
    loadedCssFiles: [],

    /**
     * @function
     * @description Removes all css files which were dynamically loaded
     */
    clearDynamicCss: function () {
        var i = this.loadedCssFiles.length;
        while (0 > i--) {
            $(this.loadedCssFiles[i]).remove();
        }
        this.loadedCssFiles = [];
    },
    /**
     * @function
     * @description Extracts all parameters from a given query string into an object
     * @param {String} qs The query string from which the parameters will be extracted
     */
    getQueryStringParams: function (qs) {
        if (!qs || qs.length === 0) {
            return {};
        }
        var params = {},
            unescapedQS = decodeURIComponent(qs);
        // Use the String::replace method to iterate over each
        // name-value pair in the string.
        unescapedQS.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function ($0, $1, $2, $3) {
                params[$1] = $3;
            }
        );
        return params;
    },

    fillAddressFields: function (address, $form) {
        for (var field in address) {
            if (field === 'ID' || field === 'UUID' || field === 'key') {
                continue;
            }
            // if the key in address object ends with 'Code', remove that suffix
            // keys that ends with 'Code' are postalCode, stateCode and countryCode
            $form.find('[name$="' + field.replace('Code', '') + '"]').val(address[field]);
            // update the state fields
            if (field === 'countryCode') {
                $form.find('[name$="country"]').trigger('change');
                // retrigger state selection after country has changed
                // this results in duplication of the state code, but is a necessary evil
                // for now because sometimes countryCode comes after stateCode
                $form.find('[name$="state"]').val(address.stateCode);
            }
        }
    },
    /**
     * @function
     * @description Updates the number of the remaining character
     * based on the character limit in a text area
     */
    limitCharacters: function () {
        $('form').find('textarea[data-character-limit]').each(function () {
            var characterLimit = $(this).data('character-limit');
            var charCountHtml = String.format(Resources.CHAR_LIMIT_MSG,
                '<span class="char-remain-count">' + characterLimit + '</span>',
                '<span class="char-allowed-count">' + characterLimit + '</span>');
            var charCountContainer = $(this).next('div.char-count');
            if (charCountContainer.length === 0) {
                charCountContainer = $('<div class="char-count"/>').insertAfter($(this));
            }
            charCountContainer.html(charCountHtml);
            // trigger the keydown event so that any existing character data is calculated
            $(this).change();
        });
    },
    trimPrefix: function (str, prefix) {
        return str.substring(prefix.length);
    },
    cardtype: {
        init: function () {
            if ($('#paymentmethods').find('.creditCard-number').length > 0) {
                $('#paymentmethods').find('.creditCard-number').bind('keypress keyup', function () {
                    if ($(this).val().length) {
                        $('.carderror.error').hide();
                    }
                    if ($(this).val().length < 4) {
                        $('.cardtypeimg > div').hide();
                    }
                });
                $('.creditCard-number, .creditcard_cvn').on('keypress', function (e) {
                    e = (e) ? e : window.event;
                    var charCode = (e.which) ? e.which : e.keyCode;
                    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                        return false;
                    }
                    return true;
                });
                $('#paymentmethods').find('.creditCard-number').blur(function () {
                    var val = $.trim($(this).val());
                    //var regex = /^[a-zA-Z]+$/;
                    var errorspan = $(this).closest('.formfield').find('span.carderror');
                    if (!val) {
                        errorspan.hide();
                        return;
                    }
                    if (val.length) {
                        if ($('.carderror.error').length == 0) {
                            $(this).closest('.formfield').append('<span class="carderror error">Not a valid Credit Card Number, please try again.</span>');
                        }
                        $('.carderror.error').hide();
                        var cardTypeval = util.validatecardtype(val);
                        if (cardTypeval != 'Error') {
                            errorspan.hide();
                            $('#paymentmethods').find('select[name$="_paymentMethods_creditCard_type"]').val(cardTypeval);
                            $('.cardtypeimg > div').hide();
                            $('.cardtypeimg > div.' + cardTypeval).show();

                            if ((cardTypeval == 'MasterCard') || (cardTypeval == 'Visa') || (cardTypeval == 'Discover')) {
                                if (val.length < 16) {
                                    $('.carderror.error').show();
                                    $(this).addClass('errorclient');
                                }
                            } else if (cardTypeval == 'Amex') {
                                if (val.length < 15) {
                                    $('.carderror.error').show();
                                    $(this).addClass('errorclient');
                                }
                            } else {
                                $('.carderror.error').hide();
                                $(this).removeClass('errorclient');
                            }
                        } else {
                            if ($(this).val().indexOf('*') == -1) {
                                if (val.length < 16) {
                                    $('.carderror.error').show();
                                    $(this).addClass('errorclient');
                                    $('.cardtypeimg > div').hide();
                                }
                            }
                        }
                    }
                    if ($('#paymentmethods').find('.creditCard-number').val().length < 4) {
                        $('.cardtypeimg > div').hide();
                    }
                });
            }

        }

    },
    validatecardtype: function (val) {
        var result = ' ',
            carNo = val;

        if (cardregex.mastercard.test(carNo)) {// first check for MasterCard
            result = 'MasterCard';
        } else if (cardregex.visa.test(carNo)) {// then check for Visa
            result = 'Visa';
        } else if (cardregex.amex.test(carNo)) {// then check for AmEx
            result = 'Amex';
        } else if (cardregex.discover.test(carNo)) {
            result = 'Discover';
        } else {
            result = 'Error';
        }
        return result;
    },
    /**
     * @function
     * @description Binds the onclick-event to a delete button on a given container,
     * which opens a confirmation box with a given message
     * @param {String} container The name of element to which the function will be bind
     * @param {String} message The message the will be shown upon a click
     */
    setDeleteConfirmation: function (container, message) {
        $(container).on('click', '.delete', function () {
            return window.confirm(message);
        });
    },
    /**
     * @function
     * @description Scrolls a browser window to a given x point
     * @param {String} The x coordinate
     */
    scrollBrowser: function (xLocation) {
        $('html, body').animate({
            scrollTop: xLocation
        }, 500);
    },

    isMobile: function () {
        var mobileAgentHash = ['mobile', 'tablet', 'phone', 'ipad', 'ipod', 'android', 'blackberry', 'windows ce', 'opera mini', 'palm'];
        var idx = 0;
        var isMobile = false;
        var userAgent = (navigator.userAgent).toLowerCase();

        while (mobileAgentHash[idx] && !isMobile) {
            isMobile = (userAgent.indexOf(mobileAgentHash[idx]) >= 0);
            idx++;
        }
        return isMobile;
    }
};

module.exports = util;
