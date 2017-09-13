'use strict';


var ISML = require('dw/template/ISML');
var Content = require('dw/content/ContentMgr');

var app = require('app_rapala_controllers/cartridge/scripts/app');
var guard = require('app_rapala_controllers/cartridge/scripts/guard');

var ltkSignupEmail = require('~/cartridge/controllers/ltkSignupEmail.js');


function footerSignup()
{
	var signupmsg = ltkSignupEmail.Signup();
	
	if( typeof signupmsg != undefined && !empty(signupmsg) ){

		var Content = app.getModel('Content');
		var signupcontents = signupmsg.split('|');
	    var content = Content.get( signupcontents[1] );

	    if (content) {
	        app.getView({
	            Content: content.object
	        }).render(content.object.template || signupcontents[0] );
	    }
	} else {
		Logger.warn('Content asset with ID {0} was included but not found',signupcontents[1]);
	}
			
}

exports.FooterSignup = guard.ensure([], footerSignup);