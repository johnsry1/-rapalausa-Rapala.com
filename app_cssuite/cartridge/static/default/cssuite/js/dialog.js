/**
 * This script provides basic functionality to display messages and dialogs.
 * In addition to that some specific dialogs are coded here.
 */
var keepSessionInt;
var Dialog = {
	/**
	* Opens a dialog to add a new payment to the order.
	*/
	addPayment: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.addPayment";

		jQuery.ajax({
			type: "POST",
			url: Order.addPaymentUrl, //CSPayments-AddPayment
			cache: false,
			data: "",
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* Opens a dialog to edit the existing payment method of the order.
	*/
	editPayment: function()
	{

		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.editPayment";

		jQuery.ajax({
			type: "POST",
			url: Order.editPaymentUrl, //CSPayments-EditPayment
			cache: false,
			data: "",
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* Calls the addPayment pipeline again, submitting the form to find out which payment method should be displayed
	*/
	togglePaymentMethod: function()
	{
		CSSuite.info = "Dialog.togglePaymentMethod";

		var postdata = $("#addPayments").serialize();

		var url = $("#addPayments").attr("action");

		jQuery.ajax({
			type: "POST",
			url: url,
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
		  	}
		});
	},

	/**
	* Opens a dialog that has all shipments listed. The user can decide which
	* quantity of the chosen product is to be added to what shipment.
	*
	* @param productID Identifier for the product
	*/
	addProductToShipments: function( productID )
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.dialogProductToShipmentsUrl";

		var postdata = "pid="+productID;
		jQuery.ajax({
			type: "POST",
			url: Order.dialogProductToShipmentsUrl,  //CSCart-DialogProductToShipments
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* Opens a product detail window for a given product id.
	*
	* @param productID Identifier for the product
	*/
	showProduct: function( productID )
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_VIEW_PRODUCT ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.showProduct";

		var postdata = "pid="+productID;
		jQuery.ajax({
			type: "POST",
			url: Product.dialogShowProductUrl,  //CSProduct-DialogShowProduct
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_VIEW_PRODUCT ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* Opens the Edit Billing Address form dialog and creating a new shipment
	*/
	createShipment: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.createShipment";

		jQuery.ajax({
			type: "POST",
			url: Order.dialogCreateShipmentUrl, //CSShipping-CreateShipment
			cache: false,
			data: "",
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* Opens the Edit Billing Address form dialog using an already existing shipment
	*/
	editShipment: function(shipmentNo)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.editShipment";

		var postdata = "shipmentID=" + shipmentNo;
		jQuery.ajax({
			type: "POST",
			url: Order.dialogEditShipmentUrl, //CSShipping-EditShipment
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* deletes existing shipment
	*/
	deleteShipment: function(shipmentNo)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.deleteShipment";

		var postdata = "shipmentID=" + shipmentNo;
		jQuery.ajax({
			type: "POST",
			url: Order.deleteShipmentUrl, //CSShipping-EditShipment
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},



	/**
	* Opens the Edit Billing Address form dialog
	*/
	editBillingAddress: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.editBillingAddress";

		jQuery.ajax({
			type: "POST",
			url: Order.editBillingAddressURL, //CSBilling-EditBillingAddress
			cache: false,
			data: "",
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER );
		  	}
		});
	},


	/**
	* Triggers the process to save a modified order.
	*/
	saveOrder: function() {
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.saveOrder";

		jQuery.ajax({
			type: "POST",
			url: Order.saveOrderURL, //CSSubmit-SaveOrder
			cache: false,
			data: "",
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* Triggers the workflow to cancel an order on the order search result page.
	*
	* @param orderNo Number of the order that need to be cancelled.
	*/
	cancelOrder: function(orderNo)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Dialog.cancelOrder";

		var postdata = "orderno=" + orderNo;
		jQuery.ajax({
			type: "POST",
			url: Order.dialogCancelOrderUrl, //CSOrder-Cancel
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
		  	}
		});
	},

	/**
	* Pulls up a new dialog with the storefront in an IFrame so the CS rep can place
	* an order on behalf of the customer.
	*
	* @param url URL to login on behalf of the customer and
	*/
	orderOnBehalf: function (url, agentID, custName, airEnvironment){
		if ( !airEnvironment ) {
			window.open(url, "OrderOnBehalf");
		} else {
			var dialogDiv = $("#OrderOnBehalfDialog")[0];
			var customerName = custName?custName:'Unregistered User';
			if (dialogDiv)
			{
				dialogDiv.title="Agent: '" + agentID + "' logged in on behalf of '";
				dialogDiv.title+= unescape(customerName) + "'";
				var width = screen.availWidth-85;
				var height = screen.availHeight-200;
				dialogDiv.innerHTML="<iframe src='"+url+"' width='" + width + "' height='" + height + "'  style='overflow: hidden; padding: 0; margin: 0;'/>";
				$("#OrderOnBehalfDialog").dialog({
					modal: true,
				    resizable: false,
				    width:screen.availWidth-65,
					height:screen.availHeight-150,
				    buttons: {
				        "Close": function() {
				        	Dialog.confirm('Please Confirm', 'Are you sure you want to close this window and lose all your changes?<br/>', function(){clearInterval(keepSessionInt);$("#OrderOnBehalfDialog").dialog("destroy");});
				        }
				    },
				    open: function(){
				    	var that = $(this);
				    	$(this).parent().find(".ui-dialog-titlebar-close").unbind("click");
				    	$(this).parent().find(".ui-dialog-titlebar-close").click(function(){
				    		Dialog.confirm('Please Confirm', 'Are you sure you want to close this window and lose all your changes?<br/>', function(){clearInterval(keepSessionInt);that.dialog("destroy");});
				    		return false;
				    	});
				    	keepSessionInt = setInterval('jQuery.ajax({type: "GET",cache: false,url: "'+CSSuite.sessionKeepAllive+'"});',900000);
				    },
			    	overlay: {
			        	opacity: 0.5,
			        	background: "black"
			    	} });
			}
		}
	},

	/**
	* Brings up a window that contains all order details for orders that
	* cannot be modified any more.
	*
	* @param orderNo Number of the order that should be displayed.
	*/
	viewOrderDetails: function( orderNo ){

		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_VIEW_ORDER_DETAILS ) ) //return if the action lock could not be retrieved
			return;

	  	CSSuite.info = "Order.viewOrderDetails";

		var postdata = "orderno=" + orderNo;
		jQuery.ajax({
			type: "POST",
			url: Order.immutableOrderDetailsURL, //CSOrder-ViewImmutableOrderDetails
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				//remove all links
				var responseNode=$(data);
				responseNode.find('a').each(
		              function( intIndex ){
		                $( this ).attr('href', '#');
		              });
				$("#GeneralJQueryDialog").html(responseNode);
				CSSuite.debug(textStatus);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_VIEW_ORDER_DETAILS ); // release the lock cause we are finished
		  	}
		});
	 },


	/**********************************************************
	***************** Helper Functions ************************
	**********************************************************/

	/**
	* This function provides a modal confirmation dialog that can be used to notify the
	* user about alternative steps to take. It does also have the ability to consume
	* 'actions' that should be performed when clicking either on the cancel or on the ok
	* button.
	*
	* Usage: Dialog.confirm('Please Confirm', 'Are you sure you want to discard all changes?<br/>', function(){CSSuite.setContext(CSSuite.CONTEXT_GENERAL);Order.searchOrders();});
	*/
	confirm: function(title, message, okAction, cancelAction){

		var dialogDiv = $("#GeneralJQueryDialog");
		if (dialogDiv.length == 1)
		{
			dialogDiv.attr('title', title);
			dialogDiv.html(message);
			$("#GeneralJQueryDialog").dialog({
				modal: true,
			    resizable: false,
			    width: 'auto',
			    height: 'auto',
			    buttons: {
			        "Apply": function() {
			            okAction?okAction():function(){};
			            $(this).dialog("destroy");
			        },
			        "Cancel": function() {
			            cancelAction?cancelAction():function(){};
			            $(this).dialog("destroy");
			        }
			    },
			    create: function (event) { 
			    	$(event.target).parent().css('display', 'inline-block');
			    },
			    open: function(){
			    	var that = $(this);
			    	$(this).parent().find(".ui-dialog-titlebar-close").unbind("click");
			    	$(this).parent().find(".ui-dialog-titlebar-close").click(function(){
			    		that.dialog("destroy");
			    		return false;
			    	});
			    },
		    	overlay: {
		        	opacity: 0.5,
		        	background: "black"
		    	} });
		}
	},

	/**
	 * This function provides a modal message dialog that can be used to message the user.
	 * It has only the close button available that simply closes the dialog and performs a
	 * given action.
	 *
	 * Usage: Dialog.message('Please Note', 'Due to technical problems the order cannot be stored.', function(){CSSuite.setContext(CSSuite.CONTEXT_GENERAL);Order.refreshOrder();});
	 *
	 * @param title The title.
	 * @message The message.
	 * @closeAction Close action
	 */
	message: function (title, message, closeAction){
		var dialogDiv = $("#GeneralJQueryDialog")[0];
		if (dialogDiv)
		{
			dialogDiv.title=title;
			dialogDiv.innerHTML=message;
			$("#GeneralJQueryDialog").dialog({
				modal: true,
				resizable: false,
				width: 'auto',
				height: 'auto',
			    buttons: {
			        "Close": function() {
						closeAction?closeAction():function(){};
			            $(this).dialog("destroy");
			        }
			    },
			    create: function (event) { 
			    	$(event.target).parent().css('display', 'inline-block');
			    },
			    open: function(){
			    	var that = $(this);
			    	$(this).parent().find(".ui-dialog-titlebar-close").unbind("click");
			    	$(this).parent().find(".ui-dialog-titlebar-close").click(function(){
			    		that.dialog("destroy");
			    		return false;
			    	});
			    },
		    	overlay: {
		        	opacity: 0.5,
		        	background: "black"
		    	},
		    	close: closeAction?closeAction:function(){}
		    });
		}
	},

	/**
	 * This function provides a modal message dialog that can be used to message the user.
	 * It has only the close button available that simply closes the dialog and performs a
	 * given action.
	 *
	 * Usage: Dialog.errorMessage('Please Note', 'Due to technical problems the order cannot be stored.', function(){CSSuite.setContext(CSSuite.CONTEXT_GENERAL);Order.refreshOrder();});
	 *
	 * @param title The title.
	 * @errorMessage The error message.
	 */
	errorMessage: function (title, message, onCloseAction){
		var dialogDiv = $("#GeneralJQueryDialog")[0];
		if (dialogDiv)
		{
			dialogDiv.title=title;
			dialogDiv.innerHTML=message;
			$("#GeneralJQueryDialog").dialog({
				modal: true,
				resizable: false,
			    buttons: {
			        "Ok": function() {
			            $(this).dialog("destroy");
	            		onCloseAction?onCloseAction():function(){};
			        }
			    },
			    open: function(){
			    	var that = $(this);
			    	$(this).parent().find(".ui-dialog-titlebar-close").unbind("click");
			    	$(this).parent().find(".ui-dialog-titlebar-close").click(function(){
			    		that.dialog("destroy");
			    		return false;
			    	});
			    },
			    create: function (event) { 
			    	$(event.target).parent().css('display', 'inline-block');
			    },
		    	overlay: {
		        	opacity: 0.5,
		        	background: "black"
		    	},
		    	close: onCloseAction?onCloseAction:function(){}
		    });
		}
	},

	/**
	* This function is used to bring up a div with a given set of buttons
	* (and associated actions). This way form dialogs can easily be implemented.
	*
	* @param title 	Specifies the title of the dialog. The title can also be
	*			   	specified by the title attribute on the dialog source element.
	* @param buttons Specifies which buttons should be displayed on the dialog.
	*		 		 The property key is the text of the button. The value is the callback
	*		 		 function for when the button is clicked. The context of the callback is
	*		 		 the dialog element; if you need access to the button, it is available
	*				 as the target of the event object.
	* @param resizable Specifies whether the dialog will be resizeable. Possible values: true, false.
	* @param width The width of the dialog, in pixels.
	* @closeAction Callback for the close.dialog event. The function gets passed two arguments in
				   accordance with the triggerHandler interface. The data passed is the closed dialog options object.
	* @param height The height of the dialog, in pixels.
	*/
	formDialog: function( title, buttons, resizable, width, height, maxWidth, maxHeight, onCloseAction )
	{
		var dialogDiv = $("#GeneralJQueryDialog");
		if (dialogDiv.length == 1) {
			dialogDiv.attr('title', unescape(title));
			dialogDiv.dialog({
				modal: true,
			    height: height,
			    width: width,
			    resizable: resizable,
			    maxWidth: maxWidth,
			    maxHeight: maxHeight,
			    buttons: buttons,

			    close: onCloseAction,
			    create: function (event) { 
			    	$(event.target).parent().css('display', 'inline-block');
			    },
			    open: function(){
			    	var that = $(this);
			    	$(this).parent().find(".ui-dialog-titlebar-close").unbind("click");
			    	$(this).parent().find(".ui-dialog-titlebar-close").click(function(){
			    		that.dialog("destroy");
			    		return false;
			    	});
			    },
		    	overlay: {
		        	opacity: 0.5,
		        	background: "black"
		    	} });
		}
	}
}
