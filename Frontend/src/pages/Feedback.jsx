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
    <main className="dark min-h-screen bg-[#262a30] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Feedback</h1>
            <p className="text-sm text-gray-400">View all submitted feedback</p>
          </div>
        </div>

        {(user || token) && (
          <section>
            <h2 className="text-lg font-bold text-white mb-4">All Feedback</h2>
            {loadingList ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
              </div>
            ) : list.length === 0 ? (
              <p className="text-gray-400 text-sm py-6">No feedback yet.</p>
            ) : (
              <ul className="space-y-4">
                {list.map((item) => (
                  <li
                    key={item._id}
                    className="rounded-xl bg-[#2d3136] border border-white/10 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-white font-medium">
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
                                className={`w-4 h-4 ${
                                  i < item.rating
                                    ? "fill-teal-400 text-teal-400"
                                    : "text-gray-600"
                                }`}
                              />
                            ))}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    {item.email && (
                      <p className="text-xs text-gray-500 mt-1">{item.email}</p>
                    )}
                    <p className="text-gray-300 text-sm mt-2">{item.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {!user && !token && (
          <p className="text-center text-sm text-gray-500 py-8">
            <Link to="/login" className="text-teal-400 hover:underline">
              Log in
            </Link>{" "}
            to view all submitted feedback.
          </p>
        )}
      </div>
    </main>
  );
}
