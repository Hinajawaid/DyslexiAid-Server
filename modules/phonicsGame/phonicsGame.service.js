// import PhonicsGame from "./phonicsGame.model.js";

import fs from "fs";
import phonicsGameSchema from "./phonicsGame.model.js";

const storePhonicsGame = async (words, audioBuffers, level) => {
  try {
    // Create a new game entry
    const newGame = new phonicsGameSchema({
      words,
      audioFiles: audioBuffers,
      level: parseInt(level, 10), // Ensure level is a number
    });

    // Save to the database
    const savedGame = await newGame.save();
    return savedGame;
  } catch (error) {
    console.error("Error in storeSpellingGame service:", error);
    throw new Error("Failed to store game data: " + error.message);
  }
};

const getPhonicsGameByLevel = async (level) => {
  try {
    // Find all spelling game entries with the specified level
    const games = await phonicsGameSchema.find({ level: parseInt(level, 10) });

    // If no games found, return an empty array
    if (!games || games.length === 0) {
      return [];
    }

    return games;
  } catch (error) {
    console.error("Error in getPhonicsGameByLevel service:", error);
    throw new Error("Failed to retrieve phonics game data: " + error.message);
  }
};
export default { storePhonicsGame, getPhonicsGameByLevel };
