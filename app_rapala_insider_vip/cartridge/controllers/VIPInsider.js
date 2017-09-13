'use strict';


/* Script Modules */
var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');
var Transaction = require('dw/system/Transaction');
/**
 *Renders the insiderhome template
 */

function home(){
	app.getView().render('vipinsider/insider_home.isml');
}


function forms(){
	app.getForm('vipinsider').clear();
	app.getView().render('vipinsider/insider_forms.isml');
}

function dynaForms(){
	app.getView().render('vipinsider/VIPinsider_dynamicdropforms.isml');
}

function upload(){
	var fullfilename = require('app_rapala_insider_vip/cartridge/scripts/fileuploading.ds').upload(request.httpParameterMap,session);
	 app.getView({
		 FileName: fullfilename
	    }).render('vipinsider/fileupload.isml');
}

function removeFile(){
	require('app_rapala_insider_vip/cartridge/scripts/removefile.ds').remove(request.httpParameterMap);
	app.getView({
		 removeFileName: request.httpParameterMap.filename
	    }).render('vipinsider/fileupload.isml');
}

function enroll(){
	var insiderForm = app.getForm('vipinsider').object;
	var program = insiderForm.states.programs.htmlValue;
	Email = app.getModel('Email');
	var status, prog, passwordemail;
	
	//Guides and outfiiters form related script
	if(program == 'guide'){
		Transaction.wrap(function(){
			status = require('app_rapala_insider_vip/cartridge/scripts/guideoutfittersdata.ds').guideData(insiderForm);
		});
		if(status=='true'){
			prog = "Guide and Outfitters";
			passwordemail = Email.get('mail/insidermail', insiderForm.customer.email.htmlValue);
	        passwordemail.setSubject(prog);
	        passwordemail.send({prog: prog});
	        dw.system.Pipeline.execute('TestEmail-Start', { Program: 'Guide and Outfitters'});
		}
	}
	
	//Field staff form related script
	if(program == 'field'){
		Transaction.wrap(function(){
			status = require('app_rapala_insider_vip/cartridge/scripts/fieldStaffDetails.ds').fieldStaffData(insiderForm);
		});
		if(status=='true'){
			prog = "Field Staff";
			passwordemail = Email.get('mail/insidermail', insiderForm.customer.email.htmlValue);
	        passwordemail.setSubject(prog);
	        passwordemail.send({prog: prog});
	        dw.system.Pipeline.execute('TestEmail-Start', { Program: 'Field Staff'});
		}
	}
	
	//Industry Affiliate form related script
	if(program == 'industry'){
		Transaction.wrap(function(){
			status = require('app_rapala_insider_vip/cartridge/scripts/industryaffiliatedata.ds').industryAffiliateData(insiderForm);
		});
		if(status=='true'){
			prog = "Industry Affiliate";
			passwordemail = Email.get('mail/insidermail', insiderForm.customer.email.htmlValue);
	        passwordemail.setSubject(prog);
	        passwordemail.send({prog: prog});
	        dw.system.Pipeline.execute('TestEmail-Start', { Program: 'Industry Affiliate'});
		}
	}
	
	//Sporting Goods Retail Sales Professional
	if(program == 'sports'){
		Transaction.wrap(function(){
			status = require('app_rapala_insider_vip/cartridge/scripts/sportsandgoods.ds').sportsData(insiderForm);
		});
		if(status=='true'){
			prog = "Sporting Goods Retail Sales Professional";
			passwordemail = Email.get('mail/insidermail', insiderForm.customer.email.htmlValue);
	        passwordemail.setSubject(prog);
	        passwordemail.send({prog: prog});
	        dw.system.Pipeline.execute('TestEmail-Start', { Program: 'Sporting Goods Retail Sales Professional'});
		}
	}
	
	//Donation Requests form related script
	if(program == 'donation'){
		Transaction.wrap(function(){
			status = require('app_rapala_insider_vip/cartridge/scripts/donationrequestdata.ds').donationData(insiderForm);
		});
		if(status=='true'){
			prog = "Donation Requests";
			passwordemail = Email.get('mail/insidermail', insiderForm.customer.email.htmlValue);
	        passwordemail.setSubject(prog);
	        passwordemail.send({prog: prog});
	        dw.system.Pipeline.execute('TestEmail-Start', { Program: 'Donation Requests'});
		}
	}
	
	//Decal Requests form related script
	if(program == 'decal'){
		Transaction.wrap(function(){
			status = require('app_rapala_insider_vip/cartridge/scripts/decalrequestdata.ds').decalData(insiderForm);
		});
		if(status=='true'){
			prog = "Decal Request";
			passwordemail = Email.get('mail/insidermail', insiderForm.customer.email.htmlValue);
	        passwordemail.setSubject(prog);
	        passwordemail.send({prog: prog});
	        dw.system.Pipeline.execute('TestEmail-Start', { Program: 'Decal Request'});
		}
	}
	
	app.getView({
		status: status
	    }).render('vipinsider/formstatus.isml');
}


/** Renders insider home page
* @see module:controllers/VIPInsider~home */
exports.Home = guard.ensure(['get'], home);

/** Renders insider forms
* @see module:controllers/VIPInsider~forms */
exports.Forms = guard.ensure(['get'], forms);


/** Renders insider forms
* @see module:controllers/VIPInsider~dynaForms */
exports.DynaForms = guard.ensure(['get'], dynaForms);

/** Enrolling into a program will start from here
* @see module:controllers/VIPInsider~enroll*/
exports.Enroll = guard.ensure(['post', 'https'], enroll);


/** Enrolling into a program will start from here
* @see module:controllers/VIPInsider~upload*/
exports.Upload = guard.ensure(['post', 'https'], upload);


/** Enrolling into a program will start from here
* @see module:controllers/VIPInsider~removeFile*/
exports.RemoveFile = guard.ensure(['post', 'https'], removeFile);