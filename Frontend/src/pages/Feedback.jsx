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
    <main className="min-h-screen bg-[#f8f8f8] pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#fc8019]/35 bg-[#fff5f0] text-[#fc8019]">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#282C3F]">Customer Feedback</h1>
            <p className="text-sm text-[#7E808C]">View all submitted feedback</p>
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
              <p className="py-6 text-sm text-[#7E808C]">No feedback yet.</p>
            ) : (
              <ul className="space-y-4">
                {list.map((item) => (
                  <li
                    key={item._id}
                    className="rounded-xl border border-[#e9e9eb] bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-[#282C3F]">
                          {item.name ||
                            (item.userId
                              ? [item.userId.firstName, item.userId.lastName].filter(Boolean).join(" ")
                              : "") ||
                            "Anonymous"}
                        </span>
                        {item.rating > 0 && (
                          <span className="flex gap-0.5">
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
                    <p className="mt-2 text-sm leading-relaxed text-[#3d4152]">{item.message}</p>
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
