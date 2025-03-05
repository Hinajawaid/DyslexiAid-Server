// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();
// Log the values to verify they are loaded
console.log("AWS Access Key:", process.env.AWS_ACCESS_KEY_ID || "Not Found");
console.log(
  "AWS Secret Key:",
  process.env.AWS_SECRET_ACCESS_KEY || "Not Found"
);
console.log("AWS Region:", process.env.AWS_REGION || "Not Found");
