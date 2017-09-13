'use strict';
/**
 *  Uploads files to Demandware webdav
 *  Based on Webdav Deploy (https://github.com/abovethewater/grunt-webdav-deploy)
 *  Added support for two-factor auth
 **/

var fs = require('fs'),
    path = require('path'),
    url = require('url');

module.exports = function (grunt) {
    // Allow up to five retries.
    var MAX_RETRY = 5;

    function performHTTPActions(httpOptions, options, enc, suppress) {
        var http = options.http;
        var grunt = options.grunt;
        if (enc && options.two_factor.toLowerCase() == 'true') {
            grunt.log.writeln("Two Factor Enabled Using File: " + options.two_factor_p12);
            // This condition might be able to automatically format the hostname if
            // it is formatted incorrectly.
            if (httpOptions.hostname.indexOf('cert') !== 0) {
                throw new Error('Incorrect hostname ' + httpOptions.hostname + ' used with two factor auth');
            }

            httpOptions.pfx = fs.readFileSync(options.two_factor_p12);
            // httpOptions.pfx = fs.readFileSync("/Users/jmoody/git/build-suite/cartridges/build_cs/cartridge/build/projects/sample/dws-61698/loaner-2048.p12)"
            httpOptions.passphrase = options.two_factor_password;
            httpOptions.honorCipherOrder = true;
            httpOptions.rejectUnauthorized = false;
            httpOptions.securityOptions = 'SSL_OP_NO_SSLv3'
            httpOptions.secureProtocol = 'TLSv1_1_method';
        }

        //grunt.log.verbose.writeln(httpOptions);

        var req = http.request(httpOptions, function (res) {
            grunt.log.write('Status: ' + res.statusCode + '\n');
            if (httpOptions.method === 'DELETE') {
                if (res.statusCode === 204) {
                    grunt.log.ok('Remote file removed');
                } else if (res.statusCode === 401) {
                    grunt.log.writeln('Authentication failed');
                    options.done(false);
                    return;
                } else if (res.statusCode === 404) {
                    grunt.log.writeln('Remote file did not exist');
                } else if (res.statusCode === 405) {
                    grunt.log.error('Remote server does not support webdav!');
                    options.done(false);
                    return;
                } else {
                    grunt.log.error('Unknown error occurred!');
                    options.done(false);
                    return;
                }
                grunt.log.writeln();
                httpOptions.method = 'PUT';

                performHTTPActions(httpOptions, options, true);
            } else {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    grunt.log.writeln(options.dest);
                    grunt.log.subhead('Successfully deployed');
                } else if (res.statusCode === 204) {
                    grunt.log.error('Remote file exists!');
                    options.done(false);
                    return;
                } else if (res.statusCode === 401) {
                    grunt.log.writeln('Authentication failed');
                    options.done(false);
                    return;
                } else if (res.statusCode === 405) {
                    grunt.log.error('Remote server does not support webdav!');
                    options.done(false);
                    return;
                } else {
                    grunt.log.error('Unknown error occurred!');
                    options.done(false);
                    return;
                }
                options.done();
            }
        });

        req.on('data', function (chunk) {
            console.log(chunk);
        });

        req.on('error', function (e) {
            grunt.log.verbose.writeln('problem with request: ' + e.message);
            grunt.log.verbose.writeln(e.stack);

            // We need to be able to retry here, because the second request, (after
            // DELETE) will say the key is already in the hash table... which is
            // fine, we just need to trigger a new request.
            //
            // However... in case of real errors, we only want to retry a max of five
            // times to avoid an infinite loop.
            if (MAX_RETRY--) {
                performHTTPActions(httpOptions, options, true, true);
            }
        });

        if (httpOptions.method === 'DELETE') {
            grunt.log.writeln('Removing existing zip');
            req.end();
        } else {
            if (!suppress) {
                grunt.log.writeln('Deploying zip to ' + options.dest);
            }
            req.end(options.data, 'binary');
        }
    }

    grunt.registerMultiTask('dw_upload', 'upload files via webdav', function () {
        if (this.filesSrc.length === 0) {
            grunt.log.error('Requires src files.');
            return false;
        }

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            basic_auth: false,
            overwrite_release: false,
            suffix: 'zip',
            baseDir: './'
        });

        var dest, initialMethod;

        if (typeof options.release_path !== "string") {
            grunt.log.error("Missing release_path!");
            return false;
        }

        if (options.overwrite_release === true) {
            grunt.log.warn('Release will be overwritten');
            initialMethod = 'DELETE';
        } else {
            initialMethod = 'PUT';
        }

        dest = options.url + options.release_path;

        if (options.two_factor.toLowerCase() == 'true') {
            dest = options.two_factor_url + options.release_path;
        }

        var http;
        var deconstructedDest = url.parse(dest);

        switch (deconstructedDest.protocol) {
            case 'http:':
                grunt.log.error("Requires https url");
                return false;
                break;
            case 'https:':
                http = require('https');
                break;
            default:
                grunt.log.error("Invalid transport " + dest);
                return false;
        }

        var httpOptions = {
            method: initialMethod,
            hostname: deconstructedDest.hostname,
            port: deconstructedDest.port || 443,
            path: deconstructedDest.path
        };

        options.grunt = grunt;
        options.done = this.async();
        options.http = http;
        options.dest = dest;

        if (options.basic_auth === true) {
            var user = grunt.config('instance.webdav\\.username');
            var pass = grunt.config('instance.webdav\\.password');

            if (typeof user !== 'string' || typeof pass !== 'string') {
                grunt.log.error('basic_auth specified, but not provided');
                return false;
            }

            httpOptions.auth = user + ':' + pass;
        }

        var data = fs.readFileSync(this.filesSrc[0]);
        options.data = data;
        performHTTPActions(httpOptions, options, true);
    });
};
