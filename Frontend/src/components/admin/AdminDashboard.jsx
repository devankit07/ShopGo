import React, { useState, useEffect } from "react";
import { Users, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { adminApi } from "@/lib/adminApi";
import { Loader2 } from "lucide-react";

const cards = [
  { key: "totalUsers", label: "Total Users", desc: "Registered users", icon: Users, color: "bg-blue-500" },
  { key: "totalProducts", label: "Total Products", desc: "Products in catalog", icon: Package, color: "bg-emerald-500" },
  { key: "totalOrders", label: "Total Orders", desc: "Orders placed", icon: ShoppingBag, color: "bg-amber-500" },
  { key: "totalSales", label: "Total Sales", desc: "Number of transactions", icon: TrendingUp, color: "bg-indigo-500" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((res) => {
        if (res.data.success) setStats(res.data.stats);
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
        <h1 className="text-2xl font-bold text-[#3E4152]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your store</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(({ key, label, desc, icon: Icon, color }) => (
          <Card key={key} className="border-none shadow-md rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className={`inline-flex p-3 rounded-xl ${color} text-white mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-[#3E4152]">
                {stats?.[key] ?? 0}
              </p>
              <p className="font-medium text-[#3E4152]">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
