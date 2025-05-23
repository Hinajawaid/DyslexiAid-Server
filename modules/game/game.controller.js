import { addGameScore, getGames } from "./game.service.js";

export const addgameController = async (req, res) => {
  console.log("inside addgameController");
  // const { level, score, totalQuestion, wrongWordsArr, correctWordsArr } =
  //   req.body;
  // console.log(response);
  // res.send(response);
  try {
    const { correctWordsArr, level, score, totalQuestion, wrongWordsArr } =
      req.body;

    console.log(level, score, totalQuestion, wrongWordsArr, correctWordsArr);

    if (!level || !score) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user.id;
    console.log("User ID from token:", userId);

    const response = await addGameScore(
      level,
      score,
      totalQuestion,
      wrongWordsArr,
      correctWordsArr,
      userId
    );

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getgameController = async (req, res) => {
  try {
    const userId = req.user.id; // <-- Extract from decoded token

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    const games = await getGames(userId);
    console.log("Game data retrieved successfully", games);
    res.status(200).json({
      success: true,
      message: "Game data retrieved successfully",
      data: games,
    });
  } catch (error) {
    console.error("Error in getgameController:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch game data",
      error: error.message,
    });
  }
};
