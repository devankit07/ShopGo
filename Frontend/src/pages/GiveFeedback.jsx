import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1";

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
    <main className="dark min-h-screen bg-[#262a30] pt-24 pb-16">
      <div className="max-w-xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Give Feedback</h1>
            <p className="text-sm text-gray-400">We’d love to hear from you</p>
          </div>
        </div>

        {submitted ? (
          <div className="rounded-2xl bg-[#2d3136] border border-white/10 p-8 text-center">
            <p className="text-white font-medium">Thanks for your feedback!</p>
            <p className="mt-2 text-sm text-gray-400">
              Your response helps us improve SHOP-GO.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Button
                variant="outline"
                className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
                onClick={() => setSubmitted(false)}
              >
                Submit another
              </Button>
              <Button
                className="bg-teal-500 text-white hover:bg-teal-600"
                onClick={() => navigate("/feedback")}
              >
                View all feedback
              </Button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-[#2d3136] border border-white/10 p-6 md:p-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full h-11 px-4 rounded-xl bg-[#1e2228] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full h-11 px-4 rounded-xl bg-[#1e2228] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    className="p-1 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`w-8 h-8 ${
                        form.rating >= star
                          ? "fill-teal-400 text-teal-400"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your feedback <span className="text-gray-500">(required)</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Tell us about your experience..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1e2228] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600"
              >
                Submit Feedback
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-white/20 text-gray-400 hover:bg-white/5"
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
