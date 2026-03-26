import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, UserPlus, LogIn, Sparkles } from "lucide-react";
import { getAccessToken } from "@/lib/authStorage";
import DarkMeshBackdrop from "@/components/ui/DarkMeshBackdrop";

const SKIP_KEY = "shopgo_auth_gate_skipped";

export default function AuthEntryGate() {
  const [skipped, setSkipped] = useState(
    () => sessionStorage.getItem(SKIP_KEY) === "1"
  );
  const [focusAction, setFocusAction] = useState("idle");

  const isLoggedIn = Boolean(getAccessToken());
  const showGate = useMemo(() => !isLoggedIn && !skipped, [isLoggedIn, skipped]);

  if (!showGate) return null;

  const moodText =
    focusAction === "login" || focusAction === "user"
      ? "Yay! I am happy to help."
      : focusAction === "admin"
      ? "Admin mode looks awesome."
      : focusAction === "skip"
      ? "Okay, browse first."
      : "I feel a little sad. Pick an option.";
  const robotMood =
    focusAction === "login" || focusAction === "user" || focusAction === "admin"
      ? "happy"
      : focusAction === "skip"
      ? "neutral"
      : "sad";

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden bg-[#030508]">
      <DarkMeshBackdrop glow="top" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(74,144,226,0.22),transparent_42%),radial-gradient(circle_at_80%_25%,rgba(0,183,255,0.16),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(252,128,25,0.14),transparent_44%)]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-[#42a5f5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-[#fc8019]/15 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10">
        <div className="grid w-full gap-8 rounded-[34px] border border-white/15 bg-[#0b1425]/80 p-6 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.85)] backdrop-blur-md md:p-10 lg:grid-cols-[1fr_1.05fr]">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/20 bg-[#f7f9fd] px-6 py-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#282C3F]">
                  <Sparkles className="h-4 w-4 text-[#fc8019]" />
                  ShopGo
                </p>
                <h1 className="mt-2 text-5xl font-extrabold leading-none text-[#1f2430]">
                  Sign in
                </h1>
              </div>
              <Link to="/signup" className="text-xs font-semibold text-[#2f6ed9] hover:underline">
                No account?
                <br />
                Sign up
              </Link>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                onMouseEnter={() => setFocusAction("login")}
                onFocus={() => setFocusAction("login")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b82f6] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2f74e8]"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
              <Link
                to="/signup"
                onMouseEnter={() => setFocusAction("user")}
                onFocus={() => setFocusAction("user")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#d6dbe7] bg-[#f5f7fc] px-4 py-3 text-sm font-semibold text-[#28344f] transition-colors hover:bg-[#edf1fb]"
              >
                <UserPlus className="h-4 w-4" />
                Sign up as User
              </Link>
              <Link
                to="/signup?type=admin"
                onMouseEnter={() => setFocusAction("admin")}
                onFocus={() => setFocusAction("admin")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#ffd7b5] bg-[#fff4ea] px-4 py-3 text-sm font-semibold text-[#7a3f12] transition-colors hover:bg-[#ffecd9]"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin sign up
              </Link>
              <button
                type="button"
                onMouseEnter={() => setFocusAction("skip")}
                onFocus={() => setFocusAction("skip")}
                onClick={() => {
                  sessionStorage.setItem(SKIP_KEY, "1");
                  setSkipped(true);
                }}
                className="w-full rounded-xl border border-[#d6dbe7] bg-white px-4 py-3 text-sm font-semibold text-[#4b556b] transition-colors hover:bg-[#f8f9fd]"
              >
                Skip for now
              </button>
            </div>
          </div>

          <div className="relative hidden min-h-[430px] items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#8eb6d9] via-[#6f9bc6] to-[#4476b6] lg:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.35),transparent_42%),linear-gradient(160deg,rgba(8,27,57,0.22),rgba(7,18,42,0.5))]" />
            <div className="absolute bottom-7 left-7 h-8 w-56 rounded-full bg-[#93bdf2]/45 blur-sm" />
            <div className="absolute bottom-5 right-8 h-10 w-44 rounded-full bg-[#7ea8e4]/5 blur-sm" />
            <div className="relative h-[400px] w-[300px] p-2">
              <div className="relative h-full w-full">
              <div className="absolute left-1/2 top-2 h-8 w-2 -translate-x-1/2 rounded-full bg-[#2f6fe0]" />
              <div className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#47c2ff]" />

              <div className="absolute left-1/2 top-8 h-[106px] w-[138px] -translate-x-1/2 rounded-[28px] border-4 border-[#2f6fe0] bg-white shadow-lg">
                <div className="absolute left-1/2 top-3 h-[68px] w-[96px] -translate-x-1/2 rounded-2xl bg-[#121a2b] shadow-inner" />
                <div
                  className={`absolute top-8 h-3.5 w-3.5 rounded-full bg-[#47d8ff] shadow-[0_0_16px_2px_rgba(71,216,255,0.8)] transition-all duration-300 ${
                    robotMood === "sad" ? "left-[38px]" : "left-[34px]"
                  }`}
                />
                <div
                  className={`absolute top-8 h-3.5 w-3.5 rounded-full bg-[#47d8ff] shadow-[0_0_16px_2px_rgba(71,216,255,0.8)] transition-all duration-300 ${
                    robotMood === "sad" ? "right-[38px]" : "right-[34px]"
                  }`}
                />
                <div
                  className={`absolute left-1/2 top-[52px] -translate-x-1/2 border-[#47d8ff] transition-all duration-300 ${
                    robotMood === "happy"
                      ? "h-3 w-8 rounded-full border-b-2"
                      : robotMood === "neutral"
                      ? "h-0 w-7 border-b-2"
                      : "h-3 w-8 rounded-full border-t-2"
                  }`}
                />
              </div>

              <div className="absolute left-1/2 top-[120px] h-[120px] w-[170px] -translate-x-1/2 rounded-[36px] border-4 border-[#2f6fe0] bg-white shadow-lg" />
              <div className="absolute left-[20px] top-[138px] h-20 w-14 rounded-[24px] border-4 border-[#2f6fe0] bg-white shadow-md" />
              <div
                className={`absolute right-[20px] top-[130px] h-20 w-14 rounded-[24px] border-4 border-[#2f6fe0] bg-white shadow-md transition-transform duration-300 ${
                  robotMood === "happy" ? "-rotate-12 -translate-y-2" : ""
                }`}
              />
              <div className="absolute left-[68px] top-[230px] h-16 w-12 rounded-[18px] border-4 border-[#2f6fe0] bg-white" />
              <div className="absolute right-[68px] top-[230px] h-16 w-12 rounded-[18px] border-4 border-[#2f6fe0] bg-white" />
              <div className="absolute left-[52px] top-[282px] h-10 w-20 rounded-full border-4 border-[#2f6fe0] bg-white" />
              <div className="absolute right-[52px] top-[282px] h-10 w-20 rounded-full border-4 border-[#2f6fe0] bg-white" />

              <div className="absolute left-1/2 top-[258px] h-4 w-4 -translate-x-1/2 rounded-full bg-[#2f6fe0]" />
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-xl border border-white/30 bg-white/85 px-4 py-2 text-center text-sm font-semibold text-[#2d3652] shadow">
                {moodText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
