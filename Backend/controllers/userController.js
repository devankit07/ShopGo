import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendResetPasswordMail } from "../emialiVerify/sendResetPasswordMail.js";
import cloudinary from "../utils/cloudinary.js";

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: (lastName || "").trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "Account created successfully. You can now log in.",
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accesstoken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.resetToken;
    delete userResponse.resetTokenExpiry;

    return res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Welcome to the admin panel"
          : `Welcome back ${user.firstName}`,
      user: userResponse,
      accesstoken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return the same message to avoid leaking whether an account exists
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      await user.save();

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
      await sendResetPasswordMail(user.email, resetLink);
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired. Please request a new one.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────

export const changePassword = async (req, res) => {
  try {
    const { newpassword, confirmpassword } = req.body;
    const { email } = req.params;

    if (!newpassword || !confirmpassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (newpassword !== confirmpassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const allUser = async (req, res) => {
  try {
    const users = await User.find().select("-password -resetToken -resetTokenExpiry");
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -resetToken -resetTokenExpiry");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateuser = async (req, res) => {
  try {
    const useridToUpdate = req.params.id;
    const loggeInUser = req.user;
    const { firstName, lastName, phoneNo, address, city, ZipCode, role } = req.body;

    if (
      loggeInUser._id.toString() !== useridToUpdate &&
      loggeInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }

    const user = await User.findById(useridToUpdate);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    if (firstName !== undefined && firstName !== "") user.firstName = firstName;
    if (lastName !== undefined && lastName !== "") user.lastName = lastName;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (ZipCode !== undefined) user.ZipCode = ZipCode;
    if (phoneNo !== undefined) user.phoneNo = phoneNo;
    if (role !== undefined && loggeInUser.role === "admin") user.role = role;
    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    delete userResponse.resetToken;
    delete userResponse.resetTokenExpiry;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
