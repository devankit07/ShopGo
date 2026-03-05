import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userslice";

const DIGITS = 6;
const RESEND_COOLDOWN_SEC = 30;

const VerifyOTP = () => {
  const [otp, setOtp] = useState(Array(DIGITS).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getPendingToken = () => sessionStorage.getItem("pendingToken");

  useEffect(() => {
    if (!getPendingToken()) {
      toast.error("Session expired. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index, value) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, DIGITS).split("");
      const newOtp = [...otp];
      pasted.forEach((d, i) => {
        if (index + i < DIGITS) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const next = Math.min(index + pasted.length, DIGITS - 1);
      focusInput(next);
      return;
    }
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");
    if (digit && index < DIGITS - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    if (!pasted) return;
    const arr = pasted.split("");
    const newOtp = [...otp];
    arr.forEach((d, i) => { newOtp[i] = d; });
    setOtp(newOtp);
    focusInput(Math.min(arr.length, DIGITS - 1));
    setError("");
  };

  const handleVerify = useCallback(async () => {
    const token = getPendingToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    const code = otp.join("");
    if (code.length !== DIGITS) {
      setError("Please enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/verify-login-otp",
        { otp: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        sessionStorage.removeItem("pendingToken");
        localStorage.setItem("accesstoken", res.data.accesstoken);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        if (res.data.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [otp, dispatch, navigate]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const token = getPendingToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setResendLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/resend-login-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setResendCooldown(RESEND_COOLDOWN_SEC);
        setOtp(Array(DIGITS).fill(""));
        focusInput(0);
      } else {
        setError(res.data.message || "Could not resend code.");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      const retry = err.response?.data?.retryAfterSeconds;
      setError(msg || "Could not resend code.");
      if (retry) setResendCooldown(retry);
    } finally {
      setResendLoading(false);
    }
  };

  if (!getPendingToken()) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center space-y-1 pb-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
            <ShieldCheck className="h-6 w-6 text-pink-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Enter verification code
          </CardTitle>
          <CardDescription className="text-slate-400">
            We sent a 6-digit code to your email. Enter it below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="h-12 w-10 sm:w-12 rounded-lg border border-slate-600 bg-slate-800 text-center text-lg font-semibold text-white outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          {error && (
            <p className="text-center text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <Button
            disabled={loading || otp.join("").length !== DIGITS}
            onClick={handleVerify}
            className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-700 pt-6">
          <p className="text-sm text-slate-400 text-center">
            Didn&apos;t receive the code?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-pink-400 hover:text-pink-300 disabled:opacity-50"
              disabled={resendCooldown > 0 || resendLoading}
              onClick={handleResend}
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : resendLoading
                ? "Sending..."
                : "Resend OTP"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
