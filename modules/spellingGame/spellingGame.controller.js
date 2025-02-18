import spellingGameService from "./spellingGame.service.js";

export const saveSpellingData = async (req, res) => {
  console.log("saveSpellingData controller");
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
    const result = await spellingGameService.storeSpellingGame(
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
export const getSpellingDataByLevel = async (req, res) => {
  console.log("getSpellingData controller");

  try {
    const { level } = req.params;
    // Validate level parameter
    if (!level) {
      return res.status(400).json({ message: "Level is required" });
    }
    // Call service to get spelling game data
    const spellingGames = await spellingGameService.getSpellingGameByLevel(
      level
    );
    // If no games found, return appropriate response
    if (spellingGames.length === 0) {
      return res.status(404).json({
        message: `No spelling games found for level ${level}`,
      });
    }
    // Return the spelling games
    res.status(200).json({
      message: `Spelling games for level ${level} retrieved successfully`,
      data: spellingGames,
    });
  } catch (error) {
    console.error("Error in getSpellingDataByLevel controller:", error);
    return res.status(500).json({ message: error.message });
  }
};
