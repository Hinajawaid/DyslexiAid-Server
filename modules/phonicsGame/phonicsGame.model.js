import mongoose from "mongoose";

const phonicsGameSchema = mongoose.Schema(
  {
    words: {
      type: [String], // Array of strings for words
      required: true, // Makes this field mandatory
    },
    audioFiles: {
      type: [Buffer], // Array of binary audio files stored as buffers
      required: true,
    },
    level: {
      type: Number, // A number representing the difficulty level
      required: true, // Makes this field mandatory
      min: 1, // Ensure level is at least 1
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("phonicsGame", phonicsGameSchema);
