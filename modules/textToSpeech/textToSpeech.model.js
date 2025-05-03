import mongoose from "mongoose";

const textToSpeechSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Makes title field mandatory
      trim: true, // Removes whitespace from both ends
    },
    content: {
      type: String, // Text content instead of binary file
      required: true, // Makes content field mandatory
    },
  },
  {
    timestamp: { type: Date, default: Date.now }, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("TextDocument", textToSpeechSchema);
