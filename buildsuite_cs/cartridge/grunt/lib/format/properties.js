/**
 * If a string is "true" "TRUE", or "  TrUE" convert to boolean type else
 * leave as is
 */
function coerceStrings(original) {
	var value = original.toLowerCase().trim();

	if (value === 'true' || value === 'false') {
		return Boolean(value);
	}

	return original;
}

exports.convert = function(text) {
	if (!text) {
		return {};
	}

	text = text.replace(/\\\r?\n\s*/g, '');

	return text.split(/\r?\n/g).reduce(function(memo, line) {
		line = line.trim();

		// If the line is commented out, simply skip over.
		if (line.indexOf('#') === 0 || line.indexOf('!') === 0) {
			return memo;
		}

		var props = line.split(/\=(.+)?/);
		var name = props[0] ? props[0].trim() : '';
		var value = props[1] ? props[1].trim() : '';

		if (name) {
			memo[name] = coerceStrings(value);
		}

		return memo;
	}, {});
};
