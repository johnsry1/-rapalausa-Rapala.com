/**
*
* This script creates a helper for mailchimp
*
*/

function addNewListMember(firstName, email) {
	var mailChimpLocalService = require('*/cartridge/scripts/mailchimp/mailChimpLocalService.js');
	var memberService = mailChimpLocalService.createMembersService();
	var memberParams = {
			email_address: email,
			status: 'subscribed',
			merge_fields: {
				FNAME: firstName
			}
	}
	return memberService.call(memberParams);
}

exports.addNewListMember = addNewListMember;
