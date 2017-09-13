/**
* Purpose: Container for holding other Listrak Objects used in the submission of information to Listrak.	
*/
var util = require('~/cartridge/scripts/objects/ltkUtil.js');
var sca = require('~/cartridge/scripts/objects/ltkSCA.js');
var order = require('~/cartridge/scripts/objects/ltkOrder.js');
var activity = require('~/cartridge/scripts/objects/ltkActivityTracker.js');

/* Object that holds every kind of data object we need to send to Listrak. */
function LTK() {
    this.SCA = new sca._SessionTracker();
    this.Exception = new util._LTKException();
	this.Order = new order.ltkOrder();
	this.AT = new activity._ActivityTracker();
}

exports.LTK = LTK;