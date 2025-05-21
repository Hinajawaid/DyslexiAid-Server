import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      required: [true, "Level is required"],
    },
    score: {
      type: Number,
      required: [true, "Score is required"],
    },
    totalQuestion: {
      type: Number,
    },
    correctWordsArr: {
      type: [String], // Array of strings
      default: [],
    },
    wrongWordsArr: {
      type: [String], // Array of strings
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("pgame", gameSchema);
