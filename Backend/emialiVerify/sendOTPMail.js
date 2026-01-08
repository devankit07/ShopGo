import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, 
      },
    });

    const mailconfiguration = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP - ShopGo",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">ShopGo Security</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes only.</p>
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