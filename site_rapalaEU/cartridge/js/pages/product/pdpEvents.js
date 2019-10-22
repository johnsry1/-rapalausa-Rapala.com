'use strict';
var util = require('../../util'),
    dialog = require('../../dialog'),
//tooltip = require('../../tooltip'),
//uievents = require('../../uievents'),
//quickview = require('../../quickview'),
    addToCart = require('./addToCart'),
    progress = require('../../progress'),
    imagesLoaded = require('imagesloaded'),
    ajax = require('../../ajax');

var product = function (response) {
    // product private data

    // product json data
    var model = response;

    // div cotainer id
    var myContainerId = '';

    // boolean flag to track the variants data request, reset in loadVariants() when the variants data is loaded
    var isLoadingVar = false;

    // helper function to load variants data from the server
    // once the data is retrieved, it fires VariationsLoaded event so that UI can be refreshed appropriately
    var loadVariants = function (thisProduct) {
        isLoadingVar = true;
        // build the url and load variants data
        ajax.getJson({
            url: Urls.getVariants,
            data: {'pid': thisProduct.pid, 'format': 'json'},
            callback: function (data) {

                if (!data || !data.variations || !data.variations.variants) {
                    return;
                }
                model.variations.variants = data.variations.variants;
                isLoadingVar = false; // we have loaded the variants
                jQuery(thisProduct).trigger('VariationsLoaded');
            }
        });
    };

    // helper function to reload availability data.
    // by default, availability data is based on a quantity of 1.
    // if a customer changes the quantity, use this method
    // to reload the availability based on the new quantity.
    var reloadAvailability = function (thisProduct, quantity) {

        var id = '';
        if (thisProduct.master || thisProduct.variant) {
            id = thisProduct.selectedVar.id;
        } else {
            id = thisProduct.pid;
        }

        ajax.getJson({
            url: Urls.getAvailability,
            data: {'pid': id, 'Quantity': quantity, 'format': 'json'},
            callback: function (data) {

                if (!data || !data.levels) {
                    return;
                }

                // update the data in the variant
                if ((thisProduct.master || thisProduct.variant) && thisProduct.selectedVar) {
                    thisProduct.selectedVar.avLevels = data.levels;
                    thisProduct.selectedVar.avStatus = data.status;
                    thisProduct.selectedVar.avStatusQuantity = data.statusQuantity;
                } else {
                    model.avLevels = data.levels;
                    model.avStatus = data.status;
                    model.avStatusQuantity = data.status;
                }
                jQuery(thisProduct).trigger('ReloadAvailability');
            }
        });

    };
    // returns the aggregate available to sell value
    // from all variants
    var getATS = function (variants) {

        var atsCount = 0;
        var variant;
        for (var i = 0; i < variants.length; i++) {
            variant = variants[i];
            if (variant.ATS > 0) {
                atsCount = atsCount + variant.ATS;
            }
        }
        return atsCount;
    };

    // returns the aggregate available to sell value
    // from all variants
    var getAvailability = function (variants) {

        var available = false;
        var variant;
        for (var i = 0; i < variants.length; i++) {
            variant = variants[i];
            if (variant.avStatus !== 'NOT_AVAILABLE') {
                available = true;
                break;
            }
        }
        return available;
    };

    // helper function to bind product options drop downs event handlers
    // Intializes the product.selectedOptions object with the currently selected options
    // it also shows the computed/updated price
    var getOptionsDiv = function (thisProduct) {

        if (model.isOption) {

            var pdpOpt = jQuery(thisProduct.containerId + ' .product_options:last select');

            pdpOpt.change(function () {
                var vals = this.options[this.selectedIndex].value.split('%?%'); // 0 = value, 1 = price
                thisProduct.selectedOptions[this.id] = vals[0];
                thisProduct.selectedPrice[this.id] = vals[1];
                thisProduct.showUpdatedPrice(computePrice(thisProduct), model.pricing.standard);
            });

            // let us get the currently selected value and intilize the ui
            pdpOpt.each(function () {
                var vals = this.options[this.selectedIndex].value.split('%?%'); // 0 = value, 1 = price

                thisProduct.selectedOptions[this.id] = vals[0];
                thisProduct.selectedPrice[this.id] = vals[1];
                thisProduct.showUpdatedPrice(computePrice(thisProduct), model.pricing.standard);
            });
        }
    };

    // binds A2C button click handler
    var getAddToCartBtn = function (thisProduct) {
        var addToCartBtn = jQuery(thisProduct.containerId + ' .addtocartbutton:last').click(function () {
            if (model.master || model.variant) {
                if (thisProduct.selectedVar == null) {
                    return false;
                }

                // it is necessary to update the option id to be variant-specific
                jQuery(thisProduct.containerId + ' .product_options:last select').each(function () {
                    var value = thisProduct.selectedOptions[this.id];
                    var newId = this.id.replace(thisProduct.pid, thisProduct.selectedVar.id);
                    thisProduct.selectedOptions[newId] = value;
                    delete thisProduct.selectedOptions[this.id];
                });

                thisProduct.selectedOptions.pid = thisProduct.selectedVar.id;
                thisProduct.selectedOptions.masterPid = thisProduct.pid;
            } else {
                var tempQty = '';
                // check if we are adding a bundle/productset to the cart
                if (model.bundle || model.productSet) {
                    var subProducts = thisProduct.subProducts;
                    var comma = ',';
                    var subproduct = null;

                    thisProduct.selectedOptions.childPids = '';

                    if (model.productSet) {
                        thisProduct.selectedOptions.Quantity = '';
                    }

                    // process each individual products in the set/bundle
                    // and prepare product.selectedOptions for final submission
                    for (var i = 0; i < subProducts.length; i++) {
                        subproduct = subProducts[i];

                        if (i == subProducts.length - 1) {
                            comma = ''; // at the end of the list
                        }

                        // see if any of the sub products are variations, if so then get the selected variation id
                        // from selectedVar property and make it a comma separated list
                        if ((subproduct.variant || subproduct.master) && subproduct.selectedVar == null)
                            return false;
                        if (subproduct.variant || subproduct.master) {
                            thisProduct.selectedOptions.childPids += subproduct.selectedVar.id + comma;
                        } else {
                            thisProduct.selectedOptions.childPids += subproduct.pid + comma;
                        }

                        var tempPid = subproduct.selectedOptions.pid;
                        subproduct.selectedOptions.pid = null;
                        // merge selected options of sub product with the main product
                        thisProduct.selectedOptions = jQuery.extend({}, thisProduct.selectedOptions, subproduct.selectedOptions);
                        subproduct.selectedOptions.pid = tempPid;

                        // if it is a product set then sub products can have their separate qty
                        if (model.productSet) {
                            tempQty += subproduct.selectedOptions.Quantity + comma;
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
            } else if (!model.productSet) {
                // grab the user entered qty
                thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId + ' .quantityinput:last').val();

            }

            // if it is not a productset then make sure qty is specified greater than 0
            if (model.productSet || thisProduct.selectedOptions.Quantity > 0) {
                // disable a2c button
                addToCartBtn.prop('disabled', true);

                // find if there is a handler bound to AddToCart event e.g. cart -> edit details or wishlist -> edit details etc.
                // then fire it otherewise call addToCart.add to add the selected product to the cart and show minicart
                /*eslint-disable */
                var event = jQuery.Event('AddToCart');
                /*eslint-enable */
                event.selectedOptions = thisProduct.selectedOptions;

                if (jQuery.event.global.AddToCart == undefined || jQuery.event.global.AddToCart == null) {
                    addToCart.add('', thisProduct.selectedOptions, function () {
                        addToCartBtn.prop('disabled', false);
                    });
                } else {
                    jQuery(document).trigger(event)
                }
            }
            return false;
        });

        return addToCartBtn;
    };

    // bind qty box keyup handler
    // the handler grabs the value and updates
    // product.selectedOption.Quantity
    // show the updated availabilty message in case the available qty is different than available etc.
    // trigger AddtoCartEnabled event
    var getQtyBox = function (thisProduct) {

        jQuery(thisProduct.containerId + ' .quantityinput:last').keyup(function () {
            var val = null;
            try {
                val = parseInt(jQuery(thisProduct.containerId + ' .quantityinput:last').val(), 10);
            } catch (e) {
                val = null;
            }

            if (val) {
                thisProduct.selectedOptions.Quantity = val;

                // if the product has variations check for non selected ones and display missing value
                if (model.variations != undefined) {
                    var nonSelectedVars = [];

                    // get the non-selected variations
                    jQuery.each(model.variations.attributes, function () {
                        if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == '') {
                            nonSelectedVars.push(this.name);
                        }
                    });

                    if (nonSelectedVars.length > 0) {

                        // make sure there is something to sell
                        var atsCount = getATS(model.variations.variants);
                        if (atsCount == 0) {
                            return;
                        }

                        var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
                        var missingMsg = $.validator.format(Resources.MISSING_VAL, tooltipStr);
                        setAvailabilityMsg(missingMsg);
                        return;
                    }
                }

                // If the quantity value is different than
                // when we loaded the availability data, then
                // refresh availability data for this variant
                if (val != thisProduct.getAvailabilityQty()) {
                    reloadAvailability(thisProduct, val);
                }
                //JCK: this isn't being run AFTER AJAX?
                //setAvailabilityMsg(createAvMessage(thisProduct, val));
                //jQuery(thisProduct).trigger("AddtoCartEnabled");
            }
        });

        // grab the currently displayed value basically the initial displayed value
        thisProduct.selectedOptions.Quantity = jQuery(thisProduct.containerId + ' .quantityinput:last').val();

        if (!isLoadingVar) {
            // show proper availability message
            setAvailabilityMsg(createAvMessage(thisProduct, thisProduct.selectedOptions.Quantity));
        }
    };

    // create product tabs i.e. description, Attributes, Reviews etc.
    // it depends on jQuery to create tab display.
    // also bind tab print button click handler
    var getTabs = function (containerId) {

        var tabsDiv = jQuery(containerId + ' #tabs');
        tabsDiv.tabs();

        // tab print handler
        jQuery('a.printpage').click(function () {
            window.print();
            return false;
        });
    };

    // register initializations here
    //show and hide handling of specific country.
    if (typeof geoipCountryCode == 'function') {
        var IPGeoCode = geoipCountryCode();
        var allowedCountries = $('.allowed-countries').text();
        if (allowedCountries == null || allowedCountries == 'null' || allowedCountries == 'undefined') {
            allowedCountries = 'US';
        }
        if (allowedCountries.indexOf(IPGeoCode) == -1) {
            $('.addtowishlist').addClass('hide');
        }
    }

    // bind addtowishlist, giftregistry, send to friend click handlers
    // bind handlers to AddtoCartDisabled, AddtoCartEnabled events for disabling/enabling wishlist/gift registry links
    var getMiscLinks = function (thisProduct) {

        var disablelinks = function () {
            if ((model.master || model.variant) && thisProduct.selectedVar == null) {
                // disable wishlist/gift registry links for master products
                jQuery(thisProduct.containerId + ' .addtowishlist, ' + thisProduct.containerId + ' .addtoregistry').addClass('unselectable');
            }
        };

        disablelinks(); // call it for initial display and then register it with AddtoCartDisabled event

        jQuery(thisProduct).bind('AddtoCartDisabled', {}, disablelinks);

        jQuery(thisProduct).bind('AddtoCartEnabled', {}, function () {
            // enable wishlist/gift registry links for variant products
            jQuery(thisProduct.containerId + ' .addtowishlist, ' + thisProduct.containerId + ' .addtoregistry').removeClass('unselectable');
        });

        // listen for availability reload events
        jQuery(thisProduct).bind('ReloadAvailability', {}, function (e) {
            // update the availability message
            var variant = e.target.selectedVar;
            setAvailabilityMsg(createAvMessage(e.target, (variant == null ? model.avStatusQuantity : variant.avStatusQuantity)));
            jQuery(e.target).trigger('AddtoCartEnabled');

        });

        // Add to wishlist, Add to gift registry click handler

        jQuery(thisProduct.containerId + ' .addtowishlist a.auth').click(function () {
            // append the currently selectied options to the url

            // create a local copy of the selected options
            var selectedOptions = jQuery.extend({}, {}, thisProduct.selectedOptions);

            if (model.master || model.variant) {
                if (thisProduct.selectedVar != null) {
                    selectedOptions.pid = thisProduct.selectedVar.id;
                } else {
                    return false; // do not allow master product to be added to gift registry/wishlist
                }
            } else {
                selectedOptions.pid = thisProduct.pid;
            }

            var tempUrl = this.href;

            if (!(tempUrl.indexOf('?') > 0)) {
                tempUrl = tempUrl + '?';
            } else {
                tempUrl = tempUrl + '&';
            }
            // serialize the name/value into url query string and append it to the url, make request
            var url = tempUrl + jQuery.param(selectedOptions);
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'html',
                success: function () {
                    jQuery('#pdpMain .addtowishlist .addtowish-tooltip').fadeIn(400).delay(1500).fadeOut(400);
                },
                failure: function () {
                    alert('${Resource.msg(\'global.serverconnection\',\'locale\',null)}');
                }
            });
            setTimeout(function () {
                $('.ui-dialog-titlebar-close').trigger('click');
            }, 1500);
            //window.location = tempUrl + jQuery.param(selectedOptions);
            return false;
        });

        // Add to wishlist, Add to gift registry click handler
        jQuery(thisProduct.containerId + ' .addtowishlist a.non-auth, ' + thisProduct.containerId + ' .addtoregistry a').click(function () {
            // append the currently selectied options to the url

            // create a local copy of the selected options
            var selectedOptions = jQuery.extend({}, {}, thisProduct.selectedOptions);

            if (model.master || model.variant) {
                if (thisProduct.selectedVar != null) {
                    selectedOptions.pid = thisProduct.selectedVar.id;
                } else {
                    return false; // do not allow master product to be added to gift registry/wishlist
                }
            } else {
                selectedOptions.pid = thisProduct.pid;
            }

            var tempUrl = this.href;

            if (!(tempUrl.indexOf('?') > 0)) {
                tempUrl = tempUrl + '?';
            } else {
                tempUrl = tempUrl + '&';
            }
            // serialize the name/value into url query string and append it to the url, make request
            //var url = tempUrl + jQuery.param(selectedOptions);
            window.location = tempUrl + jQuery.param(selectedOptions);
            return false;
        });

        jQuery(thisProduct.containerId + ' .sendtofriend').click(function () {
            // create a local copy of the selected options
            var selectedOptions = jQuery.extend({}, {}, thisProduct.selectedOptions);

            if ((model.master || model.variant) && thisProduct.selectedVar != null) {
                selectedOptions.pid = thisProduct.selectedVar.id;
            } else {
                selectedOptions.pid = thisProduct.pid;
            }
            var tempURL = Urls.sendToFriend + '?' + jQuery.param(selectedOptions);
            dialog.open(tempURL, Resources.SEND_TO_FRIEND);
            return false;
        });
    };

    // binds product reviews click handlers
    // read review link opens reviews tab
    var getRatingSection = function (containerId) {

        jQuery(containerId + ' #pdpReadReview').click(function () {
            jQuery(containerId + ' #tabs').tabs('select', 'pdpReviewsTab');
        });

        jQuery(containerId + ' #pdpWriteReview').click(function () {
        });
    };

    // based on availability status, creates a message
    // param val - the stock value to compare i.e. qty entered by user
    var createAvMessage = function (thisProduct, val) {

        var avStatus = thisProduct.getAvStatus(); // availability status
        var avMessage = Resources[avStatus];
        var ats = thisProduct.getATS(); // get available to sell qty
        var avLevels = thisProduct.getAvLevels();
        var nonCloseoutLowQtyThreshold = thisProduct.getNonCloseoutLowQtyThreshold();

        // get ats levels per-status
        var inStockLevel = avLevels[Constants.AVAIL_STATUS_IN_STOCK];
        var backOrderLevel = avLevels[Constants.AVAIL_STATUS_BACKORDER];
        var preOrderLevel = avLevels[Constants.AVAIL_STATUS_PREORDER];
        //var notAvailLevel = avLevels[Constants.AVAIL_STATUS_NOT_AVAILABLE];

        if (avStatus === Constants.AVAIL_STATUS_IN_STOCK) {
            avMessage = '<span class=\'in-stock\'><link itemprop="availability" href="http://schema.org/InStock">' + avMessage + '</span>';
        }
        if (avStatus === 'NOT_AVAILABLE') {
            avMessage = '<span class=\'out-of-stock\'><link itemprop="availability" href="http://schema.org/OutOfStock">' + avMessage + '</span>';
        }
        if (avStatus === Constants.AVAIL_STATUS_BACKORDER ||
            avStatus === Constants.AVAIL_STATUS_PREORDER) {
            if (val > ats && ats > 0) {
                avMessage = avMessage + '<span class=\'in-stock\'>' + $.validator.format(Resources['QTY_' + avStatus], ats) + '</span>';
            }
            // display backorder/preorder availability
            avMessage = avMessage + getInStockDateMsg(thisProduct);
        } else if (val > inStockLevel && avStatus !== Constants.AVAIL_STATUS_NOT_AVAILABLE) {

            avMessage = '';
            if (inStockLevel > 0) {
                avMessage = avMessage + '<span class=\'in-stock\'>' + $.validator.format(Resources['QTY_' + Constants.AVAIL_STATUS_IN_STOCK], inStockLevel) + '</span>';
            }
            if (backOrderLevel > 0) {
                avMessage = avMessage + $.validator.format(Resources['QTY_' + Constants.AVAIL_STATUS_BACKORDER], backOrderLevel);
                // uncomment the following line to display availability message with back order information
                // avMessage = avMessage + getInStockDateMsg(thisProduct);
            }
            if (preOrderLevel > 0) {
                avMessage = avMessage + $.validator.format(Resources['QTY_' + Constants.AVAIL_STATUS_PREORDER], preOrderLevel);
                // uncomment the following line to display availability message with back order information
                // avMessage = avMessage + getInStockDateMsg(thisProduct);
            }
        } else if (ats !== 0 && ats <= nonCloseoutLowQtyThreshold) {
            avMessage = '<span class=\'low\'>' + $.validator.format(Resources.LOW, nonCloseoutLowQtyThreshold) + '</span>';
        }
        var standardPrice = thisProduct.selectedVar != null ? Number(thisProduct.selectedVar.pricing.standard || 0) : Number(model.pricing.standard || 0);

        var salePrice = Number(computePrice(thisProduct) || 0);

        if (standardPrice === 0 && salePrice === 0) {
            if (thisProduct.selectedVar != null) {
                if (thisProduct.selectedVar.earlyBirdMessage != '') {
                    avMessage = '<span class=\'coming-soon\'>' + thisProduct.selectedVar.earlyBirdMessage + '</span>';
                } else {
                    avMessage = '';
                }
            } else {
                if ($('.ebm-std-prod').length > 0 && $.trim($('.ebm-std-prod').text()) != '') {
                    avMessage = '<span class=\'coming-soon\'>' + $('.ebm-std-prod').text() + '</span>';
                } else {
                    avMessage = '';
                }
            }
        }
        return avMessage;
    };

    // helper function that returns the in-stock date
    var getInStockDateMsg = function (product) {
        var msg = '';
        if (product.getInStockDate() && product.getInStockDate() != 'null') {
            msg = $.validator.format(Resources.IN_STOCK_DATE, (new Date(product.getInStockDate())).toDateString());
        }
        return msg;
    };

    // helper function to set availability message
    var setAvailabilityMsg = function (msg) {
        jQuery(myContainerId + ' .availability:last .value').html(msg);
    };

    /**
     * Private. Computes price of a given product instance based on the selected options.
     *
     * @param thisProduct - the product instance
     * @return price of the product to 2 decimal points.
     */
    var computePrice = function (thisProduct) {

        var price = thisProduct.selectedVar != null ? thisProduct.selectedVar.pricing.sale : model.pricing.sale;
        // calculate price based on the selected options prices
        jQuery.each(thisProduct.selectedPrice, function () {
            price = (new Number(price) + new Number(this)).toFixed(2);
        });

        return price;
    };
    // Load the youtube videos only on demand
    // when the user clicks on the videos tab, then the youtube videos will be fetched dynamically
    // and loads the content in the pdpVideoTab div.
    jQuery('.videoTab').click(function () {
        if ($(this).hasClass('loaded')) {
            return false;
        }
        $(this).addClass('loaded');
        var target = $('#pdpVideoTab');
        var url = $('#productURL').val();
        ajax.load({
            url: url,
            dataType: 'html',
            callback: function (data) {
                target.html(data);
            }
        });
    });
    // bind click handlers for prev/next buttons on pdp from search
    var getNavLinks = function () {

        // NOTE:  WE COMMENT THIS OUT BECAUSE POWER REVIEWS RENDERING LIBRARY DOES NOT
        // WORK IN SOME BROWSERS WHEN A PRODUCT DETAIL PAGE IS PARTIALLY RELOADED USING AJAX.
        // IF WE DO NOT BIND EVENTS, THEN THE PREV/NEXT ANCHORS JUST WORK AS STANDARD
        // HYPERLINKS AND POWERREVIEWS WORKS FINE.

        // bind events
        //jQuery(".productnavigation a").click(function(e) {
        //	app.getProduct({url: this.href, source: "search"});
        //	return false;
        //});
    };

    // size chart link click binding
    var getSizeChart = function () {
        jQuery('.attributecontentlink').click(function () {
            // add size chart dialog container div if its not added yet
            // only added once
            if (jQuery('#sizeChartDialog').length == 0) {
                jQuery('<div/>').attr('id', 'sizeChartDialog').appendTo(document.body);
            }

            var sizeChartDialog = dialog.create({
                id: 'sizeChartDialog', options: {
                    height: 530,
                    width: 800,
                    title: Resources.SIZECHART_TITLE
                }
            });

            sizeChartDialog.dialog('open');

            // make the server call to load the size chart html
            $('#sizeChartDialog').load(this.href);

            return false;
        });

        $('.product-specifications').ready(function () {
            $('.product-specifications').load(jQuery('.attributecontentlink').attr('href'));
        });
    };
    // build the tooltip string for non selected variations
    var getNonSelectedTooltip = function (nonSelectedVars) {
        var tooltipStr = '';
        var nsLen = nonSelectedVars.length;
        if (nsLen == 1 || nsLen == 2) {
            tooltipStr = nonSelectedVars.join(' & ');
        } else {
            for (var i = 0; i < nsLen; i++) {
                if (i == nsLen - 2) {
                    tooltipStr += nonSelectedVars[i] + ' & ' + nonSelectedVars[i + 1];
                    break;
                } else {
                    tooltipStr += nonSelectedVars[i] + ', ';
                }
            }
        }

        return tooltipStr;
    };

    // Product instance
    return {
        pid: model.ID,
        name: model.name,
        variant: model.variant,
        master: model.master,
        bundled: model.bundled,
        selectedVarAttribs: {}, // object containing variation attributes values as name value e.g. {color: "blue", size: "3", width: ""}
        selectedVar: null, // currently selected variant
        selectedOptions: {}, // holds currently selected options object {optionName, selected val}
        selectedPrice: {}, // holds prices for selected options as {warranty: ""}
        containerId: null, // holds the html container id of this product
        subProducts: [], // array to keep sub products instances
        bonusProduct: false,

        /**
         * Enable Add to Cart Button.
         */
        enableA2CButton: function () {
            jQuery(this.containerId + ' .addtocart input, ' + this.containerId + ' .addtocartbutton:last').prop('disabled', false);
            jQuery(this.containerId + ' .addtocartbutton:last, ' + this.containerId + ' .addtocart').removeClass('disabled');

        },

        /**
         * Disable Add to Cart Button.
         */
        disableA2CButton: function () {
            jQuery(this.containerId + ' .addtocart input, ' + this.containerId + ' .addtocartbutton:last').prop('disabled', true);
            jQuery(this.containerId + ' .addtocartbutton:last, ' + this.containerId + ' .addtocart').addClass('disabled');

        },

        removeA2CButton: function () {

            jQuery('.addtocart').css('display', 'none');
            jQuery('.productinfo .price').css('display', 'none');
            if (ProductCache.master) {
                jQuery('.productinfo .productid').css('display', 'none');
            }
            //jQuery(this.containerId+" .variationattributes").css('display','none');
        },
        // show availability
        showAvailability: function () {
            jQuery(this.containerId + ' .availability').show();
        },
        // hide availability
        hideAvailability: function () {
            jQuery(this.containerId + ' .availability').hide();
        },
        // show selected item #
        showItemNo: function () {
            jQuery(this.containerId + ' .productid .value').html(this.selectedVar.id);
        },
        // removes  item #
        removeItemNo: function () {
            jQuery(this.containerId + ' .productid .value').empty();
        },
        revertPrice: function () {
            var $price = jQuery(this.containerId + ' .productinfo .price:first');
            if (!$price.data('originalPrice')) {
                $price.data('originalPrice', $price.html());
            } else {
                $price.html($price.data('originalPrice'));
            }
        },
        // determine if this product is part of a bundle/product set VIEW
        setBonusProduct: function (bonusProduct) {
            this.bonusProduct = bonusProduct;
        },

        // determine if this product is part of a bundle/product set VIEW
        isBonusProduct: function () {
            return this.bonusProduct;
        },

        // determine if this product is part of a bundle/product set VIEW
        isSubProduct: function () {
            return (model.bundled || model.productSetProduct);
        },

        // show the selected variation attribute value next to the attribute label e.g. Color: Beige
        showSelectedVarAttrVal: function (varId, val) {
            jQuery(this.containerId + ' .variationattributes div:not(.clear)').each(function () {
                var id = jQuery(this).data('data');

                if (varId === id) {
                    jQuery(this).find('span.selectedvarval').html(val);
                }
            });
        },
        triggerZoomClick : function () {
            var timeOut = setTimeout(nextTtyNew, 500),
                secondsCounter = 0,
                flag = true;
            function nextTtyNew() {
                if (!flag){
                    return false;
                }

                clearTimeout(timeOut);
                flag = false;
                timeOut = setTimeout(nextTtyNew, 500);
                if (secondsCounter >= 200){
                    flag = false;
                } else {
                    if ($('body').find('.index0').parent().hasClass('mz-thumb')) {
                        $('body').find('.index0').trigger('click');
                        flag = false;
                    } else {
                        secondsCounter = secondsCounter + 1
                        flag = true;
                    }
                }
            }
        },

        refreshZoom : function () {
            var timeOut = setTimeout(nextTry, 500),
                secondsCounter = 0,
                flag = true;
            function nextTry() {
                if (!flag){
                    return false;
                }

                clearTimeout(timeOut);
                flag = false;
                timeOut = setTimeout(nextTry, 500);
                if (secondsCounter >= 200){
                    flag = false;
                } else {
                    if ($('.pdp-owl-customization .alternate-images').length > 0) {
                        flag = false
                    } else {
                        secondsCounter = secondsCounter + 1
                        flag = true;
                    }
                }
            }
        },

        // selects review tab
        readReviews: function () {
            jQuery(this.containerId + ' #tabs').tabs('select', 'pdpReviewsTab');
        },

        // shows product images and thumbnails
        // @param selectedVal - currently selected variation attr val
        // @param vals - total available variation attr values
        showImages: function (selectedVal, vals) {
            var that = this;
            vals = vals || {};

            // show swatch related images for the current variation value
            jQuery.each(vals, function () {
                var imgCounter = -1;
                var thisVal = this;
                imagesLoaded('.product-image').on('done', function () {
                    $('.product-primary-image').css({
                        height: $('.product-primary-image').height() + 'px',
                        width: $('.product-primary-image').width() + 'px'
                    });
                });
                $(window).resize(function() {
                    $('.product-primary-image').removeAttr('style');
                    $('.product-primary-image').css({
                        height: $('.product-primary-image').height() + 'px',
                        width: $('.product-primary-image').width() + 'px'
                    });
                });
                if (this.val === selectedVal && this.images) {

                    if (this.images.small.length > 0) {
                        jQuery(that.containerId + ' .productthumbnails:last').html('');
                        /**
                         * Show MagicZoom data - added by lgelberg 9/14/11
                         */
                        var zoomimageurl = (thisVal.images.original.length > 0) ? thisVal.images.original[0].url : '';
                        //jQuery('.productdetailcolumn .productimage img, .productdetailcolumn .quickviewproductimage img').attr('src',thisVal.images.large[i].url);
                        jQuery('.MagicZoom').attr('href', zoomimageurl);
                        $('body').find('.MagicZoom img').attr('src', zoomimageurl);
                        MagicZoom.update('product-image', zoomimageurl, zoomimageurl);
                        // jQuery(that.containerId+" .productimage").html("").append(jQuery("<img/>").attr("src", thisVal.images.large[0].url).attr("alt", thisVal.images.large[0].alt).attr("title", thisVal.images.large[0].title));
                    }

                    // make sure to show number of images based on the smallest of large or small as these have to have 1-1 correspondence.
                    var noOfImages = this.images.large.length >= this.images.small.length ? this.images.small.length : this.images.large.length;

                    // show thumbnails only if more than 1 or if this is a subproduct (bundled/subproduct)
                    if ((this.images.small.length > 1 || that.isSubProduct()) && !that.isBonusProduct()) {
                        jQuery.each(this.images.small, function (index) {
                            imgCounter++;
                            //var imageInd = imgCounter;
                            if (imgCounter > noOfImages - 1) {
                                return;
                            }
                            var href = null;
                            if ($('#container').hasClass('pt_product-details')) {
                                href = thisVal.images.original[index].url;
                            } else {
                                // In quick view since magic zoom is not there, Hence we need to set javascript:void(0); for a tag href value
                                href = 'javascript:void(0);';
                            }
                            $(that.containerId + ' .productthumbnails:last').append('<div class=\'alternate-images\'><a data-zoom-id=\'product-image\' href=\'' + href + '\' class=\'alternate-image\' data-image=\'' + thisVal.images.original[index].url + '\'><img class=\'index' + index + '\' src=\'' + this.url + '\' title=\'' + this.title + '\' alt=\'' + this.alt + '\'/></a></div>');
                            $(that.containerId + ' .productthumbnails:last .alternate-image img').on('click touchstart', function (e) {
                                e.preventDefault();
                                $(this).closest('.owl-item').siblings('.owl-item').find('a.alternate-image').removeClass('selected');
                                $(this).closest('.owl-item').find('a.alternate-image').addClass('selected');
                                var zoomimageurl = $(this).closest('.alternate-image').data('image');
                                //jQuery('.productdetailcolumn .productimage img, .productdetailcolumn .quickviewproductimage img').attr('src',thisVal.images.large[imageInd].url);
                                $('body').find('.MagicZoom').attr('href', zoomimageurl);
                                $('body').find('.MagicZoom img').attr('src', zoomimageurl);
                                MagicZoom.update('product-image', zoomimageurl, zoomimageurl);
                                MagicZoom.update('primary-image', zoomimageurl, zoomimageurl);
                                //$("body").find('.product-image').trigger("click");
                            });
                        });


                        jQuery(that.containerId + ' .productthumbnails:last .owl-item').first().find('img').click();
                        //var $images = jQuery(that.containerId+" .productthumbnails:last .owl-item img");
                        //var numOfRows = Math.ceil($images.size()/6);
                        //$images.slice(numOfRows * 6 - 6, numOfRows * 6 - 1).css('margin-bottom','0');
                        var desktopItems = 4;
                        if (that.containerId.indexOf('ui-dialog') == 1) {
                            desktopItems = 3;
                        }
                        var pdpOwlCarousel = $('.pdp-owl-customization');
                        if ($(window).width() > 480) {
                            if (this.images.small.length > 4) {
                                pdpOwlCarousel.owlCarousel({
                                    margin: 10,
                                    navRewind: false,
                                    rewind: false,
                                    nav: true,
                                    dots: true,
                                    navigation: false,
                                    responsive: {
                                        0: {
                                            items: 1,
                                            slideBy: 1
                                        },
                                        481: {
                                            items: 3,
                                            slideBy: 3
                                        },
                                        960: {
                                            items: desktopItems,
                                            slideBy: desktopItems
                                        }
                                    }
                                });
                                $('img.index0').parents('.owl-item').find('a.alternate-image').addClass('selected');
                            } else {

                                if ($(pdpOwlCarousel).hasClass('owl-carousel')) {
                                    pdpOwlCarousel.trigger('destroy.owl.carousel');
                                }
                                pdpOwlCarousel.owlCarousel({
                                    items: desktopItems,
                                    navRewind: false,
                                    margin: 10,
                                    rewind: false,
                                    nav: false,
                                    dots: false,
                                    navigation: false,
                                    responsive: {
                                        0: {
                                            items: 1,
                                            slideBy: 1
                                        },
                                        481: {
                                            items: 3,
                                            slideBy: 3
                                        },
                                        960: {
                                            items: desktopItems,
                                            slideBy: desktopItems
                                        }
                                    }
                                });
                                $('img.index0').parents('.owl-item').find('a.alternate-image').addClass('selected');
                            }
                        } else if ($(window).width() < 481) {
                            pdpOwlCarousel.owlCarousel({
                                items: 1,
                                slideBy: 1,
                                margin: 10,
                                navRewind: false,
                                rewind: false,
                                nav: true,
                                dots: true,
                                navigation: false,
                                responsive: {
                                    0: {
                                        items: 1,
                                        slideBy: 1
                                    },
                                    481: {
                                        items: 3,
                                        slideBy: 3
                                    },
                                    960: {
                                        items: desktopItems,
                                        slideBy: desktopItems
                                    }
                                }
                            });
                        }
                    }
                }
            });
            this.refreshZoom();
            // RPS-321 - commenting out zoom click trigger, causing primary image to revert back to the master image after a variant swatch is clicked
            //this.triggerZoomClick();
        },

        /**
         * Event handler when a variation attribute is selected/deselected.
         */
        varAttrSelected: function (e) {
            // update the selected value node
            this.showSelectedVarAttrVal(e.data.id, e.data.val || '');

            this.selectedVarAttribs[e.data.id] = e.data.val;

            // if this is a deselection and user landed on a variant page then reset its variant flag
            // as now user has deselected an attribute thus making it essentially a master product view
            if (e.data.val == null && this.variant) {
                this.variant = false;
                this.master = true;
            }

            // store this ref
            var that = this;

            // trigger update event which will update every other variation attribute i.e. enable/disable etc.

            // first reset the contents of each attribute display
            // when we have got the varriations data
            if (!isLoadingVar) {
                // find variants which match the current selection
                var selectedVarAttrVariants = e.data.val != null ? this.findVariations({
                    id: e.data.id,
                    val: e.data.val
                }) : null;
                var selectedVarAttrs = jQuery.extend({}, {}, this.selectedVarAttribs);
                var validVariants = null;
                var unselectedVarAttrs = new Array();

                // for each selected variation attribute find valid variants
                for (var selectedVar in selectedVarAttrs) {
                    if (selectedVarAttrs[selectedVar]) {
                        validVariants = this.findVariations({
                            id: selectedVar,
                            val: selectedVarAttrs[selectedVar]
                        }, validVariants);
                    } else {
                        unselectedVarAttrs.push(selectedVar);
                    }
                }
                // update each variation attribute display
                jQuery.each(model.variations.attributes, function () {
                    if ((this.id != e.data.id || e.data.val == null) && selectedVarAttrs[this.id] == null) {
                        that.varAttrDisplayHandler(this.id, validVariants);
                    } else if (this.id != e.data.id && selectedVarAttrs[this.id] != null) {
                        that.varAttrDisplayHandler(this.id, selectedVarAttrVariants);
                    } else {
                        // show swatch related images for the current value
                        that.showImages(e.data.val, this.vals);
                    }
                });

                // based on the currently selected variation attribute values, try to find a matching variant
                this.selectedVar = this.findVariation(this.selectedVarAttribs);
            }

            // lets fire refresh view event to enable/disable variations attrs
            this.refreshView();
        },

        /**
         * go thru all variations attr and disable which are not available
         */
        resetVariations: function () {
            if (isLoadingVar) {
                return; // we don't have the complete data yet
            }
            var that = this;
            var validVariants = model.variations.variants;
            if (this.selectedVarAttribs) {
                for (var selectedVarAttr in this.selectedVarAttribs) {
                    if (this.selectedVarAttribs[selectedVarAttr]) {
                        validVariants = that.findVariations({
                            id: selectedVarAttr,
                            val: this.selectedVarAttribs[selectedVarAttr]
                        }, validVariants);
                    }
                }
            }

            jQuery(this.containerId + ' .variationattributes .swatches').not('.current').not('.selected').each(function () {
                var dataa = jQuery(this).data('data'); // data is id set via app.hiddenData api
                jQuery(this).find('a.swatchanchor').each(function () {
                    // find A variation with this val
                    var filteredVariants = that.findVariations({id: dataa, val: this.title}, validVariants);
                    if (filteredVariants.length > 0) {
                        // found at least 1 so keep it enabled
                        jQuery(this).parent().removeClass('unselectable');
                    } else {
                        jQuery(this).parent().addClass('unselectable');
                        jQuery(this).parent().removeClass('selected');
                    }
                });
            });
            jQuery(this.containerId + ' .variationattributes .variantdropdown select').not('.current select').not('.selected select').each(function () {
                var $select = jQuery(this);
                var vaId = $select.data('data').id;  // data is id set via app.hiddenData api
                var options = $select.data('options');
                if (!options) {
                    options = [];
                    $select.find('option').each(function () {
                        var $option = jQuery(this);
                        options.push({value: $option.val(), text: $option.text(), selected: false});
                    });
                    $select.data('options', options);
                }
                var len = options.length;
                var selectedVal = $select.val();
                $select.empty();
                jQuery.each(options, function (index, value) {

                    if (len > 1 && index == 0) {
                        $select.append(
                            jQuery('<option></option>').text(value.text).val(value.value)
                        );
                        return; // very first option when the length is greater than 1 is 'Select ...' message so skip it
                    }
                    var filteredVariants = that.findVariations({id: vaId, val: value.value}, validVariants);
                    if (filteredVariants.length > 0) {
                        //add it
                        $select.append(
                            jQuery('<option></option>').text(value.text).val(value.value)
                        );
                    } else {
                        // no variant found with this value combination so disable it
                        //this.disabled = true;

                        /**if (this.selected) {
								// remove the currently selected value if the value is not selectable
								that.showSelectedVarAttrVal(attrId, "");
								that.selectedVarAttribs[attrId] = null;
							}*/
                        // remove current selection
                        //this.selected = false;
                    }

                });
                $select.val(selectedVal);
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
            var futureVariants = validVariants;
            if (this.selectedVarAttribs) {
                for (var selectedVarAttr in this.selectedVarAttribs) {
                    if (this.selectedVarAttribs[selectedVarAttr]) {
                        futureVariants = that.findVariations({
                            id: selectedVarAttr,
                            val: this.selectedVarAttribs[selectedVarAttr]
                        }, futureVariants);
                    }
                }
            }
            // loop thru all non-dropdown ui elements i.e. swatches e.g. color, width, length etc.
            jQuery(this.containerId + ' .variationattributes .swatches.future, ' + this.containerId + ' .variationattributes .swatches.current').each(function () {
                var $swatch = jQuery(this);
                var swatchId = $swatch.data('data');  // data is id set via app.hiddenData api

                if (swatchId === attrId && validVariants) {

                    $swatch.find('a.swatchanchor').each(function () {
                        var $this = jQuery(this);
                        var parentLi = $this.parent();

                        // find A variation with this val
                        var filteredVariants = $swatch.hasClass('future') ? that.findVariations({id: attrId, val: this.title}, futureVariants) : that.findVariations({id: attrId, val: this.title}, validVariants);
                        if (filteredVariants.length > 0) {
                            // found at least 1 so keep it enabled
                            parentLi.removeClass('unselectable');
                            if ($swatch.hasClass('color')) {
                                if (!getAvailability(filteredVariants)) {
                                    if ($this.find('.out-of-stock').size() === 0) {
                                        $this.prepend('<span class=\'out-of-stock\'></span>');
                                    }
                                } else {
                                    $this.find('.out-of-stock').remove();
                                }
                            } else {
                                if (!getAvailability(filteredVariants)) {
                                    if ($this.find('span').text().indexOf('Out of Stock') === -1) {
                                        if ($this.find('span').text().indexOf('New') !== -1) {
                                            $this.find('span').text($this.find('span').text() + ' / Out of Stock');
                                        } else {
                                            $this.find('span').text('Out of Stock');
                                        }
                                    }
                                } else {
                                    if ($this.find('span').text().indexOf('New') !== -1) {
                                        $this.find('span').text($this.find('span').text().replace(' / Out of Stock', ''));
                                    } else {
                                        $this.find('span').text($this.find('span').text().replace('Out of Stock', ''));
                                    }
                                }
                            }
                        } else {
                            // no variant found with this value combination so disable it
                            parentLi.addClass('unselectable');

                            if (parentLi.hasClass('selected')) {
                                // remove the currently selected value if the value is not selectable
                                that.showSelectedVarAttrVal(attrId, '');
                                that.selectedVarAttribs[attrId] = null;
                            }
                            // remove current selection
                            parentLi.removeClass('selected');
                        }
                    });
                }
            });

            // loop thru all the non-swatches(drop down) attributes
            jQuery(this.containerId + ' .variationattributes .variantdropdown.future select, ' + this.containerId + ' .variationattributes .variantdropdown.current select').each(function () {
                var $select = jQuery(this);
                var vaId = $select.data('data').id;  // data is id set via app.hiddenData api
                if (vaId === attrId && validVariants) {

                    var options = $select.data('options');
                    if (!options) {
                        options = [];
                        $select.find('option').each(function () {
                            var $option = jQuery(this);
                            options.push({value: $option.val(), text: $option.text(), selected: false});
                        });
                        $select.data('options', options);
                    }
                    var len = options.length;
                    var selectedVal = $select.val();
                    $select.empty();
                    jQuery.each(options, function (index, value) {

                        if (len > 1 && index == 0) {
                            $select.append(
                                jQuery('<option></option>').text(value.text).val(value.value)
                            );
                            return; // very first option when the length is greater than 1 is 'Select ...' message so skip it
                        }

                        // find A variation with this val
                        var filteredVariants = $select.closest('.variantdropdown').hasClass('future') ? that.findVariations({id: attrId, val: value.value}, futureVariants) : that.findVariations({id: attrId, val: value.value}, validVariants);
                        if (filteredVariants.length > 0) {
                            // found at least 1 so keep it enabled
                            var oos = '';
                            if (!getAvailability(filteredVariants)) {
                                oos = ' - Out of Stock';
                            }
                            //add it
                            $select.append(
                                jQuery('<option></option>').text(value.text + oos).val(value.value)
                            );
                        } else {
                            // no variant found with this value combination so disable it
                            //this.disabled = true;

                            /**if (this.selected) {
								// remove the currently selected value if the value is not selectable
								that.showSelectedVarAttrVal(attrId, "");
								that.selectedVarAttribs[attrId] = null;
							}*/
                            // remove current selection
                            //this.selected = false;
                        }
                    });
                    $select.val(selectedVal);
                }
            });

        },

        /**
         * refresh the UI i.e. availability, price, A2C button and variation attributes display
         */
        refreshView: function () {
            var thisProduct = this;

            if (!isLoadingVar && this.selectedVar == null) {
                // if we have loaded the variations data then lets if the user has already selected some values
                // find a matching variation
                this.selectedVar = this.findVariation(this.selectedVarAttribs);
            }

            if (!isLoadingVar && this.selectedVar != null) {
                //Facebook Pixel Code for variant view
                fbq('track', 'ViewContent', {
                    'content_ids': [thisProduct.selectedVar.id],
                    'content_type': 'product'
                });
                // update availability
                reloadAvailability(thisProduct, thisProduct.selectedOptions.Quantity);
                // update price
                this.showUpdatedPrice(computePrice(thisProduct), this.selectedVar.pricing.standard);
                
                // Replace the hero shot with the specific variant chosen
                var varID = this.selectedVar.id;
                var imageUrl = model.images.variants[varID];
                var zoomImageUrl = model.images.zoomvariants[varID];
                // load the fully qualified variation image
                if (imageUrl != null) {
                    //jQuery('.productdetailcolumn .productimage img, .productdetailcolumn .quickviewproductimage img').attr('src',imageUrl);
                    jQuery('.MagicZoom').attr('href', zoomImageUrl);
                    $('body').find('.MagicZoom img').attr('src', zoomImageUrl);
                    MagicZoom.update('product-image', zoomImageUrl, zoomImageUrl);
                }
                if (!(!this.selectedVar.inStock && this.selectedVar.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE) && (this.getPrice() > 0 || this.isPromoPrice())) {

                    this.showItemNo();
                    this.showAvailability();
                    // enable add to cart button
                    this.enableA2CButton();
                    jQuery(this).trigger('AddtoCartEnabled');
                    if ($('#Quantity').val() < 1) {
                        $('addtocartbutton:last').prop('disabled', true);
                        $('.addtocart').addClass('disabled');
                    }
                } else if (this.selectedVar.earlyBirdMessage != '') {
                    this.showItemNo();
                    //this.hideAvailability();
                    this.disableA2CButton();
                    jQuery(this).trigger('AddtoCartDisabled');
                } else {
                    //this.removeItemNo();
                    this.showItemNo();
                    this.showAvailability();
                    //this.revertPrice();
                    this.disableA2CButton();
                    jQuery(this).trigger('AddtoCartDisabled');
                }
                if (this.selectedVar.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE) {
                    //this.removeA2CButton();
                }
            } else {
                if (isLoadingVar) {
                    // update availability
                    setAvailabilityMsg(progress.show('productloader'));
                } else {
                    setAvailabilityMsg(Resources.NON_SELECTED);
                }
                this.removeItemNo();
                this.showAvailability();
                this.revertPrice();
                // disable add to cart button
                this.disableA2CButton();
                jQuery(this).trigger('AddtoCartDisabled');

            }

            var nonSelectedVars = [];

            var validVariants = null;

            for (var selectedVar in this.selectedVarAttribs) {
                if (this.selectedVarAttribs[selectedVar]) {
                    validVariants = this.findVariations({
                        id: selectedVar,
                        val: this.selectedVarAttribs[selectedVar]
                    }, validVariants);
                }
            }

            // update selected var attr vals and refresh their display
            jQuery.each(model.variations.attributes, function () {
                thisProduct.showSelectedVarAttrVal(this.id, thisProduct.selectedVarAttribs[this.id]);

                if (!thisProduct.selectedVarAttribs[this.id] || thisProduct.selectedVarAttribs[this.id] == '') {
                    nonSelectedVars.push(this.name);

                    thisProduct.varAttrDisplayHandler(this.id, validVariants);
                }
            });

            // process non-selected vals and show updated tooltip for A2C button as a reminder
            // and show it along availability
            var tooltipStr = getNonSelectedTooltip(nonSelectedVars);
            //var missingvalue = $(".missingvalue").val();
            if (nonSelectedVars.length > 0) {
                var availMsg = $.validator.format(Resources.MISSING_VAL, tooltipStr);
                setAvailabilityMsg(availMsg);
                //jQuery(thisProduct.containerId+" .addtocartbutton:last").attr("title", availMsg);
            }
        },

        /**
         * renders pricing div given a sale price and optional standard price
         * To format the price display, it goes to server via an ajax call.
         *
         * @param sale - sale price
         * @param standard - standard price
         */
        showUpdatedPrice: function (sale, standard) {
            var standardPrice = Number(standard || 0);
            var salePrice = Number(sale || 0);
            var priceHtml = '';
            var formattedPrices = {'salePrice': salePrice, 'standardPrice': standardPrice};

            // send server request to format the money baed on site settings using Money api
            ajax.getJson({
                url: Urls.formatMoney,
                cache: true,
                async: false,
                data: {'salePrice': salePrice, 'standardPrice': standardPrice},
                callback: function (data) {
                    formattedPrices = data;
                }
            });
            //get only the currency code/symbol
            var currency = formattedPrices.standardPrice.split(standardPrice)[0];

            // in case it is a promotional price then we do not care if it is 0
            priceHtml = (salePrice > 0 || this.isPromoPrice()) ? '<div class="salesprice"> <span itemprop="priceCurrency" content="' + currency + '">' + currency + '</span><span itemprop="price" content="' + salePrice + '">' + salePrice + '</span></div>' : ' <div class="salesprice">N/A</div>';

            if (standardPrice > 0 && standardPrice > salePrice) {
                // show both prices
                priceHtml = '<div class="standardprice"> <span itemprop="priceCurrency" content="' + currency + '">' + currency + '</span><span itemprop="price" content="' + standardPrice + '">' + standardPrice + '</span></div>' + priceHtml;
            }
            if (standardPrice === 0 && salePrice === 0) {
                if (this.selectedVar.earlyBirdMessage != '') {
                    priceHtml = '<div class="salesprice">' + this.selectedVar.earlyBirdMessage + '</div>';
                } else {
                    priceHtml = '<div class="salesprice"></div>';
                }

            }
            var $price = jQuery(this.containerId + ' .productinfo .price:first');
            if (!$price.data('originalPrice')) {
                $price.data('originalPrice', $price.html());
            }
            $price.html(priceHtml);
            // containerId contains #, get rid of it before finding the right price div
            jQuery(this.containerId + ' #pdpATCDiv' + this.containerId.substring(1) + ' .price').html(priceHtml);
        },

        /**
         * returns a computed price for this product
         */
        getPrice: function () {
            return computePrice(this);
        },

        /**
         * Determines if the selected product has promotional price.
         *             *
         * @return boolean true if promotional price is present otherwise false
         */
        isPromoPrice: function () {
            return (this.selectedVar != null ? this.selectedVar.pricing.isPromoPrice : model.pricing.isPromoPrice);
        },

        /**
         * receives 2 or 1 variation attribute values and tries to figure out if there is a variant with these values.
         *
         * @param val1 - variation attribute value
         * @param val2 - variation attribute value
         * @return boolean - true if a variant exists otherwise false
         */
        isVariation: function (val1, val2) {
            var variant = null;

            for (var i = 0; i < model.variations.variants.length; i++) {
                variant = model.variations.variants[i];
                if (variant.attributes[val1.id] == val1.val && (val2 == undefined || variant.attributes[val2.id] == val2.val)) {
                    return true;
                }
            }
            /**
             * apparently there is no way to break out of jQuery.each half way :(
             jQuery.each(model.variations.variants, function(){
				if (!found && this.attributes[val1.id] == val1.val && this.attributes[val2.id] == val2.val) {
					found = true;
					return;
				}
			});*/
            return false;
        },

        /**
         * find 0 or more variants matching the given attribs object(s) and in stock
         * return null or found variants
         */
        findVariations: function (attr, variants) {
            var foundVariants = new Array();
            variants = variants || model.variations.variants;

            var variant = null;
            for (var i = 0; i < variants.length; i++) {
                variant = variants[i];
                if ((variant.attributes[attr.id] === attr.val) /*&&
                 //(variant.inStock || (variant.avStatus === app.constants.AVAIL_STATUS_BACKORDER && variant.ATS > 0) || (variant.avStatus === app.constants.AVAIL_STATUS_PREORDER && variant.ATS > 0))*/
                    ) {
                    foundVariants.push(variant);
                }
            }

            return foundVariants;
        },

        /**
         * find a variant with the given attribs object
         * return null or found variation json
         */
        findVariation: function (attrs) {
            if (!this.checkAttrs(attrs)) {
                return null;
            }

            var attrToStr = function (attrObj) {
                var result = '';
                jQuery.each(model.variations.attributes, function () {
                    result += attrObj[this.id];
                });
                return result;
            };

            var attrsStr = attrToStr(attrs);
            var variant = null;
            for (var i = 0; i < model.variations.variants.length; i++) {
                variant = model.variations.variants[i];
                if (attrToStr(variant.attributes) === attrsStr) {
                    return variant;
                }
            }
            return null;
        },

        // find a variation with the give id otherwise empty object
        findVariationById: function (id) {

            for (var i = 0; i < model.variations.variants.length; i++) {
                // IE7 does NOT support this!!!
                //for each(var variation in model.variations.variants) {
                var variation = model.variations.variants[i];
                if (variation && variation.id === id) {
                    return variation;
                }
            }

            return {};
        },

        /**
         * see if the specified attrs object has all the variation attributes present in it
         * return true/false
         */
        checkAttrs: function (attrs) {
            for (var i = 0; i < model.variations.attributes.length; i++) {
                if (attrs[model.variations.attributes[i].id] == null) {
                    return false;
                }
            }
            return true;
        },

        // given an id, return attr definition from model.variations.attributes
        getAttrByID: function (id) {
            for (var i = 0; i < model.variations.attributes.length; i++) {
                if (model.variations.attributes[i].id === id) {
                    return model.variations.attributes[i];
                }
            }
            return {};
        },

        // returns current availability status e.g. in_stock, preorder etc.
        getAvStatus: function () {
            if ((this.variant || this.master) && this.selectedVar != null) {
                return this.selectedVar.avStatus;
            } else {
                return model.avStatus;
            }
        },

        // return available to sell qty
        getATS: function () {
            if ((this.variant || this.master) && this.selectedVar != null) {
                return this.selectedVar.ATS;
            } else {
                return model.ATS;
            }
        },

        // return non-closeout low qty threshold
        getNonCloseoutLowQtyThreshold: function () {
            if ((this.variant || this.master) && this.selectedVar != null) {
                return this.selectedVar.nonCloseoutLowQtyThreshold;
            } else {
                return model.nonCloseoutLowQtyThreshold;
            }
        },

        // return the quantity that was used to calculate availability
        getAvailabilityQty: function () {
            if ((this.variant || this.master) && this.selectedVar != null) {
                return this.selectedVar.avStatusQuantity;
            } else {
                return model.avStatusQuantity;
            }
        },

        // return the availability levels
        getAvLevels: function () {
            if ((this.variant || this.master) && this.selectedVar != null) {
                return this.selectedVar.avLevels;
            } else {
                return model.avLevels;
            }
        },

        // returns in stock date
        getInStockDate: function () {
            if ((this.variant || this.master) && this.selectedVar != null) {
                return this.selectedVar.inStockDate;
            } else {
                return model.inStockDate;
            }
        },

        // set the add to cart button and bind handlers for bundle/product set
        getSubProductsBinding: function () {
            var thisProduct = this;

            // For bundles and product-sets, enable or disable the add-to-cart button.
            // The button should be disabled if the add-to-cart button of any subproduct is disabled, enabled otherwise.
            // For product-sets, display a price which is the sum of the set-products prices as long as the add-to-cart button is enabled.
            if (model.bundle || model.productSet) {

                var bundleA2CEnabled = false;
                var price = new Number();
                for (var i = 0; i < thisProduct.subProducts.length; i++) {
                    var subProduct = thisProduct.subProducts[i];
                    bundleA2CEnabled = subProduct.isA2CEnabled();
                    if (!bundleA2CEnabled) {
                        break;
                    }

                    // collect price info
                    price += new Number(subProduct.getPrice());
                }

                // if any of the bundled product has its A2C button disabled then the bundle is not orderable
                if (!bundleA2CEnabled) {
                    this.disableA2CButton();
                } else {
                    this.enableA2CButton();

                    // show total price except for a bundle
                    if (!model.bundle) {
                        thisProduct.showUpdatedPrice(price);
                    }
                }
            }

            // bind AddtoCartDisabled event for each subproduct (bundle or product set)
            jQuery.each(thisProduct.subProducts, function () {
                jQuery(this).bind('AddtoCartDisabled', {},
                    /**
                     * Event handler when a subproduct of a product set or a bundle is selected.
                     * disable the add to cart button
                     */
                        function () {
                            thisProduct.disableA2CButton();
                        });
            });

            // see if have any sub-products and bind AddtoCartEnabled event
            jQuery.each(thisProduct.subProducts, function () {
                jQuery(this).bind('AddtoCartEnabled', {},
                    /**
                     * Event handler when a subproduct of a product set or a bundle is selected.
                     * Basically enable the add to cart button or do other  refresh if needed like price etc.
                     */
                        function () {
                            // enable Add to cart button if all the sub products have been selected
                            // and show the updated price
                            var enableAddToCart = true;
                            var subProducts = thisProduct.subProducts;
                            var price = new Number();

                            for (var i = 0; i < subProducts.length; i++) {
                                if (((subProducts[i].variant || subProducts[i].master) && subProducts[i].selectedVar == null) ||
                                    (!subProducts[i].bundled && (subProducts[i].selectedOptions.Quantity == undefined ||
                                        subProducts[i].selectedOptions.Quantity <= 0))) {
                                    enableAddToCart = false;
                                    break;
                                } else {
                                    if (subProducts[i].selectedVar != null) {
                                        subProducts[i].selectedOptions.pid = subProducts[i].selectedVar.pid;
                                    } else {
                                        subProducts[i].selectedOptions.pid = subProducts[i].pid;
                                    }

                                    // Multiply the subproduct quantity-one price by the entered quantity.
                                    // Important note:  This value will be incorrect if subproduct uses
                                    // tiered pricing !!!!!
                                    var subproductQuantity = subProducts[i].selectedOptions.Quantity;
                                    if (subproductQuantity == undefined) {
                                        subproductQuantity = 1;
                                    }
                                    price += new Number(subproductQuantity * subProducts[i].getPrice());
                                }
                            }

                            if (enableAddToCart && (model.productSet || model.inStock) && (price > 0 || thisProduct.isPromoPrice())) {
                                thisProduct.enableA2CButton();

                                // show total price except for a bundle
                                if (!model.bundle) {
                                    thisProduct.showUpdatedPrice(price);
                                }
                            } else {
                                thisProduct.disableA2CButton();
                            }
                        }
                );
            });
        },

        // determine if A2C button is enabled or disabled
        // true if enabled, false otherwise
        isA2CEnabled: function () {
            if (this.variant || this.master) {
                if (this.selectedVar != null) {
                    return (this.selectedVar.avStatus === Constants.AVAIL_STATUS_IN_STOCK ||
                        this.selectedVar.avStatus === Constants.AVAIL_STATUS_BACKORDER ||
                        this.selectedVar.avStatus === Constants.AVAIL_STATUS_PREORDER);
                } else {
                    return false;
                }
            } else {
                return (model.avStatus === Constants.AVAIL_STATUS_IN_STOCK ||
                    model.avStatus === Constants.AVAIL_STATUS_BACKORDER ||
                    model.avStatus === Constants.AVAIL_STATUS_PREORDER);
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
        show: function (options) {
            // preserve this instance
            var thisProduct = this;

            // bind VariationsLoaded which gets fired when the variation data is received from the server
            // and we need to refresh the ui
            jQuery(this).bind('VariationsLoaded', {}, function () {
                // enable/disable unavailable values
                // and set the currently selected values
                // reset the currently selected variation attributes i.e. reset the ui
                thisProduct.resetVariations();

                // create the default availability message based on ATS count
                // from the variants
                var atsCount = getATS(model.variations.variants);
                if (atsCount == 0) {
                    setAvailabilityMsg('<span class=\'out-of-stock\'>' + Resources[Constants.AVAIL_STATUS_NOT_AVAILABLE] + '</span>');
                }
                // We will use this in the 2nd of the two following loops
                var someAreNotSelected = false;
                // Determine the selected state of each option
                var $attributes = jQuery(thisProduct.containerId + ' .variationattributes .swatches,' + thisProduct.containerId + ' .variationattributes .variantdropdown');
                $attributes.each(function () {
                    var $this = jQuery(this);
                    if ($this.hasClass('swatches')) {
                        //if it is swatches, find the selected swatch
                        if ($this.find('.selected').size() > 0) {
                            $this.addClass('selected');
                        } else {
                            $this.removeClass('selected');
                        }
                    } else {
                        var selectBox = $this.find('select').get(0);
                        if ($(selectBox).find('option').length == 2) {
                            $(selectBox).find('option').eq(1).prop('selected', true);
                        }
                        if (selectBox.selectedIndex >= 0 && selectBox.options[selectBox.selectedIndex].value != '') {
                            $this.addClass('selected');
                        } else {
                            $this.removeClass('selected');
                        }
                    }

                }).each(function (index) {
                    var $this = jQuery(this);
                    if (someAreNotSelected) {
                        $this.removeClass('selected').addClass('future').find('.selected').removeClass('selected');
                        $this.find('.optionwrapper').slideUp();
                    }
                    if (!$this.hasClass('selected')) {
                        if (!someAreNotSelected) {
                            $this.addClass('current');
                            someAreNotSelected = true;
                        }
                    } else {
                        // if it's not the last item, hide the selections and leave the button enabled
                        if ($attributes.size() - 1 != index) {
                            $this.find('.optionwrapper').slideUp().find('button').removeClass('non-selectable');
                        } else {
                            //it is the last item, and it's selected, so it's current
                            $this.removeClass('selected').addClass('current');
                        }
                    }
                });

                // Grab the currently selected values and update the UI
                // swatch variation attributes
                jQuery(thisProduct.containerId + ' .variationattributes .swatches, ' + thisProduct.containerId + ' .variationattributes .variantdropdown select').each(function (index) {
                    if (index === 0) {
                        var $swatch = jQuery(this);
                        var swatchId = $swatch.data('data');  // data is id set via app.hiddenData api

                        if (model.variations.variants) {
                            if (typeof this.selectedIndex === 'undefined') {
                                $swatch.find('a.swatchanchor').each(function () {
                                    var $this = jQuery(this);
                                    //var parentLi = $this.parent();
                                    // find A variation with this val
                                    var filteredVariants = thisProduct.findVariations({
                                        id: swatchId,
                                        val: this.title
                                    }, model.variations.variants);

                                    if ($swatch.hasClass('color')) {
                                        if (!getAvailability(filteredVariants)) {
                                            if ($this.find('.out-of-stock').size() === 0) {
                                                $this.prepend('<span class=\'out-of-stock\'></span>');
                                            }
                                        } else {
                                            $this.find('.out-of-stock').remove();
                                        }
                                    } else {
                                        if (!getAvailability(filteredVariants)) {
                                            if ($this.find('span').text().indexOf('Out of Stock') === -1) {
                                                if ($this.find('span').text().indexOf('New') !== -1) {
                                                    $this.find('span').addClass('outofstockpdp');
                                                    $this.find('span').text($this.find('span').text() + ' / Out of Stock');
                                                } else {
                                                    $this.find('span').addClass('outofstockpdp');
                                                    $this.find('span').text('Out of Stock');
                                                }
                                            }
                                        } else {
                                            if ($this.find('span').text().indexOf('New') !== -1) {
                                                $this.find('span').text($this.find('span').text().replace(' / Out of Stock', ''));
                                            } else {

                                                $this.find('span').text($this.find('span').text().replace('Out of Stock', ''));
                                            }
                                        }
                                    }
                                });
                            } else {

                                $swatch.find('option').each(function () {
                                    if (this.value !== '') {
                                        var filteredVariants = thisProduct.findVariations({
                                            id: swatchId.id,
                                            val: this.value
                                        }, model.variations.variants);
                                        if (!getAvailability(filteredVariants)) {
                                            this.text = this.text + ' - Out of Stock';
                                        }
                                    }
                                });
                            }
                        }
                    }

                    if (typeof this.selectedIndex === 'undefined') {
                        var thisSwatch = jQuery(this),
                            pdpVarId = thisSwatch.data('data'); // data is id which is set via app.hiddenData onload

                        // grab the currently selected variation attribute val
                        thisSwatch.find('.selected a').each(function () {
                            thisProduct.varAttrSelected({data: {id: pdpVarId, val: this.title}});
                        });
                    } else {
                        // non-swatch variation attributes
                        if (this.selectedIndex >= 0 && this.options[this.selectedIndex].value != '') {
                            // grab the currently selected val by firing update ui api
                            // when dealing with a select element, data returns an object so we must ask for id
                            thisProduct.varAttrSelected({
                                data: {
                                    id: jQuery(this).data('data').id,
                                    val: this.options[this.selectedIndex].value
                                }
                            });
                        }
                    }
                });
                /**
                 // loop thru all non-dropdown ui elements i.e. swatches e.g. color, width, length etc.
                 jQuery(this.containerId + " .variationattributes .swatches").each(function(){

				});*/
            });

            this.containerId = '#' + options.containerId;
            var isQuickView = false;

            if (options.source && options.source == 'quickview') {
                isQuickView = true;
                this.containerId = '.ui-dialog #' + options.containerId;
            }

            myContainerId = this.containerId;

            // bind click handlers for prev/next links
            getNavLinks();

            // size chart click binding
            getSizeChart();

            // variation attributes handling in case it is a master or a variant product
            if (model.master || model.variant) {
                loadVariants(this); // make a server call to load the variants, this is due to the performance reasons
                // meanwhile display the available variation attributes

                // bind the "next" buttons in the picker
                jQuery('button.next').click(function () {
                    /**var $this = jQuery(this);
                     if(!$this.hasClass("non-selectable")) {
					$this.closest(".swatches, .variantdropdown").find(".optionwrapper").slideUp(400,function(){
						jQuery(this).closest(".swatches, .variantdropdown")
							.removeClass("current").addClass("selected")
							.nextUntil(".swatches, .variantdropdown").next()
								.addClass("current").removeClass("future")
									.find(".optionwrapper").slideDown().find('select').change();
					});
					}*/
                });

                //bind the "previous" buttons in the picker
                jQuery('a.previous').click(function (e) {
                    e.preventDefault();
                    jQuery(this)
                        .closest('.swatches, .variantdropdown')
                        .prevUntil('.swatches, .variantdropdown')
                        .prev()
                        .find('a.filter').click();
                });
                $('.MagicZoom img.primary-image').bind('click', function () {
                    $('.new-swim,.old-swim').addClass('swimHide');

                    setTimeout(function () {
                        //var zoomedContent = $('.mz-expand-stage').html();
                        $('.mz-button-close').on('click', function () {
                            $('.new-swim,.old-swim').removeClass('swimHide');
                        });
                    }, 500);
                });
                // clicking on a previous step
                jQuery('.variationattributes').delegate('.selected a.filter', 'click', function (e) {
                    e.preventDefault();
                    var $this = jQuery(this).closest('.selected');
                    jQuery('.variationattributes .swatches,.variationattributes .variantdropdown').removeClass('current');
                    $this.removeClass('selected').addClass('current');
                    $this.nextAll('.swatches, .variantdropdown').each(function () {
                        var $variant = jQuery(this);
                        $variant.addClass('future').removeClass('selected');
                        if ($variant.hasClass('swatches')) {
                            $variant.find('.selected a').click();
                        } else if ($variant.hasClass('variantdropdown')) {
                            var $select = $variant.find('select');
                            if ($select.find('option').size() > 1) {
                                $select.val('').change();
                            }
                        }
                    });
                    $(this).parent().find('.swatchesdisplay .selected a').click();
                    $(this).parent().find('select').val('');

                    jQuery('.variationattributes').find('.future .optionwrapper').slideUp(400, function () {
                        jQuery('.current .optionwrapper').slideDown(400, function () {
                            $(this).find('.filter .value').text('');
                        });
                    });
                    jQuery('.variationattributes').find('.current .optionwrapper').slideDown(400, function () {
                        $(this).closest('.current').find('.filter .value').text('');
                    });
                });

                // bind the "learn more" links
                jQuery('span.learnmore a').click(function (e) {
                    e.preventDefault();
                    // add learn more dialog container div if its not added yet
                    // only added once
                    if (jQuery('#learnMoreDialog').length == 0) {
                        jQuery('<div></div>').attr('id', 'learnMoreDialog').appendTo(document.body);
                    }

                    var learnMoreDialog = dialog.create({
                        id: 'learnMoreDialog', options: {
                            height: 530,
                            width: 800,
                            title: Resources.SIZECHART_TITLE
                        }
                    });

                    learnMoreDialog.dialog('open');

                    // make the server call to load the learn more html
                    jQuery('#learnMoreDialog').load(this.href);
                });

                // loop thru all the swatches and bind events etc.
                jQuery(thisProduct.containerId + ' .variationattributes .swatches').each(function () {
                    var thisSwatch = jQuery(this);
                    var pdpVarId = thisSwatch.data('data'); // data is id which is set via app.hiddenData onload
                    var attrDef = thisProduct.getAttrByID(pdpVarId);

                    if (!attrDef) {
                        return;
                    }

                    // click handler for swatches links
                    var varEventHandler = function (e) {
                        var thisObj = jQuery(this);

                        e.data = {id: pdpVarId, val: this.title};

                        if (thisObj.parent().hasClass('unselectable')) {
                            return false;
                        } else if (thisObj.parent().hasClass('selected')) {
                            // deselection
                            e.data = {id: pdpVarId, val: null};
                            thisObj.parent().removeClass('selected');
                            // clear the current selection
                            thisProduct.varAttrSelected(e);

                            thisProduct.resetVariations();
                        } else {
                            // selection
                            e.data = {id: pdpVarId, val: this.title};
                            // remove the current selection
                            thisSwatch.find('.selected').removeClass('selected');
                            if (thisObj.closest('.swatches').nextUntil('.swatches, .variantdropdown').next().size() > 0) {
                                thisObj.parent().addClass('selected').closest('.swatches').find('button').removeClass('non-selectable');
                                var $this = jQuery(this);
                                if (!$this.hasClass('non-selectable')) {
                                    $this.closest('.swatches').find('.optionwrapper').slideUp(400, function () {
                                        jQuery(this).closest('.swatches').removeClass('current').addClass('selected').nextUntil('.swatches').next().not('.clear').first()
                                            .addClass('current').removeClass('future').find('.optionwrapper').slideDown(400, function () {
                                                jQuery(this).find('select option').each(function (index) {
                                                    if ($(this).closest('select').find('option').length == 2 && index == 1) {
                                                        $(this).prop('selected', true).trigger('change');
                                                        //$(this).attr('selected','selected').trigger('change');
                                                    }
                                                });
                                            }).find('select').change();
                                    });
                                }
                            } else {
                                thisObj.parent().addClass('selected');
                            }
                            thisProduct.varAttrSelected(e);
                        }

                        return false;
                    };

                    // all swtach anchors
                    var varJqryObjs = thisSwatch.find('a.swatchanchor');

                    // if its a color attr then render its swatches and images
                    if (pdpVarId === 'color') {
                        var colorAttrDef = thisProduct.getAttrByID('color');

                        varJqryObjs.each(function () {

                            // given a variation attr value, find its swatch image url
                            var findSwatch = function (val) {
                                for (var i = 0; i < colorAttrDef.vals.length; i++) {
                                    if (colorAttrDef.vals[i].val === val) {
                                        return colorAttrDef.vals[i].images.swatch;
                                    }
                                }
                                return ''; // no swatch image found
                            };

                            var swatchUrl = (findSwatch(this.title)).url; // find swatch url

                            if (swatchUrl && swatchUrl != '') {
                                //jQuery(this).css("color", "transparent").parent().css("background", "url(" + swatchUrl + ")");
                                jQuery(this).css('text-indent', '-9999px').prepend('<img alt="' + this.title + '" src="' + swatchUrl + '"/>');
                            } else {
                                jQuery(this).css('color', 'transparent'); // no swatch image found
                            }
                        });

                        // swatches click, hover and mouseleave event handlers
                        varJqryObjs.data('data', {id: pdpVarId}).click(varEventHandler);
                        if ($(window).width() > 1024) {
                            varJqryObjs.data('data', {id: pdpVarId}).mouseenter(function () {
                                thisProduct.showSelectedVarAttrVal('color', this.title);
                                thisProduct.showImages(this.title, colorAttrDef.vals);
                            }).mouseleave(function () {
                                if (thisProduct.selectedVar) {
                                    thisProduct.showImages(thisProduct.selectedVar.id, [{
                                        'val': thisProduct.selectedVar.id,
                                        'images': {
                                            'original': [{'url': model.images.zoomvariants[thisProduct.selectedVar.id]}],
                                            'small': [{'url': model.images.variants[thisProduct.selectedVar.id]}],
                                            'large': [{'url': model.images.variants[thisProduct.selectedVar.id]}]
                                        }
                                    }]);
                                } else if (thisProduct.selectedVarAttribs.color) {
                                    thisProduct.showImages(thisProduct.selectedVarAttribs.color, colorAttrDef.vals);
                                } else {
                                    thisProduct.showImages('', [{val: '', images: model.images}]);
                                }

                                thisProduct.showSelectedVarAttrVal('color', thisProduct.selectedVarAttribs.color || '');
                            });
                        }

                    } else {
                        // not a color swatch, we only have click handler for this type of variation attribute e.g. width, length etc.
                        varJqryObjs.data('data', {id: pdpVarId}).click(varEventHandler);
                    }
                });

                jQuery(thisProduct.containerId + ' .variationattributes .variantdropdown select option').each(function (index) {
                    if (jQuery(thisProduct.containerId + ' .variationattributes .variantdropdown select option').length == 2 && index == 1) {
                        $(this).prop('selected', true).trigger('change');
                    }
                });

                // loop thru all the non-swatches attributes and bind events etc.
                jQuery(thisProduct.containerId + ' .variationattributes .variantdropdown select').each(function () {
                    // default ui i.e. drop downy
                    jQuery(this).data('data', {id: jQuery(this).data('data'), val: ''}).change(function (e) {
                        // if there is only 1 value to be selected then return i.e. no deselection available
                        //if (this.selectedIndex == 0 && this.options.length == 1) { return; }

                        e.data = jQuery(this).data('data'); // data is id
                        // this.selectedIndex == 0, it is deselection
                        e.data.val = (this.selectedIndex == 0 && this.options.length > 1) ? null : this.options[this.selectedIndex].value;

                        if (this.selectedIndex == 0 && this.options.length > 1) {
                            // deselection
                            //jQuery(this).closest(".variantdropdown").find("button").addClass("non-selectable");
                        } else {
                            // selection
                            //jQuery(this).closest(".variantdropdown").find("button").removeClass("non-selectable");
                            jQuery(this).closest('.variantdropdown').find('.optionwrapper').slideUp(400, function () {
                                jQuery(this).closest('.variantdropdown')
                                    .removeClass('current').addClass('selected')
                                    .nextUntil('.future').next()
                                    .addClass('current').removeClass('future')
                                    .find('.optionwrapper').slideDown(400, function () {
                                        jQuery(this).find('select option').each(function (index) {
                                            if ($(this).closest('select').find('option').length == 2 && index == 1) {
                                                $(this).prop('selected', true).trigger('change');
                                                //$(this).attr('selected','selected').trigger('change');
                                            }
                                        });
                                    }).find('select').change();
                            });
                        }

                        thisProduct.varAttrSelected(e);
                        if (this.selectedIndex == 0 && this.options.length > 1) {
                            // clear the current selection
                            thisProduct.resetVariations();
                        }
                    });
                });

                if (thisProduct.selectedVarAttribs.color) {
                    // show swatch related images for the current value
                    thisProduct.showImages(thisProduct.selectedVarAttribs.color, thisProduct.getAttrByID('color').vals);
                } else {
                    // show images and bind hover event handlers for small/thumbnails to toggle large image
                    thisProduct.showImages('', [{val: '', images: model.images}]);
                }
            } else {
                // show images and bind hover event handlers for small/thumbnails to toggle large image
                thisProduct.showImages('', [{val: '', images: model.images}]);
            }

            // bind product options event(s)
            getOptionsDiv(this);

            if (!model.productSet) {
                // quantity box
                if (!model.bundle) {
                    getQtyBox(this);
                } else if (model.bundle) {
                    // update avaiability for a bundle product, for everything else its done inside getQtyBox
                    setAvailabilityMsg(createAvMessage(this, 1));
                }
            }

            // Add to cart button click binding
            getAddToCartBtn(this);
            // intial display of A2C button
            // if the price is 0 or not available, its disabled
            // if not in stock, its disabled
            // isPromoPrice would be true in case if a product has a promotional price which could make product's price 0
            if (!(this.getPrice() > 0 || this.isPromoPrice()) ||
                model.master || model.variant || model.productSet || model.bundle ||
                (!model.inStock && model.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE && !model.productSet)) {
                this.disableA2CButton();
                /** if((this.getPrice() == 0 && !this.isPromoPrice())) {
					this.hideAvailability();
				}*/
            }
            if (model.avStatus === Constants.AVAIL_STATUS_NOT_AVAILABLE) {
                //this.removeA2CButton();
            }

            // customer rating section only displayed for the main product
            if (!model.productSetProduct && !model.bundled) {
                if (!model.productSet && !isQuickView && !model.bundle) {
                    getRatingSection(this.containerId);
                }
            }

            // wish list, sent to friend, add to gift
            getMiscLinks(this);

            // product tabs
            getTabs(this.containerId);

            // setup bundle/product set
            this.getSubProductsBinding();

        },
        toString: function () {
            return this.model;
        }
    };
}; // Product defintion end
var ProductCache = null;
var quickviewShow = function (options) {
    var url = options.url;
    url = url = util.appendParamToURL(url, 'source', options.source);
    $('#QuickViewDialog').html('');
    var quickViewDialog = dialog.create({
        target: '#QuickViewDialog',
        options: {
            height: 530,
            width: 760,
            dialogClass: 'quickview',
            title: Resources.QUICK_VIEW_POPUP
        }
    });
    quickViewDialog.dialog('open');
    progress.show('#QuickViewDialog');

    $.ajax({
        url: url,
        success: function (data) {
            $(quickViewDialog).html('').append(data);
            util.hiddenData();
            var ProductCache = null;
            var producJson = $('#QuickViewDialog .productjson').data('productjson');
            ProductCache = product(producJson);
            ProductCache.show({containerId: 'pdpMain', append: false, source: options.source});
            addToCart.init();
            $('body').find('.quantityinput').off('keydown').on('keydown', function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                }
            });
            progress.hide();
        }
    });
};
var pdpEvents = {
    init: function () {
        util.hiddenData();
        var producJson = $('body').find('.productjson').data('productjson');
        var sourceValue = $('body').find('.http-source').val();
        ProductCache = product(producJson);
        ProductCache.show({containerId: 'pdpMain', append: false, source: sourceValue});
        $('#tabs').find('a[href="#pdpTab1"]').trigger('click');
        //var getDataOption = $('.product-primary-image').find('a').attr('data-options');
        $('body').find('.quantityinput').on('keydown', function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
            }
        });
        $('#Quantity').keyup(function(e) {
            var key = e.charCode || e.keyCode || e.which || 0;
            if ($.isNumeric($('#Quantity').val()) && (key == 13)) {
                $('#add-to-cart').trigger('click');
            } else if (!$.isNumeric($('#Quantity').val())) {
                $('.addtocartbutton:last').prop('disabled', true);
                $('.addtocart, .addtocartbutton').addClass('disabled');
                return false;
            } else {
                if ($(this).val() < 1) {
                    $('addtocartbutton:last').prop('disabled', true);
                    $('.addtocart').addClass('disabled');
                } else {
                    $('.addtocartbutton:last').prop('disabled', false);
                    $('.addtocart, .addtocartbutton').removeClass('disabled');
                }
            }
        });
        $(document).on('click', '.youtube-list-video a', function () {
            if ($(window).width() > 480 && $(window).width() < 959) {
                util.scrollBrowser($('.tab-sec').offset().top);
            } else if ($(window).width() < 481) {
                util.scrollBrowser($('.mobile-tabs-section .tabsHeader.videoTab').offset().top);
            }
        });
        $(document).on('click', '.video-link', function () {
            if ($(window).width() > 480) {
                util.scrollBrowser($('.tab-sec').offset().top);
                $('#tabs #videoTab').find('a[href="#pdpVideoTab"]').trigger('click');
            } else if ($(window).width() < 481) {
                util.scrollBrowser($('.mobile-tabs-section .tabsHeader.videoTab').offset().top);
                $('.tabsHeader.videoTab').parent('.mobile-tabs-section ').addClass('active');
                if ($('.videoTab').hasClass('loaded')) {
                    return false;
                }
                $('.videoTab').addClass('loaded');
                var target = $('#pdpVideoTab');
                var url = $('#productURL').val();
                ajax.load({
                    url: url,
                    dataType: 'html',
                    callback: function (data) {
                        target.html(data);
                    }
                });
            }
        });
        $('#add-to-cart').bind('click', function () {
            if ($('#Quantity').val() > 0) {
                $('.addedto-cartoverlay').addClass('added-overlay');
                setTimeout(function () {
                    $('.addedto-cartoverlay').removeClass('added-overlay');
                }, 2000);
            }
        });
        $('#QuickViewDialog .product-primary-image').find('.product-image').click(function () {
            return false;
        });
        if (($('.provideo-spec-link').length > 0)) {
            if (!($('.video-link').length > 0)) {
                if ($(window).width() > 480) {
                    $('.productname.h-one-tag').css({
                        'width': 'auto',
                        'margin-bottom': '-26px',
                        'float': 'left',
                        'padding-bottom': '8px'
                    });
                }
            }
        } else {
            if ($(window).width() > 480) {
                $('.productname.h-one-tag').css({'padding-bottom': '4px'});
            }
        }
        $(document).on('click', '.specChart-link', function () {
            if ($(window).width() > 480) {
                util.scrollBrowser($('.tab-sec').offset().top);
                $('#tabs').find('a[href="#specChartTab"]').trigger('click');
            } else if ($(window).width() < 481) {
                util.scrollBrowser($('.mobile-tabs-section .tabsHeader.specTab').offset().top);
                $('.tabsHeader.specTab').parent('.mobile-tabs-section ').addClass('active');
            }
        });
        var pdpRecomendation = function () {
            var pdpRecomendationCarousel = $('.pt_product-details .jcarouselcont .recommendations').find('.pdprecomo-owl');
            pdpRecomendationCarousel.owlCarousel({
                nav: true,
                dots: true,
                navigation: false,
                navRewind: false,
                rewind: false,
                loop: false,
                items: 5,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 2,
                        slideBy: 2
                    },
                    767: {
                        items: 2,
                        slideBy: 2
                    },
                    768: {
                        items: 5,
                        slideBy: 5
                    }
                }
            });
            var viewport = jQuery(window).width();
            var itemCount = jQuery('.owl-carousel .item').length;
            if (
                (viewport >= 959 && itemCount > 5) //desktop
                    || ((viewport >= 481 && viewport < 600) && itemCount > 3) //tablet
                    || (viewport < 480 && itemCount > 2) //mobile
                ) {
                $('.pdprecomo-owl').find('.owl-prev, .owl-next').show();
                $('.pdprecomo-owl').find('.owl-dots').show();

            } else {
                $('.pdprecomo-owl').find('.owl-prev, .owl-next').hide();
                $('.pdprecomo-owl').find('.owl-dots').hide();
            }
            $('.product-listing').find('h2.hide').removeClass('hide');
            var height = $('.owl-item').height();
            $('.pdprecomo-owl').find('.owl-item').find('.product-tile.item').height(height - 100);
            $('.pt_product-details .product-tile .product-image').on('mouseenter', function () {
                var $qvButton = $('#quickviewbutton');
                if ($qvButton.length === 0) {
                    $qvButton = $('<a id="quickviewbutton" class="quickview">' + Resources.QUICK_VIEW + '<i class="fa fa-arrows-alt"></i></a>');
                }
                var $link = $(this).find('.thumb-link');
                $qvButton.attr({
                    'href': $link.attr('href'),
                    'title': $link.attr('title')
                }).appendTo(this);
                $qvButton.off('click').on('click', function (e) {
                    e.preventDefault();
                    var options = {
                        url: $(this).attr('href'), //PREV JIRA PREV-255 :PLP: On Click Quick view navigating to a wrong page when user first changes the swatches. Taking only href.
                        source: 'quickview'
                    };
                    quickviewShow(options);
                });
            });
        };
        setTimeout(pdpRecomendation, 5500);
    }
};

module.exports = pdpEvents;
