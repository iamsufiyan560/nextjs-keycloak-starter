import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    sub: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        enum: ["admin", "manager", "user"],
        default: ["user"],
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
