'use strict';

var CatalogMgr = require('dw/catalog/CatalogMgr');
var HashMap = require('dw/util/HashMap');
var Money = require('dw/value/Money');
var ProductAvailabilityModel = require('dw/catalog/ProductAvailabilityModel');
var Promotion = require('dw/campaign/Promotion');
var PromotionMgr = require('dw/campaign/PromotionMgr');
var Resource = require('dw/web/Resource');
var Site = require('dw/system/Site');
var StringUtils = require('dw/util/StringUtils');
var sanitize = require('~/cartridge/scripts/util/StringHelpers').sanitize;


/**
 * Product Utilities object
 *
 * @param {dw.system.PipelineDictionary} pdict
 */
function ProductUtils (pdict) {
    var _product = pdict.Product || null;
    var _httpMap = pdict.CurrentHttpParameterMap;
    var _variationModel = pdict.hasOwnProperty('CurrentVariationModel') && pdict.CurrentVariationModel ?
        (_product === null ? null : _product.variationModel) :
        pdict.CurrentVariationModel;
    var _variantHierarchy = null;

    /**
     * Gets a Simple Product
     *
     * @param {dw.catalog.Product} item
     * @returns {Object}
     */
    var getSimpleProduct = function (item) {
        var pm = item.isVariant() ? item.masterProduct : item;
        var p = {
            source: _httpMap.source.stringValue,
            start: _httpMap.start.intValue,
            cgid: _httpMap.cgid.stringValue,
            srule: _httpMap.srule.stringValue,
            name: item.name,
            ID: item.ID,
            productSet: item.productSet,
            bundle: item.bundle,
            bundled: item.bundled,
            productSetProduct: item.productSetProduct,
            master: item.isMaster(),
            isOption: item.optionProduct,
            variant: item.isVariant(),
            masterID: pm.ID
        };

        try {
            p.variations = getVariationAttributes(item);
            p.pricing = ProductUtils.getPricing(item);
            /*p.images = {
                large: getImages(item, 'large'),
                small: getImages(item, 'small')
            };*/
            p.images = ProductUtils.getImagesDetails(item, _variationModel);
            p.availability = ProductUtils.getAvailability(item, _httpMap.Quantity.stringValue);
            p.variants = ProductUtils.getVariants(item, _variationModel, _httpMap.Quantity.stringValue);
            p.avLevels = p.availability.levels;
            p.avStatus = p.availability.status;
            p.avStatusQuantity = p.availability.statusQuantity;
            p.inStock = p.availability.inStock;
            p.inStockDate = p.availability.inStockDate;
            var nonCloseoutLowQtyThreshold : Number = empty(dw.system.Site.getCurrent().getCustomPreferenceValue('nonCloseoutLowQtyThreshold')) ? dw.system.Site.getCurrent().getPreferences().describe().getCustomAttributeDefinition("nonCloseoutLowQtyThreshold").getDefaultValue().value : dw.system.Site.getCurrent().getCustomPreferenceValue('nonCloseoutLowQtyThreshold');
            p.nonCloseoutLowQtyThreshold = nonCloseoutLowQtyThreshold;
        }
        catch (error) {
            p.error = error;
        }

        return p;
    };


    var getVariantHierarchy = function () {
        if (_product === null) { return null; }
        var vh = {};
        if (!_variantHierarchy) {
            _variantHierarchy = ProductUtils.getVariantHierarchy(_product, _variationModel, _httpMap.Quantity.stringValue);
        }
        vh = _variantHierarchy;
        return vh;
    };

    /**
     * Gets Variant Availability
     *
     * @param {String} current
     * @param {array} selected
     */
    var getVariantAvailability = function (current, selected) {
        var arr = [], att = null;

        var vh = getVariantHierarchy();
        if (selected.length === 0) {
            for (att in vh.attributes) {
                if (att.selected) {	break; }
            }
            arr.push(att.id + '-' + att.value);
        } else {
            arr = selected;
        }

        if (current) {
            arr.push(current);
        }
        var atts = vh.attributes;
        var attribute = {};
        for (var i = 0,len = arr.length; i < len; i++) {
            attribute = atts[arr[i]];
            if (!attribute) {
                if (current) { arr.pop(); }
                 return false;
            }
            if (!attribute.attributes) { break; }
            atts = attribute.attributes;
        }
        if (current) { arr.pop(); }
        return getAttributeAvailability(attribute);
    };

    var getAttributeAvailability = function (attribute) {
        var available = false;
        if (attribute.attributes) {
            for (var a in attribute.attributes) {
                var att = attribute.attributes[a];
                available = getAttributeAvailability(att);
                if (available) {
                    break;
                }
            }
        } else {
            available = attribute.availability.availableForSale;
        }
        return available;

    };

    var getVariationAttributes = function (item) {

        var variations = {attributes: []};

        if (!item.isVariant() && !item.isMaster()) {
            return variations;
        }

        // get product variations
        // pvm and masterPvm are dw.catalog.ProductVariationModel instances
        var pvm = pdict.CurrentVariationModel ? pdict.CurrentVariationModel : item.variationModel;
        var masterPvm = item.isVariant() ? item.masterProduct.variationModel : item.variationModel;
        var attrIter = pvm.productVariationAttributes.iterator();
        while (attrIter.hasNext()) {
            var attr = attrIter.next();
            var pva = {
                id: attr.getAttributeID(),
                name: attr.getDisplayName(),
                vals: []
            };

            var attValIterator = pvm.getAllValues(attr).iterator();
            while (attValIterator.hasNext()) {
                var attrValue = attValIterator.next();
                //if (!masterPvm.hasOrderableVariants(attr, attrValue)) { continue; }
                var pvaVal = {
                    id: attrValue.ID,
                    val: attrValue.displayValue ? attrValue.displayValue : attrValue.value
                };

                if (pva.id === 'color') {
                    // get images for variation
                    pvaVal.images = {
                        swatch: {}
                    };
                    var large = [];
                    var original = [];
                    var small = [];
                    for each(var img in attrValue.getImages('large')){
                        large.push({
                               url : ProductUtils.refineImageUrl(img,"pdpMain").toString(),
                               alt : img.alt.replace('&quot;','"'),
                               title : img.title.replace('&quot;','"')
                        })
                        original.push({
                               url : ProductUtils.refineImageUrl(img,"zoom2").toString(),
                               alt : img.alt.replace('&quot;','"'),
                               title : img.title.replace('&quot;','"')
                        })
                        small.push({
                               url : ProductUtils.refineImageUrl(img,"pdpAlt").toString(),
                               alt : img.alt.replace('&quot;','"'),
                               title : img.title.replace('&quot;','"')
                        })
                    }

                    // get swatch image
                    var swatch = attrValue.getImage('swatch');
                    if (swatch) {

                        pvaVal.images.swatch = {
                            url:swatch.getURL().toString(),
                            alt:swatch.alt,
                            title:swatch.title
                        };
                    }
                    pvaVal.images.large = large;
                    pvaVal.images.original = original;
                    pvaVal.images.small = small;
                }
                // add the product variation attribute value
                pva.vals.push(pvaVal);

            } /* END pvm.getAllValues(v_att) */

            // add the product variation attribute
            variations.attributes.push(pva);
        } /* END pvm.productVariationAttributes */
       variations.variants = ProductUtils.getVariantsSelect(item, pvm, _httpMap.Quantity.stringValue);
        return variations;
    };

    var getImages = function (o, viewtype) {
        var imgs = o.getImages(viewtype);
        var imgArray = [];
        for (var i = 0, len = imgs.length; i < len; i++) {
            imgArray.push({
                url:imgs[i].getURL().toString(),
                alt:imgs[i].alt,
                title:imgs[i].title
            });
        }
        return imgArray;
    };

    return {
        getSimpleProduct: getSimpleProduct,
        getImages: getImages,
        getPricing: ProductUtils.getPricing,
        getVariationAttributes: getVariationAttributes,
        isVariantAvailable: getVariantAvailability
    };
}
//get product image url
ProductUtils.refineImageUrl = function (image, role) {
    if ( image != null)
    {
           var useITS : Boolean = Site.getCurrent().preferences.custom.useDynamicImagingService;
           if (useITS == null || useITS == false)
           {
                  return image.url;
           } else {
                  var resourceString : String = 'productImage.' + role + '.';
                  var transform : Object = {'scaleWidth': parseInt(Resource.msg(resourceString+'width', 'product', null))};
                  var url:URL = image.getImageURL(transform);
                  return url;
           }
    }

    var nullFile:String = '/images/noimagelarge.png';
    if (role != null)
    {
           nullFile = '/images/noimage'+ Resource.msg('productImage.'+role+'.type', 'product', null) +'.png';
    }
    return URLUtils.staticURL(nullFile);
}
//returns the image detals
ProductUtils.getImagesDetails = function (item, pvm) {
    var images = {};
    var large = [];
    var original=[];
    var small = [];
    var variants = {};
    var zoomvariants = {};
    var varid = '';
    var productimages = '';

    var mainTransform : Object = {'scaleWidth': parseInt(Resource.msg('productImage.pdpMain.width', 'product', null)) };
    var zoomTransform : Object = {'scaleWidth': parseInt(Resource.msg('productImage.zoom2.width', 'product', null)) };
    //var product = item.variationModel.master;
	    for each(var variant in item.getVariants()){
            varid = variant.getID();
            if(variant.custom.variantImage != null){
                if(dw.system.Site.current.ID == 'rapala') {
                  variants[varid] = dw.web.URLUtils.imageURL(variant.custom.variantImage,mainTransform).toString().replace("Sites-rapala-Site/-", "Sites-rapala-Site/Sites-rapala-master");
                  zoomvariants[varid] = dw.web.URLUtils.imageURL(variant.custom.variantImage,zoomTransform).toString().replace("Sites-rapala-Site/-", "Sites-rapala-Site/Sites-rapala-master");
                } else  {
                  variants[varid] = dw.web.URLUtils.imageURL(variant.custom.variantImage,mainTransform).toString().replace("Sites-rapalaEU-Site/-", "Sites-rapalaEU-Site/Sites-rapala-master-eu");
                  zoomvariants[varid] = dw.web.URLUtils.imageURL(variant.custom.variantImage,zoomTransform).toString().replace("Sites-rapalaEU-Site/-", "Sites-rapalaEU-Site/Sites-rapala-master-eu");
                 }
           } else {
               if (dw.system.Site.current.ID == 'rapalaEU') {
                   variants[varid] = ProductUtils.refineImageUrl(variant.getImage('large'),"zoom2").toString();
                   zoomvariants[varid] = ProductUtils.refineImageUrl(variant.getImage('large'),"zoom2").toString();
               }
           }
	    }

    images.variants = variants;
    images.zoomvariants = zoomvariants;

    for each(var img in item.getImages('large')){
           large.push({
                  url : ProductUtils.refineImageUrl(img,"pdpMain").toString(),
                  alt : img.alt.replace('&quot;','"'),
                  title : img.title.replace('&quot;','"')
           })
           original.push({
                  url : ProductUtils.refineImageUrl(img,"zoom2").toString(),
                  alt : img.alt.replace('&quot;','"'),
                  title : img.title.replace('&quot;','"')
           })
           small.push({
                  url : ProductUtils.refineImageUrl(img,"pdpAlt").toString(),
                  alt : img.alt.replace('&quot;','"'),
                  title : img.title.replace('&quot;','"')
           })
    }
    images.large = large;
    images.original = original;
    images.small = small;
    return images;
}

/**
 * Provides Product availability status
 *
 * @param {dw.catalog.Product} item - Product instance
 * @param {String|Number} quantity - Quantity to evaluate
 * @returns {Object}
 */
ProductUtils.getAvailability = function (item, quantity) {
	if(empty(quantity)){
		quantity = 0;
	}
	var qty = isNaN(quantity) ? 1 : (parseInt(quantity)).toFixed();
    /* product availability */
    var avm = item.availabilityModel;
    var invRecordEmpty = !avm.inventoryRecord || avm.inventoryRecord === {};
    var ats = invRecordEmpty ? 0 : avm.inventoryRecord.ATS.value.toFixed();
    var inStockDate = invRecordEmpty || !avm.inventoryRecord.inStockDate ? '' :
        avm.inventoryRecord.inStockDate.toDateString();
    var availability = {
        status: avm.availabilityStatus,
        statusQuantity:((qty < 1) ? 1 : qty),
        inStock: avm.inStock,
        ats: ats,
        inStockDate: inStockDate,
        availableForSale: avm.availability > 0,
        levels: {}
    };

    var avmLevels = avm.getAvailabilityLevels((qty < 1) ? 1 : qty);
    availability.isAvailable = avmLevels.notAvailable.value === 0;
    availability.inStockMsg = Resource.msgf('global.quantityinstock', 'locale', '', avmLevels.inStock.value.toFixed());
    availability.preOrderMsg = Resource.msgf('global.quantitypreorder', 'locale', '', avmLevels.preorder.value.toFixed());
    availability.backOrderMsg = Resource.msgf('global.quantitybackorder', 'locale', '', avmLevels.backorder.value.toFixed());
    if (avm && avm.inventoryRecord && avm.inventoryRecord.inStockDate) {
        availability.inStockDateMsg = Resource.msgf('global.inStockDate', 'locale', '', avm.inventoryRecord.inStockDate.toDateString());
    }

    availability.levels[ProductAvailabilityModel.AVAILABILITY_STATUS_IN_STOCK] = avmLevels.inStock.value;
    availability.levels[ProductAvailabilityModel.AVAILABILITY_STATUS_PREORDER] = avmLevels.preorder.value;
    availability.levels[ProductAvailabilityModel.AVAILABILITY_STATUS_BACKORDER] = avmLevels.backorder.value;
    availability.levels[ProductAvailabilityModel.AVAILABILITY_STATUS_NOT_AVAILABLE] = avmLevels.notAvailable.value;

    return availability;
};

/**
 * Jsonifies a Product instance
 *
 * @param {dw.catalog.Product} item
 * @param {dw.system.PipelineDictionary} args
 * @returns {String}
 */
ProductUtils.getProductJson = function (item, args) {
    var pu = new ProductUtils(args);
    var sp = pu.getSimpleProduct(item);
    var json = JSON.stringify(sp);
    return json;
};

/**
 * Gets pricing
 *
 * @param {dw.catalog.Product} item
 * @returns {Object}
 */
ProductUtils.getPricing = function (item) {
    /* product pricing
    *
    * There is currently no way to check if the list pricebook is actually
    * assigned to the site.  Therefore, we do a sanity check:  If the
    * product has no price according to standard price lookup rules,
    * then we know the list price book is not assigned to the site.
    * (The converse is not true so this check is not perfect.)
    *
    * Todo:  Improve this logic.
    *
    * The check after the '||' above is to only consider standard prices for cases where the site and
    * the session currencies are the same. This is because currently the "listPriceDefault" property
    * can not be set per currency.
    */

    var priceModel = item.getPriceModel();
    var standardPrice = null;

    /**
     * According to multiple currency change we remove second verification for default site currency
     * NOTE: (old if statement was)
     *
     * if ((!priceModel.getPrice().available) || (!Site.getCurrent().getDefaultCurrency().equals(session.getCurrency().getCurrencyCode())))
     */
    if (!priceModel.getPrice().available) {
        standardPrice = Money.NOT_AVAILABLE;
    } else if (('listPriceDefault' in Site.current.preferences.custom) && Site.current.preferences.custom.listPriceDefault) {
        var currencyPriceBookId = session.getCurrency().getCurrencyCode().toLowerCase() + Site.current.preferences.custom.listPriceDefault;
        standardPrice = priceModel.getPriceBookPrice(currencyPriceBookId);
    } else {
        standardPrice = priceModel.getPriceBookPrice('list-prices');
    }

    var salesPrice = priceModel.getPrice();
    var showStdPrice = standardPrice.available && salesPrice.available && standardPrice.compareTo(salesPrice) === 1;
    var promoPrice = Money.NOT_AVAILABLE;
    var isPromoPrice = false;

    var promos = PromotionMgr.activeCustomerPromotions.getProductPromotions(item);
    if (promos && promos.length) {
        var promo = promos[0];
        var promoClass = promo.getPromotionClass();
        if (promoClass && promoClass.equals(Promotion.PROMOTION_CLASS_PRODUCT)) {
            if (item.optionProduct) {
                promoPrice = (pdict.CurrentOptionModel) ?
                     promo.getPromotionalPrice(item, pdict.CurrentOptionModel) :
                     promo.getPromotionalPrice(item, item.getOptionModel());
            } else {
                promoPrice = promo.getPromotionalPrice(item);
            }
        }

        if (promoPrice.available && salesPrice.compareTo(promoPrice) !== 0) {
            showStdPrice = true;
            isPromoPrice = true;
            standardPrice = salesPrice;
            salesPrice = promoPrice;
        }
    }

    var pricing = {
        showStandardPrice: showStdPrice,
        isPromoPrice: isPromoPrice,
        standard: standardPrice.value,
        formattedStandard: StringUtils.formatMoney(standardPrice),
        sale: salesPrice.value,
        formattedSale: StringUtils.formatMoney(salesPrice),
        salePriceMoney: salesPrice,
        standardPriceMoney: standardPrice,
        quantities: []
    };

    var priceTable = priceModel.getPriceTable();
    for (var qty in priceTable.getQuantities()) {
        pricing.quantities.push({
            unit: !(qty.unit) ? '' : qty.unit,
            value: !qty.value ? 0 : qty.value.toFixed()
        });
    }

    return pricing;
};

/**
 * Gets Simple Bonus Product
 *
 * @param {dw.catalog.Product} item
 * @param {dw.order.ProductLineItem} lineItem
 * @returns {Object}
 */
ProductUtils.getSimpleBonusProduct = function (item, lineItem) {
    var p = {
        name: item.name,
        ID: item.ID,
        qty: lineItem.quantityValue,
        lineItemCtnrUUID: lineItem.lineItemCtnr.UUID,
        variations: {attributes: []},
        options: {attributes: []}
    };

    // if product is variant or master, get selected  attribute definitions
    if (item.isVariant() || item.isMaster()) {
        var attDefs = item.variationModel.getProductVariationAttributes();
        for (var i = 0; i < attDefs.length; i++) {
            var attDef = attDefs[i];
            var selectedValue = item.variationModel.getSelectedValue(attDef);
            // push variation attributes to simple object
            p.variations.attributes.push({
                displayID: attDef.ID,
                displayName: attDef.displayName,
                selectedDisplayValue: selectedValue.displayValue,
                selectedValue: selectedValue.value});
        }
    }

    // if lineItem or optionProductLineItems is empty, return simple object
    if (!lineItem || !lineItem.optionProductLineItems) {
        return p;
    }

    // otherwise get option product line items
    var optionLineItems = lineItem.optionProductLineItems;
    for (var j = 0; j < optionLineItems.length; j++) {
        var optionLineItem = optionLineItems[j];
        var option = item.optionModel.getOption(optionLineItem.optionID);
        // push option attributes to simple object
        p.options.attributes.push({
            displayID: optionLineItem.optionID,
            htmlName: !option ? '' : option.htmlName,
            selectedDisplayValue: optionLineItem.lineItemText,
            selectedValue: optionLineItem.optionValueID
        });
    }

    // return simple object
    return p;
};

/**
 * Provides JSON string of a Simple Bonus Product
 *
 * @param {dw.catalog.Product} item
 * @param {dw.order.ProductLineItem} lineItem
 * @returns {String}
 */
ProductUtils.getBonusProductJson = function (item, lineItem) {
    var o = {data: ProductUtils.getSimpleBonusProduct(item, lineItem)};
    return JSON.stringify(o);
};

/**
 * Gets selected color
 *
 * @param {dw.catalog.Product} product
 * @param {dw.catalog.ProductVariationModel} pvm
 * @returns {dw.catalog.ProductVariationAttributeValue}
 */
ProductUtils.getSelectedColor = function (product, pvm) {
    if (product === null) { return null; }
    var vm = pvm === null ? product.variationModel : pvm;
    var cvm = product.isVariant() ? product.masterProduct.variationModel : product.variationModel;

    var selectedColor = null;
    var colorVA = vm.getProductVariationAttribute('color');
    if (colorVA === null) { return null; }

    selectedColor = vm.getSelectedValue(colorVA);

    if (selectedColor) {
        return selectedColor;
    } else {
        var variant = product;
        if (!product.isVariant()) {
            if (vm.defaultVariant) {
                variant = vm.defaultVariant;
            } else if (vm.variants.length > 0) {
                variant = vm.variants[0];
            }
        }

        var cv = vm.getVariationValue(variant, colorVA);
        if (!cvm.hasOrderableVariants(colorVA, cv)) {
            var found = false;
            for (var i = 0, il = vm.variants.length; i < il; i++) {
                cv = cvm.getVariationValue(vm.variants[i], colorVA);
                if (cvm.hasOrderableVariants(colorVA, cv)) {
                    found = true;
                    break;
                }
            }
        }
        return cv;
    }
};

/**
 * Gets a Product Variant by color
 *
 * @param {dw.catalog.Product} prod
 * @param {String} colorId
 * @returns {dw.catalog.Product}
 */
ProductUtils.getVariantForColor = function (prod, colorId) {
    var newProduct = prod;
    var variants = prod.getVariants();

    if (variants === null || variants.length === 0) {
        return newProduct;
    }

    for (var i = 0, il = variants.length; i < il; i++) {
        var p = variants[i];
        if (p.onlineFlag && (!colorId || p.custom.color === colorId)) {
            newProduct = p;
        }
    }

    return newProduct;
};

/**
 * Gets query string
 *
 * @param {dw.web.HttpParameterMap} map
 * @param {Array} fields
 * @returns {String}
 */
ProductUtils.getQueryString = function (map, fields) {
    var parms = [];
    for (var i = 0, il = fields.length; i < il; i++) {
        var key = fields[i];
        if (!key || !map.isParameterSubmitted(key)) { continue; }

        var parm = map.get(key);
        if (!parm || parm.stringValue.length === 0) { continue; }

        // only get here if we have a match
        parms.push(sanitize(key) + '=' + sanitize(parm.stringValue));
    }
    return parms.length ? parms.join('&') : '';
};

/**
 * Indicates whether the Compare checkbox field is enabled
 *
 * @param {String} catId
 * @returns {Boolean}
 */
ProductUtils.isCompareEnabled = function (catId) {
    var cat = CatalogMgr.getCategory(catId);
    while (cat !== null) {
        if ('enableCompare' in cat.custom && cat.custom.enableCompare) {
            return true;
        }
        cat = cat.parent;
    }
    return false;
};

/**
 * Gets Variants
 *
 * @param {dw.catalog.Product} item
 * @param {dw.catalog.ProductVariationModel} pvm
 * @param {String|Number} quantity
 * @returns {Object}
 */
ProductUtils.getVariants = function (item, pvm, quantity) {
    var variants = {};
    if (!item.isVariant() && !item.isMaster()) {
        return variants;
    }

    for (var i = 0,len = pvm.variants.length; i < len; i++) {

        var v = pvm.variants[i];
        var variant = {
            id: v.ID,
            attributes: {},
            availability: ProductUtils.getAvailability(v, quantity),
            pricing: ProductUtils.getPricing(v)
        };
        // attributes
        var attKey = [];
        for (var a = 0, alen = pvm.productVariationAttributes.length; a < alen; a++) {
            var att = pvm.productVariationAttributes[a];
            var variationValue = pvm.getVariationValue(v, att);
            if (!variationValue) { continue; }
            attKey.push(att.ID + '-' + variationValue.value);
            variant.attributes[att.ID] = !variationValue.displayValue ? variationValue.value : variationValue.displayValue;
        }

        variants[attKey.join('|')] = variant;
    }

    return variants;
};

ProductUtils.getVariantsSelect = function (item, pvm, quantity) {
    var variants = {};
    if (!item.isVariant() && !item.isMaster()) {
        return variants;
    }

    for (var i = 0,len = pvm.variants.length; i < len; i++) {

        var v = pvm.variants[i];
        var variant = {
            id: v.ID,
            attributes: {},
            availability: ProductUtils.getAvailability(v, quantity),
            pricing: ProductUtils.getPricing(v)
        };
        variant.ATS = variant.availability.ats;
        variant.avLevels = variant.availability.levels;
        variant.avStatus = variant.availability.status;
        variant.avStatusQuantity = variant.availability.statusQuantity;
        variant.inStock = variant.availability.inStock;
        variant.inStockDate = variant.availability.inStockDate;
        var nonCloseoutLowQtyThreshold : Number = empty(dw.system.Site.getCurrent().getCustomPreferenceValue('nonCloseoutLowQtyThreshold')) ? dw.system.Site.getCurrent().getPreferences().describe().getCustomAttributeDefinition("nonCloseoutLowQtyThreshold").getDefaultValue().value : dw.system.Site.getCurrent().getCustomPreferenceValue('nonCloseoutLowQtyThreshold');
        variant.nonCloseoutLowQtyThreshold = nonCloseoutLowQtyThreshold;
        variant.earlyBirdMessage = item.custom.earlyBirdMessage;
        // attributes
        var attKey = [];
        //attKey.push(a);
        for (var a = 0, alen = pvm.productVariationAttributes.length; a < alen; a++) {
            var att = pvm.productVariationAttributes[a];
            var variationValue = pvm.getVariationValue(v, att);
            if (!variationValue) { continue; }
            //attKey.push(att.ID + '-' + variationValue.value);
            //attKey.push(a);
            variant.attributes[att.ID] = !variationValue.displayValue ? variationValue.value : variationValue.displayValue;
        }

        variants[i] = variant;
    }

    return variants;
};

/**
 * Gets Variant Hierarchy
 *
 * @param {dw.catalog.Product} item
 * @param {dw.catalog.ProductVariationModel} productVariationModel
 * @param {String|Number} quantity
 * @returns {Object}
 */
ProductUtils.getVariantHierarchy = function (item, productVariationModel, quantity) {
    var variants = {};
    if (!item.isVariant() && !item.isMaster()) { return variants; }

    var allVariants = productVariationModel.variants;
    var allVariationAttributes = productVariationModel.productVariationAttributes;
    for (var i = 0, numVariants = allVariants.length; i < numVariants; i++) {
        var variant = allVariants[i];
        var target = variants;
        // attributes
        for (var j = 0, numVariationAttributes = allVariationAttributes.length; j < numVariationAttributes; j++) {
            var attribute = allVariationAttributes[j];
            var variationValue = productVariationModel.getVariationValue(variant, attribute);
            if (!variationValue) { continue; }
            var key = attribute.ID + '-' + variationValue.value;
            if (!('attributes' in target)) {
                target.attributes = {};
            }
            if (!(key in target.attributes)) {
                target.attributes[key] = {
                    id: attribute.ID,
                    value: variationValue.value,
                    display: !variationValue.displayValue ? variationValue.value : variationValue.displayValue,
                    selected: productVariationModel.isSelectedAttributeValue(attribute, variationValue)
                };
            }
            target = target.attributes[key];
        }
        target.productId = variant.ID;
        target.availability = ProductUtils.getAvailability(variant, quantity);
        target.pricing = ProductUtils.getPricing(variant);
    }

    return variants;
};

/**
 * Gets Selected Attributes
 *
 * @param {dw.catalog.ProductVariationModel} pvm
 * @returns {Object}
 */
ProductUtils.getSelectedAttributes = function (pvm) {
    var atts = {},
        attDefs = pvm.getProductVariationAttributes();

    for (var l = 0; l < attDefs.length; l++) {
        var attribute = attDefs[l];
        var selectedValue = pvm.getSelectedValue(attribute);
        atts[attribute.ID] = {
            displayName: attribute.displayName,
            value: selectedValue ? selectedValue.value : '',
            displayValue: selectedValue ? selectedValue.displayValue : ''
        };
    }
    return atts;
};

/**
 * Gets Default Variant
 *
 * @param {dw.catalog.ProductVariationModel} pvm
 * @returns {dw.catalog.Variant}
 */
ProductUtils.getDefaultVariant = function (pvm) {
    var variant = pvm.selectedVariant;
    if (variant) { return variant; }

    var attDefs = pvm.getProductVariationAttributes();
    var map = new HashMap();

    for (var i = 0, len = attDefs.length; i < len; i++) {
        var attribute = attDefs[i];
        var selectedValue = pvm.getSelectedValue(attribute);
        if (selectedValue && selectedValue.displayValue.length > 0) {
            map.put(attribute.ID,selectedValue.ID);
        }
    }

    var variants = pvm.getVariants(map);
    for (var k = 0; k < variants.length; k++) {
        var p = variants[k];
        if (p.onlineFlag && p.availabilityModel.availability > 0) {
            return p;
        }
    }
    return null;
};

ProductUtils.hasInStockVariants = function (product) {
    var hasInStockVariants = false;
    var masterPvm = product.getVariationModel();
    var attrIter = masterPvm.productVariationAttributes.iterator();
    while (attrIter.hasNext()) {
        var attr = attrIter.next();
        var pva = {
            id: attr.getAttributeID(),
            name: attr.getDisplayName(),
            vals: []
        };
        var attValIterator = masterPvm.getAllValues(attr).iterator();
        while (attValIterator.hasNext()) {
            var attrValue = attValIterator.next();
            if (masterPvm.hasOrderableVariants(attr, attrValue)) { 
                hasInStockVariants = true;
                break;
            }
        }
        if (hasInStockVariants) {
            break;
        }
    }
    return hasInStockVariants;
};

ProductUtils.getProductType = function (product) {
    var productType;
    if (product.master) {
        productType = 'master';
    } else if (product.variant) {
        productType = 'variant';
    } else if (product.variationGroup) {
        productType = 'variationGroup';
    } else if (product.bundle) {
        productType = 'bundle';
    } else if (product.productSet) {
        productType = 'set';
    } else {
        productType = 'standard';
    }
    return productType;
};

module.exports = ProductUtils;
