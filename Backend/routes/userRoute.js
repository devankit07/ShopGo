import express from "express";
import {
  allUser,
  changePassword,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  resendLoginOtp,
  updateuser,
  verifyLoginOtp,
  verifyotp,
} from "../controllers/userController.js";
import { isAdmin, IsAuthenticated } from "../middleware/IsAuthenticated.js";
import { verifyPendingLoginToken } from "../middleware/verifyPendingLoginToken.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-login-otp", verifyPendingLoginToken, verifyLoginOtp);
router.post("/resend-login-otp", verifyPendingLoginToken, resendLoginOtp);
router.post("/logout", IsAuthenticated, logout);
router.post("/forgot-password", IsAuthenticated, forgotPassword);
router.post("/verify-otp/:email", verifyotp);
router.post("/change-password/:email", changePassword);
router.get("/all-user", IsAuthenticated, isAdmin, allUser);
router.get("/get-user/:userId", IsAuthenticated, getUserById);
router.put("/update/:id", IsAuthenticated, singleUpload, updateuser);

export default router;
