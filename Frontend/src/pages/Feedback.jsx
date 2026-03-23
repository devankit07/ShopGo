import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE = "/api/v1";

export default function Feedback() {
  const { user } = useSelector((state) => state.User);
  const token = localStorage.getItem("accesstoken");

  const [list, setList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  const fetchFeedback = () => {
    if (!token) return;
    setLoadingList(true);
    axios
      .get(`${API_BASE}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.feedback)) {
          setList(res.data.feedback);
        }
      })
      .catch(() => {
        toast.error("Failed to load feedback.");
      })
      .finally(() => setLoadingList(false));
  };

  useEffect(() => {
    fetchFeedback();
  }, [token]);

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#f2f4f8_100%)] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 rounded-3xl border border-[#eceef4] bg-white/90 p-6 shadow-[0_20px_40px_-30px_rgba(40,44,63,0.45)] backdrop-blur sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#fc8019]/35 bg-[#fff5f0] text-[#fc8019]">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#282C3F]">Customer Feedback</h1>
              <p className="text-sm text-[#7E808C]">Real voices from our shoppers</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f2e4d8] bg-[#fff9f5] px-4 py-3">
            <p className="text-sm font-medium text-[#3d4152]">
              {loadingList ? "Loading reviews..." : `${list.length} feedback entr${list.length === 1 ? "y" : "ies"}`}
            </p>
            <Link
              to="/give-feedback"
              className="inline-flex items-center rounded-lg bg-[#fc8019] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#ea7310]"
            >
              Write Feedback
            </Link>
          </div>
        </div>

        {(user || token) && (
          <section>
            <h2 className="mb-4 text-lg font-bold text-[#282C3F]">All Feedback</h2>
            {loadingList ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#fc8019]" />
              </div>
            ) : list.length === 0 ? (
              <div className="rounded-2xl border border-[#eceef4] bg-white p-8 text-center text-sm text-[#7E808C]">
                No feedback yet.
              </div>
            ) : (
              <ul className="space-y-4">
                {list.map((item) => (
                  <li
                    key={item._id}
                    className="rounded-2xl border border-[#eceef4] bg-white p-5 shadow-[0_16px_36px_-30px_rgba(40,44,63,0.55)] transition-all duration-300 hover:border-[#fc8019]/30 hover:shadow-[0_20px_42px_-30px_rgba(252,128,25,0.35)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold text-[#282C3F]">
                          {item.name ||
                            (item.userId
                              ? [item.userId.firstName, item.userId.lastName].filter(Boolean).join(" ")
                              : "") ||
                            "Anonymous"}
                        </span>
                        {item.rating > 0 && (
                          <span className="flex gap-0.5 rounded-full border border-[#ffe4cf] bg-[#fff7ef] px-2 py-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < item.rating
                                    ? "fill-[#fc8019] text-[#fc8019]"
                                    : "text-[#e9e9eb]"
                                }`}
                              />
                            ))}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-[#7E808C]">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    {item.email && (
                      <p className="mt-1 text-xs text-[#7E808C]">{item.email}</p>
                    )}
                    <p className="mt-3 rounded-xl bg-[#f9fafd] px-3.5 py-3 text-sm leading-relaxed text-[#3d4152]">
                      {item.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {!user && !token && (
          <p className="py-8 text-center text-sm text-[#7E808C]">
            <Link to="/login" className="font-semibold text-[#fc8019] hover:underline">
              Log in
            </Link>{" "}
            to view all submitted feedback.
          </p>
        )}
      </div>
    </main>
  );
}
