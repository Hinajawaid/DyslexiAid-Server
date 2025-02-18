// spellingGameService.js
import fs from "fs";

// spellingGame.service.js
import spellingGameSchema from "./spellingGame.model.js";

const storeSpellingGame = async (words, audioBuffers, level) => {
  try {
    // Create a new game entry
    const newGame = new spellingGameSchema({
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

const getSpellingGameByLevel = async (level) => {
  try {
    // Find all spelling game entries with the specified level
    const games = await spellingGameSchema.find({ level: parseInt(level, 10) });

    // If no games found, return an empty array
    if (!games || games.length === 0) {
      return [];
    }

    return games;
  } catch (error) {
    console.error("Error in getSpellingGameByLevel service:", error);
    throw new Error("Failed to retrieve spelling game data: " + error.message);
  }
};

export default { storeSpellingGame, getSpellingGameByLevel };
