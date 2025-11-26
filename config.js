import dotenv from "dotenv";

// Load environment variables synchronously
dotenv.config();

export default {
  MAP_KEY: process.env.MAP_KEY,
};
