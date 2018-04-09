/*
 * All java script logic for google driven store locator.
 *
 * The code relies on the jQuery JS library to
 * be also loaded.
 *
 */

'use strict';
/*global google */
/*eslint block-scoped-var: 0 */

var MarkerWithLabel = require('./marker-with-label');

var StoreLocator = {
    // configuration parameters and required object instances
    initialLocation:        null,
    browserSupportFlag:     false,
    storeurl:               null,
    markerurl:              null,
    queryurl:               null,
    cookieurl:              null,
    cookiename:             null,
    defaultlocation:        null,
    zoomradius:             {},
    markers:                [],
    infowindows:            [],
    radius:                 50,
    map:                    null,
    unit:                   'mi',
    timer:                  null,
    maptype:                null,
    LatLngList:             [],
    isDetails:              ($('.pt_store-locator-details').length) ? true : false,

    /*********************************************************
    * initialize the google map
    * @param - zoomradius : json object with radius settings for each google zoom level (0-20)
    * @param - storeurl : url for displaying store details
    * @param - markerurl : url for marker image
    * @param - queryurl : url for querying nearest stores
    * @param - cookieurl : url for setting preferred location cookie
    * @param - cookiename : name for preferred location cookie
    * @param - defaultlocation : default address for map if users geolocation can not be detected
    * @param - maptype : type of google map to display
    **********************************************************/

    init: function (zoomradius, storeurl, markerurl, queryurl, cookieurl, cookiename, defaultlocation, maptype) {

        this.zoomradius = zoomradius;
        this.storeurl = storeurl;
        this.markerurl = markerurl;
        this.queryurl = queryurl;
        this.cookieurl = cookieurl;
        this.cookiename = cookiename;
        this.defaultlocation = defaultlocation;
        this.maptype = maptype;

        // Define the options for the Google Maps object
        var myOptions = {
                zoom: 7,
                mapTypeId: google.maps.MapTypeId[maptype],
                disableDefaultUI: true,
                scrollwheel: false,
                zoomControl: true
            },
            self = this;

        // Create a new Google Maps object with the given options
        this.map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);

        // Render Store Detail
        if ($('#storedetails-wrapper').size() > 0) {
            StoreLocator.getSearchPosition('onestore');
        // Check for cookie preference
        } else if (this.getCookieLatLng()) {
            this.initialLocation = this.getCookieLatLng();
            this.map.setCenter(this.initialLocation);
        // Try Demandware Geolocation
        } else if (window.User.geolocation) {
            this.initialLocation = new google.maps.LatLng(window.User.geolocation.latitude, window.User.geolocation.longitude);
            this.renderStores(window.User.geolocation.latitude, window.User.geolocation.longitude, $('#country').val(), $('#distanceunitpref').val(), 50, false, true);
        // Try W3C Geolocation (preferred for detection)
        } else if (google.loader.ClientLocation) {
            this.initialLocation = new google.maps.LatLng(google.loader.ClientLocation.latitude, google.loader.ClientLocation.longitude);
            this.map.setCenter(this.initialLocation);
        // Try Google Gears Geolocation
        } else if (google.gears) {
            this.browserSupportFlag = true;
            var geo = google.gears.factory.create('beta.geolocation');
            geo.getCurrentPosition(function (position) {
                this.initialLocation = new google.maps.LatLng(position.latitude, position.longitude);
                this.map.setCenter(this.initialLocation);
            }, function () {
                this.handleNoGeoLocation(this.browserSupportFlag);
                $('#stores').html('');
            });
        // Browser doesn't support Geolocation so geolocate the default
        } else {
            this.browserSupportFlag = false;
            this.handleNoGeolocation();
            $('#stores').html('');
        }

        $('#store-search-form').on('submit', function () {
            document.activeElement.blur();
            StoreLocator.getSearchPosition();
            return false;
        });

        $('#distance').change(function () {
            if ($('#distance').val() !== '') {
                StoreLocator.radius = $('#distance').val();
            } else {
                StoreLocator.radius = StoreLocator.zoomradius[self.map.getZoom()];
            }
        });

        // Update the bounds of the store locator when the browser is resized
        this.smartResize(function () {
            if (StoreLocator.markers.length) {
                StoreLocator.updateBounds();
            }
        });
    },

    /*********************************************************
    * function to close all open google InfoWindow objects
    **********************************************************/

    closeInfoWindows: function () {
        for (var i in this.infowindows) {
            if (typeof this.infowindows[i] === 'object') {
                this.infowindows[i].close();
            }
        }
    },

    /*********************************************************
    * function to create and position google Markers and
    * InfoWindows for a result set of Stores
    * @param - stores : a json object containing stores
    * @param - map : the map
    **********************************************************/
    populateStores: function (stores, noLoc, location, initLoad, milesAround, customerAddresses) {
        var noLocation = noLoc || false,
            thisLoc = location || null,
            image = this.markerurl,
            distance = 0,
            storeCount = 0,
            storeLatLng = '',
            self = this;

        // Function that is called when a map marker is clicked
        function markerClick (storeid) {
            return function () {
                StoreLocator.closeInfoWindows();
                StoreLocator.infowindows[storeid + 'Info'].open(self.map);
            };
        }

        // Function that is called when a store's link is clicked
        function storeClick () {
            /*jshint validthis:true */
            StoreLocator.closeInfoWindows();
            var storeid = $(this).parent().parent().attr('id'),
                infowindow = StoreLocator.infowindows[storeid + 'Info'];
            infowindow.open(self.map);
            self.map.setCenter(infowindow.position);
            if (screen.width < 1200) { $('body').scrollTop($('#store-locator').offset().top); }
        }

        if (this.markers.length > 0) {
            for (var j in this.markers) {
                if (typeof this.markers[j] === 'object') {
                    this.markers[j].setMap(null);
                }
            }
            this.markers.length = 0;
        }
        this.closeInfoWindows();
        this.infowindows.length = 0;
        this.LatLngList = [];
        $('#stores').addClass('noStores').html('<div class="stores-container"></div>');

        //create array of store IDs and add distance if available
        var storesArray = [];
        for (var store in stores) {
            var tempArray = [store];
            if (!noLocation) {
                if (thisLoc && stores[store].latitude && stores[store].longitude) { //calculate distance from search location
                    storeLatLng = new google.maps.LatLng(stores[store].latitude, stores[store].longitude);
                    distance    = google.maps.geometry.spherical.computeDistanceBetween(thisLoc, storeLatLng, 3959).toFixed(1);
                    tempArray.push(distance);
                }
            }
            storesArray.push(tempArray);
        }

        //if we have stores with distances we sort the array of store IDs
        if (storesArray.length && storesArray[0].length > 1) {
            storesArray.sort(function (a, b) {return a[1] - b[1];});
        }

        for (var i = 0; i < storesArray.length; i++) {
            store = storesArray[i][0];

            storeCount++;

            //format the address
            var formattedAddress = '';
            formattedAddress = (stores[store].address1) ? formattedAddress + stores[store].address1 : formattedAddress;
            formattedAddress = (stores[store].city) ? formattedAddress + ', ' + stores[store].city : formattedAddress;
            formattedAddress = (stores[store].stateCode)  ? formattedAddress + ', ' + stores[store].stateCode : formattedAddress;
            formattedAddress = (stores[store].postalCode) ? formattedAddress + ' ' + stores[store].postalCode : formattedAddress;

            //URL encode the address
            var encodedAddress = encodeURIComponent(formattedAddress);

            if (!noLocation) {
                var secondaryName = stores[store].storeSecondaryName;

                if (secondaryName !== '') {
                    secondaryName = '(' + secondaryName + ')';
                }

                // build the store info HTML for right column
                var storeinfo = '<div class="store" id="' + store + '">';
                storeinfo += '<div class="storenumber"><a href="javascript:void(0)">' + storeCount + '</a></div> ';
                storeinfo += '<div class="store-info">';
                storeinfo += '<div class="storename"><a href="' + this.storeurl + store + '"><span class="primaryName">' + stores[store].name + '</span> <span class="secondaryName">' + secondaryName + '</span></a></div>';
                storeinfo += '<div class="address1">' + stores[store].address1 + '</div>';
                storeinfo += '<div class="address2">' + stores[store].address2 + '</div>';
                storeinfo += '<div class="cityStateZip">' + stores[store].city + ', ' + stores[store].stateCode + ' ' + stores[store].postalCode + '</div>';
                storeinfo += '<div class="phone">' + stores[store].phone + '</div>';

                if (stores[store].website) {
                    storeinfo += '<div class="website"><a href="' + stores[store].website + '">' + stores[store].website + '</a></div>';
                }

                storeinfo += '<div class="hours">' + stores[store].storeHours + '</div>';
                storeinfo += '</div>';
                storeinfo += '<div class="store-links">';
                storeinfo += '<div class="details"><a href="' + this.storeurl + store + '" class="detailslink">' + Resources.STORE_DETAILS + '</a></div>';
                storeinfo += '<div class="directions"><a href="https://maps.google.com/maps?daddr=' + encodedAddress + '" class="directionslink" target="_blank">' + Resources.STORE_DIRECTIONS + '</a></div>';
                storeinfo += '</div>';

                if (thisLoc && stores[store].latitude && stores[store].longitude) { //calculate distance from search location
                    storeLatLng = new google.maps.LatLng(stores[store].latitude, stores[store].longitude);
                    distance    = google.maps.geometry.spherical.computeDistanceBetween(thisLoc, storeLatLng, 3959).toFixed(1);
                    storeinfo += '<div class="distance">' + distance + ' ' + $('#distanceunitpref').val() + ' away</div>';
                }
                storeinfo += '</div>';
                $('#stores .stores-container').append(storeinfo);
            }

            var markerOptions = {
                position: new google.maps.LatLng(stores[store].latitude, stores[store].longitude),
                map: this.map,
                title: stores[store].name + ' ' + stores[store].address1 + ' ' + stores[store].city + ', ' + stores[store].stateCode + ' ' + stores[store].postalCode + stores[store].phone,
                icon: image,
                storeid: store
            };

            if (!noLocation) {
                $.extend(markerOptions, {
                    labelContent: storeCount,
                    labelAnchor: (storeCount > 9) ? new google.maps.Point(9, 30) : new google.maps.Point(5, 30),
                    labelClass: 'markerLabel',
                    labelInBackground: false
                });
            }

            //create map marker object
            var marker = new MarkerWithLabel(markerOptions);
            marker.setMap(this.map);
            this.markers.push(marker);

            if (!noLocation || (noLocation && stores[store].countryCode === $('#country').val())) {
                //add store's coordinates to array for setting zoom and centering map later
                StoreLocator.LatLngList.push(marker.position);
            }

            //build the store info HTML for tooltip
            var contentString = '<div class="mapContent">' +
                        '<h1>' + stores[store].name + '</h1>' +
                        '<div class="contentBody"><div>' +
                        stores[store].address1 + '</div><div>' +
                        stores[store].address2 + '</div><div>' +
                        stores[store].city + ', ' +
                        stores[store].stateCode + ' ' +
                        stores[store].postalCode +
                        '</div>';

            if (StoreLocator.isDetails) {
                contentString += '<p><a href="https://maps.google.com/maps?daddr=' + encodedAddress + '">' + Resources.STORE_DIRECTIONS + '</a></p></div></div>';
            } else {
                contentString += '<div class="storedetailslink"><a href="' + this.storeurl + store + '">' + Resources.STORE_DETAILS + '</a></div></div></div>';
            }

            var infowindowPosition = -35;
            if ($('#storedetails-wrapper').size() > 0) {
                infowindowPosition = -5;
            }
            //populate store info into tooltip object
            StoreLocator.infowindows[store + 'Info'] = new google.maps.InfoWindow({
                content: contentString,
                position: marker.position,
                maxWidth: 265,
                pixelOffset: new google.maps.Size(0, infowindowPosition, 'px', 'px')
            });

            google.maps.event.addListener(marker, 'click', markerClick(store));

            $('#' + store + ' .storenumber a').on('click', storeClick);

            if ($('#storedetails-wrapper').size() > 0) {
                var storeId = $('#storeId').val();
                StoreLocator.infowindows[storeId + 'Info'].open(this.map);
            }
        }

        if (!noLocation && storeCount > 0) {
            var addressMessage = null;
            if (customerAddresses.length > 0) {
                if (!isNaN(customerAddresses)) {
                    addressMessage = Resources.STORE_RESULTS_POSTAL_CODE  + ' ' + customerAddresses;
                } else {
                    addressMessage = customerAddresses;
                }
            } else if (stores[Object.keys(stores)[0]].postalCode.length > 0) {
                addressMessage = Resources.STORE_RESULTS_POSTAL_CODE  + ' ' + stores[Object.keys(stores)[0]].postalCode;
            } else {
                addressMessage = stores[Object.keys(stores)[0]].name;
            }

            var storetext = (storeCount > 1) ? Resources.STORE_RESULTS_MULT : Resources.STORE_RESULTS_ONE;
            storetext = storetext.toString().replace('{storeCount}', storeCount, 'g').replace('{milesAround}', milesAround, 'g').replace('{addressMessage}', addressMessage, 'g');
            //var storetext = (storeCount > 1) ? 'There are ' + storeCount + ' stores within ' + milesAround + ' miles of ' + addressMessage : 'There is ' + storeCount + ' store within ' + milesAround + ' miles of ' + addressMessage;

            var titleString = '<div class="stores-header">' + storetext + '</div>';
            $('#stores').removeClass('noStores').prepend(titleString);
        }

        if (initLoad && storeCount < 1) {
            $('#stores').removeClass('noStores').html('<div class="stores-header no-stores">' + Resources.STORE_NO_RESULTS_GEO + '</div>');
            this.map.setCenter(location);
        } else {
            StoreLocator.updateBounds();
        }
    },

    updateBounds: function () {
        //  Create a new viewpoint bound
        var bounds = new google.maps.LatLngBounds();
        //  Go through each...
        for (var i = 0, LtLgLen = StoreLocator.LatLngList.length; i < LtLgLen; i++) {
            //  And increase the bounds to take this point
            bounds.extend(StoreLocator.LatLngList[i]);
        }
        //  Fit these bounds to the map
        this.map.fitBounds(bounds);
        // Set zoom
        if (this.map.getZoom() >= 17) { this.map.setZoom(16); }
    },

    /*********************************************************
    * function to collect search data and retrieve a position
    **********************************************************/

    getSearchPosition: function (type) {
        var address = $('#address').val(),
            radius  = $('#distance').val();

        if ($.trim(address) !== '') {
            this.geoCode(address, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var location = results[0].geometry.location,
                        lat        = location.lat(),
                        lng        = location.lng();
                    if (type === 'onestore') {
                        var storeId = $('#storeId').val();
                        StoreLocator.renderOneStore(storeId, lat, lng, $('#country').val(), $('#distanceunitpref').val(), radius);
                    } else {
                        StoreLocator.renderStores(lat, lng, $('#country').val(), $('#distanceunitpref').val(), radius);
                    }
                } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    StoreLocator.handleNoGeolocation();
                    $('#store-results').addClass('noStores').html('<div class="stores-header no-stores">' + Resources.STORE_NO_RESULTS + '</div>');
                } else if (typeof window.console !== 'undefined') {
                    window.console.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    },

    /*********************************************************
    * function to perform a google geocode (address -> LatLng)
    * @param - address : an address string to geocode
    * @param - callback : a callback function to handle the result
    **********************************************************/

    geoCode: function (address, callback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results, status) { callback(results, status);});
    },

    /*********************************************************
    * function to perform a nearest stores query
    * @param - zip : a postal code
    * @param - country : a country code
    * @param - unit : a distance unit (mi/km)
    * @param - radius : the radius to display stores from
    **********************************************************/

    renderStores: function (latitude, longitude, country, unit, radius, noLoc, initLoad) {
        var xhr = $.getJSON(
            this.queryurl,
            {'latitude': latitude, 'longitude': longitude, 'countryCode': country, 'distanceUnit': unit, 'maxdistance': radius},
            function (data) {
                var size = 0,
                    key;
                for (key in data.stores) {
                    if (data.stores.hasOwnProperty(key)) { size++; }
                }

                if (size > 0 || initLoad) {
                    var location = new google.maps.LatLng(latitude, longitude);
                    var milesAround = $('#distance').val();
                    var customerAddresses = $('#address').val();
                    StoreLocator.populateStores(data.stores, noLoc, location, initLoad, milesAround, customerAddresses);
                } else {
                    StoreLocator.handleNoGeolocation();
                    $('#stores').addClass('noStores').html('<div class="stores-header no-stores">' + Resources.STORE_NO_RESULTS + '</div>');
                }
            }
        );

        return xhr;
    },

    /*********************************************************
    * function to perform a nearest stores query
    * @param - zip : a postal code
    * @param - country : a country code
    * @param - unit : a distance unit (mi/km)
    * @param - radius : the radius to display stores from
    **********************************************************/

    renderOneStore: function (storeId, latitude, longitude, country, unit, radius, noLoc, initLoad) {
        var self = this,
            xhr = $.getJSON(
            this.queryurl,
            {'latitude': latitude, 'longitude': longitude, 'countryCode': country, 'distanceUnit': unit, 'maxdistance': radius},
            function (data) {
                var size = 0,
                    key;
                for (key in data.stores) {
                    if (data.stores.hasOwnProperty(key)) { size++; }
                }
                if (size > 0 || initLoad) {
                    var store = {};
                    store[storeId] = data.stores[storeId];

                    var location = new google.maps.LatLng(latitude, longitude);
                    var milesAround = $('#distance').val();
                    var customerAddresses = $('#address').val();
                    StoreLocator.populateStores(store, noLoc, location, initLoad, milesAround, customerAddresses);
                    self.map.setZoom(16);
                } else {
                    StoreLocator.handleNoGeolocation();
                    $('#stores').html('');
                }
            }
        );

        return xhr;
    },

    /*********************************************************
    * function to perform a reverse geocode (LatLng -> address)
    * @param - position : the google LatLng position
    * @param - callback : a callback function to handle the results
    **********************************************************/

    reverseGeocode: function (position, callback) {
        var geocoder = new google.maps.Geocoder();
        var location = geocoder.geocode({'latLng': position}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                callback(results);
            } else if (typeof window.console !== 'undefined') {
                // debug google requests
                window.console.error('Geocoder failed due to: ' + status);
            }
        });

        return location;
    },

    /*********************************************************
    * function handles case where geodata can't be found
    **********************************************************/

    handleNoGeolocation: function () {
        if (this.markers.length > 0) {
            for (var i in this.markers) {
                if (typeof this.markers[i] === 'object') {
                    this.markers[i].setMap(null);
                }
            }
            this.markers.length = 0;
        }

        StoreLocator.geoCode(StoreLocator.defaultlocation, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK && results[0].geometry.location) {
                StoreLocator.initialLocation = results[0].geometry.location;
            } else {
                StoreLocator.initialLocation = new google.maps.LatLng(37.09024, -95.71289100000001);
            }
        });
    },

    /*********************************************************
    * function to parse cookie value and instantiate LatLng object
    **********************************************************/

    getCookieLatLng: function () {
        if (!this.readCookie(this.cookiename)) { return null; }
        var position = this.readCookie(this.cookiename).split(',');
        var latlngpref = new google.maps.LatLng(position[0], position[1]);
        return latlngpref;
    },

    /*********************************************************
    * function read cookie value
    * @param - name : name of the cookie to retrieve value for
    **********************************************************/

    readCookie: function (name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
            if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length + 1, c.length - 1); }
        }
        return null;
    },

    /**
     * Execute callback function when the user has stopped resizing the screen.
     * @param callback {Function} The callback function to execute.
     */

    smartResize: function (callback) {
        var timeout;

        window.addEventListener('resize', function () {
            clearTimeout(timeout);
            timeout = setTimeout(callback, 100);
        });

        return callback;
    }

}; // end storelocator

module.exports = StoreLocator;
