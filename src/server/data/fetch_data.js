import axios from "axios";
import Papa from "papaparse";
import { API_CONFIG } from "../constants/CONSTANTS.js";
import config from "../../../config.js";

export const fetchRegionData = async (regionName, coordinates) => {
  const URL = `${API_CONFIG.BASE_URL}/${config.MAP_KEY}/${API_CONFIG.SOURCE}/${coordinates}/${API_CONFIG.DURATION}`;

  const response = await axios.get(URL);
  if (!response.data) {
    console.log(`no data available for ${regionName}`);
    return;
  }
  console.log("converting CSV to JSON format");
  const parsedResponse = Papa.parse(response.data, {
    header: true,
    delimiter: ",", // explicitly tell Papa to use comma
    skipEmptyLines: true,

    error: (err) => {
      console.error("Error parsing data:", err);
    },
  });
  if (parsedResponse.errors.length > 0) {
    console.log("Error parsing data:", parsedResponse.errors);
    return;
  }
  // console.log("parsedResponse: ", parsedResponse);
  const regionFireData = parsedResponse.data.map((record) => ({
    ...record,
    region: regionName,
  }));

  // console.log("regionFireData", regionFireData);
  return regionFireData;
};
