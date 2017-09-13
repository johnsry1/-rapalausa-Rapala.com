/**
*	Purpose: 	Stores customer activity to the custom session
*				for consumption by client side script.
*/
/* Object used to mimic the native client side JS Activity Tracker. */
function _ActivityTracker() 
{
	/* Public methods to add activity (page browse, product browse, quickview product
	browse that is later sent up to Listrak via client side JS calls. */
    
    /* Adds a product browse activity to be sent up to Listrak later via client side JS. */
    this.AddProductBrowse = function(Sku, Data) {
        if (typeof Sku == "string") {
            Sku = Sku.trim();
            if (Sku.length > 0) {
                session.custom.ProdBrowse = Sku;             
            }
        }
    };
	
	/* Adds a quickview product browse activity to a sku array to be sent up to Listrak later via JS. */
	this.AddProductQuickBrowse = function(Sku, Data) {
		if (typeof Sku == "string") {
            Sku = Sku.trim();
            if (Sku.length > 0) {
            	var quickViews = session.custom.QuickViewSkus;
            	
            	if (quickViews != null && quickViews.length > 0)
            		session.custom.QuickViewSkus = quickViews + ',' + Sku;
            	else 
            		session.custom.QuickViewSkus = Sku;           
            }
        }
	};	
}

exports._ActivityTracker = _ActivityTracker;
