"use strict";

/**
 * @class
 * @classdesc Webdav is used to perform upload and delete functions on the instance server that is provided by the configuration stored in the gulp builder object (gb)
 */
var Webdav = function (options) {
    /**
     * Contains the options needed to setup the HTTP requests
     * @member {Object} options
     */
    this.options = options;

    /**
     * Contains the user name for the HTTP request
     * @member {string} user
     */
    this.user = options.deployment.user;

    /**
     * Contains the password for the HTTP request
     * @member {string} password
     */
    this.pass = options.deployment.password;

    /**
     * The maximum number of times an HTTP request can retry
     * @member {number} MAX_RETRY
     */
    this.MAX_RETRY = 1;
};

/**
 * @function
 * @description Uploads the data contained in the filename to the given destination
 * @param {string} dest - Destination that the data in the given filename will be uploaded to
 * @param {string} filename - Zip file on the drive that contains the cartridges to be deployed to the given version
 */
Webdav.prototype.uploadFile = function (dest, filename) {
    var method = 'PUT',
        deferred = this.options.Q.defer();

    // Build the options for the upload
    var options = this.buildHttpOptions(method, dest);

    if (options) {
        var distFile = this.options.deployment.archivePath + '/' + filename,
            data = this.options.fileSystem.readFileSync(distFile);

        var req = this.handleRequest(options, function (res) {
            if (res.statusCode === 201 || res.statusCode === 200) {
                console.log(dest);
                console.log('Successfully deployed');
                deferred.resolve();
            } else if (res.statusCode === 204) {
                deferred.reject(new Error('Remote file exists! The release file was not removed from the server on the last deployment. Please check to make sure that the unzip-files task worked correctly.'));
                return;
            } else if (res.statusCode === 401) {
                deferred.reject(new Error('Authentication failed. Check your credentials.'));
                return;
            } else if (res.statusCode === 405) {
                deferred.reject(new Error('Remote server does not support webdav!'));
                return;
            } else {
                deferred.reject(new Error('Unknown error occurred:', res.statusCode));
                return;
            }
        });

        console.log('Deploying zip to ' + dest);
        req.end(data, 'binary');
    } else {
        deferred.reject(new Error('HTTP Options not properly setup.'));
    }

    return deferred.promise;
};

/**
 * @function
 * @description Removes the given destination from the server
 * @param {string} dest - Destination that will be removed from the server
 */
Webdav.prototype.deleteDirectory = function (dest) {
    var method = 'DELETE',
        deferred = this.options.Q.defer();

    // Build the options for the delete
    var options = this.buildHttpOptions(method, dest);

    if (options) {
        var req = this.handleRequest(options, function (res) {
            if (res.statusCode === 204) {
                console.log('Remote version removed');
                deferred.resolve();
            } else if (res.statusCode === 401) {
                deferred.reject(new Error('Authentication Failed'));
                return;
            } else if (res.statusCode === 404) {
                console.warn('Remote version did not exist! You may need to set overwriteRelease to false in the deployment config. Proceeding with build.');
                deferred.resolve();
            } else if (res.statusCode === 405) {
                deferred.reject(new Error('Remote server does not support webdav!'));
                return;
            } else {
                deferred.reject(new Error('Unknown error occurred:', res.statusCode));
                return;
            }
        });

        console.log('Removing', options.path, 'from the server.');
        req.end();
    } else {
        deferred.reject(new Error('HTTP Options not properly setup.'));
    }

    return deferred.promise;
};

/**
 * @function
 * @description uploads the data contained in filename to the given destination
 * @param {string} method - HTTP method to be used in the request
 * @param {string} dest - URL that will be used in the HTTP request
 */
Webdav.prototype.buildHttpOptions = function (method, dest) {
    // Check to make sure a user and password exist before continuing
    if (typeof this.user !== 'string' || typeof this.pass !== 'string') {
        console.error('Required properties missing: `user` and `pass`.');
        return false;
    }

    var deconstructedDest = this.options.url.parse(dest),
        httpOptions = {
            method : method,
            hostname : deconstructedDest.hostname,
            port : deconstructedDest.port || 443,
            path : deconstructedDest.path,
            auth : this.user + ':' + this.pass
        };

    // Add some extra attributes if the server is using two factor authentication
    if (this.options.deployment.twoFactor === 'true' && httpOptions.hostname.indexOf('cert.staging') === 0) {
        console.log("Two Factor Enabled Using File: " + this.options.deployment.twoFactorp12);
        httpOptions.pfx = this.options.fileSystem.readFileSync(this.options.deployment.twoFactorp12);
        httpOptions.passphrase = this.options.deployment.twoFactorPassword;
        httpOptions.honorCipherOrder = true;
        httpOptions.rejectUnauthorized = false;
        httpOptions.securityOptions = 'SSL_OP_NO_SSLv3';
    }

    return httpOptions;
};

/**
 * @function
 * @description uploads the data contained in filename to the given destination
 * @param {Object} options - HTTP options to be used in the request
 * @param {requestCallback} callback - Callback function that will handle the HTTP request
 */
Webdav.prototype.handleRequest = function (options, callback) {
    // Turn off unauthorized rejections for TLS connections
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    var self = this,
        req = this.options.http.request(options, function(res) {
            console.log('Status: ' + res.statusCode + '\n');
            callback(res);
        });

    /**
     * Handles the request's error event when emitted
     * @param {error} e - The error event
     * @listens error
     */
    function errorHandler(e) {
        console.error('problem with request: ' + e.message);
        console.error(e.stack);

        if (self.options.deployment.twoFactor === 'true' && self.options.deployment.instanceRoot.indexOf('-') > -1) {
            console.warn('WARNING: Hyphens detected in instanceRoot. Two-factor authentication requires usage of the dot convention in instanceRoot.');
        }

        // Retry the request if an error has occurred up to the MAX_RETRY limit (default of 1)
        if (self.MAX_RETRY--) {
            self.handleRequest(options, callback);
        }
    }

    req.on('error', errorHandler);

    return req;
};

module.exports = Webdav;
