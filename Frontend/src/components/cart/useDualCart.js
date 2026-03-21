import { useContext } from "react";
import { DualCartContext } from "./dualCartContext";

export function useDualCart() {
  const ctx = useContext(DualCartContext);
  if (!ctx) {
    throw new Error("useDualCart must be used within DualCartProvider");
  }
  return ctx;
}
