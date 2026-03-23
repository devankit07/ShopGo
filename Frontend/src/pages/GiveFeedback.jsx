import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "/api/v1";

const inputClass =
  "w-full rounded-xl border border-[#e9e9eb] bg-white px-4 text-[#282C3F] placeholder:text-[#7E808C] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc8019]/40";

export default function GiveFeedback() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accesstoken");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      toast.error("Please enter your feedback.");
      return;
    }
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    axios
      .post(`${API_BASE}/feedback`, form, { headers })
      .then((res) => {
        if (res.data?.success) {
          setSubmitted(true);
          toast.success(res.data.message || "Thank you! Your feedback has been submitted.");
          setForm({ name: "", email: "", rating: 0, message: "" });
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to submit feedback.");
      });
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#f2f4f8_100%)] pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-8 rounded-3xl border border-[#eceef4] bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(40,44,63,0.45)] backdrop-blur sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#fc8019]/35 bg-[#fff5f0] text-[#fc8019]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#282C3F]">Give Feedback</h1>
              <p className="text-sm text-[#7E808C]">Clean form, quick response, better experience</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-3xl border border-[#eceef4] bg-white p-8 text-center shadow-[0_18px_36px_-28px_rgba(40,44,63,0.5)]">
            <p className="font-medium text-[#282C3F]">Thanks for your feedback!</p>
            <p className="mt-2 text-sm text-[#7E808C]">
              Your response helps us improve SHOP-GO.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="border-[#fc8019] text-[#fc8019] hover:bg-[#fff5f0]"
                onClick={() => setSubmitted(false)}
              >
                Submit another
              </Button>
              <Button
                className="bg-[#fc8019] text-white hover:bg-[#ea7310]"
                onClick={() => navigate("/feedback")}
              >
                View all feedback
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-[#eceef4] bg-white p-6 shadow-[0_18px_38px_-28px_rgba(40,44,63,0.5)] md:p-8"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#282C3F]">
                Name (optional)
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className={`${inputClass} h-11`}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#282C3F]">
                Email (optional)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className={`${inputClass} h-11`}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#282C3F]">Rating</label>
              <div className="flex w-fit gap-2 rounded-xl border border-[#f2e4d8] bg-[#fff9f5] p-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    className="rounded-lg p-1 transition-colors hover:bg-white"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        form.rating >= star
                          ? "fill-[#fc8019] text-[#fc8019]"
                          : "text-[#e9e9eb]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#282C3F]">
                Your feedback <span className="font-normal text-[#7E808C]">(required)</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Tell us about your experience..."
                rows={4}
                required
                className={`${inputClass} resize-none py-3`}
              />
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="submit"
                className="h-11 flex-1 rounded-xl bg-[#fc8019] font-semibold text-white shadow-[0_14px_24px_-14px_rgba(252,128,25,0.85)] hover:bg-[#ea7310]"
              >
                Submit Feedback
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-11 border-[#e9e9eb] text-[#7E808C] hover:bg-[#f8f8f8] hover:text-[#282C3F]"
              >
                <Link to="/">Cancel</Link>
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
