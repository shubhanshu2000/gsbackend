const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const dotEnv = require("dotenv").config();
const cors = require("cors");
const user = process.env.NODE_USER;
const password = process.env.NODE_PASSWORD;
const uri = `mongodb+srv://${user}:${password}@cluster0.qeq91.mongodb.net/dtdb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true });

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const mongoConnect = async () => {
  const mongoConnection = await client.connect();
  db = mongoConnection.db("gs");
  return db.collection("gs");
};

app.get("/", (req, res) => {
  try {
    async function getData() {
      try {
        const callMongoConnect = await mongoConnect();
        const data = await callMongoConnect.find({}).toArray();
        res.json({ status: "ok", data });
      } catch (error) {
        console.log(error);
      } finally {
        client.close();
      }
    }
    getData();
  } catch (error) {
    res.json({ status: "error", error });
  }
});
app.post("/", (req, res) => {
  try {
    async function run() {
      try {
        const callMongoConnect = await mongoConnect();
        const docs = req.body;
        const result = await callMongoConnect.insertOne(docs);
        console.log(result.insertedId);
        res.json({ status: "ok" });
      } finally {
        await client.close();
      }
    }
    run();
  } catch (err) {
    res.json({ status: "error", err });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
