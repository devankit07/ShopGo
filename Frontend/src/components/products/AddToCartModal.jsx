import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAccessToken } from "@/lib/authStorage";

const PLACEHOLDER_IMG = "https://placehold.co/400x300?text=Product";

export default function AddToCartModal({ open, onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setIsClosing(false);
    }
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleAdd = () => {
    if (!product) return;
    if (!getAccessToken()) {
      toast.info("Please login to add items to cart.");
      handleClose();
      navigate("/login", { replace: true });
      return;
    }
    dispatch(
      addToCart({
        productId: product._id || product.productId,
        name: product.name,
        price: product.price,
        image: product.image || PLACEHOLDER_IMG,
        quantity,
      })
    );
    handleClose();
  };

  if (!open) return null;

  const imageUrl = product?.image || PLACEHOLDER_IMG;
  const name = product?.name || "";
  const price = product?.price ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-cart-title"
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          isClosing ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />
      <div
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl bg-card shadow-xl",
          "transition-all duration-200 ease-out",
          isClosing
            ? "scale-95 opacity-0"
            : "scale-100 opacity-100"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="h-48 w-full shrink-0 bg-muted sm:h-52 sm:w-40">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-5">
            <h2 id="add-to-cart-title" className="text-lg font-semibold text-foreground">
              {name}
            </h2>
            <p className="text-[#FC8019] font-bold">₹{Number(price).toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-md"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-[2rem] text-center font-medium tabular-nums">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-md"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-border p-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl bg-[#FC8019] text-white hover:bg-[#ea7310]"
            onClick={handleAdd}
          >
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
