/**
* Purpose:	Sets a flag to send (or not send) cart information to Listrak via client side scripting.
*
* @input  Basket : dw.order.Basket
*/
var Site = require('dw/system/Site');
var Listrak = require('~/cartridge/scripts/objects/ltk.js');
var ISML = require('dw/template/ISML');
var Pipelet = require('dw/system/Pipelet');
var BasketMgr = require('dw/order/BasketMgr');

exports.SendSCA = function sendSca()
{
	var enabled = Site.getCurrent().getCustomPreferenceValue('Listrak_SCA_Enabled');	
	if (!empty(enabled) && enabled)
	{
	    var params = request.httpParameterMap;
	    var format = params.format.stringValue == null ? '' : params.format.stringValue.toLowerCase();
	    session.custom.SCAFormat = format;
		session.custom.SendSCA = true;
	}
}

function clearFlag() {
	session.custom.SendSCA = false;
	session.custom.SCAFormat = '';
}
exports.ClearFlag = clearFlag;
exports.ClearFlag.public = true;

function renderSca() {
	var json = "";
	var _ltk = new Listrak.LTK();
    
    var Basket = BasketMgr.getCurrentBasket();
    
    if (!empty(Basket) && Basket.allProductLineItems.length > 0 ) 
    {
    	if (_ltk.SCA.LoadBasket(Basket))
    	{
    		json = _ltk.SCA.Serialize();
    	} 
    }
    else 
    {
    	_ltk.SCA.ClearCart();
    	json = _ltk.SCA.Serialize();
    }
    ISML.renderTemplate('ltkSendSCA', { SCACart : json});	    
}
exports.RenderSca = renderSca
exports.RenderSca.public = true;