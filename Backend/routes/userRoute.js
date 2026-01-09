import express from "express";
import {
  allUser,
  changePassword,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  reVerify,
  verify,
  verifyotp,
} from "../controllers/userController.js";
import { isAdmin, IsAuthenticated } from "../middleware/IsAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", IsAuthenticated, logout);
router.post("/forgot-password", IsAuthenticated, forgotPassword);
router.post("/verify-otp/:email", verifyotp);
router.post("/change-password/:email", changePassword);
router.get("/all-user",IsAuthenticated,isAdmin,allUser)
router.get("/get-user/:user-Id",getUserById)


export default router;
