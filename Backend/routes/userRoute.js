import express from "express";
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  register,
  reVerify,
  verify,
  verifyotp,
} from "../controllers/userController.js";
import { IsAuthenticated } from "../middleware/IsAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", IsAuthenticated, logout);
router.post("/forgot-password", IsAuthenticated, forgotPassword);
router.post("/verify-otp/:email", verifyotp);
router.post("/change-password/:email", changePassword);

export default router;
