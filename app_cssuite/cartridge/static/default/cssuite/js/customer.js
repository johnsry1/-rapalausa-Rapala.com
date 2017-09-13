

/*
 * Functionality 
 */
var Customer = {

	searchUrl: '',
	
	search: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_CUSTOMER_SEARCH ) ) //return if the action lock could not be retrieved
			return;
		
		CSSuite.info = "Customer.search";

		//call to the pipeline
		jQuery.ajax({
			url: Customer.searchUrl,//CSCustomer-Search
			cache: false,
			data: {
                customerNo: document.getElementById('CustomerSearchForm_CustomerNo').value,
                firstName: document.getElementById('CustomerSearchForm_FirstName').value,
                lastName: document.getElementById('CustomerSearchForm_LastName').value,
                email: document.getElementById('CustomerSearchForm_CustomerEmail').value,
                results: document.getElementById('CustomerSearchForm_ResultSet').value
            },
			success: function(data, textStatus){
				$("#customer_searchresults_container").html(data);
			},
			error: handleError,
			
		  	beforeSend: function(XMLHttpRequest){
				CSSuite.wait2($("#customer_searchresults_container"));
			},
			complete: function(XMLHttpRequest, textStatus){
		  		CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_CUSTOMER_SEARCH ); // release the lock cause we are finished
		  	}
		});
	},
	
	resetPassword: function( customerLogin )
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_CUSTOMER_SEARCH ) ) //return if the action lock could not be retrieved
			return;
		
		CSSuite.info = "Customer.resetPassword";

		//call to the pipeline
		jQuery.ajax({
			url: Customer.resetPasswordUrl,//CSCustomer-RestPassword
			cache: false,
			data: {
                login: customerLogin
            },
			success: function(data, textStatus){
				$("#OrderOnBehalfDialog").html(data);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
		  		CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_CUSTOMER_SEARCH ); // release the lock cause we are finished
		  	}
		});
	},
	
	confirmResetPassword: function( customerLogin, name )
	{
		Dialog.confirm('Please Confirm', 'Do you really reset the password for ' + unescape(name) + '?<br/>', function(){Customer.resetPassword(customerLogin);});
	}
	
}

function show_customer_tooltip(name, customerNo, address, phone, email, url, login, customerName) {
	$('#customer_tooltip').html(
		"<div id='title'>" + customerName + "</div>" + 
		"<div id='customerNo'>" + customerNo + "</div><hr>" + 
		"<div id='address'>" + address + "</div><br>" +
		"<div id='phone'>" + phone + "</div>" +
		"<div id='email'>" + email + "</div>" + 
		"<br/><div class='lefttab_searchbutton_container lefttab_button onbehalf customer'>"+
		"<ul><li onclick='Order.createBasket(\""+login+"\")'>Order on Behalf</li>" + 
		"<li onclick='create_orderonbehalf(\""+url+"\", \""+name+"\", \""+escape(customerName)+"\")'>Access Storefront on Behalf</li></ul>" +
		"</div>" +
		"<div class='lefttab_searchbutton_container'><input class='lefttab_button onbehalf passwordreset' onclick='Customer.confirmResetPassword(\"" + login + "\", \"" + escape(customerName) + "\")' value='Reset Password' /></div>"
	);
}

function create_orderonbehalf(url, agentID, customerName) {
	// var popup = window.open( url, "Order on Behalf", "menubar=no,width=1200,height=1024,top=0,left=0,titlebar=no,toolbar=no");
	// popup.focus();
	Dialog.orderOnBehalf(url, agentID, customerName);
}









