import { AdminActionLog } from "../models/adminActionLogModel.js";

export const logAction = async (adminId, action, details = "", targetType = "", targetId = null) => {
  try {
    await AdminActionLog.create({ adminId, action, details, targetType, targetId });
  } catch (err) {
    console.error("Admin log error:", err.message);
  }
};
