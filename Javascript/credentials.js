const result = require("dotenv").config();

if (result.error) {
	// throw result.error;
}

const credentials = {
	username: process.env.UNAME,
	password: process.env.PWORD,
	port: process.env.PORT,
};

module.exports = credentials;
