import mongoose from "mongoose";

const resourcesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "tile is required"],
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: [true, "imageurl is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resourcesSchema);
