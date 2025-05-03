import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Please provide Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    token: {
      type: String,
    },
    age: {
      type: Number,
      default: 0,
    },
    profilePicture: {
      type: String,
      default: "", // Default avatar URL or leave it empty
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
