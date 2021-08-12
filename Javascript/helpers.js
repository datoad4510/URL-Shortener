const validUrl = require("valid-url");

function isValidLink(URL) {
	return (
		typeof validUrl.isHttpUri(URL) !== "undefined" ||
		typeof validUrl.isHttpsUri(URL) !== "undefined"
	);
}

module.exports = isValidLink;
