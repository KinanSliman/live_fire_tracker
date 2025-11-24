import { fetchRegionData } from "./data/fetch_data.js";
import COUNTRY_BOUNDS from "./constants/CONSTANTS.js";
import {
  start_ws_server,
  broadcastDataUpdate,
  updateDataReference,
} from "./ws/ws_server.js";

let isInitiateRunning = false;
let totalData = [];
let lastUpdateTime = null; // Add this to track last update

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

    // Update the last update time
    lastUpdateTime = new Date().toISOString();
    console.log("🎉 All regions processed successfully");
    console.log(`🕒 Last update time: ${lastUpdateTime}`);

    // Broadcast data update to all connected WebSocket clients
    updateDataReference(totalData, lastUpdateTime); // Pass lastUpdateTime
    broadcastDataUpdate();
  } catch (error) {
    console.error("❌ Error in initiate function:", error);
  } finally {
    isInitiateRunning = false;
  }
};

function keepServerAlive() {
  setInterval(() => {
    console.log("WebSocket server alive:", new Date().toISOString());
  }, 4 * 60 * 1000);
}

const startServer = async () => {
  keepServerAlive();
  try {
    // Start WebSocket server with data reference
    start_ws_server(totalData, lastUpdateTime); // Pass lastUpdateTime

    // Initial data fetch
    await initiate();

    // Schedule periodic data fetch
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    setInterval(async () => {
      await initiate();
    }, THREE_HOURS_MS);
    console.log(`🕒 Scheduled data fetch every 3 hours (${THREE_HOURS_MS} ms)`);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    return;
  }
};

startServer();
