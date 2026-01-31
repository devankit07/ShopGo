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
  updateuser,
  verify,
  verifyotp,
} from "../controllers/userController.js";
import { isAdmin, IsAuthenticated } from "../middleware/IsAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify", verify);
router.post("/reverify", reVerify);
router.post("/login", login);
router.post("/logout", IsAuthenticated, logout);
router.post("/forgot-password", IsAuthenticated, forgotPassword);
router.post("/verify-otp/:email", verifyotp);
router.post("/change-password/:email", changePassword);
router.get("/all-user", IsAuthenticated, isAdmin, allUser);
router.get("/get-user/:user-Id", getUserById);
router.put("/update/:id", IsAuthenticated, singleUpload, updateuser);

export default router;
