import mongoose from "mongoose";

const todoSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description:{
        type: String
    },
    category:{
        type: String,
        required: [true, "Category is required"],
    },
    completed:{
        type: Boolean,
        default: false,
    },
    priority:{
        type: Boolean,
        default: false,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    date:{
        type:String,
        required: [true, "Date is required"],
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Todo", todoSchema);