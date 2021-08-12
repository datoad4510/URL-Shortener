const express = require("express");
const app = express();

// const cors = require("cors");
const bodyParser = require("body-parser");

const isValidLink = require("./Javascript/helpers");
const credentials = require("./Javascript/credentials");
const Database = require("./Javascript/db");

const db = new Database();

// middlewares
// app.use(cors());
app.use(bodyParser.json());
app.use(express.static("Public"));

app.get("/", (req, res) => {});

app.post("/post_link", async (req, res) => {
	const URL = req.body.URL;

	try {
		let dbResponse;

		if (isValidLink(URL)) {
			dbResponse = await db.insertUrlIfNotExists(URL);
		}

		res.send(dbResponse);
	} catch (error) {
		console.log(error);
		res.status(404);
	}
});

app.get("/url/:hash", async (req, res) => {
	let document;
	try {
		document = await db.findByHash(req.params.hash);
	} catch (error) {
		// do nothing if invalid id. document will stay undefined
		console.log(error);
	}

	// if document exists
	if (document) {
		const link = document.URL;
		res.redirect(link);
	} else {
		res.status(404).send("Invalid request");
	}
});

app.listen(credentials.port, async () => {
	console.log(`App listening at http://localhost:${credentials.port}`);
	await db.connect();
});
