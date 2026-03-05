import mongoose from "mongoose";

const loginOtpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0, max: 5 },
    lastSentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index: auto-delete expired documents
loginOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const LoginOTP = mongoose.model("LoginOTP", loginOtpSchema);
