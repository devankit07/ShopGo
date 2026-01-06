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
