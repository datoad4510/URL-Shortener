const result = require("dotenv").config();

if (result.error) {
	throw result.error;
}

var validUrl = require("valid-url");

const path = require("path");
const bodyParser = require("body-parser");

const { urlencoded } = require("express");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const username = process.env.UNAME;
const password = process.env.PWORD;

// const cors = require("cors");
// app.use(cors());

app.use(bodyParser.json());
app.use(express.static("Public"));

const { MongoClient, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${username}:${password}@cluster0.tnsni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function insertIfNotExists(URL) {
	return await client
		.db("database")
		.collection("URLs")
		.findOneAndUpdate(
			{ URL: URL },
			{ $setOnInsert: { URL: URL } },
			{
				upsert: true,
				returnDocument: "after",
			}
		)
		.then((data) => data.value);
}

client.connect(async (err) => {
	console.log("Connected to MongoDB Atlas!");
});

app.get("/", (req, res) => {});

app.post("/post_link", async (req, res) => {
	const URL = req.body.URL;

	let dbResponse;
	try {
		const isValidUrl =
			typeof validUrl.isHttpUri(URL) !== "undefined" ||
			typeof validUrl.isHttpsUri(URL) !== "undefined";

		if (isValidUrl) {
			dbResponse = await insertIfNotExists(URL);
		}
	} catch (error) {
		console.log(error);
	}

	res.send(dbResponse);
});

app.get("/:_id", async (req, res) => {
	const database = client.db("database");
	const collection = database.collection("URLs");

	let id;
	let document;

	try {
		id = ObjectId(req.params._id);
		document = await collection.findOne({
			_id: id,
		});
	} catch (error) {
		// do nothing if invalid id. document will stay undefined
	}

	// if document exists
	if (document) {
		const link = document.URL;
		res.redirect(link);
	} else {
		res.send("Invalid link!");
	}
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
