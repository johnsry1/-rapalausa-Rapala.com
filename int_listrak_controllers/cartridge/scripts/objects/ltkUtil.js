var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var UUIDUtils = require('dw/util/UUIDUtils');
var Site = require('dw/system/Site');
var ServiceRegistry = require('dw/svc/ServiceRegistry');
var Transaction = require('dw/system/Transaction');
var ErrorHandler = require('~/cartridge/scripts/ltkErrorHandling.js');

/*******************************************************************
*  Client Settings                                                
*	Purpose:	Loads client level settings and contains functions 
*				for submitting information to Listrak endpoints.
********************************************************************/
function _Client() {
    this.CTID = '';
    
    var merchant = Site.getCurrent().getCustomPreferenceValue('Listrak_MerchantTrackingID');	
    var endpoint = Site.getCurrent().getCustomPreferenceValue('Listrak_TrackingEndpoint');	
    if (!empty(merchant))
    	this.CTID = merchant;
    	
    this.Endpoint = 's1.listrakbi.com';
    	if (!empty(endpoint))
    		this.Endpoint = endpoint;
}

/* Submits to the tracking endpoint. */
_Client.prototype.SubmitTracking = function(path, data) {
	return this.SubmitQueryStringData(this.Endpoint, path, data);
}

/* Method used to submit an HTTP request. */
_Client.prototype.SubmitQueryStringData = function(endpoint, path, data) {
	
	/* Create the HTTP service and set the timeout. */
	var httpService = ServiceRegistry.get("listrak.http");
	var strURL = "http://" + endpoint + '/' + path + "?" + data;
	httpService.URL = strURL;
	var httpResult = httpService.call();	
             
	if (httpResult.error == 0 && httpResult.ok)
	{
		return new this.SubmitQueryStringDataResponse(true, httpResult.object.toString());
	}
	else
	{
		/* If we were not able to successfully send to the endpoint, store the path in a CustomObject and retry later. */
	    Transaction.begin();
		var transactionUID  = UUIDUtils.createUUID();		

		var dataObject = CustomObjectMgr.createCustomObject("ltk_dataObject",transactionUID);		
		dataObject.custom.data = strURL;

		Transaction.commit();		
		return new this.SubmitQueryStringDataResponse(false, "");
	}
}

/* */
_Client.prototype.SubmitQueryStringDataResponse = function(successFlag, textResponse) {
	this.success = successFlag;
	this.response = textResponse;
}
    
/*******************************************************************
*  Exception Handler
*	Purpose:	Reports error information to Listrak                                              
********************************************************************/

function _LTKException() {
	
	/* Method to submit exceptions to a custom object. */
    _LTKException.prototype.Submit = function (ex, info) {
    	var message = ex.name + ' - ' + ex.message + ' - ' + info + ' - ' + ex.stack;
    	Transaction.begin();
    	ErrorHandler.reportError( message, 'High', '' );
    	Transaction.commit();
    }
}

exports._LTKException = _LTKException;
exports._Client = _Client;