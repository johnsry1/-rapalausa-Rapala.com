'use strict';

var ISML = require('dw/template/ISML');

function start(){	
	ISML.renderTemplate('ltkInclude');	
}

exports.Start = start;
exports.Start.public = true;