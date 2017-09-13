/**
* Purpose:	Submits Order data to Listrak.
* @input Order 				: dw.order.Order
* @output SCACart : String
* @output OrderCart	: String
*/
var ltk = require('int_listrak_controllers/cartridge/scripts/objects/ltk.js');
var Status = require('dw/system/Status');
var Site = require('dw/system/Site');
var ISML = require('dw/template/ISML');
var Pipelet = require('dw/system/Pipelet');
var OrderMgr = require('dw/order/OrderMgr');
var Transaction = require('dw/system/Transaction');

function send()
{
	/* Read the order object from the pipeline dictionary parameter. */
	var orderJSON = "";
	var scaJSON = "";

    var orderNumber = session.custom.OrderNumber;
    var order = OrderMgr.getOrder(orderNumber);
    
	/* If we have an order, prepare the data into an object we can consume. */
	if (order)
	{
		 // Tag order with traking token
		var cookies : dw.web.Cookies = request.getHttpCookies();
		var clickTokenCookie : dw.web.Cookie = cookies._trkt;
		var clickToken : string = "";
		if (clickTokenCookie) {
			Transaction.begin();
			order.custom.ltkSessionID = clickTokenCookie.value;
			Transaction.commit();
		}
		
		/* Load the order, serialize it and set it to the argument to be used client side. */
		var _ltk = new ltk.LTK();
		_ltk.Order.LoadOrder(order);
		orderJSON = _ltk.Order.Serialize();
		
		/* If SCA is enabled, we want to close the session since the cart items were purchased. */
		var enabled = Site.getCurrent().getCustomPreferenceValue('Listrak_SCA_Enabled');
		if (!empty(enabled) && enabled)
		{
			_ltk.SCA.Cart.OrderNumber = order.orderNo;
			_ltk.SCA.LoadBasket(order);		
			
			scaJSON = _ltk.SCA.Serialize();
		}
	}
	
	/* Set the order and sca objects for consumption via client side script. */
	ISML.renderTemplate('ltkSendOrder', { SCACart : scaJSON, OrderCart : orderJSON});
}

function start(order)
{
	/* Set the flag to denote that order info should be sent.
	 * Set the order number so we can retrieve it from other pipelines. */
	session.custom.SendOrder = true;		
	session.custom.OrderNumber = order.orderNo;
}

function clearFlag() {
	session.custom.SendOrder = false;
	session.custom.OrderNumber = null;
}
exports.Clear = clearFlag;
exports.Clear.public = true;
exports.Start = start;
exports.Send = send;
exports.Send.public = true;

