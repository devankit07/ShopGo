import React from "react";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const address = order.shippingAddress || {};
  const addressStr = [address.street, address.city, address.state, address.zipCode, address.country]
    .filter(Boolean)
    .join(", ") || "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <Card
        className="w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border-none bg-white rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-bold text-[#3E4152]">
            Order #{order._id?.slice(-8).toUpperCase()}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-80px)] space-y-6 pt-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Products</p>
            <ul className="space-y-3">
              {(order.products || []).map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#3E4152] truncate">{item.productName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-semibold text-[#3E4152]">₹{(item.quantity * item.price).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end text-lg font-bold text-[#3E4152]">
            Total: ₹{(order.totalAmount ?? 0).toFixed(2)}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 mb-0.5">Order Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                {order.orderStatus || "Pending"}
              </span>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">Payment Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || "bg-gray-100 text-gray-800"}`}>
                {order.paymentStatus || "Pending"}
              </span>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">Payment Method</p>
              <p className="font-medium text-[#3E4152]">{order.paymentMethod || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-0.5">Order Date</p>
              <p className="font-medium text-[#3E4152]">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Shipping Address</p>
            <p className="text-[#3E4152] bg-gray-50 p-3 rounded-xl border border-gray-100">{addressStr}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
