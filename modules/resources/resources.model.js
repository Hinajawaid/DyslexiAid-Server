import mongoose from "mongoose";

const resourcesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "tile is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },
    description: {
      type: String,
    },
    headingId: {
      type: String,
    },
    link: {
      type: String,
      required: [true, "link is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resourcesSchema);
