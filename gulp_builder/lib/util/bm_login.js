'use strict';

/**
 * Performs login to Business Manager
 * @returns {Promise}
 */
module.exports = function (gb, instance) {
    var deferred = gb.Q.defer();
    gb.request.post({
        url: 'https://' + instance + gb.deployment.instanceRoot + '/on/demandware.store/Sites-Site/default/ViewApplication-ProcessLogin',
        followRedirect: true,
        form: {
            LoginForm_Login: gb.deployment.user,
            LoginForm_Password: gb.deployment.password,
            LoginForm_RegistrationDomain: 'Sites'
        },
        jar: true,
        ignoreErrors: true,
        rejectUnauthorized: false
    }, function(error, response) {
        if (response.statusCode === 302 || response.statusCode === 200) {
            deferred.resolve();
            return deferred.promise;
        } else {
            deferred.reject(new Error('Failed logged into ' + instance + '. (Response: ' + response.statusCode + ')'));
            return;
        }
    });

    return deferred.promise;
};
