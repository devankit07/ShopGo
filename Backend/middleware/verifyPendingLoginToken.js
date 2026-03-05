import jwt from "jsonwebtoken";

/**
 * Verifies the short-lived JWT issued after login (before OTP).
 * Sets req.payload = { email } for use in verifyLoginOtp and resendLoginOtp.
 */
export const verifyPendingLoginToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const pendingToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.body?.pendingToken;

    if (!pendingToken) {
      return res.status(401).json({
        success: false,
        message: "Verification session expired or invalid. Please log in again.",
      });
    }

    const decoded = jwt.verify(pendingToken, process.env.SECRET_KEY);
    if (decoded.purpose !== "login_otp" || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid verification session. Please log in again.",
      });
    }

    req.payload = { email: decoded.email };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid verification session. Please log in again.",
    });
  }
};
