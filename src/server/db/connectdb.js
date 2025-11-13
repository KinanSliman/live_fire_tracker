import { MongoClient } from "mongodb";
import config from "../../../config.js";

// Use the correct property names from your config
const url = `mongodb+srv://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@cluster0.shhuxk9.mongodb.net/`;
const client = new MongoClient(url);
let firesCollection;

export const connectToDB = async () => {
  if (firesCollection) return firesCollection; // ✅ reuse existing connection

  try {
    console.log("connecting to MongoDB...");
    await client.connect();
    const db = client.db("FireData");
    firesCollection = db.collection("FiresList");
    console.log("✅ connected to MongoDB");
    return firesCollection;
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
};
export const storeData = async (data, regionName) => {
  try {
    const collection = await connectToDB();

    // Convert frp to number and add region and severity
    const taggedData = data
      .map((d) => ({
        ...d,
        frp: Number(d.frp), // <-- convert to number
        region: regionName,
        severity: d.frp < 30 ? "low" : d.frp < 50 ? "medium" : "high", // your categories
      }))
      .filter((d) => d.frp >= 10); // ignore FRPs smaller than 10

    // Clear only previous data for this region
    await collection.deleteMany({ region: regionName });

    // Insert fresh updated data
    if (taggedData.length > 0) {
      await collection.insertMany(taggedData);
      console.log(`✅ Data stored successfully for region: ${regionName}`);
      console.log(`Stored ${taggedData.length} records for ${regionName}`);
    } else {
      console.log(`⚠️ No records to insert for region: ${regionName}`);
    }
  } catch (err) {
    console.error("❌ Error storing data:", err);
  }
};

export const getFireData = async () => {
  try {
    const collection = await connectToDB();
    const response = await collection.find().toArray();
    console.log("✅ Fetching data from the database is done");
    return response;
  } catch (err) {
    console.log("err fetching data: ", err);
  }
};

export const minMaxFRP = async () => {
  try {
    const collection = await connectToDB();

    // Use MongoDB aggregation to get min and max
    const result = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            minFRP: { $min: "$frp" },
            maxFRP: { $max: "$frp" },
          },
        },
      ])
      .toArray();

    if (result.length > 0) {
      return { minFRP: result[0].minFRP, maxFRP: result[0].maxFRP };
    } else {
      return { minFRP: null, maxFRP: null };
    }
  } catch (err) {
    console.error("❌ Error fetching min/max FRP:", err);
    return { minFRP: null, maxFRP: null };
  }
};
