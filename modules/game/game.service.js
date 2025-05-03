import Game from "./game.model.js";
export const addGameScore = async (
  level,
  score,
  totalQuestion,
  wrongWordsArr,
  correctWordsArr,
  userId
) => {
  try {
    const gameScore = {
      level,
      score,
      totalQuestion,
      wrongWordsArr,
      correctWordsArr,
      userId,
    };

    const newGameScore = new Game(gameScore);

    await newGameScore.save();

    return { status: true, newGameScore };
  } catch (err) {
    console.log("from add game controller", err);
    throw new Error(err.message);
  }
};
