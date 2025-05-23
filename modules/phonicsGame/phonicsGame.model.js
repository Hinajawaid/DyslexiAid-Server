import mongoose from "mongoose";

const phonicsGameSchema = mongoose.Schema(
  {
    words: {
      type: [String], 
      required: true, 
    },
    audioFiles: {
      type: [Buffer], 
      required: true,
    },
    level: {
      type: Number, 
      required: true, 
      min: 1, 
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("phonicsGame", phonicsGameSchema);
