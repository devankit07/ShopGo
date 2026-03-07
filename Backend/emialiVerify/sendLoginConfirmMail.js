import nodemailer from "nodemailer";
import "dotenv/config";

const LOGIN_VERIFY_EXPIRY_MIN = 5;

export async function sendLoginConfirmMail(email, approveLink, displayCode) {
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
      subject: "Confirm your login - ShopGo",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #333;">Verify that it's you</h2>
          <p style="color: #555;">To help keep your account safe, we want to make sure it's really you signing in.</p>
          <p style="color: #555;">We sent a login request to this email. Tap the button below to approve, then confirm the code <strong>${displayCode}</strong> on the next screen.</p>
          <p style="margin: 24px 0;">
            <a href="${approveLink}" style="display: inline-block; padding: 12px 24px; background: #ec4899; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Yes, it's me</a>
          </p>
          <p style="color: #888; font-size: 14px;">This link is valid for ${LOGIN_VERIFY_EXPIRY_MIN} minutes. If you didn't try to sign in, you can ignore this email.</p>
          <p style="color: #888; font-size: 13px; margin-top: 12px;">Tip: For the best experience, open this link in the same browser tab where you started login.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Login confirmation email sent to:", email);
    return info;
  } catch (error) {
    console.error("Error sending login confirm mail:", error.message);
    return null;
  }
}
