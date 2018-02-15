'use strict';

/**
 * Controller that renders the account overview, manages customer registration and password reset,
 * and edits customer profile information.
 *
 * @module controllers/Account
 */

/* API includes */
var Resource = require('dw/web/Resource');
var URLUtils = require('dw/web/URLUtils');
var Form = require('~/cartridge/scripts/models/FormModel');
var Transaction = require('dw/system/Transaction');
//var Pipelet = require('dw/system/Pipelet');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

var ltkSignupEmail = require('int_listrak_controllers/cartridge/controllers/ltkSignupEmail.js');

/**
 * renders VIP SignUp page, also redirect to https if user access the page from non secure protocol.
 */
function signUp() {
	if(request.httpSecure){
		if(request.httpParameterMap.existing.value == null || request.httpParameterMap.existing.value != 'true'){
			app.getForm('vip').clear();
	        app.getForm('login').clear();
	        app.getForm('profile').clear();
		}
        app.getView({
        	isTriggered: true,
        	ContinueURL: URLUtils.https('VIP-ContinueLogIn')
        	}).render('vip/accountlogin');

	} else {
		var httpsUrl = require('app_rapala_core/cartridge/scripts/account/RedirectingToHttps.ds').getHttpsUrl(request);
		if(!empty(httpsUrl) && httpsUrl != null){
			response.redirect(httpsUrl);
		}
	}
}

/**
 * Reidirects in case of Error in continueLogin
 */
function loginRedirect(){

	app.getView({
    	ContinueURL: URLUtils.https('VIP-ContinueLogIn')
    	}).render('vip/accountlogin');

}


function continueLogIn() {
	var login = app.getForm('login.login');
	var register = app.getForm('profile.confirm');
	if(login.object.submitted){
		app.getForm('login').handleAction({
			login: function () {
				var VIPCardNumber = app.getForm('vip.number').value();
				var email = app.getForm('login.username').value();
				var password = app.getForm('login.password').value();
				var rememberme = false;
				var SkipAssignPriceBooks = "true";
				var Customer = app.getModel('Customer');
				var VIPCard = require('app_rapala_core/cartridge/scripts/vip/GetVIPCard.ds').getVIPCard(VIPCardNumber,"VIPCard");
				if(VIPCard!=null){
					if(!empty(VIPCard.custom.redeemingCustomer)){
						app.getForm('vip.notused').invalidate();
						loginRedirect();
					}else{
						var success = Customer.login(email,password,rememberme);
						if(success){
							if(!empty(SkipAssignPriceBooks) && SkipAssignPriceBooks){
								app.getForm('login').clear();
								var vipRedeem = app.getController('VIP').Redeem(VIPCard);
								if(vipRedeem){
									ltkSignupEmail.Signup();
									app.getView().render('vip/existing-thankyou');
								}else{
									app.getController('Account').Show();
								}
							}
						}else{
							app.getForm('login.loginsucceeded').invalidate();
							loginRedirect();
						}
					}
				}else{
					app.getForm('vip.numberexists').invalidate();
					loginRedirect();
				}




			}
		});
	} else if(register.object.submitted){
		app.getForm('profile').handleAction({
			confirm: function () {
				var VIPCardNumber, email, emailConfirm, password, passwordConfirm, rememberme, Customer, profileValidation,customerExist;

				VIPCardNumber = app.getForm('profile.customer.number').value();
				email = app.getForm('profile.customer.email').value();
				emailConfirm = app.getForm('profile.customer.emailconfirm').value();
				profileValidation = true;
				if (email !== emailConfirm) {
			        app.getForm('profile.customer.emailconfirm').invalidate();
			        profileValidation = false;
			    }

				password = app.getForm('profile.login.password').value();
				passwordConfirm = app.getForm('profile.login.passwordconfirm').value();
				if (password !== passwordConfirm) {
			        app.getForm('profile.login.passwordconfirm').invalidate();
			        profileValidation = false;
			    }

				rememberme = false;

				Customer = app.getModel('Customer');

				var VIPCard = require('app_rapala_core/cartridge/scripts/vip/GetVIPCard.ds').getVIPCard(VIPCardNumber,"VIPCard");
				if(VIPCard!=null){
					if(!empty(VIPCard.custom.redeemingCustomer)){
						app.getForm('profile.customer.notused').invalidate();
						loginRedirect();
					}else{
						var   existingCustomer = Customer.retrieveCustomerByLogin(email);
			            if (existingCustomer !== null) {
			                app.getForm('profile.customer.email').invalidate();
			                profileValidation = false;
			                customerExist = true;
			            }
			        	if(customerExist){
		            		response.redirect(URLUtils.https('VIP-SignUp','existing', true));
		            	}

						if (profileValidation) {
					        profileValidation = Customer.createAccount(email, password, app.getForm('profile'));
					        var vipRedeem = app.getController('VIP').Redeem(VIPCard)
					        if(vipRedeem){
					        	ltkSignupEmail.Signup();
					        	app.getForm('profile').clear();
					        	app.getView().render('vip/new-thankyou');
					        } else {
					        	loginRedirect();
					        }
						} else {
							loginRedirect();
					    }
					}
				}else{
					app.getForm('profile.customer.numberexists').invalidate();
					loginRedirect();
				}
							}
		});
	}
}

/**
 * redeems the VIP Card.
 */
function redeem(VIPCard) {

	var Customer, orderNo, vipGCEmail,Email;
	Customer = app.getModel('Customer').get();
	Email = app.getModel('Email');

	Transaction.begin();
	if(!empty(VIPCard.custom.amount)){
		orderNo = dw.order.OrderMgr.createOrderNo();
		var vipGiftCertificate : dw.order.GiftCertificate = dw.order.GiftCertificateMgr.createGiftCertificate(VIPCard.custom.amount);
		vipGiftCertificate.setOrderNo(orderNo);
		vipGiftCertificate.setRecipientEmail(Customer.object.profile.email);
		vipGiftCertificate.setSenderName("Rapala Customer Service");

		vipGCEmail = Email.get('mail/giftcert', vipGiftCertificate.getRecipientEmail());
		vipGCEmail.setSubject("Your Rapala.com Merchandise Credit");
		vipGCEmail.setFrom("noreply@rapala.com");
		vipGCEmail.send({ GiftCertificate : vipGiftCertificate });

	}
		var redeemed = require('app_rapala_core/cartridge/scripts/vip/RedeemVIPCards.ds').redeemVIPCard( VIPCard, Customer.object );
		if(redeemed){
			var vipCustomer = require('app_rapala_core/cartridge/scripts/vip/AssignCustomerToCustomerGroups.ds').assignCustomerToCG( Customer.object, VIPCard.custom.groups );
			if(vipCustomer == null || empty(vipCustomer)){
				Transaction.rollback();
				return false;
			}
		}else {
			Transaction.rollback();
			return false;
		}
		Transaction.commit();
		var customerGroups = vipCustomer.customerGroups;
		app.getController('Account').SetPriceBookFromVIPCardCustomerGroups(VIPCard);
		return true;
}

/**
 * renders FLWVIP SignUp page, also redirect to https if user access the page from non secure protocol.
 */
function flwSignUp() {
	if(request.httpSecure){
		if(request.httpParameterMap.existing.value == null || request.httpParameterMap.existing.value != 'true'){
			app.getForm('vip').clear();
	        app.getForm('login').clear();
	        app.getForm('profile').clear();
		}

        app.getView({
        	isTriggered: true,
        	ContinueURL: URLUtils.https('VIP-FLWContinueLogIn')
        	}).render('vip/flwaccountlogin');

	} else {
		var httpsUrl = require('app_rapala_core/cartridge/scripts/account/RedirectingToHttps.ds').getHttpsUrl(request);
		if(!empty(httpsUrl) && httpsUrl != null){
			response.redirect(httpsUrl);
		}
	}
}

/**
 * Reidirects in case of Error in flwContinueLogIn
 */
function flwLoginRedirect(){

	app.getView({
    	ContinueURL: URLUtils.https('VIP-FLWContinueLogIn')
    	}).render('vip/flwaccountlogin');

}

function flwContinueLogIn() {
	var login = app.getForm('login.login');
	var register = app.getForm('profile.confirm');
	if(login.object.submitted){
		app.getForm('login').handleAction({
			login: function () {
				var VIPCardNumber = app.getForm('vip.numberflw').value();
				var email = app.getForm('login.username').value();
				var password = app.getForm('login.password').value();
				var rememberme = false;
				var SkipAssignPriceBooks = "true";
				var Customer = app.getModel('Customer');
				var VIPCard = require('app_rapala_core/cartridge/scripts/vip/GetVIPCard.ds').getVIPCard(VIPCardNumber,"VIPCard2");
				if(VIPCard!=null){
					if(!empty(VIPCard.custom.shutoff) && VIPCard.custom.shutoff){
						app.getForm('vip.notused').invalidate();
						flwLoginRedirect();
					}else{
						var success = Customer.login(email,password,rememberme);
						if(success){
							if(!empty(SkipAssignPriceBooks) && SkipAssignPriceBooks){
								app.getForm('login').clear();
								var vipRedeem = app.getController('VIP').FLWRedeem(VIPCard);
								if(vipRedeem){
									ltkSignupEmail.Signup();
									app.getView().render('vip/existing-thankyou');
								}else{
									app.getController('Account').Show();
								}
							}
						}else{
							app.getForm('login.loginsucceeded').invalidate();
							flwLoginRedirect();
						}
					}
				}else{
					app.getForm('vip.numberexists').invalidate();
					flwLoginRedirect();
				}
			}
		});
	} else if(register.object.submitted){
		app.getForm('profile').handleAction({
			confirm: function () {
				var VIPCardNumber, email, emailConfirm, password, passwordConfirm, rememberme, Customer, profileValidation,customerExist;

				VIPCardNumber = app.getForm('profile.customer.numberflw').value();
				email = app.getForm('profile.customer.email').value();
				emailConfirm = app.getForm('profile.customer.emailconfirm').value();
				profileValidation = true;
				if (email !== emailConfirm) {
			        app.getForm('profile.customer.emailconfirm').invalidate();
			        profileValidation = false;
			    }

				password = app.getForm('profile.login.password').value();
				passwordConfirm = app.getForm('profile.login.passwordconfirm').value();
				if (password !== passwordConfirm) {
			        app.getForm('profile.login.passwordconfirm').invalidate();
			        profileValidation = false;
			    }

				rememberme = false;

				Customer = app.getModel('Customer');

				var VIPCard = require('app_rapala_core/cartridge/scripts/vip/GetVIPCard.ds').getVIPCard(VIPCardNumber,"VIPCard2");
				if(VIPCard!=null){
					if(!empty(VIPCard.custom.shutoff) && VIPCard.custom.shutoff){
						app.getForm('profile.customer.notused').invalidate();
						flwLoginRedirect();
					}else{
						var   existingCustomer = Customer.retrieveCustomerByLogin(email);
			            if (existingCustomer !== null) {
			                app.getForm('profile.customer.email').invalidate();
			                profileValidation = false;
			                customerExist = true;
			            }
			        	if(customerExist){
		            		response.redirect(URLUtils.https('VIP-FLWSignUp','existing', true));
		            	}
						if (profileValidation) {
					        profileValidation = Customer.createAccount(email, password, app.getForm('profile'));
					        var vipRedeem = app.getController('VIP').FLWRedeem(VIPCard)
					        if(vipRedeem){
					        	ltkSignupEmail.Signup();
					        	//app.getForm('profile').clear();
					        	app.getView().render('vip/new-thankyou');
					        } else {
					        	flwLoginRedirect();
					        }
						} else {
							flwLoginRedirect();
					    }
					}
				}else{
					app.getForm('profile.customer.numberexists').invalidate();
					flwLoginRedirect();
				}
			}
		});
	}
}

/**
 * redeems FLW VIP Card
 */
function flwRedeem(VIPCard) {

	var Customer, orderNo, vipGCEmail, Email;
	Customer = app.getModel('Customer').get();
	Email = app.getModel('Email');

	Transaction.begin();
		orderNo = dw.order.OrderMgr.createOrderNo();
		/*var flwVIPGiftCertificate : dw.order.GiftCertificate = dw.order.GiftCertificateMgr.createGiftCertificate(new Number(0.0));
		flwVIPGiftCertificate.setOrderNo(orderNo);
		flwVIPGiftCertificate.setRecipientEmail(Customer.object.profile.email);
		flwVIPGiftCertificate.setFirstName(Customer.object.profile.firstName)
		flwVIPGiftCertificate.setSenderName("Rapala Customer Service");*/
		/*var flwVIPGiftCertificateResult = new Pipelet('CreateGiftCertificate').execute({
			Amount : new Number("0.0"),
			OrderNo : orderNo,
			RecipientEmail : Customer.object.profile.email,
			FirstName : Customer.object.profile.firstName,
			SenderName : "Rapala Customer Service"
		});

		var flwVIPGiftCertificate : dw.order.GiftCertificate = flwVIPGiftCertificateResult.GiftCertificate;*/

		vipGCEmail = Email.get('mail/giftcert2', Customer.object.profile.email);
		vipGCEmail.setSubject("VIP Membership Confirmed");
		vipGCEmail.setFrom("noreply@rapala.com");
		vipGCEmail.send({});

		var redeemed = require('app_rapala_core/cartridge/scripts/vip/RedeemVIPFLW.ds').redeemVIPFLWCard( VIPCard, Customer.object );
		if(redeemed){
			var vipCustomer = require('app_rapala_core/cartridge/scripts/vip/AssignCustomerToCustomerGroups.ds').assignCustomerToCG( Customer.object, VIPCard.custom.groups );
			if(vipCustomer == null || empty(vipCustomer)){
				Transaction.rollback();
				return false;
			}
		}else {
			Transaction.rollback();
			return false;
		}
		Transaction.commit();
		var customerGroups = vipCustomer.customerGroups;
		app.getController('Account').SetPriceBookFromVIPCardCustomerGroups(VIPCard);
		return true;
}

/* Web exposed methods */

/** Renders the account overview.
 * @see {@link module:controllers/VIP~signUp} */
exports.SignUp = guard.ensure(['get'], signUp);
/** Renders the account overview.
 * @see {@link module:controllers/VIP~continueLogIn} */
exports.ContinueLogIn = guard.ensure(['post'], continueLogIn);
/** Renders the account overview.
 * @see {@link module:controllers/VIP~redeem} */
exports.Redeem = guard.ensure(['post', 'https'], redeem);
/** Renders the flw vip account overview..
 * @see {@link module:controllers/VIP~register} */
exports.FLWSignUp = guard.ensure(['get'], flwSignUp);
/** Login for flw vip account.
 * @see {@link module:controllers/VIP~register} */
exports.FLWContinueLogIn = guard.ensure(['post'], flwContinueLogIn);
/** Renders the account overview.
 * @see {@link module:controllers/VIP~redeem} */
exports.FLWRedeem = guard.ensure(['post', 'https'], flwRedeem);