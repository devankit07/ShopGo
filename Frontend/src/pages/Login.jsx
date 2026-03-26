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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userslice";
import { setAccessToken, setRefreshToken, setStoredUser } from "@/lib/authStorage";
import AuthMoodPanel from "@/components/auth/AuthMoodPanel";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [activeField, setActiveField] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/user/login", formData);
      if (res.data.success) {
        setAccessToken(res.data.accesstoken);
        setRefreshToken(res.data.refreshtoken);
        setStoredUser(res.data.user);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        if (res.data.user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      const isNetworkIssue =
        error?.code === "ECONNABORTED" ||
        error?.code === "ERR_NETWORK" ||
        String(error?.message || "").includes("Network Error");
      toast.error(
        error.response?.data?.message ||
          (isNetworkIssue
            ? "Cannot reach backend API. Start backend on port 8000."
            : "Something went wrong")
      );
    } finally {
      setLoading(false);
    }
  };

  const filledCount = [formData.email, formData.password].filter(
    (v) => String(v || "").trim().length > 0
  ).length;
  const mood = filledCount === 0 ? "empty" : filledCount < 2 ? "typing" : "done";

  return (
    <div className="min-h-screen bg-[#030508] p-4 transition-colors duration-300">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 py-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="w-full bg-[#0f1724]/90 border-white/15 shadow-2xl backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-white">
            Log in to your account
          </CardTitle>
          <CardDescription className="text-slate-300">
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setActiveField("email")}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#fc8019] h-11"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#ffb27a] hover:text-[#ffc79d] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setActiveField("password")}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#fc8019] h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#fc8019] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button
              disabled={loading}
              type="submit"
              className="w-full h-11 mt-2 bg-[#fc8019] hover:bg-[#ea7310] text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Please wait...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
          <Button
            type="button"
            variant="ghost"
            className="mt-3 w-full text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => navigate("/", { replace: true })}
          >
            Skip for now
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-6">
          <p className="text-sm text-slate-300 text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#ffb27a] hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
      <AuthMoodPanel mode="login" mood={mood} activeField={activeField} />
      </div>
    </div>
  );
};

export default Login;
