import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getLogs()
      .then((res) => {
        if (res.data.success) setLogs(res.data.logs || []);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF3F6C]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#3E4152]">Admin Action Log</h1>
        <p className="text-gray-500 text-sm mt-1">Recent admin actions</p>
      </div>
      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Date</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Action</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Details</th>
                  <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Admin</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#3E4152]">{log.action}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.details || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.adminId?.firstName} {log.adminId?.lastName} ({log.adminId?.email})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
            <div className="p-12 text-center text-gray-500">No logs yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
