import express from "express";
import {
  createRazorpayOrder,
  getRazorpayPublicConfig,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/config", getRazorpayPublicConfig);
router.post("/verify", verifyRazorpayPayment);
router.post("/create-order", createRazorpayOrder);
router.post("/", createRazorpayOrder);

export default router;
