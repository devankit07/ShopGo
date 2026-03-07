import express from "express";
import {
  allUser,
  approveLogin,
  changePassword,
  checkLoginVerification,
  completeLogin,
  completeLoginByToken,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  resendLoginVerification,
  updateuser,
  verifyotp,
} from "../controllers/userController.js";
import { isAdmin, IsAuthenticated } from "../middleware/IsAuthenticated.js";
import { verifyPendingLoginToken } from "../middleware/verifyPendingLoginToken.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-login-verification", verifyPendingLoginToken, checkLoginVerification);
router.get("/approve-login", approveLogin);
router.post("/complete-login", verifyPendingLoginToken, completeLogin);
router.post("/complete-login-by-token", completeLoginByToken);
router.post("/resend-login-verification", verifyPendingLoginToken, resendLoginVerification);
router.post("/logout", IsAuthenticated, logout);
router.post("/forgot-password", IsAuthenticated, forgotPassword);
router.post("/verify-otp/:email", verifyotp);
router.post("/change-password/:email", changePassword);
router.get("/all-user", IsAuthenticated, isAdmin, allUser);
router.get("/get-user/:userId", IsAuthenticated, getUserById);
router.put("/update/:id", IsAuthenticated, singleUpload, updateuser);

export default router;
