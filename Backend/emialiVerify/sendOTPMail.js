import nodemailer from "nodemailer";
import "dotenv/config";

const RESEND_COOLDOWN_SEC = 30;
const OTP_EXPIRY_MIN_LOGIN = 5;
const OTP_EXPIRY_MIN_PASSWORD = 10;

export const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_SEC * 1000;

export const sendOTPMail = async (otp, email, type = "password") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const isLogin = type === "login";
    const subject = isLogin ? "Login verification code - ShopGo" : "Password Reset OTP - ShopGo";
    const title = isLogin ? "Login verification" : "Password reset";
    const validityMin = isLogin ? OTP_EXPIRY_MIN_LOGIN : OTP_EXPIRY_MIN_PASSWORD;

    const mailconfiguration = {
      from: process.env.MAIL_USER,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">ShopGo - ${title}</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>This code is valid for ${validityMin} minutes only.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailconfiguration);
    console.log("OTP sent successfully to:", email);
    return info;
  } catch (error) {
    console.error("Error sending OTP mail:", error.message);
    return null;
  }
};