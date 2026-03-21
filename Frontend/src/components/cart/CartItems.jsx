import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CartItems({ items, onDecrease, onIncrease, onRemove }) {
  return (
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
            <p className="font-bold text-[#FC8019]">
              ₹{Number(item.price).toLocaleString()} × {item.quantity}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => onDecrease(item.productId)}
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
              onClick={() => onIncrease(item.productId)}
              aria-label="Increase"
            >
              <Plus className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:bg-destructive/10"
              onClick={() => onRemove(item.productId)}
              aria-label="Remove"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
