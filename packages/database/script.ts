const MongoClient = require("mongodb");
require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const { Top500PlacementModel } = require("./models/top500Placement");

const uri = process.env.MONGODB_URI;

if (!uri) throw Error("No MongoDB URI set");

mongoose.connect(uri, { useNewUrlParser: true, dbName: "new" });

let db: any;

async function run() {
  MongoClient.connect(uri, { useUnifiedTopology: true }, async function (
    err: any,
    client: any
  ) {
    if (err) throw err;

    db = client.db("production");

    //await placements();
    await aggPlacements();
    process.exit(-1);
  });
}

async function placements() {
  const placements = await db.collection("placements").find({}).toArray();

  // @ts-ignore
  const newPlacements = placements.map(({ _id, ...p }) => {
    return {
      ...p,
      xPower: p.x_power,
      uniqueId: p.unique_id,
      mode: ["", "SZ", "TC", "RM", "CB"][p.mode],
    };
  });

  await Top500PlacementModel.insertMany(newPlacements);
  console.log("done with placements");
}

async function aggPlacements() {
  const placements = await Top500PlacementModel.findTopPlayers(
    "Custom E-liter 4K"
  );

  console.log("placements", placements);
  console.log("type", typeof placements);
}

run().catch(console.dir);

export {};
