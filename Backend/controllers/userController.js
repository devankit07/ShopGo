import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import {
  LoginVerification,
  generateDisplayCode,
  generateVerifyToken,
} from "../models/loginVerificationModel.js";
import { sendLoginConfirmMail } from "../emialiVerify/sendLoginConfirmMail.js";
import { sendOTPMail } from "../emialiVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

const LOGIN_VERIFY_EXPIRY_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;
const PENDING_LOGIN_PURPOSE = "login_verify";


export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required",
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
    const firstNameTrimmed = String(firstName).trim();
    const lastNameTrimmed = String(lastName).trim();

    const newUser = await User.create({
      firstName: firstNameTrimmed,
      lastName: lastNameTrimmed,
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

    const displayCode = generateDisplayCode();
    const verifyToken = generateVerifyToken();
    const expiresAt = new Date(Date.now() + LOGIN_VERIFY_EXPIRY_MS);
    const lastSentAt = new Date();

    await LoginVerification.deleteMany({ userId: user._id });
    await LoginVerification.create({
      userId: user._id,
      displayCode,
      verifyToken,
      expiresAt,
      lastSentAt,
    });

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const approveLink = `${backendUrl}/api/v1/user/approve-login?token=${verifyToken}`;
    await sendLoginConfirmMail(email, approveLink, displayCode);

    const pendingToken = jwt.sign(
      { email: user.email, purpose: PENDING_LOGIN_PURPOSE },
      process.env.SECRET_KEY,
      { expiresIn: "5m" },
    );

    return res.status(200).json({
      success: true,
      message: "We sent a confirmation link to your email. Open it and confirm to continue.",
      pendingToken,
      displayCode,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/** GET: Poll to see if user has approved login via email link */
export const checkLoginVerification = async (req, res) => {
  try {
    const { email } = req.payload;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const verification = await LoginVerification.findOne({ userId: user._id });
    if (!verification) {
      return res.status(200).json({
        success: true,
        verified: false,
        message: "No verification pending.",
      });
    }
    if (new Date() > verification.expiresAt) {
      await LoginVerification.deleteOne({ _id: verification._id });
      return res.status(200).json({
        success: true,
        verified: false,
        message: "Verification expired.",
      });
    }
    return res.status(200).json({
      success: true,
      verified: !!verification.approvedAt,
      displayCode: verification.displayCode,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/** GET: Magic link from email – mark verification approved and redirect to frontend with one-time token (so the tab that opens from the link can complete login without sessionStorage) */
export const approveLogin = async (req, res) => {
  try {
    const { token } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    if (!token) {
      return res.redirect(`${frontendUrl}/verify-otp?error=missing_token`);
    }
    const verification = await LoginVerification.findOne({ verifyToken: token });
    if (!verification || new Date() > verification.expiresAt) {
      return res.redirect(`${frontendUrl}/verify-otp?error=expired`);
    }
    verification.approvedAt = new Date();
    await verification.save();

    const user = await User.findById(verification.userId);
    if (!user) {
      return res.redirect(`${frontendUrl}/verify-otp?error=server`);
    }
    const loginToken = jwt.sign(
      { purpose: "login_complete", userId: user._id.toString(), email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "2m" },
    );
    return res.redirect(`${frontendUrl}/verify-otp?approved=1&loginToken=${loginToken}`);
  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(`${frontendUrl}/verify-otp?error=server`);
  }
};

/** POST: Complete login using one-time token from email link (used when link opens in a new tab – no pendingToken in sessionStorage) */
export const completeLoginByToken = async (req, res) => {
  try {
    const { loginToken } = req.body;
    if (!loginToken) {
      return res.status(400).json({
        success: false,
        message: "Missing login token. Please use the link from your email.",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(loginToken, process.env.SECRET_KEY);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Link expired or invalid. Please log in again.",
      });
    }
    if (decoded.purpose !== "login_complete" || !decoded.userId || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid login link. Please log in again.",
      });
    }

    const user = await User.findOne({ _id: decoded.userId, email: decoded.email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const verification = await LoginVerification.findOne({ userId: user._id });
    if (!verification || !verification.approvedAt) {
      return res.status(400).json({
        success: false,
        message: "Verification not approved. Please use the link from your email.",
      });
    }
    if (new Date() > verification.expiresAt) {
      await LoginVerification.deleteOne({ _id: verification._id });
      return res.status(400).json({
        success: false,
        message: "Verification expired. Please log in again.",
      });
    }

    await LoginVerification.deleteOne({ _id: verification._id });

    const accesstoken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshtoken = jwt.sign(
      { id: user._id, role: user.role },
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

/** POST: After approval (from poll or redirect), issue tokens and complete login */
export const completeLogin = async (req, res) => {
  try {
    const { email } = req.payload;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const verification = await LoginVerification.findOne({ userId: user._id });
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "No verification pending. Please log in again.",
      });
    }
    if (!verification.approvedAt) {
      return res.status(400).json({
        success: false,
        message: "Please approve the login from the link we sent to your email.",
      });
    }
    if (new Date() > verification.expiresAt) {
      await LoginVerification.deleteOne({ _id: verification._id });
      return res.status(400).json({
        success: false,
        message: "Verification expired. Please log in again.",
      });
    }

    await LoginVerification.deleteOne({ _id: verification._id });

    const accesstoken = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "10d" },
    );
    const refreshtoken = jwt.sign(
      { id: user._id, role: user.role },
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

export const resendLoginVerification = async (req, res) => {
  try {
    const { email } = req.payload;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const verification = await LoginVerification.findOne({ userId: user._id });
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "No verification pending. Please log in again.",
      });
    }

    const now = Date.now();
    const lastSent = verification.lastSentAt.getTime();
    if (now - lastSent < RESEND_COOLDOWN_MS) {
      const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (now - lastSent)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting a new link.`,
        retryAfterSeconds: waitSec,
      });
    }

    const displayCode = generateDisplayCode();
    const verifyToken = generateVerifyToken();
    const expiresAt = new Date(Date.now() + LOGIN_VERIFY_EXPIRY_MS);
    const lastSentAt = new Date();

    verification.displayCode = displayCode;
    verification.verifyToken = verifyToken;
    verification.expiresAt = expiresAt;
    verification.lastSentAt = lastSentAt;
    verification.approvedAt = null;
    await verification.save();

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const approveLink = `${backendUrl}/api/v1/user/approve-login?token=${verifyToken}`;
    await sendLoginConfirmMail(email, approveLink, displayCode);

    return res.status(200).json({
      success: true,
      message: "New confirmation link sent to your email",
      displayCode,
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
