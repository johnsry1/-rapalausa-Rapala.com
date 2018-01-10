'use strict';

/**
 * This controller handles customer service related pages, such as the contact us form.
 *
 * @module controllers/CustomerService
 */

/* API Includes */
var Status = require('dw/system/Status');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');


/**
 * Renders the customer service overview page.
 */
function show() {
    //app.getView('CustomerService').render('content/customerservice');
    app.getView().render('content/contactus');
}

/**
 * Renders the left hand navigation.
 */
function leftNav() {
    app.getView('CustomerService').render('content/customerserviceleftnav');
}

/**
 * Provides a contact us form which sends an email to the configured customer service email address.
 */
function contactUs() {
    app.getForm('contactus').clear();
    app.getView('CustomerService').render('content/contactus');
}


/**
 * The form handler for the contactus form.
 */
function submit() {
    var req = request;
    var ses = session;
    var contactUsForm = app.getForm('contactus');

    var contactUsResult = contactUsForm.handleAction({
        send: function (formgroup) {
            // Change the MailTo in order to send to the store's customer service email address. It defaults to the
            // user's email.
            var Email = app.getModel('Email');
            return Email.get('mail/contactus', formgroup.email.value)
                .setFrom(formgroup.email.value)
                .setSubject(formgroup.myquestion.value)
                .send({contactuscomment : formgroup.comment.value});
        },
        error: function () {
            // No special error handling if the form is invalid.
            return null;
        }
    });

    if (contactUsResult && (contactUsResult.getStatus() === Status.OK)) {
        app.getView('CustomerService', {
            ConfirmationMessage: 'edit'
        }).render('content/contactus');
    } else {
        app.getView('CustomerService').render('content/contactus');
    }
}

/*function contactUsStart() {
	var contactUsForm = app.getForm('contactus');
	var formgroup = formgroup;
    var contactUsResult = contactUsForm.handleAction({
        send: function (formgroup) {
            // Change the MailTo in order to send to the store's customer service email address. It defaults to the
            // user's email.
            var Email = app.getModel('Email');
            return Email.get('mail/contactus', dw.system.Site.current.preferences.custom.csrRapalaDefaultMailId)
                .setFrom(formgroup.email.value)
                .setSubject(formgroup.myquestion.value)
                .send({});
        },
        error: function () {
            // No special error handling if the form is invalid.
            return null; 
        }
    });


       app.getView('CustomerService', {
           ConfirmationMessage: 'edit'
       }).render('content/customerdonationrequest');
   
}
*/

/*
 * fetching data from session and setting to contactus form
 */
function contactUsStart() {
	
	var contactUsForm = app.getForm('contactus');
	var Email = app.getModel('Email');
	var emailTo=dw.system.Site.current.preferences.custom.csrRapalaDefaultMailId; 
	var frommail=session.forms.contactus.email.htmlValue;
	var comment = session.forms.contactus.comment.htmlValue.split("\n");
        var emailStatus;
        emailStatus = Email.get('mail/contactus',emailTo);
		emailStatus.setSubject(session.forms.contactus.myquestion.htmlValue);
        emailStatus.setFrom(frommail);
        emailStatus.send({
        	contactuscomment : comment
        });
	
        app.getView('CustomerService', {
            ConfirmationMessage: 'edit'
        }).render('content/customerdonationrequest');
}

function dealer() {
	
	var dealerForm = app.getForm('dealer');
	var Email = app.getModel('Email');
	var emailTo=dw.system.Site.current.preferences.custom.csrNewDealerMailId; 
	var frommail=session.forms.dealer.emailaddress.htmlValue;
	var message = session.forms.dealer.message.htmlValue.split("\n");
        var emailStatus;
        emailStatus = Email.get('mail/emailcontact',emailTo);
        emailStatus.setSubject("Become A Dealer");
        emailStatus.setFrom(frommail);
        emailStatus.send({
        	dealermessage : message
        });
	
    app.getView('CustomerService', { 
    	ConfirmationMessage: 'edit'
    		}).render('content/contactusbecomedealer');
}

function dealerLocator() {

	var dealerForm = app.getForm('dealer');
	var Email = app.getModel('Email');	
	var frommail=session.forms.dealer.emailaddress.htmlValue;
    var emailStatus;
    var emailTo=dw.system.Site.current.preferences.custom.csrDealerLocatorAdditionsMailId;
    emailStatus = Email.get('mail/emailcontact', emailTo);
    emailStatus.setSubject("Dealer Locator Additions");
    emailStatus.setFrom(frommail);
    emailStatus.send({});
	 	
	
    app.getView('CustomerService', { 
    	ConfirmationMessage: 'edit'
    		}).render('content/contactusdealerlocator');
}

/*
 * Module exports
 */

/*
 * Web exposed methods
 */
/** @see module:controllers/CustomerService~show */
exports.Show = guard.ensure(['get'], show);
/** @see module:controllers/CustomerService~leftNav */
exports.LeftNav = guard.ensure(['get'], leftNav);
/** @see module:controllers/CustomerService~contactUs */
exports.ContactUs = guard.ensure(['get', 'https'], contactUs);
/** @see module:controllers/CustomerService~submit */
exports.Submit = guard.ensure(['post', 'http'], submit);
/** @see module:controllers/CustomerService~Dealer */
exports.Dealer = guard.ensure(['post', 'http'], dealer);
/** @see module:controllers/CustomerService~DealerLocator */
exports.DealerLocator = guard.ensure(['post', 'http'], dealerLocator);

exports.ContactUsStart = guard.ensure(['post', 'http'], contactUsStart);

