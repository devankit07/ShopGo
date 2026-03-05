import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import AddToCartModal from "./AddToCartModal";

const PLACEHOLDER_IMG = "https://placehold.co/400x300?text=Product";

export default function ProductCard({ product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const name = product.productName || product.name;
  const description = product.productDesc || product.description || "";
  const price = product.productPrice ?? product.price;
  const imageUrl =
    product.productImage?.[0]?.url || product.imageUrl || PLACEHOLDER_IMG;

  return (
    <>
      <Card
        className={cn(
          "group overflow-hidden rounded-2xl border border-border bg-card shadow-md",
          "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-semibold text-foreground">{name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <p className="mt-auto text-lg font-bold text-[#FF3F6C]">
            ₹{Number(price).toLocaleString()}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={() => setModalOpen(true)}
            className="w-full rounded-xl bg-[#FF3F6C] font-semibold text-white hover:bg-[#e0355f]"
          >
            <ShoppingCart className="mr-2 size-4" />
            Add To Cart
          </Button>
        </CardFooter>
      </Card>

      <AddToCartModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          _id: product._id,
          productId: product._id,
          name,
          price,
          image: imageUrl,
        }}
      />
    </>
  );
}
