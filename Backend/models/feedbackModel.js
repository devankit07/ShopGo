import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
