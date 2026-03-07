import { useState } from "react";
import { Link } from "react-router-dom";
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
  const productId = product._id;

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  return (
    <>
      <Link to={`/product/${productId}`} className="block">
        <Card
          className={cn(
            "group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-md",
            "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
          )}
        >
          <div className="relative aspect-[3/2] overflow-hidden bg-muted">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            />
          </div>
          <CardContent className="flex flex-col">
            <h3 className="line-clamp-1 font-semibold text-foreground text-sm leading-tight">{name}</h3>
            <p className="line-clamp-1 text-xs text-muted-foreground leading-tight">
              {description}
            </p>
            <p className="text-sm font-bold leading-tight text-[#FF3F6C]">
              ₹{Number(price).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter className="p-2 pt-1" onClick={(e) => e.preventDefault()}>
            <Button
              size="sm"
              onClick={handleAddToCartClick}
              className="h-7 w-full rounded-lg bg-[#FF3F6C] text-xs font-semibold text-white hover:bg-[#e0355f]"
            >
              <ShoppingCart className="mr-1.5 size-3.5" />
              Add To Cart
            </Button>
          </CardFooter>
        </Card>
      </Link>

      <AddToCartModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={{
          _id: productId,
          productId,
          name,
          price,
          image: imageUrl,
        }}
      />
    </>
  );
}
