import mongoose from "mongoose";

const adminActionLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    details: { type: String, default: "" },
    targetType: { type: String, default: "" }, // "product", "user", "order"
    targetId: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export const AdminActionLog = mongoose.model("AdminActionLog", adminActionLogSchema);
