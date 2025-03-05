import { PollyClient } from "@aws-sdk/client-polly";
import dotenv from "dotenv";

dotenv.config();

console.log("AWS REGION FROM ENV:", process.env.AWS_REGION);

const polly = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1", // Default fallback
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default polly;
