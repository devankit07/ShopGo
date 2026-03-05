import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  selectCartItems,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

const API_BASE = "http://localhost:8000/api/v1";

export default function Cart() {
  const items = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = async () => {
    const token = localStorage.getItem("accesstoken");
    if (!token) {
      toast.error("Please login to place order");
      navigate("/login");
      return;
    }
    if (items.length === 0) return;
    setPlacing(true);
    try {
      const products = items.map((i) => ({
        productId: i.productId,
        productName: i.name,
        productImage: i.image,
        quantity: i.quantity,
        price: i.price,
      }));
      const res = await axios.post(
        `${API_BASE}/orders`,
        { products, totalAmount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        items.forEach((i) => dispatch(removeFromCart(i.productId)));
        toast.success("Order placed successfully");
        const uid = res.data.order?.userId?._id ?? res.data.order?.userId;
        if (uid) navigate("/profile/" + uid);
        else navigate("/products");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">
            Add items from the Products page.
          </p>
          <Button asChild className="mt-6 bg-[#FF3F6C] hover:bg-[#e0355f]">
            <Link to="/products">Browse products</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-8 text-2xl font-bold text-foreground">Cart</h1>
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.productId}
              className={cn(
                "flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm",
                "sm:flex-row sm:items-center"
              )}
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-[#FF3F6C] font-bold">
                  ₹{Number(item.price).toLocaleString()} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => dispatch(decreaseQuantity(item.productId))}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-[2rem] text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  onClick={() => dispatch(increaseQuantity(item.productId))}
                  aria-label="Increase"
                >
                  <Plus className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:bg-destructive/10"
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  aria-label="Remove"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col items-end gap-4 border-t border-border pt-6">
          <p className="text-xl font-bold text-foreground">
            Total: ₹{total.toLocaleString()}
          </p>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/products">Continue shopping</Link>
            </Button>
            <Button
              className="bg-[#FF3F6C] hover:bg-[#e0355f]"
              onClick={placeOrder}
              disabled={placing}
            >
              {placing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
