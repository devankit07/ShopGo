import React, { useMemo, useState } from "react";
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
import { AlertTriangle, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import AuthMoodPanel from "@/components/auth/AuthMoodPanel";

const parseAllowedAdminEmails = () =>
  String(import.meta.env.VITE_ADMIN_SIGNUP_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "admin" ? "admin" : "user";
  const [accountType, setAccountType] = useState(initialType);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const allowedAdminEmails = useMemo(parseAllowedAdminEmails, []);
  const enteredEmail = formData.email.trim().toLowerCase();
  const adminEmailAllowed =
    accountType === "admin"
      ? allowedAdminEmails.length > 0 && allowedAdminEmails.includes(enteredEmail)
      : true;
  const progressFields = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.password,
  ];
  const filledCount = progressFields.filter(
    (v) => String(v || "").trim().length > 0
  ).length;
  const mood = filledCount === 0 ? "empty" : filledCount < progressFields.length ? "typing" : "done";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/api/v1/user/register", {
        firstName:
          accountType === "admin"
            ? "Admin"
            : formData.firstName.trim(),
        lastName:
          accountType === "admin"
            ? ""
            : formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: accountType,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login", { replace: true });
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

  return (
    <div className="min-h-screen bg-[#030508] p-4 transition-colors duration-300">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-6 py-8 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="w-full bg-[#0f1724]/90 border-white/15 shadow-2xl backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-white">
            {accountType === "admin" ? "Create admin account" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {accountType === "admin"
              ? "Admin access requires an approved admin email"
              : "Enter your details to get started with ShopGo"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="grid gap-5">
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-slate-300">Account type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType("user")}
                  className={`h-10 rounded-lg border text-sm font-semibold transition-colors ${
                    accountType === "user"
                      ? "border-[#fc8019] bg-[#fc8019]/20 text-[#ffd7b5]"
                      : "border-white/20 bg-white/10 text-slate-300"
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("admin")}
                  className={`h-10 rounded-lg border text-sm font-semibold transition-colors ${
                    accountType === "admin"
                      ? "border-amber-400 bg-amber-500/20 text-amber-200"
                      : "border-white/20 bg-white/10 text-slate-300"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {accountType === "admin" ? (
              <div
                className={`rounded-lg border px-3 py-2 text-xs ${
                  adminEmailAllowed
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-200"
                }`}
              >
                <p className="mb-1 inline-flex items-center gap-1 font-semibold">
                  {adminEmailAllowed ? (
                    <ShieldCheck className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                  Admin email validation
                </p>
                <p>
                  {allowedAdminEmails.length === 0
                    ? "Local list is not configured. Server will validate admin access."
                    : adminEmailAllowed
                    ? "Approved admin email detected. You can continue."
                    : "This email may be rejected by server if not in admin allow-list."}
                </p>
              </div>
            ) : null}

            {accountType !== "admin" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-slate-200">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setActiveField("firstName")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#fc8019] h-11"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-slate-200">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setActiveField("lastName")}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-[#fc8019] h-11"
                  />
                </div>
              </>
            ) : null}
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
              <Label htmlFor="password" className="text-sm font-medium text-slate-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Create a password"
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
                  Creating account...
                </>
              ) : (
                accountType === "admin" ? "Sign up as admin" : "Sign up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-white/10 pt-6">
          <p className="text-sm text-slate-300 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#ffb27a] hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
      <AuthMoodPanel
        mode="signup"
        mood={mood}
        activeField={activeField}
        accountType={accountType}
      />
      </div>
    </div>
  );
};

export default Signup;
