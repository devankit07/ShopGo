import { Feedback } from "../models/feedbackModel.js";

export const createFeedback = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required",
      });
    }
    const feedback = await Feedback.create({
      name: name?.trim() || "",
      email: email?.trim() || "",
      rating: Number(rating) || 0,
      message: message.trim(),
      userId: req.id || null,
    });
    return res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been submitted.",
      feedback,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const list = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email");
    return res.status(200).json({
      success: true,
      feedback: list,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
