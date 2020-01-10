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
var Site = require('dw/system/Site');

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

                if (profileValidation) {
                    var custForm = app.getForm('profile.customer');
                    Transaction.wrap(function(){
                        customer.profile.custom.countryCode = custForm.object.country.value;
                    })
                }
            }

            if (!profileValidation) {
            	if(customerExist){
            		response.redirect(URLUtils.https('Login-Show','existing', true));
            	} else {
            		response.redirect(URLUtils.https('Account-Show'));
            	}
            } else {
            	if (Site.getCurrent().getCustomPreferenceValue('MailChimpEnable')) {
                    if (app.getForm('profile.customer.addtoemaillist').value()) {
                    	var mailchimpHelper = require('*/cartridge/scripts/util/MailchimpHelper.js');
                    	mailchimpHelper.addNewListMember(app.getForm('profile.customer.firstname').value(), app.getForm('profile.customer.email').value());
                    }
                } else {
                	ltkSignupEmail.Signup();
                }
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

/**
 * Handles form submission from dialog and full page password reset. Handles cancel, send, and error actions.
 *  - cancel - renders the given template.
 *  - send - gets a CustomerModel object that wraps the current customer. Gets an EmailModel object that wraps an Email object.
 * Checks whether the customer requested the their login password be reset.
 * If the customer wants to reset, a password reset token is generated and an email is sent to the customer using the mail/resetpasswordemail template.
 * Then the account/password/requestpasswordreset_confirm template is rendered.
 *  - error - the given template is rendered and passed an error code.
 */
function passwordResetFormHandler(templateName, continueURL) {
    var resetPasswordToken, passwordemail;

    app.getForm('profile').handleAction({
        cancel: function () {
            app.getView({
                ContinueURL: continueURL
            }).render(templateName);
        },
        send: function () {
            var Customer, resettingCustomer, Email;
            Customer = app.getModel('Customer');
            Email = app.getModel('Email');
            var requestForm = Form.get('requestpassword').object.email.htmlValue;
            resettingCustomer = Customer.retrieveCustomerByLogin(requestForm);

            if (!empty(resettingCustomer)) {
                resetPasswordToken = resettingCustomer.generatePasswordResetToken();

                passwordemail = Email.get('mail/headerresetpasswordemail', resettingCustomer.object.profile.email);
                passwordemail.setFrom(dw.system.Site.getCurrent().getCustomPreferenceValue('rapalaCustomerServiceEmail'));
                passwordemail.setSubject(Resource.msg('email.resetpassword', 'email', null));
                passwordemail.send({
                    ResetPasswordToken: resetPasswordToken,
                    Customer: resettingCustomer.object.profile.customer
                });
                
                app.getView({
                    ErrorCode: null,
                    ShowContinue: true,
                    ContinueURL: continueURL
                }).render('account/password/requestpasswordreset_confirm');
            } else {

            //for security reasons the same message will be shown for a valid reset password request as for a invalid one
                app.getView({
                    ErrorCode: 'notfounderror',
                    ShowContinue: true,
                    ContinueURL: continueURL
                }).render('account/password/requestpasswordresetdialog');
            }
        },
        error: function () {
            app.getView({
                ErrorCode: 'formnotvalid',
                ContinueURL: continueURL
            }).render(templateName);
        }
    });
}

/**.
 * This is for displaying megamenu login for nav menu.
 */
function includeMegamenuCustomerInfo() {
    app.getView().render('components/header/megamenu_account_show');
}

/**
 * The form handler for password resets.
 */
function passwordResetForm() {
    passwordResetFormHandler('account/password/requestpasswordreset', URLUtils.https('Account-PasswordResetForm'));
}

/**
 * Handles the password reset form.
 */
function passwordResetDialogForm() {
    // @FIXME reimplement using dialogify
    passwordResetFormHandler('account/password/requestpasswordresetdialog', URLUtils.https('Account-PasswordResetDialogForm'));
}

/**
 * Gets a profile form and handles the cancel and send actions.
 *  - cancel - renders the setnewpassword template.
 *  - send - gets a CustomerModel object that wraps the current customer and gets an EmailModel object that wraps an Email object.
 * Checks whether the customer can be retrieved using a reset password token.
 * If the customer does not have a valid token, the controller redirects to the Account-PasswordReset controller function.
 * If they do, then an email is sent to the customer using the mail/setpasswordemail template and the setnewpassword_confirm template is rendered.
 * */
function setNewPasswordForm() {

    app.getForm('profile').handleAction({
        cancel: function () {
            app.getView({
                ContinueURL: URLUtils.https('Account-SetNewPasswordForm')
            }).render('account/password/setnewpassword');
            return;
        },
        send: function () {
            var Customer;
            var Email;
            var passwordChangedMail;
            var resettingCustomer;
            var success;

            Customer = app.getModel('Customer');
            Email = app.getModel('Email');
            resettingCustomer = Customer.getByPasswordResetToken(request.httpParameterMap.Token.getStringValue());

            if (!resettingCustomer) {
                response.redirect(URLUtils.https('Account-PasswordReset'));
            }

            if (app.getForm('resetpassword.password').value() !== app.getForm('resetpassword.passwordconfirm').value()) {
                app.getForm('resetpassword.passwordconfirm').invalidate();
                app.getView({
                    ContinueURL: URLUtils.https('Account-SetNewPasswordForm')
                }).render('account/password/setnewpassword');
            } else {

                success = resettingCustomer.resetPasswordByToken(request.httpParameterMap.Token.getStringValue(), app.getForm('resetpassword.password').value());
                if (!success) {
                    app.getView({
                        ErrorCode: 'formnotvalid',
                        ContinueURL: URLUtils.https('Account-SetNewPasswordForm')
                    }).render('account/password/setnewpassword');
                } else {
                    passwordChangedMail = Email.get('mail/passwordchangedemail', resettingCustomer.object.profile.email);
                    passwordChangedMail.setFrom(dw.system.Site.getCurrent().getCustomPreferenceValue('rapalaCustomerServiceEmail'));
                    passwordChangedMail.setSubject(Resource.msg('email.resetpassword', 'email', null));
                    passwordChangedMail.send({
                        Customer: resettingCustomer.object
                    });

                    app.getView().render('account/password/setnewpassword_confirm');
                }
            }
        }
    });
}

function lostPasswordHeader(){
    var resetEmail,resettingCustomer,Customer,resetPasswordToken,passwordemail,Email;
    
    Customer = app.getModel('Customer');
    Email = app.getModel('Email');
    
    resetEmail = app.getForm('requestpasswordheader.email').object.htmlValue;
    
    resettingCustomer = Customer.retrieveCustomerByLogin(resetEmail);
    
    if (!empty(resettingCustomer)) {
        resetPasswordToken = resettingCustomer.generatePasswordResetToken();

        passwordemail = Email.get('mail/headerresetpasswordemail', resettingCustomer.object.profile.email);
        passwordemail.setFrom(dw.system.Site.getCurrent().getCustomPreferenceValue('rapalaCustomerServiceEmail'));
        passwordemail.setSubject(Resource.msg('email.resetpassword', 'email', null));
        passwordemail.send({
            ResetPasswordToken: resetPasswordToken,
            Customer: resettingCustomer.object.profile.customer
        });
    } else {
        app.getView({
            ErrorCode: "notfounderror"
        }).render('components/header/headerlostpassword');
    }
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
exports.PasswordResetDialogForm = guard.ensure(['post', 'https'], passwordResetDialogForm);
/** The form handler for password resets.
 * @see {@link module:controllers/Account~passwordResetForm} */
exports.PasswordResetForm = guard.ensure(['post', 'https'], passwordResetForm);
/** Renders the screen for setting a new password.
 * @see {@link module:controllers/Account~setNewPassword} */
exports.SetNewPassword = require('app_rapala_controllers/cartridge/controllers/Account.js').SetNewPassword;
/** Handles the set new password form submit.
 * @see {@link module:controllers/Account~setNewPasswordForm} */
exports.SetNewPasswordForm = guard.ensure(['post', 'https'], setNewPasswordForm);
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
exports.LostPasswordHeader = guard.ensure(['get'], lostPasswordHeader);
/** Sets price books for VIP customerGroups.
 * @see {@link module:controllers/Account~setPriceBookFromVIPCardCustomerGroups} */
exports.SetPriceBookFromVIPCardCustomerGroups = require('app_rapala_controllers/cartridge/controllers/Account.js').SetPriceBookFromVIPCardCustomerGroups;
/** Sets price books for customerGroups.
 * @see {@link module:controllers/Account~setPriceBookFromCustomerGroups} */
exports.SetPriceBookFromCustomerGroups = require('app_rapala_controllers/cartridge/controllers/Account.js').SetPriceBookFromCustomerGroups;
/** Renders login/logout
* @see module:controllers/Home~includeMegamenuCustomerInfo */
exports.IncludeMegamenuCustomerInfo = guard.ensure(['get'], includeMegamenuCustomerInfo);