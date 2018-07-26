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
var Form = require('~/cartridge/scripts/models/FormModel');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');
var ltkSignupEmail = require('int_listrak_controllers/cartridge/controllers/ltkSignupEmail.js');
var Countries = require('*/cartridge/scripts/util/Countries');
/**
 * Gets a ContentModel object that wraps the myaccount-home content asset,
 * updates the page metadata, and renders the account/accountoverview template.
 */
function show() {
    var accountHomeAsset, pageMeta, Content;
    session.custom.lastUrlBeforeLogin = session.clickStream.last.referer;
    //Content = app.getModel('Content');
    //accountHomeAsset = Content.get('myaccount-home');

    //pageMeta = require('~/cartridge/scripts/meta');
    //pageMeta.update(accountHomeAsset);
	if(request.httpSecure){
		app.getController('Account').UserAccountShow();
	} else {
		var httpsUrl = require('app_rapala_core/cartridge/scripts/account/RedirectingToHttps.ds').getHttpsUrl(request);
		if(!empty(httpsUrl) && httpsUrl != null){
			response.redirect(httpsUrl);
		}
	}
}

function userAccountShow(){
	app.getView().render('account/accountoverview');
}

/**
 * Clears the profile form and copies customer profile information from the customer global variable
 * to the form. Gets a ContentModel object that wraps the myaccount-personaldata content asset, and updates the page
 * meta data. Renders the account/user/registration template using an anonymous view.
 */
function editProfile() {
    var pageMeta;
    var accountPersonalDataAsset;
    var Content = app.getModel('Content');

    if (!request.httpParameterMap.invalid.submitted) {
        app.getForm('profile').clear();

        app.getForm('profile.customer').copyFrom(customer.profile);
        app.getForm('profile.login').copyFrom(customer.profile.credentials);
        app.getForm('profile.addressbook.addresses').copyFrom(customer.profile.addressBook.addresses);
    }
    accountPersonalDataAsset = Content.get('myaccount-personaldata');

   // pageMeta = require('~/cartridge/scripts/meta');
 //   pageMeta.update(accountPersonalDataAsset);
    // @FIXME bctext2 should generate out of pagemeta - also action?!
    app.getView({
        bctext2: Resource.msg('account.user.registration.editaccount', 'account', null),
        Action: 'edit',
        ContinueURL: URLUtils.https('Account-EditForm')
    }).render('account/user/editprofile');
}

/**
 * Handles the form submission on profile update of edit profile. Handles cancel and confirm actions.
 *  - cancel - clears the profile form and redirects to the Account-Show controller function.
 *  - confirm - gets a CustomerModel object that wraps the current customer. Validates several form fields.
 * If any of the profile validation conditions fail, the user is redirected to the Account-EditProfile controller function. If the profile is valid, the user is redirected to the Account-Show controller function.
 */
function editForm() {
    app.getForm('profile').handleAction({
        cancel: function () {
            app.getForm('profile').clear();
            response.redirect(URLUtils.https('Account-Show'));
        },
        confirm: function () {
            var isProfileUpdateValid = true;
            var hasEditSucceeded = false;
            var Customer = app.getModel('Customer');

            if (!Customer.checkUserName()) {
                app.getForm('profile.customer.email').invalidate();
                isProfileUpdateValid = false;
            }

            if (app.getForm('profile.customer.email').value() !== app.getForm('profile.customer.emailconfirm').value()) {
                app.getForm('profile.customer.emailconfirm').invalidate();
                isProfileUpdateValid = false;
            }

            if (!app.getForm('profile.login.password').value()) {
                app.getForm('profile.login.password').invalidate();
                isProfileUpdateValid = false;
            }

            if (isProfileUpdateValid) {
                hasEditSucceeded = Customer.editAccount(app.getForm('profile.customer.email').value(), app.getForm('profile.login.password').value(), app.getForm('profile.login.password').value(), app.getForm('profile'));

                if (!hasEditSucceeded) {
                    app.getForm('profile.login.password').invalidate();
                    isProfileUpdateValid = false;
                }
            }

            if (isProfileUpdateValid && hasEditSucceeded) {
            	ltkSignupEmail.Signup();
                response.redirect(URLUtils.https('Account-Show'));
            } else {
                response.redirect(URLUtils.https('Account-EditProfile', 'invalid', 'true'));
            }
        },
        changepassword: function () {
            var isProfileUpdateValid = true;
            var hasEditSucceeded = false;
            var Customer = app.getModel('Customer');

            if (!Customer.checkUserName()) {
                app.getForm('profile.customer.email').invalidate();
                isProfileUpdateValid = false;
            }

            if (!app.getForm('profile.login.currentpassword').value()) {
                app.getForm('profile.login.currentpassword').invalidate();
                isProfileUpdateValid = false;
            }

            if (app.getForm('profile.login.newpassword').value() !== app.getForm('profile.login.newpasswordconfirm').value()) {
                app.getForm('profile.login.newpasswordconfirm').invalidate();
                isProfileUpdateValid = false;
            }

            if (isProfileUpdateValid) {
                hasEditSucceeded = Customer.editAccount(app.getForm('profile.customer.email').value(), app.getForm('profile.login.newpassword').value(), app.getForm('profile.login.currentpassword').value(), app.getForm('profile'));
                if (!hasEditSucceeded) {
                    app.getForm('profile.login.currentpassword').invalidate();
                }
            }

            if (isProfileUpdateValid && hasEditSucceeded) {
                response.redirect(URLUtils.https('Account-Show'));
            } else {
                response.redirect(URLUtils.https('Account-EditProfile', 'invalid', 'true'));
            }
        }
    });
}


/**
 * Gets the requestpassword form and renders the requestpasswordreset template. This is similar to the password reset
 * dialog, but has a screen-based interaction instead of a popup interaction.
 */
function passwordReset() {
    app.getForm('requestpassword').clear();
    app.getView({
        ContinueURL: URLUtils.https('Account-PasswordResetForm')
    }).render('account/password/requestpasswordreset');
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
                passwordemail.setFrom('noreply@rapalausa.com');
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

/**
 * The form handler for password resets.
 */
function passwordResetForm() {
    passwordResetFormHandler('account/password/requestpasswordreset', URLUtils.https('Account-PasswordResetForm'));
}

/**
 * Clears the requestpassword form and renders the account/password/requestpasswordresetdialog template.
 */
function passwordResetDialog() {
    // @FIXME reimplement using dialogify
    app.getForm('requestpassword').clear();
    app.getView({
        ContinueURL: URLUtils.https('Account-PasswordResetDialogForm')
    }).render('account/password/requestpasswordresetdialog');
}

/**
 * Handles the password reset form.
 */
function passwordResetDialogForm() {
    // @FIXME reimplement using dialogify
    passwordResetFormHandler('account/password/requestpasswordresetdialog', URLUtils.https('Account-PasswordResetDialogForm'));
}

/**
 * Gets a CustomerModel wrapping the current customer. Clears the resetpassword form. Checks if the customer wants to reset their password.
 * If there is no reset token, redirects to the Account-PasswordReset controller function. If there is a reset token,
 * renders the screen for setting a new password.
 */
function setNewPassword() {
    var Customer, resettingCustomer;
    Customer = app.getModel('Customer');

    app.getForm('resetpassword').clear();
    resettingCustomer = Customer.getByPasswordResetToken(request.httpParameterMap.Token.getStringValue());

    if (empty(resettingCustomer)) {
    	response.redirect(URLUtils.https('Login-Show', 'TokenExpired', 'TokenError'));
    } else {
        app.getView({
            ContinueURL: URLUtils.https('Account-SetNewPasswordForm')
        }).render('account/password/setnewpassword');
    }
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
                    passwordChangedMail.setFrom('noreply@rapalausa.com');
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

/** Clears the profile form, adds the email address from login as the profile email address,
 *  and renders customer registration page.
 */
function startRegister() {
	if(request.httpParameterMap.MailExisted.value != null && request.httpParameterMap.MailExisted.value != 'true'){
		app.getForm('profile').clear();
	}

    if (app.getForm('login.username').value() !== null) {
        app.getForm('profile.customer.email').object.value = app.getForm('login.username').object.value;
    }
    app.getView({
        ContinueURL: URLUtils.https('Account-RegistrationForm')
    }).render('account/user/registration');
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
            var email, profileValidation, password, passwordConfirmation, existingCustomer, Customer, target, customerExist;

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

/**
 * Renders the accountnavigation template.
 */
function includeNavigation() {
    app.getView().render('account/accountnavigation');
}
/**
 * Logging in from header
 */
function signInHeader() {
	var email,tempCustomer,Customer,password,rememberme,sendMail,Email;
	var Message = {};
	
	Customer = app.getModel('Customer');
	Email = app.getModel('Email');
	
	email = app.getForm('login.username').value();
	password = app.getForm('login.password').value();
	rememberme = app.getForm('login.rememberme').value();
	//Get customer
	tempCustomer = Customer.retrieveCustomerByLogin(email);
	
	if(tempCustomer !=null && tempCustomer.object.profile != null && tempCustomer.object.profile.credentials.locked){
		
		Message = lockedAccountInvalidate();
		//Message.process = "sign-in";
		
		app.getView({
			Message : Message
		}).render('util/postmessage');
	} else { 
		var success = Customer.login(email,password,rememberme);
		
		if(success){
			app.getForm('login').invalidate();
			var TempCustomer = Customer.get();
			var customerGroups = TempCustomer.object.customerGroups;
			app.getController('Account').SetPriceBookFromCustomerGroups(customerGroups);
			var countryCode = Countries.getCurrent({
				CurrentRequest: {
					locale: request.locale
				}
				}).countryCode;
			session.custom.customerCountryCode = countryCode ? countryCode : '';
			Message.process = "sign-in";
			Message.status = "success";
			Message.email = tempCustomer.object.profile.email;
			
			app.getView({
				Message : Message
			}).render('util/postmessage');
		} else {
			if(tempCustomer !=null && tempCustomer.object.profile != null && tempCustomer.object.profile.credentials.locked){
				sendMail = Email.get('mail/lockoutemail', tempCustomer.object.profile.email);
				sendMail.setSubject(Resource.msg('resource.youraccount', 'email', null));
				sendMail.send({
                     Customer: tempCustomer.object
                 });
			}
			Message = lockedAccountInvalidate();
			
			app.getView({
				Message : Message
			}).render('util/postmessage');
		}
	}
	
   // app.getView().render('account/accountnavigation');
}

function lockedAccountInvalidate(){
	
	var ErrorMessage = {};
	
	app.getForm('login.loginsucceeded').invalidate();
	
	ErrorMessage.process = "sign-in";
	ErrorMessage.status = "error";
	
	return ErrorMessage;
	
}

/**
 * Handles header overlay create account section getting called via Ajax.
 */
function headerregistrationForm() {

    var email, profileValidation, password, passwordConfirmation, existingCustomer, Customer, newCustomer;

    Customer = app.getModel('Customer');
    email = app.getForm('profileheader.customer.email').value();
    profileValidation = true;
    var Message = {};
    password = app.getForm('profileheader.login.password').value();
    passwordConfirmation = app.getForm('profileheader.login.passwordconfirm').value();

    if (password !== passwordConfirmation) {
        app.getForm('profileheader.login.passwordconfirm').invalidate();
        profileValidation = false;
    }

    if (profileValidation) {
		// Checks if login is already taken.
		existingCustomer = Customer.retrieveCustomerByLogin(email);
		if (existingCustomer !== null) {
			app.getForm('profileheader.customer.email').invalidate();
			profileValidation = false;
		}
		
		if (profileValidation) {
			profileValidation = Customer.createAccount(email, password, app.getForm('profileheader'));
		}
    }
    
    if (!profileValidation) {
		Message.process = "create-account";
		Message.status = "error";
        Message.email = email;
        if ('accountHeaderError' in session.custom && session.custom.accountHeaderError) {
            Message.passwordinvalidformat = true;
        }
        app.getView({
            Message: Message
        }).render('util/postmessage');
    } else {
		Transaction.wrap(function(){
			newCustomer = Customer.get();
			if (!app.getForm('profileheader.customer').copyTo(newCustomer.object.profile)) {
				app.getForm('profileheader.customer').invalidate();
			}
		});
		ltkSignupEmail.Signup();
		Message.process = "create-account";
		Message.status = "success";
		Message.email = email;
		app.getView({
		Message: Message
		}).render('util/postmessage');
    }

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
        passwordemail.setFrom('noreply@rapalausa.com');
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

function setPriceBookFromVIPCardCustomerGroups(VIPCard){
	
	var PriceBooks = require('app_rapala_core/cartridge/scripts/vip/GetApplicablePriceBooksFromVIPCardCustomerGroups.ds').getApplicablePriceBooks(VIPCard);
	var assignPB = new Pipelet('SetApplicablePriceBooks').execute({
        PriceBook1ID: 1 > PriceBooks.length ? null : PriceBooks[0],
        PriceBook2ID: 2 > PriceBooks.length ? null : PriceBooks[1],
		PriceBook3ID: 3 > PriceBooks.length ? null : PriceBooks[2],
		PriceBook4ID: 4 > PriceBooks.length ? null : PriceBooks[3],
		PriceBook5ID: 5 > PriceBooks.length ? null : PriceBooks[4],
		PriceBook6ID: 6 > PriceBooks.length ? null : PriceBooks[5],
		PriceBook7ID: 7 > PriceBooks.length ? null : PriceBooks[6],
		PriceBook8ID: 8 > PriceBooks.length ? null : PriceBooks[7],
		PriceBook9ID: 9 > PriceBooks.length ? null : PriceBooks[8],
    });
	
	return true;
}

function setPriceBookFromCustomerGroups(customerGroups){
	
	var PriceBooks = require('app_rapala_core/cartridge/scripts/common/GetApplicablePriceBooksFromCustomerGroups.ds').getApplicablePriceBooks(customerGroups);
	var assignPB = new Pipelet('SetApplicablePriceBooks').execute({
        PriceBook1ID: 1 > PriceBooks.length ? null : PriceBooks[0],
        PriceBook2ID: 2 > PriceBooks.length ? null : PriceBooks[1],
		PriceBook3ID: 3 > PriceBooks.length ? null : PriceBooks[2],
		PriceBook4ID: 4 > PriceBooks.length ? null : PriceBooks[3],
		PriceBook5ID: 5 > PriceBooks.length ? null : PriceBooks[4],
		PriceBook6ID: 6 > PriceBooks.length ? null : PriceBooks[5],
		PriceBook7ID: 7 > PriceBooks.length ? null : PriceBooks[6],
		PriceBook8ID: 8 > PriceBooks.length ? null : PriceBooks[7],
		PriceBook9ID: 9 > PriceBooks.length ? null : PriceBooks[8],
    });
	
	return true;
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
exports.EditProfile = guard.ensure(['get', 'https', 'loggedIn'], editProfile);
/** Handles the form submission on profile update of edit profile.
 * @see {@link module:controllers/Account~editForm} */
exports.EditForm = guard.ensure(['post', 'https', 'loggedIn'], editForm);
/** Renders the password reset dialog.
 * @see {@link module:controllers/Account~passwordResetDialog} */
exports.PasswordResetDialog = guard.ensure(['get', 'https'], passwordResetDialog);
/** Renders the password reset screen.
 * @see {@link module:controllers/Account~passwordReset} */
exports.PasswordReset = guard.ensure(['get', 'https'], passwordReset);
/** Handles the password reset form.
 * @see {@link module:controllers/Account~passwordResetDialogForm} */
exports.PasswordResetDialogForm = guard.ensure(['post', 'https'], passwordResetDialogForm);
/** The form handler for password resets.
 * @see {@link module:controllers/Account~passwordResetForm} */
exports.PasswordResetForm = guard.ensure(['post', 'https'], passwordResetForm);
/** Renders the screen for setting a new password.
 * @see {@link module:controllers/Account~setNewPassword} */
exports.SetNewPassword = guard.ensure(['get', 'https'], setNewPassword);
/** Handles the set new password form submit.
 * @see {@link module:controllers/Account~setNewPasswordForm} */
exports.SetNewPasswordForm = guard.ensure(['post', 'https'], setNewPasswordForm);
/** Start the customer registration process and renders customer registration page.
 * @see {@link module:controllers/Account~startRegister} */
exports.StartRegister = guard.ensure(['https'], startRegister);
/** Handles registration form submit.
 * @see {@link module:controllers/Account~registrationForm} */
exports.RegistrationForm = guard.ensure(['post', 'https'], registrationForm);
/** Renders the account navigation.
 * @see {@link module:controllers/Account~includeNavigation} */
exports.IncludeNavigation = guard.ensure(['get'], includeNavigation);
/** Header Login
 * @see {@link module:controllers/Account~signInHeader} */
exports.SignInHeader = guard.ensure(['post', 'https'], signInHeader);
/** Handles registration form submit from header overlay.
 * @see {@link module:controllers/Account~HeaderRegistrationForm} */
exports.HeaderRegistrationForm = guard.ensure(['post', 'https'], headerregistrationForm);
/** Handles reset password from header overlay.
 * @see {@link module:controllers/Account~lostPasswordHeader} */
exports.LostPasswordHeader = guard.ensure(['get'], lostPasswordHeader);
/** Sets price books for VIP customerGroups.
 * @see {@link module:controllers/Account~setPriceBookFromVIPCardCustomerGroups} */
exports.SetPriceBookFromVIPCardCustomerGroups = guard.ensure(['post'], setPriceBookFromVIPCardCustomerGroups);
/** Sets price books for customerGroups.
 * @see {@link module:controllers/Account~setPriceBookFromCustomerGroups} */
exports.SetPriceBookFromCustomerGroups = guard.ensure(['post'], setPriceBookFromCustomerGroups);
