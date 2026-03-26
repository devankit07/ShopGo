import { Frown, Smile, Sparkles } from "lucide-react";

const moodConfig = {
  empty: {
    label: "Just arrived",
    hint: "Start filling details and I will wake up.",
    Icon: Frown,
    tone: "text-slate-300",
  },
  typing: {
    label: "Thinking...",
    hint: "Nice. Keep going, almost there.",
    Icon: Sparkles,
    tone: "text-amber-200",
  },
  done: {
    label: "All set!",
    hint: "Looks great. You can continue now.",
    Icon: Smile,
    tone: "text-emerald-200",
  },
};

export default function AuthMoodPanel({
  mode = "login",
  mood = "empty",
  activeField = "",
  accountType = "user",
}) {
  const current = moodConfig[mood] || moodConfig.empty;
  const robotMood = mood === "done" ? "happy" : mood === "typing" ? "neutral" : "sad";
  const title =
    mode === "signup"
      ? accountType === "admin"
        ? "Admin Access Registration"
        : "Create Your ShopGo Account"
      : "Welcome Back to ShopGo";

  return (
    <aside className="hidden min-h-[580px] rounded-3xl border border-white/15 bg-[#111a2b] p-8 text-white shadow-2xl lg:flex lg:flex-col lg:justify-between">
      <div>
        <p className="inline-flex items-center rounded-full border border-[#fc8019]/35 bg-[#fc8019]/15 px-3 py-1 text-xs font-semibold text-[#ffd7b5]">
          Interactive Login Companion
        </p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">
          As you type, this character reacts to your progress to make auth feel alive.
        </p>
      </div>

      <div className="relative mx-auto mt-6 h-[360px] w-[280px]">
        <div className="absolute inset-0 rounded-[34px] bg-gradient-to-br from-[#8eb6d9] via-[#6f9bc6] to-[#4476b6]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.35),transparent_42%),linear-gradient(160deg,rgba(8,27,57,0.22),rgba(7,18,42,0.5))]" />
        <div className="absolute bottom-4 left-5 h-7 w-44 rounded-full bg-[#93bdf2]/55 blur-sm" />
        <div className="absolute bottom-3 right-5 h-8 w-32 rounded-full bg-[#7ea8e4]/45 blur-sm" />
        <div className="relative mx-auto h-[320px] w-[250px] p-2">
          <div className="absolute left-1/2 top-2 h-8 w-2 -translate-x-1/2 rounded-full bg-[#2f6fe0]" />
          <div className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#47c2ff]" />

          <div className="absolute left-1/2 top-8 h-[106px] w-[138px] -translate-x-1/2 rounded-[28px] border-4 border-[#2f6fe0] bg-white shadow-lg">
            <div className="absolute left-1/2 top-3 h-[68px] w-[96px] -translate-x-1/2 rounded-2xl bg-[#121a2b] shadow-inner" />
            <div className="absolute left-[34px] top-8 h-3.5 w-3.5 rounded-full bg-[#47d8ff] shadow-[0_0_16px_2px_rgba(71,216,255,0.8)]" />
            <div className="absolute right-[34px] top-8 h-3.5 w-3.5 rounded-full bg-[#47d8ff] shadow-[0_0_16px_2px_rgba(71,216,255,0.8)]" />
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

      <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4">
        <p className={`inline-flex items-center gap-2 text-sm font-semibold ${current.tone}`}>
          <current.Icon className="h-4 w-4" />
          {current.label}
        </p>
        <p className="mt-1 text-sm text-slate-300">{current.hint}</p>
        <p className="mt-3 text-xs text-slate-400">
          Active field: <span className="font-semibold text-slate-300">{activeField || "none"}</span>
        </p>
      </div>
    </aside>
  );
}
