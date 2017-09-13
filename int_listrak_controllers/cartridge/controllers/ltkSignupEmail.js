/**
* Purpose:	Sends the email address to Listrak to for subscription to newsletter/email list 
*
*	@input CurrentHttpParameterMap	:	dw.web.HttpParameterMap
*	@output successTemplate			:	String
*	@output successContentAsset		:	String
*	@output errorTemplate			:	String
*	@output errorContentAsset		:	String
*	
*/
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var ErrorHandler = require('~/cartridge/scripts/ltkErrorHandling.js');
var util = require('~/cartridge/scripts/objects/ltkUtil.js');
var Site = require('dw/system/Site');


function signup(pdict)
{
	var client = new util._Client();
	Transaction.begin();
	var ltkSubscriptionCode = request.httpParameterMap.ltkSubscriptionCode;

///// Get Email Settings /////
	var emailSettings = CustomObjectMgr.getCustomObject("ltk_emailSignup", ltkSubscriptionCode);

	if (ltkSubscriptionCode.stringValue == "" || ltkSubscriptionCode.stringValue == null)
	{		
		ErrorHandler.reportError("[ltkSubscriptionCode] was not specified by submitting form.", "High", "ltkSignupEmail.js");
		Transaction.rollback();
		return !empty(emailSettings) ? emailSettings.custom.errorTemplate + '|' + emailSettings.custom.errorContentAsset:'';
	}

	

///// Verify email settings object contains all required values /////
	if (emailSettings == null) {
		ErrorHandler.reportError("[ltkSubscriptionCode] not found. Make sure it is configured in Listrak Email Signup Configuration using the custom object editor.", "High", "ltkSignupEmail.js");
		Transaction.rollback();
		return !empty(emailSettings) ? emailSettings.custom.errorTemplate + '|' + emailSettings.custom.errorContentAsset: '';
	}
	if (emailSettings.custom.emailField == "" || emailSettings.custom.emailField == null){
		ErrorHandler.reportError("[Email Form Field] not found. Make sure it is configured in Listrak Email Signup Configuration using the custom object editor.", "High", "ltkSignupEmail.js");
		Transaction.rollback();
		return !empty(emailSettings) ? emailSettings.custom.errorTemplate + '|' + emailSettings.custom.errorContentAsset:'';
	}
		
	// Check to see if a signup flag is set
	if (emailSettings.custom.signupFlagField != "" && emailSettings.custom.signupFlagField != null)
	{
		// if the flag is set and is set to false, we're done here
		var signupFlag =  request.httpParameterMap.get(emailSettings.custom.signupFlagField);
		if (signupFlag.isEmpty() || !signupFlag.booleanValue){
			Transaction.rollback();
			return !empty(emailSettings) ? emailSettings.custom.errorTemplate + '|' + emailSettings.custom.errorContentAsset: '';
		}
	}

	var emailParm = request.httpParameterMap.get(emailSettings.custom.emailField);
	if (emailParm.isEmpty()) {
		ErrorHandler.reportError("[Email Form Field] not found. Make sure it is configured in Listrak Email Signup Configuration using the custom object editor.", "High", "ltkSignupEmail.js");
		Transaction.rollback();
		return !empty(emailSettings) ? emailSettings.custom.errorTemplate + '|' + emailSettings.custom.errorContentAsset : '';
	}
	// Check for watermarks first	
	if (!empty(Site.getCurrent().getCustomPreferenceValue('Listrak_EmailCapture_Watermarks')))
	{
		var watermarks = Site.getCurrent().getCustomPreferenceValue('Listrak_EmailCapture_Watermarks');
		for (var i=0;i<watermarks.length;i++)
		{
			if (emailParm == watermarks[i]){
				Transaction.rollback();
				return !empty(emailSettings) ? emailSettings.custom.errorTemplate + '|' + emailSettings.custom.errorContentAsset:'';
			}
		}
	}
	
	var qString = "ctid=" + client.CTID + "&uid=auto&_t_0=s&l_0=" + ltkSubscriptionCode + "&e_0=" + encodeURIComponent(emailParm.stringValue);

	var profileFields = emailSettings.custom.profileField;
	var index = 0;
	for (index = 0; index < profileFields.length; index++)
	{
		var profileField = profileFields[index];
		var profileParm = request.httpParameterMap.get(profileField);
		if (profileParm.isEmpty()) {
			ErrorHandler.reportError("[" + profileField + "] is defined in Listrak email settings, but is not part of the submitting form.", "Medium", "ltkSignupEmail.js");
		}
		else
		{
			qString += "&" + profileField + "=" + encodeURIComponent(profileParm.stringValue);
		}
	}
	

	var path = "t/S.ashx";
	Transaction.commit();
	client.SubmitTracking(path, qString);
	return !empty(emailSettings) ? emailSettings.custom.successTemplate + '|' + emailSettings.custom.successContentAsset : '';
	
}

exports.Signup = signup;
