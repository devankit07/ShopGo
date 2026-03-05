import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { adminApi } from "@/lib/adminApi";
import { Loader2 } from "lucide-react";

export default function SalesAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then((res) => {
        if (res.data.success) setData(res.data);
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

  const { monthlySales, monthlyOrders, profitLossByMonth, summary } = data || {};
  const salesData = (monthlySales || []).map((m) => ({ name: `${m.month} ${m.year}`, sales: m.sales }));
  const ordersData = (monthlyOrders || []).map((m) => ({ name: `${m.month} ${m.year}`, orders: m.orders }));
  const profitData = (profitLossByMonth || []).map((m) => ({
    name: `${m.month} ${m.year}`,
    profit: m.profit,
    revenue: m.revenue,
    loss: m.profit < 0 ? Math.abs(m.profit) : 0,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#3E4152]">Sales Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Charts and summary</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-md rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-bold text-[#3E4152]">₹{(summary?.totalRevenue ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Profit</p>
            <p className="text-xl font-bold text-emerald-600">₹{(summary?.totalProfit ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Loss</p>
            <p className="text-xl font-bold text-red-600">₹{(summary?.totalLoss ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#3E4152] mb-4">Monthly Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Sales"]} />
                <Bar dataKey="sales" fill="#FF3F6C" radius={[4, 4, 0, 0]} name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#3E4152] mb-4">Monthly Orders</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#3E4152] mb-4">Profit vs Loss (by month)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Value"]} />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="revenue" stroke="#FF3F6C" strokeWidth={2} name="Revenue" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Loss" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
