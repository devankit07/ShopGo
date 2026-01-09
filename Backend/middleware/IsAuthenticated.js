import { User } from "../models/userModel.js";
import Jwt from "jsonwebtoken";

export const IsAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is Invalid or Missing",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = Jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Your session has expired. Please login again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user= user
    req.id = user._id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const isAdmin = (req,res,next)=>{
  if(req.user && req.user.role === 'admin'){
    next()
  }else{
    return res.status(403).json({
     message:"Access denied: admins only"

    })
  }
}