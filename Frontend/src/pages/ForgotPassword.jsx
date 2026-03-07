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
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/v1/user/forgot-password", { email });
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 shadow-2xl backdrop-blur-sm transition-all duration-300">
        <CardHeader className="text-center space-y-1 pb-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20">
            {sent ? (
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            ) : (
              <Mail className="h-6 w-6 text-pink-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {sent ? "Check your email" : "Forgot password?"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {sent
              ? `We sent a reset link to ${email}. Check your inbox and spam folder.`
              : "Enter your email and we'll send you a password reset link."}
          </CardDescription>
        </CardHeader>

        {!sent ? (
          <CardContent>
            <form onSubmit={submitHandler} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-pink-500 h-11"
                />
              </div>
              <Button
                disabled={loading}
                type="submit"
                className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-sm text-slate-400 text-center">
              Didn&apos;t receive it?{" "}
              <button
                onClick={() => setSent(false)}
                className="font-semibold text-pink-400 hover:text-pink-300 hover:underline transition-colors"
              >
                Try again
              </button>
            </p>
          </CardContent>
        )}

        <CardFooter className="border-t border-slate-700 pt-6 justify-center">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
