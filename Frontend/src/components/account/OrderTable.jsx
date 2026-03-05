import React, { useState } from "react";
import { Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderDetailsModal from "./OrderDetailsModal";

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
  if (products.length === 0)
    return { productName: "—", productImage: "", quantity: 0 };
  const first = products[0];
  const totalQty = products.reduce((s, p) => s + (p.quantity || 0), 0);
  return {
    productName: products.length > 1 ? `${first.productName} +${products.length - 1} more` : first.productName,
    productImage: first.productImage || "",
    quantity: totalQty,
  };
}

export default function OrderTable({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!orders?.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white/90 shadow-sm p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No orders yet</p>
        <p className="text-sm text-gray-400 mt-1">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Order ID</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Product</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Quantity</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Total</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Payment</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-[#3E4152]">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const first = getFirstProduct(order);
                return (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm font-mono text-[#3E4152]">
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {first.productImage ? (
                          <img
                            src={first.productImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <span className="text-sm text-[#3E4152] truncate max-w-[120px]">{first.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#3E4152]">{first.quantity}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#3E4152]">₹{(order.totalAmount ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || "bg-gray-100 text-gray-800"}`}>
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                        {order.orderStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#FF3F6C] border-[#FF3F6C]/30 hover:bg-[#FF3F6C]/10"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                          <Button variant="ghost" size="sm" className="text-gray-600" disabled title="Track (coming soon)">
                            Track
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
