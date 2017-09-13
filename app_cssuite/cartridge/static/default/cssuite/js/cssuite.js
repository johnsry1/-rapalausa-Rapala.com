/*
 * CSSuite Methods to manage the UI
 */
var CSSuite = {
	generalInfoUrl: '',
	data: '',
	oddRowColor: '#edf3fe',
	evenRowColor: '#ffffff',
	siteID: '',
	context: 'GeneralContext',

	CONTEXT_ORDER: 'OrderContext',
	CONTEXT_GENERAL: 'GeneralContext',

	LOCK_SCOPE_CUSTOMER_SEARCH : 'CUSTOMER_SEARCH',
	LOCK_SCOPE_ORDER_SEARCH : 'ORDER_SEARCH',
	LOCK_SCOPE_PRODUCT_SEARCH : 'PRODUCT_SEARCH',
	LOCK_SCOPE_MODIFY_ORDER : 'MODIFY_ORDER',
	LOCK_SCOPE_VIEW_PRODUCT : 'VIEW_PRODUCT',
	LOCK_SCOPE_VIEW_ORDER_DETAILS : 'VIEW_ORDER_DETAILS',

	// constants
	constants: {'AVAIL_STATUS_IN_STOCK':'IN_STOCK',
	             'AVAIL_STATUS_PREORDER':'PREORDER',
	             'AVAIL_STATUS_BACKORDER':'BACKORDER',
	             'AVAIL_STATUS_NOT_AVAILABLE':'NOT_AVAILABLE'},

	// product availability messages
	resources: {'IN_STOCK':'In Stock',
				'QTY_IN_STOCK':'{0} Item(s) In Stock',
				'PREORDER':'Pre-Order',
				'QTY_PREORDER':'{0} item(s) are available for pre-order.',
				'REMAIN_PREORDER':'The remaining items are available for pre-order.',
				'BACKORDER':'Back Order',
				'QTY_BACKORDER':'Back Order {0} item(s)',
				'REMAIN_BACKORDER':'The remaining items are available on back order.',
				'NOT_AVAILABLE':'This item is currently not available.',
				'REMAIN_NOT_AVAILABLE':'The remaining items are currently not available. Please adjust the quantity.',
				'IN_STOCK_DATE':'The expected in-stock date is {0}.',
				'NON_SELECTED':'Not Selected',
				'MISSING_VAL':'Select {0}',
				'SIZECHART_TITLE':'Size Chart',
				'SEND_TO_FRIEND':'Send to a Friend'},


	actionLocks: new Object(),

	info: '',

	/**
	 * grab anything inside a hidden dom element and append it to its immediate previous sibling
	 * as data attribute i.e. jQuery().data("data", hiddenStr)
	 * if the hidden data specifies json in the class then this routine would attempt to
	 * convert the hidden data into json object before adding it as data attribute.
	 * after adding the data, the hidden span/element is removed from the DOM.
	 */
	hiddenData : function() {
		jQuery.each(jQuery(".hidden"), function() {
			var hiddenStr = jQuery(this).html();

			if (hiddenStr === "") {
				return;
			}

			// see if its a json string
			if (jQuery(this).hasClass("json")) {
				// try to parse it as a json
				try {
					hiddenStr = window["eval"]("(" + hiddenStr + ")");
				}
				catch(e) {}
			}

			jQuery(this).prev().data("data", hiddenStr);

			jQuery(this).remove();
		});
	},

	/**
	 * Unobtrusive js api calls go here.
	 */
	 execUjs: function() {
		// process hidden data in the html markup and cnnvert it into data object(s)
		this.hiddenData();

		// initialize form validator plugin
		//this.validator();

		// process country form fields and attach listeners
		//this.addCountryListener();
	},


	debug: function(m) {
		$("#debug").html(m);
	},

	reset: function()
	{
		if (this.context == this.CONTEXT_ORDER && Order.orderStatus == Order.STATUS_MODIFIED)
		{
			Dialog.confirm('Reset CSSuite',
				'Are you sure you want to go back to Home? <br/>It will reset all search forms, discard all order changes you have just done and view the start page.<br/>',
				function(){
					window.location.href = CSSuite.homeUrl;
				}
			);
		} else {
			Dialog.confirm('Reset CSSuite',
				'Are you sure you want to go back to Home? <br/>It will reset all search forms and view the start page.<br/>',
				function(){
					window.location.href = CSSuite.homeUrl;
				}
			);
		}
	},

	modalWait: function(m)
	{
		var msg = '<div style="padding:50px;"></div>';
		$.blockUI({ message: msg });
	},

	modalRelease: function()
	{
		$.unblockUI();
	},

	msg: function(m)
	{
		$("#msg").html(m);
	},

	searchCustomer: function(){
		var q = $("#customerQuery").val();
		CSSuite.debug("query: " + q);
		Customer.search();
	},

	searchProduct: function(new_url){
		var q = $("#ProductSearchForm_ProductQuery").val();
		CSSuite.debug("query: " + q);
		if (q==''){
			Dialog.message('Error',CSSuite.noSearchCriteria);
		} else {
			Product.search(q, new_url);
		}
	},

	wait: function(el){
		el.html(CSSuite.wait2Url);
	},

	wait2: function(el){
		el.html(CSSuite.wait2Url);
	},

	setContext: function( newContext ){
		if ( newContext == this.CONTEXT_ORDER )
		{
			this.context = newContext;
			//hide order search form and display the order info panel
			$('#order_searchform').hide();
			$('#lefttab_customers_tab').hide();
			$('#order_infopanel').show();
		} else {
			this.context = this.CONTEXT_GENERAL;
			$('#order_infopanel').hide();
			$('#order_detail').hide();
			$('#lefttab_customers_tab').show();
			$('#order_searchform').show();
		}
	},

	/**
	* Using this method the lock for a specified scope can be retrieved. If the action was
	* successfully performed it returns 'true'. Otherwise 'false' is returned.
	*
	* @param lockscope String name of the lock scope
	* @return 'true' if the lock could be retrieved, otherwise 'false'
	*/
	lockAction: function(lockscope) {
		if ( this.isActionLocked(lockscope) || !lockscope ) {
			return false;
		} else {
			this.actionLocks[lockscope] = true;
			return true;
		}
	},

	/**
	* Resets an action lock.
	*
	* @param lockscope String name of the locking scope
	*/
	releaseActionLock: function(lockscope) {
		if (lockscope)
			this.actionLocks[lockscope] = false;
	},

	/**
	* Determines if a given lock scoupe is currently in use.
	*
	* @param lockscope String name of the lock scope
	* @return 'true' is the lock is in use, otherwise 'false'
	*/
	isActionLocked: function(lockscope) {
		var isLock = this.actionLocks[lockscope];
		if (isLock)
			return isLock;
		else
			return false;
	},

	toggleStateCodes: function( countrySelectBoxID, stateSelectBoxID ) {
		if (countrySelectBoxID && stateSelectBoxID)
		{
			var countrySelectBox = $('#'+countrySelectBoxID);
			var stateSelectBox = $('#'+stateSelectBoxID);
			alert
			if (countrySelectBox && stateSelectBox)
			{
				var selectedCountry = countrySelectBox.val();
				var selectedState = stateSelectBox.val();
				if (selectedCountry)
				{
					//remove all options
					while (stateSelectBox[0].length>0)
					{
						stateSelectBox[0].remove(0);
					}

					var stateOptions = CSSuite.stateOptionMap[selectedCountry];
					if (stateOptions != null)
					{
						var i = 0;
						var selectedIndex = 0;
						var alreadySelected = false;
						while (stateOptions[i] != null)
						{
							var newEntry = document.createElement("option");
							newEntry.text = stateOptions[i][1];
							newEntry.value = stateOptions[i][0];
							if (!alreadySelected && selectedState != null && stateOptions[i][0] != null && selectedState == stateOptions[i][0])
							{
								newEntry.selected = true;
								alreadySelected = true;
							}
							stateSelectBox[0].add(newEntry, null);
							i++;
						}
					}
				}
			}
		}
	},

	// sub namespace app.ajax.* contains application specific ajax components
	ajax: {
		Success: "success",
		currentRequests: {}, // request cache

		// ajax request to get json response
		// @param - reqName - String - name of the request
		// @param - async - boolean - asynchronous or not
		// @param - url - String - uri for the request
		// @param - data - name/value pair data request
		// @param - callback - function - callback function to be called
		getJson: function(options) {
			var thisAjax = this;

			// do not bother if the request is already in progress
			// and let go null reqName
			if (!options.reqName || !this.currentRequests[options.reqName]) {
				this.currentRequests[options.reqName] = true;
				if(options.async == "undefined") options.async = true;
				// make the server call
				jQuery.ajax({
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					url		: options.url,
					cache	: true,
					async	: options.async,
					data	: options.data,

					success: function(response, textStatus) {
						thisAjax.currentRequests[options.reqName] = false;

						if (!response.Success) {
							// handle failure
						}
						if (options.callback) {
							options.callback(response, textStatus);
						} else {
							alert("getJson callback not defined");
						}
					},

					error: function(request, textStatus, error) {
						if (textStatus === "parsererror") {
							alert(CSSuite.resources["BAD_RESPONSE"]);
						}

						options.callback({Success: false, data:{}});
					}
				});
			}
		},

		// ajax request to load html response in a given container
		// @param - reqName - String - name of the request
		// @param - url - String - uri for the request
		// @param - data - name/value pair data request
		// @param - callback - function - callback function to be called
		// @param - selector - string - id of the container div/span (#mycontainer) - it must start with '#'
		load: function(options) {

			var thisAjax = this;

			// do not bother if the request is already in progress
			// and let go null reqname
			if (!options.reqName || !this.currentRequests[options.reqName]) {
				this.currentRequests[options.reqName] = true;
				// make the server call
				jQuery.ajax({
					dataType: "html",
					url		: options.url,
					cache	: true,
					data	: options.data,

					success: function(response, textStatus) {
						thisAjax.currentRequests[options.reqName] = false;

						if (options.selector) {
							jQuery(options.selector).html(response);
						}

						(options.callback != undefined ? options.callback(response, textStatus): null)
					},

					error: function(request, textStatus, error) {
						if (textStatus === "parsererror") {
							alert(CSSuite.resources["BAD_RESPONSE"]);
						}

						options.callback(null, textStatus);
					}
				});
			}
		},

		/**
		 * This function provides a convenient way to store 'form' fields within
		 * a cookie so it can be restored at any time. Every time the value changes
		 * it does also update the cookie.
		 *
		 * @param selector CSS selector to address the base path for field lookup
		 */
		 rememberFields: function( selector ){
			$(selector).each(
					function(){
						//if this item has been cookied, restore it
						var name = CSSuite.siteID + $(this).attr('name');
						if( $.cookie( name ) ){
							$(this).val( $.cookie(name) );
						}
						//assign a change function to the item to cookie it
						$(this).change(
								function(){
									$.cookie(name, $(this).val(), { path: '/', expires: 365 });
								});
			});
		}
	}
};

function toggle(id){
	var content = document.getElementById(id);
	if (content.className == 'collapsed') {
		content.className = 'expand';
	} else {
		content.className = 'collapsed';
	}
}

function setStyle(el, style) {
	$('#'+el).removeClass();
	$('#'+el).addClass(style);
}

function show(el) {
	$('#'+el).css('display','block');
}

function setCustomerInfo(str){
	$('#header_customer').html(str);
}

function setOrderNumber(orderno){
     $('#order_number').html(orderno);
}

function showShipmentHeader(el){
	$('#'+el).slideToggle("slow");
	$('#'+el+"_hide").toggle();
	$('#'+el+"_show").toggle();
}

function toggleOrderHistory(el){
	$('#'+el).slideToggle("fast");
	$('#'+el+"_hide").toggle();
	$('#'+el+"_show").toggle();
}

/**
 * Toggles the order history visibility and the click images.
 * @param el The element id
 */
function toggleOrderHistory(el){
	$('#'+el).slideToggle("fast");
	$('#'+el+"_hide").toggle();
	$('#'+el+"_show").toggle();
}

/**
 * Toggles the payment instruments visibility and the click images.
 * @param el The element id
 */
function togglePaymentInstrument(el){
	$('#'+el).slideToggle("fast");
	$('#'+el+"_hide").toggle();
	$('#'+el+"_show").toggle();
}

function editfield(el){
	document.getElementById(el).disabled = false;
	$('#'+el+'Span').show();
	$('#'+el+'Edit').hide();
}

function savefield(el){
	var e2 = $('#'+el);
	alert(e2.val());
	hidefield(el);
}

function hidefield(el){
	document.getElementById(el).disabled = true;
	$('#'+el+'Span').hide();
	$('#'+el+'Edit').show();
}


//this is to test dynamic inline field
//base the ids on the good old unique UUID
function _editfield(el){
	document.getElementById(el).disabled = false;
	$('#'+el+'_span').show();
	$('#'+el+'_edit').hide();
}

function _savefield(el){
	var e2 = $('#'+el);
	//alert(el + ", " + e2.val());
	Order.updateLineItemQty(el,e2.val());
	_hidefield(el);
}

function _hidefield(el){
	document.getElementById(el).disabled = true;
	$('#'+el+'_span').hide();
	$('#'+el+'_edit').show();
}

/*$().ready(function(){
	CSSuite.rememberFields('#order_searchform :input');
	CSSuite.rememberFields('#customer_searchform :input');
	CSSuite.rememberFields('#product_searchform :input');
});*/
