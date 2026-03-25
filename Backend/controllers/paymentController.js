import crypto from "crypto";
import Razorpay from "razorpay";

let razorpayInstance = null;
let razorpayConfigKey = "";

const envValue = (name) => (process.env[name] || "").trim();

function getRazorpayConfig() {
  const keyId = envValue("RAZORPAY_KEY_ID");
  const keySecret = envValue("RAZORPAY_KEY_SECRET");

  if (!keyId || !keySecret) {
    return {
      keyId,
      keySecret,
      error:
        "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend environment variables.",
    };
  }

  if (keyId === keySecret) {
    return {
      keyId,
      keySecret,
      error:
        "RAZORPAY_KEY_SECRET is invalid (it matches key_id). Use the secret generated with your Razorpay API key.",
    };
  }

  return { keyId, keySecret, error: null };
}

function getRazorpay() {
  const { keyId, keySecret, error } = getRazorpayConfig();
  if (error) return { instance: null, error };

  const currentConfigKey = `${keyId}:${keySecret}`;
  if (!razorpayInstance || razorpayConfigKey !== currentConfigKey) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    razorpayConfigKey = currentConfigKey;
  }

  return { instance: razorpayInstance, error: null };
}

/** Public key_id only (required by Razorpay.js in the browser). Secret never leaves the server. */
export const getRazorpayPublicConfig = (req, res) => {
  const { keyId, error } = getRazorpayConfig();
  if (error || !keyId) {
    return res.status(503).json({
      success: false,
      message: error || "Razorpay key_id is not configured.",
    });
  }
  return res.json({ success: true, keyId });
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid amount is required.",
      });
    }

    const { instance: razorpay, error: configError } = getRazorpay();
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: configError || "Razorpay is not configured.",
      });
    }

    const amountInPaise = Math.round(parsedAmount * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    const gatewayMessage = error?.error?.description || error?.message;
    return res.status(500).json({
      success: false,
      message: gatewayMessage || "Failed to create Razorpay order.",
    });
  }
};

export const verifyRazorpayPayment = (req, res) => {
  try {
    const razorpayOrderId = String(req.body?.razorpay_order_id || "").trim();
    const razorpayPaymentId = String(req.body?.razorpay_payment_id || "").trim();
    const razorpaySignature = String(req.body?.razorpay_signature || "").trim();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message:
          "Missing payment verification fields (razorpay_order_id, razorpay_payment_id, razorpay_signature).",
      });
    }

    const { keySecret, error } = getRazorpayConfig();
    if (error || !keySecret) {
      return res.status(500).json({
        success: false,
        message: error || "Razorpay secret is not configured.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const sameLength = generatedSignature.length === razorpaySignature.length;
    const signatureValid =
      sameLength &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpaySignature)
      );

    if (!signatureValid) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    return res.json({
      success: true,
      message: "Payment verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not verify payment.",
    });
  }
};
