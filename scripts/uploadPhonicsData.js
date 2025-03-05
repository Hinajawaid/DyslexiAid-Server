// server/scripts/uploadPhonicsData.js
import mongoose from "mongoose";
import PhonicsGame from "../modules/phonicsGame/phonicsGame.model.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config(); // Load environment variables

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPhonicsData = async () => {
  const dbUrl =
    process.env.MONGODB_URL ||
    "mongodb+srv://admin:admin@cluster0.dunlbqe.mongodb.net/"; // Replace with your MongoDB URL
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const level = 1; // Change level as needed

  for (const letter of letters) {
    try {
      const audioPath = path.resolve(
        __dirname,
        "../../dyslexiaid/src/assets/phonics/level1/sounds",
        `${letter}.mp3`
      );
      const imagePath = path.resolve(
        __dirname,
        "../../dyslexiaid/src/assets/phonics/level1/svgs",
        `${letter.toUpperCase()}.svg`
      );

      console.log(`Checking: ${audioPath}`);
      console.log(`Checking: ${imagePath}`);

      if (!fs.existsSync(audioPath) || !fs.existsSync(imagePath)) {
        console.warn(`Skipping ${letter}: File not found`);
        continue; // Skip missing files
      }

      const audioFile = fs.readFileSync(audioPath);
      const imageFile = fs.readFileSync(imagePath);

      const phonicsData = new PhonicsGame({
        letter,
        audioFile,
        imageFile,
        level,
      });

      await phonicsData.save();
      console.log(`Uploaded data for letter ${letter}`);
    } catch (error) {
      console.error(`Error uploading ${letter}:`, error);
    }
  }

  console.log("All data uploaded successfully.");
  mongoose.disconnect();
};

uploadPhonicsData();
