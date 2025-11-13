import { fetchRegionData } from "./data/fetch_data.js";
import COUNTRY_BOUNDS from "./constants/CONSTANTS.js";
import {
  connectToDB,
  storeData,
  getFireData,
  minMaxFRP,
} from "./db/connectdb.js";
import express from "express";
import Cors from "cors";

const PORT = 4200;
const app = express();

app.use(Cors());
app.use(express.json());

let isInitiateRunning = false;
let totalData = [];

// Route to get all data
app.get("/getalldata", async (req, res) => {
  console.log("/getalldata route is triggered");
  try {
    const result = await getFireData();
    res.json(result);
  } catch (err) {
    console.log("err getting data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// 🧹 NEW FUNCTION: Clear all data from DB
const clearDatabase = async () => {
  try {
    const collection = await connectToDB();
    const result = await collection.deleteMany({});
    console.log(`🧹 Cleared ${result.deletedCount} records from database`);
  } catch (error) {
    console.error("❌ Error clearing database:", error);
  }
};

const initiate = async () => {
  if (isInitiateRunning) {
    console.log("⚠️ Initiate is already running, skipping...");
    return;
  }

  isInitiateRunning = true;
  totalData = [];
  console.log("🚀 Starting data fetch cycle...");

  try {
    // 🆕 Get regions as an array and store the length
    const regions = Object.entries(COUNTRY_BOUNDS);
    const totalRegions = regions.length;

    // 🆕 Use for...loop with index tracking
    for (let index = 0; index < totalRegions; index++) {
      const [regionName, coordinates] = regions[index];

      console.log(
        `📡 [${index + 1}/${totalRegions}] Fetching data for ${regionName}...`
      );
      const regionData = await fetchRegionData(regionName, coordinates);
      console.log(`✅ Fetched ${regionData.length} records for ${regionName}`);

      if (regionData.length > 0) {
        const dataSizeBytes = Buffer.byteLength(
          JSON.stringify(regionData),
          "utf8"
        );
        const dataSizeKB = dataSizeBytes / 1024;
        const dataSizeMB = dataSizeKB / 1024;

        console.log(
          `Region ${regionName} size: ${dataSizeBytes} bytes (${dataSizeKB.toFixed(
            2
          )} KB / ${dataSizeMB.toFixed(4)} MB)`
        );

        await storeData(regionData, regionName);
        totalData.push(...regionData);
        console.log("total fetched data totalData= ", totalData.length);
      } else {
        console.log(`⚠️ No fire data for ${regionName}`);
      }

      // 🕐 Add 10-second delay between regions (except after the last one)
      if (index < totalRegions - 1) {
        console.log(`⏳ Waiting 10 seconds before next region...`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    console.log("🎉 All regions processed successfully");

    const { minFRP, maxFRP } = await minMaxFRP();
    console.log(`🔥 Min FRP: ${minFRP}, Max FRP: ${maxFRP}`);
  } catch (error) {
    console.error("❌ Error in initiate function:", error);
  } finally {
    isInitiateRunning = false;
  }
};

// Start the server
const startServer = async () => {
  try {
    await connectToDB();
    console.log("✅ Connected to database");

    // Run initial data fetch
    await initiate();

    // 🔁 Schedule new data every 3 hours
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    setInterval(initiate, THREE_HOURS_MS);
    console.log(`🕒 Scheduled data fetch every 3 hours (${THREE_HOURS_MS} ms)`);

    // 🧹 Schedule DB cleanup every 24 hours
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    setInterval(clearDatabase, ONE_DAY_MS);
    console.log(
      `🧼 Scheduled database cleanup every 24 hours (${ONE_DAY_MS} ms)`
    );

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Express server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    return;
  }
};

startServer();
