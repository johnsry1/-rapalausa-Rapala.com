/**
* Purpose:	Records error information to be sent to Listrak in ltk_messageObject custom object. Messages are later sent by ltkProcessing scheduled job.
*/
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var UUIDUtils = require('dw/util/UUIDUtils');
var Site = require('dw/system/Site');

function reportError( message, severity, callingScript )
{
	/* Only log the exception if we have it enabled.  Clients can disable 
	 * it to ensure that custom object usage doesn't get out of control. */
	var enabled = Site.getCurrent().getCustomPreferenceValue('Listrak_LogExceptions');	
	
	if (enabled)
	{
		var messageUID = UUIDUtils.createUUID();
		var ltkMessage = CustomObjectMgr.createCustomObject("ltk_messageObject",messageUID);

		ltkMessage.custom.version = "int_Listrak 1.0.0";
		
		switch (severity) {
			case "Information" :
				ltkMessage.custom.messageSeverity = "Information";
				break;	
			case "Low":
				ltkMessage.custom.messageSeverity = "Low";
				break;	
			case "Medium":
				ltkMessage.custom.messageSeverity = "Medium";
				break;	
			case "High":
				ltkMessage.custom.messageSeverity = "High";
				break;	
			case "Critical":
				ltkMessage.custom.messageSeverity = "Critical";
				break;	
			default :  
				ltkMessage.custom.messageSeverity = "Medium";
		}		
			
		ltkMessage.custom.scriptName = callingScript;
		ltkMessage.custom.message = message;
		ltkMessage.custom.sentStatus = false;
	}

   return true;
}

function errorMessageToString(messageObject)
{
	var message = messageObject.custom.messageSeverity.getDisplayValue() + " ";
	
	message += "[version:" + messageObject.custom.version + "] [ScriptName:" + messageObject.custom.scriptName + "]  " + messageObject.custom.message;
	
	return message;
}

exports.reportError = reportError;
exports.errorMessageToString = errorMessageToString;