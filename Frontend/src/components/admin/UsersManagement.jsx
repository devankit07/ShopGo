import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);
  const currentUserId = useSelector((state) => state.User?.user?._id);

  const fetchUsers = () => {
    setLoading(true);
    adminApi
      .getUsers()
      .then((res) => {
        if (res.data.success) setUsers(res.data.users || []);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchUsers(), []);

  const handleRole = (id, role) => {
    setActing(id);
    adminApi
      .updateUserRole(id, role)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          fetchUsers();
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed"))
      .finally(() => setActing(null));
  };

  const handleDelete = (id, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    setActing(id);
    adminApi
      .deleteUser(id)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          fetchUsers();
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed"))
      .finally(() => setActing(null));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF3F6C]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#3E4152]">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage users</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">User ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Role</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Orders Count</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{u._id?.slice(-8)}</td>
                  <td className="px-4 py-3 text-sm text-[#3E4152]">{[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}</td>
                  <td className="px-4 py-3 text-sm text-[#3E4152]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-[#FF3F6C]/20 text-[#FF3F6C]" : "bg-gray-100 text-gray-700"}`}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#3E4152]">{u.ordersCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {u.role !== "admin" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#FF3F6C] border-[#FF3F6C]/30"
                          disabled={acting === u._id || u._id === currentUserId}
                          onClick={() => handleRole(u._id, "admin")}
                        >
                          {acting === u._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4 mr-1" />}
                          Make Admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-600 border-amber-200"
                          disabled={acting === u._id || u._id === currentUserId}
                          onClick={() => handleRole(u._id, "user")}
                        >
                          {acting === u._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff className="w-4 h-4 mr-1" />}
                          Remove Admin
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        disabled={acting === u._id || u._id === currentUserId}
                        onClick={() => handleDelete(u._id, u.email)}
                      >
                        {acting === u._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}
