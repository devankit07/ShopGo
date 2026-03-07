import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    profilePicPublicId: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: { type: String },
    city: { type: String },
    ZipCode: { type: String },
    phoneNo: { type: String },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
