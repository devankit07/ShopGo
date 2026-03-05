import React, { useState, useEffect } from "react";
import { adminApi } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";

const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const statusColors = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-indigo-100 text-indigo-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-800",
};
const paymentColors = {
  Pending: "bg-amber-100 text-amber-800",
  Paid: "bg-emerald-100 text-emerald-800",
  Failed: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
};

function getFirstProduct(order) {
  const products = order.products || [];
  if (products.length === 0) return { productName: "—" };
  const first = products[0];
  return { productName: products.length > 1 ? `${first.productName} +${products.length - 1} more` : first.productName };
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    adminApi
      .getOrders()
      .then((res) => {
        if (res.data.success) setOrders(res.data.orders || []);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchOrders(), []);

  const handleStatusChange = (orderId, orderStatus) => {
    setUpdating(orderId);
    adminApi
      .updateOrderStatus(orderId, orderStatus)
      .then((res) => {
        if (res.data.success) {
          toast.success("Order status updated");
          fetchOrders();
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed"))
      .finally(() => setUpdating(null));
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
        <h1 className="text-2xl font-bold text-[#3E4152]">Order Management</h1>
        <p className="text-gray-500 text-sm mt-1">Update order status</p>
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
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Order ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">User Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Product</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Total Amount</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Payment Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Order Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const user = order.userId;
                const name = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "—";
                const first = getFirstProduct(order);
                return (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">#{order._id?.slice(-8)}</td>
                    <td className="px-4 py-3 text-sm text-[#3E4152]">{name}</td>
                    <td className="px-4 py-3 text-sm text-[#3E4152] truncate max-w-[160px]">{first.productName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#3E4152]">₹{(order.totalAmount ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || "bg-gray-100"}`}>
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100"}`}>
                        {order.orderStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm bg-white min-w-[120px]"
                        value={order.orderStatus || "Pending"}
                        disabled={updating === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updating === order._id && <Loader2 className="inline w-4 h-4 ml-1 animate-spin" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
            <Package className="w-12 h-12 text-gray-300" />
            No orders yet.
          </div>
        )}
      </div>
    </div>
  );
}
