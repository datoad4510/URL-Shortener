const credentials = require("./credentials");
const port = credentials.PORT || 3000;
const username = credentials.username;
const password = credentials.password;

const uri = `mongodb+srv://${username}:${password}@cluster0.tnsni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");

const { nanoid } = require("nanoid");

class Database {
	constructor() {
		this.client = new MongoClient(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}

	async connect() {
		return await this.client.connect(async (err) => {
			console.log("Connected to MongoDB Atlas!");
			this.URL_collection = this.client.db("database").collection("URLs");
		});
	}

	async insertUrlIfNotExists(URL) {
		return await this.URL_collection.findOneAndUpdate(
			{ URL },
			{ $setOnInsert: { URL, hash: nanoid() } },
			{
				upsert: true,
				returnDocument: "after",
			}
		).then((data) => data.value);
	}

	async findByHash(hash) {
		console.log(hash);
		return await this.URL_collection.findOne({
			hash,
		});
	}

	close() {
		this.client.close(() => {
			console.log("Closed database connection");
		});
	}
}

module.exports = Database;
