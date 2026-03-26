import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { adminApi } from "@/lib/adminApi";
import { PRODUCT_CATEGORIES, FASHION_SIZES } from "@/components/products/productCategories";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAccessToken } from "@/lib/authStorage";

const STATIC_CATEGORIES = PRODUCT_CATEGORIES.filter((c) => c !== "All");
const PAGE_SIZE = 6;

const API_BASE = "/api/admin";

function getAuthHeaders() {
  const token = getAccessToken();
  return { Authorization: token ? `Bearer ${token}` : "" };
}

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);
  const [modal, setModal] = useState(null); // "add" | { type: "edit", product }
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    adminApi
      .getProducts({ limit: 1000 })
      .then((res) => {
        const list = res.data?.product ?? res.data?.products ?? [];
        setProducts(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchProducts(), []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((p) =>
    (p.productName || "").toLowerCase().includes(normalizedSearch)
  );

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
          className="bg-[#FC8019] hover:bg-[#ea7310]"
          onClick={() => setModal("add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="max-w-md">
        <Label htmlFor="admin-product-search">Search by product name</Label>
        <Input
          id="admin-product-search"
          className="mt-1"
          placeholder="Type product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#FC8019]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedProducts.map((p) => (
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
                      className="flex-1 text-[#FC8019] border-[#FC8019]/30"
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

          {filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 py-14 text-center text-gray-500">
              {products.length === 0 ? "No products found." : "No products match your search."}
            </div>
          ) : null}

          {filteredProducts.length > PAGE_SIZE ? (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  type="button"
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  className={currentPage === page ? "bg-[#FC8019] hover:bg-[#ea7310]" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : null}
        </>
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
  const [dbCategories, setDbCategories] = useState([]);
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [form, setForm] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    category: "",
    brand: "",
    size: "",
  });
  const [files, setFiles] = useState([]);
  const existingImageCount = editProduct?.productImage?.length || 0;
  const fileInputRef = useRef(null);

  const mergedCategoryOptions = useMemo(
    () =>
      [...new Set([...STATIC_CATEGORIES, ...dbCategories])].sort((a, b) =>
        a.localeCompare(b)
      ),
    [dbCategories]
  );

  useEffect(() => {
    if (!modal) return;
    axios
      .get("/api/products/categories")
      .then((res) => {
        setDbCategories(Array.isArray(res.data?.categories) ? res.data.categories : []);
      })
      .catch(() => setDbCategories([]));
  }, [modal]);

  useEffect(() => {
    if (!modal) return;
    setFiles([]);
    setUseNewCategory(false);
    setNewCategoryName("");
    if (isAdd) {
      setForm({
        productName: "",
        productDesc: "",
        productPrice: "",
        category: "",
        brand: "",
        size: "",
      });
    } else if (editProduct) {
      setForm({
        productName: editProduct.productName ?? "",
        productDesc: editProduct.productDesc ?? "",
        productPrice: editProduct.productPrice ?? "",
        category: editProduct.category ?? "",
        brand: editProduct.brand ?? "",
        size: editProduct.size ?? "",
      });
    }
  }, [modal, isAdd, editProduct?._id]);

  useEffect(() => {
    if (!modal || isAdd || !editProduct) return;
    const merged = [...new Set([...STATIC_CATEGORIES, ...dbCategories])];
    const cat = editProduct.category || "";
    if (cat && !merged.includes(cat)) {
      setUseNewCategory(true);
      setNewCategoryName(cat);
    } else {
      setUseNewCategory(false);
      setNewCategoryName("");
    }
  }, [modal, isAdd, editProduct?._id, dbCategories, editProduct]);

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    setFiles((prev) => {
      const next = [...prev];
      selectedFiles.forEach((file) => {
        const exists = next.some(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        );
        if (!exists) next.push(file);
      });
      return next;
    });

    // Allow selecting more files again.
    e.target.value = "";
  };

  const removeSelectedFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;

    const categoryValue = useNewCategory
      ? newCategoryName.trim()
      : form.category.trim();
    if (!categoryValue) {
      toast.error("Please select a category or enter a new one.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("productDesc", form.productDesc);
    formData.append("productPrice", form.productPrice);
    formData.append("category", categoryValue);
    formData.append("brand", form.brand);
    formData.append("size", categoryValue === "Fashion" ? (form.size || "") : "");
    files.forEach((file) => formData.append("files", file));
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
              <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[#3E4152]">
                <input
                  type="checkbox"
                  checked={useNewCategory}
                  onChange={(e) => {
                    const on = e.target.checked;
                    setUseNewCategory(on);
                    if (on) setNewCategoryName("");
                    else setNewCategoryName("");
                  }}
                  className="rounded border-gray-300"
                />
                Add new category
              </label>
              {useNewCategory ? (
                <>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Sports, Beauty, Books…"
                    className="mt-2"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Appears in the shop filters like built-in categories after you save.
                  </p>
                </>
              ) : (
                <select
                  value={form.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setForm((f) => ({
                      ...f,
                      category: cat,
                      size: cat === "Fashion" ? f.size : "",
                    }));
                  }}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {mergedCategoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <Label>Brand</Label>
              <Input
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">Optional</p>
            </div>
            {(useNewCategory
              ? newCategoryName.trim() === "Fashion"
              : form.category === "Fashion") && (
              <div>
                <Label>Size</Label>
                <select
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select size (optional)</option>
                  {FASHION_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label>Images {!isAdd && "(optional, add new)"}</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFilesChange}
              />
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {files.length ? "Add More Images" : "Choose Images"}
                </Button>
                {files.length ? (
                  <Button type="button" variant="ghost" onClick={() => setFiles([])}>
                    Clear
                  </Button>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {isAdd
                  ? "Images are optional. You can add as many as you want."
                  : `Current product has ${existingImageCount} image${existingImageCount === 1 ? "" : "s"}. Add more if needed.`}
              </p>
              {files.length ? (
                <>
                  <p className="mt-1 text-xs text-[#3E4152]">
                    {files.length} new image{files.length > 1 ? "s" : ""} selected
                  </p>
                  <div className="mt-2 max-h-24 overflow-auto rounded-md border border-gray-200 p-2 space-y-1">
                    {files.map((file, idx) => (
                      <div key={`${file.name}-${file.lastModified}-${idx}`} className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate text-gray-600">{file.name}</span>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeSelectedFile(idx)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#FC8019] hover:bg-[#ea7310]" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isAdd ? "Add" : "Update"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
