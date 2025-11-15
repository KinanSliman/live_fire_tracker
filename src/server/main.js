import { fetchRegionData } from "./data/fetch_data.js";
import COUNTRY_BOUNDS from "./constants/CONSTANTS.js";

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
    const result = totalData;
    res.json(result);
  } catch (err) {
    console.log("err getting data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const initiate = async () => {
  if (isInitiateRunning) {
    console.log("⚠️ Initiate is already running, skipping...");
    return;
  }

  isInitiateRunning = true;
  totalData = [];
  console.log("🚀 Starting data fetch cycle...");

  try {
    const regions = Object.entries(COUNTRY_BOUNDS);
    const totalRegions = regions.length;

    for (let index = 0; index < totalRegions; index++) {
      const [regionName, coordinates] = regions[index];

      console.log(
        `📡 [${index + 1}/${totalRegions}] Fetching data for ${regionName}...`
      );
      const regionData = await fetchRegionData(regionName, coordinates);
      console.log(`✅ Fetched ${regionData.length} records for ${regionName}`);

      if (regionData.length > 0) {
        const filteredData = regionData
          .map((d) => ({
            ...d,
            frp: Number(d.frp),
            region: regionName,
            severity: d.frp < 30 ? "low" : d.frp < 50 ? "medium" : "high",
          }))
          .filter((d) => d.frp >= 20);

        const dataSizeBytes = Buffer.byteLength(
          JSON.stringify(filteredData),
          "utf8"
        );
        const dataSizeKB = dataSizeBytes / 1024;
        const dataSizeMB = dataSizeKB / 1024;

        console.log(
          `Region ${regionName} size: ${dataSizeBytes} bytes (${dataSizeKB.toFixed(
            2
          )} KB / ${dataSizeMB.toFixed(4)} MB)`
        );

        totalData.push(...filteredData);
        console.log("total fetched data totalData= ", totalData.length);
      } else {
        console.log(`⚠️ No fire data for ${regionName}`);
      }

      if (index < totalRegions - 1) {
        console.log(`⏳ Waiting 2 seconds before next region...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log("🎉 All regions processed successfully");
  } catch (error) {
    console.error("❌ Error in initiate function:", error);
  } finally {
    isInitiateRunning = false;
  }
};

const startServer = async () => {
  try {
    await initiate();

    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    setInterval(initiate, THREE_HOURS_MS);
    console.log(`🕒 Scheduled data fetch every 3 hours (${THREE_HOURS_MS} ms)`);

    app.listen(PORT, () => {
      console.log(`🚀 Express server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    return;
  }
};

startServer();
