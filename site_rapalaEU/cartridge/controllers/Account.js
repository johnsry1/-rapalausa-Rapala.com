'use strict';

/**
 * Controller that renders the account overview, manages customer registration and password reset,
 * and edits customer profile information.
 *
 * @module controllers/Account
 */

/* API includes */
var Pipelet = require('dw/system/Pipelet');
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var Form = require('*/cartridge/scripts/models/FormModel');
var Customer = require('*/cartridge/scripts/models/CustomerModel');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
var ltkSignupEmail = require('int_listrak_controllers/cartridge/controllers/ltkSignupEmail.js');

/**
 * Gets a ContentModel object that wraps the myaccount-home content asset,
 * updates the page metadata, and renders the account/accountoverview template.
 */
function show() {
    var accountHomeAsset, pageMeta, Content;
    session.custom.lastUrlBeforeLogin = session.clickStream.last != null ? session.clickStream.last.referer : '';
    //Content = app.getModel('Content');
    //accountHomeAsset = Content.get('myaccount-home');

    //pageMeta = require('~/cartridge/scripts/meta');
    //pageMeta.update(accountHomeAsset);
    if(request.httpSecure){
        app.getController('Account').UserAccountShow();
    } else {
        var httpsUrl = require('*/cartridge/scripts/account/RedirectingToHttps.ds').getHttpsUrl(request);
        if(!empty(httpsUrl) && httpsUrl != null){
            response.redirect(httpsUrl);
        }
    }
}

function userAccountShow(){
    app.getView().render('account/accountoverview');
}


/**
 * Gets a CustomerModel object wrapping the current customer.
 * Gets a profile form and handles the confirm action.
 *  confirm - validates the profile by checking  that the email and password fields:
 *  - match the emailconfirm and passwordconfirm fields
 *  - are not duplicates of existing username and password fields for the profile
 * If the fields are not valid, the registration template is rendered.
 * If the fields are valid, a new customer account is created, the profile form is cleared and
 * the customer is redirected to the Account-Show controller function.
 */
function registrationForm() {
    app.getForm('profile').handleAction({
        confirm: function () {
            var email, profileValidation, password, passwordConfirmation, existingCustomer, target, customerExist;

            Customer = app.getModel('Customer');
            email = app.getForm('profile.customer.email').value();
          
            profileValidation = true;
            customerExist = false;
            
            password = app.getForm('profile.login.password').value();
            passwordConfirmation = app.getForm('profile.login.passwordconfirm').value();

            if (password !== passwordConfirmation) {
                app.getForm('profile.login.passwordconfirm').invalidate();
                profileValidation = false;
            }

            // Checks if login is already taken.
            existingCustomer = Customer.retrieveCustomerByLogin(email);
            if (existingCustomer !== null) {
                app.getForm('profile.customer.email').invalidate();
                profileValidation = false;
                customerExist = true;
            }

            if (profileValidation) {
                profileValidation = Customer.createAccount(email, password, app.getForm('profile'));

                var custForm = app.getForm('profile.customer');
                Transaction.wrap(function(){
                    customer.profile.custom.countryCode = custForm.object.country.value;
                })
            }

            if (!profileValidation) {
            	if(customerExist){
            		response.redirect(URLUtils.https('Login-Show','existing', true));
            	} else {
            		response.redirect(URLUtils.https('Account-Show'));
            	}
            } else {
            	ltkSignupEmail.Signup();
                app.getForm('profile').clear();
                target = session.custom.TargetLocation;
                if (target) {
                    delete session.custom.TargetLocation;
                    //@TODO make sure only path, no hosts are allowed as redirect target
                    dw.system.Logger.info('Redirecting to "{0}" after successful login', target);
                    response.redirect(target);
                } else {
                    response.redirect(URLUtils.https('Account-Show', 'registration', 'true'));
                }
            }
        }
    });
}


/* Web exposed methods */

/** Renders the account overview.
 * @see {@link module:controllers/Account~show} */
exports.Show = guard.ensure(['get'], show);
/** Renders the Users Account page.
 * @see {@link module:controllers/Account~userAccountShow} */
exports.UserAccountShow = guard.ensure(['get', 'https', 'loggedIn'], userAccountShow);
/** Updates the profile of an authenticated customer.
 * @see {@link module:controllers/Account~editProfile} */
exports.EditProfile = require('app_rapala_controllers/cartridge/controllers/Account.js').EditProfile;
/** Handles the form submission on profile update of edit profile.
 * @see {@link module:controllers/Account~editForm} */
exports.EditForm = require('app_rapala_controllers/cartridge/controllers/Account.js').EditForm;
/** Renders the password reset dialog.
 * @see {@link module:controllers/Account~passwordResetDialog} */
exports.PasswordResetDialog = require('app_rapala_controllers/cartridge/controllers/Account.js').PasswordResetDialog;
/** Renders the password reset screen.
 * @see {@link module:controllers/Account~passwordReset} */
exports.PasswordReset = require('app_rapala_controllers/cartridge/controllers/Account.js').PasswordReset;
/** Handles the password reset form.
 * @see {@link module:controllers/Account~passwordResetDialogForm} */
exports.PasswordResetDialogForm = require('app_rapala_controllers/cartridge/controllers/Account.js').PasswordResetDialogForm;
/** The form handler for password resets.
 * @see {@link module:controllers/Account~passwordResetForm} */
exports.PasswordResetForm = require('app_rapala_controllers/cartridge/controllers/Account.js').PasswordResetForm;
/** Renders the screen for setting a new password.
 * @see {@link module:controllers/Account~setNewPassword} */
exports.SetNewPassword = require('app_rapala_controllers/cartridge/controllers/Account.js').SetNewPassword;
/** Handles the set new password form submit.
 * @see {@link module:controllers/Account~setNewPasswordForm} */
exports.SetNewPasswordForm = require('app_rapala_controllers/cartridge/controllers/Account.js').SetNewPasswordForm;
/** Start the customer registration process and renders customer registration page.
 * @see {@link module:controllers/Account~startRegister} */
exports.StartRegister = require('app_rapala_controllers/cartridge/controllers/Account.js').StartRegister;
/** Handles registration form submit.
 * @see {@link module:controllers/Account~registrationForm} */
exports.RegistrationForm = guard.ensure(['post', 'https'], registrationForm);
/** Renders the account navigation.
 * @see {@link module:controllers/Account~includeNavigation} */
exports.IncludeNavigation = require('app_rapala_controllers/cartridge/controllers/Account.js').IncludeNavigation;
/** Header Login
 * @see {@link module:controllers/Account~signInHeader} */
exports.SignInHeader = require('app_rapala_controllers/cartridge/controllers/Account.js').SignInHeader;
/** Handles registration form submit from header overlay.
 * @see {@link module:controllers/Account~HeaderRegistrationForm} */
exports.HeaderRegistrationForm = require('app_rapala_controllers/cartridge/controllers/Account.js').HeaderRegistrationForm;
/** Handles reset password from header overlay.
 * @see {@link module:controllers/Account~lostPasswordHeader} */
exports.LostPasswordHeader = require('app_rapala_controllers/cartridge/controllers/Account.js').LostPasswordHeader;
/** Sets price books for VIP customerGroups.
 * @see {@link module:controllers/Account~setPriceBookFromVIPCardCustomerGroups} */
exports.SetPriceBookFromVIPCardCustomerGroups = require('app_rapala_controllers/cartridge/controllers/Account.js').SetPriceBookFromVIPCardCustomerGroups;
/** Sets price books for customerGroups.
 * @see {@link module:controllers/Account~setPriceBookFromCustomerGroups} */
exports.SetPriceBookFromCustomerGroups = require('app_rapala_controllers/cartridge/controllers/Account.js').SetPriceBookFromCustomerGroups;
