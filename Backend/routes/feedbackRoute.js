import express from "express";
import { createFeedback, getAllFeedback } from "../controllers/feedbackController.js";
import { IsAuthenticated, OptionalAuth } from "../middleware/IsAuthenticated.js";

const router = express.Router();

router.post("/", OptionalAuth, createFeedback);
router.get("/", IsAuthenticated, getAllFeedback);

export default router;
