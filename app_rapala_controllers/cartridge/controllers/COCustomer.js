'use strict';

/**
 * Controller for the first step of the cart checkout process, which is to ask the customer to login, register, or
 * checkout anonymously.
 *
 * @module controllers/COCustomer
 */

/* API Includes */
var Transaction = require('dw/system/Transaction');
var URLUtils = require('dw/web/URLUtils');

/* Script Modules */
var app = require('~/cartridge/scripts/app');
var guard = require('~/cartridge/scripts/guard');

var Cart = require('~/cartridge/scripts/models/CartModel');
var Content = require('~/cartridge/scripts/models/ContentModel');

/**
 * First step of the checkout is to choose the checkout type: returning, guest or create account checkout.
 * Prepares the checkout initially: removes all payment instruments from the basket and clears all
 * forms used in the checkout process, when the customer enters the checkout. The single steps (shipping, billing etc.)
 * may not contain the form clearing, in order to support navigating forth and back in the checkout steps without losing
 * already entered form values.
 */
function start() {

    app.getForm('singleshipping').clear();
    app.getForm('multishipping').clear();
    app.getForm('billing').clear();

    Transaction.wrap(function () {
        Cart.goc().removeAllPaymentInstruments();
    });

    // Direct to first checkout step if already authenticated.
    if (customer.authenticated) {
        response.redirect(URLUtils.https('COShipping-Start'));
        return;
    } else {
        var loginForm = app.getForm('login');
        loginForm.clear();

        // Prepopulate login form field with customer's login name.
        if (customer.registered) {
            loginForm.setValue('username', customer.profile.credentials.login);
        }

        //var loginAsset = Content.get('myaccount-login');
        //var pageMeta = require('~/cartridge/scripts/meta');
        //pageMeta.update(loginAsset);

        app.getView({
            ContinueURL: URLUtils.https('COCustomer-LoginForm')
        }).render('checkout/checkoutlogin');
    }

}

/**
 * Form handler for the login form. Handles the following actions:
 * - __login__ - Calls the {@link module:controllers/Login~process|Login controller Process function}. If this returns successfully, calls
 * the {@link module:controllers/COShipping~Start|COShipping controller Start function}.
 * - __register__ - Calls the {@link module:controllers/Account~StartRegister|Account controller StartRegister function}.
 * - __unregistered__ - Calls the {@link module:controllers/COShipping~Start|COShipping controller Start function}.
 */
function showLoginForm() {
    var loginForm = app.getForm('login');
    session.custom.TargetLocation = URLUtils.https('COShipping-Start').toString();

    session.custom.TargetLocation = URLUtils.https('COShipping-Start').toString();
    //JIRA PREV-549 : Click on Login button after entering invalid data in Intermediate login page navigating to blank page
    session.custom.LoginType = 'checkout';

    loginForm.handleAction({
        login: function () {
            app.getController('Login').LoginForm();
        },
        register: function () {
            response.redirect(URLUtils.https('Account-StartRegister'));
        },
        unregistered: function () {
            response.redirect(URLUtils.https('COShipping-Start'));
        }
    });
}

function checkAndDisplayProStaffDetailsMini(){
	var Customer, badgeText,currentCustomer,BadgeTextIn;
	
	Customer = app.getModel('Customer');
	currentCustomer = Customer.get();
	badgeText = "";
	BadgeTextIn = request.httpParameterMap.BT.stringValue;
	for(var i=0;i<currentCustomer.object.customerGroups.length;i++){
		var customerGroup = currentCustomer.object.customerGroups[i];
		if(!empty(customerGroup.custom.badgeText)){
			badgeText = customerGroup.custom.badgeText;
			break;
		}
	}
	if(BadgeTextIn != 'DUMMY'){
		badgeText = BadgeTextIn;
	}
	app.getView({
		badgeText : badgeText
	}).render('components/header/prostaffdetailsmini');
}

function checkAndDisplayProStaffDetails(){
	var Customer, badgeText,currentCustomer,BadgeTextIn,allowanceBalance;
	
	Customer = app.getModel('Customer');
	currentCustomer = Customer.get().object;
	var allotmentExpired : Boolean = true;
	 if(!empty(currentCustomer.profile.custom) && !empty(currentCustomer.profile.custom.allotmentExpires)){
		   try{
			   var today : Date = new Date();
			   if(today.getFullYear() < currentCustomer.profile.custom.allotmentExpires.getFullYear()){
					allotmentExpired = false;
			   }
			   else if(today.getFullYear() == currentCustomer.profile.custom.allotmentExpires.getFullYear()){
					if(today.getMonth() < currentCustomer.profile.custom.allotmentExpires.getMonth()){
						allotmentExpired = false;
					}else if(today.getMonth() == currentCustomer.profile.custom.allotmentExpires.getMonth()){
						if(today.getDate() <= currentCustomer.profile.custom.allotmentExpires.getDate()){
							allotmentExpired = false;
						}
					}
			   }
			   allowanceBalance = currentCustomer.profile.custom.allotment;		   
			}
			catch(e){
				Logger.error("Error while executing the script CheckAndGetProStaffDetails.ds Error: "+e.message);
			}
	   }
	app.getView({
		AllotmentExpired : allotmentExpired,
		AllowanceBalance : allowanceBalance
	}).render('components/header/prostaffdetails');
}
/*
 * Module exports
 */

/*
 * Web exposed methods
 */
/** Selects the type of checkout: returning, guest, or create account. The first step in the checkout process.
 * @see module:controllers/COCustomer~start */
exports.Start = guard.ensure(['https'], start);
/** Form handler for the login form.
 * @see module:controllers/COCustomer~showLoginForm */
exports.LoginForm = guard.ensure(['https', 'post'], showLoginForm);
/** Displays VIP in header along with firstname if the customer belongs to VIP Customer Group.
 * @see module:controllers/COCustomer~checkAndDisplayProStaffDetailsMini */
exports.CheckAndDisplayProStaffDetailsMini = guard.ensure([], checkAndDisplayProStaffDetailsMini);
/** Displays allotment amount in checkput header a
 * @see module:controllers/COCustomer~checkAndDisplayProStaffDetails */
exports.CheckAndDisplayProStaffDetails = guard.ensure([], checkAndDisplayProStaffDetails);