import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/redux/cartSlice";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import RelatedProductsMarquee from "@/components/products/RelatedProductsMarquee";

const API_BASE = "";
const PLACEHOLDER_IMG = "https://placehold.co/600x600?text=Product";

const pageShell = "min-h-screen bg-[#f8f8f8] pt-24 pb-16";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(PLACEHOLDER_IMG);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${API_BASE}/api/products/${productId}`)
      .then((res) => {
        if (res.data?.product) setProduct(res.data.product);
        else setProduct(null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    const images = product?.productImage?.map((img) => img?.url).filter(Boolean) || [];
    setSelectedImage(images[0] || product?.imageUrl || PLACEHOLDER_IMG);
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    const name = product.productName || product.name;
    const price = product.productPrice ?? product.price;
    const image =
      product.productImage?.[0]?.url || product.imageUrl || PLACEHOLDER_IMG;
    dispatch(
      addToCart({
        productId: product._id,
        name,
        price,
        image,
        quantity,
      })
    );
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <main className={pageShell}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid min-h-[400px] grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-[#e9e9eb]" />
            <div className="flex flex-col gap-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-white" />
              <div className="h-6 w-1/4 animate-pulse rounded bg-white" />
              <div className="h-4 w-full animate-pulse rounded bg-white" />
              <div className="h-4 w-full animate-pulse rounded bg-white" />
              <div className="mt-4 h-12 w-1/3 animate-pulse rounded bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className={pageShell}>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#282C3F]">Product not found</h1>
          <p className="mt-2 text-[#7E808C]">
            The product you&apos;re looking for doesn&apos;t exist or was removed.
          </p>
          <Button asChild className="mt-6 bg-[#fc8019] hover:bg-[#ea7310]">
            <Link to="/products">Back to products</Link>
          </Button>
        </div>
      </main>
    );
  }

  const name = product.productName || product.name;
  const description = product.productDesc || product.description || "";
  const price = product.productPrice ?? product.price;
  const category = product.category || "—";
  const imageUrls = product.productImage?.map((img) => img?.url).filter(Boolean) || [];
  const activeImage = selectedImage || imageUrls[0] || product.imageUrl || PLACEHOLDER_IMG;
  const rating = product.rating ?? 4.5;

  return (
    <main className={pageShell}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6 -ml-2 text-[#7E808C] hover:bg-[#fff5f0] hover:text-[#282C3F]"
        >
          <Link to="/products">
            <ArrowLeft className="mr-2 size-4" />
            Back to products
          </Link>
        </Button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl border border-[#e9e9eb] bg-white shadow-sm">
              <img
                src={activeImage}
                alt={name}
                className="aspect-square w-full object-cover"
              />
            </div>
            {imageUrls.length > 1 ? (
              <div className="grid grid-cols-4 gap-2">
                {imageUrls.map((url, idx) => (
                  <button
                    key={`${url}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImage(url)}
                    className={`overflow-hidden rounded-xl border-2 bg-white transition ${
                      activeImage === url
                        ? "border-[#fc8019] ring-2 ring-[#fc8019]/25"
                        : "border-[#e9e9eb] hover:border-[#fc8019]/50"
                    }`}
                    aria-label={`Show product image ${idx + 1}`}
                  >
                    <img src={url} alt={`${name} ${idx + 1}`} className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-[#282C3F] sm:text-3xl">{name}</h1>

            {product.rating != null && (
              <div className="mt-2 flex items-center gap-1 text-[#7E808C]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-5",
                      i <= Math.round(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-[#e9e9eb]"
                    )}
                  />
                ))}
                <span className="ml-2 text-sm text-[#282C3F]">{rating}</span>
              </div>
            )}

            <p className="mt-4 text-3xl font-bold text-[#fc8019]">
              ₹{Number(price).toLocaleString()}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="text-[#7E808C]">Category:</span>
              <span className="font-medium text-[#282C3F]">{category}</span>
            </div>

            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span className="text-[#7E808C]">Availability:</span>
              <span className="font-medium text-emerald-600">In Stock</span>
            </div>

            <p className="mt-6 leading-relaxed text-[#3d4152]">
              {description || "No description available."}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-lg border border-[#e9e9eb] bg-white p-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-md text-[#282C3F]"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </Button>
                <span className="min-w-[2.5rem] text-center font-medium tabular-nums text-[#282C3F]">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-md text-[#282C3F]"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-xl bg-[#fc8019] px-6 font-semibold text-white shadow-md shadow-[#fc8019]/20 hover:bg-[#ea7310]"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 size-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-[#fc8019] bg-white text-[#fc8019] hover:bg-[#fff5f0]"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedProductsMarquee excludeProductId={product._id} />
    </main>
  );
}
