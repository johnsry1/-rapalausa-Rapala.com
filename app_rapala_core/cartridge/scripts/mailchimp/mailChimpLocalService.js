'use strict'

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Site = require('dw/system/Site');

function createMembersService() {
    var createMemberLocalServiceRegistry = LocalServiceRegistry.createService("MailChimp.HTTP.CreateMembers", {
    	createRequest: function(svc, args){
    		svc.setRequestMethod("POST");

			if(args) {
				return JSON.stringify(args);
			} else {
				return null;
			}
        },
        parseResponse: function(svc, client) {
            return client.text;
        },
        mockCall: function(svc, client) {
        	var result = {
                id: 'test id of mail chimp',
                email_address: "test email address",
                status: "subscribed",
                statusCode: 0,
                errorText: '',
                statusMessage: 0
            };

        	return {
                statusCode: 200,
                statusMessage: "Form post successful",
                text: JSON.stringify(result)
            };
        },
        getRequestLogMessage: function(reqObj) {
            var msg;
            if(reqObj == null) {
                msg = "null";
            } else {
            	msg = reqObj;
            }

            return msg;
        },
        getResponseLogMessage: function(respObj) {
            var msg;
            if(respObj == null) {
                msg = "null"
            }else {
            	if (!empty(respObj.text)) {
            		msg = JSON.stringify(respObj.text);
            	} else {
            		msg = "Text is empty";
            	}
            }
            return msg;
        }
    });

    // updated list id in URL from the custom preferences
    var url = createMemberLocalServiceRegistry.URL;
    var listId = Site.getCurrent().getCustomPreferenceValue('MailChimpListId');
    url = url.replace(/{list_id}/g, listId); 
    createMemberLocalServiceRegistry.URL = url;

    return createMemberLocalServiceRegistry;
}

exports.createMembersService = createMembersService;
