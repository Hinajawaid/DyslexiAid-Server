// import PhonicsGame from "./phonicsGame.model.js";

import fs from "fs";
import phonicsGameSchema from "./phonicsGame.model.js";

// server/modules/game/service.js
const storePhonicsGame = async (words, audioBuffers, level) => {
  try {
    const newGame = new phonicsGameSchema({
      words,
      audioFiles: audioBuffers,
      level: parseInt(level, 10),
    });
    return await newGame.save();
  } catch (error) {
    console.error("Error in storePhonicsGame service:", error);
    throw new Error("Failed to store game data: " + error.message);
  }
};

const updatePhonicsGame = async (id, updateData) => {
  try {
    return await phonicsGameSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  } catch (error) {
    console.error("Error in updatePhonicsGame service:", error);
    throw new Error("Failed to update game data: " + error.message);
  }
};

const getAllPhonicsGames = async () => {
  try {
    return await phonicsGameSchema.find().sort({ level: 1 });
  } catch (error) {
    console.error("Error in getAllPhonicsGames service:", error);
    throw new Error("Failed to retrieve phonics games: " + error.message);
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

export const getPhonicsGame = async (level) => {
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

export default { storePhonicsGame,updatePhonicsGame, getPhonicsGameByLevel, getAllPhonicsGames, getPhonicsGame };
