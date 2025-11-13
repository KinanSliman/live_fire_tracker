import dotenv from "dotenv";

// Load environment variables synchronously
dotenv.config();

export default {
  MAP_KEY: process.env.MAP_KEY,
  MONGODB_URL: process.env.MONGODB_URL,
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
};
