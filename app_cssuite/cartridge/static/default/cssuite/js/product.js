

/*
 * Functionality 
 */
var Product = {

	searchUrl: '',
	
	search: function(query, new_url)
	{
		if ( !CSSuite.lockAction( CSSuite.LOCK_SCOPE_PRODUCT_SEARCH ) ) //return if the action lock could not be retrieved
			return;
		
		CSSuite.info = "Product.search";
		
		var postdata = "q="+query;
		var _url = Product.searchUrl;//CSProduct-Show

		if (new_url != null && new_url.length > 5) {
			_url = new_url;
		}
		
		//call to the pipeline
		jQuery.ajax({
			url: _url,
			cache: false,
			data: {
                q: document.getElementById('ProductSearchForm_ProductQuery').value,
                results: document.getElementById('ProductSearchForm_ResultSet').value
            },
			success: function(data, textStatus){
				$("#product_searchresults_container").html(data);
			},
			error: handleError,
			
		  	beforeSend: function(XMLHttpRequest){
				CSSuite.wait($("#product_searchresults_container"));
			},
			complete: function(XMLHttpRequest, textStatus){
		  		CSSuite.releaseActionLock( CSSuite.LOCK_SCOPE_PRODUCT_SEARCH ); // release the lock cause we are finished
		  	}
		});
	}
}

function show_product_tooltip(name, category, price, inv_rec) {
	$('#product_tooltip').html(
		"<div id='title'>" + unescape(name) + "</div>" + 
		"<div id='category'>" + category + "</div><hr><table>" + 
		"<tr class='price'><td>Price: </td><td>" + price + "</td></tr>" +
		"<tr class='inventory'><td>Inventory record: </td><td>" + inv_rec + "</td></tr></table>"
	);
}




(function(CSSuite){
	if (CSSuite) {
		// add Product namespace to app namespace
		CSSuite.Product = function(response) {
			// product private data

			// product json data
			var model 			= response.data;

			// div cotainer id
			var myContainerId	= "";

			// boolean flag to track the variants data request, reset in loadVariants() when the variants data is loaded
			var isLoadingVar	= false;

			// helper function to load variants data from the server
			// once the data is retrieved, it fires VariationsLoaded event so that UI can be refreshed appropriately
			var loadVariants	= function(thisProduct) {
				isLoadingVar = true;
				// build the url and load variants data
				CSSuite.ajax.getJson({
					url		: Product.getVariantsURL,
					data	: {"pid": thisProduct.pid, "format": "json"},
					callback: function(data){
						if (!data || !data.variations || !data.variations.variants) {
							return;
						}
						model.variations.variants = data.variations.variants;
						isLoadingVar = false; // we have loaded the variants
						jQuery(thisProduct).trigger("VariationsLoaded", ["loadVariants"]);
					}
				});
			}

			// binds A2C button click handler
			var getAddToCartBtn = function(thisProduct) {
				var addToCartBtn = jQuery(thisProduct.containerId+" .addtocartbutton:last").click(function(e) {
					if (model.master || model.variant) {
						if (thisProduct.selectedVar == null) {
							return false;
						}
						thisProduct.selectedOptions.pid = thisProduct.selectedVar.id;
						thisProduct.selectedOptions.masterPid = thisProduct.pid;
					}
					else {
						// check if we are adding a bundle/productset to the cart
						if (model.bundle || model.productSet) {							
							var subProducts = thisProduct.subProducts;
							var comma 		= ",";
							var tempQty 	= "";
							var subproduct 	= null;
							
							thisProduct.selectedOptions.childPids = "";
														
							if (model.productSet) {
								thisProduct.selectedOptions.Quantity = "";
							}
							
							// process each individual products in the set/bundle
							// and prepare product.selectedOptions for final submission
							for (var i = 0; i < subProducts.length; i++) {
								subproduct = subProducts[i];
								
								if (i == subProducts.length - 1) {
									comma = ""; // at the end of the list
								}
								
								// see if any of the sub products are variations, if so then get the selected variation id
								// from selectedVar property and make it a comma separated list
								if (subproduct.variant || subproduct.master) {									
									if (subproduct.selectedVar == null) {
										return false;
									}
									thisProduct.selectedOptions.childPids += subproduct.selectedVar.id+comma;
								}
								else {
									thisProduct.selectedOptions.childPids += subproduct.selectedOptions.pid+comma;
								}
								
								var tempPid = subproduct.selectedOptions.pid;
								subproduct.selectedOptions.pid = null;
								// merge selected options of sub product with the main product
								thisProduct.selectedOptions = jQuery.extend({}, thisProduct.selectedOptions, subproduct.selectedOptions);
								subproduct.selectedOptions.pid = tempPid;
								
								// if it is a product set then sub products can have their separate qty
								if (model.productSet) {
									tempQty += subproduct.selectedOptions.Quantity+comma;
								}
							}
						}
						
						// if it is a product set then sub products can have their separate qty
						// tempQty is a comma separated list of qty for each product in the set
						if (model.productSet) {
							thisProduct.selectedOptions.Quantity = tempQty;
						}
						
						// make sure the pid which gets submitted is for the main product
						thisProduct.selectedOptions.pid = thisProduct.pid;
					}

					if (model.bundle) {
						thisProduct.selectedOptions.Quantity = 1; // hard coded qty=1 when we the product is a bundle
					}
					else if (!model.productSet) {
						// grab the user entered qty
						thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId+" .quantityinput:last").val();
					}
					
					// if it is not a productset then make sure qty is specified greater than 0
					if (model.productSet || thisProduct.selectedOptions.Quantity > 0) {
						// disable a2c button
						addToCartBtn.attr("disabled", "true");
						
						// close the quick view when user clicks A2C.
						app.quickView.close();
						
						// find if there is a handler bound to AddToCart event e.g. cart -> edit details or wishlist -> edit details etc.
						// then fire it otherewise call CSSuite.minicart.add to add the selected product to the cart and show minicart
						var event = jQuery.Event("AddToCart");
						event.selectedOptions = thisProduct.selectedOptions;
												
						(jQuery.event.global["AddToCart"] == undefined || jQuery.event.global["AddToCart"] == null) ? CSSuite.minicart.add( "", thisProduct.selectedOptions, function(){addToCartBtn.removeAttr("disabled")} ) : jQuery(document).trigger(event);
					}
					return false;
				} );

				return addToCartBtn;
			}

			// bind qty box keyup handler
			// the handler grabs the value and updates 
			// product.selectedOption.Quantity
			// show the updated availabilty message in case the available qty is different than available etc.
			// trigger AddtoCartEnabled event
			var getQtyBox 		= function(thisProduct) {				
				
				jQuery(thisProduct.containerId+" .quantityinput:last").keyup(function(e){
					var val = null;
					try {
						val = parseInt(jQuery(thisProduct.containerId+" .quantityinput:last").val());
					} catch(e){val = null};

					if (val != null) {
						thisProduct.selectedOptions.Quantity = val;
						
						setAvailabilityMsg(createAvMessage(thisProduct, val));
						
						jQuery(thisProduct).trigger("AddtoCartEnabled");
					}
				});
				
				// grab the currenlty displayed value basically the intial displayed value
				thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId+" .quantityinput:last").val();
				// show proper availability message
				setAvailabilityMsg(createAvMessage(thisProduct, thisProduct.selectedOptions.Quantity));
			}

			// create product tabs i.e. description, Attributes, Reviews etc.
			// it depends on jQuery to create tab display.
			// also bind tab print button click handler
			var getTabs 		= function(containerId) {

				var tabsDiv = jQuery(containerId+" #pdpTabsDiv");
				tabsDiv.tabs();

				// tab print handler
				jQuery("a.printpage").click(function() {
					window.print();
					return false;
				});
			}

			// bind addtowishlist, giftregistry, send to friend click handlers
			// bind handlers to AddtoCartDisabled, AddtoCartEnabled events for disabling/enabling wishlist/gift registry links
			var getMiscLinks 	= function(thisProduct) { }
			
			// binds product reviews click handlers
			// read review link opens reviews tab
			var getRatingSection = function(containerId) {

				jQuery(containerId+" #pdpReadReview").click(function(e) {
					jQuery(containerId+" #pdpTabsDiv").tabs("select", "pdpReviewsTab");
				} );

				jQuery(containerId+" #pdpWriteReview").click(function(e) {
				} );
			}

			// based on availability status, creates a message
			// param val - the stock value to compare i.e. qty entered by user
			var createAvMessage = function(thisProduct, val) {
					
				var avStatus 	= thisProduct.getAvStatus(); // availability status
				var avMessage 	= CSSuite.resources[avStatus];
				var ats 		= thisProduct.getATS(); // get available to sell qty
				
				if (avStatus === CSSuite.constants.AVAIL_STATUS_BACKORDER) {						
					avMessage = avMessage + "<br/>" + jQuery.format(CSSuite.resources["IN_STOCK_DATE"], (new Date(thisProduct.getInStockDate())).toDateString() );
				}
				else if (val > ats && avStatus !== CSSuite.constants.AVAIL_STATUS_NOT_AVAILABLE) {
					// display quantity left message
					avMessage = jQuery.format(CSSuite.resources["QTY_"+avStatus], ats);
				}
				
				return avMessage;
			}

			// helper function to set availability message
			var setAvailabilityMsg = function(msg) {
				jQuery(myContainerId+" .availability:last .value").html(msg);
			}

			/**
			 * Private. Computes price of a given product instance based on the selected options.
			 * 
			 * @param thisProduct - the product instance 
			 * @return price of the product to 2 decimal points.
			 */
			var computePrice = function(thisProduct) {

				var price = thisProduct.selectedVar != null ? thisProduct.selectedVar.pricing.sale : model.pricing.sale;
				// calculate price based on the selected options prices
				jQuery.each(thisProduct.selectedPrice, function(){
					price = (new Number(price) + new Number(this)).toFixed(2);
				});

				return price;
			}
										
			// Product instance
			return {
				pid					: model.ID,
				variant				: model.variant,
				master				: model.master,
				bundled				: model.bundled,
				selectedVarAttribs	: {}, // object containing variation attributes values as name value e.g. {color: "blue", size: "3", width: ""}				
				selectedVar			: null, // currently selected variant
				selectedOptions		: {}, // holds currently selected options object {optionName, selected val}
				selectedPrice		: {}, // holds prices for selected options as {warranty: ""}
				containerId			: null, // holds the html container id of this product
				subProducts			: [], // array to keep sub products instances 
				
				/**
				 * Enable Add to Cart Button.
				 */
				enableA2CButton: function() {
					if (this.selectedVar && this.selectedVar.id){
						$('#productid')[0].value = this.selectedVar.id;
						this.getAdd2CartButton().show();
					}
				},
				
				/**
				 * Disable Add to Cart Button.
				 */
				disableA2CButton: function() {
					$('#productid')[0].value = "";
					this.getAdd2CartButton().hide();
				},
				
				getAdd2CartButton: function(){
					return $('div.' + this.containerId).parents('div[aria-labelledby="ui-dialog-title-GeneralJQueryDialog"]').find('div.ui-dialog-buttonset button:first');
				},
				
				// determine if this product is part of a bundle/product set VIEW
				isSubProduct		: function() {
					return (model.bundled || model.productSetProduct) && CSSuite.ProductCache.subProducts.length > 0;
				},

				// show the selected variation attribute value next to the attribute label e.g. Color: Beige
				showSelectedVarAttrVal: function(varId, val) {
					jQuery(this.containerId+" .variationattributes div:not(.clear)").each(function(){
						var id = jQuery(this).data("data");
						
						if (varId === id) {
							jQuery(this).find('span.selectedvarval').html(val);
						}
					});
				},
				
				// shows product images and thumbnails
				// @param selectedVal - currently selected variation attr val
				// @param vals - total available variation attr values
				showImages: function(selectedVal, vals)  {
					var that = this;
					vals = vals || {};
					
					// show swatch related images for the current variation value					
					jQuery.each(vals, function(){
						var imgCounter = -1;
						var thisVal = this;
						if (this.val === selectedVal && this.images) {
							if (this.images.small.length > 0) {
								var imageURL = thisVal.images.medium[0].url;
								jQuery(that.containerId+" .productthumbnails:last").html("");
								jQuery(that.containerId+" .productimage").html("").append(jQuery("<img/>").attr("src", imageURL));
							}
							// make sure to show number of images based on the smallest of large or small as these have to have 1-1 correspondence.
							var noOfImages = this.images.large.length >= this.images.small.length ? this.images.small.length : this.images.large.length;
							
							// show thumbnails only if more than 1 or if this is a subproduct (bundled/subproduct)
							if (this.images.small.length > 1 || that.isSubProduct()) {
								jQuery.each(this.images.small, function(){
									imgCounter++;
									var imageInd = imgCounter;
									if (imgCounter > noOfImages - 1) {
										return;
									}
									jQuery(that.containerId+" .productthumbnails:last").append(jQuery("<img/>").attr("src", this.url).hover(function(e){
										jQuery(that.containerId+" .productimage").html("").append(jQuery("<img/>").attr("src", thisVal.images.medium[imageInd].url));
									}));
								});
							}
						}
					});
				},

				/**
				* Event handler when a variation attribute is selected/deselected.
				*/
				varAttrSelected: function(e) {
					// update the selected value node
					this.showSelectedVarAttrVal(e.data.id, e.data.val || "");

					this.selectedVarAttribs[e.data.id] = e.data.val;
					
					// if this is a deselection and user landed on a variant page then reset its variant flag 
					// as now user has deselected an attribute thus making it essentially a master product view
					if (e.data.val == null) { 
						this.variant = false;
					}
					
					// store this ref
					var that = this;

					// trigger update event which will update every other variation attribute i.e. enable/disable etc.

					// first reset the contents of each attribute display
					// when we have got the varriations data
					if (!isLoadingVar) {
						// find variants which match the current selection
						var selectedVarAttrVariants = e.data.val != null ? this.findVariations({id: e.data.id, val: e.data.val}): null;
						var selectedVarAttrs = jQuery.extend({}, {}, this.selectedVarAttribs);
						var validVariants = null;
						var unselectedVarAttrs = new Array();
						
						// for each selected variation attribute find valid variants
						for (var selectedVar in selectedVarAttrs) {
							if (selectedVarAttrs[selectedVar]) {
								validVariants = this.findVariations({id: selectedVar, val: selectedVarAttrs[selectedVar]}, validVariants);
							}
							else {
								unselectedVarAttrs.push(selectedVar);
							}
						}
						// update each variation attribute display
						jQuery.each(model.variations.attributes, function () {
							if ((this.id != e.data.id || e.data.val == null) && selectedVarAttrs[this.id] == null) {
								that.varAttrDisplayHandler(this.id, validVariants);								
							}
							else if (this.id != e.data.id && selectedVarAttrs[this.id] != null) {
								that.varAttrDisplayHandler(this.id, selectedVarAttrVariants);
							}
							else {
								// show swatch related images for the current value								
								that.showImages(e.data.val, this.vals);
							}
						});

						// based on the currently selected variation attribute values, try to find a matching variant
						this.selectedVar = this.findVariation(this.selectedVarAttribs);
					}

					// lets fire refresh view event to enable/disable variations attrs
					jQuery(this).trigger("VariationsLoaded");
				},

				/**
				* go thru all variations attr and disable which are not available
				*/
				resetVariations: function() {
					if (isLoadingVar) {
						return ; // we don't have the complete data yet
					}
					var that = this;

					jQuery(this.containerId + " .variationattributes .swatches").each(function(){
						var dataa = jQuery(this).data("data"); // data is id set via CSSuite.hiddenData api
						jQuery(this).find("a.swatchanchor").each(function(){
							// find A variation with this val
							if (that.isVariation({id:dataa, val:this.innerHTML})) {
								// found at least 1 so keep it enabled
								jQuery(this).parent().removeClass("unselectable");
							}
							else {
								jQuery(this).parent().addClass("unselectable");
								jQuery(this).parent().removeClass("selected");
							}
						});
					});
				},
				
				/**
				* given a variation attribute id and valid variants, it would adjust the ui i.e. enable/disable 
				* appropriate attribute values.
				* 
				* @param attrId - String, id of the variation attribute
				* @param validVariants - Array of json objects of valid variants for the given attribute id
				* */
				varAttrDisplayHandler: function (attrId, validVariants) {
					var that = this; // preserve this instance
					// loop thru all non-dropdown ui elements i.e. swatches e.g. color, width, length etc.
					jQuery(this.containerId + " .variationattributes .swatches").each(function(){
						var swatchId = jQuery(this).data("data");  // data is id set via CSSuite.hiddenData api
						if (swatchId === attrId) {
							
							jQuery(this).find("a.swatchanchor").each(function(){
							
								var parentLi= jQuery(this).parent();
								
								// find A variation with this val
								var filteredVariants = that.findVariations({id:attrId, val:this.innerHTML}, validVariants);
								if (filteredVariants.length > 0) {
									// found at least 1 so keep it enabled
									parentLi.removeClass("unselectable");
								}
								else {
									// no variant found with this value combination so disable it
									parentLi.addClass("unselectable");
									
									if (parentLi.hasClass("selected")) {
										// remove the currently selected value if the value is not selectable
										that.showSelectedVarAttrVal(attrId, "");
										that.selectedVarAttribs[attrId] = null;
									}
									// remove current selection
									parentLi.removeClass("selected");
								}
							});
						}
					});
					
					// loop thru all the non-swatches(drop down) attributes
					jQuery(this.containerId + " .variationattributes .variantdropdown select").each(function(){
						var vaId = jQuery(this).data("data").id;  // data is id set via CSSuite.hiddenData api
						if (vaId === attrId) {
							var len = this.options.length;
							
							jQuery.each(this.options, function(){
								
								if (len > 1 && this.index == 0) {
									return; // very first option when the length is greater than 1 is 'Select ...' message so skip it
								}
								
								// find A variation with this val
								var filteredVariants = that.findVariations({id:attrId, val:this.value}, validVariants);
								
								if (filteredVariants.length > 0) {
									// found at least 1 so keep it enabled
									this.disabled = false;
								}
								else {
									// no variant found with this value combination so disable it
									this.disabled = true;
									
									if (this.selected) {
										// remove the currently selected value if the value is not selectable
										that.showSelectedVarAttrVal(attrId, "");
										that.selectedVarAttribs[attrId] = null;
									}
									// remove current selection
									this.selected = false;
								}
							});
						}
					});
					
				},

				/**
				 * refresh the UI i.e. availability, price, A2C button and variation attributes display
				 */
				refreshView: function() {
					var thisProduct = this;
					if (!isLoadingVar && this.selectedVar == null) {
						// if we have loaded the variations data then lets if the user has already selected some values
						// find a matching variation
						this.selectedVar = this.findVariation(this.selectedVarAttribs);
					}
					
					if (!isLoadingVar && this.selectedVar != null) {

						// update availability
						setAvailabilityMsg(createAvMessage(thisProduct, 1));
						// update price
						//this.showUpdatedPrice(this.selectedVar.pricing.sale, this.selectedVar.pricing.standard);
						

						if (!(!this.selectedVar.inStock && this.selectedVar.avStatus === CSSuite.constants.AVAIL_STATUS_NOT_AVAILABLE) && (this.getPrice() > 0 || this.isPromoPrice())) {
							// enable add to cart button
							this.enableA2CButton();
							//jQuery(this).trigger("AddtoCartEnabled");
						}
						else {
							this.disableA2CButton();
							//jQuery(this).trigger("AddtoCartDisabled");
						}
					}
					else {
						if (isLoadingVar) {
						// update availability
							//setAvailabilityMsg(CSSuite.showProgress("productloader"));
						}
						else {
							//setAvailabilityMsg(CSSuite.resources["NON_SELECTED"]);
						}
						// disable add to cart button
						this.disableA2CButton();
						//jQuery(this).trigger("AddtoCartDisabled");
					}
					
					var nonSelectedVars = [];
					var validVariants = null;
					
					for (var selectedVar in this.selectedVarAttribs) {
						if (this.selectedVarAttribs[selectedVar]) {
							validVariants = this.findVariations({id: selectedVar, val: this.selectedVarAttribs[selectedVar]}, validVariants);
						}						
					}
						
					// update selected var attr vals and refresh their display
					jQuery.each(model.variations.attributes, function(){
						thisProduct.showSelectedVarAttrVal(this.id, thisProduct.selectedVarAttribs[this.id]);
						
						if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == "" ) {
							nonSelectedVars.push(this.name);
							
							thisProduct.varAttrDisplayHandler(this.id, validVariants);
						}
					});
					
					// process non-selected vals and show updated tooltip for A2C button as a reminder
					// and show it along availability 
					var tooltipStr = '';
					var nsLen = nonSelectedVars.length;
					if (nsLen == 1 || nsLen == 2) {					
						tooltipStr = nonSelectedVars.join(" & ");
					}
					else {
						for (var i=0; i < nsLen; i++) {
							if (i == nsLen - 2) {
								tooltipStr += nonSelectedVars[i] + " & " + nonSelectedVars[i+1];
								break;
							}
							else {
								tooltipStr += nonSelectedVars[i] + ", ";
							} 
						}
					}					
					var selectionErrorMessageContainer = $(this.containerId).parent('div').find('div.selection-error-message');
					
					if (nonSelectedVars.length > 0) {
						var availMsg = jQuery.format(CSSuite.resources["MISSING_VAL"], tooltipStr);
						setAvailabilityMsg(availMsg);
						selectionErrorMessageContainer.html(availMsg).show();
					} else {
						selectionErrorMessageContainer.hide();
					}					
				},

				/**
				 * renders pricing div given a sale price and optional standard price
				 * To format the price display, it goes to server via an ajax call.
				 * 
				 * @param sale - sale price 
				 * @param standard - standard price
				 */
				showUpdatedPrice: function(sale, standard) {
					var standardPrice 	= Number(standard || 0);					
					var salePrice 		= Number(sale || 0);
					var priceHtml 		= "";
					var formattedPrices = {"salePrice": salePrice, "standardPrice": standardPrice};
					
					// send server request to format the money baed on site settings using Money api
					CSSuite.ajax.getJson({
						url		: CSSuite.URLs.formatMoney,
						cache	: true,
						async	: false,
						data	: {"salePrice": salePrice, "standardPrice": standardPrice},
						callback: function(data){
							formattedPrices = data;
						}
					});
					
					// in case it is a promotional price then we do not care if it is 0
					priceHtml = (salePrice > 0 || this.isPromoPrice()) ? '<div class="salesprice">' + formattedPrices.salePrice + '</div>' : ' <div class="salesprice">N/A</div>';
					
					if (standardPrice > 0 && standardPrice > salePrice) {
						// show both prices
						priceHtml = '<div class="standardprice">' + formattedPrices.standardPrice + ' </div>' + priceHtml;						
					}					
					
					jQuery(this.containerId+" .productinfo .price:first").html(priceHtml);
					// containerId contains #, get rid of it before finding the right price div
					jQuery(this.containerId+" #pdpATCDiv"+this.containerId.substring(1)+" .price").html(priceHtml);
				},
				
				/**
				 * returns a computed price for this product
				 */				
				getPrice: function() {
					return computePrice(this);
				},
				
				/**
				 * Determines if the selected product has promotional price.
				 * 			 * 
				 * @return boolean true if promotional price is present otherwise false
				 */
				isPromoPrice: function() {
					return (this.selectedVar != null ? this.selectedVar.pricing.isPromoPrice : model.pricing.isPromoPrice);
				},
				
				/**
				 * receives 2 or 1 variation attribute values and tries to figure out if there is a variant with these values.
				 * 
				 * @param val1 - variation attribute value
				 * @param val2 - variation attribute value
				 * @return boolean - true if a variant exists otherwise false
				 */
				isVariation: function(val1, val2) {
					var variant = null;

					for (var i=0; i<model.variations.variants.length; i++) {
						variant = model.variations.variants[i];
						if (variant.attributes[val1.id] == val1.val && (val2 == undefined || variant.attributes[val2.id] == val2.val)) {
							return true;
						}
					}
					/*
					 * apparently there is no way to break out of jQuery.each half way :(
					jQuery.each(model.variations.variants, function(){
						if (!found && this.attributes[val1.id] == val1.val && this.attributes[val2.id] == val2.val) {
							found = true;
							return;
						}
					});*/
					return false;
				},
				
				/*
				* find 0 or more variants matching the given attribs object(s)
				* return null or found variants
				*/
				findVariations: function(attr, variants) {
					var foundVariants = new Array();
					variants = variants || model.variations.variants;
					
					var variant = null;
					for (var i=0; i<variants.length; i++) {
						variant = variants[i];
						if (variant.attributes[attr.id] === attr.val) {
							foundVariants.push(variant);
						}
					}
					
					return foundVariants;
				},
				
				/*
				* find a variant with the given attribs object
				* return null or found variation json
				*/
				findVariation: function(attrs) {
					if (!this.checkAttrs(attrs)) {
						return null;
					}

					var attrToStr = function(attrObj) {
						var result = "";
						jQuery.each(model.variations.attributes, function(){
							result += attrObj[this.id];
						});
						return result;
					}

					var attrsStr = attrToStr(attrs);

					for (var i=0; i<model.variations.variants.length; i++) {
						variant = model.variations.variants[i];
						if (attrToStr(variant.attributes) === attrsStr) {
							return variant;
						}
					}
					return null;
				},
				
				// find a variation with the give id otherwise empty object
				findVariationById: function(id) {

					for (var i=0; i<model.variations.variants.length; i++) {
					// IE7 does NOT support this!!!
					//for each(var variation in model.variations.variants) {
						var variation = model.variations.variants[i];
						if (variation && variation.id === id) {
							return variation;
						}
					}

					return {};
				},

				/*
				* see if the specified attrs object has all the variation attributes present in it
				* return true/false
				*/
				checkAttrs: function(attrs) {
					for (var i=0; i<model.variations.attributes.length; i++) {
						if (attrs[model.variations.attributes[i].id] == null) {
							return false;
						}
					}
					return true;
				},
				
				// given an id, return attr definition from model.variations.attributes
				getAttrByID: function(id) {
					for (var i=0; i<model.variations.attributes.length; i++) {
						if (model.variations.attributes[i].id === id) {
							return model.variations.attributes[i];
						}
					}
					return {};
				},
				
				// returns current availability status e.g. in_stock, preorder etc.
				getAvStatus: function() {
					if ((this.variant || this.master) && this.selectedVar != null) {
						return this.selectedVar.avStatus;
					}
					else {
						return model.avStatus;
					}
				},
				
				// return available to sell qty
				getATS: function() {
					if ((this.variant || this.master) && this.selectedVar != null) {
						return this.selectedVar.ATS;
					}
					else {
						return model.ATS;
					}
				},
				
				// returns in stock date 
				getInStockDate: function() {
					if ((this.variant || this.master) && this.selectedVar != null) {
						return this.selectedVar.inStockDate;
					}
					else {
						return model.inStockDate;
					}
				},
				
				// determine if A2C button is enabled or disabled
				// true if enabled, false otherwise
				isA2CEnabled: function() {
					if (this.variant || this.master) {
						if (this.selectedVar != null) {
							return this.selectedVar.avStatus === CSSuite.constants.AVAIL_STATUS_IN_STOCK;
						}
						else {
							return false;
						}
					}
					else {
						return model.avStatus === CSSuite.constants.AVAIL_STATUS_IN_STOCK;;
					}
				},

				/**
				 * work horse of the product detail page getting everything tied together i.e. all the dynamic stuff
				 * and one time initialization. called only ONCE
				 * bind all the product display events and handlers
				 * load variants in case this is a variation product
				 * bind subproducts a2c button enable event handler
				 * 
				 * @param options.cotainerId - id of the containing div
				 * @param options.source - source of this product show request, mainly quickview
				 */
				show: function(options) {
					// preserve this instance
					var thisProduct = this;

					// bind VariationsLoaded which gets fired when the variation data is received from the server
					jQuery(this).bind("VariationsLoaded", {}, function(e, source){
						// if this product instance is a variant then try to find its corresponding json based on the current attribute values 
						if (thisProduct.variant && thisProduct.selectedVar == null) {							
							thisProduct.selectedVar = thisProduct.findVariation(thisProduct.selectedVarAttribs);							
						}
						// enable/disable unavailable values
						if (source && source == "loadVariants") {
							thisProduct.resetVariations();
						}
						thisProduct.refreshView();
					});

					this.containerId 	= ".productInformation";					
					var isQuickView 	= false;

					myContainerId = this.containerId;
					
					// variation attributes handling in case it is a master or a variant product
					if (model.master || model.variant) {
						loadVariants(this); // make a server call to load the variants, this is due to the performance reasons
						// meanwhile display the available variation attributes
						
						// loop thru all the swatches and bind events etc.
						jQuery(thisProduct.containerId + " .variationattributes .swatches").each(function(){
							var thisSwatch 	= jQuery(this);
							var pdpVarId 	= thisSwatch.data("data"); // data is id which is set via CSSuite.hiddenData onload
							var attrDef 	= thisProduct.getAttrByID(pdpVarId);
							
							if (!attrDef) {
								return;
							}
							
							// grab the currently selected attr val																
							thisProduct.selectedVarAttribs[pdpVarId] =  thisSwatch.find(".selected a").html();
							
							// click handler for swatches links
							var varEventHandler = function(e){
								var thisObj = jQuery(this);
								
								e.data = {id: pdpVarId, val: this.innerHTML};

								if (thisObj.parent().hasClass("unselectable")) {
									return false;
								}
								else if (thisObj.parent().hasClass("selected")) {
									// deselection
									e.data = {id: pdpVarId, val: null};
									thisObj.parent().removeClass("selected");
									// clear the current selection
									thisProduct.resetVariations();
									thisProduct.varAttrSelected(e);
								}
								else {
									// selection
									e.data = {id: pdpVarId, val: this.innerHTML};
									// remove the current selection										
									thisSwatch.find(".selected").removeClass("selected");										
									thisObj.parent().addClass("selected");
									thisProduct.varAttrSelected(e);
								}																
								
								return false;
							}
							
							// all swtach anchors
							var varJqryObjs = thisSwatch.find("a.swatchanchor");
							// if its a color attr then render its swatches and images
							if (pdpVarId === "color") {
								var colorAttrDef = thisProduct.getAttrByID('color');
								
								varJqryObjs.each(function(){
								
									// given a variation attr value, find its swatch image url
									var findSwatch = function(val) {
										for (var i=0; i<colorAttrDef.vals.length; i++){
											if (colorAttrDef.vals[i].val === val) {													
												return colorAttrDef.vals[i].images.swatch;
											}
										}
										return ""; // no swatch image found
									}
									
									var swatchUrl = findSwatch(this.innerHTML); // find swatch url
									
									if (swatchUrl && swatchUrl != "") {
										jQuery(this).css("color", "transparent").parent().css("background", "url(" + swatchUrl + ")");
									}
									else {
										jQuery(this).css("color", "transparent"); // no swatch image found
									}
								});
								
								// swatches click, hover and mouseleave event handlers
								varJqryObjs.data("data", {id: pdpVarId}).click(varEventHandler)
								.hover(function(e){
									thisProduct.showSelectedVarAttrVal("color", this.innerHTML);										
									thisProduct.showImages(this.innerHTML, colorAttrDef.vals)
								}).mouseleave(function(e) {
									if (thisProduct.selectedVarAttribs["color"]) {
										thisProduct.showImages(thisProduct.selectedVarAttribs["color"], colorAttrDef.vals)
									}
									else {
										thisProduct.showImages("", [{val: "", images: model.images}]);
									}
									
									thisProduct.showSelectedVarAttrVal("color", thisProduct.selectedVarAttribs["color"] || "");
								});
							}
							else {								
								// not a color swatch, we only have click handler for this type of variation attribute e.g. width, length etc.
								varJqryObjs.data("data", {id: pdpVarId}).click(varEventHandler);
							}
						});
						
						// loop thru all the non-swatches attributes and bind events etc.
						jQuery(thisProduct.containerId + " .variationattributes .variantdropdown select").each(function(){							
							var ele = jQuery(this);
							var data = ele.data("data"); // data is id
							if (ele[0].selectedIndex >= 0 && ele[0].options[ele[0].selectedIndex].value != "") {
								// grab the currently selected val
								thisProduct.selectedVarAttribs[data] = ele[0].options[ele[0].selectedIndex].value;
							}
							// default ui i.e. drop down
							ele.data("data", {id: data, val: ''}).change(function(e){
									if (this.selectedIndex == 0 && this.options.length == 1) { return; }

									e.data = jQuery(this).data("data");
									// this.selectedIndex == 0, it is deselection
									e.data.val = (this.selectedIndex == 0) ? null: this.options[this.selectedIndex].value;
									
									if (this.selectedIndex == 0) {
										// deselection
										// clear the current selection
										thisProduct.resetVariations();
									}
									
									thisProduct.varAttrSelected(e);
								});
						});
						
						if (thisProduct.selectedVarAttribs["color"]) {
							// show swatch related images for the current value								
							thisProduct.showImages(thisProduct.selectedVarAttribs["color"], thisProduct.getAttrByID('color').vals);
						}
						else {
							// show images and bind hover event handlers for small/thumbnails to toggle large image								
							thisProduct.showImages("", [{val: "", images: model.images}]);
						}
					}
					else {
						// show images and bind hover event handlers for small/thumbnails to toggle large image								
						thisProduct.showImages("", [{val: "", images: model.images}]);
					}
					
					if(!model.productSet) {
						// quantity box
						if (!model.bundle) {
							getQtyBox(this);
						}// update avaiability for a bundle product, for everything else its done inside getQtyBox
						else if (model.bundle) {
							setAvailabilityMsg(createAvMessage(this, 1));
						}
					}

					// intial display of A2C button
					// if the price is 0 or not available, its disabled
					// if not in stock, its disabled
					// isPromoPrice would be true in case if a product has a promotional price which could make product's price 0
					if (!(this.getPrice() > 0 || this.isPromoPrice()) || 
						model.master || model.variant || model.productSet || model.bundle || 
						(!model.inStock && model.avStatus === CSSuite.constants.AVAIL_STATUS_NOT_AVAILABLE && !model.productSet)) {						
						this.disableA2CButton();
					}
						
					// if the bundled products are standard products then determine disability of the a2c button by checking each product's availability
					if (model.bundle) {
						
						var bundleA2CEnabled = false;
						for (var i = 0; i < thisProduct.subProducts.length; i++) {
							var subProduct = thisProduct.subProducts[i];
							bundleA2CEnabled = subProduct.isA2CEnabled();
							if (!bundleA2CEnabled) {
								break;
							}
						}
						// if any of the bundled product has its A2C button disabled then the bundle is not orderable
						if (!bundleA2CEnabled) {							
							this.disableA2CButton();
						} 
						else {							
							this.enableA2CButton();
						}
					}						

					// customer rating section only displayed for the main product
					if (!model.productSetProduct && !model.bundled) {
						if (!model.productSet && !isQuickView && !model.bundle) {							
							getRatingSection(this.containerId);							
						}
					}
					
					// wish list, sent to friend, add to gift
					getMiscLinks(this);
							
					// see if have any sub-products and bind AddtoCartEnabled event
					jQuery.each(thisProduct.subProducts, function(){
						jQuery(this).bind("AddtoCartEnabled", {},
							/**
							* Event handler when a subproduct of a product set or a bundle is selected.
							* Basically enable the add to cart button or do other screen refresh if needed like price etc.
							*/
							function() {
								// enable Add to cart button if all the sub products have been selected
								// and show the updated price
								var enableAddToCart = true;
								var subProducts = thisProduct.subProducts;
								var price = new Number();

								for (var i = 0; i < subProducts.length; i++) {
									if (((subProducts[i].variant || subProducts[i].master) && subProducts[i].selectedVar == null) ||
										(!subProducts[i].bundled && (subProducts[i].selectedOptions["Quantity"] == undefined ||
										subProducts[i].selectedOptions["Quantity"] <= 0))) {
										enableAddToCart = false;
										break
									}
									else {
										if (subProducts[i].selectedVar != null) {
											subProducts[i].selectedOptions.pid = subProducts[i].selectedVar.pid;
										}
										else {
											subProducts[i].selectedOptions.pid = subProducts[i].pid;
										}

										price = price + new Number(subProducts[i].getPrice());
									}
								}

								if (enableAddToCart && (model.productSet || model.inStock) && (price > 0 || thisProduct.isPromoPrice())) {
									thisProduct.enableA2CButton();
									// show total price except for a bundle
									/*if (!model.bundle) {
										thisProduct.showUpdatedPrice(price);
									}*/
								}
								else {
									thisProduct.disableA2CButton();
								}
							}
						);
					});
				},

				toString: function() {
					return this.model;
				}
			}
		} // Product defintion end
	}
	else {
		// dw namespace has not been defined yet i.e. app object is unavailable
		alert("app is undefined!");
	}
})(CSSuite);