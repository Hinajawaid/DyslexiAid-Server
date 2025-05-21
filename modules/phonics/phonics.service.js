import Phonicsgame from "./phonics.model.js";
export const addPhonicsGameScore = async (
  level,
  score,
  totalQuestion,
  wrongWordsArr,
  correctWordsArr,
  userId
) => {
  try {
    const phonicsgameScore = {
      level,
      score,
      totalQuestion,
      wrongWordsArr,
      correctWordsArr,
      userId,
    };

    const newPhonicsgameScore = new Phonicsgame(phonicsgameScore);

    await newPhonicsgameScore.save();

    return { status: true, newPhonicsgameScore };
  } catch (err) {
    console.log("from add phonics game controller", err);
    throw new Error(err.message);
  }
};

export const getPhonicsGames = async (userId = null) => {
  try {
    // Get games for a specific user
    return await Phonicsgame.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch game data: " + error.message);
  }
};
