'use strict';

/**
* Utility functions
*
* @Contributors: patmat,jba-amblique
*
**/

var tokenRegExp = new RegExp("\\$\\{(.+?)\\}","g");

/**
* Replace any instance of ${VAR_NAME} with the the evaluated value of process.env.VAR_NAME
*/
function replaceEnvironmentVariables(original) {
	if(original && typeof original === "string") {
			var result = original.replace(tokenRegExp, function(a,b) {
							var environmentVariableValue = process.env[b];
							if (typeof environmentVariableValue !== 'undefined') {
								environmentVariableValue.replace(/(^\s*)|(\s*$)/,"");
							}
							return environmentVariableValue;
					});

			original = result;
	}
	 return original;
}

exports.replaceEnvVars = replaceEnvironmentVariables;
