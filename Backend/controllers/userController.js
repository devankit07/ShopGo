import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { LoginOTP } from "../models/loginOtpModel.js";
import { sendOTPMail } from "../emialiVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

const LOGIN_OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nameTrimmed = String(name).trim();
    const firstName = nameTrimmed.includes(" ") ? nameTrimmed.split(" ")[0] : nameTrimmed;
    const lastName = nameTrimmed.includes(" ") ? nameTrimmed.slice(firstName.length).trim() : "";

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.token;
    delete userResponse.otp;
    delete userResponse.otpExpiry;

    return res.status(201).json({
      success: true,
      message: "Account created successfully. You can now log in.",
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const user = await User.findOne({ email });
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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + LOGIN_OTP_EXPIRY_MS);
    const lastSentAt = new Date();

    await LoginOTP.findOneAndDelete({ userId: user._id });
    await LoginOTP.create({
      userId: user._id,
      otpHash,
      expiresAt,
      lastSentAt,
    });

    await sendOTPMail(otp, email, "login");

    const pendingToken = jwt.sign(
      { email: user.email, purpose: "login_otp" },
      process.env.SECRET_KEY,
      { expiresIn: "5m" },
    );

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      pendingToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyLoginOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.payload;

    if (!otp || String(otp).length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit code",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const loginOtpDoc = await LoginOTP.findOne({ userId: user._id });
    if (!loginOtpDoc) {
      return res.status(400).json({
        success: false,
        message: "No verification pending. Please log in again.",
      });
    }

    if (loginOtpDoc.attempts >= MAX_OTP_ATTEMPTS) {
      await LoginOTP.findOneAndDelete({ userId: user._id });
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please log in again to get a new code.",
      });
    }

    if (new Date() > loginOtpDoc.expiresAt) {
      await LoginOTP.findOneAndDelete({ userId: user._id });
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    const isOtpValid = await bcrypt.compare(otp, loginOtpDoc.otpHash);
    if (!isOtpValid) {
      loginOtpDoc.attempts += 1;
      await loginOtpDoc.save();
      const remaining = MAX_OTP_ATTEMPTS - loginOtpDoc.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid code. ${remaining} attempt(s) remaining.`,
      });
    }

    await LoginOTP.findOneAndDelete({ userId: user._id });

    const accesstoken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshtoken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "30d" },
    );

    await Session.findOneAndDelete({ userId: user._id });
    await Session.create({ userId: user._id });
    user.isLoggedIn = true;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.otp;
    delete userResponse.otpExpiry;
    delete userResponse.token;

    return res.status(200).json({
      success: true,
      message: user.role === "admin" ? "Welcome to the admin panel" : `Welcome back ${user.firstName}`,
      user: userResponse,
      accesstoken,
      refreshtoken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.payload;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const loginOtpDoc = await LoginOTP.findOne({ userId: user._id });
    if (!loginOtpDoc) {
      return res.status(400).json({
        success: false,
        message: "No verification pending. Please log in again.",
      });
    }

    const now = Date.now();
    const lastSent = loginOtpDoc.lastSentAt.getTime();
    if (now - lastSent < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting a new code.`,
        retryAfterSeconds: waitSec,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + LOGIN_OTP_EXPIRY_MS);
    const lastSentAt = new Date();

    loginOtpDoc.otpHash = otpHash;
    loginOtpDoc.expiresAt = expiresAt;
    loginOtpDoc.lastSentAt = lastSentAt;
    loginOtpDoc.attempts = 0;
    await loginOtpDoc.save();

    await sendOTPMail(otp, email, "login");

    return res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.id;

    await Session.findOneAndDelete({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpexpire = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpexpire;

    await user.save();

    await sendOTPMail(otp, email);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyotp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "opt is not generated or already verified",
      });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "otp has expired please request a new one",
      });
    }
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "otp is invalid",
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "opt verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { newpassword, confirmpassword } = req.body;
    const { email } = req.params;

    if (!newpassword || !confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newpassword !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedpassword;

    user.isLoggedIn = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const allUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params; //userid extract via params
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateuser = async (req, res) => {
  try {
    const useridToUpdate = req.params.id; // user id for update
    const loggeInUser = req.user; // from isauthenticated middleware
    const { firstName, lastName, phoneNo, address, city, ZipCode, role } =
      req.body;

    if (
      loggeInUser._id.toString() !== useridToUpdate &&
      loggeInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this profile",
      });
    }
    let user = await User.findById(useridToUpdate);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "user not found",
      });
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
          },
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }
    // update fields (only when provided so we don't overwrite with undefined)
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
    delete userResponse.otp;
    delete userResponse.otpExpiry;
    delete userResponse.token;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });



  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
