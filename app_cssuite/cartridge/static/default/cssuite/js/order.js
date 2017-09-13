
/*
 * Functionality around the modified order
 */

var Order = {

	//some constants
	STATUS_NEW: 1,
	STATUS_MODIFIED: 2,

	// during page loading, the Demandware URL is stored here
	saveUrl: '',
	addProductUrl: '',
	updateLineItemQtyUrl: '',

	SEARCH_CONTEXT_ALL: 'ALL',
	SEARCH_CONTEXT_CUSTOMER: 'CUSTOMER',

	//current order ID
	orderNo: null,
	orderStatus: null,
	lastCustomerNumber: '',
	lastOrderSearchContext: this.SEARCH_CONTEXT_ALL,

	addNote: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.addNotes";

		//get the note
		var _subject = $('#note_subject').val();
		var _text = $('#note_text').val();
		var postdata = "notesubject="+_subject+"&notetext="+_text;
		//save the note
		jQuery.ajax({
			type: "POST",
			url: Order.addNoteUrl,
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#notes_details").html(data);
			},
			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
		  		CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
		  	}
		});

	},

	/**
	* This function is distributing the actual actions. When in context of an order
	* it triggers the addProductToShipments, otherwise the product detail dialog is opened.
	*
	* @param productID Identifier for the product (SKU)
	*/
	addProduct: function( productID )
	{
		CSSuite.info = "Order.addProduct";

		//check if the orderNo exists
		//if an order is being edited, allow to add the product to the order
		//if on the main page, display product details in the main pane
		if(CSSuite.context == CSSuite.CONTEXT_ORDER){
			// add the product to the lineitems
			Dialog.addProductToShipments( productID );
		} else {
			Dialog.showProduct( productID );
		}
	},

	/**
	* Second step of the work flow were the form is serialized and the actual
	* add to cart is taking place.
	*
	* @param formName name of the form that needs to be serialzied and submitted.
	*/
	addProductToShipments: function(formName)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.addProductToShipments";

		var _formName = "#" + formName;
		var postdata = $(_formName).serialize();

		/**
		 * Add option values
		 */
		var optionSelects = $('select.productOption');
		if (optionSelects.length > 0) {
			$.each( optionSelects , function(index, productOption){
				postdata+='&' + productOption.id + '=' + escape(productOption.value)
			});
		}

		jQuery.ajax({
			type: "POST",
			url: Order.addProductToShipmentsUrl,//CSCart-ProductToShipments
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
				Order.refreshAllDetails();
			},
			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
		  		CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
		  	}
		});


	},

	cancelOrder: function(action)
	{

		CSSuite.info = "Order.cancelOrder";

		var postdata = $("#OrderCancelationForm").serialize();
		postdata = postdata + (action ? "&"+action+"=true" : "");

		var url = $("#OrderCancelationForm").attr("action");

		// make the call to the pipeline
		jQuery.ajax({
			url: url,
			cache: false,
			data: postdata,
            type: "POST",
			success: function(data, textStatus) {
				$("#GeneralJQueryDialog").html(data);
				Order.showAllOrders();
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
				Order.showStatus();
			},
			beforeSend: function(XMLHttpRequest){
			    CSSuite.wait2($("#lineitems_details"));
			}
		});

	},

	// edit an existing shipment
	saveShipment: function(action)
	{
		CSSuite.info = "Order.saveShipment";

		var postdata = $("#EditShippingForm").serialize();
		postdata = postdata + (action ? "&"+action+"=true" : "");

		var url = $("#EditShippingForm").attr("action");

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
				Order.showStatus();
		  	}
		});
	},

	//get a list of the orders in the system
	//TODO: apply a search filter
	searchOrders: function(){
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_ORDER_SEARCH ) ) //return if the action lock could not be retrieved
			return;

		this.lastOrderSearchContext = this.SEARCH_CONTEXT_ALL;

		CSSuite.info = "Order.searchOrders";

		//set the Order.orderNo to null to avoid order related operation
		Order.reset( );

		// ajax request
		jQuery.ajax({
			url: Order.searchOrdersUrl, //CSOrder-Search
		  	cache: false,
		  	data: {
                orderNo: document.getElementById('OrderSearchForm_OrderNo').value,
                customerNo: document.getElementById('OrderSearchForm_CustomerNo').value,
                firstName: document.getElementById('OrderSearchForm_FirstName').value,
                lastName: document.getElementById('OrderSearchForm_LastName').value,
                email: document.getElementById('OrderSearchForm_CustomerEmail').value,
                status: document.getElementById('OrderSearchForm_OrderStatus').value,
                confirmation: document.getElementById('OrderSearchForm_ConfirmationStatus').value,
                shipment: document.getElementById('OrderSearchForm_ShippingStatus').value,
                payment: document.getElementById('OrderSearchForm_PaymentStatus').value,
                exported: document.getElementById('OrderSearchForm_ExportStatus').value,
                // createdBy: document.getElementById('OrderSearchForm_CreatedBy').value,
                from: document.getElementById('OrderSearchForm_OrderStartDate').value,
                to: document.getElementById('OrderSearchForm_OrderEndDate').value,
                results: document.getElementById('OrderSearchForm_ResultSet').value
            },
		  	beforeSend: function(XMLHttpRequest){
		  		$("#order_list").show()
		  		$("#product_detail").hide();
		    	CSSuite.wait2($("#order_list"));
			},
		  	success: function(data, textStatus){
		    	/*$("#general_details").html(data);*/
		    	$("#order_list").html(data);

		    	CSSuite.debug(CSSuite.info + ": " + textStatus);
		  	},

		  	error: handleError,

			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_ORDER_SEARCH ); // release the lock cause we are finished
				//hide the tabs div (order details)
				$('#tabs').hide();
		  	}
		});
	},


	//get a list of the orders for a customer
	//TODO: apply a search filter
	getCustomerOrders: function( aCustomerNumber ){

		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_ORDER_SEARCH ) ) {
			//return if the action lock could not be retrieved
			return;
		}

		CSSuite.info = "Order.getCustomerOrders";

		//set the Order.orderNo to null to avoid order related operation
		Order.reset();
		if (aCustomerNumber)
		{
			lastCustomerNumber = aCustomerNumber;
		}
		this.lastOrderSearchContext = this.SEARCH_CONTEXT_CUSTOMER;

		// ajax request
		jQuery.ajax({
			url: Order.searchOrdersUrl,//CSOrder-Search
		  	cache: false,
		  	data: {
                customerNo: lastCustomerNumber,
                results: document.getElementById('OrderSearchForm_ResultSet').value
            },
		  	beforeSend: function(XMLHttpRequest){
		  		$("#order_list").show()
		  		$("#product_detail").hide();
		    	CSSuite.wait2($("#order_list"));
			},
		  	success: function(data, textStatus){
		    	/*$("#general_details").html(data);*/
		    	$("#order_list").html(data);

		    	CSSuite.debug(CSSuite.info + ": " + textStatus);
		  	},

		  	error: handleError,

			complete: function(XMLHttpRequest, textStatus){
		  		CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_ORDER_SEARCH ); // release the lock cause we are finished
				//hide the tabs div (order details)
				$('#tabs').hide();
		  	}
		});
	},



	//set base order information in relevant divs on the page
	getGeneralInfo: function()
	{
		CSSuite.info = "Order.getGeneralInfo";

		var postdata = "orderno=" + Order.orderNo;

		$("#order_number").html(Order.orderNo);

		jQuery.ajax({
			url: Order.generalInfoUrl, //CSCart-GetGeneralInfo
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#order_infopanel_customer").html(data);
			},

			error: handleError
		});


	},

	getNotes: function()
	{
		CSSuite.info = "Order.getNotes";

		var postdata = "method="+CSSuite.info;

		//save the address
		jQuery.ajax({
			url: Order.getNotesUrl,
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#notes_details").html(data);
				CSSuite.debug(CSSuite.info + textStatus);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){

		  	}
		});

	},

	getHistory: function()
	{
		CSSuite.info = "Order.getHistory";

		var postdata = "method="+CSSuite.info;

		//save the address
		jQuery.ajax({
			url: Order.getHistoryUrl,
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#history_details").html(data);
				CSSuite.debug(CSSuite.info + textStatus);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){

		  	}
		});

	},

	getProductLineItems: function()
	{
		CSSuite.info = "Order.getProductLineItems";

		var postdata = "method=" + CSSuite.info;


		// make the call to the pipeline
		jQuery.ajax({
			url: Order.productLineItemsUrl, //CSCart-GetProductLineItems
			cache: false,
			data: "method=productLineItems",
			success: function(data, textStatus){
				CSSuite.msg("Order refreshed");
				$("#lineitems_details").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
			},
			beforeSend: function(XMLHttpRequest){
			    CSSuite.wait2($("#lineitems_details"));
				Order.showStatus();
			}
		});
		Order.getPaymentInfo();
	},

	/**
	 * Add a price adjustment to the order.
	 * <p>
	 * Necessary IDs:
	 * <ul>
	 * <li>price_adjustment_value
	 * <li>price_adjustment_callout_message
	 * </ul>
	 */
	addPriceAdjustment: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.addPriceAdjustment";

		var adj_val = $("#price_adjustment_value").val();
		var adj_callout = $("#price_adjustment_callout_message").val();
		var postdata = "priceAdjustment="+adj_val+"&calloutMessage="+adj_callout;

		jQuery.ajax({
			url: Order.addPriceAdjustmentUrl, //CSCart-AddPriceAdjustment
			cache: false,
			data: postdata,
            type: "POST",
            success: function(data, textStatus) {
				$("#GeneralJQueryDialog").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
			  	CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
			},
			beforeSend: function(XMLHttpRequest){
			}
		});

	},

	/**
	 * A dialog to confirm removal of a price adjustment.
	 * @param id The ID of the price adjustment to remove.
	 */
	removePriceAdjustment_dlg: function( id )
	{
		Dialog.confirm('Please Confirm', 'Are you sure you want to remove this price adjustment?<br/>', function(){Order.removePriceAdjustment(id);});
	},

	/**
	 * Removes a price adjustment from the order.
	 *
	 * @param id The ID of the price adjustment to remove.
	 */
	removePriceAdjustment: function(id)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.removePriceAdjustment";

		var postdata = "priceAdjustmentID=" + id;

		jQuery.ajax({
			url: Order.removePriceAdjustmentUrl, //CSCart-RemovePriceAdjustment
			cache: false,
			data: postdata,
            type: "POST",
			success: function(data, textStatus) {
				$("#GeneralJQueryDialog").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
			  	CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
			},
			beforeSend: function(XMLHttpRequest){
			}
		});

	},

	/**
	 * A dialog to confirm removal of a price adjustment.
	 * @param id The ID of the price adjustment to remove.
	 */
	removeShippingPriceAdjustment_dlg: function( id )
	{
		Dialog.confirm('Please Confirm', 'Are you sure you want to remove this shipping price adjustment?<br/>', function(){Order.removeShippingPriceAdjustment(id);});
	},

	/**
	 * Removes a shipping price adjustment from the order.
	 *
	 * @param id The ID of the shipping price adjustment to remove.
	 */
	removeShippingPriceAdjustment: function(id)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.removeShippingPriceAdjustment";

		var postdata = "shippingPriceAdjID=" + id;

		jQuery.ajax({
			url: Order.removeShippingPriceAdjustmentUrl, //CSCart-RemoveShippingPriceAdjustment
			cache: false,
			data: postdata,
            type: "POST",
			success: function(data, textStatus) {
				$("#GeneralJQueryDialog").html(data);
				Order.getProductLineItems();
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
			  	CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER );
				Order.showStatus();
			},
			beforeSend: function(XMLHttpRequest){
			    CSSuite.wait2($("#lineitems_details"));
			}
		});

	},

	/**
	 * Sets the shipping price to the order.
	 * <p>
	 * Necessary IDs:
	 * <ul>
	 * <li>price_adjustment_value
	 * <li>price_adjustment_callout_message
	 * </ul>
	 */
	setShippingPrice: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.setShippingPrice";

		var shippingPrice = $("#shippingpricetotal").val();
		var postdata = "shippingPrice="+shippingPrice;

		jQuery.ajax({
			url: Order.shippingPriceUrl, //CSCart-SetShippingPrice
			cache: false,
			data: postdata,
            type: "POST",
            success: function(data, textStatus) {
				$("#GeneralJQueryDialog").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
			  	CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
			},
			beforeSend: function(XMLHttpRequest){
			}
		});

	},

	/**
	 * A dialog to confirm removal of a coupon.
	 * @param id The ID of the price adjustment to remove.
	 */
	removeCoupon_dlg: function( couponCode )
	{
		Dialog.confirm('Please Confirm', 'Are you sure you want to remove this coupon?<br/>', function(){Order.removeCoupon(couponCode);});
	},

	/**
	 * Removes a coupon from the order.
	 *
	 * @param couponCode The coupon code of the coupon to remove.
	 */
	removeCoupon: function(couponCode)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.removeCoupon";

		var postdata = "couponCode=" + couponCode;

		jQuery.ajax({
			url: Order.removeCouponUrl, //CSCart-RemoveCoupon
			cache: false,
			data: postdata,
            type: "POST",
			success: function(data, textStatus) {
				$("#GeneralJQueryDialog").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
			  	CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
			},
			beforeSend: function(XMLHttpRequest){
			}
		});

	},

	/**
	 * Add a coupon to the order.
	 * <p>
	 * Necessary IDs:
	 * <ul>
	 * <li>price_adjustment_coupon
	 * </ul>
	 */

	addCoupon: function()
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.addCoupon";

		var postdata = "couponCode=" + $("#price_adjustment_coupon").val();

		jQuery.ajax({
			url: Order.addCouponUrl, //CSCart-AddCoupon
			cache: false,
			data: postdata,
            type: "POST",
			success: function(data, textStatus) {
				$("#GeneralJQueryDialog").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
			  	$.unblockUI();
			  	CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
			},
			beforeSend: function(XMLHttpRequest){
			}
		});

	},

	//manage payment info
	getPaymentInfo: function()
	{
		CSSuite.info = "Order.getPaymentInfo";

		var postdata = "method=getPaymentInfo";

		//call to the pipeline
		jQuery.ajax({
			url: Order.paymentInfoUrl,//CSCart-GetPaymentInfo
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				//put the payment  details in the div 'payment_details'
				$("#order_infopanel_payments").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){

		  	},
		  	beforeSend: function(XMLHttpRequest){
		    	CSSuite.wait2($("#order_infopanel_payments"));
			}
		});

	},

	//manage payment info
	getBillingAddress: function()
	{
		CSSuite.info = "Order.getBillingAddress";
		var postdata = "method=getBillingAddress";
		//alert('getBillingAddress');
		//call to the pipeline
		jQuery.ajax({
			url: Order.getBillingAddressURL,//CSCart-GetBillingAddress
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				//put the payment  details in the div 'payment_details'
				$("#order_infopanel_billingaddress").html(data);
			},

			error : handleError,

			complete: function(XMLHttpRequest, textStatus){

		  	},
		  	beforeSend: function(XMLHttpRequest){
		    	CSSuite.wait2($("#order_infopanel_billingaddress"));
			}
		});
	},

	// a dialog to confirm the payment instrument removal
	removePaymentInstrument_dlg: function(action )
	{
		Dialog.confirm('Please Confirm', 'Are you sure you want to remove the payment instrument?<br/>', function(){Order.removePaymentInstrument(action);});
	},

	//manage payment info
	removePaymentInstrument: function(action)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) {
			//return if the action lock could not be retrieved
			return;
		}

		CSSuite.info = "Order.removePaymentInstrument";

		var postdata = $("#removePayments").serialize();
		postdata = postdata + (action ? "&"+action+"=true" : "");

		var url = $("#removePayments").attr("action");

		//call to the pipeline
		jQuery.ajax({
			url: url,
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				//put the payment  details in the div 'payment_details'
				$("#order_infopanel_payments").html(data);
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
				CSSuite.modalRelease();
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
		  	},
		  	beforeSend: function(XMLHttpRequest){
			}
		});
	},


	/**
	* Final step when adding a new payment instrument to the cart.
	*/
	addPaymentInstrument: function(action){

		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) {
			//return if the action lock could not be retrieved
			return;
		}

		CSSuite.info = "Order.addPaymentInstrument";

		var postdata = $("#addPayments").serialize();
		postdata = postdata + (action ? "&"+action+"=true" : "");

		var url = $("#addPayments").attr("action");

		jQuery.ajax({
			type: "POST",
			url: url,
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.modalRelease();
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
		  	}
		});

	},

	/**
	* Final step when adding a new payment instrument to the cart.
	*/
	editPaymentInstrument: function(action){

		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) {
			//return if the action lock could not be retrieved
			return;
		}

		CSSuite.info = "Order.addPaymentInstrument";

		var postdata = $("#editPayment").serialize();
		postdata = postdata + (action ? "&"+action+"=true" : "");

		var url = $("#editPayment").attr("action");

		jQuery.ajax({
			type: "POST",
			url: url,
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.modalRelease();
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
		  	}
		});

	},

	/**
	* Creates a basket for an existing or anonymous customer.
	*
	* @param login - login of the customer
	*/
	createBasket: function( login )
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.createOrder";


		//ajax call
		jQuery.ajax({
			url: Order.createBasketUrl, //CSCart-CreateBasket
			cache: false,
		  	data: {
                login: login?login:""
            },
			beforeSend: function(XMLHttpRequest){
        		$('#lefttabs').tabs('option', 'selected', 0);
				CSSuite.modalWait("retrieving basket information, please wait...");
			},

			success: function(data, textStatus){
				$("#lineitems_details").html(data);
				CSSuite.debug(CSSuite.info + ": " + textStatus);
				Order.orderStatus = Order.STATUS_NEW;
				$('#product_search_panel_top').html('<a href="javascript:CSSuite.reset();">HOME</a> | <a href="javascript:Order.discardChanges();">Back to Search Results</a>');
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
				CSSuite.modalRelease();
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
		  	}
		});
	},

	/**
	* Creates a basket based on an already existing order.
	*
	* @param orderno - number of original order
	*/
	modifyOrder: function(orderno)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;

		CSSuite.info = "Order.modifyOrder";

		//set the orderNo
		Order.orderNo = orderno;

		//ajax call
		jQuery.ajax({
			url: Order.modifyOrderUrl, //CSCart-CreateBasketForOrderEdit
			cache: false,
			data: "orderno=" + orderno,

			beforeSend: function(XMLHttpRequest){
				$('#lefttabs').tabs('option', 'selected', 0);
				CSSuite.modalWait("retrieving order information, please wait...");
			},

			success: function(data, textStatus){
				$("#lineitems_details").html(data);
				CSSuite.debug(CSSuite.info + ": " + textStatus);
				Order.orderStatus = Order.STATUS_NEW;
				$('#product_search_panel_top').html('<a href="javascript:CSSuite.reset();">HOME</a> | <a href="javascript:Order.discardChanges();">Back to Search Results</a>');
			},

			error: handleError,

			complete: function(XMLHttpRequest, textStatus){
				CSSuite.modalRelease();
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
				//fix hash bug
				$('#LeftPane .tabs ul.ui-tabs-nav .ui-state-active a').click();
		  	}
		});
	},

	/**
	 * Refreshes all relevant order data panels
	 */
	refreshAllDetails: function(){
		CSSuite.info = "Order.refreshAllDetails";
		var postdata = "method=refreshAllDetails";
		//call to the pipeline
		jQuery.ajax({
			url: Order.getCartInfoUrl,//CSCart-GetCartInfo
			cache: false,
			data: postdata,
			success: function(data, textStatus){
				var responseNode=$(data);
				$("#order_infopanel_customer").html(responseNode.find('div#cart_general_info').html());
				$("#order_infopanel_billingaddress").html(responseNode.find('div#cart_payment_instruments').html());
				$("#lineitems_details").html(responseNode.find('div#cart_productLineItems').html());
				$("#history_details").html(responseNode.find('div#cart_history').html());
				$("#notes_details").html(responseNode.find('div#cart_notes').html());
				$("#order_infopanel_payments").html(responseNode.find('div#cart_paymentinstruments').html());
			},
			error : handleError,
			complete: function(XMLHttpRequest, textStatus){
		  	},
		  	beforeSend: function(XMLHttpRequest){
		    	//CSSuite.wait2($("#order_infopanel_billingaddress"));
			}
		});
	},


	// a dialog to confirm the line item removal
	removeLineItem_dlg: function( pLineItem )
	{
		Dialog.confirm('Please Confirm', 'Are you sure you want to remove this line item?<br/>', function(){Order.removeLineItem(pLineItem);});
	},

	removeLineItem: function( pLineItem )
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_MODIFY_ORDER ) ) //return if the action lock could not be retrieved
			return;
		CSSuite.info = "Order.removeLineItem";

		//ajax call
		jQuery.ajax({
			url: Order.removeLineItemUrl, //CSCart-CreateBasket
			cache: false,
			data: "lineItem=" + pLineItem,
			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
			},
			error: handleError,
			complete: function(XMLHttpRequest, textStatus){
				CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_MODIFY_ORDER ); // release the lock cause we are finished
				Order.showStatus();
		  	}
		});
	},

	//update the quantity for a line item
	updateLineItemQty: function( pLineItem, qty )
	{
		CSSuite.info = "Order.updateLineItemQty";

		var postdata = "lineItem=" + pLineItem + "&qty=" + qty;

		jQuery.ajax({
			url: Order.updateLineItemQtyUrl,
			cache: false,
			data: postdata,
			beforeSend: function(XMLHttpRequest){

			},

			error: handleError,

			success: function(data, textStatus){
				$("#GeneralJQueryDialog").html(data);
			},
			complete: function(XMLHttpRequest, textStatus){
				Order.showStatus();
			}
		});
	},

	//reset the order status to null
	reset: function(){
		this.orderNo = null;
		this.orderStatus = null;
	},

	/**
	* Submits the new billing address data.
	*/
	saveBillingAddress: function(action)
	{
		CSSuite.info = "Order.saveBillingAddress";

		var postdata = $("#editBillingAddress").serialize();
		postdata = postdata + (action ? "&"+action+"=true" : "");

		var url = $("#editBillingAddress").attr("action");

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
				Order.showStatus();
		  	}
		});
	},

	//save the basket stored in memory (privacy.csr_basket)
	saveOrder: function(action)
	{
		CSSuite.info = "Order.saveOrder";

		var postdata = $("#OrderSubmitForm").serialize();
		postdata = postdata + (action ? "&"+action+"=true" : "");

		var url = $("#OrderSubmitForm").attr("action");

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


	// a dialog to confirm that all changes should be discarded
	discardChanges: function()
	{
		if (CSSuite.isActionLocked( CSSuite.LOCK_SCOPE_MODIFY_ORDER )) // check if there is concurent action running, if so, return and do nothing;
			return;
		var confirmationFunction = function(){
				CSSuite.setContext(CSSuite.CONTEXT_GENERAL);
				if (Order.lastOrderSearchContext == Order.SEARCH_CONTEXT_CUSTOMER)
				{
					var tabs = $('.tabs');
					tabs.find('ul.ui-tabs-nav a').eq(1).triggerHandler( 'click' );
					Order.getCustomerOrders();
				} else {
					Order.searchOrders();
					var tabs = $('.tabs');
					$('.tabs').find('ul.ui-tabs-nav a').eq(0).triggerHandler( 'change' );
				}
				$('#product_search_panel_top').html("&nbsp;");
				//fix hash bug
				$('#LeftPane .tabs ul.ui-tabs-nav .ui-state-active a').click();
			};
		if (this.orderStatus == this.STATUS_MODIFIED) {
			Dialog.confirm('Please Confirm', '<div class="jquery_cancelchanges">Are you sure you want to go back to Search Results and discard all changes?</div><br/>', confirmationFunction);
		} else {
			confirmationFunction();
		}
	},

	//set the status of the order
	showStatus: function(){
		//set the div for visual feedback
		var status_msg = "<span style='color:green;'>New</span>";
		if(Order.orderStatus == 2){
			status_msg = "<span style='color:orange;'>Modified</span>";
		}
		$("#order_status").html(status_msg);
		return Order.orderStatus;
	},


	//set the status of the order
	setStatus: function(status){
		Order.orderStatus = status;
	},

	//retrieves a list of all the orders
	showAllOrders: function()
	{
		var validate = /\d{2}\/\d{2}\/\d{4}$|^$/;
		if (!validate.test(document.getElementById("OrderSearchForm_OrderStartDate").value)) {
			alert(document.getElementById("OrderSearchForm_OrderStartDate").value+' is not a valid date format! (MM/dd/yyyy)');
			document.getElementById("OrderSearchForm_OrderStartDate").focus();
		} else if (!validate.test(document.getElementById("OrderSearchForm_OrderEndDate").value)){
			alert(document.getElementById("OrderSearchForm_OrderEndDate").value+' is not a valid date format! (MM/dd/yyyy)');
			document.getElementById("OrderSearchForm_OrderEndDate").focus();
		} else this.searchOrders();

	},

	//update the quantity for a line item
	setPriceValue: function(pLineItem)
	{
		CSSuite.info = "Order.setPriceValue";

		//remove priceValue_ to get the lineitem
		var li = pLineItem.substring(11);

		//get the value of the priceValue
		var val = $('#'+pLineItem).val();
		var postdata = "lineitemid=" + li + "&pricevalue=" + val;

		jQuery.ajax({
			url: Order.setPriceValueUrl,//CSSuite2-SetPriceValue
			cache: false,
			data: postdata,
			beforeSend: function(XMLHttpRequest){

			},

			error: handleError,

			success: function(data, textStatus){
		  		//CSSuite.msg("updateLineItemQty: " + qty);
				Order.getProductLineItems();
				Order.orderStatus = Order.STATUS_MODIFIED;
			},
			complete: function(XMLHttpRequest, textStatus){
				Order.showStatus();
			}
		});

	}
}
