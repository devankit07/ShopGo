import React, { useState, useEffect } from "react";
import { Package, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import OrderTable from "./OrderTable";
import OrderCard from "./OrderCard";
import axios from "axios";

const API_BASE = "/api/v1";

const summaryCards = [
  { key: "total", label: "Total Orders", desc: "Orders placed", icon: Package, color: "bg-[#FC8019]/10 text-[#FC8019]" },
  { key: "pending", label: "Order", desc: "Pending / in progress", icon: Clock, color: "bg-amber-100 text-amber-700" },
  { key: "cancelled", label: "Cancelled", desc: "Cancelled orders", icon: XCircle, color: "bg-red-100 text-red-700" },
  { key: "delivered", label: "Delivered", desc: "Successfully delivered", icon: CheckCircle, color: "bg-emerald-100 text-emerald-700" },
];

export default function OrdersSection({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API_BASE}/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load orders");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => ["Pending", "Processing", "Shipped"].includes(o.orderStatus)).length,
    delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[#FC8019]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">My Orders</h2>
        <p className="text-gray-300 text-sm">View and track your order history.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ key, label, desc, icon: Icon, color }) => (
          <Card key={key} className="border-none shadow-md rounded-2xl bg-white/90 overflow-hidden">
            <CardContent className="p-5">
              <div className={`inline-flex p-2 rounded-xl mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-[#3E4152]">{stats[key] ?? 0}</p>
              <p className="text-sm font-medium text-[#3E4152]">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stats[key] ?? 0} {desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="hidden md:block">
        <OrderTable orders={orders} />
      </div>
      <div className="md:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white/90 shadow-sm p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Your order history will appear here.</p>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
}
