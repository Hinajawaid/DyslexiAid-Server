// // server/modules/phonics/phonicsGame.controller.js

import phonicsGameService from "./phonicsGame.service.js";
import phonicsGameModel from "../phonicsGame/phonicsGame.model.js";

export const savePhonicsData = async (req, res) => {
  console.log("savePhonicsData controller");
  try {
    const { words, level } = req.body;

    // Check if files exist in the request
    if (!req.files || !req.files.audioFiles) {
      return res.status(400).json({ message: "No audio files provided." });
    }

    // Handle both single file and array of files
    const audioFilesArray = Array.isArray(req.files.audioFiles)
      ? req.files.audioFiles
      : [req.files.audioFiles];

    // Extract audio data
    const audioBuffers = audioFilesArray.map((file) => file.data);

    // Handle words array from form-data
    // If words is sent as words[], it will be an array automatically
    // If words is sent as a single value, convert it to array
    const wordsArray = Array.isArray(words) ? words : [words];

    // Call the service to save the data
    const result = await phonicsGameService.storePhonicsGame(
      wordsArray,
      audioBuffers,
      level
    );

    res.status(201).json({
      message: "Audio files and game data stored successfully.",
      result,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//get spelling data
export const getPhonicsDataByLevel = async (req, res) => {
  console.log("getPhonicsData controller");

  try {
    const { level } = req.params;
    // Validate level parameter
    if (!level) {
      return res.status(400).json({ message: "Level is required" });
    }
    // Call service to get spelling game data
    const phonicsGames = await phonicsGameService.getPhonicsGameByLevel(
      level
    );
    // If no games found, return appropriate response
    if (phonicsGames.length === 0) {
      return res.status(404).json({
        message: `No phonics games found for level ${level}`,
      });
    }
    // Return the spelling games
    res.status(200).json({
      message: `Phonics games for level ${level} retrieved successfully`,
      data: phonicsGames,
    });
  } catch (error) {
    console.error("Error in getPhonicsDataByLevel controller:", error);
    return res.status(500).json({ message: error.message });
  }
};
// server/modules/phonics/phonicsGame.controller.js
export const getLetterData = async (req, res) => {
  const { letter } = req.params;

  try {
    const data = await phonicsGameModel.findOne({
      level: 1,
      words: { $in: [letter] },
    });

    if (!data) {
      return res.status(404).json({ message: "Letter data not found" });
    }

    const audioFile = data.audioFiles[data.words.indexOf(letter)].toString("base64");
    res.status(200).json({ data: { audioFile } });
  } catch (error) {
    console.error("Error fetching letter data:", error);
    res.status(500).json({ message: error.message });
  }
};