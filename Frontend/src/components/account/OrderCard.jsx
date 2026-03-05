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

function getFirstProduct(order) {
  const products = order.products || [];
  if (products.length === 0)
    return { productName: "—", productImage: "", quantity: 0 };
  const first = products[0];
  const totalQty = products.reduce((s, p) => s + (p.quantity || 0), 0);
  return {
    productName: first.productName,
    productImage: first.productImage || "",
    quantity: totalQty,
    more: products.length > 1,
  };
}

export default function OrderCard({ order }) {
  const [showModal, setShowModal] = useState(false);
  const first = getFirstProduct(order);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex gap-4 p-4">
          {first.productImage ? (
            <img
              src={first.productImage}
              alt={first.productName}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-gray-500">#{order._id?.slice(-8).toUpperCase()}</p>
            <p className="font-medium text-[#3E4152] truncate">{first.productName}{first.more ? " + more" : ""}</p>
            <p className="text-sm text-gray-500 mt-0.5">Qty: {first.quantity} · ₹{(order.totalAmount ?? 0).toFixed(2)}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                {order.orderStatus || "Pending"}
              </span>
              <span className="text-xs text-gray-500">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-[#FF3F6C] border-[#FF3F6C]/30 hover:bg-[#FF3F6C]/10 hover:text-[#FF3F6C]"
              onClick={() => setShowModal(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </div>
      {showModal && (
        <OrderDetailsModal order={order} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
