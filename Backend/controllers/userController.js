import { User } from "../models/userModel.js";
import brcyptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { verifyEmail } from "../emialiVerify/Verifyemail.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        success: false,
        message: "User already exits",
      });
    }
    const hashedpassword = await brcyptjs.hash(password,10)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password:hashedpassword
    });

    const Token = jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:'10M'})
    verifyEmail(Token,email)
    newUser.token = Token
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ 
        success: false,
        message: "Authorization token is missing or invalid"
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration Token has Expired"
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token Verification failed"
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found"
      });
    }

    user.token = null;
    user.isVerified = true; 
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};