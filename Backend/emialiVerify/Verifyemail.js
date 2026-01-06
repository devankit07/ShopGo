import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {
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
    subject: "Email Verification",
    text: `hi! Please verify your email address by clicking on the link below http://localhost:5173/verify/${token} thank you`,
  };

  transporter.sendMail(mailconfiguration, (error, info) => {
    if (error) throw Error(error);
    console.log("Email sent successfully");
    console.log(info);
  });
};
