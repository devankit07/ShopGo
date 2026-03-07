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
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userslice";

const POLL_INTERVAL_MS = 2500;
const RESEND_COOLDOWN_SEC = 30;

const API_BASE = "http://localhost:8000/api/v1/user";

const VerifyOTP = () => {
  const [displayCode, setDisplayCode] = useState(
    () => sessionStorage.getItem("loginDisplayCode") || ""
  );
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pollRef = useRef(null);

  const getPendingToken = () => sessionStorage.getItem("pendingToken");

  // When the email link opens in a new tab, we have approved=1&loginToken but no pendingToken.
  // Don't treat that as "session expired" – complete login with the one-time token instead.
  const hasLoginTokenInUrl = () => {
    const approved = searchParams.get("approved");
    const loginToken = searchParams.get("loginToken");
    return approved === "1" && !!loginToken;
  };

  useEffect(() => {
    if (hasLoginTokenInUrl()) return;
    if (!getPendingToken()) {
      navigate("/login", { replace: true, state: { loginMessage: "Session expired. Please log in again." } });
      return;
    }
  }, [navigate, searchParams]);

  const completeLoginAndRedirect = useCallback(
    async (accesstoken, refreshtoken, user) => {
      sessionStorage.removeItem("pendingToken");
      sessionStorage.removeItem("loginDisplayCode");
      localStorage.setItem("accesstoken", accesstoken);
      if (refreshtoken) localStorage.setItem("refreshtoken", refreshtoken);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    [dispatch, navigate]
  );

  const callCompleteLogin = useCallback(async () => {
    const token = getPendingToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/complete-login`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success && res.data.accesstoken) {
        toast.success(res.data.message);
        await completeLoginAndRedirect(
          res.data.accesstoken,
          res.data.refreshtoken,
          res.data.user
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not complete login.");
    } finally {
      setLoading(false);
    }
  }, [completeLoginAndRedirect]);

  // Handle redirect from email link (same tab or new tab)
  useEffect(() => {
    const approved = searchParams.get("approved");
    const loginToken = searchParams.get("loginToken");
    const error = searchParams.get("error");

    if (error) {
      const message =
        error === "expired"
          ? "Verification link expired. Please log in again."
          : error === "missing_token"
            ? "Invalid link."
            : "Something went wrong. Please try again.";
      setSearchParams({}, { replace: true });
      navigate("/login", { replace: true, state: { loginMessage: message } });
      return;
    }

    if (approved === "1" && loginToken) {
      setSearchParams({}, { replace: true });
      setLoading(true);
      axios
        .post(`${API_BASE}/complete-login-by-token`, { loginToken })
        .then((res) => {
          if (res.data.success && res.data.accesstoken) {
            toast.success(res.data.message);
            completeLoginAndRedirect(
              res.data.accesstoken,
              res.data.refreshtoken,
              res.data.user
            );
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "Could not complete login.");
          navigate("/login", { replace: true });
        })
        .finally(() => setLoading(false));
      return;
    }

    if (approved === "1" && !loginToken) {
      setSearchParams({}, { replace: true });
      callCompleteLogin();
    }
  }, [searchParams, setSearchParams, callCompleteLogin, completeLoginAndRedirect, navigate]);

  // If the email link opened in another tab and completed login there, this tab can redirect to home (localStorage is shared)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "accesstoken" && e.newValue) {
        navigate("/", { replace: true });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [navigate]);

  // Poll for verification (user clicked link in another tab/device)
  useEffect(() => {
    const token = getPendingToken();
    if (!token || loading) return;

    const poll = async () => {
      try {
        const res = await axios.get(`${API_BASE}/check-login-verification`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.verified) {
          if (pollRef.current) clearInterval(pollRef.current);
          callCompleteLogin();
        }
        if (res.data.displayCode && !displayCode) {
          setDisplayCode(res.data.displayCode);
          sessionStorage.setItem("loginDisplayCode", res.data.displayCode);
        }
      } catch {
        // ignore poll errors
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loading, displayCode, callCompleteLogin]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const token = getPendingToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    setResendLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/resend-login-verification`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setResendCooldown(RESEND_COOLDOWN_SEC);
        if (res.data.displayCode) {
          setDisplayCode(res.data.displayCode);
          sessionStorage.setItem("loginDisplayCode", res.data.displayCode);
        }
      } else {
        toast.error(res.data.message || "Could not resend.");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      const retry = err.response?.data?.retryAfterSeconds;
      toast.error(msg || "Could not resend.");
      if (retry) setResendCooldown(retry);
    } finally {
      setResendLoading(false);
    }
  };

  if (!getPendingToken() && !hasLoginTokenInUrl()) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center space-y-1 pb-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
            <ShieldCheck className="h-6 w-6 text-pink-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Verify that it&apos;s you
          </CardTitle>
          <CardDescription className="text-slate-400">
            To help keep your account safe, we want to make sure it&apos;s really you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {displayCode && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-slate-400 text-sm">Your verification code</span>
              <div className="text-5xl font-bold tabular-nums text-white tracking-widest bg-slate-800 border border-slate-600 rounded-xl px-8 py-4">
                {displayCode}
              </div>
            </div>
          )}
          <p className="text-center text-slate-400 text-sm">
            We sent a confirmation link to your email. Open the link and tap <strong className="text-white">Yes, it&apos;s me</strong>, then confirm the code <strong className="text-white">{displayCode || "—"}</strong> to continue.
          </p>
          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-pink-400" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-slate-700 pt-6">
          <p className="text-sm text-slate-400 text-center">
            Didn&apos;t get the email?{" "}
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
                : "Resend link"}
            </Button>
          </p>
          <p className="text-xs text-slate-500 text-center">
            Need help? Open the link we sent to your email and approve the login.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
