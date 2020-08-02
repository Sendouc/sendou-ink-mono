/*import { MongoClient } from "mongodb";
import * as mongoose from "mongoose";
import { Top500PlacementModel } from "./models/top500Placement";

mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    const client = new MongoClient("uri here");

});*/

import { MongoClient } from "mongodb";

// Connection URI
const uri = "mongodb+srv://sample-hostname:27017/?poolSize=20&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

export {};
