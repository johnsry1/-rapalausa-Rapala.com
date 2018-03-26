/**
* This script updates the orders contained in the file downloaded from sftp.
*/

/* API Includes */
var dwsystem = require('dw/system');
var dworder = require('dw/order');
var dwutil = require('dw/util');
var dwio = require('dw/io');

var Transaction = require('dw/system/Transaction');

var contants = {
    SHIPMENT_STATUS_SHIPPED: 'SHIPPED',
    POST_PROCESS_ACTION_DELETE: 'DELETE',
    POST_PROCESS_ACTION_ARCHIVE: 'MOVE_TO_ARCHIVE'
};

var Status = dwsystem.Status;
var FileUtils = require('~/cartridge/scripts/util/FileUtils');
var logger = dwsystem.Logger.getLogger('orderstatus_update', 'orderstatus');

/**
 * Retrieves order statuses from file and updates orders.
 * 
 * @param {dw.util.HashMap} args
 * @param {dw.job.JobStepExecution} jobStepExecution
 * @returns {dw.system.Status}
 */
function execute(args, jobStepExecution) {
    var directory = new dwio.File(dwio.File.IMPEX + dwio.File.SEPARATOR + args.get('targetFolder'));
    var fileList = FileUtils.getFolderFiles(directory, args.get('filePattern'));
    var archiveFolder = args.get('archiveFolder');
    var deleteFile = args.get('deleteFile');

    while (fileList.hasNext()) {
        var file = fileList.next();

        try {
            if (file.exists()) {
                var fileReader = new dwio.FileReader(file, 'UTF-8');
                var xmlReader = new dwio.XMLStreamReader(fileReader);
                var orders = new dwutil.ArrayList();

                while (xmlReader.hasNext()) {
                    var element = xmlReader.next();

                    if (element == dwio.XMLStreamConstants.START_ELEMENT) {
                        var elementName = xmlReader.getLocalName();

                        if ('order'.equalsIgnoreCase(elementName)) {
                            var orderObj = xmlReader.getXMLObject();
                            default xml namespace = orderObj.namespace();
                            var order = {
                                orderId: orderObj.attribute('order-no').toString(),
                                shipment: getShipmentObject(orderObj),
                                sfccOrderStatuses: getSFCCOrderStatuses(orderObj)
                            };
                            orders.push(order);
                        }

                    }
                }

                xmlReader.close();
                fileReader.close();
                updateOrderStatus(orders);

                switch (deleteFile) {
                    case contants.POST_PROCESS_ACTION_DELETE:
                        file.remove();
                        break;
                    case contants.POST_PROCESS_ACTION_ARCHIVE:
                        FileUtils.moveToArchiveAndZip(file, archiveFolder);
                        break;
                }
            }
        } catch (e) {
            var logMessage = dwutil.StringUtils.format('Order Status Update Error: {0}', e.message);
            logger.error(logMessage);
            return new Status(Status.ERROR);
        }

    }

    return new Status(Status.OK);
}

/**
* Returns shipment object.
* @param {XML} orderObj
* @return {Object}
*/
function getShipmentObject(orderObj) {
    var shipmentXMLObj = orderObj.child('shipment');
    var shipmentObj = {
        status: shipmentXMLObj.child('shipment-status').toString(),
        plis: getProductLineItems(shipmentXMLObj.child('product-line-items')),
        carrierId: shipmentXMLObj.child('shipment-carrier-id').toString(),
        trackingId: shipmentXMLObj.child('shipment-tracking-no').toString(),
        shippedDate: shipmentXMLObj.child('shipment-shipped-date').toString()
    };

    return shipmentObj;
}

/**
* Returns SFCC order statuses object.
* @param {XML} orderObj
* @return {Object}
*/
function getSFCCOrderStatuses(orderObj) {
    var orderStatuses = {
            sfccOrderStatus: orderObj.child('sfcc-order-status').toString(),
            sfccOrderPaymentStatus: orderObj.child('sfcc-order-payment-status').toString(),
            sfccOrderShippingStatus: orderObj.child('sfcc-order-shipping-status').toString(),
            sfccShipmentStatus: orderObj.child('shipment').child('sfcc-shipment-status').toString()
    }

    return orderStatuses;
}

/**
* Returns product line items array list.
* @param {XML} orderObj
* @return {dw.util.ArrayList}
*/
function getProductLineItems(lineItems) {
    var plis = new dwutil.ArrayList();
    var lineItemsXMLObj = lineItems.child('product-line-item');

    for each (var elem in lineItemsXMLObj) {
        var item = {
            'productId': elem.child('product-id').toString(),
            'shippedQty': elem.child('shipped-qty').toString(),
            'productStatus': elem.child('product-status').toString()
        };
        plis.push(item);
    }

    return plis;
}

/**
 * Return list of available order items, depends on shipment status
 * 
 * @param xmlOrder xml order object
 * @param availableProductStatuses array of available product statuses
 * @returns array of product line items from xmlOrder object
 */
function prepareOrderLineItemsForCheetah(xmlOrder, availableProductStatuses) {
    var products = new Array();
    for each(var productItem in xmlOrder.shipment.plis) {
        if (availableProductStatuses.contains(productItem.productStatus)) {
            products.push(productItem);
        }
    }
    
    return products;
}


/**
 * Execute Cheetah notification hook according shipment.custom.status attribute
 * 
 * @param statusCode : String status code from xml
 * @param order : dw.order order object
 * @returns
 */
function executeCheetahnotificationHook(statusCode, order, xmlOrderData) {
    switch(statusCode) {
        case "21" :
            var productItems = prepareOrderLineItemsForCheetah(xmlOrderData, new dw.util.ArrayList("21", "20", "40"));
            dw.system.HookMgr.callHook('dw.shop.experian.notification.partshipment', 'PartShipment', {order: order, productItems: productItems});
            break;
        case "25":
        case "30":
            var productItems = prepareOrderLineItemsForCheetah(xmlOrderData, new dw.util.ArrayList("25", "30"));
            dw.system.HookMgr.callHook('dw.shop.experian.notification.refund', 'Refund', {order: order, productItems: productItems});
            break;
        case "40":
            var productItems = prepareOrderLineItemsForCheetah(xmlOrderData, new dw.util.ArrayList("40"));
            dw.system.HookMgr.callHook('dw.shop.experian.notification.cancel', 'Cancel', {order: order, productItems: productItems});
            break;
    }
}
/**
* Updates order status.
* @param {dw.util.ArrayList} orders
*/
function updateOrderStatus(orders) {
    for each (var order in orders) {
        var dwOrder = dworder.OrderMgr.getOrder(order.orderId);

        if (empty(dwOrder)) {
            var logMessage = dwutil.StringUtils.format('Order {0} was not found', order.orderId);
            logger.error(logMessage);
        } else {

        	//set pli status to order status if no pli status provided
        	if (empty(order.shipment.plis) && order.shipment && order.shipment.status) {
                for each (var pli in dwOrder.allProductLineItems) {
                    pli.custom.shippingStatus = order.shipment.status;
                }
            } else {
            	//set product line item status & qty
                for each (var item in order.shipment.plis) {
                    for each (var pli in dwOrder.allProductLineItems) {
                        if (pli.productID == item.productId) {
                        	if (item.productStatus) {
                        		pli.custom.shippingStatus = item.productStatus;
                        	}
                        	if (item.shippedQty) {
                        		pli.custom.shippedQty = item.shippedQty;
                        	}
                            break;
                        }
                    }
                }
                //set order status
                if (order.shipment && order.shipment.status) {
                	dwOrder.defaultShipment.custom.status = order.shipment.status;
                	executeCheetahnotificationHook(order.shipment.status, dwOrder, order);
                }
                if (order.shipment && !empty(order.shipment.carrierId)) {
                	dwOrder.defaultShipment.custom.shipmentCarrierID = order.shipment.carrierId;
                }
                if (order.shipment && !empty(order.shipment.trackingId)) {
                	
                	dwOrder.defaultShipment.custom.shipmentTrackingNo = order.shipment.trackingId;
                }
                if (order.shipment && !empty(order.shipment.shippedDate)) {
                	
                	dwOrder.defaultShipment.custom.shipmentShippedDate = order.shipment.shippedDate;
                }
            }
        	
        	try {
        	    Transaction.begin();
            	if (!empty(order.sfccOrderStatuses) && order.sfccOrderStatuses.sfccOrderStatus) {
           	        dwOrder.setStatus(order.sfccOrderStatuses.sfccOrderStatus);
            	}
                if (!empty(order.sfccOrderStatuses) && order.sfccOrderStatuses.sfccOrderPaymentStatus) {
                    dwOrder.setPaymentStatus(order.sfccOrderStatuses.sfccOrderPaymentStatus);
                }
                if (!empty(order.sfccOrderStatuses) && order.sfccOrderStatuses.sfccOrderShippingStatus ) {
                    dwOrder.setShippingStatus(order.sfccOrderStatuses.sfccOrderShippingStatus);
                }
                if (!empty(order.sfccOrderStatuses) && order.sfccOrderStatuses.sfccShipmentStatus) {
                    dwOrder.defaultShipment.setShippingStatus(order.sfccOrderStatuses.sfccShipmentStatus);
                }
                Transaction.commit();
        	} catch (e) {
        	    Transaction.commit();
        	}
        }
    }
}

/** Exported methods **/
module.exports = {
    execute: execute
};
