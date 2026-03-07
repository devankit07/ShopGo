import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 shadow-2xl">
          <CardHeader className="text-center space-y-1 pb-2">
            <CardTitle className="text-xl font-bold text-white">Invalid link</CardTitle>
            <CardDescription className="text-slate-400">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center border-t border-slate-700 pt-6">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-pink-400 hover:underline"
            >
              Request a new reset link
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/user/reset-password", {
        token,
        password: form.password,
      });
      if (res.data.success) {
        setDone(true);
        toast.success(res.data.message);
        setTimeout(() => navigate("/login", { replace: true }), 2500);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Reset failed. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center space-y-1 pb-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
            {done ? (
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            ) : (
              <Lock className="h-6 w-6 text-pink-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {done ? "Password reset!" : "Set new password"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {done
              ? "Redirecting you to login..."
              : "Choose a strong new password for your account."}
          </CardDescription>
        </CardHeader>

        {!done && (
          <CardContent>
            <form onSubmit={submitHandler} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-pink-500 h-11 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm" className="text-sm font-medium text-slate-300">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your new password"
                    required
                    value={form.confirm}
                    onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-pink-500 h-11 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-400 transition-colors"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          </CardContent>
        )}

        <CardFooter className="border-t border-slate-700 pt-6 justify-center">
          <Link
            to="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
