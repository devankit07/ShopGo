import express from "express";
import {
  allUser,
  changePassword,
  forgotPassword,
  getUserById,
  login,
  logout,
  register,
  resetPassword,
  updateuser,
} from "../controllers/userController.js";
import { isAdmin, IsAuthenticated } from "../middleware/IsAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", IsAuthenticated, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password/:email", changePassword);
router.get("/all-user", IsAuthenticated, isAdmin, allUser);
router.get("/get-user/:userId", IsAuthenticated, getUserById);
router.put("/update/:id", IsAuthenticated, singleUpload, updateuser);

export default router;
