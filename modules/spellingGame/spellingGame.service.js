// import spellingGame from "./spellingGame.model.js";

import fs from "fs";
import spellingGameSchema from "./spellingGame.model.js"; 

const storespellingGame = async (words, audioBuffers, level) => {
  try {
    const newGame = new spellingGameSchema({
      words,
      audioFiles: audioBuffers,
      level: parseInt(level, 10),
    });
    return await newGame.save();
  } catch (error) {
    console.error("Error in storespellingGame service:", error);
    throw new Error("Failed to store game data: " + error.message);
  }
};

const updatespellingGame = async (id, updateData) => {
  try {
    return await spellingGameSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  } catch (error) {
    console.error("Error in updatespellingGame service:", error);
    throw new Error("Failed to update game data: " + error.message);
  }
};

const getAllspellingGames = async () => {
  try {
    return await spellingGameSchema.find().sort({ level: 1 });
  } catch (error) {
    console.error("Error in getAllspellingGames service:", error);
    throw new Error("Failed to retrieve spelling games: " + error.message);
  }
};


const getspellingGameByLevel = async (level) => {
  console.log("Level in getspellingGameByLevel:", level); 
  try {
    // Find all spelling game entries with the specified level
    const games = await spellingGameSchema.find({ level: parseInt(level, 10) });
    //console.log("Games found:", games); // Debug log
    // If no games found, return an empty array
    if (!games || games.length === 0) {
      return [];
    }

    return games;
  } catch (error) {
    console.error("Error in getspellingGameByLevel service:", error);
    throw new Error("Failed to retrieve spelling game data: " + error.message);
  }
};

export const getspellingGame = async (level) => {
  console.log("Level in getspellingGame:", level); 
  try {
    // Find all spelling game entries with the specified level
    const games = await spellingGameSchema.find({ level: parseInt(level, 10) });

    // If no games found, return an empty array
    if (!games || games.length === 0) {
      return [];
    }

    return games;
  } catch (error) {
    console.error("Error in getspellingGameByLevel service:", error);
    throw new Error("Failed to retrieve spelling game data: " + error.message);
  }
};

export default { storespellingGame,updatespellingGame, getspellingGameByLevel, getAllspellingGames, getspellingGame };
