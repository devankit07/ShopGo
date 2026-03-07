import mongoose from "mongoose";
import crypto from "crypto";

const loginVerificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    displayCode: { type: String, required: true }, // 2-digit code shown on screen (e.g. "90")
    verifyToken: { type: String, required: true, unique: true }, // token in approval link
    expiresAt: { type: Date, required: true },
    approvedAt: { type: Date, default: null },
    lastSentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

loginVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const LoginVerification = mongoose.model("LoginVerification", loginVerificationSchema);

export function generateDisplayCode() {
  return String(Math.floor(10 + Math.random() * 90));
}

export function generateVerifyToken() {
  return crypto.randomBytes(32).toString("hex");
}
