import Game from "./game.model.js";
// export const addGameScore = async (
//   level,
//   score,
//   totalQuestion,
//   wrongWordsArr,
//   correctWordsArr,
//   userId
// ) => {
//   try {
//     const gameScore = {
//       level,
//       score,
//       totalQuestion,
//       wrongWordsArr,
//       correctWordsArr,
//       userId,
//     };

//     const newGameScore = new Game(gameScore);

//     await newGameScore.save();

//     return { status: true, newGameScore };
//   } catch (err) {
//     console.log("from add game controller", err);
//     throw new Error(err.message);
//   }
// };
export const addGameScore = async (
  level,
  score,
  totalQuestion,
  wrongWordsArr,
  correctWordsArr,
  userId
) => {
  try {
    const updateData = {
      score,
      totalQuestion,
      wrongWordsArr,
      correctWordsArr,
    };

    // Find if a game for this user and level already exists
    const existingGame = await Game.findOneAndUpdate(
      { userId, level }, // search criteria
      updateData, // fields to update
      { new: true } // return the updated doc
    );

    if (existingGame) {
      return { status: true, updated: true, game: existingGame };
    }

    // If not found, create a new game
    const newGame = new Game({
      level,
      score,
      totalQuestion,
      wrongWordsArr,
      correctWordsArr,
      userId,
    });

    await newGame.save();

    return { status: true, updated: false, game: newGame };
  } catch (err) {
    console.log("from add game controller", err);
    throw new Error(err.message);
  }
};

export const getGames = async (userId = null) => {
  try {
    // Get games for a specific user
    return await Game.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new Error("Failed to fetch game data: " + error.message);
  }
};
