import nodemailer from "nodemailer";
import "dotenv/config";

const RESET_EXPIRY_MIN = 15;

export async function sendResetPasswordMail(email, resetLink) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reset your password - ShopGo",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #333;">Reset your ShopGo password</h2>
          <p style="color: #555;">We received a request to reset your password. Click the button below to choose a new one.</p>
          <p style="margin: 28px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 28px; background: #14b8a6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">Reset Password</a>
          </p>
          <p style="color: #888; font-size: 14px;">This link expires in ${RESET_EXPIRY_MIN} minutes. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Reset password email sent to:", email);
  } catch (error) {
    console.error("Error sending reset password mail:", error.message);
  }
}
