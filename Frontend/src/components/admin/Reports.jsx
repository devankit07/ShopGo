import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi
      .getReports()
      .then((res) => {
        if (res.data.success) setData(res.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    if (!data) return;
    const rows = [
      ["Report", "Value"],
      ["Total Orders", data.totalSalesReport?.totalOrders ?? 0],
      ["Total Revenue", data.totalSalesReport?.totalRevenue ?? 0],
      ["Total Profit", data.profitLossReport?.totalProfit ?? 0],
      ["Total Loss", data.profitLossReport?.totalLoss ?? 0],
      [],
      ["Top Selling Products", "Quantity"],
      ...(data.topSellingProducts || []).map((p) => [p.productName, p.quantity]),
      [],
      ["Most Active Users", "Email", "Order Count"],
      ...(data.mostActiveUsers || []).map((u) => [u.email, u.orderCount]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shopgo-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const sales = data?.totalSalesReport || {};
  const profitLoss = data?.profitLossReport || {};
  const topProducts = data?.topSellingProducts || [];
  const activeUsers = data?.mostActiveUsers || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#3E4152]">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Sales, profit/loss, top products, active users</p>
        </div>
        <Button variant="outline" onClick={downloadCSV} className="gap-2">
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Sales Report</p>
            <p className="text-xl font-bold text-[#3E4152]">Orders: {sales.totalOrders ?? 0}</p>
            <p className="text-sm text-gray-600">Revenue: ₹{(sales.totalRevenue ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Profit / Loss Report</p>
            <p className="text-xl font-bold text-emerald-600">Profit: ₹{(profitLoss.totalProfit ?? 0).toLocaleString()}</p>
            <p className="text-sm text-red-600">Loss: ₹{(profitLoss.totalLoss ?? 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#3E4152] mb-4">Top Selling Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-sm font-semibold text-gray-600">Product</th>
                  <th className="pb-2 text-sm font-semibold text-gray-600">Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-[#3E4152]">{p.productName}</td>
                    <td className="py-2 text-sm font-medium">{p.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topProducts.length === 0 && <p className="text-gray-500 py-4 text-sm">No data yet.</p>}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#3E4152] mb-4">Most Active Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-sm font-semibold text-gray-600">Name</th>
                  <th className="pb-2 text-sm font-semibold text-gray-600">Email</th>
                  <th className="pb-2 text-sm font-semibold text-gray-600">Order Count</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map((u) => (
                  <tr key={u._id} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-[#3E4152]">{[u.firstName, u.lastName].filter(Boolean).join(" ")}</td>
                    <td className="py-2 text-sm text-gray-600">{u.email}</td>
                    <td className="py-2 text-sm font-medium">{u.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {activeUsers.length === 0 && <p className="text-gray-500 py-4 text-sm">No data yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
