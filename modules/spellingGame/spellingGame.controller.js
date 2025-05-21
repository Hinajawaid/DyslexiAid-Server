import spellingGameService from "./spellingGame.service.js";
import spellingGameSchema from "./spellingGame.model.js";

export const savespellingData = async (req, res) => {
  console.log("savespellingData controller");
  try {
    let { words, level } = req.body;

    console.log('Received body:', req.body);
    console.log('Received files:', req.files);

    words = words ? (Array.isArray(words) ? words : [words]) : [];
    level = parseInt(level, 10) || 1;

    const validWords = words.filter(word => word && typeof word === 'string' && word.trim());
    if (validWords.length === 0) {
      return res.status(400).json({ message: "At least one non-empty word is required" });
    }

    if (!req.files || !req.files.audioFiles) {
      return res.status(400).json({ message: "At least one audio file is required" });
    }

    const audioFilesArray = Array.isArray(req.files.audioFiles)
      ? req.files.audioFiles
      : [req.files.audioFiles];

    const audioBuffers = audioFilesArray.map((file) => file.buffer);

    if (validWords.length !== audioBuffers.length) {
      return res.status(400).json({ message: "Number of words must match number of audio files" });
    }

    const result = await spellingGameService.storespellingGame(
      validWords,
      audioBuffers,
      level
    );

    res.status(201).json({
      message: "Audio files and game data stored successfully",
      result,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getspellingDataByLevel = async (req, res) => {
  console.log("getspellingData controller");
  try {
    const { level } = req.params;
    if (!level) {
      return res.status(400).json({ message: "Level is required" });
    }
    const spellingGames = await spellingGameService.getspellingGameByLevel(level);
    if (spellingGames.length === 0) {
      return res.status(404).json({
        message: `No spelling games found for level ${level}`,
      });
    }
    const formattedGames = spellingGames.map(game => ({
      ...game._doc,
      audioFiles: game.audioFiles.map(buffer => buffer.toString('base64')),
    }));
    res.status(200).json({
      message: `spelling games for level ${level} retrieved successfully`,
      data: formattedGames,
    });
  } catch (error) {
    console.error("Error in getspellingDataByLevel controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getLetterData = async (req, res) => {
  const { letter } = req.params;
  try {
    const data = await spellingGameSchema.findOne({
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

export const deleteWord = async (req, res) => {
  try {
    const { id, wordIndex } = req.params;
    const game = await spellingGameSchema.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (wordIndex < 0 || wordIndex >= game.words.length) {
      return res.status(400).json({ message: "Invalid word index" });
    }

    game.words.splice(wordIndex, 1);
    game.audioFiles.splice(wordIndex, 1);

    if (game.words.length === 0) {
      await spellingGameSchema.deleteOne({ _id: id });
      return res.status(200).json({ message: "Game deleted as it had no remaining words" });
    }

    await game.save();
    res.status(200).json({ message: "Word and associated audio deleted successfully" });
  } catch (error) {
    console.error("Error in deleteWord controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateWord = async (req, res) => {
  try {
    const { id, wordIndex } = req.params;
    const { word, existingAudioFile } = req.body;
    const audioFile = req.files?.audioFile?.buffer;

    if (word && (!word.trim() || typeof word !== 'string')) {
      return res.status(400).json({ message: "Word must be a non-empty string" });
    }

    const game = await spellingGameSchema.findById(id);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (wordIndex < 0 || wordIndex >= game.words.length) {
      return res.status(400).json({ message: "Invalid word index" });
    }

    if (word) {
      game.words[wordIndex] = word.trim();
    }
    if (audioFile) {
      game.audioFiles[wordIndex] = audioFile;
    } else if (existingAudioFile) {
      game.audioFiles[wordIndex] = Buffer.from(existingAudioFile, 'base64');
    }

    await game.save();
    res.status(200).json({ message: "Word and/or audio updated successfully", data: game });
  } catch (error) {
    console.error("Error in updateWord controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await spellingGameSchema.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Game level not found" });
    }
    res.status(200).json({ message: "Game level deleted successfully" });
  } catch (error) {
    console.error("Error in deleteLevel controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getLevels = async (req, res) => {
  console.log("getLevels controller");
  try {
    const levels = await spellingGameSchema.distinct('level');
    res.status(200).json({
      message: "Levels retrieved successfully",
      data: levels.sort((a, b) => a - b),
    });
  } catch (error) {
    console.error("Error in getLevels controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateLevel = async (req, res) => {
  try {
    let { id, words, level, existingAudioFiles } = req.body;

    // Log received data for debugging
    console.log('Received updateLevel data:', { id, words, level, existingAudioFiles });
    console.log('Received files:', req.files);

    // Handle words field
    words = words ? (Array.isArray(words) ? words : [words]) : [];

    // Validate words
    const validWords = words.filter(word => word && typeof word === 'string' && word.trim());
    if (validWords.length === 0) {
      return res.status(400).json({ message: "At least one non-empty word is required" });
    }

    // Parse level
    const parsedLevel = parseInt(level, 10);
    if (isNaN(parsedLevel) || parsedLevel < 1) {
      return res.status(400).json({ message: "Invalid level" });
    }

    // Handle existing audio files (base64 strings)
    let existingAudioBuffers = [];
    if (existingAudioFiles) {
      existingAudioBuffers = Array.isArray(existingAudioFiles)
        ? existingAudioFiles.map((base64, idx) => {
            console.log(`Processing existingAudioFiles[${idx}]:`, base64 ? 'Valid base64' : 'Null/Empty');
            return base64 ? Buffer.from(base64, 'base64') : null;
          })
        : [Buffer.from(existingAudioFiles, 'base64')];
    }
    console.log('existingAudioBuffers:', existingAudioBuffers.map(b => b ? 'Buffer' : null));

    // Handle new audio files
    let newAudioBuffers = [];
    if (req.files && req.files.audioFiles) {
      const audioFilesArray = Array.isArray(req.files.audioFiles)
        ? req.files.audioFiles
        : [req.files.audioFiles];
      newAudioBuffers = audioFilesArray.map((file, idx) => {
        console.log(`Processing newAudioFiles[${idx}]:`, file.originalname);
        return file.buffer;
      });
    }
    console.log('newAudioBuffers:', newAudioBuffers.map(b => 'Buffer'));

    // Create final audio files array
    let newAudioIndex = 0;
    const finalAudioFiles = validWords.map((word, index) => {
      if (existingAudioBuffers[index]) {
        console.log(`Word "${word}" at index ${index} using existingAudioBuffers[${index}]`);
        return existingAudioBuffers[index];
      }
      if (newAudioIndex < newAudioBuffers.length) {
        console.log(`Word "${word}" at index ${index} using newAudioBuffers[${newAudioIndex}]`);
        return newAudioBuffers[newAudioIndex++];
      }
      console.log(`Word "${word}" at index ${index} has no audio file`);
      return null;
    });

    // Log finalAudioFiles for debugging
    console.log('Final audio files:', finalAudioFiles.map(audio => audio ? 'Buffer' : null));

    // Validate that all words have corresponding audio files
    if (finalAudioFiles.some(audio => !audio)) {
      return res.status(400).json({ message: "Each word must have a corresponding audio file" });
    }

    // Delete existing document for this level
    console.log(`Deleting existing documents for level ${parsedLevel}`);
    const deleteResult = await spellingGameSchema.deleteMany({ level: parsedLevel });
    console.log(`Deleted ${deleteResult.deletedCount} document(s) for level ${parsedLevel}`);

    // Create new document
    const newGame = new spellingGameSchema({
      words: validWords,
      audioFiles: finalAudioFiles,
      level: parsedLevel,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newGame.save();
    console.log(`Created new document with ID ${newGame._id} for level ${parsedLevel}`);

    res.status(201).json({
      message: "Game level created successfully",
      data: newGame,
    });
  } catch (error) {
    console.error("Error in updateLevel controller:", error);
    return res.status(500).json({ message: error.message });
  }
};


// //get spelling data
export const getDataGame = async (req, res) => {
  console.log("getspellingDataGame controller");

  try {
    const { level } = req.params;
    // Validate level parameter
    if (!level) {
      return res.status(400).json({ message: "Level is required" });
    }
    // Call service to get spelling game data
    const spellingGames = await spellingGameService.getspellingGame(
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
      message: `spelling games for level ${level} retrieved successfully`,
      data: spellingGames,
    });
  } catch (error) {
    console.error("Error in getspellingDataByLevel controller:", error);
    return res.status(500).json({ message: error.message });
  }
};