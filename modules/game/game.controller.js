import { addGameScore } from "./game.service.js";

export const addgameController = async (req, res) => {
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
