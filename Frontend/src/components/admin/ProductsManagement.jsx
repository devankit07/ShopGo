import React, { useState, useEffect } from "react";
import axios from "axios";
import { adminApi } from "@/lib/adminApi";
import { PRODUCT_CATEGORIES } from "@/components/products/ProductFilter";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_CATEGORIES = PRODUCT_CATEGORIES.filter((c) => c !== "All");

const API_BASE = "http://localhost:8000/api/admin";

function getAuthHeaders() {
  const token = localStorage.getItem("accesstoken");
  return { Authorization: token ? `Bearer ${token}` : "" };
}

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);
  const [modal, setModal] = useState(null); // "add" | { type: "edit", product }

  const fetchProducts = () => {
    setLoading(true);
    adminApi
      .getProducts()
      .then((res) => {
        const list = res.data?.product ?? res.data?.products ?? [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchProducts(), []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setActing(id);
    adminApi
      .deleteProduct(id)
      .then((res) => {
        if (res.data?.scuccess !== false && res.data?.success !== false) {
          toast.success("Product deleted");
          fetchProducts();
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed"))
      .finally(() => setActing(null));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#3E4152]">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, delete products</p>
        </div>
        <Button
          className="bg-[#FF3F6C] hover:bg-[#e0355f]"
          onClick={() => setModal("add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF3F6C]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card key={p._id} className="border-none shadow-md rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {p.productImage?.[0]?.url ? (
                  <img src={p.productImage[0].url} alt={p.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Plus className="w-12 h-12" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#3E4152] truncate">{p.productName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">₹{Number(p.productPrice || 0).toLocaleString()} · {p.category || "—"}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-[#FF3F6C] border-[#FF3F6C]/30"
                    onClick={() => setModal({ type: "edit", product: p })}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    disabled={acting === p._id}
                    onClick={() => handleDelete(p._id)}
                  >
                    {acting === p._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <ProductFormModal
          modal={modal}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            fetchProducts();
            toast.success(modal === "add" ? "Product added" : "Product updated");
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ modal, onClose, onSuccess }) {
  const isAdd = modal === "add";
  const editProduct = modal?.type === "edit" ? modal.product : null;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    productName: editProduct?.productName ?? "",
    productDesc: editProduct?.productDesc ?? "",
    productPrice: editProduct?.productPrice ?? "",
    category: editProduct?.category ?? "",
    brand: editProduct?.brand ?? "",
  });
  const [files, setFiles] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accesstoken");
    if (!token) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("productDesc", form.productDesc);
    formData.append("productPrice", form.productPrice);
    formData.append("category", form.category);
    formData.append("brand", form.brand);
    if (files?.length) {
      for (let i = 0; i < files.length; i++) formData.append("files", files[i]);
    }
    if (editProduct?.productImage?.length) {
      formData.append("existingImages", JSON.stringify(editProduct.productImage.map((i) => i.public_id)));
    }

    const url = isAdd ? `${API_BASE}/products` : `${API_BASE}/products/${editProduct._id}`;
    const method = isAdd ? "post" : "put";
    axios[method](url, formData, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.data?.scuccess !== false && res.data?.success !== false) onSuccess();
      })
      .catch((err) => toast.error(err.response?.data?.message || "Failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-md shadow-xl rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#3E4152]">{isAdd ? "Add Product" : "Edit Product"}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                value={form.productName}
                onChange={(e) => setForm((f) => ({ ...f, productName: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={form.productDesc}
                onChange={(e) => setForm((f) => ({ ...f, productDesc: e.target.value }))}
                required
                className="mt-1 w-full min-h-[80px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                value={form.productPrice}
                onChange={(e) => setForm((f) => ({ ...f, productPrice: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Select category</option>
                {ADMIN_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Brand</Label>
              <Input
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label>Images {!isAdd && "(optional, add new)"}</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                className="mt-1"
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#FF3F6C] hover:bg-[#e0355f]" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isAdd ? "Add" : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
